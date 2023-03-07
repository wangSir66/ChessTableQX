/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_syZiPai = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        this._costName = '黄金';
        if (!this._isFriendCard){
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_maxPlayer    = "_ShaoYangZiPai_maxPlayer";          //几人玩
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_huXiType     = "_ShaoYangZiPai_huXiType";         //胡息
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_jiaChui      = "_ShaoYangZiPai_jiaChui";         //加锤
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_qiepaii      = "_ShaoYangZiPai_qiepai";         //切牌
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_hongHeiHu    = "_ShaoYangZiPai_hongHeiHu";         //红黑胡
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_ziMo         = "_ShaoYangZiPai_ziMo";              //自摸
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_faPai        = "_ShaoYangZiPai_faPai";   //发牌速度
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_trustTime    = "_ShaoYangZiPai_trustTime";   //托管
            this.localStorageKey.KEY_ZI_PAI_ShaoYang_maiPaiNum    = "_ShaoYangZiPai_maiPaiNum";   //埋牌数量
        }
        this.setExtraKey({
            fanBei: "_ShaoYangZiPai_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_ShaoYangZiPai_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_ShaoYangZiPai_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};

        this.bg_node = ccs.load("bg_syZiPai.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        this.initPlayNumNode(maxPlayerList, [2, 3, 3]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkPayWay.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkPayWay.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkPayWay.bind(this)),maxPlayerList[2].getChildByName("text"));
        this.playerList_node = maxPlayerList;

        //埋牌
        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maiPai0")); 
        maiPaiList.push(_play.getChildByName("maiPai1"));
        maiPaiList.push(_play.getChildByName("maiPai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        var huXiTypeList = [];
        huXiTypeList.push(_play.getChildByName("huXiType0")); 
        huXiTypeList.push(_play.getChildByName("huXiType1"));
        this.huXiTypeList_radio = createRadioBoxForCheckBoxs(huXiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huXiTypeList,0,this.huXiTypeList_radio),huXiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huXiTypeList,1,this.huXiTypeList_radio),huXiTypeList[1].getChildByName("text"));

        // this.localStorageKey.KEY_ZI_PAI_ShaoYang_jiaChui
        // this.jiaChui = _play.getChildByName("jiaChui");
        // cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.jiaChui.getChildByName("text"));
        // this.jiaChui.addEventListener(this._clickCB.bind(this), this.jiaChui);
        this.jiaChui = _play.getChildByName("jiaChui");
        this.addListenerText(this.jiaChui);
        this.jiaChui.addEventListener(this.clickCB, this.jiaChui);

        //红黑胡
        var hongHeiHuList = [];
        hongHeiHuList.push(_play.getChildByName("hongHeiType1"));
        hongHeiHuList.push(_play.getChildByName("hongHeiType2"));
        this.hongHeiHuList_radio = createRadioBoxForCheckBoxs(hongHeiHuList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(hongHeiHuList, 0, this.hongHeiHuList_radio), hongHeiHuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongHeiHuList, 1, this.hongHeiHuList_radio), hongHeiHuList[1].getChildByName("text"));
        this.hongHeiHuList = hongHeiHuList;

        //自摸
        this.ziMo = _play.getChildByName("ziMo");
        this.addListenerText(this.ziMo);
        this.ziMo.addEventListener(this.clickCB, this.ziMo);

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
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

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },
    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        if (atClub){ 
            if (this.getBoolItem("convertible", false))
                _maxPlayer = 2;  //自由人数索引
            else {
                var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
                _maxPlayer = [2, 3].indexOf(temp_maxPlayer);
            }
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node);

        var list = [];
        index = 0;

        var _huXiType;
        if (atClub){
            _huXiType = {5:0, 3:1}[this.getNumberItem("huXiType", 5)];
        }else{
            _huXiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_huXiType, 0);
        }
        if(_huXiType > 2 || _huXiType < 0){
            _huXiType = 0;
        }
        this.huXiTypeList_radio.selectItem(_huXiType);
        list = [];
        list.push(_play.getChildByName("huXiType0")); 
        list.push(_play.getChildByName("huXiType1"));
        this.radioBoxSelectCB(_huXiType,list[_huXiType],list);

        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_maiPaiNum, 0);
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 1);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_faPai, 1);
        }

        this.faPaiList_radio.selectItem(_faPai);
        list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        // jiaChui
        var _jiaChui;
        if (atClub){
            _jiaChui = this.getBoolItem("isJiaChui", false);
        }else{
            _jiaChui =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_jiaChui, false);
        }
        this.jiaChui.setSelected(_jiaChui);
        var txt = this.jiaChui.getChildByName("text");
        if(_jiaChui){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        //红黑胡
        var _hongHeiHu;
        if (atClub) {
            _hongHeiHu = {0:0, 1:1}[this.getNumberItem("hongHeiType", 0)];
        } else {
            _hongHeiHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_hongHeiHu, 0);
        }
        this.hongHeiHuList_radio.selectItem(_hongHeiHu);
        this.radioBoxSelectCB(_hongHeiHu,this.hongHeiHuList[_hongHeiHu],this.hongHeiHuList);

        //自摸
        var _ziMo;
        if (atClub) {
            _ziMo = this.getBoolItem("isZiMo", false);
        } else {
            _ziMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_ziMo, false);
        }
        this.ziMo.setSelected(_ziMo);
        var text = this.ziMo.getChildByName("text");
        this.selectedCB(text, _ziMo);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_qiepaii, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_trustTime, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
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
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
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
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }

        this.checkPayWay();
    },
    getExtraSelectedPara:function(para)
    {
        var fanBeiOption;
        var fanBeiScore;
        if (this.fanbei_radio) {
            fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            fanBeiOption = this.fanbei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = Number(text_diFen.getString());
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
        var para = {};
        var hxIndex = parseInt(this.huXiTypeList_radio.getSelectIndex());
        var maxPlayerIdx = this.maxPlayerList_radio.getSelectIndex();

        para.maxPlayer = [2, 3, 3][maxPlayerIdx];
        para.convertible = maxPlayerIdx == 2;                         // 自由人数
        para.gameType = MjClient.GAME_TYPE.SHAO_YANG_ZI_PAI;
        para.huXiType = [5, 3][hxIndex];
        para.isJiaChui = this.jiaChui.isSelected();
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.hongHeiType = [0, 1][this.hongHeiHuList_radio.getSelectIndex()];
        para.isZiMo = this.ziMo.isSelected();
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.maiPaiNum = (para.maxPlayer == 2 || para.convertible) ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_huXiType, hxIndex);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_jiaChui, para.isJiaChui);

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
            var maxPlayerIdx = parseInt(this.maxPlayerList_radio.getSelectIndex());
            var hxIndex = parseInt(this.huXiTypeList_radio.getSelectIndex());
            var hongHeiIdx = parseInt(this.hongHeiHuList_radio.getSelectIndex());

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_maxPlayer, maxPlayerIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_huXiType, hxIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_jiaChui, para.isJiaChui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_qiepaii, para.isManualCutCard ? 1 : 0);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_hongHeiHu, hongHeiIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_ziMo, para.isZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_trustTime, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ZI_PAI_ShaoYang_maiPaiNum, para.maiPaiNum);
        }
    },
    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.checkPayWay();
    },
    radioBoxSelectCB:function(index,sender, list){
        this._super(index,sender, list);
        if(sender.getName() == "payWay_1" || sender.getName() == "payWay_2"){
            this.updateConvertible(sender);
        }
    },
    updateConvertible:function(sender){
        var _play = this.bg_node.getChildByName("play"); 
        var temp = _play.getChildByName("maxPlayer1"); // 自由人数 
        if(sender.getName() == "payWay_2"){
            if(this.maxPlayerList_radio.getSelectIndex() == 2) // 如果选择的是自由人数，就重新选择默认内容
                this.maxPlayerList_radio.selectItem(1);
            temp.setVisible(false);   

        }else if(sender.getName() == "payWay_1"){
            temp.setVisible(true); 
        }
    }, 
    setTextClick:function (listnode,number,radio,callBack) {
        var self = this;
        if(number != null && listnode[number]
            && (listnode[number].getName() == "payWay_1" || listnode[number].getName() == "payWay_2")){
            return this._super(listnode,number,radio,function(index, parent){
                self.updateConvertible(listnode[number]);
            });
        }
        return this._super(listnode,number,radio,callBack);
    },
    checkPayWay : function(){
        var round = this.bg_node.getChildByName("round");
        var payWay_1 = round.getChildByName("payWay_1");
        var payWay_2 = round.getChildByName("payWay_2");

        if(this._isRoomCardMode)
        {
            return; //亲友圈房卡模式 使用动态创建节点
        }

        payWay_2.setVisible(true);
        if(this.maxPlayerList_radio.getSelectIndex() == 2){
            payWay_2.setVisible(false);  
            // 如果选择的是自由人数，取消AA设为房主支付
            payWay_1.setSelected(true);
            payWay_2.setSelected(false);
            this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
            // this.setRoundNodeCurrentSelect(); 
        }

        this.changeAAPayForPlayerNum();

        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191,191,191);
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        if(maxPlayerIndex == 0 || maxPlayerIndex == 2){
            //2人 或 自由人数
            var textArr = [""]
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                if(maxPlayerIndex == 2){
                    txt.setString(["不埋牌","2人埋10张","2人埋20张"][i]);
                }
                else
                {
                    txt.setString(["不埋牌","埋10张","埋20张"][i]);
                }
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }

        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setString(["不埋牌","埋10张","埋20张"][i]);
                txt.setTextColor(unEnableColor);
            }
        }
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_ZiPai();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_ZiPai();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_ZiPai();
    },

    setDiaNumData_ZiPai : function(){
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