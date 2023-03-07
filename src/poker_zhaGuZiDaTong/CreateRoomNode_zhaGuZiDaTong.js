/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_daTongZhaGuZi = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_DGZ_playerNumber       = "_DA_GU_ZI_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DGZ_difen               = "_DA_GU_ZI_DI_FEN";           //底分
        this.localStorageKey.KEY_DGZ_gps      = "_DA_GU_ZI_GPS"; //防作弊
        this.localStorageKey.KEY_DGZ_showhandnum             = "_DA_GU_ZI_SHOW_HAND_NUM";                //显示手牌数
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_zhaGuZiDaTong.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initPlayNode:function()
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }

        var _bg_Node = this.playScroll;
    
        var _playWay = _bg_Node.getChildByName("play");

        var playNode_count = _playWay.getChildByName("play_count0");
        playNode_count.setSelected(true)
        playNode_count.setTouchEnabled(false);
        playNode_count.getChildByName("text").ignoreContentAdaptWithSize(true);
        playNode_count.getChildByName("text").setTextColor(cc.color(237, 101, 1))

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

        this._playNode_showHandNum = _playWay.getChildByName("play_showHandNum");   //双王必叫
        this.addListenerText(this._playNode_showHandNum);
        this._playNode_showHandNum.addEventListener(this.clickCB, this._playNode_showHandNum);


    },
    initRoundNode:function()
    {
       this._super();
       //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect:function(isClub) {
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType()) {
            this._super();
        }
        //设置上次创建房间时的默认选项

        var _difen;
        var _fenshu = [1,2,3,4,5,6,7,8,9,10];
        if (isClub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
        }
        else
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DGZ_difen , 0);
        this._zhuIdx = (_fenshu.length + _difen)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DGZ_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //显示手牌数
        var _showHandNum;
        if(isClub)
            _showHandNum = this.getBoolItem("showHandNum", false);
        else
            _showHandNum = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DGZ_showhandnum, false);
        this._playNode_showHandNum.setSelected(_showHandNum);
        var text = this._playNode_showHandNum.getChildByName("text");
        this.selectedCB(text, _showHandNum);

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DA_TONG_ZHA_GU_ZI;
        para.maxPlayer = 5;
        para.difen = 1;

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps


        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        para.showHandNum = this._playNode_showHandNum.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DGZ_showhandnum, para.showHandNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DGZ_difen, this._zhuIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DGZ_gps,  para.gps);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});