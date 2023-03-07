/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_paodekuaiHaian = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_playerNumber   = "PAO_DE_KUAI_HAIAN_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_PDK_mustPut = "PAO_DE_KUAI_HAIAN_MUST_PUT";                 //能管必管
        this.localStorageKey.KEY_PDK_showCardNumber = "PAO_DE_KUAI_HAIAN_SHOW_CARD_NUMBER";   //显示牌数
        //this.localStorageKey.KEY_PDK_mustPutHongTaoSan = "PAO_DE_KUAI_HAIAN_MUST_PUT_HONG_TAO_SAN";   //先出红桃3
        //this.localStorageKey.KEY_PDK_zhaDanFanBei = "PAO_DE_KUAI_HAIAN_ZHA_DAN_FAN_BEI";      //炸弹翻倍
        this.localStorageKey.KEY_PDK_biMenFanBei = "PAO_DE_KUAI_HAIAN_BI_MEN_FAN_BEI";         //16张32分/闭门翻倍
        this.localStorageKey.KEY_PDK_winCountType = "PAO_DE_KUAI_HAIAN_WIN_COUNT_TYPE";        //一个赢家/两个赢家
        this.localStorageKey.KEY_PDK_cardType = "PAO_DE_KUAI_HAIAN_CARD_TYPE";                 //有AAAA还是AAA+2
        this.localStorageKey.KEY_PDK_baoDanMustPut = "PAO_DE_KUAI_HAIAN_BAO_DAN_MUST_PUT";     //报单必顶
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_HAIAN_SHUFFLE_OPTION"; // 切牌

        this.localStorageKey.KEY_PDK_15_THIRTY = "PAO_DE_KUAI_HAIAN_15_THIRTY";         //15张30分
        this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN = "PAO_DE_KUAI_HAIAN_ZHA_DAN_JIA_FEN";         //炸弹加5分
        this.localStorageKey.KEY_PDK_CAN_ZHADAN_DAI1   = "PAO_DE_KUAI_HAIAN_CAN_ZHADAN_DAI1";              //炸弹可带1张

        this.setExtraKey({
            tuoGuan: "PAO_DE_KUAI_HAIAN_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_HAIAN_FENG_DING"          //封顶
        });
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_paodekuaiHaian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initRoundNode: function() {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode:function()
    {
        this._super();
        var _bg_Node = this.bg_node.getChildByName("view");

        var _playWay = _bg_Node.getChildByName("play_way");
        
        this.mustPut = _playWay.getChildByName("play_mustPut");
        this.addListenerText(this.mustPut);
        this.mustPut.addEventListener(this.clickCB, this.mustPut);

        this.showCardNumber = _playWay.getChildByName("play_showCardNumber");
        this.addListenerText(this.showCardNumber);
        this.showCardNumber.addEventListener(this.clickCB, this.showCardNumber);

        // this.mustPutHongTaoSan = _playWay.getChildByName("play_mustPutHongTaoSan");
        // this.addListenerText(this.mustPutHongTaoSan);
        // this.mustPutHongTaoSan.addEventListener(this.clickCB, this.mustPutHongTaoSan);
        
        // this.zhaDanFanBei = _playWay.getChildByName("play_zhaDanFanBei");
        // this.addListenerText(this.zhaDanFanBei);
        // this.zhaDanFanBei.addEventListener(this.clickCB, this.zhaDanFanBei);

        this.biMenFanBei = _playWay.getChildByName("play_biMenFanBei");
        this.addListenerText(this.biMenFanBei);
        this.biMenFanBei.addEventListener(this.clickCB, this.biMenFanBei);

        this.baoDanMustPut = _playWay.getChildByName("play_baoDanMustPut");
        this.addListenerText(this.baoDanMustPut);
        this.baoDanMustPut.addEventListener(this.clickCB, this.baoDanMustPut);
        this.baoDanMustPut.schedule(function() {
            this.baoDanMustPut.setVisible(this.winCountType2.isSelected());
        }.bind(this));

        this.playerNumber_3 = _playWay.getChildByName("playerNumber_3");
        this.playerNumber_2 = _playWay.getChildByName("playerNumber_2");
        var nodeList = [];
        nodeList.push( _playWay.getChildByName("playerNumber_3") );
        nodeList.push( _playWay.getChildByName("playerNumber_2") );     
        var cb = function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeList[index], nodeList);
        }.bind(this)
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeList, cb);
        this.addListenerText(nodeList,this._playNode_player_number_radio, cb);
		this.initPlayNumNode(nodeList, [3, 2]); 
		
        this.cardType_AAAA = _playWay.getChildByName("cardType_AAAA");
        this.cardType_AAA2 = _playWay.getChildByName("cardType_AAA2");
        var nodeList2 = [];
        nodeList2.push(this.cardType_AAAA);
        nodeList2.push(this.cardType_AAA2);
        this._playNode_cardType_radio = createRadioBoxForCheckBoxs(nodeList2, this.radioBoxSelectCB);
        this.addListenerText(nodeList2, this._playNode_cardType_radio);

        this.winCountType1 = _playWay.getChildByName("play_winCountType1");
        this.winCountType2 = _playWay.getChildByName("play_winCountType2");
        var nodeList3 = [];
        nodeList3.push(this.winCountType1);
        nodeList3.push(this.winCountType2);
        this._playNode_winCountType_radio = createRadioBoxForCheckBoxs(nodeList3, this.radioBoxSelectCB);
        this.addListenerText(nodeList3, this._playNode_winCountType_radio);

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

        // 15张30分
        this.is15Thirty = _playWay.getChildByName("play_15Thirty");
        this.addListenerText(this.is15Thirty);
        this.is15Thirty.addEventListener(this.clickCB, this.is15Thirty);

        // 炸弹加分
        this.zhaDanJiaFen = _playWay.getChildByName("play_zhaDanJiaFen");
        this.addListenerText(this.zhaDanJiaFen);
        this.zhaDanJiaFen.addEventListener(this.clickCB, this.zhaDanJiaFen);

        // 炸弹可带一张
        this.canZhaDanDai1 = _playWay.getChildByName("play_canZhaDanDai1");
        this.addListenerText(this.canZhaDanDai1);
        this.canZhaDanDai1.addEventListener(this.clickCB, this.canZhaDanDai1);

        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        this._super();
        //设置上次创建房间时的默认选项
        var _currentPlayerNumber;
        if (isClub)
            _currentPlayerNumber = this.getNumberItem("maxPlayer", 3);
        else
            _currentPlayerNumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_playerNumber, 3);
        this.playerNumber_3.setSelected(_currentPlayerNumber != 2); // _currentPlayerNumber == 3
        var text = this.playerNumber_3.getChildByName("text");
        this.selectedCB(text,_currentPlayerNumber != 2)
        this.playerNumber_2.setSelected(_currentPlayerNumber == 2);
        var text = this.playerNumber_2.getChildByName("text");
        this.selectedCB(text, _currentPlayerNumber == 2)

        var _winCountType;
        if (isClub)
            _winCountType = this.getNumberItem("winCountType", 0);
        else
            _winCountType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_winCountType, 0);
        this.winCountType1.setSelected(_winCountType == 0);
        var text = this.winCountType1.getChildByName("text");
        this.selectedCB(text, _winCountType == 0);
        this.winCountType2.setSelected(_winCountType == 1);
        var text = this.winCountType2.getChildByName("text");
        this.selectedCB(text, _winCountType == 1);

        var _cardType;
        if (isClub)
            _cardType = this.getNumberItem("handCardType", 1);
        else
            _cardType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_cardType, 1);
        this.cardType_AAAA.setSelected(_cardType == 0);
        var text = this.cardType_AAAA.getChildByName("text");
        this.selectedCB(text, _cardType == 0);
        this.cardType_AAA2.setSelected(_cardType == 1);
        var text = this.cardType_AAA2.getChildByName("text");
        this.selectedCB(text, _cardType == 1);

        var _mustPut;
        if (isClub)
            _mustPut = this.getBoolItem("mustPut", true);
        else
            _mustPut = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_mustPut, true);
        this.mustPut.setSelected(_mustPut);
        var text = this.mustPut.getChildByName("text");
        this.selectedCB(text, _mustPut)

        var _showCardNumber;
        if (isClub)
            _showCardNumber = this.getBoolItem("showCardNumber", true);
        else
            _showCardNumber = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_showCardNumber, true);
        this.showCardNumber.setSelected(_showCardNumber);
        var text = this.showCardNumber.getChildByName("text");
        this.selectedCB(text, _showCardNumber)

        var _baoDanMustPut;
        if (isClub)
            _baoDanMustPut = this.getBoolItem("baoDanMustPut", false);
        else
            _baoDanMustPut = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_baoDanMustPut, false);
        this.baoDanMustPut.setSelected(_baoDanMustPut);
        var text = this.baoDanMustPut.getChildByName("text");
        this.selectedCB(text, _baoDanMustPut)

        // var _mustPutHongTaoSan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_mustPutHongTaoSan, true);
        // this.mustPutHongTaoSan.setSelected(_mustPutHongTaoSan);
        // var text = this.mustPutHongTaoSan.getChildByName("text");
        // this.selectedCB(text, _mustPutHongTaoSan)

        // var _zhaDanFanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_zhaDanFanBei, false);
        // this.zhaDanFanBei.setSelected(_zhaDanFanBei);
        // var text = this.zhaDanFanBei.getChildByName("text");
        // this.selectedCB(text, _zhaDanFanBei)

        var _biMenFanBei;
        if (isClub)
            _biMenFanBei = this.getBoolItem("isBiMenFanBei", false);
        else
            _biMenFanBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_biMenFanBei, false);
        this.biMenFanBei.setSelected(_biMenFanBei);
        var text = this.biMenFanBei.getChildByName("text");
        this.selectedCB(text, _biMenFanBei);

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

        var bSelected = false;

        // 15张30分
        if (isClub)
            bSelected = this.getBoolItem("is15Thirty", false);
        else
            bSelected = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_15_THIRTY, false);
        this.is15Thirty.setSelected(bSelected);
        this.selectedCB(this.is15Thirty.getChildByName("text"), bSelected)

        // 炸弹加分
        if (isClub)
            bSelected = this.getBoolItem("isZhaDanJiaFen", false);
        else
            bSelected = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, false);
        this.zhaDanJiaFen.setSelected(bSelected);
        this.selectedCB(this.zhaDanJiaFen.getChildByName("text"), bSelected)

        // 炸弹可带1张
        if (isClub)
            bSelected = this.getBoolItem("canZhaDanDai1", false);
        else
            bSelected = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_ZHADAN_DAI1, false);
        this.canZhaDanDai1.setSelected(bSelected);
        this.selectedCB(this.canZhaDanDai1.getChildByName("text"), bSelected)

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_HAIAN;
        para.maxPlayer = this.playerNumber_2.isSelected() ? 2 : 3;
        //para.mustPutHongTaoSan = this.mustPutHongTaoSan.isSelected();
        para.mustPut = this.mustPut.isSelected();
        para.showCardNumber = this.showCardNumber.isSelected();
        para.isBiMenFanBei = this.biMenFanBei.isSelected();
        para.handCardType = this.cardType_AAAA.isSelected() ? 0 : 1;
        para.winCountType = this.winCountType1.isSelected() ? 0 : 1;
        para.baoDanMustPut = para.winCountType == 1 && this.baoDanMustPut.isSelected();
        //para.isZhaDanFanBei = this.zhaDanFanBei.isSelected();
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }


        // 15张30分
        para.is15Thirty = this.is15Thirty.isSelected();

        // 炸弹加分
        para.isZhaDanJiaFen = this.zhaDanJiaFen.isSelected();

        // 炸弹可带1张
        para.canZhaDanDai1 = this.canZhaDanDai1.isSelected();

        cc.log('=======================', para.is15Thirty, para.isZhaDanJiaFen, para.canZhaDanDai1)
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_playerNumber, para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_mustPut, para.mustPut);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_showCardNumber, para.showCardNumber);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_mustPutHongTaoSan, para.mustPutHongTaoSan);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_zhaDanFanBei, para.isZhaDanFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_biMenFanBei, para.isBiMenFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_cardType, para.handCardType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_winCountType, para.winCountType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_baoDanMustPut, para.baoDanMustPut);
            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_15_THIRTY, para.is15Thirty);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, para.isZhaDanJiaFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_ZHADAN_DAI1, para.canZhaDanDai1);
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));

        return para;
    }
});