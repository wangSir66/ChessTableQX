
var CreateRoomNode_HYShiWuHu = CreateRoomNode.extend({
    initAll:function()
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_HYShiWuHu_bihu         = "_HYShiWuHu_bihu";        //胡法
            this.localStorageKey.KEY_HYShiWuHu_xingType     = "_HYShiWuHu_xingType";    //翻醒
            this.localStorageKey.KEY_HYShiWuHu_difenType    = "_HYShiWuHu_difenType";   //底分2分
            this.localStorageKey.KEY_HYShiWuHu_hongdianhei  = "_HYShiWuHu_hongdianhei"; //红黑胡
            this.localStorageKey.KEY_HYShiWuHu_zimodouble   = "_HYShiWuHu_zimodouble";  //自摸翻倍
            this.localStorageKey.KEY_HYShiWuHu_isAlldemit   = "_HYShiWuHu_isAlldemit";  //解散需所有人同意
            this.localStorageKey.KEY_HYShiWuHu_qipai        = "_HYShiWuHu_qiepai";      //切牌
            this.localStorageKey.KEY_HYShiWuHu_yiwushi      = "_HYShiWuHu_yiwushi";     //一五十
            this.localStorageKey.KEY_HYShiWuHu_zhuangJia    = "_HYShiWuHu_zhuangJia";   //庄家
        }

        this.setExtraKey({
            jieSuanDiFen: "_HYShiWuHu_JIE_SUAN_DI_FEN",  //积分底分
        });
        this.localStorageKey.KEY_HYShiWuHu_FAN_BEI      = "_HYShiWuHu_TY_FAN_BEI";  //是否大结算翻倍
        this.localStorageKey.KEY_HYShiWuHu_diFen        = "_HYShiWuHu_diFen";       //大结算翻倍

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYSHK12,  pay8:majiang.roundHYSHK8,  pay16:majiang.roundHYSHK16};
        // this.AAPay      = {pay4:majiang.roundHYSHKAA12,pay8:majiang.roundHYSHKAA8,pay16:majiang.roundHYSHKAA16};
        // this.clubPay    = {pay4:majiang.roundHYSHKCL12,pay8:majiang.roundHYSHKCL8,pay16:majiang.roundHYSHKCL16};

        // this.roundNumObj = {roundNum1:10, roundNum2:16, roundNum3:20};

        this.bg_node = ccs.load("bg_hyShiWuHu.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiWuHu");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var bihuList = [];
        bihuList.push(_play.getChildByName("youhubihu"));
        bihuList.push(_play.getChildByName("dianpaobihu"));
        bihuList.push(_play.getChildByName("nullhu"));
        this.bihuList_radio = createRadioBoxForCheckBoxs(bihuList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(bihuList,0,this.bihuList_radio),bihuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,1,this.bihuList_radio),bihuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,2,this.bihuList_radio),bihuList[2].getChildByName("text"));

        var xingTypeList = [];
        xingTypeList.push(_play.getChildByName("play_budaixing"));
        xingTypeList.push(_play.getChildByName("play_genxing"));
        xingTypeList.push(_play.getChildByName("play_fanxing"));
        this.xingTypeList_radio = createRadioBoxForCheckBoxs(xingTypeList,this.radioBoxSelectCB,0);
        cc.eventManager.addListener(this.setTextClick(xingTypeList,0,this.xingTypeList_radio),xingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,1,this.xingTypeList_radio),xingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,2,this.xingTypeList_radio),xingTypeList[2].getChildByName("text"));

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("shouJuFangZhuZhuang"));
        zhuangJiaList.push(_play.getChildByName("shouJuSuiJiZhuang"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        this.suanfen = _play.getChildByName("play_erfen");
        this.suanfen.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.suanfen.getChildByName("text"));
        this.suanfen.addEventListener(this._clickCB, this.suanfen);

        this.hongdianhei = _play.getChildByName("hongdianhei");
        this.hongdianhei.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.hongdianhei.getChildByName("text"));
        this.hongdianhei.addEventListener(this._clickCB, this.hongdianhei);

        this.zimodouble = _play.getChildByName("zimodouble");
        this.zimodouble.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.zimodouble.getChildByName("text"));
        this.zimodouble.addEventListener(this._clickCB, this.zimodouble);

        this.isAlldemit = _play.getChildByName("dissolve_all");
        this.isAlldemit.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.isAlldemit.getChildByName("text"));
        this.isAlldemit.addEventListener(this._clickCB, this.isAlldemit);

        this.yiwushi = _play.getChildByName("yiwushi");
        cc.eventManager.addListener(this.setTextClick(),this.yiwushi.getChildByName("text"));
        this.yiwushi.addEventListener(this._clickCB.bind(this), this.yiwushi);

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

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
            this.fanBei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanBei_radio, function (index,sender) {
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
        
        this.initExtraPlayNode(_play);
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

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color("#d21400"));
                    }else{
                        txt.setTextColor(cc.color("#255662"));
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _bihu;
        if(atClub)
            _bihu = this.getNumberItem("bihuType",0);
        else
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_bihu, 0); 
        
        this.bihuList_radio.selectItem(_bihu);
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        list.push(_play.getChildByName("nullhu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);

        var _xingType;
        if(atClub)
            _xingType = this.getNumberItem("xingType",0);
        else
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_xingType, 0);

        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _suanfen;
        if(atClub)
            _suanfen = this.getBoolItem("isErfen",false);
        else
            _suanfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_difenType, false);

        this.suanfen.setSelected(_suanfen);
        var txt = this.suanfen.getChildByName("text");
        if(_suanfen){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongdianhei;
        if(atClub)
            _hongdianhei = this.getBoolItem("isHongheidian",false);
        else
            _hongdianhei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_hongdianhei, false);

        this.hongdianhei.setSelected(_hongdianhei);
        var txt = this.hongdianhei.getChildByName("text");
        if(_hongdianhei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _zimodouble;
        if(atClub)
            _zimodouble = this.getBoolItem("isZiMoRate",true);
        else
            _zimodouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_zimodouble, true);

        this.zimodouble.setSelected(_zimodouble);
        var txt = this.zimodouble.getChildByName("text");
        if(_zimodouble){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _isAlldemit;
        if(atClub)
            _isAlldemit = this.getBoolItem("isAlldemit",true);
        else
            _isAlldemit = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_isAlldemit, false);

        this.isAlldemit.setSelected(_isAlldemit);
        var txt = this.isAlldemit.getChildByName("text");
        if(_isAlldemit){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiwushi;
        if(atClub)
            _yiwushi = this.getBoolItem("isYiwushi", false);
        else
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYShiWuHu_yiwushi, false); 

        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(_yiwushi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_qipai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard)
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var zhuangJia;
        if (atClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_zhuangJia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);

        // var _diFen;
        // if (atClub){
        //     _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        // }else{
        //     var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, -1);
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
        if (this.fanBei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            //兼容老俱乐部
            if (atClub) {
                fanBeiScore = this.getNumberItem("diFen", -1);
                fanBeiOption = fanBeiScore == -1 ? 0 : 1;
                fanBeiScore = fanBeiScore == -1 ? util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, 10) : fanBeiScore;
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_FAN_BEI, -1);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, -1);
                fanBeiOption = fanBeiOption == -1 && fanBeiScore != -1 ? 1 : fanBeiOption; 
            }
            fanBeiOption = fanBeiOption == -1 ? 0 : fanBeiOption;
            fanBeiScore = fanBeiScore == -1 ? 10 : fanBeiScore;

            this.fanBei_radio.selectItem(fanBeiOption);
            if(fanBeiScore == 10000){
                this.nodeListFanBei[1].getChildByName("score").setString("不限分");
                this.curScore = 5;
            }else{
                this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
                this.curScore = fanBeiScore;
            }
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        //this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HENG_YANG_SHIWUHUXI;
        para.maxPlayer = 3;//人数
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡 2:无点炮
        para.xingType = this.xingTypeList_radio.getSelectIndex();//醒 0：不带醒 1：随醒     2：翻醒
        para.isErfen = this.suanfen.isSelected();//底分2分
        para.isHongheidian = this.hongdianhei.isSelected();//红黑胡
        para.isZiMoRate = this.zimodouble.isSelected();//自摸翻倍
        para.isAlldemit = this.isAlldemit.isSelected();//解散须全部人同意
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.isYiwushi = this.yiwushi.isSelected();
        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();

        if (this.fanBei_radio) {
            if(this.nodeListFanBei[1].getChildByName("score").getString() == "不限分"){
                var fanBeiScore = 10000;
            }else{
                var fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            }
            fanBeiOption = this.fanBei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_xingType, para.xingType);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_difenType, para.isErfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_hongdianhei, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_zimodouble, para.isZiMoRate);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_isAlldemit, para.isAlldemit);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_qipai, this.cutCardList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYShiWuHu_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_zhuangJia, para.zhuangJia);
        }

        // 大结算翻倍
        if (this.fanBei_radio) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_FAN_BEI, fanBeiOption);
        }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYShiWuHu_diFen, fanBeiScore);

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang['roundHYSHK4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHK8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHK16P' +  MjClient.MaxPlayerNum ]};
        // this.AAPay = {pay4:majiang['roundHYSHKAA4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHKAA8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHKAA16P' +  MjClient.MaxPlayerNum ]};
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});