/*
* @Author: zzj
* @Date:   2018-08-01 15:30:49
* @Last Modified by:   zzj
* @Last Modified time: 2019-04-02 10:59:35
*/

var CreateRoomNode_FuLuShou = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_FuLuShou_maxPlayer     = "_FuLuShou_maxPlayer";    //几人玩
            this.localStorageKey.KEY_FuLuShou_zhuang        = "_FuLuShou_zhuang";       //轮庄方式 1=轮庄，2=胡牌庄
            this.localStorageKey.KEY_FuLuShou_piao          = "_FuLuShou_piao";         //飘分 1=热飘，2=冷飘，3=不飘，4=固定飘分
            this.localStorageKey.KEY_FuLuShou_piaoNum       = "_FuLuShou_piaoNum";      //固定飘分 1=飘1，2=飘2，4=飘3，8=飘5
            this.localStorageKey.KEY_FuLuShou_qinZui        = "_FuLuShou_qinZui";       //亲嘴胡 1=亲嘴0胡，2=亲嘴2胡
            this.localStorageKey.KEY_FuLuShou_ppHu          = "_FuLuShou_ppHu";         //碰碰胡
            this.localStorageKey.KEY_FuLuShou_liuXi         = "_FuLuShou_liuXi";        //招杠六息
            this.localStorageKey.KEY_FuLuShou_suanFen       = "_FuLuShou_suanFen";      //叠加算分
        }

        this.setExtraKey({
            fanBei: "_FuLuShou_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_FuLuShou_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_FuLuShou_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });


        this.roundNumObj = {roundNum1:8, roundNum2:16};
        this.bg_node = ccs.load("bg_FuLuShou.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_fulushou").getChildByName("scroll");
    },

    //固定飘时调用，适配布局
    adjustLayout:function() {
        for (var i = 0; i < this.piaoNum.length; i++) {
            cc.log("没进来吗", this.isSelectGuDingPiao);
            this.piaoNum[i].visible = this.isSelectGuDingPiao;
        }
        this.pnlRemain.y = this.isSelectGuDingPiao ? this.pnlRemainY : (this.pnlRemainY + 56);
    },

    initPlayNode:function()
    { 
        this._super();
        var _play = this.bg_node.getChildByName("play");
        //记录初始坐标

        //隐藏房费选项
        this.bg_node.getChildByName("fangfei").setVisible(false);
        var round = this.bg_node.getChildByName("round");
        for ( var i = 1; i <= 3; i++){
            round.getChildByName("payWay_" + i).setVisible(false);
        }

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer0")); //自由人数
        this.initPlayNumNode(maxPlayerList, [2, 3, 4, 4]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,3,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[3].getChildByName("text"));

        this.playerList_node = maxPlayerList;

        var zhuangList = [];
        zhuangList.push(_play.getChildByName("lunZhuang"));
        zhuangList.push(_play.getChildByName("huPaiZhuang"));
        this.zhuangList_radio = createRadioBoxForCheckBoxs(zhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangList,0,this.zhuangList_radio),zhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangList,1,this.zhuangList_radio),zhuangList[1].getChildByName("text"));
        this.zhuangList_node = zhuangList;

        //飘分
        var piaoList = [];
        piaoList.push(_play.getChildByName("rePiao"));
        piaoList.push(_play.getChildByName("lengPiao"));
        piaoList.push(_play.getChildByName("buPiao"));
        piaoList.push(_play.getChildByName("guDingPiao"));

        var piaoSelectCb = function(index,sender, list){
            this.radioBoxSelectCB(index, sender, piaoList);
            this.isSelectGuDingPiao = false;
            //固定飘
            if(sender.getName() == 'guDingPiao') {
                this.isSelectGuDingPiao = true;
            }
            this.adjustLayout();
        }.bind(this);

        this.piaoList_radio = createRadioBoxForCheckBoxs(piaoList, piaoSelectCb);
        cc.eventManager.addListener(this.setTextClick(piaoList,0,this.piaoList_radio,piaoSelectCb),piaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoList,1,this.piaoList_radio,piaoSelectCb),piaoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoList,2,this.piaoList_radio,piaoSelectCb),piaoList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(piaoList,3,this.piaoList_radio,piaoSelectCb),piaoList[3].getChildByName("text"));
        this.piaoList_node = piaoList;

        //固定飘下面的节点
        this.piaoNum = [];
        for (var i = 1; i < 5; i++) {
            var piaoNum = _play.getChildByName('piao' + i);
            piaoNum.addEventListener(this.clickCB, piaoNum);
            this.addListenerText(piaoNum);
            this.piaoNum[i-1] = piaoNum;
        }

        //剩下的放到pnl_remain中了
        var pnlRemain = this.bg_node.getChildByName("pnl_remain");
        this.pnlRemain = pnlRemain;
        this.pnlRemainY = pnlRemain.y;
        //默认没选中固定飘
        this.isSelectGuDingPiao = false;
        this.adjustLayout();

        //亲嘴
        var qinZuiList = [];
        qinZuiList.push(pnlRemain.getChildByName("qinZui0"));
        qinZuiList.push(pnlRemain.getChildByName("qinZui2"));
        this.qinZuiList_radio = createRadioBoxForCheckBoxs(qinZuiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(qinZuiList,0,this.qinZuiList_radio),qinZuiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qinZuiList,1,this.qinZuiList_radio),qinZuiList[1].getChildByName("text"));
        this.qinZuiList_node = qinZuiList;

        //叠加算分
        var suanFenList = [];
        suanFenList.push(pnlRemain.getChildByName("dieJia"));
        suanFenList.push(pnlRemain.getChildByName("buDieJia"));
        this.suanFenList_radio = createRadioBoxForCheckBoxs(suanFenList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(suanFenList,0,this.suanFenList_radio),suanFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(suanFenList,1,this.suanFenList_radio),suanFenList[1].getChildByName("text"));
        this.suanFenList_node = suanFenList;

        //碰碰胡
        this.ppHu = pnlRemain.getChildByName("ppHu");
        this.addListenerText(this.ppHu);
        this.ppHu.addEventListener(this.clickCB, this.ppHu);

        //招杠6息, 默认不勾选
        this.liuXi = pnlRemain.getChildByName("liuXi");
        this.addListenerText(this.liuXi);
        this.liuXi.addEventListener(this.clickCB, this.liuXi);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(pnlRemain);
    },

    //初始化上次选择
    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            if (this.getBoolItem("convertible", false))
                _maxPlayer = 3;  //自由人数
            else {
                var temp_maxPlayer = this.getNumberItem("maxPlayer", 2);
                _maxPlayer = [2, 3, 4].indexOf(temp_maxPlayer);
            }
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_maxPlayer, 0);
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
            _zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_zhuang, 0); 
        }
        this.zhuangList_radio.selectItem(_zhuang);
        this.radioBoxSelectCB(_zhuang,this.zhuangList_node[_zhuang],this.zhuangList_node);
 
        //飘分
        var _piao;  
        if (atClub){
            var temp_piaoType = this.getNumberItem("piaoType", 1);
            _piao = [1,2,3,4].indexOf(temp_piaoType);
        }
        else{
            _piao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_piao, 0);
        }
        this.piaoList_radio.selectItem(_piao);
        this.radioBoxSelectCB(_piao,this.piaoList_node[_piao],this.piaoList_node);
        //默认没选中固定飘
        this.isSelectGuDingPiao = _piao == 3;
        this.adjustLayout();
        
        //固定飘分 
        //0=选了固定飘分但没选飘几分 1=飘1 2=飘2 4=飘3 8=飘5
        var piaoFlag = [1, 2, 4, 8]; 
        var defFlag = 0;  //默认不选飘几
        var _piaoFlag;
        if (atClub) {
            _piaoFlag = this.getNumberItem("piaoFlag", defFlag);
        }
        else {
            _piaoFlag = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_piaoNum, defFlag);
        } 
        for (var i = 0; i < this.piaoNum.length; i++) {
            var node = this.piaoNum[i];
            var isSelected = false;
            if (_piao == 3) {
                isSelected = (_piaoFlag & piaoFlag[i]) > 0;
            }
            node.setSelected(isSelected);
            var text = node.getChildByName("text");
            this.selectedCB(text, isSelected);
        }

        //亲嘴
        var _qinZui;
        if (atClub){
            var temp_qinZui = this.getNumberItem("qingZuiType", 1);
            _qinZui= [1,2].indexOf(temp_qinZui);
        }
        else{
            _qinZui = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_qinZui, 0);
        }
        this.qinZuiList_radio.selectItem(_qinZui);
        this.radioBoxSelectCB(_qinZui,this.qinZuiList_node[_qinZui],this.qinZuiList_node);

        //碰碰胡
        var _ppHu;
        if (atClub)
            _ppHu = this.getBoolItem("isPenPenHuTwo", true);
        else
            _ppHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShou_ppHu, true);
        this.ppHu.setSelected(_ppHu);
        var text = this.ppHu.getChildByName("text");
        this.selectedCB(text, _ppHu);

        //招杠六息
        var _liuXi;
        if (atClub)
            _liuXi = this.getBoolItem("isZhaoGang6Xi", false);
        else
            _liuXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_FuLuShou_liuXi, false);
        this.liuXi.setSelected(_liuXi);
        var text = this.liuXi.getChildByName("text");
        this.selectedCB(text, _liuXi);

        //叠加算分
        var _suanFen;
        if (atClub) {
            var temp_suanFen = this.getNumberItem("isSuanFenDieJia", 2);
            _suanFen= [1,2].indexOf(temp_suanFen);
        }
        else
            _suanFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_FuLuShou_suanFen, 1);

        this.suanFenList_radio.selectItem(_suanFen);
        this.radioBoxSelectCB(_suanFen,this.suanFenList_node[_suanFen],this.suanFenList_node);


        this.setExtraPlayNodeCurrentSelect(atClub);
        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        // this.changeAAPayForPlayerNum();
    },

    getSelectedPara:function()
    {
        var getPiaoNum = function(ref) {
            var flag = 0;
            for (var i = 0; i < ref.piaoNum.length; i++) {
                if (ref.piaoNum[i].isSelected())
                    flag += Math.pow(2, i);
            }

            return flag;
        }

        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var zhuangIndex = this.zhuangList_radio.getSelectIndex();
        var piaoIndex = this.piaoList_radio.getSelectIndex();
        var qinZuiIndex = this.qinZuiList_radio.getSelectIndex();
        var ppHu = this.ppHu.isSelected();
        var liuXi = this.liuXi.isSelected();
        var suanFenIndex = this.suanFenList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU;
        para.maxPlayer = [2, 3, 4, 4][maxPlayerIndex];
        para.convertible = maxPlayerIndex == 3;                         // 自由人数
        para.bankType = [1, 2][zhuangIndex];                            //1=轮庄 2=胡牌庄
        para.piaoType = [1, 2, 3, 4][piaoIndex];                           //1=热飘 2=冷飘 3=不飘 4=固定飘分
        para.piaoFlag = para.piaoType == 4 ? getPiaoNum(this) : 0;
        para.qingZuiType = [1, 2][qinZuiIndex];                         //1=亲嘴0胡 2=亲嘴2胡
        para.isPenPenHuTwo = ppHu;                                      //true or false
        para.isZhaoGang6Xi = liuXi;                                     //招杠6息
        para.isSuanFenDieJia = [1, 2][suanFenIndex] == 1 ? true : false;                      //叠加算分

        this.getExtraSelectedPara(para);
        //cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShou_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShou_zhuang, zhuangIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShou_piao, piaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShou_qinZui, qinZuiIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShou_ppHu, ppHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShou_liuXi, liuXi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_FuLuShou_suanFen, suanFenIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_FuLuShou_piaoNum, para.piaoFlag);
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