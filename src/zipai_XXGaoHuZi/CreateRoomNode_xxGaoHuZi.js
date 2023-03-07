var CreateRoomNode_xxGaoHuZi = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    initAll:function()
    {
        this.localStorageKey.KEY_xxGaoHuZi_fangfei     = "_xxGaoHuZi_fangfei";     // 房费
        this.localStorageKey.KEY_xxGaoHuZi_wanfa       = "_xxGaoHuZi_wanfa";       // 玩法
        this.localStorageKey.KEY_xxGaoHuZi_renshu      = "_xxGaoHuZi_renshu";      // 人数
        this.localStorageKey.KEY_xxGaoHuZi_isMaiPai    = "_xxGaoHuZi_isMaiPai";    // 是否埋牌
        this.localStorageKey.KEY_xxGaoHuZi_maiPaiType    = "_xxGaoHuZi_maiPaiType";    // 埋牌类型   0：不埋牌    1：埋10张     2：埋20张
        this.localStorageKey.KEY_xxGaoHuZi_maxPlayerToStart = "_xxGaoHuZi_maxPlayerToStart";  // 是否满人直接开始
        this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI       = "xxGaoHuZi_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_xxGaoHuZi_trust         = "xxGaoHuZi_trust";                //托管
        this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI_SCORE = "xxGaoHuZi_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_xxGaoHuZi_fapai         = "_xxGaoHuZi_fapai";    // 发牌速度
        this.localStorageKey.KEY_xxGaoHuZi_zhuang         = "_xxGaoHuZi_zhuang";    // 首局庄

        this.roundNumObj = {roundNum1:100, roundNum2:100, roundNum3:100};

        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);

        this.bg_node = ccs.load("bg_xxGaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xxGaoHuZi");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
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
        var _maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            cc.each(this.maiPaiList,function(node, key){
                if(_maxPlayerIndex == 0){
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
            if(_maxPlayerIndex == 0){
                this.maipaiCheckBox.visible = true;
            }else{
                this.maipaiCheckBox.visible = false;
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

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        var _round = this.bg_node.getChildByName("round");
        var txt = _round.getChildByName("round_0").getChildByName("text");

        if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
            txt.setTextColor(cc.color(237,101,1));
        }else if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            txt.setTextColor(CREATEROOM_COLOR_WANGWANG_SELECT)
        }else{
            txt.setTextColor(cc.color(211,38,14));
        }


        // var fangfeiList = [];
        // fangfeiList.push(_round.getChildByName("payWay_1"));
        // fangfeiList.push(_round.getChildByName("payWay_2"));
        // this.fangfeiList_radio = createRadioBoxForCheckBoxs(fangfeiList,this.radioBoxSelectCB,0);
        // cc.eventManager.addListener(this.setTextClick(fangfeiList,0,this.fangfeiList_radio),fangfeiList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(fangfeiList,1,this.fangfeiList_radio),fangfeiList[1].getChildByName("text"));

        var wanfaList = [];
        wanfaList.push(_play.getChildByName("nulltuo"));
        wanfaList.push(_play.getChildByName("tuoduituo_4"));
        wanfaList.push(_play.getChildByName("tuoduituo_3"));
        wanfaList.push(_play.getChildByName("tuoduituo_2"));
        this.wanfaList_radio = createRadioBoxForCheckBoxs(wanfaList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(wanfaList,0,this.wanfaList_radio),wanfaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,1,this.wanfaList_radio),wanfaList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,2,this.wanfaList_radio),wanfaList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,3,this.wanfaList_radio),wanfaList[3].getChildByName("text"));

        var renshuList = [];
        renshuList.push(_play.getChildByName("twopeople"));
        renshuList.push(_play.getChildByName("threepeople"));
		this.initPlayNumNode(renshuList, [2, 3]);
        this.renshuList_radio = createRadioBoxForCheckBoxs(renshuList,this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(renshuList,0,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,1,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[1].getChildByName("text"));

        this.initMaiPaiNode(_play);
        this.initZhuangNode(_play);

        this.maxPlayerToStartCheckBox = _play.getChildByName("maxPlayerToStart");
        this.maxPlayerToStartCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.maxPlayerToStartCheckBox.getChildByName("text"));
        this.maxPlayerToStartCheckBox.addEventListener(this._clickCB, this.maxPlayerToStartCheckBox);

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

        // this.schedule(function(sender,type)
        // {
        //     this.updateSelectDiaNum();
        // },0.1);
    },

    initZhuangNode:function(_play){
         if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
             //庄选项
            var zhuangList = [];
            var zhuangItemCount = 2;
            for(var i = 0; i < zhuangItemCount; i++){
                zhuangList.push(_play.getChildByName("zhuang_"+i));
                if(i == zhuangItemCount - 1){
                     this.zhuangList_radio = createRadioBoxForCheckBoxs(zhuangList, this.radioBoxSelectCB, 0);
                     cc.each(zhuangList,function(node,index){
                        cc.eventManager.addListener(this.setTextClick(zhuangList, index, this.zhuangList_radio), node.getChildByName("text"));
                        return true;
                     },this);
                }
            }
            this.zhuangList = zhuangList;
         }
    },

    initMaiPaiNode: function(_play){
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
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var _round = this.bg_node.getChildByName("round");
        var list = [];

        // var _fangfei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_fangfei, 0);
        // this.fangfeiList_radio.selectItem(_fangfei);
        // list.push(_round.getChildByName("payWay_1"));
        // list.push(_round.getChildByName("payWay_2"));
        // this.radioBoxSelectCB(_fangfei,list[_fangfei],list);

        var _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_wanfa, 0);
        this.wanfaList_radio.selectItem(_wanfa);
        list = [];
        list.push(_play.getChildByName("nulltuo"));
        list.push(_play.getChildByName("tuoduituo_4"));
        list.push(_play.getChildByName("tuoduituo_3"));
        list.push(_play.getChildByName("tuoduituo_2"));
        this.radioBoxSelectCB(_wanfa,list[_wanfa],list);

        var _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_renshu,1);
        this.renshuList_radio.selectItem(_renshu);
        list = [];
        list.push(_play.getChildByName("twopeople"));
        list.push(_play.getChildByName("threepeople"));
        this.radioBoxSelectCB(_renshu,list[_renshu],list);

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            //埋牌
            var maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_maiPaiType, 0);
            var _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xxGaoHuZi_isMaiPai, false);

            if(!_maipaiCheckBox) maiPaiType = 0;
            if(_maipaiCheckBox && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            var _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xxGaoHuZi_isMaiPai, true);
            this.maipaiCheckBox.setSelected(_maipaiCheckBox);
            var txt = this.maipaiCheckBox.getChildByName("text");
            if(_maipaiCheckBox){
                txt.setTextColor(this._selectColor);
            }else{
                txt.setTextColor(this._unSelectColor);
            }
        }

        //庄
        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            var zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_zhuang, 1);
            this.zhuangList_radio.selectItem(zhuang);
            this.radioBoxSelectCB(zhuang,this.zhuangList[zhuang],this.zhuangList);
        }
        
        var _maxPlayerToStartCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xxGaoHuZi_maxPlayerToStart, false);
        this.maxPlayerToStartCheckBox.setSelected(_maxPlayerToStartCheckBox);
        var txt = this.maxPlayerToStartCheckBox.getChildByName("text");
        if(_maxPlayerToStartCheckBox){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

       

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (atClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_trust, 0);
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        if(this.faPaiList_radio){
            var _faPai;
            if (atClub){
                _faPai = this.getNumberItem("faPai", 0);
            }else{
                _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xxGaoHuZi_fapai, 0);
            }

            this.faPaiList_radio.selectItem(_faPai);
            list = [];
            list.push(_play.getChildByName("faPai0")); 
            list.push(_play.getChildByName("faPai1"));
            list.push(_play.getChildByName("faPai2"));
            this.radioBoxSelectCB(_faPai,list[_faPai],list);
        } 

        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.checkMaxPlayerSelect()})));
    },
    getSelectedPara:function()
    {
        var para = {};

        para.gameType      = MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI;
        var maiPaiType, isMaiPai, zuoZhuang;
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            maiPaiType = this.maiPaiList_radio.getSelectIndex();
            isMaiPai = maiPaiType > 0;
            para.maiPaiType = maiPaiType;
        }else{
            isMaiPai       = this.maipaiCheckBox.isSelected();
        }
        var isFullPerson   = this.maxPlayerToStartCheckBox.isSelected();
        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        para.maxPlayer  = [2,3][maxPlayerIndex];
        para.tuototuo   = this.wanfaList_radio.getSelectIndex();
       

        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType() ){
            zuoZhuang = this.zhuangList_radio.getSelectIndex();
            para.zuoZhuang = zuoZhuang;
        }

        if(maxPlayerIndex == 1){
            isMaiPai = false;
        }
        para.maipai     = isMaiPai;
        if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
            para.fullperson = isFullPerson;
        }else{
            para.fullperson = false;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (this.faPaiList_radio){
            para.faPai = this.faPaiList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_fapai, para.faPai);
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_trust, trustIndex);
        }
        
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xxGaoHuZi_isMaiPai, isMaiPai);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_maiPaiType, maiPaiType);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_zhuang, zuoZhuang);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_wanfa, para.tuototuo);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_renshu, maxPlayerIndex);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xxGaoHuZi_maxPlayerToStart, isFullPerson);
        // 大结算翻倍
        if (this.fanbei_radio) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI, para.fanBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xxGaoHuZi_FAN_BEI_SCORE, para.fanBeiScore);
        }

        return para;
    }
});