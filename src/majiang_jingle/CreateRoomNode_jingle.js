/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_jingle = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_jingle_difen      = "_JING_LE_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_jingle_count      = "_JING_LE_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_jingle_daifeng      = "_JING_LE_KOU_DIAN_LUN_ZHUANG"; //轮庄
        this.localStorageKey.KEY_jingle_gps      = "__JING_LE_KOU_DIAN_GPS"; //防作弊
        this.localStorageKey.KEY_jingle_daHu      = "_JING_LE_KOU_DIAN_DA_HU"; //大胡
        this.localStorageKey.KEY_jingle_diejia      = "_JING_LE_KOU_DIAN_SHI_SAN_YAO"; //十三幺
        this.localStorageKey.KEY_jingle_haohuaqidui      = "_JING_LE_KOU_DIAN_HAO_HUA_QI_DUI"; //十三幺
        this.localStorageKey.KEY_jingle_bihu      = "_JING_LE_KOU_DIAN_BI_HU"; //十三幺
        this.localStorageKey.KEY_jingle_ziyise      = "_JING_LE_KOU_DIAN_ziyise"; //
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_jingle.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jingle");
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



        // 带风
        this._playNode_daifeng = _play.getChildByName("play_daifeng");
        this.addListenerText(this._playNode_daifeng);
        this._playNode_daifeng.addEventListener(this.clickCB, this._playNode_daifeng);

        // 带风
        this._playNode_ziyise = _play.getChildByName("play_ziyise");
        this.addListenerText(this._playNode_ziyise);
        this._playNode_ziyise.addEventListener(this.clickCB, this._playNode_ziyise);

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

        // 大胡
        this._playNode_daHu = _play.getChildByName("play_dahu");
        this.addListenerText(this._playNode_daHu);
        this._playNode_daHu.addEventListener(this.clickCB, this._playNode_daHu);

        this._playNode_haohuaqidui = _play.getChildByName("play_haohuaqidui");
        this.addListenerText(this._playNode_haohuaqidui);
        this._playNode_haohuaqidui.addEventListener(this.clickCB, this._playNode_haohuaqidui);

        this._playNode_bihu = _play.getChildByName("play_bihu");
        this.addListenerText(this._playNode_bihu);
        this._playNode_bihu.addEventListener(this.clickCB, this._playNode_bihu);

        var that = this;

        // 牌型叠加
        this._playNode_diejia = _play.getChildByName("play_diejia");
        this.addListenerText(this._playNode_diejia);
        this._playNode_diejia.addEventListener(this.clickCB, this._playNode_diejia);

        this._playNode_daHu.schedule(function() {
            if(that.customInfo && that.customInfo.isSelected()) //俱乐部玩家自主创房
            {
                that._playNode_diejia.visible = false;
                return;
            }
            if(that._playNode_daHu.isSelected())
            {
                that._playNode_diejia.visible = true;
            }
            else
            {
                that._playNode_diejia.visible = false;
            }
        })

    },
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingle_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        // 带风
        var _daifeng;
        if (isClub)
            _daifeng = this.getBoolItem("daifeng", true);
        else
            _daifeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_daifeng, true);
        this._playNode_daifeng.setSelected(_daifeng);
        var text = this._playNode_daifeng.getChildByName("text");
        this.selectedCB(text, _daifeng);

        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingle_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 大胡
        var _daHu;
        if (isClub)
            _daHu = this.getBoolItem("dahu", false);
        else
            _daHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_daHu, false);
        this._playNode_daHu.setSelected(_daHu);
        var text = this._playNode_daHu.getChildByName("text");
        this.selectedCB(text, _daHu);

        var _ziyise;
        if (isClub)
            _ziyise = this.getBoolItem("ziyise", false);
        else
            _ziyise = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_ziyise, false);
        this._playNode_ziyise.setSelected(_ziyise);
        var text = this._playNode_ziyise.getChildByName("text");
        this.selectedCB(text, _ziyise);

        // 
        var _biHu;
        if (isClub)
            _biHu = this.getBoolItem("bihu", false);
        else
            _biHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_bihu, false);
        this._playNode_bihu.setSelected(_biHu);
        var text = this._playNode_bihu.getChildByName("text");
        this.selectedCB(text, _biHu);

        // 
        var _haohuaqidui;
        if (isClub)
            _haohuaqidui = this.getBoolItem("haohuaqidui", false);
        else
            _haohuaqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_haohuaqidui, false);
        this._playNode_haohuaqidui.setSelected(_haohuaqidui);
        var text = this._playNode_haohuaqidui.getChildByName("text");
        this.selectedCB(text, _haohuaqidui);

        // 叠加
        var _diejia;
        if (isClub)
            _diejia = this.getBoolItem("diejia", false);
        else
            _diejia = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingle_diejia, false);
        this._playNode_diejia.setSelected(_diejia);
        var text = this._playNode_diejia.getChildByName("text");
        this.selectedCB(text, _diejia);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JING_LE_KOU_DIAN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.daifeng = true;
        para.dahu = false;   //大胡
        para.diejia = false;   //牌型叠加
        para.bihu = false;
        para.haohuaqidui = false;
        para.ziyise = false;
        para.convertible = false;//是否自由人数
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

        para.difen = Number(this._ZhuNum.getString());

        // 轮庄
        para.daifeng = this._playNode_daifeng.isSelected();

        para.haohuaqidui = this._playNode_haohuaqidui.isSelected();

        para.bihu = this._playNode_bihu.isSelected();
        para.ziyise = this._playNode_ziyise.isSelected();

        //带庄
        para.dahu = this._playNode_daHu.isSelected();

        para.diejia = this._playNode_diejia.isSelected();
        if (para.dahu == false) 
        {
            para.diejia = false;
        }

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingle_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingle_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_daifeng,  para.daifeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_daHu,  para.dahu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_diejia,  para.diejia);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_ziyise,  para.ziyise);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_bihu,  para.bihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingle_haohuaqidui,  para.haohuaqidui);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});