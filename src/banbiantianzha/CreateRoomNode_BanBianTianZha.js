/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_BanBianTianZha = CreateRoomNode.extend({
    initAll:function()
    {
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_JIACHUI     = "BanBianTianZha_JiaChui";          //可锤
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_ZHUDOU       = "BanBianTianZha_ZhuDou";           //助陡
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_510K      = "BanBianTianZha_510K";           //正510K分花色
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_PAISHU       = "BanBianTianZha_PaiShu";           //牌数
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_4DAI3       = "BanBianTianZha_4Dai3";           //4带3
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoKQ       = "BanBianTianZha_FanBaoKQ";           //反包开枪
        this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoSJDC       = "BanBianTianZha_FanBaoSJDC";           //反包双进单出

        this.setExtraKey({
            jieSuanDiFen: "BanBianTianZha_JIE_SUAN_DI_FEN",  //少于X分大结算翻倍
        });

        this.roundNumObj = {roundNum1:8, roundNum2:12};

        this.bg_node = ccs.load("bg_banbiantianzha.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyLiuHuQiang");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        this.jiaChui = _play.getChildByName("jiachui");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.jiaChui.getChildByName("text"));
        this.jiaChui.addEventListener(this._clickCB.bind(this), this.jiaChui);

        this.zhuDou = _play.getChildByName("zhudou");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.zhuDou.getChildByName("text"));
        this.zhuDou.addEventListener(this._clickCB.bind(this), this.zhuDou);

        this.wuShiKHuaSe = _play.getChildByName("510Khuase");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.wuShiKHuaSe.getChildByName("text"));
        this.wuShiKHuaSe.addEventListener(this._clickCB.bind(this), this.wuShiKHuaSe);

        this.paiShu = _play.getChildByName("paishu");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.paiShu.getChildByName("text"));
        this.paiShu.addEventListener(this._clickCB.bind(this), this.paiShu);

        this.siDaiSan = _play.getChildByName("4dai3");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.siDaiSan.getChildByName("text"));
        this.siDaiSan.addEventListener(this._clickCB.bind(this), this.siDaiSan);

        this.fanBaoKQ = _play.getChildByName("fanBaoKQ");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.fanBaoKQ.getChildByName("text"));
        this.fanBaoKQ.addEventListener(this._clickCB.bind(this), this.fanBaoKQ);

        this.fanBaoSJDC = _play.getChildByName("fanBaoSJDC");
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.fanBaoSJDC.getChildByName("text"));
        this.fanBaoSJDC.addEventListener(this._clickCB.bind(this), this.fanBaoSJDC);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var isJiaChui;
        if(atClub){
            isJiaChui = this.getBoolItem("isJiaChui", true);
        }else{
            isJiaChui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_JIACHUI, true);
        }
        this.jiaChui.setSelected(isJiaChui);
        var text = this.jiaChui.getChildByName("text");
        var selectColor = MjClient.createRoomNode._selectColor;
        var unSelectColor = MjClient.createRoomNode._unSelectColor;
        if(isJiaChui){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isZhuDou;
        if(atClub){
            isZhuDou = this.getBoolItem("isZhuDou", false);
        }else{
            isZhuDou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_ZHUDOU, false);
        }
        this.zhuDou.setSelected(isZhuDou);
        var text = this.zhuDou.getChildByName("text");
        if(isZhuDou){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isWuShiKHuaSe;
        if(atClub){
            isWuShiKHuaSe = this.getBoolItem("isWuShiKHuaSe", true);
        }else{
            isWuShiKHuaSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_510K, true);
        }
        this.wuShiKHuaSe.setSelected(isWuShiKHuaSe);
        var text = this.wuShiKHuaSe.getChildByName("text");
        if(isWuShiKHuaSe){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isPaiShu;
        if(atClub){
            isPaiShu = this.getBoolItem("isPaiShu", true);
        }else{
            isPaiShu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_PAISHU, true);
        }
        this.paiShu.setSelected(isPaiShu);
        var text = this.paiShu.getChildByName("text");
        if(isPaiShu){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isSiDaiSan;
        if(atClub){
            isSiDaiSan = this.getBoolItem("isSiDaiSan", false);
        }else{
            isSiDaiSan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_4DAI3, false);
        }
        this.siDaiSan.setSelected(isSiDaiSan);
        var text = this.siDaiSan.getChildByName("text");
        if(isSiDaiSan){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isFanBaoKQ;
        if(atClub){
            isFanBaoKQ = this.getBoolItem("isFanBaoSuanKaiQiang", false);
        }else{
            isFanBaoKQ = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoKQ, false);
        }
        this.fanBaoKQ.setSelected(isFanBaoKQ);
        var text = this.fanBaoKQ.getChildByName("text");
        if(isFanBaoKQ){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        var isFanBaoSJDC;
        if(atClub){
            isFanBaoSJDC = this.getBoolItem("isFanBaoShuangJin", false);
        }else{
            isFanBaoSJDC = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoSJDC, false);
        }
        this.fanBaoSJDC.setSelected(isFanBaoSJDC);
        var text = this.fanBaoSJDC.getChildByName("text");
        if(isFanBaoSJDC){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

        this.setExtraPlayNodeCurrentSelect(atClub);

        this.updateSelectDiaNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.BAN_BIAN_TIAN_ZHA;
        para.maxPlayer = 3;//人数
        para.isJiaChui = this.jiaChui.isSelected();
        para.isZhuDou = this.zhuDou.isSelected();
        para.isWuShiKHuaSe = this.wuShiKHuaSe.isSelected();
        para.isPaiShu = this.paiShu.isSelected();
        para.isSiDaiSan = this.siDaiSan.isSelected();
        para.isFanBaoSuanKaiQiang = this.fanBaoKQ.isSelected();
        para.isFanBaoShuangJin = this.fanBaoSJDC.isSelected();

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_JIACHUI, para.isJiaChui);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_ZHUDOU, para.isZhuDou);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_510K, para.isWuShiKHuaSe);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_PAISHU, para.isPaiShu);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_4DAI3, para.isSiDaiSan);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoKQ, para.isFanBaoSuanKaiQiang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_BAN_BIAN_TIAN_ZHA_FanBaoSJDC, para.isFanBaoShuangJin);

        return para;
    },
    setDiaNumData:function(gameNode){
        this._super(gameNode);
        var para = this.getSelectedPara();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var roundNum = this.getSelectedRoundNum();
        var round = this.bg_node.getChildByName("round");
        //cc.log("chow", "updateSelectDiaNum" + " gameType = " + gameType + " maxPlayer = " + maxPlayer + " roundNum = " + roundNum);
        var payWay_1 = round.getChildByName("payWay_1").getChildByName("text");
        var payWay_2 = round.getChildByName("payWay_2").getChildByName("text");
        payWay_1.ignoreContentAdaptWithSize(true);
        payWay_2.ignoreContentAdaptWithSize(true);
        payWay_1.setString("房主出(" + this.getPrice(gameType, maxPlayer, roundNum, 0) + this._costName + ")");
        payWay_2.setString("AA(" + this.getPrice(gameType, maxPlayer, roundNum, 1) + this._costName + ")");
    }
});