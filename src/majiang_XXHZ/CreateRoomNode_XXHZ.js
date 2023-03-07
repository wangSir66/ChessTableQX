/**
 * Created by Joey on 2018/6/13.
 */

var CreateRoomNode_XXHZ = CreateRoomNode.extend({

    setKey: function () {
        this.localStorageKey.KEY_XXHZ_niaoTpye              = "_XXHZ_NIAO_WAY";                 //鸟的方式
        this.localStorageKey.KEY_XXHZ_zhuangxianfen         = "_XXHZ_ZHUANG_XIAN_FEN";          //庄闲分
        this.localStorageKey.KEY_XXHZ_dianpaohu             = "_XXHZ_DIAN_PAO_HU";              //点炮胡
        this.localStorageKey.KEY_XXHZ_qiangganghu           = "_XXHZ_QIANG_GANG_HU";            //抢杠胡
        this.localStorageKey.KEY_XXHZ_qianggangquanbao      = "_XXHZ_QIANG_GANG_QUAN_BAO";      //抢杠全包
        this.localStorageKey.KEY_XXHZ_8hongzhong            = "_XXHZ_8_HONG_ZHONG";             //8红中
        this.localStorageKey.KEY_XXHZ_is7dui                = "_XXHZ_IS_7_DUI";                 //七对可胡
        this.localStorageKey.KEY_XXHZ_youhongzhongbujiepao  = "_XXHZ_HONG_ZHONG_BU_JIE_PAO";    //有红中不接炮
        this.localStorageKey.KEY_XXHZ_wuhongzhongjiabei     = "_XXHZ_WU_HONG_ZHONG_JIA_BEI";    //无红中加倍
        this.localStorageKey.KEY_XXHZ_Count                 = "_XXHZ_COUNT_WAY";
        this.localStorageKey.KEY_XXHZ_niaofen               = "_XXHZ_NIAO_FEN"; 			    // 中鸟得分
        this.localStorageKey.KEY_XXHZ_bihu                  = "_XXHZ_BI_HU";            // 有胡必胡
        this.localStorageKey.KEY_XXHZ_liuniaowanfa          = "_XXHZ_ LIUNIAO_WANFA";   // 不中算全中，全中算翻倍（6鸟玩法）
        this.localStorageKey.KEY_XXHZ_wuhongzhong           = "_XXHZ_WUHONGZHOGN";   // 有红中可抢杠胡
        this.localStorageKey.KEY_XXHZ_genzhangbudianpao                  = "_XXHZ_genzhangbudianpao";          //
        this.localStorageKey.KEY_TYHZ_FAN_BEI               = "TYHZ_TY_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_TYHZ_FAN_BEI_SCORE         = "TYHZ_FAN_BEI_SCORE";  //少于X分大结算翻倍
        this.localStorageKey.KEY_XXHZ_zhuang                = "_XXHZ_zhuang";  //庄
        this.localStorageKey.KEY_XXHZ_tuoguan               =  "_XXHZ_TUO_GUAN";              //湘乡的托管
    },              
    initAll: function (IsFriendCard) {
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        if (!IsFriendCard) {
            this.setKey();
        }

        this.roundNumObj = {roundNum1: 4, roundNum2: 8, roundNum3: 16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
            this.roundNumObj = {roundNum1: 5, roundNum2: 10, roundNum3: 20};
        }

        this.bg_node = ccs.load("bg_XXHZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_XXHZ");
        this.bg_node = this.bg_node.getChildByName("view");
    },

    initPlayNode: function () {

        var _bgTYHZNode = this.bg_node;
        //莫的类型
        var _play = _bgTYHZNode.getChildByName("play");
        this._playNode_niaoType_0 = _play.getChildByName("zhuaniao0");
        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniao3");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniao4");

        var nodeList1 = [];
        nodeList1.push(this._playNode_niaoType_0);
        nodeList1.push(this._playNode_niaoType_1);
        nodeList1.push(this._playNode_niaoType_2);
        nodeList1.push(this._playNode_niaoType_3);
        nodeList1.push(this._playNode_niaoType_4);
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(nodeList1, 0, this._playNode_player_type_radio), nodeList1[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1, 1, this._playNode_player_type_radio), nodeList1[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1, 2, this._playNode_player_type_radio), nodeList1[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1, 3, this._playNode_player_type_radio), nodeList1[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeList1, 4, this._playNode_player_type_radio), nodeList1[4].getChildByName("text"));


        this._playNode_niaoFen_1 = _play.getChildByName("play_niaofen1");
        this._playNode_niaoFen_2 = _play.getChildByName("play_niaofen2");

        var niaoFenList = [];
        niaoFenList.push(this._playNode_niaoFen_1);
        niaoFenList.push(this._playNode_niaoFen_2);
        this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);

        this._playNode_liuniaowanfa = _play.getChildByName("play_liuniaowanfa");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_liuniaowanfa.getChildByName("text"));
        this._playNode_liuniaowanfa.addEventListener(this._clickCB, this._playNode_liuniaowanfa);

        this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
        this.niaoFenList = niaoFenList;
        this._playNode_niaoFen_1.schedule(function () {
            this._playNode_niaoFen_1.setVisible(this._playNode_niaoType_2.isSelected()
                || this._playNode_niaoType_3.isSelected()
                || this._playNode_niaoType_4.isSelected());
            this._playNode_niaoFen_2.setVisible(this._playNode_niaoType_2.isSelected()
                || this._playNode_niaoType_3.isSelected()
                || this._playNode_niaoType_4.isSelected());

            this._playNode_liuniaowanfa.setVisible(this._playNode_niaoType_4.isSelected());
        }.bind(this));

        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_zhuangxianfen.getChildByName("text"));
        this._playNode_zhuangxianfen.addEventListener(this._clickCB, this._playNode_zhuangxianfen);

        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_dianpao.getChildByName("text"));
        this._playNode_dianpao.addEventListener(this._clickCB, this._playNode_dianpao);

        this._playNode_qianggangquanbao = _play.getChildByName("play_qianggangquanbao");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_qianggangquanbao.getChildByName("text"));
        this._playNode_qianggangquanbao.addEventListener(this._clickCB, this._playNode_qianggangquanbao);

        this._playNode_hongzhong8 = _play.getChildByName("play_hongzhong8");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_hongzhong8.getChildByName("text"));
        this._playNode_hongzhong8.addEventListener(this._clickCB, this._playNode_hongzhong8);

        this._playNode_genzhangbudianpao = _play.getChildByName("play_genzhangbudianpao");
        this.addListenerText(this._playNode_genzhangbudianpao);
        this._playNode_genzhangbudianpao.addEventListener(this._clickCB, this._playNode_genzhangbudianpao);

        this._playNode_qidui = _play.getChildByName("play_qidui");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_qidui.getChildByName("text"));
        this._playNode_qidui.addEventListener(this._clickCB, this._playNode_qidui);

        this._playNode_youhongzhongbujiepao = _play.getChildByName("play_youhongzhongbujiepao");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_youhongzhongbujiepao.getChildByName("text"));
        this._playNode_youhongzhongbujiepao.addEventListener(this._clickCB, this._playNode_youhongzhongbujiepao);

        this._playNode_wuhongzhongjiabei = _play.getChildByName("play_wuhongzhongjiabei");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_wuhongzhongjiabei.getChildByName("text"));
        this._playNode_wuhongzhongjiabei.addEventListener(this._clickCB, this._playNode_wuhongzhongjiabei);

        this._playNode_biHuType = _play.getChildByName("play_bihu");
        cc.eventManager.addListener(this.setTextClick(),this._playNode_biHuType.getChildByName("text"));
        this._playNode_biHuType.addEventListener(this._clickCB, this._playNode_biHuType);

        var qianggangNodeList = [];
        qianggangNodeList.push(_play.getChildByName("qianggang0"));
        qianggangNodeList.push(_play.getChildByName("qianggang1"));
        qianggangNodeList.push(_play.getChildByName("qianggang2"));
        var qiangGangCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);
            this._playNode_wuHongZhong.setVisible(false);
            if(index != 0){
                this._playNode_wuHongZhong.setVisible(true);
            }
        }.bind(this);
        this._playNode_qianggang_radio = createRadioBoxForCheckBoxs(qianggangNodeList, qiangGangCallBack);
        this._playNode_qianggangquanbao.schedule(function() {
            this._playNode_qianggangquanbao.setVisible(this._playNode_qianggang_radio.getSelectIndex() == 1);
        }.bind(this));
        var textCallBack = function(index){
            qiangGangCallBack(index, qianggangNodeList[index], qianggangNodeList);
        };
        cc.eventManager.addListener(this.setTextClick(qianggangNodeList, 0, this._playNode_qianggang_radio, textCallBack), qianggangNodeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qianggangNodeList, 1, this._playNode_qianggang_radio, textCallBack), qianggangNodeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(qianggangNodeList, 2, this._playNode_qianggang_radio, textCallBack), qianggangNodeList[2].getChildByName("text"));

        //有红中可抢杠胡
        this._playNode_wuHongZhong = _play.getChildByName("play_wuhongzhong");
        this._playNode_wuHongZhong.getChildByName("text").setString("有红中可抢杠胡");
        cc.eventManager.addListener(this.setTextClick(), this._playNode_wuHongZhong.getChildByName("text"));   
        this._playNode_wuHongZhong.addEventListener(this._clickCB, this._playNode_wuHongZhong);

        this._playNode_Count_0 = _play.getChildByName("playerCount_0");
        this._playNode_Count_1 = _play.getChildByName("playerCount_1");
        this._playNode_Count_2 = _play.getChildByName("playerCount_2");

        var nodeListCount = [];
        nodeListCount.push(_play.getChildByName("playerCount_0"));
        nodeListCount.push(_play.getChildByName("playerCount_1"));
        nodeListCount.push(_play.getChildByName("playerCount_2"));
        this._playNode_playerCount_radio = createRadioBoxForCheckBoxs(nodeListCount, this._radioBoxSelectCB.bind(this));

        cc.eventManager.addListener(this.setTextClick(nodeListCount, 0, this._playNode_playerCount_radio, this.changeAAPayForPlayerNum.bind(this)), nodeListCount[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListCount, 1, this._playNode_playerCount_radio, this.changeAAPayForPlayerNum.bind(this)), nodeListCount[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListCount, 2, this._playNode_playerCount_radio, this.changeAAPayForPlayerNum.bind(this)), nodeListCount[2].getChildByName("text"));

        this.initZhuangNode(_play);

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

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
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
        }
    },

    initZhuangNode:function(_play){
         if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
             //庄选项
            var zhuangList = [];
            var zhuangItemCount = 2;
            for(var i = 0; i < zhuangItemCount; i++){
                zhuangList.push(_play.getChildByName("zhuang_"+i));
                if(i == zhuangItemCount - 1){
                     this.zhuangList_radio = createRadioBoxForCheckBoxs(zhuangList, this.radioBoxSelectCB, 0);
                     cc.each(zhuangList,function(node,index){
                        cc.eventManager.addListener(this.setTextClick(zhuangList, index, this.zhuangList_radio), node.getChildByName("text"));
                        return true;
                     },this);
                }
            }
            this.zhuangList = zhuangList;
         }
    },

    _clickCB: function (sender, type) {

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                if (sender.isSelected()) {
                    txt.setTextColor(cc.color(237, 101, 1));
                } else {
                    txt.setTextColor(cc.color(158, 118, 78));
                }
                break;
        }
    },

    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
                selectColor = cc.color(237,101,1);
                unSelectColor = cc.color(158,118,78);
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

    setRoundNodeCurrentSelect:function(){
        this._super();
        //this.payWayNode_1.setSelected(true);
    },

    setPlayNodeCurrentSelect: function (isClub) {
        //fix by 千千
        var list = [];
        list.push(this._playNode_niaoType_0);
        list.push(this._playNode_niaoType_1);
        list.push(this._playNode_niaoType_2);
        list.push(this._playNode_niaoType_3);
        list.push(this._playNode_niaoType_4);
        var index = 0;

        var _niaoType;
        if (isClub) {
            _niaoType = this.getNumberItem("zhuaniao", 1);
        }else{
            _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XXHZ_niaoTpye, 1);
        }
        this._playNode_niaoType_0.setSelected(false);
        this._playNode_niaoType_1.setSelected(false);
        this._playNode_niaoType_2.setSelected(false);
        this._playNode_niaoType_3.setSelected(false);
        this._playNode_niaoType_4.setSelected(false);

        if (_niaoType == 0) {
            this._playNode_niaoType_0.setSelected(true);
            index = 0;
        }
        else if (_niaoType == 1) {
            this._playNode_niaoType_1.setSelected(true);
            index = 1;
        }
        else if (_niaoType == 2) {
            this._playNode_niaoType_2.setSelected(true);
            index = 2;
        }
        else if (_niaoType == 4) {
            this._playNode_niaoType_3.setSelected(true);
            index = 3;
        }
        else if (_niaoType == 6) {
            this._playNode_niaoType_4.setSelected(true);
            index = 4;
        }
        //fix by 千千
        this.radioBoxSelectCB(index, list[index], list);

        var niaofen;
        if (isClub) {
            niaofen = this.getNumberItem("niaofen", 1);
        }
        else {
            niaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XXHZ_niaofen, 1);
        }
        var niaofenIndex = niaofen - 1;
        this._playNode_niaoFen_radio.selectItem(niaofenIndex);
        this.radioBoxSelectCB(niaofenIndex, this.niaoFenList[niaofenIndex], this.niaoFenList);

        var liuniaowanfa;
        if (isClub)
            liuniaowanfa = this.getBoolItem("liuniaowanfa", false);
        else
            liuniaowanfa = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_liuniaowanfa, false);
        this._playNode_liuniaowanfa.setSelected(liuniaowanfa);
        this._setItemTextColor(this._playNode_liuniaowanfa, liuniaowanfa);

        var listCount = [];
        listCount.push(this._playNode_Count_0);
        listCount.push(this._playNode_Count_1);
        listCount.push(this._playNode_Count_2);
        var indexCount = 0;
        var _Count;
        if (isClub) {
            var count = this.getNumberItem("maxPlayer", 4);
            _Count = count == 4 ? 0 : count == 3 ? 1 : 2;
        }else{
            _Count = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XXHZ_Count, 0);
        }
        this._playNode_Count_0.setSelected(false);
        this._playNode_Count_1.setSelected(false);
        this._playNode_Count_2.setSelected(false);
        cc.log("==============_Count HZMJ= " + _Count);
        if (_Count == 0) {
            this._playNode_Count_0.setSelected(true);
            indexCount = 0;
        }
        else if (_Count == 1) {
            this._playNode_Count_1.setSelected(true);
            indexCount = 1;
        }
        else if (_Count == 2) {
            this._playNode_Count_2.setSelected(true);
            indexCount = 2;
        }
        this.radioBoxSelectCB(indexCount, listCount[indexCount], listCount);

        if (isClub) {
            this._zhuangxianfen = this.getBoolItem("zhuangxianfen", false);
        }else{
            this._zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_zhuangxianfen, true);
        }
        this._playNode_zhuangxianfen.setSelected(this._zhuangxianfen);
        this._setItemTextColor(this._playNode_zhuangxianfen, this._zhuangxianfen);

        if (isClub) {
            this._dianpao = this.getBoolItem("dianpao", true);
        }else{
            this._dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_dianpaohu, true);
        }
        this._playNode_dianpao.setSelected(this._dianpao);
        this._setItemTextColor(this._playNode_dianpao, this._dianpao);

        if (isClub)
            this.genzhangbudianpao = this.getBoolItem("genzhangbudianpao", false);
        else
            this.genzhangbudianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_genzhangbudianpao, false);
        this._playNode_genzhangbudianpao.setSelected(this.genzhangbudianpao);
        var text = this._playNode_genzhangbudianpao.getChildByName("text");
        this._setItemTextColor(this._playNode_genzhangbudianpao, this.genzhangbudianpao)

        var qianggang;
        if (isClub) {
            qianggang = this.getNumberItem("qianggang", 1);
        }else{
            qianggang = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_XXHZ_qiangganghu, "1");
            if (qianggang == "true")
                qianggang = 1;
            else if (qianggang == "false")
                qianggang = 0;
            else if (cc.isNumber(Number(qianggang)))
                qianggang = Number(qianggang);
            else
                qianggang = 1;
        }
        this._playNode_qianggang_radio.selectItem(qianggang);
        this.radioBoxSelectCB(qianggang, this._playNode_qianggang_radio._nodeList[qianggang], this._playNode_qianggang_radio._nodeList);

        //有红中可抢杠胡
        var _wuhongzhong;
        if(isClub){
            _wuhongzhong = this.getBoolItem("wuhongzhong",true);
        }else{
            _wuhongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_wuhongzhong, true);
        }
        this._playNode_wuHongZhong.setSelected(_wuhongzhong);
        var text = this._playNode_wuHongZhong.getChildByName("text");
        this._setItemTextColor(this._playNode_wuHongZhong, _wuhongzhong);
        this._playNode_wuHongZhong.setVisible(qianggang != 0);

        if (isClub) {
            this._qianggangquanbao = this.getBoolItem("qianggangquanbao", true);
        }else{
            this._qianggangquanbao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_qianggangquanbao, true);
        }
        this._playNode_qianggangquanbao.setSelected(this._qianggangquanbao);
        this._setItemTextColor(this._playNode_qianggangquanbao, this._qianggangquanbao);

        if (isClub) {
            this._8hongzhong = this.getBoolItem("hongzhong8", true);
        }else{
            this._8hongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_8hongzhong, false);
        }
        this._playNode_hongzhong8.setSelected(this._8hongzhong);
        this._setItemTextColor(this._playNode_hongzhong8, this._8hongzhong);

        if (isClub) {
            this._is7dui = this.getBoolItem("qidui", true);
        }else{
            this._is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_is7dui, true);
        }
        this._playNode_qidui.setSelected(this._is7dui);
        this._setItemTextColor(this._playNode_qidui, this._is7dui);

        if (isClub) {
            this._hongzhongbujiepao = this.getBoolItem("youhongzhongbujiepao", true);
        }else{
            this._hongzhongbujiepao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_youhongzhongbujiepao, true);
        }
        this._playNode_youhongzhongbujiepao.setSelected(this._hongzhongbujiepao);
        this._setItemTextColor(this._playNode_youhongzhongbujiepao, this._hongzhongbujiepao);

        if (isClub) {
            this._wuhongzhongjiabei = this.getBoolItem("wuhongzhongjiabei", true);
        }else{
            this._wuhongzhongjiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_wuhongzhongjiabei, true);
        }
        this._playNode_wuhongzhongjiabei.setSelected(this._wuhongzhongjiabei);
        this._setItemTextColor(this._playNode_wuhongzhongjiabei, this._wuhongzhongjiabei);

        // 有胡必胡
        var _youhubihu;
        if(isClub){
            _youhubihu = this.getBoolItem("bihuType", true);
        }else{
            _youhubihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_XXHZ_bihu,false);
        }
        this._playNode_biHuType.setSelected(_youhubihu);
        this._setItemTextColor(this._playNode_biHuType, _youhubihu);

        //庄
        if( MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            var zhuang;
            if(isClub){
                zhuang = this.getNumberItem("zuoZhuang", 1);
            }else{
                zhuang = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XXHZ_zhuang, 1);
            }
            this.zhuangList_radio.selectItem(zhuang);
            this.radioBoxSelectCB(zhuang,this.zhuangList[zhuang],this.zhuangList);
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_FAN_BEI, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_FAN_BEI_SCORE, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
            //托管
            var _trustTime;
            if (isClub)
                _trustTime = this.getNumberItem("trustTime", 0);
            else
                _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_XXHZ_tuoguan, 0);
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
                index = 3;
            }
            this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);
        }
    },

    _setItemTextColor: function (item, flg) {

        if (item) {
            var txt = item.getChildByName("text");
            if (flg) {
                txt.setTextColor(cc.color(237, 101, 1));
            } else {
                txt.setTextColor(cc.color(158, 118, 78));
            }
        }
    },

    getSelectedPara: function () {

        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_XIANG_HONG_ZHONG;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 1;//抓鸟
        para.zhuangxianfen = true;//闲庄分
        para.dianpao = true;//点炮胡
        para.qianggang = 1;//抢杠胡 (0:无 1:抢杠算自摸 2:抢杠算点炮)
        para.qianggangquanbao = true;//抢杠全包
        para.hongzhong8 = true;//8红中
        para.qidui = true;//七对可胡
        para.youhongzhongbujiepao = true;//有红中不接炮
        para.wuhongzhongjiabei = true;//无红中加倍
        para.liuniaowanfa = false;//不中算全中，全中算翻倍（6鸟玩法）
        para.wuhongzhong = this._playNode_wuHongZhong.isSelected(); //有红中可抢杠胡
        para.genzhangbudianpao = false; //跟张不点炮

        if(MjClient.APP_TYPE.QXXXGHZ == MjClient.getAppType()){
            zuoZhuang = this.zhuangList_radio.getSelectIndex();
            para.zuoZhuang = zuoZhuang;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        // 中鸟得分
        para.niaofen = 1;
        if (this._playNode_niaoFen_1.visible || this._playNode_niaoFen_2.visible) {
            var niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
            para.niaofen = niaofenIndex + 1;
            if (!this._isFriendCard) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaofen, para.niaofen);
            }
        }

        if (this._playNode_niaoType_0.isSelected()) {
            para.zhuaniao = 0;
        }
        else if (this._playNode_niaoType_1.isSelected()) {
            para.zhuaniao = 1;
        }
        else if (this._playNode_niaoType_2.isSelected()) {
            para.zhuaniao = 2;
        }
        else if (this._playNode_niaoType_3.isSelected()) {
            para.zhuaniao = 4;
        }
        else if (this._playNode_niaoType_4.isSelected()) {
            para.zhuaniao = 6;
        }

        var _index = 0;
        if (this._playNode_Count_0.isSelected()) {
            para.maxPlayer = 4;
            _index = 0;
        }
        else if (this._playNode_Count_1.isSelected()) {
            para.maxPlayer = 3;
            _index = 1;
        }
        else if (this._playNode_Count_2.isSelected()) {
            para.maxPlayer = 2;
            _index = 2;
        }

        para.zhuangxianfen = this._playNode_zhuangxianfen.isSelected();
        para.dianpao = this._playNode_dianpao.isSelected();//点炮胡
        para.qianggang = this._playNode_qianggang_radio.getSelectIndex();//抢杠胡 (0:无 1:抢杠算自摸 2:抢杠算点炮)
        para.qianggangquanbao = para.qianggang == 1 && this._playNode_qianggangquanbao.isSelected();//抢杠全包
        para.hongzhong8 = this._playNode_hongzhong8.isSelected();//8红中
        para.qidui = this._playNode_qidui.isSelected();//七对可胡
        para.youhongzhongbujiepao = this._playNode_youhongzhongbujiepao.isSelected();//有红中不接炮
        para.wuhongzhongjiabei = this._playNode_wuhongzhongjiabei.isSelected();//无红中加倍
        para.bihuType = this._playNode_biHuType.isSelected();//有胡必胡
        para.liuniaowanfa = para.zhuaniao == 6 && this._playNode_liuniaowanfa.isSelected();
        para.genzhangbudianpao = this._playNode_genzhangbudianpao.isSelected(); //

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
            //托管
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

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_niaoTpye, para.zhuaniao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_Count, _index);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_genzhangbudianpao, para.genzhangbudianpao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_zhuangxianfen, para.zhuangxianfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_dianpaohu, para.dianpao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_qiangganghu, para.qianggang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_qianggangquanbao, para.qianggangquanbao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_8hongzhong, para.hongzhong8);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_is7dui, para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_youhongzhongbujiepao, para.youhongzhongbujiepao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_wuhongzhongjiabei, para.wuhongzhongjiabei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_niaofen, para.niaofen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_bihu, para.bihuType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_liuniaowanfa, para.liuniaowanfa);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_XXHZ_wuhongzhong,para.wuhongzhong);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_zhuang,para.zuoZhuang);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_FAN_BEI, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_FAN_BEI_SCORE, para.fanBeiScore);
            }

            if (MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_XXHZ_tuoguan, para.trustTime);
            }
        }


        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    _radioBoxSelectCB: function (index, sender, list) {

        this.radioBoxSelectCB();
        this.changeAAPayForPlayerNum();
    },

    changeAAPayForPlayerNum: function () {

        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_XXHZ();
    },

    setDiaNumData: function (gameNode, roundNumObj, fangzhuPay, AAPay, clubPay) {

        this._super(gameNode, roundNumObj, fangzhuPay, AAPay, clubPay);
        this.setDiaNumData_XXHZ();
    },

    updateSelectDiaNum: function () {  // 更新选定选项的建房消耗元宝

        this._super();
        this.setDiaNumData_XXHZ();
    },

    setDiaNumData_XXHZ: function () {

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
    }
});