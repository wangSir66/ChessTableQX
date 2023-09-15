var GameRule_YARed20 = GameRuleView.extend({
    ctor: function () {
        this._super('A_bg_red20');
    },
    reductionRule: function () {
        this._super();
        if (!MjClient || !MjClient.data || !MjClient.data.sData || !MjClient.data.sData.tData || !MjClient.data.sData.tData.Rule) return;
        const gameType = MjClient.gameType,
            pPriceCfg = MjClient.data.gamePrice[gameType],
            rule = MjClient.data.sData.tData.Rule,
            pIndx = Object.keys(pPriceCfg).indexOf(rule.MaxPlayerCount + "");
        const ttf = rule.EnableTTF ? 0 : 1;
        this.RedioGroup['suanfan'].selectItem(ttf);
        this.initFanRule(ttf);
        if (ttf != 0) this.RedioGroup['fengding'].selectItem([4, 5, 6].indexOf(rule.MaxFan));
        this.RedioGroup['wangpai'].selectItem([3, 6, 9, 12, 15, 18].indexOf(rule.MaxKingCount));
        if (pIndx == 0) this.initChiRule(pIndx);
        else this.RedioGroup['chipai'].selectItem(rule.EnableChi ? 0 : 1);
        this.RedioGroup['baotinghongdian'].selectItem(rule.EnableRed20Ting ? 0 : 1);
        this.RedioGroup['liuju'].selectItem(rule.IsCheckTing ? 0 : 1);
        this.getBtnByName('btnCheck4Pairs').setSelected(rule.Enable4Pairs);
        if (!rule.Enable4Pairs) this.initLongSiDui();
        else {
            this.getBtnByName('btnCheckD4Pairs').setSelected(rule.EnableDragon4Pairs);
            this.getBtnByName('btnCheckDD4Pairs').setSelected(rule.EnableDoubleDragon4Pairs);
        }
        this.getBtnByName('btnCheck50').setSelected(rule.Red50);
        this.getBtnByName('btnCheckGangHua').setSelected(rule.EnableGSH);
        this.getBtnByName('btnCheckJGG').setSelected(rule.EnableJinGouDiao);
        this.getBtnByName('btnCheckZiMo').setSelected(rule.EnableZiMo);
        this.getBtnByName('btnCheckjin20').setSelected(rule.EnableGolden20);
        this.RedioGroup['pinghu'].selectItem(rule.IsCheckFan ? 1 : 0);
        this.RedioGroup['7dianjiawang'].selectItem(rule.Allow7AsKing ? 0 : 1);
        this.RedioGroup['7dianwangdian'].selectItem(rule.IsPoint7AsKing ? 0 : 1);
        this.RedioGroup['zidongzhunbei'].selectItem(rule.AutoReady ? 1 : 0);
    },
     /**龙四对相关 */
     initLongSiDui: function () {
        const checked = this.getCheckboxSelectedByName('btnCheck4Pairs'),
            l4 = this.getBtnByName('btnCheckD4Pairs'),
            sl4 = this.getBtnByName('btnCheckDD4Pairs');
        l4.setEnabled(checked);
        sl4.setEnabled(checked);
        var text = sl4.getChildByName("text");
        text = l4.getChildByName("text");
    },
    /**算番规则 */
    initFanRule: function (indx) {
        const group = this.RedioGroup['fengding'];
        if (group) {
            for (let _i = 0; _i < group._nodeList.length; _i++) {
                const item = group._nodeList[_i];
                item.setEnabled(indx != 0);
            }
        }
    },
    /**吃牌规则显示 */
    initChiRule: function (indx) {
        const group = this.RedioGroup['chipai'];
        if (group) {
            group.getSelectIndex() == 0 && indx == 0 && group.selectItem(1);
            group._nodeList[0].setEnabled(indx != 0);
        }
    },
});