/**
 * Created by maoyu on 2017/7/21.
 */

 
var CreateRoomNode_SYMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if(!this._isFriendCard){
            // BOOL
            this.localStorageKey.KEY_SYMJ_daifeng = "_SYMJ_DAIFENG";  // 带风
            this.localStorageKey.KEY_SYMJ_duohu = "_SYMJ_DUO_HU";  // 一炮多响
            this.localStorageKey.KEY_SYMJ_jiachui  = "_SYMJ_JIACHUI";    // 加锤
            this.localStorageKey.KEY_SYMJ_kechipai  = "_SYMJ_KECHIPAI"; // 可吃牌
            this.localStorageKey.KEY_SYMJ_qingyise_kechipai  = "_SYMJ_QINGYISE_KECHIPAI"; //清一色可吃牌
            this.localStorageKey.KEY_SYMJ_chipaiData = "SYMJ_CHIPAI"; // 吃牌选项
            //int
            this.localStorageKey.KEY_SYMJ_zhuaniao = "_SYMJ_ZHUANIAO"; // 抓鸟数
            this.localStorageKey.KEY_SYMJ_maxPlayer = "_SYMJ_MAXPLAYER"; // 最大人数
            this.localStorageKey.KEY_SYMJ_lianChui = "_SYMJ_LIANGCHUI"; // 连锤
            this.localStorageKey.KEY_SYMJ_fangGang = "_SYMJ_FANGGANG"; // 放杠出分方式
            this.localStorageKey.KEY_SYMJ_jiesuan_difen  = "SYMJZ_JIE_SUAN_DI_FEN"; // 积分底分
            this.localStorageKey.KEY_SYMJ_trustWay        = "_SYMJZ_TRUST_WAY"; // 托管方式
        }
        this.setExtraKey({
            tuoGuan:  "_SYMJ_TUO_GUAN",     //托管
            fanBei: "_SYMJZ_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_SYMJZ_TY_FAN_BEI",  //少于X分大结算翻倍
            trustWhole: "_SYMJ_trustWhole", //整局托管
            trustWay: "_SYMJ_trustWay",
        });

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};

        this.bg_node = ccs.load("bg_SYMJ.json").node;
        this.addChild(this.bg_node);

        this.bg_node = this.bg_node.getChildByName("bg_SYMJ").getChildByName("view");
        
    },
    initPlayNode:function()
    {
        //摸马
        var _play = this.bg_node.getChildByName("play");

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));

        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[2].getChildByName("text"));



        var zhuaniaoList = [];
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType3"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType4"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType5"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType6"));
        zhuaniaoList.push(_play.getChildByName("zhuaniaoType7")); 

        this.zhuaniaoList_radio = createRadioBoxForCheckBoxs(zhuaniaoList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,0,this.zhuaniaoList_radio),zhuaniaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,1,this.zhuaniaoList_radio),zhuaniaoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,2,this.zhuaniaoList_radio),zhuaniaoList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,3,this.zhuaniaoList_radio),zhuaniaoList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,4,this.zhuaniaoList_radio),zhuaniaoList[4].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,5,this.zhuaniaoList_radio),zhuaniaoList[5].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaniaoList,6,this.zhuaniaoList_radio),zhuaniaoList[6].getChildByName("text"));
 
 
        // 放杠出分方式
        var fangGangList = [];
        fangGangList.push(_play.getChildByName("douchu"));
        fangGangList.push(_play.getChildByName("fanggang"));

        this.fanggangList_radio = createRadioBoxForCheckBoxs(fangGangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fangGangList,0,this.fanggangList_radio),fangGangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fangGangList,1,this.fanggangList_radio),fangGangList[1].getChildByName("text"));

 
        this.daifeng = _play.getChildByName("daifeng");
        this.daifeng.addEventListener(this._clickCB, this.daifeng); 
        this.jiachui = _play.getChildByName("jiachui");
        this.jiachui.addEventListener(this._clickCB, this.jiachui); 
        this.lianchui = _play.getChildByName("lianchui");
        this.lianchui.addEventListener(this._clickCB, this.lianchui); 
        this.lianchui.setVisible(false); // 连锤必须在加锤被选以后在能显示出来
        this.duohu = _play.getChildByName("duohu");
        this.duohu.addEventListener(this._clickCB, this.duohu); 
 

        var chipaiList = [];
        chipaiList.push(_play.getChildByName("kechipai"));
        chipaiList.push(_play.getChildByName("qingyisekechipai"));
        chipaiList.push(_play.getChildByName("doubuchi")); 



        this.chipaiList_radio = createRadioBoxForCheckBoxs(chipaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(chipaiList,0,this.chipaiList_radio),chipaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(chipaiList,1,this.chipaiList_radio),chipaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(chipaiList,2,this.chipaiList_radio),chipaiList[2].getChildByName("text")); 

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

        //  this.schedule(function(sender,type)
        // {
        //     var index = this.maxPlayerList_radio.getSelectIndex();
        //     if (MjClient.MaxPlayerNum != 4 - index)
        //     {
        //         MjClient.MaxPlayerNum = 4 - index;
        //         this.changeAAPayForPlayerNum();
        //     }

        // },0.1);

        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text"); 
                // 点的哪个设为设置为应该有的状态，如果不等于点的那个设为false
                // 可吃可听只能单选，且能都取消
                if(sender.getName() == "qingyisekechipai" || sender.getName() == "kechipai"){
                    var node = sender.getParent();
                    var resetName = ["qingyisekechipai","kechipai"];
                    for (var index in resetName) { 
                        if(sender.getName() !== resetName[index]){ 
                            var temp = node.getChildByName(resetName[index]);
                            temp.setSelected(false);
                            // temp.setBright(false); 
                            temp.getChildByName("text").setTextColor(cc.color(68,51,51));
                            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                            {
                                temp.getChildByName("text").setTextColor(cc.color(149,69,0));
                            }
                        }
                    }  
                } 
                // 如果单点加锤会先显示连锤按钮
                if(sender.getName() == "jiachui"){ 
                    var pro = sender.getParent();
                    var lianchui = pro.getChildByName("lianchui");
                    lianchui.setVisible(sender.isSelected());
                    if(!sender.isSelected()){ 
                        lianchui.setSelected(false); 
                        var protxt = lianchui.getChildByName("text"); 
                        protxt.setTextColor(cc.color(68,51,51));
                        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                        {
                            protxt.setTextColor(cc.color(149,69,0));
                        }
                    }  
                }

                if(sender.isSelected()){
                    txt.setTextColor(cc.color(211,38,14));
                }else{
                    txt.setTextColor(cc.color(68,51,51));
                }

                if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG)
                {
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(76,126,0));
                    }else{
                        txt.setTextColor(cc.color(149,69,0));
                    }
                }

                
                break;
        }
    },

    _clickEvent: function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            var tag = sender.tag;
            if(tag == 1){
                // this._mingZhuaDesc.visible = true;
            }else{
                // this._anZhuaDesc.visible = true;
            }
        }
      
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var list = [];

        var _play = this.bg_node.getChildByName("play");
 
        var _maxPlayer;
        if(atClub){
            _maxPlayer =  {4:0, 3:1,2:2}[this.getNumberItem("maxPlayer", 4)];
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYMJ_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer); 
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list);
         

        var _chipaiData;
        if(atClub){ 
            var index = 0;
            if(this.getBoolItem("isCanChi", true)){ 
            }else if(this.getBoolItem("isQingYiSeChi", false)){
                index = 1;
            }else{
                index = 2;
            }
            _chipaiData = index; 
        }else{
            _chipaiData = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYMJ_chipaiData, 0);
        }


        this.chipaiList_radio.selectItem(_chipaiData);
        var chipaiList = []; 
        chipaiList.push(_play.getChildByName("kechipai"));
        chipaiList.push(_play.getChildByName("qingyisekechipai"));
        chipaiList.push(_play.getChildByName("doubuchi")); 
        this.radioBoxSelectCB(_chipaiData,chipaiList[_chipaiData],chipaiList); 


        var _zhuaNiao;
        if(atClub){
            // zhuaniao 
            var index = this.getNumberItem("zhuaniao", 0);
            _zhuaNiao = [2, 3, 4, 6,8,0,1].indexOf(index);
        }else{
            _zhuaNiao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYMJ_zhuaniao, 0);
        }

        this.zhuaniaoList_radio.selectItem(_zhuaNiao);
        var zhuaNiaoList = []; 
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType3"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType4"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType5"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType6"));
        zhuaNiaoList.push(_play.getChildByName("zhuaniaoType7"));
        this.radioBoxSelectCB(_zhuaNiao,zhuaNiaoList[_zhuaNiao],zhuaNiaoList); 


        // 放杠出分方式
        var _fangGang;
        if(atClub){
            _fangGang = this.getNumberItem("fangGangType", 0);
        }else{
            _fangGang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYMJ_fangGang, 0);
        }

        this.fanggangList_radio.selectItem(_fangGang);

        var fangGangList = [];
        fangGangList.push(_play.getChildByName("douchu"));
        fangGangList.push(_play.getChildByName("fanggang"));
        this.radioBoxSelectCB(_fangGang,fangGangList[_fangGang],fangGangList); 

  

        function changeTextColor(node){
            var txt = node.getChildByName("text");
            if(node.isSelected()){
                txt.setTextColor(cc.color(211,38,14));
            }else{
                txt.setTextColor(cc.color(68,51,51));
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                if(node.isSelected()){
                    txt.setTextColor(cc.color(76,126,0));
                }else{
                    txt.setTextColor(cc.color(149,69,0));
                }
            }
        }
    
        var _daiFeng;
        var _duoHu;
        var _jiaChui;
        var _lianChui;


        // var _keChiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_kechipai, false);
        // var _qingyise_kechipai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_qingyise_kechipai, false); 

        if(atClub){
            _daiFeng = this.getBoolItem("isDaiFeng", false);
            _jiaChui = this.getBoolItem("isJiaChui", false);
            _lianChui = this.getBoolItem("isLianChui", false);  
            _duoHu = this.getBoolItem("syDuoHu", true); 
        }else{
            _daiFeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_daifeng, false);
            _duoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_duohu, true);
            _jiaChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_jiachui, false);
            _lianChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYMJ_lianChui, false);
        }

        this.daifeng.setSelected(_daiFeng); 
        this.jiachui.setSelected(_jiaChui);
        this.lianchui.setSelected(_lianChui);
        this.duohu.setSelected(_duoHu); 
        // this.kechipai.setSelected(_keChiPai);
        // this.qingyise_kechipai.setSelected(_qingyise_kechipai); 
        changeTextColor(this.daifeng);
        changeTextColor(this.jiachui); 
        changeTextColor(this.lianchui); 
        changeTextColor(this.duohu); 

        if(_jiaChui){
            this.lianchui.setVisible(true);
        }

        // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            var _jieSuanDiFen;
            if(atClub){
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYMJ_jiesuan_difen,1);
            }
            var score = this.bg_node.getParent().getChildByName("score");
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);
        } 
  
        this.setExtraPlayNodeCurrentSelect(atClub);
        
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var zhuaniao = this.zhuaniaoList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.SHAO_YANG_MA_JIANG;
        para.maxPlayer = [4, 3, 2][this.maxPlayerList_radio.getSelectIndex()];
        para.zhuaniao = [2, 3, 4, 6,8,0,1][zhuaniao];
        para.isDaiFeng = this.daifeng.isSelected();
        para.isJiaChui = this.jiachui.isSelected();
        para.isCanChi = this.chipaiList_radio.getSelectIndex() === 0;
        para.isQingYiSeChi = this.chipaiList_radio.getSelectIndex() === 1; 
        para.isLianChui = this.jiachui.isSelected() && this.lianchui.isSelected(); 
        para.fangGangType = this.fanggangList_radio.getSelectIndex(); // 放杠方式
        para.syDuoHu = this.duohu.isSelected();

        var score = this.bg_node.getParent().getChildByName("score"); 
        para.jieSuanDiFen = Number(score.getString());
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_jiesuan_difen,para.jieSuanDiFen);
  
        this.getExtraSelectedPara(para);
        // cc.log("data = " + this.localStorageKey.KEY_SYMJ_zhuaniao);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_maxPlayer, this.maxPlayerList_radio.getSelectIndex());  
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_zhuaniao, zhuaniao);  
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_chipaiData, this.chipaiList_radio.getSelectIndex());  
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_fangGang, this.fanggangList_radio.getSelectIndex()); 
 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_daifeng, this.daifeng.isSelected()); 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_jiachui, this.jiachui.isSelected());  
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_lianChui, this.lianchui.isSelected()); 


        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_kechipai, this.kechipai.isSelected()); 
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_qingyise_kechipai, this.qingyise_kechipai.isSelected());  
      
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
            var zhuaniao = this.zhuaniaoList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_zhuaniao, zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_chipaiData, this.chipaiList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYMJ_fangGang, this.fanggangList_radio.getSelectIndex());

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_daifeng, this.daifeng.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_duohu, this.duohu.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_jiachui, this.jiachui.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYMJ_lianChui, this.lianchui.isSelected());
        }

    },
    // changeAAPayForPlayerNum:function()
    // {
    //     // var majiang = MjClient.data.gameInfo.js3mj;
    //     // if(4 > MjClient.MaxPlayerNum){
    //     //     this.fangzhuPay = {pay4:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ]};
    //     //     this.AAPay = {pay4:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaHiangAA' +  MjClient.MaxPlayerNum ]};
    //     // }else{
    //     //     this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
    //     //     this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
    //     // }

    //     // this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
    //     // this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
    //     this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    // }

    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_symj();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_symj();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_symj();
    },

    setDiaNumData_symj : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
         
    }


});