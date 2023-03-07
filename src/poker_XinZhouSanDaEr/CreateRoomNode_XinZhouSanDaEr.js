var CreateRoomNode_XinZhouSanDaEr = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_XZ3D2_twoIsChangZhu     = "SAN_DA_ER_twoIsChangZhu ";       //2为常主
        this.localStorageKey.KEY_XZ3D2_zhuFuTongDa  = "SAN_DA_ER_zhuFuTongDa ";       //2为常主
        this.localStorageKey.KEY_XZ3D2_difen                  = "SAN_DA_ER_difen";                  //底分
        this.localStorageKey.KEY_XZ3D2_gps                = "SAN_DA_ER_GPS";                 //防作弊
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bg_node = ccs.load("bg_XinZhouSanDaEr.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_XinZhouSanDaEr");
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
        var _bg_Node = this.playScroll;
        var _playWay = _bg_Node.getChildByName("play");

        this.twoIsChangZhu  = _playWay.getChildByName("play_twoIsChangZhu");
        this.addListenerText(this.twoIsChangZhu);
        this.twoIsChangZhu.addEventListener(this.clickCB, this.twoIsChangZhu);

        this.zhuFuTongDa  = _playWay.getChildByName("play_zhuFuTongDa");
        this.addListenerText(this.zhuFuTongDa);
        this.zhuFuTongDa.addEventListener(this.clickCB, this.zhuFuTongDa);

        this.count  = _playWay.getChildByName("play_count0");
        // this.addListenerText(this.count);
        this.count.addEventListener(this.clickCB, this.count);
        this.count.setSelected(true);
        var text = this.count.getChildByName("text");
        text.ignoreContentAdaptWithSize(true);
        this.selectedCB(text,true)
        this.count.setEnabled(false);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bg_Node.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _bg_Node.getChildByName("btn_add");
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
    setPlayNodeCurrentSelect:function(isClub)
    {
        //设置上次创建房间时的默认选项
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("twoIsChangZhu", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XZ3D2_twoIsChangZhu, false);
        this.twoIsChangZhu.setSelected(isTrue);
        var text = this.twoIsChangZhu.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("zhuFuTongDa", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XZ3D2_zhuFuTongDa, false);
        this.zhuFuTongDa.setSelected(isTrue);
        var text = this.zhuFuTongDa.getChildByName("text");
        this.selectedCB(text,isTrue)

        //底分
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        var _idx;
        if(isClub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XZ3D2_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if(isClub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XZ3D2_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIN_ZHOU_SAN_DA_ER;
        para.maxPlayer = 5;
        para.twoIsChangZhu  = this.twoIsChangZhu.isSelected();   // 常主2
        para.difen = this._ZhuNum.getString();
        para.gps = this._playNode_gps.isSelected();
        para.zhuFuTongDa  = this.zhuFuTongDa.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XZ3D2_twoIsChangZhu, para.twoIsChangZhu );
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XZ3D2_zhuFuTongDa, para.zhuFuTongDa );
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XZ3D2_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XZ3D2_gps,  para.gps);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});