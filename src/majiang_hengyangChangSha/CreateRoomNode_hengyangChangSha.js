/**
 * Created by cyc on 2017/7/21.
 * 258麻将：配置地区有 衡阳、邵阳、旺旺 by cyc 20190823
 */


var CreateRoomNode_hengyangChangSha = CreateRoomNode.extend({
    // ctor: function(layer,IsFriendCard) { //构造函数在父类里面已经写了(子类没有多余的动作，最好就不要重写了),如果在子类里面继承就一定与父类保持一致(现在是已经修改好的，原来的是没有任何参数)，不然会出现不可预知的bug
    //     this._super(layer,IsFriendCard); 
    // },
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },

    setKey:function()
    {
        this.localStorageKey.KEY_CSMJ_maxPlayer     = "_HYCSMJ_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_CSMJ_zhuaNiaoType  = "_HYCSMJ_ZHUA_NIAO_TYPE";   //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuanNiaoNum  = "_HYCSMJ_ZHUA_NIAO_NUM";    //抓鸟
        this.localStorageKey.KEY_CSMJ_zhuangXianFeng= "_HYCSMJ_ZHUANG_XIAN_FENG"; //庄闲分
        // this.localStorageKey.KEY_CSMJ_buBuGao       = "_HYCSMJ_BU_BU_GAO";        //步步高
        // this.localStorageKey.KEY_CSMJ_jinTongYuNv   = "_HYCSMJ_JIN_TONG_YU_NV";   //金童玉女
        // this.localStorageKey.KEY_CSMJ_sanTong       = "_HYCSMJ_SAN_TONG";         //三同
        // this.localStorageKey.KEY_CSMJ_yiZhiHua      = "_HYCSMJ_YI_ZHI_HUA";       //一枝花
        this.localStorageKey.KEY_CSMJ_queYiSe       = "_HYCSMJ_queYiSe";          //缺一色
        this.localStorageKey.KEY_CSMJ_banBanHu      = "_HYCSMJ_banBanHu";         //板板胡
        this.localStorageKey.KEY_CSMJ_liuLiuShun    = "_HYCSMJ_liuLiuShun";       //六六顺
        this.localStorageKey.KEY_CSMJ_daSiXi        = "_HYCSMJ_daSiXi";           //大四喜
        this.localStorageKey.KEY_CSMJ_zhongTuCanAgain = "_HYCSMJ_zhongTuCanAgain";      //起手胡可胡多次（含中途）
        // this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun = "_HYCSMJ_ZHONG_TU_LIU_LIU_SHUN";    //中途六六顺
        // this.localStorageKey.KEY_CSMJ_zhongTuSiXi   = "_HYCSMJ_ZHONG_TU_SI_XI";   //中途四喜
        // this.localStorageKey.KEY_CSMJ_jiaJiangHu    = "_HYCSMJ_JIA_JIANG_HU";     //假将胡
        // this.localStorageKey.KEY_CSMJ_xianPiao      = "_HYCSMJ_XIAN_PIAO";        //选飘
        this.localStorageKey.KEY_CSMJ_menQingZiMo   = "_HYCSMJ_menQingZiMo";      //门清自摸
        this.localStorageKey.KEY_CSMJ_quanQiuRenSifangBaoPei = "_CSMJ_quanQiuRenSifangBaoPei";  //全球人四放包赔
        // this.localStorageKey.KEY_CSMJ_fengDing      = "_HYCSMJ_fengDing";         //封顶（21分、42分）
        this.localStorageKey.KEY_CSMJ_difen         = "_HYCSMJ_difen";            //底分
        this.localStorageKey.KEY_CSMJ_fanbei                    = "_CSMJ_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_CSMJ_fanbeiscore              = "_CSMJ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_CSMJ_zuoZhuang                     = "_HYCSMJ_ZUO_ZHUANG";     //0 随机， 1 先进来
    },
    initAll:function(IsFriendCard)
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }

        if (!IsFriendCard)
            this.setKey();

        this.roundNumObj = {roundNum1:8,roundNum2:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
            this.bg_node = ccs.load("bg_258mj.json").node;
        else
            this.bg_node = ccs.load("bg_changSha.json").node;

        this.addChild(this.bg_node);
        var bg_node = this.bg_node.getChildByName("bg_changSha").getChildByName("view");
        if(!bg_node) 
            bg_node = this.bg_node.getChildByName("bg_changSha");
        this.bg_node = bg_node;
        bg_node.jumpToTop();

       this.initNewView();
    },
    initNewView:function()
    {
    },
    ConfigurationWidget:function(obj)
    {
        obj.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),obj.getChildByName("text"));
        obj.addEventListener(this._clickCB, obj)
    },
    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color("#d21400");
                    var unSelectColor = cc.color("#255662");
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                        selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                        unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
                    }
                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
    },
    selectedCB: function(text, isSelected) {
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        if(isSelected){
            text.setTextColor(selectColor);
        }else{
            text.setTextColor(unSelectColor);
        }

    },
    initPlayNode:function()
    {
        
        var _play = this.bg_node.getChildByName("play");
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio),maxPlayerList[1].getChildByName("text"));
		cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio),maxPlayerList[2].getChildByName("text"));
        this.maxPlayerList = maxPlayerList

        //中鸟加分/加倍
        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
		zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,0,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,1,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,2,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[2].getChildByName("text"));
        this.zhuaNiaoTypeList = zhuaNiaoTypeList
        var that = this;
        var niaoTypIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();
        this.schedule(function(sender,type)
        {
            var index = that.zhuaNiaoTypeList_radio.getSelectIndex();
            if (niaoTypIndex != index) {
                that.refreshZhuaNiao()
                niaoTypIndex = index;
            }
        }, 0.1);

        //抓几鸟
        var zhuaNiaoNumList = [];
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum1"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum2"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum4"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum6"));
        zhuaNiaoNumList.push(_play.getChildByName("zhuaniaoNum3"));
        this.zhuaNiaoNumList_radio = createRadioBoxForCheckBoxs(zhuaNiaoNumList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoNumList,0,this.zhuaNiaoNumList_radio),zhuaNiaoNumList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoNumList,1,this.zhuaNiaoNumList_radio),zhuaNiaoNumList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoNumList,2,this.zhuaNiaoNumList_radio),zhuaNiaoNumList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoNumList,3,this.zhuaNiaoNumList_radio),zhuaNiaoNumList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoNumList,4,this.zhuaNiaoNumList_radio),zhuaNiaoNumList[4].getChildByName("text"));
        this.zhuaNiaoNumList = zhuaNiaoNumList

        // ---------------- 胡法 ---------------------
        
        //庄闲分
        this.zhuangXianFeng = _play.getChildByName("zhuangXianFeng");
        this.ConfigurationWidget(this.zhuangXianFeng);

        //步步高
        // this.buBuGao        = _play.getChildByName("buBuGao");
        // this.ConfigurationWidget(this.buBuGao);

        //金童玉女
        // this.jinTongYuNv    = _play.getChildByName("jinTongYuNv");
        // this.ConfigurationWidget(this.jinTongYuNv);

        //三同
        // this.sanTong        = _play.getChildByName("sanTong");
        // this.ConfigurationWidget(this.sanTong);

        //一枝花
        // this.yiZhiHua       = _play.getChildByName("yiZhiHua");
        // this.ConfigurationWidget(this.yiZhiHua);
        
        // 缺一色
        this.queYiSe       = _play.getChildByName("queYiSe");
        this.ConfigurationWidget(this.queYiSe);

        // 板板胡
        this.banBanHu       = _play.getChildByName("banBanHu");
        this.ConfigurationWidget(this.banBanHu);

        // 六六顺
        this.liuLiuShun       = _play.getChildByName("liuLiuShun");
        this.ConfigurationWidget(this.liuLiuShun);

        // 大四喜
        this.daSiXi       = _play.getChildByName("daSiXi");
        this.ConfigurationWidget(this.daSiXi);

        // 中途可胡多次
        this.zhongTuCanAgain       = _play.getChildByName("zhongTuCanAgain");
        this.ConfigurationWidget(this.zhongTuCanAgain);
        
        //中途六六顺
        // this.zhongTuLiuLiuShun  = _play.getChildByName("zhongTuLiuLiuShun");
        // this.ConfigurationWidget(this.zhongTuLiuLiuShun);

        //中途四喜
        // this.zhongTuSiXi    = _play.getChildByName("zhongTuSiXi");
        // this.ConfigurationWidget(this.zhongTuSiXi);

        //假将胡
        // this.jiaJiangHu     = _play.getChildByName("jiaJiangHu");
        // this.ConfigurationWidget(this.jiaJiangHu);

        //选飘
        // this.xianPiao       = _play.getChildByName("xianPiao");
        // this.ConfigurationWidget(this.xianPiao);
		
        this.menQingZiMo    = _play.getChildByName("menQingZiMo");
        this.ConfigurationWidget(this.menQingZiMo);
		
        this.quanQiuRenSifangBaoPei    = _play.getChildByName("quanQiuRenSifangBaoPei");
        this.ConfigurationWidget(this.quanQiuRenSifangBaoPei);

        //坐庄
        this._zuozhuang_1 = _play.getChildByName("zuoZhuang_1");
        this._zuozhuang_2 = _play.getChildByName("zuoZhuang_2");
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var zuoZhuangList = [this._zuozhuang_2, this._zuozhuang_1];
            this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
            this.addListenerText(zuoZhuangList, this.zuoZhuang_radio);
        }

        // var fengDingList = [];
        // fengDingList.push(_play.getChildByName("fengDing21"));
        // fengDingList.push(_play.getChildByName("fengDing42"));
        // this.fengDingList_radio = createRadioBoxForCheckBoxsHuChi(fengDingList, function(index) {
        //     for (var i = 0; i < fengDingList.length; i++) {
        //         this.radioTextColor(fengDingList[i].getChildByName("text"), fengDingList[i].isSelected());
        //     }
        // }.bind(this));
        // for (var i = 0; i < fengDingList.length; i++) {
        //     var func = function(index) {
        //         this.addListenerText(fengDingList[index], null, function() {
        //             this.fengDingList_radio.selectItem(fengDingList[index].isSelected() ? index : -1);
        //             for (var i = 0; i < fengDingList.length; i++) {
        //                 this.selectedCB(fengDingList[i].getChildByName("text"), fengDingList[i].isSelected());
        //             }
        //         }.bind(this));
        //     }.bind(this);
        //     func(i);
        // }
        // this.fengDingList = fengDingList;

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            //托管
            this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
            this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
            this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
            this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
            this._playNode_tuoguanType_4 = _play.getChildByName("tuoguan4");
            var tuoguanNodeList = [];
            tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
            tuoguanNodeList.push(_play.getChildByName("tuoguan4"));
            this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
            this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
            this.tuoguanNodeList = tuoguanNodeList;

            var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
            var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
            btn_tuoguanTip.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    image_tuoguanTip.setVisible(true);
                }
            }, btn_tuoguanTip);
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                status: null,
                onTouchBegan: function (touch, event) {
                    if (image_tuoguanTip.isVisible()) {
                        image_tuoguanTip.setVisible(false);
                        return true;
                    } else {
                        return false;
                    }
                },
            }, image_tuoguanTip);
        }
        

        this.zhuaNiaoNumPoints = [];
        this.zhuaNiaoNumPoints[0] = zhuaNiaoNumList[0].getPosition();
        this.zhuaNiaoNumPoints[1] = zhuaNiaoNumList[1].getPosition();
        this.zhuaNiaoNumPoints[2] = zhuaNiaoNumList[2].getPosition();
        this.zhuaNiaoNumPoints[3] = zhuaNiaoNumList[3].getPosition();

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;
        
        this._zhuIdx = 1;

        this.addNode = this.bg_node;
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
        {
            this.addNode = this.bg_node.getParent();
        }

        this._ZhuNum = this.addNode.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.addNode.getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                }
            }, this);
            this._Button_add = this.addNode.getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                }
            }, this);
        }
        this.initExtraPlayNode(_play);
    },
    refreshZhuaNiao:function()
    {
        cc.log(" ========== refreshZhuaNiao ======")
        var zhuaNiaoNumList = this.zhuaNiaoNumList;
        var points = this.zhuaNiaoNumPoints;
        if (this.zhuaNiaoTypeList_radio.getSelectIndex() == 0)
        {
            zhuaNiaoNumList[0].setVisible(false);
            zhuaNiaoNumList[1].setVisible(true);
            zhuaNiaoNumList[2].setVisible(true);
            zhuaNiaoNumList[3].setVisible(true);
            zhuaNiaoNumList[4].setVisible(false);
            zhuaNiaoNumList[1].setPosition(points[0]);
            zhuaNiaoNumList[2].setPosition(points[1]);
            zhuaNiaoNumList[3].setPosition(points[2]);

            if (this.zhuaNiaoNumList_radio.getSelectIndex() == 0 || this.zhuaNiaoNumList_radio.getSelectIndex() == 4){
                this.zhuaNiaoNumList_radio.selectItem(1);
                this.radioBoxSelectCB(1,this.zhuaNiaoNumList[1],this.zhuaNiaoNumList);
            }
        }
        else if (this.zhuaNiaoTypeList_radio.getSelectIndex() == 1)
        {
            zhuaNiaoNumList[0].setVisible(true);
            zhuaNiaoNumList[1].setVisible(true);
            zhuaNiaoNumList[2].setVisible(false);
            zhuaNiaoNumList[3].setVisible(false);
            zhuaNiaoNumList[4].setVisible(true);
            zhuaNiaoNumList[0].setPosition(points[0]);
            zhuaNiaoNumList[1].setPosition(points[1]);
            zhuaNiaoNumList[4].setPosition(points[2]);

            if (this.zhuaNiaoNumList_radio.getSelectIndex() != 0 && this.zhuaNiaoNumList_radio.getSelectIndex() != 1 && 
                this.zhuaNiaoNumList_radio.getSelectIndex() != 4) {
                this.zhuaNiaoNumList_radio.selectItem(0);
                this.radioBoxSelectCB(0,this.zhuaNiaoNumList[0],this.zhuaNiaoNumList);
            }
        }
        else {
            zhuaNiaoNumList[0].setVisible(false);
            zhuaNiaoNumList[1].setVisible(false);
            zhuaNiaoNumList[2].setVisible(false);
            zhuaNiaoNumList[3].setVisible(false);
            zhuaNiaoNumList[4].setVisible(false);
        }

    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var maxPlayer;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                maxPlayer = 3;
            else
                maxPlayer = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else {
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer,this.maxPlayerList[maxPlayer],this.maxPlayerList);

        var zhuaNiaoType;
        if (isClub)
            zhuaNiaoType = this.getNumberItem("zhuaNiaoType", 0);
        else
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoType, 0);
        this.zhuaNiaoTypeList_radio.selectItem(zhuaNiaoType);
        this.radioBoxSelectCB(zhuaNiaoType,this.zhuaNiaoTypeList[zhuaNiaoType],this.zhuaNiaoTypeList);

        var zhuanNiaoNum;
        if (isClub)
            zhuanNiaoNum = this.getNumberItem("zhuaNiaoNum", 0);
        else
            zhuanNiaoNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zhuanNiaoNum, 0);
        this.zhuaNiaoNumList_radio.selectItem(zhuanNiaoNum);
        this.radioBoxSelectCB(zhuanNiaoNum,this.zhuaNiaoNumList[zhuanNiaoNum],this.zhuaNiaoNumList);

        var zhuangXianFeng;
        if (isClub)
            zhuangXianFeng = this.getBoolItem("zhuangXianFeng", true);
        else
            zhuangXianFeng = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhuangXianFeng, true);
        this.zhuangXianFeng.setSelected(zhuangXianFeng);
        var text = this.zhuangXianFeng.getChildByName("text");
        this.selectedCB(text,zhuangXianFeng)

        // var buBuGao;
        // if (isClub)
        //     buBuGao = this.getBoolItem("buBuGao", false);
        // else 
        //     buBuGao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_buBuGao, false);
        // this.buBuGao.setSelected(buBuGao);
        // var text = this.buBuGao.getChildByName("text");
        // this.selectedCB(text,buBuGao)

        // var jinTongYuNv;
        // if (isClub)
        //     jinTongYuNv = this.getBoolItem("jinTongYuNv", false);
        // else
        //     jinTongYuNv = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_jinTongYuNv, false);
        // this.jinTongYuNv.setSelected(jinTongYuNv);
        // var text = this.jinTongYuNv.getChildByName("text");
        // this.selectedCB(text,jinTongYuNv)

        // var sanTong;
        // if (isClub)
        //     sanTong = this.getBoolItem("sanTong", false);
        // else 
        //     sanTong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_sanTong, false);
        // this.sanTong.setSelected(sanTong);
        // var text = this.sanTong.getChildByName("text");
        // this.selectedCB(text,sanTong)
        
        // var yiZhiHua;
        // if (isClub)
        //     yiZhiHua = this.getBoolItem("yiZhiHua", false);
        // else 
        //     yiZhiHua = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_yiZhiHua, false);
        // this.yiZhiHua.setSelected(yiZhiHua);
        // var text = this.yiZhiHua.getChildByName("text");
        // this.selectedCB(text,yiZhiHua)

        var queYiSe;
        if (isClub)
            queYiSe = this.getBoolItem("queYiSe", true);
        else
            queYiSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_queYiSe, true);
        this.queYiSe.setSelected(queYiSe);
        var text = this.queYiSe.getChildByName("text");
        this.selectedCB(text,queYiSe);

        var banBanHu;
        if (isClub)
            banBanHu = this.getBoolItem("banBanHu", true);
        else
            banBanHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_banBanHu, true);
        this.banBanHu.setSelected(banBanHu);
        var text = this.banBanHu.getChildByName("text");
        this.selectedCB(text,banBanHu);

        var liuLiuShun;
        if (isClub)
            liuLiuShun = this.getBoolItem("liuLiuShun", true);
        else
            liuLiuShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_liuLiuShun, true);
        this.liuLiuShun.setSelected(liuLiuShun);
        var text = this.liuLiuShun.getChildByName("text");
        this.selectedCB(text,liuLiuShun);

        var daSiXi;
        if (isClub)
            daSiXi = this.getBoolItem("daSiXi", true);
        else
            daSiXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_daSiXi, true);
        this.daSiXi.setSelected(daSiXi);
        var text = this.daSiXi.getChildByName("text");
        this.selectedCB(text,daSiXi);

        var zhongTuCanAgain;    
        if (isClub)
            zhongTuCanAgain = this.getBoolItem("zhongTuCanAgain", true);
        else
            zhongTuCanAgain = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuCanAgain, true);
        this.zhongTuCanAgain.setSelected(zhongTuCanAgain);
        var text = this.zhongTuCanAgain.getChildByName("text");
        this.selectedCB(text,zhongTuCanAgain);
        
        // var zhongTuLiuLiuShun;
        // if (isClub)
        //     zhongTuLiuLiuShun = this.getBoolItem("zhongTuLiuLiuShun", false);
        // else
        //     zhongTuLiuLiuShun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun, false);
        // this.zhongTuLiuLiuShun.setSelected(zhongTuLiuLiuShun);
        // var text = this.zhongTuLiuLiuShun.getChildByName("text");
        // this.selectedCB(text,zhongTuLiuLiuShun)
        
        // var zhongTuSiXi;
        // if (isClub)
        //     zhongTuSiXi = this.getBoolItem("zhongTuSiXi", false);
        // else
        //     zhongTuSiXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuSiXi, false);
        // this.zhongTuSiXi.setSelected(zhongTuSiXi);
        // var text = this.zhongTuSiXi.getChildByName("text");
        // this.selectedCB(text,zhongTuSiXi)

        // var jiaJiangHu;
        // if (isClub)
        //     jiaJiangHu = this.getBoolItem("jiaJiangHu", false);
        // else
        //     jiaJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_jiaJiangHu, false);
        // this.jiaJiangHu.setSelected(jiaJiangHu);
        // var text = this.jiaJiangHu.getChildByName("text");
        // this.selectedCB(text,jiaJiangHu)

        // var xianPiao;
        // if (isClub)
        //     xianPiao = this.getBoolItem("xianPiao", false);
        // else
        //     xianPiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_xianPiao, false);
        // this.xianPiao.setSelected(xianPiao);
        // var text = this.xianPiao.getChildByName("text");
        // this.selectedCB(text,xianPiao)

        var menQingZiMo;
        if (isClub)
            menQingZiMo = this.getBoolItem("menQingZiMo", true);
        else
            menQingZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_menQingZiMo, true);
        this.menQingZiMo.setSelected(menQingZiMo);
        var text = this.menQingZiMo.getChildByName("text");
        this.selectedCB(text, menQingZiMo);

        var quanQiuRenSifangBaoPei;
        if (isClub)
            quanQiuRenSifangBaoPei = this.getBoolItem("quanQiuRenSifangBaoPei", false);
        else
            quanQiuRenSifangBaoPei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_CSMJ_quanQiuRenSifangBaoPei, false);
        this.quanQiuRenSifangBaoPei.setSelected(quanQiuRenSifangBaoPei);
        var text = this.quanQiuRenSifangBaoPei.getChildByName("text");
        this.selectedCB(text, quanQiuRenSifangBaoPei);

        var _zuoZhuang;
        if (isClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 1);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_zuoZhuang, 1);
        }
        if (this._zuozhuang_1 && this._zuozhuang_2) {
            var list = [this._zuozhuang_2, this._zuozhuang_1];
            this.zuoZhuang_radio.selectItem(_zuoZhuang);
            this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);
        }
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            //托管
            var _trustTime;
            if (isClub)
                _trustTime = this.getNumberItem("trustTime", 0);
            else
                _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_tuoguan, 0);
            this._playNode_tuoguanType_0.setSelected(false);
            this._playNode_tuoguanType_1.setSelected(false);
            this._playNode_tuoguanType_2.setSelected(false);
            this._playNode_tuoguanType_3.setSelected(false);
            var index = 0;
            if (_trustTime == 0) {
                this._playNode_tuoguanType_0.setSelected(true);
                index = 0;
            } else if (_trustTime == 60) {
                this._playNode_tuoguanType_1.setSelected(true);
                index = 1;
            } else if (_trustTime == 120) {
                this._playNode_tuoguanType_2.setSelected(true);
                index = 2;
            } else if (_trustTime == 180) {
                this._playNode_tuoguanType_3.setSelected(true);
                index = 3;
            } else if (_trustTime == 300) {
                this._playNode_tuoguanType_4.setSelected(true);
                index = 4;
            }
            this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);
        }
        

        // var fengDing;
        // if (isClub)
        //     fengDing = this.getNumberItem("fengDing", -1);
        // else
        //     fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fengDing, -1);
        // this.fengDingList_radio.selectItem(fengDing);
        // for (var i = 0; i < this.fengDingList.length; i ++) {
        //     var text = this.fengDingList[i].getChildByName("text");
        //     this.selectedCB(text, i == fengDing);
        // }

        if (isClub)
            this._zhuIdx = this.getNumberItem("changsha_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_difen, 1);
        if (this._ZhuNum){
            this._ZhuNum.setString(this._zhuIdx + "");
        }
        this.difenIndex = this.difenAry.indexOf(this._zhuIdx);
        this.refreshZhuaNiao();

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_CSMJ_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

       

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HENG_YANG_CHANG_SHA;
        para.maxPlayer = [4, 3, 2, 4][this.maxPlayerList_radio.getSelectIndex()];     // 人数
        para.convertible = this.maxPlayerList_radio.getSelectIndex() == 3;	// 自由人数
        para.zhuaNiaoType = this.zhuaNiaoTypeList_radio.getSelectIndex();   // 抓鸟类型 0:抓鸟加分 1:抓鸟加倍 2:不抓鸟
        para.zhuaNiaoNum = this.zhuaNiaoNumList_radio.getSelectIndex(); // 抓鸟数量 int

        para.zhuangXianFeng = this.zhuangXianFeng.isSelected(); // 是否有庄闲分
        // para.buBuGao        = this.buBuGao.isSelected();    // 是否有步步高
        // para.jinTongYuNv    = this.jinTongYuNv.isSelected();    // 是否有金童玉女
        // para.sanTong        = this.sanTong.isSelected();    // 是否有三同
        // para.yiZhiHua       = this.yiZhiHua.isSelected();   // 是否有一枝花
        para.queYiSe        = this.queYiSe.isSelected(); // 是否有缺一色
        para.banBanHu       = this.banBanHu.isSelected(); // 是否有板板胡
        para.liuLiuShun     = this.liuLiuShun.isSelected(); // 是否有六六顺
        para.daSiXi         = this.daSiXi.isSelected(); // 是否有大四喜
        // para.zhongTuLiuLiuShun = this.zhongTuLiuLiuShun.isSelected();   // 是否有中途六六顺
        // para.zhongTuSiXi    = this.zhongTuSiXi.isSelected();    // 是否有中途四喜
        // para.jiaJiangHu     = this.jiaJiangHu.isSelected(); // 是否有假将胡
        para.zhongTuCanAgain= this.zhongTuCanAgain.isSelected(); // 起手胡可胡多次（含中途）
        // para.xianPiao       = this.xianPiao.isSelected();   // 是否选择飘分
        para.menQingZiMo    = this.menQingZiMo.isSelected();// 门清自摸
        para.quanQiuRenSifangBaoPei = this.quanQiuRenSifangBaoPei.isSelected();// 全球人四放包赔
        // para.fengDing       = this.fengDingList_radio.getSelectIndex();// 封顶（21分、42分)
        para.changsha_difen = this._zhuIdx; //底分

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            if (this._playNode_tuoguanType_0.isSelected()) {
                para.trustTime = 0;
            } else if (this._playNode_tuoguanType_1.isSelected()) {
                para.trustTime = 60;
            } else if (this._playNode_tuoguanType_2.isSelected()) {
                para.trustTime = 120;
            } else if (this._playNode_tuoguanType_3.isSelected()) {
                para.trustTime = 180;
            } else if (this._playNode_tuoguanType_4.isSelected()) {
                para.trustTime = 300;
            }
        }
        
        

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (this.zuoZhuang_radio) {
            para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 房主
        }

        cc.log("createara: " + JSON.stringify(para));

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zhuaNiaoType, para.zhuaNiaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zhuanNiaoNum, para.zhuaNiaoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_difen, para.changsha_difen);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhuangXianFeng, para.zhuangXianFeng);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_buBuGao, para.buBuGao);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_jinTongYuNv, para.jinTongYuNv);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_sanTong, para.sanTong);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_yiZhiHua, para.yiZhiHua);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_queYiSe, para.queYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_banBanHu, para.banBanHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_liuLiuShun, para.liuLiuShun);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_daSiXi, para.daSiXi);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuLiuLiuShun, para.zhongTuLiuLiuShun);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuSiXi, para.zhongTuSiXi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_zhongTuCanAgain, para.zhongTuCanAgain);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_jiaJiangHu, para.jiaJiangHu);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_xianPiao, para.xianPiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_menQingZiMo, para.menQingZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_CSMJ_quanQiuRenSifangBaoPei, para.quanQiuRenSifangBaoPei);
            // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fengDing, para.fengDing);

            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_fanbeiscore, para.fanBeiScore);
            }

            if (this.zuoZhuang_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_CSMJ_zuoZhuang, para.zuoZhuang);
            }
        }

        return para;
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
                selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
                unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
            }
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
    }

});