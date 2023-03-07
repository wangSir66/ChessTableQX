
var CreateRoomNode_PaoDeKuaiXS = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_PLAYERNUMBER   = "PAO_DE_KUAI_XS_PLAYER_NUMBER";           // 玩家数量

        this.localStorageKey.KEY_PDK_SHOWCARDNUMBER = "PAO_DE_KUAI_XS_SHOW_CARD_NUMBER";        // 显示牌数
        this.localStorageKey.KEY_PDK_XIAN_SHOU      = "PAO_DE_KUAI_XS_XIAO_SHOU";               // 先手
        this.localStorageKey.KEY_PDK_4DAI2          = "PAO_DE_KUAI_XS_4DAI2";                   // 4带2

        this.localStorageKey.KEY_PDK_MUST_PUT       = "PAO_DE_KUAI_XS_MUST_PUT";                 //能管必管
        this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN= "PAO_DE_KUAI_XS_ZHA_DAN_JIA_FEN";         // 炸弹加分
        this.localStorageKey.KEY_PDK_CAN_4DAI1      = "PAO_DE_KUAI_XS_CAN_4DAI1";            // 

        this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_XS_DIFEN";                   // 底分
        this.localStorageKey.KEY_PDK_DAGUAN          = "PAO_DE_KUAI_XS_DAGUAN";                   // 大关
        this.localStorageKey.KEY_PDK_XIAOGUAN          = "PAO_DE_KUAI_XS_XIAOGUAN";                   // 小关
        
        this.setExtraKey({
        });
    },
    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_paodekuaiXS.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initPlayNode:function()
    {   
        this._super();
        var _bg_Node = this.bg_node.getChildByName("view");

        var _playWay = _bg_Node.getChildByName("play_way");

        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("playerNumber_2") );  
        nodeListA.push( _playWay.getChildByName("playerNumber_3") ); 
        nodeListA.push( _playWay.getChildByName("playerNumber_0") );     
        var cb = function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);

            var _visi =false;
            if(index == 1 || index == 2 ){
                _visi = true;
            }
            for(var k in this.nodeListC ){
                this.nodeListC[k].setVisible(_visi);
            }
            this._xianshou.setVisible(_visi);

        }.bind(this)
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, cb);
        this.addListenerText(nodeListA, this._playNode_player_number_radio, cb);
        this.nodeListA = nodeListA;
		this.initPlayNumNode(nodeListA, [2, 3, 3]); 


        // 必管
        this.mustPut = _playWay.getChildByName("play_mustPut");
        this.addListenerText(this.mustPut);
        this.mustPut.addEventListener(this.clickCB, this.mustPut);

        this.showCardNumber = _playWay.getChildByName("play_showCardNumber");
        this.addListenerText(this.showCardNumber);
        this.showCardNumber.addEventListener(this.clickCB, this.showCardNumber);

        // 炸弹带一
        this.can4dai1 = _playWay.getChildByName("play_boomWithOne");
        this.addListenerText(this.can4dai1);
        this.can4dai1.addEventListener(this.clickCB, this.can4dai1);

        //先手
        this._xianshou = _bg_Node.getChildByName("round").getChildByName("xianshou");
        var nodeListC = [];
        nodeListC.push( _playWay.getChildByName("play_firstWin") );
        nodeListC.push( _playWay.getChildByName("play_firstHongTao") );
        this._xianshou_radio = createRadioBoxForCheckBoxs(nodeListC,this.radioBoxSelectCB);
        this.addListenerText(nodeListC,this._xianshou_radio);
        this.nodeListC = nodeListC;

        // 4带2 
        this.can4dai2 = _playWay.getChildByName("play_fourWithTwo");
        this.addListenerText(this.can4dai2);
        this.can4dai2.addEventListener(this.clickCB, this.can4dai2);
        
        //炸弹分
        this.zhadanjiafen = _playWay.getChildByName("play_zhaDan10Fen");
        this.addListenerText(this.zhadanjiafen);
        this.zhadanjiafen.addEventListener(this.clickCB, this.zhadanjiafen);

        // 大关
        this.daGuan = _playWay.getChildByName("play_daGuan");
        this.addListenerText(this.daGuan);
        this.daGuan.addEventListener(this.clickCB, this.daGuan);

        // 小关
        this.xiaoGuan = _playWay.getChildByName("play_xiaoGuan");
        this.addListenerText(this.xiaoGuan);
        this.xiaoGuan.addEventListener(this.clickCB, this.xiaoGuan);

        //
        var updateZhaDanFen = function(index) {
            this.zhadanjiafen.getChildByName("text").setString("炸弹" + 10 * [1,2][index] + "分");
        }.bind(this);

        var _diFen_NodeList = [];
        _diFen_NodeList.push( _playWay.getChildByName("baseScore_1"));
        _diFen_NodeList.push( _playWay.getChildByName("baseScore_2"));
        this._diFen_radio = createRadioBoxForCheckBoxs(_diFen_NodeList, function(index){
            updateZhaDanFen(index);
            this.radioBoxSelectCB(index, _diFen_NodeList[index], _diFen_NodeList);
        }.bind(this));
        this.addListenerText(_diFen_NodeList,this._diFen_radio,updateZhaDanFen);
        this._diFen_NodeList = _diFen_NodeList;

        this.initExtraPlayNode(_playWay);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }
        //设置上次创建房间时的默认选项
        var option = 0;
        if (isClub)
            if ( this.getBoolItem("convertible", false) )
                option = 2;
            else
                option = [2, 3, 3].indexOf(this.getNumberItem("maxPlayer", 3));
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, 1);
        this._playNode_player_number_radio.selectItem(option)
        this.radioBoxSelectCB(option,this.nodeListA[option],this.nodeListA);

        var _visi = (option == 1 || option == 2);
        for(var k in this.nodeListC ){
            this.nodeListC[k].setVisible(_visi);
        }
        this._xianshou.setVisible(_visi);


        if (isClub)
            option = this.getBoolItem("showCardNumber", true);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, true);
        this.showCardNumber.setSelected(option);
        var text = this.showCardNumber.getChildByName("text");
        this.selectedCB(text, option);


        if (isClub)
            option = this.getBoolItem("mustPut", true);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_MUST_PUT, true);
        this.mustPut.setSelected(option);
        var text = this.mustPut.getChildByName("text");
        this.selectedCB(text,option)


        if (isClub)
            option = this.getBoolItem("can4dai1", false);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_4DAI1, false);
        this.can4dai1.setSelected(option);
        var text = this.can4dai1.getChildByName("text");
        this.selectedCB(text,option)


        if (isClub)
            option = this.getNumberItem("firstOutOption", 0);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, 0);
        this._xianshou_radio.selectItem(option)
        this.radioBoxSelectCB(option,this.nodeListC[option],this.nodeListC);

        if (isClub)
            option = this.getNumberItem("difen", 1);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_DIFEN, 1);
        var difenIndex = [1,2].indexOf(option);
        this._diFen_radio.selectItem(difenIndex)
        this.radioBoxSelectCB(difenIndex, this._diFen_NodeList[difenIndex], this._diFen_NodeList);


        if (isClub)
            option = this.getBoolItem("can4dai2", false);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI2, false);
        this.can4dai2.setSelected(option);
        var text = this.can4dai2.getChildByName("text");
        this.selectedCB(text,option);

        if (isClub)
            option = this.getBoolItem("daGuan", true);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_DAGUAN, true);
        this.daGuan.setSelected(option);
        this.selectedCB(this.daGuan.getChildByName("text"),option);

        if (isClub)
            option = this.getBoolItem("xiaoGuan", true);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_XIAOGUAN, true);
        this.xiaoGuan.setSelected(option);
        this.selectedCB(this.xiaoGuan.getChildByName("text"),option);


        if (isClub)
            option = this.getNumberItem("zhaDanFen", 10);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, 10);
        this.zhadanjiafen.setSelected(option > 0);
        var text = this.zhadanjiafen.getChildByName("text");
        this.selectedCB(text,option > 0)
        text.setString("炸弹" + 10 * [1,2][difenIndex] + "分");

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};

        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_XIANG_SHUI;
        para.maxPlayer = [2, 3, 3][this._playNode_player_number_radio.getSelectIndex() ];
        para.convertible = this._playNode_player_number_radio.getSelectIndex() == 2 ? true: false;
        para.mustPut = this.mustPut.isSelected();
        para.can4dai1 = this.can4dai1.isSelected();
        para.firstOutOption = this._xianshou_radio.getSelectIndex();
        para.can4dai2 = this.can4dai2.isSelected();  
        para.difen = [1,2][this._diFen_radio.getSelectIndex()];    
        para.zhaDanFen = this.zhadanjiafen.isSelected() ? 10 : 0;
        para.showCardNumber = this.showCardNumber.isSelected();

        para.daGuan = this.daGuan.isSelected();  
        para.xiaoGuan = this.xiaoGuan.isSelected();  

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, this._playNode_player_number_radio.getSelectIndex() );
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_4DAI1, para.can4dai1);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_XIAN_SHOU, para.firstOutOption);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_ZHA_DAN_JIA_FEN, para.zhaDanFen );
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, para.showCardNumber);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, para.difen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_MUST_PUT, para.mustPut);  

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_DAGUAN, para.daGuan);  
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_XIAOGUAN, para.xiaoGuan);  
        }

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});

