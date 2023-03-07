/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_leiyangGMJ = CreateRoomNode.extend({
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
            this.localStorageKey.KEY_leiyangGMJ_qishouhu        = "_leiyangGMJ_qishouhu";           //起手胡
            this.localStorageKey.KEY_leiyangGMJ_qiangganghu     = "_leiyangGMJ_qiangganghu";        //抢杠胡
            this.localStorageKey.KEY_leiyangGMJ_qianggangquanbao= "_leiyangGMJ_qianggangquanbao";   //抢杠全包
            this.localStorageKey.KEY_leiyangGMJ_zhuangJia       = "_leiyangGMJ_zhuangJia";          //庄家
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
        if(this.bg_node.getChildByName("view")){
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
        this.guipaiTypeList_radio = createRadioBoxForCheckBoxs(guipaiTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(guipaiTypeList,0,this.guipaiTypeList_radio),guipaiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(guipaiTypeList,1,this.guipaiTypeList_radio),guipaiTypeList[1].getChildByName("text"));

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

        this.qishouhu = _play.getChildByName("qishouhu");
        cc.eventManager.addListener(this.setTextClick(),this.qishouhu.getChildByName("text"));
        //fix by 千千
         this.qishouhu.addEventListener(this._clickCB, this.qishouhu);

        this.qiangganghu = _play.getChildByName("qiangganghu");
        cc.eventManager.addListener(this.setTextClick(),this.qiangganghu.getChildByName("text"));
        //fix by 千千
         this.qiangganghu.addEventListener(this._clickCB, this.qiangganghu);

        this.qianggangquanbao = _play.getChildByName("qianggangquanbao");
        this.qianggangquanbao.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.qianggangquanbao.getChildByName("text"));
        //fix by 千千
         this.qianggangquanbao.addEventListener(this._clickCB, this.qianggangquanbao);

        var zhuangJiaList = [];
        zhuangJiaList.push(_play.getChildByName("zhuangJia1"));
        zhuangJiaList.push(_play.getChildByName("zhuangJia2"));
        this.zhuangJiaList_radio = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaList_radio),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaList_radio),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

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

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(211,38,14));
                    }else{
                        txt.setTextColor(cc.color(68,51,51));
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {

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

        var _qishouhu;
        if(atClub)
            _qishouhu = this.getBoolItem("isQishouhu",true);
        else
            _qishouhu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_leiyangGMJ_qishouhu, true);


        this.qishouhu.setSelected(_qishouhu);
        //fix by 千千
        var txt = this.qishouhu.getChildByName("text");
        if(_qishouhu){
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
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
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
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
            txt.setTextColor(cc.color(211,38,14));
        }else{
            txt.setTextColor(cc.color(68,51,51));
        }

        var zhuangJia;
        if(atClub)
            zhuangJia = this.getNumberItem("zhuangJia",0);
        else
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuangJia, 0);

        this.zhuangJiaList_radio.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia,this.zhuangJiaList[zhuangJia],this.zhuangJiaList);

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
        para.isQishouhu = this.qishouhu.isSelected();
        para.isQiangganghu = this.qiangganghu.isSelected();
        para.isQianggangquanbao = para.isQiangganghu ? this.qianggangquanbao.isSelected() : false;
        para.zhuangJia = this.zhuangJiaList_radio.getSelectIndex();

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_guipaiType, para.guipaiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuaNiaoType, zhuaniaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_shaguiType, para.shaguiType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qishouhu, para.isQishouhu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qiangganghu, para.isQiangganghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_leiyangGMJ_qianggangquanbao, this.qianggangquanbao.isSelected());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_leiyangGMJ_zhuangJia, para.zhuangJia);
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