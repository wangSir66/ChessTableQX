
var CreateRoomNode_xyHongZi = CreateRoomNode.extend({

    setKey:function()
    {
        this.localStorageKey.KEY_CSMJ_maxPlayer     = "_XYHZ_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_CSMJ_qiHuType      = "_XYHZ_QI_HU_TYPE";   //起胡
        // this.localStorageKey.KEY_CSMJ_shuangHe      = "_XYHZ_SHUANG_HE_FAN_BEI"; //双合翻倍
        // this.localStorageKey.KEY_CSMJ_daHu          = "_XYHZ_DA_HU";    // 大胡
        this.localStorageKey.KEY_CSMJ_pengHu        = "_XYHZ_peng_peng_hu";  // 碰碰胡
        this.localStorageKey.KEY_CSMJ_qiDui         = "_XYHZ_qi_dui";     // 七对
        this.localStorageKey.KEY_CSMJ_shangShou     = "_XYHZ_shang_shou";     // 王是否可以上手
        // this.localStorageKey.KEY_CSMJ_yiGuaBian     = "_XYHZ_yi_gua_bian";   // 一挂匾
        // this.localStorageKey.KEY_CSMJ_huDieFei      = "_XYHZ_hu_die_fei";    //蝴蝶飞
        this.localStorageKey.KEY_CSMJ_siPeng        = "_XYHZ_si_peng_dan_diao"; // 四碰单吊
        // this.localStorageKey.KEY_CSMJ_manTangHong   = "_XYHZ_man_tang_hong"; // 满堂红
        // this.localStorageKey.KEY_CSMJ_banBanHu      = "_XYHZ_ban_ban_hu";  // 板板胡
        this.localStorageKey.KEY_CSMJ_kingNum       = "_XYHZ_KING_NUM";        //王牌数
        // this.localStorageKey.KEY_CSMJ_shiErHong     = "_XYHZ_SHI_ER_HONG";   //十二红
        this.localStorageKey.KEY_CSMJ_jujuHong      = "_XYHZ_JU_JU_HONG";   //花胡
        // this.localStorageKey.KEY_CSMJ_banBanHuType  = "_XYHZ_BAN_BAN_HU_TYPE";   //板板胡的胡牌类型
        // this.localStorageKey.KEY_CSMJ_shiYiHong     = "_XYHZ_SHI_YI_HONG";   //十一红
        // this.localStorageKey.KEY_CSMJ_shiHong       = "_XYHZ_SHI_HONG";   //十红
        // this.localStorageKey.KEY_CSMJ_fengDing      = "_XYHZ_FENG_DING";   //80分封顶
        this.localStorageKey.KEY_CSMJ_maiPai         = "_XYHZ_MAI_PAI";   //埋牌
        this.localStorageKey.KEY_CSMJ_maiPaiNum         = "_XYHZ_MAI_PAI_NUM";   //埋牌数量
        this.localStorageKey.KEY_CSMJ_qiePai         = "_XYHZ_QIE_PAI";   //切牌
        this.localStorageKey.KEY_CSMJ_isRandomZhuang         = "_XYHZ_isRandomZhuang";   //随机坐庄
        this.localStorageKey.KEY_CSMJ_trustTime     ="_XYHZ_trustTime";    //托管

        this.setExtraKey({
            fanBei: "_XYHZ_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_XYHZ_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_XYHZ_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_xyHongZi.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_hongZi");
    },
    initPlayNode:function()
    {
        
        var _play = this.bg_node.getChildByName("view").getChildByName("play");
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4]);
		
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.changePayForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;

        //起胡
        var qiHuTypeList = [];
        qiHuTypeList.push(_play.getChildByName("play_sanhong"));
        qiHuTypeList.push(_play.getChildByName("play_sihong"));
        var self = this;
        this.qiHuTypeList_radio = createRadioBoxForCheckBoxs(qiHuTypeList, function(index){
            self.radioBoxSelectCB(index,qiHuTypeList[index],qiHuTypeList);
        });
        this.addListenerText(qiHuTypeList,this.qiHuTypeList_radio);
        this.qiHuTypeList = qiHuTypeList;

        //几王
        var kingNumList = [];
        kingNumList.push(_play.getChildByName("play_noking"));
        kingNumList.push(_play.getChildByName("play_oneking"));
        kingNumList.push(_play.getChildByName("play_twoking"));
        kingNumList.push(_play.getChildByName("play_threeking"));
        kingNumList.push(_play.getChildByName("play_fourking"));
        this.kingNumList_radio = createRadioBoxForCheckBoxs(kingNumList,this.radioBoxSelectCB);
        this.addListenerText(kingNumList,this.kingNumList_radio);
        this.kingNumList = kingNumList; 
        //板板胡胡牌类型
        // var banBanHuTypeList = [];
        // banBanHuTypeList.push(_play.getChildByName("banBanHuType_1"));
        // banBanHuTypeList.push(_play.getChildByName("banBanHuType_2")); 
        // this.banBanHuTypeList_radio = createRadioBoxForCheckBoxs(banBanHuTypeList,this.radioBoxSelectCB);
        // this.addListenerText(banBanHuTypeList,this.banBanHuTypeList_radio); 
        // this.banBanHuTypeList = banBanHuTypeList;
 
        var temp = this;
        // 单选框回调
        function clickCB_xyHongZi(sender, type){ 
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED: 
                    var txt = sender.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(this._selectColor);
                    } else {
                        txt.setTextColor(this._unSelectColor);
                    }
                    break;
            }
        };


 
        //玩法 双合翻倍
        // this.shuangHe = _play.getChildByName("shuangHe");
        // this.addListenerText(this.shuangHe);
        // this.shuangHe.addEventListener(clickCB_xyHongZi, this.shuangHe);
        // 大胡十分
        // this.dahu = _play.getChildByName("dahu");
        // this.addListenerText(this.dahu);
        // this.dahu.addEventListener(clickCB_xyHongZi, this.dahu);
        
        // 碰碰胡
        this.pengpenghu = _play.getChildByName("pengpenghu");
        this.addListenerText(this.pengpenghu);
        this.pengpenghu.addEventListener(clickCB_xyHongZi.bind(this), this.pengpenghu);

        // 埋牌
        this.maipai = _play.getChildByName("maipai");
        this.maipai.visible = false;
        this.addListenerText(this.maipai);
        this.maipai.addEventListener(clickCB_xyHongZi.bind(this), this.maipai); 

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        // 七对
        this.qidui = _play.getChildByName("qidui");
        this.addListenerText(this.qidui);
        this.qidui.addEventListener(clickCB_xyHongZi.bind(this), this.qidui);

        // 王上手
        this.shangshou = _play.getChildByName("shangshou");
        this.addListenerText(this.shangshou);
        this.shangshou.addEventListener(clickCB_xyHongZi.bind(this), this.shangshou);
        // 一挂匾
        // this.yiguabian = _play.getChildByName("yiguabian");
        // this.addListenerText(this.yiguabian);
        // this.yiguabian.addEventListener(clickCB_xyHongZi.bind(this), this.yiguabian);
        // // 蝴蝶飞
        // this.hudiefei = _play.getChildByName("hudiefei");
        // this.addListenerText(this.hudiefei);
        // this.hudiefei.addEventListener(clickCB_xyHongZi.bind(this), this.hudiefei);
        // 四碰
        this.sipeng = _play.getChildByName("sipeng");
        this.addListenerText(this.sipeng);
        this.sipeng.addEventListener(clickCB_xyHongZi.bind(this), this.sipeng);
        // 满堂红
        // this.mantanghong = _play.getChildByName("mantanghong");
        // this.addListenerText(this.mantanghong);
        // this.mantanghong.addEventListener(clickCB_xyHongZi.bind(this), this.mantanghong); 

        // 文本点击回调
        // var temp = this;
        // function touchTextCallBack(){
        //     temp.showbanBanHuType();
        // }

        // // 板板胡
        // this.banbanhu = _play.getChildByName("banbanhu");
        // this.addListenerText(this.banbanhu,null,touchTextCallBack);
        // this.banbanhu.addEventListener(clickCB_xyHongZi.bind(this), this.banbanhu); 

        // // // 十红 
        // this.shihong = _play.getChildByName("shihong");
        // this.addListenerText(this.shihong);
        // this.shihong.addEventListener(clickCB_xyHongZi.bind(this), this.shihong); 
  
        // // 十一红 
        // this.shiyihong = _play.getChildByName("shiyihong");
        // this.addListenerText(this.shiyihong);
        // this.shiyihong.addEventListener(clickCB_xyHongZi.bind(this), this.shiyihong); 

        // 花胡 
        this.jujuhong = _play.getChildByName("jujuhong");
        this.addListenerText(this.jujuhong);
        this.jujuhong.addEventListener(clickCB_xyHongZi.bind(this), this.jujuhong); 

        // 随机坐庄 
        this.isRandomZhuang = _play.getChildByName("isRandomZhuang");
        this.addListenerText(this.isRandomZhuang);
        this.isRandomZhuang.addEventListener(clickCB_xyHongZi.bind(this), this.isRandomZhuang); 

        // 80分封顶 
        // this.fengding = _play.getChildByName("fengding");
        // this.addListenerText(this.fengding);
        // this.fengding.addEventListener(clickCB_xyHongZi.bind(this), this.fengding); 

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("qiePai1"));
        qiePaiList.push(_play.getChildByName("qiePai2"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        //托管
        var tuoGuanList = [];
        for (var i = 1; i <=5; i++) {
            tuoGuanList.push(_play.getChildByName("tuoGuan"+i));
        }
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (tuoGuanTip.isVisible()) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);

        this.initExtraPlayNode(_play);
    },
    initExtraPlayNode:function (_playWay) {
        this._super(_playWay);
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.ignoreContentAdaptWithSize(true);
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = parseFloat(text_diFen.getString());
                diFen -= diFen <= 1 ? 0.5 : 1;
                if(diFen < 0.5){
                    diFen = 10;
                }
                text_diFen.setString(diFen.toString());
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = parseFloat(text_diFen.getString());
                diFen += diFen < 1 ? 0.5 : 1;
                if(diFen > 10){
                    diFen = 0.5;
                }
                text_diFen.setString(diFen.toString());
            });
        }
    },
    setExtraPlayNodeCurrentSelect:function (isClub) {
        this._super(isClub);
        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen.toString());
        }
    },
    getExtraSelectedPara:function(para)
    {
        this._super(para);
        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        if (!this._isFriendCard) {
            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.jieSuanDiFen, para.jieSuanDiFen);
            }
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    { 
        var maxPlayer;
        if (isClub)
            if (this.getBoolItem("convertible", false))
                maxPlayer = 3;
            else
                maxPlayer = [4, 3, 2, 4].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer,this.maxPlayerList[maxPlayer],this.maxPlayerList);

        var qiHuType;
        if (isClub)
            qiHuType = this.getNumberItem("minRedNum", 3);
        else
            qiHuType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_qiHuType, 3);
        qiHuType = [3, 4].indexOf(qiHuType);
        this.qiHuTypeList_radio.selectItem(qiHuType);
        this.radioBoxSelectCB(qiHuType,this.qiHuTypeList[qiHuType],this.qiHuTypeList);

        var kingNUm;
        if (isClub)
            kingNUm = this.getNumberItem("kingNum", 0);
        else
            kingNUm = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_kingNum, 0);
        this.kingNumList_radio.selectItem(kingNUm);
        this.radioBoxSelectCB(kingNUm,this.kingNumList[kingNUm],this.kingNumList);

        // 板板胡胡牌类型
        // var banBanHuTypeIndex;
        // if (isClub)
        //     banBanHuTypeIndex = this.getNumberItem("banBanHuType", 0);
        // else
        //     banBanHuTypeIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_banBanHuType, 0);
        // this.banBanHuTypeList_radio.selectItem(banBanHuTypeIndex);

        // this.radioBoxSelectCB(banBanHuTypeIndex,this.banBanHuTypeList[banBanHuTypeIndex],this.banBanHuTypeList);

 
        // var shuangHe;
        // if (isClub)
        //     shuangHe = this.getBoolItem("isShuangHe", true);
        // else
        //     shuangHe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_shuangHe, true);
        // this.shuangHe.setSelected(shuangHe);
        // var text = this.shuangHe.getChildByName("text");
        // this.selectedCB(text,shuangHe)

        ///////////////////
 
        // 大胡
        // var dahu;
        // if (isClub)
        //     dahu = this.getBoolItem("isDaHu", false);
        // else
        //     dahu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_daHu, false);
        // this.dahu.setSelected(dahu);
        // var text = this.dahu.getChildByName("text");
        // this.selectedCB(text,dahu)

        // 碰碰胡 （默认选中）
        var pengpenghu;  
        if (isClub)
            pengpenghu = this.getBoolItem("isPengPengHu", true);
        else
            pengpenghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_pengHu, true);
        this.pengpenghu.setSelected(pengpenghu);
        var text = this.pengpenghu.getChildByName("text");
        this.selectedCB(text,pengpenghu)


        // this.maipai
        var isMaiPai;  //二人玩法埋牌选项，默认不选中
        var maiPaiNum;
        if (isClub){
            isMaiPai = this.getBoolItem("isMaiPai", false);
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_maiPai, false);
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_maiPaiNum, 20);
        }
        maiPaiNum = isMaiPai ? maiPaiNum : 0;
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);
 
        // var isTwo = maxPlayer == 2;
        // this.maipai.setSelected(isMaiPai && isTwo);
        // var text = this.maipai.getChildByName("text");
        // this.selectedCB(text,isMaiPai && isTwo); 
        // this.maipai.setVisible(isTwo);  



        var qidui;  
        if (isClub)
            qidui = this.getBoolItem("isQiDui", true);
        else
            qidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_qiDui, true);
        this.qidui.setSelected(qidui);
        var text = this.qidui.getChildByName("text");
        this.selectedCB(text,qidui)

        // 王是否可以上手
        var isShangShou;  
        if (isClub)
            shangshou = this.getBoolItem("isShangShou", false);
        else
            shangshou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_shangShou, false);
        this.shangshou.setSelected(shangshou);
        var text = this.shangshou.getChildByName("text");
        this.selectedCB(text,shangshou)

        // 一挂匾 （默认选中）
        // var yiguabian;
        // if (isClub)
        //     yiguabian = this.getBoolItem("isYiGuaBian", true);
        // else
        //     yiguabian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_yiGuaBian, true);
        // this.yiguabian.setSelected(yiguabian);
        // var text = this.yiguabian.getChildByName("text");
        // this.selectedCB(text,yiguabian)

        // 蝴蝶飞 （默认选中）
        // var hudiefei;
        // if (isClub)
        //     hudiefei = this.getBoolItem("isHuDieFei", true);
        // else
        //     hudiefei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_huDieFei, true);
        // this.hudiefei.setSelected(hudiefei);
        // var text = this.hudiefei.getChildByName("text");
        // this.selectedCB(text,hudiefei)

         // 四碰 （默认选中）
        var sipeng;
        if (isClub)
            sipeng = this.getBoolItem("isSiPeng", false);
        else
            sipeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_siPeng, false);
        this.sipeng.setSelected(sipeng);
        var text = this.sipeng.getChildByName("text");
        this.selectedCB(text,sipeng)

        // 满堂红 （默认选中）
        // var mantanghong;
        // if (isClub)
        //     mantanghong = this.getBoolItem("isManTangHong", true);
        // else
        //     mantanghong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_manTangHong, true);
        // this.mantanghong.setSelected(mantanghong);
        // var text = this.mantanghong.getChildByName("text");
        // this.selectedCB(text,mantanghong)

        // 板板胡默认选中
        // var banbanHu;
        // if (isClub)
        //     banbanHu = this.getBoolItem("isBanBanHu", true);
        // else
        //     banbanHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_banBanHu, true);
        // this.banbanhu.setSelected(banbanHu);
        // var text = this.banbanhu.getChildByName("text");
        // this.selectedCB(text,banbanHu)

        // // 控制板板胡是否显示
        // this.showbanBanHuType();  
    
         // 十红默认不选中
        // var shihong;
        // if (isClub)
        //     shihong = this.getBoolItem("isShiHong", false);
        // else
        //     shihong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_shiHong, false);
        // this.shihong.setSelected(shihong);
        // var text = this.shihong.getChildByName("text");
        // this.selectedCB(text,shihong)


        // 十一红默认不选中
        // var shiyihong;
        // if (isClub)
        //     shiyihong = this.getBoolItem("isShiYiHong", false);
        // else
        //     shiyihong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_shiYiHong, false);
        // this.shiyihong.setSelected(shiyihong);
        // var text = this.shiyihong.getChildByName("text");
        // this.selectedCB(text,shiyihong)

 
        // // 八十分封顶
        // var fengding;
        // if (isClub)
        //     fengding = this.getBoolItem("isFengDing", false);
        // else
        //     fengding = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_fengDing, false);
        // this.fengding.setSelected(fengding);
        // var text = this.fengding.getChildByName("text");
        // this.selectedCB(text,fengding)

        // 花胡默认选中
        var jujuhong;
        if (isClub)
            jujuhong = this.getBoolItem("isJuJuHong", true);
        else
            jujuhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_jujuHong, true);
        this.jujuhong.setSelected(jujuhong);
        var text = this.jujuhong.getChildByName("text");
        this.selectedCB(text,jujuhong);

        // 随机坐庄
        var randomZhuang;
        if (isClub)
            randomZhuang = this.getBoolItem("isRandomZhuang", false);
        else
            randomZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_isRandomZhuang, false);
        this.isRandomZhuang.setSelected(randomZhuang);
        var text = this.isRandomZhuang.getChildByName("text");
        this.selectedCB(text,randomZhuang);

        var qiePai;
        if (isClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        var tuoGuan;
        if (isClub){
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        }
        else{
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_trustTime, -1));
        }
        tuoGuan = tuoGuan<0 ? 0 : tuoGuan;
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        this.setExtraPlayNodeCurrentSelect(isClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();
    },
    // 控制板板胡是否显示
    showbanBanHuType : function() {
        // var isShow = this.banbanhu.isSelected();
        // // title
        // var round = this.bg_node.getChildByName("round"); 
        // round.getChildByName("banbanhuName").setVisible(isShow);
        // // select 
        // var _pay = this.bg_node.getChildByName("play"); 
        // for (var i = 0; i < 2; i++) { 
        //     _pay.getChildByName("banBanHuType_" + (i+1)).setVisible(isShow);
        // }  
    }, 

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_YIN_ZHUO_HONG_ZI;
        para.convertible = this.maxPlayerList_radio.getSelectIndex() == 3;  // 自由人数
        para.maxPlayer = [4,3,2,4][this.maxPlayerList_radio.getSelectIndex()];     // 人数
        para.minRedNum = [3,4][this.qiHuTypeList_radio.getSelectIndex()];   // 起胡
        para.kingNum = [0,1,2,3,4][this.kingNumList_radio.getSelectIndex()]; // 王数量 int
        // para.isShuangHe = this.shuangHe.isSelected(); // 是否双合翻倍 
        // 新增
        // para.isDaHu         = this.dahu.isSelected(); // 大胡
        para.isPengPengHu   = this.pengpenghu.isSelected(); // 碰碰胡
        
        para.maiPaiNum = (para.maxPlayer == 2 || para.convertible) ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0 ? true : false;
        // para.isMaiPai       = this.maipai.isSelected(); // 埋牌
        para.isQiDui        = this.qidui.isSelected(); // 七对
        // para.isYiGuaBian    = this.yiguabian.isSelected(); // 一挂匾
        // para.isHuDieFei     = this.hudiefei.isSelected(); // 蝴蝶飞
        para.isSiPeng       = this.sipeng.isSelected(); // 四碰
        // para.isManTangHong  = this.mantanghong.isSelected(); // 满堂红
        // para.isBanBanHu     = this.banbanhu.isSelected();  // 板板胡
        // para.isShiHong    = this.shihong.isSelected(); // 十红
        // para.isShiYiHong    = this.shiyihong.isSelected(); // 十一红
        // para.isFengDing     = this.fengding.isSelected(); // 80分封顶

        para.isJuJuHong     = this.jujuhong.isSelected(); // 花胡
        para.isShangShou    = this.shangshou.isSelected(); // 王是否可以上手 
        // para.banBanHuType   = this.banBanHuTypeList_radio.getSelectIndex(); // 板板胡 胡牌类型
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.isRandomZhuang = this.isRandomZhuang.isSelected(); //随机坐庄
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()]; //托管

        this.getExtraSelectedPara(para);
 
        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_qiHuType, para.minRedNum);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_shuangHe, para.isShuangHe);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_kingNum, para.kingNum);
            // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_banBanHu, para.isBanBanHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_maiPaiNum, para.maiPaiNum);
            // 新增
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_daHu, para.isDaHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_pengHu, para.isPengPengHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_qiDui, para.isQiDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_shangShou, para.isShangShou);
            
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_yiGuaBian, para.isYiGuaBian);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_huDieFei, para.isHuDieFei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_siPeng, para.isSiPeng);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_manTangHong, para.isManTangHong);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_shiHong, para.isShiHong); // 十红
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_shiYiHong, para.isShiYiHong); // 十一红
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_fengDing, para.isFengDing); // 十一红
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_jujuHong, para.isJuJuHong);
            // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_banBanHuType, para.banBanHuType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_isRandomZhuang, para.isRandomZhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_trustTime, para.trustTime);
        }


        return para;
    },
    changePayForPlayerNum:function(select_number)
    {
        if (select_number != null) {
            MjClient.MaxPlayerNum = 4 - select_number;
        }
        cc.log("create select_numberselect_numberselect_number -- by sking",select_number);
        this.setDiaNumData(this.bg_node);
        // if(select_number != null && select_number != undefined ){
        //     this.maipai.setVisible(select_number == 2);
        //     this.maipai.setSelected(false);
        //     var text = this.maipai.getChildByName("text");
        //     this.selectedCB(text,false); 
        // }
        var select_index = this.maxPlayerList_radio.getSelectIndex()
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191,191,191);
        if (select_index == 3 || select_index == 2) {
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                if(select_index == 3){
                    txt.setString(["不埋牌","2人埋牌10张","2人埋牌20张"][i]);
                }
                else
                {
                    txt.setString(["不埋牌","埋10张","埋20张"][i]);
                }
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }
        }
        else
        {
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setString(["不埋牌","埋10张","埋20张"][i]);
                txt.setTextColor(unEnableColor);
            }
        }
    }

});