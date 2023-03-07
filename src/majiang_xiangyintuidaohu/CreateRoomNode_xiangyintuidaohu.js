/**
 * Created by cyc on 2017/7/21.
 */


var CreateRoomNode_xiangyintuidaohu = CreateRoomNode.extend({
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
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_maxPlayer     = "_XYTDH_MAX_PLAYER";       //几人玩
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_zhuaNiaoType  = "_XYTDH_ZHUA_NIAO_TYPE";   //抓鸟
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiangJiangHu  = "_XYTDH_JIANG_JIANG_HU";   //将将胡
        //this.localStorageKey.KEY_XIANGYINTUIDAOHU_minggangguogang  = "_XYTDH_MING_GANG_GUO_GANG";   //明杠过杠
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_eatQingYiSe   = "_XYTDH_EAT_QING_YI_SE";   //清一色可吃
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiaPiao       = "_XYTDH_JIA_PIAO";         //加飘
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_isOpenTingTip = "_XYTDH_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_difen         = "_XYTDH_DI_FEN";           //底分
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_tuoguan         = "_XYTDH_TUO_GUAN";           //托管
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_fengding         = "_XYTDH_FENG_DING";           //托管
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_quanqiuren         = "_XYTDH_quanqiuren";           //
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_pphjpbsjjh        = "_XYTDH_pphjpbsjjh";           //
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbei                    = "_XIANGYINTUIDAOHU_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbeiscore              = "_XIANGYINTUIDAOHU_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_XIANGYINTUIDAOHU_trustWay                      = "_XIANGYINTUIDAOHU_TRUST_WAY"; // 托管方式
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_xiangyintuidaohu.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiangyintuidaohu").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_xiangyintuidaohu");
    },
    initPlayNode:function()
    {
        
        var _play = this.bg_node.getChildByName("play");
        var _view = this.bg_node;
        var _parent = this.bg_node.getParent();

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
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, maxPlayerList[index], maxPlayerList);
        }.bind(this));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2, 4]);
		
        this.addListenerText(maxPlayerList,this.maxPlayerList_radio,this.changePayForPlayerNum.bind(this));
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
        this.addListenerText(zhuaNiaoTypeList,this.zhuaNiaoTypeList_radio);
        this.zhuaNiaoTypeList = zhuaNiaoTypeList;

        //将将胡
        this._play_jiangJiangHu = _play.getChildByName("jiangjianghu");
        this.addListenerText(this._play_jiangJiangHu);
        this._play_jiangJiangHu.addEventListener(this.clickCB, this._play_jiangJiangHu);

        //明杠过杠
        this._play_minggangguogang = _play.getChildByName("minggangguogang");
        this.addListenerText(this._play_minggangguogang);
        this._play_minggangguogang.addEventListener(this.clickCB, this._play_minggangguogang);

        //全求人
        this._play_quanqiuren = _play.getChildByName("quanqiuren");
        this.addListenerText(this._play_quanqiuren);
        this._play_quanqiuren.addEventListener(this.clickCB, this._play_quanqiuren);

        this._play_pphjpbsjjh = _play.getChildByName("pphjpbsjjh");
        this.addListenerText(this._play_pphjpbsjjh);
        this._play_pphjpbsjjh.addEventListener(this.clickCB, this._play_pphjpbsjjh);

        //清一色可吃
        this._play_eatQys = _play.getChildByName("eatqinyise");
        this.addListenerText(this._play_eatQys);
        this._play_eatQys.addEventListener(this.clickCB, this._play_eatQys);

        //加飘
        this._play_jiaPiao = _play.getChildByName("jiapiao");
        this.addListenerText(this._play_jiaPiao);
        this._play_jiaPiao.addEventListener(this.clickCB, this._play_jiaPiao);

        var btn_tuoguanTip = _view.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _view.getChildByName("image_tuoguanTip");
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

        var btn_tuoguanTip_0 = _view.getChildByName("btn_tuoguanTip_0");
        var image_tuoguanTip_0 = _view.getChildByName("image_tuoguanTip_0");
        btn_tuoguanTip_0.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip_0.setVisible(true);
            }
        }, btn_tuoguanTip_0);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip_0.isVisible()) {
                    image_tuoguanTip_0.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip_0);

        //托管
