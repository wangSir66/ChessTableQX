/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_ShiHuKa = CreateRoomNode.extend({
    initAll:function()
    {
        if(!this._isFriendCard){
            this.localStorageKey.KEY_HYShiHuKa_maxPlayer = "_HYShiHuKa_maxPlayer";      //人数
            this.localStorageKey.KEY_HYShiHuKa_bihu       = "_HYShiHuKa_bihu";          //必胡
            this.localStorageKey.KEY_HYShiHuKa_xingType    = "_HYShiHuKa_xingType";       //醒
            this.localStorageKey.KEY_HYShiHuKa_hongziType    = "_HYShiHuKa_hongziType";       //红字
            this.localStorageKey.KEY_HYShiHuKa_fangpaoType    = "_HYShiHuKa_fangpaoType";       //放炮
            this.localStorageKey.KEY_HYShiHuKa_suanfenType      = "_HYShiHuKa_suanfenType";         //算分
            this.localStorageKey.KEY_HYShiHuKa_yiwushi     = "_HYShiHuKa_yiwushi";        //一五十
            this.localStorageKey.KEY_HYShiHuKa_tianhu= "_HYShiHuKa_tianhu";   //天胡
            this.localStorageKey.KEY_HYShiHuKa_dihu= "_HYShiHuKa_dihu";   //地胡
            this.localStorageKey.KEY_HYShiHuKa_haidihu        = "_HYShiHuKa_haidihu";           //海底胡
            this.localStorageKey.KEY_HYShiHuKa_qiepai        = "_HYShiHuKa_qiepai";           //海底胡
            this.localStorageKey.KEY_HYShiHuKa_maiPai        = "_HYShiHuKa_maiPai"; //埋牌
            this.localStorageKey.KEY_HYShiHuKa_piaoHu        = "_HYShiHuKa_piaoHu";           //飘胡
            this.localStorageKey.KEY_HYShiHuKa_hongheidian        = "_HYShiHuKa_hongheidian"; //红黑点
            this.localStorageKey.KEY_HYShiHuKa_yiHongSanBei  = "_HYShiHuKa_yiHongSanBei"; //一点红3倍
            this.localStorageKey.KEY_HYShiHuKa_huLiangZhang  = "_HYShiHuKa_huLiangZhang"; //胡示众牌
            this.localStorageKey.KEY_HYShiHuKa_ziMoFanBei       = "_HYShiHuKa_ziMoFanBei";//自摸翻倍
        }
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYSHK12,  pay8:majiang.roundHYSHK8,  pay16:majiang.roundHYSHK16};
        // this.AAPay      = {pay4:majiang.roundHYSHKAA12,pay8:majiang.roundHYSHKAA8,pay16:majiang.roundHYSHKAA16};
        // this.clubPay    = {pay4:majiang.roundHYSHKCL12,pay8:majiang.roundHYSHKCL8,pay16:majiang.roundHYSHKCL16};

        this.roundNumObj = {roundNum1:8, roundNum2:10, roundNum3:12};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
            this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_ShiHuKa.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiHuKa").getChildByName("view");
    },
    radioBoxSelectCB_shiHuKa : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.checkSelect();
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.maxPlayerRadio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_shiHuKa.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerRadio, this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerRadio, this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        
        var bihuList = [];
        bihuList.push(_play.getChildByName("youhubihu"));
        bihuList.push(_play.getChildByName("dianpaobihu"));
        bihuList.push(_play.getChildByName("wuBiHu"));
        this.bihuList_radio = createRadioBoxForCheckBoxs(bihuList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(bihuList,0,this.bihuList_radio),bihuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,1,this.bihuList_radio),bihuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,2,this.bihuList_radio),bihuList[2].getChildByName("text"));

        var xingTypeList = [];
        xingTypeList.push(_play.getChildByName("play_budaixing"));
        xingTypeList.push(_play.getChildByName("play_genxing"));
        xingTypeList.push(_play.getChildByName("play_fanxing"));
        this.xingTypeList_radio = createRadioBoxForCheckBoxs(xingTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xingTypeList,0,this.xingTypeList_radio),xingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,1,this.xingTypeList_radio),xingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,2,this.xingTypeList_radio),xingTypeList[2].getChildByName("text"));

        var hongziTypeList = [];
        hongziTypeList.push(_play.getChildByName("wubei"));
        hongziTypeList.push(_play.getChildByName("sanhu"));
        this.hongziTypeList_radio = createRadioBoxForCheckBoxs(hongziTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(hongziTypeList,0,this.hongziTypeList_radio),hongziTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongziTypeList,1,this.hongziTypeList_radio),hongziTypeList[1].getChildByName("text"));

        var fangpaoTypeList = [];
        fangpaoTypeList.push(_play.getChildByName("fangpaosanbei"));
        fangpaoTypeList.push(_play.getChildByName("fangpaoerbei"));
        fangpaoTypeList.push(_play.getChildByName("fangpaoonebei"));
        this.fangpaoTypeList_radio = createRadioBoxForCheckBoxs(fangpaoTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fangpaoTypeList,0,this.fangpaoTypeList_radio),fangpaoTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fangpaoTypeList,1,this.fangpaoTypeList_radio),fangpaoTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fangpaoTypeList,2,this.fangpaoTypeList_radio),fangpaoTypeList[2].getChildByName("text"));

        this.suanfen = _play.getChildByName("play_erfen");
        this.suanfen.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.suanfen.getChildByName("text"));
        this.suanfen.addEventListener(this._clickCB.bind(this), this.suanfen);

        this.yiwushi = _play.getChildByName("yiwushi");
        this.yiwushi.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.yiwushi.getChildByName("text"));
        this.yiwushi.addEventListener(this._clickCB.bind(this), this.yiwushi);

        this.tianhu = _play.getChildByName("tianhu");
        this.tianhu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.tianhu.getChildByName("text"));
        this.tianhu.addEventListener(this._clickCB.bind(this), this.tianhu);

        this.dihu = _play.getChildByName("dihu");
        this.dihu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.dihu.getChildByName("text"));
        this.dihu.addEventListener(this._clickCB.bind(this), this.dihu);

        this.haidihu = _play.getChildByName("haidihu");
        this.haidihu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.haidihu.getChildByName("text"));
        this.haidihu.addEventListener(this._clickCB.bind(this), this.haidihu);

        this.piaoHu = _play.getChildByName("piaoHu");
        this.piaoHu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.piaoHu.getChildByName("text"));
        this.piaoHu.addEventListener(this._clickCB.bind(this), this.piaoHu);

        this.hongheidian = _play.getChildByName("hongheidian");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hongheidian.getChildByName("text"));
        this.hongheidian.addEventListener(this._clickCB.bind(this), this.hongheidian);

        this.maiPai = _play.getChildByName("maiPai");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        this.ziMoFanBei = _play.getChildByName("ziMoFanBei");
        this.ziMoFanBei.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.ziMoFanBei.getChildByName("text"));
        this.ziMoFanBei.addEventListener(this._clickCB.bind(this), this.ziMoFanBei);

        this.yiHongSanBei = _play.getChildByName("yiHongSanBei");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.yiHongSanBei.getChildByName("text"));
        this.yiHongSanBei.addEventListener(this._clickCB.bind(this), this.yiHongSanBei);

        this.huLiangZhang = _play.getChildByName("huLiangZhang");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.huLiangZhang.getChildByName("text"));
        this.huLiangZhang.addEventListener(this._clickCB.bind(this), this.huLiangZhang);

        //切牌
        var list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this._playNode_Card_radio = createRadioBoxForCheckBoxs(list,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(list,0,this._playNode_Card_radio),list[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(list,1,this._playNode_Card_radio),list[1].getChildByName("text")); 

        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }
    },

    checkSelect : function(){
        var maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
        var _play = this.bg_node.getChildByName("play");
        var wubei = _play.getChildByName("wubei");
        var sanhu = _play.getChildByName("sanhu");
        var yiHongSanBei = _play.getChildByName("yiHongSanBei");
        var hongzi = this.bg_node.getChildByName("hongzi");
        var flg = this.hongheidian.isSelected(); //红黑点
        if(flg){
            wubei.visible = true;
            sanhu.visible = true;
            hongzi.visible = true;
            yiHongSanBei.visible = true;
        }else{
            wubei.visible = false;
            hongzi.visible = false;
            sanhu.visible = false;
            yiHongSanBei.visible = false;
        }

        if(maxPlayer == 2){
            this.maiPai.visible = true;
        }else{
            this.maiPai.visible = false;
        }
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color(237,101,1);
                    var unSelectColor = cc.color(158,118,78);
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                        selectColor = cc.color(208,88,60);
                        unSelectColor = cc.color(72,94,112);
                    }
                    if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
                        selectColor = cc.color("#d21400");
                        unSelectColor = cc.color("#255662");
                    }
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

        this.checkSelect();
    },

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var maxPlayer;
        if(isClub){
            maxPlayer = this.getNumberItem("maxPlayer", 3);
        }else{
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_maxPlayer, 3);
        }
        maxPlayer = (maxPlayer == 3 ? 0 : 1);
        this.maxPlayerRadio.selectItem(maxPlayer);
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(maxPlayer,maxPlayerList[maxPlayer],maxPlayerList);

        var _bihu;
        if (isClub){
            _bihu = this.getNumberItem("bihuType", 0);
        }else {
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_bihu, 0);
        }
        this.bihuList_radio.selectItem(_bihu);
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        list.push(_play.getChildByName("wuBiHu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);

        var _xingType;
        if(isClub){
            _xingType = this.getNumberItem("xingType",1);
        }else{
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_xingType, 1);
        }
        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _hongziType;
        if(isClub){
            _hongziType = this.getNumberItem("hongziType",0);
        }else{
            _hongziType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_hongziType, 0);
        }
        this.hongziTypeList_radio.selectItem(_hongziType);
        list = [];
        list.push(_play.getChildByName("wubei"));
        list.push(_play.getChildByName("sanhu"));
        this.radioBoxSelectCB(_hongziType,list[_hongziType],list);

        var _fangpaoType;
        if (isClub){
            _fangpaoType = this.getNumberItem("fangpaoType", 0);
        }else{
            _fangpaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_fangpaoType, 0);
        }
        this.fangpaoTypeList_radio.selectItem(_fangpaoType);
        list = [];
        list.push(_play.getChildByName("fangpaosanbei"));
        list.push(_play.getChildByName("fangpaoerbei"));
        list.push(_play.getChildByName("fangpaoonebei"));
        this.radioBoxSelectCB(_fangpaoType,list[_fangpaoType],list);

        var _suanfen;
        if(isClub){
            _suanfen = this.getBoolItem("isErfen",false);
        }else{
            _suanfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_suanfenType, false);
        }
        this.suanfen.setSelected(_suanfen);
        var txt = this.suanfen.getChildByName("text");
        this.radioTextColor(txt, _suanfen);
        // if(_suanfen){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _yiwushi;
        if(isClub){
            _yiwushi = this.getBoolItem("isYiwushi",false);
        }else{
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_yiwushi, false);
        }
        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        this.radioTextColor(txt, _yiwushi);
        // if(_yiwushi){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _tianhu;
        if(isClub){
            _tianhu = this.getBoolItem("isTianhu",true);
        }else{
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_tianhu, true);
        }
        this.tianhu.setSelected(_tianhu);
        var txt = this.tianhu.getChildByName("text");
        this.radioTextColor(txt, _tianhu);
        // if(_tianhu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _dihu;
        if(isClub){
            _dihu = this.getBoolItem("isDihu",true);
        }else{
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_dihu, true);
        }
        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        this.radioTextColor(txt, _dihu);
        // if(_dihu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _haidihu;
        if(isClub){
            _haidihu = this.getBoolItem("isHaidihu",true);
        }else{
            _haidihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_haidihu, true);
        }
        this.haidihu.setSelected(_haidihu);
        var txt = this.haidihu.getChildByName("text");
        this.radioTextColor(txt, _haidihu);
        // if(_haidihu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        //this.changeAAPayForPlayerNum();

        var _piaoHu;
        if (isClub){
            _piaoHu = this.getBoolItem("isPiaoHu", false);
        }else{
            _piaoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_piaoHu, false);
        }
        this.piaoHu.setSelected(_piaoHu);
        var txt = this.piaoHu.getChildByName("text");
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_piaoHu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongheidian; 
        if(isClub)
            _hongheidian = this.getBoolItem("isHongheidian", true);
        else
            _hongheidian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_hongheidian, true);


        this.hongheidian.setSelected(_hongheidian);
        var txt = this.hongheidian.getChildByName("text");
        if(_hongheidian){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _ziMoFanBei; 
        if(isClub)
            _ziMoFanBei = this.getBoolItem("isZiMoFanBei", true);
        else
            _ziMoFanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_ziMoFanBei, true);


        this.ziMoFanBei.setSelected(_ziMoFanBei);
        var txt = this.ziMoFanBei.getChildByName("text");
        if(_ziMoFanBei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maiPai; 
        if(isClub)
            _maiPai = this.getBoolItem("isMaiPai", true);
        else
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_maiPai, true);
        this.maiPai.setSelected(_maiPai);
        var txt = this.maiPai.getChildByName("text");
        this.radioTextColor(txt, _maiPai);

        var _yiHongSanBei; 
        if(isClub)
            _yiHongSanBei = this.getBoolItem("isYiHongSanBei", false);
        else
            _yiHongSanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_yiHongSanBei, false);
        this.yiHongSanBei.setSelected(_yiHongSanBei);
        var txt = this.yiHongSanBei.getChildByName("text");
        if(_yiHongSanBei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _huLiangZhang; 
        if(isClub)
            _huLiangZhang = this.getBoolItem("isHuLiangZhang", true);
        else
            _huLiangZhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiHuKa_huLiangZhang, true);
        this.huLiangZhang.setSelected(_huLiangZhang);
        var txt = this.huLiangZhang.getChildByName("text");
        if(_huLiangZhang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        //切牌
        var cardIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiHuKa_qiepai, 0);
        if(isClub){
            cardIndex = this.getNumberItem("isManualCutCard",0);
        }
        this._playNode_Card_radio.selectItem(cardIndex);
        var _play = this.bg_node.getChildByName("play");
        list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this.radioBoxSelectCB(cardIndex,list[cardIndex],list);

        this.checkSelect();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_SHI_HU_KA;
        para.maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡
        para.xingType = this.xingTypeList_radio.getSelectIndex();//醒
        para.hongziType = this.hongziTypeList_radio.getSelectIndex();//红字
        para.fangpaoType = this.fangpaoTypeList_radio.getSelectIndex();//放炮
        para.isErfen = this.suanfen.isSelected();//底分2分
        para.isYiwushi = this.yiwushi.isSelected();//一五十
        para.isTianhu = this.tianhu.isSelected();//天胡
        para.isDihu = this.dihu.isSelected();//地胡
        para.isHaidihu = this.haidihu.isSelected();//海底胡
        para.isPiaoHu = this.piaoHu.isSelected();//飘胡
        para.isHongheidian = this.hongheidian.isSelected(); //红黑点
        para.isYiHongSanBei = this.yiHongSanBei.isSelected(); //一点红3倍
        para.isHuLiangZhang = this.huLiangZhang.isSelected(); //胡示众牌
        para.isZiMoFanBei = this.ziMoFanBei.isSelected();
        para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        //切牌
        para.isManualCutCard = this._playNode_Card_radio.getSelectIndex();
        cc.log("createara: " + JSON.stringify(para));

        if(para.maxPlayer != 2){
            para.isMaiPai = false;
        }
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_xingType, para.xingType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_hongziType, para.hongziType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_fangpaoType, para.fangpaoType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_suanfenType, para.isErfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_tianhu, para.isTianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_dihu, para.isDihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_haidihu, para.isHaidihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_piaoHu, para.isPiaoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_jiaChui, para.isJiaChui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiHuKa_qiepai, para.isManualCutCard ? 1 : 0);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_hongheidian, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_ziMoFanBei, para.isZiMoFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_huLiangZhang, para.isHuLiangZhang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiHuKa_yiHongSanBei, para.isYiHongSanBei);
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