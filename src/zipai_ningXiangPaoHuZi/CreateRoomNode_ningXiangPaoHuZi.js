//郴州字牌
var CreateRoomNode_ningXiangPaoHuZi = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maxPlayer       = "_NingXiangPaoHuZi_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_minHuXi      = "_NingXiangPaoHuZi_minHuXi";         //0 9息起胡， 1 6息起胡，2 3息起胡

        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPai     = "_NingXiangPaoHuZi_maiPai";         //  true/false 埋牌
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zhaNiao     = "_NingXiangPaoHuZi_zhaNiao";         // 0 不扎鸟，1 扎两分， 2 扎5分
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_ziMo     = "_NingXiangPaoHuZi_ziMo";         // 0 不加分，1 加1分，2 加2分
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingTang     = "_NingXiangPaoHuZi_mingTang";         // 0 十六小，1 十八小
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDi     = "_NingXiangPaoHuZi_haiDi";         //  /true/false 海底捞
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaHongJiaXiao     = "_NingXiangPaoHuZi_jiaHongJiaXiao";         // true/false 加红加小加大
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaYiFen     = "_NingXiangPaoHuZi_jiaYiFen";         // true/false 27息加1分
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingWei     = "_NingXiangPaoHuZi_mingWei";         // true/false 明偎
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDiSiFan     = "_NingXiangPaoHuZi_haiDiSiFan";         //  /true/false 海底4番
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_qiePai     = "_NingXiangPaoHuZi_qiePai";       //切牌
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zuoYa     = "_NingXiangPaoHuZi_zuoYa";       //坐压
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shuaHouSiFan     = "_NingXiangPaoHuZi_shuaHouSiFan";       //耍候4番
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shouJu     ="_NingXiangPaoHuZi_shouJu";    //0 房主庄 1 随机庄
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_faPai     ="_NingXiangPaoHuZi_faPai";    //发牌 0普通 1畅爽 2 极速
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_trustTime     ="_NingXiangPaoHuZi_trustTime";    //托管 0 无/1/2/3/5分钟
        this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPaiNum     ="_NingXiangPaoHuZi_maiPaiNum";    //托管 0 无/1/2/3/5分钟

        this.setExtraKey({
            fanBei: "_NingXiang_fanBei",  //大结算翻倍
            fanBeiScore: "_NingXiang_fanBeiScore",  //少于X分大结算翻倍
            jieSuanDiFen: "_NingXiang_JIE_SUAN_DI_FEN",  //积分底分
        });


        this.roundNumObj = {roundNum1:8, roundNum2:10, roundNum3:16};

        this.bg_node = ccs.load("bg_ningXiangPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [_play.getChildByName("maxPlayer3"), _play.getChildByName("maxPlayer2")];
        this.initPlayNumNode(maxPlayerList, [3, 2]);
        var maxPlayerSelectCb = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, maxPlayerList);
            var playNum = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
            if (playNum == 2){
                var minHuXi = this.minHuXiList_radio.getSelectIndex();
                if (minHuXi == 0){
                    var minHuXi = 1;
                    this.minHuXiList_radio.selectItem(minHuXi);
                    this.radioBoxSelectCB(minHuXi, this.minHuXiList[minHuXi], this.minHuXiList);
                }

                this.maiPai.setSelected(true);
                var txt = this.maiPai.getChildByName("text");
                txt.setTextColor(this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : cc.color(211,38,14));
            }

            this.updateXi();
            //this.updateMaiPai();
            this.updateSelectDiaNum();
            this.checkSelect();
        }.bind(this);

        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[1].getChildByName("text"));

        //起胡胡息
        var minHuXiList = this.minHuXiList = [_play.getChildByName("qiHu1"), _play.getChildByName("qiHu2")];
        var minHuXiSelectCb = function (index,sender, list) {
            this.radioBoxSelectCB(index,sender, minHuXiList);
        }.bind(this);
        this.minHuXiList_radio = createRadioBoxForCheckBoxs(minHuXiList, minHuXiSelectCb);
        cc.eventManager.addListener(this.setTextClick(minHuXiList,0,this.minHuXiList_radio, minHuXiSelectCb),minHuXiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(minHuXiList,1,this.minHuXiList_radio, minHuXiSelectCb),minHuXiList[1].getChildByName("text"));

        //埋牌
        this.maiPai = _play.getChildByName("maiPai");
        this.maiPai.visible = false;
        //this.maiPai.addEventListener(this._clickCB, this.maiPai);
        //cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maiPai.getChildByName("text"));

        //埋牌
        var maiPaiList = [];
        maiPaiList.push(_play.getChildByName("maipai0")); 
        maiPaiList.push(_play.getChildByName("maipai1"));
        maiPaiList.push(_play.getChildByName("maipai2"));
        this.maiPaiList_radio = createRadioBoxForCheckBoxs(maiPaiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maiPaiList,0,this.maiPaiList_radio),maiPaiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,1,this.maiPaiList_radio),maiPaiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maiPaiList,2,this.maiPaiList_radio),maiPaiList[2].getChildByName("text"));
        this.maiPaiList = maiPaiList;

        //扎鸟 //0 不扎鸟，1 扎两分， 2 扎5分
        var zhaNiaoList = [_play.getChildByName("zhaNiao1"), _play.getChildByName("zhaNiao2"), _play.getChildByName("zhaNiao3")];
        this.zhaNiaoList_radio = createRadioBoxForCheckBoxs(zhaNiaoList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhaNiaoList,0,this.zhaNiaoList_radio),zhaNiaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhaNiaoList,1,this.zhaNiaoList_radio),zhaNiaoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhaNiaoList,2,this.zhaNiaoList_radio),zhaNiaoList[2].getChildByName("text"));

        //自摸 0 不加分，1 加1分，2 加2分 3 加2番，4 翻倍
        var ziMoList = [_play.getChildByName("ziMo1"), _play.getChildByName("ziMo2"), _play.getChildByName("ziMo3"), _play.getChildByName("ziMo4"), _play.getChildByName("ziMo5")];
        this.ziMoList_radio = createRadioBoxForCheckBoxs(ziMoList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(ziMoList,0,this.ziMoList_radio),ziMoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(ziMoList,1,this.ziMoList_radio),ziMoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(ziMoList,2,this.ziMoList_radio),ziMoList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(ziMoList,3,this.ziMoList_radio),ziMoList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(ziMoList,4,this.ziMoList_radio),ziMoList[4].getChildByName("text"));


        //0 十六小，1 十八小
        var mingTangList = [_play.getChildByName("mingTang1"), _play.getChildByName("mingTang2")];
        this.mingTangList_radio = createRadioBoxForCheckBoxs(mingTangList, this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(mingTangList,0,this.mingTangList_radio),mingTangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(mingTangList,1,this.mingTangList_radio),mingTangList[1].getChildByName("text"));

        var haiDiHuCb = function(sender,type){
            this._clickCB(sender, type);
            this.updateHaiDi();
        }.bind(this);

        //true/false 海底
        this.haiDiHu = _play.getChildByName("haiDiHu");
        this.haiDiHu.addEventListener(haiDiHuCb, this.haiDiHu);
        cc.eventManager.addListener(this.setTextClick(null,null,null,this.updateHaiDi.bind(this)),this.haiDiHu.getChildByName("text"));

        //true/false 海底4番
        this.haiDiSiFan = _play.getChildByName("haiDiSiFan");
        this.haiDiSiFan.addEventListener(this._clickCB, this.haiDiSiFan);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.haiDiSiFan.getChildByName("text"));

        //true/false 加红加小加大
        this.jiaHongJiaXiao = _play.getChildByName("jiaHongJiaXiao");
        this.jiaHongJiaXiao.addEventListener(this._clickCB, this.jiaHongJiaXiao);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.jiaHongJiaXiao.getChildByName("text"));

        //true/false 27息加1分
        this.erQiHu = _play.getChildByName("erQiHu");
        this.erQiHu.addEventListener(this._clickCB, this.erQiHu);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.erQiHu.getChildByName("text"));

        //明偎
        this.mingWei = _play.getChildByName("mingWei");
        this.mingWei.addEventListener(this._clickCB, this.mingWei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.mingWei.getChildByName("text"));

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("autoCut"));
        qiePaiList.push(_play.getChildByName("manualCut"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

        var zuoYaList = [];
        zuoYaList.push(_play.getChildByName("zuoYa1"));
        zuoYaList.push(_play.getChildByName("zuoYa2"));
        zuoYaList.push(_play.getChildByName("zuoYa3"));
        zuoYaList.push(_play.getChildByName("zuoYa4"));
        this.zuoYaList_radio = createRadioBoxForCheckBoxs(zuoYaList, this.radioBoxSelectCB);
        this.addListenerText(zuoYaList,this.zuoYaList_radio);
        this.zuoYaList = zuoYaList;

        //耍候4番
        this.shuaHouSiFan = _play.getChildByName("shuaHouSiFan");
        this.shuaHouSiFan.addEventListener(this._clickCB, this.shuaHouSiFan);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.shuaHouSiFan.getChildByName("text"));

        //坐庄
        var zuoZhuangList = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,0,this.zuoZhuang_radio),zuoZhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,1,this.zuoZhuang_radio),zuoZhuangList[1].getChildByName("text"));
        
        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoGuan1"));
        tuoGuanList.push(_play.getChildByName("tuoGuan2"));
        tuoGuanList.push(_play.getChildByName("tuoGuan3"));
        tuoGuanList.push(_play.getChildByName("tuoGuan4"));
        tuoGuanList.push(_play.getChildByName("tuoGuan5"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
        this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
        this.tuoGuanList = tuoGuanList;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoGuanTip");
        var tuoGuanTip = _play.getChildByName("tuoGuanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (tuoGuanTip.isVisible()) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);

        var faPaiList = [];
        faPaiList.push(_play.getChildByName("faPai1"));
        faPaiList.push(_play.getChildByName("faPai2"));
        faPaiList.push(_play.getChildByName("faPai3"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB);
        this.addListenerText(faPaiList,this.faPaiList_radio);
        this.faPaiList = faPaiList;

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },
    checkSelect : function(){
        var maxPlayer = this.maxPlayerList_radio.getSelectIndex() == 0 ? 3 : 2;//人数
        var selectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : cc.color(211,38,14);
        var unSelectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : cc.color(68,51,51);
        var unEnableColor = cc.color(191,191,191);
        if (maxPlayer == 2){
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(true);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(this.maiPaiList[i].isSelected()? selectColor:unSelectColor);
            }
        }else{
            for (var i in this.maiPaiList) {
                this.maiPaiList[i].setEnabled(false);
                var txt =  this.maiPaiList[i].getChildByName("text");
                txt.setTextColor(unEnableColor);
            }
        }
    },
    _clickCB : function(sender,type){
        var selectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : cc.color(211,38,14);
        var unSelectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : cc.color(68,51,51);
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var selectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_SELECT : cc.color(211,38,14);
        var unSelectColor = this.isUseUIV3 ? CREATEROOM_COLOR_YYV3_UNSELECT : cc.color(68,51,51);
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maxPlayer, 0);
        if (atClub){
            _maxPlayer = {3:0, 2:1}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [_play.getChildByName("maxPlayer3"), _play.getChildByName("maxPlayer2")];
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        //起胡胡息 2人默认9息
        var _minHuXi;
        if (atClub){
            _minHuXi = this.getNumberItem("minHuXi", 0);
        }else{
            _minHuXi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_minHuXi, 0);
        }
        list = [_play.getChildByName("qiHu1"), _play.getChildByName("qiHu2")];
        this.minHuXiList_radio.selectItem(_minHuXi);
        this.radioBoxSelectCB(_minHuXi, list[_minHuXi], list);

        // var _isMaiPai;
        // if (atClub){
        //     _isMaiPai = this.getBoolItem("isMaiPai", true);
        // }else{
        //     _isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPai, true);
        // }
        // this.maiPai.setSelected(_isMaiPai);
        // var txt = this.maiPai.getChildByName("text");
        // txt.setTextColor(_isMaiPai ? cc.color(211,38,14) : cc.color(68,51,51));

        var _isMaiPai;
        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
            _isMaiPai = this.getBoolItem("isMaiPai", false);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPaiNum, 0);
            _isMaiPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPai, false);
        }
        if(_isMaiPai && maiPaiNum == 0) {
            maiPaiNum = 20;         //兼容旧版已经存储的字段
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        //0 不扎鸟，1 扎两分， 2 扎5分
        var _zhaNiaoNum;
        if (atClub){
            _zhaNiaoNum = this.getNumberItem("zhaNiaoNum", 0);
        }else{
            _zhaNiaoNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zhaNiao, 0);
        }
        list = [_play.getChildByName("zhaNiao1"), _play.getChildByName("zhaNiao2"), _play.getChildByName("zhaNiao3")];
        this.zhaNiaoList_radio.selectItem(_zhaNiaoNum);
        this.radioBoxSelectCB(_zhaNiaoNum, list[_zhaNiaoNum], list);

        //0 不加分，1 加1分，2 加2分  3 加2番，4 翻倍
        var _ziMoNum;
        if (atClub){
            _ziMoNum = this.getNumberItem("ziMoNum", 0);
        }else{
            _ziMoNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_ziMo, 0);
        }
        list = [_play.getChildByName("ziMo1"), _play.getChildByName("ziMo2"), _play.getChildByName("ziMo3"), _play.getChildByName("ziMo4"), _play.getChildByName("ziMo5")];
        this.ziMoList_radio.selectItem(_ziMoNum);
        this.radioBoxSelectCB(_ziMoNum, list[_ziMoNum], list);

        //0 十六小，1 十八小
        var _mingTangNum;
        if (atClub){
            _mingTangNum = this.getNumberItem("mingTangNum", 0);
        }else{
            _mingTangNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingTang, 0);
        }
        list = [_play.getChildByName("mingTang1"), _play.getChildByName("mingTang2")];
        this.mingTangList_radio.selectItem(_mingTangNum);
        this.radioBoxSelectCB(_mingTangNum, list[_mingTangNum], list);

        //海底捞
        var _isHaiDi;
        if (atClub){
            _isHaiDi = this.getBoolItem("isHaiDi", false);
        }else{
            _isHaiDi =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDi, false);
        }
        this.haiDiHu.setSelected(_isHaiDi);
        var txt = this.haiDiHu.getChildByName("text");
        txt.setTextColor(_isHaiDi ? selectColor : unSelectColor);

        //海底胡4番
        var _isHaiDiSiFan;
        if (atClub){
            _isHaiDiSiFan = this.getBoolItem("isHaiDiSiFan", false);
        }else{
            _isHaiDiSiFan =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDiSiFan, false);
        }
        this.haiDiSiFan.setSelected(_isHaiDiSiFan);
        var txt = this.haiDiSiFan.getChildByName("text");
        txt.setTextColor(_isHaiDiSiFan ? selectColor : unSelectColor);

        //true/false 加红加小加大
        var _isJiaHongJiaXiao;
        if (atClub){
            _isJiaHongJiaXiao = this.getBoolItem("isJiaHongJiaXiao", false);
        }else{
            _isJiaHongJiaXiao =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaHongJiaXiao, false);
        }
        this.jiaHongJiaXiao.setSelected(_isJiaHongJiaXiao);
        var txt = this.jiaHongJiaXiao.getChildByName("text");
        txt.setTextColor(_isJiaHongJiaXiao ? selectColor : unSelectColor);

        //true/false 27息加1分
        var _isJiaYiFen;
        if (atClub){
            _isJiaYiFen = this.getBoolItem("isJiaYiFen", false);
        }else{
            _isJiaYiFen =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaYiFen, false);
        }
        this.erQiHu.setSelected(_isJiaYiFen);
        var txt = this.erQiHu.getChildByName("text");
        txt.setTextColor(_isJiaYiFen ? selectColor : unSelectColor);

        //true/false 27息加1分
        var _isMingWei;
        if (atClub){
            _isMingWei = this.getBoolItem("isMingWei", false);
        }else{
            _isMingWei =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingWei, false);
        }
        this.mingWei.setSelected(_isMingWei);
        var txt = this.mingWei.getChildByName("text");
        txt.setTextColor(_isMingWei ? selectColor : unSelectColor);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        var _zuoYa;
        if (atClub)
            _zuoYa =this.getNumberItem("zuoYa", 0);
        else
            _zuoYa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zuoYa, 0);
        this.zuoYaList_radio.selectItem( _zuoYa);
        this.radioBoxSelectCB(_zuoYa,this.zuoYaList[_zuoYa],this.zuoYaList);

        //耍候4番
        var _isShuaHouSiFan;
        if (atClub){
            _isShuaHouSiFan = this.getBoolItem("isShuaHouSiFan", false);
        }else{
            _isShuaHouSiFan =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shuaHouSiFan, false);
        }
        this.shuaHouSiFan.setSelected(_isShuaHouSiFan);
        var txt = this.shuaHouSiFan.getChildByName("text");
        txt.setTextColor(_isShuaHouSiFan ? selectColor : unSelectColor);

        var _shouJu;
        if (atClub){
            _shouJu = this.getNumberItem("shouJu", 0);
        }else{
            _shouJu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shouJu, 0);
        }
        list = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio.selectItem(_shouJu);
        this.radioBoxSelectCB(_shouJu, list[_shouJu], list);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_trustTime, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        var faPai;
        if (atClub)
            faPai = this.getNumberItem("faPai", 1);
        else
            faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_faPai, 1);
        this.faPaiList_radio.selectItem(faPai);
        this.radioBoxSelectCB(faPai,this.faPaiList[faPai],this.faPaiList);

        this.setExtraPlayNodeCurrentSelect(atClub);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        this.updateXi();
        //this.updateMaiPai();
        this.updateHaiDi();
        this.checkSelect();
    },

    //更新起胡和计分
    updateXi:function () {
        var playNum = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        //选择2人玩法时，默认选择9胡息
        if (playNum == 2){
            this.minHuXiList[1].visible = true;
        }else{
            this.minHuXiList[1].visible = false;
            var minHuXi = 0;
            this.minHuXiList_radio.selectItem(minHuXi);
            this.radioBoxSelectCB(minHuXi, this.minHuXiList[minHuXi], this.minHuXiList);
        }
    },

    updateMaiPai:function(){
        var playNum = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        if (playNum == 2){
            this.maiPai.visible = true;
        }else{
            this.maiPai.visible = false;
        }
    },

    updateHaiDi:function(){
        if (this.haiDiHu.isSelected()){
            this.haiDiSiFan.visible = true;
        }else{
            this.haiDiSiFan.visible = false;
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.minHuXi = this.minHuXiList_radio.getSelectIndex();

        //para.isMaiPai = this.maiPai.isSelected() && para.maxPlayer == 2;// 两人才有埋牌选项
        para.zhaNiaoNum = this.zhaNiaoList_radio.getSelectIndex();//0 不扎鸟，1 扎两分， 2 扎5分
        para.ziMoNum = this.ziMoList_radio.getSelectIndex();//0 不加分，1 加1分，2 加2分
        para.mingTangNum = this.mingTangList_radio.getSelectIndex();//0 十六小，1 十八小
        para.isHaiDi = this.haiDiHu.isSelected();//true/false 海底捞
        para.isHaiDiSiFan = this.haiDiHu.isSelected() && this.haiDiSiFan.isSelected();
        para.isJiaHongJiaXiao = this.jiaHongJiaXiao.isSelected();//true/false 加红加小加大
        para.isJiaYiFen = this.erQiHu.isSelected();//true/false 27息加1分
        para.isMingWei = this.mingWei.isSelected();
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.zuoYa = this.zuoYaList_radio.getSelectIndex();
        para.isShuaHouSiFan = this.shuaHouSiFan.isSelected();
        para.shouJu = this.zuoZhuang_radio.getSelectIndex(); //0 房主， 1 随机
        para.faPai = this.faPaiList_radio.getSelectIndex();
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;
        para.isMaiPai = para.maiPaiNum > 0;

        this.getExtraSelectedPara(para);

        para.gameType = MjClient.GAME_TYPE.NING_XIANG_PAO_HU_ZI;
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
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_minHuXi, para.minHuXi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPai, para.isMaiPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zhaNiao, para.zhaNiaoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_ziMo, para.ziMoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingTang, para.mingTangNum);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDi, para.isHaiDi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_haiDiSiFan, this.haiDiSiFan.isSelected());
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaHongJiaXiao, para.isJiaHongJiaXiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_jiaYiFen, para.isJiaYiFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_mingWei, para.isMingWei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_zuoYa, para.zuoYa);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shuaHouSiFan, para.isShuaHouSiFan);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_shouJu, para.shouJu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_faPai, para.faPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_trustTime, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_NingXiang_maiPaiNum, para.maiPaiNum);
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