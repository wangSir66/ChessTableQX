//安化跑胡子


var CreateRoomNode_ahPaoHuZi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        this._costName = '黄金';
        
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maxPlayer       = "_AnHuaPaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPai     = "_AnHuaPaoHuZi_maiPai";         //  true/false 埋牌
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum     = "_AnHuaPaoHuZi_maiPaiNum";  //埋牌张数
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_huXiType      = "_AnHuaPaoHuZi_huXiType";         //胡息
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei     = "_AnHuaPaoHuZi_ziMoFanBei";         //自摸翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoJiaYiTun     ="_AnHuaPaoHuZi_ziMoJiaYiTun";    //自摸加一囤
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_tiKan      = "_AnHuaPaoHuZi_tiKan";         //（三提、五坎）
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_paPo      = "_AnHuaPaoHuZi_paPo";         //爬坡
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_mingWei      = "_AnHuaPaoHuZi_mingWei";         //明偎
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang     ="_AnHuaPaoHuZi_zuoZhuang";    //0 随机， 1 房主
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_faPai         = "_AnHuaPaoHuZi_faPai";   //发牌速度
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu         = "_AnHuaPaoHuZi_qiHu";   //起胡
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime         = "_AnHuaPaoHuZi_trustTime";   //托管
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay      = "_AnHuaPaoHuZi_trustWay";  //托管方式

        this.setExtraKey({
            fanBei: "_AnHuaPaoHuZi_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_AnHuaPaoHuZi_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_AnHuaPaoHuZi_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:20};

        this.bg_node = ccs.load("bg_ahPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
        
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        this.pnlTrustWay = _play.getChildByName("pnl_trustWay");
        this.pnlRemain = _play.getChildByName("pnl_remain");
        this.pnlRemainYpos = this.pnlRemain.y;

        //胡息
        var huXiTypeList = [];
        huXiTypeList.push(_play.getChildByName("huXiType0")); 
        huXiTypeList.push(_play.getChildByName("huXiType1"));
        this.huXiTypeList_radio = createRadioBoxForCheckBoxs(huXiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huXiTypeList,0,this.huXiTypeList_radio),huXiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huXiTypeList,1,this.huXiTypeList_radio),huXiTypeList[1].getChildByName("text"));
        //人数
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.initPlayNumNode(maxPlayerList, [3, 2]);

        var maxPlayerSelectCb = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, maxPlayerList);
            this.updateMaiPai();
            this.updateSelectDiaNum();
        }.bind(this);

        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[1].getChildByName("text"));

        //埋牌
        this.maiPai = _play.getChildByName("maiPai");
        this.maiPai.visible = false;
        this.maiPai.addEventListener(this._clickCB, this.maiPai);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maiPai.getChildByName("text"));

        //自摸翻倍
        this.ziMoFanBei = _play.getChildByName("ziMoFanBei");
        this.ziMoFanBei.addEventListener(this._clickCB, this.ziMoFanBei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.ziMoFanBei.getChildByName("text"));

        //自摸加一囤
        this.ziMoJiaYiTun = _play.getChildByName("ziMoJiaYiTun");
        this.ziMoJiaYiTun.addEventListener(this._clickCB, this.ziMoJiaYiTun);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.ziMoJiaYiTun.getChildByName("text"));

        //三提五坎
        this.tiKan = _play.getChildByName("tiKan");
        this.tiKan.addEventListener(this._clickCB, this.tiKan);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.tiKan.getChildByName("text"));

        //爬坡
        this.paPo = _play.getChildByName("paPo");
        this.paPo.addEventListener(this._clickCB, this.paPo);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.paPo.getChildByName("text"));

        //明偎
        this.mingWei = _play.getChildByName("mingWei");
        this.mingWei.addEventListener(this._clickCB, this.mingWei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.mingWei.getChildByName("text"));

        //坐庄
        var zuoZhuangList = [this.pnlRemain.getChildByName("zuoZhuang_1"), this.pnlRemain.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,0,this.zuoZhuang_radio),zuoZhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,1,this.zuoZhuang_radio),zuoZhuangList[1].getChildByName("text"));

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        var qiHuList = [];
        qiHuList.push(_play.getChildByName("qiHu0"));
        qiHuList.push(_play.getChildByName("qiHu1"));
        qiHuList.push(_play.getChildByName("qiHu2"));
        this.qiHuList_radio = createRadioBoxForCheckBoxs(qiHuList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(qiHuList,0,this.qiHuList_radio),qiHuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qiHuList,1,this.qiHuList_radio),qiHuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qiHuList,2,this.qiHuList_radio),qiHuList[2].getChildByName("text"));
        this.qiHuList = qiHuList;

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        var tuoGuanCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            if(index == 0){
                this.pnlTrustWay.visible = false;
            }else{
                this.pnlTrustWay.visible = true;
            }
            this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);
        }.bind(this);
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, tuoGuanCallBack);

        var tuoGuanTextCallBack = function(index, sender){
            if(index == 0){
                this.pnlTrustWay.visible = false;
            }else{
                this.pnlTrustWay.visible = true;
            }
            this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);              
        }.bind(this);
        this.addListenerText(tuoGuanList, this.tuoGuanList_radio, tuoGuanTextCallBack);
        this.tuoGuanList = tuoGuanList;

        // 托管方式
        var trustWay = [];
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_1"));
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_2"));
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_3"));
        this.trustWay_radio = createRadioBoxForCheckBoxs(trustWay,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(trustWay,0,this.trustWay_radio),trustWay[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,1,this.trustWay_radio),trustWay[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,2,this.trustWay_radio),trustWay[2].getChildByName("text"));
        this.trustWay_node = trustWay;

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

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(this.pnlRemain);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;



        var _huXiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_huXiType, 0);
        if (atClub){
            _huXiType = {3:0, 1:1}[this.getNumberItem("huXiType", 3)];
        }
        if(_huXiType > 2 || _huXiType < 0){
            _huXiType = 0;
        }
        this.huXiTypeList_radio.selectItem(_huXiType);
        list = [];
        list.push(_play.getChildByName("huXiType0")); 
        list.push(_play.getChildByName("huXiType1"));
        this.radioBoxSelectCB(_huXiType,list[_huXiType],list);

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {3:0, 2:1}[this.getNumberItem("maxPlayer", 3)];
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list = [];
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list);

        var _isMaiPai;
        var maiPaiNum
        if (atClub){
            _isMaiPai = this.getBoolItem("isMaiPai", false);
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            _isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPai, false);
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum, 20);
        }
        // this.maiPai.setSelected(_isMaiPai);
        maiPaiNum = _isMaiPai ? maiPaiNum : 0;
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);


        // var txt = this.maiPai.getChildByName("text");
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;

        //翻倍
        var _ziMoFanBei;
        if (atClub){
            _ziMoFanBei = this.getBoolItem("isZiMoFanBei", true);
        }else{
            _ziMoFanBei =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei, true);
        }
        this.ziMoFanBei.setSelected(_ziMoFanBei);
        var txt = this.ziMoFanBei.getChildByName("text");
        txt.setTextColor(_ziMoFanBei ? selectColor : unSelectColor);

        //加一囤
        var _ziMoJiaYiTun;
        if (atClub){
            _ziMoJiaYiTun = this.getBoolItem("isZiMoJiaYiTun", false);
        }else{
            _ziMoJiaYiTun =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoJiaYiTun, false);
        }
        this.ziMoJiaYiTun.setSelected(_ziMoJiaYiTun);
        var txt = this.ziMoJiaYiTun.getChildByName("text");
        txt.setTextColor(_ziMoJiaYiTun ? selectColor : unSelectColor);

        // 三提、五坎
        var _tiKan;
        if (atClub){
            _tiKan = this.getBoolItem("isTikan", true);
        }else{
            _tiKan =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_tiKan, true);
        }
        this.tiKan.setSelected(_tiKan);
        var txt = this.tiKan.getChildByName("text");
        txt.setTextColor(_tiKan ? selectColor : unSelectColor);

        //爬坡
        var _paPo;
        if (atClub){
            _paPo = this.getBoolItem("isPapo", false);
        }else{
            _paPo =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_paPo, false);
        }
        this.paPo.setSelected(_paPo);
        var txt = this.paPo.getChildByName("text");
        txt.setTextColor(_paPo ? selectColor : unSelectColor);

        //明偎
        var _mingWei;
        if (atClub){
            _mingWei = this.getBoolItem("isMingWei", false);
        }else{
            _mingWei =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_mingWei, false);
        }
        this.mingWei.setSelected(_mingWei);
        var txt = this.mingWei.getChildByName("text");
        txt.setTextColor(_mingWei ? selectColor : unSelectColor);

        var _zuoZhuang;
        if (atClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 1);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang, 1);
        }
        list = [this.pnlRemain.getChildByName("zuoZhuang_1"), this.pnlRemain.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio.selectItem(_zuoZhuang);
        this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 0);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_faPai, 0);
        }

        this.faPaiList_radio.selectItem(_faPai);
        list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        var qihu;
        if (atClub){
            qihu = this.getNumberItem("qiHu", 0);
        }else{
            qihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu, 0);
        }
        this.qiHuList_radio.selectItem(qihu);
        this.radioBoxSelectCB(qihu,this.qiHuList[qihu],this.qiHuList);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        //托管方式
        var _trustWay;
        if (atClub) {
            _trustWay = this.getNumberItem("trustWay", 0);
        } else {
            _trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay, 0);
        }
        this.trustWay_radio.selectItem(_trustWay);
        this.radioBoxSelectCB(_trustWay, this.trustWay_node[_trustWay], this.trustWay_node);

        this.pnlTrustWay.visible = tuoGuan != 0;
        this.pnlRemain.y = this.pnlRemainYpos + (tuoGuan == 0 ? this.pnlTrustWay.height : 0);  

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.updateMaiPai();
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        //para.isMaiPai = this.maiPai.isSelected() && para.maxPlayer == 2;// 两人才有埋牌选项
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0 ? true : false;
        para.huXiType = [3, 1][parseInt(this.huXiTypeList_radio.getSelectIndex())];
        para.isTikan = this.tiKan.isSelected();
        para.isPapo = this.paPo.isSelected();
        para.isZiMoFanBei = this.ziMoFanBei.isSelected();
        para.isZiMoJiaYiTun = this.ziMoJiaYiTun.isSelected();
        para.isMingWei = this.mingWei.isSelected();
        para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 房主
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.qiHu = this.qiHuList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.trustWay = para.trustTime == -1 ? 0 : this.trustWay_radio.getSelectIndex();
        para.isTrustWhole = para.trustWay != 0;

        this.getExtraSelectedPara(para);

        para.gameType = MjClient.GAME_TYPE.AN_HUA_PAO_HU_ZI;
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard){
            var hxIndex = parseInt(this.huXiTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_huXiType, hxIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_paPo, para.isPapo);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_tiKan, para.isTikan);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei, para.isZiMoFanBei);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoJiaYiTun, para.isZiMoJiaYiTun);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_mingWei, para.isMingWei);
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang, para.zuoZhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu, para.qiHu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay, para.trustWay);
        }
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_PaoHuZi();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_PaoHuZi();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_PaoHuZi();
    },

    updateMaiPai:function(){
        var playNum = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        if (playNum == 2){
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }
            //this.maiPai.visible = true;
        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(unEnableColor);
            }
            //this.maiPai.visible = false;
        }
    },

    setDiaNumData_PaoHuZi : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var text600 = round.getChildByName("payWay_1").getChildByName("text");
        var text1000 = round.getChildByName("payWay_2").getChildByName("text");
        text600.ignoreContentAdaptWithSize(true);
        text1000.ignoreContentAdaptWithSize(true);
        text600.setString("房主出(" + this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), 0) + this._costName + ")");
        text1000.setString("AA(" + this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), 1) + this._costName + ")");
    }
});