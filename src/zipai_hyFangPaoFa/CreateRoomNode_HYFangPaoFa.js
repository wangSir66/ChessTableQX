
var CreateRoomNode_HYFangPaoFa = CreateRoomNode.extend({
    initAll:function()
    {
        this.localStorageKey.KEY_hyFangPaoFa_fangfei       = "_hyFangPaoFa_fangfei";        // 房费datuo_score
        this.localStorageKey.KEY_hyFangPaoFa_fengdin       = "_hyFangPaoFa_fengdin";        // 封顶
        this.localStorageKey.KEY_hyFangPaoFa_wanfa         = "_hyFangPaoFa_wanfa";          // 玩法
        this.localStorageKey.KEY_hyFangPaoFa_datuo_score   = "_hyFangPaoFa_datuo_score";    // 打鸟的分数
        this.localStorageKey.KEY_hyFangPaoFa_jiepao        = "_hyFangPaoFa_jiepao";         // 接炮
        this.localStorageKey.KEY_hyFangPaoFa_renshu        = "_hyFangPaoFa_renshu";         // 人数
        this.localStorageKey.KEY_hyFangPaoFa_qiepai        = "_hyFangPaoFa_qiepai";         // 切牌
        this.localStorageKey.KEY_hyFangPaoFa_maiPaiNum     = "_hyFangPaoFa_maiPaiNum";      // 埋牌数
        this.localStorageKey.KEY_hyFangPaoFa_FAN_BEI       = "_hyFangPaoFa_TY_FAN_BEI";     // 是否大结算翻倍
        this.localStorageKey.KEY_hyFangPaoFa_diFen         = "_hyFangPaoFa_diFen";          // 低分翻倍
        this.localStorageKey.KEY_hyFangPaoFa_zhuangJia     = "_hyFangPaoFa_zhuangJia";      // 庄家

        this.roundNumObj = {roundNum1:100, roundNum2:100, roundNum3:100};
        this._datuo_score = 20;

        this.bg_node = ccs.load("bg_HYFangPaoFa.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_loudifpf").getChildByName("view");
        this.bg_node.jumpToTop();
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        var _round = this.bg_node.getChildByName("round");
        var txt = _round.getChildByName("round_0").getChildByName("text");
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        txt.setTextColor(selectColor);
    
        var fengdinList = [];
        fengdinList.push(_play.getChildByName("fengdin200"));
        fengdinList.push(_play.getChildByName("fengdin400"));
        this.fengdinList_radio = createRadioBoxForCheckBoxs(fengdinList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(fengdinList,0,this.fengdinList_radio),fengdinList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdinList,1,this.fengdinList_radio),fengdinList[1].getChildByName("text"));

        var wanfaList = [];
        wanfaList.push(_play.getChildByName("nulltuo"));
        wanfaList.push(_play.getChildByName("datuo"));
        wanfaList.push(_play.getChildByName("datuo_score"));
        this.wanfaList_radio = createRadioBoxForCheckBoxs(wanfaList,this.radioBoxSelectCB_SYloudi.bind(this));
        cc.eventManager.addListener(this.setTextClick(wanfaList,0,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,1,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,2,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[2].getChildByName("text"));

        var jiepaoList = [];
        jiepaoList.push(_play.getChildByName("unlimit_jiepao"));
        jiepaoList.push(_play.getChildByName("limit_jiepao"));
        this.jiepaoList_radio = createRadioBoxForCheckBoxs(jiepaoList,this.radioBoxSelectCB,1);
        cc.eventManager.addListener(this.setTextClick(jiepaoList,0,this.jiepaoList_radio),jiepaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(jiepaoList,1,this.jiepaoList_radio),jiepaoList[1].getChildByName("text"));

        var renshuList = [];
        renshuList.push(_play.getChildByName("twopeople"));
        renshuList.push(_play.getChildByName("threepeople"));
        renshuList.push(_play.getChildByName("fourpeople_xing"));
        renshuList.push(_play.getChildByName("freepeople"));
        this.freepeopleNode = renshuList[3];
		this.initPlayNumNode(renshuList, [2, 3, 4, 4]);
        this.renshuList_radio = createRadioBoxForCheckBoxs(renshuList,this.radioBoxSelectCB_SYloudi_PersonNum.bind(this));
        cc.eventManager.addListener(this.setTextClick(renshuList,0,this.renshuList_radio,this.checkSelectivePersonNum.bind(this)),renshuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,1,this.renshuList_radio,this.checkSelectivePersonNum.bind(this)),renshuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,2,this.renshuList_radio,this.checkSelectivePersonNum.bind(this)),renshuList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(renshuList,3,this.renshuList_radio,this.checkSelectivePersonNum.bind(this)),renshuList[3].getChildByName("text"));

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("shouJuFangZhuZhuang"));
        zhuangJiaList.push(_play.getChildByName("shouJuSuiJiZhuang"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        //低分翻倍
        // var diFenList = [];
        // diFenList.push(_play.getChildByName("fanBei0"));
        // diFenList.push(_play.getChildByName("fanBei1"));
        // diFenList.push(_play.getChildByName("fanBei5"));
        // diFenList.push(_play.getChildByName("fanBei2"));
        // diFenList.push(_play.getChildByName("fanBei3"));
        // diFenList.push(_play.getChildByName("fanBei4"));
        // this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(diFenList,2,this.diFenList_radio),diFenList[2].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(diFenList,3,this.diFenList_radio),diFenList[3].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(diFenList,4,this.diFenList_radio),diFenList[4].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(diFenList,5,this.diFenList_radio),diFenList[5].getChildByName("text"));
        // 大结算翻倍
        if (_play.getChildByName("play_buFanBei")) { 
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_buFanBei"));
            nodeListFanBei.push(_play.getChildByName("play_fanBei"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");  
            this.curScore = 0;

            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {  
                    this.curScore -= 5;
                    if (this.curScore < 5) {
                        this.curScore = 100;
                    } 

                    if(this.curScore == 5){
                        scoreLabel.setString("不限分");
                    }else{
                        scoreLabel.setString(this.curScore + "分");
                    }

                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) { 

                    this.curScore += 5;
                    if (this.curScore > 100) {
                        this.curScore = 5;
                    } 
                    
                    if(this.curScore == 5){
                        scoreLabel.setString("不限分");
                    }else{
                        scoreLabel.setString(this.curScore + "分");
                    }

                }
            }, this);
        }

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        this.schedule(function(sender,type)
        {
            this.updateSelectDiaNum();
            this.freepeopleAndaaPay();
        },0.1);
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color("#d21400");
            var unSelectColor = cc.color("#255662");
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

    freepeopleAndaaPay: function(){
        this.freepeopleNode.visible = !this.payWayNodeArray[1].isSelected();
        if(!this._isRoomCardMode) //亲友圈房卡模式 使用动态创建节点
        {
            this.payWayNodeArray[1].visible = !this.freepeopleNode.isSelected();
        }
    },

    radioBoxSelectCB_SYloudi: function(index, sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelectiveTuo();
    },

    checkSelectiveTuo: function(){
        var _play = this.bg_node.getChildByName("play");

        if(this.wanfaList_radio.getSelectIndex() != 2){
            _play.getChildByName("btn_sub").visible = false;
            _play.getChildByName("score_bg").visible = false;
            _play.getChildByName("btn_add").visible = false;
        }else{
            this._datuo_score = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_datuo_score, 20);
            var btn_sub = _play.getChildByName("btn_sub");
            var score_bg = _play.getChildByName("score_bg");
            var score = score_bg.getChildByName("score");
            var btn_add = _play.getChildByName("btn_add");
            btn_sub.visible = true;
            score_bg.visible = true;
            btn_add.visible = true;

            btn_sub.addTouchEventListener(function(sender, type){
                if(type == 2 && this._datuo_score > 10){
                    this._datuo_score -= 10;
                    score.setString(this._datuo_score + "分");
                    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_datuo_score, this._datuo_score);
                }
            }, this);
            btn_add.addTouchEventListener(function(sender, type){
                if(type == 2 && this._datuo_score < 100){
                    this._datuo_score += 10;
                    score.setString(this._datuo_score + "分");
                    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_datuo_score, this._datuo_score);
                }
            }, this);

            score.setString(this._datuo_score + "分");
        }
    },

    radioBoxSelectCB_SYloudi_PersonNum: function(index, sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelectivePersonNum();
    },

    checkSelectivePersonNum: function(){
        //每次选中到2人玩时，需要提示
        var curMaxPlayerSelect = this.renshuList_radio.getSelectIndex();
        // if (curMaxPlayerSelect == 0){
        //     MjClient.showToast("2人玩法埋牌20张");
        // }
        var selectColor = CREATEROOM_COLOR_HY_SELECT;
        var unSelectColor = CREATEROOM_COLOR_HY_UNSELECT;
        var unEnableColor = cc.color(191,191,191);
        if (curMaxPlayerSelect == 0){
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

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var _round = this.bg_node.getChildByName("round");
        var list = [];
        index = 0;

        var _fengdin;
        if(atClub){
            _fengdin = [1,0].indexOf(this.getNumberItem("isfending", 1));
        }else{
            _fengdin = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_fengdin,0);
        }
        this.fengdinList_radio.selectItem(_fengdin);
        list = [];
        list.push(_play.getChildByName("fengdin200"));
        list.push(_play.getChildByName("fengdin400"));
        this.radioBoxSelectCB(_fengdin,list[_fengdin],list);

 
        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_maiPaiNum, 20);
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);


        var _wanfa;
        if(atClub){
            _wanfa = [0,2,1].indexOf(this.getNumberItem("tuototuo", 0));
        }else{
            _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_wanfa, 0);
        }
        this.wanfaList_radio.selectItem(_wanfa);
        list = [];
        list.push(_play.getChildByName("nulltuo"));
        list.push(_play.getChildByName("datuo"));
        list.push(_play.getChildByName("datuo_score"));
        this.radioBoxSelectCB(_wanfa,list[_wanfa],list);

        var _jiepao;
        if(atClub){
            _isjiepao = this.getBoolItem("isjiepao", true);
            _jiepao = _isjiepao ? 1 : 0;
        }else{
            _jiepao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_jiepao,1);
        }
        this.jiepaoList_radio.selectItem(_jiepao);
        list = [];
        list.push(_play.getChildByName("unlimit_jiepao"));
        list.push(_play.getChildByName("limit_jiepao"));
        this.radioBoxSelectCB(_jiepao,list[_jiepao],list);

        var _renshu;
        if(atClub){
            _renshu = [2, 3, 4].indexOf(this.getNumberItem("maxPlayer", 3));
            if(this.getBoolItem("convertible", false)){
                _renshu = 3;
            }
        }else{
            _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_renshu,1);
        }
        this.renshuList_radio.selectItem(_renshu);
        list = [];
        list.push(_play.getChildByName("twopeople"));
        list.push(_play.getChildByName("threepeople"));
        list.push(_play.getChildByName("fourpeople_xing"));
        list.push(_play.getChildByName("freepeople"));
        this.radioBoxSelectCB(_renshu,list[_renshu],list);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var zhuangJia;
        if (atClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_zhuangJia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);

        // var _diFen;
        // if (atClub){
        //     _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        // }else{
        //     var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_diFen, -1);
        //     _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[index];
        // }
        // this.diFenList_radio.selectItem(_diFen);
        // list = [];
        // list.push(_play.getChildByName("fanBei0"));
        // list.push(_play.getChildByName("fanBei1"));
        // list.push(_play.getChildByName("fanBei5"));
        // list.push(_play.getChildByName("fanBei2"));
        // list.push(_play.getChildByName("fanBei3"));
        // list.push(_play.getChildByName("fanBei4"));
        // this.radioBoxSelectCB(_diFen,list[_diFen],list);
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            //兼容老俱乐部
            if (atClub) {
                fanBeiScore = this.getNumberItem("diFen", -1);
                fanBeiOption = fanBeiScore == -1 ? 0 : 1;
                fanBeiScore = fanBeiScore == -1 ? util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_diFen, 10) : fanBeiScore;
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_FAN_BEI, -1);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hyFangPaoFa_diFen, -1);
                fanBeiOption = fanBeiOption == -1 && fanBeiScore != -1 ? 1 : fanBeiOption; 
            }
            fanBeiOption = fanBeiOption == -1 ? 0 : fanBeiOption;
            fanBeiScore = fanBeiScore == -1 ? 10 : fanBeiScore;

            this.fanbei_radio.selectItem(fanBeiOption);
            if(fanBeiScore == 10000){
                this.nodeListFanBei[1].getChildByName("score").setString("不限分");
                this.curScore = 5;
            }else{
                this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
                this.curScore = fanBeiScore;
            }

            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.checkSelectiveTuo();
        this.checkSelectivePersonNum(); 
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gametype = 2;
        para.gameType = MjClient.GAME_TYPE.HENG_YANG_FANG_PAO_FA;
        para.zuoXing = false;
        para.convertible = false;//是否自由人数

        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        para.maxPlayer = [2,3,4,4][maxPlayerIndex];
        var fengdinIndex = this.fengdinList_radio.getSelectIndex();
        para.isfending = [1,0][fengdinIndex];
        var tuototuoIndex   = this.wanfaList_radio.getSelectIndex();
        para.tuototuo = [0,2,1][tuototuoIndex];
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        para.isjiepao = [0,1][isjiepaoIndex];
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.fenshutuo = this._datuo_score;
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();

        if (this.fanbei_radio) {
            if(this.nodeListFanBei[1].getChildByName("score").getString() == "不限分"){
                var fanBeiScore = 10000;
            }else{
                var fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            }
            fanBeiOption = this.fanbei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        if(maxPlayerIndex == 2){
            para.zuoXing = true;
        }else if (maxPlayerIndex == 3) {
            para.zuoXing = true;
            para.convertible = true;
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
        if (this.fanbei_radio) {
            if(this.nodeListFanBei[1].getChildByName("score").getString() == "不限分"){
                var fanBeiScore = 10000;
            }else{
                var fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            }
        }
        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        var fengdinIndex = this.fengdinList_radio.getSelectIndex();
        var tuototuoIndex   = this.wanfaList_radio.getSelectIndex();
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_fengdin, fengdinIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_wanfa, tuototuoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_jiepao, isjiepaoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_renshu, maxPlayerIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_qiepai, para.isManualCutCard ? 1 : 0);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_diFen, fanBeiScore);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_maiPaiNum, para.maiPaiNum);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_zhuangJia, para.zhuangJia);

        // 大结算翻倍
        if (this.fanbei_radio) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hyFangPaoFa_FAN_BEI, fanBeiOption);
        }
    },
});