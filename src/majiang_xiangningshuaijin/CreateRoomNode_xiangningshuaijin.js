/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_xiangningshuaijin = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_xiangningshuaijin_difen      = "_XIANG_NING_SHUAI_JIN_DI_FEN";     //低分
        this.localStorageKey.KEY_xiangningshuaijin_count      = "_XIANG_NING_SHUAI_JIN_COUNT";      //人数
        this.localStorageKey.KEY_xiangningshuaijin_gps        = "_XIANG_NING_SHUAI_JIN_GPS";        //防作弊
        this.localStorageKey.KEY_xiangningshuaijin_baotingbaohu        = "_XIANG_NING_SHUAI_JIN_BAO_TING_BAO_HU";        //防作弊
        this.localStorageKey.KEY_xiangningshuaijin_lunzhuang           = "XIANG_NING_SHUAI_JIN_LUN_ZHUANG";         //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_xiangningshuaijin.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiangningshuaijin");
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
		
        var nodeCounList=[];
        this._playNode_xiangningshuaijin=_play.getChildByName("play_xiangningshuaijin");
        //加新玩法Here
        nodeCounList.push(this._playNode_xiangningshuaijin);
        this._playNode_gametype_radio=createRadioBoxForCheckBoxs(nodeCounList,function(index){
            this.showPlayType(index);
            this.radioBoxSelectCB(index,nodeCounList[index],nodeCounList);
        }.bind(this));
        this.addListenerText(nodeCounList,this._playNode_gametype_radio);
        this._gametype=nodeCounList;

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

        //报听包胡
        this._playNode_baotingbaohu = _play.getChildByName("play_baotingbaohu");
        this.addListenerText(this._playNode_baotingbaohu);
        this._playNode_baotingbaohu.addEventListener(this.clickCB, this._playNode_baotingbaohu);

        //轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

    },
    setPlayNodeCurrentSelect: function(isclub) {

        //人数
        var _currentCount;
        if (isclub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangningshuaijin_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //玩法
        this._playNode_gametype_radio.selectItem(0);
        this.radioBoxSelectCB(0, this._gametype[0], this._gametype);

        //底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if(isclub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangningshuaijin_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if(isclub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangningshuaijin_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //报听包胡
        var _baotingbaohu;
        if(isclub){
            _baotingbaohu = this.getBoolItem("baotingbaohu", false);
        }else{
            _baotingbaohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangningshuaijin_baotingbaohu, false);
        }
        this._playNode_baotingbaohu.setSelected(_baotingbaohu);
        var text = this._playNode_baotingbaohu.getChildByName("text");
        this.selectedCB(text, _baotingbaohu);


        //报听包胡
        var _lunzhuang;
        if(isclub){
            _lunzhuang = this.getBoolItem("lunzhuang", true);
        }else{
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangningshuaijin_lunzhuang, true);
        }
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LIN_FEN_XIANG_NING_SHUAI_JIN;
        para.maxPlayer = 4;
        para.difen = 1;
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

        //底分默认1
        para.difen = this._ZhuNum.getString();
        //防作弊
        para.gps = this._playNode_gps.isSelected();
        para.baotingbaohu = this._playNode_baotingbaohu.isSelected();
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangningshuaijin_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangningshuaijin_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangningshuaijin_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangningshuaijin_baotingbaohu,  para.baotingbaohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangningshuaijin_lunzhuang,para.lunzhuang);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});