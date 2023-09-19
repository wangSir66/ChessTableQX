var GameRule_NewRunFaster = GameRuleView.extend({
    ctor: function () {
        this._super('A_bg_RunFasterYaAn');
    },
    reductionRule: function () {
        this._super();
        const rule = MjClient.data.sData.tData.areaSelectMode;
        this.RedioGroup['xianshou'].selectItem(rule.mustPutHongTaoSan);
        let red = this.RedioGroup['paizhang'];
        if (rule.HandCutRule == -1) red._nodeList.map(n => { n.setEnabled(true) })
        else red.selectItem(rule.HandCutRule);
        this.getBtnByName('btnCheckpaixing').setSelected(rule.Sisters);
        this.getBtnByName('btnCheckniming').setSelected(rule.IsAnonymous);
        this.getBtnByName('btnCheckquanhei').setSelected(rule.AllBlack);
        this.getBtnByName('btnCheckquanhong').setSelected(rule.AllRed);
        this.getBtnByName('btnCheckquanda').setSelected(rule.AllBig);
        this.getBtnByName('btnCheckquanxiao').setSelected(rule.AllSmall);
        this.getBtnByName('btnCheckquandan').setSelected(rule.AllSingly);
        this.getBtnByName('btnCheckquanshuang').setSelected(rule.AllDouble);
        this.getBtnByName('btnCheck55AA').setSelected(rule.Four5OrA);
        this.getBtnByName('btnCheck66KK').setSelected(rule.FourOther);

        this.RedioGroup['zhadan'].selectItem(rule.isZhaDanJiaFen ? 1 : 0);
        if (!rule.isZhaDanJiaFen) {
            this.getBtnByName('btnCheck3zhang').setEnabled(true);
            this.getBtnByName('btnCheck4zhang').setEnabled(true);
        } else {
            this.getBtnByName('btnCheck3zhang').setSelected(rule.can3geZha);
            this.getBtnByName('btnCheck4zhang').setSelected(rule.can4geZha);
        }
        this.RedioGroup['zidongzhunbei'].selectItem(rule.AutoReady ? 1 : 0);
        this.RedioGroup['mingtangfen'].selectItem({ 20: 0, 10: 1, 0: 1 }[rule.XiScore]);
        
        red = this.RedioGroup['xifen'];
        if (rule.BombScore == 0) red._nodeList.map(n => { n.setEnabled(true) })
        else red.selectItem([20, 10].indexOf(rule.BombScore));
    },
    initEnd: function () {
        this._super();
     },
});