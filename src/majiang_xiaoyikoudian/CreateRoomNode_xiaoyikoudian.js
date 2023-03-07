/**
 * Created by wucc on 2018/4/16.
 */


var CreateRoomNode_xiaoyikoudian = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_xiaoyikoudian_difen      = "_XIAO_YI_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_xiaoyikoudian_count      = "_XIAO_YI_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_xiaoyikoudian_gangsuihu      = "_XIAO_YI_KOU_DIAN_GSHZ"; //杠随胡走
        this.localStorageKey.KEY_xiaoyikoudian_anting      = "_XIAO_YI_KOU_DIAN_AN_TING"; //暗听
        this.localStorageKey.KEY_xiaoyikoudian_dahu      = "_XIAO_YI_KOU_DIAN_DA_HU"; //大胡
        this.localStorageKey.KEY_xiaoyikoudian_dpbg      = "_XIAO_YI_KOU_DIAN_DPBG"; //点炮包杠
        this.localStorageKey.KEY_xiaoyikoudian_yidiansi      = "_XIAO_YI_KOU_DIAN_YIDIANSI"; //一点四
        this.localStorageKey.KEY_xiaoyikoudian_zimogang      = "_XIAO_YI_KOU_DIAN_ZIMOGANG"; //自摸杠
        this.localStorageKey.KEY_xiaoyikoudian_liuduo      = "_XIAO_YI_KOU_DIAN_LIUDUO"; //留垛
        this.localStorageKey.KEY_xiaoyikoudian_gps      = "_XIAO_YI_KOU_DIAN_GPS"; //防作弊
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_xiaoyikoudian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiaoyikoudian");
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
        this._playNode_xiaoyikoudian=_play.getChildByName("play_xiaoyikoudian");
        //加新玩法Here
        nodeCounList.push(this._playNode_xiaoyikoudian);
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

        //杠随胡走
        this._playNode_gangsuihu = _play.getChildByName("play_gangsuihu");
        this.addListenerText(this._playNode_gangsuihu);
        this._playNode_gangsuihu.addEventListener(this.clickCB, this._playNode_gangsuihu);

        //暗听
        this._playNode_anting = _play.getChildByName("play_anting");
        this.addListenerText(this._playNode_anting);
        this._playNode_anting.addEventListener(this.clickCB, this._playNode_anting);

        //点炮包杠
        this._playNode_dpbg = _play.getChildByName("play_dianpaobaogang");
        this.addListenerText(this._playNode_dpbg);
        this._playNode_dpbg.addEventListener(this.clickCB, this._playNode_dpbg);

        //一点四
        this._playNode_yidiansi = _play.getChildByName("play_yidiansi");
        this.addListenerText(this._playNode_yidiansi);
        this._playNode_yidiansi.addEventListener(this.clickCB, this._playNode_yidiansi);

        //留垛
        this._playNode_liuduo = _play.getChildByName("play_liuduo");
        this.addListenerText(this._playNode_liuduo);
        this._playNode_liuduo.addEventListener(this.clickCB, this._playNode_liuduo);

        //自摸杠
        this._playNode_zimogang = _play.getChildByName("play_zimogang");
        this.addListenerText(this._playNode_zimogang);
        this._playNode_zimogang.addEventListener(this.clickCB, this._playNode_zimogang);
        var yidiansi_node = this._playNode_yidiansi;
        var dpbg_node = this._playNode_dpbg;
        var zimogang_node = this._playNode_zimogang;
        zimogang_node.runAction(cc.repeatForever(cc.callFunc(function() {
            if(yidiansi_node.isSelected() && dpbg_node.isSelected()){
                zimogang_node.visible = true;
            }else{
                zimogang_node.visible = false;
            }
        })));

        //大胡
        this._playNode_dahu = _play.getChildByName("play_dahu");
        this.addListenerText(this._playNode_dahu, null, this.showTextTip.bind(this));
        //this._playNode_dahu.addEventListener(this.clickCB_dahu, this._playNode_dahu);

        this._text_tip = this.bg_node.getChildByName("btn_create_diamond").getChildByName("text_tip"); 
        this._text_tip.visible = false;

        this._playNode_dahu.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(CREATEROOM_COLOR_1);
                        this._text_tip.visible = true;
                    } else {
                        txt.setTextColor(CREATEROOM_COLOR_3);
                        this._text_tip.visible = false;
                    }
                break;
            }
        },this);


        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);
    },
    showTextTip:function(){
        if(this._playNode_dahu.isSelected()){
            this._text_tip.visible = true;
        }else{
            this._text_tip.visible = false;
        }
    },

    setPlayNodeCurrentSelect: function(isclub) {
        //杠随胡走
        var _gshz;
        if(isclub){
            _gshz = this.getBoolItem("gangsuihu", false);
        }else{
            _gshz = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_gangsuihu, false);
        }
        this._playNode_gangsuihu.setSelected(_gshz);
        var text = this._playNode_gangsuihu.getChildByName("text");
        this.selectedCB(text, _gshz);

        // 暗听
        var _anting;
        if(isclub){
            _anting = this.getBoolItem("anting", true);
        }else{
            _anting = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_anting, true);
        }
        this._playNode_anting.setSelected(_anting);
        var text = this._playNode_anting.getChildByName("text");
        this.selectedCB(text, _anting);

        //点炮包杠
        var _dpbg;
        if(isclub){
            _dpbg = this.getBoolItem("baogang", true);
        }else{
            _dpbg = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_dpbg, true);
        }
        this._playNode_dpbg.setSelected(_dpbg);
        var text = this._playNode_dpbg.getChildByName("text");
        this.selectedCB(text, _dpbg);

        //一点四
        var _yidiansi;
        if(isclub){
            _yidiansi = this.getBoolItem("yidiansi", false);
        }else{
            _yidiansi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_yidiansi, false);
        }
        this._playNode_yidiansi.setSelected(_yidiansi);
        var text = this._playNode_yidiansi.getChildByName("text");
        this.selectedCB(text, _yidiansi);

        //自摸杠
        var _zimogang;
        if(isclub){
            _zimogang = this.getBoolItem("zimogang", true);
        }else{
            _zimogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_zimogang, true);
        }
        this._playNode_zimogang.setSelected(_zimogang);
        var text = this._playNode_zimogang.getChildByName("text");
        this.selectedCB(text, _zimogang);

        //大胡
        var _dahu;
        if(isclub){
            _dahu = this.getBoolItem("dahu", false);
        }else{
            _dahu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_dahu, false);
        }
        this._playNode_dahu.setSelected(_dahu);
        var text = this._playNode_dahu.getChildByName("text");
        this.selectedCB(text, _dahu);
        this._text_tip.visible = _dahu;

        //大胡
        var _liuduo;
        if(isclub){
            _liuduo = this.getBoolItem("liuduo", true);
        }else{
            _liuduo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_liuduo, true);
        }
        this._playNode_liuduo.setSelected(_liuduo);
        var text = this._playNode_liuduo.getChildByName("text");
        this.selectedCB(text, _liuduo);

        //人数
        var _currentCount;
        if (isclub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiaoyikoudian_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //玩法
        this._playNode_gametype_radio.selectItem(0);
        this.radioBoxSelectCB(0, this._gametype[0], this._gametype);

        //底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if (isclub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiaoyikoudian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        //防作弊
        var _gps;
        if(isclub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiaoyikoudian_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIAO_YI_KOU_DIAN;
        para.maxPlayer = 4;
        para.difen = 1;
        para.gangsuihu = true;
        para.anting = true;
        para.dahu = false;
        para.baogang = false;
        para.yidiansi = false;
        para.zimogang = false;
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

        //杠随胡
        para.gangsuihu = this._playNode_gangsuihu.isSelected();

        //暗听
        para.anting = this._playNode_anting.isSelected();

        // 大胡
        para.dahu = this._playNode_dahu.isSelected();

        //点炮包杠
        para.baogang = this._playNode_dpbg.isSelected();

        //一点四
        para.yidiansi = this._playNode_yidiansi.isSelected();

        //留垛
        para.liuduo = this._playNode_liuduo.isSelected();

        //自摸杠
        if(this._playNode_yidiansi.isSelected() && this._playNode_dpbg.isSelected()){
            para.zimogang = this._playNode_zimogang.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_zimogang, para.zimogang);
            }
        }else{
            para.zimogang = false; 
        }

        //底分默认1
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiaoyikoudian_count, _countIdx)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_gangsuihu,  para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_anting,  para.anting);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_dahu,  para.dahu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_dpbg,  para.baogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_yidiansi,  para.yidiansi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiaoyikoudian_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_liuduo,  para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiaoyikoudian_gps,  para.gps);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
});