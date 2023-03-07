
var CreateRoomNode_NanXianGuiHuZi = CreateRoomNode.extend({

    setKey:function()
    {
        this.localStorageKey.KEY_NanXianGuiHuZi_maxPlayer    = "_NanXianGuiHuZi_maxPlayer";                       //几人玩
        this.localStorageKey.KEY_NanXianGuiHuZi_maiPai20     = "_NanXianGuiHuZi_maiPai20";                            //埋牌20
        this.localStorageKey.KEY_NanXianGuiHuZi_maiPaiType     = "_NanXianGuiHuZi_maiPaiType";                            //埋牌方式  0：不埋   1：埋10  2：埋20
        this.localStorageKey.KEY_NanXianGuiHuZi_mingTang     = "_NanXianGuiHuZi_mingTang ";                    //名堂
        this.localStorageKey.KEY_NanXianGuiHuZi_shouQianShou     = "_NanXianGuiHuZi_shouQianShou";              //手牵手
        this.localStorageKey.KEY_NanXianGuiHuZi_beiKaoBei     = "_NanXianGuiHuZi_beiKaoBei";                        //背靠背
        this.localStorageKey.KEY_NanXianGuiHuZi_chiBuChao2     = "_NanXianGuiHuZi_chiBuChao2";                              //吃不超过2次
        this.localStorageKey.KEY_NanXianGuiHuZi_qiePai    = "_NanXianGuiHuZi_qiePai";                             //切牌
        this.localStorageKey.KEY_NanXianGuiHuZi_fanbei                    = "_NanXianGuiHuZi_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore              = "_NanXianGuiHuZi_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_NanXianGuiHuZi_difen                 =  "_NanXianGuiHuZi_difen"; //底分
        this.localStorageKey.KEY_NanXianGuiHuZi_tuoGuan  = "_NanXianGuiHuZi_tuoGuan";                             // 托管
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bgNode = ccs.load("bg_nanXianGuiHuZi.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("back");
        var view = this.bg_node.getChildByName("view");
        this.bg_nodeView = this.bgNode.getChildByName("back").getChildByName("view");
        // view.setTouchEnabled(false);
        // if(this._isRoomCardMode){
        //     //房卡模式的创建ui处理过
        //     view.setTouchEnabled(true);
        // }
    },

    changePayForPlayerNum:function (index) {
        this.setDiaNumData(this.bg_node);
        var curMaxPlayerSelect = this.maxPlayerList_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
             cc.each(this.maiPaiList,function(node, key){
                if(curMaxPlayerSelect == 0){
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
            this.maiPai20.visible = index == 0 ? false : true;
         }
    },

    initMaiPaiNode: function(_play){
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
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
             this.maiPai20 = _play.getChildByName("maiPai20");
            this.addListenerText(this.maiPai20);
            this.maiPai20.addEventListener(this.clickCB_NanXianGuiHuZi, this.maiPai20);
        }
    },


    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("view").getChildByName("play");
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		this.initPlayNumNode(maxPlayerList, [3, 2, 3]);
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.changePayForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;

        this.initMaiPaiNode(_play);

        this.shouQianShou = _play.getChildByName("shouQianShou");
        this.addListenerText(this.shouQianShou);
        this.shouQianShou.addEventListener(this.clickCB_NanXianGuiHuZi, this.shouQianShou);

        this.beiKaoBei = _play.getChildByName("beiKaoBei");
        this.addListenerText(this.beiKaoBei);
        this.beiKaoBei.addEventListener(this.clickCB_NanXianGuiHuZi, this.beiKaoBei);

        this.chiBuChao2 = _play.getChildByName("chiBuChao2");
        this.addListenerText(this.chiBuChao2);
        this.chiBuChao2.addEventListener(this.clickCB_NanXianGuiHuZi, this.chiBuChao2);

        var mingTang = [];
        mingTang.push(_play.getChildByName("xiaoZhuoBan"));
        mingTang.push(_play.getChildByName("daZhuoBan"));
        this.mingTang_radio = createRadioBoxForCheckBoxs(mingTang, this.radioBoxSelectCB);
        this.addListenerText(mingTang,this.mingTang_radio);
        this.mingTang = mingTang;

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("qiePai1"));
        qiePaiList.push(_play.getChildByName("qiePai2"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

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
        this._ZhuNum = this.bg_node.getChildByName("jieSuanDiFen").getChildByName("text_diFen");
        if (this._ZhuNum) {
            // this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getChildByName("jieSuanDiFen").getChildByName("btn_sub");
            this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
            this.difenIndex = 0;
            var _this = this;
            this._Button_sub.addClickEventListener(function(sender) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);
            this._Button_add = this.bg_node.getChildByName("jieSuanDiFen").getChildByName("btn_add");
            this._Button_add.addClickEventListener(function(sender) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);

            if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()) {
                this.jieSuanDiFen = this.bg_node.getChildByName("jieSuanDiFen");
                this.useYueYangUIV3_ziPai();
            }
        }

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                var pos = touch.getLocation();
                pos = btn_tuoGuanTip.parent.convertToNodeSpace(pos);
                if (tuoGuanTip.isVisible() && !cc.rectContainsPoint(btn_tuoGuanTip.getBoundingBox(), pos)) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);
    },

    clickCB_NanXianGuiHuZi:function(sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                if (sender.isSelected()) {
                    txt.setTextColor(CREATEROOM_COLOR_1);
                } else {
                    txt.setTextColor(CREATEROOM_COLOR_3);
                }
                break;
        }
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    setPlayNodeCurrentSelect:function(isClub)
    { 
        var maxPlayer;
        if (isClub)
            maxPlayer = [3, 2, 3].indexOf(this.getNumberItem("maxPlayer", 3));
        else
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer,this.maxPlayerList[maxPlayer],this.maxPlayerList);


        var isMaiPai20;
        if (isClub)
            isMaiPai20 = this.getBoolItem("maiPai20", false);
        else
            isMaiPai20 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_maiPai20, false);

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            var maiPaiType;
            if(isClub)
                maiPaiType = this.getNumberItem("maiPaiType", 2);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_maiPaiType, 2);

            if(!isMaiPai20) maiPaiType = 0;
            if(isMaiPai20 && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            this.maiPai20.setSelected(isMaiPai20);
            var text = this.maiPai20.getChildByName("text");
            this.selectedCB(text,isMaiPai20);
        }

        var shouQianShou;
        if (isClub)
            shouQianShou = this.getBoolItem("shouQianShou", false);
        else
            shouQianShou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_shouQianShou, false);
        this.shouQianShou.setSelected(shouQianShou);
        var text = this.shouQianShou.getChildByName("text");
        this.selectedCB(text,shouQianShou);

        var beiKaoBei;
        if (isClub)
            beiKaoBei = this.getBoolItem("beiKaoBei", false);
        else
            beiKaoBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_beiKaoBei, false);
        this.beiKaoBei.setSelected(beiKaoBei);
        var text = this.beiKaoBei.getChildByName("text");
        this.selectedCB(text,beiKaoBei);

        var chiBuChao2;
        if (isClub)
            chiBuChao2 = this.getBoolItem("chiBuChao2", false);
        else
            chiBuChao2 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_chiBuChao2, false);
        this.chiBuChao2.setSelected(chiBuChao2);
        var text = this.chiBuChao2.getChildByName("text");
        this.selectedCB(text,chiBuChao2);

        var mingTang;
        if (isClub)
            mingTang = this.getNumberItem("mingTang", 0);
        else
            mingTang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_mingTang, 0);
        this.mingTang_radio.selectItem(mingTang);
        this.radioBoxSelectCB(mingTang,this.mingTang[mingTang],this.mingTang);

        var qiePai;
        if (isClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        var diFen;
        if (isClub){
            diFen = this.getNumberItem("difen", 1);
        }else {
            diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_difen, 1);
        }
        this.difenIndex = this.difenAry.indexOf(diFen);
        if (this.difenIndex < 0) this.difenIndex = 1;
        if (this._ZhuNum)
            this._ZhuNum.setString(this.difenAry[this.difenIndex] + "");


        var tuoGuan;
        if (isClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum(maxPlayer);
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){self.changePayForPlayerNum()})));
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.NAN_XIAN_GUI_HU_ZI;
        para.maxPlayer = [3, 2, 3][this.maxPlayerList_radio.getSelectIndex()];     // 人数
        para.convertible = this.maxPlayerList_radio.getSelectIndex() == 2;  // 自由人数
        para.shouQianShou = this.shouQianShou.isSelected();
        para.beiKaoBei = this.beiKaoBei.isSelected();
        para.chiBuChao2 = this.chiBuChao2.isSelected();

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.maiPaiType = this.maiPaiList_radio.getSelectIndex();
            para.maiPai20 = para.maiPaiType > 0;
        }else{
            para.maiPai20 = this.maiPai20.isSelected();
        }

        if(this.maxPlayerList_radio.getSelectIndex() == 0)
            para.maiPai20 = false;

        para.mingTang = this.mingTang_radio.getSelectIndex();
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.difen = this.difenAry[this.difenIndex];                   // 底分
        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_mingTang, para.mingTang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_maiPai20, para.maiPai20);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_maiPaiType, para.maiPaiType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_shouQianShou, para.shouQianShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_beiKaoBei, para.beiKaoBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_chiBuChao2, para.chiBuChao2);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_difen, para.difen);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NanXianGuiHuZi_qiePai, para.isManualCutCard);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbei , para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_fanbeiscore, para.fanBeiScore);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NanXianGuiHuZi_tuoGuan, para.trustTime);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
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
    }

});