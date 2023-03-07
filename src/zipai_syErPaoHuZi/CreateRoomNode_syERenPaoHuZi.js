/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_syERenPaoHuZi = CreateRoomNode.extend({
    initAll:function()
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        
        if (!this._isFriendCard){
            this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype     = "BDHYERenPaoHuZi_huxitype";          //21胡息or卡20张
            this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai       = "BDHYERenPaoHuZi_qiepai";           //切牌
            this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen= "_BDHYERenPaoHuZ_diFen";   //低分翻倍
            this.localStorageKey.KEY_BDHYERenPaoHuZi_faPai        = "_BDHYERenPaoHuZi_faPai";   //发牌速度
            this.localStorageKey.KEY_BDHYERenPaoHuZi_trust        = "_BDHYERenPaoHuZi_trust";           //托管
        }
        this.setExtraKey({
            jieSuanDiFen: "_BDHYERenPaoHuZi_JIE_SUAN_DI_FEN",  //积分底分
        });
        this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            this.roundNumObj = {roundNum1:16, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_hyErPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiHuKa");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var playNode = this.bg_node.getChildByName("play");

        //玩法type
       var huxiTypeList = [];
        huxiTypeList.push(playNode.getChildByName("ershiyihuxi"));
        huxiTypeList.push(playNode.getChildByName("kaershizhang"));
        this.huxiTypeList_radio = createRadioBoxForCheckBoxs(huxiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huxiTypeList,0,this.huxiTypeList_radio),huxiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huxiTypeList,1,this.huxiTypeList_radio),huxiTypeList[1].getChildByName("text"));
        this.huxiTypeList = huxiTypeList;

        var _play = this.bg_node.getChildByName("play");
        
        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        //切牌
        var cutCardList = [];
        cutCardList.push(playNode.getChildByName("autoCut"));
        cutCardList.push(playNode.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        //低分翻倍
        var diFenList = [];
        diFenList.push(playNode.getChildByName("fanBei0"));
        diFenList.push(playNode.getChildByName("fanBei1"));
        diFenList.push(playNode.getChildByName("fanBei5"));
        diFenList.push(playNode.getChildByName("fanBei2"));
        diFenList.push(playNode.getChildByName("fanBei3"));
        diFenList.push(playNode.getChildByName("fanBei4"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,2,this.diFenList_radio),diFenList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,3,this.diFenList_radio),diFenList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,4,this.diFenList_radio),diFenList[4].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,5,this.diFenList_radio),diFenList[5].getChildByName("text"));

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
        this.initExtraPlayNode(playNode);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var huxiType;
        if(atClub){
            huxiType = this.getNumberItem("huxiType", 0) ;
        }else{
            huxiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype, 0);
        }
        this.huxiTypeList_radio.selectItem(huxiType);
        this.radioBoxSelectCB(huxiType,this.huxiTypeList[huxiType],this.huxiTypeList);

        var _play = this.bg_node.getChildByName("play");

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 1);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_faPai, 1);
        }

        this.faPaiList_radio.selectItem(_faPai);
        var list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var _diFen;
        if (atClub){
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen, -1);
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[index];
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        var playNode = this.bg_node.getChildByName("play");
        list.push(playNode.getChildByName("fanBei0"));
        list.push(playNode.getChildByName("fanBei1"));
        list.push(playNode.getChildByName("fanBei5"));
        list.push(playNode.getChildByName("fanBei2"));
        list.push(playNode.getChildByName("fanBei3"));
        list.push(playNode.getChildByName("fanBei4"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);

        // 托管
        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300: 4}[this.getNumberItem("trustTime", -1)];
        }else{
            _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_trust, 0);
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
    },
    getSelectedPara:function()
    {
        var trustIndex = this.trustList_radio.getSelectIndex();
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_ER_PAO_HU_ZI;
        para.maxPlayer = 2;//人数
        para.huxiType = this.huxiTypeList_radio.getSelectIndex();
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.diFen = [-1,10,15,20,30,10000][this.diFenList_radio.getSelectIndex()];
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][trustIndex];

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype, para.huxiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai, this.cutCardList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_trust, trustIndex);
        }

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang['roundHYSHK4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHK8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHK16P' +  MjClient.MaxPlayerNum ]};
        // this.AAPay = {pay4:majiang['roundHYSHKAA4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHKAA8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHKAA16P' +  MjClient.MaxPlayerNum ]};
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});