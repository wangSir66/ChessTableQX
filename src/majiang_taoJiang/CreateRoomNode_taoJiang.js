/**
 * Created by cyc on 2017/7/21.
 */


var CreateRoomNode_taoJiang = CreateRoomNode.extend({
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
        this.localStorageKey.KEY_taoJiang_maxPlayer     = "_TJMJ_MAX_PLAYER";      //几人玩
        this.localStorageKey.KEY_taoJiang_zhuaNiaoType  = "_TJMJ_ZHUA_NIAO_TYPE";  //抓鸟个数
        this.localStorageKey.KEY_taoJiang_niaoType      = "_TJMJ_NIAO_TYPE";       //抓鸟类型
        this.localStorageKey.KEY_taoJiang_zhongNiaoType = "_TJMJ_ZHONG_NIAO_TYPE"; //中鸟算分类型
        this.localStorageKey.KEY_taoJiang_ganghoupao    = "_TJMJ_GANG_PAO";        //杠后炮加杠上花
        this.localStorageKey.KEY_taoJiang_baoting       = "_TJMJ_BAO_TING";        //报听
        this.localStorageKey.KEY_taoJiang_canchi        = "_TJMJ_CAN_CHI";         //可以吃
        this.localStorageKey.KEY_taoJiang_haohuaqidui   = "_TJMJ_HAO_HUA_QI_DUI";  //豪华七对
        this.localStorageKey.KEY_taoJiang_liupai        = "_TJMJ_LIU_PAI";         //留牌
        this.localStorageKey.KEY_taoJiang_zimohu        = "_TJMJ_ZI_MO_HU";        //自摸胡
        this.localStorageKey.KEY_taoJiang_kaigangsan    = "_TJMJ_KAI_GANG_SAN";    //杠后3张牌
        this.localStorageKey.KEY_taoJiang_gangtianhu    = "_TJMJ_GANG_TIAN_HU";    //天胡可抢杠
        this.localStorageKey.KEY_taoJiang_daJinDaChu    = "_TJMJ_DA_JIN_DA_HU";    //大进大出
        this.localStorageKey.KEY_taoJiang_paohuAndzimo  = "_TJMJ_paohuAndzimo";    //炮胡和自摸
        this.localStorageKey.KEY_taoJiang_isOpenTingTip = "_TJMJ_isOpenTingTip";   //是否开启听牌提示
        this.localStorageKey.KEY_taoJiang_difen         = "_TJMJ_DI_FEN";          //底分
        this.localStorageKey.KEY_taoJiang_tuoguan       = "_TJMJ_TUO_GUAN";        //托管
        this.localStorageKey.KEY_taoJiang_qingyiseqidui = "_QING_YI_SE_QI_DUI";    //清一色七对
        this.localStorageKey.KEY_taoJiang_jiangjianghuqidui	= "_JIANG_JIANG_HU_QI_DUI";        //将将胡七对

        this.localStorageKey.KEY_taoJiang_FAN_BEI       = "_TJMJ_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_taoJiang_FAN_BEI_SCORE = "_TJMJ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_taoJiang_fengDing      = "_TJMJ_FENG_DING";    //封顶
        this.localStorageKey.KEY_taoJiang_guoHuKeQiangGang      = "_TJMJ_GUO_HU_KE_QIANG_GANG";   //过胡可抢杠
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_taojiangmajiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_taojiangmajiang").getChildByName("view");
    },
    initPlayNode:function()
    {
        
        var _play = this.bg_node.getChildByName("play");

        this._playNode_maxPlayer0 = _play.getChildByName("maxPlayer4");
        this._playNode_maxPlayer1 = _play.getChildByName("maxPlayer3");
        this._playNode_maxPlayer2 = _play.getChildByName("maxPlayer2");
        this._playNode_maxPlayer3 = _play.getChildByName("maxPlayer0"); // 自由人数
        //几人玩
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        maxPlayerList.push(_play.getChildByName("maxPlayer0"));
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, function(index) {
            this.niaoTypeForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4]);
		cc.log("   1");
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.niaoTypeForPlayerNum.bind(this));
        this.maxPlayerList = maxPlayerList;

        //抓鸟
        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        var self = this;
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,zhuaNiaoTypeList[index],zhuaNiaoTypeList);
        });
        cc.log("   2");
        this.addListenerText(zhuaNiaoTypeList,this.zhuaNiaoTypeList_radio);
        this.zhuaNiaoTypeList = zhuaNiaoTypeList;

        //中鸟算分类型
        var zhongNiaoTypeList = [];
        zhongNiaoTypeList.push(_play.getChildByName("zhongniaofanfan"));
        zhongNiaoTypeList.push(_play.getChildByName("zhongniaojiabei"));
        var self = this;
        this.zhongNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhongNiaoTypeList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,zhongNiaoTypeList[index],zhongNiaoTypeList);
        });
        cc.log("   3");
        this.addListenerText(zhongNiaoTypeList,this.zhongNiaoTypeList_radio);
        this.zhongNiaoTypeList = zhongNiaoTypeList;

        //抓鸟类型
        var niaoTypeList = [];
        niaoTypeList.push(_play.getChildByName("niaoType1"));
        niaoTypeList.push(_play.getChildByName("niaoType2"));
        niaoTypeList.push(_play.getChildByName("niaoType3"));
        var self = this;
        this.niaoTypeList_radio = createRadioBoxForCheckBoxs(niaoTypeList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,niaoTypeList[index],niaoTypeList);
        });
        cc.log("   4");
        this.addListenerText(niaoTypeList,this.niaoTypeList_radio);
        this.niaoTypeList = niaoTypeList;

        //报听
        this._play_baoting = _play.getChildByName("baoting");
        cc.log("   5");
        this.addListenerText(this._play_baoting);
        this._play_baoting.addEventListener(this.clickCB, this._play_baoting);

        //可以吃
        this._play_canchi = _play.getChildByName("canchi");
        cc.log("   6");
        this.addListenerText(this._play_canchi);
        this._play_canchi.addEventListener(this.clickCB, this._play_canchi);

        //豪华七对
        this._play_haohuaqidui = _play.getChildByName("haohuaqidui");
        this.addListenerText(this._play_haohuaqidui);
        this._play_haohuaqidui.addEventListener(this.clickCB, this._play_haohuaqidui);

        //留牌
        this._play_liupai = _play.getChildByName("liupai");
        cc.log("   7");
        this.addListenerText(this._play_liupai);
        this._play_liupai.addEventListener(this.clickCB, this._play_liupai);

        //自摸胡
        this._play_zimohu = _play.getChildByName("zimohu");
        cc.log("   8");
        this.addListenerText(this._play_zimohu);
        this._play_zimohu.addEventListener(this.clickCB, this._play_zimohu);

        //杠后3张牌
        this._play_kaigangsan = _play.getChildByName("kaigangsan");
        this.addListenerText(this._play_kaigangsan);
        this._play_kaigangsan.addEventListener(this.clickCB, this._play_kaigangsan);

        //天胡可抢杠
        this._play_gangtianhu = _play.getChildByName("gangtianhu");
        cc.log("   9");
        this.addListenerText(this._play_gangtianhu);
        this._play_gangtianhu.addEventListener(this.clickCB, this._play_gangtianhu);

        //大进大出
        this._play_dajindachu = _play.getChildByName("daJinDaChu");
        this.addListenerText(this._play_dajindachu);
        this._play_dajindachu.addEventListener(this.clickCB, this._play_dajindachu);

        //杠后炮加杠上花
        this._play_ganghoupao = _play.getChildByName("ganghoupao");
        cc.log("   10");
        this.addListenerText(this._play_ganghoupao);
        this._play_ganghoupao.addEventListener(this.clickCB, this._play_ganghoupao);

        //过胡可抢杠
        this._play_guoHuQiangGang = _play.getChildByName("guoHuKeQiangGang");
        cc.log("   11");
        this.addListenerText(this._play_guoHuQiangGang);
        this._play_guoHuQiangGang.addEventListener(this.clickCB, this._play_guoHuQiangGang);

        //清一色七对
        this._play_qingYiSeQiDui = _play.getChildByName("qingYiSeQiDui");
        cc.log("   12");
        this.addListenerText(this._play_qingYiSeQiDui);
        this._play_qingYiSeQiDui.addEventListener(this.clickCB, this._play_qingYiSeQiDui);

        //将将胡七对
        this._play_jiangJiangHuQiDui = _play.getChildByName("jiangJiangHuQiDui");
        cc.log("   13");
        this.addListenerText(this._play_jiangJiangHuQiDui);
        this._play_jiangJiangHuQiDui.addEventListener(this.clickCB, this._play_jiangJiangHuQiDui);

        var paohuAndzimo = [];
        paohuAndzimo.push(_play.getChildByName("paohu3zimo2"));
        paohuAndzimo.push(_play.getChildByName("paohu2zimo3"));
        this.paohuAndzimo_radio = createRadioBoxForCheckBoxs(paohuAndzimo, this.radioBoxSelectCB);
        cc.log("   14");
        this.addListenerText(paohuAndzimo, this.paohuAndzimo_radio);
        this.paohuAndzimo = paohuAndzimo;

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        cc.log("   15");
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

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
        cc.log("   16");
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);

        this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx <= 0.1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0) {
                        var step = 0.1;

                        if (this._zhuIdx > 1)
                            step = 1;
                        else if (this._zhuIdx > 0.5)
                            step = 0.5;

                        this._zhuIdx -= step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        var step = 0.1;

                        if (this._zhuIdx >= 1)
                            step = 1;
                        else if (this._zhuIdx >= 0.5)
                            step = 0.5;

                        this._zhuIdx += step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

         // 大结算翻倍
        if (_play.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_play.getChildByName("play_lessthan"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            cc.log("   17");
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }

        //封顶
        this.fengDingList = [];
        this.fengDingList.push(_play.getChildByName("fengDing_0"));       //不封顶
        this.fengDingList.push(_play.getChildByName("fengDing_32"));      //32分封顶
        this.fengDingList.push(_play.getChildByName("fengDing_64"));      //64分封顶    
        this._play_fengDing = createRadioBoxForCheckBoxs(this.fengDingList, this.radioBoxSelectCB);
        cc.log("   18");
        this.addListenerText(this.fengDingList, this._play_fengDing);        
    },
    niaoTypeForPlayerNum: function(index){
        this.changePayForPlayerNum(index);

        var maxPlayerIndex = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            maxPlayerIndex = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            maxPlayerIndex = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected()) {
            maxPlayerIndex = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            maxPlayerIndex = 3;
        }

        if(maxPlayerIndex == 2 || maxPlayerIndex == 3){
            this.niaoTypeList[0].visible = true;
            this.niaoTypeList[1].visible = true;
            this.niaoTypeList[2].visible = true;
            this.paohuAndzimo[0].visible = true;
            this.paohuAndzimo[1].visible = true;
        }else{
            this.niaoTypeList[0].visible = false;
            this.niaoTypeList[1].visible = false;
            this.niaoTypeList[2].visible = false;
            this.paohuAndzimo[0].visible = false;
            this.paohuAndzimo[1].visible = false;
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
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer, this.maxPlayerList[maxPlayer], this.maxPlayerList);

        var zhuaNiaoType;
        if (isClub)
            zhuaNiaoType = [1, 2].indexOf(this.getNumberItem("zhuaniao", 1));
        else
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_zhuaNiaoType, 0);
        this.zhuaNiaoTypeList_radio.selectItem(zhuaNiaoType);
        this.radioBoxSelectCB(zhuaNiaoType,this.zhuaNiaoTypeList[zhuaNiaoType],this.zhuaNiaoTypeList);

        var zhongNiaoType;
        if (isClub)
            zhongNiaoType = [1, 2].indexOf(this.getNumberItem("zhongNiaoType", 1));
        else
            zhongNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_zhongNiaoType, 0);
        this.zhongNiaoTypeList_radio.selectItem(zhongNiaoType);
        this.radioBoxSelectCB(zhongNiaoType,this.zhongNiaoTypeList[zhongNiaoType],this.zhongNiaoTypeList);

        var niaoType;
        if (isClub)
            niaoType = this.getNumberItem("niaoType", 0);
        else
            niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_niaoType, 0);
        this.niaoTypeList_radio.selectItem(niaoType);
        this.radioBoxSelectCB(niaoType,this.niaoTypeList[niaoType],this.niaoTypeList);

        var _baoting;
        if (isClub)
            _baoting = this.getBoolItem("baoTing", true);
        else
            _baoting = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_baoting, true);
        this._play_baoting.setSelected(_baoting);
        var text = this._play_baoting.getChildByName("text");
        this.selectedCB(text,_baoting);

        var _canchi;
        if (isClub) 
        {
            _canchi = this.getBoolItem("canChi",true);
        }
        else
        {
            _canchi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_canchi, true);
        }
        this._play_canchi.setSelected(_canchi);
        var text = this._play_canchi.getChildByName("text");
        this.selectedCB(text,_canchi);

        var _haohuaqidui;
        if (isClub)
            _haohuaqidui = this.getBoolItem("haohuaqidui", true);
        else
            _haohuaqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_haohuaqidui, true);
        this._play_haohuaqidui.setSelected(_haohuaqidui);
        var text = this._play_haohuaqidui.getChildByName("text");
        this.selectedCB(text,_haohuaqidui);

        var _liupai;
        if (isClub)
            _liupai = this.getBoolItem("liuduo", false);
        else
            _liupai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_liupai, false);
        this._play_liupai.setSelected(_liupai);
        var text = this._play_liupai.getChildByName("text");
        this.selectedCB(text,_liupai);

        var _zimohu;
        if (isClub)
            _zimohu = this.getBoolItem("zimohu", false);
        else
            _zimohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_zimohu, false);
        this._play_zimohu.setSelected(_zimohu);
        var text = this._play_zimohu.getChildByName("text");
        this.selectedCB(text,_zimohu);

        var _kaigangsan;
        if (isClub)
            _kaigangsan = this.getBoolItem("gangKaiNum", false);
        else
            _kaigangsan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_kaigangsan, false);
        this._play_kaigangsan.setSelected(_kaigangsan);
        var text = this._play_kaigangsan.getChildByName("text");
        this.selectedCB(text,_kaigangsan);

        var _gangtianhu;
        if (isClub)
            _gangtianhu = this.getBoolItem("qiangGangTianHu", true);
        else
            _gangtianhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_gangtianhu, true);
        this._play_gangtianhu.setSelected(_gangtianhu);
        var text = this._play_gangtianhu.getChildByName("text");
        this.selectedCB(text,_gangtianhu);

        var _dajindachu;
        if (isClub)
            _dajindachu = this.getBoolItem("daJinDaChu", true);
        else
            _dajindachu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_daJinDaChu, true);
        this._play_dajindachu.setSelected(_dajindachu);
        var text = this._play_dajindachu.getChildByName("text");
        this.selectedCB(text,_dajindachu);

        var _ganghoupao;
        if (isClub)
            _ganghoupao = this.getBoolItem("gangHouPaoFen", false);
        else
            _ganghoupao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_ganghoupao, false);
        this._play_ganghoupao.setSelected(_ganghoupao);
        var text = this._play_ganghoupao.getChildByName("text");
        this.selectedCB(text,_ganghoupao);

        var _guoHuQiangGang;
        if (isClub)
            _guoHuQiangGang = this.getBoolItem("guoHuQiangGang", false);
        else
            _guoHuQiangGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_guoHuKeQiangGang, false);
        this._play_guoHuQiangGang.setSelected(_guoHuQiangGang);
        var text = this._play_guoHuQiangGang.getChildByName("text");
        this.selectedCB(text,_guoHuQiangGang);

        var _qingyiseqidui;
        if (isClub)
            _qingyiseqidui = this.getBoolItem("qingYiSeQiDui", false);
        else
            _qingyiseqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_qingyiseqidui, false);
        this._play_qingYiSeQiDui.setSelected(_qingyiseqidui);
        var text = this._play_qingYiSeQiDui.getChildByName("text");
        this.selectedCB(text,_qingyiseqidui);

        var _jiangjianghuqidui;
        if (isClub)
            _jiangjianghuqidui = this.getBoolItem("jiangJiangHuQiDui", false);
        else
            _jiangjianghuqidui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_qingyiseqidui, false);
        this._play_jiangJiangHuQiDui.setSelected(_jiangjianghuqidui);
        var text = this._play_jiangJiangHuQiDui.getChildByName("text");
        this.selectedCB(text,_jiangjianghuqidui);

        var huType;
        if (isClub)
            huType = this.getNumberItem("huType", 1) - 1;
        else
            huType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_paohuAndzimo, 1) - 1;
        this.paohuAndzimo_radio.selectItem(huType);
        this.radioBoxSelectCB(huType, this.paohuAndzimo[huType], this.paohuAndzimo);

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_taoJiang_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        this._playNode_tuoguanType_4.setSelected(false);
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

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //this.refreshZhuaNiao();

        //封顶
        var fengDingScore = 0;
        if(isClub){
            fengDingScore = this.getNumberItem("fengding", 0);
        }else{
            fengDingScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_taoJiang_fengDing, 0);
        }
        var fengDingIndex = [0,32,64].indexOf(fengDingScore);
        this._play_fengDing.selectItem(fengDingIndex);
        this.radioBoxSelectCB(fengDingIndex,this.fengDingList[fengDingIndex],this.fengDingList);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.niaoTypeForPlayerNum();
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var appType = MjClient.getAppType();

            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);

            if (isYongZhouProject()) {
                if(appType == MjClient.APP_TYPE.QXYZQP || appType == MjClient.APP_TYPE.BDYZPHZ){
                    selectColor = cc.color(208,88,60);
                    unSelectColor = cc.color(72,94,112);                
                }
                else if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || appType == MjClient.APP_TYPE.QXLYQP){
                    selectColor = cc.color(211,38,14);
                    unSelectColor = cc.color(68,51,51);               
                }
                else if(appType == MjClient.APP_TYPE.BDHYZP) {
                    selectColor = cc.color("#d21400");
                    unSelectColor = cc.color("#255662");
                }
                else {
                    selectColor = cc.color(237,101,1);
                    unSelectColor = cc.color(158,118,78);
                }
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
    },
    getSelectedPara:function()
    {
        var zhuaNiaoIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();
        var zhongNiaoIndex = this.zhongNiaoTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType        = MjClient.GAME_TYPE.TAO_JIANG_MA_JIANG;
        para.maxPlayer       = 4;                                              // 人数 4 3 2
        para.zhuaniao        = [1, 2][zhuaNiaoIndex];                          // 抓鸟类型 1:单鸟 2:双鸟
        para.zhongNiaoType   = [1, 2][zhongNiaoIndex];                         // 中鸟类型 1:中鸟翻番 2:中鸟加倍
        para.niaoType        = this.niaoTypeList_radio.getSelectIndex();       // 鸟的类型 0：159中鸟 1：单数中鸟 2：鸟必中
        para.baoTing         = this._play_baoting.isSelected();                // 报听       勾选true   未勾选false
        para.canChi          = this._play_canchi.isSelected();                 // 可以吃     勾选true   未勾选false
        para.haohuaqidui     = this._play_haohuaqidui.isSelected();            // 豪华七对   勾选true   未勾选false
        para.liuduo          = this._play_liupai.isSelected();                 // 留牌       勾选true   未勾选false
        para.zimohu          = this._play_zimohu.isSelected();                 // 自摸胡     勾选true   未勾选false
        para.gangKaiNum      = this._play_kaigangsan.isSelected();             // 杠后3张牌  勾选true   未勾选false
        para.qiangGangTianHu = this._play_gangtianhu.isSelected();             // 天胡可抢杠 勾选true   未勾选false
        para.daJinDaChu      = this._play_dajindachu.isSelected();             // 大进大出   勾选true   未勾选false
        para.gangHouPaoFen   = this._play_ganghoupao.isSelected();             // 杠后炮加杠上花 勾选true   未勾选false
        para.huType          = this.paohuAndzimo_radio.getSelectIndex() + 1;   // huype      1         2   
        para.isOpenTingTip   = this.tingTipList[0].isSelected();               // 听牌提示   勾选true   未勾选false
        para.difen           = this._zhuIdx;                                   // 底分       勾选true   未勾选false
        para.convertible     = false;                                          // 自由人数  
        para.fengding        = [0, 32, 64][this._play_fengDing.getSelectIndex()];//封顶
        para.guoHuQiangGang  = this._play_guoHuQiangGang.isSelected();
        para.qingYiSeQiDui   = this._play_qingYiSeQiDui.isSelected();
        para.jiangJiangHuQiDui  = this._play_jiangJiangHuQiDui.isSelected();

        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

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

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_maxPlayer, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_zhuaNiaoType, zhuaNiaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_zhongNiaoType, zhongNiaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_niaoType, para.niaoType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_baoting, para.baoTing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_canchi, para.canChi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_haohuaqidui, para.haohuaqidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_liupai, para.liuduo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_zimohu, para.zimohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_kaigangsan, para.gangKaiNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_gangtianhu, para.qiangGangTianHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_daJinDaChu, para.daJinDaChu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_ganghoupao, para.gangHouPaoFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_difen, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_taoJiang_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_tuoguan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_paohuAndzimo, para.huType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_qingyiseqidui, para.qingYiSeQiDui);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_jiangjianghuqidui, para.jiangJiangHuQiDui);
             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_FAN_BEI_SCORE, para.fanBeiScore);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_fengDing, para.fengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_taoJiang_guoHuKeQiangGang, para.guoHuQiangGang);
        }

        return para;
    }

});