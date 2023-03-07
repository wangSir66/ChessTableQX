/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_fenxiyingkou = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_fenxi_gameType       = "_FEN_XI_GAME_TYPE";  //玩法
        this.localStorageKey.KEY_fenxi_difen      = "_FEN_XI_DI_FEN";     //底分
        this.localStorageKey.KEY_fenxi_zhuangfen      = "_FEN_XI_ZHUANG_FEN"; //庄分
        this.localStorageKey.KEY_fenxi_count           = "_FEN_XI_COUNT";      //人数
        this.localStorageKey.KEY_fenxi_daifenghu     = "_FEN_XI_DAI_FENG_HU"; //带风胡
        this.localStorageKey.KEY_fenxi_gshz     = "_FEN_XI_GSHZ"; //杠随胡走
        this.localStorageKey.KEY_fenxi_agbkj      = "_FEN_XI_AGBKJ"; //暗杠不可见
        this.localStorageKey.KEY_fenxi_gps      = "_FEN_XI_GPS"; //防作弊
        this.localStorageKey.KEY_fenxi_lunzhuang      = "_FEN_XI_LUN_ZHUANG"; //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_fenxiyingkou.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_fenxiyingkou");
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
        this._text_tip = this.bg_node.getChildByName("btn_create_diamond").getChildByName("text_tip");

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


        // this._playNode_fenxiyingkou = _play.getChildByName("play_fenxiyingkou");
        // this.addListenerText(this._playNode_fenxiyingkou);
        // this._playNode_fenxiyingkou.addEventListener(this.clickCB, this._playNode_fenxiyingkou);
        // 玩法
        var nodeCounList=[];
        this._playNode_fenxiyingkou=_play.getChildByName("play_fenxiyingkou");
        //加新玩法Here
        nodeCounList.push(this._playNode_fenxiyingkou);
        this._playNode_gametype_radio=createRadioBoxForCheckBoxs(nodeCounList,function(index){
            this.showPlayType(index);
            this.radioBoxSelectCB(index,nodeCounList[index],nodeCounList);
        }.bind(this));
        this.addListenerText(nodeCounList,this._playNode_gametype_radio,this.showPlayType.bind(this));
        this._gametype=nodeCounList;


        // 庄分
        this._playNode_zhuangfen = _play.getChildByName("play_zhuangfen");
        this.addListenerText(this._playNode_zhuangfen);
        this._playNode_zhuangfen.addEventListener(this.clickCB, this._playNode_zhuangfen);

        // 带风胡
        this._playNode_daifenghu = _play.getChildByName("play_daifenghu");
        this.addListenerText(this._playNode_daifenghu);
        this._playNode_daifenghu.addEventListener(this.clickCB, this._playNode_daifenghu);

        // 暗杠不可见
        this._playNode_angangbukejian = _play.getChildByName("play_angangbukejian");
        this.addListenerText(this._playNode_angangbukejian);
        this._playNode_angangbukejian.addEventListener(this.clickCB, this._playNode_angangbukejian);

        // 杠随胡走
        this._playNode_gangsuihuzou = _play.getChildByName("play_gangsuihuzou");
        this._playNode_gangsuihuzou.setVisible(false);
        this.addListenerText(this._playNode_gangsuihuzou);
        this._playNode_gangsuihuzou.addEventListener(this.clickCB, this._playNode_gangsuihuzou);


        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        // var option=["play_zhuangfen","play_daifenghu","play_angangbukejian","play_gangsuihuzou","play_gps"];

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
    },
    setPlayNodeCurrentSelect: function(isClub) {

        // 玩法
        // var _gametype = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_gameType, 0);
        // this._playNode_game_type_radio.selectItem(_gametype);
        // this.radioBoxSelectCB(_gametype, this._gameTypelist[_gametype], this._gameTypelist);
        // this.showPlayType(_gametype);


        // 庄分
        var _zhuangfen;
        if(isClub)
            _zhuangfen=this.getBoolItem("zhuangfen2",false);
        else
            _zhuangfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_zhuangfen, true);
        this._playNode_zhuangfen.setSelected(_zhuangfen);
        var text = this._playNode_zhuangfen.getChildByName("text");
        this.selectedCB(text, _zhuangfen);

        // 带风胡
        var _daifenghu;
        if(isClub)
            _daifenghu=this.getBoolItem("isDaiFeng",false);
        else
            _daifenghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_daifenghu, false);
        this._playNode_daifenghu.setSelected(_daifenghu);
        var text = this._playNode_daifenghu.getChildByName("text");
        this.selectedCB(text, _daifenghu);

        // 暗杠不可见
        var _angangbukajian;
        if(isClub)
            _angangbukajian=this.getBoolItem("angangbukejian",false);
        else
            _angangbukajian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_agbkj, false);
        this._playNode_angangbukejian.setSelected(_angangbukajian);
        var text = this._playNode_angangbukejian.getChildByName("text");
        this.selectedCB(text, _angangbukajian);

        // 杠随胡走
        var _gangsuihuzou;
        if(isClub)
            _gangsuihuzou=this.getBoolItem("gangsuihu",false);
        else
             _gangsuihuzou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_gshz, true);
        this._playNode_gangsuihuzou.setSelected(_gangsuihuzou);
        var text = this._playNode_gangsuihuzou.getChildByName("text");
        this.selectedCB(text, _gangsuihuzou);

        // 轮庄
        var _lunzhuang;
        if(isClub)
            _lunzhuang=this.getBoolItem("lunzhuang",true);
        else
            _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_count, 4);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

