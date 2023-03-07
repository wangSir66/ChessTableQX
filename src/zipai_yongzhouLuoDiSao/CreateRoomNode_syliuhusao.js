/**
 * Created by WuXiaoDong on 2017/10/9.
 */

var CreateRoomNode_syliuhusao = CreateRoomNode.extend({
    initAll:function(IsFriendCard)
    {
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP) {
            this._costName = '房卡';
        }
        
        if (!IsFriendCard) {
            this.localStorageKey.KEY_liuhusao_kingnum = "_LIU_HU_SAO_KING_NUM"; //kingnum
            this.localStorageKey.KEY_liuhusao_isfanxing = "_LIU_HU_SAO_IS_FAN_XING"; //kingnum
            this.localStorageKey.KEY_liuhusao_personCount = "_LIU_HU_SAO_PERSON_COUNT"; //personCount
            this.localStorageKey.KEY_liuhusao_fengDing = "_LIU_HU_SAO_FENG_DING";
            this.localStorageKey.Key_liuhusao_isgenxing = "_LIU_HU_SAO_IS_GEN_XING";
            this.localStorageKey.Key_liuhusao_qiepai = "_LIU_HU_SAO_QIE_PAI";//切牌
            this.localStorageKey.KEY_liuhusao_trustWay = "_liuhusao_trustWay";        //托管
        }

        this.localStorageKey.KEY_liuhusao_jieSuanDiFen= "_liuhusao_jieSuanDiFen";   //积分底分
        this.localStorageKey.KEY_liuhusao_trust = "_liuhusao_trust";        //托管
        this.localStorageKey.KEY_liuhusao_faPai = "_liuhusao_fapai";        //发牌
        this.localStorageKey.KEY_liuhusao_quanjufengding  = "_liuhusao_quanjufengding";//全局封顶
        this.bg_node = ccs.load("bg_liuhusao.json").node;
        this.addChild(this.bg_node);
        this.jieSuanDiFen = this.bg_node.getChildByName("bg_liuhusao").getChildByName("jieSuanDiFen");
        this.bg_node = this.bg_node.getChildByName("bg_liuhusao");
        this.bg_node = this.bg_node.getChildByName("view");
    },
    initPlayNode:function()
    {
        var _bgXuzhouNode = this.bg_node;

        var _play = _bgXuzhouNode.getChildByName("play");
        if(!_play) _play = _bgXuzhouNode.getChildByName("view").getChildByName("play");
        //跟醒、翻醒
        this.genXingNode_paohuzi = _play.getChildByName("play_genxing");
        this.genXingNode_paohuzi.setSelected(true);

        this.fanXingNode_paohuzi   = _play.getChildByName("play_fanxing");

        var nodeListXing = [];
        nodeListXing.push( this.genXingNode_paohuzi );
        nodeListXing.push( this.fanXingNode_paohuzi );
        this._playNode_Xing_radio = createRadioBoxForCheckBoxs(nodeListXing,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListXing,0,this._playNode_Xing_radio),nodeListXing[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListXing,1,this._playNode_Xing_radio),nodeListXing[1].getChildByName("text"));      
        //无王、单王、双王
        this.noKingNode_liuhhusao = _play.getChildByName("play_noking");       
        this.oneKingNode_liuhusao = _play.getChildByName("play_oneking");
        this.oneKingNode_liuhusao.setSelected(true);
        this.twoKingNode_liuhusao   = _play.getChildByName("play_twoking");
        this.threeKingNode_liuhusao   = _play.getChildByName("play_threeking");

        var nodeListKing = [];
        nodeListKing.push( _play.getChildByName("play_noking"));
        nodeListKing.push( _play.getChildByName("play_oneking") );
        nodeListKing.push( _play.getChildByName("play_twoking") );
        nodeListKing.push( _play.getChildByName("play_threeking") );
        this._playNode_King_radio = createRadioBoxForCheckBoxs(nodeListKing,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListKing,0,this._playNode_King_radio),nodeListKing[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListKing,1,this._playNode_King_radio),nodeListKing[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListKing,2,this._playNode_King_radio),nodeListKing[2].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListKing,3,this._playNode_King_radio),nodeListKing[3].getChildByName("text"));

        //单醒、双醒
        this.twoXingNode_paohuzi   = _play.getChildByName("play_twoxing");
        cc.eventManager.addListener(this.setTextClick(),this.twoXingNode_paohuzi.getChildByName("text"));
        this.twoXingNode_paohuzi.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(MjClient.createRoomNode._selectColor);
                    }else{
                        txt.setTextColor(MjClient.createRoomNode._unSelectColor);
                    }
                    break;
            }
        }, this.twoXingNode_paohuzi);

        //二人 三人、四人
        this.errenNode_paohuzi = _play.getChildByName("play_erren");
        this.sanrenNode_paohuzi = _play.getChildByName("play_sanren");
        this.sanrenNode_paohuzi.setSelected(true);
        this.sirenNode_paohuzi   = _play.getChildByName("play_siren");
        var nodeListplayer = [];
        nodeListplayer.push( this.errenNode_paohuzi );
        nodeListplayer.push( this.sanrenNode_paohuzi );
        nodeListplayer.push( this.sirenNode_paohuzi );
        this.initPlayNumNode(nodeListplayer, [2, 3, 4]);
        this._playNode_player_radio = createRadioBoxForCheckBoxs(nodeListplayer,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,0,this._playNode_player_radio),nodeListplayer[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,1,this._playNode_player_radio),nodeListplayer[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,2,this._playNode_player_radio),nodeListplayer[2].getChildByName("text"));

        //封顶
        this.sanbaiNode_paohuzi = _play.getChildByName("play_sanbai");
        this.sanbaiNode_paohuzi.setSelected(true);
        this.liubaiNode_paohuzi   = _play.getChildByName("play_liubai");
        this.wushangxianNode_paohuzi   = _play.getChildByName("play_wushangxian");
        var nodeListBai = [];
        nodeListBai.push( this.sanbaiNode_paohuzi );
        nodeListBai.push( this.liubaiNode_paohuzi );
        nodeListBai.push( this.wushangxianNode_paohuzi );
        this._playNode_Bai_radio = createRadioBoxForCheckBoxs(nodeListBai,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListBai,0,this._playNode_Bai_radio),nodeListBai[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListBai,1,this._playNode_Bai_radio),nodeListBai[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListBai,2,this._playNode_Bai_radio),nodeListBai[2].getChildByName("text"));

        //切牌
        var list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this._playNode_Card_radio = createRadioBoxForCheckBoxs(list,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(list,0,this._playNode_Card_radio),list[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(list,1,this._playNode_Card_radio),list[1].getChildByName("text"));

        //托管
        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoguan_0"));
        tuoGuanList.push(_play.getChildByName("tuoguan_1"));
        tuoGuanList.push(_play.getChildByName("tuoguan_2"));
        tuoGuanList.push(_play.getChildByName("tuoguan_3"));
        tuoGuanList.push(_play.getChildByName("tuoguan_4"));
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, (index, sender, list)=>{
            this.radioBoxSelectCB(index, sender, list);
            this.updateTrust();
        });
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
                var pos = touch.getLocation();
                pos = btn_tuoGuanTip.parent.convertToNodeSpace(pos);
                if (tuoGuanTip.isVisible() && !cc.rectContainsPoint(btn_tuoGuanTip.getBoundingBox(), pos)) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);

        var fangShiList = [];
        fangShiList.push(_play.getChildByName("fangShi1"));
        fangShiList.push(_play.getChildByName("fangShi2"));
        fangShiList.push(_play.getChildByName("fangShi3"));
        this.fangShiList_radio = createRadioBoxForCheckBoxs(fangShiList, this.radioBoxSelectCB);
        this.addListenerText(fangShiList,this.fangShiList_radio);
        this.fangShiList = fangShiList;

        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            var btn_sub = this.jieSuanDiFen.getChildByName("btn_sub");
            var btn_add = this.jieSuanDiFen.getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex -= 1;
                if(fenIndex < 0){
                    fenIndex = diFenArr.length-1;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
            btn_add.addClickEventListener(function (btn) {
                var diFen = Number(text_diFen.getString());
                var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5]
                var fenIndex = diFenArr.indexOf(diFen)
                fenIndex += 1;
                if(fenIndex >= diFenArr.length){
                    fenIndex = 0;
                }
                text_diFen.setString(diFenArr[fenIndex] + "");
            });
        }

        //发牌
        var faPaiList = [];
        faPaiList.push(_play.getChildByName("play_faPai1"));
        faPaiList.push(_play.getChildByName("play_faPai2"));
        faPaiList.push(_play.getChildByName("play_faPai3"));
        this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB);
        this.addListenerText(faPaiList,this.faPaiList_radio);
        this.faPaiList = faPaiList;  

        //全局封顶
        if(_play.getChildByName("quanjubufengding")){
            var quanjufengdingList = [];
            quanjufengdingList.push(_play.getChildByName("quanjubufengding"));
            quanjufengdingList.push(_play.getChildByName("quanjufengding"));
            this.quanjufengdingList_radio = createRadioBoxForCheckBoxs(quanjufengdingList,this.radioBoxSelectCB);
            this.addListenerText(quanjufengdingList, this.quanjufengdingList_radio);

            var scorePanel = _play.getChildByName("quanjufengdingScore");
            var minScore = 1000; var maxScore = 10000; var stepScore = 500;
            var addMinScore = 600, addStepScore = 100;  //600-900之间100一档
            var subBtn = scorePanel.getChildByName("btn_sub");
            subBtn.addTouchEventListener(function(sender, eventType){
                if(eventType == ccui.Widget.TOUCH_ENDED){
                    var score = parseInt(scorePanel.getChildByName("text_diFen").string);
                    if(score <= minScore){
                        score -= addStepScore;
                        score = score < addMinScore ? maxScore : score;
                    }else{
                        score -= stepScore;
                        score = score < minScore ? maxScore : score;
                    }
                    scorePanel.getChildByName("text_diFen").string = score;
                }
            });
            var addBtn = scorePanel.getChildByName("btn_add");
            addBtn.addTouchEventListener(function(sender, eventType){
                if(eventType == ccui.Widget.TOUCH_ENDED){
                    var score = parseInt(scorePanel.getChildByName("text_diFen").string);
                    if(score >= minScore){
                        score += stepScore;
                    }else{
                        score += addStepScore;
                    }
                    score = score > maxScore ? addMinScore : score;
                    scorePanel.getChildByName("text_diFen").string = score;
                }
            });

            descBtn = scorePanel.getChildByName("btn_desc");
            var descLabel = scorePanel.getChildByName("image_tip");
            descBtn.addClickEventListener(function(btn){
                descLabel.visible = !descLabel.visible;
            });

            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                status: null,
                onTouchBegan: function(touch, event) {
                    if (descLabel.isVisible()) {
                        descLabel.setVisible(false);
                        return true;
                    } else {
                        return false;
                    }
                },
            }), descLabel);
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //跟醒、翻醒
        var paohuzi_xing;
        if(isClub){
            paohuzi_xing = this.getBoolItem("isGenXing",true);
        }else {
            paohuzi_xing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.Key_liuhusao_isgenxing, true);
        }
        var list = [];
        list.push(this.genXingNode_paohuzi);
        list.push(this.fanXingNode_paohuzi);
        var index = 0;
        if(paohuzi_xing == true){
            this.genXingNode_paohuzi.setSelected(true);
            this.fanXingNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_xing == false){
            this.genXingNode_paohuzi.setSelected(false);
            this.fanXingNode_paohuzi.setSelected(true);
            index = 1;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //无王、单王、双王
        var paohuzi_kingnum;
        if(isClub){
            paohuzi_kingnum = this.getNumberItem("kingNum",2);
        }else{
            paohuzi_kingnum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_kingnum, 1);
        }
        //fix by 千千
        var list = [];
        list.push(this.noKingNode_liuhhusao);
        list.push(this.oneKingNode_liuhusao);
        list.push(this.twoKingNode_liuhusao);
        list.push(this.threeKingNode_liuhusao);
        var index = 0;
        if(paohuzi_kingnum == 0){
            this.noKingNode_liuhhusao.setSelected(true);
            this.oneKingNode_liuhusao.setSelected(false);
            this.twoKingNode_liuhusao.setSelected(false);
            this.threeKingNode_liuhusao.setSelected(false);
            index = 0;
        }else if(paohuzi_kingnum == 1){
            this.oneKingNode_liuhusao.setSelected(true);
            this.noKingNode_liuhhusao.setSelected(false);
            this.twoKingNode_liuhusao.setSelected(false);
            this.threeKingNode_liuhusao.setSelected(false);
            index = 1;
        }else if(paohuzi_kingnum == 2){
            this.noKingNode_liuhhusao.setSelected(false);
            this.oneKingNode_liuhusao.setSelected(false);
            this.twoKingNode_liuhusao.setSelected(true);
            this.threeKingNode_liuhusao.setSelected(false);
            index = 2;
        }else if(paohuzi_kingnum == 3){
            this.noKingNode_liuhhusao.setSelected(false);
            this.oneKingNode_liuhusao.setSelected(false);
            this.twoKingNode_liuhusao.setSelected(false);
            this.threeKingNode_liuhusao.setSelected(true);
            index = 3;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //单醒、双醒
        var paohuzi_isfanxing;
        if(isClub){
            paohuzi_isfanxing = this.getNumberItem("isFanXing",1);
        }else{
            paohuzi_isfanxing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_isfanxing, 1);
        }
        if(paohuzi_isfanxing == 1){
            this.twoXingNode_paohuzi.setSelected(false);
        }else if(paohuzi_isfanxing == 2){
            this.twoXingNode_paohuzi.setSelected(true);
        }
        var txt = this.twoXingNode_paohuzi.getChildByName("text");
        if(paohuzi_isfanxing == 2){
            txt.setTextColor(MjClient.createRoomNode._selectColor);
        }else{
            txt.setTextColor(MjClient.createRoomNode._unSelectColor);
        }

        //二人 三人、四人
        var paohuzi_personCount;
        if(isClub){
            paohuzi_personCount = this.getNumberItem("maxPlayer",3);
        }else{
            paohuzi_personCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_personCount, 3);
        }
        list = [];
        list.push(this.errenNode_paohuzi);
        list.push(this.sanrenNode_paohuzi);
        list.push(this.sirenNode_paohuzi);
        index = 0;
        if(paohuzi_personCount == 3){
            this.errenNode_paohuzi.setSelected(false);
            this.sanrenNode_paohuzi.setSelected(true);
            this.sirenNode_paohuzi.setSelected(false);
            index = 1;
        }else if(paohuzi_personCount == 2){
            this.errenNode_paohuzi.setSelected(true);
            this.sanrenNode_paohuzi.setSelected(false);
            this.sirenNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_personCount == 4){
            this.errenNode_paohuzi.setSelected(false);
            this.sanrenNode_paohuzi.setSelected(false);
            this.sirenNode_paohuzi.setSelected(true);
            index = 2;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //封顶
        var paohuzi_fengDing;
        if(isClub){
            paohuzi_fengDing = this.getNumberItem("fengDing",300);
        }else{
            paohuzi_fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_fengDing, 300);
        }
        list = [];
        list.push(this.sanbaiNode_paohuzi);
        list.push(this.liubaiNode_paohuzi);
        list.push(this.wushangxianNode_paohuzi);
        index = 0;
        if(paohuzi_fengDing == 300){
            this.sanbaiNode_paohuzi.setSelected(true);
            this.liubaiNode_paohuzi.setSelected(false);
            this.wushangxianNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_fengDing == 600){
            this.sanbaiNode_paohuzi.setSelected(false);
            this.liubaiNode_paohuzi.setSelected(true);
            this.wushangxianNode_paohuzi.setSelected(false);
            index = 1;
        }else if(paohuzi_fengDing == -1){
            this.sanbaiNode_paohuzi.setSelected(false);
            this.liubaiNode_paohuzi.setSelected(false);
            this.wushangxianNode_paohuzi.setSelected(true);
            index = 2;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //切牌
        var cardIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_liuhusao_qiepai, 0);
        if(isClub){
            cardIndex = this.getNumberItem("isManualCutCard",0);
        }
        this._playNode_Card_radio.selectItem(cardIndex);
        var _play = this.bg_node.getChildByName("play")
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play");
        
        list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this.radioBoxSelectCB(cardIndex,list[cardIndex],list);

        //托管
        var tuoGuan;
        if (isClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_trust, -1));
        tuoGuan = tuoGuan < 0 ? 0 : tuoGuan;
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        var fangShi;
        if (isClub)
            fangShi = this.getNumberItem("trustWay", 0);
        else
            fangShi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_trustWay, 0);
        this.fangShiList_radio.selectItem(fangShi);
        this.radioBoxSelectCB(fangShi,this.fangShiList[fangShi],this.fangShiList);

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }

        //发牌
        var faPai;
        if(isClub){
            faPai = this.getNumberItem("sendCardSpeed",1);
        }else{
            faPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_faPai, 1);
        }
        this.faPaiList_radio.selectItem(faPai);
        this.radioBoxSelectCB(faPai,this.faPaiList[faPai],this.faPaiList);

        //全局封顶
        if(this.quanjufengdingList_radio){
            var fengdingScore;
            if(isClub){
                fengdingScore = this.getNumberItem("quanjufengdingScore",0);
            }else{
                fengdingScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_liuhusao_quanjufengding, 0);
            }
            var index = fengdingScore > 0 ? 1 : 0;
            this.quanjufengdingList_radio.selectItem(index);
            var quanjufengdingList = [];
            quanjufengdingList.push(_play.getChildByName("quanjubufengding"));
            quanjufengdingList.push(_play.getChildByName("quanjufengding"));
            this.radioBoxSelectCB(index, quanjufengdingList[index], quanjufengdingList);
            if(fengdingScore > 0){
                _play.getChildByName("quanjufengdingScore").getChildByName("text_diFen").string = fengdingScore;
            }
        }

        this.updateTrust();
    },

    updateTrust:function () {
        var visible = !(this.tuoGuanList_radio.getSelectIndex() == 0);
        for(var i = 0; i < this.fangShiList.length; i++){
            this.fangShiList[i].visible = visible;
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LUO_DI_SAO;
        para.maxPlayer = 3;
        para.kingNum = 1;//单王玩法
        para.isFanXing = 1;//单醒还是双醒
        para.fengDing = 300;//封顶
        para.isGenXing = true;//跟醒还是翻醒

        //根醒、翻醒
        if(this.genXingNode_paohuzi.isSelected()){
            para.isGenXing = true;
        }else if(this.fanXingNode_paohuzi.isSelected()){
            para.isGenXing = false;
        }
        //几王玩法
        if(this.noKingNode_liuhhusao.isSelected()){
            para.kingNum = 0;
        }else if (this.oneKingNode_liuhusao.isSelected()){
            para.kingNum = 1;
        }else if (this.twoKingNode_liuhusao.isSelected()){
            para.kingNum = 2;
        }else if(this.threeKingNode_liuhusao.isSelected()){
            para.kingNum = 3;
        }
        //fix by 千千
        if (this.twoXingNode_paohuzi.isSelected()){
            para.isFanXing = 2;
        }else{
            para.isFanXing = 1
        }
        //三人还是四人
        if (this.sanrenNode_paohuzi.isSelected()){
            para.maxPlayer = 3;
        }else if (this.sirenNode_paohuzi.isSelected()){
            para.maxPlayer = 4;
        }else if (this.errenNode_paohuzi.isSelected()){
            para.maxPlayer = 2;
        }

        //封顶
        if(this.sanbaiNode_paohuzi.isSelected()){
            para.fengDing = 300;
        }else if(this.liubaiNode_paohuzi.isSelected()){
            para.fengDing = 600;
        }else if(this.wushangxianNode_paohuzi.isSelected()){
            para.fengDing = -1;
        }

        //全局封顶
        if(this.quanjufengdingList_radio){
            para.quanjufengdingScore = 0;
            var selectIndex = this.quanjufengdingList_radio.getSelectIndex();
            if(selectIndex > 0){
                var _play = this.bg_node.getChildByName("play");
                if(!_play){
                    _play = this.bg_node.getChildByName("view").getChildByName("play");
                }
                var score = parseInt(_play.getChildByName("quanjufengdingScore").getChildByName("text_diFen").string);
                para.quanjufengdingScore = score;
            }
        }

        //切牌
        para.isManualCutCard = this._playNode_Card_radio.getSelectIndex();

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        }

        //托管
        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.trustWay = this.fangShiList_radio.getSelectIndex();
        para.isTrustWhole = !(para.trustWay == 0);
        para.faPai = this.faPaiList_radio.getSelectIndex(); //[1.4, 1, 0.7]
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_kingnum, para.kingNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_isfanxing, para.isFanXing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_personCount, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_fengDing, para.fengDing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.Key_liuhusao_isgenxing, para.isGenXing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_liuhusao_qiepai, para.isManualCutCard);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_trust, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_trustWay, para.trustWay);
            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_jieSuanDiFen, para.jieSuanDiFen);
            }
            if(this.quanjufengdingList_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_quanjufengding, para.quanjufengdingScore);
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_liuhusao_faPai, para.faPai);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});