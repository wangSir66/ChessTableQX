/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_ningXiangKaiWang = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_ningXiangKaiWang_playerCount     =  "_ningXiangKaiWang_COUNT_PLAYER";           //人数   

        this.localStorageKey.KEY_ningXiangKaiWang_daHuFengDing    =  "_ningXiangKaiWang_PLAYWAY_daHuFengDing";   //大胡封顶
        this.localStorageKey.KEY_ningXiangKaiWang_onlyZimoHu      =  "_ningXiangKaiWang_PLAYWAY_onlyZimoHu";     //是否只能自摸胡 
        this.localStorageKey.KEY_ningXiangKaiWang_kingNum         =  "_ningXiangKaiWang_PLAYWAY_kingNum";        //王数
        this.localStorageKey.KEY_ningXiangKaiWang_kaiGangHuTwice  =  "_ningXiangKaiWang_PLAYWAY_kaiGangHuTwice"; //是否开杠可胡2张 
        this.localStorageKey.KEY_ningXiangKaiWang_canChi          =  "_ningXiangKaiWang_PLAYWAY_canChi";         //是否可以吃 
        this.localStorageKey.KEY_ningXiangKaiWang_chouPai         =  "_ningXiangKaiWang_PLAYWAY_chouPai";        //是否抽牌40张 

        this.localStorageKey.KEY_ningXiangKaiWang_niaoType        =  "_ningXiangKaiWang_NIAO_WAY";               //鸟的方式
        this.localStorageKey.KEY_ningXiangKaiWang_niaoNum         =  "_ningXiangKaiWang_NIAO_NUM";               //鸟的数量
        this.localStorageKey.KEY_ningXiangKaiWang_isPiaoNiao      =  "_ningXiangKaiWang_ISPIAONIAO";             //是否飘鸟
        this.localStorageKey.KEY_ningXiangKaiWang_isOpenTingTip   =  "_ningXiangKaiWang_isOpenTingTip";          //是否开启听牌提示
        this.localStorageKey.KEY_ningXiangKaiWang_ZuoYa           =  "_ningXiangKaiWang_ZuoYa";                  //坐压
        this.localStorageKey.KEY_ningXiangKaiWang_difen           =  "_ningXiangKaiWang_DI_FEN";                 //底分
        this.localStorageKey.KEY_ningXiangKaiWang_tuoguan         =  "_ningXiangKaiWang_TUO_GUAN";               //托管

        this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI         = "_ningXiangKaiWang_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI_SCORE   = "_ningXiangKaiWang_FAN_BEI_SCORE";  //少于X分大结算翻倍

    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum1:8,roundNum2:16};

        this.bg_node = ccs.load("bg_ningXiangKaiWang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_ningXiangKaiWang").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _bgningXiangKaiWangNode = this.bg_node;
        var _play = _bgningXiangKaiWangNode.getChildByName("play");

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

        //大胡封顶否
        var daHuFengDingList = [];
        daHuFengDingList.push(_play.getChildByName("play_dahufengding"));
        daHuFengDingList.push(_play.getChildByName("play_dahubufengding"));
        this.daHuFengDingList_radio = createRadioBoxForCheckBoxs(daHuFengDingList, this.radioBoxSelectCB);
        this.addListenerText(daHuFengDingList, this.daHuFengDingList_radio);
        this.daHuFengDingList = daHuFengDingList;

        //是否只能自摸胡
        this._play_onlyZimoHu = _play.getChildByName("play_onlyzimohu");
        cc.eventManager.addListener(this.setTextClick(),this._play_onlyZimoHu.getChildByName("text"));
        this._play_onlyZimoHu.addEventListener(this._clickCB, this._play_onlyZimoHu);

        //王数
        var kingNumList = [];
        kingNumList.push(_play.getChildByName("play_shuangwang"));
        kingNumList.push(_play.getChildByName("play_danwang"));
        this.kingNumList_radio = createRadioBoxForCheckBoxs(kingNumList, this.radioBoxSelectCB);
        this.addListenerText(kingNumList, this.kingNumList_radio);
        this.kingNumList = kingNumList;

        //是否开杠可胡2张 
        this._play_kaiGangHuTwice = _play.getChildByName("play_kaiganghu2zhang");
        cc.eventManager.addListener(this.setTextClick(),this._play_kaiGangHuTwice.getChildByName("text"));
        this._play_kaiGangHuTwice.addEventListener(this._clickCB, this._play_kaiGangHuTwice);

        //是否可以吃 
        this._play_canChi = _play.getChildByName("play_canchi");
        cc.eventManager.addListener(this.setTextClick(),this._play_canChi.getChildByName("text"));
        this._play_canChi.addEventListener(this._clickCB, this._play_canChi);

        //是否抽牌40张 
        this._play_chouPai = _play.getChildByName("play_choupai40zhang");
        cc.eventManager.addListener(this.setTextClick(),this._play_chouPai.getChildByName("text"));
        this._play_chouPai.addEventListener(this._clickCB, this._play_chouPai);

        //鸟的方式
        var niaoTypeList = [];
        niaoTypeList.push(_play.getChildByName("zhuaniao_jiabei"));
        niaoTypeList.push(_play.getChildByName("zhuaniao_jiafen"));
        this.niaoTypeList_radio = createRadioBoxForCheckBoxs(niaoTypeList, this.radioBoxSelectCB);
        this.addListenerText(niaoTypeList, this.niaoTypeList_radio);
        this.niaoTypeList = niaoTypeList;

        //鸟的数量
        var niaoNumList = [];
        niaoNumList.push(_play.getChildByName("zhuaniao_0"));
        niaoNumList.push(_play.getChildByName("zhuaniao_1"));
        niaoNumList.push(_play.getChildByName("zhuaniao_2"));
        niaoNumList.push(_play.getChildByName("zhuaniao_4"));
        niaoNumList.push(_play.getChildByName("zhuaniao_6"));
        this.niaoNum_radio = createRadioBoxForCheckBoxs(niaoNumList, this.radioBoxSelectCB_ningxiangkaiwang.bind(this));
        this.addListenerText(niaoNumList, this.niaoNum_radio, this.checkSelect_ningxiangkaiwang.bind(this));
        this.niaoNumList = niaoNumList;

        //是否飘鸟
        this._play_isPiaoNiao = _play.getChildByName("zhuaniao_piaoniao");
        cc.eventManager.addListener(this.setTextClick(),this._play_isPiaoNiao.getChildByName("text"));
        this._play_isPiaoNiao.addEventListener(this._clickCB, this._play_isPiaoNiao);

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

        //坐压
        var zuoyaList = [];
        zuoyaList.push(_play.getChildByName("zuoya_0"));
        zuoyaList.push(_play.getChildByName("zuoya_1"));
        zuoyaList.push(_play.getChildByName("zuoya_2"));
        zuoyaList.push(_play.getChildByName("zuoya_3"));
        this.zuoya_radio = createRadioBoxForCheckBoxs(zuoyaList, this.radioBoxSelectCB);
        this.addListenerText(zuoyaList, this.zuoya_radio);
        this.zuoyaList = zuoyaList;

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

    radioBoxSelectCB_ningxiangkaiwang : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect_ningxiangkaiwang();
    },

    checkSelect_ningxiangkaiwang : function(){
        this._play_canChi.visible = this._playNode_playerCount_radio.getSelectIndex() == 2;
        this._play_chouPai.visible = this._play_canChi.visible;
        
        this.niaoTypeList[0].visible = this.niaoNum_radio.getSelectIndex() != 0;
        this.niaoTypeList[1].visible = this.niaoTypeList[0].visible;
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
            indexCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_playerCount, 0); 
        } 
        this._playNode_playerCount_radio.selectItem(indexCount);  
        this.radioBoxSelectCB(indexCount,listCount[indexCount],listCount); 


        var _fengding;
        if(isClub){
            _fengding = this.getNumberItem("fengding", 0);
        }else{
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_daHuFengDing, 0);
        }
        this.daHuFengDingList_radio.selectItem(_fengding);
        this.radioBoxSelectCB(_fengding, this.daHuFengDingList[_fengding], this.daHuFengDingList);

        var _mustzimo;
        if(isClub){
            _mustzimo = this.getNumberItem("mustzimo", 0) == 1;
        }else{
            _mustzimo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_onlyZimoHu, false);
        }
        this._play_onlyZimoHu.setSelected(_mustzimo);
        var txt = this._play_onlyZimoHu.getChildByName("text");
        if(_mustzimo){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _wangCount;
        if(isClub){
            _wangCount = [2,1].indexOf(this.getNumberItem("wangCount", 2));
        }else{
            _wangCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_kingNum, 0);
        }
        this.kingNumList_radio.selectItem(_wangCount);
        this.radioBoxSelectCB(_wangCount, this.kingNumList[_wangCount], this.kingNumList);

        var _huCount;
        if(isClub){
            _huCount = this.getNumberItem("huCount", 2) == 2;
        }else{
            _huCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_kaiGangHuTwice, true);
        }
        this._play_kaiGangHuTwice.setSelected(_huCount);
        var txt = this._play_kaiGangHuTwice.getChildByName("text");
        if(_huCount){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _canChi;
        if(isClub){
            _canChi = this.getBoolItem("canChi", true);
        }else{
            _canChi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_canChi, true);
        }
        this._play_canChi.setSelected(_canChi);
        var txt = this._play_canChi.getChildByName("text");
        if(_canChi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _chouPai;
        if(isClub){
            _chouPai = this.getBoolItem("chouPai", true);
        }else{
            _chouPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_chouPai, true);
        }
        this._play_chouPai.setSelected(_chouPai);
        var txt = this._play_chouPai.getChildByName("text");
        if(_chouPai){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _niaoScoreType;
        if(isClub){
            _niaoScoreType = [1,2].indexOf(this.getNumberItem("niaoScoreType", 1));
        }else{
            _niaoScoreType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_niaoType, 0);
        }
        this.niaoTypeList_radio.selectItem(_niaoScoreType);
        this.radioBoxSelectCB(_niaoScoreType, this.niaoTypeList[_niaoScoreType], this.niaoTypeList);

        var _zhuaniaoNum;
        if(isClub){
            _zhuaniaoNum = [0,1,2,4,6].indexOf(this.getNumberItem("zhuaniaoNum", 0));
        }else{
            _zhuaniaoNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_niaoNum, 0);
        }
        this.niaoNum_radio.selectItem(_zhuaniaoNum);
        this.radioBoxSelectCB(_zhuaniaoNum, this.niaoNumList[_zhuaniaoNum], this.niaoNumList);

        var _piaoniao;
        if(isClub){
            _piaoniao = this.getBoolItem("piaoniao", false);
        }else{
            _piaoniao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_isPiaoNiao, false);
        }
        this._play_isPiaoNiao.setSelected(_piaoniao);
        var txt = this._play_isPiaoNiao.getChildByName("text");
        if(_piaoniao){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_tuoguan, 0);
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

        //坐压
        var _zuoya;
        if (isClub)
            _zuoya = [0, 1, 2, 4].indexOf(this.getNumberItem("zuoYa", 0));
        else
            _zuoya = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_ZuoYa, 0);
        
        this.zuoya_radio.selectItem(_zuoya);
        this.radioBoxSelectCB(_zuoya, this.zuoyaList[_zuoya], this.zuoyaList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }


        this.checkSelect_ningxiangkaiwang();
    },

    getSelectedPara:function()
    {
        var para = {};
        var maxPlayerIndex = this._playNode_playerCount_radio.getSelectIndex();
        var kingNumIndex   = this.kingNumList_radio.getSelectIndex();
        var niaoTypeIndex  = this.niaoTypeList_radio.getSelectIndex();  
        var niaoNumIndex   = this.niaoNum_radio.getSelectIndex(); 
        var zuoyaIndex   = this.zuoya_radio.getSelectIndex();  

        para.gameType      = MjClient.GAME_TYPE.NING_XIANG_KAI_WANG;
        para.maxPlayer     = [4,3,2][maxPlayerIndex];

        para.fengding      = this.daHuFengDingList_radio.getSelectIndex();
        para.mustzimo      = this._play_onlyZimoHu.isSelected() ? 1 : 0;
        para.wangCount     = [2,1][kingNumIndex];
        para.huCount       = this._play_kaiGangHuTwice.isSelected() ? 2 : 1;
        para.canChi        = this._play_canChi.isSelected() && maxPlayerIndex == 2;
        para.chouPai       = this._play_chouPai.isSelected() && maxPlayerIndex == 2;
        
        para.niaoScoreType = [1,2][niaoTypeIndex];
        para.zhuaniaoNum   = [0,1,2,4,6][niaoNumIndex];
        para.zuoYa         = [0,1,2,4][zuoyaIndex];
        para.piaoniao      = this._play_isPiaoNiao.isSelected();
        para.difen         = this._zhuIdx;                          // 底分
        para.isOpenTingTip = this.tingTipList[0].isSelected();    

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
        this.setDiaNumData_ningXiangKaiWang();

        this.checkSelect_ningxiangkaiwang();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_ningXiangKaiWang();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_ningXiangKaiWang();
    },

    setDiaNumData_ningXiangKaiWang : function(){
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
            var maxPlayerIndex   = this._playNode_playerCount_radio.getSelectIndex();
            var kingNumIndex     = this.kingNumList_radio.getSelectIndex();
            var niaoTypeIndex    = this.niaoTypeList_radio.getSelectIndex();
            var niaoNumIndex     = this.niaoNum_radio.getSelectIndex();
            var isMustZiMo       = this._play_onlyZimoHu.isSelected();
            var isKaiGangHuTwice = this._play_kaiGangHuTwice.isSelected();
            var isCanChi         = this._play_canChi.isSelected();
            var isChouPai        = this._play_chouPai.isSelected();
            var isPiaoNiao       = this._play_isPiaoNiao.isSelected();
            var zuoyaIndex       = this.zuoya_radio.getSelectIndex();

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_playerCount, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_daHuFengDing, para.fengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_kingNum, kingNumIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_niaoType, niaoTypeIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_niaoNum, niaoNumIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_ZuoYa, zuoyaIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_onlyZimoHu, isMustZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_kaiGangHuTwice, isKaiGangHuTwice);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_canChi, isCanChi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_chouPai, isChouPai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_isPiaoNiao, isPiaoNiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningXiangKaiWang_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_tuoguan, para.trustTime);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningXiangKaiWang_FAN_BEI_SCORE, para.fanBeiScore);
            }
        }
    },
});