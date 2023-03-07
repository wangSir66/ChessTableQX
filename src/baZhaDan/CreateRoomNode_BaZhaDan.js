/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_BaZhaDan = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        this._costName = '黄金';
        
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxPlayer       = "_BaZhaDanSY_maxPlayer";          //几人玩
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_deckNum    = "_BaZhaDanSY_deckNum";       //牌数
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxScore      = "_BaZhaDanSY_maxScore";         //最大分数
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_isDivideTeam      = "_BaZhaDanSY_isDivideTeam";         //是否分组
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_showLeft = "_BaZhaDanSY_showLeft";   //显示剩余牌
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasKing = "_BaZhaDanSY_hasKing";   //是否带双王
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_addKing = "_BaZhaDanSY_addKing";   //是否加双王
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_noKing = "_BaZhaDanSY_noKing";   //不要王
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_isRandomTeam = "_BaZhaDanSY_isRandomTeam";   //是否随机分组
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieFengType = "_BaZhaDanSY_jieFengType";   //接风类型
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_shunType = "_BaZhaDanSY_shunType";   //顺子类型
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasXiFen = "_BaZhaDanSY_hasXiFen";   //是否有炸弹喜分
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_isNo34 = "_BaZhaDanSY_isNo34";   //是否去掉34
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_isAnCards = "_BaZhaDanSY_isAnCards";   //是否暗牌
        this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieSuanDiFen = "_BaZhaDanSY_jieSuanDiFen";   //积分底分

        this.roundNumObj = {roundNum1:300, roundNum2:300, roundNum3:500};

        this.bg_node = ccs.load("bg_BaZhaDan.json").node;
        this.addChild(this.bg_node);
        this.jieSuanDiFen = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("jieSuanDiFen");
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_BaZhaDan.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));

        var deckNumList = [];
        deckNumList.push(_play.getChildByName("deckNum1"));
        deckNumList.push(_play.getChildByName("deckNum2"));
        deckNumList.push(_play.getChildByName("deckNum3"));
        this.deckNumList_radio = createRadioBoxForCheckBoxs(deckNumList,this.radioBoxSelectCB_BaZhaDan.bind(this));
        cc.eventManager.addListener(this.setTextClick(deckNumList,0,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(deckNumList,1,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(deckNumList,2,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[2].getChildByName("text"));

        var maxScoreList = [];
        maxScoreList.push(_play.getChildByName("maxScore1"));
        maxScoreList.push(_play.getChildByName("maxScore2"));
        this.maxScoreList_radio = createRadioBoxForCheckBoxs(maxScoreList,this.radioBoxSelectCB_BaZhaDan.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxScoreList,0,this.maxScoreList_radio,this.checkSelect.bind(this)),maxScoreList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxScoreList,1,this.maxScoreList_radio,this.checkSelect.bind(this)),maxScoreList[1].getChildByName("text"));

        var teamList = [];
        teamList.push(_play.getChildByName("team1"));
        teamList.push(_play.getChildByName("team2"));
        teamList.push(_play.getChildByName("team3"));
        _play.getChildByName("team3").ignoreContentAdaptWithSize(true);
        this.teamList_radio = createRadioBoxForCheckBoxs(teamList,this.radioBoxSelectCB_BaZhaDan.bind(this));
        cc.eventManager.addListener(this.setTextClick(teamList,0,this.teamList_radio, this.checkSelect.bind(this)),teamList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(teamList,1,this.teamList_radio, this.checkSelect.bind(this)),teamList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(teamList,2,this.teamList_radio, this.checkSelect.bind(this)),teamList[2].getChildByName("text"));

        var jieFengType = [];
        jieFengType.push(_play.getChildByName("jieFengType1"));
        jieFengType.push(_play.getChildByName("jieFengType2"));
        this.jieFengType_radio = createRadioBoxForCheckBoxs(jieFengType,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(jieFengType,0,this.jieFengType_radio),jieFengType[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(jieFengType,1,this.jieFengType_radio),jieFengType[1].getChildByName("text"));

        this.showLeft = _play.getChildByName("shengYuPai");
        this.showLeft.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.showLeft.getChildByName("text"));
        this.showLeft.addEventListener(this._clickCB.bind(this), this.showLeft);

        this.hasKing = _play.getChildByName("hasKing");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hasKing.getChildByName("text"));
        this.hasKing.addEventListener(this._clickCB.bind(this), this.hasKing);

        this.addKing = _play.getChildByName("addKing");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.addKing.getChildByName("text"));
        this.addKing.addEventListener(this._clickCB.bind(this), this.addKing);

        this.noKing = _play.getChildByName("noKing");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.noKing.getChildByName("text"));
        this.noKing.addEventListener(this._clickCB.bind(this), this.noKing);

        this.hasXiFen = _play.getChildByName("hasXiFen");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hasXiFen.getChildByName("text"));
        this.hasXiFen.addEventListener(this._clickCB.bind(this), this.hasXiFen);

        this.isNo34 = _play.getChildByName("isNo34");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.isNo34.getChildByName("text"));
        this.isNo34.addEventListener(this._clickCB.bind(this), this.isNo34);

        this.anCards = _play.getChildByName("anCards");
        cc.eventManager.addListener(this.setTextClick(),this.anCards.getChildByName("text"));
        this.anCards.getChildByName("text").ignoreContentAdaptWithSize(true);
        this.anCards.addEventListener(this._clickCB.bind(this), this.anCards);

        var shunTypeList = [];
        shunTypeList.push(_play.getChildByName("shunZiType1"));
        shunTypeList.push(_play.getChildByName("shunZiType2"));
        this.shunTypeList_radio = createRadioBoxForCheckBoxs(shunTypeList,this.radioBoxSelectCB_BaZhaDan.bind(this));
        cc.eventManager.addListener(this.setTextClick(shunTypeList,0,this.shunTypeList_radio,this.checkSelect.bind(this)),shunTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(shunTypeList,1,this.shunTypeList_radio,this.checkSelect.bind(this)),shunTypeList[1].getChildByName("text"));

        // this.schedule(function(sender,type)
        // {
        //     var index = this.maxPlayerList_radio.getSelectIndex();
        //     if (MjClient.MaxPlayerNum_leiyang != 4 - index)
        //     {
        //         MjClient.MaxPlayerNum_leiyang = 4 - index;
        //         this.changeAAPayForPlayerNum();
        //     }
        //     //this.qianggangquanbao.setVisible(this.qiangganghu.isSelected());
        // },0.1);

        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex -= 1;
                if(fenIndex < 0){
                    fenIndex = diFenArr.length-1;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex += 1;
                if(fenIndex >= diFenArr.length){
                    fenIndex = 0;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
        }
    },

    _clickCB : function(sender,type){
        cc.log(sender == this.anCards);
        if(sender.name == "addKing" || sender.name == "noKing"){
            this.checkSelect(type,sender);
        }
        this._super(sender,type);
    },

    radioBoxSelectCB_BaZhaDan : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect(index, sender);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:2}[this.getNumberItem("maxPlayer", 4)];
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _deckNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_deckNum, 1);
        if (atClub){
            _deckNum = {1:0, 2:1, 3:2}[this.getNumberItem("deckNum", 2)];
        }
        _deckNum = _deckNum > 2 ? 0 : _deckNum;
        this.deckNumList_radio.selectItem(_deckNum);
        list = [];
        list.push(_play.getChildByName("deckNum1"));
        list.push(_play.getChildByName("deckNum2"));
        list.push(_play.getChildByName("deckNum3"));
        this.radioBoxSelectCB(_deckNum,list[_deckNum],list);

        var _isDivideTeam = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isDivideTeam, false);
        if (atClub){
            _isDivideTeam = this.getBoolItem("isDivideTeam", false);
        }
        _isDivideTeam = _isDivideTeam ? 1 : 0;
        this.teamList_radio.selectItem(_isDivideTeam);
        list = [];
        list.push(_play.getChildByName("team1"));
        list.push(_play.getChildByName("team2"));
        list.push(_play.getChildByName("team3"));
        this.radioBoxSelectCB(_isDivideTeam,list[_isDivideTeam],list);

        //随机分组特殊处理
        var _isRandomTeam = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isRandomTeam, false);
        if (atClub){
            _isRandomTeam = this.getBoolItem("isRandomTeam", false);
        }
        if(_isRandomTeam){
            this.teamList_radio.selectItem(2);
            list = [];
            list.push(_play.getChildByName("team1"));
            list.push(_play.getChildByName("team2"));
            list.push(_play.getChildByName("team3"));
            this.radioBoxSelectCB(2,list[2],list);
        }

        var _jieFengType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieFengType, 0);
        if (atClub){
            _jieFengType = this.getNumberItem("jieFengType", 0);
        }
        this.jieFengType_radio.selectItem(_jieFengType);
        list = [];
        list.push(_play.getChildByName("jieFengType1"));
        list.push(_play.getChildByName("jieFengType2"));
        this.radioBoxSelectCB(_jieFengType,list[_jieFengType],list);

        var _maxScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxScore, 1);
        if (atClub){
            _maxScore = {300:0, 500:1}[this.getNumberItem("scoreLine", 500)];
        }
        this.maxScoreList_radio.selectItem(_maxScore);
        list = [];
        list.push(_play.getChildByName("maxScore1"));
        list.push(_play.getChildByName("maxScore2"));
        this.radioBoxSelectCB(_maxScore,list[_maxScore],list);

        var _showLeft = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_showLeft, true);
        if (atClub){
            _showLeft = this.getBoolItem("isShowLeft", true);
        }
        this.showLeft.setSelected(_showLeft);
        var txt = this.showLeft.getChildByName("text");
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;
        if(_showLeft){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hasKing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasKing, false);
        if (atClub){
            _hasKing = this.getBoolItem("hasJoker", false);
        }
        this.hasKing.setSelected(_hasKing);
        var txt = this.hasKing.getChildByName("text");
        if(_hasKing){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _addKing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_addKing, false);
        if (atClub){
            _addKing = this.getBoolItem("addJoker", false);
        }
        this.addKing.setSelected(_addKing);
        var txt = this.addKing.getChildByName("text");
        if(_addKing){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _noKing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_noKing, false);
        if (atClub){
            _noKing = this.getBoolItem("noJoker", false);
        }
        this.noKing.setSelected(_noKing);
        var txt = this.noKing.getChildByName("text");
        if(_noKing){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hasXiFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasXiFen, false);
        if (atClub){
            _hasXiFen = this.getBoolItem("hasXiFen", false);
        }
        this.hasXiFen.setSelected(_hasXiFen);
        var txt = this.hasXiFen.getChildByName("text");
        if(_hasXiFen){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _anCards = false;
        if (atClub){
            _anCards = this.getBoolItem("isAnCards", false);
        }else{
            _anCards = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isAnCards, false);
        }
        this.anCards.setSelected(_anCards);
        var txt = this.anCards.getChildByName("text");
        txt.setTextColor(_anCards ? selectColor : unSelectColor);

        var _isNo34 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isNo34, false);
        if (atClub){
            _isNo34 = this.getBoolItem("isNo34", false);
        }
        this.isNo34.setSelected(_isNo34);
        var txt = this.isNo34.getChildByName("text");
        if(_isNo34){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _shunType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_shunType, 0);
        if (atClub){
            _shunType = this.getNumberItem("shunType", 0);
        }
        this.shunTypeList_radio.selectItem(_shunType);
        list = [];
        list.push(_play.getChildByName("shunZiType1"));
        list.push(_play.getChildByName("shunZiType2"));
        this.radioBoxSelectCB(_shunType,list[_shunType],list);

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (atClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }

        this.checkSelect();

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    setBoxStatus : function(box, isSelected, visible){
        if(isSelected != undefined){
            box.setSelected(isSelected);
            var txt = box.getChildByName("text");
            if(isSelected){
                txt.setTextColor(MjClient.createRoomNode._selectColor);
            }else{
                txt.setTextColor(MjClient.createRoomNode._unSelectColor);
            }
        }
        box.visible = visible;
    },

    checkSelect : function(idx, sender){

        cc.log("checkSelect...");

        //合法性检查 
        var maxPlayer= [4,3,2][this.maxPlayerList_radio.getSelectIndex()];

        var _play = this.bg_node.getChildByName("play");
        var team1 = _play.getChildByName("team1");
        var team2 = _play.getChildByName("team2");
        var team3 = _play.getChildByName("team3");
        var jieFeng1 = _play.getChildByName("jieFengType1");
        var jieFeng2 = _play.getChildByName("jieFengType2");
        var fenzu = this.bg_node.getChildByName("fenzu");
        var deckNum3 = _play.getChildByName("deckNum3");

        if(sender) {
            var name = sender.getName();
            var deckIdx = this.deckNumList_radio.getSelectIndex();
            if(name.indexOf("maxPlayer") >= 0 && maxPlayer != 4 && deckIdx == 2) {
                this.deckNumList_radio.selectItem(1);
            }

            //加双王 不要王互斥
            if(name == "noKing" && this.noKing.isSelected()) {
                this.addKing.setSelected(false);
                this.setItemColor(this.addKing.getChildByName("text"), false);
            }else if(name == "addKing" && this.addKing.isSelected()) {
                this.noKing.setSelected(false);
                this.setItemColor(this.noKing.getChildByName("text"), false);
            }
        }

        if(maxPlayer == 4){
            team1.visible = true;
            team2.visible = true;
            team3.visible = true;
            fenzu.visible = true;
            jieFeng1.visible = true;
            jieFeng2.visible = true;
            var index = this.teamList_radio.getSelectIndex();
            if(index == 0){
                jieFeng1.visible = false;
                jieFeng2.visible = false;
            }

            deckNum3.visible = true;

        }else if(maxPlayer== 3 || maxPlayer == 2){
            team1.visible = false;
            team2.visible = false;
            team3.visible = false;
            fenzu.visible = false;
            jieFeng1.visible = false;
            jieFeng2.visible = false;
            deckNum3.visible = false;
        }

        var index = this.deckNumList_radio.getSelectIndex();
        this.addKing.visible = false;
        this.noKing.visible = false;
        this.hasKing.visible = true;
        if(index == 0){
            //一副牌
            this.hasXiFen.visible = false;
        }else{
            this.hasXiFen.visible = true;
            if(index == 2) {
                this.addKing.visible = true;
                this.noKing.visible = true;
                this.hasKing.visible = false;
            }
        }

        this.setDiaNumData_BaZhaDan();
    },

    setItemColor : function(txt, isSelected) {
        if(isSelected){
            txt.setTextColor(MjClient.createRoomNode._selectColor);
        }else{
            txt.setTextColor(MjClient.createRoomNode._unSelectColor);
        }
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var scoreIndex = this.maxScoreList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.LONG_HUI_BA_ZHA_DAN;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.scoreLine = [300,500][scoreIndex];
        para.deckNum = [1,2,3][this.deckNumList_radio.getSelectIndex()];
        para.isDivideTeam = this.teamList_radio.getSelectIndex() == 1;
        para.isRandomTeam = this.teamList_radio.getSelectIndex() == 2;
        para.isShowLeft = this.showLeft.isSelected();
        para.hasJoker = this.hasKing.isSelected();
        para.addJoker = this.addKing.isSelected();
        para.noJoker = this.noKing.isSelected();
        para.jieFengType = this.jieFengType_radio.getSelectIndex(); //0 队友接风 1 下家接风
        para.hasXiFen = this.hasXiFen.isSelected(); //是否有炸弹喜分
        para.shunType = this.shunTypeList_radio.getSelectIndex(); //0 顺子到2  1 顺子到小王
        para.isNo34 = this.isNo34.isSelected();
        para.isAnCards = this.anCards.isSelected();
        if(para.maxPlayer < 4){
            para.isDivideTeam = false;
        }
        if(para.isRandomTeam){
            para.isDivideTeam = true;
        }
        if(para.deckNum == 1){
            para.hasXiFen = false;
        }
        if(para.deckNum == 3){
            para.hasJoker = true;
            if(para.noJoker) {
                para.hasJoker = false;
            }
        }else {
            //1/2副牌时没有addJoker noJoker
            para.addJoker = false;
            para.noJoker = false;
        }
        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var scoreIndex = this.maxScoreList_radio.getSelectIndex();

        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxPlayer, maxPlayerIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_deckNum, this.deckNumList_radio.getSelectIndex());
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_maxScore, scoreIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isDivideTeam, para.isDivideTeam);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isRandomTeam, para.isRandomTeam);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_showLeft, para.isShowLeft);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasKing, para.hasJoker);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_addKing, para.addJoker);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_noKing, para.noJoker);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieFengType, para.jieFengType);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_shunType, para.shunType);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_hasXiFen, para.hasXiFen);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isNo34, para.isNo34);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_isAnCards, para.isAnCards);
        if(this.jieSuanDiFen){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BaZhaDan_ShaoYang_jieSuanDiFen, para.jieSuanDiFen);
        }
    },

    setDiaNumData : function(gameNode) {
        this._super(gameNode);
        this.setDiaNumData_BaZhaDan();
    },

    getSelectedRoundNum:function() //重写父类获取局数的方法
    {
        var scoreIndex = this.maxScoreList_radio.getSelectIndex();
        return  [300,500][scoreIndex];
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        // this.setDiaNumData_BaZhaDan();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_BaZhaDan();
    },

    setDiaNumData_BaZhaDan : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var play = this.bg_node.getChildByName("play");
        var text600 = play.getChildByName("maxScore1").getChildByName("text_0");
        var text1000 = play.getChildByName("maxScore2").getChildByName("text_0");
        text600.ignoreContentAdaptWithSize(true);
        text1000.ignoreContentAdaptWithSize(true);
        text600.setString("(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum2, payWay) + this._costName + ")");
        text1000.setString("(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum3, payWay) + this._costName + ")");

        var price = this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), payWay);
        var _btn_create_diamond = this.bg_node.parent.getChildByName("btn_create_diamond");
        var dia_num = _btn_create_diamond.getChildByName("dia_num");
        dia_num.ignoreContentAdaptWithSize(true);
        dia_num.setString("" + price);
        this.resetBtnCreateDiamond(_btn_create_diamond, price);
    }
});