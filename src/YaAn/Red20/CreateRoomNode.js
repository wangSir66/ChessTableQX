var CreateRoomNode_red20 = CreateRoomNodeYaAn.extend({
    //创建ui 以及变量保存
    initAll: function (IsFriendCard) {
        let bg_node = ccs.load("bg_red20.json").node;
        this.addChild(bg_node);
        bg_node.setScale(0.9, 0.9)
        bg_node.setPosition(-200, 10);
        this.bg_node = bg_node.getChildByName("bg_shuyang");
        this._view = this.bg_node.getChildByName("view");
        //初始化固定数据
        this.rangeScore = [1, 20];
        this.trustTimes = [0, 30, 60, 90];
    },
    /**初始化结束 */
    initEnd: function () {
        this._super();
        cc.log('红20 规则界面初始化成功')
    },
    /**按钮事件回调 */
    callSelectBack: function (indx, item, list) {
        this._super(indx, item, list);
        const isNum = parseInt(indx);
        if (isNum >= 0 && item) {
            indx = Number(indx);
            let p = item.getParent();
            if (p.name == 'renshu') this.initChiRule(indx);
            else if (p.name == 'suanfan') this.initFanRule(indx);
        } else if (indx != null && indx != undefined) {
            if (indx.name == 'btnCheck4Pairs') this.initLongSiDui();
        } else if (!indx && item) {
            if (item.name == 'btnCheck4Pairs') this.initLongSiDui();
        }
    },
    /**龙四对相关 */
    initLongSiDui: function () {
        const checked = this.getCheckboxSelectedByName('btnCheck4Pairs'),
            l4 = this.getBtnByName('btnCheckD4Pairs'),
            sl4 = this.getBtnByName('btnCheckDD4Pairs');
        cc.log('-------------------checked---------------------', checked)
        l4.setEnabled(checked);
        sl4.setEnabled(checked);
        var text = sl4.getChildByName("text");
        this.selectedCB(text, checked && sl4.isSelected());
        text = l4.getChildByName("text");
        this.selectedCB(text, checked && l4.isSelected());
    },
    /**算番规则 */
    initFanRule: function (indx) {
        const group = this.RedioGroup['fengding'];
        if (group) {
            for (let _i = 0; _i < group._nodeList.length; _i++) {
                const item = group._nodeList[_i];
                item.setEnabled(indx != 0);
                let text = item.getChildByName("text");
                this.selectedCB(text, item.isSelected() && indx != 0);
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
        group._nodeList.map(n => {
            let text = n.getChildByName("text");
            this.selectedCB(text, n.isSelected());
        })
    },
    /**还原规则 */
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        const key_nameR = {
            'suanfan': ['EnableTTF', true, [true, false]],
            'fengding': ['MaxFan', 4, [4, 5, 6]],
            'wangpai': ['MaxKingCount', 3, [3, 6, 9, 12, 15, 18]],
            'chipai': ['EnableChi', true, [true, false]],
            'baotinghongdian': ['EnableRed20Ting', true, [true, false]],
            'liuju': ['IsCheckTing', true, [true, false]],
            'pinghu': ['IsCheckFan', false, [false, true]],
            '7dianjiawang': ['Allow7AsKing', true, [true, false]],
            '7dianwangdian': ['IsPoint7AsKing', true, [true, false]],
            'zidongzhunbei': ['AutoReady', false, [false, true]]
        },
            key_nameC = {
                'btnCheck4Pairs': ['Enable4Pairs', false],
                'btnCheck50': ['Red50', false],
                'btnCheckD4Pairs': ['EnableDragon4Pairs', false],
                'btnCheckDD4Pairs': ['EnableDoubleDragon4Pairs', false],
                'btnCheckGangHua': ['EnableGSH', false],
                'btnCheckJGG': ['EnableJinGouDiao', false],
                'btnCheckZiMo': ['EnableZiMo', false],
                'btnCheckjin20': ['EnableGolden20', false],
            };
        this.InitCurrentSelect(key_nameR, key_nameC);
    },
    /**规则还原最后按钮状态*/
    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.initLongSiDui();
        let sIndx = this.RedioGroup['renshu'].getSelectIndex();
        if (sIndx > -1) {
            this.initChiRule(sIndx);
        }
        sIndx = this.RedioGroup['suanfan'].getSelectIndex();
        if (sIndx > -1) {
            this.initFanRule(sIndx);
        }
    },
    /**获取已选规则信息 */
    getSelectedPara: function () {
        const gameType = this._data.gameType,
            pPriceCfg = MjClient.data.gamePrice[gameType];
        cc.log('服务器配置----', gameType, JSON.stringify(pPriceCfg));
        const maxP = Number(Object.keys(pPriceCfg)[this.getRedioSelectByName('renshu')]),
            score = this._view.getChildByName('difen').getChildByName('BaseScore').getString(),
            x4d = this.getCheckboxSelectedByName('btnCheck4Pairs');
        const Rule = {
            gameType: gameType,
            maxPlayer: maxP,
            trustTime: 0, //托管时间
            gps: this._nodeGPS.isSelected(),//GPS
            payWay: [0, 2, 1][this.getRedioSelectByName('zhifufangshi')],//付费方式

            MaxPlayerCount: maxP,
            MaxGameCount: Number(Object.keys(pPriceCfg[maxP])[this.getRedioSelectByName('jushu')]),
            EnableTTF: [true, false][this.getRedioSelectByName('suanfan')],//是否开启梯梯番模式否则为跟斗番
            MaxKingCount: [3, 6, 9, 12, 15, 18][this.getRedioSelectByName('wangpai')],//最大大王数量
            EnableChi: [true, false][this.getRedioSelectByName('chipai')], //是否开启吃牌（这里的吃牌是指吃上家的牌）
            EnableZiMo: this.getCheckboxSelectedByName('btnCheckZiMo'),//true: 自摸加番
            Enable4Pairs: x4d, //是否开启小四对（汉源叫对子胡）
            EnableDragon4Pairs: this.getCheckboxSelectedByName('btnCheckD4Pairs') && x4d, //是否开启龙四队
            EnableDoubleDragon4Pairs: this.getCheckboxSelectedByName('btnCheckDD4Pairs') && x4d, //是否开启双龙四队
            EnableJinGouDiao: this.getCheckboxSelectedByName('btnCheckJGG'),//是否开启金钩钓
            EnableGolden20: this.getCheckboxSelectedByName('btnCheckjin20'),//是否开启金20
            Golden20Fan: 1,//金20番薯 默认1 
            IsCheckTing: [true, false][this.getRedioSelectByName('liuju')],//是否查叫
            IsCheckFan: [false, true][this.getRedioSelectByName('pinghu')],//是否1番起胡(true：1番起胡 false：平胡可胡)
            Allow7AsKing: [true, false][this.getRedioSelectByName('7dianjiawang')],//是否允许7当王
            AllowBaoTing: true,//是否允许报听 默认true
            IsPoint7AsKing: [true, false][this.getRedioSelectByName('7dianwangdian')],//是否允许7当王算点
            EnableRed20Ting: [true, false][this.getRedioSelectByName('baotinghongdian')],//是否必需满足红点>=20听牌(false：补一张够20可听牌)
            EnableRed20Hu: true,//是否必须满足红点>=20才能胡牌 默认true
            Red50: this.getCheckboxSelectedByName('btnCheck50'),  //红50
            Black50: this.getCheckboxSelectedByName('btnCheck50'),//黑50
            EnableGSH: this.getCheckboxSelectedByName('btnCheckGangHua'),//是否开启杠上花
            BaseScore: Number(score),
            AllowSameIP: true,
            SubRuleName: '雅安'
        };
        Rule.AutoReady = this.RedioGroup['zidongzhunbei'].getSelectIndex() == 1;//自动准备
        Rule.MaxFan = Rule.EnableTTF ? 0 : [4, 5, 6][this.getRedioSelectByName('fengding')]//最大番数 
        this.getExtraSelectedPara(Rule);
        return Rule;
    }
});