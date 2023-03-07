var CreateRoomNode_sanDaHaYueyang = CreateRoomNode.extend({
    setKey:function()
    {
        // this.localStorageKey.KEY_YUEYANG_SDH_doubleInSingleOut      = "YUEYANG_SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_YUEYANG_SDH_pairCanBeatTractor         = "YUEYANG_SAN_DA_HA_pairCanBeatTractor";   //允许拖拉机消对
        this.localStorageKey.KEY_YUEYANG_SDH_blankThrowCardNumOpt       = "YUEYANG_SAN_DA_HA_blankThrowCardNumOpt"; // 庄家甩牌最多两张
        this.localStorageKey.KEY_YUEYANG_SDH_allowCheckCard         = "YUEYANG_SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_YUEYANG_SDH_touXiangXuXunWen       = "YUEYANG_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_YUEYANG_SDH_daDaoTiQianOver        = "YUEYANG_SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
        this.localStorageKey.KEY_YUEYANG_SDH_difen                  = "YUEYANG_SAN_DA_HA_difen";                  //底分
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();
        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_sanDaHaYueyang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_sanDaHa").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_sanDaHa");
    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");
        var _round = _bg_Node.getChildByName("round");

        if(!_playWay) _playWay = _bg_Node.getParent().getChildByName("play_way");
        if(!_round) _round = _bg_Node.getParent().getChildByName("round");
        
        // 人数

        // this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        // this.addListenerText(this.doubleInSingleOut);
        // this.doubleInSingleOut.addEventListener(this.clickCB, this.doubleInSingleOut);

        // var nodeListPlayerNum = [];
        // nodeListPlayerNum.push(_round.getChildByName("radioBox_playerNum3"));
        // this.radioBox_playerNum3 = createRadioBoxForCheckBoxs(nodeListPlayerNum, function (index) {
        //     this.radioBoxSelectCB(0, nodeListPlayerNum[index], nodeListPlayerNum);
        // }.bind(this));
        // this.addListenerText(nodeListPlayerNum, this.radioBox_playerNum3);
        // this.nodeListPlayerNum = nodeListPlayerNum;

        // 允许拖拉机消对
        this.checkBox_pairCanBeatTractor = _playWay.getChildByName("checkBox_pairCanBeatTractor");
        this.addListenerText(this.checkBox_pairCanBeatTractor);
        this.checkBox_pairCanBeatTractor.addEventListener(this.clickCB, this.checkBox_pairCanBeatTractor);

        // 庄家甩牌最多两张
        this.checkBox_blankThrowCardNumOpt = _playWay.getChildByName("checkBox_blankThrowCardNumOpt");
        this.addListenerText(this.checkBox_blankThrowCardNumOpt);
        this.checkBox_blankThrowCardNumOpt.addEventListener(this.clickCB, this.checkBox_blankThrowCardNumOpt);

        //允许查牌
        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        this.addListenerText(this.allowCheckCard);
        this.allowCheckCard.addEventListener(this.clickCB, this.allowCheckCard);

        //投降询问所有人
        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        this.addListenerText(this.touXiangXuXunWen);
        this.touXiangXuXunWen.addEventListener(this.clickCB, this.touXiangXuXunWen);

        //大倒提前结束
        this.daDaoTiQianOver = _playWay.getChildByName("play_daDaoTiQianOver");
        this.addListenerText(this.daDaoTiQianOver);
        this.daDaoTiQianOver.addEventListener(this.clickCB, this.daDaoTiQianOver);

        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bg_Node.getParent().getChildByName("btn_add");
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

        // 永利三打哈合并相关

        if (_round.getChildByName("playType_1")) {
            var playTypeList = [];
            playTypeList.push( _round.getChildByName("playType_1") );
            playTypeList.push( _round.getChildByName("playType_2") );
            playTypeList.push( _round.getChildByName("playType_3") );
            playTypeList.push( _round.getChildByName("playType_4") );

            this.playTypeList = playTypeList;

            var playTypeList_radio = createRadioBoxForCheckBoxs(playTypeList,function(index){
                this.radioBoxSelectCB(index, playTypeList[index], playTypeList);
                this.changeGameType(index);
            }.bind(this));
            this.addListenerText(playTypeList,playTypeList_radio,function(index) {
                this.changeGameType(index);
            }.bind(this));
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //设置上次创建房间时的默认选项
        var isTrue;
        // if (isClub)
        //     isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        // else
        //     isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_doubleInSingleOut, true);
        // this.doubleInSingleOut.setSelected(isTrue);
        // var text = this.doubleInSingleOut.getChildByName("text");
        // this.selectedCB(text,isTrue)
        if (isClub)
            isTrue = this.getNumberItem("SAN_DA_HA_allowTuoLaJiXiaoDui", 0);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_pairCanBeatTractor, false);
        this.checkBox_pairCanBeatTractor.setSelected(isTrue);
        var text = this.checkBox_pairCanBeatTractor.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getNumberItem("SAN_DA_HA_shuaiPaiLimitTwoCard", 0);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_blankThrowCardNumOpt, false);
        this.checkBox_blankThrowCardNumOpt.setSelected(isTrue);
        var text = this.checkBox_blankThrowCardNumOpt.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_daDaoTiQianOver, true);
        this.daDaoTiQianOver.setSelected(isTrue);
        var text = this.daDaoTiQianOver.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YUEYANG_SDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_SAN_DA_HA;
        para.maxPlayer = 3;
        // para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问
        para.SAN_DA_HA_daDaoTiQianOver = this.daDaoTiQianOver.isSelected();       // 大倒提前结束
        para.difen = this._zhuIdx;

        para.SAN_DA_HA_allowTuoLaJiXiaoDui = this.checkBox_pairCanBeatTractor.isSelected(); // 允许拖拉机消对
        para.SAN_DA_HA_shuaiPaiLimitTwoCard = this.checkBox_blankThrowCardNumOpt.isSelected(); // 庄家甩牌最多两张

		if (!this._isFriendCard) {
	        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_daDaoTiQianOver, para.SAN_DA_HA_daDaoTiQianOver);
	        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YUEYANG_SDH_difen, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_pairCanBeatTractor, para.SAN_DA_HA_allowTuoLaJiXiaoDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YUEYANG_SDH_blankThrowCardNumOpt, para.SAN_DA_HA_shuaiPaiLimitTwoCard);
		}
		
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    changeGameType: function(indexSelected) {
        postEvent("changeRoomNodeByType",{oldType: this._data.gameType,newType: this.gameTypes[indexSelected]});
    },

    initGameTypeNode: function(gameTypes) {
        if (!this.playTypeList)
            return;
        
        this.gameTypes = gameTypes.slice();

        var typesCount = this.gameTypes.length;
        var indexSelected = this.gameTypes.indexOf(this._data.gameType);

        for (var i = 0; i < this.playTypeList.length; i++) {
            var gameNode = this.playTypeList[i];

            if (i < typesCount) {
                gameNode.setVisible(true);

                var textLabel = gameNode.getChildByName("text");
                textLabel.setString(GameCnName[this.gameTypes[i]]);

                gameNode.setSelected(indexSelected == i);
                this.selectedCB(textLabel,indexSelected == i);
            } else
                gameNode.setVisible(false);
        }
    }
});