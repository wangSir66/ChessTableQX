//郴州字牌
var CreateRoomNode_hanShouPaoHuZi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maxPlayer       = "_hanShouPaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPai     ="_hanShouPaoHuZi_maiPai";    ;//埋牌：true/false
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPaiType     ="_hanShouPaoHuZi_maiPaiType";    ;//埋牌方式  0：不埋    1：埋10  2：埋20
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_wanFa     ="_hanShouPaoHuZi_wanFa";    //0 倒一， 1 倒二， 2 倒三， 3 倒五， 4 倒八， 5 倒十
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fengDing     ="_hanShouPaoHuZi_fengDing";    //0 不封顶， 1 单局20分， 2 单局40分， 3 单局60分， 4 单局80分
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_sanTiWuKan     ="_hanShouPaoHuZi_sanTiWuKan";    //0 不叠加名堂， 1 叠加名堂
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fanBei     ="_hanShouPaoHuZi_fanBei";   //0 不翻倍， 1 ≤10分翻倍， 2 ≤15分翻倍， 3 ≤20分翻倍， 4 ≤30分翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_qiePai     = "_hanShouPaoHuZi_qiePai"; //切牌:true/false
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_faPai     = "_hanShouPaoHuZi_faPai"; //发牌 0普通 1畅爽 2 极速
        this.localStorageKey.KEY_PAO_HU_ZI_HanShou_tuoGuan          ="_hanShouPaoHuZi_tuoGuan";    //托管 0 无/1/2/3/5分钟

        this.setExtraKey({
            jieSuanDiFen: "_hanShouPaoHuZi_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.bg_node = ccs.load("bg_hanShouPaoHuZi.json").node;
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
            this.maiPai = _play.getChildByName("maiPai");
            this.maiPai.addEventListener(this._clickCB, this.maiPai);
            cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maiPai.getChildByName("text"));
        }
    },

    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        this.maxPlayerList = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1")];
        this.initPlayNumNode(this.maxPlayerList, [3, 2]);
        var maxPlayerSelectCb = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, this.maxPlayerList);
            this.updateMaiPai();
            this.updateSelectDiaNum();
        }.bind(this);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(this.maxPlayerList, maxPlayerSelectCb);
        cc.eventManager.addListener(this.setTextClick(this.maxPlayerList,0,this.maxPlayerList_radio, maxPlayerSelectCb),this.maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(this.maxPlayerList,1,this.maxPlayerList_radio, maxPlayerSelectCb),this.maxPlayerList[1].getChildByName("text"));

        this.initMaiPaiNode(_play);

        //玩法
        this.wanFaList = [_play.getChildByName("play_1"), _play.getChildByName("play_2"), _play.getChildByName("play_3"), _play.getChildByName("play_4"), _play.getChildByName("play_5"), _play.getChildByName("play_6")];
        this.wanFaList_radio = createRadioBoxForCheckBoxs(this.wanFaList, this.radioBoxSelectCB);
        this.addListenerText(this.wanFaList,this.wanFaList_radio);

        //封顶
        this.fengDingList = [_play.getChildByName("fengDing_1"), _play.getChildByName("fengDing_2"), _play.getChildByName("fengDing_3"), _play.getChildByName("fengDing_4"), _play.getChildByName("fengDing_5")];
        this.fengDingList_radio = createRadioBoxForCheckBoxs(this.fengDingList, this.radioBoxSelectCB);
        this.addListenerText(this.fengDingList,this.fengDingList_radio);

        //三提五坎
        this.sanTiWuKanList = [_play.getChildByName("sanTiWuKan_1"), _play.getChildByName("sanTiWuKan_2")];
        this.sanTiWuKanList_radio = createRadioBoxForCheckBoxs(this.sanTiWuKanList, this.radioBoxSelectCB);
        this.addListenerText(this.sanTiWuKanList,this.sanTiWuKanList_radio);

        //翻倍
        this.fanBeiList = [_play.getChildByName("fanBei_1"), _play.getChildByName("fanBei_2"), _play.getChildByName("fanBei_3"), _play.getChildByName("fanBei_4"), _play.getChildByName("fanBei_5")];
        this.fanBeiList_radio = createRadioBoxForCheckBoxs(this.fanBeiList, this.radioBoxSelectCB);
        this.addListenerText(this.fanBeiList,this.fanBeiList_radio);

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

        var btn_fanbeiTip = this.bg_node.getChildByName("btn_fanbeiTip");
        var image_fanbeiTip = this.bg_node.getChildByName("image_fanbeiTip");
        btn_fanbeiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {image_fanbeiTip.setVisible(true);}
        }, btn_fanbeiTip);
        btn_fanbeiTip.getChildByName("text").addTouchEventListener(function(sender, type) {
            if (type == 2) {image_fanbeiTip.setVisible(true);}
        }, btn_fanbeiTip.getChildByName("text"));
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_fanbeiTip.isVisible()) {
                    image_fanbeiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_fanbeiTip);

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("autoCut"));
        qiePaiList.push(_play.getChildByName("manualCut"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        faPaiList.push(_play.getChildByName("faPai3"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB);
        this.addListenerText(faPaiList,this.faPaiList_radio);
        this.faPaiList = faPaiList;

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    updateMaiPai:function(){
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
            this.maiPai.visible = curMaxPlayerSelect == 1;
        }
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(211,38,14));
                    }else{
                        txt.setTextColor(cc.color(68,51,51));
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {3:0, 2:1}[this.getNumberItem("maxPlayer", 3)];
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, this.maxPlayerList[_maxPlayer], this.maxPlayerList);

        var _isMaiPai;
        if (atClub){
            _isMaiPai = this.getBoolItem("isMaiPai", false);
        }else{
            _isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPai, false);
        }

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            var maiPaiType;
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 2);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPaiType, 2);

            if(!_isMaiPai) maiPaiType = 0;
            if(_isMaiPai && maiPaiType == 0) maiPaiType = 2;
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }else{
            //埋牌20
            this.maiPai.setSelected(_isMaiPai);
            var txt = this.maiPai.getChildByName("text");
            txt.setTextColor(_isMaiPai ? cc.color(211,38,14) : cc.color(68,51,51));
        }

        var _wanFa;
        if (atClub){
            _wanFa = this.getNumberItem("wanFa", 0);
        }else{
            _wanFa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_wanFa, 0);
        }
        this.wanFaList_radio.selectItem(_wanFa);
        this.radioBoxSelectCB(_wanFa, this.wanFaList[_wanFa], this.wanFaList);

        var _fengDing;
        if (atClub){
            _fengDing = this.getNumberItem("fengDing", 0);
        }else{
            _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fengDing, 0);
        }
        this.fengDingList_radio.selectItem(_fengDing);
        this.radioBoxSelectCB(_fengDing, this.fengDingList[_fengDing], this.fengDingList);

        var _sanTiWuKan;
        if (atClub){
            _sanTiWuKan = this.getNumberItem("sanTiWuKan", 0);
        }else{
            _sanTiWuKan = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_sanTiWuKan, 0);
        }
        this.sanTiWuKanList_radio.selectItem(_sanTiWuKan);
        this.radioBoxSelectCB(_sanTiWuKan, this.sanTiWuKanList[_sanTiWuKan], this.sanTiWuKanList);

        var _fanBei;
        if (atClub){
            _fanBei = this.getNumberItem("fanBei", 0);
        }else{
            _fanBei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fanBei, 0);
        }
        this.fanBeiList_radio.selectItem(_fanBei);
        this.radioBoxSelectCB(_fanBei, this.fanBeiList[_fanBei], this.fanBeiList);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        var faPai;
        if (atClub)
            faPai = this.getNumberItem("faPai", 1);
        else
            faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_faPai, 1);
        this.faPaiList_radio.selectItem(faPai);
        this.radioBoxSelectCB(faPai,this.faPaiList[faPai],this.faPaiList);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0),cc.callFunc(function(){ self.updateMaiPai()})));
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.wanFa = this.wanFaList_radio.getSelectIndex();//0 倒一， 1 倒二， 2 倒三， 3 倒五， 4 倒八， 5 倒十
        para.fengDing = this.fengDingList_radio.getSelectIndex();//0 不封顶， 1 单局20分， 2 单局40分， 3 单局60分， 4 单局80分
        para.sanTiWuKan = this.sanTiWuKanList_radio.getSelectIndex();//0 不叠加名堂， 1 叠加名堂
        para.fanBei = this.fanBeiList_radio.getSelectIndex();//0 不翻倍， 1 ≤10分翻倍， 2 ≤15分翻倍， 3 ≤20分翻倍， 4 ≤30分翻倍
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.gameType = MjClient.GAME_TYPE.HAN_SHOU_PAO_HU_ZI;

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.maiPaiType = this.maiPaiList_radio.getSelectIndex();
            para.isMaiPai = para.maiPaiType > 0
        }else{
            para.isMaiPai = this.maiPai.isSelected();
        }

        if(this.maxPlayerList_radio.getSelectIndex() == 0)
            para.isMaiPai = false;

        this.getExtraSelectedPara(para);

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
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_tuoGuan, para.trustTime);
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_maiPaiType, para.maiPaiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_wanFa, para.wanFa);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fengDing, para.fengDing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_sanTiWuKan, para.sanTiWuKan);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_fanBei, para.fanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_HanShou_faPai, para.faPai);
        }
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node);
    },

    setDiaNumData:function(gameNode)
    { 
        this._super(gameNode);
        this.setDiaNumData_PaoHuZi();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this.setDiaNumData_PaoHuZi();
    },

    getPrice: function(gameType, maxPlayer, roundNum, payWay) {
        //cc.log("MjClient.data.gamePrice@@ " + JSON.stringify(MjClient.data.gamePrice));
        if(!MjClient.data.gamePrice[gameType][maxPlayer][roundNum]){
            return 0;
        }
        return MjClient.data.gamePrice[gameType][maxPlayer][roundNum][payWay];
    },

    setDiaNumData_PaoHuZi : function(){
        // var para = this.getSelectedPara();
        // var gameType = para.gameType;
        // var maxPlayer = para.maxPlayer;
        //
        // var round = this.bg_node.getChildByName("round");
        // var text1 = round.getChildByName("payWay_1").getChildByName("text_0");
        // var text2 = round.getChildByName("payWay_2").getChildByName("text_0");
        // text1.ignoreContentAdaptWithSize(true);
        // text2.ignoreContentAdaptWithSize(true);
        //
        // var _gameType = this._data.gameType;
        // var _maxPlayer = this.getSelectPlayNum();
        // var roundNumObj = Object.keys(MjClient.data.gamePrice[_gameType][_maxPlayer]).sort(function(a,b){return a-b});
        // var roundNum = roundNumObj[0];
        // for (var i=0; i<this.roundNodeArray.length; i++)
        // {
        //     var roundNode = this.roundNodeArray[i];
        //     if (cc.sys.isObjectValid(roundNode) && roundNode.isSelected())
        //     {
        //         roundNum = roundNumObj[i];
        //         break;
        //     }
        // }
        //
        // text1.setString("(" + this.getPrice(gameType, maxPlayer, roundNum, 0) + this._costName + ")");
        // text2.setString("(" + this.getPrice(gameType, maxPlayer, roundNum, 1) + this._costName + ")");
    }
});