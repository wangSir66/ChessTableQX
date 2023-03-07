var CreateRoomNode_sanDaHaYongLi = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_YLSDH_doubleInSingleOut      = "YL_SAN_DA_HA_doubleInSigleOut";       //双进单出
            this.localStorageKey.KEY_YLSDH_allowCheckCard         = "YL_SAN_DA_HA_allowCheckCard";         //允许查牌
            this.localStorageKey.KEY_YLSDH_touXiangXuXunWen       = "YL_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
            this.localStorageKey.KEY_YLSDH_daDaoTiQianOver        = "YL_SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
            this.localStorageKey.KEY_YLSDH_chouLiu        = "YL_SAN_DA_HA_chouLiu  ";        //抽6
            this.localStorageKey.KEY_YLSDH_teshutuolaji           = "YL_SAN_DA_HA_teshutuolaji";           //特殊拖拉机
            this.localStorageKey.KEY_YLSDH_changZhuDuoBiJiao      = "KEY_YLSDH_changZhuDuoBiJiao";         //常主多必叫
            this.localStorageKey.KEY_YLSDH_chuPaiTouXiangZuiDaFen     = "KEY_YLSDH_chuPaiTouXiangZuiDaFen";         //出牌后投降按大倒算分
            this.localStorageKey.KEY_YLSDH_isTouXiangDouble   = "KEY_YLSDH_isTouXiangDouble";         //叫分小于等于70分投降翻倍
            this.localStorageKey.KEY_YLSDH_difen                  = "YL_SAN_DA_HA_difen";                  //底分
        }
        this.roundNumObj = {roundNum1:8, roundNum2:16};

        this.bg_node = ccs.load("bg_sanDaHaYongLi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_sanDaHa");
        if(this.bg_node.getChildByName("view")) {
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        cc.eventManager.addListener(this.setTextClick(),this.doubleInSingleOut.getChildByName("text"));
        this.doubleInSingleOut.addEventListener(this.clickCB, this.doubleInSingleOut);

        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        cc.eventManager.addListener(this.setTextClick(),this.allowCheckCard.getChildByName("text"));
        this.allowCheckCard.addEventListener(this.clickCB, this.allowCheckCard);

        this.touXiangXuXunWen    = _playWay.getChildByName("play_touXiangXuXunWen");
        cc.eventManager.addListener(this.setTextClick(),this.touXiangXuXunWen.getChildByName("text"));
        this.touXiangXuXunWen.addEventListener(this.clickCB, this.touXiangXuXunWen);

        this.daDaoTiQianOver    = _playWay.getChildByName("play_daDaoTiQianOver");
        cc.eventManager.addListener(this.setTextClick(),this.daDaoTiQianOver.getChildByName("text"));
        this.daDaoTiQianOver.addEventListener(this.clickCB, this.daDaoTiQianOver);

        this.chouLiu = _playWay.getChildByName("play_chouLiu");
        cc.eventManager.addListener(this.setTextClick(),this.chouLiu.getChildByName("text"));
        this.chouLiu.addEventListener(this.clickCB, this.chouLiu);

        this.teshutuolaji = _playWay.getChildByName("play_teshutuolaji");
        cc.eventManager.addListener(this.setTextClick(),this.teshutuolaji.getChildByName("text"));
        this.teshutuolaji.addEventListener(this.clickCB, this.teshutuolaji);

        this.cbxChangZhuDuoBiJiao = _playWay.getChildByName("play_changZhuDuoBiJiao");
        cc.eventManager.addListener(this.setTextClick(),this.cbxChangZhuDuoBiJiao.getChildByName("text"));
        this.cbxChangZhuDuoBiJiao.addEventListener(this.clickCB, this.cbxChangZhuDuoBiJiao);

        // this.chuPaiTouXiangZuiDaFen = _playWay.getChildByName("play_chuPaiTouXiangZuiDaFen");
        // cc.eventManager.addListener(this.setTextClick(),this.chuPaiTouXiangZuiDaFen.getChildByName("text"));
        // this.chuPaiTouXiangZuiDaFen.addEventListener(this.clickCB, this.chuPaiTouXiangZuiDaFen);
        //
        // this.isTouXiangDouble = _playWay.getChildByName("play_isTouXiangDouble");
        // cc.eventManager.addListener(this.setTextClick(),this.isTouXiangDouble.getChildByName("text"));
        // this.isTouXiangDouble.addEventListener(this.clickCB, this.isTouXiangDouble);

        var huChiCheckBoxs = function(list) {
            var list_radio = createRadioBoxForCheckBoxsHuChi(list, function(index) {
                for (var i = 0; i < list.length; i++) {
                    this.clickCB(list[i], list[i].isSelected() ? ccui.CheckBox.EVENT_SELECTED : ccui.CheckBox.EVENT_UNSELECTED);
                }
            }.bind(this));
            for (var i = 0; i < list.length; i++) {
                var func = function(index) {
                    this.addListenerText(list[index], null, function() {
                        list_radio.selectItem(list[index].isSelected() ? index : -1);
                        for (var i = 0; i < list.length; i++) {
                            var isSelected = list[i].isSelected();
                            this.selectedCB(list[i].getChildByName("text"),isSelected);
                        }
                    }.bind(this));
                }.bind(this);
                func(i);
            }
            return list_radio;
        }.bind(this);

        var touXiangList = [];
        this.chuPaiTouXiangZuiDaFen     = _playWay.getChildByName("play_chuPaiTouXiangZuiDaFen");
        this.isTouXiangDouble    = _playWay.getChildByName("play_isTouXiangDouble");
        touXiangList.push(this.chuPaiTouXiangZuiDaFen);
        touXiangList.push(this.isTouXiangDouble);
        this.touXiangList_radio = huChiCheckBoxs(touXiangList);
        this.touXiangList = touXiangList;

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
                    if (this._zhuIdx == 1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 1) {
                        this._zhuIdx--;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
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
                        this._zhuIdx++;
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
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_doubleInSingleOut, true);
        this.doubleInSingleOut.setSelected(isTrue);
        this.selectedCB(this.doubleInSingleOut.getChildByName("text"),isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        this.selectedCB(this.allowCheckCard.getChildByName("text"),isTrue)

        var chuPaiTouXiangZuiDaFen;
        if (isClub)
            chuPaiTouXiangZuiDaFen = this.getBoolItem("chuPaiTouXiangZuiDaFen", false);
        else
            chuPaiTouXiangZuiDaFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_chuPaiTouXiangZuiDaFen, false);
        var isTouXiangDouble;
        if (isClub)
            isTouXiangDouble = this.getBoolItem("isTouXiangDouble", false);
        else
            isTouXiangDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_isTouXiangDouble, false);
        var touXiangIndex = chuPaiTouXiangZuiDaFen ? 0 : (isTouXiangDouble ? 1 : -1);
        this.touXiangList_radio.selectItem(touXiangIndex);
        for (var i = 0; i < this.touXiangList.length; i ++) {
            var isSelected = i == touXiangIndex ? true : false;
            this.selectedCB(this.touXiangList[i].getChildByName("text"),isSelected);
        }

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        this.selectedCB(this.touXiangXuXunWen.getChildByName("text"),isTrue);

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_daDaoTiQianOver, false);
        this.daDaoTiQianOver.setSelected(isTrue);
        this.selectedCB(this.daDaoTiQianOver.getChildByName("text"),isTrue);

        if (isClub)
            isTrue = this.getBoolItem("chou6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_chouLiu, false);
        this.chouLiu.setSelected(isTrue);
        this.selectedCB(this.chouLiu.getChildByName("text"),isTrue);


        //特殊拖拉机
        var tmp = isClub ? this.getBoolItem("teshutuolaji",true) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_teshutuolaji,true);
        this.teshutuolaji.setSelected(tmp);
        this.selectedCB(this.teshutuolaji.getChildByName("text"),tmp);

        //常主多必叫
        var isTrue = isClub ? this.getBoolItem("changZhuDuoBiJiao",false) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YLSDH_changZhuDuoBiJiao,false);
        this.cbxChangZhuDuoBiJiao.setSelected(isTrue);
        this.selectedCB(this.cbxChangZhuDuoBiJiao.getChildByName("text"),isTrue);

        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YLSDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YONG_LI_SAN_DA_HA;
        para.maxPlayer = 4;
        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问
        para.SAN_DA_HA_daDaoTiQianOver = this.daDaoTiQianOver.isSelected();       // 大倒提前结束
        para.chou6 = this.chouLiu.isSelected();       // 抽6
        para.teshutuolaji = this.teshutuolaji.isSelected();
        para.changZhuDuoBiJiao = this.cbxChangZhuDuoBiJiao.isSelected();             //常主多必叫
        para.SAN_DA_HA_difen = this._zhuIdx;

        para.chuPaiTouXiangZuiDaFen = this.chuPaiTouXiangZuiDaFen.isSelected();   //出牌后投降按大倒算分
        para.isTouXiangDouble = this.isTouXiangDouble.isSelected();   //叫分小于等于70分投降翻倍

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_daDaoTiQianOver, para.SAN_DA_HA_daDaoTiQianOver);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_chouLiu, para.chou6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_teshutuolaji,para.teshutuolaji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_changZhuDuoBiJiao,para.changZhuDuoBiJiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_chuPaiTouXiangZuiDaFen,para.chuPaiTouXiangZuiDaFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YLSDH_isTouXiangDouble,para.isTouXiangDouble);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YLSDH_difen, para.SAN_DA_HA_difen);
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