/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_ningxiang = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_ningxiang_zhuaniao                  = "_ningxiang_NIAO_WAY";             //鸟的方式
        this.localStorageKey.KEY_ningxiang_zhongniao                  = "_ningxiang_zhongniao";             //中鸟
        this.localStorageKey.KEY_ningxiang_quankai                  = "_ningxiang_quankai";           //全开
        this.localStorageKey.KEY_ningxiang_menQing               = "_ningxiang_menQing";        //门清
        this.localStorageKey.KEY_ningxiang_kechi               = "_ningxiang_kechi";        //门清
        this.localStorageKey.KEY_ningxiang_pinghuzimo              = "_ningxiang_pinghuzimo";          //平胡自摸
        this.localStorageKey.KEY_ningxiang_piao                   = "_ningxiang_piao";                //飘分
        this.localStorageKey.KEY_ningxiang_count                     = "_ningxiang_COUNT";                //人数
        this.localStorageKey.KEY_ningxiang_difen                     = "_ningxiang_difen";                //底分
        this.localStorageKey.KEY_ningxiang_tuoguan                  = "_ningxiang_tuoguan";               //托管
        this.localStorageKey.KEY_ningxiang_isOpenTingTip             = "_ningxiang_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_ningxiang_maipai             = "_ningxiang_maipai";    //是否开启听牌提示
        this.localStorageKey.KEY_ningxiang_fanbei                    = "_ningxiang_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_ningxiang_fanbeiscore               = "_ningxiang_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_ningxiang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_ningxiang").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_ningxiang");
    },
    initPlayNode: function() {
        var _bgMLHZNode = this.bg_node;
        var that = this;

        //鸟的类型
        var _play = _bgMLHZNode.getChildByName("play");
        this._playNode_niaoType_0 = _play.getChildByName("zhuaniaoNum0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniaoNum1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniaoNum2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniaoNum4");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniaoNum6");
        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("zhuaniaoNum0"));
        nodeList1.push(_play.getChildByName("zhuaniaoNum1"));
        nodeList1.push(_play.getChildByName("zhuaniaoNum2"));
        nodeList1.push(_play.getChildByName("zhuaniaoNum4"));
        nodeList1.push(_play.getChildByName("zhuaniaoNum6"));
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_player_type_radio);
        this.niaoList = nodeList1;

         //
        this.play_zhongniao0 = _play.getChildByName("zhongniao0");
        this.play_zhongniao1 = _play.getChildByName("zhongniao1");
        var zhongniaoList = [];
        zhongniaoList.push(this.play_zhongniao0);
        zhongniaoList.push(this.play_zhongniao1);
        this._playNode_zhongniao_radio = createRadioBoxForCheckBoxs(zhongniaoList,this.radioBoxSelectCB);
        this.addListenerText(zhongniaoList,this._playNode_zhongniao_radio);
        this.zhongniaoList = zhongniaoList;

 
        //飘分
        this._zhuIdx = 1;
        this._ZhuNum = _bgMLHZNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgMLHZNode.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bgMLHZNode.getParent().getChildByName("btn_add");
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

        this._playNode_quankai = _play.getChildByName("quankai");
        this.addListenerText(this._playNode_quankai);
        this._playNode_quankai.addEventListener(this.clickCB, this._playNode_quankai);

        this._playNode_kechi = _play.getChildByName("kechi");
        this.addListenerText(this._playNode_kechi);
        this._playNode_kechi.addEventListener(this.clickCB, this._playNode_kechi);

        this._playNode_maipai = _play.getChildByName("maipai");
        this.addListenerText(this._playNode_maipai);
        this._playNode_maipai.addEventListener(this.clickCB, this._playNode_maipai);



        this._playNode_menQing = _play.getChildByName("menQing");
        this.addListenerText(this._playNode_menQing);
        this._playNode_menQing.addEventListener(this.clickCB, this._playNode_menQing);

        this._playNode_piaoniao = _play.getChildByName("piaoniao");
        this.addListenerText(this._playNode_piaoniao);
        this._playNode_piaoniao.addEventListener(this.clickCB, this._playNode_piaoniao);

        this._playNode_pinghuzimo = _play.getChildByName("pinghuzimo");
        this.addListenerText(this._playNode_pinghuzimo);
        this._playNode_pinghuzimo.addEventListener(this.clickCB, this._playNode_pinghuzimo);

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("maxPlayer0");
        this._playNode_maxPlayer1 = _play.getChildByName("maxPlayer1");
        this._playNode_maxPlayer2 = _play.getChildByName("maxPlayer2");
        this._playNode_maxPlayer3 = _play.getChildByName("maxPlayer3");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("maxPlayer0"));
        nodeCountList1.push(_play.getChildByName("maxPlayer1"));
        nodeCountList1.push(_play.getChildByName("maxPlayer2"));
        nodeCountList1.push(_play.getChildByName("maxPlayer3"));
        this.initPlayNumNode(nodeCountList1, [4, 2, 3, 4]);
    
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        this._playNode_maxPlayer2.schedule(function() {
            if(that._playNode_maxPlayer2.isSelected())
            {
                that._playNode_maipai.visible = true;
            }
            else
            {
                that._playNode_maipai.visible = false;
            }
        })


        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
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

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;
    },
    setPlayNodeCurrentSelect: function(isClub) {

        var _zhuaniao;
        if (isClub)
            _zhuaniao = [0,1,2,4,6].indexOf(this.getNumberItem("zhuaniao", 1));
        else
            _zhuaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_zhuaniao, 1);
        this._playNode_player_type_radio.selectItem(_zhuaniao);
        this.radioBoxSelectCB(_zhuaniao,this.niaoList[_zhuaniao],this.niaoList);

        var _zhongniao;
        if (isClub)
            _zhongniao = this.getNumberItem("zhongniao", 0);
        else
            _zhongniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_zhongniao, 0);
        this._playNode_zhongniao_radio.selectItem(_zhongniao);
        this.radioBoxSelectCB(_zhongniao, this.zhongniaoList[_zhongniao], this.zhongniaoList);

        var _piaoniao;
        if (isClub)
            _piaoniao = this.getBoolItem("piaoniao", false);
        else
            _piaoniao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_piao, false);
        this._playNode_piaoniao.setSelected(_piaoniao);
        var text = this._playNode_piaoniao.getChildByName("text");
        this.selectedCB(text, _piaoniao)

        var _quankai;
        if (isClub)
            _quankai = this.getBoolItem("quankai", true);
        else
            _quankai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_quankai, true);
        this._playNode_quankai.setSelected(_quankai);
        var text = this._playNode_quankai.getChildByName("text");
        this.selectedCB(text, _quankai)

        var _kechi;
        if (isClub)
            _kechi = this.getBoolItem("kechi", true);
        else
            _kechi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_kechi, true);
        this._playNode_kechi.setSelected(_kechi);
        var text = this._playNode_kechi.getChildByName("text");
        this.selectedCB(text, _kechi)

        var _maipai;
        var _maipainum = 0;
        if (isClub)
            _maipainum = this.getNumberItem("maipai", 40);
        else
            _maipai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_maipai, true);
        if (isClub) 
        {
            _maipai = _maipainum == 40 ? true : false;
        }
        this._playNode_maipai.setSelected(_maipai);
        var text = this._playNode_maipai.getChildByName("text");
        this.selectedCB(text, _maipai)

        var _menQing;
        if (isClub)
            _menQing = this.getBoolItem("menQing", true);
        else
            _menQing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_menQing, true);
        this._playNode_menQing.setSelected(_menQing);
        var text = this._playNode_menQing.getChildByName("text");
        this.selectedCB(text, _menQing)

        var _pinghuzimo;
        if (isClub)
            _pinghuzimo = this.getBoolItem("pinghuzimo", false);
        else
            _pinghuzimo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_pinghuzimo, false);
        this._playNode_pinghuzimo.setSelected(_pinghuzimo);
        var text = this._playNode_pinghuzimo.getChildByName("text");
        this.selectedCB(text, _pinghuzimo);

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //托管
       var _trustTime;
        if (isClub)
        {
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        }
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_tuoguan, 0);
        this._playNode_player_tuoguan_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanNodeList[_trustTime],this.tuoguanNodeList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_ningxiang_isOpenTingTip, true);
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_ningxiang_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.NING_XIANG_MJ;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 0; //抓鸟 0:不抓鸟 1:抓1鸟 2：抓2鸟 4：抓4鸟 6：抓6鸟
        para.zhongniao = 0;//0:翻倍 1:加分
        para.piaoniao = false;
        para.quankai = false; //全开 
        para.menQing = false; //门清
        para.kechi = false; //门清
        para.pinghuzimo = false; //平胡自摸
        para.difen = this._zhuIdx;
        para.convertible = false;//是否自由人数
        para.trustTime = 0;//托管
        para.maipai = 0;

        var zhuaniaoindex;
        if (this._playNode_niaoType_0.isSelected()) {
            zhuaniaoindex = 0;
            para.zhuaniao = 0;
        } else if (this._playNode_niaoType_1.isSelected()) {
            zhuaniaoindex = 1;
            para.zhuaniao = 1;
        } else if (this._playNode_niaoType_2.isSelected()) {
            zhuaniaoindex = 2;
            para.zhuaniao = 2;
        } else if (this._playNode_niaoType_3.isSelected()) {
            zhuaniaoindex = 3;
            para.zhuaniao = 4;
        } else if (this._playNode_niaoType_4.isSelected()) {
            zhuaniaoindex = 4;
            para.zhuaniao = 6;
        }

        if (this.play_zhongniao0.isSelected()) {
            para.zhongniao = 0;
        } else if (this.play_zhongniao1.isSelected()) {
            para.zhongniao = 1;
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

         //
        para.piaoniao = this._playNode_piaoniao.isSelected() ? true : false;
        para.quankai = this._playNode_quankai.isSelected();//庄闲分
        para.menQing = this._playNode_menQing.isSelected();
        para.kechi = this._playNode_kechi.isSelected();
        para.pinghuzimo = this._playNode_pinghuzimo.isSelected();
        para.isOpenTingTip = this.tingTipList[0].isSelected();

        var _maipai = this._playNode_maipai.isSelected();
        para.maipai = _maipai ? 40 : 0;
        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }
        if (para.maxPlayer != 2) 
        {
            para.maipai = 0;
        }
        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_zhuaniao, zhuaniaoindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_zhongniao, para.zhongniao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_piao, para.piaoniao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_maipai, _maipai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_quankai, para.quankai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_menQing, para.menQing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_kechi, para.kechi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_pinghuzimo, para.pinghuzimo);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_tuoguan, tuoguan)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_ningxiang_isOpenTingTip, para.isOpenTingTip);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_ningxiang_fanbeiscore, para.fanBeiScore);
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