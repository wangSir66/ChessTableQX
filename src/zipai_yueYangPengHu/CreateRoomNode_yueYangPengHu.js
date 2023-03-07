//郴州字牌
var CreateRoomNode_yueYangPengHu = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_maxPlayer       = "_yueYangPengHu_maxPlayer";    //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_huPai      = "_yueYangPengHu_huPai";             //必胡
        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhongZhuang     = "_yueYangPengHu_zhongZhuang";  // 中庄
        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhuangPao     ="_yueYangPengHu_zhuangPao";       //庄跑
        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_qiePai     ="_yueYangPengHu_qiePai";            //切牌
        this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zuoZhuang     ="_yueYangPengHu_zuoZhuang";            //坐庄类型

        this.setExtraKey({
            fanBei: "_yueYangPengHu_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_yueYangPengHu_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_yueYangPengHu_JIE_SUAN_DI_FEN",  //积分底分
        });

        //this.roundNumObj = {roundNum1:8, roundNum2:16, roundNum3:24};
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        this.bgNode = ccs.load("bg_yueYangPengHu.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg").getChildByName("view");
        if(!this.bg_node){
            this.bg_node = this.bgNode.getChildByName("bg");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        var maxPlayerSelectCb = function (index) {
            this.radioBoxSelectCB(index,maxPlayerList[index], maxPlayerList);
            this.changeAAPayForPlayerNum();
        }.bind(this);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[2].getChildByName("text"));
        this.maxPlayerList = maxPlayerList;

        //胡牌
        var biHuList = this.biHuList = [
            _play.getChildByName("biHu0"), 
            _play.getChildByName("biHu1"), 
        ];
        this.biHuList_radio = createRadioBoxForCheckBoxs(biHuList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(biHuList,0,this.biHuList_radio),biHuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(biHuList,1,this.biHuList_radio),biHuList[1].getChildByName("text"));

        //中庄
        var zhongZhuangList = this.zhongZhuangList = [
            _play.getChildByName("zhongZhuang0"), 
            _play.getChildByName("zhongZhuang1"),
            _play.getChildByName("zhongZhuang2")
            ];
        var zhongZhuangSelectCb = function (index) {
            this.radioBoxSelectCB(index,zhongZhuangList[index], zhongZhuangList);
            this.updateZhuangPao();
        }.bind(this);
        this.zhongZhuangList_radio = createRadioBoxForCheckBoxs(zhongZhuangList,zhongZhuangSelectCb);
        cc.eventManager.addListener(this.setTextClick(zhongZhuangList,0,this.zhongZhuangList_radio, zhongZhuangSelectCb),zhongZhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhongZhuangList,1,this.zhongZhuangList_radio, zhongZhuangSelectCb),zhongZhuangList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhongZhuangList,2,this.zhongZhuangList_radio, zhongZhuangSelectCb),zhongZhuangList[2].getChildByName("text"));

        //庄跑
        this.zhuangPao = _play.getChildByName("zhuangPao");
        this.zhuangPao.addEventListener(this._clickCB.bind(this), this.zhuangPao);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.zhuangPao.getChildByName("text"));

        //坐庄
        var zuoZhuangList = [];
        zuoZhuangList.push(_play.getChildByName("zuoZhuang1"));
        zuoZhuangList.push(_play.getChildByName("zuoZhuang2"));
        this.zuoZhuangList_radio = createRadioBoxForCheckBoxs(zuoZhuangList, this.radioBoxSelectCB);
        this.addListenerText(zuoZhuangList,this.zuoZhuangList_radio);
        this.zuoZhuangList = zuoZhuangList

        //切牌
        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("qiePai1"));
        qiePaiList.push(_play.getChildByName("qiePai2"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ? cc.color("#d21400") : this._selectColor);
                    }else{
                        txt.setTextColor(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ? cc.color("#255662") : this._unSelectColor);
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        // return;
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_maxPlayer, 1);
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:2}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [
            _play.getChildByName("maxPlayer4"), 
            _play.getChildByName("maxPlayer3"), 
            _play.getChildByName("maxPlayer2")
        ];

        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        //胡牌/必胡
        var _biHu;
        if (atClub){
            _biHu = this.getNumberItem("biHu", 0);
        }else{
            _biHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_huPai, 0);
        }
        list = [
            _play.getChildByName("biHu0"), 
            _play.getChildByName("biHu1"), 
        ];
        this.biHuList_radio.selectItem(_biHu);
        this.radioBoxSelectCB(_biHu, list[_biHu], list);

        //中庄
        var _zhongZhuang;
        if (atClub){
            _zhongZhuang = this.getNumberItem("zhongZhuang", 2);
        }else{
            _zhongZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhongZhuang, 2);
        }
        list = [
            _play.getChildByName("zhongZhuang0"), 
            _play.getChildByName("zhongZhuang1"),
            _play.getChildByName("zhongZhuang2")
        ];
        this.zhongZhuangList_radio.selectItem(_zhongZhuang);
        this.radioBoxSelectCB(_zhongZhuang, list[_zhongZhuang], list);

        //庄跑
        var _zhuangPao;
        if (atClub){
            _zhuangPao = this.getBoolItem("isZhuangPao", false);
        }else{
            _zhuangPao =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhuangPao, false);
        }
        this.zhuangPao.setSelected(_zhuangPao);
        var txt = this.zhuangPao.getChildByName("text");
        txt.setTextColor(_zhuangPao ? MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ? cc.color("#d21400") : this._selectColor : MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ? cc.color("#255662") : this._unSelectColor);

        var zuoZhuang;
        if (atClub)
            zuoZhuang = this.getNumberItem("zuoZhuang", 0);
        else
            zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zuoZhuang, 0);
        this.zuoZhuangList_radio.selectItem(zuoZhuang);
        this.radioBoxSelectCB(zuoZhuang,this.zuoZhuangList[zuoZhuang],this.zuoZhuangList);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        this.updateZhuangPao();
    },

    //更新庄跑选项
    updateZhuangPao:function () {
        var index = this.zhongZhuangList_radio.getSelectIndex();
        if(index == 2){
            this.zhuangPao.visible = true;
        }else{
            this.zhuangPao.visible = false;
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [4, 3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.biHu = this.biHuList_radio.getSelectIndex();     
        para.zhongZhuang = this.zhongZhuangList_radio.getSelectIndex();
        para.isZhuangPao = this.zhuangPao.isSelected();
        para.zuoZhuang = this.zuoZhuangList_radio.getSelectIndex(); 
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_PENG_HU;

        this.getExtraSelectedPara(para);

        if(para.zhongZhuang != 2){
            para.isZhuangPao = false;
        }

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
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_huPai, para.biHu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhongZhuang, para.zhongZhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zuoZhuang, para.zuoZhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_zhuangPao, para.isZhuangPao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_yueYangPengHu_qiePai, para.isManualCutCard);
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
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;

        var round = this.bg_node.getChildByName("round");
        var text1 = round.getChildByName("payWay_1").getChildByName("text_0");
        var text2 = round.getChildByName("payWay_3").getChildByName("text_0");
        text1.ignoreContentAdaptWithSize(true);
        text2.ignoreContentAdaptWithSize(true);

        var _gameType = this._data.gameType;
        var _maxPlayer = this.getSelectPlayNum();
        var roundNumObj = Object.keys(MjClient.data.gamePrice[_gameType][_maxPlayer]).sort(function(a,b){return a-b});
        var roundNum = roundNumObj[0];
        for (var i=0; i<this.roundNodeArray.length; i++)
        {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) && roundNode.isSelected())
            {
                roundNum = roundNumObj[i];
                break;
            }
        }

        text1.setString("(" + this.getPrice(gameType, maxPlayer, roundNum, 0) + this._costName + ")");
        text2.setString("(" + this.getPrice(gameType, maxPlayer, roundNum, 2) + this._costName + ")");

        if (cc.sys.isObjectValid(this.payWayNodeArray[2]) && !this._isRoomCardMode)
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    }
});