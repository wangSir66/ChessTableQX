/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_daozhouMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_daozhouMJ_maxPlayer       = "_daozhouMJ_maxPlayer";          //几人玩
            this.localStorageKey.KEY_daozhouMJ_zhuaNiaoType    = "_daozhouMJ_zhuaNiaoType";       //送码/抓鸟
            this.localStorageKey.KEY_daozhouMJ_dianpaohu       = "_daozhouMJ__dianpaohu";     //自模胡
            this.localStorageKey.KEY_daozhouMJ_keyichi         = "_daozhouMJ_keyichi";        //可以吃
            this.localStorageKey.KEY_daozhouMJ_gangsuihu       = "_daozhouMJ_gangsuihu";      //杠随胡
            this.localStorageKey.KEY_daozhouMJ_daxiaodao       = "_daozhouMJ_daxiaodao";      //大小道
            this.localStorageKey.KEY_daozhouMJ_youtao          = "_daozhouMJ_youtao";      //有套
            this.localStorageKey.KEY_daozhouMJ_fengdingType    = "_daozhouMJ_fengdingType";       //封顶
            this.localStorageKey.KEY_daozhouMJ_kepiao          = "_daozhouMJ_kepiao";       //可飘
            this.localStorageKey.KEY_daozhouMJ_hunyise         = "_daozhouMJ_hunyise";       //混一色
            this.localStorageKey.KEY_daozhouMJ_zuopiao         = "_daozhouMJ_zuopiao";       //坐飘
            this.localStorageKey.KEY_daozhouMJ_wangzhua        = "_daozhouMJ_wangzhua";       //王抓
            this.localStorageKey.KEY_daozhouMJ_zhuama          = "_daozhouMJ_zhuama";       //抓码
            
        }

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundYZMaJiang4,  pay8:majiang.roundYZMaJiang8,  pay16:majiang.roundYZMaJiang16};
        // this.AAPay      = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        // this.clubPay    = {pay4:majiang.roundYZMaJiangCL4,pay8:majiang.roundYZMaJiangCL8,pay16:majiang.roundYZMaJiangCL16};

        this.roundNumObj = {roundNum1:8, roundNum2:10};

        this.bg_node = ccs.load("bg_daozhouMJ.json").node;
        this.addChild(this.bg_node); 
        this.bg_node = this.bg_node.getChildByName("bg_GMJ").getChildByName("view");
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

        // var zhuaNiaoTypeList = [];
        // zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        // zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        // zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        // this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,0,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,1,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[1].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,2,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[2].getChildByName("text"));

        this.dianpaohu = _play.getChildByName("dianpaohu");
        cc.eventManager.addListener(this.setTextClick(),this.dianpaohu.getChildByName("text"));
        //fix by 千千
         this.dianpaohu.addEventListener(this._clickCB, this.dianpaohu);

        this.keyichi = _play.getChildByName("keyichi");
        cc.eventManager.addListener(this.setTextClick(),this.keyichi.getChildByName("text"));
        //fix by 千千
        this.keyichi.addEventListener(this._clickCB, this.keyichi);

        this.hunyise = _play.getChildByName("hunyise");
        cc.eventManager.addListener(this.setTextClick(),this.hunyise.getChildByName("text"));
        this.hunyise.addEventListener(this._clickCB, this.hunyise);

        this.kepiao = _play.getChildByName("kepiao");
        cc.eventManager.addListener(this.setTextClick(),this.kepiao.getChildByName("text"));
        //fix by 千千
        this.kepiao.addEventListener(this._clickCB, this.kepiao);

        // this.gangsuihu = _play.getChildByName("gangsuihu");
        // cc.eventManager.addListener(this.setTextClick(),this.gangsuihu.getChildByName("text"));
        // //fix by 千千
        // this.gangsuihu.addEventListener(this._clickCB, this.gangsuihu);

        // this.daxiaodao = _play.getChildByName("daxiaodao");
        // cc.eventManager.addListener(this.setTextClick(),this.daxiaodao.getChildByName("text"));
        // //fix by 千千
        //  this.daxiaodao.addEventListener(this._clickCB, this.daxiaodao);

        // this.youtao = _play.getChildByName("youtao");
        // cc.eventManager.addListener(this.setTextClick(),this.youtao.getChildByName("text"));
        // //fix by 千千
        // this.youtao.addEventListener(this._clickCB, this.youtao);

        //坐飘
        var zuoPiaoList = [];
        zuoPiaoList.push(_play.getChildByName("bupiao"));
        zuoPiaoList.push(_play.getChildByName("piao_1"));
        zuoPiaoList.push(_play.getChildByName("piao_3"));
        zuoPiaoList.push(_play.getChildByName("piao_5"));
        this.zuoPiaoList_radio = createRadioBoxForCheckBoxs(zuoPiaoList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(zuoPiaoList,0,this.zuoPiaoList_radio),zuoPiaoList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoPiaoList,1,this.zuoPiaoList_radio),zuoPiaoList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoPiaoList,2,this.zuoPiaoList_radio),zuoPiaoList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zuoPiaoList,3,this.zuoPiaoList_radio),zuoPiaoList[3].getChildByName("text"));

        //王抓
        var wangZhuaList = [];
        wangZhuaList.push(_play.getChildByName("mingzhua"));
        wangZhuaList.push(_play.getChildByName("anzhua"));
        this.wangZhuaList_radio = createRadioBoxForCheckBoxs(wangZhuaList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(wangZhuaList,0,this.wangZhuaList_radio),wangZhuaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(wangZhuaList,1,this.wangZhuaList_radio),wangZhuaList[1].getChildByName("text"));

        var _mingZhuaDesc = this.bg_node.getChildByName("mingDescImg");
        var _anZhuaDesc = this.bg_node.getChildByName("anDescImg");

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function (touch, event) {
                if (_mingZhuaDesc.isVisible()) {
                    _mingZhuaDesc.setVisible(false);
                    return true;
                }
                else if (_anZhuaDesc.isVisible()) {
                    _anZhuaDesc.setVisible(false);
                } else {
                    return false;
                }
            },
        }, _mingZhuaDesc);

        var mingZhuaDescBtn = _play.getChildByName("mingzhua").getChildByName("weihao");
        mingZhuaDescBtn.addTouchEventListener(function(sender,type){
            if (type == 2) {
                _mingZhuaDesc.setVisible(true);
            }
        });
        mingZhuaDescBtn.tag = 1;

        var anZhuaDescBtn = _play.getChildByName("anzhua").getChildByName("weihao");
        anZhuaDescBtn.addTouchEventListener(function(sender,type){
            if (type == 2) {
                _anZhuaDesc.setVisible(true);
            }
        });
        anZhuaDescBtn.tag = 2;            

        //封顶
        var fengdingTypeList = [];
        // fengdingTypeList.push(_play.getChildByName("fengding0"));
        fengdingTypeList.push(_play.getChildByName("fengding1"));
        fengdingTypeList.push(_play.getChildByName("fengding2"));
        fengdingTypeList.push(_play.getChildByName("fengding3"));
        this.fengdingTypeList_radio = createRadioBoxForCheckBoxs(fengdingTypeList,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(fengdingTypeList,0,this.fengdingTypeList_radio),fengdingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,0,this.fengdingTypeList_radio),fengdingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,1,this.fengdingTypeList_radio),fengdingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,2,this.fengdingTypeList_radio),fengdingTypeList[2].getChildByName("text"));

        //抓码
        if(_play.getChildByName("zhuama1")){
            var zhuaMaList = [];
            zhuaMaList.push(_play.getChildByName("zhuama1"));
            zhuaMaList.push(_play.getChildByName("zhuama2"));
            zhuaMaList.push(_play.getChildByName("zhuama3"));
            this.zhuaMaList_radio = createRadioBoxForCheckBoxs(zhuaMaList,this.radioBoxSelectCB);
            cc.eventManager.addListener(this.setTextClick(zhuaMaList,0,this.zhuaMaList_radio),zhuaMaList[0].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(zhuaMaList,1,this.zhuaMaList_radio),zhuaMaList[1].getChildByName("text"));
            cc.eventManager.addListener(this.setTextClick(zhuaMaList,2,this.zhuaMaList_radio),zhuaMaList[2].getChildByName("text"));
        }

         this.schedule(function(sender,type)
        {
            var index = this.maxPlayerList_radio.getSelectIndex();
            if (MjClient.MaxPlayerNum != 4 - index)
            {
                MjClient.MaxPlayerNum = 4 - index;
                this.changeAAPayForPlayerNum();
            }

        },0.1);
    },

    _clickCB : function(sender,type){
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                var txt = sender.getChildByName("text");
                var selectColor = cc.color(237,101,1);
                var unSelectColor = cc.color(158,118,78);
                if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                    selectColor = cc.color(208,88,60);
                    unSelectColor = cc.color(72,94,112);
                } else if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                    selectColor = cc.color(211,38,14);
                    unSelectColor = cc.color(68,51,51);
                }
                if(sender.isSelected()){
                    txt.setTextColor(selectColor);
                }else{
                    txt.setTextColor(unSelectColor);
                }
                break;
        }
    },

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        var list = [];
        index = 0;

        var _maxPlayer;
        if(isClub){
            _maxPlayer = [4,3,2].indexOf(this.getNumberItem("maxPlayer",3));
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_maxPlayer, 1);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        //fix by 千千
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        // var _zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_zhuaNiaoType, 0);
        // this.zhuaNiaoTypeList_radio.selectItem(_zhuaNiaoType);
        // //fix by 千千
        // list = [];
        // list.push(_play.getChildByName("zhuaniaoType1"));
        // list.push(_play.getChildByName("zhuaniaoType2"));
        // list.push(_play.getChildByName("zhuaniaoType3"));
        // this.radioBoxSelectCB(_zhuaNiaoType,list[_zhuaNiaoType],list); 

        var _dianpaohu;
        if(isClub){
            _dianpaohu = this.getBoolItem("dianpaohu",false);
        }else{
            _dianpaohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_dianpaohu, false);
        }
        this.dianpaohu.setSelected(_dianpaohu);
        //fix by 千千
        var txt = this.dianpaohu.getChildByName("text");
        this.radioTextColor(txt, _dianpaohu);
        // if(_dianpaohu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _keyichi;
        if(isClub){
            _keyichi = this.getBoolItem("caneat",true);
        }else{
            _keyichi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_keyichi, true);
        }
        this.keyichi.setSelected(_keyichi);
        //fix by 千千
        var txt = this.keyichi.getChildByName("text");
        this.radioTextColor(txt, _keyichi);
        // if(_keyichi){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        // var _gangsuihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_gangsuihu, false);
        // this.gangsuihu.setSelected(_gangsuihu);
        // //fix by 千千
        // var txt = this.gangsuihu.getChildByName("text");
        // if(_gangsuihu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        // var _youtao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_youtao, false);
        // this.youtao.setSelected(_youtao);
        // //fix by 千千
        // var txt = this.youtao.getChildByName("text");
        // if(_youtao){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        // var _daxiaodao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_daxiaodao, false);
        // this.daxiaodao.setSelected(_daxiaodao);
        // //fix by 千千
        // var txt = this.daxiaodao.getChildByName("text");
        // if(_daxiaodao){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _kepiao;
        if(isClub){
            _kepiao = this.getBoolItem("kepiao",false);
        }else{
            _kepiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_kepiao, false);
        }
        this.kepiao.setSelected(_kepiao);
        //fix by 千千
        var txt = this.kepiao.getChildByName("text");
        this.radioTextColor(txt, _kepiao);
        // if(_kepiao){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _hunyise;
        if(isClub){
            _hunyise = this.getBoolItem("hunyise",true);
        }else{
            _hunyise = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_daozhouMJ_hunyise, true);
        }
        this.hunyise.setSelected(_hunyise);
        //fix by 千千
        var txt = this.hunyise.getChildByName("text");
        this.radioTextColor(txt, _hunyise);
        // if(_hunyise){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        //坐飘
        var _zuopiaoType;
        if(isClub){
            _zuopiaoType = [0,1,2,3].indexOf(this.getNumberItem("zuopiao",0));
        }else{
            _zuopiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_zuopiao, 0);
        }
        this.zuoPiaoList_radio.selectItem(_zuopiaoType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("bupiao"));
        list.push(_play.getChildByName("piao_1"));
        list.push(_play.getChildByName("piao_3"));
        list.push(_play.getChildByName("piao_5"));
        this.radioBoxSelectCB(_zuopiaoType,list[_zuopiaoType],list);        

        //王抓
        var _wangZhuaType;
        if(isClub){
            var mingzhua = this.getBoolItem("mingzhua",true);
            _wangZhuaType = mingzhua ? 0 : 1;
        }else{
            _wangZhuaType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_wangzhua, 0);
        }
        this.wangZhuaList_radio.selectItem(_wangZhuaType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("mingzhua"));
        list.push(_play.getChildByName("anzhua"));
        this.radioBoxSelectCB(_wangZhuaType,list[_wangZhuaType],list);        

        var _fengdingType;
        if(isClub){
            _fengdingType = [16,32,64].indexOf(this.getNumberItem("fengding",32));
        }else {
            _fengdingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_fengdingType, 1);
        }
        this.fengdingTypeList_radio.selectItem(_fengdingType);
        //fix by 千千
        list = [];
        // list.push(_play.getChildByName("fengding0"));
        list.push(_play.getChildByName("fengding1"));
        list.push(_play.getChildByName("fengding2"));
        list.push(_play.getChildByName("fengding3"));
        this.radioBoxSelectCB(_fengdingType,list[_fengdingType],list); 

        //抓码
        if(this.zhuaMaList_radio){
            var zhuaMa;
            if(isClub){
                zhuaMa = this.getNumberItem("zhuaMa",0);
            }else{
                zhuaMa = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_daozhouMJ_zhuama, 0);
            }
            var zhuaMaIndex = [0,2,4].indexOf(zhuaMa);
            this.zhuaMaList_radio.selectItem(zhuaMaIndex);
            list = [];
            list.push(_play.getChildByName("zhuama1"));
            list.push(_play.getChildByName("zhuama2"));
            list.push(_play.getChildByName("zhuama3"));
            this.radioBoxSelectCB(zhuaMaIndex,list[zhuaMaIndex],list);
        } 

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        // var zhuaniaoIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();
        var fengdingIndex = this.fengdingTypeList_radio.getSelectIndex();
        var zuopiaoIndex = this.zuoPiaoList_radio.getSelectIndex();
        var wangzhuaIndex = this.wangZhuaList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.DAO_ZHOU_MJ;
        para.maxPlayer = [4,3,2][maxPlayerIndex];
        para.songma = -1;
        para.dianpaohu = this.dianpaohu.isSelected();
        para.caneat = this.keyichi.isSelected();
        para.gangsuihu = false;
        para.daxiaodao = true;
        para.youtao = true;
        para.fengding = [16,32,64][fengdingIndex];
        para.kepiao = this.kepiao.isSelected();
        para.hunyise = this.hunyise.isSelected();
        para.zuopiao = [0,1,2,3][zuopiaoIndex];
        para.zuopiaoChange = true;
        para.mingzhua = wangzhuaIndex == 0?true:false;
        if(this.zhuaMaList_radio){
            para.zhuaMa = [0,2,4][this.zhuaMaList_radio.getSelectIndex()];
        }

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_maxPlayer, maxPlayerIndex);
            // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_zhuaNiaoType, zhuaniaoIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_dianpaohu, para.dianpaohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_keyichi, para.caneat);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_gangsuihu, para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_daxiaodao, para.daxiaodao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_youtao, para.youtao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_fengdingType, fengdingIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_kepiao, para.kepiao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_daozhouMJ_hunyise, para.hunyise);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_zuopiao, para.zuopiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_wangzhua, wangzhuaIndex);
            if(this.zhuaMaList_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_daozhouMJ_zhuama, para.zhuaMa);
            }
        }

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // if(4 > MjClient.MaxPlayerNum){
        //     this.fangzhuPay = {pay4:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaJiang' +  MjClient.MaxPlayerNum ]};
        //     this.AAPay = {pay4:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay8:majiang['roundYZMaJiangAA' +  MjClient.MaxPlayerNum ], pay16:majiang['roundYZMaHiangAA' +  MjClient.MaxPlayerNum ]};
        // }else{
        //     this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
        //     this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        // }

        // this.fangzhuPay = {pay4:majiang.roundYZMaJiang4, pay8:majiang.roundYZMaJiang8, pay16:majiang.roundYZMaJiang16};
        // this.AAPay = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    },
    radioTextColor: function(textNode, isSelect){
        var selectColor = cc.color(237,101,1);
        var unSelectColor = cc.color(158,118,78);
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
            selectColor = cc.color(208,88,60);
            unSelectColor = cc.color(72,94,112);
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType() || 
            MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP){
            selectColor = cc.color(211,38,14);
            unSelectColor = cc.color(68,51,51);
        }
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            selectColor = cc.color("#d21400");
            unSelectColor = cc.color("#255662");
        }
        if(isSelect){
            textNode.setTextColor(selectColor);
        }else{
            textNode.setTextColor(unSelectColor);
        }
    }
});