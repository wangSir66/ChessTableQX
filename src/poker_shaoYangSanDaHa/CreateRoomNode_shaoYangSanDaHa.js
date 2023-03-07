var CreateRoomNode_sanDaHaShaoYang = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_SYSDH_doubleInSingleOut      = "SY_SAN_DA_HA_doubleInSigleOut";       //双进单出
            this.localStorageKey.KEY_SYSDH_allowCheckCard         = "SY_SAN_DA_HA_allowCheckCard";         //允许查牌
            this.localStorageKey.KEY_SYSDH_touXiangXuXunWen       = "SY_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
            this.localStorageKey.KEY_SYSDH_daDaoTiQianOver        = "SY_SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
            this.localStorageKey.KEY_SYSDH_chouLiu        = "SY_SAN_DA_HA_chouLiu  ";        //抽6
            this.localStorageKey.KEY_SYSDH_teshutuolaji           = "SY_SAN_DA_HA_teshutuolaji";           //特殊拖拉机
            this.localStorageKey.KEY_SYSDH_changZhuDuoBiJiao      = "KEY_SYSDH_changZhuDuoBiJiao";         //常主多必叫
            this.localStorageKey.KEY_SYSDH_chuPaiTouXiangZuiDaFen     = "KEY_SYSDH_chuPaiTouXiangZuiDaFen";         //出牌后投降按大倒算分
            this.localStorageKey.KEY_SYSDH_isTouXiangDouble   = "KEY_SYSDH_isTouXiangDouble";         //叫分小于等于70分投降翻倍
            this.localStorageKey.KEY_SYSDH_difen                  = "SY_SAN_DA_HA_difen";                  //底分
        }
        this.roundNumObj = {roundNum1:8, roundNum2:16};

        this.bg_node = ccs.load("bg_sanDaHa.json").node;
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
        this.doubleInSingleOut.addEventListener(this._clickCB, this.doubleInSingleOut);

        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        cc.eventManager.addListener(this.setTextClick(),this.allowCheckCard.getChildByName("text"));
        this.allowCheckCard.addEventListener(this._clickCB, this.allowCheckCard);

        this.touXiangXuXunWen    = _playWay.getChildByName("play_touXiangXuXunWen");
        cc.eventManager.addListener(this.setTextClick(),this.touXiangXuXunWen.getChildByName("text"));
        this.touXiangXuXunWen.addEventListener(this._clickCB, this.touXiangXuXunWen);

        this.daDaoTiQianOver    = _playWay.getChildByName("play_daDaoTiQianOver");
        cc.eventManager.addListener(this.setTextClick(),this.daDaoTiQianOver.getChildByName("text"));
        this.daDaoTiQianOver.addEventListener(this._clickCB, this.daDaoTiQianOver);

        this.chouLiu = _playWay.getChildByName("play_chouLiu");
        cc.eventManager.addListener(this.setTextClick(),this.chouLiu.getChildByName("text"));
        this.chouLiu.addEventListener(this._clickCB, this.chouLiu);

        this.teshutuolaji = _playWay.getChildByName("play_teshutuolaji");
        cc.eventManager.addListener(this.setTextClick(),this.teshutuolaji.getChildByName("text"));
        this.teshutuolaji.addEventListener(this._clickCB, this.teshutuolaji);

        this.cbxChangZhuDuoBiJiao = _playWay.getChildByName("play_changZhuDuoBiJiao");
        cc.eventManager.addListener(this.setTextClick(),this.cbxChangZhuDuoBiJiao.getChildByName("text"));
        this.cbxChangZhuDuoBiJiao.addEventListener(this._clickCB, this.cbxChangZhuDuoBiJiao);

        // this.chuPaiTouXiangZuiDaFen = _playWay.getChildByName("play_chuPaiTouXiangZuiDaFen");
        // cc.eventManager.addListener(this.setTextClick(),this.chuPaiTouXiangZuiDaFen.getChildByName("text"));
        // this.chuPaiTouXiangZuiDaFen.addEventListener(this._clickCB, this.chuPaiTouXiangZuiDaFen);
        //
        // this.isTouXiangDouble = _playWay.getChildByName("play_isTouXiangDouble");
        // cc.eventManager.addListener(this.setTextClick(),this.isTouXiangDouble.getChildByName("text"));
        // this.isTouXiangDouble.addEventListener(this._clickCB, this.isTouXiangDouble);

        var huChiCheckBoxs = function(list) {
            var list_radio = createRadioBoxForCheckBoxsHuChi(list, function(index) {
                for (var i = 0; i < list.length; i++) {
                    this._clickCB(list[i], list[i].isSelected() ? ccui.CheckBox.EVENT_SELECTED : ccui.CheckBox.EVENT_UNSELECTED);
                }
            }.bind(this));
            for (var i = 0; i < list.length; i++) {
                var func = function(index) {
                    this.addListenerText(list[index], null, function() {
                        list_radio.selectItem(list[index].isSelected() ? index : -1);
                        for (var i = 0; i < list.length; i++) {
                            var text = list[i].getChildByName("text");
                            var isSelected = list[i].isSelected();
                            if(isSelected){
                                text.setTextColor(MjClient.createRoomNode._selectColor);
                            }else{
                                text.setTextColor(MjClient.createRoomNode._unSelectColor);
                            }
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

        _bg_Node = _bg_Node.getParent();
        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getChildByName("btn_sub");
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
            this._Button_add = _bg_Node.getChildByName("btn_add");
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
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var selectColor = MjClient.createRoomNode._selectColor
        var unSelectColor = MjClient.createRoomNode._unSelectColor
        
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_doubleInSingleOut, true);
        this.doubleInSingleOut.setSelected(isTrue);
        var txt = this.doubleInSingleOut.getChildByName("text");
        if(isTrue){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var txt = this.allowCheckCard.getChildByName("text");
        if(isTrue){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        // if (isClub)
        //     isTrue = this.getBoolItem("chuPaiTouXiangZuiDaFen", false);
        // else
        //     isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_chuPaiTouXiangZuiDaFen , false);
        // this.chuPaiTouXiangZuiDaFen .setSelected(isTrue);
        // var txt = this.chuPaiTouXiangZuiDaFen .getChildByName("text");
        // if(isTrue){
        //     txt.setTextColor(CREATEROOM_COLOR_SY_SELECT);
        // }else{
        //     txt.setTextColor(CREATEROOM_COLOR_SY_SELECT);
        // }
        //
        // if (isClub)
        //     isTrue = this.getBoolItem("isTouXiangDouble", false);
        // else
        //     isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_isTouXiangDouble , false);
        // this.isTouXiangDouble .setSelected(isTrue);
        // var txt = this.isTouXiangDouble .getChildByName("text");
        // if(isTrue){
        //     txt.setTextColor(CREATEROOM_COLOR_SY_SELECT);
        // }else{
        //     txt.setTextColor(CREATEROOM_COLOR_SY_SELECT);
        // }

        var chuPaiTouXiangZuiDaFen;
        if (isClub)
            chuPaiTouXiangZuiDaFen = this.getBoolItem("chuPaiTouXiangZuiDaFen", false);
        else
            chuPaiTouXiangZuiDaFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_chuPaiTouXiangZuiDaFen, false);
        var isTouXiangDouble;
        if (isClub)
            isTouXiangDouble = this.getBoolItem("isTouXiangDouble", false);
        else
            isTouXiangDouble = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_isTouXiangDouble, false);
        var touXiangIndex = chuPaiTouXiangZuiDaFen ? 0 : (isTouXiangDouble ? 1 : -1);
        this.touXiangList_radio.selectItem(touXiangIndex);
        for (var i = 0; i < this.touXiangList.length; i ++) {
            var text = this.touXiangList[i].getChildByName("text");
            var isSelected = i == touXiangIndex ? true : false;
            if(isSelected){
                text.setTextColor(selectColor);
            }else{
                text.setTextColor(unSelectColor);
            }
        }

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var txt = this.touXiangXuXunWen.getChildByName("text");
        if(isTrue){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_daDaoTiQianOver, false);
        this.daDaoTiQianOver.setSelected(isTrue);
        var txt = this.daDaoTiQianOver.getChildByName("text");
        if(isTrue){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        if (isClub)
            isTrue = this.getBoolItem("chou6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_chouLiu, false);
        this.chouLiu.setSelected(isTrue);
        var txt = this.chouLiu.getChildByName("text");
        if(isTrue){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }
        //特殊拖拉机
        var tmp = isClub ? this.getBoolItem("teshutuolaji",true) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_teshutuolaji,true);
        this.teshutuolaji.setSelected(tmp);
        var tmptxt = this.teshutuolaji.getChildByName("text");
        tmptxt.setTextColor(tmp ? selectColor : unSelectColor);

        //常主多必叫
        var isTrue = isClub ? this.getBoolItem("changZhuDuoBiJiao",false) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SYSDH_changZhuDuoBiJiao,false);
        this.cbxChangZhuDuoBiJiao.setSelected(isTrue);
        var tmptxt = this.cbxChangZhuDuoBiJiao.getChildByName("text");
        tmptxt.setTextColor(isTrue ? selectColor : unSelectColor);

        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SYSDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.SHAO_YANG_SAN_DA_HA;
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
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_daDaoTiQianOver, para.SAN_DA_HA_daDaoTiQianOver);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_chouLiu, para.chou6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_teshutuolaji,para.teshutuolaji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_changZhuDuoBiJiao,para.changZhuDuoBiJiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_chuPaiTouXiangZuiDaFen,para.chuPaiTouXiangZuiDaFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SYSDH_isTouXiangDouble,para.isTouXiangDouble);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SYSDH_difen, para.SAN_DA_HA_difen);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});