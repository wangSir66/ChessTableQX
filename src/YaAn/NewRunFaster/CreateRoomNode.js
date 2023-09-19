var CreateRoomNode_NewRunFaster = CreateRoomNodeYaAn.extend({
    initAll: function () {
        const bg_node = ccs.load("A_bg_NewRunFaster.json").node;
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
        const is16 = this._data.gameType == MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER,
            _3A = this.getBtnByName('btnCheck3A'),
            _3K = this.getBtnByName('btnCheck3K');
        _3A.setVisible(is16);
        _3K.setVisible(!is16);
        //新跑得快 只有 2 3 人选项
        this.RedioGroup['renshu']._nodeList[2].setVisible(false);
    },
    callSelectBack: function (indx, item, list) {
        this._super(indx, item, list);
        const isNum = parseInt(indx);
        if (isNum >= 0 && item) {
            indx = Number(indx);
            let p = item.getParent();
            if (p.name == 'renshu') this.InitXianShou();
        } else if (indx != null && indx != undefined) {
            if (indx.name == 'btnCheckdzd') this.initBoom();
            else if (indx.name == 'btnCheckZDKC') this.initBoomNot();
        } else if (!indx && item) {
            if (item.name == 'btnCheckdzd') this.initBoom();
            else if (indx.name == 'btnCheckZDKC') this.initBoomNot();
        }
    },
    setExtraPlayNodeCurrentSelect: function (isClub) {
        this._super(isClub);
        //初始化按钮状态
        this.InitXianShou();
        this.initBoom();
    },
    initBoomNot: function () {
        const isTrue = this.getCheckboxSelectedByName('btnCheckZDKC'),
            _4D2 = this.getBtnByName('btnCheck4d2'),
            _4D3 = this.getBtnByName('btnCheck4d3');
        _4D2.setEnabled(!isTrue);
        _4D3.setEnabled(!isTrue);
    },
    initBoom: function () {
        const isTrue = this.getCheckboxSelectedByName('btnCheckdzd'),
            _3A = this.getBtnByName('btnCheck3A'),
            _3K = this.getBtnByName('btnCheck3K'),
            _ZDKC = this.getBtnByName('btnCheckZDKC'),
            _4D2 = this.getBtnByName('btnCheck4d2'),
            _4D3 = this.getBtnByName('btnCheck4d3');
        _3A.setEnabled(isTrue);
        _3K.setEnabled(isTrue);
        _ZDKC.setEnabled(isTrue);
        _4D2.setEnabled(isTrue && !_ZDKC.isSelected());
        _4D3.setEnabled(isTrue && !_ZDKC.isSelected());
        const xf = this.RedioGroup['zhadanfen']._nodeList, zn = this.RedioGroup['zhaniao'];
        if (zn.getSelectIndex() == 2 && !isTrue) zn.selectItem(1);
        zn._nodeList[2].setEnabled(isTrue);
        xf.map(n => {
            n.setEnabled(isTrue);
            // let text = n.getChildByName("text");
            // this.selectedCB(text, n.isSelected() && isTrue);
        })
    },
    //先手
    InitXianShou: function () {
        const pn = this.getSelectPlayNum(), pzn = this.RedioGroup['xianshou'], fc = this.getBtnByName('btnCheckfc');
        let oldIndx = pzn.getSelectIndex();
        if (pn === 2 && oldIndx < 3) {
            oldIndx = 3;
        } else if (pn === 3 && oldIndx > 2) {
            oldIndx = 0;
        }
        pzn._nodeList.map((n, _indx) => {
            n.setEnabled(!(_indx < 3 ? pn == 2 : pn == 3));
        });
        //反春
        fc.setEnabled(pn != 3);
        pzn.selectItem(oldIndx);
    },
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        const key_nameR = {
            'xianshou': ['mustPutHongTaoSan', 0, [0, 1, 2, 3, 4]],
            'qiepai': ['isPlayerShuffle', 0, [0, 1]],
            'zhadanfen': ['BombScore', 5, [5, 10]],
            'zhaniao': ['hongTao10Niao', 0, [0, 1, 2]],
        },
            key_nameC = {
                'btnCheckbxg': ['mustPut', true],
                'btnCheckxspz': ['showCardNumber', false],
                'btnCheckct': ['Spring', false],
                'btnCheckfc': ['ContrarySpring', false],
                'btnCheckksgp': ['FasterPass', false],
                'btnCheckszfjsd': ['IsAirCatchOver', false],
                'btnChecks1bs': ['LeftOneLose', false],
                'btnCheckdzd': ['isZhaDanJiaFen', false],
                'btnCheck3A': ['can3aZhaDan', false],
                'btnCheck3K': ['can3kZhaDan', false],
                'btnCheckZDKC': ['zhaDanBuChai', false],
                'btnCheck4d2': ['can4dai2', false],
                'btnCheck4d3': ['can4dai3', false],
                'btnCheckslgp': ['FirstGroundHideCards', false],
            };

        this.InitCurrentSelect(key_nameR, key_nameC);
    },
    getSelectedPara: function () {
        var para = {};
        const is16 = this._data.gameType == MjClient.GAME_TYPE.SI_CHUAN_NEW_RUNFASTER;
        para.gameType = this._data.gameType;
        para.cardNumIndex = is16 ? 16 : 15; /** 牌数 */
        para.isPlayerShuffle = this.RedioGroup['qiepai'].getSelectIndex();//切牌
        para.mustPut = this.getCheckboxSelectedByName('btnCheckbxg');//管牌 
        para.Spring = this.getCheckboxSelectedByName('btnCheckct');//可春天
        para.ContrarySpring = this.getCheckboxSelectedByName('btnCheckfc');//可反春
        para.FasterPass = this.getCheckboxSelectedByName('btnCheckksgp');//快速过牌
        const fldw = this.getCheckboxSelectedByName('btnCheckszfjsd');
        para.Is3OutOver = true;//三张 少带出完
        para.Is3CatchOver = fldw;//三张 少带接完
        para.IsAirOutOver = true;//飞机 少带出完 
        para.IsAirCatchOver = fldw;//飞机 少带接完 
        para.LeftOneLose = this.getCheckboxSelectedByName('btnChecks1bs');//剩余一张不输
        para.hongTao10Niao = this.RedioGroup['zhaniao'].getSelectIndex();//扎鸟
        para.isZhaDanJiaFen = this.getCheckboxSelectedByName('btnCheckdzd');//带炸弹
        para.can3aZhaDan = para.isZhaDanJiaFen && is16 ? this.getCheckboxSelectedByName('btnCheck3A') : false;//AAAKKK最大
        para.can3kZhaDan = is16 || !para.isZhaDanJiaFen ? false : this.getCheckboxSelectedByName('btnCheck3K');//AAAKKK最大
        para.zhaDanBuChai = para.isZhaDanJiaFen ? this.getCheckboxSelectedByName('btnCheckZDKC') : false;//炸弹可拆
        para.can4dai2 = para.isZhaDanJiaFen && !para.zhaDanBuChai ? this.getCheckboxSelectedByName('btnCheck4d2') : false;     // 4带2
        para.can4dai3 = para.isZhaDanJiaFen && !para.zhaDanBuChai ? this.getCheckboxSelectedByName('btnCheck4d3') : false;     // 4带3

        para.maxPlayer = Number(Object.keys(this.getGamePriceConfig())[this.RedioGroup['renshu'].getSelectIndex()]);//人数
        para.mustPutHongTaoSan = this.RedioGroup['xianshou'].getSelectIndex();//先手
        para.FirstGroundHideCards = this.getCheckboxSelectedByName('btnCheckslgp');//首轮盖牌
        para.BombScore = para.isZhaDanJiaFen ? [5, 10][this.RedioGroup['zhadanfen'].getSelectIndex()] : 0;//炸弹分
        para.AutoReady = this.RedioGroup['zidongzhunbei'].getSelectIndex() == 1;//自动准备
        para.tipCountdown = 20;//提示时间
        //默认
        para.HandCutRule = -1;//para.maxPlayer === 4 ? -1 : this.RedioGroup['paizhang'].getSelectIndex();//牌张
        para.showCardNumber = true; //this.getCheckboxSelectedByName('btnCheckpaishu');//显示牌数
        para.Sisters = true; //this.getCheckboxSelectedByName('btnCheckpaixing');//姊妹对
        para.IsAnonymous = false;//this.getCheckboxSelectedByName('btnCheckniming');//游戏内匿名
        para.can3geZha = false;//3个炸
        para.can3geZha = false;//3个炸

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
});

