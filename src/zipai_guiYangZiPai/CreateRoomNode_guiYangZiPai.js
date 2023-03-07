//桂阳字牌
var CreateRoomNode_guiYangZiPai = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
    },
    initAll:function()
    {
        this._costName = '黄金';

        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maxPlayer       = "_GuiYangZiPai_maxPlayer";          //几人玩
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minHuXi      = "_GuiYangZiPai_minHuXi";         //0 9息起胡， 1 6息起胡，2 3息起胡
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_xiToTun     = "_GuiYangZiPai_xiToTun";         // 0 三息一囤，1 一息一囤
        //this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minXiToTun     ="_GuiYangZiPai_minXiToTun";    //0 9/6/3息一囤，1 9/6/3息三囤
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_biHu     ="_GuiYangZiPai_biHu";    //0 无，1 点炮必胡，2 有胡必胡
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_wanFa     ="_GuiYangZiPai_wanFa";    //0 无，1 红黑点，2 红黑点2倍
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_ziMoFanBei     ="_GuiYangZiPai_ziMoFanBei";    //true/false 自摸翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maoHu     ="_GuiYangZiPai_maoHu";    //true/false 毛胡
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_shiWuZhang     ="_GuiYangZiPai_shiWuZhang";    //true/false 毛胡
        //this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_piaoFen     ="_GuiYangZiPai_piaoFen";    //0 不飘， 1 飘1/2/3, 2 飘2/3/5
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_mingLong     ="_GuiYangZiPai_mingLong";    //0 发牌明龙， 1 出牌明龙
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_zuoZhuang     ="_GuiYangZiPai_zuoZhuang";    //0 随机， 1 房主
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_fanBei     ="_GuiYangZiPai_fanBei";    //0 不翻倍 1 ≤10分翻倍 2 ≤20分翻倍 3 ≤30分翻倍 4 不限分翻倍
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_qiePai     = "_GuiYangZiPai_qiePai";       //切牌
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_difen                 =  "_GuiYangZiPai_difen"; //底分
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_tuoGuan                 =  "_GuiYangZiPai_tuoGuan"; //底分
        this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maiPaiNum      =  "_GuiYangZiPai_maiPaiNum"; //埋牌
        this.roundNumObj = {roundNum1:8, roundNum2:12, roundNum3:20};

        this.bg_node = ccs.load("bg_guiYangZiPai.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");

        //人数
        var maxPlayerList = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1"), _play.getChildByName("play_maxPlayer_2")];
        this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        var maxPlayerSelectCb = function(index,sender, list){
            this.radioBoxSelectCB(index,sender, maxPlayerList);

            var playNum = [4, 3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
            //如果没有创房的15张记录 四人切换到二三人玩法时需要切回默认不勾选
            var txt = this.shiWuZhang.getChildByName("text");
            if (playNum != 4 && this.lastPlayNum == 4){
                var _shiWuZhang;
                if (this._isFriendCard){
                    _shiWuZhang = this.getBoolItem("isShiWuZhang", false);
                }else{
                    _shiWuZhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_shiWuZhang,false);
                }

                this.shiWuZhang.setSelected(_shiWuZhang);
                txt.setTextColor(_shiWuZhang ? this._selectColor : this._unSelectColor);
                this.shiWuZhang.setTouchEnabled(true);
                txt.resume();
                //勾选4人时“15张玩法”不可取消勾选；
            }else if (playNum == 4 && this.lastPlayNum != 4){
                this.shiWuZhang.setSelected(true);
                txt.setTextColor(this._selectColor);
                this.shiWuZhang.setTouchEnabled(false);
                txt.pause();
            }

            this.updateXi();
            this.updateSelectDiaNum();
            this.checkSelect();
            this.lastPlayNum = playNum;
        }.bind(this);

        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList, maxPlayerSelectCb);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio, maxPlayerSelectCb),maxPlayerList[2].getChildByName("text"));

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

        //起胡胡息
        var minHuXiList = this.minHuXiList = [_play.getChildByName("qiHu_1"), _play.getChildByName("qiHu_2"), _play.getChildByName("qiHu_3")];
        this.qiHuPosX = [minHuXiList[0].x,minHuXiList[1].x,minHuXiList[2].x ];
        var minHuXiSelectCb = function (index,sender, list) {
            this.radioBoxSelectCB(index,sender, minHuXiList);
            this.updateXi();
        }.bind(this);
        this.minHuXiList_radio = createRadioBoxForCheckBoxs(minHuXiList, minHuXiSelectCb);
        cc.eventManager.addListener(this.setTextClick(minHuXiList,0,this.minHuXiList_radio, minHuXiSelectCb),minHuXiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(minHuXiList,1,this.minHuXiList_radio, minHuXiSelectCb),minHuXiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(minHuXiList,2,this.minHuXiList_radio, minHuXiSelectCb),minHuXiList[2].getChildByName("text"));

        //囤息转换
        // 0 三息一囤，1 一息一囤
        var xiToTunList = this.xiToTunList = [_play.getChildByName("tunXi_1"), _play.getChildByName("tunXi_2")];
        var xiToTunSelectCb = function (index,sender, list) {
            this.radioBoxSelectCB(index,sender, xiToTunList);
            this.updateXi();
        }.bind(this);
        this.xiToTunList_radio = createRadioBoxForCheckBoxs(xiToTunList,xiToTunSelectCb);
        cc.eventManager.addListener(this.setTextClick(xiToTunList,0,this.xiToTunList_radio, xiToTunSelectCb),xiToTunList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(xiToTunList,1,this.xiToTunList_radio, xiToTunSelectCb),xiToTunList[1].getChildByName("text"));

        // //积分
        // //0 9/6/3息一囤，1 9/6/3息三囤
        // var minXiToTunList = this.minXiToTunList = [_play.getChildByName("jiFen_1"), _play.getChildByName("jiFen_2")];
        // this.minXiToTunList_radio = createRadioBoxForCheckBoxs(minXiToTunList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(minXiToTunList,0,this.minXiToTunList_radio),minXiToTunList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(minXiToTunList,1,this.minXiToTunList_radio),minXiToTunList[1].getChildByName("text"));

        //必胡
        var biHuList = [_play.getChildByName("biHu_1"), _play.getChildByName("biHu_2"), _play.getChildByName("biHu_3")];
        this.biHuList_radio = createRadioBoxForCheckBoxs(biHuList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(biHuList,0,this.biHuList_radio),biHuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(biHuList,1,this.biHuList_radio),biHuList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(biHuList,2,this.biHuList_radio),biHuList[2].getChildByName("text"));

        //玩法
        var wanFaList = [_play.getChildByName("play_1"), _play.getChildByName("play_2"), _play.getChildByName("play_3")];
        this.wanFaList_radio = createRadioBoxForCheckBoxs(wanFaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(wanFaList,0,this.wanFaList_radio),wanFaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanFaList,1,this.wanFaList_radio),wanFaList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wanFaList,2,this.wanFaList_radio),wanFaList[2].getChildByName("text"));

        //自摸翻倍
        this.ziMoFanBei = _play.getChildByName("ziMoFanBei");
        this.ziMoFanBei.addEventListener(this._clickCB.bind(this), this.ziMoFanBei);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.ziMoFanBei.getChildByName("text"));

        //毛胡
        this.maoHu = _play.getChildByName("maoHu");
        this.maoHu.addEventListener(this._clickCB.bind(this), this.maoHu);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.maoHu.getChildByName("text"));

        //15张
        this.shiWuZhang = _play.getChildByName("shiWuZhang");
        this.shiWuZhang.addEventListener(this._clickCB.bind(this), this.shiWuZhang);
        cc.eventManager.addListener(this.setTextClick(null,null,null,null),this.shiWuZhang.getChildByName("text"));

        //飘风
        // var piaoFenList = [_play.getChildByName("piaoFeng_1"), _play.getChildByName("piaoFeng_2"), _play.getChildByName("piaoFeng_3")];
        // this.piaoFen_radio = createRadioBoxForCheckBoxs(piaoFenList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(piaoFenList,0,this.piaoFen_radio),piaoFenList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(piaoFenList,1,this.piaoFen_radio),piaoFenList[1].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(piaoFenList,2,this.piaoFen_radio),piaoFenList[2].getChildByName("text"));

        //明龙
        var mingLongList = [_play.getChildByName("mingLong_1"), _play.getChildByName("mingLong_2")];
        this.mingLong_radio = createRadioBoxForCheckBoxs(mingLongList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(mingLongList,0,this.mingLong_radio),mingLongList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(mingLongList,1,this.mingLong_radio),mingLongList[1].getChildByName("text"));

        //坐庄
        var zuoZhuangList = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio = createRadioBoxForCheckBoxs(zuoZhuangList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,0,this.zuoZhuang_radio),zuoZhuangList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoZhuangList,1,this.zuoZhuang_radio),zuoZhuangList[1].getChildByName("text"));

        //翻倍
        var fanBeiList = [_play.getChildByName("fanBei_1"), _play.getChildByName("fanBei_2"), _play.getChildByName("fanBei_3"), _play.getChildByName("fanBei_4"), _play.getChildByName("fanBei_5")];
        this.fanBei_radio = createRadioBoxForCheckBoxs(fanBeiList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fanBeiList,0,this.fanBei_radio),fanBeiList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fanBeiList,1,this.fanBei_radio),fanBeiList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fanBeiList,2,this.fanBei_radio),fanBeiList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fanBeiList,3,this.fanBei_radio),fanBeiList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fanBeiList,4,this.fanBei_radio),fanBeiList[4].getChildByName("text"));

        var btn_fanbeiTip = this.bg_node.getChildByName("btn_fanbeiTip");
        var image_fanbeiTip = this.bg_node.getChildByName("image_fanbeiTip");
        btn_fanbeiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {image_fanbeiTip.setVisible(true);}
        }, btn_fanbeiTip);
        btn_fanbeiTip.getChildByName("text").addTouchEventListener(function(sender, type) {
            if (type == 2) {image_fanbeiTip.setVisible(true);}
        }, btn_fanbeiTip.getChildByName("text"));
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_fanbeiTip.isVisible()) {
                    image_fanbeiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_fanbeiTip);
        btn_fanbeiTip.getChildByName("text").setTitleColor(this._unSelectColor);

        var qiePaiList = [];
        qiePaiList.push(_play.getChildByName("autoCut"));
        qiePaiList.push(_play.getChildByName("manualCut"));
        this.qiePaiList_radio = createRadioBoxForCheckBoxs(qiePaiList, this.radioBoxSelectCB);
        this.addListenerText(qiePaiList,this.qiePaiList_radio);
        this.qiePaiList = qiePaiList;

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

        // this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            // this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getParent().getChildByName("btn_sub");
            this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
            this.difenIndex = 0;
            var _this = this;
            this._Button_sub.addClickEventListener(function(sender) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);
            this._Button_add = this.bg_node.getParent().getChildByName("btn_add");
            this._Button_add.addClickEventListener(function(sender) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                _this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree();
            }, this);
        }
    },
    checkSelect : function(){
        var idx = this.maxPlayerList_radio.getSelectIndex();//人数
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = cc.color(191,191,191);
        if (idx == 2){
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

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _play = this.bg_node.getChildByName("play");

        var _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maxPlayer, 1);
        if (atClub){
            _maxPlayer = {4:0, 3:1, 2:2}[this.getNumberItem("maxPlayer", 3)];
        }
        var list = [_play.getChildByName("play_maxPlayer_0"), _play.getChildByName("play_maxPlayer_1"), _play.getChildByName("play_maxPlayer_2")];

        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, list[_maxPlayer], list);

        var maiPaiNum;
        if(atClub){
            maiPaiNum = this.getNumberItem("maiPaiNum", 0);
        }
        else{
            maiPaiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maiPaiNum, 0);
        }
        var maiPaiSel = [0,10,20].indexOf(maiPaiNum);
        if(maiPaiSel < 0){
            maiPaiSel = 0;
        }
        this.maiPaiList_radio.selectItem(maiPaiSel);
        this.radioBoxSelectCB(maiPaiSel,this.maiPaiList[maiPaiSel],this.maiPaiList);

        //起胡胡息 默认3息
        var _minHuXi;
        if (atClub){
            _minHuXi = this.getNumberItem("minHuXi", 0);
        }else{
            _minHuXi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minHuXi, 0);
        }

        list = [_play.getChildByName("qiHu_1"), _play.getChildByName("qiHu_2"), _play.getChildByName("qiHu_3")];

        this.minHuXiList_radio.selectItem(_minHuXi);
        this.radioBoxSelectCB(_minHuXi, list[_minHuXi], list);

        var _xiToTun;
        if (atClub){
            _xiToTun = this.getNumberItem("xiToTun", 0);
        }else{
            _xiToTun = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_xiToTun, 0);
        }
        list = [_play.getChildByName("tunXi_1"), _play.getChildByName("tunXi_2")];
        this.xiToTunList_radio.selectItem(_xiToTun);
        this.radioBoxSelectCB(_xiToTun, list[_xiToTun], list);

        // var _minXiToTun;
        // if (atClub){
        //     _minXiToTun = this.getNumberItem("minXiToTun", 0);
        // }else{
        //     _minXiToTun = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minXiToTun, 0);
        // }
        // list = [_play.getChildByName("jiFen_1"), _play.getChildByName("jiFen_2")];
        // this.minXiToTunList_radio.selectItem(_minXiToTun);
        // this.radioBoxSelectCB(_minXiToTun, list[_minXiToTun], list);

        var _biHu;
        if (atClub){
            _biHu = this.getNumberItem("biHu", 0);
        }else{
            _biHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_biHu, 0);
        }
        list = [_play.getChildByName("biHu_1"), _play.getChildByName("biHu_2"), _play.getChildByName("biHu_3")];
        this.biHuList_radio.selectItem(_biHu);
        this.radioBoxSelectCB(_biHu, list[_biHu], list);

        var _wanFa;
        if (atClub){
            _wanFa = this.getNumberItem("wanFa", 0);
        }else{
            _wanFa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_wanFa, 0);
        }
        list = [_play.getChildByName("play_1"), _play.getChildByName("play_2"), _play.getChildByName("play_3")];
        this.wanFaList_radio.selectItem(_wanFa);
        this.radioBoxSelectCB(_wanFa, list[_wanFa], list);

        //自摸翻倍
        var _ziMoFanBei;
        if (atClub){
            _ziMoFanBei = this.getBoolItem("isZiMoFanBei", false);
        }else{
            _ziMoFanBei =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_ziMoFanBei, false);
        }
        this.ziMoFanBei.setSelected(_ziMoFanBei);
        var txt = this.ziMoFanBei.getChildByName("text");
        txt.setTextColor(_ziMoFanBei ? this._selectColor : this._unSelectColor);

        //毛胡
        var _maoHu;
        if (atClub){
            _maoHu = this.getBoolItem("isMaoHu", false);
        }else{
            _maoHu =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maoHu, false);
        }
        this.maoHu.setSelected(_maoHu);
        var txt = this.maoHu.getChildByName("text");
        txt.setTextColor(_maoHu ? this._selectColor : this._unSelectColor);

        //15张
        var _shiWuZhang;
        if (atClub){
            _shiWuZhang = this.getBoolItem("isShiWuZhang", false);
        }else{
            _shiWuZhang =  util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_shiWuZhang, false);
        }

        var txt = this.shiWuZhang.getChildByName("text");
        if (_maxPlayer == 4){
            _shiWuZhang = true;
            this.shiWuZhang.setTouchEnabled(false);
            txt.pause();
        }

        this.shiWuZhang.setSelected(_shiWuZhang);
        txt.setTextColor(_shiWuZhang ? this._selectColor : this._unSelectColor);

        var _mingLong;
        if (atClub){
            _mingLong = this.getNumberItem("mingLong", 0);
        }else{
            _mingLong = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_mingLong, 0);
        }
        list = [_play.getChildByName("mingLong_1"), _play.getChildByName("mingLong_2")];
        this.mingLong_radio.selectItem(_mingLong);
        this.radioBoxSelectCB(_mingLong, list[_mingLong], list);

        var _zuoZhuang;
        if (atClub){
            _zuoZhuang = this.getNumberItem("zuoZhuang", 0);
        }else{
            _zuoZhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_zuoZhuang, 0);
        }
        list = [_play.getChildByName("zuoZhuang_1"), _play.getChildByName("zuoZhuang_2")];
        this.zuoZhuang_radio.selectItem(_zuoZhuang);
        this.radioBoxSelectCB(_zuoZhuang, list[_zuoZhuang], list);

        var _fanBei;
        if (atClub){
            _fanBei = this.getNumberItem("fanBei", 0);
        }else{
            _fanBei = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_fanBei, 0);
        }
        list = [_play.getChildByName("fanBei_1"), _play.getChildByName("fanBei_2"), _play.getChildByName("fanBei_3"), _play.getChildByName("fanBei_4"), _play.getChildByName("fanBei_5")];
        this.fanBei_radio.selectItem(_fanBei);
        this.radioBoxSelectCB(_fanBei, list[_fanBei], list);

        var qiePai;
        if (atClub)
            qiePai = [false, true].indexOf(this.getBoolItem("isManualCutCard", false));
        else
            qiePai = [false, true].indexOf(util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_qiePai, false));
        this.qiePaiList_radio.selectItem(qiePai);
        this.radioBoxSelectCB(qiePai,this.qiePaiList[qiePai],this.qiePaiList);

        var tuoGuan;
        if (atClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_tuoGuan, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        var diFen;
        if (atClub){
            diFen = this.getNumberItem("difen", 1);
        }else {
            diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_difen, 1);
        }
        this.difenIndex = this.difenAry.indexOf(diFen);
        if (this.difenIndex < 0) this.difenIndex = 1;
        if (this._ZhuNum)
            this._ZhuNum.setString(this.difenAry[this.difenIndex] + "");


        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
        this.updateXi();
        this.checkSelect();
    },

    //更新起胡和计分
    updateXi:function () {
        var playNum = [4, 3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())];
        var minHuXi = this.minHuXiList_radio.getSelectIndex();
        var xiToTun = this.xiToTunList_radio.getSelectIndex();// 0 三息一囤，1 一息一囤
        //var minXiToTun = this.minXiToTunList_radio.getSelectIndex();// 0 9/6/3息一囤，1 9/6/3息三囤
        //选择4人玩法时屏蔽9息起胡，
        if (playNum == 4){
            this.minHuXiList[0].visible = false;
            this.minHuXiList[1].visible = true;
            this.minHuXiList[2].visible = true;
            this.minHuXiList[1].x = this.qiHuPosX[0];
            this.minHuXiList[2].x = this.qiHuPosX[1];

            if (minHuXi == 0){
                minHuXi = 2;
                this.minHuXiList_radio.selectItem(minHuXi);
                this.radioBoxSelectCB(minHuXi, this.minHuXiList[minHuXi], this.minHuXiList);
            }
        }else{
            this.minHuXiList[0].visible = true;
            this.minHuXiList[1].visible = false;
            this.minHuXiList[2].visible = false;
            this.minHuXiList[1].x = this.qiHuPosX[1];
            this.minHuXiList[2].x = this.qiHuPosX[2];

            minHuXi = 0;
            this.minHuXiList_radio.selectItem(minHuXi);
            this.radioBoxSelectCB(minHuXi, this.minHuXiList[minHuXi], this.minHuXiList);
        }

        // //同时选择3息起胡和囤息转换3息1胡时，积分需要屏蔽3息3胡
        // if (minHuXi == 2 && xiToTun == 0){
        //     this.minXiToTunList[1].visible = false;
        //     minXiToTun = 0;
        //     this.minXiToTunList_radio.selectItem(minXiToTun);
        //     this.radioBoxSelectCB(minXiToTun, this.minXiToTunList[minXiToTun], this.minXiToTunList);
        // }else{
        //     this.minXiToTunList[1].visible = true;
        // }
        //
        // this.minXiToTunList[0].getChildByName("text").setString(["9","6","3"][minHuXi] + "息1囤");
        // this.minXiToTunList[1].getChildByName("text").setString(["9","6","3"][minHuXi] + "息" + [["3","2","1"],["9","6","3"]][xiToTun][minHuXi] + "囤");
    },

    getSelectedPara:function()
    {
        var para = {};
        para.maxPlayer = [4, 3, 2][parseInt(this.maxPlayerList_radio.getSelectIndex())]; //人数
        para.minHuXi = this.minHuXiList_radio.getSelectIndex();     //0 9息起胡， 1 6息起胡，2 3息起胡
        para.xiToTun = this.xiToTunList_radio.getSelectIndex();// 0 三息一囤，1 一息一囤
        //para.minXiToTun = this.minXiToTunList_radio.getSelectIndex();// 0 9/6/3息一囤，1 9/6/3息三囤
        para.biHu = this.biHuList_radio.getSelectIndex();//0 无，1 点炮必胡，2 有胡必胡
        para.wanFa = this.wanFaList_radio.getSelectIndex();//0 无，1 红黑点，2 红黑点2倍
        para.isZiMoFanBei = this.ziMoFanBei.isSelected();//true/false 自摸翻倍
        para.isMaoHu = this.maoHu.isSelected();//true/false 毛胡
        para.isShiWuZhang = this.shiWuZhang.isSelected();
        //para.piaoFen = this.piaoFen_radio.getSelectIndex();//0 不飘， 1 飘1/2/3, 2 飘2/3/5
        para.mingLong = this.mingLong_radio.getSelectIndex();//明龙
        para.zuoZhuang = this.zuoZhuang_radio.getSelectIndex(); //0 随机， 1 房主
        para.fanBei = this.fanBei_radio.getSelectIndex();//0 不翻倍 1 ≤10分翻倍 2 ≤20分翻倍 3 ≤30分翻倍 4 不限分翻倍
        para.isManualCutCard = [false, true][this.qiePaiList_radio.getSelectIndex()];
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.difen = this.difenAry[this.difenIndex];                   // 底分
        para.maiPaiNum = para.maxPlayer == 2 ? [0,10,20][this.maiPaiList_radio.getSelectIndex()] : 0;

        para.gameType = MjClient.GAME_TYPE.GUI_YANG_ZI_PAI;
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
            util.localStorageEncrypt.setNumberItem( this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maxPlayer, this.maxPlayerList_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minHuXi, para.minHuXi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_xiToTun, para.xiToTun);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_minXiToTun, para.minXiToTun);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_biHu, para.biHu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_wanFa, para.wanFa);
            util.localStorageEncrypt.setBoolItem( this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_ziMoFanBei, para.isZiMoFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maoHu, para.isMaoHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_shiWuZhang, para.isShiWuZhang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_mingLong, para.mingLong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_zuoZhuang, para.zuoZhuang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_fanBei, para.fanBei);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_piaoFen, para.piaoFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_qiePai, para.isManualCutCard);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_tuoGuan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PAO_HU_ZI_GuiYang_maiPaiNum, para.maiPaiNum);
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