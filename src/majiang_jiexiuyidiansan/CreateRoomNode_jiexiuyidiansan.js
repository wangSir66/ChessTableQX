/**
 * Created by wuchengchao on 2018/3/21.
 */


var CreateRoomNode_jiexiuyidiansan = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_jiexiuyidiansan_difen            = "_JIE_XIU_YI_DIAN_SAN_DI_FEN";          //底分
        this.localStorageKey.KEY_jiexiuyidiansan_gameType         = "_JIE_XIU_YI_DIAN_SAN_GAME_TYPE";       //玩法
        this.localStorageKey.KEY_jiexiuyidiansan_count            = "_JIE_XIU_YI_DIAN_SAN_COUNT";           //人数

        this.localStorageKey.KEY_jiexiukoudian_guozi              = "_JIE_XIU_KOU_DIAN_GUOZI";              //锅子
        this.localStorageKey.KEY_jiexiukoudian_liuduo             =    "_JIE_XIU_KOU_DIAN_LIUDUO";          //留剁
        this.localStorageKey.KEY_jiexiukoudian_lunzhuang          =    "_JIE_XIU_KOU_DIAN_LUNZHUANG";       //轮庄
        this.localStorageKey.KEY_jiexiukoudian_gps                = "_JIE_XIU_KOU_DIAN_GPS";                //防作弊

        this.localStorageKey.KEY_jiexiuyidiansan_liuduo           = "_JIE_XIU_YI_DIAN_SAN_LIU_DUO";       //留垛
        this.localStorageKey.KEY_jiexiuyidiansan_baoting          = "_JIE_XIU_YI_DIAN_SAN_BAO_TING";      //报听
        this.localStorageKey.KEY_jiexiuyidiansan_daizhuang        = "_JIE_XIU_YI_DIAN_SAN_DAI_ZHUANG";    //带庄家
        this.localStorageKey.KEY_jiexiuyidiansan_daifeng          = "_JIE_XIU_YI_DIAN_SAN_DAI_FENG";      //带风
        this.localStorageKey.KEY_jiexiuyidiansan_gshz             = "_JIE_XIU_YI_DIAN_SAN_GSHZ";          //杠随胡走
        this.localStorageKey.KEY_jiexiuyidiansan_dahu             = "_JIE_XIU_YI_DIAN_SAN_DA_HU";         //大胡
        this.localStorageKey.KEY_jiexiuyidiansan_zimohu           = "_JIE_XIU_YI_DIAN_SAN_ZI_MO_HU";      //自摸胡
        this.localStorageKey.KEY_jiexiuyidiansan_dpsg             = "_JIE_XIU_YI_DIAN_SAN_DPSG";          //点炮烧杠
        this.localStorageKey.KEY_jiexiuyidiansan_lunzhuang        = "_JIE_XIU_YI_DIAN_SAN_LUN_ZHUANG";  //轮庄
    },
    initAll:function(IsFriendCard)
    {
        //if (!IsFriendCard)
        this.setKey();

        this.bg_node = ccs.load("bg_jiexiuyidiansan.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jiexiuyidiansan");
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
        //玩法
        var _play = this.playScroll.getChildByName("play");

        var btn_create_diamond = this.bg_node.getChildByName("btn_create_diamond");

        this._text_tip = btn_create_diamond.getChildByName("text_tip");
        this._text_tip.ignoreContentAdaptWithSize(true);

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
		
        this._play_guozi = _play.getChildByName("play_guozi");
        this.addListenerText(this._play_guozi);
        this._play_guozi.addEventListener(this.clickCB, this._play_guozi);

        this._play_liuduo_1 = _play.getChildByName("play_liuduo_1");
        this.addListenerText(this._play_liuduo_1);
        this._play_liuduo_1.addEventListener(this.clickCB, this._play_liuduo_1);

        this._play_lunzhuang_1 = _play.getChildByName("play_lunzhuang_1");
        this.addListenerText(this._play_lunzhuang_1);
        this._play_lunzhuang_1.addEventListener(this.clickCB, this._play_lunzhuang_1);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);


        var option_name = [ "liuduo", "baoting", "daizhuang", "daifeng", 
                        "gangsuihuzou", "dahu", "mustzimo", "dianpaoshaogang", "lunzhuang"];

        var option_node = [ "play_liuduo", "play_baoting", "play_daizhuang", "play_daifeng", 
                        "play_gshz", "play_dahu", "play_zimohu", "play_dpsg", "play_lunzhuang"]
                        
        var optionList = [];

        for(var i = 0; i < option_node.length; i++){
            var option = {};
            option.node = _play.getChildByName(option_node[i]);
            option.name = option_name[i]
            option.localKey = ""
            optionList.push(option);
        }

        this._optionList = optionList;

        for(var i = 0; i < this._optionList.length; i++){
            this.addListenerText(this._optionList[i].node);
            this._optionList[i].node.addEventListener(this.clickCB, this._optionList[i].node);
            switch (this._optionList[i].name)
            {
                case "liuduo":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_liuduo;
                    break;
                case "baoting":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_baoting;
                    break;
                case "daizhuang":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_daizhuang;
                    break;
                case "daifeng":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_daifeng;
                    break;
                case "gangsuihuzou":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_gshz;
                    break;
                case "dahu":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_dahu;
                    break;
                case "mustzimo":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_zimohu;
                    break;
                case "dianpaoshaogang":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_dpsg;
                    break;
                case "lunzhuang":
                    this._optionList[i].localKey = this.localStorageKey.KEY_jiexiuyidiansan_lunzhuang;
                    break;
                default :
                break;
            }
        }

        //玩法
        this._playNode_gameType0 = _play.getChildByName("play_type0");
        this._playNode_gameType1 = _play.getChildByName("play_type1");
        // this._playNode_gameType1.setVisible(false);//屏蔽介休扣点
        var nodeGameTypeList1 = [];
        nodeGameTypeList1.push(_play.getChildByName("play_type0"));
        nodeGameTypeList1.push(_play.getChildByName("play_type1"));
        this._playNode_game_type_radio = createRadioBoxForCheckBoxs(nodeGameTypeList1, function(index){
            this.showPlayType(index);
            this.radioBoxSelectCB(index, nodeGameTypeList1[index], nodeGameTypeList1);
        }.bind(this));
        this.addListenerText(nodeGameTypeList1, this._playNode_game_type_radio, this.showPlayType.bind(this));
        this._gameTypelist = nodeGameTypeList1;

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _play.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _play.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
           if (type == 2) {
               this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
               this._ZhuNum.setString(_fenshu[this._zhuIdx]);
               this.setRoomCardModeFree();
           }
        }, this);
        this._Button_add = _play.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
           if (type == 2) {
               this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
               this._ZhuNum.setString(_fenshu[this._zhuIdx]);
               this.setRoomCardModeFree();
           }
        }, this);
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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //玩法
        var _gameType;
        if (isclub) {
            _gameType = this.getNumberItem("gameType", 0);
            if (_gameType == MjClient.GAME_TYPE.JIE_XIU_KOU_DIAN) _gameType = 1;
            else _gameType = 0;
        }
        else{
            _gameType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_gameType, 0);
        }
        this._playNode_game_type_radio.selectItem(_gameType);
        this.radioBoxSelectCB(_gameType, this._gameTypelist[_gameType], this._gameTypelist);
        this.showPlayType(_gameType);

        //锅子
        var _guozi;
        if(isclub){
            _guozi = this.getNumberItem("guozi", 0); 
        }else{
            _guozi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jiexiukoudian_guozi, 0);
        }
        this._play_guozi.setSelected(_guozi>0);
        var text = this._play_guozi.getChildByName("text");
        this.selectedCB(text,_guozi>0);


        var _liuduo_1;
        if(isclub){
            _liuduo_1 = this.getBoolItem("liuduo", false); 
        }else{
            _liuduo_1 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jiexiukoudian_liuduo, false);
        }
        this._play_liuduo_1.setSelected(_liuduo_1);
        var text = this._play_liuduo_1.getChildByName("text");
        this.selectedCB(text, _liuduo_1);

        var _lunzhuang_1;
        if(isclub){
            _lunzhuang_1 =  this.getBoolItem("lunzhuang", false); 
        }else{
            _lunzhuang_1 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jiexiukoudian_lunzhuang, true);
        }
        this._play_lunzhuang_1.setSelected(_lunzhuang_1);
        var text = this._play_lunzhuang_1.getChildByName("text");
        this.selectedCB(text, _lunzhuang_1);

        //防作弊
        var _gps;
        if(isclub){
            _gps = this.getBoolItem("gps", false);
        }else{
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jiexiukoudian_gps, false);
        }
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //option
        for(var i = 0; i < this._optionList.length; i++){
            var name = this._optionList[i].name
            var local;
            if(isclub){
                if (name == "liuduo" || name == "baoting" || name == "daizhuang" 
                    || name == "daifeng" || name == "lunzhuang" || name == "gangsuihuzou") {
                    local = this.getBoolItem(name, true);
                }else{
                    local = this.getBoolItem(name, false);
                }
            }else{
                if (name == "liuduo" || name == "baoting" || name == "daizhuang" 
                    || name == "daifeng" || name == "lunzhuang" || name == "gangsuihuzou") {
                    local = util.localStorageEncrypt.getBoolItem(this._optionList[i].localKey, true);
                }else{
                    local = util.localStorageEncrypt.getBoolItem(this._optionList[i].localKey, false);
                }
            }
            this._optionList[i].node.setSelected(local);
            var text = this._optionList[i].node.getChildByName("text");
            this.selectedCB(text,local);
        }

        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isclub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIE_XIU_1_DIAN_3;
        para.maxPlayer = 4;
        para.convertible = false;//是否自由人数
        //para.difen = 1;
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

        para.difen = this._ZhuNum.getString();

        //玩法
        var _gameTypeIdx =0;
        if (this._playNode_gameType0.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.JIE_XIU_1_DIAN_3;
            _gameTypeIdx = 0;
        }
        else if (this._playNode_gameType1.isSelected()) {
            para.gameType = MjClient.GAME_TYPE.JIE_XIU_KOU_DIAN;
            _gameTypeIdx = 1;
        }

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jiexiuyidiansan_gameType, _gameTypeIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jiexiukoudian_gps,  para.gps);
        }

        if (para.gameType == MjClient.GAME_TYPE.JIE_XIU_KOU_DIAN)
        {
            if (this._play_guozi.isSelected()) {
                para.guozi = 100;
            }
            else {
                para.guozi = 0;
            }
            para.liuduo = this._play_liuduo_1.isSelected();
            para.lunzhuang = this._play_lunzhuang_1.isSelected();
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jiexiukoudian_guozi , para.guozi);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jiexiukoudian_liuduo,  para.liuduo);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jiexiukoudian_lunzhuang,  para.lunzhuang);
            }
        }
        else if (para.gameType == MjClient.GAME_TYPE.JIE_XIU_1_DIAN_3)
        {
            for(var i = 0; i < this._optionList.length; i++){
                var select = this._optionList[i].node.isSelected();
                switch (this._optionList[i].localKey)
                {
                    case this.localStorageKey.KEY_jiexiuyidiansan_liuduo:
                        para.liuduo = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_baoting:
                        para.baoting = select; 
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_daizhuang:
                        para.daizhuang = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_daifeng:
                        para.daifeng = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_gshz:
                        para.gangsuihuzou = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_dahu:
                        para.dahu = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_zimohu:
                        para.mustzimo = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_dpsg:
                        para.dianpaoshaogang = select;
                        break;
                    case this.localStorageKey.KEY_jiexiuyidiansan_lunzhuang:
                        para.lunzhuang = select;
                        break;
                    default: 
                    break;
                }
                if (!this._isFriendCard) {
                    util.localStorageEncrypt.setBoolItem(this._optionList[i].localKey,  select);
                }
            }
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function(select_number)
    {
        for(var i = 0; i < this._optionList.length; i++){
            this._optionList[i].node.setVisible(true);
        }
        this._play_guozi.setVisible(true);
        this._play_liuduo_1.setVisible(true);
        this._play_lunzhuang_1.setVisible(true);
        this._text_tip.setVisible(true);
        if (select_number == 1)//选择扣点时隐藏1点3的选项
        {
            for(var i = 0; i < this._optionList.length; i++){
                this._optionList[i].node.setVisible(false);
            }
        }
        else{
            this._play_guozi.setVisible(false);
            this._play_liuduo_1.setVisible(false);
            this._play_lunzhuang_1.setVisible(false);
            this._text_tip.setVisible(false);
        }
    },
});