
var CreateRoomNode_SYloudifpf = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    initAll:function()
    {
        this.localStorageKey.KEY_SYloudifpf_fangfei          = "_SYloudifpf_fangfei";          // 房费datuo_score
        this.localStorageKey.KEY_SYloudifpf_fengdin          = "_SYloudifpf_fengdin";          // 封顶
        this.localStorageKey.KEY_SYloudifpf_wanfa            = "_SYloudifpf_wanfa";            // 打坨方式
        this.localStorageKey.KEY_SYloudifpf_datuo_score      = "_SYloudifpf_datuo_score";      // 打鸟的分数
        this.localStorageKey.KEY_SYloudifpf_jiepao           = "_SYloudifpf_jiepao";           // 接炮
        this.localStorageKey.KEY_SYloudifpf_minHuType        = "_SYloudifpf_minHuType";        //起胡的方式
        this.localStorageKey.KEY_SYloudifpf_renshu           = "_SYloudifpf_renshu";           // 人数
        this.localStorageKey.KEY_SYloudifpf_qiepai           = "_SYloudifpf_qiepai";           // 切牌
        this.localStorageKey.KEY_SYloudifpf_maxPlayerToStart = "_SYloudifpf_maxPlayerToStart"; // 是否满人直接开始
        this.localStorageKey.KEY_SYloudifpf_maiPai           = "_SYloudifpf_maiPai";           //埋牌
        this.localStorageKey.KEY_SYloudifpf_maiPaiType       = "_SYloudifpf_maiPaiType";       //埋牌方式
        this.localStorageKey.KEY_SYloudifpf_siShou           = "_SYloudifpf_siShou";           //死守
        this.localStorageKey.KEY_SYloudifpf_fanBei           = "_SYloudifpf_fanBei";           //翻倍
        this.localStorageKey.KEY_SYloudifpf_zuoZhuang        = "_SYloudifpf_zuoZhuang";        //坐庄
        this.localStorageKey.KEY_SYloudifpf_piaoHu           = "_SYloudifpf_piaoHu";           // 是否飘胡
        this.localStorageKey.KEY_SYloudifpf_trust            = "_SYloudifpf_trust";            //托管
        this.localStorageKey.KEY_SYloudifpf_fapai            = "_SYloudifpf_fapai";            //发牌速度
     
        this.localStorageKey.KEY_SYloudifpf_FAN_BEI          = "_SYloudifpf_TY_FAN_BEI";       //大结算翻倍
        this.localStorageKey.KEY_SYloudifpf_FAN_BEI_SCORE    = "_syloudifpf_FAN_BEI_SCORE";    //少于X分大结算翻倍
        this.localStorageKey.KEY_SYloudifpf_jieSuanDiFen     = "_SYloudifpf_JIE_SUAN_DI_FEN";  //积分底分
        this.localStorageKey.KEY_SYloudifpf_tuoMult          = "_SYloudifpf_TUO_MULT";         //打坨倍数
        this.localStorageKey.KEY_SYloudifpf_trustWhole       = "_SYloudifpf_TRUST_WHOLE";      // 全局托管

        //this.roundNumObj = {roundNum1:100, roundNum2:1};
        this._datuo_score = 20;

        this.bg_node = ccs.load("bg_loudifpf.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_loudifpf").getChildByName("view");
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        /*
        var _round = this.bg_node.getChildByName("round");
        var txt = _round.getChildByName("round_0").getChildByName("text");
        txt.setTextColor(MjClient.createRoomNode._selectColor);
        */
    
        var fengdinList = [];
        fengdinList.push(_play.getChildByName("fengdin200"));
        fengdinList.push(_play.getChildByName("fengdin400"));
        this.fengdinList_radio = createRadioBoxForCheckBoxs(fengdinList, this.radioBoxSelectCB, 0);
        cc.eventManager.addListener(this.setTextClick(fengdinList,0,this.fengdinList_radio),fengdinList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdinList,1,this.fengdinList_radio),fengdinList[1].getChildByName("text"));

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){//邵阳埋牌单独成行
             //埋牌选项
            var maiPaiList = [];
            var maiPaiItemCount = 3;
            for(var i = 0; i < maiPaiItemCount; i++){
                maiPaiList.push(_play.getChildByName("maipai_"+i));
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
            this.maiPai = _play.getChildByName("maiPai");
            this.maiPai.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(),this.maiPai.getChildByName("text"));
            this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);
        }
       
        var faPaiList = [];
        faPaiList.push(_play.getChildByName("puTong"));
        faPaiList.push(_play.getChildByName("changShuang"));
        faPaiList.push(_play.getChildByName("jiSu"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB, 0);
        cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));

        var wanfaList = [];
        wanfaList.push(_play.getChildByName("nulltuo"));
        wanfaList.push(_play.getChildByName("datuo"));
        wanfaList.push(_play.getChildByName("datuo_score"));
        this.wanfaList_radio = createRadioBoxForCheckBoxs(wanfaList,this.radioBoxSelectCB_SYloudi.bind(this));
        cc.eventManager.addListener(this.setTextClick(wanfaList,0,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,1,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanfaList,2,this.wanfaList_radio,this.checkSelectiveTuo.bind(this)),wanfaList[2].getChildByName("text"));

        var tuoList = [];
        tuoList.push(_play.getChildByName("tuoMult4"));
        tuoList.push(_play.getChildByName("tuoMult3"));
        tuoList.push(_play.getChildByName("tuoMult2"));
        this.tuoList_radio = createRadioBoxForCheckBoxs(tuoList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(tuoList,0,this.tuoList_radio,this.checkSelectiveTuo.bind(this)),tuoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tuoList,1,this.tuoList_radio,this.checkSelectiveTuo.bind(this)),tuoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tuoList,2,this.tuoList_radio,this.checkSelectiveTuo.bind(this)),tuoList[2].getChildByName("text"));       

        var jiepaoList = [];
        jiepaoList.push(_play.getChildByName("unlimit_jiepao"));
        jiepaoList.push(_play.getChildByName("limit_jiepao"));
        this.jiepaoList_radio = createRadioBoxForCheckBoxs(jiepaoList,this.radioBoxSelectCB,1);
        cc.eventManager.addListener(this.setTextClick(jiepaoList,0,this.jiepaoList_radio),jiepaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(jiepaoList,1,this.jiepaoList_radio),jiepaoList[1].getChildByName("text"));

        var minHuTypeList = [];
        minHuTypeList.push(_play.getChildByName("minHu_15"));
        minHuTypeList.push(_play.getChildByName("minHu_10"));
        this.minHuTypeList_radio = createRadioBoxForCheckBoxs(minHuTypeList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(minHuTypeList,0,this.minHuTypeList_radio),minHuTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(minHuTypeList,1,this.minHuTypeList_radio),minHuTypeList[1].getChildByName("text"));

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

        this.maxPlayerToStartCheckBox = _play.getChildByName("fullPersonToStart");
        this.maxPlayerToStartCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.maxPlayerToStartCheckBox.getChildByName("text"));
        this.maxPlayerToStartCheckBox.addEventListener(this._clickCB, this.maxPlayerToStartCheckBox);

        this.keSiShou = _play.getChildByName("keSiShou");
        this.keSiShou.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.keSiShou.getChildByName("text"));
        this.keSiShou.addEventListener(this._clickCB.bind(this), this.keSiShou);

        this.piaoHuCheckBox = _play.getChildByName("piaohu");
        this.piaoHuCheckBox.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.piaoHuCheckBox.getChildByName("text"));
        this.piaoHuCheckBox.addEventListener(this._clickCB, this.piaoHuCheckBox);

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        // 首局坐庄

        var zuoZhuangType = [];
        zuoZhuangType.push(_play.getChildByName("zuoZhuang_type_0")); 
        zuoZhuangType.push(_play.getChildByName("zuoZhuang_type_1")); 
        this.zuoZhuangType_radio = createRadioBoxForCheckBoxs(zuoZhuangType,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zuoZhuangType,0,this.zuoZhuangType_radio),zuoZhuangType[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoZhuangType,1,this.zuoZhuangType_radio),zuoZhuangType[1].getChildByName("text"));

        //托管
        var trustList = [];
        trustList.push(_play.getChildByName("trust0"));
        trustList.push(_play.getChildByName("trust1"));
        trustList.push(_play.getChildByName("trust2"));
        trustList.push(_play.getChildByName("trust3"));
        trustList.push(_play.getChildByName("trust4"));
        var tuoGuanCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            if(index == 0){
                this.play_trustWhole.visible = false;
            }else{
                this.play_trustWhole.visible = true;
            }
        }.bind(this);
        this.trustList_radio = createRadioBoxForCheckBoxs(trustList,tuoGuanCallBack);
        var tuoGuanTextCallBack = function(index, sender){
            if(index == 0){
                this.play_trustWhole.visible = false;
            }else{
                this.play_trustWhole.visible = true;
            }                
        }.bind(this);
        this.addListenerText(trustList, this.trustList_radio, tuoGuanTextCallBack);
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

        //整场托管
        this.play_trustWhole = _play.getChildByName("tuoguan_quanju");
        this.addListenerText(this.play_trustWhole);
        this.play_trustWhole.addEventListener(this.clickCB, this.play_trustWhole);

        //翻倍
        // this._playNode_fanbeiType_0 = _play.getChildByName("fanbei0");
        // this._playNode_fanbeiType_1 = _play.getChildByName("fanbei1");
        // this._playNode_fanbeiType_2 = _play.getChildByName("fanbei2");
        // this._playNode_fanbeiType_3 = _play.getChildByName("fanbei3");
        // this._playNode_fanbeiType_4 = _play.getChildByName("fanbei4");
        // this._playNode_fanbeiType_5 = _play.getChildByName("fanbei5");
        // var fanbeiNodeList = [];
        // fanbeiNodeList.push(_play.getChildByName("fanbei0"));
        // fanbeiNodeList.push(_play.getChildByName("fanbei1"));
        // fanbeiNodeList.push(_play.getChildByName("fanbei2"));
        // fanbeiNodeList.push(_play.getChildByName("fanbei3"));
        // fanbeiNodeList.push(_play.getChildByName("fanbei4"));
        // fanbeiNodeList.push(_play.getChildByName("fanbei5"));
        // this._playNode_player_fanbei_radio = createRadioBoxForCheckBoxs(fanbeiNodeList, this.radioBoxSelectCB);
        // this.addListenerText(fanbeiNodeList, this._playNode_player_fanbei_radio);
        // this.fanbeiNodeList = fanbeiNodeList;

        // var btn_fanbeiTip = _play.getChildByName("btn_fanbeiTip");
        // var image_fanbeiTip = _play.getChildByName("image_fanbeiTip");
        // btn_fanbeiTip.addTouchEventListener(function(sender, type) {
        //     if (type == 2) {
        //         image_fanbeiTip.setVisible(true);
        //     }
        // }, btn_fanbeiTip);
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: false,
        //     status: null,
        //     onTouchBegan: function(touch, event) {
        //         if (image_fanbeiTip.isVisible()) {
        //             image_fanbeiTip.setVisible(false);
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     },
        // }, image_fanbeiTip);

         // 大结算翻倍
        if (_play.getChildByName("fanBei0")) { 
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("fanBei0"));
            nodeListFanBei.push(_play.getChildByName("fanBei1"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB.bind(this));
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
                        this.curScore = 200;
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
                    if (this.curScore > 200) {
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

        //俱乐部比赛场翻倍提示
        var btnFanBeiTip = _play.getChildByName("btnFanBeiTip");
        btnFanBeiTip.setVisible(this._isMatchMode);
        var fanBeiTip = _play.getChildByName("fanBeiTip");
        fanBeiTip.setVisible(false);
        btnFanBeiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                fanBeiTip.setVisible(true);
                trustTip.setVisible(false);
            }
        }, btnFanBeiTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (fanBeiTip.isVisible()) {
                    fanBeiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, fanBeiTip);

        this.difenAry = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
        this.difenIndex = 0;
        var _this = this;

        if(this.bg_node.getParent().getChildByName("jieSuanDiFen")){
            this.jieSuanDiFen = this.bg_node.getParent().getChildByName("jieSuanDiFen");
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

        this.scheduleOnce(function(sender,type)
        {
            this.updateSelectDiaNum();
            this.freepeopleAndaaPay();

        },0.1);
    },

     fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = this._selectColor;
            var unSelectColor = this._unSelectColor;
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
        if (this._isRoomCardMode) //亲友圈房卡模式 使用动态创建节点
            return;
        
        this.freepeopleNode.visible = !this.payWayNodeArray[1].isSelected();
        this.payWayNodeArray[1].visible = !this.freepeopleNode.isSelected();
        this.maxPlayerToStartCheckBox.visible = !this.freepeopleNode.isSelected();
    },

    radioBoxSelectCB_SYloudi: function(index, sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelectiveTuo();
    },

    checkSelectiveTuo: function(){
        var _play = this.bg_node.getChildByName("play");

        if(this.wanfaList_radio.getSelectIndex() != 1){
            _play.getChildByName("tuoMult4").visible = false;
            _play.getChildByName("tuoMult3").visible = false;
            _play.getChildByName("tuoMult2").visible = false;            
        }else{
            _play.getChildByName("tuoMult4").visible = true;
            _play.getChildByName("tuoMult3").visible = true;
            _play.getChildByName("tuoMult2").visible = true;   
        }
        if(this.wanfaList_radio.getSelectIndex() != 2){
            _play.getChildByName("btn_sub").visible = false;
            _play.getChildByName("score_bg").visible = false;
            _play.getChildByName("btn_add").visible = false;
        }else{
            this._datuo_score = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_datuo_score, 20);
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
                    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_datuo_score, this._datuo_score);
                }
            }, this);
            btn_add.addTouchEventListener(function(sender, type){
                if(type == 2 && this._datuo_score < 100){
                    this._datuo_score += 10;
                    score.setString(this._datuo_score + "分");
                    util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_datuo_score, this._datuo_score);
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
        //每次选中到自由人玩时，需要改变埋牌的文本
        var curMaxPlayerSelect = this.renshuList_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
             cc.each(this.maiPaiList,function(node, key){
                if(curMaxPlayerSelect == 1 || curMaxPlayerSelect == 2){
                    cc.eventManager.pauseTarget(node,true);
                    for(var index in node.children){
                        node.children[index].setTextColor(cc.color("#a8a5a5"));
                        node.setSelected(false);
                    }
                }else{
                    cc.eventManager.resumeTarget(node,true);
                    this.maiPaiList_radio.selectItem(this.currMaiPaiType);
                    this.radioBoxSelectCB(this.currMaiPaiType,this.maiPaiList[this.currMaiPaiType],this.maiPaiList);
                }
           
            },this);
        }else{
            if (curMaxPlayerSelect == 3){
                this.maiPai.getChildByName("text").setString("2人埋牌20张");
            }else{
                this.maiPai.getChildByName("text").setString("埋牌20张");
            } 

            if(curMaxPlayerSelect == 1 || curMaxPlayerSelect == 2){
                this.maiPai.visible = false;
            }else{
                this.maiPai.visible = true;
            }
        }
       
        //四人坐醒和自由人数屏蔽托管
        // if(curMaxPlayerSelect == 2 || curMaxPlayerSelect == 3){
        //     this.updateTrustVisible(false);           
        // }else{
        //     this.updateTrustVisible(true);
        // }
    },

    updateTrustVisible: function(visibleStatus){
        var _play = this.bg_node.getChildByName("play");
        _play.getChildByName("trust0").visible = visibleStatus;
        _play.getChildByName("trust1").visible = visibleStatus;
        _play.getChildByName("trust2").visible = visibleStatus;
        _play.getChildByName("trust3").visible = visibleStatus;
        _play.getChildByName("btnTrustTip").visible = visibleStatus;
        this.bg_node.getChildByName("title").getChildByName("trust").visible = visibleStatus;
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;

        var _play = this.bg_node.getChildByName("play");
        //var _round = this.bg_node.getChildByName("round");
        var list = [];
        index = 0;

        //新增发牌速度
        var _fapai;
        if(atClub) {
            _fapai = [0, 1, 2].indexOf(this.getNumberItem("faPai", 0));
        }else {
            _fapai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_fapai, 0);
        }
        this.faPaiList_radio.selectItem(_fapai);
        list = [];
        list.push(_play.getChildByName("puTong"));
        list.push(_play.getChildByName("changShuang"));
        list.push(_play.getChildByName("jiSu"));
        this.radioBoxSelectCB(_fapai,list[_fapai],list);

        var _fengdin;
        if(atClub){
            _fengdin = [1,0].indexOf(this.getNumberItem("isfending", 1));
        }else{
            _fengdin = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_fengdin,0);
        }
        this.fengdinList_radio.selectItem(_fengdin);
        list = [];
        list.push(_play.getChildByName("fengdin200"));
        list.push(_play.getChildByName("fengdin400"));
        this.radioBoxSelectCB(_fengdin,list[_fengdin],list);

        var _wanfa;
        if(atClub){
            _wanfa = [0,2,1].indexOf(this.getNumberItem("tuototuo", 0));
        }else{
            _wanfa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_wanfa, 0);
        }
        this.wanfaList_radio.selectItem(_wanfa);
        list = [];
        list.push(_play.getChildByName("nulltuo"));
        list.push(_play.getChildByName("datuo"));
        list.push(_play.getChildByName("datuo_score"));
        this.radioBoxSelectCB(_wanfa,list[_wanfa],list);

        var _tuoMult;
        if(atClub){
            _tuoMult = this.getNumberItem("tuoMult", 4);
        }else{
            _tuoMult = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_tuoMult, 4);
        }
        var tuoMultIndex = [4,3,2].indexOf(_tuoMult);
        this.tuoList_radio.selectItem(tuoMultIndex);
        list = [];
        list.push(_play.getChildByName("tuoMult4"));
        list.push(_play.getChildByName("tuoMult3"));
        list.push(_play.getChildByName("tuoMult2"));
        this.radioBoxSelectCB(tuoMultIndex,list[tuoMultIndex],list);

        var _jiepao;
        if(atClub){
            _isjiepao = this.getBoolItem("isjiepao", true);
            _jiepao = _isjiepao ? 1 : 0;
        }else{
            _jiepao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_jiepao,1);
        }
        this.jiepaoList_radio.selectItem(_jiepao);
        list = [];
        list.push(_play.getChildByName("unlimit_jiepao"));
        list.push(_play.getChildByName("limit_jiepao"));
        this.radioBoxSelectCB(_jiepao,list[_jiepao],list);

        var _minHuType;
        if(atClub){
            _minHuType = this.getNumberItem("minHuType", 0);
        }else{
            _minHuType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_minHuType, 0);
        }
        this.minHuTypeList_radio.selectItem(_minHuType);
        list = [];
        list.push(_play.getChildByName("minHu_15"));
        list.push(_play.getChildByName("minHu_10"));
        this.radioBoxSelectCB(_minHuType,list[_minHuType],list);

        var _renshu;
        if(atClub){
            _renshu = [2, 3, 4].indexOf(this.getNumberItem("maxPlayer", 3));
            if(this.getBoolItem("convertible", false)){
                _renshu = 3;
            }
        }else{
            _renshu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_renshu,1);
        }
        this.renshuList_radio.selectItem(_renshu);
        list = [];
        list.push(_play.getChildByName("twopeople"));
        list.push(_play.getChildByName("threepeople"));
        list.push(_play.getChildByName("fourpeople_xing"));
        list.push(_play.getChildByName("freepeople"));
        this.radioBoxSelectCB(_renshu,list[_renshu],list);

        var _maxPlayerToStartCheckBox;
        if(atClub){
            _maxPlayerToStartCheckBox = this.getBoolItem("fullperson", false);
        }else{
            _maxPlayerToStartCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYloudifpf_maxPlayerToStart, false);
        }
        this.maxPlayerToStartCheckBox.setSelected(_maxPlayerToStartCheckBox);
        var txt = this.maxPlayerToStartCheckBox.getChildByName("text");
        if(_maxPlayerToStartCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maiPai; 
        if(atClub)
            _maiPai = this.getBoolItem("isMaiPai", false);
        else
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYloudifpf_maiPai, false);

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var maiPaiType;
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 0);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_maiPaiType, 0);
            
            if(!_maiPai) maiPaiType = 0;
            if(_maiPai && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            this.maiPai.setSelected(_maiPai);
            var txt = this.maiPai.getChildByName("text");
            if(_maiPai){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }

       

        // var txt = this.maiPai.getChildByName("text");
        // if(_maiPai){
        //     txt.setTextColor(cc.color(211,38,14));
        // }else{
        //     txt.setTextColor(cc.color(68,51,51));
        // }

        var _keSiShou; 
        if(atClub)
            _keSiShou = this.getBoolItem("keSiShou", false);
        else
            _keSiShou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYloudifpf_siShou, false);
        this.keSiShou.setSelected(_keSiShou);
        var txt = this.keSiShou.getChildByName("text");
        if(_keSiShou){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _piaoHuCheckBox;
        if(atClub){
            _piaoHuCheckBox = this.getBoolItem("piaohu", false);
        }else{
            _piaoHuCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYloudifpf_piaoHu, false);
        }
        this.piaoHuCheckBox.setSelected(_piaoHuCheckBox);
        var txt = this.piaoHuCheckBox.getChildByName("text");
        if(_piaoHuCheckBox){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        // 首局坐庄
        var _zuoZhuang;
        if (atClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 1);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_zuoZhuang, 1);
        }

        this.zuoZhuangType_radio.selectItem(_zuoZhuang);
        list = [];
        list.push(_play.getChildByName("zuoZhuang_type_0")); 
        list.push(_play.getChildByName("zuoZhuang_type_1"));
        this.radioBoxSelectCB(_zuoZhuang,list[_zuoZhuang],list);

        //托管
        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300:4}[this.getNumberItem("trustTime", -1)];
        }else{
            var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        list.push(_play.getChildByName("trust4"));
        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        //整场托管
        var isTrustWhole;
        if(atClub){
            isTrustWhole = this.getBoolItem("isTrustWhole", false);
        }else{
            isTrustWhole = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYloudifpf_trustWhole, false);
        }
        this.play_trustWhole.setSelected(isTrustWhole);
        if(isTrustWhole){
            this.play_trustWhole.getChildByName("text").setTextColor(selectColor);
        }else{
            this.play_trustWhole.getChildByName("text").setTextColor(unSelectColor);
        }   
        this.play_trustWhole.visible = _trustIndex != 0;

        //翻倍
        // var _fanBei;
        // if (atClub)
        //     _fanBei = this.getNumberItem("fanBei", 0);
        // else
        //     _fanBei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_fanBei, 0);
        // this._playNode_fanbeiType_0.setSelected(false);
        // this._playNode_fanbeiType_1.setSelected(false);
        // this._playNode_fanbeiType_2.setSelected(false);
        // this._playNode_fanbeiType_3.setSelected(false);
        // this._playNode_fanbeiType_4.setSelected(false);
        // this._playNode_fanbeiType_5.setSelected(false);

        // if (_fanBei == 0) {
        //     this._playNode_fanbeiType_0.setSelected(true);
        // } else if (_fanBei == 1) {
        //     this._playNode_fanbeiType_1.setSelected(true);
        // } else if (_fanBei == 2) {
        //     this._playNode_fanbeiType_2.setSelected(true);
        // } else if (_fanBei == 3) {
        //     this._playNode_fanbeiType_3.setSelected(true);
        // } else if (_fanBei == 4) {
        //     this._playNode_fanbeiType_4.setSelected(true);
        // } else if (_fanBei == 5) {
        //     this._playNode_fanbeiType_5.setSelected(true);
        // }
        // this.radioBoxSelectCB(_fanBei, this.fanbeiNodeList[_fanBei], this.fanbeiNodeList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (atClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 50);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_FAN_BEI_SCORE, 50);
            }
            // 旧版本俱乐部适配
            if(fanBeiOption <= 5){ 
                this.curScore = [50, 50, 100, 150, 200, 5][fanBeiOption];
            }else{
                this.curScore = fanBeiScore; // 记录值
            }
            // 设置为翻倍
            if(fanBeiOption > 1) fanBeiOption = 1;

            this.fanbei_radio.selectItem(fanBeiOption)
            
            if(this.curScore == 5){
                this.nodeListFanBei[1].getChildByName("score").setString("不限分");
            }else{
                this.nodeListFanBei[1].getChildByName("score").setString(this.curScore + "分");
            }

            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (atClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYloudifpf_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }


        this.checkSelectiveTuo();
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.checkSelectivePersonNum()})));
    },

    setPriceTextColor:function() {
        for (var i=0; i<this.roundNodeArray.length; i++) {
            var isSelect = this.roundNodeArray[i].isSelected();
            var txtPrice = this.roundNodeArray[i].getChildByName('text_0');
            txtPrice.setTextColor(isSelect ? this._selectColor : this._unSelectColor);
        }
    },

    selectPay: function(roundNumObj,str_type, str_pay) {
        for (var i=0; i<this.roundNodeArray.length; i++)
        {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) )
            {
                if(! roundNumObj[i] || !str_pay || (str_pay[i] && str_pay[i]<0)) {
                    roundNode.visible = false;

                    cc.log('warn 局数按钮隐藏 selectPay no roundNumObj', roundNumObj, i, str_pay)
                    continue;
                }

                var text = roundNode.getChildByName("text");
                var text_0 = roundNode.getChildByName("text_0");
                if (text_0) {
                    if (roundNumObj[i] == 100) {
                        text.setString("不限局数，满百结算");
                        text_0.setString("(" + str_pay[i] + this._costName + ")");
                    }
                    else {
                        text.setString(roundNumObj[i] + "局");
                        text_0.setString("(" + str_pay[i] + this._costName + ")");
                    }
                    if(this._isRoomCardMode){
                        text_0.visible = false;
                    }
                    text_0.visible = false; //不显示价格
                }
            }
        }
    },

    setDiaNumData: function(gameNode) {
        this._super(gameNode);
        //设置价格颜色
        this.setPriceTextColor();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gametype = 2;
        para.gameType = MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA;
        para.zuoXing = false;
        para.convertible = false;//是否自由人数
        para.normalFangPaoFa = true;

        var maxPlayerIndex = this.renshuList_radio.getSelectIndex();
        para.maxPlayer = [2,3,4,4][maxPlayerIndex];
        para.faPai = this.faPaiList_radio.getSelectIndex();
        var fengdinIndex = this.fengdinList_radio.getSelectIndex();
        para.isfending = [1,0][fengdinIndex];
        var tuototuoIndex   = this.wanfaList_radio.getSelectIndex();
        para.tuototuo = [0,2,1][tuototuoIndex];
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        para.minHuType  = this.minHuTypeList_radio.getSelectIndex();
        para.isjiepao = [0,1][isjiepaoIndex];
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.fenshutuo = this._datuo_score;
        para.fullperson = this.maxPlayerToStartCheckBox.isSelected();
        para.tuoMult = [4,3,2][this.tuoList_radio.getSelectIndex()];
        para.isTrustWhole = this.play_trustWhole.isSelected();//全局托管

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            para.maiPaiType = this.maiPaiList_radio.getSelectIndex();
            para.isMaiPai = para.maiPaiType > 0;
        }else{
            para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        }
       
        para.keSiShou = this.keSiShou.isSelected(); //是否可以死守
        para.piaohu = this.piaoHuCheckBox.isSelected();

        var curMaxPlayerSelect = this.renshuList_radio.getSelectIndex();
        if(curMaxPlayerSelect == 1 || curMaxPlayerSelect == 2){
            para.isMaiPai = false;
        }

        para.zuoZhuang = parseInt(this.zuoZhuangType_radio.getSelectIndex());

        if(maxPlayerIndex == 2){
            para.zuoXing = true;
        }else if (maxPlayerIndex == 3) {
            para.zuoXing = true;
            para.convertible = true;
            para.fullperson = false;
        }

        para.trustTime = [-1, 60, 120, 180, 300][this.trustList_radio.getSelectIndex()];
        // if(para.zuoXing) {
        //     //坐醒不支持托管
        //     para.trustTime = -1;
        // }

        if (this.fanbei_radio) {
            para.fanBeiScore = this.curScore;//parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            if(this.fanbei_radio.getSelectIndex() == 0){
                para.fanBei = 0;
            }else{
                para.fanBei = para.fanBeiScore;//;
            }
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        // if (this._playNode_fanbeiType_0.isSelected()) {
        //     para.fanBei = 0;
        // } else if (this._playNode_fanbeiType_1.isSelected()) {
        //     para.fanBei = 1;
        // } else if (this._playNode_fanbeiType_2.isSelected()) {
        //     para.fanBei = 2;
        // } else if (this._playNode_fanbeiType_3.isSelected()) {
        //     para.fanBei = 3;
        // } else if (this._playNode_fanbeiType_4.isSelected()) {
        //     para.fanBei = 4;
        // } else if (this._playNode_fanbeiType_5.isSelected()) {
        //     para.fanBei = 5;
        // }

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
        var faPaiIndex = this.faPaiList_radio.getSelectIndex();
        var fengdinIndex   = this.fengdinList_radio.getSelectIndex();
        var tuototuoIndex  = this.wanfaList_radio.getSelectIndex();
        var isjiepaoIndex  = this.jiepaoList_radio.getSelectIndex();
        var minHuTypeIndex = this.minHuTypeList_radio.getSelectIndex();
        var trustIndex     = this.trustList_radio.getSelectIndex();
        var isFullPersonToStart  = this.maxPlayerToStartCheckBox.isSelected();
        var ispiaoHu       = this.piaoHuCheckBox.isSelected();
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_fapai, faPaiIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_fengdin, fengdinIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_wanfa, tuototuoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_jiepao, isjiepaoIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_minHuType, minHuTypeIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_renshu, maxPlayerIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_qiepai, para.isManualCutCard ? 1 : 0);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYloudifpf_maxPlayerToStart, isFullPersonToStart);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYloudifpf_maiPai, para.isMaiPai);
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType())
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_maiPaiType, para.maiPaiType);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYloudifpf_siShou, para.keSiShou);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYloudifpf_piaoHu, ispiaoHu);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_trust, trustIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_fanBei, para.fanBei);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_zuoZhuang, para.zuoZhuang);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_tuoMult, para.tuoMult);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYloudifpf_trustWhole,para.isTrustWhole);
        // 大结算翻倍
        if (this.fanbei_radio) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_FAN_BEI, para.fanBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_FAN_BEI_SCORE, para.fanBeiScore);
        }

        //积分底分
        if(this.jieSuanDiFen){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYloudifpf_jieSuanDiFen, para.jieSuanDiFen);
        }
    },
});