/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_zhuoxiazi = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_zhuoxiazi_count                     = "_zhuoxiazi_COUNT";                //人数
        this.localStorageKey.KEY_zhuoxiazi_difen                     = "_zhuoxiazi_difen";                //底分
        this.localStorageKey.KEY_zhuoxiazi_zhuangxianfen             = "_zhuoxiazi_zhuangxianfen";        //庄闲分
        this.localStorageKey.KEY_zhuoxiazi_piaofen                   = "_zhuoxiazi_piaofen";              //飘分
        this.localStorageKey.KEY_zhuoxiazi_mantianfei                = "_zhuoxiazi_mantianfei";           //满天飞
        this.localStorageKey.KEY_zhuoxiazi_isOpenTingTip             = "_zhuoxiazi_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_zhuoxiazi_tuoguan                   = "_zhuoxiazi_tuoguan";    //是否开启听牌提示
        this.localStorageKey.KEY_zhuoxiazi_fanbei                    = "_zhuoxiazi_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_zhuoxiazi_fanbeiscore               = "_zhuoxiazi_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },
    initAll: function(IsFriendCard) {

        if (!IsFriendCard) this.setKey();
        this.bgNode = ccs.load("bg_zhuoxiazi.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_zhuoxiazi").getChildByName("view");
        this.bg_node.setTouchEnabled(true);
        if(this._isRoomCardMode || this._isMatchMode){
            //房卡模式的创建ui处理过
            this.bg_node.setTouchEnabled(true);
        }
    },
    initPlayNode: function() {

        var _bgNode = this.bg_node;
        var _play = _bgNode.getChildByName("play");
        var that = this;

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        this.initPlayNumNode(nodeCountList1, [3, 2, 3]);
        
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        this._zhuIdx = 1;
        this._ZhuNum = _bgNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgNode.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bgNode.getParent().getChildByName("btn_add");
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

        //庄闲分
        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_zhuangxianfen.addEventListener(this.clickCB, this._playNode_zhuangxianfen);

        this._playNode_piaofen = _play.getChildByName("play_piaofen");
        this.addListenerText(this._playNode_piaofen);
        this._playNode_piaofen.addEventListener(this.clickCB, this._playNode_piaofen);

        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanList = [];
        tuoguanList.push(_play.getChildByName("tuoguan0"));
        tuoguanList.push(_play.getChildByName("tuoguan1"));
        tuoguanList.push(_play.getChildByName("tuoguan2"));
        tuoguanList.push(_play.getChildByName("tuoguan3"));
        var self = this;
        this.tuoguanTypeList_radio = createRadioBoxForCheckBoxs(tuoguanList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,tuoguanList[index],tuoguanList);
        });
        this.addListenerText(tuoguanList,this.tuoguanTypeList_radio);
        this.tuoguanList = tuoguanList;



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

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;


        this._playNode_mantianfei = _play.getChildByName("play_mantianfei");
        this.addListenerText(this._playNode_mantianfei);
        this._playNode_mantianfei.addEventListener(this.clickCB, this._playNode_mantianfei);

        this._playNode_mantianfei.schedule(function() {
            if(that._playNode_mantianfei.isSelected())
            {
                that._playNode_piaofen.visible = true;
            }
            else
            {
                that._playNode_piaofen.visible = false;
            }
        })

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
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _currentCount;
        if (isClub)
            _currentCount = [3, 2, 3].indexOf(this.getNumberItem("maxPlayer", 3));
        else 
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuoxiazi_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        //底分
        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuoxiazi_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");


        //庄闲分
        var zhuangxianfen;
        if (isClub)
            zhuangxianfen = this.getBoolItem("zhuangxianfen", true);
        else
            zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuoxiazi_zhuangxianfen, true);
        this._playNode_zhuangxianfen.setSelected(zhuangxianfen);
        var text = this._playNode_zhuangxianfen.getChildByName("text");
        this.selectedCB(text, zhuangxianfen);


        //满天飞
        var mantianfei;
        if (isClub)
            mantianfei = this.getBoolItem("zhuangxianfen", false);
        else
            mantianfei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuoxiazi_mantianfei, false);
        this._playNode_mantianfei.setSelected(mantianfei);
        var text = this._playNode_mantianfei.getChildByName("text");
        this.selectedCB(text, mantianfei);



        this._playNode_mantianfei.schedule(function () {
            this._playNode_piaofen.visible = this._playNode_mantianfei.isSelected();
        }.bind(this));

        var piaofen;
        if (isClub)
            piaofen = this.getBoolItem("piaofen", false);
        else
            piaofen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuoxiazi_piaofen, false);
        this._playNode_piaofen.setSelected(piaofen);
        var text = this._playNode_piaofen.getChildByName("text");
        this.selectedCB(text, piaofen);

/*        var trustTime;
        if (isClub)
            trustTime = this.getBoolItem("trustTime", false);
        else
            trustTime = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuoxiazi_tuoguan, false);
        this._playNode_trustTime.setSelected(trustTime);
        var text = this._playNode_trustTime.getChildByName("text");
        this.selectedCB(text, trustTime);*/

        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuoxiazi_tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_zhuoxiazi_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuoxiazi_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_zhuoxiazi_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }
        
        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.MJ_ZHUO_XIA_ZI;
        para.maxPlayer = 3;
        para.difen = this._zhuIdx;
        para.zhuangxian = false;
        para.mantianfei = false;
        para.piaofen = false;
        para.zhuangxian = this._playNode_zhuangxianfen.isSelected();    //庄闲分
        para.mantianfei = this._playNode_mantianfei.isSelected();       //满天飞
        para.isOpenTingTip = this.tingTipList[0].isSelected();

        para.trustTime = 0;

        if (this._playNode_mantianfei.isSelected()) 
        {
            para.piaofen = this._playNode_piaofen.isSelected();
        }


        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 2;
        }

         var tuoguan = 0;
         if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
             tuoguan = 0;
         }
         else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
             tuoguan = 1;
         }
         else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
             tuoguan = 2;
         }
         else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
             tuoguan = 3;
         }

         if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuoxiazi_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuoxiazi_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuoxiazi_zhuangxianfen, para.zhuangxian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuoxiazi_mantianfei, para.mantianfei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuoxiazi_piaofen, para.piaofen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuoxiazi_tuoguan, tuoguan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_zhuoxiazi_isOpenTingTip, para.isOpenTingTip);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuoxiazi_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_zhuoxiazi_fanbeiscore, para.fanBeiScore);
            }
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