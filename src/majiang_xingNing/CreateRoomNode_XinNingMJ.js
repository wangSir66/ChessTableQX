/**
 * Created by maoyu on 2017/7/21.
 */

 
var CreateRoomNode_XNMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if(!this._isFriendCard){
            // BOOL
            this.localStorageKey.KEY_XNMJ_canChi = "_XINNING_CANCHI";  // 可以吃
            this.localStorageKey.KEY_XNMJ_daiFeng = "_XINNING_DAIFENG";  // 带风
            this.localStorageKey.KEY_XNMJ_zhiTouZi  = "_XINNING_ZHITOUZI"; // 开杠听掷骰子
            this.localStorageKey.KEY_XNMJ_jiachui  = "_XINNING_JIACHUI";    // 加锤
            this.localStorageKey.KEY_XNMJ_lianChui = "_XINNING_LIANCHUI"; //连庄不可拆捶
            this.localStorageKey.KEY_XNMJ_zhuangShangChui= "_XINNING_ZHUANGSHANGCHUI"; //庄上锤
            //int
            this.localStorageKey.KEY_XNMJ_maxPlayer = "_XINNING_MAXPLAYER";  // 最大人数
            this.localStorageKey.KEY_XNMJ_huType = "_XINNING_HUTYPE";     // 胡牌方式
            this.localStorageKey.KEY_XNMJ_zhuaniao = "_XINNING_ZHUANIAO"; // 抓鸟数
            this.localStorageKey.KEY_XNMJ_fangGang = "_XINNING_FANGGANG"; // 放杠出分方式
            this.localStorageKey.KEY_XNMJ_JIESUAN_DIFEN  = "XINNING_JIE_SUAN_DI_FEN"; // 积分底分
        }
        this.setExtraKey({
            tuoGuan:  "_XINNING_TUO_GUAN",   //托管
            fanBei: "_XINNING_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_XINNING_TY_FAN_BEI",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};

        var temp_bg_node = ccs.load("bg_XinNingMJ.json").node;
        this.addChild(temp_bg_node);

        this.bg_node = temp_bg_node.getChildByName("bg_XinNingMJ");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            this.bg_node = this.bg_node.getChildByName("view");
        }
 
    },
    initPlayNode:function()
    { 
        var round = this.bg_node.getChildByName("round"); 


        var _play = this.bg_node.getChildByName("play");
        //人数
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._changePlayerNum.bind(this));

        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[2].getChildByName("text"));

        //抢杠胡
        var huTypeList = [];
        huTypeList.push(_play.getChildByName("yiPaoDuoXiang"));
        huTypeList.push(_play.getChildByName("yiPaoYiXiang"));
        huTypeList.push(_play.getChildByName("noQiangGangHu"));
        this.huTypeList_radio = createRadioBoxForCheckBoxs(huTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huTypeList,0,this.huTypeList_radio),huTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huTypeList,1,this.huTypeList_radio),huTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huTypeList,2,this.huTypeList_radio),huTypeList[2].getChildByName("text"));

        //抓鸟
        var zhuaniaoList = [];
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType6"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType3"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType4")); 

        this.zhuaniaoList_radio = createRadioBoxForCheckBoxs(zhuaniaoList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,0,this.zhuaniaoList_radio),zhuaniaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,1,this.zhuaniaoList_radio),zhuaniaoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,2,this.zhuaniaoList_radio),zhuaniaoList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,3,this.zhuaniaoList_radio),zhuaniaoList[3].getChildByName("text"));
 
        // 放杠出分方式
        var fangGangList = [];
        fangGangList.push(_play.getChildByName("douchu"));
        fangGangList.push(_play.getChildByName("fanggang"));
        this.fanggangList_radio = createRadioBoxForCheckBoxs(fangGangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fangGangList,0,this.fanggangList_radio),fangGangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fangGangList,1,this.fanggangList_radio),fangGangList[1].getChildByName("text"));

        this.canChi = _play.getChildByName("canchi");
        this.addListenerText(this.canChi);
        this.canChi.addEventListener(this._clickCB.bind(this), this.canChi);

        this.daifeng = _play.getChildByName("daifeng");
        this.addListenerText(this.daifeng);
        this.daifeng.addEventListener(this._clickCB.bind(this), this.daifeng);

        this.zhiTouZi = _play.getChildByName("zhitouzi");
        this.addListenerText(this.zhiTouZi);
        this.zhiTouZi.addEventListener(this._clickCB.bind(this), this.zhiTouZi);

        this.jiachui = _play.getChildByName("jiachui");
        var textCallback = function(){
            this.lianchui.setVisible(this.jiachui.isSelected());    
            this.zhuangshangchui.setVisible(this.jiachui.isSelected());     
            this._jiaChuiCallBack(this.jiachui);
        }.bind(this);
        this.addListenerText(this.jiachui, null, textCallback);
        this.jiachui.addEventListener(this._clickCB.bind(this), this.jiachui); 

        this.lianchui = _play.getChildByName("lianchui");
        this.addListenerText(this.lianchui,null,function(){
            this._jiaChuiCallBack(this.lianchui);
        }.bind(this));
        this.lianchui.addEventListener(this._clickCB.bind(this), this.lianchui); 
        this.lianchui.setVisible(false); // 连锤必须在加锤被选以后在能显示出来


        this.zhuangshangchui = _play.getChildByName("zhuangshangchui");
        this.addListenerText(this.zhuangshangchui,null,function(){
            this._jiaChuiCallBack(this.zhuangshangchui);
        }.bind(this));
        this.zhuangshangchui.addEventListener(this._clickCB.bind(this), this.zhuangshangchui); 
        this.zhuangshangchui.setVisible(false); // 连锤必须在加锤被选以后在能显示出来

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;
         // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var score = this.bg_node.getParent().getChildByName("score");
            var addBtn = this.bg_node.getParent().getChildByName("btn_add");
            var subBtn = this.bg_node.getParent().getChildByName("btn_sub");
            addBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);

            subBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);
        }

        this.initExtraPlayNode(_play);
        // this.changeAAPayForPlayerNum();
    },
    // 加锤连庄庄上锤的事件回调
    _jiaChuiCallBack : function(sender){
        // 如果单点加锤会先显示连锤按钮
        if(sender.getName() == "jiachui"){   
            this._resetJiachuiData("lianchui",sender.isSelected(),false,sender);
            this._resetJiachuiData("zhuangshangchui",sender.isSelected(),false,sender); 
        }   
        // 连锤和庄上锤互斥
        if(sender.getName() == "lianchui"){
            this._resetJiachuiData("lianchui",true,sender.isSelected(),sender);
            if(sender.isSelected()){
                this._resetJiachuiData("zhuangshangchui",true,false,sender);
            }  
        }else if(sender.getName() == "zhuangshangchui"){
            this._resetJiachuiData("zhuangshangchui",true,sender.isSelected(),sender);
            if(sender.isSelected()){
                this._resetJiachuiData("lianchui",true,false,sender);
            } 
        } 
    },

    _resetJiachuiData : function(name,visible,isSelected,sender){
        var selectColor =  this._getTextColor()[0];  
        var unSelectColor = this._getTextColor()[1]; 

        var pro = sender.getParent();
        var lianchui = pro.getChildByName(name);
        lianchui.setVisible(visible); 
        lianchui.setSelected(isSelected); 
        var protxt = lianchui.getChildByName("text");
        if(isSelected){
            protxt.setTextColor(selectColor);
        }else{
            protxt.setTextColor(unSelectColor);
        } 
    },
    _getTextColor : function(){
        var selectColor = cc.color(237,101,1);
        var unSelectColor = cc.color(158,118,78);
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            selectColor = cc.color(211,38,14);
            unSelectColor = cc.color(68,51,51);
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        return [selectColor,unSelectColor]
    },

    _clickCB : function(sender,type){
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text"); 
                
                var selectColor =  this._getTextColor()[0];  
                var unSelectColor = this._getTextColor()[1];   
 
                this._jiaChuiCallBack(sender);
                
                if(sender.isSelected()){
                    txt.setTextColor(selectColor);
                }else{
                    txt.setTextColor(unSelectColor);
                }
                break;
        }
    },

    _changePlayerNum:function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },

    setPlayNodeCurrentSelect:function(isClub)
    {   
        var list = [];
        var _play = this.bg_node.getChildByName("play");
        //人数
        var _maxPlayer;
        if(isClub){
            _maxPlayer = [4,3,2].indexOf(this.getNumberItem("maxPlayer", 4));
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XNMJ_maxPlayer, 0);
        }

        this.maxPlayerList_radio.selectItem(_maxPlayer); 
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list);

        //胡牌方式
        var _huType;
        if(isClub){
            _huType = this.getNumberItem("huType",0);
        }else{
            _huType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XNMJ_huType, 0);
        }

        this.huTypeList_radio.selectItem(_huType);
        list = [];
        list.push(_play.getChildByName("yiPaoDuoXiang"));
        list.push(_play.getChildByName("yiPaoYiXiang"));
        list.push(_play.getChildByName("noQiangGangHu"));
        this.radioBoxSelectCB(_huType,list[_huType],list);

        //抓鸟
        var _zhuaNiao;
        if(isClub){
            var index = this.getNumberItem("zhuaniao", 0);
            _zhuaNiao = [0,2,4,6].indexOf(index);
        }else{
            _zhuaNiao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XNMJ_zhuaniao, 0);
        }

        this.zhuaniaoList_radio.selectItem(_zhuaNiao);
        list = [];
        list.push(_play.getChildByName("zhuaniaoType6"));
        list.push(_play.getChildByName("zhuaniaoType1"));
        list.push(_play.getChildByName("zhuaniaoType3"));
        list.push(_play.getChildByName("zhuaniaoType4"));
        this.radioBoxSelectCB(_zhuaNiao,list[_zhuaNiao],list);

        // 放杠出分方式
        var _fangGang;
        if(isClub){
            _fangGang = this.getNumberItem("fangGangType", 0);
        }else{
            _fangGang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XNMJ_fangGang, 0);
        }

        this.fanggangList_radio.selectItem(_fangGang);
        list = [];
        list.push(_play.getChildByName("douchu"));
        list.push(_play.getChildByName("fanggang"));
        this.radioBoxSelectCB(_fangGang,list[_fangGang],list);  

        function changeTextColor(node){
            var txt = node.getChildByName("text");
            var selectColor = cc.color(237,101,1);
            var unSelectColor = cc.color(158,118,78);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                selectColor = cc.color(211,38,14);
                unSelectColor = cc.color(68,51,51);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
            if(node.isSelected()){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }
        
        var _canChi;
        var _daiFeng;
        var _zhiTouZi;
        var _jiaChui;
        var _lianChui;
        var _zhuangShangChui;
        if(isClub){
            _canChi = this.getBoolItem("canChi", true);
            _daiFeng = this.getBoolItem("isDaiFeng", true);
            _zhiTouZi = this.getBoolItem("zhiTouZi", true);
            _jiaChui = this.getBoolItem("isJiaChui", false);
            _lianChui = this.getBoolItem("isLianChui", false);  
            _zhuangShangChui = this.getBoolItem("isZhuangShangChui", false);  
        }else{
            _canChi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_canChi, true);
            _daiFeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_daiFeng, true);
            _zhiTouZi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_zhiTouZi, true);
            _jiaChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_jiachui, false);
            _lianChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_lianChui, false);
            _zhuangShangChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XNMJ_zhuangShangChui, false);
        }

        this.canChi.setSelected(_canChi);
        this.daifeng.setSelected(_daiFeng); 
        this.zhiTouZi.setSelected(_zhiTouZi);
        this.jiachui.setSelected(_jiaChui);
        this.lianchui.setSelected(_lianChui);
        this.zhuangshangchui.setSelected(_zhuangShangChui);

        changeTextColor(this.canChi);
        changeTextColor(this.daifeng);
        changeTextColor(this.zhiTouZi);
        changeTextColor(this.jiachui); 
        changeTextColor(this.lianchui); 
        changeTextColor(this.zhuangshangchui); 

        if(_jiaChui){
            this.lianchui.setVisible(true);
            this.zhuangshangchui.setVisible(true);
        }

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _jieSuanDiFen;
            if(isClub){
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XNMJ_JIESUAN_DIFEN,1);
            }
            var score = this.bg_node.getParent().getChildByName("score");
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);
        }
  
        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {   
        var playerIndex = this.maxPlayerList_radio.getSelectIndex();
        var zhuaniao = this.zhuaniaoList_radio.getSelectIndex();
        var gangType = this.fanggangList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIN_NING_MA_JIANG;
        para.maxPlayer = [4, 3, 2][playerIndex];
        para.huType = this.huTypeList_radio.getSelectIndex();
        para.zhuaniao = [0,2,4,6][zhuaniao];
        para.fangGangType = this.fanggangList_radio.getSelectIndex(); // 放杠方式
        para.isCanChi = this.canChi.isSelected();
        para.isDaiFeng = this.daifeng.isSelected();
        para.zhiTouZi = this.zhiTouZi.isSelected();
        para.isJiaChui = this.jiachui.isSelected();
        para.isLianChui = this.jiachui.isSelected() && this.lianchui.isSelected(); 
        para.isZhuangShangChui = this.jiachui.isSelected() && this.zhuangshangchui.isSelected() && !para.isLianChui; 
        
        var score = this.bg_node.getParent().getChildByName("score"); 
        para.jieSuanDiFen = Number(score.getString());
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_JIESUAN_DIFEN,para.jieSuanDiFen);

        this.getExtraSelectedPara(para);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_maxPlayer, playerIndex); 
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_huType, para.huType);  
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_zhuaniao, zhuaniao); 
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_fangGang, para.fangGangType);
    
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_canChi, para.isCanChi); 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_daifeng, para.isDaiFeng); 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_zhiTouZi, para.zhiTouZi); 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_jiachui, para.isJiaChui);  
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_lianChui, para.isLianChui); 

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
            var playerIndex = this.maxPlayerList_radio.getSelectIndex();
            var zhuaniao = this.zhuaniaoList_radio.getSelectIndex();
            var gangType = this.fanggangList_radio.getSelectIndex();

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_maxPlayer, playerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_huType, para.huType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_zhuaniao, zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XNMJ_fangGang, para.fangGangType);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_canChi, para.isCanChi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_daifeng, para.isDaiFeng);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_zhiTouZi, para.zhiTouZi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_jiachui, para.isJiaChui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_lianChui, para.isLianChui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XNMJ_zhuangShangChui, para.isZhuangShangChui);
        }
    },
    changeAAPayForPlayerNum:function()
    {
        cc.log("ssssssssssssssssssssss" + JSON.stringify(this.fangzhuPay));
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});