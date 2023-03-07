var CreateRoomNode_PaoDeKuaiHuaian = CreateRoomNode.extend({
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
        this.localStorageKey.KEY_PDK_ZHA_DAN_FAN_BEI= "PAO_DE_KUAI_HA_ZHA_DAN_FAN_BEI";         // 炸弹翻倍
        this.localStorageKey.KEY_PDK_XIAO_GUAN_X2   = "PAO_DE_KUAI_HA_XIAO_GUAN_X2";            // 小关X2
        this.localStorageKey.KEY_PDK_DA_GUAN_X3     = "PAO_DE_KUAI_HA_DA_GUAN_X3";              // 大关X3
        this.localStorageKey.KEY_PDK_DA_GUAN_X2     = "PAO_DE_KUAI_HA_DA_GUAN_X2";              // 大关X2
        //this.localStorageKey.KEY_PDK_4DAI3          = "PAO_DE_KUAI_HA_4DAI3";                   // 4带3
        //this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO = "PAO_DE_KUAI_HA_HONG_TAO_10_NIAO";      // 红桃10扎鸟
        //this.localStorageKey.KEY_PDK_FANG_ZUO_BI    = "PAO_DE_KUAI_HA_FANG_ZUO_BI";             // 防作弊
        //this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN  = "PAO_DE_KUAI_HA_CAN_3A_ZHADAN";           // 三个A算炸弹
        this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_HA_DIFEN";                   // 底分
        this.localStorageKey.KEY_PDK_TONGHUASHUN    = "PAO_DE_KUAI_HA_TONGHUASHUN";              //同花顺
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_HA_SHUFFLE_OPTION" // 切牌
        this.localStorageKey.KEY_PDK_PLAYSPEED   = "PAO_DE_KUAI_HA_PLAY_SPEED";           //速度
        this.localStorageKey.KEY_PDK_BOMB_SCORE   = "PAO_DE_KUAI_HA_BOMB_SCORE";           //炸弹计分还是翻倍
        this.localStorageKey.KEY_PDK_BOMB_SCORE_CNT   = "PAO_DE_KUAI_HA_BOMB_SCORE_CNT";           //炸弹计分数量   

        this.setExtraKey({
            fanBei: "PAO_DE_KUAI_HUAIAN_FAN_BEI",  //大结算翻倍
            fanBeiScore: "PAO_DE_KUAI_HUAIAN_FAN_BEI_SCORE",  //少于X分大结算翻倍
            tuoGuan: "PAO_DE_KUAI_HUAIAN_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_HUAIAN_FENG_DING"          // 封顶
        });
    },
    changeBombScore:function()
    {
        var bomb_radio_index = this.bomb_radio.getSelectIndex();
        this.play_bomb_5score.setVisible(bomb_radio_index == 0);
        this.play_bomb_10score.setVisible(bomb_radio_index == 0);
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_PaoDeKuaiHuaian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
        this._bg_View = this.bg_node.getChildByName("view");
        if (!this._bg_View) this._bg_View = this.bg_node;
    },
    initPlayNode:function()
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }
        var _bg_Node = this._bg_View//this.bg_node;
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

        // this.zhaDanFanBei = _playWay.getChildByName("play_zhaDanFanBei");
        // this.addListenerText(this.zhaDanFanBei);
        // this.zhaDanFanBei.addEventListener(this.clickCB, this.zhaDanFanBei);

        this._zhuIdx = 1;
        this._ZhuNum = this.bg_node.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = this.bg_node.getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 0.5) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0.5) {
                        this._zhuIdx = this._zhuIdx == 1 ? 0.5:(this._zhuIdx-1);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                        cc.log("----------------this._guidIdx = " + this._zhuIdx);
                    }
                }
            }, this);
            this._Button_add = this.bg_node.getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx = (this._zhuIdx<1)? (this._zhuIdx+0.5): (this._zhuIdx+1);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        // 速度
        var nodeListSpeed = [];
        nodeListSpeed.push( _playWay.getChildByName("play_speed_fast") );
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

        // 炸弹计分还是翻倍
        var nodeListBomb = [];
        nodeListBomb.push( _playWay.getChildByName("play_bomb_add_5") );
        nodeListBomb.push( _playWay.getChildByName("play_bomb_double") );
        this.bomb_radio = createRadioBoxForCheckBoxs(nodeListBomb,function(index, sender, list){
            that.radioBoxSelectCB(index, sender, list);
            that.changeBombScore();
        });
        this.addListenerText(nodeListBomb,this.bomb_radio,  function(a){
            that.changeBombScore();
        }.bind(this));
        this.nodeListBomb = nodeListBomb;

        //炸弹计分数量
        var that = this;
        var nodeListBombCnt = [];
        this.play_bomb_5score = _playWay.getChildByName("play_bomb_5score")
        this.play_bomb_10score = _playWay.getChildByName("play_bomb_10score")
        nodeListBombCnt.push( this.play_bomb_5score );
        nodeListBombCnt.push( this.play_bomb_10score );
        this.bomb_cnt_radio = createRadioBoxForCheckBoxs(nodeListBombCnt,this.radioBoxSelectCB);
        this.addListenerText(nodeListBombCnt,this.bomb_cnt_radio);
        this.nodeListBombCnt = nodeListBombCnt; 

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

        //速度
        var playSpeedOption;
        if (isClub)
            playSpeedOption = this.getNumberItem("playSpeed", 1);
        else
            playSpeedOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, 1);
        this.speed_radio.selectItem(playSpeedOption)
        this.radioBoxSelectCB(playSpeedOption,this.nodeListSpeed[playSpeedOption],this.nodeListSpeed);
        

        var selectIndex;
        if (isClub)
            selectIndex = this.getBoolItem("mustPut", false) ? "0" : "1";
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

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("can3dai2", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_3DAI2, false);
        this.can3dai2.setSelected(isTrue);
        var text = this.can3dai2.getChildByName("text");
        this.selectedCB(text,isTrue)

        // var isTrue;
        // if (isClub)
        //     isTrue = this.getBoolItem("isZhaDanFanBei", false);
        // else
        //     isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_FAN_BEI, false);
        // this.zhaDanFanBei.setSelected(isTrue);
        // var text = this.zhaDanFanBei.getChildByName("text");
        // this.selectedCB(text,isTrue)

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
        
        // 炸弹计分或翻倍
        var bombOption;
        if (isClub)
            bombOption = this.getNumberItem("bombScore", 0);
        else
            bombOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_BOMB_SCORE, 0);
        this.bomb_radio.selectItem(bombOption)
        this.radioBoxSelectCB(bombOption,this.nodeListBomb[bombOption],this.nodeListBomb);

        // 炸弹计分数量
        var bombCntOption;
        if (isClub)
            bombCntOption = this.getNumberItem("bombScoreCnt", 0);
        else
            bombCntOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_BOMB_SCORE_CNT, 0);
        this.bomb_cnt_radio.selectItem(bombCntOption)
        this.radioBoxSelectCB(bombCntOption,this.nodeListBombCnt[bombOption],this.nodeListBombCnt);
        this.play_bomb_5score.setVisible(bombOption == 0);
        this.play_bomb_10score.setVisible(bombOption == 0);

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_HA;
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2;// this.playerNumber_2.isSelected() ? 2 : 3;
        para.mustPut = this._mustPut_radio.getSelectIndex() == 0;
        para.isXiaoGuan = this.xiaoguanX2.isSelected();
        para.isDaGuan = this.daguanX3.isSelected();
        para.isDaGuanX2 = this.daguanX2.isSelected();
        para.mustPutHongTaoSan = this._xianshou_radio.getSelectIndex() == 0;
        para.can4dai2 = this.can4dai2.isSelected();     // 4带2
        para.can3dai2 = this.can3dai2.isSelected();     // 3带2
        para.tongHuaShun = this.tonghuashun.isSelected();
        // para.isZhaDanFanBei = this.zhaDanFanBei.isSelected();
        para.showCardNumber = true;
        para.playSpeed = this.speed_radio.getSelectIndex(); // 速度 0:快 1:慢
        para.bombScore = this.bomb_radio.getSelectIndex(); // 炸弹计分 0:炸弹加分 1:炸弹翻倍
        para.bombScoreCnt = this.bomb_cnt_radio.getSelectIndex(); // 炸弹计分数量 0:炸弹加5分 1:炸弹加10分

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }
        if (this._ZhuNum) {
            para.difen = this._zhuIdx;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, para.difen);
        }

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
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_FAN_BEI, para.isZhaDanFanBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, para.playSpeed);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_BOMB_SCORE, para.bombScore);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_BOMB_SCORE_CNT, para.bombScoreCnt);

            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});