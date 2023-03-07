/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_wutaikoudian = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_wutaikoudian_playType          = "_WU_TAI_KOU_DIAN_PLAY_TYPE";             //DUO
        this.localStorageKey.KEY_wutaikoudian_difen             = "_WU_TAI_KOU_DIAN_DI_FEN";                //增分
        this.localStorageKey.KEY_wutaikoudian_count             = "_WU_TAI_KOU_DIAN_COUNT";                 //人数
        this.localStorageKey.KEY_wutaikoudian_lunzhuang         = "_WU_TAI_KOU_DIAN_LUN_ZHUANG";            //轮庄
        this.localStorageKey.KEY_wutaikoudian_gps               = "_WU_TAI_KOU_DIAN_GPS";                   //防作弊
        this.localStorageKey.KEY_wutaikoudian_bihu              = "_WU_TAI_KOU_DIAN_BI_HU";                 //有胡必胡
        this.localStorageKey.KEY_wutaikoudian_daHu              = "_WU_TAI_KOU_DIAN_DA_HU";                 //大胡
        this.localStorageKey.KEY_wutaikoudian_daHu              = "_WU_TAI_KOU_DIAN_DA_HU";                 //大胡
        this.localStorageKey.KEY_wutaikoudian_shisanyao         = "_WU_TAI_KOU_DIAN_SHI_SAN_YAO";           //十三幺
        this.localStorageKey.KEY_wutaikoudian_daizhuang         = "_WU_TAI_KOU_DIAN_SHI_DAI_ZHUANG";        //daizuhang
        this.localStorageKey.KEY_wutaikoudian_zhuangzimo        = "_WU_TAI_KOU_DIAN_ZHUANG_ZI_MO";          //庄自摸
        this.localStorageKey.KEY_wutaikoudian_liuduo            = "_WU_TAI_KOU_DIAN_LIU_DUO";               //留垛
        this.localStorageKey.KEY_wutaikoudian_dianpaobaogang    = "_WU_TAI_KOU_DIAN_DIAN_PAO";              //留垛
        this.localStorageKey.KEY_wutaikoudian_dianpaoshaogang   = "_WU_TAI_KOU_DIAN_DIAN_PAO";              //点炮烧杠
        this.localStorageKey.KEY_wutaikoudian_haohuaqidui       = "_WU_TAI_KOU_DIAN_HAO_HUA_QI_DUI";        //豪华七对
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_wutaikoudian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_wutaikoudian");
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
        this._playNode_playType0 = _play.getChildByName("play_jindian");
        this._playNode_playType1 = _play.getChildByName("play_budaifeng");
        this._playNode_playType2 = _play.getChildByName("play_daihaozi");
        this._playNode_playType3 = _play.getChildByName("play_suijihaozi");
        this._playNode_playType4 = _play.getChildByName("play_shuanghaozi");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        nodePlayTypeList1.push(this._playNode_playType3);
        nodePlayTypeList1.push(this._playNode_playType4);
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

        this._playNode_playType0.schedule(function() {
            if(that._playNode_playType0.isSelected())
            {
                that._playNode_biHu.visible = false;
            }
            else
            {
                that._playNode_biHu.visible = true;
            }
        });

        // 大胡
        this._playNode_daHu = _play.getChildByName("play_dahu");
        this.addListenerText(this._playNode_daHu);
        this._playNode_daHu.addEventListener(this.clickCB, this._playNode_daHu);

        var that = this;
        this._playNode_playType2.schedule(function() {
            if(that._playNode_playType0.isSelected())
            {
                that._playNode_daHu.visible = true;
            }
            else
            {
                that._playNode_daHu.visible = false;
            }

            if(that._playNode_playType0.isSelected() || that._playNode_playType1.isSelected())
            {
                that._playNode_biHu.getChildByName("text").setString("有胡必胡");
            }
            else if (that._playNode_playType2.isSelected() || that._playNode_playType3.isSelected() ||  that._playNode_playType4.isSelected())
            {
                that._playNode_biHu.getChildByName("text").setString("过胡只能自摸");
            }
        });


        // 十三幺
        this._playNode_shisanyao = _play.getChildByName("play_shisanyao");
        this.addListenerText(this._playNode_shisanyao);
        this._playNode_shisanyao.addEventListener(this.clickCB, this._playNode_shisanyao);
        this._playNode_shisanyao.schedule(function() {
            if(that._playNode_playType0.isSelected())
            {
                that._playNode_shisanyao.visible = true;
            }
            else
            {
                that._playNode_shisanyao.visible = false;
            }
        });

        // 豪华七对
        this._playNode_haohuaqidui = _play.getChildByName("play_haohuaqidui");
        this.addListenerText(this._playNode_haohuaqidui);
        this._playNode_haohuaqidui.addEventListener(this.clickCB, this._playNode_haohuaqidui);
        this._playNode_haohuaqidui.schedule(function() {
            if(that._playNode_playType0.isSelected())
            {
                that._playNode_haohuaqidui.visible = true;
            }
            else
            {
                that._playNode_haohuaqidui.visible = false;
            }
        });

        //
        this._playNode_zhuangfen = _play.getChildByName("play_zhuangfen");
        this.addListenerText(this._playNode_zhuangfen);
        this._playNode_zhuangfen.addEventListener(this.clickCB, this._playNode_zhuangfen);

        //
        this._playNode_dianpaobaogang = _play.getChildByName("play_dianpaobaogang");      
        this.addListenerText(this._playNode_dianpaobaogang);
        this._playNode_dianpaobaogang.addEventListener(this.clickCB, this._playNode_dianpaobaogang);

        //
        this._playNode_dianpaoshaogang = _play.getChildByName("play_dianpaoshaogang_0");      
        this.addListenerText(this._playNode_dianpaoshaogang);
        this._playNode_dianpaoshaogang.addEventListener(this.clickCB, this._playNode_dianpaoshaogang);

        //
        this._playNode_zhuangzimo = _play.getChildByName("play_zhuangfenzimo");
        this.addListenerText(this._playNode_zhuangzimo);
        this._playNode_zhuangzimo.addEventListener(this.clickCB, this._playNode_zhuangzimo);

        this._playNode_zhuangfen.schedule(function() {
            if(that._playNode_zhuangfen.isSelected())
            {
                that._playNode_zhuangzimo.visible = true;
            }
            else
            {
                that._playNode_zhuangzimo.visible = false;
            }
        });

    },
    setPlayNodeCurrentSelect: function(isClub) {

        // // //留朵 ,不留
        // var _duoIdx = 0;
        // var _duoCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_duo, true);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wutaikoudian_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _playType;
        if (isClub)
            _playType = this.getNumberItem("playType", 0);
        else
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wutaikoudian_playType, 0);
        this._playNode_PlayType_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, this._playTypelist[_playType], this._playTypelist);

        // 轮庄
        var _lunzhuang;
        if (isClub)
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

                // 轮庄
        var _dianpao;
        if (isClub)
            _dianpao = this.getBoolItem("dianpaobaogang", false);
        else
            _dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_dianpaobaogang, false);
        this._playNode_dianpaobaogang.setSelected(_dianpao);
        var text = this._playNode_dianpaobaogang.getChildByName("text");
        this.selectedCB(text, _dianpao);

        var _dianpaoshaogang;
        if (isClub)
            _dianpaoshaogang = this.getBoolItem("dianpaoshaogang", true);
        else
            _dianpaoshaogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_dianpaoshaogang, true);
        this._playNode_dianpaoshaogang.setSelected(_dianpaoshaogang);
        var text = this._playNode_dianpaoshaogang.getChildByName("text");
        this.selectedCB(text, _dianpaoshaogang);


        // 留垛

        var _liuduo;
        if (isClub)
            _liuduo = this.getBoolItem("liuduo", false);
        else
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_liuduo, false);
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_wutaikoudian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 大胡
        var _daHu;
        if (isClub)
            _daHu = this.getBoolItem("dahu", true);
        else
            _daHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_daHu, true);
        this._playNode_daHu.setSelected(_daHu);
        var text = this._playNode_daHu.getChildByName("text");
        this.selectedCB(text, _daHu);


        // 13
        var _shisanyao;
        if (isClub)
            _shisanyao = this.getBoolItem("shisanyao", false);
        else
            _shisanyao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_shisanyao, false);
        this._playNode_shisanyao.setSelected(_shisanyao);
        var text = this._playNode_shisanyao.getChildByName("text");
        this.selectedCB(text, _shisanyao);

        // 豪华七对
        var _haohuaqidui;
        if (isClub)
            _haohuaqidui = this.getBoolItem("haohuaqidui", false);
        else
            _haohuaqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_haohuaqidui, false);
        this._playNode_haohuaqidui.setSelected(_haohuaqidui);
        var text = this._playNode_haohuaqidui.getChildByName("text");
        this.selectedCB(text, _haohuaqidui);


        if(this._playNode_playType0.isSelected() || this._playNode_playType1.isSelected())
        {
            // 必胡
            var _biHu;
            if (isClub)
                _biHu = this.getBoolItem("biHu", false);
            else
                _biHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_bihu, false);
            this._playNode_biHu.setSelected(_biHu);
            var text = this._playNode_biHu.getChildByName("text");
            this.selectedCB(text, _biHu);
        }
        else if (this._playNode_playType2.isSelected() || this._playNode_playType3.isSelected() ||  this._playNode_playType4.isSelected())
        {
            // 过胡自摸
            var _guoHuZiMo;
            if (isClub)
                _guoHuZiMo = this.getBoolItem("guoHuZiMo", false);
            else
                _guoHuZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_bihu, false);
            this._playNode_biHu.setSelected(_guoHuZiMo);
            var text = this._playNode_biHu.getChildByName("text");
            this.selectedCB(text, _guoHuZiMo);
        }


        // 带庄
        var _daizhuang;
        if (isClub)
            _daizhuang = this.getBoolItem("zhuangfen", false);
        else
            _daizhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_daizhuang, false);
        this._playNode_zhuangfen.setSelected(_daizhuang);
        var text = this._playNode_zhuangfen.getChildByName("text");
        this.selectedCB(text, _daizhuang);

        // 庄自摸
        var _zhuangzimo;
        if (isClub)
            _zhuangzimo = this.getBoolItem("zhuangfenzimofanfan", false);
        else
            _zhuangzimo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_wutaikoudian_zhuangzimo, false);
        this._playNode_zhuangzimo.setSelected(_zhuangzimo);
        var text = this._playNode_zhuangzimo.getChildByName("text");
        this.selectedCB(text, _zhuangzimo);


        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.WU_TAI_KOU_DIAN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.playType = 0; // 0 经典，1 不带风，2 带耗子,3 随机耗子，4 双耗子
        para.lunzhuang = true;
        para.biHu = false; //经典玩法，有胡比胡
        para.guoHuZiMo = false;//带耗子的玩法，过胡只能自摸
        para.dahu = false;   //经典玩法，大胡
        para.shisanyao = true;   //十三幺
        para.haohuaqidui = false;   //豪华七对
        //para.gps = !!this._bGPS.isSelected();
        para.zhuangfen = false;   //带庄
        para.zhuangfenzimofanfan = false;   //庄分自摸
        para.liuduo = false;
        para.dianpaobaogang = false;
        para.dianpaoshaogang = true;
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

        //人数
        if (this._playNode_playType0.isSelected()) {
            para.playType = 0;

            //十三幺
            para.shisanyao = this._playNode_shisanyao.isSelected();

            //豪华七对
            para.haohuaqidui = this._playNode_haohuaqidui.isSelected();

            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_shisanyao, para.shisanyao);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_haohuaqidui, para.haohuaqidui);
            }
            //经典玩法
            para.biHu = false;

            para.dahu =  this._playNode_daHu.isSelected();
        }
        else if (this._playNode_playType1.isSelected()) {
            para.playType = 1;
            //经典玩法
            para.shisanyao = false;
            para.biHu = this._playNode_biHu.isSelected();
        }
        else if (this._playNode_playType2.isSelected()) {
            para.playType = 2;
            //带耗子的玩法
            para.guoHuZiMo = this._playNode_biHu.isSelected();
        }
        else if (this._playNode_playType3.isSelected()) {
            para.playType = 3;
            //随机耗子的玩法
            para.guoHuZiMo = this._playNode_biHu.isSelected();
        }
        else if (this._playNode_playType4.isSelected()) {
            para.playType = 4;
            //双耗子的玩法
            para.guoHuZiMo = this._playNode_biHu.isSelected();
        }

        para.difen = this._ZhuNum.getString();

        //带庄
        para.zhuangfen = this._playNode_zhuangfen.isSelected();
        para.dianpaobaogang = this._playNode_dianpaobaogang.isSelected();
        para.dianpaoshaogang = this._playNode_dianpaoshaogang.isSelected();

        para.liuduo = this._playNode_liuduo.isSelected();
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        if(para.zhuangfen)
        {
            // 庄自摸
            para.zhuangfenzimofanfan = this._playNode_zhuangzimo.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_zhuangzimo,  para.zhuangfenzimofanfan);
            }
        }
        else
        {
            para.zhuangfenzimofanfan = false;
        }

        //防作弊
        para.gps = this._playNode_gps.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wutaikoudian_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wutaikoudian_playType, para.playType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_bihu, this._playNode_biHu.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_wutaikoudian_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_daizhuang,  para.zhuangfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_dianpaobaogang,  para.dianpaobaogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_wutaikoudian_dianpaoshaogang,  para.dianpaoshaogang);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});