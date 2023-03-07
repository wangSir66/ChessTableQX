var CreateRoomNode_PaoDeKuaiLYG = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_PLAYERNUMBER   = "PAO_DE_KUAI_HA_PLAYER_NUMBER";           // 玩家数量
        //this.localStorageKey.KEY_PDK_CARDNUMBER     = "KEY_PDK_CARDNUMBER";                     // 手牌数量
        //this.localStorageKey.KEY_PDK_ZHADANBUCHAI   = "PAO_DE_KUAI_HA_MUST_PUT";                // 炸弹不可拆
        //this.localStorageKey.KEY_PDK_SHOWCARDNUMBER = "PAO_DE_KUAI_HA_SHOW_CARD_NUMBER";        // 显示牌数
        this.localStorageKey.KEY_PDK_XIAN_SHOU      = "PAO_DE_KUAI_HA_XIAO_SHOU";               // 先手
        this.localStorageKey.KEY_PDK_4DAI2          = "PAO_DE_KUAI_HA_4DAI2";                   // 4带2
        this.localStorageKey.KEY_PDK_3DAI2          = "PAO_DE_KUAI_HA_3DAI2";                   // 3带2
        this.localStorageKey.KEY_PDK_MUST_PUT       = "PAO_DE_KUAI_HA_MUST_PUT";                 //能管必管
        this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN= "PAO_DE_KUAI_HA_ZHA_DAN_JIA_FEN";         // 炸弹加分
        this.localStorageKey.KEY_PDK_XIAO_GUAN_X2   = "PAO_DE_KUAI_HA_XIAO_GUAN_X2";            // 小关X2
        this.localStorageKey.KEY_PDK_DA_GUAN_X3     = "PAO_DE_KUAI_HA_DA_GUAN_X3";              // 大关X3
        this.localStorageKey.KEY_PDK_DA_GUAN_X2     = "PAO_DE_KUAI_HA_DA_GUAN_X2";              // 大关X2
        //this.localStorageKey.KEY_PDK_4DAI3          = "PAO_DE_KUAI_HA_4DAI3";                   // 4带3
        //this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO = "PAO_DE_KUAI_HA_HONG_TAO_10_NIAO";      // 红桃10扎鸟
        //this.localStorageKey.KEY_PDK_FANG_ZUO_BI    = "PAO_DE_KUAI_HA_FANG_ZUO_BI";             // 防作弊
        //this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN  = "PAO_DE_KUAI_HA_CAN_3A_ZHADAN";           // 三个A算炸弹
        this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_HA_DIFEN";                   // 底分
        this.localStorageKey.KEY_PDK_TONGHUASHUN    = "PAO_DE_KUAI_HA_TONGHUASHUN";              //同花顺
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_LYG_SHUFFLE_OPTION" // 切牌

        this.setExtraKey({
            fanBei: "PAO_DE_KUAI_LYG_FAN_BEI",  //大结算翻倍
            fanBeiScore: "PAO_DE_KUAI_LYG_FAN_BEI_SCORE",  //少于X分大结算翻倍
            tuoGuan: "PAO_DE_KUAI_LYG_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_LYG_FENG_DING"          //封顶
        });
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_PaoDeKuaiLYG.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initPlayNode:function()
    {
        var _bg_Node = null;

        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();

            if (GameClass[this._data.gameType] == MjClient.GAME_CLASS.PAO_DE_KUAI) {
                // 江苏跑得快添加了滑动处理
                _bg_Node = this.bg_node.getChildByName("view");
            }
        }

        if (!_bg_Node)
            _bg_Node = this.bg_node;

        var _playWay = _bg_Node.getChildByName("play_way");

        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("playerNumber_3") );
        nodeListA.push( _playWay.getChildByName("playerNumber_2") );       
        var cb = function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);
        }.bind(this)
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, cb);
        this.addListenerText(nodeListA,this._playNode_player_number_radio, cb);
        this.nodeListA = nodeListA;
		this.initPlayNumNode(nodeListA, [3, 2]); 
		
        var nodeListB = [];
        nodeListB.push( _playWay.getChildByName("mustPut") );
        nodeListB.push( _playWay.getChildByName("notMustPut") );       
        this._mustPut_radio = createRadioBoxForCheckBoxs(nodeListB,this.radioBoxSelectCB);
        this.addListenerText(nodeListB,this._mustPut_radio);
        this.nodeListB = nodeListB;

        this.xiaoguanX2 = _playWay.getChildByName("play_xiaoguanX2");
        this.addListenerText(this.xiaoguanX2);
        this.xiaoguanX2.addEventListener(this.clickCB, this.xiaoguanX2);

        var daGuan_peiShu = function(){
            
            if (this.daguanX3.isSelected()) {
                this.daguanX2.setSelected(false);
                var txt2 = this.daguanX2.getChildByName("text");
                txt2.setTextColor(cc.color(158, 118, 78));
            }
        }.bind(this);

        var daGuan_peiShu2 = function(){
            
            if (this.daguanX2.isSelected()) {
                this.daguanX3.setSelected(false);
                var txt2 = this.daguanX3.getChildByName("text");
                txt2.setTextColor(cc.color(158, 118, 78));
            }

        }.bind(this);

        this.daguanX3 = _playWay.getChildByName("play_daguanX3");
        this.addListenerText(this.daguanX3,null,daGuan_peiShu);
        this.daguanX2 = _playWay.getChildByName("play_daguanX2");
        this.addListenerText(this.daguanX2,null,daGuan_peiShu2);
        this.daguanX3.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.daguanX3.setSelected(true);
                    this.daguanX2.setSelected(false);
                    var txt = sender.getChildByName("text");
                    var txt2 = this.daguanX2.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(cc.color(237, 101, 1));
                        txt2.setTextColor(cc.color(158, 118, 78));
                    } else {
                        txt.setTextColor(cc.color(158, 118, 78));
                        txt2.setTextColor(cc.color(237, 101, 1));
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    txt.setTextColor(cc.color(158, 118, 78));
                    break;
            }
        },this);

        
        this.daguanX2.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.daguanX3.setSelected(false);
                    this.daguanX2.setSelected(true);
                    var txt = sender.getChildByName("text");
                    var txt2 = this.daguanX3.getChildByName("text");
                    if (sender.isSelected()) {
                        txt.setTextColor(cc.color(237, 101, 1));
                        txt2.setTextColor(cc.color(158, 118, 78));
                    } else {
                        txt.setTextColor(cc.color(158, 118, 78));
                        txt2.setTextColor(cc.color(237, 101, 1));
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    txt.setTextColor(cc.color(158, 118, 78));
                    break;
            }
        },this);

        var nodeListC = [];
        nodeListC.push( _playWay.getChildByName("play_firstHeiTao") );
        nodeListC.push( _playWay.getChildByName("play_firstWin") );       
        this._xianshou_radio = createRadioBoxForCheckBoxs(nodeListC,this.radioBoxSelectCB);
        this.addListenerText(nodeListC,this._xianshou_radio);
        this.nodeListC = nodeListC;

        this.can4dai2 = _playWay.getChildByName("play_can4dai2");
        this.addListenerText(this.can4dai2);
        this.can4dai2.addEventListener(this.clickCB, this.can4dai2);

        this.can3dai2 = _playWay.getChildByName("play_can3dai2");
        this.addListenerText(this.can3dai2);
        this.can3dai2.addEventListener(this.clickCB, this.can3dai2);

        this.tonghuashun = _playWay.getChildByName("play_tongHuaShun");
        this.addListenerText(this.tonghuashun);
        this.tonghuashun.addEventListener(this.clickCB, this.tonghuashun);

        this.zhadanjiafen = _playWay.getChildByName("play_zhadanjiafen");
        this.addListenerText(this.zhadanjiafen);
        this.zhadanjiafen.addEventListener(this.clickCB, this.zhadanjiafen);

        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 1) {
                        this._zhuIdx--;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
                    }
                }
            }, this);
            this._Button_add = _bg_Node.getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx++;
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        // 切牌
        if (_playWay.getChildByName("shuffleSys"))
        {
            var nodeListShuffle = [];
            nodeListShuffle.push( _playWay.getChildByName("shuffleSys") );
            nodeListShuffle.push( _playWay.getChildByName("shufflePlayer") );
            this.shuffle_radio = createRadioBoxForCheckBoxs(nodeListShuffle,this.radioBoxSelectCB);
            this.addListenerText(nodeListShuffle,this.shuffle_radio);
            this.nodeListShuffle = nodeListShuffle;
        }

        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }
        //设置上次创建房间时的默认选项
        var _currentPlayerNumber;
        if (isClub)
            _currentPlayerNumber = this.getNumberItem("maxPlayer", 3);
        else
            _currentPlayerNumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, 3);
        var selectIndex = _currentPlayerNumber == 2 ? 1 : 0;
        this._playNode_player_number_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex,this.nodeListA[selectIndex],this.nodeListA);

        var selectIndex;
        if (isClub)
            selectIndex = this.getBoolItem("mustPut", false) ? 0 : 1;
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_MUST_PUT, 1);
        this._mustPut_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex,this.nodeListB[selectIndex],this.nodeListB);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("isXiaoGuan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_XIAO_GUAN_X2, false);
        this.xiaoguanX2.setSelected(isTrue);
        var text = this.xiaoguanX2.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("isDaGuan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X3, false);
        this.daguanX3.setSelected(isTrue);
        var text = this.daguanX3.getChildByName("text");
        this.selectedCB(text,isTrue);

        if (isClub)
            isTrue = this.getBoolItem("isDaGuanX2", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X2, false);
        this.daguanX2.setSelected(isTrue);
        var text = this.daguanX2.getChildByName("text");
        this.selectedCB(text,isTrue);

        var selectIndex;
        if (isClub)
            selectIndex = this.getBoolItem("mustPutHongTaoSan", true) ? 0 : 1;
        else
            selectIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, 0);
        this._xianshou_radio.selectItem(selectIndex)
        this.radioBoxSelectCB(selectIndex,this.nodeListC[selectIndex],this.nodeListC);

        var tonghuashun;
        if (isClub)
            tonghuashun = this.getBoolItem("tongHuaShun", true);
        else
            tonghuashun = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_TONGHUASHUN, true);
        this.tonghuashun.setSelected(tonghuashun);
        var text = this.tonghuashun.getChildByName("text");
        this.selectedCB(text,tonghuashun);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("can4dai2", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI2, true);
        this.can4dai2.setSelected(isTrue);
        var text = this.can4dai2.getChildByName("text");
        this.selectedCB(text,isTrue);

        if (isClub)
            isTrue = this.getBoolItem("can3dai2", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_3DAI2, false);
        this.can3dai2.setSelected(isTrue);
        var text = this.can3dai2.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("isZhaDanJiaFen", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, false);
        this.zhadanjiafen.setSelected(isTrue);
        var text = this.zhadanjiafen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_DIFEN, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");
        if (this.shuffle_radio){
            var shuffle_radioItem
            if (isClub){
                var option = this.getNumberItem("isPlayerShuffle", 0);
                shuffle_radioItem = option
            }
            else{
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, 0);
                shuffle_radioItem = option;
            }
            this.shuffle_radio.selectItem(shuffle_radioItem)
            this.radioBoxSelectCB(shuffle_radioItem,this.nodeListShuffle[shuffle_radioItem],this.nodeListShuffle);
        }

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_LYG;
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2;// this.playerNumber_2.isSelected() ? 2 : 3;
        para.mustPut = this._mustPut_radio.getSelectIndex() == 0;
        para.isXiaoGuan = this.xiaoguanX2.isSelected();
        para.isDaGuan = this.daguanX3.isSelected();
        para.isDaGuanX2 = this.daguanX2.isSelected();
        para.mustPutHongTaoSan = this._xianshou_radio.getSelectIndex() == 0;
        para.can4dai2 = this.can4dai2.isSelected();     // 4带2
        para.can3dai2 = false;//this.can3dai2.isSelected();     // 3带2
        para.tongHuaShun = this.tonghuashun.isSelected();
        para.isZhaDanJiaFen = false;//this.zhadanjiafen.isSelected();
        para.showCardNumber = true;

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }
        
        // if (this._ZhuNum) {
        //     para.difen = this._zhuIdx;
        //     util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, para.difen);
        // }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_TONGHUASHUN, para.tongHuaShun);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_MUST_PUT, this._mustPut_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_XIAO_GUAN_X2, para.isXiaoGuan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X3, para.isDaGuan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_DA_GUAN_X2, para.isDaGuanX2);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, this._xianshou_radio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_3DAI2, para.can3dai2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, para.isZhaDanJiaFen);
            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});

