/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_guaisanjiao = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_guaisanjiao_difen      = "_GUAI_SAN_JIAO_DI_FEN";     //增分
        this.localStorageKey.KEY_guaisanjiao_gameType      = "_GUAI_SAN_JIAO_GAME_TYPE"; //玩法
        this.localStorageKey.KEY_guaisanjiao_liuduo      = "_GUAI_SAN_JIAO_LIU_DUO"; //留垛
        this.localStorageKey.KEY_guaisanjiao_shisanyao      = "_GUAI_SAN_JIAO_SHI_SAN_YAO"; //十三幺
        this.localStorageKey.KEY_guaisanjiao_gangsuihu      = "_GUAI_SAN_JIAO_GANG_SUI_HU"; //杠随胡走
        this.localStorageKey.KEY_guaisanjiao_duohu      = "_GUAI_SAN_JIAO_YI_PAO_DUO_HU"; //一炮多响
        this.localStorageKey.KEY_guaisanjiao_lunzhuang      = "_GUAI_SAN_JIAO_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_guaisanjiao_gps      = "_GUAI_SAN_JIAO_GPS"; //防作弊
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_guaisanjiao.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_guaisanjiao");
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


        //玩法
    /*    this._playNode_gameType0 = _play.getChildByName("play_type0");
        this._playNode_gameType1 = _play.getChildByName("play_type1");
        //this._playNode_gameType1.setVisible(false);//暂时屏蔽半摸玩法
        var nodeGameTypeList1 = [];
        nodeGameTypeList1.push(_play.getChildByName("play_type0"));
        nodeGameTypeList1.push(_play.getChildByName("play_type1"));
        this._playNode_play_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeGameTypeList1, this._playNode_play_type_radio);
        this._gameTypelist = nodeGameTypeList1;*/


        // //留朵
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

        // //十三幺
        this._playNode_shisanyao= _play.getChildByName("play_shisanyao");
        this.addListenerText(this._playNode_shisanyao);
        this._playNode_shisanyao.addEventListener(this.clickCB, this._playNode_shisanyao);

         // //杠随胡走
        this._playNode_gangsuihu= _play.getChildByName("play_gangsuihu");
        this.addListenerText(this._playNode_gangsuihu);
        this._playNode_gangsuihu.addEventListener(this.clickCB, this._playNode_gangsuihu);

         // //一炮多响
        this._playNode_duohu= _play.getChildByName("play_duohu");
        this.addListenerText(this._playNode_duohu);
        this._playNode_duohu.addEventListener(this.clickCB, this._playNode_duohu);

        // //轮庄
        this._playNode_lunzhuang= _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        //留朵
        var _liuduo;
        if (isClub)
            _liuduo = this.getBoolItem("liuduo", false);
        else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_liuduo, false);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        //十三幺
        var _shisanyao;
        if (isClub)
            _shisanyao = this.getBoolItem("shisanyao", false);
        else
            _shisanyao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_shisanyao, false);
        this._playNode_shisanyao.setSelected(_shisanyao);
        var text = this._playNode_shisanyao.getChildByName("text");
        this.selectedCB(text, _shisanyao);

        //杠随胡走
        var _gangsuihu;
        if (isClub)
            _gangsuihu = this.getBoolItem("gangsuihu", false);
        else
            _gangsuihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_gangsuihu, false);
        this._playNode_gangsuihu.setSelected(_gangsuihu);
        var text = this._playNode_gangsuihu.getChildByName("text");
        this.selectedCB(text, _gangsuihu);

        //一炮多响
        var _duohu;
        if (isClub)
            _duohu = this.getBoolItem("duoHu", false);
        else
            _duohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_duohu, false);
        this._playNode_duohu.setSelected(_duohu );
        var text = this._playNode_duohu.getChildByName("text");
        this.selectedCB(text, _duohu);


        //轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang );
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        //底分
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guaisanjiao_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guaisanjiao_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIN_ZHONG_GUAI_SAN_JIAO;
        para.maxPlayer = 3;
        para.flowerType = WithFlowerType.noFlower;
        para.liuduo = false;
        para.shisanyao=false;
        para.gangsuihu=false;
        para.duoHu=false;
        para.lunzhuang=false;
        para.difen = 1;
        //para.gps = !!this._bGPS.isSelected();


        //底分
        para.difen = this._ZhuNum.getString();
       



        // //留duo
        para.liuduo = this._playNode_liuduo.isSelected();

        //十三幺
        para.shisanyao=this._playNode_shisanyao.isSelected();

        //杠随胡走
        para.gangsuihu=this._playNode_gangsuihu.isSelected();

        //一炮多响
        para.duoHu=this._playNode_duohu.isSelected();

        //轮庄
        para.lunzhuang=this._playNode_lunzhuang.isSelected();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
	    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guaisanjiao_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_shisanyao,para.shisanyao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_gangsuihu,para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_duohu,para.duoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_lunzhuang,para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guaisanjiao_gps,  para.gps);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});