/*        this._play_trustTime = _play.getChildByName("trustTime");
        this.addListenerText(this._play_trustTime);
        this._play_trustTime.addEventListener(this.clickCB, this._play_trustTime);*/
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        var tuoguanList = [];
        tuoguanList.push(_play.getChildByName("tuoguan0"));
        tuoguanList.push(_play.getChildByName("tuoguan1"));
        tuoguanList.push(_play.getChildByName("tuoguan2"));
        tuoguanList.push(_play.getChildByName("tuoguan3"));
        var self = this;
        this.tuoguanTypeList_radio = createRadioBoxForCheckBoxs(tuoguanList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,tuoguanList[index],tuoguanList);
            this.setTrustWayPanel(index);
        }.bind(this));
        this.addListenerText(tuoguanList,this.tuoguanTypeList_radio, this.setTrustWayPanel.bind(this));
        this.tuoguanList = tuoguanList;


        this._playNode_fengdingType_0 = _play.getChildByName("fengding30");
        this._playNode_fengdingType_1 = _play.getChildByName("fengding60");
        this._playNode_fengdingType_2 = _play.getChildByName("fengding120");
        var fengdingList = [];
        fengdingList.push(_play.getChildByName("fengding30"));
        fengdingList.push(_play.getChildByName("fengding60"));
        fengdingList.push(_play.getChildByName("fengding120"));
        var self = this;
        this.fengdingTypeList_radio = createRadioBoxForCheckBoxs(fengdingList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,fengdingList[index],fengdingList);
        });
        this.addListenerText(fengdingList,this.fengdingTypeList_radio);
        this.fengdingList = fengdingList;

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

        this._zhuIdx = 1;
        this._ZhuNum = _parent.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _parent.getChildByName("btn_sub");
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
            this._Button_add = _parent.getChildByName("btn_add");
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

        //托管方式
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() && _play.getChildByName("tuoguanType_0")){
            this.trustWatTitle = _play.getParent().getChildByName("img_tuoGuanFangShiTip");
            this._playNode_tuoguanWay0 = _play.getChildByName("tuoguanType_0");
            this._playNode_tuoguanWay1 = _play.getChildByName("tuoguanType_1");
            this._playNode_tuoguanWay2 = _play.getChildByName("tuoguanType_2");
            var tuoguanWayNodeList = [];
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_0"));
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_1"));
            tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_2"));
            this._playNode_player_tuoguanType_radio = createRadioBoxForCheckBoxs(tuoguanWayNodeList, this.radioBoxSelectCB);
            this.addListenerText(tuoguanWayNodeList, this._playNode_player_tuoguanType_radio);
            this.tuoguanWayNodeList = tuoguanWayNodeList;
        }
    },

    setTrustWayPanel: function(trustTimeIdx){
        if(!this.tuoguanWayNodeList) return;
        this.trustWatTitle.visible = trustTimeIdx != 0;
        for(var i = 0; i < this.tuoguanWayNodeList.length; i++){
            this.tuoguanWayNodeList[i].visible =  trustTimeIdx != 0;
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
            maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(maxPlayer);
        this.radioBoxSelectCB(maxPlayer, this.maxPlayerList[maxPlayer], this.maxPlayerList);

        var zhuaNiaoType;
        if (isClub)
            zhuaNiaoType = this.getNumberItem("zhuaniao", 1);
        else
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_zhuaNiaoType, 1);
        this.zhuaNiaoTypeList_radio.selectItem(zhuaNiaoType);
        this.radioBoxSelectCB(zhuaNiaoType,this.zhuaNiaoTypeList[zhuaNiaoType],this.zhuaNiaoTypeList);

        var _jiangJiangHu;
        if (isClub)
            _jiangJiangHu = this.getBoolItem("jiangjianghu", true);
        else
            _jiangJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiangJiangHu, true);
        this._play_jiangJiangHu.setSelected(_jiangJiangHu);
        var text = this._play_jiangJiangHu.getChildByName("text");
        this.selectedCB(text,_jiangJiangHu);

        var _minggangguogang;
        if (isClub) 
        {
            _minggangguogang = this.getBoolItem("minggangguogang",true);
        }
        else
        {
            _minggangguogang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_minggangguogang, true);
        }
        this._play_minggangguogang.setSelected(_minggangguogang);
        var text = this._play_minggangguogang.getChildByName("text");
        this.selectedCB(text,_minggangguogang);

        var _eatQys;
        if (isClub)
            _eatQys = this.getBoolItem("eatqinyise", false);
        else
            _eatQys = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_eatQingYiSe, false);
        this._play_eatQys.setSelected(_eatQys);
        var text = this._play_eatQys.getChildByName("text");
        this.selectedCB(text,_eatQys)

        var _quanqiuren;
        if (isClub)
            _quanqiuren = this.getBoolItem("genzhangbudianpao", false);
        else
            _quanqiuren = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_quanqiuren, false);
        this._play_quanqiuren.setSelected(_quanqiuren);
        var text = this._play_quanqiuren.getChildByName("text");
        this.selectedCB(text,_quanqiuren)

        var _pphjpbsjjh;
        if (isClub)
            _pphjpbsjjh = this.getBoolItem("pphjpbsjjh", false);
        else
            _pphjpbsjjh = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_pphjpbsjjh, false);
        this._play_pphjpbsjjh.setSelected(_pphjpbsjjh);
        var text = this._play_pphjpbsjjh.getChildByName("text");
        this.selectedCB(text,_pphjpbsjjh)

        var _jiaPiao;
        if (isClub)
            _jiaPiao = this.getBoolItem("jiapiao", false);
        else
            _jiaPiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiaPiao, false);
        this._play_jiaPiao.setSelected(_jiaPiao);
        var text = this._play_jiaPiao.getChildByName("text");
        this.selectedCB(text,_jiaPiao)

