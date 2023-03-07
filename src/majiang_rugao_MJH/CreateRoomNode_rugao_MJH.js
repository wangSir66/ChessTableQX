/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_rugao_MJH = CreateRoomNode.extend({
    setKeyByCardFriend:function(){
        this.localStorageKey.KEY_rugao_MJH_147_xiJiang    = "CF_RU_GAO_MJH_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugao_MJH_mengzigun      = "CF_RU_GAO_MJH_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugao_MJH_shuanglonghui  = "CF_RU_GAO_MJH_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugao_MJH_huimianchuhan  = "CF_RU_GAO_MJH_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugao_MJH_haidilaoyue    = "CF_RU_GAO_MJH_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugao_MJH_HU_COUNT       = "CF_RU_GAO_MJH_147_HU_COUNT"; //是满多少可以胡
        this.localStorageKey.KEY_rugao_MJH_tiehu          = "CF_RU_GAO_MJH_TIE_HU"; //贴胡
        this.localStorageKey.KEY_rugao_MJH_qitie          = "CF_RU_GAO_MJH_QI_TIE"; //起贴
        this.localStorageKey.KEY_rugao_MJH_tiehuCount     = "CF_RU_GAO_MJH_TIE_HU_COUNT"; //贴胡数
    },
    setKey:function(){
        this.localStorageKey.KEY_rugao_MJH_147_xiJiang    = "_RU_GAO_MJH_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugao_MJH_mengzigun      = "_RU_GAO_MJH_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugao_MJH_shuanglonghui  = "_RU_GAO_MJH_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugao_MJH_huimianchuhan  = "_RU_GAO_MJH_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugao_MJH_haidilaoyue    = "_RU_GAO_MJH_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugao_MJH_HU_COUNT       = "_RU_GAO_MJH_147_HU_COUNT"; //是满多少可以胡
        this.localStorageKey.KEY_rugao_MJH_tiehu          = "_RU_GAO_MJH_TIE_HU"; //贴胡
        this.localStorageKey.KEY_rugao_MJH_qitie          = "_RU_GAO_MJH_QI_TIE"; //起贴
        this.localStorageKey.KEY_rugao_MJH_tiehuCount     = "_RU_GAO_MJH_TIE_HU_COUNT"; //贴胡数
    },

    initAll: function(IsFriendCard) {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();



        this.bg_node = ccs.load("bg_rugao_MJH.json").node;

        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_rugao_MJH");

        //为适配拖动，先把节点获取到
        this._scrollview = this.bg_node.getChildByName("scrollview");
        this._scroll_play = this._scrollview.getChildByName("play");
        this._scroll_round = this._scrollview.getChildByName("round");
    },
    initRoundNode: function() {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode: function() {
        this._super();
        //花
        var _play = this._scroll_play;
        //增分
        //this._playNode_huanglonghui = _play.getChildByName("huanglonghui");
        //上限
        this._playNode_mengzigun = _play.getChildByName("mengzigun");
        this.addListenerText(this._playNode_mengzigun);
        this._playNode_mengzigun.addEventListener(this.clickCB, this._playNode_mengzigun);
        //胡数
        this._hu1 = _play.getChildByName("hu1");
        this._hu2 = _play.getChildByName("hu2");
        var nodeList = [];
        nodeList.push(_play.getChildByName("hu1"));
        nodeList.push(_play.getChildByName("hu2"));
        this._playNode_hu_radio = createRadioBoxForCheckBoxs(nodeList,this.radioBoxSelectCB);
        this.addListenerText(nodeList, this._playNode_hu_radio);

        //贴胡
        this._playNode_tiehu = _play.getChildByName("tiehu");
        this._playNode_tiehu.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.is_Tiehu();
                    break;
            }
        },this);
        this.addListenerText(this._playNode_tiehu,null,this.is_Tiehu.bind(this));


        //起贴
        this._playNode_100huqitie = _play.getChildByName("100huqitie");
        this._playNode_buxianzhi = _play.getChildByName("buxianzhi");
        var nodeQiTieList = [];
        nodeQiTieList.push(_play.getChildByName("100huqitie"));
        nodeQiTieList.push(_play.getChildByName("buxianzhi"));
        this._playNode_qitieList = createRadioBoxForCheckBoxs(nodeQiTieList, this.radioBoxSelectCB);
        this.addListenerText(nodeQiTieList, this._playNode_qitieList);

        //贴胡数
        this._playNode_tie20hu = _play.getChildByName("tie20hu");
        this._playNode_tie50hu = _play.getChildByName("tie50hu");
        var nodeTieHuList = [];
        nodeTieHuList.push(_play.getChildByName("tie20hu"));
        nodeTieHuList.push(_play.getChildByName("tie50hu"));
        this._playNode_tiehuList = createRadioBoxForCheckBoxs(nodeTieHuList, this.radioBoxSelectCB);
        this.addListenerText(nodeTieHuList, this._playNode_tiehuList);

    },
    setPlayNodeCurrentSelect: function() {
        this._super();
        var _hucount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_MJH_HU_COUNT, 80);
        var list = [];
        list.push(this._hu2);
        list.push(this._hu1);
        var index = _hucount === 100 ? 0 : 1;
        this._hu1.setSelected(_hucount != 100);
        this._hu2.setSelected(_hucount == 100);
        this.radioBoxSelectCB(index, list[index], list);

        var _mengziguan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_MJH_mengzigun, false);
        this._playNode_mengzigun.setSelected(_mengziguan);
        var text = this._playNode_mengzigun.getChildByName("text");
        this.selectedCB(text, _mengziguan);

        var _tiehu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_MJH_tiehu, false);
        this._playNode_tiehu.setSelected(_tiehu);
        var text = this._playNode_tiehu.getChildByName("text");
        this.selectedCB(text, _tiehu);
        this.is_Tiehu();

        var _qitie = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_MJH_qitie, 100);
        var list = [];
        list.push(this._playNode_100huqitie);
        list.push(this._playNode_buxianzhi);
        var index = _qitie == 100 ? 0 : 1;
        this._playNode_100huqitie.setSelected(index == 0);
        this._playNode_buxianzhi.setSelected(index == 1);
        this.radioBoxSelectCB(index, list[index], list);

        var _tiehuCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_MJH_tiehuCount, 20);
        var list = [];
        list.push(this._playNode_tie50hu);
        list.push(this._playNode_tie20hu);
        var index = _tiehuCount == 50? 0 : 1;
        this._playNode_tie50hu.setSelected(index == 0);
        this._playNode_tie20hu.setSelected(index == 1);
        this.radioBoxSelectCB(index, list[index], list);

    },
    is_Tiehu:function()
    {
        if(this._playNode_tiehu.isSelected()){
            this._playNode_tie20hu.setVisible(true);
            this._playNode_tie50hu.setVisible(true);
            this._playNode_100huqitie.setVisible(true);
            this._playNode_buxianzhi.setVisible(true);
        }else{
            this._playNode_tie20hu.setVisible(false);
            this._playNode_tie50hu.setVisible(false);
            this._playNode_100huqitie.setVisible(false);
            this._playNode_buxianzhi.setVisible(false);
        }
        var text = this._playNode_tiehu.getChildByName("text");
        this.selectedCB(text, this._playNode_tiehu.isSelected() == true);
    },
    getSelectedPara: function() {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.RU_GAO_MJH;
        para.maxPlayer = 3;
        //para.flowerType = WithFlowerType.noFlower;
        para.menzigun = false;
        para.shuanglonghui = true; //默认双龙会
        para.huimianchuhan = false;
        para.haidilaoyue = false;
        para.canHuCount = 80;

        //胡数
        para.canHuCount = this._hu1.isSelected() == true ? 80 : 100;
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_MJH_HU_COUNT, para.canHuCount);
        //闷子棍
        para.menzigun = this._playNode_mengzigun.isSelected() == true ? true : false;
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_MJH_mengzigun, para.menzigun);

        para.tiehu = this._playNode_tiehu.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_MJH_tiehu, para.tiehu);

        if(para.tiehu)
        {
            para.qitie = this._playNode_buxianzhi.isSelected() == true ? 0 : 100;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_MJH_qitie, para.qitie);

            para.tiehuCount = this._playNode_tie20hu.isSelected() == true ? 20 : 50;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_MJH_tiehuCount, para.tiehuCount);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});