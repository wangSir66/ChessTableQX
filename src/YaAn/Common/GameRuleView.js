var GameRuleView = cc.Layer.extend({
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
    TunGuanTime: [0, 30, 60, 90],
    ctor: function (url) {
        this._super();
        this.initAll(url);
        this.initAllBtns();
        this.reductionRule();
        this.initEnd();
    },
    initEnd: function () {
        cc.log('-------GameRuleView----初始化结束---')
     },
    //创建ui 以及变量保存
    initAll: function (url) {
        let node = ccs.load("gamerulebg.json").node;
        let bg_node = ccs.load(url + ".json").node;
        node.getChildByName('back').getChildByName('content').addChild(bg_node);
        bg_node.setPosition(20,-85)
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
        if (!MjClient || !MjClient.data || !MjClient.data.sData || !MjClient.data.sData.tData || !MjClient.data.sData.tData.areaSelectMode) return;
        const gameType = MjClient.gameType,
            pPriceCfg = MjClient.data.gamePrice[gameType],
            rule = MjClient.data.sData.tData.areaSelectMode,
            pIndx = Object.keys(pPriceCfg).indexOf(rule.maxPlayer + "");
        this.RedioGroup['jushu'].selectItem(Object.keys(pPriceCfg[rule.maxPlayer]).indexOf(rule.round + ""));
        this.RedioGroup['zhifufangshi'].selectItem(rule.payWay);
        this.RedioGroup['renshu'].selectItem(pIndx);
        this._view.getChildByName('difen').getChildByName('BaseScore').setString(rule.difen + '');
        //因为服务器 +1
        this.RedioGroup['tuoguan'].selectItem(this.TunGuanTime.indexOf(rule.trustTime <= 0 ? 0 : rule.trustTime - 1));
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

    getCheckboxSelectedByName: function (str) {
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const btn = this._btnItems[_i];
            if (cc.sys.isObjectValid(btn) && btn.name == str) return btn.isSelected();
        }
        return false;
    },
    selectedCB: function (text) {
        text.setTextColor('#602E1A');
    },
});