/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_jianghuaMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if(!this._isFriendCard){
            this.localStorageKey.KEY_jianghuaMJ_maxPlayer       = "_jianghuaMJ_maxPlayer";          //几人玩
            this.localStorageKey.KEY_jianghuaMJ_zhuaNiaoType    = "_jianghuaMJ_zhuaNiaoType";       //送码/抓鸟
            this.localStorageKey.KEY_jianghuaMJ_guipaiType      = "_jianghuaMJ_guipaiType";         //鬼牌
            this.localStorageKey.KEY_jianghuaMJ_shaguiType      = "_jianghuaMJ_shaguiType";         //杀鬼
            this.localStorageKey.KEY_jianghuaMJ_dianpaohu       = "_jianghuaMJ__dianpaohu";     //点炮胡
            this.localStorageKey.KEY_jianghuaMJ_keyichi         = "_jianghuaMJ_keyichi";        //可以吃
            this.localStorageKey.KEY_jianghuaMJ_gangsuihu       = "_jianghuaMJ_gangsuihu";      //杠随胡
            this.localStorageKey.KEY_jianghuaMJ_daxiaodao       = "_jianghuaMJ_daxiaodao";      //大小道
            this.localStorageKey.KEY_jianghuaMJ_youtao          = "_jianghuaMJ_youtao";      //有套
            this.localStorageKey.KEY_jianghuaMJ_fengdingType    = "_jianghuaMJ_fengdingType";       //封顶
        }

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundYZMaJiang4,  pay8:majiang.roundYZMaJiang8,  pay16:majiang.roundYZMaJiang16};
        // this.AAPay      = {pay4:majiang.roundYZMaJiangAA4,pay8:majiang.roundYZMaJiangAA8,pay16:majiang.roundYZMaJiangAA16};
        // this.clubPay    = {pay4:majiang.roundYZMaJiangCL4,pay8:majiang.roundYZMaJiangCL8,pay16:majiang.roundYZMaJiangCL16};

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};

        this.bg_node = ccs.load("bg_jianghuaMJ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_GMJ");
        this.bg_node = this.bg_node.getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play"); 

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
		this.initPlayNumNode(maxPlayerList, [4, 3]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio),maxPlayerList[1].getChildByName("text"));

        var zhuaNiaoTypeList = [];
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType1"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType2"));
        zhuaNiaoTypeList.push(_play.getChildByName("zhuaniaoType3"));
        this.zhuaNiaoTypeList_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeList,this.radioBoxSelectCB);

        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,0,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,1,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuaNiaoTypeList,2,this.zhuaNiaoTypeList_radio),zhuaNiaoTypeList[2].getChildByName("text"));

        this.dianpaohu = _play.getChildByName("dianpaohu");
        cc.eventManager.addListener(this.setTextClick(),this.dianpaohu.getChildByName("text"));
        //fix by 千千
         this.dianpaohu.addEventListener(this._clickCB, this.dianpaohu);

        this.keyichi = _play.getChildByName("keyichi");
        cc.eventManager.addListener(this.setTextClick(),this.keyichi.getChildByName("text"));
        //fix by 千千
         this.keyichi.addEventListener(this._clickCB, this.keyichi);

        this.gangsuihu = _play.getChildByName("gangsuihu");
        cc.eventManager.addListener(this.setTextClick(),this.gangsuihu.getChildByName("text"));
        //fix by 千千
         this.gangsuihu.addEventListener(this._clickCB, this.gangsuihu);

        this.daxiaodao = _play.getChildByName("daxiaodao");
        cc.eventManager.addListener(this.setTextClick(),this.daxiaodao.getChildByName("text"));
        //fix by 千千
         this.daxiaodao.addEventListener(this._clickCB, this.daxiaodao);

         this.youtao = _play.getChildByName("youtao");
        cc.eventManager.addListener(this.setTextClick(),this.youtao.getChildByName("text"));
        //fix by 千千
         this.youtao.addEventListener(this._clickCB, this.youtao);

        var fengdingTypeList = [];
        fengdingTypeList.push(_play.getChildByName("fengding0"));
        fengdingTypeList.push(_play.getChildByName("fengding1"));
        fengdingTypeList.push(_play.getChildByName("fengding2"));
        fengdingTypeList.push(_play.getChildByName("fengding3"));
        this.fengdingTypeList_radio = createRadioBoxForCheckBoxs(fengdingTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,0,this.fengdingTypeList_radio),fengdingTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,1,this.fengdingTypeList_radio),fengdingTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,2,this.fengdingTypeList_radio),fengdingTypeList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(fengdingTypeList,3,this.fengdingTypeList_radio),fengdingTypeList[3].getChildByName("text"));

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

    setPlayNodeCurrentSelect:function(isClub)
    {
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play"); 
        
        var list = [];
        index = 0;

        var _maxPlayer;
        if(isClub){
            _maxPlayer = [4,3].indexOf(this.getNumberItem("maxPlayer",4));
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jianghuaMJ_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        //fix by 千千
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _zhuaNiaoType;
        if(isClub){
            _zhuaNiaoType = [0,2,4].indexOf(this.getNumberItem("songma",0));
        }else{
            _zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jianghuaMJ_zhuaNiaoType, 0);
        }
        this.zhuaNiaoTypeList_radio.selectItem(_zhuaNiaoType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("zhuaniaoType1"));
        list.push(_play.getChildByName("zhuaniaoType2"));
        list.push(_play.getChildByName("zhuaniaoType3"));
        this.radioBoxSelectCB(_zhuaNiaoType,list[_zhuaNiaoType],list); 

        var _dianpaohu;
        if(isClub) {
            _dianpaohu = this.getBoolItem("dianpaohu", true);
        }else{
            _dianpaohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jianghuaMJ_dianpaohu, true);
        }
        this.dianpaohu.setSelected(_dianpaohu);
        //fix by 千千
        var txt = this.dianpaohu.getChildByName("text");
        this.radioTextColor(txt, _dianpaohu);

        var _keyichi;
        if(isClub){
            _keyichi = this.getBoolItem("caneat", false);
        }else{
            _keyichi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jianghuaMJ_keyichi, false);
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

        var _gangsuihu;
        if(isClub){
            _gangsuihu = this.getBoolItem("gangsuihu", false);
        }else{
            _gangsuihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jianghuaMJ_gangsuihu, false);
        }
        this.gangsuihu.setSelected(_gangsuihu);
        //fix by 千千
        var txt = this.gangsuihu.getChildByName("text");
        this.radioTextColor(txt, _gangsuihu);
        // if(_gangsuihu){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _youtao;
        if(isClub){
            _youtao = this.getBoolItem("youtao", false);
        }else{
            _youtao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jianghuaMJ_youtao, false);
        }
        this.youtao.setSelected(_youtao);
        //fix by 千千
        var txt = this.youtao.getChildByName("text");
        this.radioTextColor(txt, _youtao);
        // if(_youtao){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _daxiaodao;
        if(isClub){
            _daxiaodao = this.getBoolItem("daxiaodao", false);
        }else{
            _daxiaodao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jianghuaMJ_daxiaodao, false);
        }
        this.daxiaodao.setSelected(_daxiaodao);
        //fix by 千千
        var txt = this.daxiaodao.getChildByName("text");
        this.radioTextColor(txt, _daxiaodao);
        // if(_daxiaodao){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        var _fengdingType;
        if(isClub){
            _fengdingType = [0,16,32,64].indexOf(this.getNumberItem("fengding", 0));
        }else{
            _fengdingType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jianghuaMJ_fengdingType, 0);
        }
        this.fengdingTypeList_radio.selectItem(_fengdingType);
        //fix by 千千
        list = [];
        list.push(_play.getChildByName("fengding0"));
        list.push(_play.getChildByName("fengding1"));
        list.push(_play.getChildByName("fengding2"));
        list.push(_play.getChildByName("fengding3"));
        this.radioBoxSelectCB(_fengdingType,list[_fengdingType],list); 

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        var zhuaniaoIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();
        var fengdingIndex = this.fengdingTypeList_radio.getSelectIndex();

        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIANG_HUA_MJ;
        para.maxPlayer = [4,3][maxPlayerIndex];
        para.songma = [0,2,4][zhuaniaoIndex];
        para.dianpaohu = this.dianpaohu.isSelected();
        para.caneat = this.keyichi.isSelected();
        para.gangsuihu = this.gangsuihu.isSelected();
        para.daxiaodao = this.daxiaodao.isSelected();
        para.youtao = this.youtao.isSelected();
        para.fengding = [0,16,32,64][fengdingIndex];

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jianghuaMJ_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jianghuaMJ_zhuaNiaoType, zhuaniaoIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_dianpaohu, para.dianpaohu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_keyichi, para.caneat);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_gangsuihu, para.gangsuihu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_daxiaodao, para.daxiaodao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_youtao, para.youtao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jianghuaMJ_fengdingType, fengdingIndex);
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
    }
});