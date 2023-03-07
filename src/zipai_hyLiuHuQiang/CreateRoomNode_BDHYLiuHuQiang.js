/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_BDHYLiuHuQiang = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        // if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
        //     this._costName = '房卡';
        // }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_BDHYLiuHuQiang_maxPlayer       = "_BDHYLiuHuQiang_maxPlayer";          //几人玩
            this.localStorageKey.KEY_BDHYLiuHuQiang_xingType    = "_BDHYLiuHuQiang_xingType";       //醒
            this.localStorageKey.KEY_BDHYLiuHuQiang_xiType      = "_BDHYLiuHuQiang_xiType";         //息
            this.localStorageKey.KEY_BDHYLiuHuQiang_suanfenType      = "_BDHYLiuHuQiang_suanfenType";         //算分
            this.localStorageKey.KEY_BDHYLiuHuQiang_mingwei        = "_BDHYLiuHuQiang_mingwei";           //明偎
            this.localStorageKey.KEY_BDHYLiuHuQiang_yiwushi     = "_BDHYLiuHuQiang_yiwushi";        //一五十
            this.localStorageKey.KEY_BDHYLiuHuQiang_hongheidian= "_BDHYLiuHuQiang_hongheidian";   //红黑点
            this.localStorageKey.KEY_BDHYLiuHuQiang_tianhu= "_BDHYLiuHuQiang_tianhu";   //天胡
            this.localStorageKey.KEY_BDHYLiuHuQiang_dihu= "_BDHYLiuHuQiang_dihu";   //地胡
            this.localStorageKey.KEY_BDHYLiuHuQiang_zhangShu= "_BDHYLiuHuQiang_zhangShu";   //21张
            this.localStorageKey.KEY_BDHYLiuHuQiang_bihu       = "_BDHYLiuHuQiang_bihu";          //必胡
            this.localStorageKey.KEY_BDHYLiuHuQiang_qiepai       = "_BDHYLiuHuQiang_qiepai";          //切牌
            this.localStorageKey.KEY_BDHYLiuHuQiang_maiPai        = "_BDHYShiHuKa_maiPai"; //埋牌
            this.localStorageKey.KEY_BDHYLiuHuQiang_maiPaiNum        = "_BDHYShiHuKa_maiPaiNum"; //埋牌数
            this.localStorageKey.KEY_BDHYLiuHuQiang_huLiangZhang  = "_BDHYShiHuKa_huLiangZhang"; //胡示众牌
            //this.localStorageKey.KEY_BDHYLiuHuQiang_diFen= "_BDHYLiuHuQiang_diFen";   //低分翻倍
            this.localStorageKey.KEY_BDHYLiuHuQiang_trust= "_BDHYLiuHuQiang_trust";   //自动托管
            this.localStorageKey.KEY_BDHYLiuHuQiang_zhuangJia= "_BDHYLiuHuQiang_zhuangJia";   //庄家


        }
        this.setExtraKey({
            fanBei: "_BDHYLiuHuQiang_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_BDHYLiuHuQiang_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_BDHYLiuHuQiang_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });
        
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYLHQ12,  pay8:majiang.roundHYLHQ8,  pay16:majiang.roundHYLHQ16};
        // this.AAPay      = {pay4:majiang.roundHYLHQAA12,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // this.clubPay    = {pay4:majiang.roundHYLHQCL12,pay8:majiang.roundHYLHQCL8,pay16:majiang.roundHYLHQCL16};

        this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            this.roundNumObj = {roundNum1:16, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_hyLiuHuQiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("view");
        this.bg_node.jumpToTop();
    },

    radioBoxSelectCB_liuHuQiang : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    initPlayNode:function()
    { 
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_liuHuQiang.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));

        var bihuList = [];
        bihuList.push(_play.getChildByName("youhubihu"));
        bihuList.push(_play.getChildByName("dianpaobihu"));
        // bihuList.push(_play.getChildByName("wuBiHu"));
        this.bihuList_radio = createRadioBoxForCheckBoxs(bihuList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(bihuList,0,this.bihuList_radio),bihuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,1,this.bihuList_radio),bihuList[1].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(bihuList,2,this.bihuList_radio),bihuList[2].getChildByName("text"));

        var xingTypeList = [];
        xingTypeList.push(_play.getChildByName("play_budaixing"));
        xingTypeList.push(_play.getChildByName("play_genxing"));
        xingTypeList.push(_play.getChildByName("play_fanxing"));
        this.xingTypeList_radio = createRadioBoxForCheckBoxs(xingTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xingTypeList,0,this.xingTypeList_radio),xingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,1,this.xingTypeList_radio),xingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,2,this.xingTypeList_radio),xingTypeList[2].getChildByName("text"));

        var xiTypeList = [];
        xiTypeList.push(_play.getChildByName("xiType1"));
        xiTypeList.push(_play.getChildByName("xiType2"));
        xiTypeList.push(_play.getChildByName("xiType3"));
        this.xiTypeList_radio = createRadioBoxForCheckBoxs(xiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xiTypeList,0,this.xiTypeList_radio),xiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,1,this.xiTypeList_radio),xiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,2,this.xiTypeList_radio),xiTypeList[2].getChildByName("text"));

        var suanfenTypeList = [];
        suanfenTypeList.push(_play.getChildByName("play_erfen"));
        suanfenTypeList.push(_play.getChildByName("play_onexionetun"));
        this.suanfenTypeList_radio = createRadioBoxForCheckBoxs_leiyang(suanfenTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,0,this.suanfenTypeList_radio),suanfenTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,1,this.suanfenTypeList_radio),suanfenTypeList[1].getChildByName("text"));

        this.mingwei = _play.getChildByName("play_mingwei");
        cc.eventManager.addListener(this.setTextClick(),this.mingwei.getChildByName("text"));
        this.mingwei.addEventListener(this._clickCB.bind(this), this.mingwei);

        this.yiwushi = _play.getChildByName("yiwushi");
        cc.eventManager.addListener(this.setTextClick(),this.yiwushi.getChildByName("text"));
        this.yiwushi.addEventListener(this._clickCB.bind(this), this.yiwushi);

        this.hongheidian = _play.getChildByName("hongheidian");
        cc.eventManager.addListener(this.setTextClick(),this.hongheidian.getChildByName("text"));
        this.hongheidian.addEventListener(this._clickCB.bind(this), this.hongheidian);

        this.tianhu = _play.getChildByName("tianhu");
        cc.eventManager.addListener(this.setTextClick(),this.tianhu.getChildByName("text"));
        this.tianhu.addEventListener(this._clickCB.bind(this), this.tianhu);

        this.dihu = _play.getChildByName("dihu");
        cc.eventManager.addListener(this.setTextClick(),this.dihu.getChildByName("text"));
        this.dihu.addEventListener(this._clickCB.bind(this), this.dihu);

        this.zhangShu = _play.getChildByName("zhangShu");
        cc.eventManager.addListener(this.setTextClick(),this.zhangShu.getChildByName("text"));
        this.zhangShu.addEventListener(this._clickCB.bind(this), this.zhangShu);

        this.huLiangZhang = _play.getChildByName("huLiangZhang");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.huLiangZhang.getChildByName("text"));
        this.huLiangZhang.addEventListener(this._clickCB.bind(this), this.huLiangZhang);

        this.maiPai = _play.getChildByName("maiPai");
        this.maiPai.visible = false;
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

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
            swallowTouches: false,
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

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        //低分翻倍
        /*var diFenList = [];
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
        cc.eventManager.addListener(this.setTextClick(diFenList,5,this.diFenList_radio),diFenList[5].getChildByName("text"));*/

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("zhuangJia1"));
        zhuangJiaList.push(_play.getChildByName("zhuangJia2"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        this.initExtraPlayNode(_play);

        //补充了0.5 覆盖基类的逻辑
        if(this.jieSuanDiFen){
            var range = [0.5,1,2,3,4,5,6,7,8,9,10];
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = parseFloat(text_diFen.getString());
                var idx = range.indexOf(diFen);
                
                if (idx < 0) {
                    idx = 1;
                }

                if (idx == 0) {
                    idx = range.length - 1;
                }else{
                    idx--;
                }

                diFen = range[idx];

                text_diFen.setString(diFen + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = parseFloat(text_diFen.getString());
                var idx = range.indexOf(diFen);
                
                if (idx < 0) {
                    idx = 1;
                }

                if (idx == range.length - 1) {
                    idx = 0;
                }else{
                    idx++;
                }

                diFen = range[idx];
                text_diFen.setString(diFen + "");
            });
        }
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
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color(237,101,1);
                    var unSelectColor = cc.color(158,118,78);
                    if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
                        selectColor = cc.color("#d21400");
                        unSelectColor = cc.color("#255662")
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

    checkSelect : function(){
        var maxPlayer= [4,3,2][this.maxPlayerList_radio.getSelectIndex()];
        if(maxPlayer == 4){
            this.setBoxStatus(this.zhangShu, undefined, false);
            // this.anCards.setEnabled(true);
        }else if(maxPlayer == 3 || maxPlayer == 2){
            this.setBoxStatus(this.zhangShu, undefined, true);
        }
        // this.maiPai.visible = false;
        // if(maxPlayer == 2){
        //     this.maiPai.visible = true;
        // }
        var selectColor = cc.color(237,101,1);
        var unSelectColor = cc.color(158,118,78);
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            selectColor = cc.color("#d21400");
            unSelectColor = cc.color("#255662")
        }
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

    setBoxStatus : function(box, isSelected, visible){
        if(isSelected != undefined){
            box.setSelected(isSelected);
            var txt = box.getChildByName("text");
            var selectColor = cc.color(237,101,1);
            var unSelectColor = cc.color(158,118,78);
            if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
                selectColor = cc.color("#d21400");
                unSelectColor = cc.color("#255662")
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
            if(isSelected){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }
        box.visible = visible;
    },

    setPlayNodeCurrentSelect:function(atClub)
    {

        cc.log("7897897 ---------------------- =" + false);

        var selectColor = cc.color(237,101,1);
        var unSelectColor = cc.color(158,118,78);
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            selectColor = cc.color("#d21400");
            unSelectColor = cc.color("#255662")
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }

        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer;
        if (atClub){ 
            var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
            _maxPlayer = [4,3,2].indexOf(temp_maxPlayer);
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maxPlayer, 0);
        }
 
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list = [];
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _bihu;
        if(atClub)
            _bihu = this.getNumberItem("bihuType",0);
        else
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_bihu, 0); 

        this.bihuList_radio.selectItem(_bihu);
        list = [];
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        // list.push(_play.getChildByName("wuBiHu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);
 
        var _xingType;
        if (atClub) 
            _xingType = this.getNumberItem("xingType", 0); 
        else
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_xingType, 0);
 
        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);
 
        var _xiType;
        if(atClub){
            var temp_xiType = this.getNumberItem("xiNum", 6);
            _xiType = [6,9,15].indexOf(temp_xiType); 
        }else{
            _xiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_xiType, 0);
        }


        this.xiTypeList_radio.selectItem(_xiType);
        list = [];
        list.push(_play.getChildByName("xiType1"));
        list.push(_play.getChildByName("xiType2"));
        list.push(_play.getChildByName("xiType3"));
        this.radioBoxSelectCB(_xiType,list[_xiType],list);

        // suanfenType
        var _suanfenType;
        if (atClub) {
            var temp_suanfenType = this.getNumberItem("suanfenType", 0);
            _suanfenType = temp_suanfenType == -1 ? -1 : temp_suanfenType - 1;
        }else{
            _suanfenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_suanfenType, -1);
        }
 
        if(_suanfenType != -1){
            this.suanfenTypeList_radio.selectItem(_suanfenType);
        }
        list = [];
        list.push(_play.getChildByName("play_erfen"));
        list.push(_play.getChildByName("play_onexionetun"));
        this.radioBoxSelectCB(_suanfenType,list[_suanfenType],list);

        var _mingwei;  
        if (atClub)
            _mingwei = this.getBoolItem("isMingwei", true);
        else
            _mingwei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_mingwei, true);

        this.mingwei.setSelected(_mingwei);
        var txt = this.mingwei.getChildByName("text");

        if(_mingwei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiwushi;
        if(atClub)
            _yiwushi = this.getBoolItem("isYiwushi", false);
        else
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_yiwushi, false); 

        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(_yiwushi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongheidian; 
        if(atClub)
            _hongheidian = this.getBoolItem("isHongheidian", true);
        else
            _hongheidian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_hongheidian, true);


        this.hongheidian.setSelected(_hongheidian);
        var txt = this.hongheidian.getChildByName("text");
        if(_hongheidian){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _tianhu;
        if(atClub)
            _tianhu = this.getBoolItem("isTianhu",true);
        else
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_tianhu, true);

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
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_dihu, true);

        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _zhangShu;  
        if(atClub)
            _zhangShu = this.getBoolItem("is21Zhang",false);
        else
            _zhangShu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_zhangShu, false);

        this.zhangShu.setSelected(_zhangShu);
        var txt = this.zhangShu.getChildByName("text");
        if(_zhangShu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maiPai; 
        var maiPaiNum;
        if(atClub){
            _maiPai = this.getBoolItem("isMaiPai", false);
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maiPai, false);
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maiPaiNum, 20);
        }
        maiPaiNum = _maiPai ? maiPaiNum : 0;
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);
        // this.maiPai.setSelected(_maiPai);
        // var txt = this.maiPai.getChildByName("text");
        // if(_maiPai){
        //     txt.setTextColor(selectColor);
        // }else{
        //     txt.setTextColor(unSelectColor);
        // }

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

        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300: 4}[this.getNumberItem("trustTime", -1)];
        }else{
            _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        list.push(_play.getChildByName("trust4"));
        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard)
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        /*var _diFen;
        if (atClub){
            _diFen = {"-1":0,10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_diFen, -1);
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
        this.radioBoxSelectCB(_diFen,list[_diFen],list);*/

        var zhuangJia;
        if (atClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_zhuangJia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        // this.changeAAPayForPlayerNum();

        this.checkSelect();
    },

    initExtraPlayNode:function(_playWay)
    {
        // 大结算翻倍
        if (_playWay.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_playWay.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_playWay.getChildByName("play_lessthan"));
            var sanBei = _playWay.getChildByName("play_less5SanBei")
            if (sanBei) nodeListFanBei.push(sanBei);
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB.bind(this));
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore;
                    if(scoreLabel.getString() == "不限分"){
                        curScore = 100;
                        scoreLabel.setString(curScore + "分");
                    }else{
                        curScore = parseInt(scoreLabel.getString());
                        if(curScore == 10){
                            scoreLabel.setString("不限分");
                        }else{
                            curScore -= 5;
                            scoreLabel.setString(curScore + "分");
                        }
                    }
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore;
                    if(scoreLabel.getString() == "不限分"){
                        curScore = 10;
                        scoreLabel.setString(curScore + "分");
                    }else{
                        curScore = parseInt(scoreLabel.getString());
                        if(curScore == 100){
                            scoreLabel.setString("不限分");
                        }else{
                            curScore += 5;
                            scoreLabel.setString(curScore + "分");
                        }
                    }
                }
            }, this);
        }

        //积分底分
        var i = 3;
        var jieSuanDiFenParent = _playWay;
        while(i >= 0){
            this.jieSuanDiFen = jieSuanDiFenParent.getChildByName("jieSuanDiFen");
            if(this.jieSuanDiFen){
                break;
            }
            jieSuanDiFenParent = jieSuanDiFenParent.getParent();
            if(!jieSuanDiFenParent){
                break;
            }
            i--;
        }
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = parseInt(text_diFen.getString());
                diFen -= 1;
                if(diFen < 1){
                    diFen = 10;
                }
                text_diFen.setString(diFen + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = parseInt(text_diFen.getString());
                diFen += 1;
                if(diFen > 10 ){
                    diFen = 1;
                }
                text_diFen.setString(diFen + "");
            });
        }
    },
    setExtraPlayNodeCurrentSelect:function(isClub)
    {
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("diFen", -1);
                fanBeiOption = fanBeiScore == - 1 ? 0 : 1;
                fanBeiScore = fanBeiScore == - 1 ? util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10) : fanBeiScore;
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            if(fanBeiScore == 10000){
                this.nodeListFanBei[1].getChildByName("score").setString("不限分");
            }else{
                this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            }

            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }
    },
    getExtraSelectedPara:function(para)
    {
        var fanBeiOption;
        var fanBeiScore;
        if (this.fanbei_radio) {
            if(this.nodeListFanBei[1].getChildByName("score").getString() == "不限分"){
                fanBeiScore = 10000;
            }else{
                fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            }
            fanBeiOption = this.fanbei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        if (!this._isFriendCard) {
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBei, fanBeiOption);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBeiScore, fanBeiScore);
            }

            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.jieSuanDiFen, para.jieSuanDiFen);
            }
        }
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var xiIndex = this.xiTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_LIU_HU_QIANG;
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.xiNum = [6,9,15][xiIndex];
        para.xingType = this.xingTypeList_radio.getSelectIndex();
        para.suanfenType = parseInt(this.suanfenTypeList_radio.getSelectIndex())+parseInt(1);
        para.isMingwei = this.mingwei.isSelected();
        para.isYiwushi = this.yiwushi.isSelected();
        para.isHongheidian = this.hongheidian.isSelected();
        para.isTianhu = this.tianhu.isSelected();
        para.isDihu = this.dihu.isSelected();
        para.isHuLiangZhang = this.huLiangZhang.isSelected(); //胡示众牌
        // para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0 ? true : false;

        if(para.maxPlayer == 3 || para.maxPlayer == 2){
            para.is21Zhang = this.zhangShu.isSelected();
        }else{
            para.is21Zhang = false;
        }
        if(para.maxPlayer != 2){
            para.isMaiPai = false;
        }
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        //para.diFen = [-1,10,15,20,30,10000][this.diFenList_radio.getSelectIndex()];
        para.trustTime = [-1, 60, 120, 180, 300][this.trustList_radio.getSelectIndex()];

        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_xingType, para.xingType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_xiType, xiIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_suanfenType, this.suanfenTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_mingwei, para.isMingwei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_hongheidian, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_tianhu, para.isTianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_dihu, para.isDihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_zhangShu, para.is21Zhang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_qiepai, this.cutCardList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_huLiangZhang, para.isHuLiangZhang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maiPai, para.isMaiPai);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_trust, this.trustList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYLiuHuQiang_zhuangJia, para.zhuangJia);
        }

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // cc.log("wxd==========MjClient.MaxPlayerNum_leiyang============"+MjClient.MaxPlayerNum_leiyang)
        // if(4 > MjClient.MaxPlayerNum_leiyang){
        //     this.fangzhuPay = {pay4:majiang['roundHYLHQ4P' +  MjClient.MaxPlayerNum_leiyang ], pay8:majiang['roundHYLHQ8P' +  MjClient.MaxPlayerNum_leiyang ], pay16:majiang['roundHYLHQ16P' +  MjClient.MaxPlayerNum_leiyang ]};
        //     this.AAPay = {pay4:majiang['roundHYLHQAA4P' +  MjClient.MaxPlayerNum_leiyang ], pay8:majiang['roundHYLHQAA8P' +  MjClient.MaxPlayerNum_leiyang ], pay16:majiang['roundHYLHQAA16P' +  MjClient.MaxPlayerNum_leiyang ]};
        // }else{
        //     this.fangzhuPay = {pay4:majiang.roundHYLHQ4, pay8:majiang.roundHYLHQ8, pay16:majiang.roundHYLHQ16};
        //     this.AAPay = {pay4:majiang.roundHYLHQAA4,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // }
        // cc.log("wxd==========this.fangzhuPay============"+JSON.stringify(this.fangzhuPay));
        // this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});