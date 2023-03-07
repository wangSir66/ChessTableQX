/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_syBoPi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        this._costName = '黄金';
        if (!this._isFriendCard){
            this.localStorageKey.KEY_BO_PI_ShaoYang_maxPlayer       = "_BoPi_maxPlayer";          //几人玩
            this.localStorageKey.KEY_BO_PI_ShaoYang_fengding      = "_BoPi_fengding";         //封顶
            this.localStorageKey.KEY_BO_PI_ShaoYang_hongHei        = "_BoPi_hongHei";         //红黑 （原红黑点）
            this.localStorageKey.KEY_BO_PI_ShaoYang_lianZhuang     = "_SyBoPi_lianZhuang";        //连庄
            this.localStorageKey.KEY_BO_PI_ShaoYang_tianDiHu     = "_SyBoPi_tianDiHu";        //天地胡
            this.localStorageKey.KEY_BO_PI_ShaoYang_jiaChui      = "_SyBoPi_jiaChui";        //加锤
            this.localStorageKey.KEY_BO_PI_ShaoYang_springDouble = "_SyBoPi_springDouble";        //春天翻倍
            this.localStorageKey.KEY_BO_PI_ShaoYang_dismissDouble = "_SyBoPi_dismissDouble";        //春天解散翻倍
            this.localStorageKey.KEY_BO_PI_ShaoYang_tiandiHuType = "_SyBoPi_tianDiHuType";   //天地胡类型
            this.localStorageKey.KEY_BO_PI_ShaoYang_qiepai       = "_SyBoPi_qiepai";   //切牌
            this.localStorageKey.KEY_BO_PI_ShaoYang_hongHeiType        = "_BoPi_hongHeiType";         //红黑类型
            this.localStorageKey.KEY_BO_PI_ShaoYang_isRandomZhuang  = "_BoPi_isRandomZhuang";         //随机庄
            this.localStorageKey.KEY_BO_PI_ShaoYang_maiPai        = "_BoPi_maiPai"; //埋牌
            this.localStorageKey.KEY_BO_PI_ShaoYang_maiPaiNum        = "_BoPi_maiPaiNum"; //埋牌数
            this.localStorageKey.KEY_BO_PI_ShaoYang_diFen         = "_BoPi_diFen";   //低分翻倍
            this.localStorageKey.KEY_BO_PI_ShaoYang_diFen_score         = "_BoPi_diFen_score";   //低分翻倍分数
            this.localStorageKey.KEY_BO_PI_ShaoYang_faPai         = "_BoPi_faPai";   //发牌速度
            this.localStorageKey.KEY_BO_PI_ShaoYang_trust         = "_BoPi_trust";   //托管
            //this.localStorageKey.KEY_BO_PI_ShaoYang_trustWhole    = "_BoPi_trustWhole";      // 全局托管
            this.localStorageKey.KEY_BO_PI_ShaoYang_trustWay    = "_BoPi_trustWay";     //托管方式
        }

        this.setExtraKey({
            jieSuanDiFen: "_BoPi_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:100, roundNum2:1}; //已经没意义了

        this.bg_node = ccs.load("bg_syBoPi.json").node;
        this._uiNode = this.bg_node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang").getChildByName("view");

        this.curMaxPlayerSelect = null;
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        this.pnlTrustWay = _play.getChildByName("pnl_trustWay");
        this.pnlRemain = _play.getChildByName("pnl_remain");
        this.pnlRemainYpos = this.pnlRemain.y;
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        maxPlayerList.push(_play.getChildByName("maxPlayer_0")); // 自由人数
		this.initPlayNumNode(maxPlayerList, [4, 3, 4, 2, 3]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_syBoPi.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,3,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,4,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[4].getChildByName("text"));

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maiPai_0")); 
        maiPaiList.push(_play.getChildByName("maiPai_1"));
        maiPaiList.push(_play.getChildByName("maiPai_2"));
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
        this.hongHeiTypeList_radio = createRadioBoxForCheckBoxs(hongHeiTypeList,this.radioBoxSelectCB_syBoPi.bind(this));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,0,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,1,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hongHeiTypeList,2,this.hongHeiTypeList_radio,this.checkSelect.bind(this)),hongHeiTypeList[2].getChildByName("text"));

        // this.hongHei = _play.getChildByName("hongHei");
        // cc.eventManager.addListener(this.setTextClick(),this.hongHei.getChildByName("text"));
        // this.hongHei.addEventListener(this._clickCB.bind(this), this.hongHei);

        this.lianZhuang = _play.getChildByName("lianZhuang");
        this.lianZhuang.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.lianZhuang.getChildByName("text"));
        this.lianZhuang.addEventListener(this._clickCB.bind(this), this.lianZhuang);

        // this.tianDiHu = _play.getChildByName("tianDiHu");
        // cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.tianDiHu.getChildByName("text"));
        // this.tianDiHu.addEventListener(this._clickCB.bind(this), this.tianDiHu);


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

        this.maiPai = _play.getChildByName("maiPai");
        this.maiPai.visible = false;
        this.maiPai.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        this.maiPai2 = _play.getChildByName("maiPai2");
        this.maiPai2.visible = false;
        this.maiPai2.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai2.getChildByName("text"));
        this.maiPai2.addEventListener(this._clickCB.bind(this), this.maiPai2);
 
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

        /*
        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }
        */

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
                this.pnlTrustWay.visible = false;
            }else{
                this.pnlTrustWay.visible = true;
            }
            this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);
        }.bind(this);
        this.trustList_radio = createRadioBoxForCheckBoxs(trustList,tuoGuanCallBack);
        var tuoGuanTextCallBack = function(index, sender){
            if(index == 0){
                this.pnlTrustWay.visible = false;
            }else{
                this.pnlTrustWay.visible = true;
            }
            this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);              
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

        //托管方式
        var trustWay = [];
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_1"));
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_2"));
        trustWay.push(this.pnlTrustWay.getChildByName("trustWay_3"));
        this.trustWay_radio = createRadioBoxForCheckBoxs(trustWay,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(trustWay,0,this.trustWay_radio),trustWay[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,1,this.trustWay_radio),trustWay[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,2,this.trustWay_radio),trustWay[2].getChildByName("text"));
        this.trustWay_node = trustWay;

        var diFenList = [];
        diFenList.push(this.pnlRemain.getChildByName("fanBei0"));
        diFenList.push(this.pnlRemain.getChildByName("fanBei1"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        this._initDiFenUI(diFenList[1]);

        //俱乐部比赛场翻倍提示
        var btnFanBeiTip = this.pnlRemain.getChildByName("btnFanBeiTip");
        btnFanBeiTip.setVisible(this._isMatchMode);
        var fanBeiTip = this.pnlRemain.getChildByName("fanBeiTip");
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

        //切牌
        var cutCardList = [];
        cutCardList.push(this.pnlRemain.getChildByName("autoCut"));
        cutCardList.push(this.pnlRemain.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        this.initExtraPlayNode(_play);
        // if(this.jieSuanDiFen){
        //     this.jieSuanDiFen.visible = false;
        // }
    },

    _initDiFenUI : function(fanBei1){
        var subButton = fanBei1.getChildByName("btn_sub");
        var addButton = fanBei1.getChildByName("btn_add");
        var scoreLabel = fanBei1.getChildByName("score");
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

    radioBoxSelectCB_syBoPi : function(index,sender, list){
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
        if(this.maxPlayerList_radio.getSelectIndex() == 4){
            payWay_2.setVisible(false);  
            // 如果选择的是自由人数，取消AA设为房主支付
            payWay_1.setSelected(true);
            payWay_2.setSelected(false);
            this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
            // this.setRoundNodeCurrentSelect();
            
        }
    },
    updateConvertible:function(sender){
        var _play = this.bg_node.getChildByName("play"); 
        var temp = _play.getChildByName("maxPlayer_0"); // 自由人数 //俱乐部房卡模式也使用到了"maxPlayer_0" 如需更改命名在createRoomNode搜索"邵阳剥皮自由人数" 
        if(sender.getName() == "payWay_2"){
            if(this.maxPlayerList_radio.getSelectIndex() == 4) // 如果选择的是自由人数，就重新选择默认内容
                this.maxPlayerList_radio.selectItem(1);
            temp.setVisible(false);   

        }else if(sender.getName() == "payWay_1"){
            temp.setVisible(true); 
        }
    }, 

    radioBoxSelectCB:function(index,sender, list){
        this._super(index,sender, list);
        if(sender.getName() == "payWay_1" || sender.getName() == "payWay_2")
            this.updateConvertible(sender);  
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

        var _maxPlayer;
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:3}[this.getNumberItem("maxPlayer", 4)];
            if( _maxPlayer == 0 && this.getNumberItem("zuoXing", false)){
                _maxPlayer = 2;
            }
            // 自由人数
            if(_maxPlayer == 1 && this.getBoolItem("convertible", false) ){
                _maxPlayer = 4;
            }

        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.curMaxPlayerSelect = _maxPlayer;

        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        list.push(_play.getChildByName("maxPlayer1"));
        list.push(_play.getChildByName("maxPlayer_0"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _faPai;
        if (atClub){
            _faPai = this.getNumberItem("faPai", 1);
        }else{
            _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_faPai, 1);
        }

        this.faPaiList_radio.selectItem(_faPai);
        list = [];
        list.push(_play.getChildByName("faPai0")); 
        list.push(_play.getChildByName("faPai1"));
        list.push(_play.getChildByName("faPai2"));
        this.radioBoxSelectCB(_faPai,list[_faPai],list);

        var _fengding;
        if (atClub){
            _fengding = {"-1":0, "150":1, "200":2, "300":3}[this.getNumberItem("fengDing", -1)+""];
        }else{
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_fengding, 0);
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
            _tiandiHuType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tiandiHuType, 0);
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
            //兼容之前的红黑点
            if(_hongHeiType == 0){
                var _hongHei = this.getBoolItem("isHongheidian", false);
                if(_maxPlayer == 0 && _hongHei){
                    //四人玩 原来勾选了【红黑点】，相当于新选项为【红黑胡】
                    _hongHeiType = 1;
                }else if(_hongHei){
                    //三人、二人、四人坐醒 原来勾选了【红黑点】，相当于新选项为【红黑点】
                    _hongHeiType = 2;
                }
            }
        }else{
            _hongHeiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_hongHeiType, 0);
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
            _lianZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_lianZhuang, true);
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

        // var _tianDiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tianDiHu, true);
        // if (atClub){
        //     _tianDiHu = this.getBoolItem("isTianDiHu", true);
        // }
        // cc.log("_tianDiHu:", _tianDiHu);
        // this.tianDiHu.setSelected(_tianDiHu);
        // var txt = this.tianDiHu.getChildByName("text");
        // if(_tianDiHu){
        //     txt.setTextColor(cc.color(211,38,14));
        // }else{
        //     txt.setTextColor(cc.color(68,51,51));
        // }

        var _jiaChui;
        if (atClub){
            _jiaChui = this.getBoolItem("isJiaChui", false);
        }else{
            _jiaChui =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_jiaChui, false);
        }
        this.jiaChui.setSelected(_jiaChui);
        var txt = this.jiaChui.getChildByName("text");
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
            _springDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_springDouble, false);
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
            _dismissDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_dismissDouble, false);
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
            _isRandom = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_isRandomZhuang, false);
        }
        this.isRandomZhuang.setSelected(_isRandom);
        var txt = this.isRandomZhuang.getChildByName("text");
        if(_isRandom){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maiPai; 
        var _maiPaiNum; 
        if(atClub){
            _maiPai = this.getBoolItem("isMaiPai", false);
            _maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maiPai, false);
            _maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maiPaiNum, 20);
        }
        _maiPaiNum = _maiPai ? _maiPaiNum : 0;
        // var maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maiPaiNum, 0);
        var maiPaiSel = [0,10,20].indexOf(_maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        cc.log(_maiPaiNum, "88888888888888888888888888888");
        // if(_maiPai) {
        //     this.maiPai.setSelected(_maiPaiNum == 20);
        //     this.maiPai2.setSelected(_maiPaiNum == 10);
        // }else{
        //     this.maiPai.setSelected(false);
        //     this.maiPai2.setSelected(false);
        // }
        // var txt = this.maiPai.getChildByName("text");
        // var txt2 = this.maiPai2.getChildByName("text");
        // if(_maiPaiNum == 20){
        //     txt.setTextColor(selectColor);
        //     txt2.setTextColor(unSelectColor);
        // } else if(_maiPaiNum == 10) {
        //     txt2.setTextColor(selectColor);
        //     txt.setTextColor(unSelectColor);
        // }else {
        //     txt.setTextColor(selectColor);
        //     txt2.setTextColor(unSelectColor);
        // }  

        var _diFen = 0;
        if (atClub){
            if(this.getNumberItem("diFen", -1) > -1){
                _diFen = 1;
                this.pnlRemain.getChildByName("fanBei1").getChildByName("score").setString(this.getNumberItem("diFen", -1) + "分");
            }
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_diFen, -1);
            if(index > -1){
                _diFen = 1;
                this.pnlRemain.getChildByName("fanBei1").getChildByName("score").setString(index + "分");
            }
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        list.push(this.pnlRemain.getChildByName("fanBei0"));
        list.push(this.pnlRemain.getChildByName("fanBei1"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var _trustIndex;
        if (atClub){
            _trustIndex = {"-1":0, 60:1, 120:2, 180:3, 300:4}[this.getNumberItem("trustTime", -1)];
        }else{
            var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_trust, 0);
        }
        this.trustList_radio.selectItem(_trustIndex);
        list = [];
        list.push(_play.getChildByName("trust0"));
        list.push(_play.getChildByName("trust1"));
        list.push(_play.getChildByName("trust2"));
        list.push(_play.getChildByName("trust3"));
        list.push(_play.getChildByName("trust4"));

        this.radioBoxSelectCB(_trustIndex,list[_trustIndex],list);

        //托管方式
        var _trustWay;
        if (atClub) {
            //兼容旧俱乐部
            _trustWay = this.getNumberItem("trustWay", -1);
            if (_trustWay == -1) {
                var isTrustWhole = this.getBoolItem("isTrustWhole", false);
                _trustWay = isTrustWhole ? 2 : 0;
            }
        } else {
            _trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_trustWay, 0);
        }
        this.trustWay_radio.selectItem(_trustWay);
        this.radioBoxSelectCB(_trustWay, this.trustWay_node[_trustWay], this.trustWay_node);

        this.pnlTrustWay.visible = _trustIndex != 0;
        this.pnlRemain.y = this.pnlRemainYpos + (_trustIndex == 0 ? this.pnlTrustWay.height : 0);   

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.setRoundNodeCurrentSelect(); //下面checkSelect函数会获取当前局数，因此必须在此之前设置

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
            var selectColor = cc.color(211,38,14);
            var unSelectColor = cc.color(68,51,51);

            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
            if(isSelected){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
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

            // // 连装被选中，春天翻倍需要被关闭
            // this.springDouble.setSelected(false); 
            // var txt = this.springDouble.getChildByName("text"); 
            // txt.setTextColor(cc.color(68,51,51)); 
            // this.checkTouchSpringDouble();
          
        }else{
            fdTitle.visible = false;
            fengDing0.visible = false;
            fengDing1.visible = false;
            fengDing2.visible = false;
            fengDing3.visible = false;
        }

        //每次选中到2人玩时，需要提示
        // var newMaxPlayerSelect = this.maxPlayerList_radio.getSelectIndex();
        // if (this.curMaxPlayerSelect != newMaxPlayerSelect){
        //     this.curMaxPlayerSelect = newMaxPlayerSelect;
        //     if (this.curMaxPlayerSelect == 3){
        //         MjClient.showToast("2人玩法埋牌20张");
        //     }
        // }convertible

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
        trustTip.visible = false; 
        trust.visible = true;
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }

        if(maxPlayerIndex == 3 || maxPlayerIndex == 4){
            //2人 或 自由人数

            // this.maiPai.visible = true;
            // this.maiPai2.visible = true;
            // var txt = this.maiPai.getChildByName("text");
            // var txt2 = this.maiPai2.getChildByName("text");
            // txt.setString("埋牌20张");
            // txt2.setString("埋牌10张");
            // if(maxPlayerIndex == 4){
            //     txt.setString("2人埋牌20张");
            //     txt2.setString("2人埋牌10张");
            // }

            // if(sender && this.maiPai == sender && this.maiPai.isSelected()) {
            //     this.maiPai2.setSelected(false);
            // } else if(sender && this.maiPai2 == sender && this.maiPai2.isSelected()) {
            //     this.maiPai.setSelected(false);
            // }
            // var txt = this.maiPai.getChildByName("text");
            // var txt2 = this.maiPai2.getChildByName("text");
            
            // if(this.maiPai.isSelected()){
            //     txt.setTextColor(selectColor);
            //     txt2.setTextColor(unSelectColor);
            // } else if(this.maiPai2.isSelected()) {
            //     txt2.setTextColor(selectColor);
            //     txt.setTextColor(unSelectColor);
            // }else {
            //     txt.setTextColor(selectColor);
            //     txt2.setTextColor(unSelectColor);
            // }

            var textArr = [""]
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                if(maxPlayerIndex == 4){
                    txt.setString(["不埋牌","2人埋牌10张","2人埋牌20张"][i]);
                }
                else
                {
                    txt.setString(["不埋牌","埋10张","埋20张"][i]);
                }
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }

        }else if(maxPlayerIndex == 2){
            //坐醒
            //trust0.visible = false;
            //trust1.visible = false
            //trust2.visible = false
            //trust3.visible = false
            //btnTrustTip.visible = false;
            //trustTip.visible = false;
            //trust.visible = false;
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setString(["不埋牌","埋10张","埋20张"][i]);
                txt.setTextColor(unEnableColor);
            }
            // this.maiPai.visible = false;
            // this.maiPai2.visible = false;
        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setString(["不埋牌","埋10张","埋20张"][i]);
                txt.setTextColor(unEnableColor);
            }
            // this.maiPai.visible = false;
            // this.maiPai2.visible = false;
        }

        //选红黑类型时 弹窗
        if(sender){
            var list = this.hongHeiTypeList_radio._nodeList;
            var msg = null;
            if(list[1] == sender){
                //红黑胡
                msg = "红胡：13张或以上，+10胡息\n黑胡：+10胡息\n四人玩法（非坐醒）时红胡为8张或以上";
            }else if(list[2] == sender){
                //红黑点
                msg = "一点朱：胡息翻倍\n小红胡：10-12张红，胡息翻倍\n大红胡：13张或以上红，60胡\n黑　胡：60胡\n四人玩法（非坐醒）时小红胡为8张或以上";
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
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var fdIndex = parseInt(this.fengDingList_radio.getSelectIndex());

        var para = {};
        para.gameType = MjClient.GAME_TYPE.SHAO_YANG_BO_PI;
        para.maxPlayer = [4,3,4,2,3][maxPlayerIndex];
        para.convertible = (maxPlayerIndex == 4); // 自由人数
        para.fengDing = [-1,150,200,300][fdIndex];
        para.isHongheidian = false; //兼容之前的
        para.isLianZhuang = this.lianZhuang.isSelected();
        // para.isTianDiHu = this.tianDiHu.isSelected(); // 新字段扩展天地胡
        para.isJiaChui = this.jiaChui.isSelected();
        para.isSpringDouble = this.springDouble.isSelected(); 
        para.isDismissDouble = this.dismissDouble.isSelected() && para.isSpringDouble; //春天解散翻倍
        para.tianDiHuType = parseInt(this.tianDiHuTypeList_radio.getSelectIndex()); 
        para.zuoXing = false;
        if(maxPlayerIndex == 2){
            para.zuoXing = true;
        }
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        //红黑类型：0-无  1-红黑胡 2-红黑点
        para.hongHeiType = parseInt(this.hongHeiTypeList_radio.getSelectIndex()); 
        para.isRandomZhuang = this.isRandomZhuang.isSelected();
        // para.isMaiPai = this.maiPai.isSelected() || this.maiPai2.isSelected(); //埋牌
        // if(para.maxPlayer != 2 && !para.convertible){
        //     para.isMaiPai = false;
        // }
        // if(para.isMaiPai) {
        //     para.maiPaiNum = this.maiPai.isSelected() ? 20 : 10;
        // }else {
        //     para.maiPaiNum = 0;
        // }
        
        para.maiPaiNum = (para.maxPlayer == 2 || para.convertible) ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum>0 ? true:false;

        para.diFen = [-1,5][this.diFenList_radio.getSelectIndex()];
        if(para.diFen > -1){
            para.diFen = parseInt(this.diFenList_radio.getSelectItem().getChildByName("score").getString());
        }

        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.trustList_radio.getSelectIndex()];
        para.trustWay = para.trustTime == -1 ? 0 : this.trustWay_radio.getSelectIndex();
        para.isTrustWhole = para.trustWay != 0;
        /*if(para.zuoXing) {
            //坐醒不支持托管
            para.trustTime = -1;
        }*/

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));

        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maxPlayer, maxPlayerIndex);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_hongHei, para.isHongheidian);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_lianZhuang, para.isLianZhuang);
        // // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tianDiHu, para.isTianDiHu);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_fengding, fdIndex);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_jiaChui, para.isJiaChui); 
        // // 春天翻倍
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_springDouble, para.isSpringDouble); 
        // // 天地胡Type
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tiandiHuType, para.tianDiHuType);

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
            var fdIndex = parseInt(this.fengDingList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_hongHei, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_lianZhuang, para.isLianZhuang);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tianDiHu, para.isTianDiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_fengding, fdIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_jiaChui, para.isJiaChui);
            // 春天翻倍
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_springDouble, para.isSpringDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_dismissDouble, para.isDismissDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_isRandomZhuang, para.isRandomZhuang);
            // 天地胡Type
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_tiandiHuType, para.tianDiHuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_qiepai, para.isManualCutCard ? 1 : 0);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_hongHeiType, para.hongHeiType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BO_PI_ShaoYang_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_trust, this.trustList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BO_PI_ShaoYang_trustWay, para.trustWay);
        }

    },

    getSelectedRoundNum:function() //重写父类获取局数的方法
    {   
        var round = this._super();
        if (round == 1) {
            return 1; //1局
        }
        //选了100局走下面原逻辑
        var flg = this.lianZhuang.isSelected();
        if(flg){
            var roundNum = [100,100,100,100][parseInt(this.fengDingList_radio.getSelectIndex())];
            return  roundNum;
        }else{
            return 100; //不封顶默认100局
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
                        text.setString("100胡");
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
        this.setDiaNumData_BoPi();
    },

    setDiaNumData : function(gameNode) {
        this._super(gameNode);
        this.setDiaNumData_BoPi();
    },

    setDiaNumData_BoPi : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();
        var roundNum = this.getSelectedRoundNum();

        var round = this.bg_node.getChildByName("round");
        var text600 = round.getChildByName("payWay_1").getChildByName("text");
        var text1000 = round.getChildByName("payWay_2").getChildByName("text");
        text600.ignoreContentAdaptWithSize(true);
        text1000.ignoreContentAdaptWithSize(true);
        text600.setString("房主出(" + this.getPrice(gameType, maxPlayer, roundNum, 0) + this._costName + ")");
        text1000.setString("AA(" + this.getPrice(gameType, maxPlayer, roundNum, 1) + this._costName + ")");

        var price = this.getPrice(gameType, maxPlayer, roundNum, payWay);
        var _btn_create_diamond = this.bg_node.getChildByName("btn_create_diamond");
        if(!_btn_create_diamond){
            _btn_create_diamond = this.bg_node.getParent().getChildByName("btn_create_diamond");
        }
        var dia_num = _btn_create_diamond.getChildByName("dia_num");
        dia_num.ignoreContentAdaptWithSize(true);
        dia_num.setString("" + price);
        this.resetBtnCreateDiamond(_btn_create_diamond, price);

        //选了1局则无连庄和封顶
        if (roundNum == 1) {
            this.lianZhuang.setSelected(false);
            this.lianZhuang.setEnabled(false);
            var txt = this.lianZhuang.getChildByName("text");
            txt.setTextColor(cc.color(190,190,190));
            var fdTitle = this.bg_node.getChildByName("fengDing");
            var _play = this.bg_node.getChildByName("play");
            var fengDing0 = _play.getChildByName("fengding0"); 
            var fengDing1 = _play.getChildByName("fengding1");
            var fengDing2 = _play.getChildByName("fengding2");
            var fengDing3 = _play.getChildByName("fengding3");
            fdTitle.visible = false;
            fengDing0.visible = false;
            fengDing1.visible = false;
            fengDing2.visible = false;
            fengDing3.visible = false;
        } else {
            this.lianZhuang.setEnabled(true);
            var txt = this.lianZhuang.getChildByName("text");
            txt.setTextColor(this.lianZhuang.isSelected() ? this._selectColor : this._unSelectColor);
        }
    }
});