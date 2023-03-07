/***
 * 贵州-新麻友贵阳捉鸡
 * @type {void | Class | *}
 */
var CreateRoomNode_guizhouXMYGuiYangZhuoJi = CreateRoomNode.extend({

    setKey:function(){
        this.localStorageKey.KEY_guizhouXMYGuiYang_yaobaiji        = "_guizhouXMYGuiYang_YAOBAI_JI";  //摇摆鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_mantangji       = "_guizhouXMYGuiYang_MANTANG_JI"; //满堂鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaoji       = "_guizhouXMYGuiYang_QGSHAO_JI";  //抢杠烧鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaodou      = "_guizhouXMYGuiYang_QGSHAO_DOU"; //抢杠烧豆
        this.localStorageKey.KEY_guizhouXMYGuiYang_wuguji          = "_guizhouXMYGuiYang_WUGU_JI";    //乌骨鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_huanleji        = "_guizhouXMYGuiYang_HUANLE_JI";  //欢乐鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_benji           = "_guizhouXMYGuiYang_BEN_JI";     //本鸡
        this.localStorageKey.KEY_guizhouXMYGuiYang_fanbei          = "_guizhouXMYGuiYang_FAN_BEI";    //翻倍
        this.localStorageKey.KEY_guizhouXMYGuiYang_gps             = "_guizhouXMYGuiYang_GPS";        //防作弊
        this.localStorageKey.KEY_guizhouXMYGuiYang_count           = "_guizhouXMYGuiYang_COUNT";      //人数
        this.localStorageKey.KEY_guizhouXMYGuiYang_zhuangtype      = "_guizhouXMYGuiYang_ZHUANG_TYPE";//庄分类型
        this.localStorageKey.KEY_guizhouXMYGuiYang_tuoguan         = "_guizhouXMYGuiYang_TUOGUAN";    //托管
    },

    initAll:function(IsFriendCard) {
        if (!IsFriendCard) this.setKey();
        this.bg_node = ccs.load("bg_guizhouXMYGuiYangZhuoJi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },

    initRoundNode:function() {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
        this.bg_node.setContentSize(cc.size(907.00,580.00));
        this.bg_node.setPosition(-240, -37);
    },

    initPlayNode:function() {
        var _play = this.playScroll.getChildByName("play");

        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList = [this._playNode_maxPlayer0, this._playNode_maxPlayer1, this._playNode_maxPlayer2, this._playNode_maxPlayer3];
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList[index], nodeCountList);
            this.addSpecialProcess();
        }.bind(this));
        this.addListenerText(nodeCountList, this._playNode_player_count_radio,function () {
            this.changePayForPlayerNum();
            this.addSpecialProcess();
        }.bind(this));
        this._countlist = nodeCountList;
        this.initPlayNumNode(nodeCountList, [4, 3, 2, 4]);


        this._playNode_yaobaiji = _play.getChildByName("play_yaobaiji");
        this.addListenerText(this._playNode_yaobaiji);
        this._playNode_yaobaiji.addEventListener(this.clickCB, this._playNode_yaobaiji);


        this._playNode_mantangji = _play.getChildByName("play_mantangji");
        this.addListenerText(this._playNode_mantangji);
        this._playNode_mantangji.addEventListener(this.clickCB, this._playNode_mantangji);


        this._playNode_qg_shaoji = _play.getChildByName("play_qg_shaoji");
        this.addListenerText(this._playNode_qg_shaoji);
        this._playNode_qg_shaoji.addEventListener(this.clickCB, this._playNode_qg_shaoji);


        this._playNode_qg_shaodou = _play.getChildByName("play_qg_shaodou");
        this.addListenerText(this._playNode_qg_shaodou);
        this._playNode_qg_shaodou.addEventListener(this.clickCB, this._playNode_qg_shaodou);


        this._playNode_wuguji = _play.getChildByName("play_wuguji");
        this.addListenerText(this._playNode_wuguji);
        this._playNode_wuguji.addEventListener(this.clickCB, this._playNode_wuguji);


        this._playNode_huanleji = _play.getChildByName("play_huanleji");
        this.addListenerText(this._playNode_huanleji);
        this._playNode_huanleji.addEventListener(this.clickCB, this._playNode_huanleji);


        this._playNode_benji = _play.getChildByName("play_benji");
        this.addListenerText(this._playNode_benji);
        this._playNode_benji.addEventListener(this.clickCB, this._playNode_benji);


        this._playNode_1bei = _play.getChildByName("play_1bei");
        this._playNode_fanbei = _play.getChildByName("play_fanbei");
        var nodeListFanBei = [];
        nodeListFanBei = [this._playNode_1bei, this._playNode_fanbei];
        this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCallBack);
        var that = this;
        this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index, sender) {
            that.fanBeiRadioBoxSelectCallBack(index, sender, nodeListFanBei);
        });
        this.nodeListFanBei = nodeListFanBei;
        var subButton = this._playNode_fanbei.getChildByName("btn_sub");
        var addButton = this._playNode_fanbei.getChildByName("btn_add");
        var scoreLabel = this._playNode_fanbei.getChildByName("score");
        subButton.addTouchEventListener(function(sender, type) {
            if(type === 2){
                var curScore = parseInt(scoreLabel.getString());
                curScore --;
                curScore = curScore < 2 ? 10 : curScore;
                scoreLabel.setString(curScore + "倍");
            }
        }, this);
        addButton.addTouchEventListener(function(sender, type) {
            if(type === 2){
                var curScore = parseInt(scoreLabel.getString());
                curScore ++;
                curScore = curScore > 10 ? 2 : curScore;
                scoreLabel.setString(curScore + "倍");
            }
        }, this);


        this._playNode_zhuangType_0 = _play.getChildByName("play_zf_yikouer");
        this._playNode_zhuangType_1 = _play.getChildByName("play_zf_lianzhuang");
        var zhuangTypeNodeList = [this._playNode_zhuangType_0, this._playNode_zhuangType_1];
        this._playNode_player_zhuangType_radio = createRadioBoxForCheckBoxs(zhuangTypeNodeList, this.radioBoxSelectCB);
        this.addListenerText(zhuangTypeNodeList, this._playNode_player_zhuangType_radio);
        this.zhuangTypeNodeList = zhuangTypeNodeList;


        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);


        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("play_tg_0");
        this._playNode_tuoguanType_1 = _play.getChildByName("play_tg_1");
        this._playNode_tuoguanType_2 = _play.getChildByName("play_tg_2");
        this._playNode_tuoguanType_3 = _play.getChildByName("play_tg_3");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(this._playNode_tuoguanType_0);
        tuoguanNodeList.push(this._playNode_tuoguanType_1);
        tuoguanNodeList.push(this._playNode_tuoguanType_2);
        tuoguanNodeList.push(this._playNode_tuoguanType_3);
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        //添加托管提示按钮
        this.addTuoGuanHelpBtn(_play);
    },

    setPlayNodeCurrentSelect: function(isClub) {

        var yaobaiji;
        if (isClub)
            yaobaiji = this.getBoolItem("yaobaiji", false);
        else
            yaobaiji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_yaobaiji, true);
        this._playNode_yaobaiji.setSelected(yaobaiji);
        var text = this._playNode_yaobaiji.getChildByName("text");
        this.selectedCB(text, yaobaiji);

        var mantangji;
        if (isClub)
            mantangji = this.getBoolItem("mantangji", false);
        else
            mantangji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_mantangji, false);
        this._playNode_mantangji.setSelected(mantangji);
        var text = this._playNode_mantangji.getChildByName("text");
        this.selectedCB(text, mantangji);

        var qgshaoji;
        if (isClub)
            qgshaoji = this.getBoolItem("qianggangshaoji", false);
        else
            qgshaoji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaoji, false);
        this._playNode_qg_shaoji.setSelected(qgshaoji);
        var text = this._playNode_qg_shaoji.getChildByName("text");
        this.selectedCB(text, qgshaoji);


        var qgshaodou;
        if (isClub)
            qgshaodou = this.getBoolItem("qianggangshaodou", false);
        else
            qgshaodou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaodou, false);
        this._playNode_qg_shaodou.setSelected(qgshaodou);
        var text = this._playNode_qg_shaodou.getChildByName("text");
        this.selectedCB(text, qgshaodou);


        var wuguji;
        if (isClub)
            wuguji = this.getBoolItem("wuguji", false);
        else
            wuguji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_wuguji, false);
        this._playNode_wuguji.setSelected(wuguji);
        var text = this._playNode_wuguji.getChildByName("text");
        this.selectedCB(text, wuguji);


        var huanleji;
        if (isClub)
            huanleji = this.getBoolItem("huanleji", false);
        else
            huanleji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_huanleji, false);
        this._playNode_huanleji.setSelected(huanleji);
        var text = this._playNode_huanleji.getChildByName("text");
        this.selectedCB(text, huanleji);


        var benji;
        if (isClub)
            benji = this.getBoolItem("benji", false);
        else
            benji = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_benji, false);
        this._playNode_benji.setSelected(benji);
        var text = this._playNode_benji.getChildByName("text");
        this.selectedCB(text, benji);



        var currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                currentCount = 3;
            else
                currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_count, 0);
        this._playNode_player_count_radio.selectItem(currentCount);
        this.radioBoxSelectCB(currentCount, this._countlist[currentCount], this._countlist);



        var zhuangIdx;
        if (isClub)
            zhuangIdx = this.getNumberItem("zhuangType", 0);
        else
            zhuangIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_zhuangtype, 0);
        this._playNode_player_zhuangType_radio.selectItem(zhuangIdx);
        this.radioBoxSelectCB(zhuangIdx, this.zhuangTypeNodeList[zhuangIdx], this.zhuangTypeNodeList);

        if(this.fanbei_radio){
            var beishu;
            if(isClub){
                beishu = this.getNumberItem("beishu", 1);
            }else{
                beishu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_fanbei, 1);
            }
            var index = beishu === 1 ? 0 : 1;
            this.fanbei_radio.selectItem(index);
            beishu = beishu < 2 ? 2 : beishu;
            this._playNode_fanbei.getChildByName("score").setString(beishu + "倍");
            this.fanBeiRadioBoxSelectCallBack(index, this.nodeListFanBei[index], this.nodeListFanBei);
        }

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 0));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);



        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        var index = 0;
        if (_trustTime === 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime === 60) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime === 120) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime === 180) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);


        this.changePayForPlayerNum();
    },



    addTuoGuanHelpBtn: function(playNode){

        var btn_tuoguanTip = playNode.getChildByName("btn_tg_tip");
        var image_tuoguanTip = playNode.getChildByName("img_tip_di");
        var text_tuoguanTip = image_tuoguanTip.getChildByName("text");
        text_tuoguanTip.ignoreContentAdaptWithSize(true);
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type === 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function() {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);
    },

    fanBeiRadioBoxSelectCallBack: function(index, sender, list){
        if(sender){
            var SColor = cc.color("#00713A");
            var UColor = cc.color("#954500");
            var len = list.length;
            for(var i = 0; i < len; i ++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());
                var txt = radioBox.getChildByName("text");
                txt.ignoreContentAdaptWithSize(true);
                txt.setTextColor(bSelected ? SColor : UColor);
                if(i === 1){
                    var buttonNames = ["btn_add", "btn_sub"];
                    for (var k = 0; k < buttonNames.length; k++) {
                        var button = radioBox.getChildByName(buttonNames[k]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    },


    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.GUI_ZHOU_XMY_GUI_YANG_ZHUO_JI;
        para.maxPlayer = 4;
        para.convertible = false;
        para.benji = false;
        para.yaobaiji = true;
        para.mantangji = false;
        para.qianggangshaoji = false;
        para.qianggangshaodou = false;
        para.wuguji = false;
        para.huanleji = false;
        para.zhuangType = 0;
        para.beishu = 1;

        para.yaobaiji = this._playNode_yaobaiji.isSelected();
        para.mantangji = this._playNode_mantangji.isSelected();
        para.qianggangshaoji = this._playNode_qg_shaoji.isSelected();
        para.qianggangshaodou = this._playNode_qg_shaodou.isSelected();
        para.wuguji = this._playNode_wuguji.isSelected();
        para.huanleji = this._playNode_huanleji.isSelected();
        para.benji = this._playNode_benji.isSelected();

        // 0: 一扣二   1: 连庄
        if(this._playNode_player_zhuangType_radio){
            para.zhuangType = this._playNode_player_zhuangType_radio.getSelectIndex();
        }

        if(this.fanbei_radio){
            var fanBeiIdx = this.fanbei_radio.getSelectIndex();
            if(fanBeiIdx === 0){
                para.beishu = 1;
            }else{
                para.beishu = parseInt(this._playNode_fanbei.getChildByName("score").getString());
            }
        }


        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }



        // 托管
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        }


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_tuoguan, para.trustTime);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_yaobaiji,  para.yaobaiji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_mantangji,  para.mantangji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaoji,  para.qianggangshaoji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_qg_shaodou,  para.qianggangshaodou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_wuguji,  para.wuguji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_huanleji,  para.huanleji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_guizhouXMYGuiYang_benji,  para.benji);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_zhuangtype, para.zhuangType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_guizhouXMYGuiYang_fanbei, fanBeiIdx);

        }
        cc.log("createara xmy guiyang : " + JSON.stringify(para));
        return para;
    }
});