 //郴州字牌
var CreateRoomNode_xiangXiRQS = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maxPlayer       = "_xiangXiRQS_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maiPaiType       = "_xiangXiRQS_maiPaiType";          //埋牌方式  0：不埋  1：埋10   2：埋20
        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_addFen     ="_xiangXiRQS_addFen";    //false：不充分， true 充分
        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zhuangFen     ="_xiangXiRQS_zhuangFen";    //0 ：无庄分， 1 ：2分, 2： 5分 3 ：10分
        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zimoAdd     ="_xiangXiRQS_zimoAdd";    //false : true
        this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_qiePai     ="_xiangXiRQS_qiePai";    //切牌

        this.roundNumObj = {roundNum1:8, roundNum2:16};

        this.setExtraKey({
            fanBei: "_xiangXiRQS_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_xiangXiRQS_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_xiangXiRQS_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.bg_node = ccs.load("bg_xiangxiRQS.json").node;
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
            this.addListenerText(this.maiPai20);
            this.maiPai20.addEventListener(this.clickCB_NanXianGuiHuZi, this.maiPai20);
        }
    },

    checkBoxPlayerSelected:function(index, sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkMaxPlayerSelect();
    },

    checkMaxPlayerSelect:function(){
        var _maxPlayerIndex = this.playerNum_radio.getSelectIndex();
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            cc.each(this.maiPaiList,function(node, key){
                if(_maxPlayerIndex == 1){
                    cc.eventManager.resumeTarget(node,true);
                    this.maiPaiList_radio.selectItem(this.currMaiPaiType);
                    this.radioBoxSelectCB(this.currMaiPaiType,this.maiPaiList[this.currMaiPaiType],this.maiPaiList);
                }else{
                    cc.eventManager.pauseTarget(node,true);
                    for(var index in node.children){
                        node.children[index].setTextColor(cc.color("#a8a5a5"));
                        node.setSelected(false);
                    }
                }
            },this);
        }
    },

    checkMaiPaiSelect:function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        var currMaiPaiItem = this.maiPaiList_radio.getSelectIndex();
        this.currMaiPaiType = currMaiPaiItem;
    },

    initPlayNode:function()
    {
        var _bgXiangXiNode = this.bg_node;
        var _play = _bgXiangXiNode.getChildByName("play");
        //人数 to do;
        var playerNumList = [];
        playerNumList.push(_play.getChildByName("play_maxPlayer_0"));
        playerNumList.push(_play.getChildByName("play_maxPlayer_1"));
        this.playerNum_radio = createRadioBoxForCheckBoxs(playerNumList, this.checkBoxPlayerSelected.bind(this));
        this.addListenerText(playerNumList,this.playerNum_radio, this.checkMaxPlayerSelect.bind(this));
        this.playerNumList = playerNumList;

        this.initMaiPaiNode(_play);

        //自摸加1分
        this.zimoAddCheckBox = _play.getChildByName("zimoaddCheckBox");
        this.zimoAddCheckBox.addEventListener(this._clickCB, this.zimoAddCheckBox);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.zimoAddCheckBox.getChildByName("text"));

        //充分
        this.chongfenCheckBox = _play.getChildByName("chongfenCheckBox");
        this.chongfenCheckBox.addEventListener(this._clickCB, this.chongfenCheckBox);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.chongfenCheckBox.getChildByName("text"));

        //飘风
        var piaoFenList = [_play.getChildByName("piaoFeng_1"), _play.getChildByName("piaoFeng_2"), _play.getChildByName("piaoFeng_3"), _play.getChildByName("piaoFeng_4")];
        this.piaoFen_radio = createRadioBoxForCheckBoxs(piaoFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(piaoFenList,0,this.piaoFen_radio),piaoFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoFenList,1,this.piaoFen_radio),piaoFenList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoFenList,2,this.piaoFen_radio),piaoFenList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoFenList,3,this.piaoFen_radio),piaoFenList[3].getChildByName("text"));

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("qiePai1"));
        qiePaiList.push(_play.getChildByName("qiePai2"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);

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

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {3:0, 2:1}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1"), _play.getChildByName("play_maxPlayer_2")];
        
        this.playerNum_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            var maiPaiType
            if(atClub)
                maiPaiType = this.getNumberItem("maiPaiType", 0);
            else
                maiPaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maiPaiType, 0);
            this.currMaiPaiType = maiPaiType;
            this.maiPaiList_radio.selectItem(maiPaiType);
            this.radioBoxSelectCB(maiPaiType,this.maiPaiList[maiPaiType],this.maiPaiList);
        }

        //自摸+1
        var _zimoAdd;
        if (atClub){
            _zimoAdd = this.getBoolItem("zimoAddFen", true);
        }else{
            _zimoAdd =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zimoAdd, true);
        }
        this.zimoAddCheckBox.setSelected(_zimoAdd);
        var txt = this.zimoAddCheckBox.getChildByName("text");
        txt.setTextColor(_zimoAdd ? cc.color(211,38,14) : cc.color(68,51,51));

        //充分
        var _chongfen;
        if (atClub){
            _chongfen = this.getBoolItem("chongFen", false);
        }else{
            _chongfen =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_addFen, false);
        }
        this.chongfenCheckBox.setSelected(_chongfen);
        var txt = this.chongfenCheckBox.getChildByName("text");
        txt.setTextColor(_chongfen ? cc.color(211,38,14) : cc.color(68,51,51));

        var _zhuangFen;  //庄分借用飘分字段信息
        if (atClub){
            _zhuangFen = this.getNumberItem("zhuangFen", 0);
        }else{
            _zhuangFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zhuangFen, 0);
        }
        list = [_play.getChildByName("piaoFeng_1"), _play.getChildByName("piaoFeng_2"), _play.getChildByName("piaoFeng_3"), _play.getChildByName("piaoFeng_4")];
        this.piaoFen_radio.selectItem(_zhuangFen);
        this.radioBoxSelectCB(_zhuangFen, list[_zhuangFen], list);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);


        this.setExtraPlayNodeCurrentSelect(atClub);
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        // this.updateXi();
        var self = this;
        this.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(function(){self.checkMaxPlayerSelect()})))
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.playerNum_radio.getSelectIndex();
        
        var para = {};
        para.maxPlayer = [3, 2][maxPlayerIndex]; //人数
        para.zhuangFen = this.piaoFen_radio.getSelectIndex();//0 无庄分， 1:2分 2：5分 3:10分
        para.chongFen = this.chongfenCheckBox.isSelected();
        para.zimoAddFen = this.zimoAddCheckBox.isSelected();
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];

        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.maiPaiType = this.maiPaiList_radio.getSelectIndex();
        }else{
            if(maxPlayerIndex == 1)
                para.maiPaiType = 2;
        }

        if(maxPlayerIndex == 0)
            para.maiPaiType = 0;

        this.getExtraSelectedPara(para);
        para.gameType = MjClient.GAME_TYPE.XIANG_XI_2710;
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
            var maxPlayerIndex = this.playerNum_radio.getSelectIndex();
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maiPaiType, para.maiPaiType);
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zhuangFen, para.zhuangFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_zimoAdd, para.zimoAddFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_addFen, para.chongFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_xiangXi_qiePai, para.isManualCutCard);
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