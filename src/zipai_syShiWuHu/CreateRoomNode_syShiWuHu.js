
var CreateRoomNode_syShiWuHu = CreateRoomNode.extend({
    initAll:function()
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_HYShiWuHu_bihu         = "_HYShiWuHu_bihu";          //胡法
            this.localStorageKey.KEY_HYShiWuHu_xingType     = "_HYShiWuHu_xingType";       //翻醒
            this.localStorageKey.KEY_HYShiWuHu_difenType    = "_HYShiWuHu_difenType";     //底分2分
            this.localStorageKey.KEY_HYShiWuHu_hongdianhei  = "_HYShiWuHu_hongdianhei";    //红黑胡
            this.localStorageKey.KEY_HYShiWuHu_zimodouble   = "_HYShiWuHu_zimodouble";   //自摸翻倍
            this.localStorageKey.KEY_HYShiWuHu_isAlldemit   = "_HYShiWuHu_isAlldemit";   //解散需所有人同意
            this.localStorageKey.KEY_HYShiWuHu_qipai        = "_HYShiWuHu_qiepai";      //切牌
            this.localStorageKey.KEY_HYShiWuHu_diFen        = "_HYShiWuHu_diFen";   //低分翻倍
            this.localStorageKey.KEY_HYShiWuHu_yiwushi      = "_HYShiWuHu_yiwushi";        //一五十
            this.localStorageKey.KEY_HYShiWuHu_faPai        = "_HYShiWuHu_faPai";   //发牌速度
            this.localStorageKey.KEY_HYShiWuHu_trust        = "_HYShiWuHu_trust";           //托管
        }

        this.setExtraKey({
            jieSuanDiFen: "_HYShiWuHu_JIE_SUAN_DI_FEN",  //积分底分
        });

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYSHK12,  pay8:majiang.roundHYSHK8,  pay16:majiang.roundHYSHK16};
        // this.AAPay      = {pay4:majiang.roundHYSHKAA12,pay8:majiang.roundHYSHKAA8,pay16:majiang.roundHYSHKAA16};
        // this.clubPay    = {pay4:majiang.roundHYSHKCL12,pay8:majiang.roundHYSHKCL8,pay16:majiang.roundHYSHKCL16};

        // this.roundNumObj = {roundNum1:10, roundNum2:16, roundNum3:20};

        this.bg_node = ccs.load("bg_hyShiWuHu.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiWuHu");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var bihuList = [];
        bihuList.push(_play.getChildByName("youhubihu"));
        bihuList.push(_play.getChildByName("dianpaobihu"));
        bihuList.push(_play.getChildByName("nullhu"));
        this.bihuList_radio = createRadioBoxForCheckBoxs(bihuList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(bihuList,0,this.bihuList_radio),bihuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,1,this.bihuList_radio),bihuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,2,this.bihuList_radio),bihuList[2].getChildByName("text"));

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        var xingTypeList = [];
        xingTypeList.push(_play.getChildByName("play_budaixing"));
        xingTypeList.push(_play.getChildByName("play_genxing"));
        xingTypeList.push(_play.getChildByName("play_fanxing"));
        this.xingTypeList_radio = createRadioBoxForCheckBoxs(xingTypeList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(xingTypeList,0,this.xingTypeList_radio),xingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,1,this.xingTypeList_radio),xingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,2,this.xingTypeList_radio),xingTypeList[2].getChildByName("text"));

        this.suanfen = _play.getChildByName("play_erfen");
        this.suanfen.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.suanfen.getChildByName("text"));
        this.suanfen.addEventListener(this._clickCB, this.suanfen);

        this.hongdianhei = _play.getChildByName("hongdianhei");
        this.hongdianhei.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.hongdianhei.getChildByName("text"));
        this.hongdianhei.addEventListener(this._clickCB, this.hongdianhei);

        this.zimodouble = _play.getChildByName("zimodouble");
        this.zimodouble.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.zimodouble.getChildByName("text"));
        this.zimodouble.addEventListener(this._clickCB, this.zimodouble);

        this.isAlldemit = _play.getChildByName("dissolve_all");
        this.isAlldemit.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.isAlldemit.getChildByName("text"));
        this.isAlldemit.addEventListener(this._clickCB, this.isAlldemit);

        this.yiwushi = _play.getChildByName("yiwushi");
        cc.eventManager.addListener(this.setTextClick(),this.yiwushi.getChildByName("text"));
        this.yiwushi.addEventListener(this._clickCB.bind(this), this.yiwushi);

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        //低分翻倍
        var diFenList = [];
        diFenList.push(_play.getChildByName("fanBei0"));
        diFenList.push(_play.getChildByName("fanBei1"));
        diFenList.push(_play.getChildByName("fanBei5"));
        diFenList.push(_play.getChildByName("fanBei2"));
        diFenList.push(_play.getChildByName("fanBei3"));
        diFenList.push(_play.getChildByName("fanBei4"));
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
        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color("#d21400");
                    var unSelectColor = cc.color("#255662");
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
                        selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                        unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
                    }
                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _bihu;
        if(atClub)
            _bihu = this.getNumberItem("bihuType",0);
        else
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_bihu, 0); 
        
        this.bihuList_radio.selectItem(_bihu);
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        list.push(_play.getChildByName("nullhu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 1);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_faPai, 1);
        }

        this.faPaiList_radio.selectItem(_faPai);
        list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        var _xingType;
        if(atClub)
            _xingType = this.getNumberItem("xingType",0);
        else
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_xingType, 0);

        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _suanfen;
        if(atClub)
            _suanfen = this.getBoolItem("isErfen",false);
        else
            _suanfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_difenType, false);

        this.suanfen.setSelected(_suanfen);
        var txt = this.suanfen.getChildByName("text");
        if(_suanfen){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongdianhei;
        if(atClub)
            _hongdianhei = this.getBoolItem("isHongheidian",false);
        else
            _hongdianhei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_hongdianhei, false);

        this.hongdianhei.setSelected(_hongdianhei);
        var txt = this.hongdianhei.getChildByName("text");
        if(_hongdianhei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _zimodouble;
        if(atClub)
            _zimodouble = this.getBoolItem("isZiMoRate",true);
        else
            _zimodouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_zimodouble, true);

        this.zimodouble.setSelected(_zimodouble);
        var txt = this.zimodouble.getChildByName("text");
        if(_zimodouble){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isAlldemit;
        if(atClub)
            _isAlldemit = this.getBoolItem("isAlldemit",true);
        else
            _isAlldemit = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_isAlldemit, false);

        this.isAlldemit.setSelected(_isAlldemit);
        var txt = this.isAlldemit.getChildByName("text");
        if(_isAlldemit){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiwushi;
        if(atClub)
            _yiwushi = this.getBoolItem("isYiwushi", false);
        else
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_yiwushi, false); 

        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(_yiwushi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_qipai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard)
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var _diFen;
        if (atClub){
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, -1);
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[index];
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        list.push(_play.getChildByName("fanBei0"));
        list.push(_play.getChildByName("fanBei1"));
        list.push(_play.getChildByName("fanBei5"));
        list.push(_play.getChildByName("fanBei2"));
        list.push(_play.getChildByName("fanBei3"));
        list.push(_play.getChildByName("fanBei4"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);

        // 托管
        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300: 4}[this.getNumberItem("trustTime", -1)];
        }else{
            _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_trust, 0);
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
        //this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var trustIndex = this.trustList_radio.getSelectIndex();
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI;
        para.maxPlayer = 3;//人数
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡 2:无点炮
        para.xingType = this.xingTypeList_radio.getSelectIndex();//醒 0：不带醒 1：随醒     2：翻醒
        para.isErfen = this.suanfen.isSelected();//底分2分
        para.isHongheidian = this.hongdianhei.isSelected();//红黑胡
        para.isZiMoRate = this.zimodouble.isSelected();//自摸翻倍
        para.isAlldemit = this.isAlldemit.isSelected();//解散须全部人同意
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.diFen = [-1,10,15,20,30,10000][this.diFenList_radio.getSelectIndex()];
        para.isYiwushi = this.yiwushi.isSelected();
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][trustIndex];

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_xingType, para.xingType);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_difenType, para.isErfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_hongdianhei, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_zimodouble, para.isZiMoRate);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_isAlldemit, para.isAlldemit);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_qipai, this.cutCardList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, para.diFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_trust, trustIndex);
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