/**
 * Created by wucc on 2018/5/11.
 */


var CreateRoomNode_daQi = CreateRoomNode.extend({
    setKey:function()
    {
        //this.localStorageKey.KEY_lvliangdaqi_playerNumber       = "_LV_LIANG_DA_QI_PLAYER_NUMBER";       //玩家数量
        this.localStorageKey.KEY_lvliangdaqi_fengding           = "_LV_LIANG_DA_QI_FENG_DING";           //封顶 
        this.localStorageKey.KEY_lvliangdaqi_difen              = "_LV_LIANG_DA_QI_DI_FEN";              //底分
        this.localStorageKey.KEY_lvliangdaqi_gps                = "_LV_LIANG_DA_QI_GPS";                 //防作弊
        this.localStorageKey.KEY_lvliangdaqi_koudijiaji         = "_LV_LIANG_DA_QI_JIA_JI";
        this.localStorageKey.KEY_lvliangdaqi_ddsb               = "_LV_LIANG_DA_QI_DDSB";
        this.localStorageKey.KEY_lvliangdaqi_fanpai             = "_LV_LIANG_DA_QI_FAN_PAI";
        this.localStorageKey.KEY_lvliangdaqi_juststart          = "_LV_LIANG_DA_QI_JUST_START";   //直接开始   
        this.localStorageKey.KEY_lvliangdaqi_fanzhubukoudi          = "_LV_LIANG_DA_QI_FAN_ZHU_BU_KOU_DI";   //反主不抠底       
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_daQi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_daQi");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initPlayNode:function()
    {
        var _bg_Node = this.playScroll;
        var _playWay = _bg_Node.getChildByName("play");
        this._playNode_fengding_0 = _playWay.getChildByName("play_fengding0");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding1");
        this._playNode_fengding_2 = _playWay.getChildByName("play_fengding2");
        var nodeListfeng = [];
        nodeListfeng.push( this._playNode_fengding_0 );
        nodeListfeng.push( this._playNode_fengding_1 );
        nodeListfeng.push( this._playNode_fengding_2 );
        this._playNode_feng_radio = createRadioBoxForCheckBoxs(nodeListfeng,this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng,this._playNode_feng_radio);
        this._fenglist = nodeListfeng;
        //人数
        this._playNode_maxPlayer0 = _playWay.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _playWay.getChildByName("play_count1");
        // this._playNode_maxPlayer2 = _playWay.getChildByName("play_count2");
        var nodeCountList1 = [];
        nodeCountList1.push(this._playNode_maxPlayer0);
        nodeCountList1.push(this._playNode_maxPlayer1);
        // nodeCountList1.push(this._playNode_maxPlayer2);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
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

        //扣底加级
        this._play_koudijiaji = _playWay.getChildByName("play_koudijiaji");
        this.addListenerText(this._play_koudijiaji);
        this._play_koudijiaji.addEventListener(this.clickCB, this._play_koudijiaji);

        //庄家单打赢双倍
        this._play_ddysb = _playWay.getChildByName("play_ddysb");
        this.addListenerText(this._play_ddysb);
        this._play_ddysb.addEventListener(this.clickCB, this._play_ddysb);

        //翻牌
        this._play_fanpai = _playWay.getChildByName("play_fanpai");
        this.addListenerText(this._play_fanpai);
        this._play_fanpai.addEventListener(this.clickCB, this._play_fanpai);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //直接开始
        this._play_juststart = _playWay.getChildByName("play_juststart");
        this.addListenerText(this._play_juststart);
        this._play_juststart.addEventListener(this.clickCB, this._play_juststart);  

         //反主不抠底
        this._play_fanZhuBuKouDi = _playWay.getChildByName("play_fanZhuBuKouDi");
        this.addListenerText(this._play_fanZhuBuKouDi);
        this._play_fanZhuBuKouDi.addEventListener(this.clickCB, this._play_fanZhuBuKouDi);       
    },
    initRoundNode:function()
    {
       this._super();
       //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect:function(isclub)
    {
        // if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        // {
        //     this._super();
        // }

        //人数
        var _countIdx;
        if(isclub){
            var _count = this.getNumberItem("maxPlayer", 5);
            switch(_count){
                case 4:
                    _countIdx = 1;
                    break;
                case 5:
                    _countIdx = 0;
                    break;
                default:
                    _countIdx = 0;
                    break;
            }
        }else{
            _countIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_linfendoudizhu_playerNumber, 0);
        }
        this._playNode_player_count_radio.selectItem(_countIdx);
        this.radioBoxSelectCB(_countIdx, this._countlist[_countIdx], this._countlist);
        //封顶
        var _currentfengidx;
        if(isclub){
            var _count = this.getNumberItem("jifengding",3);
            switch(_count){
                case 3:
                    _currentfengidx = 0;
                    break;
                case 5:
                    _currentfengidx = 1;
                    break;
                case 0:
                    _currentfengidx = 2;
                    break;
                default:
                    _currentfengidx = 0;
                    break;
            }
        }else{
            _currentfengidx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliangdaqi_fengding, 0)
        }
        this._playNode_feng_radio.selectItem(_currentfengidx);
        this.radioBoxSelectCB(_currentfengidx, this._fenglist[_currentfengidx], this._fenglist);
        //低分
        var _difen;
        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        if (isclub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
        }
        else
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lvliangdaqi_difen, 0);
        this._zhuIdx = (_fenshu.length + _difen)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //扣底加级
        var _koudi;
        if(isclub){
            _koudi = this.getBoolItem("koudi", false); 
        }else{
            _koudi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_koudijiaji, false);
        }
        this._play_koudijiaji.setSelected(_koudi);
        var text = this._play_koudijiaji.getChildByName("text");
        this.selectedCB(text,_koudi);

        //庄家单打赢双倍
        var _zhuangdanjiabei;
        if(isclub){
            _zhuangdanjiabei = this.getBoolItem("zhuangdanjiabei", false); 
        }else{
            _zhuangdanjiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_ddsb, false);
        }
        this._play_ddysb.setSelected(_zhuangdanjiabei);
        var text = this._play_ddysb.getChildByName("text");
        this.selectedCB(text,_zhuangdanjiabei);

        //翻牌
        var _fanpai;
        if(isclub){
            _fanpai = this.getBoolItem("fanpai", false); 
        }else{
            _fanpai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_fanpai, false);
        }
        this._play_fanpai.setSelected(_fanpai);
        var text = this._play_fanpai.getChildByName("text");
        this.selectedCB(text,_fanpai);

        //直接开始
        var _juststart;
        if(isclub){
            _juststart = this.getBoolItem("juststart", false); 
        }else{
            _juststart = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_juststart, false);
        }
        this._play_juststart.setSelected(_juststart);
        var text = this._play_juststart.getChildByName("text");
        this.selectedCB(text,_juststart);

        //反主不抠底
        var _fanZhuBuKouDi;
        if(isclub){
            _fanZhuBuKouDi = this.getBoolItem("fanZhuBuKouDi", false); 
        }else{
            _fanZhuBuKouDi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_fanzhubukoudi, false);
        }
        this._play_fanZhuBuKouDi.setSelected(_fanZhuBuKouDi);
        var text = this._play_fanZhuBuKouDi.getChildByName("text");
        this.selectedCB(text,_fanZhuBuKouDi);

        //防作弊
        var _gps;
        if(isclub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lvliangdaqi_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LV_LIANG_DA_QI;
        //炸弹封顶
        var _fengIdx = 0;
        if(this._playNode_fengding_0.isSelected())
        {
            para.jifengding = 3;
            _fengIdx = 0;
        }
        else if(this._playNode_fengding_1.isSelected())
        {
            para.jifengding = 5;
            _fengIdx = 1;
        }
        else if(this._playNode_fengding_2.isSelected())
        {
            para.jifengding = 0;
            _fengIdx = 2;
        }

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 5;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 1;
        }
        // else if (this._playNode_maxPlayer2.isSelected()) {
        //     para.maxPlayer = 2;
        //     _countIdx = 2;
        // }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_linfendoudizhu_playerNumber, _countIdx);
        //扣底加级
        para.koudi = this._play_koudijiaji.isSelected();
        //庄家单打赢双倍
        para.zhuangdanjiabei = this._play_ddysb.isSelected();
        //翻牌
        para.fanpai = this._play_fanpai.isSelected();
        //直接开始
        para.juststart = this._play_juststart.isSelected();
        //反主不抠底
        para.fanZhuBuKouDi = this._play_fanZhuBuKouDi.isSelected();

        // para.difen = parseInt(this._ZhuNum.getString());
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        // para.maxPlayer = 5;
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliangdaqi_fengding, _fengIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_koudijiaji, para.koudi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_ddsb, para.zhuangdanjiabei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_fanpai, para.fanpai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_juststart, para.juststart);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_fanzhubukoudi, para.fanZhuBuKouDi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lvliangdaqi_difen, this._zhuIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lvliangdaqi_gps,  para.gps);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});