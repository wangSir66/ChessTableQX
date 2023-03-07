var CreateRoomNode_paodekuaiXuzhou = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_PLAYERNUMBER   = "PAO_DE_KUAI_XZ_PLAYER_NUMBER";       // 玩家数量
        this.localStorageKey.KEY_PDK_CARDNUMBER     = "PAO_DE_KUAI_XZ_CARDNUMBER";          // 手牌数量
        this.localStorageKey.KEY_PDK_XIAN_SHOU      = "PAO_DE_KUAI_XZ_XIAO_SHOU";           // 先手
        this.localStorageKey.KEY_PDK_XIAO_GUAN_X2   = "PAO_DE_KUAI_XZ_XIAO_GUAN_X2";        // 小关X2
        this.localStorageKey.KEY_PDK_DA_GUAN_X3     = "PAO_DE_KUAI_XZ_DA_GUAN_X3";          // 大关X3
        this.localStorageKey.KEY_PDK_DA_GUAN_X2     = "PAO_DE_KUAI_XZ_DA_GUAN_X2";          // 大关X2
        this.localStorageKey.KEY_PDK_3DAI           = "PAO_DE_KUAI_XZ_3DAI";                // 3带1/3带2
        this.localStorageKey.KEY_PDK_4DAI2          = "PAO_DE_KUAI_XZ_4DAI2";               // 4带2
        this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN  = "PAO_DE_KUAI_XZ_CAN_3A_ZHADAN";       // 三个A算炸弹
        this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN= "PAO_DE_KUAI_XZ_CAN_3ge3_ZHADAN";     // 三个3算炸弹
        this.localStorageKey.KEY_PDK_SHOWCARDNUMBER = "PAO_DE_KUAI_XZ_SHOW_CARD_NUMBER";    // 显示牌数
        this.localStorageKey.KEY_PDK_FANG_ZUO_BI    = "PAO_DE_KUAI_XZ_FANG_ZUO_BI";         // 防作弊
        this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN= "PAO_DE_KUAI_XZ_ZHA_DAN_JIA_FEN";     // 炸弹加分
        this.localStorageKey.KEY_PDK_MUST_PUT       = "PAO_DE_KUAI_XZ_MUST_PUT";            // 能管必管
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_XZ_SHUFFLE_OPTION" // 切牌
        
        //this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_XZ_DIFEN";               // 底分

        this.setExtraKey({
            fanBei: "PAO_DE_KUAI_XZ_FAN_BEI",  //大结算翻倍
            fanBeiScore: "PAO_DE_KUAI_XZ_FAN_BEI_SCORE",  //少于X分大结算翻倍
            tuoGuan: "PAO_DE_KUAI_XZ_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_XZ_FENG_DING"          //封顶
        });
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_paodekuaiXuzhou.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initPlayNode: function() {
        if (MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType()) {
            this._super();
        }
        var _bg_Node = this.bg_node.getChildByName("view");
        var _playWay = _bg_Node.getChildByName("play_way");

        var nodeListA = [];
        nodeListA.push(_playWay.getChildByName("playerNumber_3"));
        nodeListA.push(_playWay.getChildByName("playerNumber_2"));
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);
        }.bind(this));
        this.addListenerText(nodeListA, this._playNode_player_number_radio);
        this.nodeListA = nodeListA;
		this.initPlayNumNode(nodeListA, [3, 2]); 
		
        var nodeListB = [];
        nodeListB.push(_playWay.getChildByName("cardNum16"));
        nodeListB.push(_playWay.getChildByName("cardNum15"));
        this._card_number_radio = createRadioBoxForCheckBoxs(nodeListB, this.radioBoxSelectCB);
        this.addListenerText(nodeListB, this._card_number_radio);
        this.nodeListB = nodeListB;

        var nodeListC = [];
        nodeListC.push(_playWay.getChildByName("play_firstHeiTao"));
        nodeListC.push(_playWay.getChildByName("play_firstWin"));
        this._xianshou_radio = createRadioBoxForCheckBoxs(nodeListC, this.radioBoxSelectCB);
        this.addListenerText(nodeListC, this._xianshou_radio);
        this.nodeListC = nodeListC;

        this.xiaoguanX2 = _playWay.getChildByName("play_xiaoguanX2");
        this.addListenerText(this.xiaoguanX2);
        this.xiaoguanX2.addEventListener(this.clickCB, this.xiaoguanX2);

        var daGuan_peiShu = function() {

            if (this.daguanX3.isSelected()) {
                this.daguanX2.setSelected(false);
                var txt2 = this.daguanX2.getChildByName("text");
                txt2.setTextColor(cc.color(158, 118, 78));
            }
        }.bind(this);

        var daGuan_peiShu2 = function() {

            if (this.daguanX2.isSelected()) {
                this.daguanX3.setSelected(false);
                var txt2 = this.daguanX3.getChildByName("text");
                txt2.setTextColor(cc.color(158, 118, 78));
            }

        }.bind(this);

        this.daguanX3 = _playWay.getChildByName("play_daguanX3");
        this.addListenerText(this.daguanX3, null, daGuan_peiShu);
        this.daguanX2 = _playWay.getChildByName("play_daguanX2");
        this.addListenerText(this.daguanX2, null, daGuan_peiShu2);
        this.daguanX3.addEventListener(function(sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.daguanX3.setSelected(true);
                    this.daguanX2.setSelected(false);
                    var txt = sender.getChildByName("text");
                    var txt2 = this.daguanX2.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(cc.color(237, 101, 1));
                        txt2.setTextColor(cc.color(158, 118, 78));
                    } else {
                        txt.setTextColor(cc.color(158, 118, 78));
                        txt2.setTextColor(cc.color(237, 101, 1));
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    txt.setTextColor(cc.color(158, 118, 78));
                    break;
            }
        }, this);

        this.daguanX2.addEventListener(function(sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.daguanX3.setSelected(false);
                    this.daguanX2.setSelected(true);
                    var txt = sender.getChildByName("text");
                    var txt2 = this.daguanX3.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(cc.color(237, 101, 1));
                        txt2.setTextColor(cc.color(158, 118, 78));
                    } else {
                        txt.setTextColor(cc.color(158, 118, 78));
                        txt2.setTextColor(cc.color(237, 101, 1));
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    txt.setTextColor(cc.color(158, 118, 78));
                    break;
            }
        }, this);

        var nodeListD = [];
        nodeListD.push(_playWay.getChildByName("play_can3dai1"));
        nodeListD.push(_playWay.getChildByName("play_can3dai2"));
        this._sanDai_radio = createRadioBoxForCheckBoxs(nodeListD, this.radioBoxSelectCB);
        this.addListenerText(nodeListD, this._sanDai_radio);
        this.nodeListD = nodeListD;

        this.can4dai2 = _playWay.getChildByName("play_can4dai2");
        this.addListenerText(this.can4dai2);
        this.can4dai2.addEventListener(this.clickCB, this.can4dai2);

        this.can3aZhaDan = _playWay.getChildByName("play_can3aZhaDan");
        this.addListenerText(this.can3aZhaDan);
        this.can3aZhaDan.addEventListener(this.clickCB, this.can3aZhaDan);
        this.can3aZhaDan.schedule(function() {
            this.can3aZhaDan.setVisible(this._card_number_radio.getSelectIndex() == 0);
        }.bind(this));

        this.can3ge3ZhaDan = _playWay.getChildByName("play_can3ge3ZhaDan");
        this.addListenerText(this.can3ge3ZhaDan);
        this.can3ge3ZhaDan.addEventListener(this.clickCB, this.can3ge3ZhaDan);

        this.showCardNumber = _playWay.getChildByName("play_showCardNumber");
        this.addListenerText(this.showCardNumber);
        this.showCardNumber.addEventListener(this.clickCB, this.showCardNumber);

        this.fangZuoBi = _playWay.getChildByName("play_fangZuoBi");
        this.addListenerText(this.fangZuoBi);
        this.fangZuoBi.addEventListener(this.clickCB, this.fangZuoBi);

        var btn_fangZuoBiTip = this.fangZuoBi.getChildByName("btn_fangZuoBiTip");
        var image_fangZuoBiTip = this.fangZuoBi.getChildByName("image_fangZuoBiTip");
        btn_fangZuoBiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_fangZuoBiTip.setVisible(true);
            }
        }, btn_fangZuoBiTip);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_fangZuoBiTip.isVisible()) {
                    image_fangZuoBiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_fangZuoBiTip);

        this.zhadanjiafen = _playWay.getChildByName("play_zhadanjiafen");
        this.addListenerText(this.zhadanjiafen);
        this.zhadanjiafen.addEventListener(this.clickCB, this.zhadanjiafen);

        var nodeListE = [];
        nodeListE.push(_playWay.getChildByName("mustPut"));
        nodeListE.push(_playWay.getChildByName("notMustPut"));
        this._mustPut_radio = createRadioBoxForCheckBoxs(nodeListE, this.radioBoxSelectCB);
        this.addListenerText(nodeListE, this._mustPut_radio);
        this.nodeListE = nodeListE;

        // 切牌
        if (_playWay.getChildByName("shuffleSys"))
        {
            var nodeListShuffle = [];
            nodeListShuffle.push( _playWay.getChildByName("shuffleSys") );
            nodeListShuffle.push( _playWay.getChildByName("shufflePlayer") );
            this.shuffle_radio = createRadioBoxForCheckBoxs(nodeListShuffle,this.radioBoxSelectCB);
            this.addListenerText(nodeListShuffle,this.shuffle_radio);
            this.nodeListShuffle = nodeListShuffle;
        }

        // this._zhuIdx = 1;
        // this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        // if (this._ZhuNum) {
        //     this._ZhuNum.setString(this._zhuIdx);
        //     this._Button_sub = _bg_Node.getChildByName("btn_sub");
        //     this._Button_sub.addTouchEventListener(function(sender, type) {
        //         if (type == 2) {
        //             if (this._zhuIdx == 1) {
        //                 this._zhuIdx = 11;
        //             }
        //             if (this._zhuIdx > 1) {
        //                 this._zhuIdx--;
        //                 this._ZhuNum.setString(this._zhuIdx);
        //                 this._Button_add.setTouchEnabled(true);
        //                 this._Button_add.setBright(true);
        //                 cc.log("----------------this._guidIdx = " + this._zhuIdx);
        //             }
        //         }
        //     }, this);
        //     this._Button_add = _bg_Node.getChildByName("btn_add");
        //     this._Button_add.addTouchEventListener(function(sender, type) {
        //         if (type == 2) {

        //             if (this._zhuIdx == 10) {
        //                 this._zhuIdx = 0;
        //             }
        //             if (this._zhuIdx < 10) {
        //                 this._zhuIdx++;
        //                 this._ZhuNum.setString(this._zhuIdx);
        //                 this._Button_sub.setTouchEnabled(true);
        //                 this._Button_sub.setBright(true);
        //             }
        //         }
        //     }, this);


        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect: function(isClub) {
        //设置上次创建房间时的默认选项
        var _currentPlayerNumber;
        if (isClub)
            _currentPlayerNumber = this.getNumberItem("maxPlayer", 3);
        else
            _currentPlayerNumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, 3);
        var selectIndex = _currentPlayerNumber == 2 ? 1 : 0;
        this._playNode_player_number_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListA[selectIndex], this.nodeListA);

        var cardNumIndex;
        if (isClub)
            cardNumIndex = this.getNumberItem("cardNumIndex", 0);
        else
            cardNumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, 0);
        this._card_number_radio.selectItem(cardNumIndex)
        this.radioBoxSelectCB(cardNumIndex, this.nodeListB[cardNumIndex], this.nodeListB);

        var selectIndex;
        if (isClub)
            selectIndex = this.getNumberItem("firstHeiTao3", true) ? 0 : 1;
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, 0);
        this._xianshou_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListC[selectIndex], this.nodeListC);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("isXiaoGuan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_XIAO_GUAN_X2, false);
        this.xiaoguanX2.setSelected(isTrue);
        var text = this.xiaoguanX2.getChildByName("text");
        this.selectedCB(text, isTrue)

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("isDaGuan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X3, false);
        this.daguanX3.setSelected(isTrue);
        var text = this.daguanX3.getChildByName("text");
        this.selectedCB(text, isTrue);

        if (isClub)
            isTrue = this.getBoolItem("isDaGuanX2", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X2, true);
        this.daguanX2.setSelected(isTrue);
        var text = this.daguanX2.getChildByName("text");
        this.selectedCB(text, isTrue);

        var selectIndex;
        if (isClub)
            selectIndex = this.getNumberItem("can3daiNum", 1) == 1 ? 0 : 1; 
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_3DAI, 0);
        this._sanDai_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListD[selectIndex], this.nodeListD);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("can4dai2", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI2, true);
        this.can4dai2.setSelected(isTrue);
        var text = this.can4dai2.getChildByName("text");
        this.selectedCB(text, isTrue)

        if (isClub)
            isTrue = this.getBoolItem("can3aZhaDan", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, true);
        this.can3aZhaDan.setSelected(isTrue);
        var text = this.can3aZhaDan.getChildByName("text");
        this.selectedCB(text, isTrue);

        if (isClub)
            isTrue = this.getBoolItem("can3ge3ZhaDan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, false);
        this.can3ge3ZhaDan.setSelected(isTrue);
        var text = this.can3ge3ZhaDan.getChildByName("text");
        this.selectedCB(text, isTrue);

        if (isClub)
            isTrue = this.getBoolItem("showCardNumber", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, true);
        this.showCardNumber.setSelected(isTrue);
        var text = this.showCardNumber.getChildByName("text");
        this.selectedCB(text, isTrue)

        if (isClub)
            isTrue = this.getBoolItem("fangZuoBi", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, false);
        this.fangZuoBi.setSelected(isTrue);
        var text = this.fangZuoBi.getChildByName("text");
        this.selectedCB(text, isTrue);

        if (isClub)
            isTrue = this.getBoolItem("isZhaDanJiaFen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, true);
        this.zhadanjiafen.setSelected(isTrue);
        var text = this.zhadanjiafen.getChildByName("text");
        this.selectedCB(text, isTrue)

        var selectIndex;
        if (isClub)
            selectIndex = this.getBoolItem("mustPut", true) ? 0 : 1;
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_MUST_PUT, 0);
        this._mustPut_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex, this.nodeListE[selectIndex], this.nodeListE);

        if (this.shuffle_radio){
            var shuffle_radioItem
            if (isClub){
                var option = this.getNumberItem("isPlayerShuffle", 0);
                shuffle_radioItem = option
            }
            else{
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, 0);
                shuffle_radioItem = option;
            }
            this.shuffle_radio.selectItem(shuffle_radioItem)
            this.radioBoxSelectCB(shuffle_radioItem,this.nodeListShuffle[shuffle_radioItem],this.nodeListShuffle);
        }

        
        // this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_DIFEN, 1);
        // if (this._ZhuNum)
        //     this._ZhuNum.setString(this._zhuIdx + "");

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_XU_ZHOU;
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2; // this.playerNumber_2.isSelected() ? 2 : 3;
        para.cardNumIndex = this._card_number_radio.getSelectIndex(); // 手牌数量 0:16张手牌  1:15张手牌
        para.firstHeiTao3 = this._xianshou_radio.getSelectIndex() == 0;
        para.isXiaoGuan = this.xiaoguanX2.isSelected();
        para.isDaGuan = this.daguanX3.isSelected();
        para.isDaGuanX2 = this.daguanX2.isSelected();
        para.can3daiNum = this._sanDai_radio.getSelectIndex() == 0 ? 1 : 2;
        para.can4dai2 = this.can4dai2.isSelected(); // 4带2
        para.can3aZhaDan = this.can3aZhaDan.isSelected();
        para.can3ge3ZhaDan = this.can3ge3ZhaDan.isSelected();
        para.showCardNumber = this.showCardNumber.isSelected(); // 显示牌数量
        para.fangZuoBi = this.fangZuoBi.isSelected();
        para.isZhaDanJiaFen = this.zhadanjiafen.isSelected();
        para.mustPut = this._mustPut_radio.getSelectIndex() == 0;

        if (this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        if (this._ZhuNum) {
            para.difen = this._zhuIdx;
	    if (!this._isFriendCard) {
	    	util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, para.difen);
	    }
        }
        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }
        // 15张牌没有3个a， 所以不提示3a炸弹
        if (1 == para.cardNumIndex) para.can3aZhaDan = false;

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, para.cardNumIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, this._xianshou_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_XIAO_GUAN_X2, para.isXiaoGuan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X3, para.isDaGuan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X2, para.isDaGuanX2);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_3DAI, this._sanDai_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, para.can3aZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, para.can3ge3ZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, para.showCardNumber);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, para.isZhaDanJiaFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_MUST_PUT, this._mustPut_radio.getSelectIndex());
            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});