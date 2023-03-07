

var CreateRoomNode_PaoDeKuaiJZ = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_PLAYERNUMBER   = "PAO_DE_KUAI_JZ_PLAYER_NUMBER";       //玩家数量
        this.localStorageKey.KEY_PDK_CARDNUMBER     = "KEY_PDK_CARDNUMBER";                 //手牌数量
        this.localStorageKey.KEY_PDK_ZHADANBUCHAI   = "PAO_DE_KUAI_JZ_MUST_PUT";            //炸弹不可拆
        this.localStorageKey.KEY_PDK_SHOWCARDNUMBER = "PAO_DE_KUAI_JZ_SHOW_CARD_NUMBER";    //显示牌数
        this.localStorageKey.KEY_PDK_FIRSTOUT       = "PAO_DE_KUAI_JZ_FIRST_OUT";           //赢家先出/先出黑桃3
        this.localStorageKey.KEY_PDK_4DAI2          = "PAO_DE_KUAI_JZ_4DAI2";               //4带2
        this.localStorageKey.KEY_PDK_4DAI3          = "PAO_DE_KUAI_JZ_4DAI3";               //4带3
        this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO = "PAO_DE_KUAI_JZ_HONG_TAO_10_NIAO";  //红桃10扎鸟
        this.localStorageKey.KEY_PDK_FANG_ZUO_BI    = "PAO_DE_KUAI_JZ_FANG_ZUO_BI";         // 防作弊
        this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN  = "PAO_DE_KUAI_JZ_CAN_3A_ZHADAN";       // 三个A算炸弹
        this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_JZ_DIFEN";               //底分
        this.localStorageKey.KEY_PDK_MUSTPUT        = "_PAO_DE_KUAI_JZ_MUST_PUT";           //能管必管
        this.localStorageKey.KEY_PDK_GPS          = "_PAO_DE_KUAI_JZ_GPS";                  //防作弊
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_JZ_SHUFFLE_OPTION"; // 切牌
        this.localStorageKey.KEY_PDK_PLAYSPEED   = "PAO_DE_KUAI_JZ_PLAY_SPEED";           //速度
        this.localStorageKey.KEY_PDK_BAO_DAN_PUT_MAX   = "PAO_DE_KUAI_JZ_BAO_DAN_PUT_MAX";           // 报单出大牌
        this.localStorageKey.KEY_PDK_ZHADAN_BU_FAN_BEI = "PAO_DE_KUAI_JZ_ZHADAN_BU_FAN_BEI";  // 炸弹不翻倍
        this.localStorageKey.KEY_PDK_PLAYER_PUT_ZHADAN = "PAO_DE_KUAI_JZ_PLAYER_PUT_ZHADAN";  // 炸弹打出玩家
        this.localStorageKey.KEY_PDK_HAVE_ZHADAN   = "PAO_DE_KUAI_TY_HAVE_ZHADAN";//有炸弹

        this.setExtraKey({
            tuoGuan: "PAO_DE_KUAI_JZ_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_JZ_FENG_DING"          //封顶
        });
    },

    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_PaoDeKuaiJZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initPlayNode:function()
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }

        var _bg_Node = this.bg_node;

        //防作弊
        this._playNode_gps = _bg_Node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        var _bg_Node = this.bg_node.getChildByName("view");
        var _playWay = _bg_Node.getChildByName("play_way");

        // this.zhaDanBuChai = _playWay.getChildByName("play_zhaDanBuChai");
        // this.addListenerText(this.zhaDanBuChai);
        // this.zhaDanBuChai.addEventListener(this.clickCB, this.zhaDanBuChai);

        this.showCardNumber = _playWay.getChildByName("play_showCardNumber");
        this.addListenerText(this.showCardNumber);
        this.showCardNumber.addEventListener(this.clickCB, this.showCardNumber);

        this.mustPut = _playWay.getChildByName("play_mustPut");
        this.addListenerText(this.mustPut);
        this.mustPut.addEventListener(this.clickCB, this.mustPut);
        
        // this.can4dai2 = _playWay.getChildByName("play_can4dai2");
        // this.addListenerText(this.can4dai2);
        // this.can4dai2.addEventListener(this.clickCB, this.can4dai2);

        // this.can4dai3 = _playWay.getChildByName("play_can4dai3");
        // this.addListenerText(this.can4dai3);
        // this.can4dai3.addEventListener(this.clickCB, this.can4dai3);

        this.hongTao10Niao = _playWay.getChildByName("play_hongtao10niao");
        this.addListenerText(this.hongTao10Niao);
        this.hongTao10Niao.addEventListener(this.clickCB, this.hongTao10Niao);

        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("play_count3") );
        nodeListA.push( _playWay.getChildByName("play_count2") );       
        var cb = function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);
        }.bind(this)
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, cb);
        this.addListenerText(nodeListA,this._playNode_player_number_radio, cb);
        this.nodeListA = nodeListA;
		this.initPlayNumNode(nodeListA, [3, 2]); 
		
        var nodeListB = [];
        nodeListB.push( _playWay.getChildByName("cardNum16") );
        nodeListB.push( _playWay.getChildByName("cardNum15") );       
        this._card_number_radio = createRadioBoxForCheckBoxs(nodeListB,this.radioBoxSelectCB);
        this.addListenerText(nodeListB,this._card_number_radio);
        this.nodeListB = nodeListB;

        //有无炸弹
        this.haveZhaDan = _playWay.getChildByName("play_havezhadan")  // 有炸弹
        this.playerPutZhaDan = _playWay.getChildByName("play_playerPutZhaDan");     // 打出玩家
        this.zhaDanBuFanBei = _playWay.getChildByName("play_zhaDanBuFanBei");    // 炸弹不可翻倍

        this.addListenerText(this.haveZhaDan, null, function(selectedNum,sender){
            this.refreshZhaDanRelated(sender.isSelected(),false);
        }.bind(this));
        this.haveZhaDan.addEventListener(this.haveZhaDanClickCB.bind(this), this.haveZhaDan);

        this.addListenerText(this.playerPutZhaDan);
        this.playerPutZhaDan.addEventListener(this.clickCB, this.playerPutZhaDan);

        this.addListenerText(this.zhaDanBuFanBei);
        this.zhaDanBuFanBei.addEventListener(this.clickCB, this.zhaDanBuFanBei);


        var nodeListC = [];
        nodeListC.push(_playWay.getChildByName("play_winFirst"));
        nodeListC.push(_playWay.getChildByName("play_firstHeiTao"));
        nodeListC.push(_playWay.getChildByName("play_lunZhuang"));
        this._firstOut_radio = createRadioBoxForCheckBoxs(nodeListC, this.radioBoxSelectCB);
        this.addListenerText(nodeListC, this._firstOut_radio);
        this.nodeListC = nodeListC;
        
        // this.fangZuoBi = _playWay.getChildByName("play_fangZuoBi");
        // this.addListenerText(this.fangZuoBi);
        // this.fangZuoBi.addEventListener(this.clickCB, this.fangZuoBi);

        // this.can3aZhaDan = _playWay.getChildByName("play_can3aZhaDan");
        // this.addListenerText(this.can3aZhaDan);
        // this.can3aZhaDan.addEventListener(this.clickCB, this.can3aZhaDan);
        // this.can3aZhaDan.schedule(function() {
        //     this.can3aZhaDan.setVisible(this._card_number_radio.getSelectIndex() == 0);
        // }.bind(this));

        // var btn_fangZuoBiTip = _playWay.getChildByName("btn_fangZuoBiTip");
        // var image_fangZuoBiTip = _playWay.getChildByName("image_fangZuoBiTip");
        // btn_fangZuoBiTip.addTouchEventListener(function(sender, type) {
        //     if (type == 2) {
        //         image_fangZuoBiTip.setVisible(true);
        //     }
        // }, btn_fangZuoBiTip);

        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: false,
        //     status: null,
        //     onTouchBegan: function(touch, event) {
        //         if (image_fangZuoBiTip.isVisible()) {
        //             image_fangZuoBiTip.setVisible(false);
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     },
        // }, image_fangZuoBiTip);

        this._zhuIdx = 0;//数组的引索
        var _fenshu = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,2,3,4,5,6,7,8,9,10];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bg_Node.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _bg_Node.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);

        // 速度
        var nodeListSpeed = [];
        nodeListSpeed.push( _playWay.getChildByName("play_speed_fast") );
        nodeListSpeed.push( _playWay.getChildByName("play_speed_mid") );
        nodeListSpeed.push( _playWay.getChildByName("play_speed_slow") );
        this.speed_radio = createRadioBoxForCheckBoxs(nodeListSpeed,this.radioBoxSelectCB);
        this.addListenerText(nodeListSpeed,this.speed_radio);
        this.nodeListSpeed = nodeListSpeed;

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

        // 报单出大牌
        this.baoDanPutMax = _playWay.getChildByName("play_baoDanPutMax");
        this.addListenerText(this.baoDanPutMax);
        this.baoDanPutMax.addEventListener(this.clickCB, this.baoDanPutMax);

        this.initExtraPlayNode(_playWay);
    },
    initRoundNode:function()
    {
       this._super();
       //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
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

        var cardNumIndex;
        if (isClub)
            cardNumIndex = this.getNumberItem("cardNumIndex", 0);
        else
            cardNumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, 0);
        this._card_number_radio.selectItem(cardNumIndex)
        this.radioBoxSelectCB(cardNumIndex,this.nodeListB[cardNumIndex],this.nodeListB);

        var firstOutIndex;
        if (isClub) {
            if (typeof(this.clubRule["firstOutOption"]) != "undefined") {
                // 已使用了新的先出设置
                firstOutIndex = this.getNumberItem("firstOutOption", 2)
            } else if (typeof(this.clubRule["firstHeiTao3"]) != "undefined") {
                // 俱乐部已有玩法，沿用之前选定的
                if (this.getBoolItem("firstHeiTao3", false)) {
                    firstOutIndex = 1;
                } else {
                    firstOutIndex = 0;
                }
            } else {
                // 新玩家
                firstOutIndex = 2;
            }
        } else {
            firstOutIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_FIRSTOUT, 2);
        }
        this._firstOut_radio.selectItem(firstOutIndex);
        this.radioBoxSelectCB(firstOutIndex,this.nodeListC[firstOutIndex],this.nodeListC);

        // var isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, false);
        // this.zhaDanBuChai.setSelected(isTrue);
        // var text = this.zhaDanBuChai.getChildByName("text");
        // this.selectedCB(text,isTrue)

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("showCardNumber", true);
        else 
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, true);
        this.showCardNumber.setSelected(isTrue);
        var text = this.showCardNumber.getChildByName("text");
        this.selectedCB(text,isTrue)

        // isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI2, true);
        // this.can4dai2.setSelected(isTrue);
        // var text = this.can4dai2.getChildByName("text");
        // this.selectedCB(text,isTrue)

        // isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI3, false);
        // this.can4dai3.setSelected(isTrue);
        // var text = this.can4dai3.getChildByName("text");
        // this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("hongTao10Niao", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, false);
        this.hongTao10Niao.setSelected(isTrue);
        var text = this.hongTao10Niao.getChildByName("text");
        this.selectedCB(text,isTrue)

        // isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, false);
        // this.fangZuoBi.setSelected(isTrue);
        // var text = this.fangZuoBi.getChildByName("text");
        // this.selectedCB(text, isTrue);

        // isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, false);
        // this.can3aZhaDan.setSelected(isTrue);
        // var text = this.can3aZhaDan.getChildByName("text");
        // this.selectedCB(text, isTrue);

        // 有炸弹
        if (isClub)
            isTrue = this.getBoolItem("havezhadan", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_HAVE_ZHADAN, true);
        this.haveZhaDan.setSelected(isTrue);
        var text = this.haveZhaDan.getChildByName("text");
        this.selectedCB(text, isTrue);

        this.refreshZhaDanRelated(isTrue,true);

        var _difen;
        var _fenshu = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,2,3,4,5,6,7,8,9,10];
        if (isClub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
        }
        else
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_DIFEN, 0);
        this._zhuIdx = (_fenshu.length + _difen)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        // 能管必管
        var _mustPut;
        if (isClub)
            _mustPut = this.getBoolItem("mustPut", true);
        else
            _mustPut = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_MUSTPUT, true);
        this.mustPut.setSelected(_mustPut);
        var text = this.mustPut.getChildByName("text");
        this.selectedCB(text, _mustPut)

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_GPS, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);
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

        // 速度
        var playSpeedOption;
        if (isClub)
            playSpeedOption = this.getNumberItem("playSpeed", 1);
        else
            playSpeedOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, 1);
        this.speed_radio.selectItem(playSpeedOption)
        this.radioBoxSelectCB(playSpeedOption,this.nodeListSpeed[playSpeedOption],this.nodeListSpeed);

        // 报单出大牌
        if (isClub)
            isTrue = this.getBoolItem("baoDanPutMax", false);
        else 
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_BAO_DAN_PUT_MAX, false);
        this.baoDanPutMax.setSelected(isTrue);
        var text = this.baoDanPutMax.getChildByName("text");
        this.selectedCB(text,isTrue)

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_JZ;
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2;// this.playerNumber_2.isSelected() ? 2 : 3;
        para.cardNumIndex = this._card_number_radio.getSelectIndex();   // 手牌数量 0:16张手牌  1:15张手牌

        para.firstOutOption = this._firstOut_radio.getSelectIndex();

        para.havezhadan = this.haveZhaDan.isSelected();
        para.playerPutZhaDan = this.playerPutZhaDan.isSelected();
        para.zhaDanBuFanBei = this.zhaDanBuFanBei.isSelected();

        // 增加了轮庄选项，仍然保留firstHeiTao3字段（要兼容之前）
        para.firstHeiTao3 = para.firstOutOption == 1;   // 黑桃3先出

        //para.zhaDanBuChai = this.zhaDanBuChai.isSelected();     // 炸弹不可拆
        para.showCardNumber = this.showCardNumber.isSelected(); // 显示牌数量
        //para.can4dai2 = this.can4dai2.isSelected();     // 4带2
        //para.can4dai3 = this.can4dai3.isSelected();     // 4带3
        para.hongTao10Niao = this.hongTao10Niao.isSelected();   // 红桃10扎鸟
        //para.fangZuoBi = this.fangZuoBi.isSelected();
        //para.can3aZhaDan = this.can3aZhaDan.isSelected(); 
         para.mustPut = this.mustPut.isSelected();      // 能管必管
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        var _fenshu = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,2,3,4,5,6,7,8,9,10];
        if (this._ZhuNum) {
            para.difen = _fenshu[this._zhuIdx];
        }
        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }

        para.playSpeed = this.speed_radio.getSelectIndex(); // 速度 0:快 1:中 2:慢

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        para.baoDanPutMax = this.baoDanPutMax.isSelected(); // 报单出大牌

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, para.cardNumIndex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_MUSTPUT, para.mustPut);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, para.zhaDanBuChai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, para.showCardNumber);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_FIRSTOUT, para.firstOutOption);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI3, para.can4dai3);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, para.hongTao10Niao);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);
            //util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, para.can3aZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_GPS,  para.gps);
            if (this._ZhuNum) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, this._zhuIdx);
            }
            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, para.playSpeed);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HAVE_ZHADAN, para.havezhadan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_PLAYER_PUT_ZHADAN, para.playerPutZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHADAN_BU_FAN_BEI, para.zhaDanBuFanBei);

            // 报单出大牌
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_BAO_DAN_PUT_MAX, para.baoDanPutMax);
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    haveZhaDanClickCB: function(sender, type) {
        this.clickCB(sender,type);

        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED:
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.refreshZhaDanRelated(sender.isSelected(),false);
                break;
        }
    },

    refreshZhaDanRelated: function(bHaveZhaDanSelected,bFirst) {
        // 有炸弹没有选中
        if (!bHaveZhaDanSelected) {
            this.playerPutZhaDan.setSelected(false);
            this.selectedCB(this.playerPutZhaDan.getChildByName("text"),false);
            this.playerPutZhaDan.setEnabled(false);
            this.playerPutZhaDan.getChildByName("text").setTextColor(cc.color(128, 128, 128));

            this.zhaDanBuFanBei.setSelected(false);
            this.selectedCB(this.zhaDanBuFanBei.getChildByName("text"),false);
            this.zhaDanBuFanBei.setEnabled(false);
            this.zhaDanBuFanBei.getChildByName("text").setTextColor(cc.color(128, 128, 128));
        } else if (bFirst) {
            var isTrue = false;

            if (this._isFriendCard)
                isTrue = this.getBoolItem("playerPutZhaDan", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_PLAYER_PUT_ZHADAN, false);
            this.playerPutZhaDan.setSelected(isTrue);
            this.selectedCB(this.playerPutZhaDan.getChildByName("text"),isTrue)

            if (this._isFriendCard)
                isTrue = this.getBoolItem("zhaDanBuFanBei", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHADAN_BU_FAN_BEI, false);
            this.zhaDanBuFanBei.setSelected(isTrue);
            this.selectedCB(this.zhaDanBuFanBei.getChildByName("text"),isTrue)
        } else {
            this.playerPutZhaDan.setEnabled(true);
            this.selectedCB(this.playerPutZhaDan.getChildByName("text"),false);

            this.zhaDanBuFanBei.setEnabled(true);
            this.selectedCB(this.zhaDanBuFanBei.getChildByName("text"),false);
        }
    }
});