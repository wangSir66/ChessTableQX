var CreateRoomNode_NiuShiBieYueYang = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_NSB_DIFEN = "NIU_SHI_BIE_YUE_YANG_DIFEN";           //底分
        this.localStorageKey.KEY_NSB_3DAIDUI = "NIU_SHI_BIE_YUE_YANG_3DAIDUI";           //三带对
        this.localStorageKey.KEY_NSB_FEIJI_DAI_LIANDUI = "NIU_SHI_BIE_YUE_YANG_FEIJI_DAI_LIANDUI";      //飞机带连对
        this.localStorageKey.KEY_NSB_ZHUA_WEI_FEN = "NIU_SHI_BIE_YUE_YANG_ZHUA_WEI_FEN";      //抓尾分
        this.localStorageKey.KEY_NSB_TEAM = "NIU_SHI_BIE_YUE_YANG_TEAM";           // 队伍
    },
    changeToPlayerNumber:function (num) {
        // if (num == 2){
        //     this.fangZuoBi.setVisible(false);
        //     this.firstHeiTao3.setVisible(false)
        //     for(var i = 0; i < this.nodeListFirstOutCard.length; i++){
        //         var radio = this.nodeListFirstOutCard[i]
        //         radio.setVisible(true)
        //     }
        //     // 隐藏防强关
        //     this.fangQiangGuan.setVisible(false)
        //     // 炸弹不可拆放到防强关位置
        //     this.zhaDanBuChai.setPosition(this.fangQiangGuanPos)
        // }else{
        //     this.fangZuoBi.setVisible(true);
        //     this.firstHeiTao3.setVisible(true)
        //     for(var i = 0; i < this.nodeListFirstOutCard.length; i++){
        //         var radio = this.nodeListFirstOutCard[i]
        //         radio.setVisible(false)
        //     }
        //     this.fangQiangGuan.setVisible(true)
        //     this.zhaDanBuChai.setPosition(this.zhaDanBuChaiPos)
        // }
    },
    initRoundNode:function()
    {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();


        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_NiuShiBieYueYang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_paodekuai").getChildByName("view");
        //this.bg_node.setTouchEnabled(false);
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_paodekuai");
    },
    initPlayNode:function()
    {
        var that = this
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }
        var _bg_Node = this.bg_node;

        // 玩法
        var _playWay = _bg_Node.getChildByName("play_way");
        
        this.sanDaiDui = _playWay.getChildByName("play_sanDaiDui");
        this.addListenerText(this.sanDaiDui);
        this.sanDaiDui.addEventListener(this.clickCB, this.sanDaiDui);

        this.feiJiDaiLianDui = _playWay.getChildByName("play_feiJiDaiLianDui");
        this.addListenerText(this.feiJiDaiLianDui);
        this.feiJiDaiLianDui.addEventListener(this.clickCB, this.feiJiDaiLianDui);

        this.zhuaWeiFen = _playWay.getChildByName("play_zhuaWeiFen");
        this.addListenerText(this.zhuaWeiFen);
        this.zhuaWeiFen.addEventListener(this.clickCB, this.zhuaWeiFen);

        // 底分
        var _difen = _bg_Node.getChildByName("difen");
        
        var nodeListDiFen = [];
        nodeListDiFen.push( _difen.getChildByName("difen_1") );
        nodeListDiFen.push( _difen.getChildByName("difen_2") );
        nodeListDiFen.push( _difen.getChildByName("difen_3") );
        nodeListDiFen.push( _difen.getChildByName("difen_4") );
        this.difen_radio = createRadioBoxForCheckBoxs(nodeListDiFen,this.radioBoxSelectCB);
        this.addListenerText(nodeListDiFen,this.difen_radio);
        this.nodeListDiFen = nodeListDiFen;

        // 队伍
        var _team = _bg_Node.getChildByName("team");

        var nodeListTeam = [];
        nodeListTeam.push( _team.getChildByName("team_1") );
        nodeListTeam.push( _team.getChildByName("team_2") );
        this.team_radio = createRadioBoxForCheckBoxs(nodeListTeam,this.radioBoxSelectCB);
        this.addListenerText(nodeListTeam,this.team_radio);
        this.nodeListTeam = nodeListTeam;
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }
        //设置上次创建房间时的默认选项

        // 底分
        var difenOption;
        if (isClub) {
            difenOption = this.getNumberItem("niushibie_difen", 1);
            difenOption = [1,2,3,30].indexOf(difenOption);
        }
        else
            difenOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NSB_DIFEN, 0);
        this.difen_radio.selectItem(difenOption)
        this.radioBoxSelectCB(difenOption,this.nodeListDiFen[difenOption],this.nodeListDiFen);

        // 队伍
        var teamOption;
        if (isClub) {
            teamOption = this.getNumberItem("teammode", 1);
            teamOption = teamOption == 1 ? 0 : 1;
        }
        else
            teamOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_NSB_TEAM, 0);
        this.team_radio.selectItem(teamOption)
        this.radioBoxSelectCB(teamOption,this.nodeListTeam[teamOption],this.nodeListTeam);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("sandaidui", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NSB_3DAIDUI, true);
        this.sanDaiDui.setSelected(isTrue);
        var text = this.sanDaiDui.getChildByName("text");
        this.selectedCB(text,isTrue);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("feijidailiandui", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NSB_FEIJI_DAI_LIANDUI, true);
        this.feiJiDaiLianDui.setSelected(isTrue);
        var text = this.feiJiDaiLianDui.getChildByName("text");
        this.selectedCB(text,isTrue);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("zhuaweifen", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_NSB_ZHUA_WEI_FEN, true);
        this.zhuaWeiFen.setSelected(isTrue);
        var text = this.zhuaWeiFen.getChildByName("text");
        this.selectedCB(text,isTrue);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_NIU_SHI_BIE;
        para.maxPlayer = 4;

        var diFenList = [1,2,3,30];
        para.niushibie_difen = diFenList[this.difen_radio.getSelectIndex()]; // 底分（1,2,3,30）
        para.teammode = this.team_radio.getSelectIndex() == 0 ? 1 : 2; // 分队模式(1:摸队，2：铁队)

        para.sandaidui = this.sanDaiDui.isSelected(); // 是否可以三代对子(bool)
        para.feijidailiandui = this.feiJiDaiLianDui.isSelected(); // 飞机是否可以代连对(bool)
        para.zhuaweifen = this.zhuaWeiFen.isSelected(); // 是否抓尾分(bool)

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NSB_DIFEN, this.difen_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_NSB_TEAM, this.team_radio.getSelectIndex());

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NSB_3DAIDUI, para.sandaidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NSB_FEIJI_DAI_LIANDUI, para.feijidailiandui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_NSB_ZHUA_WEI_FEN, para.zhuaweifen);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});