var CreateRoomNode_zplychz_lyg = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_zplychz_maxPlayer = "_zplychz_maxPlayer";      //人数
            this.localStorageKey.KEY_zplychz_jushou     = "_ZP_LY_CHZ_JU_SHOU";          // 举手
            this.localStorageKey.KEY_zplychz_wuhu       = "_ZP_LY_CHZ_BU_DAI_HU";        // 不带无胡
            this.localStorageKey.KEY_zplychz_wuyihong   = "_ZP_LY_CHZ_BU_DAI_HONG";      // 不带一点红
            this.localStorageKey.KEY_zplychz_chibiandabian   = "_ZP_LY_CHZ_CHI_BIAN_DA_BIAN";      // 吃边打边
            this.localStorageKey.KEY_zplychz_qiepai     = "_ZP_LY_CHZ_QIE_PAI";          // 切牌
            this.localStorageKey.KEY_zplychz_maiPaiNum  = "_ZP_LY_CHZ_MAIPAI_NUM";       // 埋牌数
            this.localStorageKey.KEY_zplychz_trust      = "_ZP_LY_CHZ_TRUST";        //自动托管
        }
        this.setExtraKey({
            fanBei: "_ZP_LY_CHZ_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_ZP_LY_CHZ_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_ZP_LY_CHZ_JIE_SUAN_DI_FEN",  //积分底分
        });
        // var majiang = MjClient.data.gameInfo.js3mj;
        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        // this.fangzhuPay = {pay4:majiang.roundZPLYCHZ4,  pay8:majiang.roundZPLYCHZ8,  pay16:majiang.roundZPLYCHZ16};
        // this.AAPay      = {pay4:majiang.roundZPLYCHZAA4,pay8:majiang.roundZPLYCHZAA8,pay16:majiang.roundZPLYCHZAA16};
        // this.clubPay    = {pay4:majiang.roundZPLYCHZCL4,pay8:majiang.roundZPLYCHZCL8,pay16:majiang.roundYZCHZCL16};

        this.bg_node = ccs.load("bg_zplychz.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xuzhou");
        if(this.bg_node.getChildByName("view")) {
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    radioBoxSelectCB_Player: function(index, sender, list)
    {
        this.radioBoxSelectCB(index, sender, list);
        this.checkSelect();
    },
    initPlayNode:function()
    {
        var _bgHuaianCCNode = this.bg_node;
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play");
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.maxPlayerRadio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_Player.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerRadio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerRadio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));

        //埋牌
        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        // 举手做声
        this._playNode_jushou       = _play.getChildByName("jushou");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_jushou.getChildByName("text"));
        //fix by 千千
         this._playNode_jushou.addEventListener(this._clickCB.bind(this), this._playNode_jushou);

        // 不带无胡
        this._playNode_budaihu      = _play.getChildByName("budaihu");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_budaihu.getChildByName("text"));
        //fix by 千千
         this._playNode_budaihu.addEventListener(this._clickCB.bind(this), this._playNode_budaihu);

        // 不带一点红
        this._playNode_budaihong    = _play.getChildByName("budaihong");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_budaihong.getChildByName("text"));
        //fix by 千千
         this._playNode_budaihong.addEventListener(this._clickCB.bind(this), this._playNode_budaihong);

        // 吃边打边
        this._playNode_chibiandabian    = _play.getChildByName("chibiandabian");
        this._playNode_chibiandabian.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this._playNode_chibiandabian.getChildByName("text"));
        //fix by 千千
         this._playNode_chibiandabian.addEventListener(this._clickCB.bind(this), this._playNode_chibiandabian);
        
        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardRadioList = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardRadioList),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardRadioList),cutCardList[1].getChildByName("text"));

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
        var btnTrustTip = _play.getChildByName("btn_tuoguanTip");
        var trustTip = _play.getChildByName("tuoGuanTip");
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
    checkSelect : function(){
        var maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191, 191, 191);
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
    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(this._selectColor);
                    }else{
                        txt.setTextColor(this._unSelectColor);
                    }
                    break;
            }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play =  this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play");
        var maxPlayer;
        if(isClub){
            maxPlayer = this.getNumberItem("maxPlayer", 3);
        }else{
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_maxPlayer, 3);
        }
        maxPlayer = (maxPlayer == 3 ? 0 : 1);
        this.maxPlayerRadio.selectItem(maxPlayer);
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(maxPlayer,maxPlayerList[maxPlayer],maxPlayerList);

        var maiPaiNum;
        if(isClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_maiPaiNum, 0);
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        var boolValue;
        if (isClub)
            boolValue = this.getBoolItem("jushou", false);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_jushou, false);
        this._playNode_jushou.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_jushou.getChildByName("text");
        if(boolValue){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._selectColor);
        }

        if (isClub)
            boolValue = this.getBoolItem("budaihu", false);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_wuhu, false);
        this._playNode_budaihu.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_budaihu.getChildByName("text");
        if(boolValue){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        if (isClub)
            boolValue = this.getBoolItem("budaiyihong", false);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_wuyihong, false);
        this._playNode_budaihong.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_budaihong.getChildByName("text");
        if(boolValue){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        if (isClub)
            boolValue = this.getBoolItem("isPutLimit", true);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_chibiandabian, true);
        this._playNode_chibiandabian.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_chibiandabian.getChildByName("text");
        if(boolValue){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var cutCard;
        if (isClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_qiepai, 0);
        }
        this.cutCardRadioList.selectItem(cutCard);
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.radioBoxSelectCB(cutCard, cutCardList[cutCard], cutCardList);

        // 托管
        var _trustIndex;
        if (isClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300: 4}[this.getNumberItem("trustTime", -1)];
        }else{
            _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        var list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        list.push(_play.getChildByName("trust4"));
        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        this.checkSelect();
        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var trustIndex = this.trustList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.ZP_LY_CHZ;
        para.maxPlayer = 3;

        para.jushou = false;    // 举手做声
        para.budaihu = false;    // 举手做声
        para.budaiyihong = false;    // 举手做声
        para.isPutLimit = true;    // 吃边打边

        para.maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
        para.jushou = this._playNode_jushou.isSelected();
        para.budaihu = this._playNode_budaihu.isSelected();
        para.budaiyihong = this._playNode_budaihong.isSelected();
        para.isPutLimit = this._playNode_chibiandabian.isSelected();
        para.isManualCutCard = this.cutCardRadioList.getSelectIndex() == 0 ? false : true;
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.trustTime = [-1, 60, 120, 180, 300][trustIndex];

        this.getExtraSelectedPara(para);

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_jushou, para.jushou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_wuhu, para.budaihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_wuyihong, para.budaiyihong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_chibiandabian, para.isPutLimit);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_qiepai, this.cutCardRadioList.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_trust, trustIndex);
        }

        // cc.log("耒阳createara@@ : " + JSON.stringify(para));
        return para;
    }
});