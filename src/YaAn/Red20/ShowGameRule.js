var ShowGameRule_red20 = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[0.65, 0.75], [0.5, 0.5], [0, 0]],
            close: {
                _click: function () {
                    if (MjClient.showRuleView) {
                        MjClient.showRuleView.removeFromParent(true);
                        MjClient.showRuleView = null;
                    }
                }
            },
        }
    },
    jsBind1: {
        bg_shuyang: {
            _layout: [[0.8, 0.6], [0.25, 0.17], [0, 0]],
            view: {

            },
            btn_create: {
                _visible: false,
            },
            btn_create_diamond: {
                _visible: false,
            },
            btn_ruleretain: {
                _visible: false,
            }
        },
    },
    RedioGroup: null,
    ctor: function () {
        this._super();
        this.initAll();
        this.initAllBtns();
        this.reductionRule();
    },
    //创建ui 以及变量保存
    initAll: function () {
        let node = ccs.load("gamerulebg.json").node;
        let bg_node = ccs.load("bg_red20.json").node;
        node.addChild(bg_node);
        this.bg_node = bg_node.getChildByName("bg_shuyang");
        this._view = this.bg_node.getChildByName("view");
        this.addChild(node);
        BindUiAndLogic(node, this.jsBind);
        BindUiAndLogic(bg_node, this.jsBind1);
    },
    /**所有的按钮*/
    initAllBtns: function () {
        this.RedioGroup = {};
        this._btnItems = [];
        if (!this._view) return;
        for (let _i = 0; _i < this._view.children.length; _i++) {
            const row = this._view.children[_i];
            let btns = [];
            for (let _j = 0; _j < row.children.length; _j++) {
                const col = row.children[_j];
                if (col.name.indexOf('btnRadio') > -1 || col.name.indexOf('btnCheck') > -1) {
                    if (col.name.indexOf('btnRadio') > -1) {
                        btns.push(col);
                        if (col.name == 'btnRadio0' || col.name == 'btnRadio1' || col.name == 'btnRadio2') {
                            col.getChildByName('text_0').visible = false;
                        }
                    }
                    // col.getChildByName('text').setColor(col.isSelected() ? BTNCOLOR1 : BTNCOLOR3);
                    col.setTouchEnabled(false);
                    this._btnItems.push(col);
                }
            }
            if (btns.length > 0) {
                const _radio = createRadioBoxForCheckBoxs(btns, this.callSelectBack.bind(this), 0);
                this.RedioGroup[row.name] = _radio;
            }
        }
    },
    reductionRule: function () {
        if (!MjClient || !MjClient.data || !MjClient.data.sData || !MjClient.data.sData.tData || !MjClient.data.sData.tData.Rule) return;
        const gameType = MjClient.gameType,
            pPriceCfg = MjClient.data.gamePrice[gameType],
            rule = MjClient.data.sData.tData.Rule,
            pIndx = Object.keys(pPriceCfg).indexOf(rule.MaxPlayerCount + "");
        this.RedioGroup['jushu'].selectItem(Object.keys(pPriceCfg[rule.MaxPlayerCount]).indexOf(rule.MaxGameCount + ""));
        this.RedioGroup['zhifufangshi'].selectItem([0, 2, 1].indexOf(rule.payWay));
        cc.log('-----',rule.payWay)
        this.RedioGroup['renshu'].selectItem(pIndx);
        this._view.getChildByName('difen').getChildByName('BaseScore').setString(rule.BaseScore + '');
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
    },
    callSelectBack: function (indx, item, list) {
    },
    
    getBtnByName: function (str) {
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const btn = this._btnItems[_i];
            if (cc.sys.isObjectValid(btn) && btn.name == str) return btn;
        }
        return null;
    },

    /**龙四对相关 */
    initLongSiDui: function () {
        const checked = this.getCheckboxSelectedByName('btnCheck4Pairs'),
            l4 = this.getBtnByName('btnCheckD4Pairs'),
            sl4 = this.getBtnByName('btnCheckDD4Pairs');
        cc.log('-------------------checked---------------------', checked)
        l4.setEnabled(checked);
        sl4.setEnabled(checked);
    },

    getCheckboxSelectedByName: function (str) {
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const btn = this._btnItems[_i];
            if (cc.sys.isObjectValid(btn) && btn.name == str) return btn.isSelected();
        }
        return false;
    },

    /**算番规则 */
    initFanRule: function (indx) {
        const group = this.RedioGroup['fengding'];
        if (group) {
            for (let _i = 0; _i < group._nodeList.length; _i++) {
                const item = group._nodeList[_i];
                item.setEnabled(indx != 0)
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