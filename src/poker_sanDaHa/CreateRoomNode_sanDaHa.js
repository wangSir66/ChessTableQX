var CreateRoomNode_sanDaHa = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_SDH_playerCount            = "KEY_SDH_playerCount";              //人数
        this.localStorageKey.KEY_SDH_doubleInSingleOut      = "SAN_DA_HA_doubleInSigleOut";       //双进单出
        this.localStorageKey.KEY_SDH_allowCheckCard         = "SAN_DA_HA_allowCheckCard";         //允许查牌
        this.localStorageKey.KEY_SDH_touXiangXuXunWen       = "SAN_DA_HA_touXiangXuXunWen";       //投降需询问
        this.localStorageKey.KEY_SDH_daDaoTiQianOver        = "SAN_DA_HA_daDaoTiQianOver";        //大倒提前结束
        this.localStorageKey.KEY_SDH_louFengDing            = "louFengDing";        //封顶
        this.localStorageKey.KEY_SDH_difen                  = "SAN_DA_HA_difen";                  //底分
        this.localStorageKey.KEY_SDH_chou6                  = "SAN_DA_HA_chou6";                  //抽6
        this.localStorageKey.KEY_SDH_jiaoFenJiaPai          = "SAN_DA_HA_jiaoFenJiaPai";          //叫分加拍
        this.localStorageKey.KEY_SDH_qiJiao70               = "SAN_DA_HA_qiJiao70";               //70分起叫
        this.localStorageKey.KEY_SDH_quWang                 = "SAN_DA_HA_quWang";                 //去掉大小王
        this.localStorageKey.KEY_SDH_baoFuLiuShou           = "SAN_DA_HA_baoFuLiuShou";           //报副留守
        this.localStorageKey.KEY_SDH_zhuangFuXianShou       = "SAN_DA_HA_zhuangFuXianShou";           // 庄副闲守
        this.localStorageKey.KEY_SDH_daGuangAddOne          = "SAN_DA_HA_daGuangAddOne";                 //大光大倒加1分
        this.localStorageKey.KEY_SDH_allowTuoLaJiXiaoDui    = "SAN_DA_HA_allowTuoLaJiXiaoDui";    //允许拖拉机消对
        this.localStorageKey.KEY_SDH_daWuZhu27NotTuoLaJi    = "SAN_DA_HA_daWuZhu27NotTuoLaJi";    //打无主27不算拖拉机
        this.localStorageKey.KEY_SDH_realTimeVoice          = "SAN_DA_HA_realTimeVoice";          // 实时语音

        this.setExtraKey({
            tuoGuan: "SAN_DA_HA_TUO_GUAN",          //托管
            trustWhole: "SAN_DA_HA_TRUST_WHOLE",  //整局托管
            trustWay: "PSAN_DA_HA_TRUST_WAY"  //托管方式
        });
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_sanDaHa.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_sanDaHa").getChildByName("view");
        if(!this.bg_node){
            this.bg_node = this.bgNode.getChildByName("bg_sanDaHa");
        }
    },
    initPlayNode:function()
    {

        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        this._playNode_playercount_0 = _playWay.getChildByName("radioBox_playerNum3"); // 人数
        this._playNode_playercount_1 = _playWay.getChildByName("radioBox_playerNum4");
        var nodePlayercount = [];
        nodePlayercount.push( this._playNode_playercount_0 );
        nodePlayercount.push( this._playNode_playercount_1 );
        this._playNode_Player_radio = createRadioBoxForCheckBoxs(nodePlayercount,function(index){
            this.radioBoxSelectCB(index, nodePlayercount[index], nodePlayercount);
        }.bind(this));
        this.addListenerText(nodePlayercount,this._playNode_Player_radio);

        this.fengDing1 = _playWay.getChildByName("play_fengDing1"); // 封顶
        this.fengDing2 = _playWay.getChildByName("play_fengDing2");
        this.fengDing3 = _playWay.getChildByName("play_fengDing3");
        this.fengDing0 = _playWay.getChildByName("play_fengDing0");
        var fengDingList = [];
        fengDingList.push( this.fengDing1 );
        fengDingList.push( this.fengDing2 );
        fengDingList.push( this.fengDing3 );
        fengDingList.push( this.fengDing0 );
        this.fengDingList_radio = createRadioBoxForCheckBoxs(fengDingList,function(index){
            this.radioBoxSelectCB(index, fengDingList[index], fengDingList);
        }.bind(this));
        this.fengDingList = fengDingList;
        this.addListenerText(fengDingList,this.fengDingList_radio);

        this.doubleInSingleOut = _playWay.getChildByName("play_doubleInSingleOut");
        this.addListenerText(this.doubleInSingleOut);
        this.doubleInSingleOut.addEventListener(this.clickCB, this.doubleInSingleOut);

        this.allowCheckCard = _playWay.getChildByName("play_allowCheckCard");
        this.addListenerText(this.allowCheckCard);
        this.allowCheckCard.addEventListener(this.clickCB, this.allowCheckCard);

        this.touXiangXuXunWen = _playWay.getChildByName("play_touXiangXuXunWen");
        this.addListenerText(this.touXiangXuXunWen);
        this.touXiangXuXunWen.addEventListener(this.clickCB, this.touXiangXuXunWen);
        
        // this.daDaoTiQianOver = _playWay.getChildByName("play_daDaoTiQianOver");
        // this.addListenerText(this.daDaoTiQianOver);
        // this.daDaoTiQianOver.addEventListener(this.clickCB, this.daDaoTiQianOver);

        this.cbxChou6 = _playWay.getChildByName("play_chouliu"); //抽6
        this.addListenerText(this.cbxChou6);
        this.cbxChou6.addEventListener(this.clickCB, this.cbxChou6);

        this.jiaoFenJiaPai = _playWay.getChildByName("play_jiaoFenJiaPai"); //叫分加拍
        this.addListenerText(this.jiaoFenJiaPai);
        this.jiaoFenJiaPai.addEventListener(this.clickCB, this.jiaoFenJiaPai);

        this.qiJiao70 = _playWay.getChildByName("play_qiJiao70"); //70分起叫
        this.addListenerText(this.qiJiao70);
        this.qiJiao70.addEventListener(this.clickCB, this.qiJiao70);

        this.quWang = _playWay.getChildByName("play_quWang"); //去掉大小王
        this.addListenerText(this.quWang);
        this.quWang.addEventListener(this.clickCB, this.quWang);

        this.daGuangAddOne = _playWay.getChildByName("play_daGuangAddOne"); //大光大倒加一分
        this.addListenerText(this.daGuangAddOne);
        this.daGuangAddOne.addEventListener(this.clickCB, this.daGuangAddOne);

        //报副留守
        this.baoFuLiuShou = _playWay.getChildByName("play_baoFuLiuShou");
        this.addListenerText(this.baoFuLiuShou, null, function(selectedNum,sender){
            this.refreshZhuangFuXianShou(sender.isSelected());
        }.bind(this));
        this.baoFuLiuShou.addEventListener(this.baoFuLiuShouClickCB.bind(this), this.baoFuLiuShou);

        //庄副闲守
        this.zhuangFuXianShou = _playWay.getChildByName("play_zhuangFuXianShou");
        this.addListenerText(this.zhuangFuXianShou, null, function(selectedNum,sender){
            this.refreshBaoFuLiuShou(sender.isSelected());
        }.bind(this));
        this.zhuangFuXianShou.addEventListener(this.zhuangFuXianShouClickCB.bind(this), this.zhuangFuXianShou);

        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if(!this._ZhuNum){
            this._ZhuNum = _bg_Node.getParent().getChildByName("txt_fen")
        }
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this._ZhuNum.getParent().getChildByName("btn_sub");
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
            this._Button_add = this._ZhuNum.getParent().getChildByName("btn_add");
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

        // 永利三打哈合并相关
        var _round = this.bg_node.getChildByName("round");

        if (_round.getChildByName("playType_1")) {
            var playTypeList = [];
            playTypeList.push( _round.getChildByName("playType_1") );
            playTypeList.push( _round.getChildByName("playType_2") );
            playTypeList.push( _round.getChildByName("playType_3") );
            playTypeList.push( _round.getChildByName("playType_4") );

            this.playTypeList = playTypeList;

            var playTypeList_radio = createRadioBoxForCheckBoxs(playTypeList,function(index){
                this.radioBoxSelectCB(index, playTypeList[index], playTypeList);
                this.changeGameType(index);
            }.bind(this));
            this.addListenerText(playTypeList,playTypeList_radio,function(index) {
                this.changeGameType(index);
            }.bind(this));
        }

        // 允许拖拉机消对
        this.allowTuoLaJiXiaoDui = _playWay.getChildByName("play_allowTuoLaJiXiaoDui");
        this.addListenerText(this.allowTuoLaJiXiaoDui);
        this.allowTuoLaJiXiaoDui.addEventListener(this.clickCB, this.allowTuoLaJiXiaoDui);

        // 打无主27不算拖拉机
        this.daWuZhu27NotTuoLaJi = _playWay.getChildByName("play_daWuZhu27NotTuoLaJi");
        this.addListenerText(this.daWuZhu27NotTuoLaJi);
        this.daWuZhu27NotTuoLaJi.addEventListener(this.clickCB, this.daWuZhu27NotTuoLaJi);

        // 实时语音
        this.realtimeVoice = _playWay.getChildByName("realtimeVoice");
        this.addListenerText(this.realtimeVoice, null, function(selectedNum,sender){
            this.setDiaNumData(this.bg_node);
        }.bind(this));
        this.realtimeVoice.addEventListener(this.realtimeVoiceClickCB.bind(this), this.realtimeVoice);

        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //设置上次创建房间时的默认选项
        var playerCount;
        if (isClub) {
            playerCount = this.getNumberItem("maxPlayer", 4);
        } else {
            playerCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SDH_playerCount,4);
        }
        if (playerCount == 3) {
            this._playNode_playercount_0.setSelected(true);
            this._playNode_playercount_1.setSelected(false);
            var text1 = this._playNode_playercount_0.getChildByName("text");
            var text2 = this._playNode_playercount_1.getChildByName("text");
            this.selectedCB(text1,true)
            this.selectedCB(text2,false)
        } else {
            this._playNode_playercount_1.setSelected(true);
            this._playNode_playercount_0.setSelected(false);
            var text1 = this._playNode_playercount_0.getChildByName("text");
            var text2 = this._playNode_playercount_1.getChildByName("text");
            this.selectedCB(text1,false)
            this.selectedCB(text2,true)
        }
        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_doubleInSingleOut", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_doubleInSingleOut, true);
        this.doubleInSingleOut.setSelected(isTrue);
        var text = this.doubleInSingleOut.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_allowCheckCard", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_allowCheckCard, true);
        this.allowCheckCard.setSelected(isTrue);
        var text = this.allowCheckCard.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("SAN_DA_HA_touXiangXuXunWen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_touXiangXuXunWen, true);
        this.touXiangXuXunWen.setSelected(isTrue);
        var text = this.touXiangXuXunWen.getChildByName("text");
        this.selectedCB(text,isTrue)

        var fengDingCount;
        var oldDaDaoTiQianOver;
        if (isClub)
        {
            oldDaDaoTiQianOver = this.getBoolItem("SAN_DA_HA_daDaoTiQianOver", true); //针对老玩家没选这个选项
            fengDingCount = this.getNumberItem("louFengDing", 1);
        }
        else
        {
            oldDaDaoTiQianOver = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_daDaoTiQianOver,true); //针对老玩家没选这个选项
            fengDingCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SDH_louFengDing, 1);
        }
        cc.log("oooooooooooooooo:"+fengDingCount)
        cc.log("ooooooooooooooo111:"+oldDaDaoTiQianOver)
        if(oldDaDaoTiQianOver == false)
        {
            this.fengDing1.setSelected(false);
            this.fengDing2.setSelected(false);
            this.fengDing3.setSelected(false);
            this.fengDing0.setSelected(true);
            var text1 = this.fengDing1.getChildByName("text");
            var text2 = this.fengDing2.getChildByName("text");
            var text3 = this.fengDing3.getChildByName("text");
            var text0 = this.fengDing0.getChildByName("text");
            this.selectedCB(text1,false)
            this.selectedCB(text2,false)
            this.selectedCB(text3,false)
            this.selectedCB(text0,true)
        }
        else {
            if (fengDingCount == 1) {
                this.fengDing1.setSelected(true);
                this.fengDing2.setSelected(false);
                this.fengDing3.setSelected(false);
                this.fengDing0.setSelected(false);
                var text1 = this.fengDing1.getChildByName("text");
                var text2 = this.fengDing2.getChildByName("text");
                var text3 = this.fengDing3.getChildByName("text");
                var text0 = this.fengDing0.getChildByName("text");
                this.selectedCB(text1,true)
                this.selectedCB(text2,false)
                this.selectedCB(text3,false)
                this.selectedCB(text0,false)
            } else if(fengDingCount == 2) {
                this.fengDing1.setSelected(false);
                this.fengDing2.setSelected(true);
                this.fengDing3.setSelected(false);
                this.fengDing0.setSelected(false);
                var text1 = this.fengDing1.getChildByName("text");
                var text2 = this.fengDing2.getChildByName("text");
                var text3 = this.fengDing3.getChildByName("text");
                var text0 = this.fengDing0.getChildByName("text");
                this.selectedCB(text1,false)
                this.selectedCB(text2,true)
                this.selectedCB(text3,false)
                this.selectedCB(text0,false)
            } else if(fengDingCount == 3) {
                this.fengDing1.setSelected(false);
                this.fengDing2.setSelected(false);
                this.fengDing3.setSelected(true);
                this.fengDing0.setSelected(false);
                var text1 = this.fengDing1.getChildByName("text");
                var text2 = this.fengDing2.getChildByName("text");
                var text3 = this.fengDing3.getChildByName("text");
                var text0 = this.fengDing0.getChildByName("text");
                this.selectedCB(text1,false)
                this.selectedCB(text2,false)
                this.selectedCB(text3,true)
                this.selectedCB(text0,false)
            }else {
                this.fengDing1.setSelected(false);
                this.fengDing2.setSelected(false);
                this.fengDing3.setSelected(false);
                this.fengDing0.setSelected(true);
                var text1 = this.fengDing1.getChildByName("text");
                var text2 = this.fengDing2.getChildByName("text");
                var text3 = this.fengDing3.getChildByName("text");
                var text0 = this.fengDing0.getChildByName("text");
                this.selectedCB(text1,false)
                this.selectedCB(text2,false)
                this.selectedCB(text3,false)
                this.selectedCB(text0,true)
            }
        }

        if (isClub)
            this._zhuIdx = this.getNumberItem("SAN_DA_HA_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_SDH_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        if (isClub)
            isTrue = this.getBoolItem("chou6", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_chou6, false);
        this.cbxChou6.setSelected(isTrue);
        var text = this.cbxChou6.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("jiaoFenJiaPai", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_jiaoFenJiaPai, true);
        this.jiaoFenJiaPai.setSelected(isTrue);
        var text = this.jiaoFenJiaPai.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("qiJiao70", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_qiJiao70, false);
        this.qiJiao70.setSelected(isTrue);
        var text = this.qiJiao70.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 报副留守
        if (isClub)
            isTrue = this.getBoolItem("baoFuLiuShou", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_baoFuLiuShou, false);
        this.baoFuLiuShou.setSelected(isTrue);
        var text = this.baoFuLiuShou.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 庄副闲守
        if (isClub)
            isTrue = this.getBoolItem("zhuangFuXianShou", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_zhuangFuXianShou, false);
        this.zhuangFuXianShou.setSelected(isTrue);
        var text = this.zhuangFuXianShou.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("quWang", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_quWang, false);
        this.quWang.setSelected(isTrue);
        var text = this.quWang.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("daGuangAddOne", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_daGuangAddOne, false);
        this.daGuangAddOne.setSelected(isTrue);
        var text = this.daGuangAddOne.getChildByName("text");
        this.selectedCB(text,isTrue)

        // 允许拖拉机消对
        if (isClub)
            isTrue = this.getBoolItem("allowTuoLaJiXiaoDui", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_allowTuoLaJiXiaoDui, false);
        this.allowTuoLaJiXiaoDui.setSelected(isTrue);
        this.selectedCB(this.allowTuoLaJiXiaoDui.getChildByName("text"),isTrue);

        // 打无主27不算拖拉机
        if (isClub)
            isTrue = this.getBoolItem("daWuZhu27NotTuoLaJi", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_daWuZhu27NotTuoLaJi, false);
        this.daWuZhu27NotTuoLaJi.setSelected(isTrue);
        this.selectedCB(this.daWuZhu27NotTuoLaJi.getChildByName("text"),isTrue);

        // 实时语音
        if (isClub)
            isTrue = this.getBoolItem("realtimeVoice", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_SDH_realTimeVoice, false);
        this.realtimeVoice.setSelected(isTrue);
        this.selectedCB(this.realtimeVoice.getChildByName("text"),isTrue);

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.SAN_DA_HA;
        if (this._playNode_playercount_0.isSelected()) {
            para.maxPlayer = 3;
        } else {
            para.maxPlayer = 4;
        }
        if (this.fengDing1.isSelected()) {
            para.louFengDing = 1;
        } else if(this.fengDing2.isSelected()){
            para.louFengDing = 2;
        } else if(this.fengDing3.isSelected()){
            para.louFengDing = 3;
        } else {
            para.louFengDing = 0;
        }
        para.SAN_DA_HA_doubleInSingleOut = this.doubleInSingleOut.isSelected();   // 双进单出
        para.SAN_DA_HA_allowCheckCard = this.allowCheckCard.isSelected();         // 允许查牌
        para.SAN_DA_HA_touXiangXuXunWen = this.touXiangXuXunWen.isSelected();     // 投降需询问
        // para.SAN_DA_HA_daDaoTiQianOver = this.daDaoTiQianOver.isSelected();       // 大倒提前结束
        para.SAN_DA_HA_difen = this._zhuIdx;
        para.chou6 = this.cbxChou6.isSelected();
        para.baoFuLiuShou = this.baoFuLiuShou.isSelected();         // 报副留守
        para.zhuangFuXianShou = this.zhuangFuXianShou.isSelected();         // 庄副闲守
        para.quWang = this.quWang.isSelected();                     // 去掉大小王
        para.daGuangAddOne = this.daGuangAddOne.isSelected();       // 大光大倒加1分
        para.qiJiao70 = this.qiJiao70.isSelected();                 // 70分起叫
        para.jiaoFenJiaPai = this.jiaoFenJiaPai.isSelected();       // 叫分加拍

        // 允许拖拉机消对
        para.allowTuoLaJiXiaoDui = this.allowTuoLaJiXiaoDui.isSelected();

        // 打无主27不算拖拉机
        para.daWuZhu27NotTuoLaJi = this.daWuZhu27NotTuoLaJi.isSelected();

        // 实时语音
        para.realtimeVoice = this.realtimeVoice.isSelected();

		if (!this._isFriendCard) {
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_doubleInSingleOut, para.SAN_DA_HA_doubleInSingleOut);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_allowCheckCard, para.SAN_DA_HA_allowCheckCard);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_touXiangXuXunWen, para.SAN_DA_HA_touXiangXuXunWen);
	        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_daDaoTiQianOver, true);
	        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SDH_louFengDing, para.louFengDing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SDH_difen, para.SAN_DA_HA_difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_chou6, para.chou6);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_baoFuLiuShou, para.baoFuLiuShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_zhuangFuXianShou, para.zhuangFuXianShou);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_quWang, para.quWang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_daGuangAddOne, para.daGuangAddOne);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_qiJiao70, para.qiJiao70);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_jiaoFenJiaPai, para.jiaoFenJiaPai);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_SDH_playerCount, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_allowTuoLaJiXiaoDui, para.allowTuoLaJiXiaoDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_daWuZhu27NotTuoLaJi, para.daWuZhu27NotTuoLaJi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_SDH_realTimeVoice, para.realtimeVoice);
		}

        this.getExtraSelectedPara(para);
		
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    changeGameType: function(indexSelected) {
        postEvent("changeRoomNodeByType",{oldType: this._data.gameType,newType: this.gameTypes[indexSelected]});
    },

    initGameTypeNode: function(gameTypes) {
        if (!this.playTypeList)
            return;
        
        this.gameTypes = gameTypes.slice();

        var typesCount = this.gameTypes.length;
        var indexSelected = this.gameTypes.indexOf(this._data.gameType);

        for (var i = 0; i < this.playTypeList.length; i++) {
            var gameNode = this.playTypeList[i];

            if (i < typesCount) {
                gameNode.setVisible(true);

                var textLabel = gameNode.getChildByName("text");
                textLabel.setString(GameCnName[this.gameTypes[i]]);

                gameNode.setSelected(indexSelected == i);
                this.selectedCB(textLabel,indexSelected == i);
            } else
                gameNode.setVisible(false);
        }
    },

    baoFuLiuShouClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshZhuangFuXianShou(sender.isSelected());
                break;
        }
    },

    refreshBaoFuLiuShou: function(bSelected) {
        if (bSelected) {
            this.baoFuLiuShou.setSelected(false);
            this.selectedCB(this.baoFuLiuShou.getChildByName("text"),false);
        }
    },

    zhuangFuXianShouClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshBaoFuLiuShou(sender.isSelected());
                break;
        }
    },

    refreshZhuangFuXianShou: function(bSelected) {
        if (bSelected) {
            this.zhuangFuXianShou.setSelected(false);
            this.selectedCB(this.zhuangFuXianShou.getChildByName("text"),false);
        }
    },

    // 实时语音相关
    realtimeVoiceClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.setDiaNumData(this.bg_node);
                break;
        }
    },

    setDiaNumData: function(gameNode){
        this._super(gameNode);

        if (!this.realtimeVoice.isSelected())
            return;

        var btn_create_diamond = gameNode.getChildByName("btn_create_diamond");
        if(!btn_create_diamond)
        {
            // 岳阳选项内容滑动，加在view下，创建房间，保存规则在上一层
            btn_create_diamond = gameNode.getParent().getChildByName("btn_create_diamond");
        }

        var diamondNumNode = btn_create_diamond.getChildByName("dia_num");
        var createPrice = parseInt(diamondNumNode.getString()) || 0;
        diamondNumNode.ignoreContentAdaptWithSize(true);
        diamondNumNode.setString(createPrice + this.getRealtimeVoicePirce()); 
    },

    // 设置显示实时语音的价格
    getRealtimeVoicePirce: function(){
        var gameType = this._data.gameType; // para.gameType;
        var maxPlayer = this.getSelectPlayNum(); // para.maxPlayer;
        var roundNum = this.getSelectedRoundNum();
        var payWay = this.getSelectedPayWay();

        if (MjClient.data.gamePrice[gameType][maxPlayer][roundNum].length > payWay + 5) {
            return MjClient.data.gamePrice[gameType][maxPlayer][roundNum][payWay + 5];
        }

        return 0;
    },

    setRoundNodeCurrentSelect: function(){
        this._super(); 

        var priceNum = this.getRealtimeVoicePirce();
        var pricrText = this.realtimeVoice.getChildByName("price");
        pricrText.setString("("+priceNum+"黄金)");
        
        if(this._isRoomCardMode){
            pricrText.visible = false;
        }
    }
});