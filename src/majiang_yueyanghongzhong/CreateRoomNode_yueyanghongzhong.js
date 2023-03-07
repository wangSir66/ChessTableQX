/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_yueyanghongzhong = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_YYHZ_niaoTpye                          = "_YYHZ_NIAO_WAY";       		//鸟的方式
        this.localStorageKey.KEY_YYHZ_zhuangxian                        = "_YYHZ_DIAN_ZHUANG_XIAN";         //庄闲
        this.localStorageKey.KEY_YYHZ_zimohu                            = "_YYHZ_ZI_MO_HU";         //自模糊
        this.localStorageKey.KEY_YYHZ_159zhongma                        = "_YYHZ_159_ZHONG_MA";  //159中码
        this.localStorageKey.KEY_YYHZ_8hongzhong                        = "_YYHZ_8_HONG_ZHONG";       	//8红中
        this.localStorageKey.KEY_YYHZ_is7dui                            = "_YYHZ_IS_7_DUI";       		//七对可胡
        this.localStorageKey.KEY_YYHZ_yimaquanzhong                     = "_YYHZ_YI_MA_QUAN_ZHONG";//一码全中
        this.localStorageKey.KEY_YYHZ_maType             		        = "_YYHZ_MA_TYPE";//无红中加倍
        this.localStorageKey.KEY_YYHZ_youhongzhongkeqiangganghu         = "_YYHZ_YOU_HONG_ZHONG_KE_QIANG_GANG_HU";//有红中可抢杠胡
        this.localStorageKey.KEY_YYHZ_count 					        = "_YYHZ_COUNT"; 				//人数
        this.localStorageKey.KEY_YYHZ_hongzhongkehu 			        = "_YYHZ_HONG_ZHONG_KE_HU"; 	// 四红中可胡
        this.localStorageKey.KEY_YYHZ_niaofen 					        = "_YYHZ_NIAO_FEN"; 			// 中鸟得分
        this.localStorageKey.KEY_YYHZ_isDuoHu                           = "_YYHZ_IS_DUO_HU";            //是否多胡
        this.localStorageKey.KEY_YYHZ_difen 					        = "_YYHZ_difen"; 				//底分
        this.localStorageKey.KEY_YYHZ_dahujiafen                        = "_YYHZ_dahujiafen";       // 胡七对、碰碰胡、天胡、清一色加1分
        this.localStorageKey.KEY_YYHZ_isOpenTingTip                     = "_YYHZ_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_YYHZ_tuoguan                           = "_YYHZ_tuoguan";          //托管
        this.localStorageKey.KEY_YYHZ_piaoFen                           = "_YYHZ_piaoFen";                //飘分
        this.localStorageKey.KEY_YYHZ_fanbei                            = "_YYHZ_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_YYHZ_fanbeiscore                       = "_YYHZ_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bg_node = ccs.load("bg_yueyanghongzhong.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_yueyanghongzhong").getChildByName("view");
    },
    initPlayNode: function() {
        var _bgYYHZNode = this.bg_node;

        //莫的类型
        var _play = _bgYYHZNode.getChildByName("play");

        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniao3");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniao4");
        this._playNode_niaoType_6 = _play.getChildByName("zhuaniao6");
        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("zhuaniao2"));
        nodeList1.push(_play.getChildByName("zhuaniao3"));
        nodeList1.push(_play.getChildByName("zhuaniao4"));
        nodeList1.push(_play.getChildByName("zhuaniao6"));
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_player_type_radio);
        this.niaoList = nodeList1;

        this._playNode_niaoFen_1 = _play.getChildByName("niaofen1");
        this._playNode_niaoFen_2 = _play.getChildByName("niaofen2");
        var niaoFenList = [];
        niaoFenList.push(this._playNode_niaoFen_1);
        niaoFenList.push(this._playNode_niaoFen_2);
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;

        //8红中
        this._playNode_hongzhong8 = _play.getChildByName("play_hongzhong8");
        this.addListenerText(this._playNode_hongzhong8);
        this._playNode_hongzhong8.addEventListener(this.clickCB, this._playNode_hongzhong8);
        //七对
        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

        //庄闲
        this._playNode_zhuangxian = _play.getChildByName("play_zhuangxian");
        this.addListenerText(this._playNode_zhuangxian);
        this._playNode_zhuangxian.addEventListener(this.clickCB, this._playNode_zhuangxian);

        //自摸胡
        this._playNode_zimohu = _play.getChildByName("play_zimohu");
        this._playNode_zimohu.setTouchEnabled(false);
        // this.addListenerText(this._playNode_zimohu);
        this._playNode_zimohu.addEventListener(this.clickCB, this._playNode_zimohu);

        this._playNode_dahujiafen = _play.getChildByName("play_dahujiafen");
        this.addListenerText(this._playNode_dahujiafen);
        this._playNode_dahujiafen.addEventListener(this.clickCB, this._playNode_dahujiafen);


        this._playNode_ma_1 = _play.getChildByName("play_159_zhongma");
        this._playNode_ma_2 = _play.getChildByName("play_yimaquanzhong");
        var nodeList2 = [];
        nodeList2.push(_play.getChildByName("play_159_zhongma"));
        nodeList2.push(_play.getChildByName("play_yimaquanzhong"));
        var select_ma = function(){
            if (this._playNode_ma_2.isSelected()) {
                this._playNode_niaoType_2.visible = false;
                this._playNode_niaoType_3.visible = false;
                this._playNode_niaoType_4.visible = false;
                this._playNode_niaoType_6.visible = false;
            }else{
                this._playNode_niaoType_2.visible = true;
                this._playNode_niaoType_3.visible = true;
                this._playNode_niaoType_4.visible = true;
                this._playNode_niaoType_6.visible = true;
            }
        }.bind(this);
        this._playNode_ma_radio = createRadioBoxForCheckBoxs(nodeList2, function(){
            this.radioBoxSelectCB;
            select_ma();
        });
        this.addListenerText(nodeList2, this._playNode_ma_radio, select_ma);
        this.maList = nodeList2;

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));
		this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);
		
        cc.log("==== nodeCountList1 = " + JSON.stringify(nodeCountList1))
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        // 飘分 改版
        this._playNode_piaoFen0 = _play.getChildByName("play_piaofen0");  
        this._playNode_piaoFen1 = _play.getChildByName("play_piaofen1");
        this._playNode_piaoFen2 = _play.getChildByName("play_piaofen2");
        this._playNode_piaoFen3 = _play.getChildByName("play_piaofen3");
        this._playNode_piaoFen4 = _play.getChildByName("play_piaofen4"); 
        var nodePiaofenList = [];
        nodePiaofenList.push(this._playNode_piaoFen0);
        nodePiaofenList.push(this._playNode_piaoFen1);
        nodePiaofenList.push(this._playNode_piaoFen2);
        nodePiaofenList.push(this._playNode_piaoFen3);
        nodePiaofenList.push(this._playNode_piaoFen4);
        this.nodePiaofenList = nodePiaofenList;
        var piaoFenCallback = function(index){
            this._playNode_player_piaoFen_radio.selectItem(index);
            this.radioBoxSelectCB(index, this.nodePiaofenList[index], this.nodePiaofenList);
        }.bind(this);
        this._playNode_player_piaoFen_radio = createRadioBoxForCheckBoxs(nodePiaofenList, function(index) {
            
            piaoFenCallback(index);
        }.bind(this));
        this.addListenerText(nodePiaofenList, this._playNode_player_piaoFen_radio, piaoFenCallback);
        this._nodePiaofenList = nodePiaofenList;   

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        this._zhuIdx = 1;
        this._ZhuNum = _bgYYHZNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgYYHZNode.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bgYYHZNode.getParent().getChildByName("btn_add");
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
        var _niaoType;
        if (isClub)
            _niaoType = this.getNumberItem("zhuaniao", 4);
        else
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_niaoTpye, 4);
        this._playNode_niaoType_2.setSelected(false);
        this._playNode_niaoType_3.setSelected(false);
        this._playNode_niaoType_4.setSelected(false);
        this._playNode_niaoType_6.setSelected(false);
        var index = 2;
        if (_niaoType == 2) {
            this._playNode_niaoType_2.setSelected(true);
            index = 0;
        } else if (_niaoType == 3) {
            this._playNode_niaoType_3.setSelected(true);
            index = 1;
        } else if (_niaoType == 4) {
            this._playNode_niaoType_4.setSelected(true);
            index = 2;
        } else if (_niaoType == 6) {
            this._playNode_niaoType_6.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index, this.niaoList[index], this.niaoList);

        //新加飘分
        if (isClub){
            this._piaoFen = this.getNumberItem("piaoFen", 0);
        }
        else
            this._piaoFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_piaoFen, 0);
        this._playNode_player_piaoFen_radio.selectItem(this._piaoFen);
        this.radioBoxSelectCB(this._piaoFen, this.nodePiaofenList[this._piaoFen], this.nodePiaofenList);

        var niaofen;
        if (isClub)
            niaofen = this.getNumberItem("niaofen", 1);
        else
            niaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_niaofen, 1);
        var niaofenIndex = niaofen - 1;
        this._playNode_niaoFen_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenList[niaofenIndex], this.niaoFenList);

        var _maType;
        if (isClub)
            _maType = this.getNumberItem("zhongma", 1);
        else
            _maType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_maType, 1);
        this._playNode_ma_1.setSelected(false);
        this._playNode_ma_2.setSelected(false);
        var index = 1;
        if (_maType == 1) {
            this._playNode_ma_1.setSelected(true);
            index = 0;
        } else if (_maType == 2) {
            this._playNode_niaoType_2.visible = false;
            this._playNode_niaoType_3.visible = false;
            this._playNode_niaoType_4.visible = false;
            this._playNode_niaoType_6.visible = false;
            this._playNode_ma_2.setSelected(true);
            index = 1;
        } 
        this.radioBoxSelectCB(index, this.maList[index], this.maList);



        if (isClub)
            this._8hongzhong = this.getBoolItem("hongzhong8", false);
        else
            this._8hongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YYHZ_8hongzhong, false);
        this._playNode_hongzhong8.setSelected(this._8hongzhong);
        var text = this._playNode_hongzhong8.getChildByName("text");
        this.selectedCB(text,this._8hongzhong);

        if (isClub)
            this._is7dui = this.getBoolItem("qidui", true);
        else
            this._is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YYHZ_is7dui, true);
        this._playNode_qidui.setSelected(this._is7dui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text, this._is7dui);

        if (isClub)
            this._iszimohu = this.getBoolItem("zimohu", true);
        else
            this._iszimohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YYHZ_zimohu, true);
        this._playNode_zimohu.setSelected(true);
        var text = this._playNode_zimohu.getChildByName("text");
        this.selectedCB(text, this._iszimohu);

        if (isClub)
            this._iszhuangxian = this.getBoolItem("zhuangxianfen", true);
        else
            this._iszhuangxian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YYHZ_zhuangxian, true);
        this._playNode_zhuangxian.setSelected(this._iszhuangxian);
        var text = this._playNode_zhuangxian.getChildByName("text");
        this.selectedCB(text, this._iszhuangxian);

        //胡七对、碰碰胡、天胡、清一色加1分
        var dahujiafen;
        if (isClub)
            dahujiafen = this.getNumberItem("qdpphthqysjf", 0);
        else
            dahujiafen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_dahujiafen, 0);
        this._playNode_dahujiafen.setSelected(dahujiafen == 1);
        var text = this._playNode_dahujiafen.getChildByName("text");
        this.selectedCB(text, dahujiafen);

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_tuoguan, 0);
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

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else { 
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_count, 0);
        }
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YYHZ_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YYHZ_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_HONG_ZHONG;
        para.maxPlayer = 4;
        para.qidui = true; //七对可胡
        para.difen = this._zhuIdx;
        para.zhuangxianfen = true;
        para.zimohu = true;
        para.qdpphthqysjf = this._playNode_dahujiafen.isSelected() ? 1 : 0;//胡七对、碰碰胡、天胡、清一色加1分

        //飘分
        para.piaoFen = this._playNode_player_piaoFen_radio.getSelectIndex();

        if (this._playNode_niaoType_2.isSelected()) {
            para.zhuaniao = 2;
        } else if (this._playNode_niaoType_3.isSelected()) {
            para.zhuaniao = 3;
        } else if (this._playNode_niaoType_4.isSelected()) {
            para.zhuaniao = 4;
        }else if (this._playNode_niaoType_6.isSelected()) {
            para.zhuaniao = 6;
        }
        if (this._playNode_ma_2.isSelected()) {
            para.zhuaniao = 1;
        }
        

        if (this._playNode_ma_1.isSelected()) {
            para.zhongma = 1;
        } else if (this._playNode_ma_2.isSelected()) {
            para.zhongma = 2;
        }

        var niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
        para.niaofen = niaofenIndex + 1;

        para.hongzhong8 = this._playNode_hongzhong8.isSelected();//8红中
        para.zimohu = this._playNode_zimohu.isSelected();
        para.qidui = this._playNode_qidui.isSelected(); //七对可胡
        para.zhuangxianfen = this._playNode_zhuangxian.isSelected();
        para.isOpenTingTip = this.tingTipList[0].isSelected();

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

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }


        //人数
        para.maxPlayer = [4, 3, 2, 4][this._playNode_player_count_radio.getSelectIndex()];     // 人数
        para.convertible = this._playNode_player_count_radio.getSelectIndex() == 3;  // 自由人数

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_niaoTpye, para.zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_maType, para.zhongma);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_difen, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_is7dui, para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_8hongzhong, para.hongzhong8);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_zimohu, para.zimohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_zhuangxian, para.zhuangxianfen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_count, this._playNode_player_count_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_dahujiafen, para.qdpphthqysjf);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_tuoguan, para.trustTime);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YYHZ_piaoFen, para.piaoFen);
             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YYHZ_fanbeiscore, para.fanBeiScore);
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