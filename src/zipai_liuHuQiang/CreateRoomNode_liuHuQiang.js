/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_liuHuQiang = CreateRoomNode.extend({
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
            this.localStorageKey.KEY_LiuHuQiang_maxPlayer       = "_LiuHuQiang_maxPlayer";          //几人玩
            this.localStorageKey.KEY_LiuHuQiang_xingType    = "_LiuHuQiang_xingType";       //醒
            this.localStorageKey.KEY_LiuHuQiang_xiType      = "_LiuHuQiang_xiType";         //息
            this.localStorageKey.KEY_LiuHuQiang_suanfenType      = "_LiuHuQiang_suanfenType";         //算分
            this.localStorageKey.KEY_LiuHuQiang_mingwei        = "_LiuHuQiang_mingwei";           //明偎
            this.localStorageKey.KEY_LiuHuQiang_yiwushi     = "_LiuHuQiang_yiwushi";        //一五十
            this.localStorageKey.KEY_LiuHuQiang_hongheidian= "_LiuHuQiang_hongheidian";   //红黑点
            this.localStorageKey.KEY_LiuHuQiang_tianhu= "_LiuHuQiang_tianhu";   //天胡
            this.localStorageKey.KEY_LiuHuQiang_dihu= "_LiuHuQiang_dihu";   //地胡
            this.localStorageKey.KEY_LiuHuQiang_zhangShu= "_LiuHuQiang_zhangShu";   //21张
            this.localStorageKey.KEY_LiuHuQiang_qiepai= "_LiuHuQiang_qiepai";   //切牌
            this.localStorageKey.KEY_LiuHuQiang_maiPai        = "_LiuHuQiang_maiPai"; //埋牌
            this.localStorageKey.KEY_LiuHuQiang_bihu       = "_LiuHuQiang_bihu";          //必胡
            this.localStorageKey.KEY_LiuHuQiang_tuoGuan       = "_LiuHuQiang_tuoGuan";          //托管
            this.localStorageKey.KEY_LiuHuQiang_maiPaiNum       = "_LiuHuQiang_maiPaiNum";          //埋牌数
        }

        this.setExtraKey({
            fanBei: "_LiuHuQiang_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_LiuHuQiang_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_LiuHuQiang_JIE_SUAN_DI_FEN",  //积分底分
        });

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundHYLHQ12,  pay8:majiang.roundHYLHQ8,  pay16:majiang.roundHYLHQ16};
        // this.AAPay      = {pay4:majiang.roundHYLHQAA12,pay8:majiang.roundHYLHQAA8,pay16:majiang.roundHYLHQAA16};
        // this.clubPay    = {pay4:majiang.roundHYLHQCL12,pay8:majiang.roundHYLHQCL8,pay16:majiang.roundHYLHQCL16};

        // this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16};
        // if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:16};
        // }

        this.bg_node = ccs.load("bg_liuHuQiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang");
    },

    radioBoxSelectCB_liuHuQiang : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("view").getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB_liuHuQiang.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.checkSelect.bind(this)),maxPlayerList[2].getChildByName("text"));

        //埋牌
        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

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
        xiTypeList.push(_play.getChildByName("xiType4"));
        this.xiTypeList_radio = createRadioBoxForCheckBoxs(xiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(xiTypeList,0,this.xiTypeList_radio),xiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,1,this.xiTypeList_radio),xiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,2,this.xiTypeList_radio),xiTypeList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiTypeList,3,this.xiTypeList_radio),xiTypeList[3].getChildByName("text"));

        var bihuList = [];
        bihuList.push(_play.getChildByName("youhubihu"));
        bihuList.push(_play.getChildByName("dianpaobihu"));
        bihuList.push(_play.getChildByName("wuBiHu"));
        this.bihuList_radio = createRadioBoxForCheckBoxs(bihuList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(bihuList,0,this.bihuList_radio),bihuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,1,this.bihuList_radio),bihuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(bihuList,2,this.bihuList_radio),bihuList[2].getChildByName("text"));

        var suanfenTypeList = [];
        suanfenTypeList.push(_play.getChildByName("play_onefen"));
        suanfenTypeList.push(_play.getChildByName("play_erfen"));
        suanfenTypeList.push(_play.getChildByName("play_onexionetun"));
        this.suanfenTypeList_radio = createRadioBoxForCheckBoxs(suanfenTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,0,this.suanfenTypeList_radio),suanfenTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,1,this.suanfenTypeList_radio),suanfenTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(suanfenTypeList,2,this.suanfenTypeList_radio),suanfenTypeList[2].getChildByName("text"));

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
        //cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.maiPai.getChildByName("text"));
        //this.maiPai.addEventListener(this._clickCB.bind(this), this.maiPai);

        //切牌
        var cutCardList = [];
        cutCardList.push(_play.getChildByName("autoCut"));
        cutCardList.push(_play.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (tuoGuanTip.isVisible()) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);

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

        //跑胡子不要四局
        var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        if (_currentRoundState == 1)
        {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        }
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(this._selectColor);
                    }else{
                        txt.setTextColor(this._unSelectColor);
                    }
                    break;
            }
    },

    checkSelect : function(){
        var maxPlayer= [4,3,2][this.maxPlayerList_radio.getSelectIndex()];
        if(maxPlayer == 4){
            this.setBoxStatus(this.zhangShu, undefined, false);
            // this.anCards.setEnabled(true);
        }else if(maxPlayer== 3 || maxPlayer== 2){
            this.setBoxStatus(this.zhangShu, undefined, true);
        }
        this.maiPai.visible = false;
        // if(maxPlayer == 2){
        //     this.maiPai.visible = true;
        // }
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191, 191, 191);
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
            if(isSelected){
                txt.setTextColor(this._selectColor);
            }else{
                txt.setTextColor(this._unSelectColor);
            }
        }
        box.visible = visible;
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("view").getChildByName("play");
        var list = [];

        var _maxPlayer;
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:2}[this.getNumberItem("maxPlayer", 4)];
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var isMaiPai;
        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
            isMaiPai = this.getBoolItem("isMaiPai", false);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_maiPaiNum, 0);
            isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_maiPai, false);
        }
        if(isMaiPai && maiPaiNum == 0) {
            maiPaiNum = 20;
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        var _xingType;
        if (atClub){
            _xingType = this.getNumberItem("xingType", 0);
        }else{
            _xingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_xingType, 0);
        }
        this.xingTypeList_radio.selectItem(_xingType);
        list = [];
        list.push(_play.getChildByName("play_budaixing"));
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(_xingType,list[_xingType],list);

        var _xiType;
        if (atClub){
            _xiType = {6:0, 9:1, 10:2, 15:3}[this.getNumberItem("xiNum", 6)];
        }else{
            _xiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_xiType, 0);
        }
        this.xiTypeList_radio.selectItem(_xiType);
        list = [];
        list.push(_play.getChildByName("xiType1"));
        list.push(_play.getChildByName("xiType2"));
        list.push(_play.getChildByName("xiType3"));
        this.radioBoxSelectCB(_xiType,list[_xiType],list);

        var _bihu;
        if(atClub)
            _bihu = this.getNumberItem("bihuType",0);
        else
            _bihu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_bihu, 1); 

        this.bihuList_radio.selectItem(_bihu);
        list = [];
        list.push(_play.getChildByName("youhubihu"));
        list.push(_play.getChildByName("dianpaobihu"));
        list.push(_play.getChildByName("wuBiHu"));
        this.radioBoxSelectCB(_bihu,list[_bihu],list);

        var _suanfenType;
        if (atClub){
            _suanfenType = this.getNumberItem("suanfenType", 1);
        }else{
            _suanfenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_suanfenType, 1);
        }
        this.suanfenTypeList_radio.selectItem(_suanfenType);
        list = [];
        list.push(_play.getChildByName("play_onefen"));
        list.push(_play.getChildByName("play_erfen"));
        list.push(_play.getChildByName("play_onexionetun"));
        this.radioBoxSelectCB(_suanfenType,list[_suanfenType],list);

        var _mingwei;
        if (atClub){
            _mingwei = this.getBoolItem("isMingwei", true);
        }else{
            _mingwei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_mingwei, true);
        }
        this.mingwei.setSelected(_mingwei);
        var txt = this.mingwei.getChildByName("text");
        if(_mingwei){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var _yiwushi;
        if (atClub){
            _yiwushi = this.getBoolItem("isYiwushi", false);
        }else{
            _yiwushi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_yiwushi, false);
        }
        this.yiwushi.setSelected(_yiwushi);
        var txt = this.yiwushi.getChildByName("text");
        if(_yiwushi){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var _hongheidian;
        if (atClub){
            _hongheidian = this.getBoolItem("isHongheidian", true);
        }else{
            _hongheidian = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_hongheidian, true);
        }
        this.hongheidian.setSelected(_hongheidian);
        var txt = this.hongheidian.getChildByName("text");
        if(_hongheidian){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var _tianhu;
        if (atClub){
            _tianhu = this.getBoolItem("isTianhu", true);
        }else{
            _tianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_tianhu, true);
        }
        this.tianhu.setSelected(_tianhu);
        var txt = this.tianhu.getChildByName("text");
        if(_tianhu){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var _dihu;
        if (atClub){
            _dihu = this.getBoolItem("isDihu", true);
        }else{
            _dihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_dihu, true);
        }
        this.dihu.setSelected(_dihu);
        var txt = this.dihu.getChildByName("text");
        if(_dihu){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        var _zhangShu;
        if (atClub){
            _zhangShu = this.getBoolItem("is21Zhang", false);
        }else{
            _zhangShu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_zhangShu, false);
        }
        this.zhangShu.setSelected(_zhangShu);
        var txt = this.zhangShu.getChildByName("text");
        if(_zhangShu){
            txt.setTextColor(this._selectColor);
        }else{
            txt.setTextColor(this._unSelectColor);
        }

        // var _maiPai; 
        // if(atClub)
        //     _maiPai = this.getBoolItem("isMaiPai", true);
        // else
        //     _maiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_LiuHuQiang_maiPai, true);
        // this.maiPai.setSelected(_maiPai);
        // var txt = this.maiPai.getChildByName("text");
        // if(_maiPai){
        //     txt.setTextColor(this._selectColor);
        // }else{
        //     txt.setTextColor(this._unSelectColor);
        // }

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_LiuHuQiang_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();

        this.checkSelect();
    },
    setExtraPlayNodeCurrentSelect:function(isClub)
    {
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("diFen", -1);
                fanBeiOption = fanBeiScore == - 1 ? 0 : 1;
                fanBeiScore = fanBeiScore == - 1 ? util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10) : fanBeiScore;
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }
    },

    getExtraSelectedPara:function(para)
    {
        var fanBeiOption;
        var fanBeiScore;
        if (this.fanbei_radio) {
            fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            fanBeiOption = this.fanbei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        //积分底分
        if(this.jieSuanDiFen){
            // var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            // para.jieSuanDiFen = parseInt(text_diFen.getString());
            para.jieSuanDiFen = this.difenAry[this.difenIndex];
        }

        if (!this._isFriendCard) {
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBei, fanBeiOption);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBeiScore, fanBeiScore);
            }

            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.jieSuanDiFen, para.jieSuanDiFen);
            }
        }
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var xiIndex = this.xiTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_LIU_HU_QIANG;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.xiNum = [6,9,10,15][xiIndex];
        para.xingType = this.xingTypeList_radio.getSelectIndex();
        para.suanfenType = this.suanfenTypeList_radio.getSelectIndex();
        para.isMingwei = this.mingwei.isSelected();
        para.isYiwushi = this.yiwushi.isSelected();
        para.isHongheidian = this.hongheidian.isSelected();
        para.isTianhu = this.tianhu.isSelected();
        para.isDihu = this.dihu.isSelected();
        //para.isMaiPai = this.maiPai.isSelected(); //埋牌20
        para.bihuType = this.bihuList_radio.getSelectIndex();//必胡 0：有胡必胡 1：点炮必胡 2:无
        if(para.maxPlayer == 3 || para.maxPlayer == 2){
            para.is21Zhang = this.zhangShu.isSelected();
        }else{
            para.is21Zhang = false;
        }
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0;

        this.getExtraSelectedPara(para);

        if(para.maxPlayer != 2){
            para.isMaiPai = false;
        }

        cc.log("createara: " + JSON.stringify(para));

        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_maxPlayer, maxPlayerIndex);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_xingType, para.xingType);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_xiType, xiIndex);
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_suanfenType, this.suanfenTypeList_radio.getSelectIndex());
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_mingwei, para.isMingwei);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_yiwushi, para.isYiwushi);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_hongheidian, para.isHongheidian);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_tianhu, para.isTianhu);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_dihu, para.isDihu);
        // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_zhangShu, para.is21Zhang);

        return para;
    },

    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard){
            var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
            var xiIndex = this.xiTypeList_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_xingType, para.xingType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_xiType, xiIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_suanfenType, this.suanfenTypeList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_mingwei, para.isMingwei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_yiwushi, para.isYiwushi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_hongheidian, para.isHongheidian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_tianhu, para.isTianhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_dihu, para.isDihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_zhangShu, para.is21Zhang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_LiuHuQiang_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_qiepai, para.isManualCutCard ? 1 : 0);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_bihu, para.bihuType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_tuoGuan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LiuHuQiang_maiPaiNum, para.maiPaiNum);
        }
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