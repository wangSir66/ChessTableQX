/*
* @Author: zzj
* @Date:   2018-08-01 15:30:49
* @Last Modified by:   zzj
* @Last Modified time: 2019-04-02 11:01:14
*/

var CreateRoomNode_FuLuShouErShiZhang = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_FuLuShouErShiZhang_maxPlayer     = "_FuLuShouErShiZhang_maxPlayer";    //几人玩
            this.localStorageKey.KEY_FuLuShouErShiZhang_zhuang        = "_FuLuShouErShiZhang_zhuang";       //轮庄方式 1=轮庄，2=胡牌庄
            this.localStorageKey.KEY_FuLuShouErShiZhang_diFen         = "_FuLuShouErShiZhang_diFen";        //底分 1, 2, 3 (idx3=4分)

            //小胡
            this.localStorageKey.KEY_FuLuShouErShiZhang_queYiSe       = "_FuLuShouErShiZhang_queYiSe";       //缺一色
            this.localStorageKey.KEY_FuLuShouErShiZhang_banBanHu      = "_FuLuShouErShiZhang_banBanHu";      //板板胡
            this.localStorageKey.KEY_FuLuShouErShiZhang_liuLiuShun    = "_FuLuShouErShiZhang_liuLiuShun";    //六六顺
            this.localStorageKey.KEY_FuLuShouErShiZhang_daSiXi        = "_FuLuShouErShiZhang_daSiXi";        //大四喜

            //飘分
            this.localStorageKey.KEY_FuLuShouErShiZhang_piao          = "_FuLuShouErShiZhang_piao";         //飘分 0=不选，1=飘1，2=飘2，4=飘3，8=飘5，32=不飘

            //玩法
            this.localStorageKey.KEY_FuLuShouErShiZhang_tongPao       = "_FuLuShouErShiZhang_tongPao";       //通炮
            this.localStorageKey.KEY_FuLuShouErShiZhang_qiangZhiHu    = "_FuLuShouErShiZhang_qiangZhiHu";    //强制胡
        }

        this.setExtraKey({
            fanBei: "_FuLuShouErShiZhang_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_FuLuShouErShiZhang_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_FuLuShouErShiZhang_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:8, roundNum2:16};
        this.bg_node = ccs.load("bg_FuLuShouErShiZhang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_fulushou").getChildByName("scroll");
    },

    initPlayNode:function()
    { 
        this._super();  

        //隐藏房费选项
        this.bg_node.getChildByName("fangfei").setVisible(false);
        var round = this.bg_node.getChildByName("round");
        for ( var i = 1; i <= 3; i++){
            round.getChildByName("payWay_" + i).setVisible(false);
        }

        var _play = this.bg_node.getChildByName("play");
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer0"));
        this.initPlayNumNode(maxPlayerList, [3, 2, 3]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[2].getChildByName("text"));

        this.playerList_node = maxPlayerList;

        var zhuangList = [];
        zhuangList.push(_play.getChildByName("lunZhuang"));
        zhuangList.push(_play.getChildByName("huPaiZhuang"));
        this.zhuangList_radio = createRadioBoxForCheckBoxs(zhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangList,0,this.zhuangList_radio),zhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangList,1,this.zhuangList_radio),zhuangList[1].getChildByName("text"));
        this.zhuangList_node = zhuangList;

        var diFenList = [];
        diFenList.push(_play.getChildByName("diFen1"));
        diFenList.push(_play.getChildByName("diFen2"));
        diFenList.push(_play.getChildByName("diFen3"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,2,this.diFenList_radio),diFenList[2].getChildByName("text"));
        this.diFenList_node = diFenList;

        //缺一色
        this.queYiSe = _play.getChildByName("queYiSe");
        this.addListenerText(this.queYiSe);
        this.queYiSe.addEventListener(this.clickCB, this.queYiSe);
        //板板胡
        this.banBanHu = _play.getChildByName("banBanHu");
        this.addListenerText(this.banBanHu);
        this.banBanHu.addEventListener(this.clickCB, this.banBanHu);
        //六六顺
        this.liuLiuShun = _play.getChildByName("liuLiuShun");
        this.addListenerText(this.liuLiuShun);
        this.liuLiuShun.addEventListener(this.clickCB, this.liuLiuShun);
        //大四喜
        this.daSiXi = _play.getChildByName("daSiXi");
        this.addListenerText(this.daSiXi);
        this.daSiXi.addEventListener(this.clickCB, this.daSiXi);

        var that = this;
        //飘分
        var _clickCB = function(sender,type){ 
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED: 
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");  
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(211,38,14)); 
                    }else{
                        txt.setTextColor(cc.color(68,51,51));
                    }

                    for (var i = 1; i < that.piaoList.length; i++) {
                        var node = that.piaoList[i];
                        node.setVisible(sender.isSelected());
                    }
                    break;
            }
        }
        this.piaoList = [];
        for (var i = 0; i < 6; i++) {
            var key = 'piao' + i;
            var node = _play.getChildByName(key);
            this.piaoList.push(node);
            if (i == 0) {
                this.addListenerText(node, null, function(number, ref) {
                    for (var i = 1; i < that.piaoList.length; i++) {
                        var target = that.piaoList[i];
                        target.setVisible(ref.isSelected());
                    }
                });
                node.addEventListener(_clickCB, node);
            }
            else {
                this.addListenerText(node);
                node.addEventListener(this.clickCB, node);
            }
           
        }

        //通炮
        this.tongPao = _play.getChildByName("tongPao");
        this.addListenerText(this.tongPao);
        this.tongPao.addEventListener(this.clickCB, this.tongPao);
        //强制胡
        this.qiangZhiHu = _play.getChildByName("qiangZhiHu");
        this.addListenerText(this.qiangZhiHu);
        this.qiangZhiHu.addEventListener(this.clickCB, this.qiangZhiHu);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    //初始化上次选择
    setPlayNodeCurrentSelect:function(atClub)
    {
        this._super();
        var _play = this.bg_node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            if (this.getBoolItem("convertible", false))
                _maxPlayer = 2;  //自由人数索引
            else {
                var temp_maxPlayer = this.getNumberItem("maxPlayer", 3);
                _maxPlayer = [3, 2].indexOf(temp_maxPlayer);
            }
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node); 

        //庄
        var _zhuang;
        if(atClub){
            var temp_bankType = this.getNumberItem("bankType", 1);
            _zhuang = [1,2].indexOf(temp_bankType);
        }
        else{
            _zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_zhuang, 0); 
        }
        this.zhuangList_radio.selectItem(_zhuang);
        this.radioBoxSelectCB(_zhuang,this.zhuangList_node[_zhuang],this.zhuangList_node);
 
        //底分
        var _diFen;  
        if (atClub){
            var temp_diFen = this.getNumberItem("diFen", 1);
            _diFen = [1,2,4].indexOf(temp_diFen);
        }
        else{
            _diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_diFen, 0);
        }
        this.diFenList_radio.selectItem(_diFen);
        this.radioBoxSelectCB(_diFen,this.diFenList_node[_diFen],this.diFenList_node);

        //缺一色
        var _queYiSe;
        if (atClub)
            _queYiSe = this.getBoolItem("isQueYiSe", false);
        else
            _queYiSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_queYiSe, false);
        this.queYiSe.setSelected(_queYiSe);
        var text = this.queYiSe.getChildByName("text");
        this.selectedCB(text, _queYiSe);
        //板板胡
        var _banBanHu;
        if (atClub)
            _banBanHu = this.getBoolItem("isBanBanHu", false);
        else
            _banBanHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_banBanHu, false);
        this.banBanHu.setSelected(_banBanHu);
        var text = this.banBanHu.getChildByName("text");
        this.selectedCB(text, _banBanHu);
        //六六顺
        var _liuLiuShun;
        if (atClub)
            _liuLiuShun = this.getBoolItem("isLiuLiuShun", false);
        else
            _liuLiuShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_liuLiuShun, false);
        this.liuLiuShun.setSelected(_liuLiuShun);
        var text = this.liuLiuShun.getChildByName("text");
        this.selectedCB(text, _liuLiuShun);
        //大四喜
        var _daSiXi;
        if (atClub)
            _daSiXi = this.getBoolItem("isDaSiXi", false);
        else
            _daSiXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_daSiXi, false);
        this.daSiXi.setSelected(_daSiXi);
        var text = this.daSiXi.getChildByName("text");
        this.selectedCB(text, _daSiXi);

        //飘分  
        //var isPiao = true;  //是否勾选了飘分总开关, 默认勾选了
        var piaoFlag = [1, 2, 4, 8, 16];  //-1=总开关没选    0=选了总开关但没选任何子选项   1=不飘 2=飘1 4=飘2 8=飘3 16=飘5
        var defFlag = 0; //默认选了总开关
        for (var i = 0; i < piaoFlag.length; i++) {
            defFlag += piaoFlag[i];  //默认全选
        }
        var _piao;  
        if (atClub) {
            _piao = this.getNumberItem("piaoFlag", defFlag);
        }
        else
            _piao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_piao, defFlag);
        
        cc.log("上一次选择", _piao);
        var firstPiaoNode = this.piaoList[0];
        for (var i = 0; i < this.piaoList.length; i++) {
            var node = this.piaoList[i];
            var isSelected = true;
            if (i == 0) {
                isSelected = _piao >= 0;
            }
            else {
                isSelected = (_piao & piaoFlag[i-1]) > 0;
            }
            node.setSelected(isSelected);
            var text = node.getChildByName("text");
            this.selectedCB(text, isSelected);
            if (i == 0) {
                node.setVisible(true);
            }
            else {
                node.setVisible(firstPiaoNode.isSelected());
            }
        }

        //通炮
        var _tongPao;
        if (atClub){
            _tongPao= this.getBoolItem("isTongPao", false);
        }
        else{
            _tongPao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_tongPao, false);
        }
        this.tongPao.setSelected(_tongPao);
        var text = this.tongPao.getChildByName("text");
        this.selectedCB(text, _tongPao);

        //强制胡
        var _qiangZhiHu;
        if (atClub)
            _qiangZhiHu = this.getBoolItem("isBiHu", false);
        else
            _qiangZhiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_qiangZhiHu, false);
        this.qiangZhiHu.setSelected(_qiangZhiHu);
        var text = this.qiangZhiHu.getChildByName("text");
        this.selectedCB(text, _qiangZhiHu);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        // this.changeAAPayForPlayerNum();
    },

    //重置飘分选项
    resetChangeView : function(isSelected){
        var firstPiaoNode = this.piaoList[0];
        for (var i = 1; i < this.piaoList.length; i++) {
            var node = this.piaoList[i];
            node.setVisible(isSelected);
        }
    },

    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var zhuangIndex = this.zhuangList_radio.getSelectIndex();
        var diFenIndex = this.diFenList_radio.getSelectIndex();
        var queYiSe = this.queYiSe.isSelected();
        var banBanHu = this.banBanHu.isSelected();
        var liuLiuShun = this.liuLiuShun.isSelected();
        var daSiXi = this.daSiXi.isSelected();
        var tongPao = this.tongPao.isSelected();
        var qiangZhiHu = this.qiangZhiHu.isSelected();
        //飘分
        var piaoFlag = 0;
        var firstPiaoNode = this.piaoList[0];
        if (!firstPiaoNode.isSelected()) {
            piaoFlag = -1;
        }
        else {
            for (var i = 1; i < this.piaoList.length; i++) {
                if (this.piaoList[i].isSelected()) 
                    piaoFlag += Math.pow(2, i-1);        
            }
        }

        cc.log("创建房间时飘的选择", piaoFlag);
        var para = {};
        para.gameType = MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG;
        para.maxPlayer = [3, 2, 3][maxPlayerIndex];
        para.convertible = maxPlayerIndex == 2;                         // 自由人数
        para.bankType = [1, 2][zhuangIndex];    //1=轮庄 2=胡牌庄 
        para.diFen = [1, 2, 4][diFenIndex];
        para.isQueYiSe = queYiSe;
        para.isBanBanHu = banBanHu;
        para.isLiuLiuShun = liuLiuShun;
        para.isDaSiXi = daSiXi;
        para.piaoFlag = piaoFlag;
        para.isTongPao = tongPao;
        para.isBiHu = qiangZhiHu;

        this.getExtraSelectedPara(para);
                                  
        //cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_zhuang, zhuangIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_diFen, diFenIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShouErShiZhang_piao, piaoFlag);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_queYiSe, queYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_banBanHu, banBanHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_liuLiuShun, liuLiuShun);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_daSiXi, daSiXi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_tongPao, tongPao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShouErShiZhang_qiangZhiHu, qiangZhiHu);
        }

        cc.log("方式==", JSON.stringify(para));
        return para;
    },

    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_shd();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_shd();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_shd();
    },

    setDiaNumData_shd : function(){
        return;
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
         
    }
});