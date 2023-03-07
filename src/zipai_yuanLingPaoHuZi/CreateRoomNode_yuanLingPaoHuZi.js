//郴州字牌
var CreateRoomNode_yuanLingPaoHuZi = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maxPlayer       = "_YuanLingMaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tunNum      = "_YuanLingMaoHuZi_tunNum";         //充囤数
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_fengDing     = "_YuanLingMaoHuZi_fengDing";         // 封顶
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_playType       ="_YuanLingMaoHuZi_playType";    //玩法
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPai20     ="_YuanLingMaoHuZi_maiPai20";    //埋牌20
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPaiType     ="_YuanLingMaoHuZi_maiPaiType";    //埋牌方式  0：不埋   1：埋10   2：埋20
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jieSuanDiFen                =  "_YuanJiangGuiHuZi_jieSuanDiFen"; //底分

        /*mdz========================================全名堂*/
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tianHu     ="_YuanLingMaoHuZi_tianHu";    //天胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_diHu     ="_YuanLingMaoHuZi_diHu";    //地胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_haiDiHu     ="_YuanLingMaoHuZi_haiDiHu";    //海底胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hongHu     ="_YuanLingMaoHuZi_hongHu";    //红胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_heiHu     ="_YuanLingMaoHuZi_heiHu";    //黑胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_dianHu     ="_YuanLingMaoHuZi_dianHu";    //点胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daHu     ="_YuanLingMaoHuZi_daHu";    //大胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_xiaoHu     ="_YuanLingMaoHuZi_xiaoHu";    //小胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_duiZiHu     ="_YuanLingMaoHuZi_duiZiHu";    //对子胡

        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daTuanYuan     ="_YuanLingMaoHuZi_daTuanYuan";    //大团圆
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hangHangXi     ="_YuanLingMaoHuZi_hangHangXi";    //行行息
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_shuaHou     ="_YuanLingMaoHuZi_shuaHou";    //耍候
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tingHu     ="_YuanLingMaoHuZi_tingHu";    //听胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_huangFanDouble     ="_YuanLingMaoHuZi_huangFanDouble";    //黄番2倍
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jiaHangHang     ="_YuanLingMaoHuZi_jiaHangHang";    //假行行
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_siQiHong     ="_YuanLingMaoHuZi_siQiHong";    //四七红
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_beiKaoBei     ="_YuanLingMaoHuZi_beiKaoBei";    //背靠背
        /*mdz========================================全名堂*/

        /*mdz========================================红黑点*/
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongHu     ="_YuanLingMaoHuZi_HHD_HongHu";    //红胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DianHu     ="_YuanLingMaoHuZi_HHD_DianHu";    //点胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HeiHu     ="_YuanLingMaoHuZi_HHD_HeiHu";    //黑胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongWu     ="_YuanLingMaoHuZi_HHD_HongWu";    //红乌
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DuiZiHu     ="_YuanLingMaoHuZi_HHD_DuiZiHu";    //对子胡
        /*mdz========================================红黑点*/

        /*mdz========================================多红对*/
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HongHu    ="_YuanLingMaoHuZi_DHD_HongHu";    //红胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DianHu     ="_YuanLingMaoHuZi_DHD_DianHu";    //点胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HeiHu     ="_YuanLingMaoHuZi_DHD_HeiHu";    //黑胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DuiZiHu     ="_YuanLingMaoHuZi_DHD_DuiZiHu";    //对子胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TianHu     ="_YuanLingMaoHuZi_DHD_TianHu";    //天胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DiHu     ="_YuanLingMaoHuZi_DHD_DiHu";    //地胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HaiHu     ="_YuanLingMaoHuZi_DHD_HaiHu";    //海胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TingHu     ="_YuanLingMaoHuZi_DHD_TingHu";    //听胡
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HuangFan     ="_YuanLingMaoHuZi_DHD_HuangFan";    //黄番
        /*mdz========================================多红对*/
        this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_trust                = "YuanLingMaoHuZi_trust";                //托管
        this.localStorageKey.KEY_NanXianGuiHuZi_fanbei                    = "_NanXianGuiHuZi_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore              = "_NanXianGuiHuZi_BEI_SCORE";  //少于X分大结算翻倍


        this.roundNumObj = {roundNum1:8, roundNum2:10, roundNum3:16};

        this.bg_node = ccs.load("bg_yuanLingPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1")];
        this.initPlayNumNode(maxPlayerList, [3, 2]);

        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio, this.checkMaxPlayerSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio, this.checkMaxPlayerSelect.bind(this)),maxPlayerList[1].getChildByName("text"));

        //充囤
        var tunNumList = this.tunNumList = [_play.getChildByName("tun_0"), _play.getChildByName("tun_1"), _play.getChildByName("tun_2"),
            _play.getChildByName("tun_3"), _play.getChildByName("tun_4"), _play.getChildByName("tun_5")];
        this.tunNumList_radio = createRadioBoxForCheckBoxs(tunNumList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(tunNumList,0,this.tunNumList_radio),tunNumList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tunNumList,1,this.tunNumList_radio),tunNumList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tunNumList,2,this.tunNumList_radio),tunNumList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tunNumList,3,this.tunNumList_radio),tunNumList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tunNumList,4,this.tunNumList_radio),tunNumList[4].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tunNumList,5,this.tunNumList_radio),tunNumList[5].getChildByName("text"));

        //封顶
        var fengDingList = [_play.getChildByName("fengDing_0"), _play.getChildByName("fengDing_100"), _play.getChildByName("fengDing_200"), _play.getChildByName("fengDing_300")];
        this.fengDingList_radio = createRadioBoxForCheckBoxs(fengDingList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fengDingList,0,this.fengDingList_radio),fengDingList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,1,this.fengDingList_radio),fengDingList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,2,this.fengDingList_radio),fengDingList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,3,this.fengDingList_radio),fengDingList[3].getChildByName("text"));

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            //埋牌选项
            var maiPaiList = [];
            var maiPaiItemCount = 3;
            for(var i = 0; i < maiPaiItemCount; i++){
                maiPaiList.push(_play.getChildByName("maiPai_"+i));
                if(i == maiPaiItemCount - 1){
                     this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList, this.checkMaiPaiSelect.bind(this), 0);
                     cc.each(maiPaiList,function(node,index){
                        cc.eventManager.addListener(this.setTextClick(maiPaiList, index, this.maiPaiList_radio), node.getChildByName("text"));
                        return true;
                     },this);
                }
            }
            this.maiPaiList = maiPaiList;
        }else{
            //埋牌20
            this.maiPai20 = _play.getChildByName("maiPai20");
            this.maiPai20.addEventListener(this._clickCB, this.maiPai20);
            cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maiPai20.getChildByName("text"));
        }

        //玩法
        this.qmtLayer = _play.getChildByName("qmtLayer");
        this.hhdLayer = _play.getChildByName("hhdLayer");
        this.dhdLayer = _play.getChildByName("dhdLayer");
        var playTypeList = [_play.getChildByName("quanMingTang"), _play.getChildByName("hongHeiDian"), _play.getChildByName("duoHongDui")];
        this.playTypeList_radio = createRadioBoxForCheckBoxs(playTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(playTypeList,0,this.playTypeList_radio),playTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(playTypeList,1,this.playTypeList_radio),playTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(playTypeList,2,this.playTypeList_radio),playTypeList[2].getChildByName("text"));

        //全名堂，红黑点，多红对玩法下的选项
        var qmtOptionNameList = ["tianHu", "diHu", "haiDiHu", "hongHu", "heiHu", "dianHu", "daHu", "xiaoHu", "duiZiHu",
            "daTuanYuan", "hangHangXi", "shuaHou", "tingHu", "huangFanDouble", "jiaHangHang", "siQiHong", "beiKaoBei"];
        var hhdOptionNameList = ["hhd_HongHu", "hhd_DianHu", "hhd_HeiHu", "hhd_HongWu", "hhd_DuiZiHu"];
        var dhdOptionNameList = ["dhd_HongHu", "dhd_DianHu", "dhd_HeiHu", "dhd_DuiZiHu", "dhd_TianHu", "dhd_DiHu", "dhd_HaiHu", "dhd_TingHu", "dhd_HuangFan"];
        var optionNodeListForQMT = [];
        var optionNodeListForHHD = [];
        var optionNodeListForDHD = [];
        for(var i = 0; i < qmtOptionNameList.length; i++)
        {
            var option = {};
            option.node = this.qmtLayer.getChildByName(qmtOptionNameList[i]);
            option.name = qmtOptionNameList[i];
            option.paraNum = i + 2;
            option.localKey = "";
            optionNodeListForQMT.push(option);
        };
        for(var i = 0; i < hhdOptionNameList.length; i++)
        {
            var option = {};
            option.node = this.hhdLayer.getChildByName(hhdOptionNameList[i]);
            option.name = hhdOptionNameList[i];
            option.paraNum = i + 21;
            option.localKey = "";
            optionNodeListForHHD.push(option);
        };
        for(var i = 0; i < dhdOptionNameList.length; i++)
        {
            var option = {};
            option.node = this.dhdLayer.getChildByName(dhdOptionNameList[i]);
            option.name = dhdOptionNameList[i];
            option.paraNum = i + 31;
            option.localKey = "";
            optionNodeListForDHD.push(option);
        };
        this.optionNodeListForQMT = optionNodeListForQMT;
        this.optionNodeListForHHD = optionNodeListForHHD;
        this.optionNodeListForDHD = optionNodeListForDHD;

        for(var i = 0; i < this.optionNodeListForQMT.length; i++)
        {
            cc.log("This QMT node's name is :" + this.optionNodeListForQMT[i].name)
            this.optionNodeListForQMT[i].node.addEventListener(this._clickCB, this.optionNodeListForQMT[i].node);
            cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.optionNodeListForQMT[i].node.getChildByName("text"));
            switch (this.optionNodeListForQMT[i].name)
            {
                /*==============================全名堂===================================*/
                case "tianHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tianHu;
                    break;
                case "diHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_diHu;
                    break;
                case "haiDiHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_haiDiHu;
                    break;
                case "hongHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hongHu;
                    break;
                case "heiHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_heiHu;
                    break;
                case "dianHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_dianHu;
                    break;
                case "daHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daHu;
                    break;
                case "xiaoHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_xiaoHu;
                    break;
                case "duiZiHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_duiZiHu;
                    break;
                case "daTuanYuan":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daTuanYuan;
                    break;
                case "hangHangXi":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hangHangXi;
                    break;
                case "shuaHou":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_shuaHou;
                    break;
                case "tingHu":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tingHu;
                    break;
                case "huangFanDouble":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_huangFanDouble;
                    break;
                case "jiaHangHang":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jiaHangHang;
                    break;
                case "siQiHong":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_siQiHong;
                    break;
                case "beiKaoBei":
                    this.optionNodeListForQMT[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_beiKaoBei;
                    break;
                default :
                    break;
            }
        }
        for(var i = 0; i < this.optionNodeListForHHD.length; i++)
        {
            cc.log("This HHD node's name is :" + this.optionNodeListForHHD[i].name)
            this.optionNodeListForHHD[i].node.addEventListener(this._clickCB, this.optionNodeListForHHD[i].node);
            cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.optionNodeListForHHD[i].node.getChildByName("text"));
            switch (this.optionNodeListForHHD[i].name)
            {
                /*==============================红黑点===================================*/
                case "hhd_HongHu":
                    this.optionNodeListForHHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongHu;
                    break;
                case "hhd_DianHu":
                    this.optionNodeListForHHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DianHu;
                    break;
                case "hhd_HeiHu":
                    this.optionNodeListForHHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HeiHu;
                    break;
                case "hhd_HongWu":
                    this.optionNodeListForHHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongWu;
                    break;
                case "hhd_DuiZiHu":
                    this.optionNodeListForHHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DuiZiHu;
                    break;
                default :
                    break;
            }
        }
        for(var i = 0; i < this.optionNodeListForDHD.length; i++)
        {
            cc.log("This DHD node's name is :" + this.optionNodeListForDHD[i].name)
            this.optionNodeListForDHD[i].node.addEventListener(this._clickCB, this.optionNodeListForDHD[i].node);
            cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.optionNodeListForDHD[i].node.getChildByName("text"));
            switch (this.optionNodeListForDHD[i].name)
            {
                /*==============================多红对===================================*/
                case "dhd_HongHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HongHu;
                    break;
                case "dhd_DianHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DianHu;
                    break;
                case "dhd_HeiHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HeiHu;
                    break;
                case "dhd_DuiZiHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DuiZiHu;
                    break;
                case "dhd_TianHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TianHu;
                    break;
                case "dhd_DiHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DiHu;
                    break;
                case "dhd_HaiHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HaiHu;
                    break;
                case "dhd_TingHu":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TingHu;
                    break;
                case "dhd_HuangFan":
                    this.optionNodeListForDHD[i].localKey = this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HuangFan;
                    break;
                default :
                    break;
            }
        }

        //托管
        if (_play.getChildByName("trust0")) {
            var trustList = [];
            trustList.push(_play.getChildByName("trust0"));
            trustList.push(_play.getChildByName("trust1"));
            trustList.push(_play.getChildByName("trust2"));
            trustList.push(_play.getChildByName("trust3"));
            trustList.push(_play.getChildByName("trust4"));
            this.trustList_radio = createRadioBoxForCheckBoxs(trustList,this.radioBoxSelectCB);
            this.addListenerText(trustList, this.trustList_radio);
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
        }

        // 大结算翻倍
        if (_play.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_play.getChildByName("play_lessthan"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
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
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }
        this.schedule(function() {
            this.qmtLayer.setVisible(_play.getChildByName("quanMingTang").isSelected());
            this.hhdLayer.setVisible(_play.getChildByName("hongHeiDian").isSelected());
            this.dhdLayer.setVisible(_play.getChildByName("duoHongDui").isSelected());
            var offset = 0;
            if(_play.getChildByName("hongHeiDian").isSelected())
            {
                offset = 56 * 4;
            }
            else if(_play.getChildByName("duoHongDui").isSelected())
            {
                offset = 56 * 3
            }
            _play.getChildByName("play_nofanbei").y = -691 + offset;
            _play.getChildByName("play_lessthan").y = -691 + offset;
            _play.getChildByName("text_fanbei").y = -691 + offset;

            _play.getChildByName("text_tuoguan").y = -570 + offset;
            _play.getChildByName("trust0").y = -570 + offset;
            _play.getChildByName("trust1").y = -570 + offset;
            _play.getChildByName("trust2").y = -570 + offset;
            _play.getChildByName("trust3").y = -627 + offset;
            _play.getChildByName("trust4").y = -627 + offset;
            _play.getChildByName("btnTrustTip").y = -627 + offset;
            _play.getChildByName("trustTip").y = -556 + offset;
        }.bind(this));

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

        this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                }
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                }
            }, this);
        }

    },

    checkMaxPlayerRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkMaxPlayerSelect();
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    checkMaxPlayerSelect: function(){
        var _maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            cc.each(this.maiPaiList,function(node, key){
                if(_maxPlayerIndex == 1){
                    cc.eventManager.resumeTarget(node,true);
                    this.maiPaiList_radio.selectItem(this.currMaiPaiType);
                    this.radioBoxSelectCB(this.currMaiPaiType,this.maiPaiList[this.currMaiPaiType],this.maiPaiList);
                }else{
                    cc.eventManager.pauseTarget(node,true);
                    for(var index in node.children){
                        node.children[index].setTextColor(cc.color("#a8a5a5"));
                        node.setSelected(false);
                    }
                }
            },this);
        }else{
            if(_maxPlayerIndex == 1)
                this.maiPai20.visible = true;
            else
                this.maiPai20.visible = false;
        }
        
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {3:0, 2:1}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1")];

        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;

        //充囤
        var _tunNum;
        if (atClub){
            _tunNum = this.getNumberItem("tunNum", 1);
        }else{
            _tunNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tunNum, 1);
        }

        list = [_play.getChildByName("tun_0"), _play.getChildByName("tun_1"), _play.getChildByName("tun_2"),
             _play.getChildByName("tun_3"), _play.getChildByName("tun_4"), _play.getChildByName("tun_5")];

        this.tunNumList_radio.selectItem(_tunNum);
        this.radioBoxSelectCB(_tunNum, list[_tunNum], list);

        var _fengding;
        if (atClub){
            _fengding = {0:0, 100:1, 200:2}[this.getNumberItem("fengDing", 0)];
        }else{
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_fengDing, 0);
        }
        list = [_play.getChildByName("fengDing_0"), _play.getChildByName("fengDing_100"), _play.getChildByName("fengDing_200"), _play.getChildByName("fengDing_300")];
        this.fengDingList_radio.selectItem(_fengding);
        this.radioBoxSelectCB(_fengding, list[_fengding], list);

        var _playType;
        if (atClub){
            _playType = {1:0, 2:1, 3:2}[this.getNumberItem("playType", 1)];
        }else{
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_playType, 0);
        }
        list = [_play.getChildByName("quanMingTang"), _play.getChildByName("hongHeiDian"), _play.getChildByName("duoHongDui")];
        this.playTypeList_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, list[_playType], list);

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var maiPaiType;
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 0);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPaiType, 0);

            var _maiPai; 
            if(atClub)
                _maiPai = this.getBoolItem("maiPai20", false);
            else
                _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPai20, false);

            if(!_maiPai) maiPaiType = 0;
            if(_maiPai && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
             //埋牌20
            var _maiPai20;
            if (atClub){
                _maiPai20 = this.getBoolItem("maiPai20", false);
            }else{
                _maiPai20 =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPai20, false);
            }
            this.maiPai20.setSelected(_maiPai20);
            var txt = this.maiPai20.getChildByName("text");
            txt.setTextColor(_maiPai20 ? selectColor : unSelectColor);
        }
        

        //全名堂，红黑点，多红对
        for(var i = 0; i < this.optionNodeListForQMT.length; i++){
            var name = this.optionNodeListForQMT[i].name;
            var paraNum = this.optionNodeListForQMT[i].paraNum;
            var local;
            if(atClub){
                local = this.getItem("playList", [2,3,4,5,6,7,8,9,10]).indexOf(paraNum) == -1 ? false : true;
            }else{
                if(name == "tianHu" || name == "diHu" || name == "haiDiHu" || name == "hongHu" || name == "heiHu" ||
                    name == "dianHu" || name == "daHu" || name == "xiaoHu" || name == "duiZiHu")
                {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForQMT[i].localKey, true);
                }
                else {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForQMT[i].localKey, false);
                }
            }
            this.optionNodeListForQMT[i].node.setSelected(local);
            var text = this.optionNodeListForQMT[i].node.getChildByName("text");
            text.setTextColor(local ? selectColor : unSelectColor);
        }
        for(var i = 0; i < this.optionNodeListForHHD.length; i++){
            var name = this.optionNodeListForHHD[i].name;
            var paraNum = this.optionNodeListForHHD[i].paraNum;
            var local;
            if(atClub){
                local = this.getItem("hongHeiDianList", [21,22,23,24]).indexOf(paraNum) == -1 ? false : true;
            }else{
                if(name == "hhd_HongHu" || name == "hhd_HeiHu" || name == "hhd_DianHu" || name == "hhd_HongWu")
                {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForHHD[i].localKey, true);
                }
                else {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForHHD[i].localKey, false);
                }
            }
            this.optionNodeListForHHD[i].node.setSelected(local);
            var text = this.optionNodeListForHHD[i].node.getChildByName("text");
            text.setTextColor(local ? selectColor : unSelectColor);
        }
        for(var i = 0; i < this.optionNodeListForDHD.length; i++){
            var name = this.optionNodeListForDHD[i].name;
            var paraNum = this.optionNodeListForDHD[i].paraNum;
            var local;
            if(atClub){
                local = this.getItem("duoHongDuiList", [31,32,33,34]).indexOf(paraNum) == -1 ? false : true;
            }else{
                if(name == "dhd_HongHu" || name == "dhd_DianHu" || name == "dhd_HeiHu" || name == "dhd_DuiZiHu")
                {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForDHD[i].localKey, true);
                }
                else {
                    local = util.localStorageEncrypt.getBoolItem(this.optionNodeListForDHD[i].localKey, false);
                }
            }
            this.optionNodeListForDHD[i].node.setSelected(local);
            var text = this.optionNodeListForDHD[i].node.getChildByName("text");
            text.setTextColor(local ? selectColor : unSelectColor);
        }

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (atClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_trust, 0);
            }
            this.trustList_radio.selectItem(_trustIndex);
            list = [];
            list.push(_play.getChildByName("trust0"));
            list.push(_play.getChildByName("trust1"));
            list.push(_play.getChildByName("trust2"));
            list.push(_play.getChildByName("trust3"));
            list.push(_play.getChildByName("trust4"));
            this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);
        }

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (atClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }
        if (atClub)
            this._zhuIdx = this.getNumberItem("jieSuanDiFen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jieSuanDiFen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
        this.difenIndex = this.difenAry.indexOf(this._zhuIdx);
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.checkMaxPlayerSelect()})));
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();

    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.tunNum = this.tunNumList_radio.getSelectIndex();
        para.fengDing = [0,100,200,300][parseInt(this.fengDingList_radio.getSelectIndex())];
        para.playType = [1,2,3][parseInt(this.playTypeList_radio.getSelectIndex())];
        para.jieSuanDiFen = this._zhuIdx;
        var maiPaiType, isMaiPai;
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            maiPaiType = this.maiPaiList_radio.getSelectIndex();
            isMaiPai = maiPaiType > 0;
            para.maiPaiType = maiPaiType;
        }else{
            if(this.bg_node.getChildByName("play").getChildByName("play_maxPlayer_1").isSelected()){
                isMaiPai = this.maiPai20.isSelected();
            }else{
                isMaiPai = false;
            }
        }

        if(para.maxPlayer > 2)
            isMaiPai = false;
        para.maiPai20 = isMaiPai;

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        var playList = [];
        var hongHeiDianList = [];
        var duoHongDuiList = [];
        var quanMingTangSelect = this.bg_node.getChildByName("play").getChildByName("quanMingTang").isSelected();
        var hongHeiDianSelect = this.bg_node.getChildByName("play").getChildByName("hongHeiDian").isSelected();
        var duoHongDuiSelect = this.bg_node.getChildByName("play").getChildByName("duoHongDui").isSelected();
        if(quanMingTangSelect)
        {
            for(var i = 0;i < this.optionNodeListForQMT.length; i++)
            {
                var select = this.optionNodeListForQMT[i].node.isSelected();
                var paraNum = this.optionNodeListForQMT[i].paraNum;
                if(select) {
                    playList.push(paraNum);
                }
            }
        }
        else if(hongHeiDianSelect){
            for(var i = 0;i < this.optionNodeListForHHD.length; i++)
            {
                var select = this.optionNodeListForHHD[i].node.isSelected();
                var paraNum = this.optionNodeListForHHD[i].paraNum;
                if(select) {
                    hongHeiDianList.push(paraNum);
                }
            }
        }
        else if(duoHongDuiSelect){
            for(var i = 0;i < this.optionNodeListForDHD.length; i++)
            {
                var select = this.optionNodeListForDHD[i].node.isSelected();
                var paraNum = this.optionNodeListForDHD[i].paraNum;
                if(select) {
                    duoHongDuiList.push(paraNum);
                }
            }
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_trust, trustIndex);
        }

        para.gameType = MjClient.GAME_TYPE.YUAN_LING_PAO_HU_ZI;
        para.playList = playList;
        para.hongHeiDianList = hongHeiDianList;
        para.duoHongDuiList = duoHongDuiList;
        para.isManualCutCard = false;
        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tunNum, para.tunNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_fengDing, this.fengDingList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_playType, this.playTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPai20, para.maiPai20);
            if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_maiPaiType, para.maiPaiType);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jieSuanDiFen, para.jieSuanDiFen);
            for (var i = 0; i < this.optionNodeListForQMT.length; i++) {
                var bool = this.optionNodeListForQMT[i].node.isSelected();
                switch (this.optionNodeListForQMT[i].name) {
                    //=====================全名堂======================
                    case "tianHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tianHu, bool);
                        break;
                    case "diHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_diHu, bool);
                        break;
                    case "haiDiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_haiDiHu, bool);
                        break;
                    case "hongHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hongHu, bool);
                        break;
                    case "heiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_heiHu, bool);
                        break;
                    case "dianHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_dianHu, bool);
                        break;
                    case "daHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daHu, bool);
                        break;
                    case "xiaoHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_xiaoHu, bool);
                        break;
                    case "duiZiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_duiZiHu, bool);
                        break;
                    case "daTuanYuan" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_daTuanYuan, bool);
                        break;
                    case "hangHangXi" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_hangHangXi, bool);
                        break;
                    case "shuaHou" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_shuaHou, bool);
                        break;
                    case "tingHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_tingHu, bool);
                        break;
                    case "huangFanDouble" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_huangFanDouble, bool);
                        break;
                    case "jiaHangHang" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_jiaHangHang, bool);
                        break;
                    case "siQiHong" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_siQiHong, bool);
                        break;
                    case "beiKaoBei" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_beiKaoBei, bool);
                        break;
                }
            }
            for (var i = 0; i < this.optionNodeListForHHD.length; i++) {
                var bool = this.optionNodeListForHHD[i].node.isSelected();
                switch (this.optionNodeListForHHD[i].name) {
                    //=====================红黑点======================
                    case "hhd_HongHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongHu, bool);
                        break;
                    case "hhd_DianHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DianHu, bool);
                        break;
                    case "hhd_HeiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HeiHu, bool);
                        break;
                    case "hhd_HongWu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_HongWu, bool);
                        break;
                    case "hhd_DuiZiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_HHD_DuiZiHu, bool);
                        break;
                }
            }
            for (var i = 0; i < this.optionNodeListForDHD.length; i++) {
                var bool = this.optionNodeListForDHD[i].node.isSelected();
                switch (this.optionNodeListForDHD[i].name) {
                    //=====================多红对======================
                    case "dhd_HongHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HongHu, bool);
                        break;
                    case "dhd_DianHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DianHu, bool);
                        break;
                    case "dhd_HeiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HeiHu, bool);
                        break;
                    case "dhd_DuiZiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DuiZiHu, bool);
                        break;
                    case "dhd_TianHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TianHu, bool);
                        break;
                    case "dhd_DiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_DiHu, bool);
                        break;
                    case "dhd_HaiHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HaiHu, bool);
                        break;
                    case "dhd_TingHu" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_TingHu, bool);
                        break;
                    case "dhd_HuangFan" :
                        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_YuanLing_DHD_HuangFan, bool);
                        break;
                }
            }
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbei , para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore, para.fanBeiScore);
            }
        }
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = MjClient.createRoomNode._selectColor;
            var unSelectColor = MjClient.createRoomNode._unSelectColor;
            var len = list.length;
            for(var i = 0; i < len; i++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());

                if (i == 0) {
                    var txt = radioBox.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    txt.setTextColor(bSelected ? selectColor : unSelectColor);
                } else {
                    var textNames = ["text","score"];
                    for (var j = 0; j < textNames.length; j++) {
                        var txt = radioBox.getChildByName(textNames[j]);
                        txt.ignoreContentAdaptWithSize(true);
                        txt.setTextColor(bSelected ? selectColor : unSelectColor);
                    }

                    var buttonNames = ["btn_add","btn_sub"];
                    for (var j = 0; j < buttonNames.length; j++) {
                        var button = radioBox.getChildByName(buttonNames[j]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node);
    },

    setDiaNumData:function(gameNode)
    { 
        this._super(gameNode);
        this.setDiaNumData_PaoHuZi();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this.setDiaNumData_PaoHuZi();
    },

    getPrice: function(gameType, maxPlayer, roundNum, payWay) {
        //cc.log("MjClient.data.gamePrice@@ " + JSON.stringify(MjClient.data.gamePrice));
        if(!MjClient.data.gamePrice[gameType][maxPlayer][roundNum]){
            return 0;
        }
        return MjClient.data.gamePrice[gameType][maxPlayer][roundNum][payWay];
    },

    setDiaNumData_PaoHuZi : function(){

    }
});