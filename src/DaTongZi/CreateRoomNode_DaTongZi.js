/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_DaTongZi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        this._costName = '黄金';
        if (!this._isFriendCard){
            this.localStorageKey.KEY_DaTongZi_ShaoYang_maxPlayer       = "_DaTongZiSY_maxPlayer";          //几人玩
            this.localStorageKey.KEY_DaTongZi_ShaoYang_deckNum    = "_DaTongZiSY_deckNum";       //牌数
            this.localStorageKey.KEY_DaTongZi_ShaoYang_maxScore      = "_DaTongZiSY_maxScore";         //最大分数
            this.localStorageKey.KEY_DaTongZi_ShaoYang_endScore      = "_DaTongZiSY_endScore";         //终局奖励
            this.localStorageKey.KEY_DaTongZi_ShaoYang_anCards        = "_DaTongZiSY_anCards";         //暗牌数
            this.localStorageKey.KEY_DaTongZi_ShaoYang_isReCall     = "_DaTongZiSY_isReCall";        //记牌器
            this.localStorageKey.KEY_DaTongZi_ShaoYang_showLeft = "_DaTongZiSY_showLeft";   //显示剩余牌
            this.localStorageKey.KEY_DaTongZi_ShaoYang_isRandom= "_DaTongZiSY_isRandom";   //随机出头
            this.localStorageKey.KEY_DaTongZi_ShaoYang_hasKingTz= "_DaTongZiSY_hasKingTz";   //王筒子
            this.localStorageKey.KEY_DaTongZi_ShaoYang_biChu= "_DaTongZiSY_biChu";   //必须出
            this.localStorageKey.KEY_DaTongZi_ShaoYang_hasWings= "_DaTongZiSY_hasWings";   //可带牌
            this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrust= "_DaTongZiSY_isTrust";   //自动托管
            this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrustWhole       = "_DaTongZiSY_isTrustWhole";      // 全局托管
            this.localStorageKey.KEY_DaTongZi_ShaoYang_isSiXi= "_DaTongZiSY_isSiXi";   //天天四喜
            this.localStorageKey.KEY_DaTongZi_ShaoYang_jieSuanDiFen= "_DaTongZiSY_jieSuanDiFen";   //积分底分
        }

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYLHQ12,  pay8:majiang.roundHYLHQ8,  pay16:majiang.roundHYLHQ16};
        // this.AAPay      = {pay4:majiang.roundHYLHQAA12,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // this.clubPay    = {pay4:majiang.roundHYLHQCL12,pay8:majiang.roundHYLHQCL8,pay16:majiang.roundHYLHQCL16};

        this.roundNumObj = {roundNum1:1, roundNum2:600, roundNum3:1000};

        this.bg_node = ccs.load("bg_DaTongZi.json").node;
        this.addChild(this.bg_node);
        this.jieSuanDiFen = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("jieSuanDiFen");
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_daTongzi.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));

        var deckNumList = [];
        deckNumList.push(_play.getChildByName("deckNum3"));
        deckNumList.push(_play.getChildByName("deckNum4"));
        deckNumList.push(_play.getChildByName("deckNum5"));
        this.deckNumList_radio = createRadioBoxForCheckBoxs(deckNumList,this.radioBoxSelectCB_daTongzi.bind(this));
        cc.eventManager.addListener(this.setTextClick(deckNumList,0,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(deckNumList,1,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(deckNumList,2,this.deckNumList_radio,this.checkSelect.bind(this)),deckNumList[2].getChildByName("text"));

        var maxScoreList = [];
        maxScoreList.push(_play.getChildByName("maxScore1"));
        maxScoreList.push(_play.getChildByName("maxScore2"));
        maxScoreList.push(_play.getChildByName("maxScore3"));
        this.maxScoreList_radio = createRadioBoxForCheckBoxs(maxScoreList,this.radioBoxSelectCB_daTongzi.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxScoreList,0,this.maxScoreList_radio,this.checkSelect.bind(this)),maxScoreList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxScoreList,1,this.maxScoreList_radio,this.checkSelect.bind(this)),maxScoreList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxScoreList,2,this.maxScoreList_radio,this.checkSelect.bind(this)),maxScoreList[2].getChildByName("text"));

        var endScoreList = [];
        endScoreList.push(_play.getChildByName("wuJL")); 
        endScoreList.push(_play.getChildByName("jl100"));
        endScoreList.push(_play.getChildByName("jl200"));
        endScoreList.push(_play.getChildByName("jl300"));
        endScoreList.push(_play.getChildByName("jl600"));
        this.endScoreList_radio = createRadioBoxForCheckBoxs(endScoreList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(endScoreList,0,this.endScoreList_radio),endScoreList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(endScoreList,1,this.endScoreList_radio),endScoreList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(endScoreList,2,this.endScoreList_radio),endScoreList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(endScoreList,3,this.endScoreList_radio),endScoreList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(endScoreList,4,this.endScoreList_radio),endScoreList[4].getChildByName("text"));

        this.anCards = _play.getChildByName("anCards");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.anCards.getChildByName("text"));
        this.anCards.addEventListener(this._clickCB.bind(this), this.anCards);

        this.isReCall = _play.getChildByName("jiPaiQi");
        cc.eventManager.addListener(this.setTextClick(),this.isReCall.getChildByName("text"));
        this.isReCall.addEventListener(this._clickCB.bind(this), this.isReCall);

        this.showLeft = _play.getChildByName("shengYuPai");
        this.showLeft.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.showLeft.getChildByName("text"));
        this.showLeft.addEventListener(this._clickCB.bind(this), this.showLeft);

        this.isRandom = _play.getChildByName("isRandom");
        cc.eventManager.addListener(this.setTextClick(),this.isRandom.getChildByName("text"));
        this.isRandom.addEventListener(this._clickCB.bind(this), this.isRandom);

        this.hasKingTz = _play.getChildByName("hasKingTz");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hasKingTz.getChildByName("text"));
        this.hasKingTz.addEventListener(this._clickCB.bind(this), this.hasKingTz);

        this.biChu = _play.getChildByName("biChu");
        this.biChu.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.biChu.getChildByName("text"));
        this.biChu.addEventListener(this._clickCB.bind(this), this.biChu);

        this.hasWings = _play.getChildByName("hasWings");
        this.hasWings.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.hasWings.getChildByName("text"));
        this.hasWings.addEventListener(this._clickCB.bind(this), this.hasWings);

        this.trust = _play.getChildByName("trust");
        this.trust.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.trust.getChildByName("text"));
        this.trust.addEventListener(this._clickCB.bind(this), this.trust);

        this.trustWhole = _play.getChildByName("trustWhole");
        this.trustWhole.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.trustWhole.getChildByName("text"));
        this.trustWhole.addEventListener(this._clickCB.bind(this), this.trustWhole);

        var btnTrustTip = this.trustWhole.getChildByName("btnTrustTip");
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

        // this.schedule(function(sender,type)
        // {
        //     var index = this.maxPlayerList_radio.getSelectIndex();
        //     if (MjClient.MaxPlayerNum_leiyang != 4 - index)
        //     {
        //         MjClient.MaxPlayerNum_leiyang = 4 - index;
        //         this.changeAAPayForPlayerNum();
        //     }
        //     //this.qianggangquanbao.setVisible(this.qiangganghu.isSelected());
        // },0.1);

        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }

        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex -= 1;
                if(fenIndex < 0){
                    fenIndex = diFenArr.length-1;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex += 1;
                if(fenIndex >= diFenArr.length){
                    fenIndex = 0;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
        }
    },

    _clickCB : function(sender,type){
        cc.log(sender == this.anCards);
        if(sender.name == "anCards" || sender.name == "hasKingTz" || sender.name == "biChu" || sender.name == "trust"){
            this.checkSelect();
        }
        this._super(sender,type);
    },

    radioBoxSelectCB_daTongzi : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;
        var _maxPlayer;
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:2}[this.getNumberItem("maxPlayer", 4)];
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _deckNum;
        if (atClub){
            _deckNum = {3:0, 4:1}[this.getNumberItem("deckNum", 3)];
            if(this.getBoolItem("isSiXi", false)){
                _deckNum = 2; //天天四喜
            }

        }else{
            _deckNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_deckNum, 0);
        }
        _deckNum = _deckNum > 2 ? 0 : _deckNum;
        this.deckNumList_radio.selectItem(_deckNum);
        list = [];
        list.push(_play.getChildByName("deckNum3"));
        list.push(_play.getChildByName("deckNum4"));
        list.push(_play.getChildByName("deckNum5"));
        this.radioBoxSelectCB(_deckNum,list[_deckNum],list);

        var _maxScore;
        if (atClub){
            _maxScore = {600:0, 1000:1, 1:2}[this.getNumberItem("scoreLine", 600)];
        }else{
            _maxScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_maxScore, 0);
        }
        this.maxScoreList_radio.selectItem(_maxScore);
        list = [];
        list.push(_play.getChildByName("maxScore1"));
        list.push(_play.getChildByName("maxScore2"));
        list.push(_play.getChildByName("maxScore3"));
        this.radioBoxSelectCB(_maxScore,list[_maxScore],list);

        var _endScore;
        if (atClub){
            _endScore = {0:0, 100:1, 200:2, 300:3, 500:4}[this.getNumberItem("lastRoundScore", 0)];
        }else{
            _endScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_endScore, 0);
        }
        this.endScoreList_radio.selectItem(_endScore);
        list = [];
        list.push(_play.getChildByName("wuJL")); 
        list.push(_play.getChildByName("jl100"));
        list.push(_play.getChildByName("jl200"));
        list.push(_play.getChildByName("jl300"));
        list.push(_play.getChildByName("jl600"));
        this.radioBoxSelectCB(_endScore,list[_endScore],list);

        var _anCards;
        if (atClub){
            _anCards = this.getBoolItem("isAnCards", true);
        }else{
            _anCards = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_anCards, true);
        }
        this.anCards.setSelected(_anCards);
        var txt = this.anCards.getChildByName("text");
        if(_anCards){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isReCall;
        if (atClub){
            _isReCall = this.getBoolItem("isReCall", false);
        }else{
            _isReCall = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isReCall, false);
        }
        this.isReCall.setSelected(_isReCall);
        var txt = this.isReCall.getChildByName("text");
        if(_isReCall){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _showLeft;
        if (atClub){
            _showLeft = this.getBoolItem("isShowLeft", true);
        }else{
            _showLeft = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_showLeft, true);
        }
        this.showLeft.setSelected(_showLeft);
        var txt = this.showLeft.getChildByName("text");
        if(_showLeft){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isRandom;
        if (atClub){
            _isRandom = this.getBoolItem("isRandom", true);
        }else{
            _isRandom = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isRandom, true);
        }
        this.isRandom.setSelected(_isRandom);
        var txt = this.isRandom.getChildByName("text");
        if(_isRandom){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hasKingTz;
        if (atClub){
            _hasKingTz = this.getBoolItem("haveKingTz", false);
        }else{
            _hasKingTz = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_hasKingTz, false);
        }
        this.hasKingTz.setSelected(_hasKingTz);
        var txt = this.hasKingTz.getChildByName("text");
        if(_hasKingTz){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }
    

        var _hasWings;
        if (atClub){
            _hasWings = this.getBoolItem("hasWings", false);
        }else{
            _hasWings= util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_hasWings, false);
        }
        this.hasWings.setSelected(_hasWings);
        var txt = this.hasWings.getChildByName("text");
        if(_hasWings){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }



        var _biChu;
        if (atClub){
            _biChu = this.getBoolItem("isBiChu", false);
        }else{
            _biChu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_biChu, false);
        }
        this.biChu.setSelected(_biChu);
        var txt = this.biChu.getChildByName("text");
        if(_biChu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var isTrust;
        if (atClub){
            isTrust = this.getBoolItem("isTrust", false);
        }else{
            isTrust = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrust, false);
        }
        this.trust.setSelected(isTrust);
        var txt = this.trust.getChildByName("text");
        if(isTrust){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var isTrustWhole;
        if (atClub){
            isTrustWhole = this.getBoolItem("isTrustWhole", false);
        }else{
            isTrustWhole = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrustWhole, false);
        }
        this.trustWhole.setSelected(isTrustWhole);
        var txt = this.trustWhole.getChildByName("text");
        if(isTrustWhole){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (atClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }

        this.checkSelect();

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
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

    checkSelect : function(){

        cc.log("checkSelect...");

        //合法性检查 
        //4人：暗8张底牌 记牌器  
        //3人3副牌：暗9张底牌 显示剩余牌 随机出头 王筒子
        //3人4副牌: 暗52张底牌 显示剩余牌 随机出头
        //2人3副牌：暗66张底牌 显示剩余牌 随机出头 王筒子 有牌必打
        //2人4副牌：暗96张底牌 显示剩余牌 随机出头 有牌必打
        var maxPlayer= [4,3,2][this.maxPlayerList_radio.getSelectIndex()];
        var deckNum = [3,4,4][this.deckNumList_radio.getSelectIndex()];
        var haveKingTz = this.hasKingTz.isSelected();
        var isSiXi = false;
        if(this.deckNumList_radio.getSelectIndex() == 2){
            isSiXi = true;
        }
        
        // this.anCards.setEnabled(false);
        var anCardsTxt = this.anCards.getChildByName("text");
        anCardsTxt.ignoreContentAdaptWithSize(true);
        //
        var _hasWings;
        if (this._isFriendCard){
            _hasWings = this.getStringItem("hasWings");
        }else{
            _hasWings= util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_hasWings);
        }
        if(_hasWings == null || _hasWings == ""){
            cc.log();
            if(deckNum == 3){
                this.setBoxStatus(this.hasWings, undefined, true);
            }else{
                this.setBoxStatus(this.hasWings, undefined, true);
            }  
            
        }else{
            this.setBoxStatus(this.hasWings, undefined, true); 
            
        }

        this.setBoxStatus(this.anCards, undefined, true);
        if(maxPlayer == 4){
            anCardsTxt.setString("暗8张底牌");
            this.setBoxStatus(this.isReCall, undefined, true);
            this.setBoxStatus(this.showLeft, undefined, true);

            this.setBoxStatus(this.isRandom, false, false);
            this.setBoxStatus(this.hasKingTz, false, false);
            this.setBoxStatus(this.biChu, false, false);
            // this.setBoxStatus(this.trust, false, false);
            
            // 额外增加的，所以需要移动一下位置
            this.showLeft.setPosition(-252.29, -350.43);
            if(isSiXi){
                this.setBoxStatus(this.anCards, false, false);
                this.showLeft.setPosition(-252.29, -295.16);
            }
            // this.anCards.setEnabled(true);
        }else if(maxPlayer== 3){

            this.anCards.setSelected(true);
            anCardsTxt.setTextColor(cc.color(211,38,14));
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
                anCardsTxt.setTextColor(CREATEROOM_COLOR_WANGWANG_SELECT);
            }
            // this.setBoxStatus(this.trust, undefined, true);
            // this.trust.x = this.biChu.x;
           
            if(deckNum == 3){
                if(haveKingTz){
                    anCardsTxt.setString("暗15张底牌");
                }else{
                    anCardsTxt.setString("暗9张底牌");
                }
                
                this.setBoxStatus(this.isReCall, false, false);
                this.setBoxStatus(this.showLeft, undefined, true);
                this.setBoxStatus(this.isRandom, undefined, true);
                this.setBoxStatus(this.hasKingTz, undefined, true);
                this.setBoxStatus(this.biChu, false, false);
            }else if(deckNum == 4){
                anCardsTxt.setString("暗52张底牌");
                if(isSiXi){
                    anCardsTxt.setString("暗44张底牌");
                }
                this.setBoxStatus(this.isReCall, false, false);
                this.setBoxStatus(this.showLeft, undefined, true);
                this.setBoxStatus(this.isRandom, undefined, true);
                this.setBoxStatus(this.hasKingTz, false, false);
                this.setBoxStatus(this.biChu, false, false);
            }
            this.showLeft.setPosition(210.46, -295.16);
        }else if(maxPlayer == 2){
            this.anCards.setSelected(true);
            anCardsTxt.setTextColor(cc.color(211,38,14));
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
                anCardsTxt.setTextColor(CREATEROOM_COLOR_WANGWANG_SELECT);
            }

            if(deckNum == 3){
                if(haveKingTz){
                    anCardsTxt.setString("暗72张底牌");
                }else{
                    anCardsTxt.setString("暗66张底牌");
                }
                
                this.setBoxStatus(this.isReCall, false, false);
                this.setBoxStatus(this.showLeft, undefined, true);
                this.setBoxStatus(this.isRandom, undefined, true);
                this.setBoxStatus(this.hasKingTz, undefined, true);
                this.setBoxStatus(this.biChu, undefined, true);
            }else if(deckNum == 4){
                anCardsTxt.setString("暗96张底牌");
                if(isSiXi){
                    anCardsTxt.setString("暗88张底牌");
                }
                this.setBoxStatus(this.isReCall, false, false);
                this.setBoxStatus(this.showLeft, undefined, true);
                this.setBoxStatus(this.isRandom, undefined, true);
                this.setBoxStatus(this.hasKingTz, false, false);
                this.setBoxStatus(this.biChu, undefined, true);
            }
            this.showLeft.setPosition(210.46, -295.16);

            // this.trust.x = 164.20;
            // if(this.biChu.isSelected()){
            //     this.setBoxStatus(this.trust, undefined, true);
            // }else{
            //     this.setBoxStatus(this.trust, undefined, false);
            // }
        }
        if(this.trust.isSelected()){
            this.setBoxStatus(this.trustWhole, undefined, true);
        }else{
            this.setBoxStatus(this.trustWhole, undefined, false);
        }

        this.setDiaNumData_daTongZi();
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var scoreIndex = this.maxScoreList_radio.getSelectIndex();
        var lastIndex = parseInt(this.endScoreList_radio.getSelectIndex());

        var para = {};
        para.gameType = MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.scoreLine = [600,1000,1][scoreIndex];
        para.deckNum = [3,4,4][this.deckNumList_radio.getSelectIndex()];
        para.lastRoundScore = [0,100,200,300,500][lastIndex];
        para.isAnCards = this.anCards.isSelected();
        para.isReCall = this.isReCall.isSelected(); 
        para.isShowLeft = this.showLeft.isSelected();
        para.isRandom = this.isRandom.isSelected();
        para.haveKingTz = this.hasKingTz.isSelected();
        para.isBiChu = this.biChu.isSelected();
        para.hasWings = this.hasWings.isSelected();
        para.isTrust = this.trust.isSelected();
        para.isTrustWhole = this.trustWhole.isSelected();

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        // if(para.maxPlayer == 4){
        //     para.isTrust = false;
        // }

        para.isSiXi = false;
        if(this.deckNumList_radio.getSelectIndex() == 2){
            para.isSiXi = true;
        }

        // if(para.maxPlayer == 4){
        //     para.isShowLeft = true;
        //     para.isRandom = false;
        //     para.haveKingTz = false;
        //     para.biChu = false;
        // }else if(para.maxPlayer == 3){
        //     if(para.deckNum == 3){
        //         para.isReCall = false;
        //         para.biChu = true;
        //     }else if(para.deckNum == 4){
        //         para.isReCall = false;
        //         para.haveKingTz = false;
        //         para.biChu = true;
        //     }
        // }else if(para.maxPlayer == 2){
        //     if(para.deckNum == 3){
        //         para.isReCall = false;
        //     }else if(para.deckNum == 4){
        //         para.isReCall = false;
        //         para.haveKingTz = false;
        //     }
        // }

        // cc.log("createara: " + JSON.stringify(para));

        

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
            var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
            var scoreIndex = this.maxScoreList_radio.getSelectIndex();
            var lastIndex = parseInt(this.endScoreList_radio.getSelectIndex());

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_deckNum, this.deckNumList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_maxScore, scoreIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_endScore, lastIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_anCards, para.isAnCards);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isReCall, para.isReCall);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_showLeft, para.isShowLeft);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isRandom, para.isRandom);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_hasKingTz, para.haveKingTz);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_biChu, para.isBiChu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_hasWings, para.hasWings);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrust, para.isTrust);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isTrustWhole, para.isTrustWhole);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_isSiXi, para.isSiXi);
            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DaTongZi_ShaoYang_jieSuanDiFen, para.jieSuanDiFen);
            }
        }
    },

    getSelectedRoundNum:function() //重写父类获取局数的方法
    {
        var scoreIndex = this.maxScoreList_radio.getSelectIndex();
        return  [600,1000,1][scoreIndex];
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
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_daTongZi();
    },

    setDiaNumData : function(gameNode) {
        this._super(gameNode);
        this.setDiaNumData_daTongZi();
    },

    setDiaNumData_daTongZi : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var play = this.bg_node.getChildByName("play");
        var text600 = play.getChildByName("maxScore1").getChildByName("text_0");
        var text1000 = play.getChildByName("maxScore2").getChildByName("text_0");
        var text1 = play.getChildByName("maxScore3").getChildByName("text_0");
        text600.ignoreContentAdaptWithSize(true);
        text1000.ignoreContentAdaptWithSize(true);
        text600.setString("(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum2, payWay) + this._costName + ")");
        text1000.setString("(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum3, payWay) + this._costName + ")");
        text1.setString("(" + this.getPrice(gameType, maxPlayer, this.roundNumObj.roundNum1, payWay) + this._costName + ")");

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