var CreateRoomNode_baoPaiYZ = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_SDH_playerCount            = "SAN_DA_HA_playerCount";              //人数
        this.localStorageKey.KEY_SDH_doubleInSingleOut      = "SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_SDH_allowCheckCard         = "SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_SDH_touXiangXuXunWen       = "SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_SDH_daDaoBuFengDing        = "SAN_DA_HA_daDaoBuFengDing";         //大倒不封顶
        this.localStorageKey.KEY_SDH_yunXuHanLai            = "SAN_DA_HA_allowHanLai";             //允许喊来
        this.localStorageKey.KEY_SDH_difen                  = "SAN_DA_HA_difen";                  //底分
        this.localStorageKey.KEY_SDH_jiaChui                = "SAN_DA_HA_jiaChui";                  //加锤
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_baoPaiYZ.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_baoPaiYZ").getChildByName("view");
        if(!this.bg_node){
            this.bg_node = this.bgNode.getChildByName("bg_baoPaiYZ");
        }

    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        this._playNode_playercount_0 = _playWay.getChildByName("radioBox_playerNum3"); // 人数
        this._playNode_playercount_1 = _playWay.getChildByName("radioBox_playerNum4");
        var nodePlayercount = [];
        nodePlayercount.push( this._playNode_playercount_0 );
        nodePlayercount.push( this._playNode_playercount_1 );
        this._playNode_Player_radio = createRadioBoxForCheckBoxs(nodePlayercount,function(index){
            this.radioBoxSelectCB(index, nodePlayercount[index], nodePlayercount);
        }.bind(this));
        this.addListenerText(nodePlayercount,this._playNode_Player_radio);

        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        this.addListenerText(this.doubleInSingleOut);
        this.doubleInSingleOut.addEventListener(this.clickCB, this.doubleInSingleOut);

        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        this.addListenerText(this.allowCheckCard);
        this.allowCheckCard.addEventListener(this.clickCB, this.allowCheckCard);

        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        this.addListenerText(this.touXiangXuXunWen);
        this.touXiangXuXunWen.addEventListener(this.clickCB, this.touXiangXuXunWen);

        //允许喊来
        this.yunXuHanLai = _playWay.getChildByName("play_yunXuHanLai"); //叫分加拍
        this.addListenerText(this.yunXuHanLai);
        this.yunXuHanLai.addEventListener(this.clickCB, this.yunXuHanLai);

        //大倒不封顶
        this.daDaoBuFengDing = _playWay.getChildByName("play_daDaoBuFengDing");
        this.addListenerText(this.daDaoBuFengDing, null, function(selectedNum,sender){
            //this.refreshZhuangFuXianShou(sender.isSelected());
        }.bind(this));
        this.daDaoBuFengDing.addEventListener(this.daDaoBuFengDingClickCB.bind(this), this.daDaoBuFengDing);

        //加锤
        this.jiaChui = _playWay.getChildByName("play_jiaChui");
        this.addListenerText(this.jiaChui);
        this.jiaChui.addEventListener(this.clickCB, this.jiaChui);

        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if(!this._ZhuNum){
            this._ZhuNum = _bg_Node.getParent().getChildByName("txt_fen")
        }
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this._ZhuNum.getParent().getChildByName("btn_sub");
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
            this._Button_add = this._ZhuNum.getParent().getChildByName("btn_add");
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
        var _round = this.bg_node.getChildByName("round");

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
        var playerCount;
        if (isClub) {
            playerCount = this.getNumberItem("maxPlayer", 4);
        } else {
            playerCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SDH_playerCount,4);
        }
        if (playerCount == 3) {
            this._playNode_playercount_0.setSelected(true);
            this._playNode_playercount_1.setSelected(false);
            var text1 = this._playNode_playercount_0.getChildByName("text");
            var text2 = this._playNode_playercount_1.getChildByName("text");
            this.selectedCB(text1,true)
            this.selectedCB(text2,false)
        } else {
            this._playNode_playercount_1.setSelected(true);
            this._playNode_playercount_0.setSelected(false);
            var text1 = this._playNode_playercount_0.getChildByName("text");
            var text2 = this._playNode_playercount_1.getChildByName("text");
            this.selectedCB(text1,false)
            this.selectedCB(text2,true)
        }
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_doubleInSingleOut, false);
        this.doubleInSingleOut.setSelected(isTrue);
        var text = this.doubleInSingleOut.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_allowCheckCard, false);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_touXiangXuXunWen, false);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)


        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");


        if (isClub)
            isTrue = this.getBoolItem("allowHanLai", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_yunXuHanLai, false);
        this.yunXuHanLai.setSelected(isTrue);
        var text = this.yunXuHanLai.getChildByName("text");
        this.selectedCB(text,isTrue)


        // 报副留守
        if (isClub)
            isTrue = this.getBoolItem("daDaoBuFengDing", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_daDaoBuFengDing, false);
        this.daDaoBuFengDing.setSelected(isTrue);
        var text = this.daDaoBuFengDing.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 加锤
        if (isClub)
            isTrue = this.getBoolItem("jiaChui", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_jiaChui, false);
        this.jiaChui.setSelected(isTrue);
        this.selectedCB(this.jiaChui.getChildByName("text"),isTrue)
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YONG_ZHOU_BAO_PAI;
        if (this._playNode_playercount_0.isSelected()) {
            para.maxPlayer = 3;
        } else {
            para.maxPlayer = 4;
        }

        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问
        para.SAN_DA_HA_difen = this._zhuIdx;
        para.daDaoBuFengDing = this.daDaoBuFengDing.isSelected();         // 报副留守
        para.allowHanLai = this.yunXuHanLai.isSelected();       // 叫分加拍
        para.jiaChui = this.jiaChui.isSelected();       // 加锤

		if (!this._isFriendCard) {
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SDH_difen, para.SAN_DA_HA_difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SDH_playerCount, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_daDaoBuFengDing, para.daDaoBuFengDing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_yunXuHanLai, para.allowHanLai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_jiaChui, para.jiaChui);
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
    },

    daDaoBuFengDingClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                //this.refreshZhuangFuXianShou(sender.isSelected());
                break;
        }
    },

    refreshBaoFuLiuShou: function(bSelected) {
        if (bSelected) {
            this.baoFuLiuShou.setSelected(false);
            this.selectedCB(this.baoFuLiuShou.getChildByName("text"),false);
        }
    },

    zhuangFuXianShouClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshBaoFuLiuShou(sender.isSelected());
                break;
        }
    },

    refreshZhuangFuXianShou: function(bSelected) {
        if (bSelected) {
            // this.zhuangFuXianShou.setSelected(false);
            // this.selectedCB(this.zhuangFuXianShou.getChildByName("text"),false);
        }
    }
});