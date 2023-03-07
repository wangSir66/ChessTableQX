/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_anhuaMaJiangSW = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_anhuaMaJiangSW_playerCount           =  "_anhuaMaJiangSW_COUNT_PLAYER";            //人数   
        this.localStorageKey.KEY_anhuaMaJiangSW_wangdaiying           =  "_anhuaMaJiangSW_PLAYWAY_wangdaiying";     //王代硬 
        this.localStorageKey.KEY_anhuaMaJiangSW_gangkaisanzhang       =  "_anhuaMaJiangSW_PLAYWAY_gangkaisanzhang"; //杠开三张
        this.localStorageKey.KEY_anhuaMaJiangSW_fenzhuangxian         =  "_anhuaMaJiangSW_PLAYWAY_fenzhuangxian";   //分庄闲 
        this.localStorageKey.KEY_anhuaMaJiangSW_niaoType              =  "_anhuaMaJiangSW_NIAO_WAY";                //鸟的方式
        this.localStorageKey.KEY_anhuaMaJiangSW_isOpenTingTip         =  "_anhuaMaJiangSW_isOpenTingTip";           //是否开启听牌提示
        this.localStorageKey.KEY_anhuaMaJiangSW_difen                 =  "_anhuaMaJiangSW_DI_FEN";                  //底分
        this.localStorageKey.KEY_anhuaMaJiangSW_tuoguan               =  "_anhuaMaJiangSW_TUO_GUAN";                //托管
        this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI               =  "_anhuaMaJiangSW_TY_FAN_BEI";              //大结算翻倍
        this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI_SCORE         =  "_anhuaMaJiangSW_FAN_BEI_SCORE";           //少于X分大结算翻倍
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum1:8,roundNum2:16};

        this.bg_node = ccs.load("bg_anhuaMaJiang_SW.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_anhuaMaJiangSW").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _bganhuaMaJiangSWNode = this.bg_node;
        var _play = _bganhuaMaJiangSWNode.getChildByName("play");

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

        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao_0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao_1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao_2");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniao_4");
        var nodeList1 = [];
        nodeList1.push(this._playNode_niaoType_0);
        nodeList1.push(this._playNode_niaoType_1);
        nodeList1.push(this._playNode_niaoType_2);
        nodeList1.push(this._playNode_niaoType_4);
        this._niao_type_radio = createRadioBoxForCheckBoxs(nodeList1, this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(nodeList1,0,this._niao_type_radio),nodeList1[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,1,this._niao_type_radio),nodeList1[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,2,this._niao_type_radio),nodeList1[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1,3,this._niao_type_radio),nodeList1[3].getChildByName("text"));

        this._play_wangdaiying = _play.getChildByName("play_wangdaiying");
        cc.eventManager.addListener(this.setTextClick(),this._play_wangdaiying.getChildByName("text"));
        this._play_wangdaiying.addEventListener(this._clickCB, this._play_wangdaiying);

        this._play_gangkaisanzhang = _play.getChildByName("play_gangkaisanzhang");
        cc.eventManager.addListener(this.setTextClick(),this._play_gangkaisanzhang.getChildByName("text"));
        this._play_gangkaisanzhang.addEventListener(this._clickCB, this._play_gangkaisanzhang);

        this._play_fenzhuangxian = _play.getChildByName("play_fenzhuangxian");
        cc.eventManager.addListener(this.setTextClick(),this._play_fenzhuangxian.getChildByName("text"));
        this._play_fenzhuangxian.addEventListener(this._clickCB, this._play_fenzhuangxian);

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        this._playNode_tuoguanType_4 = _play.getChildByName("tuoguan4");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan4"));
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);

        this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx <= 0.1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0) {
                        var step = 0.1;

                        if (this._zhuIdx > 1)
                            step = 1;
                        else if (this._zhuIdx > 0.5)
                            step = 0.5;

                        this._zhuIdx -= step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        var step = 0.1;

                        if (this._zhuIdx >= 1)
                            step = 1;
                        else if (this._zhuIdx >= 0.5)
                            step = 0.5;

                        this._zhuIdx += step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
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
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var appType = MjClient.getAppType();

            var selectColor = MjClient.createRoomNode._selectColor;
            var unSelectColor = MjClient.createRoomNode._unSelectColor;

            if (isYongZhouProject()) {
                if(appType == MjClient.APP_TYPE.QXYZQP || appType == MjClient.APP_TYPE.BDYZPHZ){
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
                    appType == MjClient.APP_TYPE.QXLYQP){
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else if(appType == MjClient.APP_TYPE.BDHYZP) {
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else {
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
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

    _clickCB : function(sender,type){
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED: 
            case ccui.CheckBox.EVENT_UNSELECTED: 
            var txt = sender.getChildByName("text"); 
            var selectColor = MjClient.createRoomNode._selectColor;
            var unSelectColor = MjClient.createRoomNode._unSelectColor;
            if(sender.isSelected()){
                txt.setTextColor(selectColor); 
            }else{
                txt.setTextColor(unSelectColor); 
            } 
            break; 
            } 
        }, 
    setPlayNodeCurrentSelect:function(isClub) {
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;

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
            indexCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_playerCount, 0); 
        } 
        this._playNode_playerCount_radio.selectItem(indexCount);  
        this.radioBoxSelectCB(indexCount,listCount[indexCount],listCount); 

        //鸟
        var list = []; 
        list.push(this._playNode_niaoType_0); 
        list.push(this._playNode_niaoType_1); 
        list.push(this._playNode_niaoType_2); 
        list.push(this._playNode_niaoType_4); 
        var _niaoType; 
        if(isClub){
            var niaoCount = this.getNumberItem("zhuaniaoNum", 1);
            _niaoType = niaoCount == 4 ? 3 : niaoCount; 
        }else{
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_niaoType,1); 
        } 
        this._niao_type_radio.selectItem(_niaoType);
        this.radioBoxSelectCB(_niaoType,list[_niaoType],list);

        var _wangdaiying;
        if(isClub){
            _wangdaiying = this.getBoolItem("wangdaiying", true);
        }else{
            _wangdaiying = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_wangdaiying, true);
        }
        this._play_wangdaiying.setSelected(_wangdaiying);
        var txt = this._play_wangdaiying.getChildByName("text");
        if(_wangdaiying){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _gangkaisanzhang;
        if(isClub){
            _gangkaisanzhang = this.getBoolItem("gangKaiNum", false);
        }else{
            _gangkaisanzhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_gangkaisanzhang, false);
        }
        this._play_gangkaisanzhang.setSelected(_gangkaisanzhang);
        var txt = this._play_gangkaisanzhang.getChildByName("text");
        if(_gangkaisanzhang){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _fenzhuangxian;
        if(isClub){
            _fenzhuangxian = this.getBoolItem("fenZhuangXian", true);
        }else{
            _fenzhuangxian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_fenzhuangxian, true);
        }
        this._play_fenzhuangxian.setSelected(_fenzhuangxian);
        var txt = this._play_fenzhuangxian.getChildByName("text");
        if(_fenzhuangxian){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        this._playNode_tuoguanType_4.setSelected(false);
        var index = 0;
        if (_trustTime == 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime == 60) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime == 120) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime == 180) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        } else if (_trustTime == 300) {
            this._playNode_tuoguanType_4.setSelected(true);
            index = 4;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

    },

    getSelectedPara:function()
    {
        var para = {};
        var maxPlayerIndex = this._playNode_playerCount_radio.getSelectIndex();
        var niaoTypeIndex  = this._niao_type_radio.getSelectIndex();

        para.gameType      = MjClient.GAME_TYPE.AN_HUA_MA_JIANG_SW;
        para.maxPlayer     = [4,3,2][maxPlayerIndex];                 // 人数
        para.zhuaniaoNum   = [0,1,2,4][niaoTypeIndex];                // 0:不抓鸟  1：抓一鸟  2：抓2鸟  4：抓4鸟
        
        para.wangdaiying   = this._play_wangdaiying.isSelected();     //王代硬   选择为true否则为false
        para.gangKaiNum    = this._play_gangkaisanzhang.isSelected(); //杠开三张 选择为true否则为false
        para.fenZhuangXian = this._play_fenzhuangxian.isSelected();   //分庄闲   选择为true否则为false
        para.difen         = this._zhuIdx;                            // 底分
        para.isOpenTingTip = this.tingTipList[0].isSelected();        //听牌提示 选择为true否则为false

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        } else if (this._playNode_tuoguanType_4.isSelected()) {
            para.trustTime = 300;
        }

        return para;
    },
     _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_anhuaMaJiangSW();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_anhuaMaJiangSW();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_anhuaMaJiangSW();
    },

    setDiaNumData_anhuaMaJiangSW : function(){
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
            var niaoTypeIndex  = this._niao_type_radio.getSelectIndex();

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_playerCount, maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_niaoType, niaoTypeIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_wangdaiying, para.wangdaiying);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_gangkaisanzhang, para.gangKaiNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_fenzhuangxian, para.fenZhuangXian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_anhuaMaJiangSW_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_tuoguan, para.trustTime);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_anhuaMaJiangSW_FAN_BEI_SCORE, para.fanBeiScore);
            }
        }
    },
});