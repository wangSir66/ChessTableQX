var CreateRoomNode_hhHongGuaiWan = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    initAll:function()
    {
        this.localStorageKey.KEY_hhHongGuaiWan_wanfa        = "_hhHongGuaiWan_wanfa";       //  玩法
        this.localStorageKey.KEY_hhHongGuaiWan_renshu       = "_hhHongGuaiWan_renshu";      //  人数
        this.localStorageKey.KEY_hhHongGuaiWan_maipai       = "_hhHongGuaiWan_maipai";      //两人埋牌
        this.localStorageKey.KEY_hhHongGuaiWan_maiPaiType   = "_hhHongGuaiWan_maiPaiType";      //埋牌类型  0:不埋牌    1：埋10张     2：埋20张
        this.localStorageKey.KEY_hhHongGuaiWan_zimohu       = "_hhHongGuaiWan_zimohu";      //自摸15胡可胡
        this.localStorageKey.KEY_hhHongGuaiWan_jiayidun     = "_hhHongGuaiWan_jiayidun";    //自摸加一囤
        this.localStorageKey.KEY_hhHongGuaiWan_huangzhuang  = "_hhHongGuaiWan_huangzhuang"; //黄庄
        this.localStorageKey.KEY_hhHongGuaiWan_datuanyuan   = "_hhHongGuaiWan_datuanyuan";  //大团圆
        this.localStorageKey.KEY_hhHongGuaiWan_shuahou      = "_hhHongGuaiWan_shuahou";     //耍猴
        this.localStorageKey.KEY_hhHongGuaiWan_tianhu       = "_hhHongGuaiWan_tianhu";      //天胡
        this.localStorageKey.KEY_hhHongGuaiWan_dihu         = "_hhHongGuaiWan_dihu";        //地胡
        this.localStorageKey.KEY_hhHongGuaiWan_dianhu       = "_hhHongGuaiWan_dianhu";      //点胡
        this.localStorageKey.KEY_hhHongGuaiWan_honghu       = "_hhHongGuaiWan_honghu";      //红胡
        this.localStorageKey.KEY_hhHongGuaiWan_wuhu         = "_hhHongGuaiWan_wuhu";        //乌胡
        this.localStorageKey.KEY_hhHongGuaiWan_pengpenghu   = "_hhHongGuaiWan_pengpenghu";  //碰碰胡
        this.localStorageKey.KEY_hhHongGuaiWan_shibada      = "_hhHongGuaiWan_shibada";     //十八大
        this.localStorageKey.KEY_hhHongGuaiWan_shiliuxiao   = "_hhHongGuaiWan_shiliuxiao";  //十六小
        this.localStorageKey.KEY_hhHongGuaiWan_haidihu      = "_hhHongGuaiWan_haidihu";     //海底胡
        this.localStorageKey.KEY_hhHongGuaiWan_qiepai       = "_hhHongGuaiWan_qiepai";      // 切牌
        this.localStorageKey.KEY_hhHongGuaiWan_fapai        = "_hhHongGuaiWan_fapai";      // 切牌 
        this.localStorageKey.KEY_hhHongGuaiWan_trust        = "hhHongGuaiWan_trust";                //托管

        this.setExtraKey({
            fanBei: "_hhHongGuaiWan_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_hhHongGuaiWan_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_hhHongGuaiWan_JIE_SUAN_DI_FEN",  //积分底分
        });
        this.roundNumObj = {roundNum1:6, roundNum2:10, roundNum3:20};

        this.bg_node = ccs.load("bg_hhHongGuaiWan.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hhHongGuaiWan").getChildByName("view");
        this.jiayidun = this.bg_node.getChildByName("play").getChildByName("yitun");
    },

    radioBoxSelectCB_hongguaiwan : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    checkSelect : function(){
        var _wanfa = this.wanfaList_radio.getSelectIndex();

        var txt = this.tianhu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("天胡*4");
        }
        else{
            txt.setString("天胡*8");
        }

        var txt = this.dihu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("地胡*3");
        }
        else{
            txt.setString("地胡*6");
        }

        var txt = this.dianhu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("点胡*3");
        }
        else{
            txt.setString("点胡*6");
        }
        
        var txt = this.honghu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("红胡*2+n");
        }
        else{
            txt.setString("红胡*4+n");
        }
        
        var txt = this.wuhu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("乌胡*5");
        }
        else{
            txt.setString("乌胡*8");
        }

        var txt = this.pengpenghu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("碰碰胡*4");
        }
        else{
            txt.setString("碰碰胡*8");
        }

        var txt = this.shibada.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("十八大*4+n");
        }
        else{
            txt.setString("十八大*8+n");
        }

        var txt = this.shiliuxiao.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("十六小*4+n");
        }
        else{
            txt.setString("十六小*8+n");
        }

        var txt = this.haidihu.getChildByName("text");
        if(_wanfa == 0){
            txt.setString("海底胡*2");
        }
        else{
            txt.setString("海底胡*6");
        }     
    },

    checkMaxPlayerRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkMaxPlayerSelect();
    },

    checkMaxPlayerSelect: function(){
        var _maxPlayerIndex = this.renshuList_radio.getSelectIndex();
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
            if(_maxPlayerIndex == 1){
                this.maipaiCheckBox.visible = true;
            }else{
                this.maipaiCheckBox.visible = false;
            }
        }
        
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        var _mingTang = _play.getChildByName("mingTang");

        var wanfaList = [];
        wanfaList.push(_play.getChildByName("mingTang_1"));
        wanfaList.push(_play.getChildByName("mingTang_2"));
        this.wanfaList_radio = createRadioBoxForCheckBoxs(wanfaList,this.radioBoxSelectCB_hongguaiwan.bind(this));
        cc.eventManager.addListener(this.setTextClick(wanfaList,0,this.wanfaList_radio,this.checkSelect.bind(this)),wanfaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,1,this.wanfaList_radio,this.checkSelect.bind(this)),wanfaList[1].getChildByName("text"));

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
             this.maipaiCheckBox = _play.getChildByName("maipai");
            this.maipaiCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(),this.maipaiCheckBox.getChildByName("text"));
            this.maipaiCheckBox.addEventListener(this._clickCB, this.maipaiCheckBox);
        }
       
        var renshuList = [];
        renshuList.push(_play.getChildByName("threepeople"));
        renshuList.push(_play.getChildByName("twopeople"));
		this.initPlayNumNode(renshuList, [3, 2]);
        this.renshuList_radio = createRadioBoxForCheckBoxs(renshuList,this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(renshuList,0,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,1,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[1].getChildByName("text"));
        
        this.jiayidun = _play.getChildByName("yitun");
        this.jiayidun.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.jiayidun.getChildByName("text"));
        this.jiayidun.addEventListener(this._clickCB, this.jiayidun);

        this.zimo_15 = _play.getChildByName("zimo_15");
        this.zimo_15.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.zimo_15.getChildByName("text"));
        this.zimo_15.addEventListener(this._clickCB, this.zimo_15);

        this.huangzhuang = _play.getChildByName("huangzhuang");
        this.huangzhuang.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.huangzhuang.getChildByName("text"));
        this.huangzhuang.addEventListener(this._clickCB, this.huangzhuang);

        this.datuanyuan = _play.getChildByName("datuanyuan");
        this.datuanyuan.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.datuanyuan.getChildByName("text"));
        this.datuanyuan.addEventListener(this._clickCB, this.datuanyuan);

        this.shuahou = _play.getChildByName("shuahou");
        this.shuahou.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.shuahou.getChildByName("text"));
        this.shuahou.addEventListener(this._clickCB, this.shuahou);

        //名堂
        this.tianhu = _mingTang.getChildByName("tianHu");
        this.tianhu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.tianhu.getChildByName("text"));
        this.tianhu.addEventListener(this._clickCB, this.tianhu);

        this.dihu = _mingTang.getChildByName("diHu");
        this.dihu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.dihu.getChildByName("text"));
        this.dihu.addEventListener(this._clickCB, this.dihu);

        this.dianhu = _mingTang.getChildByName("dianHu");
        this.dianhu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.dianhu.getChildByName("text"));
        this.dianhu.addEventListener(this._clickCB, this.dianhu);

        this.honghu = _mingTang.getChildByName("hongHu");
        this.honghu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.honghu.getChildByName("text"));
        this.honghu.addEventListener(this._clickCB, this.honghu);

        this.wuhu = _mingTang.getChildByName("wuHu");
        this.wuhu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.wuhu.getChildByName("text"));
        this.wuhu.addEventListener(this._clickCB, this.wuhu);

        this.pengpenghu = _mingTang.getChildByName("pengPengHu");
        this.pengpenghu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.pengpenghu.getChildByName("text"));
        this.pengpenghu.addEventListener(this._clickCB, this.pengpenghu);

        this.shibada = _mingTang.getChildByName("shiBaDa");
        this.shibada.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.shibada.getChildByName("text"));
        this.shibada.addEventListener(this._clickCB, this.shibada);

        this.shiliuxiao = _mingTang.getChildByName("shiLiuXiao");
        this.shiliuxiao.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.shiliuxiao.getChildByName("text"));
        this.shiliuxiao.addEventListener(this._clickCB, this.shiliuxiao);

        this.haidihu = _mingTang.getChildByName("haiDiHu");
        this.haidihu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.haidihu.getChildByName("text"));
        this.haidihu.addEventListener(this._clickCB, this.haidihu);

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

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

        // 发牌
        if(_play.getChildByName("faPai0")){
            var faPaiList = [];
            faPaiList.push(_play.getChildByName("faPai0")); 
            faPaiList.push(_play.getChildByName("faPai1"));
            faPaiList.push(_play.getChildByName("faPai2"));
            this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
            cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));
        }
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);

        this.schedule(function(sender,type)
        {
            this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        },0.1);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var _play = this.bg_node.getChildByName("play");
        var list = [];

        var _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_wanfa, 0);
        /*if(atClub){
            _wanfa = this.getNumberItem("redguaiwanOne",0);
        }
        else{
            _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_wanfa, 0);
        }*/
        this.wanfaList_radio.selectItem(_wanfa);
        list.push(_play.getChildByName("mingTang_1"));
        list.push(_play.getChildByName("mingTang_2"));
        this.radioBoxSelectCB(_wanfa,list[_wanfa],list);

        var _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_renshu,0);
        /*if(atClub){
            var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
            _renshu = [3,2].indexOf(temp_maxPlayer);
        }
        else{
            _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_renshu,0);
        }*/
        this.renshuList_radio.selectItem(_renshu);
        list = [];
        list.push(_play.getChildByName("threepeople"));
        list.push(_play.getChildByName("twopeople"));
        this.radioBoxSelectCB(_renshu,list[_renshu],list);

        var _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_maipai, false);
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
             var maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_maiPaiType, 0);
            if(!_maipaiCheckBox) maiPaiType = 0;
            if(_maipaiCheckBox && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            this.maipaiCheckBox.setSelected(_maipaiCheckBox);
            var txt = this.maipaiCheckBox.getChildByName("text");
            if(_maipaiCheckBox){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }

        var _jiayidun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_jiayidun, true);
        this.jiayidun.setSelected(_jiayidun);
        var txt = this.jiayidun.getChildByName("text");
        if(_jiayidun){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _zimohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_zimohu, true);
        this.zimo_15.setSelected(_zimohu);
        var txt = this.zimo_15.getChildByName("text");
        if(_zimohu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _huangzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_huangzhuang, false);
        this.huangzhuang.setSelected(_huangzhuang);
        var txt = this.huangzhuang.getChildByName("text");
        if(_huangzhuang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _datuanyuan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_datuanyuan, false);
        this.datuanyuan.setSelected(_datuanyuan);
        var txt = this.datuanyuan.getChildByName("text");
        if(_datuanyuan){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _shuahou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shuahou, false);
        this.shuahou.setSelected(_shuahou);
        var txt = this.shuahou.getChildByName("text");
        if(_shuahou){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        //名堂
        var _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_tianhu, true);
        this.tianhu.setSelected(_tianhu);
        var txt = this.tianhu.getChildByName("text");
        if(_tianhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_dihu, true);
        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_dianhu, true);
        this.dianhu.setSelected(_dianhu);
        var txt = this.dianhu.getChildByName("text");
        if(_dianhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _honghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_honghu, true);
        this.honghu.setSelected(_honghu);
        var txt = this.honghu.getChildByName("text");
        if(_honghu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _wuhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_wuhu, true);
        this.wuhu.setSelected(_wuhu);
        var txt = this.wuhu.getChildByName("text");
        if(_wuhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _pengpenghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_pengpenghu, true);
        this.pengpenghu.setSelected(_pengpenghu);
        var txt = this.pengpenghu.getChildByName("text");
        if(_pengpenghu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _shibada = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shibada, true);
        this.shibada.setSelected(_shibada);
        var txt = this.shibada.getChildByName("text");
        if(_shibada){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _shiliuxiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shiliuxiao, true);
        this.shiliuxiao.setSelected(_shiliuxiao);
        var txt = this.shiliuxiao.getChildByName("text");
        if(_shiliuxiao){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _haidihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_haidihu, true);
        this.haidihu.setSelected(_haidihu);
        var txt = this.haidihu.getChildByName("text");
        if(_haidihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var cutCard;
        if (atClub){
            cutCard = this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (atClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_trust, 0);
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

        if(this.faPaiList_radio){
            var _faPai;
            if (atClub){
                _faPai = this.getNumberItem("faPai", 0);
            }else{
                _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_fapai, 0);
            }

            this.faPaiList_radio.selectItem(_faPai);
            list = [];
            list.push(_play.getChildByName("faPai0")); 
            list.push(_play.getChildByName("faPai1"));
            list.push(_play.getChildByName("faPai2"));
            this.radioBoxSelectCB(_faPai,list[_faPai],list);
        } 

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.checkSelect();
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.checkMaxPlayerSelect()})));
    },

    getSelectedPara:function()
    {
        var para = {};
        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();   
        var redguaiwanOneIndex = this.wanfaList_radio.getSelectIndex(); 
        var _jiayidun = this.jiayidun.isSelected();
        var _huangzhuang = this.huangzhuang.isSelected();
        var _datuanyuan = this.datuanyuan.isSelected();
        var _shuahou = this.shuahou.isSelected();
        var isMaiPai, maiPaiType;
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            maiPaiType = this.maiPaiList_radio.getSelectIndex();
            isMaiPai = maiPaiType > 0;
        }else{
            isMaiPai = this.maipaiCheckBox.isSelected();
        }
       
        var isShiWuZiMo = this.zimo_15.isSelected();
        var _tianhu = this.tianhu.isSelected();
        var _dihu = this.dihu.isSelected();
        var _dianhu = this.dianhu.isSelected();
        var _honghu = this.honghu.isSelected();
        var _wuhu = this.wuhu.isSelected();
        var _pengpenghu = this.pengpenghu.isSelected();
        var _shibada = this.shibada.isSelected();
        var _shiliuxiao = this.shiliuxiao.isSelected();
        var _haidihu = this.haidihu.isSelected();
        var _redguaiwanwanfa = 0;

        if(_tianhu){
            _redguaiwanwanfa |= 1;
        }
        if(_dihu){
            _redguaiwanwanfa |= 2;
        }
        if(_dianhu){
            _redguaiwanwanfa |= 4;
        }
        if(_honghu){
            _redguaiwanwanfa |= 8;
        }
        if(_wuhu){
            _redguaiwanwanfa |= 16;
        }
        if(_pengpenghu){
            _redguaiwanwanfa |= 32;
        }
        if(_shibada){
            _redguaiwanwanfa |= 64;
        }
        if(_shiliuxiao){
            _redguaiwanwanfa |= 128;
        }
        if(_haidihu){
            _redguaiwanwanfa |= 256;
        }

        para.gameType = MjClient.GAME_TYPE.HUAI_HUA_HONG_GUAI_WAN;
        para.maxPlayer = [3,2][maxPlayerIndex];
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            para.maiPaiType = maiPaiType;
        }
        if(maxPlayerIndex == 0){
           isMaiPai = false;
        }
        para.maipai = isMaiPai;
        para.iszimo = _jiayidun;
        para.huangzhuang = _huangzhuang;
        para.datuanyuan = _datuanyuan;
        para.shuahou = _shuahou;
        para.shiwuzimo = isShiWuZiMo;
        para.redguaiwanOne = [1,2][redguaiwanOneIndex];
        para.redguaiwanwanfa = _redguaiwanwanfa;
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        
        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_trust, trustIndex);
        }
        
        if(this.faPaiList_radio){
            para.faPai = this.faPaiList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_fapai, para.faPai);
        }


        this.getExtraSelectedPara(para);

        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_wanfa, redguaiwanOneIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_renshu, maxPlayerIndex);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_jiayidun, _jiayidun);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_huangzhuang, _huangzhuang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_datuanyuan, _datuanyuan);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shuahou, _shuahou);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_maipai, isMaiPai);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_maiPaiType, maiPaiType);//埋牌类型
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_zimohu, isShiWuZiMo);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_tianhu, _tianhu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_dihu, _dihu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_dianhu, _dianhu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_honghu, _honghu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_wuhu, _wuhu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_pengpenghu, _pengpenghu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shibada, _shibada);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_shiliuxiao, _shiliuxiao);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hhHongGuaiWan_haidihu, _haidihu);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hhHongGuaiWan_qiepai, para.isManualCutCard ? 1 : 0);

        return para;
    }
});