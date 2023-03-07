/*
* @Author: zzj
* @Date:   2018-08-01 15:30:49
* @Last Modified by:   zzj
* @Last Modified time: 2019-05-22 15:12:34
*/

var CreateRoomNode_LSJShiHuDao = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_LSJShiHuDao_maxPlayer   = "_LSJShiHuDao_maxPlayer";    //几人玩
            this.localStorageKey.KEY_LSJShiHuDao_jiachui     = "_LSJShiHuDao_jiachui";      //加锤
            this.localStorageKey.KEY_LSJShiHuDao_mingwei     = "_LSJShiHuDao_mingwei";      //明偎
            this.localStorageKey.KEY_LSJShiHuDao_cutCard     = "_LSJShiHuDao_cutCard";      //切牌方式
            this.localStorageKey.KEY_LSJShiHuDao_faPai       = "_LSJShiHuDao_faPai";        //发牌速度
            this.localStorageKey.KEY_LSJShiHuDao_trust       = "_LSJShiHuDao_trust";        //自动托管
            this.localStorageKey.KEY_LSJShiHuDao_maiPaiNum   = "_LSJShiHuDao_maiPaiNum";        //埋牌
        }

        this.setExtraKey({
            fanBei: "_LSJShiHuDao_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_LSJShiHuDao_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_LSJShiHuDao_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        this.bg_node = ccs.load("bg_lsjShiHuDao.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_lsjShiHuDao");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },

    initPlayNode:function()
    { 
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.initPlayNumNode(maxPlayerList, [3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
       

        this.playerList_node = maxPlayerList;


        //埋牌
        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maiPai0")); 
        maiPaiList.push(_play.getChildByName("maiPai1"));
        maiPaiList.push(_play.getChildByName("maiPai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        var chuiList = [];
        chuiList.push(_play.getChildByName("jiaChui"));
        chuiList.push(_play.getChildByName("buChui"));
        this.chuiList_radio = createRadioBoxForCheckBoxs(chuiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(chuiList,0,this.chuiList_radio),chuiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(chuiList,1,this.chuiList_radio),chuiList[1].getChildByName("text"));
        this.chuiList_node = chuiList;

        var weiList = [];
        weiList.push(_play.getChildByName("mingWei"));
        weiList.push(_play.getChildByName("anWei"));
        this.weiList_radio = createRadioBoxForCheckBoxs(weiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(weiList,0,this.weiList_radio),weiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(weiList,1,this.weiList_radio),weiList[1].getChildByName("text"));
        this.weiList_node = weiList;

        var cutList = [];
        cutList.push(_play.getChildByName("autoCut"));
        cutList.push(_play.getChildByName("manualCut"));
        this.cutList_radio = createRadioBoxForCheckBoxs(cutList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutList,0,this.cutList_radio),cutList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutList,1,this.cutList_radio),cutList[1].getChildByName("text"));
        this.cutList_node = cutList;

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        //托管
        var trustList = [];
        trustList.push(_play.getChildByName("trust0"));
        trustList.push(_play.getChildByName("trust1"));
        trustList.push(_play.getChildByName("trust2"));
        trustList.push(_play.getChildByName("trust3"));
        trustList.push(_play.getChildByName("trust4"));
        this.trustList_radio = createRadioBoxForCheckBoxs(trustList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(trustList,0,this.trustList_radio),trustList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,1,this.trustList_radio),trustList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,2,this.trustList_radio),trustList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,3,this.trustList_radio),trustList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,4,this.trustList_radio),trustList[4].getChildByName("text"));

        //托管帮助
        var btnTrustTip = _play.getChildByName("btnTrustTip");
        var trustTip = _play.getChildByName("trustTip");
        btnTrustTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                trustTip.setVisible(true);
            }
        }, btnTrustTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            status: null,
            onTouchBegan: function(touch, event) {
                if (trustTip.isVisible()) {
                    trustTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, trustTip);
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    //初始化上次选择
    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
            _maxPlayer = [3,2].indexOf(temp_maxPlayer);
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_maxPlayer, 3);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node); 

        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_maiPaiNum, 0);
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        //加锤
        var _chui;
        if(atClub){
            _chui = this.getBoolItem("isJiaChui", true) ? 0 : 1;
        }
        else{
            _chui = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_jiachui, 0); 
        }

        
        this.chuiList_radio.selectItem(_chui);
        this.radioBoxSelectCB(_chui,this.chuiList_node[_chui],this.chuiList_node);
 
        //偎牌
        var _mingwei;  
        if (atClub){
            _mingwei = this.getBoolItem("isMingwei", false) ? 0 : 1;
        }
        else{
            _mingwei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_mingwei, 1);
        }
        this.weiList_radio.selectItem(_mingwei);
        this.radioBoxSelectCB(_mingwei,this.weiList_node[_mingwei],this.weiList_node);

        //切牌
        var _cut;
        if (atClub){
            _cut= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            _cut = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_cutCard, 0);
        }
        this.cutList_radio.selectItem(_cut);
        this.radioBoxSelectCB(_cut,this.cutList_node[_cut],this.cutList_node);

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 0);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_faPai, 0);
        }

        this.faPaiList_radio.selectItem(_faPai);
        var list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        // 托管
        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300: 4}[this.getNumberItem("trustTime", -1)];
        }else{
            _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LSJShiHuDao_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        list.push(_play.getChildByName("trust4"));
        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var chuiIndex = this.chuiList_radio.getSelectIndex();
        var weiIndex = this.weiList_radio.getSelectIndex();
        var cutIndex = this.cutList_radio.getSelectIndex();
        var trustIndex = this.trustList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.LENG_SHUI_JIANG_SHI_HU_DAO;
        para.maxPlayer = [3,2][maxPlayerIndex];
        para.isJiaChui = chuiIndex == 0 ? true : false;
        para.isMingWei = weiIndex == 0 ? true : false;
        para.isManualCutCard = cutIndex == 0 ? false : true;
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
        para.maiPaiNum = para.maxPlayer == 2  ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_jiachui, chuiIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_mingwei, weiIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_cutCard, cutIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_trust, trustIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LSJShiHuDao_maiPaiNum, para.maiPaiNum);
        }

        return para;
    },

    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_shd();

        var maxPlayer = this.maxPlayerList_radio.getSelectIndex() == 0 ? 3 : 2;//人数
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        if (maxPlayer == 2){
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }
        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(unEnableColor);
            }
        }
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_shd();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_shd();
    },

    setDiaNumData_shd : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
         
    }
});