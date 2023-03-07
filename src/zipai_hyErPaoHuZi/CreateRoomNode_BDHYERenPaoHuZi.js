/**
 * Created by WuXiaoDong on 2017/12/16.
 */


var CreateRoomNode_BDHYERenPaoHuZi = CreateRoomNode.extend({
    initAll:function()
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        
        if (!this._isFriendCard){
            this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype     = "BDHYERenPaoHuZi_huxitype";          //21胡息or卡20张
            this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai       = "BDHYERenPaoHuZi_qiepai";           //切牌
            //this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen= "_BDHYERenPaoHuZ_diFen";   //低分翻倍
            this.localStorageKey.KEY_BDHYERenPaoHuZi_zhuangjia       = "BDHYERenPaoHuZi_zhuangjia";           //庄家
        }
        this.setExtraKey({
            fanBei: "_BDHYERenPaoHuZi_FAN_BEI",  //大结算翻倍
            fanBeiScore: "_BDHYERenPaoHuZi_FAN_BEI_SCORE",  //少于X分大结算翻倍
            jieSuanDiFen: "_BDHYERenPaoHuZi_JIE_SUAN_DI_FEN",  //积分底分
        });
        this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16};
        if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP || 
            MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
            this.roundNumObj = {roundNum1:16, roundNum2:10, roundNum3:20};
        }

        this.bg_node = ccs.load("bg_hyErPaoHuZi.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hyShiHuKa");
        if(this.bg_node.getChildByName("view")){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var playNode = this.bg_node.getChildByName("play");

        //玩法type
       var huxiTypeList = [];
        huxiTypeList.push(playNode.getChildByName("ershiyihuxi"));
        huxiTypeList.push(playNode.getChildByName("kaershizhang"));
        this.huxiTypeList_radio = createRadioBoxForCheckBoxs(huxiTypeList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(huxiTypeList,0,this.huxiTypeList_radio),huxiTypeList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(huxiTypeList,1,this.huxiTypeList_radio),huxiTypeList[1].getChildByName("text"));
        this.huxiTypeList = huxiTypeList;

        //切牌
        var cutCardList = [];
        cutCardList.push(playNode.getChildByName("autoCut"));
        cutCardList.push(playNode.getChildByName("manualCut"));
        this.cutCardList_radio = createRadioBoxForCheckBoxs(cutCardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cutCardList,0,this.cutCardList_radio),cutCardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cutCardList,1,this.cutCardList_radio),cutCardList[1].getChildByName("text"));
        this.cutCardList_node = cutCardList;

        //低分翻倍
        /*var diFenList = [];
        diFenList.push(playNode.getChildByName("fanBei0"));
        diFenList.push(playNode.getChildByName("fanBei1"));
        diFenList.push(playNode.getChildByName("fanBei5"));
        diFenList.push(playNode.getChildByName("fanBei2"));
        diFenList.push(playNode.getChildByName("fanBei3"));
        diFenList.push(playNode.getChildByName("fanBei4"));
        this.diFenList_radio = createRadioBoxForCheckBoxs(diFenList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(diFenList,0,this.diFenList_radio),diFenList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,1,this.diFenList_radio),diFenList[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,2,this.diFenList_radio),diFenList[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,3,this.diFenList_radio),diFenList[3].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,4,this.diFenList_radio),diFenList[4].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(diFenList,5,this.diFenList_radio),diFenList[5].getChildByName("text"));*/

        var zhuangJiaList = [];
        zhuangJiaList.push(playNode.getChildByName("zhuangJia1"));
        zhuangJiaList.push(playNode.getChildByName("zhuangJia2"));
        this.zhuangJiaRadioList = createRadioBoxForCheckBoxs(zhuangJiaList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,0,this.zhuangJiaRadioList),zhuangJiaList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(zhuangJiaList,1,this.zhuangJiaRadioList),zhuangJiaList[1].getChildByName("text"));
        this.zhuangJiaList = zhuangJiaList;

        this.initExtraPlayNode(playNode);
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var huxiType;
        if(atClub){
            huxiType = this.getNumberItem("huxiType", 0) ;
        }else{
            huxiType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype, 0);
        }
        this.huxiTypeList_radio.selectItem(huxiType);
        this.radioBoxSelectCB(huxiType,this.huxiTypeList[huxiType],this.huxiTypeList);

        var cutCard;
        if (atClub){
            cutCard= this.getBoolItem("isManualCutCard", false) ? 1 : 0;
        }
        else{
            cutCard = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai, 0);
        }
        this.cutCardList_radio.selectItem(cutCard);
        this.radioBoxSelectCB(cutCard,this.cutCardList_node[cutCard],this.cutCardList_node);

        /*var _diFen;
        if (atClub){
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[this.getNumberItem("diFen", -1)];
        }else{
            var index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen, -1);
            _diFen = {"-1":0, 10:1, 15:2, 20:3, 30:4, 10000:5}[index];
        }
        this.diFenList_radio.selectItem(_diFen);
        list = [];
        var playNode = this.bg_node.getChildByName("play");
        list.push(playNode.getChildByName("fanBei0"));
        list.push(playNode.getChildByName("fanBei1"));
        list.push(playNode.getChildByName("fanBei5"));
        list.push(playNode.getChildByName("fanBei2"));
        list.push(playNode.getChildByName("fanBei3"));
        list.push(playNode.getChildByName("fanBei4"));
        this.radioBoxSelectCB(_diFen,list[_diFen],list);*/

        var zhuangJia;
        if (atClub){
            zhuangJia= this.getNumberItem("zhuangJia", 0);
        }
        else{
            zhuangJia = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_zhuangjia, 0);
        }
        this.zhuangJiaRadioList.selectItem(zhuangJia);
        this.radioBoxSelectCB(zhuangJia, this.zhuangJiaList[zhuangJia], this.zhuangJiaList);

        this.setExtraPlayNodeCurrentSelect(atClub);
    },

    initExtraPlayNode:function(_playWay)
    {
        // 大结算翻倍
        if (_playWay.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_playWay.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_playWay.getChildByName("play_lessthan"));
            var sanBei = _playWay.getChildByName("play_less5SanBei")
            if (sanBei) nodeListFanBei.push(sanBei);
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB.bind(this));
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
                    var curScore;
                    if(scoreLabel.getString() == "不限分"){
                        curScore = 100;
                        scoreLabel.setString(curScore + "分");
                    }else{
                        curScore = parseInt(scoreLabel.getString());
                        if(curScore == 10){
                            scoreLabel.setString("不限分");
                        }else{
                            curScore -= 5;
                            scoreLabel.setString(curScore + "分");
                        }
                    }
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore;
                    if(scoreLabel.getString() == "不限分"){
                        curScore = 10;
                        scoreLabel.setString(curScore + "分");
                    }else{
                        curScore = parseInt(scoreLabel.getString());
                        if(curScore == 100){
                            scoreLabel.setString("不限分");
                        }else{
                            curScore += 5;
                            scoreLabel.setString(curScore + "分");
                        }
                    }
                }
            }, this);
        }

        //积分底分
        var i = 3;
        var jieSuanDiFenParent = _playWay;
        while(i >= 0){
            this.jieSuanDiFen = jieSuanDiFenParent.getChildByName("jieSuanDiFen");
            if(this.jieSuanDiFen){
                break;
            }
            jieSuanDiFenParent = jieSuanDiFenParent.getParent();
            if(!jieSuanDiFenParent){
                break;
            }
            i--;
        }
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = parseInt(text_diFen.getString());
                diFen -= 1;
                if(diFen < 1){
                    diFen = 10;
                }
                text_diFen.setString(diFen + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = parseInt(text_diFen.getString());
                diFen += 1;
                if(diFen > 10 ){
                    diFen = 1;
                }
                text_diFen.setString(diFen + "");
            });
        }
    },
    setExtraPlayNodeCurrentSelect:function(isClub)
    {
        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("diFen", -1);
                fanBeiOption = fanBeiScore == - 1 ? 0 : 1;
                fanBeiScore = fanBeiScore == - 1 ? util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10) : fanBeiScore;
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.fanBeiScore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            if(fanBeiScore == 10000){
                this.nodeListFanBei[1].getChildByName("score").setString("不限分");
            }else{
                this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            }

            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }
    },
    getExtraSelectedPara:function(para)
    {
        var fanBeiOption;
        var fanBeiScore;
        if (this.fanbei_radio) {
            if(this.nodeListFanBei[1].getChildByName("score").getString() == "不限分"){
                fanBeiScore = 10000;
            }else{
                fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            }
            fanBeiOption = this.fanbei_radio.getSelectIndex();
            para.diFen = fanBeiOption == 0 ? -1 : fanBeiScore;
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseInt(text_diFen.getString());
        }

        if (!this._isFriendCard) {
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBei, fanBeiOption);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.fanBeiScore, fanBeiScore);
            }

            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.jieSuanDiFen, para.jieSuanDiFen);
            }
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HY_ER_PAO_HU_ZI;
        para.maxPlayer = 2;//人数
        para.huxiType = this.huxiTypeList_radio.getSelectIndex();
        para.isManualCutCard = this.cutCardList_radio.getSelectIndex() == 0 ? false : true;
        //para.diFen = [-1,10,15,20,30,10000][this.diFenList_radio.getSelectIndex()];
        para.zhuangJia = this.zhuangJiaRadioList.getSelectIndex();

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_huxitype, para.huxiType);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_qiepai, this.cutCardList_radio.getSelectIndex());
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_diFen, para.diFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_BDHYERenPaoHuZi_zhuangjia, para.zhuangJia);
        }

        return para;
    },
    changeAAPayForPlayerNum:function()
    {
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang['roundHYSHK4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHK8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHK16P' +  MjClient.MaxPlayerNum ]};
        // this.AAPay = {pay4:majiang['roundHYSHKAA4P' +  MjClient.MaxPlayerNum ], pay8:majiang['roundHYSHKAA8P' +  MjClient.MaxPlayerNum ], pay16:majiang['roundHYSHKAA16P' +  MjClient.MaxPlayerNum ]};
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
    }
});