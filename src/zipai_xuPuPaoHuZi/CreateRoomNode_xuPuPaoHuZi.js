//溆浦跑胡子
var CreateRoomNode_xuPuPaoHuZi = CreateRoomNode.extend({

    onExit:function()
    {
        this._super();
    },

    initAll:function()
    {
        this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maxPlayer  = "_xuPuPaoHuZi_maxPlayer";      //几人玩
        this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_faPai      = "_xuPuPaoHuZi_faPai";          //发牌
        this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maiPai     = "_xuPuPaoHuZi_maiPai";         //埋牌
        this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_wanFa      = "_xuPuPaoHuZi_wanFa";          //玩法
        this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_diFen      = "_xuPuPaoHuZi_diFen";          //打出的牌作废
     
        this.setExtraKey({
            fanBei: "_xuPuPaoHuZi_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_xuPuPaoHuZi_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_xuPuPaoHuZi_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:16};
        this.bg_node = ccs.load("bg_xuPuPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xuPuPaoHuZi").getChildByName("view");
        //this.bg_node.setEnabled(false); //屏蔽滚动
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        _play.setVisible(true);

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2")); 
        this.initPlayNumNode(maxPlayerList, [3, 2]);
        var maxPlayerSelectCb = function(index, sender, list) {
            this.changeMaxPlayer([3, 2][index]);
            this.radioBoxSelectCB(index, sender, maxPlayerList);
        }.bind(this);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        for (var i = 0; i < maxPlayerList.length; i++) {
            maxPlayerList[i].setVisible(true);
            cc.eventManager.addListener(this.setTextClick(maxPlayerList, i, this.maxPlayerList_radio, maxPlayerSelectCb), maxPlayerList[i].getChildByName("text"));
        }
        this.maxPlayerList = maxPlayerList;

        //发牌
        var faPaiList = [];
        for (var i = 0; i < 3; i++) {
            faPaiList.push(_play.getChildByName("faPai" + i));
            faPaiList[i].visible = true;
        }
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        for (var i = 0; i < 3; i++) {
            cc.eventManager.addListener(this.setTextClick(faPaiList,i,this.faPaiList_radio),faPaiList[i].getChildByName("text"));
        }
        this.faPaiList = faPaiList;

        //埋牌
        var maiPaiList = [];
        for (var i = 0; i < 3; i++) {
            maiPaiList.push(_play.getChildByName("maiPai" + i));
            maiPaiList[i].visible = true;
        }
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        for (var i = 0; i < 3; i++) {
            cc.eventManager.addListener(this.setTextClick(maiPaiList,i,this.maiPaiList_radio),maiPaiList[i].getChildByName("text"));
        }
        this.maiPaiList = maiPaiList;

        //玩法
        var wanFaName = ['keChong', 'ziMoBiHu', 'duiJiaBuKeChi', 'firstRdZhuang'];
        var wanFa = [];
        for (var i = 0; i < wanFaName.length; i++) {
            var node = _play.getChildByName("wanFa_" + wanFaName[i]);
            node.visible = true;
            this.addListenerText(node);
            node.addEventListener(this.clickCB, node);
            wanFa.push(node);
        }
        this.wanFa = wanFa;

        //底分
        var diFenList = [];
        for (var i = 0; i < 3; i++) {
            diFenList.push(_play.getChildByName("diFen" + i));
            diFenList[i].visible = true;
        }
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        for (var i = 0; i < 3; i++) {
            cc.eventManager.addListener(this.setTextClick(diFenList,i,this.diFenList_radio),diFenList[i].getChildByName("text"));
        }
        this.diFenList = diFenList;

        this.initExtraPlayNode(_play);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            _maxPlayer = [3, 2].indexOf(this.getNumberItem("maxPlayer", 2));
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.maxPlayerList[_maxPlayer],this.maxPlayerList); 

        //人数
        this.changeMaxPlayer([3, 2][_maxPlayer]);

        //发牌
        var _faPai;
        if (atClub){ 
            _faPai = this.getNumberItem("faPai", 1);
        }
        else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_faPai, 1);
        }
        this.faPaiList_radio.selectItem(_faPai);
        this.radioBoxSelectCB(_faPai,this.faPaiList[_faPai],this.faPaiList);

        //埋牌
        var _maiPai;
        if (atClub){ 
            _maiPai = [0, 10, 20].indexOf(this.getNumberItem("maiPai", 0));
        }
        else{
            _maiPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maiPai, 0);
        }
        this.maiPaiList_radio.selectItem(_maiPai);
        this.radioBoxSelectCB(_maiPai,this.maiPaiList[_maiPai],this.maiPaiList);

        //玩法
        var wanFaName = ['isJiaChui', 'isZiMoBiHu', 'isDuiJiaBuKeChi', 'isRandomZhuang'];
        var wanFa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_wanFa, 0);
        var _wanFa;
        for (var i = 0; i < wanFaName.length; i++) {
            if (atClub)
                _wanFa = this.getBoolItem(wanFaName[i], false);
            else
                _wanFa = (wanFa & Math.pow(2, i)) ? true : false;
            this.wanFa[i].setSelected(_wanFa);
            this.selectedCB(this.wanFa[i].getChildByName("text"), _wanFa);
        }
        
        //底分
        var _diFen;
        if (atClub){ 
            _diFen = [1, 2, 4].indexOf(this.getNumberItem("diFen", 1));
        }
        else{
            _diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_diFen, 0);
        }
        this.diFenList_radio.selectItem(_diFen);
        this.radioBoxSelectCB(_diFen,this.diFenList[_diFen],this.diFenList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        //默认2人
        this.changeMaxPlayer([3, 2][this.maxPlayerList_radio.getSelectIndex()]);
    },

    getSelectedPara:function()
    {
        var para = {};

        //人数
        para.maxPlayer = [3, 2][this.maxPlayerList_radio.getSelectIndex()]; 

        //发牌
        para.faPai = this.faPaiList_radio.getSelectIndex();

        //埋牌
        para.maiPaiNum = 0;
        if (para.maxPlayer == 2) {
            para.maiPaiNum = [0, 10, 20][this.maiPaiList_radio.getSelectIndex()];
        }

        //玩法
        var wanFa = ['isJiaChui', 'isZiMoBiHu', 'isDuiJiaBuKeChi', 'isRandomZhuang'];
        for (var i = 0; i < wanFa.length; i++) {
            para[wanFa[i]] = this.wanFa[i].isSelected();
            if (i == 2 && para.maxPlayer != 2) {
                //对家不可吃和人数有关
                para[wanFa[i]] = false;
            }
        }

        //底分
        para.diFen = [1, 2, 4][this.diFenList_radio.getSelectIndex()];

        this.getExtraSelectedPara(para); 

        para.gameType = MjClient.GAME_TYPE.XU_PU_PAO_HU_ZI;

        return para;
    },

    createRoom:function()
    {
        this.savePara(this.getSelectedPara());
        this._super();
    },

    savePara:function(para)
    {
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maxPlayer, [3, 2].indexOf(para.maxPlayer)); 
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_faPai, para.faPai);
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_maiPai, [0, 10, 20].indexOf(para.maiPaiNum));
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_diFen, [1, 2, 4].indexOf(para.diFen));
        
        //玩法存储
        var wanFaName = ['isJiaChui', 'isZiMoBiHu', 'isDuiJiaBuKeChi', 'isRandomZhuang'];
        var wanFa = 0;
        for (var i = 0; i < wanFaName.length; i++) {
            wanFa += (para[wanFaName[i]] ? Math.pow(2, i) : 0);
        }
        util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_ZI_PAI_xuPuPaoHuZi_wanFa, wanFa);
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
        //对家不可吃
        this.wanFa[2].visible = num == 2;
        
        //埋牌
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        for (var i in this.maiPaiList) {
            var node = this.maiPaiList[i];
            node.setEnabled(num == 2);
            var txt =  node.getChildByName("text");
            txt.setTextColor(num == 2 ? (node.isSelected() ? selectColor : unSelectColor) : unEnableColor);
        }
    },
});