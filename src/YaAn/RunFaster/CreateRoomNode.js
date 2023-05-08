var CreateRoomNode_PaoDeKuaiYA = CreateRoomNodeYaAn.extend({
    initAll: function () {
        const bg_node = ccs.load("bg_RunFasterYaAn.json").node;
        this.addChild(bg_node);
        bg_node.setScale(0.9, 0.9)
        bg_node.setPosition(-200, 10);
        this.bg_node = bg_node.getChildByName("bg_shuyang");
        this._view = this.bg_node.getChildByName("view");
        //初始化固定数据
        this.rangeScore = [1, 20];
        this.trustTimes = [0, 30, 60, 90];
    },
    initEnd: function () {
        this._super();
    },
    callSelectBack: function (indx, item, list) {
        this._super(indx, item, list);
        const isNum = parseInt(indx);
        if (isNum >= 0 && item) {
            indx = Number(indx);
            let p = item.getParent();
            if (p.name == 'renshu') this.initPaiZhang();
            else if (p.name == 'zhadan') this.initBoom();
        }
    },
    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.initPaiZhang();
        this.initBoom();
    },
    initBoom: function () {
        const isTrue = this.RedioGroup['zhadan'].getSelectIndex() != 0;
        for (let _i = 0; _i < this._btnItems.length; _i++) {
            const item = this._btnItems[_i];
            if (item.name == 'btnCheck3zhang' || item.name == 'btnCheck4zhang') {
                item.setEnabled(isTrue);
                let text = item.getChildByName("text");
                this.selectedCB(text, item.isSelected() && isTrue);
            }
        }
        const xf = this.RedioGroup['xifen']._nodeList;
        xf.map(n => {
            n.setEnabled(isTrue);
            let text = n.getChildByName("text");
            this.selectedCB(text, n.isSelected() && isTrue);
        })
    },
    initPaiZhang: function () {
        const pn = this.getSelectPlayNum(), pzn = this.RedioGroup['paizhang'];
        if (pn === 2) {
            pzn._nodeList[1].getChildByName('text').setString('去掉两方玩家的牌');
        } else if (pn === 3) {
            pzn._nodeList[1].getChildByName('text').setString('去掉一方玩家的牌');
        }
        pzn._nodeList.map(n => {
            n.setEnabled(pn !== 4);
            let text = n.getChildByName("text");
            this.selectedCB(text, n.isSelected() && pn !== 4);
        })
    },
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        const cacheRule = JSON.parse(util.localStorageEncrypt.getStringItem(KEYCURRGAMERULE + this._data.gameType, '{}')),
            key_nameR = {
                'xianshou': ['mustPutHongTaoSan', 0, [0, 1]],
                'paizhang': ['HandCutRule', 0, [0, 1]],
                'zhadan': ['isZhaDanJiaFen', false, [false, true]],
                'mingtangfen': ['XiScore', 20, [20, 10]],
                'xifen': ['BombScore', 20, [20, 10]],
                'zidongzhunbei': ['AutoReady', false, [false, true]]
            },
            key_nameC = {
                'btnCheckpaishu': ['showCardNumber', false],
                'btnCheckpaixing': ['Sisters', false],
                'btnCheckniming': ['IsAnonymous', false],
                'btnCheckgaipai': ['FirstGroundHideCards', false],
                'btnCheckquanhei': ['AllBlack', false],
                'btnCheckquanhong': ['AllRed', false],
                'btnCheckquanda': ['AllBig', false],
                'btnCheckquanxiao': ['AllSmall', false],
                'btnCheckquandan': ['AllSingly', false],
                'btnCheckquanshuang': ['AllDouble', false],
                'btnCheck55AA': ['Four5OrA', false],
                'btnCheck66KK': ['FourOther', false],
                'btnCheck3zhang': ['can3geZha', false],
                'btnCheck4zhang': ['can4geZha', false]
            };
        let len = Object.keys(key_nameR);
        for (let _i = 0; _i < len.length; _i++) {
            let key = len[_i], val = key_nameR[key];
            let _current, selectIndex, currObj;
            if (isClub) {
                if (typeof val[1] === 'number')
                    _current = this.getNumberItem(val[0], val[1]);
                else if (typeof val[1] === 'boolean')
                    _current = this.getBoolItem(val[0], val[1]);
            }
            else
                _current = cacheRule[val[0]] || val[1];
            selectIndex = val[2].indexOf(_current);
            currObj = this.RedioGroup[key];
            currObj.selectItem(selectIndex);
            this.radioBoxSelectCB(selectIndex, currObj._nodeList[selectIndex], currObj._nodeList);
        }
        len = Object.keys(key_nameC);
        for (let _i = 0; _i < len.length; _i++) {
            let key1 = len[_i], val = key_nameC[key1];
            let isTrue;
            if (isClub)
                isTrue = this.getBoolItem(val[0], val[1]);
            else
                isTrue = cacheRule[val[0]] || val[1];
            let btnNode = this._btnItems.find(b => b.name == key1);
            if (btnNode) {
                btnNode.setSelected(isTrue);
                var text = btnNode.getChildByName("text");
                this.selectedCB(text, isTrue);
            }
        }
        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara: function () {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN;
        para.cardNumIndex = 10; /** 牌数 */
        para.isPlayerShuffle = 0;//切牌
        para.mustPut = true;//管牌 
        para.Spring = true;//可春天
        para.ContrarySpring = false;//可反春
        para.FasterPass = true;//快速过牌
        para.Is3OutOver = false;//三张 少带出完
        para.Is3CatchOver = false;//三张 少带接完
        para.IsAirOutOver = false;//飞机 少带出完 
        para.IsAirCatchOver = false;//飞机 少带接完 
        para.LeftOneLose = true;//剩余一张不输
        para.can3aZhaDan = false;//AAAKKK最大
        para.can3kZhaDan = false;//AAAKKK最大
        para.can4dai2 = false;     // 4带2
        para.can4dai3 = false;     // 4带3
        para.hongTao10Niao = 0;//扎鸟
        para.zhaDanBuChai = true;//炸弹可拆

        para.maxPlayer = Number(Object.keys(this.getGamePriceConfig())[this.RedioGroup['renshu'].getSelectIndex()]);//人数
        para.mustPutHongTaoSan = this.RedioGroup['xianshou'].getSelectIndex();//先手
        para.HandCutRule = para.maxPlayer === 4 ? -1 : this.RedioGroup['paizhang'].getSelectIndex();//牌张
        para.showCardNumber = this.getCheckboxSelectedByName('btnCheckpaishu');//显示牌数
        para.Sisters = this.getCheckboxSelectedByName('btnCheckpaixing');//姊妹对
        para.IsAnonymous = this.getCheckboxSelectedByName('btnCheckniming');//游戏内匿名
        para.FirstGroundHideCards = this.getCheckboxSelectedByName('btnCheckgaipai');//首轮盖牌
        para.AllBlack = this.getCheckboxSelectedByName('btnCheckquanhei');//全黑
        para.AllRed = this.getCheckboxSelectedByName('btnCheckquanhong');//全红
        para.AllBig = this.getCheckboxSelectedByName('btnCheckquanda');//全大
        para.AllSmall = this.getCheckboxSelectedByName('btnCheckquanxiao');//全小
        para.AllSingly = this.getCheckboxSelectedByName('btnCheckquandan');//全单
        para.AllDouble = this.getCheckboxSelectedByName('btnCheckquanshuang');//全双
        para.Four5OrA = this.getCheckboxSelectedByName('btnCheck55AA');//5555，AAAA
        para.FourOther = this.getCheckboxSelectedByName('btnCheck66KK');//4个6-4个K
        const mt = para.AllBlack || para.AllRed || para.AllBig || para.AllSmall || para.AllSingly || para.AllDouble || para.Four5OrA || para.FourOther;
        para.isZhaDanJiaFen = this.RedioGroup['zhadan'].getSelectIndex() != 0;//带炸弹
        para.can3geZha = para.isZhaDanJiaFen ? this.getCheckboxSelectedByName('btnCheck3zhang') : false;//3张算炸
        para.can4geZha = para.isZhaDanJiaFen ? this.getCheckboxSelectedByName('btnCheck4zhang') : false;//4张算炸
        para.XiScore = mt ? [20, 10][this.RedioGroup['mingtangfen'].getSelectIndex()] : 0;//名堂分
        para.BombScore = para.isZhaDanJiaFen ? [20, 10][this.RedioGroup['xifen'].getSelectIndex()] : 0;//炸弹分
        para.AutoReady = this.RedioGroup['zidongzhunbei'].getSelectIndex() == 1;//自动准备

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
});

