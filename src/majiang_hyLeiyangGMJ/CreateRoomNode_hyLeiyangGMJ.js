/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_hyLeiyangGMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        // if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
        //     this._costName = '房卡';
        // }
        if (!this._isFriendCard){
            this.localStorageKey.KEY_leiyangGMJ_maxPlayer       = "_leiyangGMJ_maxPlayer";          //几人玩
            this.localStorageKey.KEY_leiyangGMJ_zhuaNiaoType    = "_leiyangGMJ_zhuaNiaoType";       //抓鸟
            this.localStorageKey.KEY_leiyangGMJ_guipaiType      = "_leiyangGMJ_guipaiType";         //鬼牌
            this.localStorageKey.KEY_leiyangGMJ_shaguiType      = "_leiyangGMJ_shaguiType";         //杀鬼
            this.localStorageKey.KEY_leiyangGMJ_wuguiType       = "_leiyangGMJ_wuguiType";           //无鬼翻倍
            this.localStorageKey.KEY_leiyangGMJ_qishouhu        = "_leiyangGMJ_qishouhu";           //起手胡
            this.localStorageKey.KEY_leiyangGMJ_qiangganghu     = "_leiyangGMJ_qiangganghu";        //抢杠胡
            this.localStorageKey.KEY_leiyangGMJ_qianggangquanbao= "_leiyangGMJ_qianggangquanbao";   //抢杠全包
            this.localStorageKey.KEY_leiyangGMJ_diFen_score     = "_leiyangGMJ_diFen_score";        //低分翻倍分数
            this.localStorageKey.KEY_leiyangGMJ_jieSuanDiFen    = "_leiyangGMJ_jieSuanDiFen";       // 积分底分
            this.localStorageKey.KEY_leiyangGMJ_zhuangJia       = "_leiyangGMJ_zhuangJia";          // 庄家
            this.localStorageKey.KEY_leiyangGMJ_tuoGuan         = "_leiyangGMJ_tuoGuan";              // 托管
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundLeiYangGMJ4,  pay8:majiang.roundLeiYangGMJ8,  pay16:majiang.roundLeiYangGMJ16};
        // this.AAPay      = {pay4:majiang.roundLeiYangGMJAA4,pay8:majiang.roundLeiYangGMJAA8,pay16:majiang.roundLeiYangGMJAA16};
        // this.clubPay    = {pay4:majiang.roundLeiYangGMJCL4,pay8:majiang.roundLeiYangGMJCL8,pay16:majiang.roundLeiYangGMJCL16};

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};
        }
        

        this.bg_node = ccs.load("bg_leiyangGMJ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_leiyangGMJ");
        if(this.bg_node.getChildByName("view")) {
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
		maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio),maxPlayerList[2].getChildByName("text"));

        var guipaiTypeList = [];
        guipaiTypeList.push(_play.getChildByName("guipaiType1"));
        guipaiTypeList.push(_play.getChildByName("guipaiType2"));
        guipaiTypeList.push(_play.getChildByName("guipaiType3"));
        this.guipaiTypeList_radio = createRadioBoxForCheckBoxs(guipaiTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(guipaiTypeList,0,this.guipaiTypeList_radio),guipaiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(guipaiTypeList,1,this.guipaiTypeList_radio),guipaiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(guipaiTypeList,2,this.guipaiTypeList_radio),guipaiTypeList[2].getChildByName("text"));

        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType4"));
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,0,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,1,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,2,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,3,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[3].getChildByName("text"));

        var shaguiTypeList = [];
        shaguiTypeList.push(_play.getChildByName("shaguiType1"));
        shaguiTypeList.push(_play.getChildByName("shaguiType2"));
        shaguiTypeList.push(_play.getChildByName("shaguiType3"));
        this.shaguiTypeList_radio = createRadioBoxForCheckBoxs(shaguiTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(shaguiTypeList,0,this.shaguiTypeList_radio),shaguiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(shaguiTypeList,1,this.shaguiTypeList_radio),shaguiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(shaguiTypeList,2,this.shaguiTypeList_radio),shaguiTypeList[2].getChildByName("text"));

        var wuguiTypeList = [];
        wuguiTypeList.push(_play.getChildByName("wuguiType1"));
        wuguiTypeList.push(_play.getChildByName("wuguiType2"));
        wuguiTypeList.push(_play.getChildByName("wuguiType3"));
        this.wuguiTypeList_radio = createRadioBoxForCheckBoxs(wuguiTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(wuguiTypeList,0,this.wuguiTypeList_radio),wuguiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wuguiTypeList,1,this.wuguiTypeList_radio),wuguiTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wuguiTypeList,2,this.wuguiTypeList_radio),wuguiTypeList[2].getChildByName("text"));

        var diFenList = [];
        diFenList.push(_play.getChildByName("fanBei0"));
        diFenList.push(_play.getChildByName("fanBei1"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        this._initDiFenUI(diFenList[1]);

        this.qishouhu = _play.getChildByName("qishouhu");
        cc.eventManager.addListener(this.setTextClick(),this.qishouhu.getChildByName("text"));
        //fix by 千千
         this.qishouhu.addEventListener(this._clickCB, this.qishouhu);

        this.qiangganghu = _play.getChildByName("qiangganghu");
        cc.eventManager.addListener(this.setTextClick(),this.qiangganghu.getChildByName("text"));
        //fix by 千千
         this.qiangganghu.addEventListener(this._clickCB, this.qiangganghu);

        this.qianggangquanbao = _play.getChildByName("qianggangquanbao");
        cc.eventManager.addListener(this.setTextClick(),this.qianggangquanbao.getChildByName("text"));
        //fix by 千千
         this.qianggangquanbao.addEventListener(this._clickCB, this.qianggangquanbao);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

         // 积分底分
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
            MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            var score = this.bg_node.parent.getChildByName("score");
            var addBtn = this.bg_node.parent.getChildByName("btn_add");
            var subBtn = this.bg_node.parent.getChildByName("btn_sub");
            if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
                score = _play.getChildByName("jieSuanDiFen").getChildByName("score");
                addBtn = _play.getChildByName("jieSuanDiFen").getChildByName("btn_add");
                subBtn = _play.getChildByName("jieSuanDiFen").getChildByName("btn_sub");
            }
            addBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);

            subBtn.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    score.setString(_this.difenAry[_this.difenIndex]);
                    _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
                }
            }, this);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            var zhuangJiaList = [];
            zhuangJiaList.push(_play.getChildByName("zhuangJia1"));
            zhuangJiaList.push(_play.getChildByName("zhuangJia2"));
            this.zhuangJiaList_radio = createRadioBoxForCheckBoxs(zhuangJiaList, this.radioBoxSelectCB);
            cc.eventManager.addListener(this.setTextClick(zhuangJiaList, 0, this.zhuangJiaList_radio), zhuangJiaList[0].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(zhuangJiaList, 1, this.zhuangJiaList_radio), zhuangJiaList[1].getChildByName("text"));
            this.zhuangJiaList = zhuangJiaList;
        }

        //托管
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var tuoGuanList = [];
            tuoGuanList.push(_play.getChildByName("tuoguan0"));
            tuoGuanList.push(_play.getChildByName("tuoguan1"));
            tuoGuanList.push(_play.getChildByName("tuoguan2"));
            tuoGuanList.push(_play.getChildByName("tuoguan3"));
            tuoGuanList.push(_play.getChildByName("tuoguan4"));
            this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, this.radioBoxSelectCB);
            this.addListenerText(tuoGuanList,this.tuoGuanList_radio);
            this.tuoGuanList = tuoGuanList;

            var btn_tuoGuanTip = _play.getChildByName("btn_tuoguanTip");
            var tuoGuanTip = _play.getChildByName("image_tuoguanTip");
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
        }

        this.schedule(function(sender,type)
        {
            var index = this.maxPlayerList_radio.getSelectIndex();
            if (MjClient.MaxPlayerNum != 4 - index)
            {
                MjClient.MaxPlayerNum = 4 - index;
                this.changeAAPayForPlayerNum();
            }

            this.qianggangquanbao.setVisible(this.qiangganghu.isSelected()); 
        },0.1);
    },

    _initDiFenUI : function(fanBei1){
        var subButton = fanBei1.getChildByName("btn_sub");
        var addButton = fanBei1.getChildByName("btn_add");
        var scoreLabel = fanBei1.getChildByName("score");
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
    },

    _clickCB : function(sender,type){
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            selectColor = CREATEROOM_COLOR_SY_SELECT;
            unSelectColor = CREATEROOM_COLOR_SY_UNSELECT;
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
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
        var selectColor = cc.color("#d21400");
        var unSelectColor = cc.color("#255662");
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            selectColor = CREATEROOM_COLOR_SY_SELECT;
            unSelectColor = CREATEROOM_COLOR_SY_UNSELECT;
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG){
            selectColor = CREATEROOM_COLOR_WANGWANG_SELECT;
            unSelectColor = CREATEROOM_COLOR_WANGWANG_UNSELECT;
        }
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer;
        if(atClub){
            var temp_maxPlayer = this.getNumberItem("maxPlayer",4); //
            _maxPlayer = [4,3,2].indexOf(temp_maxPlayer);
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_maxPlayer, 0);
        }

        this.maxPlayerList_radio.selectItem(_maxPlayer);
        //fix by 千千
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _guipaiType;
        if(atClub)
            _guipaiType = this.getNumberItem("guipaiType",0); 
        else
            _guipaiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_guipaiType, 0);

        this.guipaiTypeList_radio.selectItem(_guipaiType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("guipaiType1"));
        list.push(_play.getChildByName("guipaiType2"));
        list.push(_play.getChildByName("guipaiType3"));
        this.radioBoxSelectCB(_guipaiType,list[_guipaiType],list); 

        var _zhuaNiaoType;
        if(atClub){
            var temp_zhuaniaoType = this.getNumberItem("zhuaniaoNum",1); 
            _zhuaNiaoType = [1,2,4,6].indexOf(temp_zhuaniaoType);  
        }else{
            _zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuaNiaoType, 0);
        }

        this.zhuaNiaoTypeList_radio.selectItem(_zhuaNiaoType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("zhuaniaoType1"));
        list.push(_play.getChildByName("zhuaniaoType2"));
        list.push(_play.getChildByName("zhuaniaoType3"));
        list.push(_play.getChildByName("zhuaniaoType4"));
        this.radioBoxSelectCB(_zhuaNiaoType,list[_zhuaNiaoType],list); 

        var _shaguiType;
        if(atClub)
            _shaguiType = this.getNumberItem("shaguiType",0);
        else
            _shaguiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_shaguiType, 0);
 
        this.shaguiTypeList_radio.selectItem(_shaguiType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("shaguiType1"));
        list.push(_play.getChildByName("shaguiType2"));
        list.push(_play.getChildByName("shaguiType3"));
        this.radioBoxSelectCB(_shaguiType,list[_shaguiType],list); 

        var _wuguiType;
        if(atClub)
            _wuguiType = this.getNumberItem("wuguiType",0);
        else
            _wuguiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_wuguiType, 0);
 
        this.wuguiTypeList_radio.selectItem(_wuguiType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("wuguiType1"));
        list.push(_play.getChildByName("wuguiType2"));
        list.push(_play.getChildByName("wuguiType3"));
        this.radioBoxSelectCB(_wuguiType,list[_wuguiType],list); 

        var _diFen = 0;
        if (atClub){
            if(this.getNumberItem("diFen", -1) > -1){
                _diFen = 1;
                _play.getChildByName("fanBei1").getChildByName("score").setString(this.getNumberItem("diFen", -1) + "分");
            }
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_diFen_score, -1);
            if(index > -1){
                _diFen = 1;
                _play.getChildByName("fanBei1").getChildByName("score").setString(index + "分");
            }
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        list.push(_play.getChildByName("fanBei0"));
        list.push(_play.getChildByName("fanBei1"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);

        var _qishouhu;
        if(atClub)
            _qishouhu = this.getBoolItem("isQishouhu",true);
        else
            _qishouhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_leiyangGMJ_qishouhu, true);


        this.qishouhu.setSelected(_qishouhu);
        //fix by 千千
        var txt = this.qishouhu.getChildByName("text");
        if(_qishouhu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        var _qiangganghu;
        if(atClub)
            _qiangganghu = this.getBoolItem("isQiangganghu",false);
        else
            _qiangganghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_leiyangGMJ_qiangganghu, false);

        this.qiangganghu.setSelected(_qiangganghu);
        //fix by 千千
        var txt = this.qiangganghu.getChildByName("text");
        if(_qiangganghu){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        this.qianggangquanbao.setVisible(_qiangganghu);

        var _qianggangquanbao;
        if(atClub)
            _qianggangquanbao = this.getBoolItem("isQianggangquanbao",false);
        else
            _qianggangquanbao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_leiyangGMJ_qianggangquanbao, false);

        this.qianggangquanbao.setSelected(_qianggangquanbao);
        //fix by 千千
        var txt = this.qianggangquanbao.getChildByName("text");
        if(_qianggangquanbao){
            txt.setTextColor(selectColor);
        }else{
            txt.setTextColor(unSelectColor);
        }

        if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
            MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            // 积分底分
            var _jieSuanDiFen;
            if (atClub) {
                _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
            } else {
                _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_jieSuanDiFen, 1);
            }
            var score = this.bg_node.parent.getChildByName("score");
            if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
                score = _play.getChildByName("jieSuanDiFen").getChildByName("score");
            }
            this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
            score.setString(_jieSuanDiFen);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            var zhuangJia;
            if (atClub) {
                zhuangJia = this.getNumberItem("zhuangJia", 0);
            } else {
                zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuangJia, 0);
            }
            this.zhuangJiaList_radio.selectItem(zhuangJia);
            this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);
        }

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var tuoGuan;
            if (atClub)
                tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
            else
                tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_tuoGuan, -1));
            this.tuoGuanList_radio.selectItem(tuoGuan);
            this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);
        }

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var zhuaniaoIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.LEI_YANG_GMJ;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.zhuaniaoNum = [1,2,4,6][zhuaniaoIndex];
        para.guipaiType = this.guipaiTypeList_radio.getSelectIndex();
        para.shaguiType = this.shaguiTypeList_radio.getSelectIndex();
        para.wuguiType = this.wuguiTypeList_radio.getSelectIndex();
        para.isQishouhu = this.qishouhu.isSelected();
        para.isQiangganghu = this.qiangganghu.isSelected();
        para.isQianggangquanbao = para.isQiangganghu ? this.qianggangquanbao.isSelected() : false;
        para.diFen = [-1,5][this.diFenList_radio.getSelectIndex()];
        if(para.diFen > -1){
            para.diFen = parseInt(this.diFenList_radio.getSelectItem().getChildByName("score").getString());
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
            MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            var score = this.bg_node.parent.getChildByName("score"); 
            if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
                var _play = this.bg_node.getChildByName("play");
                score = _play.getChildByName("jieSuanDiFen").getChildByName("score");
            }
            para.jieSuanDiFen = Number(score.getString());
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            para.zhuangJia = this.zhuangJiaList_radio.getSelectIndex();
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        }

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_guipaiType, para.guipaiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuaNiaoType, zhuaniaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_shaguiType, para.shaguiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_wuguiType, para.wuguiType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qishouhu, para.isQishouhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qiangganghu, para.isQiangganghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qianggangquanbao, this.qianggangquanbao.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_diFen_score, para.diFen);
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
                MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_jieSuanDiFen,para.jieSuanDiFen);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuangJia, para.zhuangJia);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_tuoGuan, para.trustTime);
            }
        }

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // if(4 > MjClient.MaxPlayerNum){
        //     this.fangzhuPay = {pay4:majiang['roundLeiYangGMJ4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundLeiYangGMJ8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundLeiYangGMJ16P' +  MjClient.MaxPlayerNum ]};
        //     this.AAPay = {pay4:majiang['roundLeiYangGMJAA4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundLeiYangGMJAA8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundLeiYangGMJAA16P' +  MjClient.MaxPlayerNum ]};
        // }else{
        //     this.fangzhuPay = {pay4:majiang.roundLeiYangGMJ4, pay8:majiang.roundLeiYangGMJ8, pay16:majiang.roundLeiYangGMJ16};
        //     this.AAPay = {pay4:majiang.roundLeiYangGMJAA4,pay8:majiang.roundLeiYangGMJAA8,pay16:majiang.roundLeiYangGMJAA16};
        // }
        // this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});