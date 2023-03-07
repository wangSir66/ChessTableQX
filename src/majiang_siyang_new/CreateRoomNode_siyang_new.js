/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_siyang_new = CreateRoomNode.extend({

    initAll: function(IsFriendCard) {
        if (!IsFriendCard) {
            this.localStorageKey.KEY_siyang_maxPlayer     = "_CF_SI_YANG_MAX_PLAYER";       //几人玩
            this.localStorageKey.KEY_siyang_tuoguan             = "_SI_YANG_tuoguan";
        }

        this.bg_node = ccs.load("bg_siyang_new.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_siyang");
    },

    selectPay: function(roundNumObj, str_type, str_pay) {
        for (var i=0; i<this.roundNodeArray.length; i++) {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) ) {
                if (! roundNumObj[i] || !str_pay || (str_pay[i] && str_pay[i]<0)) {
                    roundNode.visible = false;
                    cc.log('warn 局数按钮隐藏 selectPay no roundNumObj', roundNumObj, i, str_pay);
                    continue;
                }

                var text = roundNode.getChildByName("text");
                var text_0 = roundNode.getChildByName("text_0");
                if (text_0) {
                    text.setString(roundNumObj[i] + "局");
                    var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
                    if (maxPlayerIndex == 3) {
                        // 自由人数（价格显示调整：显示选择不同人数时，最小和最大消耗元宝的区间范围）
                        var paySection = this.getMinPlayerStrPay(str_pay);
                        text_0.setString("(" + paySection[i] + this._costName + ")");
                    }
                    else {
                        text_0.setString("(" + str_pay[i] + this._costName + ")");
                    }
                    if (this._isRoomCardMode) {
                        text_0.visible = false;
                    }
                }
            }
        }
    },

    getMinPlayerStrPay: function (str_pay) {
        // 获取最小人数的价格配置
        var pGameType = this._data.gameType;
        var minPlayerNum = 2; // 最小人数
        var pPriceCfg = MjClient.data.gamePrice;
        var totalPayWayArray = pPriceCfg[pGameType][minPlayerNum];

        // 根据已选择的付费方式，取出相应的价格配置
        var str_pay_min = [];
        for (var i = 0; i < this.payWayNodeArray.length; i++) {
            var payWayNode = this.payWayNodeArray[i];
            if (cc.sys.isObjectValid(payWayNode) && payWayNode.isSelected()) {
                var roundNumObj = this.getRoundNumObj();
                var payWayArr = [];
                for (var j in roundNumObj) {
                    var __roundNum = roundNumObj[j];
                    var __payWay = totalPayWayArray[__roundNum];
                    if ( __payWay[i] || __payWay[i] == 0) payWayArr.push(__payWay[i]);
                }
                if (payWayArr.length > 0) str_pay_min = payWayArr;
            }
        }

        // 求取价格区间范围
        var paySection = [];
        for (var i = 0; i < str_pay.length; i++) {
            paySection[i] = str_pay[i] + "";
            if (str_pay[i] != str_pay_min[i]) {
                paySection[i] = str_pay_min[i] + "~" + str_pay[i];
            }
        }

        return paySection;
    },

    initPlayNode: function() {
        this._super();
        var _bgSiyangNode = this.bg_node.getChildByName("view");
        _bgSiyangNode.setScrollBarEnabled(false);
        var _play = _bgSiyangNode.getChildByName("play");


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
        var text = image_tuoguanTip.getChildByName("Text_10");
        text.setFlippedX(true);
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

        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
        this.addListenerText(maxPlayerList, this.maxPlayerList_radio, this.changePayForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4])

    },

    setPlayNodeCurrentSelect: function(isClub) {
        this._super();
        
        var maxPlayer;
        if (isClub)
            if (this.getBoolItem("convertible", false))
                maxPlayer = 3;
            else
                maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_siyang_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer, this.maxPlayerList[maxPlayer], this.maxPlayerList);

        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_siyang__tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();
    },

    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIN_SI_YANG;
        para.convertible = false;
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        para.maxPlayer = [4, 3, 2, 4][maxPlayerIndex];     // 人数
        para.trustTime = 0;
        if (maxPlayerIndex == 3) 
        {
            para.convertible = true;
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
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        //是否加注

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_siyang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_siyang_tuoguan, tuoguan);
        }
        //cc.log("------gameType localStorageEncrypt: " + _gameType);
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    
    getSelectNum : function(node,nums) {
        var playnum = 4;
        for(var i in node) {

            if(node[i].isSelected()) playnum = [nums[i]];
        }
        return playnum;
    }
});