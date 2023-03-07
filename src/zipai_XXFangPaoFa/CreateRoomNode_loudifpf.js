
var CreateRoomNode_loudifpf = CreateRoomNode.extend({
    initAll:function()
    {
        this.localStorageKey.KEY_loudifpf_fangfei     = "_loudifpf_fangfei";     // 房费
        this.localStorageKey.KEY_loudifpf_fengdin     = "_loudifpf_fengdin";     // 封顶
        this.localStorageKey.KEY_loudifpf_wanfa       = "_loudifpf_wanfa";       // 玩法
        this.localStorageKey.KEY_loudifpf_jiepao      = "_loudifpf_jiepao";      // 接炮
        this.localStorageKey.KEY_loudifpf_renshu      = "_loudifpf_renshu";      // 人数
        this.localStorageKey.KEY_loudifpf_qiepai      = "_loudifpf_qiepai";      // 切牌
        this.localStorageKey.KEY_loudifpf_isMaiPai    = "_loudifpf_isMaiPai";    //是否埋牌
        this.localStorageKey.KEY_loudifpf_maxPlayerToStart = "_loudifpf_maxPlayerToStart";  // 是否满人直接开始
        this.localStorageKey.KEY_loudifpf_piaoHu      = "_loudifpf_piaoHu"; // 是否飘胡
        this.localStorageKey.KEY_loudifpf_FAN_BEI        = "loudifpf_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_loudifpf_FAN_BEI_SCORE  = "loudifpf_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_loudifpf_zhuang        = "_loudifpf_zhuang";    // 首局庄
        this.localStorageKey.KEY_loudifpf_trust         = "loudifpf_trust";                //托管

        this.roundNumObj = {roundNum1:100, roundNum2:100, roundNum3:100};

        this.bg_node = ccs.load("bg_loudifpf.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_loudifpf");
        this.bg_node = this.bg_node.getChildByName("view");
    },

    checkMaxPlayerRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkMaxPlayerSelect();
    },

    checkMaxPlayerSelect: function(){
        var _maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        if(_maxPlayerIndex == 0){
            this.maipaiCheckBox.visible = true;
        }else{
            this.maipaiCheckBox.visible = false;
        }
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(237,101,1));
                    }else{
                        txt.setTextColor(cc.color(158,118,78));
                    }
                    break;
            }
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
                selectColor = cc.color(237,101,1);
                unSelectColor = cc.color(158,118,78);
            }
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
        txt.setTextColor(cc.color(237,101,1));
    
        // var fangfeiList = [];
        // fangfeiList.push(_round.getChildByName("payWay_1"));
        // fangfeiList.push(_round.getChildByName("payWay_2"));
        // this.fangfeiList_radio = createRadioBoxForCheckBoxs(fangfeiList,this.radioBoxSelectCB,0);
        // cc.eventManager.addListener(this.setTextClick(fangfeiList,0,this.fangfeiList_radio),fangfeiList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(fangfeiList,1,this.fangfeiList_radio),fangfeiList[1].getChildByName("text"));

        var fengdinList = [];
        fengdinList.push(_play.getChildByName("fengdin200"));
        fengdinList.push(_play.getChildByName("fengdin400"));
        this.fengdinList_radio = createRadioBoxForCheckBoxs(fengdinList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(fengdinList,0,this.fengdinList_radio),fengdinList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdinList,1,this.fengdinList_radio),fengdinList[1].getChildByName("text"));

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

        var jiepaoList = [];
        jiepaoList.push(_play.getChildByName("unlimit_jiepao"));
        jiepaoList.push(_play.getChildByName("limit_jiepao"));
        this.jiepaoList_radio = createRadioBoxForCheckBoxs(jiepaoList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(jiepaoList,0,this.jiepaoList_radio),jiepaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(jiepaoList,1,this.jiepaoList_radio),jiepaoList[1].getChildByName("text"));

        var renshuList = [];
        renshuList.push(_play.getChildByName("twopeople"));
        renshuList.push(_play.getChildByName("threepeople"));
		this.initPlayNumNode(renshuList, [2, 3]);
        this.renshuList_radio = createRadioBoxForCheckBoxs(renshuList,this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(renshuList,0,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,1,this.renshuList_radio,this.checkMaxPlayerSelect.bind(this)),renshuList[1].getChildByName("text"));

        this.maipaiCheckBox = _play.getChildByName("maipai");
        this.maipaiCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.maipaiCheckBox.getChildByName("text"));
        this.maipaiCheckBox.addEventListener(this._clickCB, this.maipaiCheckBox);

        this.maxPlayerToStartCheckBox = _play.getChildByName("maxPlayerToStart");
        this.maxPlayerToStartCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.maxPlayerToStartCheckBox.getChildByName("text"));
        this.maxPlayerToStartCheckBox.addEventListener(this._clickCB, this.maxPlayerToStartCheckBox);

        this.piaoHuCheckBox = _play.getChildByName("piaoHu");
        this.piaoHuCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.piaoHuCheckBox.getChildByName("text"));
        this.piaoHuCheckBox.addEventListener(this._clickCB, this.piaoHuCheckBox);
        cc.log("== is piao hu" + this.piaoHuCheckBox.isSelected());

        this.initZhuangNode(_play);

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

        this.schedule(function(sender,type) //记得加上cena
        {
            this.updateSelectDiaNum();
        },0.1);
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

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var _round = this.bg_node.getChildByName("round");
        var list = [];
        index = 0;

        // var _fangfei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_fangfei, 0);
        // this.fangfeiList_radio.selectItem(_fangfei);
        // list.push(_round.getChildByName("payWay_1"));
        // list.push(_round.getChildByName("payWay_2"));
        // this.radioBoxSelectCB(_fangfei,list[_fangfei],list);

        var _fengdin;
        if(atClub){
            _fengdin = [1,0].indexOf(this.getNumberItem("isfending", 1));
        }else{
            _fengdin = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_fengdin,0);
        }
        this.fengdinList_radio.selectItem(_fengdin);
        list = [];
        list.push(_play.getChildByName("fengdin200"));
        list.push(_play.getChildByName("fengdin400"));
        this.radioBoxSelectCB(_fengdin,list[_fengdin],list);

        var _wanfa;
        if(atClub){
            _wanfa = [0,1,2,3].indexOf(this.getNumberItem("tuototuo", 0));
        }else{
            _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_wanfa, 0);
        }
        this.wanfaList_radio.selectItem(_wanfa);
        list = [];
        list.push(_play.getChildByName("nulltuo"));
        list.push(_play.getChildByName("tuoduituo_4"));
        list.push(_play.getChildByName("tuoduituo_3"));
        list.push(_play.getChildByName("tuoduituo_2"));
        this.radioBoxSelectCB(_wanfa,list[_wanfa],list);

        var _jiepao;
        if(atClub){
            _isjiepao = this.getBoolItem("isjiepao", false);
            _jiepao = _isjiepao ? 1 : 0;
        }else{
            _jiepao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_jiepao,0);
        }
        this.jiepaoList_radio.selectItem(_jiepao);
        list = [];
        list.push(_play.getChildByName("unlimit_jiepao"));
        list.push(_play.getChildByName("limit_jiepao"));
        this.radioBoxSelectCB(_jiepao,list[_jiepao],list);

        var zhuang;
        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            if(atClub){
                zhuang = this.getNumberItem("zuoZhuang", 1);
            }else{
                zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_zhuang,1);
            }
            this.zhuangList_radio.selectItem(zhuang);
            this.radioBoxSelectCB(zhuang,this.zhuangList[zhuang],this.zhuangList);
        }

        var _renshu;
        if(atClub){
            _renshu = [2, 3].indexOf(this.getNumberItem("maxPlayer", 3));
        }else{
            _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_renshu,1);
        }
        this.renshuList_radio.selectItem(_renshu);
        list = [];
        list.push(_play.getChildByName("twopeople"));
        list.push(_play.getChildByName("threepeople"));
        this.radioBoxSelectCB(_renshu,list[_renshu],list);

        var _maipaiCheckBox;
        if(atClub){
            _maipaiCheckBox = this.getBoolItem("maipai", true);
        }else{
            _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_loudifpf_isMaiPai, true);
        }
        this.maipaiCheckBox.setSelected(_maipaiCheckBox);
        var txt = this.maipaiCheckBox.getChildByName("text");
        if(_maipaiCheckBox){
            txt.setTextColor(cc.color(237,101,1));
        }else{
            txt.setTextColor(cc.color(158,118,78));
        }

        var _maxPlayerToStartCheckBox;
        if(atClub){
            _maxPlayerToStartCheckBox = this.getBoolItem("fullperson", false);
        }else{
            _maxPlayerToStartCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_loudifpf_maxPlayerToStart, false);
        }
        this.maxPlayerToStartCheckBox.setSelected(_maxPlayerToStartCheckBox);
        var txt = this.maxPlayerToStartCheckBox.getChildByName("text");
        if(_maxPlayerToStartCheckBox){
            txt.setTextColor(cc.color(237,101,1));
        }else{
            txt.setTextColor(cc.color(158,118,78));
        }

        var _piaoHuCheckBox;
        if(atClub){
            _piaoHuCheckBox = this.getBoolItem("piaohu", false);
        }else{
            _piaoHuCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_loudifpf_piaoHu, false);
        }
        cc.log("is select piaohu" + _piaoHuCheckBox);
        this.piaoHuCheckBox.setSelected(_piaoHuCheckBox);
        var txt = this.piaoHuCheckBox.getChildByName("text");
        if(_piaoHuCheckBox){
            txt.setTextColor(cc.color(237,101,1));
        }else{
            txt.setTextColor(cc.color(158,118,78));
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (atClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_loudifpf_trust, 0);
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

        this.checkMaxPlayerSelect();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA;
        para.gametype = 1;
        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        para.maxPlayer = [2,3][maxPlayerIndex];
        var fengdinIndex = this.fengdinList_radio.getSelectIndex();
        para.isfending = [1,0][fengdinIndex];
        var tuototuoIndex   = this.wanfaList_radio.getSelectIndex();
        para.tuototuo = tuototuoIndex;
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        para.isjiepao = [0,1][isjiepaoIndex];
        var isMaiPai       = this.maipaiCheckBox.isSelected();
        para.maipai       = isMaiPai;

        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType() ){
            var zuoZhuang = this.zhuangList_radio.getSelectIndex();
            para.zuoZhuang = zuoZhuang;
        }

        if(maxPlayerIndex == 1){
            para.maipai = false;
        }
        para.fullperson = this.maxPlayerToStartCheckBox.isSelected();
        para.piaohu = this.piaoHuCheckBox.isSelected();

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
        }

        return para;
    },
    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        var fengdinIndex   = this.fengdinList_radio.getSelectIndex();
        var tuototuoIndex  = this.wanfaList_radio.getSelectIndex();
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        var isMaiPai       = this.maipaiCheckBox.isSelected();
        var ismaxPlayerToStart  = this.maxPlayerToStartCheckBox.isSelected();
        var ispiaoHu  = this.piaoHuCheckBox.isSelected();
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_fengdin, fengdinIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_wanfa, tuototuoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_jiepao, isjiepaoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_renshu, maxPlayerIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_zhuang, para.zuoZhuang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_loudifpf_isMaiPai, isMaiPai);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_loudifpf_maxPlayerToStart, ismaxPlayerToStart);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_loudifpf_piaoHu, ispiaoHu);
        // 大结算翻倍
        if (this.fanbei_radio) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_FAN_BEI, para.fanBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_FAN_BEI_SCORE, para.fanBeiScore);
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_loudifpf_trust, trustIndex);
        }
    },
    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        var time = new Date().getTime();
        // todo getSelectedPara比较耗时
        var time2 = new Date().getTime();
        //cc.log("getSelectedPara消耗时间@@ " + (time2 - time));
        var gameType = this._data.gameType; // para.gameType;
        var maxPlayer = this.getSelectPlayNum(); // para.maxPlayer;
        var roundNum = this.getSelectedRoundNum();
        var payWay = this.getSelectedPayWay();
        var price = this.getPrice(gameType, maxPlayer, roundNum, payWay);

        var _btn_create_diamond = this.bg_node.getChildByName("btn_create_diamond");
        if (!_btn_create_diamond) {
            _btn_create_diamond = this.bg_node.getParent().getChildByName("btn_create_diamond");
        }
        var dia_num = _btn_create_diamond.getChildByName("dia_num");
        dia_num.ignoreContentAdaptWithSize(true);
        dia_num.setString("" + price);
        this.resetBtnCreateDiamond(_btn_create_diamond, price);
    },
    getPrice: function(gameType, maxPlayer, roundNum, payWay) {
        // cc.log("MjClient.data.gamePrice@@ " + JSON.stringify(MjClient.data.gamePrice));
        // cc.log("arguments@@ " + JSON.stringify(arguments));
        if(!MjClient.data.gamePrice[gameType][maxPlayer][roundNum]){
            return 0;
        }
        return MjClient.data.gamePrice[gameType][maxPlayer][roundNum][payWay];
    },
});