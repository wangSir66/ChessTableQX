/**
 * Created by wuxiaodong on 2017/8/1.
 */


var CreateRoomNode_paohuzi_new = CreateRoomNode.extend({
    initAll:function(IsFriendCard)
    {   
        /**
        **1、三人跑胡子  2、四王跑胡子  3、坐醒四人场  4、四王四人坐醒  5、跑胡子单挑场  6、四王单挑场
        **默认key值为三人跑胡子的，然后根据传过来的不同类型赋值
        **/
        this.selectType = 1;
        if (!this._isFriendCard){
            this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZI_KING_NUM"; //王数量
            this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZI_IS_FAN_XING"; //单双醒
            this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZI_FENG_DING"; //是否封顶
            this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZI_HONG_ZHUAN"; //红转朱黑
            this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZI_GEN_XING"; //跟醒、翻醒
            this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZI_QIE_PAI"; //切牌
        }
        if(this._data.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_King){
            //四王跑胡子
            this.selectType = 2;
            if (!this._isFriendCard){
                this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZI_SIWANG_KING_NUM"; //王数量
                this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZI_SIWANG_IS_FAN_XING"; //单双醒
                this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZI_SIWANG_FENG_DING"; //是否封顶
                this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZI_SIWANG_HONG_ZHUAN"; //红转朱黑
                this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZI_SIWANG_IS_GEN_XING"; //跟醒、翻醒
                this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZI_SIWANG_QIE_PAI"; //切牌
            }
        }else if(this._data.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR){
            //坐醒四人场
            this.selectType = 3;
            if (!this._isFriendCard) {
                this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZI_SR_KING_NUM"; //王数量
                this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZI_SR_FENG_DING"; //是否封顶
                this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZI_SR_HONG_ZHUAN"; //红转朱黑
                this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZI_SR_GEN_XING"; //跟醒、翻醒
                this.localStorageKey.KEY_paohuzi_baodi = "_PAO_HU_ZI_SR_BAO_DI"; //保底
                this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZI_SR_IS_FAN_XING"; //单双醒
                this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZI_SR_QIE_PAI"; //切牌
            }
        }else if(this._data.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King){
            //四王四人坐醒
            this.selectType = 4;
            if (!this._isFriendCard) {
                this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZI_SR_SIWANG_IS_KING"; //按王限胡、按番限胡
                this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZI_SR_SIWANG_FENG_DING"; //是否封顶
                this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZI_SR_SIWANG_HONG_ZHUAN"; //红转朱黑
                this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZI_SR_SIWANG_IS_GEN_XING"; //跟醒、翻醒
                this.localStorageKey.KEY_paohuzi_baodi = "_PAO_HU_ZI_SR_SIWANG_BAO_DI"; //保底
                this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZI_SR_SIWANG_IS_FAN_XING"; //单双醒
                this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZI_SR_SIWANG_QIE_PAI"; //切牌
            }

        }else if(this._data.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_ER){
            //跑胡子单挑场
            this.selectType = 5;
            if (!this._isFriendCard) {
                this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZI_KING_NUM"; //王数量
                this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZI_IS_FAN_XING"; //单双醒
                this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZI_FENG_DING"; //是否封顶
                this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZI_HONG_ZHUAN"; //红转朱黑
                this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZI_GEN_XING"; //跟醒、翻醒
                this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZI_QIE_PAI"; //切牌
            }

        }else if(this._data.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_LR_King){
            //四王单挑场
            this.selectType = 6;
            if (!this._isFriendCard) {
                this.localStorageKey.KEY_paohuzi_kingnum = "_PAO_HU_ZIER_SIWANG_IS_KING"; //按王限胡、按番限胡
                this.localStorageKey.KEY_paohuzi_isfanxing = "_PAO_HU_ZIER_SIWANG_IS_FAN_XING"; //单双醒
                this.localStorageKey.KEY_paohuzi_fengDing = "_PAO_HU_ZIER_SIWANG_FENG_DING"; //是否封顶
                this.localStorageKey.KEY_paohuzi_hongZhuan = "_PAO_HU_ZIER_SIWANG_HONG_ZHUAN"; //红转朱黑
                this.localStorageKey.Key_paohuzi_isgenxing = "_PAO_HU_ZIER_SIWANG_IS_GEN_XING"; //跟醒、翻醒
                this.localStorageKey.Key_paohuzi_qiepai = "_PAO_HU_ZIER_SIWANG_QIE_PAI"; //切牌
            }
        }
        
        this.localStorageKey.Key_paohuzi_trust = "_PAO_HU_ZI_TRUST";
        this.localStorageKey.Key_paohuzi_trustWay = "_PAO_HU_ZI_TRUST_WAY";
        this.localStorageKey.Key_paohuzi_SendCardSpeed = "_PAO_HU_ZI_SEND_CARD_SPEED";//发牌速度
        this.localStorageKey.KEY_paohuzi_isking = "_PAO_HU_ZI_SIWANG_IS_KING"; //按王限胡、按番限胡
        this.localStorageKey.Key_paohuzi_qiHu = "_PAO_HU_ZI_QI_HU"; //21胡起胡
        this.localStorageKey.KEY_paohuzi_jieSuanDiFen= "_paohuzi_jieSuanDiFen";   //积分底分
        this.localStorageKey.Key_paohuzi_qihuTun = "_PAO_HU_ZI_QI_HU_TUN";  //起胡囤数
        this.localStorageKey.Key_paohuzi_quanjufengding  = "_PAO_HU_ZI_quanjufengding";//全局封顶

        // this.roundNumObj = {roundNum1:12, roundNum2:8, roundNum3:16, roundNum4:10};
        // if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
        //     this.roundNumObj = {roundNum1:20, roundNum2:5, roundNum3:20, roundNum4:10};
        // }
        
        this.bg_node = ccs.load("bg_paohuzi_new.json").node;
        this.addChild(this.bg_node);
        this.jieSuanDiFen = this.bg_node.getChildByName("bg_xuzhou").getChildByName("jieSuanDiFen");
        this.bg_node = this.bg_node.getChildByName("bg_xuzhou").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _bgXuzhouNode = this.bg_node;
        var _play = _bgXuzhouNode.getChildByName("play");

        //三人、单挑、四人坐醒
        var list = [];
        list.push(_play.getChildByName("play_num_1"));
        list.push(_play.getChildByName("play_num_2"));
        list.push(_play.getChildByName("play_num_3"));
        var baoDiStatusCallback = function(sendIndex, sender, nodeList){
            var playerNumNode = _play.getChildByName("play_num_3");
            var fendingNode = _play.getChildByName("play_wushangxian");
            isShow = playerNumNode.isSelected() && !fendingNode.isSelected();
            var xingBaoDi = _play.getChildByName("play_baodi_1");
            xingBaoDi.visible = isShow;
            var buBaoDi = _play.getChildByName("play_baodi_2");
            buBaoDi.visible = isShow;
            if(isShow){
                if(this._isFriendCard){
                    var baodi = this.getNumberItem("baodi",-1);
                    index = baodi != -1 ? 0 : 1;
                }else{
                    var isBaoDi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_paohuzi_baodi, false);
                    index = isBaoDi ? 0 : 1;
                }
                this._playNode_baoDi_radio.selectItem(index);
                var diList = [];
                diList.push(_play.getChildByName("play_baodi_1"));
                diList.push(_play.getChildByName("play_baodi_2"));
                this.radioBoxSelectCB(index,diList[index],diList);
            }

            //21胡起胡判断(2人场才会出现)
            var isShowQiHu = sender.name == "play_num_2" && sender.isSelected();
            for (var node of this.qiHuType) {
                node.visible = isShowQiHu;
            }
            this.bg_node.getChildByName("qihu").visible = isShowQiHu;

            this.radioBoxSelectCB(sendIndex, sender, nodeList);
            this.updateGameType();
        }.bind(this);
        this._playNode_player_radio = createRadioBoxForCheckBoxs(list,baoDiStatusCallback);
        var textPlayerCallBack = function(index, parent){
            baoDiStatusCallback(index, list[index], list);
        };
        this.updateTextEvent(list, this._playNode_player_radio, textPlayerCallBack);

        //无王、单王、双王、三王       
        var wangList = [];
        wangList.push(_play.getChildByName("play_king_0"));
        wangList.push(_play.getChildByName("play_king_1"));
        wangList.push(_play.getChildByName("play_king_2"));
        wangList.push(_play.getChildByName("play_king_3"));
        wangList.push(_play.getChildByName("play_king_4"));
        var wangCallBack = function(sendIndex, sender, nodeList){
            var kingNumNode = _play.getChildByName("play_king_4");
            var isShow = kingNumNode.isSelected();
            if(isShow){
                _play.getChildByName("play_isking").visible = true;         //按王
                _play.getChildByName("play_isnotking").visible = true;      //按番
                if(_play.getChildByName("play_isAll")){
                    _play.getChildByName("play_isAll").visible = true;          //不限胡
                    this.bg_node.getChildByName("xianhu").visible = true;
                }
                var kingType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_paohuzi_isking, false);
                var index = kingType ? 0 : 1;
                if(_play.getChildByName("play_isAll")){
                    index = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_paohuzi_isking, 0);
                    if(cc.isNumber(index)){
                        index = Number(index);
                    }else{
                        index = index === 'true' ? 0 : 1;
                    }
                }
                this._playNode_Fan_radio.selectItem(index);
                var fanList = [];
                fanList.push(_play.getChildByName("play_isking"));
                fanList.push(_play.getChildByName("play_isnotking"));
                if(_play.getChildByName("play_isAll")){
                    fanList.push(_play.getChildByName("play_isAll"));
                }
                this.radioBoxSelectCB(index,fanList[index],fanList);
            }else{
                _play.getChildByName("play_isking").visible = false;
                _play.getChildByName("play_isnotking").visible = false;
                if(_play.getChildByName("play_isAll")){
                    _play.getChildByName("play_isAll").visible = false;          //不限胡
                    this.bg_node.getChildByName("xianhu").visible = false;
                }
            }
            this.radioBoxSelectCB(sendIndex, sender, nodeList);
            this.updateGameType();
        }.bind(this);
        this._playNode_King_radio = createRadioBoxForCheckBoxs(wangList, wangCallBack);
        var textWangCallBack = function(index, parent){
            wangCallBack(index, wangList[index], wangList);
        };
        this.updateTextEvent(wangList, this._playNode_King_radio, textWangCallBack);
       
        //按王、按番
        var fanList = [];
        fanList.push(_play.getChildByName("play_isking"));
        fanList.push(_play.getChildByName("play_isnotking"));
        if(_play.getChildByName("play_isAll")){
            fanList.push(_play.getChildByName("play_isAll"));          //不限胡
        }
        this._playNode_Fan_radio = createRadioBoxForCheckBoxs(fanList,this.radioBoxSelectCB);
        this.updateTextEvent(fanList, this._playNode_Fan_radio);

        //起胡囤
        if(_play.getChildByName("play_qihu1tun")){
            var qiHuList = [];
            qiHuList.push(_play.getChildByName("play_qihu1tun"));
            qiHuList.push(_play.getChildByName("play_qihu2tun"));
            qiHuList.push(_play.getChildByName("play_qihu3tun"));
            qiHuList.push(_play.getChildByName("play_qihu4tun"));
            qiHuList.push(_play.getChildByName("play_qihu5tun"));
            this._playNode_qihu_radio = createRadioBoxForCheckBoxs(qiHuList,this.radioBoxSelectCB);
            this.updateTextEvent(qiHuList, this._playNode_qihu_radio);            
        }

        //跟醒、翻醒
        var xingList = [];
        xingList.push(_play.getChildByName("play_genxing"));
        xingList.push(_play.getChildByName("play_fanxing"));
        this._playNode_Xing_radio = createRadioBoxForCheckBoxs(xingList,this.radioBoxSelectCB);
        this.updateTextEvent(xingList, this._playNode_Xing_radio);
        
        //单醒、双醒
        this.twoXing = _play.getChildByName("play_twoxing");
        cc.eventManager.addListener(this.setTextClick(),this.twoXing.getChildByName("text"));
        this.twoXing.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(208,88,60));
                    }else{
                        txt.setTextColor(cc.color(72,94,112));
                    }
                    break;
            }
        }, this.twoXing);

        //封顶
        var fengDingList = [];
        fengDingList.push(_play.getChildByName("play_sanbai"));
        fengDingList.push(_play.getChildByName("play_liubai"));
        fengDingList.push(_play.getChildByName("play_babai"));
        fengDingList.push(_play.getChildByName("play_shibai"));
        fengDingList.push(_play.getChildByName("play_wushangxian"));
        var updateBaoDiContent = function(sendIndex, sender, nodeList){
            var playerNumNode = _play.getChildByName("play_num_3");
            if(playerNumNode.isSelected()){
                var fengDingNode_1 = _play.getChildByName("play_sanbai");
                var fengDingNode_2 = _play.getChildByName("play_liubai");
                _play.getChildByName("play_baodi_1").visible = true;
                _play.getChildByName("play_baodi_2").visible = true;
                if(fengDingNode_1.isSelected()){
                    _play.getChildByName("play_baodi_1").getChildByName("text").setString("醒家100分保底");
                }else if(fengDingNode_2.isSelected()){
                    _play.getChildByName("play_baodi_1").getChildByName("text").setString("醒家200分保底");
                }else{
                    _play.getChildByName("play_baodi_1").visible = false;
                    _play.getChildByName("play_baodi_2").visible = false;
                }

                this.radioBoxSelectCB(sendIndex, sender, nodeList);
            }else{
                _play.getChildByName("play_baodi_1").visible = false;
                _play.getChildByName("play_baodi_2").visible = false;
            }

            this.radioBoxSelectCB(sendIndex, sender, nodeList);
        }.bind(this);
        var textFengDingCallBack = function(index, parent){
            updateBaoDiContent(index, fengDingList[index], fengDingList);
        };
        this._playNode_fengDing_radio = createRadioBoxForCheckBoxs(fengDingList, updateBaoDiContent);
        this.updateTextEvent(fengDingList, this._playNode_fengDing_radio, textFengDingCallBack);

        //红转朱黑
        this.hongZhuan = _play.getChildByName("hongzhuan");
        cc.eventManager.addListener(this.setTextClick(),this.hongZhuan.getChildByName("text"));
        this.hongZhuan.addEventListener(function(sender,type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(208,88,60));
                    }else{
                        txt.setTextColor(cc.color(72,94,112));
                    }
                    break;
            }
        }, this.hongZhuan);

        //21胡起胡
        var qiHuType = [];
        qiHuType.push(_play.getChildByName("play_15hu"));
        qiHuType.push(_play.getChildByName("play_18hu"));
        qiHuType.push(_play.getChildByName("play_21hu"));
        this.qiHuType = qiHuType;
        this._playNode_qiHuType_radio = createRadioBoxForCheckBoxs(qiHuType,this.radioBoxSelectCB);
        this.updateTextEvent(qiHuType, this._playNode_qiHuType_radio);

        //醒家保底
        var xingBaoDi = _play.getChildByName("play_baodi_1");
        var buBaoDi = _play.getChildByName("play_baodi_2");
        var baoDilist = [];
        baoDilist.push(xingBaoDi);
        baoDilist.push(buBaoDi);
        this._playNode_baoDi_radio = createRadioBoxForCheckBoxs(baoDilist, this.radioBoxSelectCB);
        this.updateTextEvent(baoDilist, this._playNode_baoDi_radio);
        if(this.selectType == 3 || this.selectType == 4){
            xingBaoDi.visible = true;
            buBaoDi.visible = true;
        }else{
            xingBaoDi.visible = false;
            buBaoDi.visible = false;
        }
        //托管
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
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
            fangShiList.push(_play.getChildByName("trustWay_1"));
            fangShiList.push(_play.getChildByName("trustWay_2"));
            fangShiList.push(_play.getChildByName("trustWay_3"));
            this.fangShiList_radio = createRadioBoxForCheckBoxs(fangShiList, this.radioBoxSelectCB);
            this.addListenerText(fangShiList,this.fangShiList_radio);
            this.fangShiList = fangShiList;
        }

        //切牌
        var cardList = [];
        cardList.push( _play.getChildByName("play_xitong"));
        cardList.push( _play.getChildByName("play_shoudong"));
        this._playNode_Card_radio = createRadioBoxForCheckBoxs(cardList,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(cardList,0,this._playNode_Card_radio),cardList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(cardList,1,this._playNode_Card_radio),cardList[1].getChildByName("text"));   

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
        
        //发牌速度
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var faPaiList = [];
            faPaiList.push(_play.getChildByName("fapai_0"));
            faPaiList.push(_play.getChildByName("fapai_1"));
            faPaiList.push(_play.getChildByName("fapai_2"));
            this.faPaiList_radio = createRadioBoxForCheckBoxs(faPaiList, this.radioBoxSelectCB);
            this.addListenerText(faPaiList,this.faPaiList_radio);
            this.faPaiList = faPaiList;
        }

        //全局封顶
        if(_play.getChildByName("quanjubufengding")){
            var quanjufengdingList = [];
            quanjufengdingList.push(_play.getChildByName("quanjubufengding"));
            quanjufengdingList.push(_play.getChildByName("quanjufengding"));
            this.quanjufengdingList_radio = createRadioBoxForCheckBoxs(quanjufengdingList,this.radioBoxSelectCB);
            this.addListenerText(quanjufengdingList, this.quanjufengdingList_radio);

            var scorePanel = _play.getChildByName("quanjufengdingScore");
            var minScore = 1000; var maxScore = 10000; var stepScore = 500;
            var addMinScore = 400, addStepScore = 100;  //400-900之间100一档
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

    setPlayNodeCurrentSelect:function(isClub){
        var _play = this.bg_node.getChildByName("play");
        var list = []; 
        //人数
        var playerNum = 3;
        if(this.selectType == 3 || this.selectType == 4){
            playerNum = 4;
        }else if(this.selectType == 5 || this.selectType == 6){
            playerNum = 2;
        }
        var index = [3,2,4].indexOf(playerNum);
        if(isClub){
            index = [3,2,4].indexOf(this.getNumberItem("maxPlayer",playerNum));
        }
        this._playNode_player_radio.selectItem(index);
        list.push(_play.getChildByName("play_num_1"));
        list.push(_play.getChildByName("play_num_2"));
        list.push(_play.getChildByName("play_num_3"));
        this.radioBoxSelectCB(index,list[index],list);

        //无王、单王、双王、三王、四王
        if(isClub){
            index = this.getNumberItem("kingNum",2);
        }else{
            index = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_paohuzi_kingnum, 2);
        }
        this._playNode_King_radio.selectItem(index);
        list = [];
        list.push(_play.getChildByName("play_king_0"));
        list.push(_play.getChildByName("play_king_1"));
        list.push(_play.getChildByName("play_king_2"));
        list.push(_play.getChildByName("play_king_3"));
        list.push(_play.getChildByName("play_king_4"));
        this.radioBoxSelectCB(index,list[index],list);

        //按王、按番
        if(_play.getChildByName("play_king_4").isSelected()){
            _play.getChildByName("play_isking").visible = true;
            _play.getChildByName("play_isnotking").visible = true;
            if(_play.getChildByName("play_isAll")){
                _play.getChildByName("play_isAll").visible = true;
                this.bg_node.getChildByName("xianhu").visible = true;
            }
            var kingType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_paohuzi_isking, false);
            if(isClub){
                kingType = this.getBoolItem("isKing",false);
            }
            index = kingType ? 0 : 1;
            if(_play.getChildByName("play_isAll")){
                index = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_paohuzi_isking, 0);
                if(cc.isNumber(index)){
                    index = Number(index);
                }else{
                    index = index === 'true' ? 0 : 1;
                }
                if(isClub){
                    index = this.getItem("isKing",0);
                    if(cc.isNumber(index)){
                        index = Number(index);
                    }else{
                        index = index ? 0 : 1;
                    }
                }
            }
            this._playNode_Fan_radio.selectItem(index);
            var fanList = [];
            fanList.push(_play.getChildByName("play_isking"));
            fanList.push(_play.getChildByName("play_isnotking"));
            if(_play.getChildByName("play_isAll")){
                fanList.push(_play.getChildByName("play_isAll"));
            }
            this.radioBoxSelectCB(index,fanList[index],fanList);
        }else{
            _play.getChildByName("play_isking").visible = false;
            _play.getChildByName("play_isnotking").visible = false;       
            if(_play.getChildByName("play_isAll")){
                _play.getChildByName("play_isAll").visible = false;
                this.bg_node.getChildByName("xianhu").visible = false;
            }    
        }

        //起胡
        if(_play.getChildByName("play_qihu1tun")){
            var qihuTun = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_qihuTun, 2);
            if(isClub){
                qihuTun = this.getNumberItem("qihuTun",2);
            }
            index = [1,2,3,4,5].indexOf(qihuTun);
            this._playNode_qihu_radio.selectItem(index);
            var qiHuList = [];
            qiHuList.push(_play.getChildByName("play_qihu1tun"));
            qiHuList.push(_play.getChildByName("play_qihu2tun"));
            qiHuList.push(_play.getChildByName("play_qihu3tun"));
            qiHuList.push(_play.getChildByName("play_qihu4tun"));
            qiHuList.push(_play.getChildByName("play_qihu5tun"));
            this.radioBoxSelectCB(index,qiHuList[index],qiHuList);            
        }

        //单醒、双醒
        var xingCount;
        if(isClub){
            xingCount = this.getNumberItem("isFanXing",1);
        }else{
            xingCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_paohuzi_isfanxing, 1);
        }
        this.twoXing.setSelected(xingCount == 2);
        var txt = this.twoXing.getChildByName("text");
        if(xingCount == 2){
            txt.setTextColor(cc.color(208,88,60));
        }else{
            txt.setTextColor(cc.color(72,94,112));
        }

        //跟醒、翻醒
        var isGenXing;
        if(isClub){
            isGenXing = this.getBoolItem("isGenXing",true);
        }else{
            isGenXing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.Key_paohuzi_isgenxing, true);
        }
        index = isGenXing ? 0 : 1;
        this._playNode_Xing_radio.selectItem(index);
        list = [];
        list.push(_play.getChildByName("play_genxing"));
        list.push(_play.getChildByName("play_fanxing"));
        this.radioBoxSelectCB(index,list[index],list);

        //红转朱黑
        var hongzhuanType;
        if(isClub){
            hongzhuanType = this.getBoolItem("hongZhuan",false);
        }else{
            hongzhuanType = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_paohuzi_hongZhuan, false);
        }
        this.hongZhuan.setSelected(hongzhuanType);
        var txt = this.hongZhuan.getChildByName("text");
        if(hongzhuanType){
            txt.setTextColor(cc.color(208,88,60));
        }else{
            txt.setTextColor(cc.color(72,94,112));
        }

        //21胡起胡
        if (this._playNode_qiHuType_radio) {
            var minHu;
            if(isClub){
                minHu = this.getNumberItem("minHu",15);
            }else{
                minHu = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_qiHu, 15);
            }
            index = [15, 18, 21].indexOf(minHu);
            this._playNode_qiHuType_radio.selectItem(index);
            this.radioBoxSelectCB(index,this.qiHuType[index],this.qiHuType);

            //21胡起胡判断(2人场才会出现)
            var isShowQiHu = _play.getChildByName("play_num_2").isSelected();
            for (var node of this.qiHuType) {
                node.visible = isShowQiHu;
            }
            this.bg_node.getChildByName("qihu").visible = isShowQiHu;
        }

        //封顶
        var fengDing;
        if(isClub){
            fengDing = this.getNumberItem("fengDing",300);
        }else {
            fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_paohuzi_fengDing, 300);
        }
        index = [300, 600, 800, 1000, -1].indexOf(fengDing);
        
        this._playNode_fengDing_radio.selectItem(index);
        list = [];
        list.push(_play.getChildByName("play_sanbai"));
        list.push(_play.getChildByName("play_liubai"));
        list.push(_play.getChildByName("play_babai"));
        list.push(_play.getChildByName("play_shibai"));
        list.push(_play.getChildByName("play_wushangxian"));
        this.radioBoxSelectCB(index,list[index],list);

        //保底
        if(index == 0 || index == 0){
            if(playerNum == 4){
                _play.getChildByName("play_baodi_1").visible = true;
                _play.getChildByName("play_baodi_2").visible = true;
            }
            var isBaoDi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_paohuzi_baodi, false);
            index = isBaoDi ? 0 : 1;
            if(isClub){
                var baodi = this.getNumberItem("baodi",-1);
                index = baodi != -1 ? 0 : 1;
            }
            
            this._playNode_baoDi_radio.selectItem(index);
            list = [];
            list.push(_play.getChildByName("play_baodi_1"));
            list.push(_play.getChildByName("play_baodi_2"));
            this.radioBoxSelectCB(index,list[index],list);
            if(fengDing == 300){
                _play.getChildByName("play_baodi_1").getChildByName("text").setString("醒家100分保底");
            }else if(fengDing == 600){
                _play.getChildByName("play_baodi_1").getChildByName("text").setString("醒家200分保底");
            }
        }else{
            _play.getChildByName("play_baodi_1").visible = false;
            _play.getChildByName("play_baodi_2").visible = false;
        }

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var tuoGuan;
            if (isClub)
                tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
            else
                tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_trust, -1));
            tuoGuan = tuoGuan < 0 ? 0 : tuoGuan;
            this.tuoGuanList_radio.selectItem(tuoGuan);
            this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

            var fangShi;
            if (isClub)
                fangShi = this.getNumberItem("trustWay", 0);
            else
                fangShi = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_trustWay, 0);
            this.fangShiList_radio.selectItem(fangShi);
            this.radioBoxSelectCB(fangShi,this.fangShiList[fangShi],this.fangShiList);
        }
        
        //切牌
        var cardIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_qiepai, 0);
        if(isClub){
            cardIndex = this.getNumberItem("isManualCutCard",0);
        }
        this._playNode_Card_radio.selectItem(cardIndex);
        list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this.radioBoxSelectCB(cardIndex,list[cardIndex],list);

        //发牌
        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            var sendCardIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_SendCardSpeed, 1);
            if(isClub){
                sendCardIndex = this.getNumberItem("sendCardSpeed",1);
            }
            this.faPaiList_radio.selectItem(sendCardIndex);
            this.radioBoxSelectCB(sendCardIndex,this.faPaiList[sendCardIndex],this.faPaiList);
        }
        

        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_paohuzi_jieSuanDiFen, 1);
            }
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(diFen + "");
        }

        //全局封顶
        if(this.quanjufengdingList_radio){
            var fengdingScore;
            if(isClub){
                fengdingScore = this.getNumberItem("quanjufengdingScore",0);
            }else{
                fengdingScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_paohuzi_quanjufengding, 0);
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

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            this.updateTrust();
        }
    },

    //统一处理按钮文本点击事件
    updateTextEvent:function(listNode, radioNode, callBack){
        for(var i = 0;i < listNode.length;i++){
            var textNode = listNode[i].getChildByName("text");
            cc.eventManager.addListener(this.setTextClick(listNode,i,radioNode, callBack),textNode);
        }
    },

    //刷新游戏类型(根据游戏)
    updateGameType:function(){
        var gameType = MjClient.GAME_TYPE.PAO_HU_ZI;
        var playIndex = this._playNode_player_radio.getSelectIndex();
        var playNum = [3,2,4][playIndex];
        var kingIndex = this._playNode_King_radio.getSelectIndex();
        var kingNum = [0,1,2,3,4][kingIndex];
        if(playNum == 3 && kingNum != 4){
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI;
        }else if(playNum == 3 && kingNum == 4){
            //四王跑胡子
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_King;
        }else if(playNum == 2 && kingNum == 4){
            //四王单挑场
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_LR_King;
        }else if(playNum == 2 && kingNum != 4){
            //跑胡子单挑场
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_ER;
        }else if(playNum == 4 && kingNum == 4){
            //四王四人坐醒
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_SR_King;
        }else if(playNum == 4 && kingNum != 4){
            //坐醒四人场
            this._data.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_SR;
        }
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
        para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI;
        para.maxPlayer = [3,2,4][this._playNode_player_radio.getSelectIndex()];             //人数
        para.kingNum = [0,1,2,3,4][this._playNode_King_radio.getSelectIndex()];             //王数量
        para.isFanXing = this.twoXing.isSelected() ? 2 : 1;                                 //单双醒
        para.hongZhuan = this.hongZhuan.isSelected();                                       //红转朱黑
        para.fengDing = [300,600,800,1000,-1][this._playNode_fengDing_radio.getSelectIndex()];       //封顶
        para.isGenXing = this._playNode_Xing_radio.getSelectIndex() == 0 ? true : false;    //跟醒、翻醒

        if(para.maxPlayer == 3 && para.kingNum == 4){
            //四王跑胡子
            para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_King;
        }else if(para.maxPlayer == 2 && para.kingNum == 4){
            //四王单挑场
            para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_LR_King;
            para.minHu = [15, 18, 21][this._playNode_qiHuType_radio.getSelectIndex()];
        }else if(para.maxPlayer == 2 && para.kingNum != 4){
            //跑胡子单挑场
            para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_ER;
            para.minHu = [15, 18, 21][this._playNode_qiHuType_radio.getSelectIndex()];
        }else if(para.maxPlayer == 4 && para.kingNum == 4){
            //四王四人坐醒
            para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_SR_King;
        }else if(para.maxPlayer == 4 && para.kingNum != 4){
            //坐醒四人场
            para.gameType = MjClient.GAME_TYPE.PAO_HU_ZI_SR;
        }
        this._data.gameType = para.gameType;
        //保底
        if(para.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR ||
            para.gameType == MjClient.GAME_TYPE.PAO_HU_ZI_SR_King)
        {
            para.baodi = -1;
            if(this._playNode_baoDi_radio.getSelectIndex() == 0){
                if(this._playNode_fengDing_radio.getSelectIndex() == 0){
                    para.baodi = 100;
                }
                if(this._playNode_fengDing_radio.getSelectIndex() == 1){
                    para.baodi = 200;
                }
            }
            var isBaoDi = true;
            if(para.baodi == -1){
                isBaoDi = false;
            }
            if (!this._isFriendCard){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_paohuzi_baodi, isBaoDi);
            }
        }

        var _play = this.bg_node.getChildByName("play");
        if(para.kingNum == 4){
            para.isKing = this._playNode_Fan_radio.getSelectIndex() == 0 ? true : false;
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_paohuzi_isking, para.isKing);
            if(_play.getChildByName("play_isAll")){
                para.isKing = this._playNode_Fan_radio.getSelectIndex();
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_paohuzi_isking, para.isKing);
            }
        }

        //起胡囤
        if(_play.getChildByName("play_qihu1tun")){
            var index = this._playNode_qihu_radio.getSelectIndex();
            para.qihuTun = [1,2,3,4,5][index];
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_qihuTun, para.qihuTun);
        }

        //切牌
        para.isManualCutCard = this._playNode_Card_radio.getSelectIndex();

        if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
            //托管
            para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
            para.trustWay = this.fangShiList_radio.getSelectIndex();
            para.isTrustWhole = !(para.trustWay == 0);
            //发牌速度
            para.faPai = this.faPaiList_radio.getSelectIndex(); //[1.4, 1, 0.7]
        }

        //积分底分
        if(this.jieSuanDiFen){
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
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

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_paohuzi_kingnum, para.kingNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_paohuzi_isfanxing, para.isFanXing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_paohuzi_fengDing, para.fengDing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.Key_paohuzi_isgenxing, para.isGenXing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_paohuzi_hongZhuan, para.hongZhuan);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_qiepai, para.isManualCutCard);
            if(this._playNode_qiHuType_radio){
                var minHu = [15, 18, 21][this._playNode_qiHuType_radio.getSelectIndex()];
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_qiHu, minHu);
            }
            if(MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                 //托管
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_trust, para.trustTime);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_trustWay, para.trustWay);
                //发牌速度
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_SendCardSpeed, para.faPai);
            }
            //积分底分
            if(this.jieSuanDiFen){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_paohuzi_jieSuanDiFen, para.jieSuanDiFen);
            }
            if(this.quanjufengdingList_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_paohuzi_quanjufengding, para.quanjufengdingScore);
            }
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});