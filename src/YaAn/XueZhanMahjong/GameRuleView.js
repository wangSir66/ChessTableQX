var GameRule_YAXueZhan = GameRuleView.extend({
    ctor: function () {
        this._super('bg_xuezhan');
    },
    reductionRule: function () {
        this._super();
        const rule = MjClient.data.sData.tData.areaSelectMode;
        this.initFangShu();
        this.RedioGroup['fengding'].selectItem([3, 4, 5].indexOf(rule.PointsLimit));
        this.RedioGroup['dianganghua'].selectItem([1, 0].indexOf(rule.DianGangHua));
        this.RedioGroup['paizhang'].selectItem([10, 13, 7].indexOf(rule.Forming));
        this.RedioGroup['huansanzhang'].selectItem(rule.SwappingType);
        this.RedioGroup['zimojia'].selectItem([2, 1, 0].indexOf(rule.PointOfWinning));
        this.getBtnByName('btnCheck_CallForwardingEnabled').setSelected(rule.CallForwardingEnabled);
        this.getBtnByName('btnCheck_duiduihu').setSelected(rule.DuiDuiHuPoints == 2);
        this.getBtnByName('btnCheck_MenQingEnabled').setSelected(rule.MenQingEnabled);
        this.getBtnByName('btnCheck_ZhongZhangEnabled').setSelected(rule.ZhongZhangEnabled);
        this.getBtnByName('btnCheck_WinningFanEnabled').setSelected(rule.WinningFanEnabled);
        this.getBtnByName('btnCheck_WinningLastEnabled').setSelected(rule.WinningLastEnabled);
        this.getBtnByName('btnCheck_YaoJiuJiangDuiEnabled').setSelected(rule.YaoJiuJiangDuiEnabled);
        this.getBtnByName('btnCheck_KaXingWu').setSelected(rule.KaxingwuEnabled);
        this.getBtnByName('btnCheck_DesignatingUnwantedEnabled').setSelected(rule.DesignatingUnwantedEnabled);
        this.getBtnByName('btnCheck_Pinghudianpao').setSelected(rule.PingHuCanWinningByOther);
        this.getBtnByName('btnCheck_badaotang').setSelected(rule.DgwMultipleEnabled);
    },
    
    getFangShu: function () {
        let maxP = 0;
        switch (MjClient.gameType) {
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
    },
});