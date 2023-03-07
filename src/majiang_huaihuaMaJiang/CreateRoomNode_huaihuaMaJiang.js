/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_huaihuaMaJiang = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_huaihuaMaJiang_playerCount           =  "_huaihuaMaJiang_COUNT_PLAYER";         //人数   
        this.localStorageKey.KEY_huaihuaMaJiang_huType                =  "_huaihuaMaJiang_HU_WAY";               //胡的方式
        this.localStorageKey.KEY_huaihuaMaJiang_isHuJiePao            =  "_huaihuaMaJiang_HU_JIE_PAO";           //小胡不可接炮
        this.localStorageKey.KEY_huaihuaMaJiang_niaoType              =  "_huaihuaMaJiang_NIAO_WAY";             //鸟的方式
        this.localStorageKey.KEY_huaihuaMaJiang_isOneFiveNineNiao     =  "_huaihuaMaJiang_ONE_FIVE_NINE_NIAO";   //159抓鸟
        this.localStorageKey.KEY_huaihuaMaJiang_sihongzhong           =  "_huaihuaMaJiang_PLAYWAY_sihongzhong";  //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_tianhu                =  "_huaihuaMaJiang_PLAYWAY_tianhu ";      //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_dihu                  =  "_huaihuaMaJiang_PLAYWAY_dihu";         //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_banbanhu              =  "_huaihuaMaJiang_PLAYWAY_banbanhu";     //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_yitiaolong            =  "_huaihuaMaJiang_PLAYWAY_yitiaolong";   //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_longqidui             =  "_huaihuaMaJiang_PLAYWAY_longqidui";    //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_siguiyi               =  "_huaihuaMaJiang_PLAYWAY_siguiyi";      //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_jiangjianghu          =  "_huaihuaMaJiang_PLAYWAY_jiangjianghu ";//玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_queyise               =  "_huaihuaMaJiang_PLAYWAY_queyise";      //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_qiangganghu           =  "_huaihuaMaJiang_PLAYWAY_qiangganghu";  //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_qianggangquanbao      =  "_huaihuaMaJiang_PLAYWAY_qianggangquanbao";  //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_qishou14              =  "_huaihuaMaJiang_PLAYWAY_qishou14";     //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_touhougang            =  "_huaihuaMaJiang_PLAYWAY_touhougang";     //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_baogang               =  "_huaihuaMaJiang_PLAYWAY_baogang";      //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_huangzhuang           =  "_huaihuaMaJiang_PLAYWAY_huangzhuang";  //玩的方式
        this.localStorageKey.KEY_huaihuaMaJiang_jiesuan_difen         =  "_huaihuaMaJiang_JIE_SUAN_DI_FEN"; // 积分底分
        this.setExtraKey({
            tuoGuan:  "_huaihuaMaJiang_TUO_GUAN",       //托管
            fanBei: "_huaihuaMaJiang_FAN_BEI",          //大结算翻倍
            fanBeiScore: "_huaihuaMaJiang_TY_FAN_BEI",  //少于X分大结算翻倍
            trustWhole: "_SYMJ_trustWhole", //整局托管
            trustWay: "_SYMJ_trustWay",
        });
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum2:8, roundNum3:16};

        this.bg_node = ccs.load("bg_huaihuaMaJiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_huaihuaMaJiang").getChildByName("view");
    },
    radioBoxSelectCB_huaihuaMaJiang : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },
    checkSelect: function(){
        var hutypeIndex = this._hutype_radio.getSelectIndex();
        var niaoIndex   = this._niao_type_radio.getSelectIndex();
        if(hutypeIndex == 1){
            this._hutype_jiepao_0.visible = true;
        }else{
            this._hutype_jiepao_0.visible = false;
        }
        if(niaoIndex == 0){
            this._playNode_niaoType_159.visible = false;
        }else{
            this._playNode_niaoType_159.visible = true;
        }
    },
    initPlayNode:function()
    {
        var _bghuaihuaMaJiangNode = this.bg_node;
        var _play = _bghuaihuaMaJiangNode.getChildByName("play");

        this._playNode_Count_0 = _play.getChildByName("playerCount_0");
        this._playNode_Count_1 = _play.getChildByName("playerCount_1");
        this._playNode_Count_2 = _play.getChildByName("playerCount_2");
        var nodeListCount = [];
        nodeListCount.push( _play.getChildByName("playerCount_0"));
        nodeListCount.push( _play.getChildByName("playerCount_1"));
        nodeListCount.push( _play.getChildByName("playerCount_2"));
        this.initPlayNumNode(nodeListCount, [4, 3, 2]);
        this._playNode_playerCount_radio = createRadioBoxForCheckBoxs(nodeListCount, this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(nodeListCount,0,this._playNode_playerCount_radio,this.changeAAPayForPlayerNum.bind(this)),nodeListCount[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListCount,1,this._playNode_playerCount_radio,this.changeAAPayForPlayerNum.bind(this)),nodeListCount[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListCount,2,this._playNode_playerCount_radio,this.changeAAPayForPlayerNum.bind(this)),nodeListCount[2].getChildByName("text"));

        this._hutype_zimo = _play.getChildByName("hutype_zimo");
        this._hutype_jiepao = _play.getChildByName("hutype_jiepao");
        var hutypeList = [];
        hutypeList.push(this._hutype_zimo);
        hutypeList.push(this._hutype_jiepao);
        this._hutype_radio = createRadioBoxForCheckBoxs(hutypeList, this.radioBoxSelectCB_huaihuaMaJiang.bind(this));
        cc.eventManager.addListener(this.setTextClick(hutypeList,0,this._hutype_radio,this.checkSelect.bind(this)),hutypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(hutypeList,1,this._hutype_radio,this.checkSelect.bind(this)),hutypeList[1].getChildByName("text"));

        this._hutype_jiepao_0 = _play.getChildByName("hutype_jiepao_0");
        this._hutype_jiepao_0.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this._hutype_jiepao_0.getChildByName("text"));
        this._hutype_jiepao_0.addEventListener(this._clickCB.bind(this), this._hutype_jiepao_0);

        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao_0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao_1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao_2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniao_3");
        var nodeList1 = [];
        nodeList1.push(this._playNode_niaoType_0);
        nodeList1.push(this._playNode_niaoType_1);
        nodeList1.push(this._playNode_niaoType_2);
        nodeList1.push(this._playNode_niaoType_3);
        this._niao_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB_huaihuaMaJiang.bind(this));
        cc.eventManager.addListener(this.setTextClick(nodeList1,0,this._niao_type_radio,this.checkSelect.bind(this)),nodeList1[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,1,this._niao_type_radio,this.checkSelect.bind(this)),nodeList1[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,2,this._niao_type_radio,this.checkSelect.bind(this)),nodeList1[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,3,this._niao_type_radio,this.checkSelect.bind(this)),nodeList1[3].getChildByName("text"));

        this._playNode_niaoType_159 = _play.getChildByName("zhuaniao_159");
        this._playNode_niaoType_159.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this._playNode_niaoType_159.getChildByName("text"));
        this._playNode_niaoType_159.addEventListener(this._clickCB.bind(this), this._playNode_niaoType_159);

        this._play_sihongzhong = _play.getChildByName("play_sihongzhong");
        cc.eventManager.addListener(this.setTextClick(),this._play_sihongzhong.getChildByName("text"));
        this._play_sihongzhong.addEventListener(this._clickCB.bind(this), this._play_sihongzhong);

        this._play_tianhu = _play.getChildByName("play_tianhu");
        cc.eventManager.addListener(this.setTextClick(),this._play_tianhu.getChildByName("text"));
        this._play_tianhu.addEventListener(this._clickCB.bind(this), this._play_tianhu);

        this._play_dihu = _play.getChildByName("play_dihu");
        cc.eventManager.addListener(this.setTextClick(),this._play_dihu.getChildByName("text"));
        this._play_dihu.addEventListener(this._clickCB.bind(this), this._play_dihu);

        this._play_banbanhu = _play.getChildByName("play_banbanhu");
        cc.eventManager.addListener(this.setTextClick(),this._play_banbanhu.getChildByName("text"));
        this._play_banbanhu.addEventListener(this._clickCB.bind(this), this._play_banbanhu);

        this._play_yitiaolong = _play.getChildByName("play_yitiaolong");
        cc.eventManager.addListener(this.setTextClick(),this._play_yitiaolong.getChildByName("text"));
        this._play_yitiaolong.addEventListener(this._clickCB.bind(this), this._play_yitiaolong);

        this._play_longqidui = _play.getChildByName("play_longqidui");
        cc.eventManager.addListener(this.setTextClick(),this._play_longqidui.getChildByName("text"));
        this._play_longqidui.addEventListener(this._clickCB.bind(this), this._play_longqidui);

        this._play_siguiyi = _play.getChildByName("play_siguiyi");
        cc.eventManager.addListener(this.setTextClick(),this._play_siguiyi.getChildByName("text"));
        this._play_siguiyi.addEventListener(this._clickCB.bind(this), this._play_siguiyi);

        this._play_jiangjianghu = _play.getChildByName("play_jiangjianghu");
        cc.eventManager.addListener(this.setTextClick(),this._play_jiangjianghu.getChildByName("text"));
        this._play_jiangjianghu.addEventListener(this._clickCB.bind(this), this._play_jiangjianghu);

        this._play_queyise = _play.getChildByName("play_queyise");
        cc.eventManager.addListener(this.setTextClick(),this._play_queyise.getChildByName("text"));
        this._play_queyise.addEventListener(this._clickCB.bind(this), this._play_queyise);

        this._play_qiangganghu = _play.getChildByName("play_qiangganghu");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect_gang.bind(this)),this._play_qiangganghu.getChildByName("text"));
        this._play_qiangganghu.addEventListener(this._clickCB.bind(this), this._play_qiangganghu);

        this._play_qianggangquanbao = _play.getChildByName("play_qianggangquanbao");
        cc.eventManager.addListener(this.setTextClick(),this._play_qianggangquanbao.getChildByName("text"));
        this._play_qianggangquanbao.addEventListener(this._clickCB.bind(this), this._play_qianggangquanbao);

        this._play_qishou14 = _play.getChildByName("play_qishou14");
        cc.eventManager.addListener(this.setTextClick(),this._play_qishou14.getChildByName("text"));
        this._play_qishou14.addEventListener(this._clickCB.bind(this), this._play_qishou14);

        this._play_touhougang = _play.getChildByName("play_touhougang");
        cc.eventManager.addListener(this.setTextClick(),this._play_touhougang.getChildByName("text"));
        this._play_touhougang.addEventListener(this._clickCB.bind(this), this._play_touhougang);

        this._play_baogang = _play.getChildByName("play_baogang");
        cc.eventManager.addListener(this.setTextClick(),this._play_baogang.getChildByName("text"));
        this._play_baogang.addEventListener(this._clickCB.bind(this), this._play_baogang);

        this._play_huangzhuang = _play.getChildByName("play_huangzhuang");
        cc.eventManager.addListener(this.setTextClick(),this._play_huangzhuang.getChildByName("text"));
        this._play_huangzhuang.addEventListener(this._clickCB.bind(this), this._play_huangzhuang);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;
        
         // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var score = _bghuaihuaMaJiangNode.getParent().getChildByName("score");
            var addBtn = _bghuaihuaMaJiangNode.getParent().getChildByName("btn_add");
            var subBtn = _bghuaihuaMaJiangNode.getParent().getChildByName("btn_sub");
            addBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);

            subBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);
        }
        
        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        this._super(sender, type);
        this.checkSelect_gang();
    },

    checkSelect_gang : function(){
        this._play_qianggangquanbao.visible = this._play_qiangganghu.isSelected();
    },

    setPlayNodeCurrentSelect:function(isClub) {
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        //人数 
        var listCount = []; 
        listCount.push(this._playNode_Count_0); 
        listCount.push(this._playNode_Count_1); 
        listCount.push(this._playNode_Count_2); 
        var indexCount = 0; 
        if(isClub){
            var count = this.getNumberItem("maxPlayer", 4);
            indexCount = count == 4 ? 0 : count == 3 ? 1 : 2; 
        }else{
            indexCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_playerCount, 0); 
        } 
        this._playNode_playerCount_radio.selectItem(indexCount);  
        this.radioBoxSelectCB(indexCount,listCount[indexCount],listCount); 

        //胡法
        var list = []; 
        list.push(this._hutype_zimo); 
        list.push(this._hutype_jiepao); 
        var huTpeIndex; 
        if (isClub) 
            huTpeIndex = [1, 2].indexOf(this.getNumberItem("huType", 1));
        else 
            huTpeIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_huType, 0); 
        this._hutype_radio.selectItem(huTpeIndex); 
        this.radioBoxSelectCB(huTpeIndex, list[huTpeIndex], list);

        var _jiepao_0;
        if(isClub){
            _jiepao_0 = this.getBoolItem("xiaohubudianpao", false);
        }else{
            _jiepao_0 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_isHuJiePao, false);
        }
        this._hutype_jiepao_0.setSelected(_jiepao_0);
        var txt = this._hutype_jiepao_0.getChildByName("text");
        if(_jiepao_0){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        } 

        //鸟
        var list = []; 
        list.push(this._playNode_niaoType_0); 
        list.push(this._playNode_niaoType_1); 
        list.push(this._playNode_niaoType_2); 
        list.push(this._playNode_niaoType_3); 
        var _niaoType; 
        if(isClub){
            _niaoType = this.getNumberItem("zhuaniaotype", 0); 
        }else{
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_niaoType,0); 
        } 
        this._niao_type_radio.selectItem(_niaoType);
        this.radioBoxSelectCB(_niaoType,list[_niaoType],list);

        var _niaoType_159;
        if(isClub){
            _niaoType_159 = this.getBoolItem("zhuaniaovalue", false);
        }else{
            _niaoType_159 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_isOneFiveNineNiao, false);
        }
        this._playNode_niaoType_159.setSelected(_niaoType_159);
        var txt = this._playNode_niaoType_159.getChildByName("text");
        if(_niaoType_159){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _sihongzhong;
        if(isClub){
            _sihongzhong = this.getBoolItem("sihongzhong", true);
        }else{
            _sihongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_sihongzhong, true);
        }
        this._play_sihongzhong.setSelected(_sihongzhong);
        var txt = this._play_sihongzhong.getChildByName("text");
        if(_sihongzhong){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _tianhu;
        if(isClub){
            _tianhu = this.getBoolItem("tianhu", false);
        }else{
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_tianhu, false);
        }
        this._play_tianhu.setSelected(_tianhu);
        var txt = this._play_tianhu.getChildByName("text");
        if(_tianhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dihu;
        if(isClub){
            _dihu = this.getBoolItem("dihu", false);
        }else{
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_dihu, false);
        }
        this._play_dihu.setSelected(_dihu);
        var txt = this._play_dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var _jieSuanDiFen;
            if(isClub){
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_jiesuan_difen,1);
            }
            var score = this.bg_node.getParent().getChildByName("score");
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);
        }

        var _banbanhu;
        if(isClub){
            _banbanhu = this.getBoolItem("banbanhu", false);
        }else{
            _banbanhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_banbanhu, false);
        }
        this._play_banbanhu.setSelected(_banbanhu);
        var txt = this._play_banbanhu.getChildByName("text");
        if(_banbanhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yitiaolong;
        if(isClub){
            _yitiaolong = this.getBoolItem("yitiaolong", false);
        }else{
            _yitiaolong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_yitiaolong, false);
        }
        this._play_yitiaolong.setSelected(_yitiaolong);
        var txt = this._play_yitiaolong.getChildByName("text");
        if(_yitiaolong){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _longqidui;
        if(isClub){
            _longqidui = this.getBoolItem("longqidui", false);
        }else{
            _longqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_longqidui, false);
        }
        this._play_longqidui.setSelected(_longqidui);
        var txt = this._play_longqidui.getChildByName("text");
        if(_longqidui){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _siguiy;
        if(isClub){
            _siguiy = this.getBoolItem("siguiyi", false);
        }else{
            _siguiy = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_siguiyi, false);
        }
        this._play_siguiyi.setSelected(_siguiy);
        var txt = this._play_siguiyi.getChildByName("text");
        if(_siguiy){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _jiangjianghu;
        if(isClub){
            _jiangjianghu = this.getBoolItem("jiangjianghu", false);
        }else{
            _jiangjianghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_jiangjianghu, false);
        }
        this._play_jiangjianghu.setSelected(_jiangjianghu);
        var txt = this._play_jiangjianghu.getChildByName("text");
        if(_jiangjianghu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _queyise;
        if(isClub){
            _queyise = this.getBoolItem("queyise", false);
        }else{
            _queyise = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_queyise, false);
        }
        this._play_queyise.setSelected(_queyise);
        var txt = this._play_queyise.getChildByName("text");
        if(_queyise){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _qiangganghu;
        if(isClub){
            _qiangganghu = this.getBoolItem("keganghu", true);
        }else{
            _qiangganghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qiangganghu, true);
        }
        this._play_qiangganghu.setSelected(_qiangganghu);
        var txt = this._play_qiangganghu.getChildByName("text");
        if(_qiangganghu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _qianggangquanbao;
        if(isClub){
            _qianggangquanbao = this.getBoolItem("qiangGangQuanBao", false);
        }else{
            _qianggangquanbao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qianggangquanbao, false);
        }
        this._play_qianggangquanbao.setSelected(_qianggangquanbao);
        var txt = this._play_qianggangquanbao.getChildByName("text");
        if(_qianggangquanbao){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _qishou14;
        if(isClub){
            _qishou14 = this.getBoolItem("qiShou14", false);
        }else{
            _qishou14 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qishou14, false);
        }
        this._play_qishou14.setSelected(_qishou14);
        var txt = this._play_qishou14.getChildByName("text");
        if(_qishou14){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _touhougang;
        if(isClub){
            _touhougang = this.getBoolItem("touhougang", false);
        }else{
            _touhougang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_touhougang, false);
        }
        this._play_touhougang.setSelected(_touhougang);
        var txt = this._play_touhougang.getChildByName("text");
        if(_touhougang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _baogang;
        if(isClub){
            _baogang = this.getBoolItem("baogang", true);
        }else{
            _baogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_baogang, true);
        }
        this._play_baogang.setSelected(_baogang);
        var txt = this._play_baogang.getChildByName("text");
        if(_baogang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _huangzhuang;
        if(isClub){
            _huangzhuang = this.getBoolItem("huanggangzhuang", false);
        }else{
            _huangzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_huangzhuang, false);
        }
        this._play_huangzhuang.setSelected(_huangzhuang);
        var txt = this._play_huangzhuang.getChildByName("text");
        if(_huangzhuang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }
        
        this.setExtraPlayNodeCurrentSelect(isClub);
        
        this.checkSelect(); 
        this.checkSelect_gang();
    },

    getSelectedPara:function()
    {
        var para = {};
        var maxPlayerIndex = this._playNode_playerCount_radio.getSelectIndex();
        var huTypeIndex    = this._hutype_radio.getSelectIndex();
        var niaoTypeIndex  = this._niao_type_radio.getSelectIndex();

        para.gameType = MjClient.GAME_TYPE.HUAI_HUA_MA_JIANG;
        para.maxPlayer = [4,3,2][maxPlayerIndex];                      //人数
        para.huType = [1,2][huTypeIndex];                              //1:自摸胡     2：点炮胡
        para.xiaohubudianpao = this._hutype_jiepao_0.isSelected();     //小胡不点炮  选择为true否则为false
        para.zhuaniaotype = niaoTypeIndex;                             // 0:不抓鸟  1：抓一鸟 2：抓2鸟 3：抓3鸟
        para.zhuaniaovalue = this._playNode_niaoType_159.isSelected(); //159抓鸟 选中为true否则为false

        para.sihongzhong = this._play_sihongzhong.isSelected();        //四红中 选择为true否则为false
        para.tianhu = this._play_tianhu.isSelected();                  //天胡  选择为true否则为false
        para.dihu = this._play_dihu.isSelected();                      //地胡 选择为true否则为false
        para.banbanhu = this._play_banbanhu.isSelected();              //板板胡 选择为true否则为false
        para.yitiaolong = this._play_yitiaolong.isSelected();          //一条龙 选择为true否则为false
        para.longqidui = this._play_longqidui.isSelected();            //龙七对 选择为true否则为false
        para.siguiyi = this._play_siguiyi.isSelected();                //四归一 选择为true否则为false
        para.jiangjianghu = this._play_jiangjianghu.isSelected();      //将将胡 选择为true否则为false
        para.queyise = this._play_queyise.isSelected();                //缺一色 选择为true否则为false
        para.keganghu = this._play_qiangganghu.isSelected();           //可抢杠胡  选择为true否则为false
        para.qiangGangQuanBao = this._play_qianggangquanbao.isSelected();//抢杠全包  选择为true否则为false
        para.qiShou14 = this._play_qishou14.isSelected();              //起手胡14张  选择为true否则为false
        para.touhougang = this._play_touhougang.isSelected();           //骰后杠  选择为true否则为false
        para.baogang = this._play_baogang.isSelected();                //包杠  选择为true否则为false
        para.huanggangzhuang = this._play_huangzhuang.isSelected();    //荒庄荒杠 选择为true否则为false
        
        if(huTypeIndex == 0){
            para.xiaohubudianpao = false;
        }
        if(niaoTypeIndex == 0){
            para.zhuaniaovalue = false;
        }

        var score = this.bg_node.getParent().getChildByName("score"); 
        para.jieSuanDiFen = Number(score.getString());
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_jiesuan_difen,para.jieSuanDiFen);
        
        this.getExtraSelectedPara(para);
        return para;
    },
     _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_huaihuaMaJiang();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_huaihuaMaJiang();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_huaihuaMaJiang();
    },

    setDiaNumData_huaihuaMaJiang : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true); 
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard) {
            var maxPlayer = this._playNode_playerCount_radio.getSelectIndex();
            var huType    = this._hutype_radio.getSelectIndex();

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_playerCount, maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_huType, huType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_isHuJiePao,para.xiaohubudianpao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_huaihuaMaJiang_niaoType, para.zhuaniaotype);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_isOneFiveNineNiao,para.zhuaniaovalue);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_sihongzhong,para.sihongzhong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_tianhu,para.tianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_dihu,para.dihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_banbanhu,para.banbanhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_yitiaolong,para.yitiaolong);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_longqidui, para.longqidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_siguiyi, para.siguiyi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_jiangjianghu, para.jiangjianghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_queyise, para.queyise);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qiangganghu, para.keganghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qianggangquanbao, para.qiangGangQuanBao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_qishou14, para.qiShou14);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_baogang, para.baogang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_touhougang, para.touhougang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_huaihuaMaJiang_huangzhuang, para.huanggangzhuang);
        }
    },
});