/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_ylShiHuKa = CreateRoomNode.extend({
    initAll:function()
    {
        // if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
        //     this._costName = '房卡';
        // }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_BDHYShiHuKa_maxPlayer = "_BDHYShiHuKa_maxPlayer";      //人数
            this.localStorageKey.KEY_BDHYShiHuKa_bihu       = "_BDHYShiHuKa_bihu";          //必胡
            this.localStorageKey.KEY_BDHYShiHuKa_xingType    = "_BDHYShiHuKa_xingType";       //醒
            this.localStorageKey.KEY_BDHYShiHuKa_hongziType    = "_BDHYShiHuKa_hongziType";       //红字
            this.localStorageKey.KEY_BDHYShiHuKa_fangpaoType    = "_BDHYShiHuKa_fangpaoType";       //放炮
            this.localStorageKey.KEY_BDHYShiHuKa_suanfenType      = "_BDHYShiHuKa_suanfenType";         //算分
            this.localStorageKey.KEY_BDHYShiHuKa_yiwushi     = "_BDHYShiHuKa_yiwushi";        //一五十
            this.localStorageKey.KEY_BDHYShiHuKa_tianhu= "_BDHYShiHuKa_tianhu";   //天胡
            this.localStorageKey.KEY_BDHYShiHuKa_dihu= "_BDHYShiHuKa_dihu";   //天胡
            this.localStorageKey.KEY_BDHYShiHuKa_haidihu        = "_BDHYShiHuKa_haidihu";           //海底胡
            this.localStorageKey.KEY_BDHYShiHuKa_piaoHu        = "_BDHYShiHuKa_piaoHu";           //飘胡
            this.localStorageKey.KEY_BDHYShiHuKa_hongheidian        = "_BDHYShiHuKa_hongheidian";           //红黑点
            this.localStorageKey.KEY_BDHYShiHuKa_qiepai       = "_BDHYShiHuKa_qiepai";           //切牌
            this.localStorageKey.KEY_BDHYShiHuKa_ziMoFanBei       = "_BDHYShiHuKa_ziMoFanBei";           //自摸翻倍
            this.localStorageKey.KEY_BDHYShiHuKa_maiPai        = "_BDHYShiHuKa_maiPai"; //埋牌
            this.localStorageKey.KEY_BDHYShiHuKa_yiHongSanBei  = "_BDHYShiHuKa_yiHongSanBei"; //一点红3倍
            this.localStorageKey.KEY_BDHYShiHuKa_huLiangZhang  = "_BDHYShiHuKa_huLiangZhang"; //胡示众牌
            this.localStorageKey.KEY_BDHYShiHuKa_diFen= "_BDHYShiHuKa_diFen";   //低分翻倍
            this.localStorageKey.KEY_BDHYShiHuKa_trust= "_DaTongZiSY_trust";   //自动托管
        }
        this.setExtraKey({
            jieSuanDiFen: "_BDHYShiHuKa_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYSHK12,  pay8:majiang.roundHYSHK8,  pay16:majiang.roundHYSHK16};
        // this.AAPay      = {pay4:majiang.roundHYSHKAA12,pay8:majiang.roundHYSHKAA8,pay16:majiang.roundHYSHKAA16};
        // this.clubPay    = {pay4:majiang.roundHYSHKCL12,pay8:majiang.roundHYSHKCL8,pay16:majiang.roundHYSHKCL16};

        // this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16};
        // if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
        //     this.roundNumObj = {roundNum1:16, roundNum2:10, roundNum3:20, roundNum4:8};
        // }

        this.bg_node = ccs.load("bg_ylShiHuKa.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiHuKa").getChildByName("view");
        this.bg_node.jumpToTop();
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

        this.ziMoFanBei = _play.getChildByName("ziMoFanBei");
        this.ziMoFanBei.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.ziMoFanBei.getChildByName("text"));
        this.ziMoFanBei.addEventListener(this._clickCB.bind(this), this.ziMoFanBei);

        this.hongheidian = _play.getChildByName("hongheidian");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hongheidian.getChildByName("text"));
        this.hongheidian.addEventListener(this._clickCB.bind(this), this.hongheidian);

        this.huLiangZhang = _play.getChildByName("huLiangZhang");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.huLiangZhang.getChildByName("text"));
        this.huLiangZhang.addEventListener(this._clickCB.bind(this), this.huLiangZhang);

        this.maiPai = _play.getChildByName("maiPai");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        this.yiHongSanBei = _play.getChildByName("yiHongSanBei");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.yiHongSanBei.getChildByName("text"));
        this.yiHongSanBei.addEventListener(this._clickCB.bind(this), this.yiHongSanBei);

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
        this.trustList_radio = createRadioBoxForCheckBoxs(trustList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(trustList,0,this.trustList_radio),trustList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,1,this.trustList_radio),trustList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,2,this.trustList_radio),trustList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustList,3,this.trustList_radio),trustList[3].getChildByName("text"));

        //托管帮助
        var btn_fangZuoBiTip = this.bg_node.getChildByName("btn_fangZuoBiTip");
        var image_fangZuoBiTip = this.bg_node.getChildByName("image_fangZuoBiTip");
        btn_fangZuoBiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_fangZuoBiTip.setVisible(true);
            }
        }, btn_fangZuoBiTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_fangZuoBiTip.isVisible()) {
                    image_fangZuoBiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_fangZuoBiTip);

        //暂时隐藏托管
        btn_fangZuoBiTip.visible = false;
        image_fangZuoBiTip.visible = false;
        _play.getChildByName("trust0").visible = false;
        _play.getChildByName("trust1").visible = false;
        _play.getChildByName("trust2").visible = false;
        _play.getChildByName("trust3").visible = false;
        this.bg_node.getChildByName("tuoguang").visible = false;

        this.initExtraPlayNode(_play);
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
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color("#d21400"));
                    }else{
                        txt.setTextColor(cc.color("#255662"));
                    }
                    break;
            }
        this.checkSelect();
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var maxPlayer;
        if(atClub){
            maxPlayer = this.getNumberItem("maxPlayer", 3);
        }else{
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_maxPlayer, 3);
        }
        maxPlayer = (maxPlayer == 3 ? 0 : 1);
        this.maxPlayerRadio.selectItem(maxPlayer);
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(maxPlayer,maxPlayerList[maxPlayer],maxPlayerList);

        var _bihu;
        if(atClub)
            _bihu = this.getNumberItem("bihuType",0);
        else
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_bihu, 0); 

        this.bihuList_radio.selectItem(_bihu);
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        list.push(_play.getChildByName("wuBiHu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);

        var _xingType;
        if(atClub)
            _xingType = this.getNumberItem("xingType",1);
        else
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_xingType, 1);

        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _hongziType;
        if(atClub)
            _hongziType = this.getNumberItem("hongziType",0);
        else
            _hongziType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_hongziType, 0);

        this.hongziTypeList_radio.selectItem(_hongziType);
        list = [];
        list.push(_play.getChildByName("wubei"));
        list.push(_play.getChildByName("sanhu"));
        this.radioBoxSelectCB(_hongziType,list[_hongziType],list);

        var _fangpaoType;
        if(atClub)
            _fangpaoType = this.getNumberItem("fangpaoType",0);
        else
            _fangpaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_fangpaoType, 0);

        this.fangpaoTypeList_radio.selectItem(_fangpaoType);
        list = [];
        list.push(_play.getChildByName("fangpaosanbei"));
        list.push(_play.getChildByName("fangpaoerbei"));
        list.push(_play.getChildByName("fangpaoonebei"));
        this.radioBoxSelectCB(_fangpaoType,list[_fangpaoType],list);

        var _suanfen;
        if(atClub)
            _suanfen = this.getBoolItem("isErfen",false);
        else
            _suanfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_suanfenType, false);

        this.suanfen.setSelected(_suanfen);
        var txt = this.suanfen.getChildByName("text");
        if(_suanfen){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiwushi;
        if(atClub) 
            _yiwushi = this.getBoolItem("isYiwushi",false);
        else
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_yiwushi, false);

        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(_yiwushi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _tianhu;
        if(atClub) 
            _tianhu = this.getBoolItem("isTianhu",true);
        else
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_tianhu, true);


        this.tianhu.setSelected(_tianhu);
        var txt = this.tianhu.getChildByName("text");
        if(_tianhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dihu;
        if(atClub)
            _dihu = this.getBoolItem("isDihu",true);
        else
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_dihu, true);

        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _haidihu;
        if(atClub)
            _haidihu = this.getBoolItem("isHaidihu",true);
        else
            _haidihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_haidihu, true);

        this.haidihu.setSelected(_haidihu);
        var txt = this.haidihu.getChildByName("text");
        if(_haidihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _piaoHu;
        if(atClub)
            _piaoHu = this.getBoolItem("isPiaoHu",false);
        else
            _piaoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_piaoHu, false);

        this.piaoHu.setSelected(_piaoHu);
        var txt = this.piaoHu.getChildByName("text");
        if(_piaoHu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongheidian; 
        if(atClub)
            _hongheidian = this.getBoolItem("isHongheidian", true);
        else
            _hongheidian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_hongheidian, true);


        this.hongheidian.setSelected(_hongheidian);
        var txt = this.hongheidian.getChildByName("text");
        if(_hongheidian){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _ziMoFanBei; 
        if(atClub)
            _ziMoFanBei = this.getBoolItem("isZiMoFanBei", true);
        else
            _ziMoFanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_ziMoFanBei, true);


        this.ziMoFanBei.setSelected(_ziMoFanBei);
        var txt = this.ziMoFanBei.getChildByName("text");
        if(_ziMoFanBei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard)
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var _maiPai; 
        if(atClub)
            _maiPai = this.getBoolItem("isMaiPai", true);
        else
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_maiPai, true);
        this.maiPai.setSelected(_maiPai);
        var txt = this.maiPai.getChildByName("text");
        if(_maiPai){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiHongSanBei; 
        if(atClub)
            _yiHongSanBei = this.getBoolItem("isYiHongSanBei", false);
        else
            _yiHongSanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_yiHongSanBei, false);
        this.yiHongSanBei.setSelected(_yiHongSanBei);
        var txt = this.yiHongSanBei.getChildByName("text");
        if(_yiHongSanBei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _huLiangZhang; 
        if(atClub)
            _huLiangZhang = this.getBoolItem("isHuLiangZhang", true);
        else
            _huLiangZhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_huLiangZhang, true);
        this.huLiangZhang.setSelected(_huLiangZhang);
        var txt = this.huLiangZhang.getChildByName("text");
        if(_huLiangZhang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _diFen;
        if (atClub){
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_diFen, -1);
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

        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3}[this.getNumberItem("trustTime", -1)];
        }else{
            var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.checkSelect();

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        //this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_SHI_HU_KA;
        para.maxPlayer = this.maxPlayerRadio.getSelectIndex() == 0 ? 3 : 2;//人数
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡, 2: 无必胡
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
        para.isZiMoFanBei = this.ziMoFanBei.isSelected();
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.isHuLiangZhang = this.huLiangZhang.isSelected(); //胡示众牌
        para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        para.isYiHongSanBei = this.yiHongSanBei.isSelected(); //一点红3倍
        para.diFen = [-1,10,15,20,30,10000][this.diFenList_radio.getSelectIndex()];
        para.trustTime = [-1, 60, 120, 180][this.trustList_radio.getSelectIndex()];

        //暂时屏蔽托管
        para.trustTime = -1;

        if(para.maxPlayer != 2){
            para.isMaiPai = false;
        }
        if(!para.isHongheidian){
            para.isYiHongSanBei = false;
        }
        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_xingType, para.xingType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_hongziType, para.hongziType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_fangpaoType, para.fangpaoType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_suanfenType, para.isErfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_tianhu, para.isTianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_dihu, para.isDihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_haidihu, para.isHaidihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_piaoHu, para.isPiaoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_hongheidian, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_ziMoFanBei, para.isZiMoFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_huLiangZhang, para.isHuLiangZhang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_yiHongSanBei, para.isYiHongSanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYShiHuKa_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_qiepai, this.cutCardList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYShiHuKa_trust, this.trustList_radio.getSelectIndex());
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