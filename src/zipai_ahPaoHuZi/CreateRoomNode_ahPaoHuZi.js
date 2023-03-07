//安化跑胡子


var CreateRoomNode_ahPaoHuZi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';
        
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maxPlayer       = "_AnHuaPaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPai     = "_AnHuaPaoHuZi_maiPai";         //  true/false 埋牌
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum     = "_AnHuaPaoHuZi_maiPaiNum";         //  埋牌数量
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_huXiType      = "_AnHuaPaoHuZi_huXiType";         //胡息
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei     = "_AnHuaPaoHuZi_ziMoFanBei";         //自摸翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoJiaYiTun     ="_AnHuaPaoHuZi_ziMoJiaYiTun";    //自摸加一囤
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_tiKan      = "_AnHuaPaoHuZi_tiKan";         //（三提、五坎）
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_paPo      = "_AnHuaPaoHuZi_paPo";         //爬坡
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_mingWei      = "_AnHuaPaoHuZi_mingWei";         //明偎
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiWuXiErFen      = "_AnHuaPaoHuZi_shiWuXiErFen";         //15息2分

        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiePai     = "_AnHuaPaoHuZi_qiePai";       //切牌
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang     ="_AnHuaPaoHuZi_zuoZhuang";    //0 随机， 1 房主

        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime     ="_AnHuaPaoHuZi_trustTime";    //托管 0 无/1/2/3分钟
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay     ="_AnHuaPaoHuZi_trustWay";    //托管方式
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu     ="_AnHuaPaoHuZi_qiHu";    //起胡
        this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiBaDa     ="_AnHuaPaoHuZi_shiBaDa";    //十八大

        this.setExtraKey({
            fanBei: "_AnHuaPaoHuZi_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_AnHuaPaoHuZi_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_AnHuaPaoHuZi_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:20};
        this.bg_node = ccs.load("bg_ahPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

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
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maiPai.getChildByName("text"));

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        //自摸翻倍
        this.ziMoFanBei = _play.getChildByName("ziMoFanBei");
        this.ziMoFanBei.addEventListener(this._clickCB.bind(this), this.ziMoFanBei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.ziMoFanBei.getChildByName("text"));

        //自摸加一囤
        this.ziMoJiaYiTun = _play.getChildByName("ziMoJiaYiTun");
        this.ziMoJiaYiTun.addEventListener(this._clickCB.bind(this), this.ziMoJiaYiTun);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.ziMoJiaYiTun.getChildByName("text"));

        //三提五坎
        this.tiKan = _play.getChildByName("tiKan");
        this.tiKan.addEventListener(this._clickCB.bind(this), this.tiKan);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.tiKan.getChildByName("text"));

        //爬坡
        this.paPo = _play.getChildByName("paPo");
        this.paPo.addEventListener(this._clickCB.bind(this), this.paPo);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.paPo.getChildByName("text"));

        //明偎
        this.mingWei = _play.getChildByName("mingWei");
        this.mingWei.addEventListener(this._clickCB.bind(this), this.mingWei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.mingWei.getChildByName("text"));

        //15息2分
        this.shiWuXiErFen = _play.getChildByName("shiWuXiErFen");
        this.shiWuXiErFen.addEventListener(this._clickCB.bind(this), this.shiWuXiErFen);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.shiWuXiErFen.getChildByName("text"));

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("autoCut"));
        qiePaiList.push(_play.getChildByName("manualCut"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        //坐庄
        var zuoZhuangList = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,0,this.zuoZhuang_radio),zuoZhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,1,this.zuoZhuang_radio),zuoZhuangList[1].getChildByName("text"));

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, (index, sender, list)=>{
            this.radioBoxSelectCB(index, sender, list);
            this.updateTrust();
        });
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });

        var fangShiList = [];
        fangShiList.push(_play.getChildByName("fangShi1"));
        fangShiList.push(_play.getChildByName("fangShi2"));
        fangShiList.push(_play.getChildByName("fangShi3"));
        this.fangShiList_radio = createRadioBoxForCheckBoxs(fangShiList, this.radioBoxSelectCB);
        this.addListenerText(fangShiList,this.fangShiList_radio);
        this.fangShiList = fangShiList;

        var qiHuList = [];
        qiHuList.push(_play.getChildByName("qiHu0"));
        qiHuList.push(_play.getChildByName("qiHu1"));
        qiHuList.push(_play.getChildByName("qiHu2"));
        this.qiHuList_radio = createRadioBoxForCheckBoxs(qiHuList, this.radioBoxSelectCB);
        this.addListenerText(qiHuList,this.qiHuList_radio);
        this.qiHuList = qiHuList;

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

        this.shiBaDa = _play.getChildByName("shiBaDa");
        this.shiBaDa.addEventListener(this._clickCB.bind(this), this.shiBaDa);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.shiBaDa.getChildByName("text"));

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;

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
        var maiPaiNum;
        if (atClub){
            _isMaiPai = this.getBoolItem("isMaiPai", false);
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            _isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPai, false);
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum, 20);
        }
        maiPaiNum = _isMaiPai ? maiPaiNum : 0;
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);
 
        // this.maiPai.setSelected(_isMaiPai);
        // var txt = this.maiPai.getChildByName("text");
        // txt.setTextColor(_isMaiPai ? selectColor : unSelectColor);

        //翻倍
        var _ziMoFanBei;
        if (atClub){
            _ziMoFanBei = this.getBoolItem("isZiMoFanBei", true);
        }else{
            _ziMoFanBei =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei, true);
        }
        this.ziMoFanBei.setSelected(_ziMoFanBei);
        var txt = this.ziMoFanBei.getChildByName("text");
        cc.log("ssssssssssssss:"+selectColor)
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

        //15息2分
        var _shiWuXiErFen;
        if (atClub){
            _shiWuXiErFen = this.getBoolItem("isShiWuXiErFen", false);
        }else{
            _shiWuXiErFen =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiWuXiErFen, false);
        }
        this.shiWuXiErFen.setSelected(_shiWuXiErFen);
        var txt = this.shiWuXiErFen.getChildByName("text");
        txt.setTextColor(_shiWuXiErFen ? selectColor : unSelectColor);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        var _zuoZhuang;
        if (atClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 1);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang, 1);
        }
        list = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio.selectItem(_zuoZhuang);
        this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        var fangShi;
        if (atClub)
            fangShi = this.getNumberItem("trustWay", 0);
        else
            fangShi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay, 0);
        this.fangShiList_radio.selectItem(fangShi);
        this.radioBoxSelectCB(fangShi,this.fangShiList[fangShi],this.fangShiList);

        var qiHu;
        if (atClub)
            qiHu = this.getNumberItem("qiHu", 0);
        else
            qiHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu, 0);
        this.qiHuList_radio.selectItem(qiHu);
        this.radioBoxSelectCB(qiHu,this.qiHuList[qiHu],this.qiHuList);

        var shiBaDa;
        if (atClub){
            shiBaDa = this.getBoolItem("shiBaDa", false);
        }else{
            shiBaDa =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiBaDa, false);
        }
        this.shiBaDa.setSelected(shiBaDa);
        var text = this.shiBaDa.getChildByName("text");
        this.selectedCB(text,shiBaDa);

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.updateMaiPai();
        this.updateTrust();
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        para.huXiType = [3, 1][parseInt(this.huXiTypeList_radio.getSelectIndex())];
        // para.isMaiPai = this.maiPai.isSelected() && para.maxPlayer == 2;// 两人才有埋牌选项
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0 ? true : false;
        para.isTikan = this.tiKan.isSelected();
        para.isPapo = this.paPo.isSelected();
        para.isZiMoFanBei = this.ziMoFanBei.isSelected();
        para.isZiMoJiaYiTun = this.ziMoJiaYiTun.isSelected();
        para.isMingWei = this.mingWei.isSelected();
        para.isShiWuXiErFen = this.shiWuXiErFen.isSelected();
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 房主
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.trustWay = this.fangShiList_radio.getSelectIndex();
        para.isTrustWhole = !(para.trustWay == 0);
        para.qiHu = this.qiHuList_radio.getSelectIndex();
        para.shiBaDa = this.shiBaDa.isSelected();

        this.getExtraSelectedPara(para);
        para.gameType = MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI;
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
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_paPo, para.isPapo);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_tiKan, para.isTikan);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoFanBei, para.isZiMoFanBei);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_ziMoJiaYiTun, para.isZiMoJiaYiTun);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_mingWei, para.isMingWei);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiWuXiErFen, para.isShiWuXiErFen);
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_AnHua_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_zuoZhuang, para.zuoZhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustTime, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_trustWay, para.trustWay);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_qiHu, para.qiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_AnHua_shiBaDa, para.shiBaDa);
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
        this.setDiaNumData_PaoHuZi();
    },

    updateMaiPai:function(){
        var playNum = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        // if (playNum == 2){
        //     this.maiPai.visible = true;
        // }else{
        //     this.maiPai.visible = false;
        // }
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191,191,191);
        if (playNum == 2){
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
    updateTrust:function () {
        var visible = !(this.tuoGuanList_radio.getSelectIndex() == 0);
        for(var i = 0; i < this.fangShiList.length; i++){
            this.fangShiList[i].visible = visible;
        }
    },

    setDiaNumData_PaoHuZi : function(){
        // var para = this.getSelectedPara();
        // var gameType = para.gameType;
        // var maxPlayer = para.maxPlayer;
        // var payWay = this.getSelectedPayWay();
        //
        // var round = this.bg_node.getChildByName("round");
        // var text600 = round.getChildByName("payWay_1").getChildByName("text_0");
        // var text1000 = round.getChildByName("payWay_2").getChildByName("text_0");
        // text600.ignoreContentAdaptWithSize(true);
        // text1000.ignoreContentAdaptWithSize(true);
        // text600.setString("(" + this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), 0) + this._costName + ")");
        // text1000.setString("(" + this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), 1) + this._costName + ")");
    }
});