var CreateRoomNode_zplychz = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_zplychz_maxPlayer = "_zplychz_maxPlayer";      //人数
            this.localStorageKey.KEY_zplychz_jushou     = "_ZP_LY_CHZ_JU_SHOU";          // 举手
            this.localStorageKey.KEY_zplychz_wuhu       = "_ZP_LY_CHZ_BU_DAI_HU";        // 不带无胡
            this.localStorageKey.KEY_zplychz_wuyihong   = "_ZP_LY_CHZ_BU_DAI_HONG";      // 不带一点红
            this.localStorageKey.KEY_zplychz_chibiandabian   = "_ZP_LY_CHZ_CHI_BIAN_DA_BIAN";      // 吃边打边
            this.localStorageKey.KEY_zplychz_qiepai     = "_ZP_LY_CHZ_QIE_PAI";          // 切牌
            this.localStorageKey.KEY_zplychz_maiPaiNum     = "_ZP_LY_CHZ_MAIPAI_NUM";          // 埋牌数
            this.localStorageKey.KEY_zplychz_zhuangjia     = "_ZP_LY_CHZ_ZHUANG_JIA";          // 庄家
            this.localStorageKey.KEY_zplychz_tuoGuan     = "_ZP_LY_CHZ_TUO_GUAN";          // 托管
        }
        // var majiang = MjClient.data.gameInfo.js3mj;
        this.roundNumObj = {roundNum1:8, roundNum2:16, roundNum3:4};
        // this.fangzhuPay = {pay4:majiang.roundZPLYCHZ4,  pay8:majiang.roundZPLYCHZ8,  pay16:majiang.roundZPLYCHZ16};
        // this.AAPay      = {pay4:majiang.roundZPLYCHZAA4,pay8:majiang.roundZPLYCHZAA8,pay16:majiang.roundZPLYCHZAA16};
        // this.clubPay    = {pay4:majiang.roundZPLYCHZCL4,pay8:majiang.roundZPLYCHZCL8,pay16:majiang.roundYZCHZCL16};

        this.bg_node = ccs.load("bg_zplychz.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xuzhou");
        if(this.bg_node.getChildByName("view")){
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
        var _play = _bgHuaianCCNode.getChildByName("play");

        var _play = this.bg_node.getChildByName("play");

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.maxPlayerRadio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_Player.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerRadio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerRadio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));

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
         this._playNode_jushou.addEventListener(this._clickCB, this._playNode_jushou);

        // 不带无胡
        this._playNode_budaihu      = _play.getChildByName("budaihu");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_budaihu.getChildByName("text"));
        //fix by 千千
         this._playNode_budaihu.addEventListener(this._clickCB, this._playNode_budaihu);

        // 不带一点红
        this._playNode_budaihong    = _play.getChildByName("budaihong");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_budaihong.getChildByName("text"));
        //fix by 千千
         this._playNode_budaihong.addEventListener(this._clickCB, this._playNode_budaihong);

        // 吃边打边
        this._playNode_chibiandabian    = _play.getChildByName("chibiandabian");
        this._playNode_chibiandabian.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this._playNode_chibiandabian.getChildByName("text"));
        //fix by 千千
         this._playNode_chibiandabian.addEventListener(this._clickCB, this._playNode_chibiandabian);
        
        //跑胡子不要四局
        // var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        // if (_currentRoundState == 1)
        // {
        //     util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        // }

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardRadioList = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardRadioList),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardRadioList),cutCardList[1].getChildByName("text"));

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("zhuangJia1"));
        zhuangJiaList.push(_play.getChildByName("zhuangJia2"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });
    },
    checkSelect : function(){
        var maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
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
    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(211,38,14));
                    }else{
                        txt.setTextColor(cc.color(68,51,51));
                    }
                    break;
            }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play =  this.bg_node.getChildByName("play");

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
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
        }

        if (isClub)
            boolValue = this.getBoolItem("budaihu", false);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_wuhu, false);
        this._playNode_budaihu.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_budaihu.getChildByName("text");
        if(boolValue){
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
        }

        if (isClub)
            boolValue = this.getBoolItem("budaiyihong", false);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_wuyihong, false);
        this._playNode_budaihong.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_budaihong.getChildByName("text");
        if(boolValue){
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
        }

        if (isClub)
            boolValue = this.getBoolItem("isPutLimit", true);
        else
            boolValue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zplychz_chibiandabian, true);
        this._playNode_chibiandabian.setSelected(boolValue);
        //fix by 千千
        var txt = this._playNode_chibiandabian.getChildByName("text");
        if(boolValue){
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
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
        var zhuangJia;
        if (isClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_zhuangjia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);
		this.checkSelect();

        var tuoGuan;
        if (isClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zplychz_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);
    },
    getSelectedPara:function()
    {
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
        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_jushou, para.jushou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_wuhu, para.budaihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_wuyihong, para.budaiyihong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_chibiandabian, para.isPutLimit);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zplychz_qiepai, this.cutCardRadioList.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_zhuangjia, para.zhuangJia);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zplychz_tuoGuan, para.trustTime);
        }

        // cc.log("耒阳createara@@ : " + JSON.stringify(para));
        return para;
    }
});