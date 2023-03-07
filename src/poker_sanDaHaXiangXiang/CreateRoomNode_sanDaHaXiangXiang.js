var CreateRoomNode_sanDaHaXiangXiang = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_XIANGXIANG_SDH_maxPlayer     = "XIANGXIANG_SAN_DA_HA_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_XIANGXIANG_SDH_doubleInSingleOut      = "XIANGXIANG_SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_XIANGXIANG_SDH_allowCheckCard         = "XIANGXIANG_SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangXuXunWen       = "XIANGXIANG_SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_XIANGXIANG_SDH_daDaoTiQianOver        = "XIANGXIANG_SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
        this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangJia10Fen        = "XIANGXIANG_SAN_DA_HA_touXiangJia10Fen ";        //投降加10分
        this.localStorageKey.KEY_XIANGXIANG_SDH_baoFuLiuShou       = "XIANGXIANG_SAN_DA_HA_baoFuLiuShou";         //报富留守
        this.localStorageKey.KEY_XIANGXIANG_SDH_60fenQiJiao       = "XIANGXIANG_SAN_DA_HA_60fenQiJiao";       //60分起叫
        this.localStorageKey.KEY_XIANGXIANG_SDH_quDiaoLiu        = "XIANGXIANG_SAN_DA_HA_quDiaoLiu";        //去掉6
        this.localStorageKey.KEY_XIANGXIANG_SDH_biChangZhu        = "XIANGXIANG_SAN_DA_HA_biChangZhu";        //比常主
        this.localStorageKey.KEY_XIANGXIANG_SDH_suanFen       = "XIANGXIANG_SAN_DA_HA_suanFen";        //算分
        this.localStorageKey.KEY_XIANGXIANG_SDH_xiaoGuang      = "XIANGXIANG_SAN_DA_HA_xiaoGuang";        //小光
        this.localStorageKey.KEY_XIANGXIANG_SDH_difen                  = "XIANGXIANG_SAN_DA_HA_difen";                  //底分
    },
    initAll:function(IsFriendCard)
    {   
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        if (!IsFriendCard)
            this.setKey();
        this.roundNumObj = {roundNum1:8, roundNum2:16};
        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bg_node = ccs.load("bg_sanDaHaXiangXiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_sanDaHaXiangXiang").getChildByName("view");

    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play");
        var _round = _bg_Node.getChildByName("round");


        // this.count  = _bg_Node.getChildByName("play_num");
        // // this.addListenerText(this.count);
        // // cc.eventManager.addListener(this.setTextClick(),this.count.getChildByName("text"));
        // this.count.setSelected(true);
        // var text = this.count.getChildByName("text");
        // text.ignoreContentAdaptWithSize(true);
        // this.selectedCB(text,true)
        // this.count.setEnabled(false);

        var maxPlayerList = [];
        this.playNum4=_bg_Node.getChildByName("play_num4");
        this.playNum3=_bg_Node.getChildByName("play_num3");
        maxPlayerList.push(this.playNum3);
        maxPlayerList.push(this.playNum4);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function (index) {
            this.showPlayTypeForPlayNum(index);
            this.radioBoxSelectCB(0, maxPlayerList[index], maxPlayerList);
        }.bind(this));
        this.addListenerText(maxPlayerList, this.maxPlayerList_radio,this.showPlayTypeForPlayNum.bind(this));
        this.maxPlayerList = maxPlayerList;


        //双进单出
        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        cc.eventManager.addListener(this.setTextClick(),this.doubleInSingleOut.getChildByName("text"));
        this.doubleInSingleOut.addEventListener(this._clickCB, this.doubleInSingleOut);
        //允许查牌
        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        cc.eventManager.addListener(this.setTextClick(),this.allowCheckCard.getChildByName("text"));
        this.allowCheckCard.addEventListener(this._clickCB, this.allowCheckCard);
        //投降询问所有人
        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        cc.eventManager.addListener(this.setTextClick(),this.touXiangXuXunWen.getChildByName("text"));
        this.touXiangXuXunWen.addEventListener(this._clickCB, this.touXiangXuXunWen);
        //大倒提前结束
        this.daDaoTiQianOver = _playWay.getChildByName("play_daDaoTiQianOver");
        cc.eventManager.addListener(this.setTextClick(),this.daDaoTiQianOver.getChildByName("text"));
        this.daDaoTiQianOver.addEventListener(this._clickCB, this.daDaoTiQianOver);
        //投降加10分
        this.touXiangJiaFen = _playWay.getChildByName("play_touXiangJiaFen");
        cc.eventManager.addListener(this.setTextClick(),this.touXiangJiaFen.getChildByName("text"));
        this.touXiangJiaFen.addEventListener(this._clickCB, this.touXiangJiaFen);
        //报富留守
        this.baoFuLiuShou = _playWay.getChildByName("play_baoFuLiuShou");
        cc.eventManager.addListener(this.setTextClick(),this.baoFuLiuShou.getChildByName("text"));
        this.baoFuLiuShou.addEventListener(this._clickCB, this.baoFuLiuShou);
        //60分起叫
        this.qiJiaofen60= _playWay.getChildByName("play_60fenQiJiao");
        cc.eventManager.addListener(this.setTextClick(),this.qiJiaofen60.getChildByName("text"));
        this.qiJiaofen60.addEventListener(this._clickCB, this.qiJiaofen60);
        //去掉6
        this.quDiaoLiu = _playWay.getChildByName("play_quDiaoLiu");
        cc.eventManager.addListener(this.setTextClick(),this.quDiaoLiu.getChildByName("text"));
        this.quDiaoLiu.addEventListener(this._clickCB, this.quDiaoLiu);
        //比常主
        this.biChangZhu = _playWay.getChildByName("play_biChangZhu");
        cc.eventManager.addListener(this.setTextClick(),this.biChangZhu.getChildByName("text"));
        this.biChangZhu.addEventListener(this._clickCB, this.biChangZhu);
        this.biChangZhu.visible =false;
        //算分
        var nodeListSuanFen = [];
        this.jishusuanfen=_bg_Node.getChildByName("play_jishusuanfen");
        this.fenshusuanfen=_bg_Node.getChildByName("play_fenshusuanfen");
        nodeListSuanFen.push(this.jishusuanfen);
        nodeListSuanFen.push(this.fenshusuanfen);
        this.suanFen_radio = createRadioBoxForCheckBoxs(nodeListSuanFen, function (index) {
            this.showPlayType(index);
            this.radioBoxSelectCB(0, nodeListSuanFen[index], nodeListSuanFen);
        }.bind(this));
        this.addListenerText(nodeListSuanFen, this.suanFen_radio,this.showPlayType.bind(this));
        this.suanFenList = nodeListSuanFen;

        //小光
        var nodeListXiaoGuang = [];
        this.xiaoGuangFen25=_bg_Node.getChildByName("play_25fenxiaoguang");
        this.xiaoGuangFen30=_bg_Node.getChildByName("play_30fenxiaoguang");
        nodeListXiaoGuang.push(this.xiaoGuangFen25);
        nodeListXiaoGuang.push(this.xiaoGuangFen30);
        this.xiaoGuang_radio = createRadioBoxForCheckBoxs(nodeListXiaoGuang, function (index) {
            this.radioBoxSelectCB(0, nodeListXiaoGuang[index], nodeListXiaoGuang);
        }.bind(this));
        this.addListenerText(nodeListXiaoGuang, this.xiaoGuang_radio);
        this.xiaoGuangList = nodeListXiaoGuang;

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
                        this.setRoomCardModeFree();
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
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
    },
    // setRoundNodeCurrentSelect:function(){
    //     this._super();
    //     this.payWayNode_1.setSelected(true);
    // },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //设置上次创建房间时的默认选项
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub) {
            isTrue = [3, 4].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue,this.maxPlayerList[isTrue],this.maxPlayerList);
        this.showPlayTypeForPlayNum(isTrue);

        if (isClub)
            isTrue = [1,2].indexOf(this.getNumberItem("countScore", 1));
        else
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_suanFen, 0);
        this.suanFen_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue, this.suanFenList[isTrue], this.suanFenList);
        this.showPlayType(isTrue);

        if (isClub)
            isTrue = [25,30].indexOf(this.getNumberItem("xiaoGuangFen", 30));
        else
            isTrue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_xiaoGuang, 1);
        this.xiaoGuang_radio.selectItem(isTrue);
        this.radioBoxSelectCB(isTrue, this.xiaoGuangList[isTrue], this.xiaoGuangList);

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_daDaoTiQianOver, true);
        this.daDaoTiQianOver.setSelected(isTrue);
        var text = this.daDaoTiQianOver.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("touXiangJia10Fen", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangJia10Fen, false);
        this.touXiangJiaFen.setSelected(isTrue);
        var text = this.touXiangJiaFen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_doubleInSingleOut, false);
        this.doubleInSingleOut.setSelected(isTrue);
        var text = this.doubleInSingleOut.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("baoFuLiuShou", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_baoFuLiuShou, false);
        this.baoFuLiuShou.setSelected(isTrue);
        var text = this.baoFuLiuShou.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("qiJiaoFen60", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_60fenQiJiao, false);
        this.qiJiaofen60.setSelected(isTrue);
        var text = this.qiJiaofen60.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("quDiao6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_quDiaoLiu, false);
        this.quDiaoLiu.setSelected(isTrue);
        var text = this.quDiaoLiu.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("biChangZhu", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_biChangZhu, false);
        this.biChangZhu.setSelected(isTrue);
        var text = this.biChangZhu.getChildByName("text");
        this.selectedCB(text,isTrue)



        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

    },
    _clickCB : function(sender,type){
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                if(sender.isSelected()){
                    txt.setTextColor(cc.color(237,101,1));
                }else{
                    txt.setTextColor(cc.color(158,118,78));
                }
                break;
        }
    },
    selectedCB: function(text, isSelected) {
        var selectColor = cc.color(237,101,1);
        var unSelectColor = cc.color(158,118,78);
        if(isSelected){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_XIANG_SAN_DA_HA;

        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问
        para.SAN_DA_HA_daDaoTiQianOver = this.daDaoTiQianOver.isSelected();       // 大倒提前结束

        para.biChangZhu = false  /*this.biChangZhu.isSelected(); */      //比常主
        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.baoFuLiuShou = this.baoFuLiuShou.isSelected();   // 报富留守
        para.qiJiaoFen60 = this.qiJiaofen60.isSelected();   // 60分起叫
        para.quDiao6 = this.quDiaoLiu.isSelected();   // 去掉6

        para.difen = this._zhuIdx;
        para.countScore  = 1;
        // para.SAN_DA_HA_allowTuoLaJiXiaoDui = this.checkBox_pairCanBeatTractor.isSelected(); // 允许拖拉机消对
        // para.SAN_DA_HA_shuaiPaiLimitTwoCard = this.checkBox_blankThrowCardNumOpt.isSelected(); // 庄家甩牌最多两张

        var _countIdx = 0;
        if (this.jishusuanfen.isSelected()) {
            para.countScore  = 1;
            _countIdx = 0;
            para.touXiangJia10Fen  = false;       // 投降加10分
        }
        else if (this.fenshusuanfen.isSelected()) {
            para.countScore  = 2;
            _countIdx = 1;
            para.touXiangJia10Fen  = this.touXiangJiaFen.isSelected();       // 投降加10分
        }

        var _numIdx = 0;
        if (this.playNum3.isSelected()) {
            para.maxPlayer  = 3;
            _numIdx = 0;
            // para.biChangZhu  = this.biChangZhu.isSelected();       // 比常主
        }
        else if (this.playNum4.isSelected()) {
            para.maxPlayer  = 4;
            _numIdx = 1;
            // para.biChangZhu  = false;       // 比常主
        }

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
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_suanFen, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_maxPlayer, _numIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_xiaoGuang, _xiaoguangIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangJia10Fen, para.touXiangJia10Fen);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_daDaoTiQianOver, para.SAN_DA_HA_daDaoTiQianOver);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_biChangZhu, para.biChangZhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_baoFuLiuShou, para.baoFuLiuShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_60fenQiJiao, para.qiJiaoFen60);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_quDiaoLiu, para.quDiao6);
	        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGXIANG_SDH_difen, para.difen);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_pairCanBeatTractor, para.SAN_DA_HA_allowTuoLaJiXiaoDui);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGXIANG_SDH_blankThrowCardNumOpt, para.SAN_DA_HA_shuaiPaiLimitTwoCard);
		}
		
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    showPlayType:function(select_number)
    {
        if (select_number == 0)//选择级数算分时隐藏投降加10分
        {
            this.touXiangJiaFen.setVisible(false);
        }
        else{
            this.touXiangJiaFen.setVisible(true);
        }
    },

    showPlayTypeForPlayNum:function(select_number)
    {
        if (select_number == 0)//选择3人玩法时显示比常主，自动勾选60起叫和去掉6
        {
            this.biChangZhu.setVisible(false);//TODO 暂时false
            this.qiJiaofen60.setSelected(true);
            this.quDiaoLiu.setSelected(true);
        }
        else{
            this.biChangZhu.setVisible(false);
            this.qiJiaofen60.setSelected(false);
            this.quDiaoLiu.setSelected(false);
        }
    }
});