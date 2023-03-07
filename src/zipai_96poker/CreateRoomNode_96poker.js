//96扑克
var CreateRoomNode_96poker = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this.localStorageKey.KEY_ZI_PAI_96POKER_maxPlayer           = "_96Poker_maxPlayer";             //几人玩
        this.localStorageKey.KEY_ZI_PAI_96POKER_area                = "_96Poker_area";                  //地区
        this.localStorageKey.KEY_ZI_PAI_96POKER_scoreType           = "_96Poker_scoreType";             //算分
        this.localStorageKey.KEY_ZI_PAI_96POKER_isShuangLongBaoZhu  = "_isShuangLongBaoZhu";            //双龙特殊牌型
        this.localStorageKey.KEY_ZI_PAI_96POKER_isPutCardInvalid    = "_96Poker_isPutCardInvalid";      //打出的牌作废
        this.localStorageKey.KEY_ZI_PAI_96POKER_isNoZhuaZhu         = "_96Poker_isNoZhuaZhu";           //无牌打是否抓猪
        this.localStorageKey.KEY_ZI_PAI_96POKER_piaoFen             = "_96Poker_piaoFen";               //飘分
     
        this.setExtraKey({
            fanBei: "_96POKER_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_96POKER_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_96POKER_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:8, roundNum2:16};
        this.bg_node = ccs.load("bg_96poker.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_96poker").getChildByName("scroll");
        //this.bg_node.setEnabled(false); //屏蔽滚动
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        _play.setVisible(true);
        var fangFei = _play.getChildByName('fangfei');
        if(cc.sys.isObjectValid(fangFei)) {
            fangFei.setVisible(false);
        }

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2")); 
        this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        var maxPlayerSelectCb = function(index, sender, list) {
            this.changeMaxPlayer([4, 3, 2][index]);
            this.radioBoxSelectCB(index, sender, maxPlayerList);
        }.bind(this);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        for (var i = 0; i < maxPlayerList.length; i++) {
            maxPlayerList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(maxPlayerList, i, this.maxPlayerList_radio, maxPlayerSelectCb), maxPlayerList[i].getChildByName("text"));
        }
        this.playerList_node = maxPlayerList;

        //地区--固定永顺
        var areaList = [];
        areaList.push(_play.getChildByName("area1"));
        this.areaList_radio = createRadioBoxForCheckBoxs(areaList, this.radioBoxSelectCB);
        for (var i = 0; i < areaList.length; i++) {
            areaList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(areaList, i, this.areaList_radio), areaList[i].getChildByName("text"));
        }
        this.areaList_node = areaList;

        //算分
        var suanFenList = [];
        suanFenList.push(_play.getChildByName("suanFen1"));
        suanFenList.push(_play.getChildByName("suanFen2"));
        this.suanFenList_radio = createRadioBoxForCheckBoxs(suanFenList, this.radioBoxSelectCB);
        for (var i = 0; i < suanFenList.length; i++) {
            suanFenList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(suanFenList, i, this.suanFenList_radio), suanFenList[i].getChildByName("text"));
        }
        this.suanFenList_node = suanFenList;

        //玩法.双龙特殊牌型
        this.specType = _play.getChildByName("wanFa1");
        this.addListenerText(this.specType);
        this.specType.addEventListener(this.clickCB, this.specType);

        //玩法.打出去的牌作废
        this.outCardInValid = _play.getChildByName("wanFa2");
        this.addListenerText(this.outCardInValid);
        this.outCardInValid.addEventListener(this.clickCB, this.outCardInValid);

        //玩法.无牌打不抓猪
        this.isNoZhuaZhu = _play.getChildByName("wanFa3");
        this.addListenerText(this.isNoZhuaZhu);
        this.isNoZhuaZhu.addEventListener(this.clickCB, this.isNoZhuaZhu);

        var pnlNext = this.bg_node.getChildByName("pnl_next");
        //记录初始坐标
        this.pnlNextPosY = pnlNext.y;
        this.pnlNext = pnlNext;
        this.isNoZhuaZhuPos = {x:this.isNoZhuaZhu.x, y:this.isNoZhuaZhu.y};

        //飘分
        var piaoFenList = [];
        piaoFenList.push(pnlNext.getChildByName("buPiao"));
        piaoFenList.push(pnlNext.getChildByName("piao1"));
        piaoFenList.push(pnlNext.getChildByName("piao2"));
        this.piaoFenList_radio = createRadioBoxForCheckBoxs(piaoFenList, this.radioBoxSelectCB);
        for (var i = 0; i < piaoFenList.length; i++) {
            piaoFenList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(piaoFenList, i, this.piaoFenList_radio), piaoFenList[i].getChildByName("text"));
        }
        this.piaoFenList_node = piaoFenList;

        //默认3人
        this.changeMaxPlayer(3);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(pnlNext);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
            _maxPlayer = [4, 3, 2].indexOf(temp_maxPlayer);
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_96POKER_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node); 

        //人数
        this.changeMaxPlayer([4, 3, 2][_maxPlayer]);

        //地区
        var _area;
        if(atClub){
            _area = this.getNumberItem("area", 0);
        }
        else{
            _area = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_96POKER_area, 0); 
        }
        this.areaList_radio.selectItem(_area);
        this.radioBoxSelectCB(_area,this.areaList_node[_area],this.areaList_node);
 
        //算分选项索引
        var _suanFen;
        if(atClub){
            _suanFen = this.getNumberItem("scoreType", 0);
            if(_suanFen == 1) {
                //11逢升
                _suanFen = 0;
            }else if(_suanFen == 2) {
                //大小胡
                _suanFen = 1;
            }
        }
        else{
            _suanFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_96POKER_scoreType, 0); 
        }
        this.suanFenList_radio.selectItem(_suanFen);
        this.radioBoxSelectCB(_suanFen,this.suanFenList_node[_suanFen],this.suanFenList_node);

        //玩法.双龙特殊牌型
        var _specType;
        if (atClub) 
            _specType = this.getBoolItem("isShuangLongBaoZhu", _maxPlayer != 2);
        else
            _specType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_96POKER_isShuangLongBaoZhu, _maxPlayer != 2);
        this.specType.setSelected(_specType);
        var text = this.specType.getChildByName("text");
        this.selectedCB(text, _specType);

        //玩法.打出去的牌作废
        if(_maxPlayer == 2) {
            var _invalid;
            if (atClub) 
                _invalid = this.getBoolItem("isPutCardInvalid", false);
            else
                _invalid = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_96POKER_isPutCardInvalid, false);
            this.outCardInValid.setSelected(_invalid);
            var text = this.outCardInValid.getChildByName("text");
            this.selectedCB(text, _invalid);
        }

        //玩法.无牌打不抓猪
        var _isNoZhuaZhu;
        if (atClub)
            _isNoZhuaZhu = this.getBoolItem("isNoZhuaZhu", false);
        else
            _isNoZhuaZhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_96POKER_isNoZhuaZhu, false);
        this.isNoZhuaZhu.setSelected(_isNoZhuaZhu);
        var text = this.isNoZhuaZhu.getChildByName("text");
        this.selectedCB(text, _isNoZhuaZhu);

        //飘分
        var _piao;  
        if (atClub) {
            _piao = this.getNumberItem("piaoFen", 0);
        }
        else {
            _piao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_96POKER_piaoFen, 0);
        }
        this.piaoFenList_radio.selectItem(_piao);
        this.radioBoxSelectCB(_piao,this.piaoFenList_node[_piao],this.piaoFenList_node);

        this.setExtraPlayNodeCurrentSelect(atClub);
    },

    getSelectedPara:function()
    {
        var para = {};

        //人数
        var maxPlayerIdx = this.maxPlayerList_radio.getSelectIndex();
        para.maxPlayer = [4, 3, 2][maxPlayerIdx]; 

        //地区
        para.area = this.areaList_radio.getSelectIndex();

        //算分
        var scoreType = this.suanFenList_radio.getSelectIndex();
        if(scoreType == 0) {
            if(para.maxPlayer == 3) {
                scoreType = 0;  //16逢升发0
            }else {
                scoreType = 1;  //11逢升发1
            }
        }else {
            scoreType = 2;  //大小胡给后端发2
        }
        para.scoreType = scoreType;

        //玩法
        para.isShuangLongBaoZhu = this.specType.isSelected();
        para.isPutCardInvalid = this.outCardInValid.isSelected() && (para.maxPlayer == 2);
        para.isNoZhuaZhu = this.isNoZhuaZhu.isSelected();

        //飘分
        para.piaoFen = this.piaoFenList_radio.getSelectIndex(); 

        this.getExtraSelectedPara(para); 

        para.gameType = MjClient.GAME_TYPE.XIANG_XI_96POKER;

        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara:function(para)
    {
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_96POKER_maxPlayer, [4, 3, 2].indexOf(para.maxPlayer)); 
        util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_96POKER_area, para.area);
        //util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_96POKER_scoreType, para.scoreType);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_96POKER_isShuangLongBaoZhu, para.isShuangLongBaoZhu);
        util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_96POKER_isPutCardInvalid, para.isPutCardInvalid);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_96POKER_piaoFen, para.piaoFen);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_96POKER_isNoZhuaZhu, para.isNoZhuaZhu);

        //算分存储
        var idx = 0;
        if(para.scoreType == 2) {
            idx = 1;  //大小胡=2 对应索引=1 |||| 0和1表示逢升 索引=0
        }
        util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_ZI_PAI_96POKER_scoreType, idx);
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node);
    },

    setDiaNumData:function(gameNode)
    { 
        this._super(gameNode);
    },

    changeMaxPlayer:function(num)
    {
        var self = this;

        //根据人数调整布局
        var adjustLayout = function(num) {
            if (num == 2) {
                self.pnlNext.y = self.pnlNextPosY;
                self.isNoZhuaZhu.setPosition(cc.p(self.isNoZhuaZhuPos.x, self.isNoZhuaZhuPos.y));
            } else {
                self.pnlNext.y += self.pnlNextPosY == self.pnlNext.y ? 50 : 0;
                self.isNoZhuaZhu.setPosition(self.outCardInValid.getPosition());
            }
        }

        //打出去的牌作废
        var showOutCardInvalid = function(num) {
            self.outCardInValid.visible = num == 2;
            if(num == 2) {
                var _invalid = util.localStorageEncrypt.getBoolItem(self.localStorageKey.KEY_ZI_PAI_96POKER_isPutCardInvalid, false);
                self.outCardInValid.setSelected(_invalid);
                var text = self.outCardInValid.getChildByName("text");
                self.selectedCB(text, _invalid);
            }
        } 

        //11逢升
        var changeSuanFenDesc = function(num) {
            var text = self.suanFenList_node[0].getChildByName("text");
            text.setString(num == 3 ? "16逢升" : "11逢升");
        } 

        //双龙默认选中
        var shuangLongSelecte = function(num) {
            var _specType = util.localStorageEncrypt.getBoolItem(self.localStorageKey.KEY_ZI_PAI_96POKER_isShuangLongBaoZhu, num != 2);
            self.specType.setSelected(_specType);
            var text = self.specType.getChildByName("text");
            self.selectedCB(text, _specType);
        }

        showOutCardInvalid(num);
        changeSuanFenDesc(num);
        shuangLongSelecte(num);
        adjustLayout(num);
    },
});