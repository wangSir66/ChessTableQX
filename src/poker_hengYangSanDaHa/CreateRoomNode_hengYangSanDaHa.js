var CreateRoomNode_sanDaHaHengYang = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_HYSDH_doubleInSingleOut      = "HY_SAN_DA_HA_doubleInSigleOut";       //双进单出
            this.localStorageKey.KEY_HYSDH_allowCheckCard         = "HY_SAN_DA_HA_allowCheckCard";         //允许查牌
            this.localStorageKey.KEY_HYSDH_touXiangXuXunWen       = "HY_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
            this.localStorageKey.KEY_HYSDH_daDaoTiQianOver        = "HY_SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
            this.localStorageKey.KEY_HYSDH_chouLiu        = "HY_SAN_DA_HA_chouLiu  ";        //抽6
            this.localStorageKey.KEY_HYSDH_teshutuolaji           = "HY_SAN_DA_HA_teshutuolaji";           //特殊拖拉机
            this.localStorageKey.KEY_HYSDH_changZhuDuoBiJiao      = "KEY_HYSDH_changZhuDuoBiJiao";         //常主多必叫
            this.localStorageKey.KEY_HYSDH_chuPaiTouXiangZuiDaFen     = "KEY_HYSDH_chuPaiTouXiangZuiDaFen";         //出牌后投降按大倒算分
            this.localStorageKey.KEY_HYSDH_isTouXiangDouble   = "KEY_HYSDH_isTouXiangDouble";         //叫分小于等于70分投降翻倍
            this.localStorageKey.KEY_HYSDH_lessThan70TouXiangDouble   = "KEY_HYSDH_lessThan70TouXiangDouble";         //叫分小于70分投降翻倍
            this.localStorageKey.KEY_HYSDH_equal70TouXiangDouble   = "KEY_HYSDH_equal70TouXiangDouble";         //叫分等于70分投降翻倍
            this.localStorageKey.KEY_HYSDH_difen                  = "HY_SAN_DA_HA_difen";                  //底分
            this.localStorageKey.KEY_HYSDH_zhuangJia                  = "HY_SAN_DA_HA_zhuangJia";                  //首局庄家

            this.setExtraKey({
                fanBei: "HY_SAN_DA_HA_fanbei",  //大结算翻倍
                tuoGuan: "HY_SAN_DA_HA_tuoguan",          //托管
                fanBeiScore: "HY_SAN_DA_HA_fanBeiScore"  //少于X分大结算翻倍
            });
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        
        this.roundNumObj = {roundNum1:8, roundNum2:16};

        this.bg_node = ccs.load("bg_sanDaHa.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_sanDaHa");
        if(this.bg_node.getChildByName("view")){
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

        // 出牌后投降按大倒算分
        this.chuPaiTouXiangZuiDaFen = _playWay.getChildByName("play_chuPaiTouXiangZuiDaFen");
        this.addListenerText(this.chuPaiTouXiangZuiDaFen, null, function(selectedNum,sender){
            this.refreshTouXiangDouble(sender.isSelected());
        }.bind(this));
        this.chuPaiTouXiangZuiDaFen.addEventListener(this.chuPaiTouXiangZuiDaFenClickCB.bind(this), this.chuPaiTouXiangZuiDaFen);

        // 叫分小于70分投降翻倍
        this.lessThan70TouXiangDouble = _playWay.getChildByName("play_lessThan70TouXiangDouble");
        this.addListenerText(this.lessThan70TouXiangDouble, null, function(selectedNum,sender){
            this.refreshChuPaiTouXiangZuiDaFen(sender.isSelected());
        }.bind(this));
        this.lessThan70TouXiangDouble.addEventListener(this.touXiangDoubleClickCB.bind(this), this.lessThan70TouXiangDouble);

        // 叫分等于70分投降翻倍
        this.equal70TouXiangDouble = _playWay.getChildByName("play_equal70TouXiangDouble");
        this.addListenerText(this.equal70TouXiangDouble, null, function(selectedNum,sender){
            this.refreshChuPaiTouXiangZuiDaFen(sender.isSelected());
        }.bind(this));
        this.equal70TouXiangDouble.addEventListener(this.touXiangDoubleClickCB.bind(this), this.equal70TouXiangDouble);

        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getChildByName("btn_sub");
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
            this._Button_add = _bg_Node.getChildByName("btn_add");
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

        this.initExtraPlayNode(_playWay);

        // 首局庄家
        var nodeListZhuangJia = [];
        nodeListZhuangJia.push( _playWay.getChildByName("shouJuFangZhuZhuang") );
        nodeListZhuangJia.push( _playWay.getChildByName("shouJuSuiJiZhuang") );
        this.zhuangjia_radio = createRadioBoxForCheckBoxs(nodeListZhuangJia,this.radioBoxSelectCB);
        this.addListenerText(nodeListZhuangJia,this.zhuangjia_radio);
        this.nodeListZhuangJia = nodeListZhuangJia;
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_doubleInSingleOut, true);
        this.doubleInSingleOut.setSelected(isTrue);
        this.selectedCB(this.doubleInSingleOut.getChildByName("text"),isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        this.selectedCB(this.allowCheckCard.getChildByName("text"),isTrue)

        if (isClub)
            isTrue = this.getBoolItem("chuPaiTouXiangZuiDaFen", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_chuPaiTouXiangZuiDaFen , false);
        this.chuPaiTouXiangZuiDaFen .setSelected(isTrue);
        this.selectedCB(this.chuPaiTouXiangZuiDaFen.getChildByName("text"),isTrue)
        
        // 叫分投降相关
        if (isClub)
            isTrue = this.getBoolItem("isTouXiangDouble", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_isTouXiangDouble , false);

        if (isTrue) {
            this.lessThan70TouXiangDouble.setSelected(isTrue);
            this.selectedCB(this.lessThan70TouXiangDouble.getChildByName("text"),isTrue);

            this.equal70TouXiangDouble.setSelected(isTrue);
            this.selectedCB(this.equal70TouXiangDouble.getChildByName("text"),isTrue);
        } else {
            if (isClub)
                isTrue = this.getBoolItem("lessThan70TouXiangDouble", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_lessThan70TouXiangDouble , false);
            this.lessThan70TouXiangDouble.setSelected(isTrue);
            this.selectedCB(this.lessThan70TouXiangDouble.getChildByName("text"),isTrue);

            if (isClub)
                isTrue = this.getBoolItem("equal70TouXiangDouble", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_equal70TouXiangDouble , false);
            this.equal70TouXiangDouble.setSelected(isTrue);
            this.selectedCB(this.equal70TouXiangDouble.getChildByName("text"),isTrue);
        }

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        this.selectedCB(this.touXiangXuXunWen.getChildByName("text"),isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_daDaoTiQianOver, false);
        this.daDaoTiQianOver.setSelected(isTrue);
        this.selectedCB(this.daDaoTiQianOver.getChildByName("text"),isTrue)

        if (isClub)
            isTrue = this.getBoolItem("chou6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_chouLiu, false);
        this.chouLiu.setSelected(isTrue);
        this.selectedCB(this.chouLiu.getChildByName("text"),isTrue)

        //特殊拖拉机
        isTrue = isClub ? this.getBoolItem("teshutuolaji",true) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_teshutuolaji,true);
        this.teshutuolaji.setSelected(isTrue);
        this.selectedCB(this.teshutuolaji.getChildByName("text"),isTrue)

        //常主多必叫
        isTrue = isClub ? this.getBoolItem("changZhuDuoBiJiao",false) : util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYSDH_changZhuDuoBiJiao,false);
        this.cbxChangZhuDuoBiJiao.setSelected(isTrue);
        this.selectedCB(this.cbxChangZhuDuoBiJiao.getChildByName("text"),isTrue)

        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYSDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");


        this.setExtraPlayNodeCurrentSelect(isClub);

        // 首局庄家
        var option = null;
        if (isClub)
            option = this.getNumberItem("shouJuZhuangJia", 0);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYSDH_zhuangJia, 0);

        this.zhuangjia_radio.selectItem(option)
        this.radioBoxSelectCB(option,this.nodeListZhuangJia[option],this.nodeListZhuangJia);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HENG_YANG_SAN_DA_HA;
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
        para.isTouXiangDouble = false;   //叫分小于等于70分投降翻倍
        para.lessThan70TouXiangDouble = this.lessThan70TouXiangDouble.isSelected();   //叫分小于70分投降翻倍
        para.equal70TouXiangDouble = this.equal70TouXiangDouble.isSelected();   //叫分等于70分投降翻倍

        // 首局庄家
        para.shouJuZhuangJia = this.zhuangjia_radio.getSelectIndex();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_daDaoTiQianOver, para.SAN_DA_HA_daDaoTiQianOver);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_chouLiu, para.chou6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_teshutuolaji,para.teshutuolaji);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_changZhuDuoBiJiao,para.changZhuDuoBiJiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_chuPaiTouXiangZuiDaFen,para.chuPaiTouXiangZuiDaFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_isTouXiangDouble,para.isTouXiangDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_lessThan70TouXiangDouble,para.lessThan70TouXiangDouble);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYSDH_equal70TouXiangDouble,para.equal70TouXiangDouble);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYSDH_difen, para.SAN_DA_HA_difen);

            // 首局庄家
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYSDH_zhuangJia, para.shouJuZhuangJia);
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    chuPaiTouXiangZuiDaFenClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshTouXiangDouble(sender.isSelected());
                break;
        }
    },

    refreshChuPaiTouXiangZuiDaFen: function(bSelected) {
        if (bSelected) {
            this.chuPaiTouXiangZuiDaFen.setSelected(false);
            this.selectedCB(this.chuPaiTouXiangZuiDaFen.getChildByName("text"),false);
        }
    },

    touXiangDoubleClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshChuPaiTouXiangZuiDaFen(sender.isSelected());
                break;
        }
    },

    refreshTouXiangDouble: function(bSelected) {
        if (bSelected) {
            this.lessThan70TouXiangDouble.setSelected(false);
            this.selectedCB(this.lessThan70TouXiangDouble.getChildByName("text"),false);

            this.equal70TouXiangDouble.setSelected(false);
            this.selectedCB(this.equal70TouXiangDouble.getChildByName("text"),false);
        }
    }
});