/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_xiangtanPHZ = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    initAll:function()
    {
        this.localStorageKey.KEY_xiangtanPHZ_maxPlayer            = "_xiangtanPHZ_maxPlayer";           //几人玩
        this.localStorageKey.KEY_xiangtanPHZ_minHuType            = "_xiangtanPHZ_minHuType";           //起胡的方式
        this.localStorageKey.KEY_xiangtanPHZ_countTunWay          = "_xiangtanPHZ_countTunWay";         //算囤的方式
        this.localStorageKey.KEY_xiangtanPHZ_difen                = "_xiangtanPHZ_difen";               //底分
        this.localStorageKey.KEY_xiangtanPHZ_weiType              = "_xiangtanPHZ_weiType";             //偎的方式
        this.localStorageKey.KEY_xiangtanPHZ_hongType             = "_xiangtanPHZ_hongType";            //多少红
        this.localStorageKey.KEY_xiangtanPHZ_isMaiPai             = "_xiangtanPHZ_isMaiPai";            //是否埋牌
        this.localStorageKey.KEY_xiangtanPHZ_maiPaiType             = "_xiangtanPHZ_maiPaiType";            //埋牌方式  0：不埋  1：埋10   2：埋20
        this.localStorageKey.KEY_xiangtanPHZ_isZiMoAddThree       = "_xiangtanPHZ_isZiMoAddThree";      //自摸加3胡
        this.localStorageKey.KEY_xiangtanPHZ_isYiWuShi            = "_xiangtanPHZ_isYiWuShi";           //一五十
        this.localStorageKey.KEY_xiangtanPHZ_isDoubleThirtyBeard  = "_xiangtanPHZ_isDoubleThirtyBeard"; //30胡翻倍
        this.localStorageKey.KEY_xiangtanPHZ_isHuanagZhuang       = "_xiangtanPHZ_isHuanagZhuang";      //荒庄5胡息
        this.localStorageKey.KEY_xiangtanPHZ_isYiDianHong         = "_xiangtanPHZ_isYiDianHong";        //一点红
        this.localStorageKey.KEY_xiangtanPHZ_isTianDiHu           = "_xiangtanPHZ_isTianDiHu";          //天地胡
        this.localStorageKey.KEY_xiangtanPHZ_isDaXiaoZi           = "_xiangtanPHZ_isDaXiaoZi";          //大小字
        this.localStorageKey.KEY_xiangtanPHZ_isPengPengHu         = "_xiangtanPHZ_isPengPengHu";        //碰碰胡
        this.localStorageKey.KEY_xiangtanPHZ_isHongHeiHu          = "_xiangtanPHZ_isHongHeiHu ";        //红黑胡
        this.localStorageKey.KEY_xiangtanPHZ_maxPlayerToStart     = "_xiangtanPHZ_maxPlayerToStart";    // 是否满人直接开始
        this.localStorageKey.KEY_xiangtanPHZ_showChouWei          = "_xiangtanPHZ_showChouWei";         // 是否臭偎明示
        this.localStorageKey.KEY_xiangtanPHZ_mingTangDieJia       = "_xiangtanPHZ_mingTangDieJia";      // 是否名堂叠加
        this.localStorageKey.KEY_xiangtanPHZ_chibiandabian        = "_xiangtanPHZ_chibiandabian";       // 是否吃边打边
        this.localStorageKey.KEY_xiangtanPHZ_randomZhuang         = "_xiangtanPHZ_randomZhuang";        // 是否首局随机坐庄
        this.localStorageKey.KEY_xiangtanPHZ_FAN_BEI              = "xiangtanPHZ_TY_FAN_BEI";           //大结算翻倍
        this.localStorageKey.KEY_xiangtanPHZ_trust                = "xiangtanPHZ_trust";                //托管
        this.localStorageKey.KEY_xiangtanPHZ_FAN_BEI_SCORE        = "xiangtanPHZ_FAN_BEI_SCORE";        //少于X分大结算翻倍
        this.localStorageKey.KEY_xiangtanPHZ_fapai                = "xiangtanPHZ_fapai";                // 发牌速度

        this.setExtraKey({
            fanBei: this.localStorageKey.KEY_xiangtanPHZ_FAN_BEI,  //大结算翻倍
            fanBeiScore: this.localStorageKey.KEY_xiangtanPHZ_FAN_BEI_SCORE,  //少于X分大结算翻倍
            jieSuanDiFen: "xiangtanPHZ_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:5, roundNum2:6, roundNum3:8, roundNum4:10};
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);

        this.bg_node = ccs.load("bg_xiangtanPHZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiangtanPHZ").getChildByName("view");
    },

    _clickCB : function(sender,type){

        if(sender.name == "hongheihu"){
            this.checkSelect();
        }
        this._super(sender, type);
    },

    setDiaNumData_xiangtan : function(){
        if (!this.bg_node.getChildByName("round").getChildByName("round_1").getChildByName("text_0"))
            return;

        var para_xiangtan = this.getSelectedPara();
        var gameType_xiangtan = para_xiangtan.gameType;
        var maxPlayer_xiangtan = para_xiangtan.maxPlayer;
        // var payWay_xiangtan = this.payWayNode_1.isSelected() ? 0 : this.payWayNode_2.isSelected() ? 1 : 2;

        var round = this.bg_node.getChildByName("round");
        var text1 = round.getChildByName("round_1").getChildByName("text_0");
        var text2 = round.getChildByName("round_2").getChildByName("text_0");
        var text3 = round.getChildByName("round_3").getChildByName("text_0");
        text1.ignoreContentAdaptWithSize(true);
        text2.ignoreContentAdaptWithSize(true);
        text3.ignoreContentAdaptWithSize(true);
        // text1.setString("(" + this.getPrice(gameType_xiangtan, maxPlayer_xiangtan, this.roundNumObj.roundNum1, payWay_xiangtan) + this._costName + ")");
        // text2.setString("(" + this.getPrice(gameType_xiangtan, maxPlayer_xiangtan, this.roundNumObj.roundNum2, payWay_xiangtan) + this._costName + ")");
        // text3.setString("(" + this.getPrice(gameType_xiangtan, maxPlayer_xiangtan, this.roundNumObj.roundNum3, payWay_xiangtan) + this._costName + ")");
    },

    checkSelect : function(){
        var _isSelected = this.isHongHeiHu.isSelected();
        if(_isSelected){
            this._hongType10.visible = true;
            this._hongType13.visible = true;
        }else{
            this._hongType10.visible = false;
            this._hongType13.visible = false;
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
        this.setDiaNumData_xiangtan();
        // this.updateSelectDiaNum();
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

    checkTunWayRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkTunWaySelect();
    },

    checkTunWaySelect: function(){
        if (!this.diFenList) {
            return ;
        }

        var tunIndex = this.countTunWayList_radio.getSelectIndex();
        if(tunIndex == 2){
            this.showAndHideDiFen(true);
            this.isHuangZhuang.visible = false;
        }else{
            this.showAndHideDiFen(false);
            this.isHuangZhuang.visible = true;
        }
    },

    showAndHideDiFen: function(bool){
        for (var i = 0; i < this.diFenList.length; i++) {
            this.diFenList[i].visible = bool;
        }
        this.bg_node.getChildByName("title").getChildByName("difen").visible = bool;
    },

    checkWeiTypeRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkWeiTypeSelect();
    },

    checkWeiTypeSelect: function(){
        var _weiTypeIndex = this.weiTypeList_radio.getSelectIndex();
        if(_weiTypeIndex == 1){
            this.showChouWeiCheckBox.visible = true;
        }else{
            this.showChouWeiCheckBox.visible = false;
        }
    },

    initPlayNode:function()
    { 
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkMaxPlayerSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkMaxPlayerSelect.bind(this)),maxPlayerList[1].getChildByName("text"));

        var minHuTypeList = [];
        minHuTypeList.push(_play.getChildByName("minHu_15"));
        minHuTypeList.push(_play.getChildByName("minHu_10"));
        this.minHuTypeList_radio = createRadioBoxForCheckBoxs(minHuTypeList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(minHuTypeList,0,this.minHuTypeList_radio),minHuTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(minHuTypeList,1,this.minHuTypeList_radio),minHuTypeList[1].getChildByName("text"));

        var countTunWayList = [];
        countTunWayList.push(_play.getChildByName("countTun_1"));
        countTunWayList.push(_play.getChildByName("countTun_2"));
        countTunWayList.push(_play.getChildByName("countTun_3"));
        this.countTunWayList_radio = createRadioBoxForCheckBoxs(countTunWayList,this.checkTunWayRadioBox.bind(this),0);
        cc.eventManager.addListener(this.setTextClick(countTunWayList,0,this.countTunWayList_radio,this.checkTunWaySelect.bind(this)),countTunWayList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(countTunWayList,1,this.countTunWayList_radio,this.checkTunWaySelect.bind(this)),countTunWayList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(countTunWayList,2,this.countTunWayList_radio,this.checkTunWaySelect.bind(this)),countTunWayList[2].getChildByName("text"));

        if (_play.getChildByName("play_difen_0")) {
            var diFenList = [];
            diFenList.push(_play.getChildByName("play_difen_0"));
            diFenList.push(_play.getChildByName("play_difen_1"));
            diFenList.push(_play.getChildByName("play_difen_2"));
            diFenList.push(_play.getChildByName("play_difen_3"));
            diFenList.push(_play.getChildByName("play_difen_4"));
            this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB,0);
            this.diFenList = diFenList;
            cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(diFenList,2,this.diFenList_radio),diFenList[2].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(diFenList,3,this.diFenList_radio),diFenList[3].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(diFenList,4,this.diFenList_radio),diFenList[4].getChildByName("text"));
        }
        

        var weiTypeList = [];
        weiTypeList.push(_play.getChildByName("mingwei"));
        weiTypeList.push(_play.getChildByName("anwei"));
        this.weiTypeList_radio = createRadioBoxForCheckBoxs(weiTypeList,this.checkWeiTypeRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(weiTypeList,0,this.weiTypeList_radio,this.checkWeiTypeSelect.bind(this)),weiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(weiTypeList,1,this.weiTypeList_radio,this.checkWeiTypeSelect.bind(this)),weiTypeList[1].getChildByName("text"));

        var hongTypeList = [];
        this._hongType10 = _play.getChildByName("hongType10");
        this._hongType13 = _play.getChildByName("hongType13");
        hongTypeList.push(this._hongType10);
        hongTypeList.push(this._hongType13);
        this.hongTypeList_radio = createRadioBoxForCheckBoxs(hongTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(hongTypeList,0,this.hongTypeList_radio),hongTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongTypeList,1,this.hongTypeList_radio),hongTypeList[1].getChildByName("text"));


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
        

        this.isZiMoAddThree = _play.getChildByName("zimo");
        cc.eventManager.addListener(this.setTextClick(), this.isZiMoAddThree.getChildByName("text"));
        this.isZiMoAddThree.addEventListener(this._clickCB, this.isZiMoAddThree);

        this.isYiWuShi = _play.getChildByName("yiwushi");
        cc.eventManager.addListener(this.setTextClick(), this.isYiWuShi.getChildByName("text"));
        this.isYiWuShi.addEventListener(this._clickCB, this.isYiWuShi);

        this.isDoubleThirtyBeard = _play.getChildByName("doubleBeard_30");
        cc.eventManager.addListener(this.setTextClick(), this.isDoubleThirtyBeard.getChildByName("text"));
        this.isDoubleThirtyBeard.addEventListener(this._clickCB, this.isDoubleThirtyBeard);

        this.isHuangZhuang = _play.getChildByName("huangzhuang");
        cc.eventManager.addListener(this.setTextClick(), this.isHuangZhuang.getChildByName("text"));
        this.isHuangZhuang.addEventListener(this._clickCB, this.isHuangZhuang);

        this.isYiDianHong = _play.getChildByName("yidianhong");
        cc.eventManager.addListener(this.setTextClick(), this.isYiDianHong.getChildByName("text"));
        this.isYiDianHong.addEventListener(this._clickCB, this.isYiDianHong);

        this.isTianDiHu = _play.getChildByName("tiandihu");
        cc.eventManager.addListener(this.setTextClick(), this.isTianDiHu.getChildByName("text"));
        this.isTianDiHu.addEventListener(this._clickCB, this.isTianDiHu);

        this.isDaXiaoZi = _play.getChildByName("daxiaozi");
        cc.eventManager.addListener(this.setTextClick(), this.isDaXiaoZi.getChildByName("text"));
        this.isDaXiaoZi.addEventListener(this._clickCB, this.isDaXiaoZi);

        this.isPengPengHu = _play.getChildByName("pengpenghu");
        cc.eventManager.addListener(this.setTextClick(), this.isPengPengHu.getChildByName("text"));
        this.isPengPengHu.addEventListener(this._clickCB, this.isPengPengHu);

        this.isHongHeiHu = _play.getChildByName("hongheihu");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)), this.isHongHeiHu.getChildByName("text"));
        this.isHongHeiHu.addEventListener(this._clickCB.bind(this), this.isHongHeiHu);

        this.maxPlayerToStartCheckBox = _play.getChildByName("maxPlayerToStart");
        this.maxPlayerToStartCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.maxPlayerToStartCheckBox.getChildByName("text"));
        this.maxPlayerToStartCheckBox.addEventListener(this._clickCB, this.maxPlayerToStartCheckBox);

        this.showChouWeiCheckBox = _play.getChildByName("showChouWei");
        this.showChouWeiCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.showChouWeiCheckBox.getChildByName("text"));
        this.showChouWeiCheckBox.addEventListener(this._clickCB, this.showChouWeiCheckBox);

        this.showMTDieJiaCheckBox = _play.getChildByName("mingtangdiejia");
        this.showMTDieJiaCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.showMTDieJiaCheckBox.getChildByName("text"));
        this.showMTDieJiaCheckBox.addEventListener(this._clickCB, this.showMTDieJiaCheckBox);

        this.chibiandabianCheckBox = _play.getChildByName("chibiandabian");
        this.chibiandabianCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.chibiandabianCheckBox.getChildByName("text"));
        this.chibiandabianCheckBox.addEventListener(this._clickCB, this.chibiandabianCheckBox);

        this.randomZhuangCheckBox = _play.getChildByName("randomZhuang");
        this.randomZhuangCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.randomZhuangCheckBox.getChildByName("text"));
        this.randomZhuangCheckBox.addEventListener(this._clickCB, this.randomZhuangCheckBox);

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
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];

        var _maxPlayer;
        if(atClub){
            _maxPlayer = [3, 2].indexOf(this.getNumberItem("maxPlayer", 3));
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 
        
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;

        var _minHuType;
        if(atClub){
            _minHuType = this.getNumberItem("minHuType", 0);
        }else{
            _minHuType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_minHuType, 0);
        }
        this.minHuTypeList_radio.selectItem(_minHuType);
        list = [];
        list.push(_play.getChildByName("minHu_15"));
        list.push(_play.getChildByName("minHu_10"));
        this.radioBoxSelectCB(_minHuType,list[_minHuType],list);

        var _countTunWay;
        if(atClub){
            var _countTunWay = this.getNumberItem("countTunWay", 0);
        }else{
            _countTunWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_countTunWay, 0);
        }
        this.countTunWayList_radio.selectItem(_countTunWay);
        list = [];
        list.push(_play.getChildByName("countTun_1"));
        list.push(_play.getChildByName("countTun_2"));
        list.push(_play.getChildByName("countTun_3"));
        this.radioBoxSelectCB(_countTunWay,list[_countTunWay],list);

        if (this.diFenList_radio) {
            var diFenIndex;
            if(atClub){
                var diFenIndex = [1, 2, 3, 4, 5].indexOf(this.getNumberItem("diFen", 1));
            }else{
                diFenIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_difen, 0);
            }
            this.diFenList_radio.selectItem(diFenIndex);
            this.radioBoxSelectCB(diFenIndex,this.diFenList[diFenIndex],this.diFenList);
        }
        
        var _weiType;
        if(atClub){
            var _mingwei = this.getBoolItem("mingwei", true);
            _weiType =  _mingwei ? 0 : 1;
        }else{
            _weiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_weiType, 0);
        }
        this.weiTypeList_radio.selectItem(_weiType);
        list = [];
        list.push(_play.getChildByName("mingwei"));
        list.push(_play.getChildByName("anwei"));
        this.radioBoxSelectCB(_weiType,list[_weiType],list);

        var _hongType;
        if(atClub){
            var _honghutype = this.getBoolItem("honghutype", true);
            _hongType = _honghutype ? 0 : 1;
        }else{
            _hongType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_hongType, 0);
        }
        this.hongTypeList_radio.selectItem(_hongType);
        list = [];
        list.push(_play.getChildByName("hongType10"));
        list.push(_play.getChildByName("hongType13"));
        this.radioBoxSelectCB(_hongType,list[_hongType],list);

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
             var maiPaiType;
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 0);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_maiPaiType, 0);

            var _maiPai; 
            if(atClub)
                _maiPai = this.getBoolItem("maipai", false);
            else
                _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isMaiPai, false);

            if(!_maiPai) maiPaiType = 0;
            if(_maiPai && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
             var _maipaiCheckBox;
            if(atClub){
                _maipaiCheckBox = this.getBoolItem("maipai", true);
            }else{
                _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isMaiPai, true);
            }
            this.maipaiCheckBox.setSelected(_maipaiCheckBox);
            var txt = this.maipaiCheckBox.getChildByName("text");
            if(_maipaiCheckBox){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }
       

       
        var _isZiMoAddThree;
        if(atClub){
            _isZiMoAddThree = this.getBoolItem("zimoaddhuxi", false);
        }else{
            _isZiMoAddThree = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isZiMoAddThree, false);
        }
        this.isZiMoAddThree.setSelected(_isZiMoAddThree);
        var txt = this.isZiMoAddThree.getChildByName("text");
        if(_isZiMoAddThree){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isYiWuShi;
        if(atClub){
            _isYiWuShi = this.getBoolItem("isYiwushi", false);
        }else{
            _isYiWuShi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isYiWuShi, false);
        }
        this.isYiWuShi.setSelected(_isYiWuShi);
        var txt = this.isYiWuShi.getChildByName("text");
        if(_isYiWuShi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isDoubleThirtyBeard;
        if(atClub){
            _isDoubleThirtyBeard = this.getBoolItem("sanshirate", true);
        }else{
            _isDoubleThirtyBeard = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isDoubleThirtyBeard, true);
        }
        this.isDoubleThirtyBeard.setSelected(_isDoubleThirtyBeard);
        var txt = this.isDoubleThirtyBeard.getChildByName("text");
        if(_isDoubleThirtyBeard){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isHuangZhuang;
        if(atClub){
            _isHuangZhuang = this.getBoolItem("nohuaddhuxi", false);
        }else{
            _isHuangZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isHuanagZhuang, false);
        }
        this.isHuangZhuang.setSelected(_isHuangZhuang);
        var txt = this.isHuangZhuang.getChildByName("text");
        if(_isHuangZhuang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isYiDianHong;
        if(atClub){
            _isYiDianHong = this.getBoolItem("yidianhong", false);
        }else{
            _isYiDianHong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isYiDianHong, false);
        }
        this.isYiDianHong.setSelected(_isYiDianHong);
        var txt = this.isYiDianHong.getChildByName("text");
        if(_isYiDianHong){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isTianDiHu;
        if(atClub){
            _isTianDiHu = this.getBoolItem("tiandihu", false);
        }else{
            _isTianDiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isTianDiHu, false);
        }
        this.isTianDiHu.setSelected(_isTianDiHu);
        var txt = this.isTianDiHu.getChildByName("text");
        if(_isTianDiHu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isDaXiaoZi;
        if(atClub){
            _isDaXiaoZi = this.getBoolItem("daxiaozi", false);
        }else{
            _isDaXiaoZi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isDaXiaoZi, false);
        }
        this.isDaXiaoZi.setSelected(_isDaXiaoZi);
        var txt = this.isDaXiaoZi.getChildByName("text");
        if(_isDaXiaoZi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isPengPengHu;
        if(atClub){
            _isPengPengHu = this.getBoolItem("pengpenghu", false);
        }else{
            _isPengPengHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isPengPengHu, false);
        }
        this.isPengPengHu.setSelected(_isPengPengHu);
        var txt = this.isPengPengHu.getChildByName("text");
        if(_isPengPengHu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isHongHeiHu;
        if(atClub){
            _isHongHeiHu = this.getBoolItem("hongheihu", false);
        }else{
            _isHongHeiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isHongHeiHu, false);
        }
        this.isHongHeiHu.setSelected(_isHongHeiHu);
        var txt = this.isHongHeiHu.getChildByName("text");
        if(_isHongHeiHu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maxPlayerToStartCheckBox;
        if(atClub){
            _maxPlayerToStartCheckBox = this.getBoolItem("fullperson", false);
        }else{
            _maxPlayerToStartCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_maxPlayerToStart, false);
        }
        this.maxPlayerToStartCheckBox.setSelected(_maxPlayerToStartCheckBox);
        var txt = this.maxPlayerToStartCheckBox.getChildByName("text");
        if(_maxPlayerToStartCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _showChouWeiCheckBox;
        if(atClub){
            _showChouWeiCheckBox = this.getBoolItem("isShowChouWei", false);
        }else{
            _showChouWeiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_showChouWei, false);
        }
        this.showChouWeiCheckBox.setSelected(_showChouWeiCheckBox);
        var txt = this.showChouWeiCheckBox.getChildByName("text");
        if(_showChouWeiCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _showMTDieJiaCheckBox;
        if(atClub){
            _showMTDieJiaCheckBox = this.getBoolItem("isShowMTDieJia", true);
        }else{
            _showMTDieJiaCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_mingTangDieJia, true);
        }
        cc.log("============ming tang die jia:" + _showMTDieJiaCheckBox);
        this.showMTDieJiaCheckBox.setSelected(_showMTDieJiaCheckBox);
        var txt = this.showMTDieJiaCheckBox.getChildByName("text");
        if(_showMTDieJiaCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _chibiandabianCheckBox;
        if(atClub){
            _chibiandabianCheckBox = this.getBoolItem("isPutLimit", true);
        }else{
            _chibiandabianCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_chibiandabian, true);
        }
        cc.log("============ming tang die jia:" + _chibiandabianCheckBox);
        this.chibiandabianCheckBox.setSelected(_chibiandabianCheckBox);
        var txt = this.chibiandabianCheckBox.getChildByName("text");
        if(_chibiandabianCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _randomZhuangCheckBox;
        if(atClub){
            _randomZhuangCheckBox = this.getBoolItem("firstRandomZhuang", true);
        }else{
            _randomZhuangCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangtanPHZ_randomZhuang, true);
        }
        cc.log("============ming tang die jia:" + _randomZhuangCheckBox);
        this.randomZhuangCheckBox.setSelected(_randomZhuangCheckBox);
        var txt = this.randomZhuangCheckBox.getChildByName("text");
        if(_randomZhuangCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (atClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_trust, 0);
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
                _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangtanPHZ_fapai, 0);
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
        this.checkWeiTypeSelect();
        this.checkTunWaySelect();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var minHuTypeIndex  = this.minHuTypeList_radio.getSelectIndex();
        var countTunWayIndex = this.countTunWayList_radio.getSelectIndex();
        var weiTypeIndex   = this.weiTypeList_radio.getSelectIndex();
        var hongTypeIndex  = this.hongTypeList_radio.getSelectIndex();
       
        var isShowChouWei  = this.showChouWeiCheckBox.isSelected();
        var isShowMTDieJia = this.showMTDieJiaCheckBox.isSelected();
        var isFullPerson   = this.maxPlayerToStartCheckBox.isSelected();
        var isHuangZhuang  = this.isHuangZhuang.isSelected()
        var diFenIndex     = 0; 

        var para = {};
        para.gameType    = MjClient.GAME_TYPE.XIANG_TAN_PAO_HU_ZI;
        para.maxPlayer   = [3,2][maxPlayerIndex];
        para.minHuType   = minHuTypeIndex;
        para.countTunWay = countTunWayIndex;
        para.mingwei     = weiTypeIndex ? false : true;
        para.honghutype  = hongTypeIndex ? false : true;
        para.zimoaddhuxi = this.isZiMoAddThree.isSelected();
        para.isYiwushi   = this.isYiWuShi.isSelected();
        para.sanshirate  = this.isDoubleThirtyBeard.isSelected();
        para.nohuaddhuxi = isHuangZhuang && countTunWayIndex != 2;
        para.yidianhong  = this.isYiDianHong.isSelected();
        para.tiandihu    = this.isTianDiHu.isSelected();
        para.daxiaozi    = this.isDaXiaoZi.isSelected();
        para.pengpenghu  = this.isPengPengHu.isSelected();
        para.hongheihu   = this.isHongHeiHu.isSelected();
        para.isPutLimit  = this.chibiandabianCheckBox.isSelected();
        para.firstRandomZhuang = this.randomZhuangCheckBox.isSelected();
        var maiPaiType, isMaiPai;
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            maiPaiType = this.maiPaiList_radio.getSelectIndex();
            isMaiPai = maiPaiType > 0;
            para.maiPaiType  = maiPaiType;
        }else{
            isMaiPai       = this.maipaiCheckBox.isSelected();
        }

        if(maxPlayerIndex == 0){
            isMaiPai = false;
        }
        para.maipai      = isMaiPai;

        if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
            para.fullperson = isFullPerson;
        }else{
            para.fullperson = false;
        }

        para.isShowChouWei = isShowChouWei
        para.isShowMTDieJia = isShowMTDieJia;
        if(weiTypeIndex == 0){
            para.isShowChouWei = false;
        }

        if (this.diFenList_radio) {
            diFenIndex = this.diFenList_radio.getSelectIndex();
            para.diFen = [1, 2, 3, 4, 5][diFenIndex];
        }

        if(this.faPaiList_radio){
            para.faPai = this.faPaiList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_fapai, para.faPai);
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_trust, trustIndex);
        }

        this.getExtraSelectedPara(para);

        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_maxPlayer, maxPlayerIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_minHuType, minHuTypeIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_countTunWay, countTunWayIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_difen, diFenIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_weiType, weiTypeIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_hongType, hongTypeIndex);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isMaiPai, isMaiPai);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangtanPHZ_maiPaiType, maiPaiType);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isZiMoAddThree, para.zimoaddhuxi);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isYiWuShi, para.isYiwushi);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isDoubleThirtyBeard, para.sanshirate);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isHuanagZhuang, isHuangZhuang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isYiDianHong, para.yidianhong);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isTianDiHu, para.tiandihu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isDaXiaoZi, para.daxiaozi);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isPengPengHu, para.pengpenghu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_isHongHeiHu, para.hongheihu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_maxPlayerToStart, isFullPerson);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_showChouWei, isShowChouWei);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_mingTangDieJia, isShowMTDieJia);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_chibiandabian, para.isPutLimit);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangtanPHZ_randomZhuang, para.firstRandomZhuang);

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