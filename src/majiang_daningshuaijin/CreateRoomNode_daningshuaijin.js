/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_daningshuaijin = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_daningshuaijin_difen      = "_DA_NING_SHUAI_JIN_DI_FEN";     //低分
        this.localStorageKey.KEY_daningshuaijin_count      = "_DA_NING_SHUAI_JIN_COUNT";      //人数
        this.localStorageKey.KEY_daningshuaijin_gps        = "_DA_NING_SHUAI_JIN_GPS";        //防作弊
        this.localStorageKey.KEY_daningshuaijin_gangsuihu        = "_DA_NING_SHUAI_JIN_GANG_SUI_HU";   //杠随胡走
        this.localStorageKey.KEY_daningshuaijin_lunzhuang        ="_DA_NING_SHUAI_JIN_LUNZHUANG";       //轮庄
        this.localStorageKey.KEY_daningshuaijin_queMen          ="_DA_NING_SHUAI_JIN_QUEMEN";           //缺门
        this.localStorageKey.KEY_daningshuaijin_ouPai          ="_DA_NING_SHUAI_JIN_OUPAI";           //缺门
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_daningshuaijin.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_daningshuaijin");
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
        this._playNode_daningshuaijin=_play.getChildByName("play_daningshuaijin");
        //加新玩法Here
        nodeCounList.push(this._playNode_daningshuaijin);
        this._playNode_gametype_radio=createRadioBoxForCheckBoxs(nodeCounList,function(index){
            this.showPlayType(index);
            this.radioBoxSelectCB(index,nodeCounList[index],nodeCounList);
        }.bind(this));
        this.addListenerText(nodeCounList,this._playNode_gametype_radio);
        this._gametype=nodeCounList;

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
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

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //杠随胡走
        this._playNode_gangsuihu = _play.getChildByName("play_gangsuihu");
        this.addListenerText(this._playNode_gangsuihu);
        this._playNode_gangsuihu.addEventListener(this.clickCB, this._playNode_gangsuihu);

        //轮庄
        this._playNode_lunzhuang=_play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB,this._playNode_lunzhuang);

        //缺门
        this._playNode_queMen=_play.getChildByName("play_queMen");
        this.addListenerText(this._playNode_queMen);
        this._playNode_queMen.addEventListener(this.clickCB,this._playNode_queMen);

        //怄牌
        this._playNode_ouPai=_play.getChildByName("play_oupai");
        this.addListenerText(this._playNode_ouPai);
        this._playNode_ouPai.addEventListener(this.clickCB,this._playNode_ouPai);
     
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daningshuaijin_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //玩法
        this._playNode_gametype_radio.selectItem(0);
        this.radioBoxSelectCB(0, this._gametype[0], this._gametype);

        //底分
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if(isclub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daningshuaijin_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if(isclub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daningshuaijin_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //杠随胡走
        var _gangsuihu;
        if(isclub){
            _gangsuihu = this.getBoolItem("gangsuihu", false);
        }else{
            _gangsuihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daningshuaijin_gangsuihu, false);
        }
        this._playNode_gangsuihu.setSelected(_gangsuihu);
        var text = this._playNode_gangsuihu.getChildByName("text");
        this.selectedCB(text, _gangsuihu);

        //轮庄
        var _lunzhuang;
        if(isclub){
            _lunzhuang=this.getBoolItem("lunzhuang",true);
        }else{
            _lunzhuang=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daningshuaijin_lunzhuang,true);
        }
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);
        //缺门
        var _queMen;
        if(isclub){
            _queMen=this.getBoolItem("queMen",true);
        }else{
            _queMen=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daningshuaijin_queMen,true);
        }
        this._playNode_queMen.setSelected(_queMen);
        var text = this._playNode_queMen.getChildByName("text");
        this.selectedCB(text, _queMen);

        //怄牌
        var _ouPai;
        if(isclub){
            _ouPai=this.getBoolItem("oupai",true);
        }else{
            _ouPai=util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daningshuaijin_ouPai,true);
        }
        this._playNode_ouPai.setSelected(_ouPai);
        var text = this._playNode_ouPai.getChildByName("text");
        this.selectedCB(text, _ouPai);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DA_NING_SHUAI_JIN;
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
        para.gangsuihu = this._playNode_gangsuihu.isSelected();
        para.lunzhuang=this._playNode_lunzhuang.isSelected();
        para.queMen=this._playNode_queMen.isSelected();
        para.oupai=this._playNode_ouPai.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daningshuaijin_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daningshuaijin_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daningshuaijin_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daningshuaijin_gangsuihu,  para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daningshuaijin_lunzhuang,  para.lunzhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daningshuaijin_queMen,  para.queMen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daningshuaijin_ouPai,  para.oupai);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});