/*        var _trustTime;
        if (isClub)
            _trustTime = this.getBoolItem("trustTime", false);
        else
            _trustTime = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_tuoguan, false);
        this._play_trustTime.setSelected(_trustTime);
        var text = this._play_trustTime.getChildByName("text");
        this.selectedCB(text,_trustTime)*/

        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);

        var _fengding;
        if (isClub)
            _fengding = [30, 60, 120].indexOf(this.getNumberItem("fengding", 2));
        else
            _fengding = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fengding, 2);
        this.fengdingTypeList_radio.selectItem(_fengding);
        this.radioBoxSelectCB(_fengding,this.fengdingList[_trustTime],this.fengdingList);

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //this.refreshZhuaNiao();

        //托管方式
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() &&  this.tuoguanWayNodeList){
            var trustWay;
            if(isClub){
                trustWay = this.getNumberItem("trustWay", 0);
            }else{
                trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_trustWay, 0);
            }
            this._playNode_player_tuoguanType_radio.selectItem(trustWay);
            this.radioBoxSelectCB(trustWay, this.tuoguanWayNodeList[trustWay], this.tuoguanWayNodeList);
            this.setTrustWayPanel(_trustTime);
        }

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_YIN_TUI_DAO_HU;
        para.maxPlayer = 4;
        para.zhuaniao = this.zhuaNiaoTypeList_radio.getSelectIndex();   // 抓鸟类型 0:单鸟 1:不抓鸟
        para.jiangjianghu = this._play_jiangJiangHu.isSelected(); //将将胡
        para.eatqinyise = this._play_eatQys.isSelected(); //清一色可吃
        para.jiapiao = this._play_jiaPiao.isSelected(); //加飘
        para.minggangguogangbunengbu = this._play_minggangguogang.isSelected();//明杠过杠
        para.isOpenTingTip = this.tingTipList[0].isSelected();
        para.difen = this._zhuIdx; //底分
        //var tuoguan = this._play_trustTime.isSelected();
        para.trustTime = 0;
        para.genzhangbudianpao = false;
        para.pphjpbsjjh = false;


        para.genzhangbudianpao = this._play_quanqiuren.isSelected();
        para.pphjpbsjjh = this._play_pphjpbsjjh.isSelected();
         //人数
         para.convertible = false;  // 自由人数
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
         var tuoguan = 0;
         if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
             tuoguan = 0;
         }
         else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
             tuoguan = 1;
         }
         else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
             tuoguan = 2;
         }
         else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
             tuoguan = 3;
         }

         para.trustWay = 0;
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
            para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
            para.isTrustWhole   = para.trustWay != 0;
        }

         var fengdingindex = 0;
         if (this._playNode_fengdingType_0.isSelected()) {
            para.fengding = 30;
             fengdingindex = 0;
         }
         else if (this._playNode_fengdingType_1.isSelected()) {
            para.fengding = 60;
             fengdingindex = 1;
         }
         else if (this._playNode_fengdingType_2.isSelected()) {
            para.fengding = 120;
             fengdingindex = 2;
         }

         if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_maxPlayer, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_zhuaNiaoType, para.zhuaniao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiangJiangHu, para.jiangjianghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_minggangguogang, para.minggangguogangbunengbu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_jiaPiao, para.jiapiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_tuoguan, tuoguan);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fengding, fengdingindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_pphjpbsjjh, para.pphjpbsjjh);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_quanqiuren, para.genzhangbudianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_eatQingYiSe, para.eatqinyise);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_difen, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_isOpenTingTip, para.isOpenTingTip);

             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_fanbeiscore, para.fanBeiScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XIANGYINTUIDAOHU_trustWay, para.trustWay);
        }

        return para;
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
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