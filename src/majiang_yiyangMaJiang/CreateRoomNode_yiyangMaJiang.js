/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_yiYangMJ = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_yiYangMJ_niaoTpye = "_yiYangMJ_NIAO_WAY"; //鸟的方式
        this.localStorageKey.KEY_yiYangMJ_maxPlayer = "_yiYangMJ_MAX_PLAYER"; //玩家个数
        this.localStorageKey.KEY_yiYangMJ_ziyou     = "_yiYangMJ_ZIYOU";            //自由人数
        this.localStorageKey.KEY_yiYangMJ_isOpenTingTip = "_yiYangMJ_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_yiYangMJ_baoTing = "_yiYangMJ_isBaoTing"; //报听
        this.localStorageKey.KEY_yiYangMJ_menQing = "_yiYangMJ_ismenQing"; //门清
        this.localStorageKey.KEY_yiYangMJ_zhongniaotype = "_yiYangMJ_zhongniaotype"; //中鸟类型
        this.localStorageKey.KEY_yiYangMJ_tuoguan       = "_yiYangMJ_TUO_GUAN";        //托管
        this.localStorageKey.KEY_yiYangMJ_difen         = "_yiYangMJ_DI_FEN";          //底分
        this.localStorageKey.KEY_yiYangMJ_yiziqiao         = "_yiYangMJ_YI_ZI_QIZO";          //y一字撬
        this.localStorageKey.KEY_yiYangMJ_fengding         = "_yiYangMJ_FENG_DING";          //底分
        this.localStorageKey.KEY_yiYangMJ_baotingAG         = "_yiYangMJ_BAO_TING_AG";          //报听暗杠
        this.localStorageKey.KEY_yiYangMJ_pphOrjjh        = "_yiYangMJ_PPH_OR_JJH";          //碰碰胡蒋蒋胡不叠加
        this.localStorageKey.KEY_yiYangMJ_zhongniaofanbei        = "_yiYangMJ_NIAO_FAN_BEI";          //中鸟翻倍
        this.localStorageKey.KEY_yiYangMJ_maiPai        = "_yiYangMJ_MAI_PAI";          //埋牌
        this.localStorageKey.KEY_yiYangMJ_danDiaoXiFen        = "_yiYangMJ_DAN_DIAO_XI_FEN";          //单调算喜分
        this.localStorageKey.KEY_yiYangMJ_haiDiNiaoSanGe        = "_yiYangMJ_HAI_DI_NIAO_SAN_GE";          //海底鸟3个
        this.localStorageKey.KEY_yiYangMJ_fangPaoFanBei         = "_yiYangMJ_FANG_PAO_FAN_BEI";   //放炮翻倍
        this.localStorageKey.KEY_yiYangMJ_yiTiaoLong            = "_yiYangMJ_YI_TIAO_LONG"; //一条龙
        this.localStorageKey.KEY_yiYangMJ_menQingJiangHu          = "_yiYangMJ_MEN_QING_JIANG_HU"; //一条龙
        this.localStorageKey.KEY_yiYangMJ_genZhang               = "_yiYangMJ_GEN_ZHANG"; // 跟张

        this.localStorageKey.KEY_yiYangMJ_FAN_BEI               = "_yiYangMJ_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_yiYangMJ_FAN_BEI_SCORE         = "_yiYangMJ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_yiYangMJ_trustWay              = "_yiYangMJ_TRUST_WAY"; // 托管方式 
        
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();
        cc.log("=====create node=================");
        this.bgNode = ccs.load("bg_yiyangMaJiang.json").node;
        cc.log("=====create node="  + this.bgNode);
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_yiyangmj").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_yiyangmj");
    },
    initPlayNode: function() {
        var _bgYiyangNode = this.bg_node;

        //莫的类型
        var _play = _bgYiyangNode.getChildByName("play");

        var birdList = [];
        birdList.push(_play.getChildByName("zhuaniaoType1"));
        birdList.push(_play.getChildByName("zhuaniaoType2"));
        birdList.push(_play.getChildByName("zhuaniaoType3"));
        this._playNode_zhuaNiaoType_radio = createRadioBoxForCheckBoxs(birdList, this.radioBoxSelectCB);
        this.addListenerText(birdList, this._playNode_zhuaNiaoType_radio);
        this._birdList = birdList;


        var nodeList4 = [];
        nodeList4.push(_play.getChildByName("zhongniao_0"));
        nodeList4.push(_play.getChildByName("zhongniao_1"));
        nodeList4.push(_play.getChildByName("zhongniao_2"));
        this._playNode_zhongNiao_radio = createRadioBoxForCheckBoxs(nodeList4, this.radioBoxSelectCB);
        this.addListenerText(nodeList4, this._playNode_zhongNiao_radio);
        this._nodeList4 = nodeList4;

        var fdlist = [];
        fdlist.push(_play.getChildByName("fengdiCheckBox_0"));
        fdlist.push(_play.getChildByName("fengdiCheckBox_1"));
        fdlist.push(_play.getChildByName("fengdiCheckBox_2"));
        fdlist.push(_play.getChildByName("fengdiCheckBox_3"));
        fdlist.push(_play.getChildByName("fengdiCheckBox_4"));
        this._playNode_fengDing_radio = createRadioBoxForCheckBoxs(fdlist, this.radioBoxSelectCB);
        this.addListenerText(fdlist, this._playNode_fengDing_radio);
        this._fdlist = fdlist;

        var nodeList3 = [];
        nodeList3.push(_play.getChildByName("play_maxPlayer_0"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_1"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_2"));
        nodeList3.push(_play.getChildByName("play_maxPlayer_3")); 
        this._playNode_player_type_radio2 = createRadioBoxForCheckBoxs(nodeList3, this.radioBoxSelectCB_yiyang.bind(this));
        cc.eventManager.addListener(this.setTextClick(nodeList3,0,
            this._playNode_player_type_radio2,this.checkZhongNiao.bind(this)),nodeList3[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList3,1,
            this._playNode_player_type_radio2,this.checkZhongNiao.bind(this)),nodeList3[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList3,2,
            this._playNode_player_type_radio2,this.checkZhongNiao.bind(this)),nodeList3[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList3,3,
            this._playNode_player_type_radio2,this.checkZhongNiao.bind(this)),nodeList3[3].getChildByName("text"));
		this.initPlayNumNode(nodeList3, [4, 3, 2, 4]);
        this._nodeList3 = nodeList3;
       
        //玩法
        this._playNode_baoting = _play.getChildByName("baotingCheckBox");
        this.addListenerText(this._playNode_baoting);
        this._playNode_baoting.addEventListener(this.clickCB, this._playNode_baoting);

        this._playNode_menqing = _play.getChildByName("menqingCheckBox");

        var menQingCallBack = function(sender, type){
            this.clickCB(sender, type);
            this._playNode_menQingJiangHu.setVisible(sender.isSelected());
        }.bind(this);
        this._playNode_menqing.addEventListener(menQingCallBack, this._playNode_menqing);
        var textMenQingCallBack = function(index, parent){
            this._playNode_menQingJiangHu.setVisible(parent.isSelected());
        }.bind(this);

        this.addListenerText(this._playNode_menqing,null,textMenQingCallBack);
        // this._playNode_menqing.addEventListener(this.clickCB, this._playNode_menqing);

        this._playNode_yiziqiao = _play.getChildByName("yiziqiaoCheckBox");
        var yiZiQiaoCallBack = function(sender, type){
            this.clickCB(sender, type);
            this._playNode_danDiaoXiFen.setVisible(sender.isSelected());
        }.bind(this);
        this._playNode_yiziqiao.addEventListener(yiZiQiaoCallBack, this._playNode_yiziqiao);
        var textCallBack = function(index, parent){
            this._playNode_danDiaoXiFen.setVisible(parent.isSelected());
        }.bind(this);
        this.addListenerText(this._playNode_yiziqiao, null, textCallBack);

        this._playNode_baotingAG = _play.getChildByName("baotingAGCheckBox");
        this.addListenerText(this._playNode_baotingAG);
        this._playNode_baotingAG.addEventListener(this.clickCB, this._playNode_baotingAG);

        this._playNode_pphOrjjh = _play.getChildByName("pphOrJJHCheckBox");
        this.addListenerText(this._playNode_pphOrjjh);
        this._playNode_pphOrjjh.addEventListener(this.clickCB, this._playNode_pphOrjjh);

        //中鸟翻倍
        this._playNode_zhongNiaoJiaBei = _play.getChildByName("zhongNiaoJiaBei");
        this.addListenerText(this._playNode_zhongNiaoJiaBei);
        this._playNode_zhongNiaoJiaBei.addEventListener(this.clickCB, this._playNode_zhongNiaoJiaBei);

        // 跟张 
        this._playNode_genZhang = _play.getChildByName("genzhangChekBox");
        this.addListenerText(this._playNode_genZhang);
        this._playNode_genZhang.addEventListener(this.clickCB, this._playNode_genZhang);

        //单调算喜分
        this._playNode_danDiaoXiFen = _play.getChildByName("dandiaoxifen");
        this.addListenerText(this._playNode_danDiaoXiFen);
        this._playNode_danDiaoXiFen.addEventListener(this.clickCB, this._playNode_danDiaoXiFen);       

        //门清将将胡不可接炮
        this._playNode_menQingJiangHu = _play.getChildByName("menQingJiangJiangHuCheckBox");
        this.addListenerText(this._playNode_menQingJiangHu);
        this._playNode_menQingJiangHu.addEventListener(this.clickCB, this._playNode_menQingJiangHu);   

        //海底鸟3个
        this._playNode_haiDiNiaoSanGe = _play.getChildByName("haidiniaosange");
        this.addListenerText(this._playNode_haiDiNiaoSanGe);
        this._playNode_haiDiNiaoSanGe.addEventListener(this.clickCB, this._playNode_haiDiNiaoSanGe);         

        //放炮翻倍
        this._playNode_fangPaoFanBei = _play.getChildByName("fangPaoFanBei");
        this.addListenerText(this._playNode_fangPaoFanBei);
        this._playNode_fangPaoFanBei.addEventListener(this.clickCB, this._playNode_fangPaoFanBei);

        //一条龙
        this._playNode_yiTiaoLong = _play.getChildByName("yitiaolong");
        this.addListenerText(this._playNode_yiTiaoLong);
        this._playNode_yiTiaoLong.addEventListener(this.clickCB, this._playNode_yiTiaoLong);

        //埋牌
        this.maiPaiList = [];
        this.maiPaiList.push(_play.getChildByName("maiPai48"));
        this.maiPaiList.push(_play.getChildByName("maiPai42"));
        this.maiPaiList.push(_play.getChildByName("maiPai38"));
        this.maiPaiList.push(_play.getChildByName("maiPaiWu"));
        this._playNode_maiPaiList_radio = createRadioBoxForCheckBoxs(this.maiPaiList, this.radioBoxSelectCB);
        this.addListenerText(this.maiPaiList, this._playNode_maiPaiList_radio);

        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;
        var textTip = _bgYiyangNode.getChildByName("round").getChildByName("text_0_1_0");

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
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, function(index){
            this.radioBoxSelectCB(index, tuoguanNodeList[index], tuoguanNodeList);
            this.setTrustWayPanel(index);
        }.bind(this));
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio, this.setTrustWayPanel.bind(this));
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

        //底分
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
            // this.trustWatTitle = _play.getChildByName("img_tuoGuanFangShiTip");
            // this._playNode_tuoguanWay0 = _play.getChildByName("tuoguanType_0");
            // this._playNode_tuoguanWay1 = _play.getChildByName("tuoguanType_1");
            // this._playNode_tuoguanWay2 = _play.getChildByName("tuoguanType_2");
            // var tuoguanWayNodeList = [];
            // tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_0"));
            // tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_1"));
            // tuoguanWayNodeList.push(_play.getChildByName("tuoguanType_2"));
            // this._playNode_player_tuoguanType_radio = createRadioBoxForCheckBoxs(tuoguanWayNodeList, this.radioBoxSelectCB);
            // this.addListenerText(tuoguanWayNodeList, this._playNode_player_tuoguanType_radio);
            // this.tuoguanWayNodeList = tuoguanWayNodeList;
        }
    },

    setTrustWayPanel: function(trustTimeIdx){
        if(!this.tuoguanWayNodeList) return;
        this.trustWatTitle.visible = trustTimeIdx != 0;
        for(var i = 0; i < this.tuoguanWayNodeList.length; i++){
            this.tuoguanWayNodeList[i].visible =  trustTimeIdx != 0;
        }
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var appType = MjClient.getAppType();

            var selectColor = MjClient.createRoomNode._selectColor;
            var unSelectColor = MjClient.createRoomNode._unSelectColor;

            if (isYongZhouProject()) {
                if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || appType == MjClient.APP_TYPE.BDYZPHZ){
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else if(appType == MjClient.APP_TYPE.QXSYDTZ || appType == MjClient.APP_TYPE.QXLYQP){
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else if(appType == MjClient.APP_TYPE.BDHYZP) {
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
                }
                else {
                    selectColor = MjClient.createRoomNode._selectColor;
                    unSelectColor = MjClient.createRoomNode._unSelectColor;
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
    setPlayNodeCurrentSelect: function(isClub) {
        var _niaoType;
        if(isClub){
            _niaoType = this.getNumberItem("zhuaniao", 1);
        }else{
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_niaoTpye, 1);
        }
        _niaoType = [1,2,3].indexOf(_niaoType);
        this._playNode_zhuaNiaoType_radio.selectItem(_niaoType);
        this.radioBoxSelectCB(_niaoType,this._birdList[_niaoType],this._birdList);

        //bao ting
        var _baotingType;
        if(isClub){
            _baotingType = this.getBoolItem("baoting", false);
        }
        else{
            _baotingType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_baoTing, false);
        }
        if(_baotingType)
        {
            this._playNode_baoting.setSelected(true);
        }
        var text = this._playNode_baoting.getChildByName("text");
        this.selectedCB(text,this._playNode_baoting.isSelected());
        //门清
        var _menQingType;
        if(isClub){
            _menQingType = this.getBoolItem("menqing", false);
        }
        else{
            _menQingType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_menQing, false);
        }
        if(_menQingType)
        {
            this._playNode_menqing.setSelected(true);
        }
        var text = this._playNode_menqing.getChildByName("text");
        this.selectedCB(text,this._playNode_menqing.isSelected());

        //一字撬有喜
        var _yiziqiao;
        if(isClub){
            _yiziqiao = this.getBoolItem("yiziqiaoYouXi", false);
        }
        else{
            _yiziqiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_yiziqiao, false);
        }
        if(_yiziqiao)
        {
            this._playNode_yiziqiao.setSelected(true);
        }
        var text = this._playNode_yiziqiao.getChildByName("text");
        this.selectedCB(text,this._playNode_yiziqiao.isSelected());

        //报听暗杠
        var _baotingAG;
        if(isClub){
            _baotingAG = this.getBoolItem("baotingAG", false);
        }
        else{
            _baotingAG = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_baotingAG, false);
        }
        if(_baotingAG)
        {
            this._playNode_baotingAG.setSelected(true);
        }
        var text = this._playNode_baotingAG.getChildByName("text");
        this.selectedCB(text,this._playNode_baotingAG.isSelected());
        //
        var _pphOrjjh;
        if(isClub){
            _pphOrjjh = this.getBoolItem("pphOrjjh", false);
        }
        else{
            _pphOrjjh = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_pphOrjjh, false);
        }
        if(_pphOrjjh)
        {
            this._playNode_pphOrjjh.setSelected(true);
        }
        var text = this._playNode_pphOrjjh.getChildByName("text");
        this.selectedCB(text,this._playNode_pphOrjjh.isSelected());

        var _maxPlayer;
        if(isClub){
            if (this.getBoolItem("convertible", true))
                _maxPlayer = 0;
            else
                _maxPlayer = this.getNumberItem("maxPlayer", 3);
        }else{
            var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_ziyou,false);
            if(ziyou){
                _maxPlayer = 0;
            }else{
                _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_maxPlayer, 3);
            }
        }
		_maxPlayer = [4, 3, 2, 0].indexOf(_maxPlayer);
        this._playNode_player_type_radio2.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer, this._nodeList3[_maxPlayer], this._nodeList3);
        if(_maxPlayer == 2)
        {
            this.setvisiNiao(true);
        }
        else
            this.setvisiNiao(false);
        
        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        var _zhongNiaoType;
        if(isClub){
            var _zhongNiaoType = this.getNumberItem("zhongNiaoType", 1);
        }else{
            _zhongNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_zhongniaotype,1);
        }
        _zhongNiaoType = [1,2,3].indexOf(_zhongNiaoType);
        this._playNode_zhongNiao_radio.selectItem(_zhongNiaoType);
        this.radioBoxSelectCB(_zhongNiaoType,this._nodeList4[_zhongNiaoType],this._nodeList4);

        //中鸟加倍
        var _zhongNiaoJiaBei;
        if(isClub){
            _zhongNiaoJiaBei = this.getBoolItem("zhongNiaoJiaBei", false);
        }else{
            _zhongNiaoJiaBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_zhongniaofanbei,false);
        }
        this._playNode_zhongNiaoJiaBei.setSelected(_zhongNiaoJiaBei);
        var text = this._playNode_zhongNiaoJiaBei.getChildByName("text");
        this.selectedCB(text,_zhongNiaoJiaBei);

        
        //跟张
        var _genZhang;
        if(isClub){
            _genZhang = this.getBoolItem("genZhang", false);
        }else{
            _genZhang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_genZhang,false);
        }
        this._playNode_genZhang.setSelected(_genZhang);
        var text = this._playNode_genZhang.getChildByName("text");
        this.selectedCB(text,_genZhang);

        //放炮翻倍
        var _fangPaoFanBei;
        if(isClub){
            _fangPaoFanBei = this.getBoolItem("fangPaoFanBei", false);
        }else{
            _fangPaoFanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_fangPaoFanBei,false);
        }
        this._playNode_fangPaoFanBei.setSelected(_fangPaoFanBei);
        var text = this._playNode_fangPaoFanBei.getChildByName("text");
        this.selectedCB(text,_fangPaoFanBei);

        //一条龙
        var _yiTiaoLong;
        if(isClub){
            _yiTiaoLong = this.getBoolItem("yiTiaoLong", true);
        }else{
            _yiTiaoLong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_yiTiaoLong,true);
        }
        this._playNode_yiTiaoLong.setSelected(_yiTiaoLong);
        var text = this._playNode_yiTiaoLong.getChildByName("text");
        this.selectedCB(text,_yiTiaoLong);

        //单调算喜分
        this._playNode_danDiaoXiFen.visible = _yiziqiao;
        var danDiaoXifen;
        if(isClub){
            danDiaoXifen = this.getBoolItem("danDiaoXifen", false);
        }else{
            danDiaoXifen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_danDiaoXiFen,false);
        }
        this._playNode_danDiaoXiFen.setSelected(danDiaoXifen);
        this.selectedCB(this._playNode_danDiaoXiFen.getChildByName("text"),danDiaoXifen);   

        //门清将将胡
        this._playNode_menQingJiangHu.visible = _menQingType;
        var menQingJiangHu;
        if(isClub){
            menQingJiangHu = this.getBoolItem("menQingJiangHuBuJiePao", false);
        }else{
            menQingJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_menQingJiangHu,false);
        }
        this._playNode_menQingJiangHu.setSelected(menQingJiangHu);
        this.selectedCB(this._playNode_menQingJiangHu.getChildByName("text"),menQingJiangHu);             

        //海底鸟3个
        var haiDiNiaoSanGe;
        if(isClub){
            haiDiNiaoSanGe = this.getBoolItem("haiDiNiaoSanGe", false);
        }else{
            haiDiNiaoSanGe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yiYangMJ_haiDiNiaoSanGe,false);
        }
        this._playNode_haiDiNiaoSanGe.setSelected(haiDiNiaoSanGe);
        this.selectedCB(this._playNode_haiDiNiaoSanGe.getChildByName("text"),danDiaoXifen); 

        //埋牌
        var maiPaiCount;
        if(isClub){
            maiPaiCount = this.getNumberItem("maiPaiCount", 0);
        }else{
            maiPaiCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_maiPai,0);
        }
        var maiPaiIndex = [48, 42, 38, 0].indexOf(maiPaiCount);
        this._playNode_maiPaiList_radio.selectItem(maiPaiIndex);
        this.radioBoxSelectCB(maiPaiIndex, this.maiPaiList[maiPaiIndex], this.maiPaiList);

        //封顶
        var _fengdingType;
        if(isClub){
            var _fengdingType = this.getNumberItem("fengding", 0);
        }else{
            _fengdingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_fengding,0);
        }
        _fengdingType = [0,1,2,3,4].indexOf(_fengdingType);
        this._playNode_fengDing_radio.selectItem(_fengdingType);
        this.radioBoxSelectCB(_fengdingType,this._fdlist[_fengdingType],this._fdlist);

        //底分
        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

         //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_tuoguan, 0);
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

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

        //托管方式
        if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType() &&  this.tuoguanWayNodeList){
            // var trustWay;
            // if(isClub){
            //     trustWay = this.getNumberItem("trustWay", 0);
            // }else{
            //     trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yiYangMJ_trustWay, 0);
            // }
            // this._playNode_player_tuoguanType_radio.selectItem(trustWay);
            // this.radioBoxSelectCB(trustWay, this.tuoguanWayNodeList[trustWay], this.tuoguanWayNodeList);
            // this.setTrustWayPanel(index);
        }

         // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changePayForPlayerNum();

    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YI_YANG_MA_JIANG;
        para.maxPlayer = 4;
        para.zhuaniao = 0; //抓鸟
        para.zhuaniao = [1,2,3][this._playNode_zhuaNiaoType_radio.getSelectIndex()];
        para.convertible = this._playNode_player_type_radio2.getSelectIndex() == 3; // 自由人数
        para.maxPlayer = [4, 3, 2, 4][this._playNode_player_type_radio2.getSelectIndex()];
        para.fengding = [0,1,2,3,4][this._playNode_fengDing_radio.getSelectIndex()];

        para.baoting = this._playNode_baoting.isSelected();
        para.menqing = this._playNode_menqing.isSelected();
        para.yiziqiaoYouXi = this._playNode_yiziqiao.isSelected();
        para.difen           = this._zhuIdx;// 底分       勾选true   未勾选false
        para.baotingAG = this._playNode_baotingAG.isSelected();
        para.pphOrjjh = this._playNode_pphOrjjh.isSelected();
        para.isOpenTingTip   = this.tingTipList[0].isSelected();               // 听牌提示   勾选true   未勾选false
        para.zhongNiaoJiaBei = this._playNode_zhongNiaoJiaBei.isSelected(); //中鸟加倍
        para.genZhang = this._playNode_genZhang.isSelected(); //跟张
        para.danDiaoXifen = this._playNode_danDiaoXiFen.isSelected();   //单调算喜分
        para.menQingJiangHuBuJiePao = this._playNode_menQingJiangHu.isSelected() && para.menqing;   //门清将胡不接炮
        para.haiDiNiaoSanGe = this._playNode_haiDiNiaoSanGe.isSelected();   //海底鸟三个
        para.maiPaiCount = 0;   //埋牌
        para.fangPaoFanBei = this._playNode_fangPaoFanBei.isSelected();//放炮翻倍
        para.yiTiaoLong = this._playNode_yiTiaoLong.isSelected();//一条龙
        if(para.maxPlayer == 2){
            para.maiPaiCount = [48, 42, 38, 0][this._playNode_maiPaiList_radio.getSelectIndex()];
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

        para.trustWay = 0;
        // if(MjClient.APP_TYPE.QXYYQP == MjClient.getAppType()){
        //     para.trustWay       = para.trustTime == 0 ? 0 : this._playNode_player_tuoguanType_radio.getSelectIndex();
        //     para.isTrustWhole   = para.trustWay != 0;
        // }

        if(para.maxPlayer == 2)
            para.zhongNiaoType = [1,2,3][this._playNode_zhongNiao_radio.getSelectIndex()];

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_niaoTpye, para.zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_maxPlayer, para.convertible ? 0 : para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yiYangMJ_ziyou,para.convertible);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yiYangMJ_isOpenTingTip, para.isOpenTingTip);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yiYangMJ_baoTing, para.baoting);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yiYangMJ_menQing, para.menqing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_zhongniaotype, para.zhongNiaoType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_tuoguan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_yiziqiao, para.yiziqiaoYouXi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_fengding, para.fengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_baotingAG, para.baotingAG);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_pphOrjjh, para.pphOrjjh);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_zhongniaofanbei, para.zhongNiaoJiaBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_danDiaoXiFen, para.danDiaoXifen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_haiDiNiaoSanGe, para.haiDiNiaoSanGe);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_maiPai, para.maiPaiCount);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_fangPaoFanBei, para.fangPaoFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yiYangMJ_yiTiaoLong, para.yiTiaoLong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_menQingJiangHu, para.menQingJiangHuBuJiePao);
             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_FAN_BEI_SCORE, para.fanBeiScore);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yiYangMJ_trustWay, para.trustWay);
        }


        cc.log("Yi Yang Ma Jiang  createara: " + JSON.stringify(para));
        return para;
    },

    checkZhongNiao:function () {
       
        var personNum = this._playNode_player_type_radio2.getSelectIndex();
        var zhongNiaotext = this.bg_node.getChildByName("round").getChildByName("text_niao");
        cc.log("===checkZhongNiao======" + personNum);
        if(personNum == 2){
           this.setvisiNiao(true);
        }
        else
        {
            this.setvisiNiao(false);
        }
        
    },
    radioBoxSelectCB_yiyang : function(index,sender, list){
        cc.log("===radioBoxSelectCB_yiyang=====");
        this.radioBoxSelectCB(index,sender,list);
        this.checkZhongNiao();
    },
    setvisiNiao: function(flag){
        var zhongNiaotext = this.bg_node.getChildByName("title").getChildByName("text_niao");
        zhongNiaotext.setVisible(flag);
        for(var i = 0; i < this._nodeList4.length; i++)
        {
            this._nodeList4[i].setVisible(flag);
        }

        var maiPaiText = this.bg_node.getChildByName("title").getChildByName("text_7");
        maiPaiText.setVisible(flag);
        for(var k = 0;k < this.maiPaiList.length;k++){
            this.maiPaiList[k].setVisible(flag);
        }
    }

});