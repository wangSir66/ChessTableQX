var CreateRoomNode_sanDaHaNew = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_NEW_SDH_maxPlayer     = "NEW_SAN_DA_HA_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_NEW_SDH_doubleInSingleOut      = "NEW_SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_NEW_SDH_allowCheckCard         = "NEW_SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_NEW_SDH_touXiangXuXunWen       = "NEW_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_NEW_SDH_buKeZaiJiao        = "NEW_SAN_DA_HA_buKeZaiJiao";        //60分不可再叫
        this.localStorageKey.KEY_NEW_SDH_baoFuLiuShou       = "NEW_SAN_DA_HA_baoFuLiuShou";         //报富留守
        this.localStorageKey.KEY_NEW_SDH_60fenQiJiao       = "NEW_SAN_DA_HA_60fenQiJiao";       //60分起叫
        this.localStorageKey.KEY_NEW_SDH_quDiaoLiu        = "NEW_SAN_DA_HA_quDiaoLiu";        //去掉6
        this.localStorageKey.KEY_NEW_SDH_biChangZhu        = "NEW_SAN_DA_HA_biChangZhu";        //比常主
        this.localStorageKey.KEY_NEW_SDH_xiaoGuang      = "NEW_SAN_DA_HA_xiaoGuang";        //小光
        this.localStorageKey.KEY_NEW_SDH_yiDangRenShu6      = "NEW_SAN_DA_HA_yiDangRenShu6";        //一档认输6分
        this.localStorageKey.KEY_NEW_SDH_daWuZhu      = "NEW_SAN_DA_HA_daWuZhu";        //打无主
        this.localStorageKey.KEY_NEW_SDH_jiaoFenJiaPai      = "NEW_SAN_DA_HA_jiaoFenJiaPai";        //叫分加拍
        this.localStorageKey.KEY_NEW_SDH_difen                  = "NEW_SAN_DA_HA_difen";                  //底分
    },
    initAll:function(IsFriendCard)
    {
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        if (!IsFriendCard)
            this.setKey();
        this.roundNumObj = {roundNum1:8, roundNum2:16};
        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bg_node = ccs.load("bg_sanDaHaNew.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_sanDaHaNew");

        var bg_node = this.bg_node.getChildByName("view");
        if(bg_node){
            this.bg_node = bg_node;
        }

    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        var maxPlayerList = [];
        this.playNum4=_bg_Node.getChildByName("play_num4");
        this.playNum3=_bg_Node.getChildByName("play_num3");
        maxPlayerList.push(this.playNum3);
        maxPlayerList.push(this.playNum4);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function (index) {
            this.showPlayTypeForPlayNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
        this.addListenerText(maxPlayerList, this.maxPlayerList_radio,this.showPlayTypeForPlayNum.bind(this));
        this.maxPlayerList = maxPlayerList;

        MjClient.createRoomUI = this;

        //双进单出
        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        this.addListenerText(this.doubleInSingleOut);
        this.doubleInSingleOut.addEventListener(this.clickCB, this.doubleInSingleOut);

        //允许查牌
        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        this.addListenerText(this.allowCheckCard);
        this.allowCheckCard.addEventListener(this.clickCB, this.allowCheckCard);

        //投降询问所有人
        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        this.addListenerText(this.touXiangXuXunWen);
        this.touXiangXuXunWen.addEventListener(this.clickCB, this.touXiangXuXunWen);

        //报富留守
        this.baoFuLiuShou = _playWay.getChildByName("play_baoFuLiuShou");
        this.addListenerText(this.baoFuLiuShou);
        this.baoFuLiuShou.addEventListener(this.clickCB, this.baoFuLiuShou);

        //60分起叫
        this.qiJiaofen60= _playWay.getChildByName("play_60fenQiJiao");
        this.quDiaoLiu = _playWay.getChildByName("play_quDiaoLiu");      //去掉6
        this.biChangZhu = _playWay.getChildByName("play_biChangZhu");     //比常主
        this.buKeZaiJiao = _playWay.getChildByName("buKeZaiJiao");    //60分不可再叫

        this.addListenerText(this.qiJiaofen60, null, function(selectedNum,sender){
            this.refreshQiJiao60Related(sender.isSelected(),false);
        }.bind(this));
        this.qiJiaofen60.addEventListener(this.qiJiao60ClickCB.bind(this), this.qiJiaofen60);

        this.addListenerText(this.quDiaoLiu);
        this.quDiaoLiu.addEventListener(this.clickCB, this.quDiaoLiu);

        this.addListenerText(this.biChangZhu);
        this.biChangZhu.addEventListener(this.clickCB, this.biChangZhu);

        this.addListenerText(this.buKeZaiJiao);
        this.buKeZaiJiao.addEventListener(this.clickCB, this.buKeZaiJiao);

        //小光
        var nodeListXiaoGuang = [];
        this.xiaoGuangFen25=_bg_Node.getChildByName("play_25fenxiaoguang");
        this.xiaoGuangFen30=_bg_Node.getChildByName("play_30fenxiaoguang");
        nodeListXiaoGuang.push(this.xiaoGuangFen25);
        nodeListXiaoGuang.push(this.xiaoGuangFen30);
        this.xiaoGuang_radio = createRadioBoxForCheckBoxs(nodeListXiaoGuang, function (index) {
            this.radioBoxSelectCB(index, nodeListXiaoGuang[index], nodeListXiaoGuang);
        }.bind(this));
        this.addListenerText(nodeListXiaoGuang, this.xiaoGuang_radio);
        this.xiaoGuangList = nodeListXiaoGuang;

        // 一档认输6分
        this.yiDangRenShu6 = _playWay.getChildByName("play_yiDangRenShu6");
        this.addListenerText(this.yiDangRenShu6);
        this.yiDangRenShu6.addEventListener(this.clickCB, this.yiDangRenShu6);

        // 打无主
        this.daWuZhu = _playWay.getChildByName("play_daWuZhu");
        this.addListenerText(this.daWuZhu);
        this.daWuZhu.addEventListener(this.clickCB, this.daWuZhu);

        // 叫分加拍
        this.jiaoFenJiaPai = _playWay.getChildByName("play_jiaoFenJiaPai");
        this.addListenerText(this.jiaoFenJiaPai);
        this.jiaoFenJiaPai.addEventListener(this.clickCB, this.jiaoFenJiaPai);

        // 底分
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
        var _round = _bg_Node.getChildByName("round");

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
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub) {
            isTrue = this.getNumberItem("maxPlayer", 4);
        }
        else {
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NEW_SDH_maxPlayer, 4);
        }
        var indexSelected = [3,4].indexOf(isTrue);
        this.maxPlayerList_radio.selectItem(indexSelected);
        this.radioBoxSelectCB(indexSelected,this.maxPlayerList[indexSelected],this.maxPlayerList);
        this.showPlayTypeForPlayNum(indexSelected,true);

        if (isClub)
            isTrue = [25,30].indexOf(this.getNumberItem("xiaoGuangFen", 30));
        else
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NEW_SDH_xiaoGuang, 1);
        this.xiaoGuang_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue, this.xiaoGuangList[isTrue], this.xiaoGuangList);

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_doubleInSingleOut, false);
        this.doubleInSingleOut.setSelected(isTrue);
        var text = this.doubleInSingleOut.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("baoFuLiuShou", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_baoFuLiuShou, false);
        this.baoFuLiuShou.setSelected(isTrue);
        var text = this.baoFuLiuShou.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("qiJiao60", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_60fenQiJiao, false);
        this.qiJiaofen60.setSelected(isTrue);
        var text = this.qiJiaofen60.getChildByName("text");
        this.selectedCB(text,isTrue);

        this.refreshQiJiao60Related(isTrue,true);

        // 一档认输6分
        if (isClub)
            isTrue = this.getBoolItem("yiDangRenShu6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_yiDangRenShu6, false);
        this.yiDangRenShu6.setSelected(isTrue);
        var text = this.yiDangRenShu6.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 打无主
        if (isClub)
            isTrue = this.getBoolItem("daWuZhu", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_daWuZhu, false);
        this.daWuZhu.setSelected(isTrue);
        var text = this.daWuZhu.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 叫分加拍
        if (isClub)
            isTrue = this.getBoolItem("jiaoFenJiaPai", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_jiaoFenJiaPai, false);
        this.jiaoFenJiaPai.setSelected(isTrue);
        var text = this.jiaoFenJiaPai.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 底分
        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NEW_SDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
    },
    getSelectedPara:function()
    {
        var para = {};

        para.gameType = MjClient.GAME_TYPE.SAN_DA_HA_NEW;

        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问

        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.baoFuLiuShou = this.baoFuLiuShou.isSelected();   // 报富留守

        para.biChangZhu = this.biChangZhu.isSelected();     //比常主
        para.qiJiao60 = this.qiJiaofen60.isSelected();   // 60分起叫
        para.chou6 = this.quDiaoLiu.isSelected();   // 去掉6
        para.buKeZaiJiao = this.buKeZaiJiao.isSelected();   // 60分不可再叫

        para.yiDangRenShu6 = this.yiDangRenShu6.isSelected();
        para.daWuZhu = this.daWuZhu.isSelected();
        para.jiaoFenJiaPai = this.jiaoFenJiaPai.isSelected();

        para.maxPlayer = this.playNum3.isSelected() ? 3 : 4;

        para.SAN_DA_HA_difen = this._zhuIdx;

        var _xiaoguangIdx = 0;
        if (this.xiaoGuangFen25.isSelected()) {
            para.xiaoGuangFen  = 25;
            _xiaoguangIdx = 0;
        }
        else if (this.xiaoGuangFen30.isSelected()) {
            para.xiaoGuangFen  = 30;
            _xiaoguangIdx = 1;
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NEW_SDH_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NEW_SDH_xiaoGuang, _xiaoguangIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_buKeZaiJiao, para.buKeZaiJiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_biChangZhu, para.biChangZhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_baoFuLiuShou, para.baoFuLiuShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_60fenQiJiao, para.qiJiao60);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_quDiaoLiu, para.chou6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_yiDangRenShu6, para.yiDangRenShu6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_daWuZhu, para.daWuZhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NEW_SDH_jiaoFenJiaPai, para.jiaoFenJiaPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NEW_SDH_difen, para.SAN_DA_HA_difen);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayTypeForPlayNum:function(indexSelected,bFirst)
    {
        // 三人玩
        if (indexSelected <= 0) {
            this.quDiaoLiu.setSelected(true);
            this.quDiaoLiu.setEnabled(false);
            this.quDiaoLiu.getChildByName("text").setTextColor(cc.color(128, 128, 128));
        } else if (bFirst) {
            var isTrue = false;

            if (this._isFriendCard)
                isTrue = this.getBoolItem("chou6", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_quDiaoLiu, false);

            this.quDiaoLiu.setSelected(isTrue);
            this.selectedCB(this.quDiaoLiu.getChildByName("text"),isTrue)
        } else {
            this.quDiaoLiu.setSelected(false);
            this.quDiaoLiu.setEnabled(true);
            this.selectedCB(this.quDiaoLiu.getChildByName("text"),false);
        }
    },
    qiJiao60ClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshQiJiao60Related(sender.isSelected(),false);
                break;
        }
    },

    refreshQiJiao60Related: function(bQiJiao60Selected,bFirst) {
        // 60分起叫没有选中
        if (!bQiJiao60Selected) {
            this.buKeZaiJiao.setSelected(false);
            this.buKeZaiJiao.setVisible(false);
            this.selectedCB(this.buKeZaiJiao.getChildByName("text"),false);

            this.biChangZhu.setSelected(false);
            this.biChangZhu.setVisible(false);
            this.selectedCB(this.biChangZhu.getChildByName("text"),false);
        } else if (bFirst) {
            var isTrue = false;

            if (this._isFriendCard)
                isTrue = this.getBoolItem("buKeZaiJiao", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_buKeZaiJiao, false);
            this.buKeZaiJiao.setSelected(isTrue);
            this.selectedCB(this.buKeZaiJiao.getChildByName("text"),isTrue)

            if (this._isFriendCard)
                isTrue = this.getBoolItem("biChangZhu", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NEW_SDH_biChangZhu, false);
            this.biChangZhu.setSelected(isTrue);
            this.selectedCB(this.biChangZhu.getChildByName("text"),isTrue)
        } else {
            this.buKeZaiJiao.setVisible(true);
            this.biChangZhu.setVisible(true);
        }
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