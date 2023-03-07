/**
 * Created by Tom on 2018/3/27.
 */


var CreateRoomNode_jinzhonglisi = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_jinzhonglisi_duo                       = "_JIN_ZHONG_DUO";                     //DUO
        this.localStorageKey.KEY_jinzhonglisi_difen                     = "_JIN_ZHONG_DI_FEN";                  //增分
        this.localStorageKey.KEY_jinzhonglisi_count                     = "_JIN_ZHONG_COUNT";                   //人数
        this.localStorageKey.KEY_jinzhonglisi_liupai                    = "_JIN_ZHONG_LIU_PAI";                 //留牌
        this.localStorageKey.KEY_jinzhonglisi_lunzhuang                 = "_JIN_ZHONG_LUN_ZHUANG";              //轮庄
        this.localStorageKey.KEY_jinzhonglisi_guaisanjiao               = "_JIN_ZHONG_GUAI_SAN_JIAO";           //拐三角
        this.localStorageKey.KKEY_jinzhonglisi_gps                      = "_JIN_ZHONG_LISI_GPS";                //防作弊
        this.localStorageKey.KEY_jinzhonglisi_dianpaobaogang            = "_JIN_ZHONG_LISI_dianpaobaogang";     //点炮包杠
        this.localStorageKey.KEY_jinzhonglisi_gangsuihuzou              = "_JIN_ZHONG_LISI_gangsuihuzou";       //杠随胡走
        this.localStorageKey.KEY_jinzhonglisi_longpaihu                 = "_JIN_ZHONG_LISI_LONG_PAI_HU";
        this.localStorageKey.KEY_jinzhonglisi_passhudapai               = "_JIN_ZHONG_LISI_PASS_HU_DA_PAI";     //过胡胡大牌
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_jinzhonglisi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jinzhonglisi");
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
        // this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        // this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        // this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        // var nodeCountList1 = [];
        // nodeCountList1.push(_play.getChildByName("play_count0"));
        // nodeCountList1.push(_play.getChildByName("play_count1"));
        // nodeCountList1.push(_play.getChildByName("play_count2"));
        // this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
        //     this.changePayForPlayerNum(index);
        //     this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        // }.bind(this));
        // this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        // this._countlist = nodeCountList1;


        //留牌
        this._playNode_liupai = _play.getChildByName("play_liupai");
        this.addListenerText(this._playNode_liupai);
        this._playNode_liupai.addEventListener(this.clickCB, this._playNode_liupai);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //拐三角
        // this._playNode_guaisanjiao = _play.getChildByName("play_guaisanjiao");
        // this.addListenerText(this._playNode_guaisanjiao);
        // this._playNode_guaisanjiao.addEventListener(this.clickCB, this._playNode_guaisanjiao);
        this._playNode_guaisanjiao = _play.getChildByName("play_count1");
        this._playNode_4R = _play.getChildByName("play_count0");
        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("play_count1"));
        nodeList1.push(_play.getChildByName("play_count0"));
        this.baoList = nodeList1;
        this._playNode_4R_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_4R_radio);




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

        //点炮包杠
        this._playNode_baogang = _play.getChildByName("play_baogang");
        this.addListenerText(this._playNode_baogang);
        this._playNode_baogang.addEventListener(this.clickCB, this._playNode_baogang);

        //杠suihuzou
        this._playNode_gangsuihuzou = _play.getChildByName("play_gangsuihuzou");
        this.addListenerText(this._playNode_gangsuihuzou);
        this._playNode_gangsuihuzou.addEventListener(this.clickCB, this._playNode_gangsuihuzou);

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


        },
    setPlayNodeCurrentSelect: function(isClub) {


        // 留牌
        var _liupai;
        if (isClub)
            _liupai = this.getBoolItem("liuduo", true);
        else
            _liupai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_liupai, true);
        this._playNode_liupai.setSelected(_liupai);
        var text = this._playNode_liupai.getChildByName("text");
        this.selectedCB(text, _liupai);


        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        // 拐三角
        var _guaisanjiao;
        if (isClub)
            _guaisanjiao = [4, 3].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _guaisanjiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_guaisanjiao, false);
        this._playNode_guaisanjiao.setSelected(_guaisanjiao);
        this._playNode_4R.setSelected(!_guaisanjiao)

        var text = this._playNode_guaisanjiao.getChildByName("text");
        this.selectedCB(text, _guaisanjiao);

        var text = this._playNode_4R.getChildByName("text");
        this.selectedCB(text, !_guaisanjiao);

        //人数
        // var _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhonglisi_count, 0);
        // cc.log("_currentCount renshu  == " + _currentCount);
        // this._playNode_player_count_radio.selectItem(_currentCount);
        // this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhonglisi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;

        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KKEY_jinzhonglisi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //点炮包杠
        var _dianpaobaogang;
        if (isClub)
            _dianpaobaogang = this.getBoolItem("baogang", false);
        else
            _dianpaobaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_dianpaobaogang, false);
        this._playNode_baogang.setSelected(_dianpaobaogang);
        var text = this._playNode_baogang.getChildByName("text");
        this.selectedCB(text, _dianpaobaogang);

        //杠随胡走
        var _gangsuihuzou;
        if (isClub)
            _gangsuihuzou = this.getBoolItem("gangsuihuzou", true);
        else
            _gangsuihuzou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_gangsuihuzou, true);
        this._playNode_gangsuihuzou.setSelected(_gangsuihuzou);
        var text = this._playNode_gangsuihuzou.getChildByName("text");
        this.selectedCB(text, _gangsuihuzou);


        //过胡只能胡龙牌
        var _longpaihu;
        if (isClub)
            _longpaihu = this.getBoolItem("guohuzhinenglongpai", false);
        else
            _longpaihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jinzhonglisi_longpaihu,false);
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


        var that = this;
        this._playNode_guaisanjiao.schedule(function() {
            if(that.customInfo && that.customInfo.isSelected())
            {
                 that._playNode_longpaihu.visible = false;
                 that._playNode_passhudapai.visible = false;
                 return;
            }
            that._playNode_longpaihu.visible = that._playNode_guaisanjiao.isSelected();
            that._playNode_passhudapai.visible = that._playNode_guaisanjiao.isSelected();
        })


        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_LI_SI;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.liuduo = true;
        para.difen = 1;
        para.lunzhuang = true;
        para.guaisanjiao = false;
        para.baogang = true;
        para.gangsuihuzou = true;
        //para.gps = !!this._bGPS.isSelected();
        para.guohuzhinenglongpai = false;
        para.passhudapai = false;

        //默认4人玩
        var _countIdx = 0;


        // 留牌 = 留垛
        para.liuduo = this._playNode_liupai.isSelected();

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        // // 拐三角
        para.guaisanjiao = this._playNode_guaisanjiao.isSelected();
        if(para.guaisanjiao)
        {
            para.maxPlayer = 3;
        }

        //底分默认1
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        // 点炮包杠
        para.baogang = this._playNode_baogang.isSelected();

        // 点炮包杠
        para.gangsuihuzou = this._playNode_gangsuihuzou.isSelected();
	
	if(this._playNode_guaisanjiao.isSelected())
        {
            // 过胡只能胡龙牌
            para.guohuzhinenglongpai = this._playNode_longpaihu.isSelected();
            // 过胡胡大牌
            para.passhudapai = this._playNode_passhudapai.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_longpaihu,  para.guohuzhinenglongpai);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_passhudapai,  para.passhudapai);
            }
        }
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhonglisi_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_liupai, para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_lunzhuang, para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_guaisanjiao, para.guaisanjiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhonglisi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KKEY_jinzhonglisi_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_dianpaobaogang,  para.baogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jinzhonglisi_gangsuihuzou,  para.gangsuihuzou);
        }
        

        cc.log("createara: " + JSON.stringify(para));
        return para;
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
    }
});