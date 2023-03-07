
var CreateRoomNode_YuanJiangGuiHuZi = CreateRoomNode.extend({

    setKey:function()
    {
        this.localStorageKey.KEY_YuanJiangGuiHuZi_maxPlayer    = "_YuanJiangGuiHuZi_maxPlayer";                       //几人玩
        this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai19     = "_YuanJiangGuiHuZi_maiPai19";                            //埋牌20
        this.localStorageKey.KEY_YuanJiangGuiHuZi_playType     = "_YuanJiangGuiHuZi_playType";                    //玩法
        this.localStorageKey.KEY_YuanJiangGuiHuZi_fengDing     = "_YuanJiangGuiHuZi_fengDing";              //封頂
        this.localStorageKey.KEY_YuanJiangGuiHuZi_wuXiPing     = "_YuanJiangGuiHuZi_wuXiPing";                        //无息平
        this.localStorageKey.KEY_YuanJiangGuiHuZi_diaoDiaoShou     = "_YuanJiangGuiHuZi_diaoDiaoShou";                              //吊吊手
        this.localStorageKey.KEY_YuanJiangGuiHuZi_anWaiLiu     = "_YuanJiangGuiHuZi_anWaiLiu";                  //暗歪溜
        this.localStorageKey.KEY_YuanJiangGuiHuZi_chiPai     = "_YuanJiangGuiHuZi_chiPai";                              //吃牌
        this.localStorageKey.KEY_YuanJiangGuiHuZi_qiePai    = "_YuanJiangGuiHuZi_qiePai";                             //切牌
        this.localStorageKey.KEY_YuanJiangGuiHuZi_huaHuZi     = "_YuanJiangGuiHuZi_huaHuZi";                //花胡子
        this.localStorageKey.KEY_YuanJiangGuiHuZi_jiuDuiBan     = "_YuanJiangGuiHuZi_jiuDuiBan";            //九对半
        this.localStorageKey.KEY_YuanJiangGuiHuZi_canPiao     = "_YuanJiangGuiHuZi_canPiao";            //可飘
        this.localStorageKey.KEY_YuanJiangGuiHuZi_canDiHu     = "_YuanJiangGuiHuZi_canDiHu";            //地胡
        this.localStorageKey.KEY_YuanJiangGuiHuZi_canZha     = "_YuanJiangGuiHuZi_canZha";            //炸
        this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBei      = "_YuanJiangGuiHuZi_fanBei",  //大结算翻倍
        this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBeiScore      = "_YuanJiangGuiHuZi_fanBeiScore"   //少于X分大结算翻倍
        this.localStorageKey.KEY_YuanJiangGuiHuZi_jieSuanDiFen                 =  "_YuanJiangGuiHuZi_jieSuanDiFen"; //底分
        this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai     = "_YuanJiangGuiHuZi_maiPai";                            //埋牌
        this.localStorageKey.KEY_YuanJiangGuiHuZi_tuoGuan  = "_YuanJiangGuiHuZi_tuoGuan";                             // 托管
        this.localStorageKey.KEY_YuanJiangGuiHuZi_trustWay  = "_YuanJiangGuiHuZi_trustWay";                             // 托管
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bgNode = ccs.load("bg_yuanJiangGuiHuZi.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("back");
        this.bg_nodeView = this.bgNode.getChildByName("back").getChildByName("view");
        var view = this.bg_node.getChildByName("view");
        // view.setTouchEnabled(false)
    },
    changePayForPlayerNum:function (index) {
        this.setDiaNumData(this.bg_node);
        this.maiPai19.visible = false;
        this.bg_node.getChildByName("view").getChildByName("round").getChildByName("maipai").visible = index == 0 ? false : true;
        for (var i in this.maiPaiList) {
            this.maiPaiList[i].visible = index == 0 ? false : true;
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

        _play.getChildByName("wuYingXi").setSelected(true);
        _play.getChildByName("wuYingXi").setTouchEnabled(false);
        _play.getChildByName("wuYingXi").getChildByName("text").setTextColor(CREATEROOM_COLOR_1);
        // var playTypeList = [];
        // playTypeList.push(_play.getChildByName("wuYingXi"));
        // this.playTypeList_radio = createRadioBoxForCheckBoxs(playTypeList, function(index) {
        //     this.radioBoxSelectCB(index, playTypeList[index], playTypeList);
        // }.bind(this));
        // this.addListenerText(playTypeList,this.radioBoxSelectCB);
        // this.playTypeList = playTypeList;

        this.maiPai19 = _play.getChildByName("maiPai19");
        this.addListenerText(this.maiPai19);
        this.maiPai19.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.maiPai19);

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai_0"));
        maiPaiList.push(_play.getChildByName("maipai_1"));
        maiPaiList.push(_play.getChildByName("maipai_2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList, this.radioBoxSelectCB);
        this.addListenerText(maiPaiList,this.maiPaiList_radio);
        this.maiPaiList = maiPaiList;

        var fengDingList = [];
        fengDingList.push(_play.getChildByName("xi100"));
        fengDingList.push(_play.getChildByName("xi200"));
        this.fengDingList_radio = createRadioBoxForCheckBoxs(fengDingList, this.radioBoxSelectCB);
        this.addListenerText(fengDingList,this.fengDingList_radio);
        this.fengDingList = fengDingList;

        var wuXiPingList = [];
        wuXiPingList.push(_play.getChildByName("xiPing0"));
        wuXiPingList.push(_play.getChildByName("xiPing1"));
        //this.wuXiPingList_radio = createRadioBoxForCheckBoxs(wuXiPingList, this.radioBoxSelectCB);

        this.wuXiPingList_radio = createRadioBoxForCheckBoxs(wuXiPingList, function(index){
            this.updateHuaHuZiCheckBox(index);
            this.radioBoxSelectCB(index, wuXiPingList[index], wuXiPingList);
        }.bind(this));

        this.addListenerText(wuXiPingList,this.wuXiPingList_radio, this.updateHuaHuZiCheckBox.bind(this));
        this.wuXiPingList = wuXiPingList;

        var chiPaiList = [];
        chiPaiList.push(_play.getChildByName("chiPaiWuXianZhi"));
        chiPaiList.push(_play.getChildByName("ziJieZiChi"));
        this.chiPaiList_radio = createRadioBoxForCheckBoxs(chiPaiList, this.radioBoxSelectCB);
        this.addListenerText(chiPaiList,this.chiPaiList_radio);
        this.chiPaiList = chiPaiList;

        this.diaoDiaoShou = _play.getChildByName("diaoDiaoShou");
        this.addListenerText(this.diaoDiaoShou);
        this.diaoDiaoShou.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.diaoDiaoShou);

        this.anWaiLiu = _play.getChildByName("anWaiLiu");
        this.addListenerText(this.anWaiLiu);
        this.anWaiLiu.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.anWaiLiu);

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("qiePai1"));
        qiePaiList.push(_play.getChildByName("qiePai2"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        this.jiuDuiBan = _play.getChildByName("jiuDuiBan"); //九对半
        this.addListenerText(this.jiuDuiBan);
        this.jiuDuiBan.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.jiuDuiBan);

        this.huaHuZi = _play.getChildByName("huaHuZi"); //花胡子
        this.addListenerText(this.huaHuZi);
        this.huaHuZi.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.huaHuZi);

        this.canPiao = _play.getChildByName("canPiao"); //可飘
        this.addListenerText(this.canPiao);
        this.canPiao.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.canPiao);

        this.canDiHu = _play.getChildByName("canDiHu"); //地胡
        this.addListenerText(this.canDiHu);
        this.canDiHu.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.canDiHu);

        this.canZha = _play.getChildByName("canZha"); //炸
        this.addListenerText(this.canZha);
        this.canZha.addEventListener(this.clickCB_YuanJiangGuiHuZi, this.canZha);

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
        this._zhuIdx = 1;
        this._ZhuNum = this.bg_nodeView.getParent().getChildByName("jieSuanDiFen").getChildByName("text_diFen");
        this._ZhuNum.ignoreContentAdaptWithSize(true);
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_nodeView.getParent().getChildByName("jieSuanDiFen").getChildByName("btn_sub");
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
            this._Button_add = this.bg_nodeView.getParent().getChildByName("jieSuanDiFen").getChildByName("btn_add");
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

            if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()) {
                this.jieSuanDiFen = this.bg_nodeView.getParent().getChildByName("jieSuanDiFen");
                this.useYueYangUIV3_ziPai();
            }
        }

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, (index, sender, list)=>{
            this.radioBoxSelectCB(index, sender, list);
            this.updateTrust();
        });
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

        var fangShiList = [];
        fangShiList.push(_play.getChildByName("fangShi1"));
        fangShiList.push(_play.getChildByName("fangShi2"));
        fangShiList.push(_play.getChildByName("fangShi3"));
        this.fangShiList_radio = createRadioBoxForCheckBoxs(fangShiList, this.radioBoxSelectCB);
        this.addListenerText(fangShiList,this.fangShiList_radio);
        this.fangShiList = fangShiList;
    },
    updateHuaHuZiCheckBox:function(index){
        this.huaHuZi.visible = index == 0 ? false : true;
    },
    clickCB_YuanJiangGuiHuZi:function(sender, type) {
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

    setPlayNodeCurrentSelect:function(isClub)
    {
        var maxPlayer;
        if (isClub){
            if (this.getBoolItem("convertible", false)) {
                maxPlayer = 2;
            } else {
                maxPlayer = [3, 2].indexOf(this.getNumberItem("maxPlayer", 3));
            }
        }
        else
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer,this.maxPlayerList[maxPlayer],this.maxPlayerList);

        var isMaiPai19;
        if (isClub)
            isMaiPai19 = this.getBoolItem("maiPai19", false);
        else
            isMaiPai19 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai19, false);
        this.maiPai19.setSelected(isMaiPai19);
        var text = this.maiPai19.getChildByName("text");
        this.selectedCB(text,isMaiPai19);

        var maiPaiIndex;
        var oldMaiPai = isMaiPai19 ? 2 : 0;;
        if (isClub) {
            maiPaiIndex = this.getNumberItem("maiPaiNum", oldMaiPai);
        }
        else {
            maiPaiIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai, oldMaiPai);
        }
        this.maiPaiList_radio.selectItem(maiPaiIndex);
        this.radioBoxSelectCB(maiPaiIndex,this.maiPaiList[maiPaiIndex],this.maiPaiList);
        this.updateHuaHuZiCheckBox(maiPaiIndex);

        var diaoDiaoShou;
        if (isClub)
            diaoDiaoShou = this.getBoolItem("diaoDiaoShou", true);
        else
            diaoDiaoShou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_diaoDiaoShou, true);
        this.diaoDiaoShou.setSelected(diaoDiaoShou);
        var text = this.diaoDiaoShou.getChildByName("text");
        this.selectedCB(text,diaoDiaoShou);

        var anWaiLiu;
        if (isClub)
            anWaiLiu = this.getBoolItem("anWaiLiu", false);
        else
            anWaiLiu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_anWaiLiu, false);
        this.anWaiLiu.setSelected(anWaiLiu);
        var text = this.anWaiLiu.getChildByName("text");
        this.selectedCB(text,anWaiLiu);


        var fengDing;
        if (isClub)
            fengDing = [100,200].indexOf(this.getNumberItem("fengDing", 100));
        else
            fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fengDing, 0);
        this.fengDingList_radio.selectItem(fengDing);
        this.radioBoxSelectCB(fengDing,this.fengDingList[fengDing],this.fengDingList);

        var wuXiPing;
        if (isClub)
            wuXiPing = this.getNumberItem("wuXiPing", 0);
        else
            wuXiPing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_wuXiPing, 0);
        this.wuXiPingList_radio.selectItem(wuXiPing);
        this.radioBoxSelectCB(wuXiPing,this.wuXiPingList[wuXiPing],this.wuXiPingList);
        this.updateHuaHuZiCheckBox(wuXiPing);

        var chiPai;
        if (isClub)
            chiPai = this.getNumberItem("chiPai", 0);
        else
            chiPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_chiPai, 0);
        this.chiPaiList_radio.selectItem(chiPai);
        this.radioBoxSelectCB(chiPai,this.chiPaiList[chiPai],this.chiPaiList);

        // var playType;
        // if (isClub)
        //     playType = this.getNumberItem("playType", 0);
        // else
        //     playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_playType, 0);
        // this.playTypeList_radio.selectItem(playType);
        // this.radioBoxSelectCB(playType,this.playTypeList[playType],this.playTypeList);

        var qiePai;
        if (isClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum(maxPlayer);

        var jiuDuiBan; //九对半
        if (isClub)
            jiuDuiBan = this.getBoolItem("jiuDuiBan", true);
        else
            jiuDuiBan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_jiuDuiBan, false);
        this.jiuDuiBan.setSelected(jiuDuiBan);
        var text = this.jiuDuiBan.getChildByName("text");
        this.selectedCB(text,jiuDuiBan);

        var huaHuZi; //九对半
        if (isClub)
            huaHuZi = this.getBoolItem("huaHuZi", true);
        else
            huaHuZi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_huaHuZi, true);
        this.huaHuZi.setSelected(huaHuZi);
        var text = this.huaHuZi.getChildByName("text");
        this.selectedCB(text,huaHuZi);

        var canPiao; //可飘
        if (isClub)
            canPiao = this.getBoolItem("canPiao", true);
        else
            canPiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canPiao, true);
        this.canPiao.setSelected(canPiao);
        var text = this.canPiao.getChildByName("text");
        this.selectedCB(text,canPiao);

        var canDiHu; //地胡
        if (isClub)
            canDiHu = this.getBoolItem("canDiHu", false);
        else
            canDiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canDiHu, false);
        this.canDiHu.setSelected(canDiHu);
        var text = this.canDiHu.getChildByName("text");
        this.selectedCB(text,canDiHu);

        var canZha; //地胡
        if (isClub)
            canZha = this.getBoolItem("canZha", false);
        else
            canZha = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canZha, false);
        this.canZha.setSelected(canZha);
        var text = this.canZha.getChildByName("text");
        this.selectedCB(text,canZha);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBeiScore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }
        if (isClub)
            this._zhuIdx = this.getNumberItem("jieSuanDiFen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_jieSuanDiFen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        var tuoGuan;
        if (isClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        var fangShi;
        if (isClub)
            fangShi = this.getNumberItem("trustWay", 0);
        else
            fangShi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_trustWay, 0);
        this.fangShiList_radio.selectItem(fangShi);
        this.radioBoxSelectCB(fangShi,this.fangShiList[fangShi],this.fangShiList);

        this.updateTrust();
    },

    updateTrust:function () {
        var visible = !(this.tuoGuanList_radio.getSelectIndex() == 0);
        for(var i = 0; i < this.fangShiList.length; i++){
            this.fangShiList[i].visible = visible;
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUAN_JIANG_GUI_HU_ZI;
        para.maxPlayer = [3, 2, 3][this.maxPlayerList_radio.getSelectIndex()];     // 人数
        para.convertible = this.maxPlayerList_radio.getSelectIndex() == 2;  // 自由人数
        para.maiPai19 = false;
        para.maiPaiNum = this.maiPaiList_radio.getSelectIndex();
        if (this.maxPlayerList_radio.getSelectIndex() == 0) {
            para.maiPaiNum = 0;
        }

        para.diaoDiaoShou = this.diaoDiaoShou.isSelected();
        para.anWaiLiu = this.anWaiLiu.isSelected();
        para.jieSuanDiFen = this._zhuIdx;

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        // para.playType = this.playTypeList_radio.getSelectIndex();
        para.playType = 0;
        para.wuXiPing = [false, true][this.wuXiPingList_radio.getSelectIndex()];
        para.fengDing = [100, 200][this.fengDingList_radio.getSelectIndex()];
        para.chiPai = this.chiPaiList_radio.getSelectIndex();

        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.jiuDuiBan = this.jiuDuiBan.isSelected();
        para.huaHuZi = this.huaHuZi.isSelected();
        para.canPiao = this.canPiao.isSelected();
        para.canDiHu = this.canDiHu.isSelected();
        para.canZha = this.canZha.isSelected();
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.trustWay = this.fangShiList_radio.getSelectIndex();
        para.isTrustWhole = !(para.trustWay == 0);

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_wuXiPing, this.wuXiPingList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fengDing, this.fengDingList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_chiPai, this.chiPaiList_radio.getSelectIndex());
            // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_playType, this.playTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai19, para.maiPai19);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_maiPai, this.maiPaiList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_diaoDiaoShou, para.diaoDiaoShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_anWaiLiu, para.anWaiLiu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_jiuDuiBan, para.jiuDuiBan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_huaHuZi, para.huaHuZi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canPiao, para.canPiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canDiHu, para.canDiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_canZha, para.canZha);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_jieSuanDiFen, para.jieSuanDiFen);
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_fanBeiScore, para.fanBeiScore);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_tuoGuan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YuanJiangGuiHuZi_trustWay, para.trustWay);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }

});