//郴州字牌
var CreateRoomNode_shiMenPaoHuZi = CreateRoomNode.extend({
    currMaiPaiType: undefined,//当前埋牌类型
    onExit: function () {
        this._super();
    },
    initAll: function () {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maxPlayer = "_shiMenPaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diFen = "_shiMenPaoHuZi_diFen";         //底分
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fengDing = "_shiMenPaoHuZi_fengDing";         // 封顶
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_playType = "_shiMenPaoHuZi_playType";    //玩法
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPai20 = "_shiMenPaoHuZi_maiPai20";    //埋牌20
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPaiType = "_shiMenPaoHuZi_maiPaiType";    //埋牌类型  0：不埋  1：埋10  2：埋20
        ///////////////////////////////////////////////////
        //全名堂
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_liuBaFanType = "_shiMenPaoHuZi_liuBaFanType";//0:大六八番，1：小六八番
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tianHuAll = "_shiMenPaoHuZi_tianHuAll";//天胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diHuAll = "_shiMenPaoHuZi_diHuAll";//地胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_haiHuAll = "_shiMenPaoHuZi_haiHuAll";//海胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tingHuAll = "_shiMenPaoHuZi_tingHuAll";//听胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuAll = "_shiMenPaoHuZi_hongHuAll";//红胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuAll = "_shiMenPaoHuZi_heiHuAll";//黑胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuAll = "_shiMenPaoHuZi_dianHuAll";//点胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_daHuAll = "_shiMenPaoHuZi_daHuAll";//大胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_xiaoHuAll = "_shiMenPaoHuZi_xiaoHuAll";//小胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuAll = "_shiMenPaoHuZi_duiZiHuAll";//对子胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_shuaHouAll = "_shiMenPaoHuZi_shuaHouAll";//耍猴
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_huangFanAll = "_shiMenPaoHuZi_huangFanAll";//黄番
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuanHuAll = "_shiMenPaoHuZi_tuanHuAll";//团胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hangHangXi = "_shiMenPaoHuZi_hangHangXi";//行行息
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_jiaHangHang = "_shiMenPaoHuZi_jiaHangHang";//假行行
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_sanTiWuKan = "_shiMenPaoHuZi_sanTiWuKan";//三提五坎
        //////////////////////////////////////////////////////
        //土炮胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuTu = "_shiMenPaoHuZi_hongHuTu";//红胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuTu = "_shiMenPaoHuZi_heiHuTu";//黑胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuTu = "_shiMenPaoHuZi_dianHuTu";//点胡
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongWuTu = "_shiMenPaoHuZi_hongWuTu";//红乌
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuTu = "_shiMenPaoHuZi_duiZiHuTu";//对子胡
        ///////////////////////////////////////////////////////////
        this.roundNumObj = {roundNum1: 8, roundNum2: 12, roundNum3: 20};
        //第一局随机庄
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_firstRandomZhuang = "_shiMenPaoHuZi_firstRandomZhuang";//第一局随机庄

        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbei                    = "_shiMenPaoHuZi_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbeiscore              = "_shiMenPaoHuZi_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_difen                 =  "_shiMenPaoHuZi_difen"; //底分

        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_faPai                 =  "_shiMenPaoHuZi_fapai"; //底分
        this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuoGuan          ="_shiMenPaoHuZi_tuoGuan";    //托管 0 无/1/2/3/5分钟


        ///////////////////////////////////////////////////////

        this.bg_node = ccs.load("bg_shiMenPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg").getChildByName("view");
    },

    initMaiPaiNode: function(_play){
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
             var maiPaiList = [];
            var maiPaiItemCount = 3;
            for(var i = 0; i < maiPaiItemCount; i++){
                maiPaiList.push(_play.getChildByName("maiPai_"+i));
                if(i == maiPaiItemCount - 1){
                     this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList, this.checkMaiPaiSelect.bind(this), 0);
                     cc.each(maiPaiList,function(node,index){
                        cc.eventManager.addListener(this.setTextClick(maiPaiList, index, this.maiPaiList_radio), node.getChildByName("text"));
                        return true;
                     },this);
                }
            }
            this.maiPaiList = maiPaiList;
        }else{
            this.maiPai20 = _play.getChildByName("maiPai20");
            this.maiPai20.addEventListener(this._clickCB, this.maiPai20);
            cc.eventManager.addListener(this.setTextClick(null, null, null, null), this.maiPai20.getChildByName("text"));
        }
    },
    initPlayNode: function () {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1")];
        this.initPlayNumNode(maxPlayerList, [3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, this.radioBoxSelectCB_PersonNum.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList, 0, this.maxPlayerList_radio, this.checkSelectivePersonNum.bind(this)), maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList, 1, this.maxPlayerList_radio, this.checkSelectivePersonNum.bind(this)), maxPlayerList[1].getChildByName("text"));

        //底分
        var difenList = this.difenList = [_play.getChildByName("fen_1"), _play.getChildByName("fen_2"),
            _play.getChildByName("fen_3"), _play.getChildByName("fen_4"), _play.getChildByName("fen_5")];
        this.difenList_radio = createRadioBoxForCheckBoxs(difenList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(difenList, 0, this.difenList_radio), difenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(difenList, 1, this.difenList_radio), difenList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(difenList, 2, this.difenList_radio), difenList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(difenList, 3, this.difenList_radio), difenList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(difenList, 4, this.difenList_radio), difenList[4].getChildByName("text"));


        //封顶
        var fengDingList = [_play.getChildByName("fengDing_0"), _play.getChildByName("fengDing_100"), _play.getChildByName("fengDing_200"), _play.getChildByName("fengDing_300")];
        this.fengDingList_radio = createRadioBoxForCheckBoxs(fengDingList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fengDingList, 0, this.fengDingList_radio), fengDingList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList, 1, this.fengDingList_radio), fengDingList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList, 2, this.fengDingList_radio), fengDingList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengDingList, 3, this.fengDingList_radio), fengDingList[3].getChildByName("text"));

        this.initMaiPaiNode(_play);
        //玩法
        var playTypeList = [_play.getChildByName("quanMingTang"), _play.getChildByName("tuPaoHu")];
        this.playTypeList_radio = createRadioBoxForCheckBoxs(playTypeList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(playTypeList, 0, this.playTypeList_radio), playTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(playTypeList, 1, this.playTypeList_radio), playTypeList[1].getChildByName("text"));

        if(_play.getChildByName("puTong")){
            var faPaiList = [];
            faPaiList.push(_play.getChildByName("puTong"));
            faPaiList.push(_play.getChildByName("changShuang"));
            faPaiList.push(_play.getChildByName("jiSu"));
            this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB, 0);
            cc.eventManager.addListener(this.setTextClick(faPaiList,0,this.faPaiList_radio),faPaiList[0].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(faPaiList,1,this.faPaiList_radio),faPaiList[1].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(faPaiList,2,this.faPaiList_radio),faPaiList[2].getChildByName("text"));
        } 


        //////////////////////////////////////////////////////
        //全名堂玩法
        var _allMingTang = this._allMingTang = _play.getChildByName("Panel_allMingTang");
        //大小68番
        var allMingFanTypeList = [_allMingTang.getChildByName("daliubafan"), _allMingTang.getChildByName("xiaoliubafan")];
        this.fanTypeList_radio = createRadioBoxForCheckBoxs(allMingFanTypeList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(allMingFanTypeList, 0, this.fanTypeList_radio), allMingFanTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(allMingFanTypeList, 1, this.fanTypeList_radio), allMingFanTypeList[1].getChildByName("text"));

        var allPlayArr=this.AllplayArr = ["tianhu", "dihu", "haihu", "tinghu", "honghu", "heihu", "dianhu",
            "dahu", "xiaohu", "duizihu", "shuahou", "huangfan", "tuanhu", "hangHangXi","jiaHangHang","sanTiWuKan"];
        for (var i = 0; i < allPlayArr.length; i++) {
            var tmp = this._allMingTang.getChildByName(this.AllplayArr[i]);
            tmp.addEventListener(this._clickCB, tmp);
            cc.eventManager.addListener(this.setTextClick(null, null, null, null),  this._allMingTang.getChildByName(this.AllplayArr[i]).getChildByName("text"));
        }
        for (var i = 0; i < allPlayArr.length; i++) {
            var _bool = (i != allPlayArr.length - 1) ? true : false;
            this._allMingTang.getChildByName(allPlayArr[i]).setSelected(_bool);
            var txt = this._allMingTang.getChildByName(allPlayArr[i]).getChildByName("text");
            txt.setTextColor(_bool ? cc.color(211, 38, 14) : cc.color(68, 51, 51));
        }
        //土炮胡玩法
        var _tuPaoHu = this._tuPaoHu = _play.getChildByName("Panel_tuPaoHu");

        var TuplayArr = ["honghu", "heihu", "dianhu", "hongwu", "duizihu"];
        for (var i = 0; i < 5; i++) {
            var tmp = this._tuPaoHu.getChildByName(TuplayArr[i]);
            tmp.addEventListener(this._clickCB, tmp);
            cc.eventManager.addListener(this.setTextClick(null, null, null, null), this._tuPaoHu.getChildByName(TuplayArr[i]).getChildByName("text"));

        }
        for (var i = 0; i < 5; i++) {
            var _bool=i!= TuplayArr.length-1?true:false;
            this._tuPaoHu.getChildByName(TuplayArr[i]).setSelected(_bool);
            var txt = this._tuPaoHu.getChildByName(TuplayArr[i]).getChildByName("text");
            txt.setTextColor(_bool ? cc.color(211, 38, 14) : cc.color(68, 51, 51));
        }

        /////////////////////////////////////////////
        var list = [_play.getChildByName("quanMingTang"), _play.getChildByName("tuPaoHu")];
        this.playTypeList_radio.selectItem(1);
        this.radioBoxSelectCB(1, list[1], list);
        /////////////////////////////////////////////

        //////////////////////////////////
        this.quanmingtang = _play.getChildByName("quanMingTang");
        this.quanmingtang.schedule(function () {
            this._allMingTang.setVisible(_play.getChildByName("quanMingTang").isSelected());
            this._tuPaoHu.setVisible(_play.getChildByName("tuPaoHu").isSelected());
        }.bind(this));
        ////////////////////////
        //第一局随机庄
        this._firstRandomZhuang = _play.getChildByName("firstRandomZhuang");
        this._firstRandomZhuang.addEventListener(this._clickCB, this._firstRandomZhuang);
        cc.eventManager.addListener(this.setTextClick(null, null, null, null), this._firstRandomZhuang.getChildByName("text"));

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

        // 大结算翻倍
        if (_play.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_play.getChildByName("play_lessthan"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }
        this._ZhuNum = this.bg_node.getParent().getChildByName("jieSuanDiFen").getChildByName("text_diFen");
        if (this._ZhuNum) {
            // this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("jieSuanDiFen").getChildByName("btn_sub");
            this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
            this.difenIndex = 0;
            var _this = this;
            this._Button_sub.addClickEventListener(function(sender) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("jieSuanDiFen").getChildByName("btn_add");
            this._Button_add.addClickEventListener(function(sender) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);

            if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()) {
                this.jieSuanDiFen = this.bg_node.getParent().getChildByName("jieSuanDiFen");
                this.useYueYangUIV3_ziPai();
            }
        }
    },

    _clickCB: function (sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                if (sender.isSelected()) {
                    txt.setTextColor(cc.color(211, 38, 14));
                } else {
                    txt.setTextColor(cc.color(68, 51, 51));
                }
                break;
        }
    },

    radioBoxSelectCB_PersonNum:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelectivePersonNum();
    },

    checkSelectivePersonNum: function(){
        //每次选中到自由人玩时，需要改变埋牌的文本
        var curMaxPlayerSelect = this.maxPlayerList_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
             cc.each(this.maiPaiList,function(node, key){
                if(curMaxPlayerSelect == 0){
                    cc.eventManager.pauseTarget(node,true);
                    for(var index in node.children){
                        node.children[index].setTextColor(cc.color("#a8a5a5"));
                        node.setSelected(false);
                    }
                }else{
                    cc.eventManager.resumeTarget(node,true);
                    this.maiPaiList_radio.selectItem(this.currMaiPaiType);
                    this.radioBoxSelectCB(this.currMaiPaiType,this.maiPaiList[this.currMaiPaiType],this.maiPaiList);
                }
           
            },this);
        }else{
            this.maiPai20.visible = curMaxPlayerSelect == 1;
        }
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    setPlayNodeCurrentSelect: function (atClub) {
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = {3: 0, 2: 1}[util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maxPlayer, 3)];
        if (atClub) {
            _maxPlayer = {3: 0, 2: 1}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1")];

        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        //底分
        var _difen;
        if (atClub) {
            _difen = this.getNumberItem("diFen", 0);
        } else {
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diFen, 0);
        }
        list = [_play.getChildByName("fen_1"), _play.getChildByName("fen_2"),
            _play.getChildByName("fen_3"), _play.getChildByName("fen_4"), _play.getChildByName("fen_5")];

        this.difenList_radio.selectItem(_difen);
        this.radioBoxSelectCB(_difen, list[_difen], list);

        //封顶
        var _fengding;
        if (atClub) {

            _fengding = this.getNumberItem("fengDing", 0);
        } else {
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fengDing, 0);
        }
        list = [_play.getChildByName("fengDing_0"), _play.getChildByName("fengDing_100"), _play.getChildByName("fengDing_200"), _play.getChildByName("fengDing_300")];
        this.fengDingList_radio.selectItem(_fengding);
        this.radioBoxSelectCB(_fengding, list[_fengding], list);

        var _playType;
        if (atClub) {
            _playType = this.getNumberItem("playType", 1);
        }
        else{
            _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_playType, 1);
        }
        list = [_play.getChildByName("quanMingTang"), _play.getChildByName("tuPaoHu")];
         this.playTypeList_radio.selectItem(_playType);
         this.radioBoxSelectCB(_playType, list[_playType], list);

           //新增发牌速度
        if(this.faPaiList_radio){
            var _fapai;
            if(atClub) {
                _fapai = [0, 1, 2].indexOf(this.getNumberItem("faPai", 1));
            }else {
                _fapai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_faPai, 1);
            }
            this.faPaiList_radio.selectItem(_fapai);
            list = [];
            list.push(_play.getChildByName("puTong"));
            list.push(_play.getChildByName("changShuang"));
            list.push(_play.getChildByName("jiSu"));
            this.radioBoxSelectCB(_fapai,list[_fapai],list); 
        }

        var _maiPai20;
        if (atClub)
            _maiPai20 = this.getBoolItem("maiPai20", false);
        else
            _maiPai20 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPai20, false);

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            var maiPaiType;
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 2);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPaiType, 2);

            if(!_maiPai20) maiPaiType = 0;
            if(_maiPai20 && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            //埋牌20
            this.maiPai20.setSelected(_maiPai20);
            var txt = this.maiPai20.getChildByName("text");
            txt.setTextColor(_maiPai20 ? cc.color(211, 38, 14) : cc.color(68, 51, 51));
        }
        
        ///////////////////////////////////////////
        ///全名堂
        /////大小68番
        var _allMingTang = this._allMingTang = _play.getChildByName("Panel_allMingTang");
        var _FanType;
        if(atClub)
        {
            _FanType = this.getNumberItem("fanType", 0);
        }else{
            _FanType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_liuBaFanType, 0);
        }

        var FanTypelist = [_allMingTang.getChildByName("daliubafan"), _allMingTang.getChildByName("xiaoliubafan")];
        this.fanTypeList_radio.selectItem(_FanType);
        this.radioBoxSelectCB(_FanType, FanTypelist[_FanType], FanTypelist);
        //全名堂
        var AllplayArr = ["tianhu", "dihu", "haihu", "tinghu", "honghu", "heihu", "dianhu", "dahu",
            "xiaohu", "duizihu", "shuahou", "huangfan", "tuanhu", "hangHangXi", "jiaHangHang", "sanTiWuKan"];
        var AllMingTangKey = [
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tianHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_haiHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tingHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_daHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_xiaoHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_shuaHouAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_huangFanAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuanHuAll,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hangHangXi,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_jiaHangHang,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_sanTiWuKan
        ];
        for (var i = 0; i < AllplayArr.length; i++) {
            var _bool = i < AllplayArr.length - 4 ? true : false;
            if(atClub)
            {
                _bool = this.getItem("allPlayList",[0,1,2,3,4,5,6,7,8,9,10,11]).indexOf(i) != -1 ? true : false;
            }
            else{
                _bool = util.localStorageEncrypt.getBoolItem(AllMingTangKey[i], _bool);
            }
            this._allMingTang.getChildByName(AllplayArr[i]).setSelected(_bool);
            var txt = this._allMingTang.getChildByName(AllplayArr[i]).getChildByName("text");
            txt.setTextColor(_bool ? cc.color(211, 38, 14) : cc.color(68, 51, 51));
        }
        ///////////////////////////////////////////
        //土炮胡
        var TuplayArr = ["honghu", "heihu", "dianhu", "hongwu", "duizihu"];
        var TuPaoHuKey = [
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuTu,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuTu,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuTu,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongWuTu,
            this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuTu
        ];
        for (var i = 0; i < TuplayArr.length; i++) {
            var _bool = i != TuplayArr.length - 1 ? true : false;
            if(atClub)
            {
                _bool = this.getItem("tuPlayList",[0,1,2,3]).indexOf(i)!=-1?true:false;
              //  _bool = this.getBoolItem(TuPaoHuKey[i], _bool);
            }else{
                _bool = util.localStorageEncrypt.getBoolItem(TuPaoHuKey[i], _bool);
            }
            this._tuPaoHu.getChildByName(TuplayArr[i]).setSelected(_bool);
            var txt = this._tuPaoHu.getChildByName(TuplayArr[i]).getChildByName("text");
            txt.setTextColor(_bool ? cc.color(211, 38, 14) : cc.color(68, 51, 51));
        }
        //////////////////////////////////////////////
        //第一局随机庄
        var _firstRandomZhuang;
        if (atClub) {
            _firstRandomZhuang = this.getBoolItem("firstRandomZhuang", false);
        } else {
            _firstRandomZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_firstRandomZhuang, false);
        }
        this._firstRandomZhuang.setSelected(_firstRandomZhuang);
        var txt = this._firstRandomZhuang.getChildByName("text");
        txt.setTextColor(_firstRandomZhuang ? cc.color(211, 38, 14) : cc.color(68, 51, 51));

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (atClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        var diFen;
        if (atClub){
            diFen = this.getNumberItem("difen", 1);
        }else {
            diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_difen, 1);
        }
        this.difenIndex = this.difenAry.indexOf(diFen);
        if (this.difenIndex < 0) this.difenIndex = 1;
        if (this._ZhuNum)
            this._ZhuNum.setString(this.difenAry[this.difenIndex] + "");
    
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){ self.checkSelectivePersonNum()})));
    },

    getSelectedPara: function () {
        var para = {};
        para.maxPlayer = [3,2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.diFen = [0,1,2,3,4][parseInt(this.difenList_radio.getSelectIndex())];
        para.fengDing = [0, 1, 2, 3][parseInt(this.fengDingList_radio.getSelectIndex())];
        para.playType = [0, 1][parseInt(this.playTypeList_radio.getSelectIndex())];
        para.daLiuBaFantype=[0,1][parseInt(this.fanTypeList_radio.getSelectIndex())];
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.difen = this.difenAry[this.difenIndex];                   // 底分

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.maiPaiType = this.maiPaiList_radio.getSelectIndex();
            para.maiPai20 = para.maiPaiType > 0
        }else{
            para.maiPai20 = this.maiPai20.isSelected();
        }

        if(this.maxPlayerList_radio.getSelectIndex() == 0)
            para.maiPai20 = false;

        var allPlayList = [];
        var tuPlayList=[];

        var allPlayArr = ["tianhu", "dihu", "haihu", "tinghu", "honghu", "heihu", "dianhu", "dahu",
            "xiaohu", "duizihu", "shuahou", "huangfan", "tuanhu", "hangHangXi", "jiaHangHang", "sanTiWuKan"];
        for (var i = 0; i < allPlayArr.length; i++) {
            var select = this._allMingTang.getChildByName(allPlayArr[i]).isSelected();
            if (select) {
                allPlayList.push(i);
            }
        }
        var TuplayArr = ["honghu", "heihu", "dianhu", "hongwu", "duizihu"];
        for (var i = 0; i < TuplayArr.length; i++) {
            var select = this._tuPaoHu.getChildByName(TuplayArr[i]).isSelected();
            if (select) {
                tuPlayList.push(i);
            }
        }
        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        var firstRandomZhuang = this._firstRandomZhuang.isSelected();
        para.gameType = MjClient.GAME_TYPE.SHI_MEN_PAO_HU_ZI;
        para.allPlayList = allPlayList;
        para.tuPlayList = tuPlayList;
        para.firstRandomZhuang = firstRandomZhuang;
        para.isManualCutCard = false;

        para.faPai = 1;
        if(this.faPaiList_radio){
            para.faPai = this.faPaiList_radio.getSelectIndex();
        } 
        return para;
    },

    createRoom: function () {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara: function (para) {
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maxPlayer, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fengDing, para.fengDing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_playType,para.playType);//全名堂或者土炮胡
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPai20,  para.maiPai20);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_maiPaiType,  para.maiPaiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuoGuan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_faPai, para.faPai);

            var allPlayArr = ["tianhu", "dihu", "haihu", "tinghu", "honghu", "heihu", "dianhu", "dahu", "xiaohu",
                "duizihu", "shuahou", "huangfan", "tuanhu", "hangHangXi", "jiaHangHang", "sanTiWuKan"];
            var allMingTangKey = [
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tianHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_diHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_haiHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tingHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_daHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_xiaoHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_shuaHouAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_huangFanAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_tuanHuAll,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hangHangXi,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_jiaHangHang,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_sanTiWuKan
            ];
            for(var i = 0;i < allPlayArr.length;i++){
                util.localStorageEncrypt.setBoolItem(allMingTangKey[i], false);
            }
            for(var i = 0;i < para.allPlayList.length;i++){
                util.localStorageEncrypt.setBoolItem(allMingTangKey[para.allPlayList[i]], true);
            }

            var TuplayArr = ["honghu", "heihu", "dianhu", "hongwu", "duizihu"];
            var TuPaoHuKey = [
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongHuTu,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_heiHuTu,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_dianHuTu,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_hongWuTu,
                this.localStorageKey.KEY_PAO_HU_ZI_shiMen_duiZiHuTu
            ];
            for(var i = 0;i < TuplayArr.length;i++){
                util.localStorageEncrypt.setBoolItem(TuPaoHuKey[i], false);
            }

            for(var i = 0;i < para.tuPlayList.length;i++){
                util.localStorageEncrypt.setBoolItem(TuPaoHuKey[para.tuPlayList[i]], true);
            }
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_liuBaFanType,  para.daLiuBaFantype);//大小六八番
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_firstRandomZhuang,  para.firstRandomZhuang);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_shiMen_fanbeiscore, para.fanBeiScore);
            }
        }
    },

    changeAAPayForPlayerNum: function () {
        this.setDiaNumData(this.bg_node);
    },

    setDiaNumData: function (gameNode) {
        this._super(gameNode);
        this.setDiaNumData_PaoHuZi();
    },

    updateSelectDiaNum: function () {  // 更新选定选项的建房消耗元宝
        this.setDiaNumData_PaoHuZi();
    },

    getPrice: function (gameType, maxPlayer, roundNum, payWay) {
        //cc.log("MjClient.data.gamePrice@@ " + JSON.stringify(MjClient.data.gamePrice));
        if (!MjClient.data.gamePrice[gameType][maxPlayer][roundNum]) {
            return 0;
        }
        return MjClient.data.gamePrice[gameType][maxPlayer][roundNum][payWay];
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            var len = list.length;
            for(var i = 0; i < len; i++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());

                if (i == 0) {
                    var txt = radioBox.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    txt.setTextColor(bSelected ? selectColor : unSelectColor);
                } else {
                    var textNames = ["text","score"];
                    for (var j = 0; j < textNames.length; j++) {
                        var txt = radioBox.getChildByName(textNames[j]);
                        txt.ignoreContentAdaptWithSize(true);
                        txt.setTextColor(bSelected ? selectColor : unSelectColor);
                    }

                    var buttonNames = ["btn_add","btn_sub"];
                    for (var j = 0; j < buttonNames.length; j++) {
                        var button = radioBox.getChildByName(buttonNames[j]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    },
    setDiaNumData_PaoHuZi: function () {

    }
});