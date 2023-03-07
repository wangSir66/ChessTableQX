/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_yunchengtiejin = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_yunchengtiejin_jinnum       = "yunchengtiejin_jinmun";  //DUO
        this.localStorageKey.KEY_yunchengtiejin_difen      = "yunchengtiejin_DI_FEN";     //增分
        this.localStorageKey.KEY_yunchengtiejin_count      = "yunchengtiejin_COUNT"; //人数
        this.localStorageKey.KEY_yunchengtiejin_zhuangxian     = "_yunchengtiejin_zhuangxian"; //轮庄
        this.localStorageKey.KEY_yunchengtiejin_gps      = "_yunchengtiejin_GPS"; //防作弊
        this.localStorageKey.KEY_yunchengtiejin_suojin      = "yunchengtiejin_suojin"; //有胡必胡
        this.localStorageKey.KEY_yunchengtiejin_sanjinfengding      = "yunchengtiejin_sanjinfengding"; //大胡
        this.localStorageKey.KEY_yunchengtiejin_shoujinbishang      = "yunchengtiejin_shoujinbishang"; //大胡
        this.localStorageKey.KEY_yunchengtiejin_dianpaotongpei      = "yunchengtiejin_dianpaotongpei"; //十三幺
        this.localStorageKey.KEY_yunchengtiejin_gangsuihuzou      = "yunchengtiejin_gangsuihuzou"; //daizuhang
        this.localStorageKey.KEY_yunchengtiejin_qidui      = "yunchengtiejin_qidui"; //庄自摸
        this.localStorageKey.KEY_yunchengtiejin_yitiaolong      = "yunchengtiejin_yitiaolong"; //点炮包杠
        this.localStorageKey.KEY_yunchengtiejin_qingyise      = "yunchengtiejin_qingyise";
        this.localStorageKey.KEY_yunchengtiejin_shisanyao      = "yunchengtiejin_shisanyao";
        this.localStorageKey.KEY_yunchengtiejin_heisanfeng     = "yunchengtiejin_heisanfeng";
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_yunchengtiejin.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_yunchengtiejin");
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

        this.play_jinnum4 = _play.getChildByName("play_jinnum4");
        this.play_jinnum8 = _play.getChildByName("play_jinnum8");
        var nodejinnumList1 = [];
        nodejinnumList1.push(_play.getChildByName("play_jinnum4"));
        nodejinnumList1.push(_play.getChildByName("play_jinnum8"));
        this._playNode_player_jinnum_radio = createRadioBoxForCheckBoxs(nodejinnumList1, function(index){
            this.radioBoxSelectCB(index, nodejinnumList1[index], nodejinnumList1);
        }.bind(this));
        this.addListenerText(nodejinnumList1, this._playNode_player_jinnum_radio,this.changePayForPlayerNum.bind(this));
        this._jinnumlist = nodejinnumList1;

        // 轮庄
        this._playNode_zhuangxian = _play.getChildByName("play_zhuangxian");
        this.addListenerText(this._playNode_zhuangxian);
        this._playNode_zhuangxian.addEventListener(this.clickCB, this._playNode_zhuangxian);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _play.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _play.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _play.getChildByName("btn_add");
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

        // 
        this.play_sanjinfengding = _play.getChildByName("play_sanjinfengding");
        this.addListenerText(this.play_sanjinfengding);
        this.play_sanjinfengding.addEventListener(this.clickCB, this.play_sanjinfengding);

        // 
        this._playNode_suojin = _play.getChildByName("play_suojin");
        this.addListenerText(this._playNode_suojin);
        this._playNode_suojin.addEventListener(this.clickCB, this._playNode_suojin);

        // 
        this.play_shoujinbishang = _play.getChildByName("play_shoujinbishang");
        this.addListenerText(this.play_shoujinbishang);
        this.play_shoujinbishang.addEventListener(this.clickCB, this.play_shoujinbishang);

        // 
        this.play_dianpaotongpei = _play.getChildByName("play_dianpaotongpei");
        this.addListenerText(this.play_dianpaotongpei);
        this.play_dianpaotongpei.addEventListener(this.clickCB, this.play_dianpaotongpei);

        // 
        this.play_heisanfeng = _play.getChildByName("play_heisanfeng");
        this.addListenerText(this.play_heisanfeng);
        this.play_heisanfeng.addEventListener(this.clickCB, this.play_heisanfeng);

        // 
        this.play_gangsuihuzou = _play.getChildByName("play_gangsuihuzou");
        this.addListenerText(this.play_gangsuihuzou);
        this.play_gangsuihuzou.addEventListener(this.clickCB, this.play_gangsuihuzou);
        

        //  四个牌型 
        this.play_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this.play_qidui);
        this.play_qidui.addEventListener(this.clickCB, this.play_qidui);

        this.play_yitiaolong = _play.getChildByName("play_yitiaolong");
        this.addListenerText(this.play_yitiaolong);
        this.play_yitiaolong.addEventListener(this.clickCB, this.play_yitiaolong);

        this.play_qingyise = _play.getChildByName("play_qingyise");
        this.addListenerText(this.play_qingyise);
        this.play_qingyise.addEventListener(this.clickCB, this.play_qingyise);

        this.play_shisanyao = _play.getChildByName("play_shisanyao");
        this.addListenerText(this.play_shisanyao);
        this.play_shisanyao.addEventListener(this.clickCB, this.play_shisanyao);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        // // //留朵 ,不留
        // var _duoIdx = 0;
        // var _duoCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_duo, true);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengtiejin_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _jinnum;
        if (isClub)
            _jinnum = [4, 8].indexOf(this.getNumberItem("jinshu", 4));
        else
            _jinnum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengtiejin_jinnum, 0);
        cc.log("_currentCount renshu  == " + _jinnum)
        this._playNode_player_jinnum_radio.selectItem(_jinnum);
        this.radioBoxSelectCB(_jinnum, this._jinnumlist[_jinnum], this._jinnumlist);


        // 轮庄
        var _zhuangxian;
        if (isClub)
            _zhuangxian = this.getBoolItem("zhuangxian", false);
        else
            _zhuangxian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_zhuangxian, false);
        this._playNode_zhuangxian.setSelected(_zhuangxian);
        var text = this._playNode_zhuangxian.getChildByName("text");
        this.selectedCB(text, _zhuangxian);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengtiejin_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 
        var _suojin;
        if (isClub)
            _suojin = this.getBoolItem("suojin", true);
        else
            _suojin = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_suojin, true);
        this._playNode_suojin.setSelected(_suojin);
        var text = this._playNode_suojin.getChildByName("text");
        this.selectedCB(text, _suojin);


        // 
        var _sanjinfengding;
        if (isClub)
            _sanjinfengding = this.getBoolItem("sanjinfengding", true);
        else
            _sanjinfengding = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_sanjinfengding, true);
        this.play_sanjinfengding.setSelected(_sanjinfengding);
        var text = this.play_sanjinfengding.getChildByName("text");
        this.selectedCB(text, _sanjinfengding);

        var _shoujinbishang;
        if (isClub)
            _shoujinbishang = this.getBoolItem("shoujinbishang", false);
        else
            _shoujinbishang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_shoujinbishang, false);
        this.play_shoujinbishang.setSelected(_shoujinbishang);
        var text = this.play_shoujinbishang.getChildByName("text");
        this.selectedCB(text, _shoujinbishang);

        var _dianpaotongpei;
        if (isClub)
            _dianpaotongpei = this.getBoolItem("dianpaotongpei", false);
        else
            _dianpaotongpei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_dianpaotongpei, false);
        this.play_dianpaotongpei.setSelected(_dianpaotongpei);
        var text = this.play_dianpaotongpei.getChildByName("text");
        this.selectedCB(text, _dianpaotongpei);

        var _gangsuihuzou;
        if (isClub)
            _gangsuihuzou = this.getBoolItem("gangsuihuzou", false);
        else
            _gangsuihuzou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_gangsuihuzou, false);
        this.play_gangsuihuzou.setSelected(_gangsuihuzou);
        var text = this.play_gangsuihuzou.getChildByName("text");
        this.selectedCB(text, _gangsuihuzou);

        var _qidui;
        if (isClub)
            _qidui = this.getBoolItem("qidui", true);
        else
            _qidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_qidui, true);
        this.play_qidui.setSelected(_qidui);
        var text = this.play_qidui.getChildByName("text");
        this.selectedCB(text, _qidui);

        var _yitiaolong;
        if (isClub)
            _yitiaolong = this.getBoolItem("yitiaolong", true);
        else
            _yitiaolong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_yitiaolong, true);
        this.play_yitiaolong.setSelected(_yitiaolong);
        var text = this.play_yitiaolong.getChildByName("text");
        this.selectedCB(text, _yitiaolong);

        var _qingyise;
        if (isClub)
            _qingyise = this.getBoolItem("qingyise", true);
        else
            _qingyise = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_qingyise, true);
        this.play_qingyise.setSelected(_qingyise);
        var text = this.play_qingyise.getChildByName("text");
        this.selectedCB(text, _qingyise);

        var _shisanyao;
        if (isClub)
            _shisanyao = this.getBoolItem("shisanyao", true);
        else
            _shisanyao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_shisanyao, true);
        this.play_shisanyao.setSelected(_shisanyao);
        var text = this.play_shisanyao.getChildByName("text");
        this.selectedCB(text, _shisanyao);

        var _heisanfeng;
        if (isClub)
            _heisanfeng = this.getBoolItem("heisanfeng", false);
        else
            _heisanfeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yunchengtiejin_heisanfeng, false);
        this.play_heisanfeng.setSelected(_heisanfeng);
        var text = this.play_heisanfeng.getChildByName("text");
        this.selectedCB(text, _heisanfeng);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUN_CHENG_TIE_JIN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.difen = 1;
        para.zhuangxian = true;
        para.suojin = false; //经典玩法，有胡比胡
        para.sanjinfengding = false;//带耗子的玩法，过胡只能自摸
        para.shoujinbishang = false;   //经典玩法，大胡
        para.dianpaotongpei = false;   //十三幺
        para.gangsuihuzou = false;
        //para.gps = !!this._bGPS.isSelected();
        para.qidui = false;   //带庄
        para.qingyise = false;   //庄分自摸
        para.yitiaolong = false;   //点炮包杠
        para.shisanyao = false;
        para.heisanfeng = false;
        para.jinshu = 4;
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

         var jinIdx = 0;
         if (this.play_jinnum4.isSelected()) {
             para.jinshu = 4;
             jinIdx = 0;
         }
         else if (this.play_jinnum8.isSelected()) {
             para.jinshu = 8;
             jinIdx = 1;
         }

        para.difen = this._ZhuNum.getString();

        // 轮庄
        para.zhuangxian = this._playNode_zhuangxian.isSelected();

        //带庄
        para.suojin = this._playNode_suojin.isSelected();

        para.sanjinfengding = this.play_sanjinfengding.isSelected();
        para.shoujinbishang = this.play_shoujinbishang.isSelected();
        para.dianpaotongpei = this.play_dianpaotongpei.isSelected();
        para.gangsuihuzou = this.play_gangsuihuzou.isSelected();
        para.qidui = this.play_qidui.isSelected();
        para.qingyise = this.play_qingyise.isSelected();
        para.yitiaolong = this.play_yitiaolong.isSelected();
        para.shisanyao = this.play_shisanyao.isSelected();
        para.heisanfeng = this.play_heisanfeng.isSelected();
        // para.heisanfeng = false;
        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengtiejin_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengtiejin_jinnum, jinIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_zhuangxian, para.zhuangxian);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengtiejin_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_suojin,  para.suojin);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_sanjinfengding,  para.sanjinfengding);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_shoujinbishang,  para.shoujinbishang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_dianpaotongpei,  para.dianpaotongpei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_gangsuihuzou,  para.gangsuihuzou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_qidui,  para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_qingyise,  para.qingyise);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_yitiaolong,  para.yitiaolong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_shisanyao,  para.shisanyao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_heisanfeng,  para.heisanfeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yunchengtiejin_gps,  para.gps);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});