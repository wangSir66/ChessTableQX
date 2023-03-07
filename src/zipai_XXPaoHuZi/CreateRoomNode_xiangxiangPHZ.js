/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_xiangxiangPHZ = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    initAll:function()
    {
        this.localStorageKey.KEY_xiangxiangPHZ_maxPlayer    =  "_xiangxiangPHZ_maxPlayer";    //几人玩
        this.localStorageKey.KEY_xiangxiangPHZ_isMaiPai     =  "_xiangxiangPHZ_isMaiPai";        //是否埋牌
        this.localStorageKey.KEY_xiangxiangPHZ_maiPaiType     =  "_xiangxiangPHZ_maiPaiType";        //埋牌类型  0：不埋牌  1：埋10   2：埋20
        this.localStorageKey.KEY_xiangxiangPHZ_huType       =  "_xiangxiangPHZ_huType";       //胡法
        this.localStorageKey.KEY_xiangxiangPHZ_jifenType    =  "_xiangxiangPHZ_jifenType";    //计分
        this.localStorageKey.KEY_xiangxiangPHZ_yidianhong   =  "_xiangxiangPHZ_yidianhong";   //一点红
        this.localStorageKey.KEY_xiangxiangPHZ_tiandihu     =  "_xiangxiangPHZ_tiandihu";     //天地胡
        this.localStorageKey.KEY_xiangxiangPHZ_hongheihu    =  "_xiangxiangPHZ_hongheihu";    //红黑胡
        this.localStorageKey.KEY_xiangxiangPHZ_maxPlayerToStart = "_xiangxiangPHZ_maxPlayerToStart";    // 是否满人直接开始
        this.localStorageKey.KEY_xiangxiangPHZ_fapai        = "_xiangxiangPHZ_fapai";    // 发牌速度
        this.localStorageKey.KEY_xiangxiangPHZ_trust        = "xiangxiangPHZ_trust";                //托管
        this.localStorageKey.KEY_xiangxiangPHZ_zhuang        = "xiangxiangPHZ_zhuang";                //庄
        
        this.setExtraKey({
            fanBei: "xiangxiangPHZ_TY_FAN_BEI",  //大结算翻倍
            fanBeiScore: "xiangxiangPHZ_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "xiangxiangPHZ_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);

        this.bg_node = ccs.load("bg_xiangxiangPHZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiangxiangPHZ");
        this.bg_node = this.bg_node.getChildByName("view");
    },

    checkMaxPlayerRadioBox : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkMaxPlayerSelect();
    },

    checkMaxPlayerSelect: function(){
        var _maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
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

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer_3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer_2"));
        this.initPlayNumNode(maxPlayerList, [3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.checkMaxPlayerRadioBox.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkMaxPlayerSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkMaxPlayerSelect.bind(this)),maxPlayerList[1].getChildByName("text"));

        var hufaTypeList = [];
        hufaTypeList.push(_play.getChildByName("hufa_10"));
        hufaTypeList.push(_play.getChildByName("hufa_15"));
        this.hufaTypeList_radio = createRadioBoxForCheckBoxs(hufaTypeList,this.radioBoxSelectCB,1);
        cc.eventManager.addListener(this.setTextClick(hufaTypeList,0,this.hufaTypeList_radio),hufaTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hufaTypeList,1,this.hufaTypeList_radio),hufaTypeList[1].getChildByName("text"));

        var jifenTypeList = [];
        jifenTypeList.push(_play.getChildByName("jifen_tun"));
        jifenTypeList.push(_play.getChildByName("jifen_huxi"));
        this.jifenTypeList_radio = createRadioBoxForCheckBoxs(jifenTypeList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(jifenTypeList,0,this.jifenTypeList_radio),jifenTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(jifenTypeList,1,this.jifenTypeList_radio),jifenTypeList[1].getChildByName("text"));

        this.initMaiPaiNode(_play);
        this.initZhuangNode(_play);

        this.yidianhong = _play.getChildByName("yidianhong");
        cc.eventManager.addListener(this.setTextClick(),this.yidianhong.getChildByName("text"));
        this.yidianhong.addEventListener(this._clickCB, this.yidianhong);

        this.tiandihu = _play.getChildByName("tiandihu");
        cc.eventManager.addListener(this.setTextClick(),this.tiandihu.getChildByName("text"));
        this.tiandihu.addEventListener(this._clickCB, this.tiandihu);

        this.hongheihu = _play.getChildByName("hongheihu");
        cc.eventManager.addListener(this.setTextClick(),this.hongheihu.getChildByName("text"));
        this.hongheihu.addEventListener(this._clickCB, this.hongheihu);

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

        this.schedule(function(sender,type)
        {
            this.updateSelectDiaNum();
        },0.1);

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

    initZhuangNode: function(_play){
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

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer;
        // if (isClub)
        //     _maxPlayer = [4, 3].indexOf(this.getNumberItem("maxPlayer", 4));
        // else
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer_3"));
        list.push(_play.getChildByName("maxPlayer_2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _hufaType;
        // if (isClub)
        //     _xingType = this.getNumberItem("xingType", 0);
        // else
            _hufaType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_huType, 1);
        this.hufaTypeList_radio.selectItem(_hufaType);
        list = [];
        list.push(_play.getChildByName("hufa_10"));
        list.push(_play.getChildByName("hufa_15"));
        this.radioBoxSelectCB(_hufaType,list[_hufaType],list);

        var _jifenType;
        // if (isClub)
        //     _xiType = [6,9,15].indexOf(this.getNumberItem("xiNum", 6));
        // else
            _jifenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_jifenType, 0);
        this.jifenTypeList_radio.selectItem(_jifenType);
        list = [];
        list.push(_play.getChildByName("jifen_tun"));
        list.push(_play.getChildByName("jifen_huxi"));
        this.radioBoxSelectCB(_jifenType,list[_jifenType],list);

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_maiPaiType, 0);
            var _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_isMaiPai, false);
            if(!_maipaiCheckBox) maiPaiType = 0;
            if(_maipaiCheckBox && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            var _maipaiCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_isMaiPai, true);
            this.maipaiCheckBox.setSelected(_maipaiCheckBox);
            var txt = this.maipaiCheckBox.getChildByName("text");
            if(_maipaiCheckBox){
                txt.setTextColor(this._selectColor);
            }else{
                txt.setTextColor(this._unSelectColor );
            }
        }

        //庄
        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            var zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_zhuang, 1);
            this.zhuangList_radio.selectItem(zhuang);
            this.radioBoxSelectCB(zhuang,this.zhuangList[zhuang],this.zhuangList);
        }

        var _yidianhong;
        // if (isClub)
        //     _yidianhong = this.getBoolItem("isyidianhong", true);
        // else
            _yidianhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_yidianhong, true);
        this.yidianhong.setSelected(_yidianhong);
        var txt = this.yidianhong.getChildByName("text");
        if(_yidianhong){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor );
        }

        var _tiandihu;
        // if (isClub)
        //     _tiandihu = this.getBoolItem("istiandihu", false);
        // else
            _tiandihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_tiandihu, true);
        this.tiandihu.setSelected(_tiandihu);
        var txt = this.tiandihu.getChildByName("text");
        if(_tiandihu){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor );
        }

        var _hongheihu;
        // if (isClub)
        //     _hongheihu = this.getBoolItem("ishongheihu", true);
        // else
            _hongheihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_hongheihu, true);
        this.hongheihu.setSelected(_hongheihu);
        var txt = this.hongheihu.getChildByName("text");
        if(_hongheihu){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor );
        }

        var _maxPlayerToStartCheckBox = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_maxPlayerToStart, false);
        this.maxPlayerToStartCheckBox.setSelected(_maxPlayerToStartCheckBox);
        var txt = this.maxPlayerToStartCheckBox.getChildByName("text");
        if(_maxPlayerToStartCheckBox){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor );
        }

        //托管
        if (this.trustList_radio) {
            var _trustIndex;
            if (isClub){
                _trustIndex = {"-1":0, 60: 1, 120: 2, 180: 3, 300: 4}[this.getNumberItem("trustTime", -1)];
            }else{
                var _trustIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_trust, 0);
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
            if (isClub){
                _faPai = this.getNumberItem("faPai", 0);
            }else{
                _faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_fapai, 0);
            }

            this.faPaiList_radio.selectItem(_faPai);
            list = [];
            list.push(_play.getChildByName("faPai0")); 
            list.push(_play.getChildByName("faPai1"));
            list.push(_play.getChildByName("faPai2"));
            this.radioBoxSelectCB(_faPai,list[_faPai],list);
        } 

        this.setExtraPlayNodeCurrentSelect(isClub);
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.checkMaxPlayerSelect()})));
    },
    setRoundNodeCurrentSelect:function(){
        this._super();
       // if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
       //     this.payWayNode_1.setSelected(true);
       // }
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var hufaIndex      = this.hufaTypeList_radio.getSelectIndex();
        var jifenIndex     = this.jifenTypeList_radio.getSelectIndex();
        var isMaiPai, maiPaiType, zuoZhuang;
        var isFullPerson   = this.maxPlayerToStartCheckBox.isSelected();

        var para = {};
        para.gameType     = MjClient.GAME_TYPE.XIANG_XIANG_PAO_HU_ZI;
        para.maxPlayer    = [3,2][maxPlayerIndex];
        para.limitWinHuxi = [1,2][hufaIndex];
        para.jifenType    = [1,2][jifenIndex];
        para.littleRed    = this.yidianhong.isSelected();
        para.tianDiHu     = this.tiandihu.isSelected();
        para.RedBlackHu   = this.hongheihu.isSelected();
        //埋牌
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            maiPaiType = this.maiPaiList_radio.getSelectIndex();
            isMaiPai = maiPaiType > 0;
            para.maiPaiType = maiPaiType;
        }else{
            isMaiPai       = this.maipaiCheckBox.isSelected();
        }
       
        if(maxPlayerIndex == 0){
            isMaiPai = false;
        }
        para.maipai       = isMaiPai;


        //坐庄
        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            zuoZhuang = this.zhuangList_radio.getSelectIndex();
            para.zuoZhuang = zuoZhuang;
        }
       
        if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
            para.fullperson = isFullPerson;
        }else{
            para.fullperson = false;
        }

        if (this.trustList_radio) {
            var trustIndex     = this.trustList_radio.getSelectIndex();
            para.trustTime = [-1, 60, 120, 180, 300][trustIndex];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_trust, trustIndex);
        }

        if(this.faPaiList_radio){
            para.faPai = this.faPaiList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_fapai, para.faPai);
        }

        this.getExtraSelectedPara(para);

        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_maxPlayer, maxPlayerIndex);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_isMaiPai, isMaiPai);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_maiPaiType, maiPaiType);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_zhuang, zuoZhuang);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_huType, hufaIndex);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangxiangPHZ_jifenType, jifenIndex);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_yidianhong, para.littleRed);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_tiandihu, para.tianDiHu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_hongheihu, para.RedBlackHu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangxiangPHZ_maxPlayerToStart, isFullPerson);
        return para;
    }
});