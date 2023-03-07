/**
 * Created by maoyu on 2017/7/21.
 */

var CreateRoomNode_hongZeMaJiang = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_hongZeMaJiang_playerCount           =  "_hongZeMaJiang_COUNT_PLAYER";    //人数  
        this.localStorageKey.KEY_hongZeMaJiang_ziyou                 = "_hongZeMaJiang_ZIYOU";            //自由人数 
        this.localStorageKey.KEY_hongZeMaJiang_qinagGangHu           =  "_hongZeMaJiang_qiangGang";    //抢杠
        this.localStorageKey.KEY_hongZeMaJiang_notIncludeHongZhong   =  "_hongZeMaJiang_notIncludeHongZhong";    //带红中
        this.localStorageKey.KEY_hongZeMaJiang_qiDui                 =  "_hongZeMaJiang_qiDui";    //七对
        this.localStorageKey.KEY_hongZeMaJiang_maBuZhongQuanZhong    =  "_hongZeMaJiang_maBuZhongQuanZhong";    //码不中全中
        this.localStorageKey.KEY_hongZeMaJiang_zhuaMa                =  "_hongZeMaJiang_zhuaMa";    //抓码
        this.localStorageKey.KEY_hongZeMaJiang_jiesuan_difen         =  "_hongZeMaJiang_difen"; // 积分底分
    },
    
    initAll:function(IsFriendCard){
        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum2:8, roundNum3:16};

        var node = ccs.load("bg_hongZe.json").node;
        this.addChild(node);
        this.bg_node = node.getChildByName("bg_hongZe");
    },

    updateQiDui: function(){
        let isSeleBuDaiHongZhong = this._buDaiHongZhong.isSelected();
        if(!isSeleBuDaiHongZhong){
            this._qiDui.visible = false;
        }else{
            this._qiDui.visible = true;
        }
    },

    clickBuDaiHongZhong: function(sender,type){
        this._clickCB(sender, type);
        this.updateQiDui();
    },

    clickQiDui: function(sender,type){
        this._clickCB(sender, type);
    },

    initPlayNode:function(){
        var _bghongZeMaJiangNode = this.bg_node;
        var _play = _bghongZeMaJiangNode.getChildByName("play");

        this._playNode_Count_0 = _play.getChildByName("play_count0");
        this._playNode_Count_1 = _play.getChildByName("play_count1");
        this._playNode_Count_2 = _play.getChildByName("play_count2");
        this._playNode_Count_3 = _play.getChildByName("play_count3");
        var nodeListCount = [];
        nodeListCount.push( _play.getChildByName("play_count0"));
        nodeListCount.push( _play.getChildByName("play_count1"));
        nodeListCount.push( _play.getChildByName("play_count2"));
        nodeListCount.push( _play.getChildByName("play_count3"));
        this.initPlayNumNode(nodeListCount, [4, 3, 2, 4]);
        this._playNode_playerCount_radio = createRadioBoxForCheckBoxs(nodeListCount, this.radioBoxSelectCB.bind(this));
        this.addListenerText(nodeListCount, this._playNode_playerCount_radio, function (index,sender) {});
        this._countlist = nodeListCount;
        
        //抢杠胡
        this._qingGangHu = _play.getChildByName("keqianggang");
        this.addListenerText(this._qingGangHu);
        this._qingGangHu.addEventListener(this.clickCB.bind(this), this._qingGangHu);

        //不带红中
        this._buDaiHongZhong = _play.getChildByName("budaihongzhong");
        this.addListenerText(this._buDaiHongZhong, false, function(){
            this.updateQiDui();
        }.bind(this));
        this._buDaiHongZhong.addEventListener(this.clickBuDaiHongZhong.bind(this), this._buDaiHongZhong);
        
        //七对
        this._qiDui = _play.getChildByName("qidui");
        this.addListenerText(this._qiDui,false,function(){

        }.bind(this));
        this._qiDui.addEventListener(this.clickQiDui.bind(this), this._qiDui);

        //码不中当全中
        this._buZhongDangQuanZhong = _play.getChildByName("mabuzhongdangquanzhong");
        this.addListenerText(this._buZhongDangQuanZhong);
        this._buZhongDangQuanZhong.addEventListener(this.clickCB.bind(this), this._buZhongDangQuanZhong);

        //抓码
        var _round = _bghongZeMaJiangNode.getChildByName("round");
        this._roundNode_zhuaMa_0 = _round.getChildByName("zhuama_0");
        this._roundNode_zhuaMa_1 = _round.getChildByName("zhuama_1");
        this._roundNode_zhuaMa_2 = _round.getChildByName("zhuama_2");
        var nodeList1 = [];
        nodeList1.push(this._roundNode_zhuaMa_0);
        nodeList1.push(this._roundNode_zhuaMa_1);
        nodeList1.push(this._roundNode_zhuaMa_2);
        this._zhuaMa_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB.bind(this));
        this.addListenerText(nodeList1, this._zhuaMa_type_radio);
        this.zhuaMaList = nodeList1;

        //积分底分
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;
        
        let diFenNode = this.bg_node.getChildByName("difen");
        var score = diFenNode.getChildByName("txt_fen");
        var addBtn = diFenNode.getChildByName("btn_add");
        var subBtn = diFenNode.getChildByName("btn_sub");
        addBtn.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                score.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
            }
        }, this);

        subBtn.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                score.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
            }
        }, this);
        
        this.initExtraPlayNode(_play);
    },

    setPlayNodeCurrentSelect:function(isClub) {
        this._super();

        //人数
        var _maxPlayer;
        if (isClub) {
            if (this.getBoolItem("convertible", true)){
                _maxPlayer = 0;
            }
            else{
                _maxPlayer = this.getNumberItem("maxPlayer", 3);
            }
        }
        else{
            var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongZeMaJiang_ziyou,false);
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hongZeMaJiang_playerCount, 0);
            if(ziyou){
                _maxPlayer = 0;
            }
        }
        _maxPlayer = [4, 3, 2, 0].indexOf(_maxPlayer);
        this._playNode_playerCount_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, this._countlist[_maxPlayer], this._countlist);

        //抢杠
        var _qiangGang;
        if(isClub){
            _qiangGang = this.getBoolItem("canRob", true);
        }else {
            _qiangGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongZeMaJiang_qinagGangHu,true);
        }
        this._qingGangHu.setSelected(_qiangGang);
        var text = this._qingGangHu.getChildByName("text");
        this.selectedCB(text, _qiangGang);

        //不带红中
        var _notIncludeHongZhong;
        if(isClub){
            _notIncludeHongZhong = this.getBoolItem("buDaiHongZhong", true);
        }else {
            _notIncludeHongZhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongZeMaJiang_notIncludeHongZhong,true);
        }
        this._buDaiHongZhong.setSelected(_notIncludeHongZhong);
        var text = this._buDaiHongZhong.getChildByName("text");
        this.selectedCB(text, _notIncludeHongZhong);

        //七对
        var _qiDui;
        if(isClub){
            _qiDui = this.getBoolItem("isQiDui", false);
        }else {
            _qiDui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongZeMaJiang_qiDui,false);
        }
        this._qiDui.setSelected(_qiDui);
        var text = this._qiDui.getChildByName("text");
        this.selectedCB(text, _qiDui);
        this.updateQiDui();

        //码不中当全中
        var _buZhongDangQuanZhong;
        if(isClub){
            _buZhongDangQuanZhong = this.getBoolItem("mbzdqz", false);
        }else {
            _buZhongDangQuanZhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hongZeMaJiang_maBuZhongQuanZhong,false);
        }
        this._buZhongDangQuanZhong.setSelected(_qiDui);
        var text = this._buZhongDangQuanZhong.getChildByName("text");
        this.selectedCB(text, _buZhongDangQuanZhong);

        //抓码
        var _zhuaMa;
        if(isClub){
            _zhuaMa = this.getNumberItem("zhuaMaNum", 2);
        }else {
            _zhuaMa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hongZeMaJiang_zhuaMa,2);
        }
        _zhuaMa = [2, 4, 6].indexOf(_zhuaMa);
        this._zhuaMa_type_radio.selectItem(_zhuaMa);
        this.radioBoxSelectCB(_zhuaMa, this.zhuaMaList[_zhuaMa], this.zhuaMaList);

        // 积分底分
        var _jieSuanDiFen;
        if(isClub){
            _jieSuanDiFen = this.getNumberItem("difen", 1);
        }else {
            _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hongZeMaJiang_jiesuan_difen,1);
        }
        var score = this.bg_node.getChildByName("difen").getChildByName("txt_fen");
        this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
        score.setString(_jieSuanDiFen);
    },

    getSelectedPara:function(){
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HONG_ZE_MA_JIANG;
        var maxPlayerIndex = this._playNode_playerCount_radio.getSelectIndex();
        //人数
        para.maxPlayer = [4,3,2,4][maxPlayerIndex];
        para.convertible = maxPlayerIndex == 3;

        //可抢杠
        para.canRob = this._qingGangHu.isSelected();
        //不带红中
        para.buDaiHongZhong = this._buDaiHongZhong.isSelected();
        //七对
        para.isQiDui = para.buDaiHongZhong ? this._qiDui.isSelected() : false;
        //不中当全中
        para.mbzdqz = this._buZhongDangQuanZhong.isSelected();

        //抓码
        para.zhuaMaNum = [2,4,6][this._zhuaMa_type_radio.getSelectIndex()];
    
        //积分底分
        var score = this.bg_node.getChildByName("difen").getChildByName("txt_fen"); 
        para.difen = Number(score.getString());
        
        this.getExtraSelectedPara(para);

        this.savePara(para);
        return para;
    },

    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },

    changeAAPayForPlayerNum:function(){
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_huaihuaMaJiang();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay){ 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_huaihuaMaJiang();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_huaihuaMaJiang();
    },

    setDiaNumData_huaihuaMaJiang : function(){
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true); 
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

    savePara : function(para){
        if (!this._isFriendCard) {
            //人数
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hongZeMaJiang_playerCount, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongZeMaJiang_ziyou, para.convertible);
            //抢杠胡
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongZeMaJiang_qinagGangHu, para.canRob);
            //不带红中
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongZeMaJiang_notIncludeHongZhong, para.buDaiHongZhong);
            //七对
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongZeMaJiang_qiDui, this._qiDui.isSelected());
            //码不中当全中
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hongZeMaJiang_maBuZhongQuanZhong, para.mbzdqz);
            //抓码
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hongZeMaJiang_zhuaMa, para.zhuaMaNum);
            //底分
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hongZeMaJiang_jiesuan_difen, para.difen);
        }
    },
});