/*        var _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jinzhong_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);*/

        //玩法
        var _gameType;
        if(isClub)
            _gameType = this.getNumberItem("gameType", 0);
        else
            _gameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fenxi_gameType, 0);
        this._playNode_gametype_radio.selectItem(_gameType);
        this.radioBoxSelectCB(_gameType, this._gametype[_gameType], this._gametype);
        this.showPlayType(_gameType);

        //底分
        var _fenshu = [1,2,3,4,5,10,20,50,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _idx;
        if(isClub)
            _idx = _fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_fenxi_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if(isClub)
            _gps = this.getBoolItem("gps",false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_fenxi_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.FEN_XI_YING_KOU;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        para.difen = 1;
        para.convertible = false;//是否自由人数
        //para.gps = !!this._bGPS.isSelected();
        // if(this._nodeGPS) para.gps = this.._nodeGPSisSelected()

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
        
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jinzhong_count, _countIdx)


        // 庄分
        para.zhuangfen2 = this._playNode_zhuangfen.isSelected();

        // 带风胡
        para.isDaiFeng = this._playNode_daifenghu.isSelected();

        // 暗杠不可见
        para.angangbukejian = this._playNode_angangbukejian.isSelected();

        // 杠随胡走
        // para.gangsuihu = this._playNode_gangsuihuzou.isSelected();
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_gshz,  para.gangsuihu);
        para.gangsuihu=true;
        //底分默认1
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        //轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fenxi_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_zhuangfen,  para.zhuangfen2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_daifenghu,  para.isDaiFeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_agbkj,  para.angangbukejian);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_fenxi_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_gps,  para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_fenxi_lunzhuang,  para.lunzhuang);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function(select_number)
    {
        this._playNode_zhuangfen.setVisible(true);
        this._playNode_daifenghu.setVisible(true);
        this._playNode_angangbukejian.setVisible(true);
        this._text_tip.setVisible(true);
        if (select_number == 1)//选择别的玩法时隐藏硬扣选项
        {
            this._playNode_zhuangfen.setVisible(false);
            this._playNode_daifenghu.setVisible(false);
            this._playNode_angangbukejian.setVisible(false);
            this._text_tip.setVisible(false);
        }
        else{

        }
    },
});