/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_HYLiuHuQiang = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum_leiyang = 4;
    },
    initAll:function()
    {
        // if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
        //     this._costName = '房卡';
        // }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_HYLiuHuQiang_maxPlayer       = "_HYLiuHuQiang_maxPlayer";          //几人玩
            this.localStorageKey.KEY_HYLiuHuQiang_xingType    = "_HYLiuHuQiang_xingType";       //醒
            this.localStorageKey.KEY_HYLiuHuQiang_xiType      = "_HYLiuHuQiang_xiType";         //息
            this.localStorageKey.KEY_HYLiuHuQiang_suanfenType      = "_HYLiuHuQiang_suanfenType";         //算分
            this.localStorageKey.KEY_HYLiuHuQiang_mingwei        = "_HYLiuHuQiang_mingwei";           //明偎
            this.localStorageKey.KEY_HYLiuHuQiang_yiwushi     = "_HYLiuHuQiang_yiwushi";        //一五十
            this.localStorageKey.KEY_HYLiuHuQiang_hongheidian= "_HYLiuHuQiang_hongheidian";   //红黑点
            this.localStorageKey.KEY_HYLiuHuQiang_tianhu= "_HYLiuHuQiang_tianhu";   //天胡
            this.localStorageKey.KEY_HYLiuHuQiang_dihu= "_HYLiuHuQiang_dihu";   //地胡
            this.localStorageKey.KEY_HYLiuHuQiang_zhangShu= "_HYLiuHuQiang_zhangShu";   //21张
            this.localStorageKey.KEY_HYLiuHuQiang_qiePai = "_HYLiuHuQiang_qiePai";   //切牌
            this.localStorageKey.KEY_HYLiuHuQiang_maiPai = "_HYLiuHuQiang_maiPai";   //埋牌
            this.localStorageKey.KEY_HYLiuHuQiang_maiPaiNum = "_HYLiuHuQiang_maiPaiNum";   //埋牌数量
            this.localStorageKey.KEY_HYLiuHuQiang_zhuangJia = "_HYLiuHuQiang_zhuangJia";   //庄家
        }

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYLHQ12,  pay8:majiang.roundHYLHQ8,  pay16:majiang.roundHYLHQ16};
        // this.AAPay      = {pay4:majiang.roundHYLHQAA12,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // this.clubPay    = {pay4:majiang.roundHYLHQCL12,pay8:majiang.roundHYLHQCL8,pay16:majiang.roundHYLHQCL16};

        this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_hyLiuHuQiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },

    radioBoxSelectCB_liuHuQiang : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_liuHuQiang.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));

        var xingTypeList = [];
        xingTypeList.push(_play.getChildByName("play_budaixing"));
        xingTypeList.push(_play.getChildByName("play_genxing"));
        xingTypeList.push(_play.getChildByName("play_fanxing"));
        this.xingTypeList_radio = createRadioBoxForCheckBoxs(xingTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xingTypeList,0,this.xingTypeList_radio),xingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,1,this.xingTypeList_radio),xingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xingTypeList,2,this.xingTypeList_radio),xingTypeList[2].getChildByName("text"));

        var xiTypeList = [];
        xiTypeList.push(_play.getChildByName("xiType1"));
        xiTypeList.push(_play.getChildByName("xiType2"));
        xiTypeList.push(_play.getChildByName("xiType3"));
        this.xiTypeList_radio = createRadioBoxForCheckBoxs(xiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xiTypeList,0,this.xiTypeList_radio),xiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,1,this.xiTypeList_radio),xiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,2,this.xiTypeList_radio),xiTypeList[2].getChildByName("text"));

        var suanfenTypeList = [];
        suanfenTypeList.push(_play.getChildByName("play_erfen"));
        _play.getChildByName("play_erfen").getChildByName("text").ignoreContentAdaptWithSize(true);
        suanfenTypeList.push(_play.getChildByName("play_onexionetun"));
        this.suanfenTypeList_radio = createRadioBoxForCheckBoxs_leiyang(suanfenTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,0,this.suanfenTypeList_radio),suanfenTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,1,this.suanfenTypeList_radio),suanfenTypeList[1].getChildByName("text"));

        this.mingwei = _play.getChildByName("play_mingwei");
        cc.eventManager.addListener(this.setTextClick(),this.mingwei.getChildByName("text"));
        this.mingwei.addEventListener(this._clickCB.bind(this), this.mingwei);

        this.yiwushi = _play.getChildByName("yiwushi");
        cc.eventManager.addListener(this.setTextClick(),this.yiwushi.getChildByName("text"));
        this.yiwushi.addEventListener(this._clickCB.bind(this), this.yiwushi);

        this.hongheidian = _play.getChildByName("hongheidian");
        cc.eventManager.addListener(this.setTextClick(),this.hongheidian.getChildByName("text"));
        this.hongheidian.addEventListener(this._clickCB.bind(this), this.hongheidian);

        this.tianhu = _play.getChildByName("tianhu");
        cc.eventManager.addListener(this.setTextClick(),this.tianhu.getChildByName("text"));
        this.tianhu.addEventListener(this._clickCB.bind(this), this.tianhu);

        this.dihu = _play.getChildByName("dihu");
        cc.eventManager.addListener(this.setTextClick(),this.dihu.getChildByName("text"));
        this.dihu.addEventListener(this._clickCB.bind(this), this.dihu);

        this.zhangShu = _play.getChildByName("zhangShu");
        cc.eventManager.addListener(this.setTextClick(),this.zhangShu.getChildByName("text"));
        this.zhangShu.addEventListener(this._clickCB.bind(this), this.zhangShu);

        this.maiPai = _play.getChildByName("maiPai");
        this.maiPai.visible = false;
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardRadioList = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardRadioList),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardRadioList),cutCardList[1].getChildByName("text"));

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("zhuangJia1"));
        zhuangJiaList.push(_play.getChildByName("zhuangJia2"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        this.schedule(function(sender,type)
        {
            var index = this.maxPlayerList_radio.getSelectIndex();
            if (MjClient.MaxPlayerNum_leiyang != 4 - index)
            {
                MjClient.MaxPlayerNum_leiyang = 4 - index;
                this.changeAAPayForPlayerNum();
            }
            //this.qianggangquanbao.setVisible(this.qiangganghu.isSelected());
        },0.1);
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color(211,38,14);
                    var unSelectColor = cc.color(68,51,51);

                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                        selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                        unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
                    }
                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
        this.checkSelect();
    },

    checkSelect : function(){
        var maxPlayer= [4,3,2][this.maxPlayerList_radio.getSelectIndex()];
        if(maxPlayer == 4){
            this.setBoxStatus(this.zhangShu, undefined, false);
            // this.anCards.setEnabled(true);
        }else if(maxPlayer== 3 || maxPlayer== 2){
            this.setBoxStatus(this.zhangShu, undefined, true);
        }

        // if(maxPlayer == 2){
        //     this.maiPai.visible = true;
        // }else{
        //     this.maiPai.visible = false;
        // }
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        if (maxPlayer == 2){
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }
        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(unEnableColor);
            }
        }
    },

    setBoxStatus : function(box, isSelected, visible){
        if(isSelected != undefined){
            box.setSelected(isSelected);
            var txt = box.getChildByName("text");
            var selectColor = cc.color(211,38,14);
            var unSelectColor = cc.color(68,51,51);

            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
            if(isSelected){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }
        box.visible = visible;
    },

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer;
        if (isClub)
            _maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_maxPlayer, 0);
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _xingType;
        if (isClub)
            _xingType = this.getNumberItem("xingType", 0);
        else
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_xingType, 0);
        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _xiType;
        if (isClub)
            _xiType = [6,9,15].indexOf(this.getNumberItem("xiNum", 6));
        else
            _xiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_xiType, 0);
        this.xiTypeList_radio.selectItem(_xiType);
        list = [];
        list.push(_play.getChildByName("xiType1"));
        list.push(_play.getChildByName("xiType2"));
        list.push(_play.getChildByName("xiType3"));
        this.radioBoxSelectCB(_xiType,list[_xiType],list);

        var _suanfenType;
        if (isClub)
            _suanfenType = this.getNumberItem("suanfenType", 0) - 1;
        else
            _suanfenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_suanfenType, -1);
        if(_suanfenType != -1){
            this.suanfenTypeList_radio.selectItem(_suanfenType);
        }
        list = [];
        list.push(_play.getChildByName("play_erfen"));
        list.push(_play.getChildByName("play_onexionetun"));
        this.radioBoxSelectCB(_suanfenType,list[_suanfenType],list);

        var _mingwei;
        if (isClub)
            _mingwei = this.getBoolItem("isMingwei", true);
        else
            _mingwei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_mingwei, true);
        this.mingwei.setSelected(_mingwei);
        var txt = this.mingwei.getChildByName("text");
        var selectColor = cc.color(211,38,14);
        var unSelectColor = cc.color(68,51,51);

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_mingwei){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _yiwushi;
        if (isClub)
            _yiwushi = this.getBoolItem("isYiwushi", false);
        else
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_yiwushi, false);
        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_yiwushi){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _hongheidian;
        if (isClub)
            _hongheidian = this.getBoolItem("isHongheidian", true);
        else
            _hongheidian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_hongheidian, true);
        this.hongheidian.setSelected(_hongheidian);
        var txt = this.hongheidian.getChildByName("text");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_hongheidian){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _tianhu;
        if (isClub)
            _tianhu = this.getBoolItem("isTianhu", true);
        else
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_tianhu, true);
        this.tianhu.setSelected(_tianhu);
        var txt = this.tianhu.getChildByName("text");

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(_tianhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _dihu;
        if (isClub)
            _dihu = this.getBoolItem("isDihu", true);
        else
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_dihu, true);
        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _zhangShu;
        if (isClub)
            _zhangShu = this.getBoolItem("is21Zhang", false);
        else
            _zhangShu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_zhangShu, false);
        this.zhangShu.setSelected(_zhangShu);
        var txt = this.zhangShu.getChildByName("text");
        if(_zhangShu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _maiPai; 
        var maiPaiNum;
        if(isClub){
            _maiPai = this.getBoolItem("isMaiPai", false);
            maiPaiNum = this.getNumberItem("maiPaiNum", 20);
        }else{
            _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_maiPai, false);
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_maiPaiNum, 20);
        }
        maiPaiNum = _maiPai ? maiPaiNum : 0;
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        // this.maiPai.setSelected(_maiPai);
        // var txt = this.maiPai.getChildByName("text");
        // if(_maiPai){
        //     txt.setTextColor(selectColor);
        // }else{
        //     txt.setTextColor(unSelectColor);
        // }

        var cutCard;
        if (isClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_qiePai, 0);
        }
        if(cutCard != 0 && cutCard != 1){
            cutCard = 0;
        }
        this.cutCardRadioList.selectItem(cutCard);
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.radioBoxSelectCB(cutCard, cutCardList[cutCard], cutCardList);

        var zhuangJia;
        if (isClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_zhuangJia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();

        this.checkSelect();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var xiIndex = this.xiTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_LIU_HU_QIANG;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.xiNum = [6,9,15][xiIndex];
        para.xingType = this.xingTypeList_radio.getSelectIndex();
        para.suanfenType = parseInt(this.suanfenTypeList_radio.getSelectIndex())+parseInt(1);
        para.isMingwei = this.mingwei.isSelected();
        para.isYiwushi = this.yiwushi.isSelected();
        para.isHongheidian = this.hongheidian.isSelected();
        para.isTianhu = this.tianhu.isSelected();
        para.isDihu = this.dihu.isSelected();
        //para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0 ? true : false;

        if(para.maxPlayer == 3 || para.maxPlayer == 2){
            para.is21Zhang = this.zhangShu.isSelected();
        }else{
            para.is21Zhang = false;
        }
        if(para.maxPlayer != 2){
            para.isMaiPai = false;
        }
        para.isManualCutCard = this.cutCardRadioList.getSelectIndex() == 0 ? false : true;
        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_xingType, para.xingType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_xiType, xiIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_suanfenType, this.suanfenTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_mingwei, para.isMingwei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_hongheidian, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_tianhu, para.isTianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_dihu, para.isDihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_zhangShu, para.is21Zhang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_qiePai, this.cutCardRadioList.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_HYLiuHuQiang_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_maiPaiNum, para.maiPaiNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_HYLiuHuQiang_zhuangJia, para.zhuangJia);
        }
        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // cc.log("wxd==========MjClient.MaxPlayerNum_leiyang============"+MjClient.MaxPlayerNum_leiyang)
        // if(4 > MjClient.MaxPlayerNum_leiyang){
        //     this.fangzhuPay = {pay4:majiang['roundHYLHQ4P' +  MjClient.MaxPlayerNum_leiyang ], pay8:majiang['roundHYLHQ8P' +  MjClient.MaxPlayerNum_leiyang ], pay16:majiang['roundHYLHQ16P' +  MjClient.MaxPlayerNum_leiyang ]};
        //     this.AAPay = {pay4:majiang['roundHYLHQAA4P' +  MjClient.MaxPlayerNum_leiyang ], pay8:majiang['roundHYLHQAA8P' +  MjClient.MaxPlayerNum_leiyang ], pay16:majiang['roundHYLHQAA16P' +  MjClient.MaxPlayerNum_leiyang ]};
        // }else{
        //     this.fangzhuPay = {pay4:majiang.roundHYLHQ4, pay8:majiang.roundHYLHQ8, pay16:majiang.roundHYLHQ16};
        //     this.AAPay = {pay4:majiang.roundHYLHQAA4,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // }
        // cc.log("wxd==========this.fangzhuPay============"+JSON.stringify(this.fangzhuPay));
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});