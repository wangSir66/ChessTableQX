var CreateRoomNode_ynxuezhan = CreateRoomNodeYaAn.extend({
    //创建ui 以及变量保存
    initAll: function (IsFriendCard) {
        let bg_node = ccs.load("bg_xuezhan.json").node;
        this.addChild(bg_node);
        bg_node.setScale(0.9, 0.9)
        bg_node.setPosition(-200, 10);
        this.bg_node = bg_node.getChildByName("bg_shuyang");
        this._view = this.bg_node.getChildByName("view");
        //初始化固定数据
        this.rangeScore = [1, 20];
        this.trustTimes = [0, 30, 60, 90];
    },

    callSelectBack: function (indx, item, list) {
        this._super(indx, item, list);
        // const isNum = parseInt(indx);
        // if (isNum >= 0 && item) {
        //     indx = Number(indx);
        //     let p = item.getParent();
        //     if (p.name == 'fangshu') ;
        // }
    },

    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.initFangShu();
    },

    initFangShu: function () {
        const Indx = this.getFangShu(),
            pz = this.RedioGroup['paizhang'],
            bdt = this.getBtnByName('btnCheck_badaotang'),
            dq = this.getBtnByName('btnCheck_DesignatingUnwantedEnabled'),
            phkh = this.getBtnByName('btnCheck_Pinghudianpao');
        if (Indx === 0 || Indx === 1) {
            pz._nodeList[0].x = 170;
            pz._nodeList[1].x = 435;
            pz._nodeList[1].visible = true;
            pz._nodeList[2].visible = false;
            if (pz.getSelectIndex() == 2) pz.selectItem(0);
        } else if (Indx === 2 || Indx === 3) {
            pz._nodeList[0].x = 435;
            pz._nodeList[1].x = 700;
            pz._nodeList[2].x = 170;
            pz._nodeList[1].visible = true;
            pz._nodeList[2].visible = true;
        } else {
            pz._nodeList[0].x = 435;
            pz._nodeList[1].visible = false;
            if (pz.getSelectIndex() == 2) pz.selectItem(0);
            pz._nodeList[2].x = 170;
            pz._nodeList[2].visible = true;
        }
        dq.visible = Indx === 0 || Indx === 1;
        phkh.visible = !(Indx === 0 || Indx === 1);
        bdt.visible = !(Indx === 3 || Indx === 4);
        this.setDiaNumData(this.bg_node);
    },

    getSelectPlayNum: function () {
        let maxP = 4;
        switch (this._data.gameType) {
            case MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG://血战
                maxP = 4;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_3to2://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_3to3://血战
                maxP = 3;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_2to2://血战
            case MjClient.GAME_TYPE.XUE_ZHAN_2to1://血战
                maxP = 2;
                break;
        }
        return maxP;
    },

    //重置、初始化规则
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        const key_nameR = {
            'fengding': ['PointsLimit', 3, [3, 4, 5]],
            'dianganghua': ['DianGangHua', 1, [1, 0]],
            'paizhang': ['Forming', 10, [10, 13, 7]],
            'huansanzhang': ['SwappingType', 0, [0, 1, 2]],
            'zimojia': ['PointOfWinning', 0, [2, 1, 0]]
        },
            key_nameC = {
                'btnCheck_DesignatingUnwantedEnabled': ['DesignatingUnwantedEnabled', false],
                'btnCheck_Pinghudianpao': ['PingHuCanWinningByOther', false],
                'btnCheck_badaotang': ['DgwMultipleEnabled', false],
                'btnCheck_CallForwardingEnabled': ['CallForwardingEnabled', false],
                'btnCheck_duiduihu': ['DuiDuiHuPoints', false],
                'btnCheck_MenQingEnabled': ['MenQingEnabled', false],
                'btnCheck_ZhongZhangEnabled': ['ZhongZhangEnabled', false],
                'btnCheck_WinningFanEnabled': ['WinningFanEnabled', false],
                'btnCheck_WinningLastEnabled': ['WinningLastEnabled', false],
                'btnCheck_YaoJiuJiangDuiEnabled': ['YaoJiuJiangDuiEnabled', false],
                'btnCheck_KaXingWu': ['KaxingwuEnabled', false],
            };

        this.InitCurrentSelect(key_nameR, key_nameC);
    },
    getFangShu: function () {
        let maxP = 0;
        switch (this._data.gameType) {
            case MjClient.GAME_TYPE.XUE_ZHAN_MAHJONG://血战
                maxP = 0;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_3to2://血战
                maxP = 2;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_3to3://血战
                maxP = 1;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_2to2://血战
                maxP = 3;
                break;
            case MjClient.GAME_TYPE.XUE_ZHAN_2to1://血战
                maxP = 4;
                break;
        }
        return maxP;
    },
    getSelectedPara: function () {
        const gameType = this._data.gameType,
            Rule = {
                gameType: gameType,//gameid
                maxPlayer: this.getSelectPlayNum(),//人数
                subRule: this.getFangShu(),//房数
                PointsLimit: [3, 4, 5][this.RedioGroup['fengding'].getSelectIndex()],//番数限制
                DianGangHua: [1, 0][this.RedioGroup['dianganghua'].getSelectIndex()],//点杠花规则
                Forming: [10, 13, 7][this.RedioGroup['paizhang'].getSelectIndex()],//发牌张数规则
                SwappingType: this.RedioGroup['huansanzhang'].getSelectIndex(),//换三张
                PointOfWinning: [2, 1, 0][this.RedioGroup['zimojia'].getSelectIndex()],//自摸加分规则
                CallForwardingEnabled: this.getCheckboxSelectedByName('btnCheck_CallForwardingEnabled'),//是否开启呼叫转移
                DuiDuiHuPoints: this.getCheckboxSelectedByName('btnCheck_duiduihu') ? 2 : 1,//对对胡 1 2 番
                MenQingEnabled: this.getCheckboxSelectedByName('btnCheck_MenQingEnabled'),//是否开启门清
                ZhongZhangEnabled: this.getCheckboxSelectedByName('btnCheck_ZhongZhangEnabled'),//是否开启中张
                WinningFanEnabled: this.getCheckboxSelectedByName('btnCheck_WinningFanEnabled'),//是否开启天地胡
                WinningLastEnabled: this.getCheckboxSelectedByName('btnCheck_WinningLastEnabled'),//是否开启海底捞
                YaoJiuJiangDuiEnabled: this.getCheckboxSelectedByName('btnCheck_YaoJiuJiangDuiEnabled'),//是否开启幺九将对
                KaxingwuEnabled: this.getCheckboxSelectedByName('btnCheck_KaXingWu'),//卡星五
                DgwMultipleEnabled: false,//是否点杠收多家
                tipCountdown: 30
            };
        Rule.LackofEnabled = Rule.subRule == 2 || Rule.subRule == 3;//是否两房
        Rule.JustoneEnabled = Rule.subRule == 4 ? 2 : -1;//二人一房
        Rule.SwappingTiles = Rule.SwappingType == 2 ? 0 : 3;//换牌张数
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const item = this._btnItems[_i];
            if (item.name == 'btnCheck_DesignatingUnwantedEnabled') {//是否开启定缺
                Rule.DesignatingUnwantedEnabled = item.visible ? item.isSelected() : false;
            } else if (item.name == 'btnCheck_Pinghudianpao') {//平胡点炮可胡
                Rule.PingHuCanWinningByOther = item.visible ? item.isSelected() : false;
            } else if (item.name == 'btnCheck_badaotang') {//巴倒烫、点杠收多家
                Rule.DgwMultipleEnabled = item.visible ? item.isSelected() : false;
            }
        }
        this.getExtraSelectedPara(Rule);
        return Rule;
    }
});