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
        const isNum = parseInt(indx);
        if (isNum >= 0 && item) {
            indx = Number(indx);
            let p = item.getParent();
            if (p.name == 'fangshu') this.initFangShu();
        }
    },

    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.initFangShu();
    },

    initFangShu: function () {
        const Indx = this.RedioGroup['fangshu'].getSelectIndex(),
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
        const maxP = [4, 3, 3, 2, 2][this.RedioGroup['fangshu'].getSelectIndex()];
        return maxP;
    },

    //重置、初始化规则
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        const key_nameR = {
            'fangshu': ['subRule', 0, [0, 1, 2, 3, 4]],
            'fengding': ['PointsLimit', 3, [3, 4, 5]],
            'dianganghua': ['DianGangHua', 1, [1, 0]],
            'paizhang': ['Forming', 10, [10, 13, 7]],
            'huansanzhang': ['SwappingType', 0, [0, 1, 2]],
            'zimojia': ['PointOfWinning', 0, [2, 1, 0]]
        },
            key_nameC = {
                'btnCheck_DesignatingUnwantedEnabled': ['DesignatingUnwantedEnabled', false],
                'btnCheck_Pinghudianpao': ['PingHuCanWinningByOther', false],
                'btnCheck_badaotang': ['BaDaoTang', false],
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

    getSelectedPara: function () {
        const gameType = this._data.gameType;
        const Rule = {
            gameType: gameType,
            maxPlayer: this.getSelectPlayNum(),
            subRule: this.RedioGroup['fangshu'].getSelectIndex(),
            PointsLimit: [3, 4, 5][this.RedioGroup['fengding'].getSelectIndex()],
            DianGangHua: [1, 0][this.RedioGroup['dianganghua'].getSelectIndex()],
            Forming: [10, 13, 7][this.RedioGroup['paizhang'].getSelectIndex()],
            SwappingType: this.RedioGroup['huansanzhang'].getSelectIndex(),
            PointOfWinning: [2, 1, 0][this.RedioGroup['zimojia'].getSelectIndex()],
            CallForwardingEnabled: this.getCheckboxSelectedByName('btnCheck_CallForwardingEnabled'),
            DuiDuiHuPoints: this.getCheckboxSelectedByName('btnCheck_duiduihu'),
            MenQingEnabled: this.getCheckboxSelectedByName('btnCheck_MenQingEnabled'),
            ZhongZhangEnabled: this.getCheckboxSelectedByName('btnCheck_ZhongZhangEnabled'),
            WinningFanEnabled: this.getCheckboxSelectedByName('btnCheck_WinningFanEnabled'),
            WinningLastEnabled: this.getCheckboxSelectedByName('btnCheck_WinningLastEnabled'),
            YaoJiuJiangDuiEnabled: this.getCheckboxSelectedByName('btnCheck_YaoJiuJiangDuiEnabled'),
            KaxingwuEnabled: this.getCheckboxSelectedByName('btnCheck_KaXingWu'),
        };
        
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const item = this._btnItems[_i];
            if (item.name == 'btnCheck_DesignatingUnwantedEnabled') {
                Rule.DesignatingUnwantedEnabled = item.visible ? item.isSelected() : false;
            }else if (item.name == 'btnCheck_Pinghudianpao') {
                Rule.PingHuCanWinningByOther = item.visible ? item.isSelected() : false;
            }else if (item.name == 'btnCheck_badaotang') {
                Rule.BaDaoTang = item.visible ? item.isSelected() : false;
            }
        }
        this.getExtraSelectedPara(Rule);
        return Rule;
    }
});