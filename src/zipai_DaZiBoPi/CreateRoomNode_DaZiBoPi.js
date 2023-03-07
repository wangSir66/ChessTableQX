/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_DaZiBoPi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';
        if (!this._isFriendCard){
            //this.localStorageKey.KEY_DA_ZI_BO_PI_maxPlayer       = "_DaZiBoPi_maxPlayer";          //几人玩
            this.localStorageKey.KEY_DA_ZI_BO_PI_fengding      = "_DaZiBoPi_fengding";         //封顶
            this.localStorageKey.KEY_DA_ZI_BO_PI_hongHei        = "_DaZiBoPi_hongHei";         //红黑 （原红黑点）
            this.localStorageKey.KEY_DA_ZI_BO_PI_lianZhuang     = "_DaZiBoPi_lianZhuang";        //连庄
            this.localStorageKey.KEY_DA_ZI_BO_PI_tianDiHu     = "_DaZiBoPi_tianDiHu";        //天地胡
            this.localStorageKey.KEY_DA_ZI_BO_PI_jiaChui      = "_DaZiBoPi_jiaChui";        //加锤
            this.localStorageKey.KEY_DA_ZI_BO_PI_springDouble = "_DaZiBoPi_springDouble";        //春天翻倍
            this.localStorageKey.KEY_DA_ZI_BO_PI_dismissDouble = "_DaZiBoPi_dismissDouble";        //春天解散翻倍
            this.localStorageKey.KEY_DA_ZI_BO_PI_tiandiHuType = "_DaZiBoPi_tianDiHuType";   //天地胡类型
            this.localStorageKey.KEY_DA_ZI_BO_PI_qiepai       = "_DaZiBoPi_qiepai";   //切牌
            this.localStorageKey.KEY_DA_ZI_BO_PI_hongHeiType        = "_DaZiBoPi_hongHeiType";         //红黑类型
            this.localStorageKey.KEY_DA_ZI_BO_PI_isRandomZhuang  = "_DaZiBoPi_isRandomZhuang";         //随机庄
            //this.localStorageKey.KEY_DA_ZI_BO_PI_maiPai        = "_DaZiBoPi_maiPai"; //埋牌
            this.localStorageKey.KEY_DA_ZI_BO_PI_maiPaiNum        = "_DaZiBoPi_maiPaiNum"; //埋牌数
            this.localStorageKey.KEY_DA_ZI_BO_PI_diFen         = "_DaZiBoPi_diFen";   //低分翻倍
            this.localStorageKey.KEY_DA_ZI_BO_PI_diFen_score         = "_DaZiBoPi_diFen_score";   //低分翻倍分数
            this.localStorageKey.KEY_DA_ZI_BO_PI_faPai         = "_DaZiBoPi_faPai";   //发牌速度
            this.localStorageKey.KEY_DA_ZI_BO_PI_trust         = "_DaZiBoPi_trust";   //托管
            this.localStorageKey.KEY_DA_ZI_BO_PI_qiHu         = "_DaZiBoPi_qiHu";   //起胡
        }

        this.setExtraKey({
            jieSuanDiFen: "_DaZiBoPi_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:100, roundNum2:100, roundNum3:100};

        this.bg_node = ccs.load("bg_DaZiBoPi.json").node;
        this._uiNode = this.bg_node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        this.tipTxt = this.bg_node.getChildByName("tipTxt");

        //var maxPlayerList = [];
        //maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        //maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        //maxPlayerList.push(_play.getChildByName("maxPlayer2"));//
        //maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        //maxPlayerList.push(_play.getChildByName("maxPlayer_0")); // 自由人数
		//this.initPlayNumNode(maxPlayerList, [4, 3, 4, 2, 3]);
        //this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_//.bind(this));
        //cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maxPlayerList,3,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[3].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maxPlayerList,4,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[4].getChildByName("text"));

        //var maiPaiList = [];
        //maiPaiList.push(_play.getChildByName("maiPai_0"));
        //maiPaiList.push(_play.getChildByName("maiPai_1"));
        //maiPaiList.push(_play.getChildByName("maiPai_2"));
        //this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        //cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        //cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        //this.maiPaiList = maiPaiList;

        var qiHuList = [];
        qiHuList.push(_play.getChildByName("qiHu0"));
        qiHuList.push(_play.getChildByName("qiHu1"));
        this.qiHuList_radio = createRadioBoxForCheckBoxs(qiHuList,this.radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(qiHuList,0,this.qiHuList_radio),qiHuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qiHuList,1,this.qiHuList_radio),qiHuList[1].getChildByName("text"));

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai0")); 
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        var fengDingList = [];
        fengDingList.push(_play.getChildByName("fengding0")); 
        fengDingList.push(_play.getChildByName("fengding1"));
        fengDingList.push(_play.getChildByName("fengding2"));
        fengDingList.push(_play.getChildByName("fengding3"));
        this.fengDingList_radio = createRadioBoxForCheckBoxs(fengDingList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fengDingList,0,this.fengDingList_radio),fengDingList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,1,this.fengDingList_radio),fengDingList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,2,this.fengDingList_radio),fengDingList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList,3,this.fengDingList_radio),fengDingList[3].getChildByName("text"));

        var tianDiHuTypeList = [];
        tianDiHuTypeList.push(_play.getChildByName("tianDiHu_1")); 
        tianDiHuTypeList.push(_play.getChildByName("tianDiHu_2"));
        tianDiHuTypeList.push(_play.getChildByName("tianDiHu_3")); 
        this.tianDiHuTypeList_radio = createRadioBoxForCheckBoxs(tianDiHuTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(tianDiHuTypeList,0,this.tianDiHuTypeList_radio),tianDiHuTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tianDiHuTypeList,1,this.tianDiHuTypeList_radio),tianDiHuTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tianDiHuTypeList,2,this.tianDiHuTypeList_radio),tianDiHuTypeList[2].getChildByName("text"));

        var hongHeiTypeList = [];
        hongHeiTypeList.push(_play.getChildByName("hongHeiWu")); //无
        hongHeiTypeList.push(_play.getChildByName("hongHeiHu")); //红黑胡
        hongHeiTypeList.push(_play.getChildByName("hongHeiDian")); //红黑点
        this.hongHeiTypeList_radio = createRadioBoxForCheckBoxs(hongHeiTypeList,this.radioBoxSelectCB_DaZiBoPi.bind(this));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,0,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,1,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,2,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[2].getChildByName("text"));

        this.lianZhuang = _play.getChildByName("lianZhuang");
        this.lianZhuang.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.lianZhuang.getChildByName("text"));
        this.lianZhuang.addEventListener(this._clickCB.bind(this), this.lianZhuang);


        this.jiaChui = _play.getChildByName("jiaChui");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.jiaChui.getChildByName("text"));
        this.jiaChui.addEventListener(this._clickCB.bind(this), this.jiaChui);


        this.springDouble = _play.getChildByName("springDouble");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkTouchSpringDouble.bind(this)),this.springDouble.getChildByName("text"));
        this.springDouble.addEventListener(this._clickCB.bind(this), this.springDouble);

        this.dismissDouble = _play.getChildByName("dismissDouble");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.dismissDouble.getChildByName("text"));
        this.dismissDouble.addEventListener(this._clickCB.bind(this), this.dismissDouble);

        this.isRandomZhuang = _play.getChildByName("isRandom");
        cc.eventManager.addListener(this.setTextClick(null,null,null),this.isRandomZhuang.getChildByName("text"));
        this.isRandomZhuang.addEventListener(this._clickCB.bind(this), this.isRandomZhuang);

        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }

        //托管
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

        var diFenList = [];
        diFenList.push(_play.getChildByName("fanBei0"));
        diFenList.push(_play.getChildByName("fanBei1"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,(index,sender, list)=>{
            this.radioBoxSelectCB(index,sender, list);
            this.updateDiFenUi(index);
        });
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio, (index)=>{
            this.updateDiFenUi(index);
        }),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio, (index)=>{
            this.updateDiFenUi(index);
        }),diFenList[1].getChildByName("text"));
        this._initDiFenUI(diFenList[1]);

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        this.initExtraPlayNode(_play);
    },

    updateDiFenUi:function (index) {
        this.subButton.setTouchEnabled(index == 1);
        this.subButton.setBright(index == 1);
        this.addButton.setTouchEnabled(index == 1);
        this.addButton.setBright(index == 1);
        this.scoreLabel.setTextColor(index == 1 ? cc.color(211,38,14) : cc.color(68,51,51));
    },

    _initDiFenUI : function(fanBei1){
        var subButton = this.subButton = fanBei1.getChildByName("btn_sub");
        var addButton = this.addButton = fanBei1.getChildByName("btn_add");
        var scoreLabel = this.scoreLabel = fanBei1.getChildByName("score");
        subButton.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                var curScore = parseInt(scoreLabel.getString());

                curScore -= 5;
                if (curScore < 5) {
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
                    curScore = 5;
                }

                scoreLabel.setString(curScore + "分");
            }
        }, this);
    },

    _clickCB : function(sender,type){
        cc.log(sender == this.lianZhuang);
        if(sender.name == "lianZhuang"){
            this.checkSelect();
        }
        if(sender.name == "maiPai" || sender.name == "maiPai2"){
            this.checkSelect(null, sender);
        }
        if(sender.name == "springDouble"){
            this.checkTouchSpringDouble(); 
        }
        this._super(sender, type);
    },

    radioBoxSelectCB_DaZiBoPi : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect(null,sender);
          
        this.removeAAPayWay();
    },
    removeAAPayWay : function(){
        var round = this.bg_node.getChildByName("round");
        var payWay_1 = round.getChildByName("payWay_1");
        var payWay_2 = round.getChildByName("payWay_2");

        if(this._isRoomCardMode)
        {
            return; //亲友圈房卡模式 使用动态创建节点
        }

        payWay_2.setVisible(true);
    },
    updateConvertible:function(sender){

    },
    updateTip:function () {
        this.tipTxt.setString([6, 10][this.qiHuList_radio.getSelectIndex()] + "胡起胡，胡示众牌，满百结算，天胡、地胡、自摸三种名堂  ");
    },
    radioBoxSelectCB:function(index,sender, list){
        this._super(index,sender, list);
        if(sender.getName() == "payWay_1" || sender.getName() == "payWay_2"){
            this.updateConvertible(sender);
        }else if(sender.getName() == "qiHu0" || sender.getName() == "qiHu1"){
            this.updateTip();
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
   
    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 1);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_faPai, 1);
        }

        this.faPaiList_radio.selectItem(_faPai);
        list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        var _qiHu;
        if (atClub){
            _qiHu = this.getNumberItem("qiHu", 1);
        }else{
            _qiHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_qiHu, 1);
        }

        this.qiHuList_radio.selectItem(_qiHu);
        list = [];
        list.push(_play.getChildByName("qiHu0"));
        list.push(_play.getChildByName("qiHu1"));
        this.radioBoxSelectCB(_qiHu,list[_qiHu],list);

        var _fengding;
        if (atClub){
            _fengding = {"-1":0, "150":1, "200":2, "300":3}[this.getNumberItem("fengDing", -1)+""];
        }else{
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_fengding, 0);
        }

        if(_fengding < 0 || _fengding > 3){
            _fengding = 0;
        }
        this.fengDingList_radio.selectItem(_fengding);
        list = [];
        list.push(_play.getChildByName("fengding0")); 
        list.push(_play.getChildByName("fengding1"));
        list.push(_play.getChildByName("fengding2"));
        list.push(_play.getChildByName("fengding3"));
        this.radioBoxSelectCB(_fengding,list[_fengding],list);

        var _tiandiHuType;
        if(atClub){
            _tiandiHuType = this.getNumberItem("tianDiHuType", 0); 
        }else{
            _tiandiHuType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_tiandiHuType, 0);
        }
        this.tianDiHuTypeList_radio.selectItem(_tiandiHuType);  
        list = [];
        list.push(_play.getChildByName("tianDiHu_1")); 
        list.push(_play.getChildByName("tianDiHu_2"));
        list.push(_play.getChildByName("tianDiHu_3")); 
        this.radioBoxSelectCB(_tiandiHuType,list[_tiandiHuType],list);

        var _hongHeiType;
        if(atClub){
            _hongHeiType = this.getNumberItem("hongHeiType", 0);
        }else{
            _hongHeiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_hongHeiType, 0);
        }
        this.hongHeiTypeList_radio.selectItem(_hongHeiType);  
        list = [];
        list.push(_play.getChildByName("hongHeiWu")); 
        list.push(_play.getChildByName("hongHeiHu"));
        list.push(_play.getChildByName("hongHeiDian")); 
        this.radioBoxSelectCB(_hongHeiType,list[_hongHeiType],list);

        var _lianZhuang;
        if (atClub){
            _lianZhuang = this.getBoolItem("isLianZhuang", true);
        }else{
            _lianZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_lianZhuang, true);
        }
        this.lianZhuang.setSelected(_lianZhuang);
        var txt = this.lianZhuang.getChildByName("text");

        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
      
        if(_lianZhuang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _jiaChui;
        if (atClub){
            _jiaChui = this.getBoolItem("isJiaChui", false);
        }else{
            _jiaChui =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_jiaChui, false);
        }
        this.jiaChui.setSelected(_jiaChui);
        var txt = this.jiaChui.getChildByName("text");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_jiaChui){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        // 春天翻倍，默认不勾选 （该选项和可连庄不能同时选择）
        var _springDouble;
        if (atClub){
            _springDouble = this.getBoolItem("isSpringDouble", false);
        }else{
            _springDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_springDouble, false);
        }
        this.springDouble.setSelected(_springDouble);
        var txt = this.springDouble.getChildByName("text");
        if(_springDouble){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dismissDouble;
        if (atClub){
            _dismissDouble = this.getBoolItem("isDismissDouble", false);
        }else{
            _dismissDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_dismissDouble, false);
        }
        this.dismissDouble.setSelected(_dismissDouble);
        var txt = this.dismissDouble.getChildByName("text");
        if(_dismissDouble){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isRandom;
        if (atClub){
            _isRandom = this.getBoolItem("isRandomZhuang", false);
        }else{
            _isRandom = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_isRandomZhuang, false);
        }
        this.isRandomZhuang.setSelected(_isRandom);
        var txt = this.isRandomZhuang.getChildByName("text");
        if(_isRandom){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _diFen = 0;
        if (atClub){
            if(this.getNumberItem("diFen", -1) > -1){
                _diFen = 1;
                _play.getChildByName("fanBei1").getChildByName("score").setString(this.getNumberItem("diFen", -1) + "分");
            }
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_diFen, -1);
            if(index > -1){
                _diFen = 1;
                _play.getChildByName("fanBei1").getChildByName("score").setString(index + "分");
            }
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        list.push(_play.getChildByName("fanBei0"));
        list.push(_play.getChildByName("fanBei1"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);
        this.updateDiFenUi(_diFen);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300:4}[this.getNumberItem("trustTime", -1)];
        }else{
            var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_trust, 0);
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

        this.checkSelect();
        this.checkTouchSpringDouble();

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },

    

    initExtraPlayNode:function(_playWay)
    {
        this.difenAry = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
        this.difenIndex = 0;
        var _this = this;

        this._super(_playWay);
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                text_diFen.setString(_this.difenAry[_this.difenIndex] + "");
                
            });
            btn_add.addClickEventListener(function (btn) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                text_diFen.setString(_this.difenAry[_this.difenIndex] + "");
            });
        }
    },
    setBoxStatus : function(box, isSelected, visible){
        if(isSelected != undefined){
            box.setSelected(isSelected);
            var txt = box.getChildByName("text");
            if(isSelected){
                txt.setTextColor(MjClient.createRoomNode._selectColor);
            }else{
                txt.setTextColor(MjClient.createRoomNode._unSelectColor);
            }
        }
        box.visible = visible;
    },

    checkSelect : function(num,sender){ 
        var isLianZhuang = this.lianZhuang.isSelected();
        var fdTitle = this.bg_node.getChildByName("fengDing");
        var _play = this.bg_node.getChildByName("play");
        var fengDing0 = _play.getChildByName("fengding0"); 
        var fengDing1 = _play.getChildByName("fengding1");
        var fengDing2 = _play.getChildByName("fengding2");
        var fengDing3 = _play.getChildByName("fengding3");
        if(isLianZhuang){
            fdTitle.visible = true;
            fengDing0.visible = true;
            fengDing1.visible = true;
            fengDing2.visible = true;
            fengDing3.visible = true;
          
        }else{
            fdTitle.visible = false;
            fengDing0.visible = false;
            fengDing1.visible = false;
            fengDing2.visible = false;
            fengDing3.visible = false;
        }

        var trust0 = _play.getChildByName("trust0")
        var trust1 = _play.getChildByName("trust1")
        var trust2 = _play.getChildByName("trust2")
        var trust3 = _play.getChildByName("trust3")
        var btnTrustTip = _play.getChildByName("btnTrustTip");
        var trustTip = _play.getChildByName("trustTip");
        var trust = this.bg_node.getChildByName("trust");
        trust0.visible = true; 
        trust1.visible = true;
        trust2.visible = true;
        trust3.visible = true;
        btnTrustTip.visible = true;
        trustTip.visible = true; 
        trust.visible = true;

        //选红黑类型时 弹窗
        if(sender){
            var list = this.hongHeiTypeList_radio._nodeList;
            var msg = null;
            if(list[1] == sender){
                //红黑胡
                msg = "红胡：7张或以上红，+10胡息\n黑胡：+10胡息";
            }else if(list[2] == sender){
                //红黑点
                msg = "一点朱：胡息翻倍\n小红胡：5-6张红，胡息翻倍\n大红胡：7张或以上红，60胡\n黑　胡：60胡";
            }
            if(msg){
                MjClient.showMsg(msg,null,null,"",{align:"left"});
            }
        }
        this.removeAAPayWay();
        this.changeAAPayForPlayerNum(); 
    },
    // 检测春天是否显示以及连庄重合问题
    checkTouchSpringDouble : function(isClose) {
        var _springDouble = this.springDouble.isSelected(); 
        this.dismissDouble.visible = _springDouble;
    }, 

    getSelectedPara:function()
    {
        //var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var fdIndex = parseInt(this.fengDingList_radio.getSelectIndex());

        var para = {};
        para.gameType = MjClient.GAME_TYPE.DA_ZI_BO_PI;
        para.maxPlayer = 2;//[4,3,4,2,3][maxPlayerIndex];
        para.qiHu = this.qiHuList_radio.getSelectIndex();
        //para.convertible = (maxPlayerIndex == 4); // 自由人数
        para.fengDing = [-1,150,200,300][fdIndex];
        para.isHongheidian = false; //兼容之前的
        para.isLianZhuang = this.lianZhuang.isSelected();
        para.isJiaChui = this.jiaChui.isSelected();
        para.isSpringDouble = this.springDouble.isSelected(); 
        para.isDismissDouble = this.dismissDouble.isSelected() && para.isSpringDouble; //春天解散翻倍
        para.tianDiHuType = parseInt(this.tianDiHuTypeList_radio.getSelectIndex());
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        //红黑类型：0-无  1-红黑胡 2-红黑点
        para.hongHeiType = parseInt(this.hongHeiTypeList_radio.getSelectIndex()); 
        para.isRandomZhuang = this.isRandomZhuang.isSelected();

        para.diFen = [-1,5][this.diFenList_radio.getSelectIndex()];
        if(para.diFen > -1){
            para.diFen = parseInt(this.diFenList_radio.getSelectItem().getChildByName("score").getString());
        }

        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.trustList_radio.getSelectIndex()];

        this.getExtraSelectedPara(para);

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
            //var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
            var fdIndex = parseInt(this.fengDingList_radio.getSelectIndex());
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_hongHei, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_lianZhuang, para.isLianZhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_fengding, fdIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_qiHu, para.qiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_jiaChui, para.isJiaChui);
            // 春天翻倍
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_springDouble, para.isSpringDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_dismissDouble, para.isDismissDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_isRandomZhuang, para.isRandomZhuang);
            // 天地胡Type
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_tiandiHuType, para.tianDiHuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_qiepai, para.isManualCutCard ? 1 : 0);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_hongHeiType, para.hongHeiType);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DA_ZI_BO_PI_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DA_ZI_BO_PI_trust, this.trustList_radio.getSelectIndex());
        }

    },

    getSelectedRoundNum:function() //重写父类获取局数的方法
    {   
        var flg = this.lianZhuang.isSelected();
        if(flg){
            var roundNum = [100,100,100,100][parseInt(this.fengDingList_radio.getSelectIndex())];
            return  roundNum;
        }else{
            return 100; //不封顶默认100局
        }
        
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_DaZiBoPi();
    },

    setDiaNumData : function(gameNode) {
        this._super(gameNode);
        this.setDiaNumData_DaZiBoPi();
    },

    setDiaNumData_DaZiBoPi : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var text600 = round.getChildByName("payWay_1").getChildByName("text");
        var text1000 = round.getChildByName("payWay_2").getChildByName("text");
        text600.ignoreContentAdaptWithSize(true);
        text1000.ignoreContentAdaptWithSize(true);
        text600.setString("房主出(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum1, 0) + this._costName + ")");
        text1000.setString("AA(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum2, 1) + this._costName + ")");

        var price = this.getPrice(gameType, maxPlayer, this.getSelectedRoundNum(), payWay);
        var _btn_create_diamond = this.bg_node.getChildByName("btn_create_diamond");
        if(!_btn_create_diamond){
            _btn_create_diamond = this.bg_node.getParent().getChildByName("btn_create_diamond");
        }
        var dia_num = _btn_create_diamond.getChildByName("dia_num");
        dia_num.ignoreContentAdaptWithSize(true);
        dia_num.setString("" + price);
        this.resetBtnCreateDiamond(_btn_create_diamond, price);
    }
});