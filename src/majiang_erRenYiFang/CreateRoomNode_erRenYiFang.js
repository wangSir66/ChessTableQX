
var CreateRoomNode_erRenYiFang = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_erRenYiFang_count        = "_erRenYiFang_COUNT"; 				//人数
        this.localStorageKey.KEY_erRenYiFang_zimoType     = "_erRenYiFang_ZI_MO_TYPE"; 		    //自摸类型   0:翻倍   1:加1分
        this.localStorageKey.KEY_erRenYiFang_qgType       = "_erRenYiFang_QG_TYPE"; 		    //抢杠类型   0:陪分   1:翻倍
        this.localStorageKey.KEY_erRenYiFang_niaoType     = "_erRenYiFang_NIAO_TYPE"; 		    //抓鸟类型   0:不抓鸟  1:一鸟全中  2:159中鸟
        this.localStorageKey.KEY_erRenYiFang_niaoNumType  = "_erRenYiFang_NIAO_NUM_TYPE"; 		//抓鸟个数   -1:未选择 0:两鸟   1:四鸟   2:六鸟
        this.localStorageKey.KEY_erRenYiFang_niaoFenType  = "_erRenYiFang_NIAO_FEN_TYPE"; 		//鸟分类型   -1:未选择 0:加1分  1:加2分  2:翻倍
        this.localStorageKey.KEY_erRenYiFang_lunzhuang    = "_erRenYiFang_LUN_ZHUANG";
        this.localStorageKey.KEY_erRenYiFang_lianzhuang   = "_erRenYiFang_LIAN_ZHUANG";
        this.localStorageKey.KEY_erRenYiFang_suijizhuang  = "_erRenYiFang_SUI_JI_ZHUANG";
        this.localStorageKey.KEY_erRenYiFang_tiandihu     = "_erRenYiFang_TIAN_DI_HU";
        this.localStorageKey.KEY_erRenYiFang_daduizi      = "_erRenYiFang_DA_DUI_ZI";
        this.localStorageKey.KEY_erRenYiFang_dandiao      = "_erRenYiFang_DAN_DIAO";
        this.localStorageKey.KEY_erRenYiFang_gangshanghua = "_erRenYiFang_GANG_SHANG_HUA";
        this.localStorageKey.KEY_erRenYiFang_xiaohu       = "_erRenYiFang_XIAO_HU";
        this.localStorageKey.KEY_erRenYiFang_sidui        = "_erRenYiFang_SI_DUI";
        this.localStorageKey.KEY_erRenYiFang_tuoguan      = "_erRenYiFang_TUO_GUAN";
        this.localStorageKey.KEY_erRenYiFang_difen        = "_erRenYiFang_DI_FEN";
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard) this.setKey();
        this.bgNode = ccs.load("bg_erRenYiFang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_erRenYiFang").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_erRenYiFang");
    },
    initPlayNode: function() {
        var bgNode = this.bg_node;
        var _play = bgNode.getChildByName("play");

        this._playNode_zimo_0 = _play.getChildByName("play_zimo_fanbei");
        this._playNode_zimo_1 = _play.getChildByName("play_zimo_jia1fen");
        var zimoList = [this._playNode_zimo_0, this._playNode_zimo_1];
        this._playNode_zimo_radio = createRadioBoxForCheckBoxs(zimoList, this.radioBoxSelectCB);
        this.addListenerText(zimoList, this._playNode_zimo_radio);
        this.zimoList = zimoList;


        this._playNode_qg_0 = _play.getChildByName("play_qg_peifen");
        this._playNode_qg_1 = _play.getChildByName("play_qg_fanbei");
        var qgList = [this._playNode_qg_0, this._playNode_qg_1];
        this._playNode_qg_radio = createRadioBoxForCheckBoxs(qgList, this.radioBoxSelectCB);
        this.addListenerText(qgList, this._playNode_qg_radio);
        this.qgList = qgList;


        //抓鸟类型
        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao1");
        this._playNode_niaoType_5 = _play.getChildByName("zhuaniao5");
        var niaoTypeList = [this._playNode_niaoType_0, this._playNode_niaoType_1, this._playNode_niaoType_5];
        this._playNode_niaoType_radio = createRadioBoxForCheckBoxs(niaoTypeList, this.radioBoxSelectCB);
        this.addListenerText(niaoTypeList, this._playNode_niaoType_radio);
        this.niaoTypeList = niaoTypeList;


        this.zhuaNiao159 = _play.getChildByName("zhongNiao159");         //抓鸟159层
        this._playNode_niaoType_2 = this.zhuaNiao159.getChildByName("zhuaniao2");
        this._playNode_niaoType_4 = this.zhuaNiao159.getChildByName("zhuaniao4");
        this._playNode_niaoType_6 = this.zhuaNiao159.getChildByName("zhuaniao6");
        var niaoNumTypeList = [this._playNode_niaoType_2, this._playNode_niaoType_4, this._playNode_niaoType_6];
        this._playNode_niaoNumType_radio = createRadioBoxForCheckBoxs(niaoNumTypeList, this.radioBoxSelectCB);
        this.addListenerText(niaoNumTypeList, this._playNode_niaoNumType_radio);
        this.niaoNumTypeList = niaoNumTypeList;

        this._playNode_niaoFen_0 = this.zhuaNiao159.getChildByName("niaofen1");
        this._playNode_niaoFen_1 = this.zhuaNiao159.getChildByName("niaofen2");
        this._playNode_niaoFen_2 = this.zhuaNiao159.getChildByName("niaofenfanbei");
        var niaoFenList = [this._playNode_niaoFen_0, this._playNode_niaoFen_1, this._playNode_niaoFen_2];
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;
        

        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        this._playNode_lianzhuang = _play.getChildByName("play_lianzhuang");
        this.addListenerText(this._playNode_lianzhuang);
        this._playNode_lianzhuang.addEventListener(this.clickCB, this._playNode_lianzhuang);

        this._playNode_suijizhuang = _play.getChildByName("play_suijizhuang");
        this.addListenerText(this._playNode_suijizhuang);
        this._playNode_suijizhuang.addEventListener(this.clickCB, this._playNode_suijizhuang);

        this._playNode_tiandihu = _play.getChildByName("play_tiandihu");
        this.addListenerText(this._playNode_tiandihu);
        this._playNode_tiandihu.addEventListener(this.clickCB, this._playNode_tiandihu);

        this._playNode_daduizi = _play.getChildByName("play_daduizi");
        this.addListenerText(this._playNode_daduizi);
        this._playNode_daduizi.addEventListener(this.clickCB, this._playNode_daduizi);

        this._playNode_dandiao = _play.getChildByName("play_dandiao");
        this.addListenerText(this._playNode_dandiao);
        this._playNode_dandiao.addEventListener(this.clickCB, this._playNode_dandiao);

        this._playNode_gangshanghua = _play.getChildByName("play_gangshanghua");
        this.addListenerText(this._playNode_gangshanghua);
        this._playNode_gangshanghua.addEventListener(this.clickCB, this._playNode_gangshanghua);

        this._playNode_xiaohu = _play.getChildByName("play_xiaohu");
        this.addListenerText(this._playNode_xiaohu);
        this._playNode_xiaohu.addEventListener(this.clickCB, this._playNode_xiaohu);

        this._playNode_sidui = _play.getChildByName("play_sidui");
        this.addListenerText(this._playNode_sidui);
        this._playNode_sidui.addEventListener(this.clickCB, this._playNode_sidui);


        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        this._playNode_tuoguanType_4 = _play.getChildByName("tuoguan4");
        var tuoguanNodeList = [
            this._playNode_tuoguanType_0,
            this._playNode_tuoguanType_1,
            this._playNode_tuoguanType_2,
            this._playNode_tuoguanType_3,
            this._playNode_tuoguanType_4
        ];
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;
        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type === ccui.Widget.TOUCH_ENDED) {
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
        this._ZhuNum = bgNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = bgNode.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    if (this._zhuIdx === 1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 1) {
                        this._zhuIdx--;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = bgNode.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {

                    if (this._zhuIdx === 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx++;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }


        this.schedule(function() {
            this.zhuaNiao159.visible = this._playNode_niaoType_5.isSelected();
        }.bind(this));
    },
    setPlayNodeCurrentSelect: function(isClub) {
        var _zimoType;
        if(isClub)
            _zimoType = this.getNumberItem("zimoType", 0);
        else
            _zimoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_zimoType, 0);
        this._playNode_zimo_radio.selectItem(_zimoType);
        this.radioBoxSelectCB(_zimoType, this.zimoList[_zimoType], this.zimoList);


        var _qgType;
        if(isClub)
            _qgType = this.getNumberItem("qgType", 0);
        else
            _qgType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_qgType, 0);
        this._playNode_qg_radio.selectItem(_qgType);
        this.radioBoxSelectCB(_qgType, this.qgList[_qgType], this.qgList);


        var _niaoType;
        if (isClub)
            _niaoType = this.getNumberItem("niaoType", 0);
        else
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoType, 0);
        this._playNode_niaoType_radio.selectItem(_niaoType);
        this.radioBoxSelectCB(_niaoType, this.niaoTypeList[_niaoType], this.niaoTypeList);



        var _niaoNumType;
        if (isClub)
            _niaoNumType = this.getNumberItem("niaoNumType", -1);
        else
            _niaoNumType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoNumType, -1);
        _niaoNumType = _niaoNumType === -1 ? 0 : _niaoNumType;
        this._playNode_niaoNumType_radio.selectItem(_niaoNumType);
        this.radioBoxSelectCB(_niaoNumType, this.niaoNumTypeList[_niaoNumType], this.niaoNumTypeList);


        var _niaoFenType;
        if (isClub)
            _niaoFenType = this.getNumberItem("niaoFenType", -1);
        else
            _niaoFenType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoFenType, -1);
        _niaoFenType = _niaoFenType === -1 ? 0 : _niaoFenType;
        this._playNode_niaoFen_radio.selectItem(_niaoFenType);
        this.radioBoxSelectCB(_niaoFenType, this.niaoFenList[_niaoFenType], this.niaoFenList);


        var _lunZhuang;
        if (isClub)
            _lunZhuang = this.getBoolItem("lunZhuang", false);
        else
            _lunZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_lunzhuang, false);
        this._playNode_lunzhuang.setSelected(_lunZhuang);
        this.selectedCB(this._playNode_lunzhuang.getChildByName("text"), _lunZhuang);


        var _lianZhuang;
        if (isClub)
            _lianZhuang = this.getBoolItem("lianZhuang", true);
        else
            _lianZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_lianzhuang, true);
        this._playNode_lianzhuang.setSelected(_lianZhuang);
        this.selectedCB(this._playNode_lianzhuang.getChildByName("text"), _lianZhuang);

        var _suiJiZhuang;
        if (isClub)
            _suiJiZhuang = this.getBoolItem("suiJiZhuang", true);
        else
            _suiJiZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_suijizhuang, true);
        this._playNode_suijizhuang.setSelected(_suiJiZhuang);
        this.selectedCB(this._playNode_suijizhuang.getChildByName("text"), _suiJiZhuang);


        var _tianDiHu;
        if (isClub)
            _tianDiHu = this.getBoolItem("tianDiHu", true);
        else
            _tianDiHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_tiandihu, true);
        this._playNode_tiandihu.setSelected(_tianDiHu);
        this.selectedCB(this._playNode_tiandihu.getChildByName("text"), _tianDiHu);


        var _daDuiZi;
        if (isClub)
            _daDuiZi = this.getBoolItem("daDuiZi", true);
        else
            _daDuiZi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_daduizi, true);
        this._playNode_daduizi.setSelected(_daDuiZi);
        this.selectedCB(this._playNode_daduizi.getChildByName("text"), _daDuiZi);


        var _danDiao;
        if (isClub)
            _danDiao = this.getBoolItem("danDiao", true);
        else
            _danDiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_dandiao, true);
        this._playNode_dandiao.setSelected(_danDiao);
        this.selectedCB(this._playNode_dandiao.getChildByName("text"), _danDiao);


        var _gangShangHua;
        if (isClub)
            _gangShangHua = this.getBoolItem("gangShangHua", true);
        else
            _gangShangHua = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_gangshanghua, true);
        this._playNode_gangshanghua.setSelected(_gangShangHua);
        this.selectedCB(this._playNode_gangshanghua.getChildByName("text"), _gangShangHua);


        var _xiaoHu;
        if (isClub)
            _xiaoHu = this.getBoolItem("xiaoHu", true);
        else
            _xiaoHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_xiaohu, true);
        this._playNode_xiaohu.setSelected(_xiaoHu);
        this.selectedCB(this._playNode_xiaohu.getChildByName("text"), _xiaoHu);


        var _siDui;
        if (isClub)
            _siDui = this.getBoolItem("siDui", false);
        else
            _siDui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_erRenYiFang_sidui, false);
        this._playNode_sidui.setSelected(_siDui);
        this.selectedCB(this._playNode_sidui.getChildByName("text"), _siDui);


        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_tuoguan, 0);
        var timeArr = [0, 60, 120, 180, 300];
        var idx = timeArr.indexOf(_trustTime);
        this._playNode_player_tuoguan_radio.selectItem(idx);
        this.radioBoxSelectCB(idx, this.tuoguanNodeList[idx], this.tuoguanNodeList);


        //积分底分
        var _diFen;
        if (isClub)
            _diFen = this.getNumberItem("diFen", 1);
        else
            _diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_erRenYiFang_difen, 1);
        if (this._ZhuNum){
            this._ZhuNum.setString(_diFen);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.ER_REN_YI_FANG_MJ;
        para.maxPlayer = 2;
        para.flowerType = WithFlowerType.noFlower;
        para.zimoType = this._playNode_zimo_radio.getSelectIndex();              //自摸类型   0:翻倍   1:加1分
        para.qgType = this._playNode_qg_radio.getSelectIndex();                  //抢杠类型   0:陪分   1:翻倍
        para.niaoType = this._playNode_niaoType_radio.getSelectIndex();          //抓鸟类型   0:不抓鸟  1:一鸟全中  2:159中鸟
        para.niaoNumType = this._playNode_niaoNumType_radio.getSelectIndex();    //抓鸟个数   -1:未选择 0:两鸟   1:四鸟   2:六鸟
        para.niaoFenType = this._playNode_niaoFen_radio.getSelectIndex();        //鸟分类型   -1:未选择 0:加1分  1:加2分  2:翻倍
        para.trustTime = [0, 60, 120, 180, 300][this._playNode_player_tuoguan_radio.getSelectIndex()];
        para.diFen = this._zhuIdx;

        para.lunZhuang = this._playNode_lunzhuang.isSelected();
        para.lianZhuang = this._playNode_lianzhuang.isSelected();
        para.suiJiZhuang = this._playNode_suijizhuang.isSelected();
        para.tianDiHu = this._playNode_tiandihu.isSelected();
        para.daDuiZi = this._playNode_daduizi.isSelected();
        para.danDiao = this._playNode_dandiao.isSelected();
        para.gangShangHua = this._playNode_gangshanghua.isSelected();
        para.xiaoHu = this._playNode_xiaohu.isSelected();
        para.siDui = this._playNode_sidui.isSelected();


        if(para.niaoType !== 2){
            para.niaoNumType = -1;
            para.niaoFenType = -1;
        }


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_zimoType, para.zimoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_qgType, para.qgType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoType, para.niaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoNumType, para.niaoNumType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_niaoFenType, para.niaoFenType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_tuoguan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_erRenYiFang_difen, para.diFen);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_lunzhuang, para.lunZhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_lianzhuang, para.lianZhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_suijizhuang, para.suiJiZhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_tiandihu, para.tianDiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_daduizi, para.daDuiZi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_dandiao, para.danDiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_gangshanghua, para.gangShangHua);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_xiaohu, para.xiaoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_erRenYiFang_sidui, para.siDui);
        }
        cc.log("erRenYiFang   createara: " + JSON.stringify(para));
        return para;
    }
});