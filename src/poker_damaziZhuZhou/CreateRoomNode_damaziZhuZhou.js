var CreateRoomNode_DaMaZiZhuZhou = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_DMZ_DIFEN = "DA_MA_ZI_ZHU_ZHOU_DIFEN";           //底分
        this.localStorageKey.KEY_DMZ_BAOXI = "DA_MA_ZI_ZHU_ZHOU_BAO_XI";           //报喜
        this.localStorageKey.KEY_DMZ_TEAM = "DA_MA_ZI_ZHU_ZHOU_TEAM";           // 队伍
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
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();


        //if(MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_DaMaZiZhuZhou.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_paodekuai").getChildByName("view");
        this.bg_node.setTouchEnabled(false);
        if((this._isRoomCardMode || this._isMatchMode) && this.bg_node){
            //房卡模式的创建ui处理过
            this.bg_node.setTouchEnabled(true);
        }
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

        // 底分
        var _difen = _bg_Node.getChildByName("difen");

        var nodeListDifen = [];
        nodeListDifen.push( _difen.getChildByName("difen_1") );
        nodeListDifen.push( _difen.getChildByName("difen_2") );
        nodeListDifen.push( _difen.getChildByName("difen_3") );
        this.difenRadio = createRadioBoxForCheckBoxs(nodeListDifen,this.radioBoxSelectCB);
        this.addListenerText(nodeListDifen,this.difenRadio);
        this.nodeListDifen = nodeListDifen;

        // 队伍
        var _team = _bg_Node.getChildByName("team");

        var nodeListTeam = [];
        nodeListTeam.push( _team.getChildByName("team_1") );
        nodeListTeam.push( _team.getChildByName("team_2") );
        this.teamRadio = createRadioBoxForCheckBoxs(nodeListTeam,this.radioBoxSelectCB);
        this.addListenerText(nodeListTeam,this.teamRadio);
        this.nodeListTeam = nodeListTeam;

        // 报喜
        var _baoxi = _bg_Node.getChildByName("baoxi");

        this.damaziBaoXi = _baoxi.getChildByName("damazi_baoxi");
        this.addListenerText(this.damaziBaoXi);
        this.damaziBaoXi.addEventListener(this.clickCB, this.damaziBaoXi);
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
        if (isClub)
            difenOption = this.getNumberItem("damazi_difen", 1);
        else
            difenOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DMZ_DIFEN, 1);
        var difenAry = [1,20,30]
        difenOption = difenAry.indexOf(difenOption) < 0 ? 0 :difenAry.indexOf(difenOption);
        this.difenRadio.selectItem(difenOption)
        this.radioBoxSelectCB(difenOption,this.nodeListDifen[difenOption],this.nodeListDifen);

        // 队伍
        var teamOption;
        if (isClub) {
            teamOption = this.getNumberItem("teammode", 1);
            teamOption = teamOption == 1 ? 0 : 1;
        }
        else
            teamOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DMZ_TEAM, 0);
        this.teamRadio.selectItem(teamOption)
        this.radioBoxSelectCB(teamOption,this.nodeListTeam[teamOption],this.nodeListTeam);

        var isTrue;
        if (isClub)
            isTrue = this.getBoolItem("baoxi", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DMZ_BAOXI, false);
        this.damaziBaoXi.setSelected(isTrue);
        var text = this.damaziBaoXi.getChildByName("text");
        this.selectedCB(text,isTrue);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.ZHU_ZHOU_DA_MA_ZI;
        para.maxPlayer = 4;
        var difenAry = [1,20,30]
        para.damazi_difen = difenAry[this.difenRadio.getSelectIndex()] // 底分
        para.teammode = this.teamRadio.getSelectIndex() == 0 ? 1 : 2; // 分队模式(1:摸队，2：铁队)
        para.baoxi = this.damaziBaoXi.isSelected(); // 是否报喜(bool)

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DMZ_DIFEN, para.damazi_difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DMZ_TEAM, this.teamRadio.getSelectIndex());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DMZ_BAOXI, para.baoxi);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});