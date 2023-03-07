/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_daZhaDan = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';
        this.localStorageKey.KEY_daZhaDan_hasBaoPai = "_daZhaDanSY_hasBaoPai";   //可包牌
        this.localStorageKey.KEY_daZhaDan_isAllXiFen = "_daZhaDanSY_isAllXiFen";   //喜压死有分
        this.localStorageKey.KEY_daZhaDan_hasFiveXi = "_daZhaDanSY_hasFiveXi";   //5张算喜
        this.localStorageKey.KEY_daZhaDan_isShowLeft = "_daZhaDanSY_isShowLeft";   //显示剩余牌
        this.localStorageKey.KEY_daZhaDan_shunType = "_daZhaDanSY_shunType";   //2可做连子
        this.localStorageKey.KEY_daZhaDan_hasSanWangXi = "_daZhaDanSY_hasSanWangXi";   //三王算喜
        this.localStorageKey.KEY_daZhaDan_hasSanWangZha = "_daZhaDanSY_hasSanWangZha";   //三王算炸
        this.localStorageKey.KEY_daZhaDan_hasWings = "_daZhaDanSY_hasWings";   //允许三带二
        this.localStorageKey.KEY_daZhaDan_hasShun = "_daZhaDanSY_hasShun";   //可以单顺子
        this.localStorageKey.KEY_daZhaDan_isNo34 = "_daZhaDanSY_isNo34";   //是否去掉34
        this.localStorageKey.KEY_daZhaDan_isRandomTeam = "_daZhaDanSY_isRandomTeam";   //是否随机找队友

        this.setExtraKey({
            jieSuanDiFen: "_daZhaDanSY_JIE_SUAN_DI_FEN",  //积分底分
        });

        this.roundNumObj = {roundNum1:8, roundNum2:16};

        this.bgNode = ccs.load("bg_yueYangDaZhaDan.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        this.hasBaoPai = _play.getChildByName("hasBaoPai");
        this.hasBaoPai.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.hasBaoPai.getChildByName("text"));
        this.hasBaoPai.addEventListener(this._clickCB.bind(this), this.hasBaoPai);

        this.isAllXiFen = _play.getChildByName("hasBeatXiFen");
        cc.eventManager.addListener(this.setTextClick(),this.isAllXiFen.getChildByName("text"));
        this.isAllXiFen.addEventListener(this._clickCB.bind(this), this.isAllXiFen);

        this.hasFiveXi = _play.getChildByName("hasFiveXi");
        cc.eventManager.addListener(this.setTextClick(),this.hasFiveXi.getChildByName("text"));
        this.hasFiveXi.addEventListener(this._clickCB.bind(this), this.hasFiveXi);

        this.isShowLeft = _play.getChildByName("isShowLeft");
        cc.eventManager.addListener(this.setTextClick(),this.isShowLeft.getChildByName("text"));
        this.isShowLeft.addEventListener(this._clickCB.bind(this), this.isShowLeft);

        this.shunType = _play.getChildByName("shunType");
        cc.eventManager.addListener(this.setTextClick(),this.shunType.getChildByName("text"));
        this.shunType.addEventListener(this._clickCB.bind(this), this.shunType);

        this.hasSanWangXi = _play.getChildByName("hasSanWangXi");
        cc.eventManager.addListener(this.setTextClick(),this.hasSanWangXi.getChildByName("text"));
        this.hasSanWangXi.addEventListener(this._clickCB.bind(this), this.hasSanWangXi);

        this.hasSanWangZha = _play.getChildByName("hasSanWangZha");
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.checkSelect.bind(this)),this.hasSanWangZha.getChildByName("text"));
        this.hasSanWangZha.addEventListener(this._clickCB.bind(this), this.hasSanWangZha);

        this.hasWings = _play.getChildByName("hasWings");
        cc.eventManager.addListener(this.setTextClick(),this.hasWings.getChildByName("text"));
        this.hasWings.addEventListener(this._clickCB.bind(this), this.hasWings);

        this.hasShun = _play.getChildByName("hasShun");
        cc.eventManager.addListener(this.setTextClick(),this.hasShun.getChildByName("text"));
        this.hasShun.addEventListener(this._clickCB.bind(this), this.hasShun);

        this.isNo34 = _play.getChildByName("isNo34");
        cc.eventManager.addListener(this.setTextClick(),this.isNo34.getChildByName("text"));
        this.isNo34.addEventListener(this._clickCB.bind(this), this.isNo34);

        this.isRandomTeam = _play.getChildByName("isRandomTeam");
        cc.eventManager.addListener(this.setTextClick(),this.isRandomTeam.getChildByName("text"));
        this.isRandomTeam.getChildByName("text").ignoreContentAdaptWithSize(true);
        this.isRandomTeam.addEventListener(this._clickCB.bind(this), this.isRandomTeam);

        this.difenAry = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1];
        this.initExtraPlayNode(_play);
    },

    _clickCB : function(sender,type){
        this.checkSelect();
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
            this.hasSanWangXi.visible = this.hasSanWangZha.isSelected();
    },

    radioBoxSelectCB_daZhaDan : function(index,sender, list){
        this.radioBoxSelectCB(index,sender,list);
        this.checkSelect();
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _hasBaoPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasBaoPai, false);
        if (atClub){
            _hasBaoPai = this.getBoolItem("hasBaoPai", false);
        }
        this.hasBaoPai.setSelected(_hasBaoPai);
        var txt = this.hasBaoPai.getChildByName("text");
        txt.setTextColor(_hasBaoPai ? this._selectColor : this._unSelectColor);

        var _isAllXiFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_isAllXiFen, true);
        if (atClub){
            _isAllXiFen = this.getBoolItem("isAllXiFen", true);
        }
        this.isAllXiFen.setSelected(_isAllXiFen);
        var txt = this.isAllXiFen.getChildByName("text");
        txt.setTextColor(_isAllXiFen ? this._selectColor : this._unSelectColor);

        var _hasFiveXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasFiveXi, false);
        if (atClub){
            _hasFiveXi = this.getBoolItem("hasFiveXi", false);
        }
        this.hasFiveXi.setSelected(_hasFiveXi);
        var txt = this.hasFiveXi.getChildByName("text");
        txt.setTextColor(_hasFiveXi ? this._selectColor : this._unSelectColor);

        var _isShowLeft = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_isShowLeft, false);
        if (atClub){
            _isShowLeft = this.getBoolItem("isShowLeft", false);
        }
        this.isShowLeft.setSelected(_isShowLeft);
        var txt = this.isShowLeft.getChildByName("text");
        txt.setTextColor(_isShowLeft ? this._selectColor : this._unSelectColor);

        var _shunType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_shunType, false);
        if (atClub){
            _shunType = this.getBoolItem("shunType", false);
        }
        this.shunType.setSelected(_shunType);
        var txt = this.shunType.getChildByName("text");
        txt.setTextColor(_shunType ? this._selectColor : this._unSelectColor);

        var _hasSanWangXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasSanWangXi, false);
        if (atClub){
            _hasSanWangXi = this.getBoolItem("hasSanWangXi", false);
        }
        this.hasSanWangXi.setSelected(_hasSanWangXi);
        var txt = this.hasSanWangXi.getChildByName("text");
        txt.setTextColor(_hasSanWangXi ? this._selectColor : this._unSelectColor);

        var _hasSanWangZha = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasSanWangZha, true);
        if (atClub){
            _hasSanWangZha = this.getBoolItem("hasSanWangZha", true);
        }
        this.hasSanWangZha.setSelected(_hasSanWangZha);
        var txt = this.hasSanWangZha.getChildByName("text");
        txt.setTextColor(_hasSanWangZha ? this._selectColor : this._unSelectColor);

        var _hasWings = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasWings, true);
        if (atClub){
            _hasWings = this.getBoolItem("hasWings", true);
        }
        this.hasWings.setSelected(_hasWings);
        var txt = this.hasWings.getChildByName("text");
        txt.setTextColor(_hasWings ? this._selectColor : this._unSelectColor);

        var _hasShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_hasShun, false);
        if (atClub){
            _hasShun = this.getBoolItem("hasShun", false);
        }
        this.hasShun.setSelected(_hasShun);
        var txt = this.hasShun.getChildByName("text");
        txt.setTextColor(_hasShun ? this._selectColor : this._unSelectColor);

        var _isNo34 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_isNo34, false);
        if (atClub){
            _isNo34 = this.getBoolItem("isNo34", false);
        }
        this.isNo34.setSelected(_isNo34);
        var txt = this.isNo34.getChildByName("text");
        txt.setTextColor(_isNo34 ? this._selectColor : this._unSelectColor);

        var _isRandomTeam = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daZhaDan_isRandomTeam, false);
        if (atClub){
            _isRandomTeam = this.getBoolItem("isRandomTeam", false);
        }
        this.isRandomTeam.setSelected(_isRandomTeam);
        var txt = this.isRandomTeam.getChildByName("text");
        txt.setTextColor(_isRandomTeam ? this._selectColor : this._unSelectColor);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();

        this.checkSelect();
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_DA_ZHA_DAN;
        para.maxPlayer = 4;
        para.hasBaoPai = this.hasBaoPai.isSelected();
        para.isAllXiFen = this.isAllXiFen.isSelected();
        para.hasFiveXi = this.hasFiveXi.isSelected();
        para.isShowLeft = this.isShowLeft.isSelected();
        para.shunType = this.shunType.isSelected() ? 1 : 0;
        para.hasSanWangXi = this.hasSanWangXi.isSelected();
        para.hasSanWangZha = this.hasSanWangZha.isSelected();
        para.hasWings = this.hasWings.isSelected();
        para.hasShun = this.hasShun.isSelected();
        para.isNo34 = this.isNo34.isSelected();
        para.isRandomTeam = this.isRandomTeam.isSelected();

        if(!para.hasSanWangZha){
            para.hasSanWangXi = false;
        }
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
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasBaoPai, para.hasBaoPai);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_isAllXiFen, para.isAllXiFen);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasFiveXi, para.hasFiveXi);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_isShowLeft, para.isShowLeft);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_shunType, para.shunType == 1);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasSanWangXi, para.hasSanWangXi);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasSanWangZha, para.hasSanWangZha);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasWings, para.hasWings);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_hasShun, para.hasShun);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_isNo34, para.isNo34);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daZhaDan_isRandomTeam, para.isRandomTeam);
    },

    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    },

});