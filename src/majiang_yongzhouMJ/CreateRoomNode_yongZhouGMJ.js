/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_yongZhouGMJ = CreateRoomNode.extend({
    onExit:function()
    {
        this._super();
        MjClient.MaxPlayerNum = 4;
    },
    initAll:function()
    {
        if (!this._isFriendCard){
            this.localStorageKey.KEY_yongZhouGMJ_maxPlayer       = "_yongZhouGMJ_maxPlayer";     //几人玩
            this.localStorageKey.KEY_yongZhouGMJ_zhuaNiaoType    = "_yongZhouGMJ_zhuaNiaoType";  //抓鸟
            this.localStorageKey.KEY_yongZhouGMJ_dianpaohu       = "_yongZhouGMJ__dianpaohu";    //点炮胡
            this.localStorageKey.KEY_yongZhouGMJ_keyichi         = "_yongZhouGMJ_keyichi";       //可以吃
            this.localStorageKey.KEY_yongZhouGMJ_gangsuihu       = "_yongZhouGMJ_gangsuihu";     //杠随胡
            this.localStorageKey.KEY_yongZhouGMJ_openStatus      = "_yongZhouGMJ_openStatus";    //开放状态
            this.localStorageKey.KEY_yongZhouGMJ_huType          = "_yongZhouGMJ_huType";        //胡的类型
        }

        this.roundNumObj = {roundNum1:4, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
            this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};
        }
        
        this.bg_node = ccs.load("bg_yongZhouGMJ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_GMJ");
        this.bg_node = this.bg_node.getChildByName("view");
    },
    initPlayNode:function()
    {
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play"); 
        //人数
        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer4"));
        maxPlayerList.push(_play.getChildByName("maxPlayer3"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
		this.initPlayNumNode(maxPlayerList, [4, 3, 2]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio),maxPlayerList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,2,this.maxPlayerList_radio),maxPlayerList[2].getChildByName("text"));
        //抓鸟
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
        //胡牌类型
        var huTypeList = [];
        huTypeList.push(_play.getChildByName("zimohu"));
        huTypeList.push(_play.getChildByName("dianpaohu"));
        this.huTypeList_radio = createRadioBoxForCheckBoxs(huTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huTypeList,0,this.huTypeList_radio),huTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huTypeList,1,this.huTypeList_radio),huTypeList[1].getChildByName("text"));
        //开放类型
        var openTypeList = [];
        openTypeList.push(_play.getChildByName("open_1"));
        openTypeList.push(_play.getChildByName("open_2"));
        openTypeList.push(_play.getChildByName("open_3"));
        this.openTypeList_radio = createRadioBoxForCheckBoxs(openTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(openTypeList,0,this.openTypeList_radio),openTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(openTypeList,1,this.openTypeList_radio),openTypeList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(openTypeList,2,this.openTypeList_radio),openTypeList[2].getChildByName("text"));
        //可以吃
        this.keyichi = _play.getChildByName("keyichi");
        cc.eventManager.addListener(this.setTextClick(),this.keyichi.getChildByName("text"));
        this.keyichi.addEventListener(this._clickCB, this.keyichi);
        //杠随胡
        this.gangsuihu = _play.getChildByName("gangsuihu");
        cc.eventManager.addListener(this.setTextClick(),this.gangsuihu.getChildByName("text"));
        this.gangsuihu.addEventListener(this._clickCB, this.gangsuihu);

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
            _maxPlayer = [4,3,2].indexOf(this.getNumberItem("maxPlayer",4));
        }else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yongZhouGMJ_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        list.push(_play.getChildByName("maxPlayer4"));
        list.push(_play.getChildByName("maxPlayer3"));
        list.push(_play.getChildByName("maxPlayer2"));
        this.radioBoxSelectCB(_maxPlayer,list[_maxPlayer],list); 

        var _zhuaNiaoType;
        if(isClub){
            _zhuaNiaoType = [1,2,4,6].indexOf(this.getNumberItem("zhuaniao",6));
        }else{
            _zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yongZhouGMJ_zhuaNiaoType, 3);
        }
        this.zhuaNiaoTypeList_radio.selectItem(_zhuaNiaoType);
        list = [];
        list.push(_play.getChildByName("zhuaniaoType1"));
        list.push(_play.getChildByName("zhuaniaoType2"));
        list.push(_play.getChildByName("zhuaniaoType3"));
        list.push(_play.getChildByName("zhuaniaoType4"));
        this.radioBoxSelectCB(_zhuaNiaoType,list[_zhuaNiaoType],list); 

        var _huType;
        if(isClub){
            _huType = [0,1].indexOf(this.getNumberItem("huType",1));
        }else{
            _huType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yongZhouGMJ_huType, 1);
        }
        this.huTypeList_radio.selectItem(_huType);
        list = [];
        list.push(_play.getChildByName("zimohu"));
        list.push(_play.getChildByName("dianpaohu"));
        this.radioBoxSelectCB(_huType,list[_huType],list);

        var _openType;
        if(isClub){
            _openType = [1,2,3].indexOf(this.getNumberItem("openType",1));
        }else{
            _openType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yongZhouGMJ_openStatus, 0);
        }
        this.openTypeList_radio.selectItem(_openType);
        list = [];
        list.push(_play.getChildByName("open_1"));
        list.push(_play.getChildByName("open_2"));
        list.push(_play.getChildByName("open_3"));
        this.radioBoxSelectCB(_openType,list[_openType],list);

        var _keyichi;
        if(isClub){
            _keyichi = this.getBoolItem("caneat",false);
        }else{
            _keyichi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yongZhouGMJ_keyichi, false);
        }
        this.keyichi.setSelected(_keyichi);
        //fix by 千千
        var txt = this.keyichi.getChildByName("text");
        this.radioTextColor(txt, _keyichi);

        var _gangsuihu;
        if(isClub){
            _gangsuihu = this.getBoolItem("gangsuihu",false);
        }else{
            _gangsuihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_yongZhouGMJ_gangsuihu, false);
        }
        this.gangsuihu.setSelected(_gangsuihu);
        //fix by 千千
        var txt = this.gangsuihu.getChildByName("text");
        this.radioTextColor(txt, _gangsuihu);

        // 这一行代码必须在最后，因为他会间接调用getSelectedPara
        this.changeAAPayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YONG_ZHOU_MJ;

        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex();
        para.maxPlayer = [4,3,2][maxPlayerIndex];

        var zhuaniaoIndex = this.zhuaNiaoTypeList_radio.getSelectIndex();
        para.zhuaniao = [1,2,4,6][zhuaniaoIndex];

        para.huType = this.huTypeList_radio.getSelectIndex();

        var openTypeIndex = this.openTypeList_radio.getSelectIndex();
        para.openType = [1,2,3][openTypeIndex];

        para.caneat = this.keyichi.isSelected();
        para.gangsuihu = this.gangsuihu.isSelected();

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yongZhouGMJ_maxPlayer, maxPlayerIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yongZhouGMJ_zhuaNiaoType, zhuaniaoIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yongZhouGMJ_huType, para.huType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yongZhouGMJ_openStatus, openTypeIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yongZhouGMJ_keyichi, para.caneat);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_yongZhouGMJ_gangsuihu, para.gangsuihu);
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