//跑得快算法类
(function () {
    function GameLogic_RunFaster() {
        this.handCount = 10;
        this.laiziCard = -1;


        // this.cardCfg.fk[1]==方块1 
        // this.cardCfg.ht[13]==黑桃K
        // this.cardCfg.jokerRed==大王
        this.cardCfg = {};
        this.cardCfg.fk = {};
        this.cardCfg.mh = {};
        this.cardCfg.hx = {};
        this.cardCfg.ht = {};
        this.cardCfg.jokerRed = 53;
        this.cardCfg.jokerBlack = 54;
        for (var i = 1; i <= 52; i++) {
            // 0:方块  1:梅花  2:梅花  3:黑桃
            var cardType = this.calFlower(i);
            // 牌值 1 - 13
            var cardValue = Math.ceil(i / 4);
            if (0 == cardType) this.cardCfg.fk[cardValue] = i;
            if (1 == cardType) this.cardCfg.mh[cardValue] = i;
            if (2 == cardType) this.cardCfg.hx[cardValue] = i;
            if (3 == cardType) this.cardCfg.ht[cardValue] = i;
        }
        this.cardCfg.firstOutCard = this.cardCfg.ht[3];
        //先手规则
        this.GameBankerRule = {
            /** 每局黑桃3先出 */
            EveryRoundPlaySpade3: 0,
            /** 首局黑桃3先出 */
            FirstRoundPlaySpade3: 1,
            /** 首局黑桃3先出且必带 */
            FirstRoundMustPlaySpade3: 2,
            /** 首局随机先出 */
            FirstRoundRandomBanker: 3,
            /** 轮流坐庄 */
            TurnBanker: 4,
        }
    }

    GameLogic_RunFaster.prototype.initAreaSelectMode = function (areaSelectMode) {
        PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = areaSelectMode.Sisters ? 4 : 6;
        this.handCount = areaSelectMode['cardNumIndex'] || 10;
        PDK_CARD_VALUE = {};
        PDK_CARD_VALUE[this.CARDTPYE.sizha] = 2;
        PDK_CARD_VALUE[this.CARDTPYE.sanzha] = 1;
        pdk_allZhaDan = [];
        if (areaSelectMode.isZhaDanJiaFen) {
            areaSelectMode.can3geZha && pdk_allZhaDan.push(this.CARDTPYE.sanzha);
            areaSelectMode.can4geZha && pdk_allZhaDan.push(this.CARDTPYE.sizha);
        }
    }

    if (typeof (cc) == 'undefined') {
        var cc = function () { }
        cc.log = function () {
            var str = '';
            for (var i = 0; i < arguments.length; i++) {
                str = str + arguments[i] + ' ';
            }
        }
    }

    var PDK_MINPOINT = 3;
    var PDK_KPOINT = 13;
    var PDK_APOINT = 14;
    var PDK_2POINT = 16;// 2，和A必须分开
    var PDK_MAXPOINT = PDK_2POINT;
    // 牌型排序优先级 和 id
    var PDK_CARDTPYE = {
        szdaipai: 111,
        sztonghua: 110,
        sanzha: 17,
        sizhang: 16,
        sangeK: 15,
        sidaisan: 14,
        sandaier: 13,
        sizha: 12,
        feiji: 11,
        sanshun: 10,
        sidaier: 9,
        sangeA: 8,
        sange3: 7,
        sandaiyi: 6,
        liandui: 5,
        shunzi: 4,
        sanzhang: 3, // 只能最后一次出牌有效 
        duizi: 2,
        danpai: 1,
    };

    GameLogic_RunFaster.prototype.CARDTPYE = PDK_CARDTPYE;
    var PDK_CARDCOUNT = {};
    PDK_CARDCOUNT[PDK_CARDTPYE.feiji] = 6;
    PDK_CARDCOUNT[PDK_CARDTPYE.sanshun] = 6;
    PDK_CARDCOUNT[PDK_CARDTPYE.sidaier] = 6;
    PDK_CARDCOUNT[PDK_CARDTPYE.sidaisan] = 5;
    PDK_CARDCOUNT[PDK_CARDTPYE.sangeA] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.sanzha] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.sangeK] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.sizhang] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.sizha] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.sandaier] = 5;
    PDK_CARDCOUNT[PDK_CARDTPYE.sandaiyi] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.shunzi] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.sztonghua] = 5;
    PDK_CARDCOUNT[PDK_CARDTPYE.szdaipai] = 8;
    PDK_CARDCOUNT[PDK_CARDTPYE.sanzhang] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.duizi] = 2;
    PDK_CARDCOUNT[PDK_CARDTPYE.danpai] = 1;


    var PDK_CARD_VALUE = {};
    PDK_CARD_VALUE[PDK_CARDTPYE.sangeA] = 4;
    PDK_CARD_VALUE[PDK_CARDTPYE.sangeK] = 5;
    PDK_CARD_VALUE[PDK_CARDTPYE.sztonghua] = 3;
    PDK_CARD_VALUE[PDK_CARDTPYE.sizha] = 2;
    PDK_CARD_VALUE[PDK_CARDTPYE.sange3] = 1;


    // 包函关系的牌型
    var pdk_cardTypeSub = function () {
        var ret = {};
        ret[PDK_CARDTPYE.sizha] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sizhang] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sanzhang] = [PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sanzha] = [PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.liandui] = [PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sandaier] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sandaiyi] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.feiji] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.liandui, PDK_CARDTPYE.duizi];
        return ret;
    }();

    // 出牌提示顺序
    var pdk_putOrder = [];
    var pdk_daiPaiOrder = [];
    var pdk_allZhaDan = [
        PDK_CARDTPYE.sange3,
        PDK_CARDTPYE.sizha,
        PDK_CARDTPYE.sangeA,
        PDK_CARDTPYE.sangeK,
        PDK_CARDTPYE.sztonghua,
    ];

    // 出牌提示时不拆的所有牌型
    var pdk_allBuChaiType = [
        PDK_CARDTPYE.duizi,
        PDK_CARDTPYE.sanzhang,
        PDK_CARDTPYE.sizhang,
        PDK_CARDTPYE.sanzha,
        PDK_CARDTPYE.shunzi,
        PDK_CARDTPYE.liandui,
        PDK_CARDTPYE.sizha,
    ]

    GameLogic_RunFaster.prototype.allTipsNoOrder = [
        [PDK_CARDTPYE.danpai, []],
        [PDK_CARDTPYE.duizi, []],
        [PDK_CARDTPYE.sandaier, []],
        [PDK_CARDTPYE.sandaiyi, []],
        [PDK_CARDTPYE.liandui, []],
        [PDK_CARDTPYE.shunzi, []],
        [PDK_CARDTPYE.feiji, []],
        [pdk_allZhaDan, []],
    ];

    /*红桃/黑桃3先手提示
    主动提起一张先手的三，可点提示
    对3  不拆炸弹
    提起所有3 实现成 三带二 三带一 不拆炸弹
    带3的连对 不拆炸弹
    带3顺子最长的顺子 不拆炸弹
    */
    pdk_putOrder[99] = [
        [PDK_CARDTPYE.danpai, []],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan]],
        [PDK_CARDTPYE.sandaier, [pdk_allZhaDan]],
        [PDK_CARDTPYE.sandaiyi, [pdk_allZhaDan]],
        [PDK_CARDTPYE.liandui, [pdk_allZhaDan]],
        [PDK_CARDTPYE.shunzi, [pdk_allZhaDan]],
    ];

    /* 先手提示：
    单牌(不能组成任何牌型,独立的单牌),如果只有一个单牌2，则放到后面提示。
    对子（不拆其他牌型的对子）
    顺子 不能组成其他牌型最大数量的顺子
    三带二（不拆其他牌型） 
    三带一（不拆其他牌型）
    连对（不拆其他牌型）
    挨个提示单牌，可拆炸弹
    炸弹
    */
    pdk_putOrder[0] = [
        [PDK_CARDTPYE.danpai, pdk_allBuChaiType, { buchuOnly2: true }],
        [PDK_CARDTPYE.duizi, pdk_allBuChaiType],
        [PDK_CARDTPYE.shunzi, pdk_allBuChaiType],
        [PDK_CARDTPYE.sandaier, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.sandaiyi, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.liandui, [pdk_allBuChaiType]],

        [PDK_CARDTPYE.shunzi, []],
        [PDK_CARDTPYE.sandaier, []],
        [PDK_CARDTPYE.sandaiyi, []],
        [PDK_CARDTPYE.liandui, []],
        [PDK_CARDTPYE.duizi, []],

        [PDK_CARDTPYE.danpai, []],
        [pdk_allZhaDan, []],
    ];

    /* 接单牌提示顺序
    1.  出独立的单牌，不拆其他牌型
    2.  出非组成顺子必要条件的单牌，不拆炸弹、三条、对子
    3.  拆顺子的单牌，不拆炸弹、三条、对子
    4.  拆对子，不拆炸弹、三条。
    5.  拆三条，不拆炸弹
    6.  炸弹
    7.  单牌
    */
    pdk_putOrder[PDK_CARDTPYE.danpai] = [
        [PDK_CARDTPYE.danpai, pdk_allBuChaiType],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.danpai, []],
    ];

    /* 接对子提示顺序
    1.  提示独立的对子
    2.  出非组成顺子必要条件的对子
    3.  拆顺子，不拆炸弹、飞机、三张
    4.  拆三张，不拆炸弹、飞机
    5.  拆飞机，不拆炸弹
    6.  出炸弹
    7.  对子，
    */
    pdk_putOrder[PDK_CARDTPYE.duizi] = [
        // [PDK_CARDTPYE.duizi, pdk_allBuChaiType],
        // [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        // [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang]],
        // [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan]],
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.duizi, []],
    ];

    /* 接连对提示顺序
    1.不拆炸弹的连对
    2.炸弹
    3.连对
    */
    pdk_putOrder[PDK_CARDTPYE.liandui] = [
        [PDK_CARDTPYE.liandui, pdk_allBuChaiType],
        [PDK_CARDTPYE.liandui, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.liandui, [pdk_allZhaDan]],
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.liandui, []],
    ];

    /* 接顺子提示顺序
    1.  优先出不能组成其他牌型的顺子
    2.  拆三张，不拆炸弹、对子、飞机
    3.  拆对子，不拆炸弹、飞机
    4.  拆飞机，不拆炸弹
    5.  顺子
    6.  炸弹
    */
    pdk_putOrder[PDK_CARDTPYE.shunzi] = [
        [PDK_CARDTPYE.shunzi, pdk_allBuChaiType],
        [PDK_CARDTPYE.shunzi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.duizi]],
        [PDK_CARDTPYE.shunzi, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
        [PDK_CARDTPYE.shunzi, [pdk_allZhaDan]],
        [PDK_CARDTPYE.shunzi, []],
        [pdk_allZhaDan, []],
    ];

    /*接三带二&三带一提示逻辑
    找到一个三张部分，依次提示完带牌再提示其他三张
    1.  炸弹，无不拆炸弹的三张，提示炸弹
    2.  选择三张，提示独立的三张
    3.  选择三张，拆顺子，不拆飞机
    4.  选择三张，拆飞机
    5.  选择二张，散牌大于2，提示散牌
    6.  选择二张，散牌等于1，有对子比散牌小且非组成顺子的必要条件，提示该对子，不拆三张、顺子/炸弹
    7.  选择二张，散牌等于1，有对子比散牌大且非组成顺子的必要条件，提示散牌加对子中的一张，不拆三张、顺子/炸弹       *67的意思是留下一张大的单牌
    8.  提示对子（接对子逻辑）
    9.  选择二张，拆顺子，不拆飞机/炸弹
    10. 选择二张，拆三张不拆/炸弹
    11. 炸弹
    12. 炸弹中的三张
    */
    pdk_get_sandaiyi_sandaier_putOrder = function (type) {
        return [
            [type, pdk_allBuChaiType],
            [type, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
            [type, [pdk_allZhaDan]],
            [pdk_allZhaDan, []],
            [type, []],
        ];
    }
    pdk_putOrder[PDK_CARDTPYE.sandaiyi] = pdk_get_sandaiyi_sandaier_putOrder(PDK_CARDTPYE.sandaiyi);
    pdk_putOrder[PDK_CARDTPYE.sandaier] = pdk_get_sandaiyi_sandaier_putOrder(PDK_CARDTPYE.sandaier);

    // 三带一 带牌顺序
    pdk_daiPaiOrder[PDK_CARDTPYE.sandaiyi] = [
        [PDK_CARDTPYE.danpai, pdk_allBuChaiType],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    ];

    /* 三带二 带牌顺序
    5.  选择二张，散牌大于2，提示散牌
    6.  选择二张，散牌等于1，有对子比散牌小且非组成顺子的必要条件，提示该对子，不拆三张、顺子/炸弹
    7.  选择二张，散牌等于1，有对子比散牌大且非组成顺子的必要条件，提示散牌加对子中的一张，不拆三张、顺子/炸弹       *67的意思是留下一张大的单牌
    8.  提示对子（接对子逻辑）
    9.  选择二张，拆顺子，不拆飞机/炸弹
    10. 选择二张，拆三张不拆/炸弹
    */
    pdk_daiPaiOrder[PDK_CARDTPYE.sandaier] = [
        [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.duizi, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    ];

    /*接四带二
    1.提示炸弹
    2.四带二
    优先选择最小炸弹
    选择带的二张牌如下
    当散牌大于等于2时，提示散牌
    散牌为1，拆对子（留一张大的单牌）不拆炸弹不拆顺子 
    无对子，拆顺子，优先提示顺子+散牌中最小的两张
    无顺子，有三张，提示三张中的两张（拆三张）
    */
    pdk_putOrder[PDK_CARDTPYE.sidaier] = [
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.sidaier, []],
    ];

    // 四带二 带牌顺序
    pdk_daiPaiOrder[PDK_CARDTPYE.sidaier] = [
        [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    ];

    /*接四带三
    提示炸弹
    四带三
    优先选择最小炸弹
    选择带的三张牌如下
    当散牌大于等于三时，提示散牌
    否，提示非组成顺子必要条件的散牌和对子中最小三张（保证关联顺子至少还有五张）
    提示最小的三张牌
    */
    pdk_putOrder[PDK_CARDTPYE.sidaisan] = [
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.sidaisan, []],
    ];

    // 四带三 带牌顺序
    pdk_daiPaiOrder[PDK_CARDTPYE.sidaisan] = [
        [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
        [PDK_CARDTPYE.danpai, []],
    ];

    /*接飞机
    优先不拆炸弹的飞机
    提示炸弹
    需要拆炸弹的飞机
    */
    pdk_putOrder[PDK_CARDTPYE.feiji] = [
        [PDK_CARDTPYE.feiji, [pdk_allZhaDan]],
        [pdk_allZhaDan, []],
        [PDK_CARDTPYE.feiji, []],
    ];

    /*飞机带牌逻辑
    优先提示散牌
    带二张
    散牌为1，对子点数比散牌点数小且非组成顺子的必要条件，提示对子
    否，提示散牌加一张最小的对子（先拆对子）
    无对子，拆顺子
    无顺子，有三张，提示三张中的两张（拆三张）
    
    带三张或更多
    提示非组成顺子必要条件的散牌和对子、三张中最小三张（保证关联顺子至少还有五张）
    提示最小的三张张牌
    */
    pdk_daiPaiOrder[PDK_CARDTPYE.feiji] = [
        [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],

        // 新增带对子的规则
        [PDK_CARDTPYE.duizi, [pdk_allBuChaiType]],
        [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],

        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
        [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    ];

    // 1 - 52  方块A:1 梅花A:2 红心A:3 黑桃A:4 -- 黑桃王:52
    // 1.16张玩法为现有的没有大小王、只有一个2、三个A的玩法 一共48张
    // 2.15张玩法：在16张的基础上，再去掉两个A（剩红桃A）、一个K（去掉黑桃K），一共45张
    GameLogic_RunFaster.prototype.randomCards = function (areaSelectMode, tData) {
        var cards = [];
        var handCardNum = this.handCount = areaSelectMode['cardNumIndex'] || 10;
        var allHandCardNum = handCardNum * tData.maxPlayer;
        //根据规则确定炸弹
        this.pdk_allZhaDan = [];
        if (areaSelectMode.isZhaDanJiaFen) {
            areaSelectMode.can3geZha && this.pdk_allZhaDan.push(this.CARDTPYE.sanzhang);
            areaSelectMode.can4geZha && this.pdk_allZhaDan.push(this.CARDTPYE.sizhang);
        } else this.pdk_allZhaDan = [];
        // 没有大小王的 52 张牌
        for (var i = 1; i <= 52; i++) cards.push(i);

        // 去掉 方块2 梅花2 红心2 去掉黑桃A
        let qc = [
            this.cardCfg.fk[2], this.cardCfg.mh[2], this.cardCfg.hx[2], this.cardCfg.ht[1],
            this.cardCfg.fk[3], this.cardCfg.mh[3], this.cardCfg.hx[3], this.cardCfg.ht[3],
            this.cardCfg.fk[4], this.cardCfg.mh[4], this.cardCfg.hx[4], this.cardCfg.ht[4]
        ];
        //去掉所有梅花
        if (areaSelectMode.HandCutRule == 0) {
            let len = Object.keys(this.cardCfg.mh);
            for (let _i = 0; _i < len.length; _i++) {
                const key = len[_i];
                qc.push(this.cardCfg.mh[key])
            }
        }
        for (let _i = 0; _i < qc.length; _i++) {
            const c = qc[_i];
            cards.splice(cards.indexOf(c), 1);
        }

        // 黑桃5先去掉, 确定人数后再放进牌堆， 保证黑桃5发到玩家手上, 拿黑桃5的先出
        cards.splice(cards.indexOf(this.cardCfg.ht[5]), 1);

        // 洗牌
        shuffleArray(cards);

        // 取得对应人数的牌数 - 1
        cards = cards.slice(0, allHandCardNum - 1);

        // 黑桃3放进洗牌堆
        cards.push(this.cardCfg.ht[5]);

        // 洗牌
        shuffleArray(cards);

        return cards;
    };

    /**
     * 计算牌点数
     * @param {number} num
     * @return {number}
     */
    GameLogic_RunFaster.prototype.calPoint = function (num, justValue) {
        if (!num)
            return -1;

        var ceilNum = Math.ceil(num / 4);
        if (ceilNum == 1 && !justValue)
            return PDK_APOINT; // A记为14

        if (ceilNum == 2 && !justValue)
            return PDK_MAXPOINT; // 2记为16

        return ceilNum;
    };

    GameLogic_RunFaster.prototype.calFlower = function (num) {
        return (num + 3) % 4;
    }

    /**
     * 判断是否为3顺  : 555666 , 555666777
     * @param  {array} oCards 按点数排序好的皮
     * @return {boll} 
     */
    GameLogic_RunFaster.prototype.isSanShun = function (oCards) {
        if (0 != oCards.length % 3)
            return false;

        for (var i in oCards) {
            if (i == 0) continue;

            var cardPoint1 = this.calPoint(oCards[i]);
            var cardPoint2 = this.calPoint(oCards[i - 1]);

            if (0 != i && 0 != i % 3 && cardPoint1 != cardPoint2)
                return false;

            // 每第3张牌比第4张牌少1点, 否则不是3顺
            if (0 != i && 0 == i % 3 && (cardPoint1 - cardPoint2) != 1)
                return false;
        }

        return true;
    }
    // console.log( GameLogic_RunFaster.prototype.isSanShun([3,3,3]) );

    /**
     * 获取所有3顺的组合
     * @param  {array} oCards 按点数排序好的牌
     * @return {array} 所有3顺的组合 和 散牌
     */
    GameLogic_RunFaster.prototype.getSanShunAndSanPai = function (oCards) {
        var countSanSame = 0;
        // 记录所有3张的数值
        var sanSameList = [];
        // 记录散牌
        var sanPaiList = [];

        for (var i in oCards) {

            // 如 是第一张牌 或 重置搜索, 记录已搜索一张牌， 跳过牌值对比
            if (0 == i || 0 == countSanSame) {
                countSanSame = 1;
                // 最后一张牌，放到散牌里
                if (i == (oCards.length - 1)) {
                    sanPaiList.push(oCards[i]);
                }
                continue;
            }

            var cardPoint1 = this.calPoint(oCards[i]);
            var cardPoint2 = this.calPoint(oCards[i - 1]);

            // 如果此牌 和 搜索的牌值相等, 搜索记录+1
            if (cardPoint1 == cardPoint2) {
                countSanSame++;

            } else {
                // 如 已搜索的牌 是散牌， 记录为散牌
                for (var j = 1; j <= countSanSame; j++)
                    sanPaiList.push(oCards[i - j]);

                // 此牌oCards[i] 继续和后面的牌对比, 所以记录此牌在搜索 
                countSanSame = 1;

            }

            // 如果3张 ，记录， 重置搜索  
            if (3 == countSanSame) {
                for (var j = 0; j < countSanSame; j++)
                    sanSameList.push(oCards[i - j]);
                countSanSame = 0;

                // 如 最后一张牌没有3张
            } else if (i == (oCards.length - 1)) {
                for (var j = 0; j < countSanSame; j++)
                    sanPaiList.push(oCards[i - j]);
                countSanSame = 0;
            }
        }


        var tmpsanShun1 = [];
        var tmpsanShun2 = [];
        var handIndex = 0;
        sanSameList.sort(this.cardSortBigToSmall.bind(this));// 从大到小排序
        for (var i = 0; i < sanSameList.length - 1; i++) {
            var pa = this.calPoint(sanSameList[i]);
            var pb = this.calPoint(sanSameList[i + 1]);

            // 如果不能组成三顺 或者 是数组最后一位， 计算记录 最大的 三顺
            if (pa - pb > 1 || (i + 1) == sanSameList.length - 1) {
                if ((i + 1) == sanSameList.length - 1) {
                    tmpsanShun2 = sanSameList.slice(handIndex, sanSameList.length);
                } else {
                    tmpsanShun2 = sanSameList.slice(handIndex, i + 1);
                    handIndex = i + 1;
                }
                if (tmpsanShun1.length < tmpsanShun2.length || this.calPoint(tmpsanShun1[0]) < this.calPoint(tmpsanShun2[0])) {
                    tmpsanShun1 = tmpsanShun2;
                }
            }
        }

        for (var i in tmpsanShun1) {
            var card = tmpsanShun1[i]
            sanSameList.splice(sanSameList.indexOf(card), 1);
        }
        sanPaiList = sanPaiList.concat(sanSameList);

        return [tmpsanShun1, sanPaiList];
    }

    GameLogic_RunFaster.prototype.countDuiNum = function (oCards) {
        var num = 0;
        var cardNumByValue = {};
        for (var i in oCards) {
            var cardValue = this.calPoint(oCards[i]);
            if (!cardNumByValue[cardValue]) {
                cardNumByValue[cardValue] = 1;
            } else {
                cardNumByValue[cardValue]++;
                if (cardNumByValue[cardValue] % 2 == 0)
                    num++;
            }
        }

        if (num == oCards.length / 2) {
            return num;
        } else {
            return 0;
        }
    }

    GameLogic_RunFaster.prototype.formatFeiJiType = function (oCards) {
        // 记录所有3张的数值
        var sanSameList = [];
        // 记录散牌
        var sanPaiList = [];
        var sanShunAndSanPai = this.getSanShunAndSanPai(oCards);

        sanSameList = sanShunAndSanPai[0];
        sanPaiList = sanShunAndSanPai[1];
        var feijiInfo = {}
        feijiInfo.BU_SHI_FEI_JI = 0 // 飞机类型: 不是飞机
        feijiInfo.DAI_CHI_BANG = 1; // 飞机类型: 带翅膀
        feijiInfo.DAN_ZHANG_CHI_BANG = 2;// 飞机类型: 带单张的翅膀
        feijiInfo.NO_CHI_BANG = 3;  // 飞机类型: 不带翅膀
        feijiInfo.value = 0;    // 飞机的牌值
        feijiInfo.type = feijiInfo.BU_SHI_FEI_JI; // 飞机类型

        if (!oCards) return feijiInfo;

        // 将3张里的 最大数量的3顺 整理出来
        var maxCountShunIndex1 = 0;     // 最大数量的3顺 的数组下表始值
        var maxCountShunIndex2 = -3;    // 最大数量的3顺 的数组下表终值
        var countSanShun = 0;         // 3顺最大数量的
        var tempCountSanShun = 0;
        for (var i = 0; i < sanSameList.length / 3; i++) {
            if (i == 0) {
                tempCountSanShun++;
                continue;
            }

            var cardPoint1 = this.calPoint(sanSameList[i * 3]);
            var cardPoint2 = this.calPoint(sanSameList[i * 3 - 1]);
            var isLastCount = i == (sanSameList.length / 3 - 1);    // 此3张是否为最后3张
            var isSanShun = (cardPoint1 - cardPoint2) <= 1;       // 此3张和前3张是否为顺

            // 如果是 3顺， 顺数量+1
            if (isSanShun) tempCountSanShun++;

            // 如果不是 3顺， 顺的数量 比 前面顺的数量多 (数量最大的顺作为 飞机)
            // 如果和前3张组成3顺， 且是最后的3张， 
            if ((!isSanShun || isSanShun && isLastCount)
                && countSanShun <= tempCountSanShun) {
                maxCountShunIndex2 = (i + 1) * 3 - 1;
                countSanShun = tempCountSanShun;
            }

        }
        maxCountShunIndex1 = maxCountShunIndex2 - countSanShun * 3 + 1

        var sanShunList = []
        for (var i in sanSameList) {
            if (i >= maxCountShunIndex1 && i <= maxCountShunIndex2) {
                sanShunList.push(sanSameList[i]);

            } else {
                sanPaiList.push(sanSameList[i]);
            }
        }



        // 包含四张同样的牌不算飞机
        for (var i = 0; i < oCards.length; i++) {
            var cardValue = this.calPoint(oCards[i]);
            var findCards = this.findNSameCard(oCards, cardValue, 4);
            if (findCards) return feijiInfo;
        }


        if (0 == sanShunList.length) return feijiInfo;

        // 两张牌做翅膀
        // var duiNum = this.countDuiNum(sanPaiList);
        // if(sanShunList.length/3 == duiNum) // 翅膀需要是对子  333-444555-6   333444-6789  
        // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length/3 >= sanPaiList.length/2 && oCards.length % 5 == 0) // 翅膀任意牌
        //     feijiInfo.type = feijiInfo.DAI_CHI_BANG;

        // 单张做翅膀
        // 如果是 用3张作翅膀的牌型: 555666777888  333444555666777888999101010 
        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && 0 == sanShunList.length % 12 && 0 == sanPaiList.length)
            feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;
        // 如果飞机和翅膀数量相等
        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanPaiList.length == sanShunList.length / 3)
            feijiInfo.type = feijiInfo.DAN_ZHANG_CHI_BANG;

        // 不带翅膀 的飞机
        if (feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length == 0)
            // if(feijiInfo.type == feijiInfo.BU_SHI_FEI_JI && sanShunList.length > 0 && sanPaiList.length <= sanShunList.length/3*2) // 任意翅膀数量的飞机
            feijiInfo.type = feijiInfo.NO_CHI_BANG;

        if (feijiInfo.type != feijiInfo.BU_SHI_FEI_JI) {
            feijiInfo.value = sanShunList[sanShunList.length - 1];
        }

        // console.log('sanSameList', sanSameList.toString());
        // console.log('sanShunList', sanShunList.toString());
        // console.log('sanPaiList', sanPaiList.toString());
        return feijiInfo;
    }

    /**
     * 判断是否为飞机 
     * @param  {array} oCards 按点数排序好的牌
     * @return {num} 返回飞机的牌值， 不是飞机返回0 
     */
    GameLogic_RunFaster.prototype.isFeiJi = function (oCards) {
        var feijiInfo = this.formatFeiJiType(oCards);
        return feijiInfo.value;
    }

    /**
     * 判断是否是顺子
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    GameLogic_RunFaster.prototype.isShun = function (oCards) {
        if (!oCards || oCards.length < 5)
            return false;

        var cardCount = oCards.length;
        var points = [];
        for (var i = 0; i < oCards.length; i++) {
            points.push(this.calPoint(oCards[i]));
        }

        for (var i = 0; i <= cardCount - 2; i++) {
            if (points[i] != points[i + 1] - 1)
                return false;
        }

        return true;
    };

    GameLogic_RunFaster.prototype.isZhaDan = function (oCards, areaSelectMode) {
        if (!oCards || oCards.length == 0) return false;

        var cardType = this.calType(oCards, areaSelectMode);

        // 四炸

        if (pdk_allZhaDan.indexOf(cardType) > -1) {
            return true;
        } else {
            return false;
        }

    }

    GameLogic_RunFaster.prototype.isHadZhaDan = function (cards, areaSelectMode) {
        for (var i = 0; i < cards.length; i++) {
            var cardValue = this.calPoint(cards[i]);
            var isHadZhaDan = this.findNSameCard(cards, cardValue, 4);
            if (isHadZhaDan) return true;
        }

        if (areaSelectMode.can3aZhaDan) {
            var isSanA = this.findNSameCard(cards, PDK_APOINT, 3);
            if (isSanA) return true;
        }

        var shunzis = this.findShunZi(cards, cards.length, true);
        if (shunzis) return true;

        return false;
    }

    // 是否拆散了炸弹牌型
    GameLogic_RunFaster.prototype.isChaiZhaDan = function (handCards, putCards, areaSelectMode) {
        // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
        for (var i = 0; i < putCards.length; i++) {
            var cardValue = this.calPoint(putCards[i]);
            var findHand = this.findNSameCard(handCards, cardValue, 4);
            var findCards = this.findNSameCard(putCards, cardValue, 4);
            // putCards 有属于炸弹的牌， 而且 没有包含完整的炸弹牌型
            if (findHand && !findCards) {
                return true;
            }

            var isPutA = this.findNSameCard(putCards, PDK_APOINT, 1);
            if (areaSelectMode.can3aZhaDan && isPutA) {
                // 3A的炸弹
                var findHand3A = this.findNSameCard(handCards, PDK_APOINT, 3);
                var findCards3A = this.findNSameCard(putCards, PDK_APOINT, 3);
                // 如果拆了3个A
                if (findHand3A && !findCards3A) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 判断是否是连对
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    GameLogic_RunFaster.prototype.isLiandui = function (oCards) { //oCards有序
        var cardNum = PDK_CARDCOUNT[PDK_CARDTPYE.liandui];// 连对最小牌数

        if (!oCards || oCards.length < cardNum || oCards.length % 2 != 0)
            return false;

        var cardCount = oCards.length;
        var points = [];
        for (var i = 0; i < oCards.length; i++) {
            points.push(this.calPoint(oCards[i]));
        }

        for (var i = 0; i < cardCount - 2; i += 2) {
            var abs = Math.abs(points[i] - points[i + 2]);
            if (abs != 1 || (points[i + 1] != points[i]) || (points[i + 2] != points[i + 3])) return false;
        }

        return true;
    };

    /**
     * 查找oCards是否有顺子或同花顺
     * @param  {Array} oCards 需要查找的牌
     * @param  {Number} cardNum 查找顺子牌数，最少5张牌
     * @param  {Boolean} isNeedSameFlower 是否查找同花顺
     * @return {Array} 如有顺子，返回牌数组， 否则返回Null
     */
    GameLogic_RunFaster.prototype.findShunZi = function (oCards, cardNum, isNeedSameFlower) {
        // var cards = oCards.slice();
        // 从大到小排序， 牌面数值 1最小  k最大
        // cards.sort(this.sortBigCardValue.bind(this));
        if (cardNum < PDK_CARDCOUNT[PDK_CARDTPYE.shunzi]) return null;

        var getShunzis = function (_ocards, _cardNum) {
            var allsz = [];
            for (var pi = 1; pi <= PDK_APOINT - _cardNum + 1; pi++) { // 顺子首张
                var shun = [];

                for (var j = 0; j < _cardNum; j++) {
                    var p = pi + j;
                    var find = null;

                    if (p == 1 || p == 2) {
                        for (var i in _ocards) {
                            if (this.calPoint(_ocards[i], true) == p) {
                                find = [_ocards[i]];
                            }
                        }

                    } else {
                        find = this.findNSameCard(_ocards, p, 1)
                    }

                    if (find)
                        shun = shun.concat(find);
                }
                if (shun.length == _cardNum)
                    allsz.push(shun);
            }
            return allsz;

        }.bind(this);

        var shunzis = []

        if (isNeedSameFlower) {
            var flowers = {};

            for (var i in oCards) {
                var card = oCards[i];
                var flower = this.calFlower(card);
                if (!flowers[flower]) flowers[flower] = [];
                flowers[flower].push(card);
            }

            for (var i in flowers) {
                if (flowers[i].length >= cardNum)
                    shunzis = shunzis.concat(getShunzis(flowers[i], cardNum))
            }

        } else {
            shunzis = getShunzis(oCards, cardNum);
        }

        if (shunzis.length > 0) {
            return shunzis;
        } else {
            return null;
        }
    }

    /**
     * 计算牌型
     * @param {array} cards 按点数排好序的牌
     * @return {PDK_CARDTPYE} 牌型，-1 = 不成型
     */
    GameLogic_RunFaster.prototype.calType = function (pCards, areaSelectMode, skipSzdaipai) {

        var maxSameCard = 0;
        var cards = pCards.slice();
        cards.sort(this.cardValueCmp.bind(this));
        var cardCount = cards.length;
        var allSame = this.calPoint(cards[0]) == this.calPoint(cards[cards.length - 1]);

        var pointCounts = {};
        for (var i = 0; i < cards.length; i++) {
            var p = this.calPoint(cards[i]);
            if (pointCounts[p]) {
                pointCounts[p]++;
            }
            else {
                pointCounts[p] = 1;
            }
        }
        var maxCount = 0; // 最多有几张点数最多的牌
        for (var p in pointCounts) {
            if (maxCount < pointCounts[p]) {
                maxCount = pointCounts[p];
                maxSameCard = p;
            }
        }

        // 顺子，5张起 
        if (cardCount >= PDK_CARDCOUNT[PDK_CARDTPYE.shunzi] && maxCount == 1 && this.findShunZi(cards, cardCount, false))
            return PDK_CARDTPYE.shunzi;

        // 连对，2对起
        if (cardCount >= PDK_CARDCOUNT[PDK_CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
            return PDK_CARDTPYE.liandui;

        //四炸
        if (cardCount == 4 && allSame) {
            if (areaSelectMode["can4geZha"]) return PDK_CARDTPYE.sizha || -1;
            else return PDK_CARDTPYE.sizhang || -1
        }

        // 三张
        if (cardCount == 3 && allSame) {
            if (areaSelectMode["can3geZha"]) return PDK_CARDTPYE.sanzha || -1;
            else return PDK_CARDTPYE.sanzhang || -1
        }

        // 对子
        if (cardCount == 2 && allSame)
            return PDK_CARDTPYE.duizi;

        // 单牌
        if (cardCount == 1)
            return PDK_CARDTPYE.danpai;

        return -1;
    };

    GameLogic_RunFaster.prototype.cardsType = function (cards, areaSelectMode) {
        return this.calType(cards, areaSelectMode)
    }

    /**
     * 计算牌型点数
     * @param {array} cards 按点数排好序的牌
     * @return {number}
     */
    GameLogic_RunFaster.prototype.calCardsValue = function (cards, type, areaSelectMode) {

        if (!cards || cards.length == 0)
            return -1;

        if (!type)
            type = this.calType(cards, areaSelectMode);

        var lastCard = cards[cards.length - 1];

        if (type == PDK_CARDTPYE.sandaier)
            return this.calPoint(cards[2]);

        if (type == PDK_CARDTPYE.sandaiyi)
            return this.calPoint(cards[2]);

        if (type == PDK_CARDTPYE.sidaier)
            return this.calPoint(cards[3]);

        if (type == PDK_CARDTPYE.sidaisan)
            return this.calPoint(cards[3]);

        if (type == PDK_CARDTPYE.feiji)
            return this.calPoint(this.isFeiJi(cards));

        if (type == PDK_CARDTPYE.szdaipai) {
            var sznum = 5 + (cards.length - 8) / 2;
            var shunzis = this.findShunZi(cards, sznum, true);
            var sz = shunzis[0];
            sz.sort(this.sortBigCardValue.bind(this));
            if (Math.ceil(sz[sz.length - 1] / 4) == 1 && this.calPoint(sz[0]) == 13) return PDK_APOINT;    // KQJ10A 特需处理
            return this.calPoint(sz[Math.ceil(sz.length / 2)], true)
        }

        if (type == PDK_CARDTPYE.shunzi || type == PDK_CARDTPYE.sztonghua) {
            cards.sort(this.sortBigCardValue.bind(this));
            if (Math.ceil(cards[cards.length - 1] / 4) == 1 && this.calPoint(cards[0]) == 13) return PDK_APOINT;    // KQJ10A 特需处理
            return this.calPoint(cards[Math.ceil(cards.length / 2)], true)
        }


        // 单牌，对子，三张，顺子，连对，四炸，三个A
        return this.calPoint(lastCard);
    };

    // 牌点比较函数
    GameLogic_RunFaster.prototype.cardValueCmp = function (a, b) {
        var pa = this.calPoint(a);
        var pb = this.calPoint(b);
        if (pa == pb)
            return a - b;

        return pa - pb;
    };

    // 排掉从大到小排序
    GameLogic_RunFaster.prototype.cardSortBigToSmall = function (a, b) {
        var pa = this.calPoint(a);
        var pb = this.calPoint(b);
        if (pa == pb)
            return b - a;

        return pb - pa;
    }

    GameLogic_RunFaster.prototype.sortBigCardValue = function (a, b) {
        var pa = Math.ceil(a / 4);
        var pb = Math.ceil(b / 4);
        if (pa == pb)
            return b - a;

        return pb - pa;
    }

    /** 剔除癞子
     * @param {array} oCards [in] 
     * @param {array} cards [out] 剔除癞子后的按点数据序的牌
     * @return {number} 返回癞子数
     */
    GameLogic_RunFaster.prototype.transformAndGetLaizi = function (oCards, cards) {
        var laizi = 0;
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == this.laiziCard)
                laizi++;
            else
                cards.push(oCards[i]);
        }
        cards.sort(this.cardValueCmp.bind(this));
        return laizi;
    };



    /** 
     * 牌是否能压上
     * @param {array} oCards 按点数排好序的牌/选择了的手牌
     * @param {array} [oLastCards] 按点数排好序的牌/最后打出的牌
     * @param {number} [handsNum] 手牌数量
     */
    GameLogic_RunFaster.prototype.canPut = function (oCards, oLastCards, handsNum, areaSelectMode) {

        var cardsType = this.calType(oCards, areaSelectMode);

        // cc.log("GameLogic_RunFaster.prototype.canPut oCards:", oCards );
        // cc.log("oLastCards" , oLastCards );
        // cc.log("handsNum" , handsNum );
        // cc.log("canPut cardsType", cardsType)
        // 如果客户端调用时 没有 传areaSelectMode

        if (cardsType == -1)
            return false;

        // 不能出3张 或 3顺不能出
        if (cardsType == PDK_CARDTPYE.sanzhang) {
            // if (oCards.length == handsNum && !oLastCards) {// 如果最后一手牌是3张或3顺
            //     return true;
            // } else {
            //     return false;

            // }
            return true;
        }

        // 单张翅膀 和 不带翅膀的飞机最后一手可以出
        // if (cardsType == PDK_CARDTPYE.feiji){
        //     var feijiInfo = this.formatFeiJiType(oCards);
        //     if(feijiInfo.type != feijiInfo.DAI_CHI_BANG){
        //         if(oCards.length == handsNum){
        //             return true;
        //         }else{
        //             return false;
        //         }
        //     }
        // }

        // 没有上次打的牌，三家过自己再出牌
        if (!oLastCards || oLastCards.length == 0 || oLastCards == 'undefined')
            return true;

        // 矫正上家出顺子，找到同花顺带牌不能打
        var lastCardsType = this.calType(oLastCards, areaSelectMode);
        if (cardsType == PDK_CARDTPYE.szdaipai && lastCardsType == PDK_CARDTPYE.shunzi) {
            cardsType = this.calType(oCards, areaSelectMode, true);
        }

        if ((cardsType == PDK_CARDTPYE.shunzi || cardsType == PDK_CARDTPYE.liandui) && oCards.length != oLastCards.length)
            return false;

        oCards.sort(this.cardValueCmp.bind(this));
        oLastCards.sort(this.cardValueCmp.bind(this));

        if (cardsType == lastCardsType && oCards.length == oLastCards.length) {
            var typeValue = this.calCardsValue(oCards, cardsType, areaSelectMode);
            var lastTypeValue = this.calCardsValue(oLastCards, lastCardsType, areaSelectMode);
            return typeValue > lastTypeValue;
        }
        else if (PDK_CARD_VALUE[cardsType]) {
            var last_card_value = PDK_CARD_VALUE[lastCardsType] || 0;
            return PDK_CARD_VALUE[cardsType] > last_card_value;
        }

        return false;
    };

    // 检查是否能出牌
    /**
     * 检测是否能出牌
     * @param  {Array} oHands 手牌
     * @param  {Array} cards 提起的牌/选择了的牌
     * @param  {Array} lastCards 上次出的牌/打在桌面上的牌
     * @param  {object}  areaSelectMode 玩法选项 
     * @param  {bool}  isNextPlayerOneCard 下家是否为报单
     * @param  {bool}  isFirstRound 是否第一局
     * @return {Array} 返回可以出的牌
     */
    GameLogic_RunFaster.prototype.checkPut = function (oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
        if (cards && typeof (cards) != 'undefined' && cards.length == 0) return null;

        var hands = oHands.slice();
        for (var i = 0; i < cards.length; i++) {
            var p = hands.indexOf(cards[i]);
            if (p >= 0) {
                hands.splice(p, 1);
            }
            else {
                return null; // 手里没有这些牌
            }
        }

        let bankerRule = areaSelectMode && areaSelectMode.mustPutHongTaoSan;
        needFindSpade3 = false;
        // if (bankerRule === this.GameBankerRule.FirstRoundMustPlaySpade3 && isFirstRound) {
        //     needFindSpade3 = true;
        // }
        // 第一局 红桃三先出时 有红桃三必须出
        if (needFindSpade3 && cards.indexOf(this.cardCfg.firstOutCard) < 0 && oHands.indexOf(this.cardCfg.firstOutCard) >= 0) {
            return null;
        }

        if (!areaSelectMode && cc) {
            areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        }


        var cardType = this.calType(cards, areaSelectMode);
        var pthis = this;

        // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
        if (areaSelectMode && areaSelectMode.zhaDanBuChai && this.isChaiZhaDan(oHands, cards, areaSelectMode)) {
            return null;
        }

        // 四带二
        if (cardType == PDK_CARDTPYE.sidaier && areaSelectMode && !areaSelectMode.can4dai2) {
            return null
        }

        // 四带三
        if (cardType == PDK_CARDTPYE.sidaisan && areaSelectMode && !areaSelectMode.can4dai3) {
            return null
        }

        // 如果 下家报单 提起的一张牌 不是最大的牌
        var sortHand = oHands.slice();
        sortHand.sort(this.cardValueCmp.bind(this));
        var maxCards = this.getAllMaxCard(oHands);
        if (isNextPlayerOneCard && cards.length == 1 && this.calPoint(maxCards[0]) != this.calPoint(cards[0]))
            return null;


        var sortCards = cards;
        var sortLastCards = lastCards;

        if (typeof (sortLastCards) == "number")
            sortLastCards = null;

        if (sortCards) {
            sortCards = sortCards.slice();
            sortCards.sort(this.cardValueCmp.bind(this));
        }
        if (sortLastCards instanceof Array) {
            sortLastCards = sortLastCards.slice(),
                sortLastCards.sort(this.cardValueCmp.bind(this));
        }

        if (this.canPut(sortCards, sortLastCards, oHands.length, areaSelectMode)) {
            return hands; // 能打得过上家的牌
        }
        return null;
    };

    GameLogic_RunFaster.prototype.getMaxDanPai = function (oCards) {
        var sortCards = oCards.slice();
        sortCards.sort(this.cardValueCmp.bind(this));
        return sortCards[sortCards.length - 1];
    }

    /**
     * 对手牌排序
     * @param {array} 
     * @param {number} sortType 1 = 花色排序, 2 = 张数排序, 0 ==普通牌型
     */
    GameLogic_RunFaster.prototype.sortHandCards = function (oCards, sortType) {
        var cards = oCards.slice();
        var commonCmp = this.cardValueCmp.bind(this);
        var cardValueCmp = this.cardValueCmp.bind(this);
        if (sortType == 1) { // 花色排序
            commonCmp = function (a, b) {
                var c1 = this.calFlower(a);
                var c2 = this.calFlower(b);
                if (c1 == c2)
                    return cardValueCmp(a, b);
                else
                    return c1 - c2;
            }
        }
        else if (sortType == 2) { // 张数排序
            var pointCounts = {};
            for (var i = 0; i < cards.length; i++) {
                var p = this.calPoint(cards[i]);
                if (pointCounts[p])
                    pointCounts[p]++;
                else
                    pointCounts[p] = 1;
            }

            commonCmp = function (a, b) {
                var c1 = pointCounts[this.calPoint(a)];
                var c2 = pointCounts[this.calPoint(b)];
                if (c1 == c2)
                    return cardValueCmp(a, b);
                else
                    return c1 - c2;
            }
        }

        cards.sort(function (a, b) {
            return -commonCmp(a, b);
        });
        return cards;
    };

    /** 
     * 找N张点数一样的牌
     * @param {array} hands 按点数排好序的牌 
     * @param {number} points
     * @param {number}
     * @return {array}
     */
    GameLogic_RunFaster.prototype.findNSameCard = function (hands, point, n) {
        var newh = hands.slice();
        newh.sort(this.cardValueCmp.bind(this));
        for (var i = 0; i < newh.length; i++) {
            if (this.calPoint(newh[i]) == point && this.calPoint(newh[i + n - 1]) == point)
                return newh.slice(i, i + n);
        }
        return null;
    };

    // 删除相应牌值
    GameLogic_RunFaster.prototype.delPoint = function (hands, points, values) {
        var arr = hands.slice();
        var delitems = points || values;
        for (var i = 0; i < delitems.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (points && this.calPoint(arr[j]) == delitems[i]) {
                    arr.splice(j, 1);
                    j--;
                } else if (values && arr[j] == delitems[i]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    /**
     * 列举集合里面 num 个元素的所有组合
     * @param  {array} parr 集合数组
     * @param  {number} num 元素个数
     * @return {array} nun个元素的所有组合
     */
    GameLogic_RunFaster.prototype.lieju = function (parr, num) {
        var tmps = [];

        var zhuhe = function (srcArr, eleNum, tagArr) {
            if (eleNum == 0) return tagArr;
            var newZhuHe = [];

            if (!tagArr) {
                tagArr = [];
                tagArr.push(srcArr[0]);
                newZhuHe.push(tagArr);
            } else {
                for (var i = 0; i < tagArr.length; i++) {
                    for (var j = i; j < srcArr.length; j++) {
                        newZhuHe.push(tagArr[i].concat(srcArr[j]));
                    }
                }
            }

            var pSrcArr = srcArr.slice(1, srcArr.length);
            return zhuhe(pSrcArr, --eleNum, newZhuHe)
        }

        for (var i = 0; i < parr.length - num + 1; i++) {
            var tmp = zhuhe(parr.slice(i, parr.length), num);
            if (tmp) tmps = tmps.concat(tmp);
        }

        return tmps;
    }

    GameLogic_RunFaster.prototype.formatCards = function (oCards) {
        var info = {};
        // key:牌值  value:数量  (10有3张）
        info.mValueToNum = {};
        // key:数量  value:牌值  (3张的牌有10, K, 4)
        info.mNumToValue = {};

        var cds = oCards.slice();
        cds.sort(this.cardValueCmp.bind(this));
        info.cds = cds;

        for (var i in cds) {
            var value = this.calPoint(cds[i]);
            if (!info.mValueToNum[value]) info.mValueToNum[value] = [];

            info.mValueToNum[value].push(cds[i]);
        }

        for (var i in cds) {
            var value = this.calPoint(cds[i]);
            var num = info.mValueToNum[value].length;

            if (!info.mNumToValue[num]) info.mNumToValue[num] = [];

            if (info.mNumToValue[num].indexOf(value) < 0)
                info.mNumToValue[num].push(value);
        }

        return info;
    }

    GameLogic_RunFaster.prototype.indexOfCards = function (cardList, cards) {
        for (var i in cardList) {
            var tmpCards = cardList[i];
            if (this.isSameCards(tmpCards, cards))
                return true;
        }
        return false;
    }

    GameLogic_RunFaster.prototype.isSameCards = function (cards1, cards2) {
        if (cards1.length != cards2.length) return false;

        var cds1 = cards1.slice();
        var cds2 = cards2.slice();
        cds1.sort(this.cardValueCmp.bind(this));
        cds2.sort(this.cardValueCmp.bind(this));

        for (var i in cds1) {
            if (cds1[i] != cds2[i])
                return false;
        }

        return true;
    }

    /**
     * 自定义规则查找 手牌
     * @param  {Array} oCards 手牌
     * @param  {Number} findNum 查找的数量
     * @param  {Array} ignoreCardValued 忽略不用查找的牌(可控)
     * @return {Array} 返回查找到的牌
     */
    GameLogic_RunFaster.prototype.findCardByRole = function (oCards, findNum, ignoreCardValued) {

        var cinfo = this.formatCards(oCards);
        var fCards = [];

        // 最小的两张单牌
        if (cinfo.mNumToValue[1] && cinfo.mNumToValue[1].length >= 2) {
            var ret = [];
            for (var i = 0; i < findNum; i++) {
                var value = cinfo.mNumToValue[1][i];
                if (!ignoreCardValued || !ignoreCardValued[value]) {
                    var card = cinfo.mValueToNum[value][0];
                    ret.push(card);
                }
            }

            if (ret.length == findNum && !this.indexOfCards(fCards, ret))
                fCards.push(ret);
        }

        // 最小的一个对子
        if (cinfo.mNumToValue[2] && cinfo.mNumToValue[2].length >= 1) {
            var ret = [];
            var value = cinfo.mNumToValue[2][0];
            if (!ignoreCardValued || !ignoreCardValued[value]) {
                var cards = cinfo.mValueToNum[value];
                ret = ret.concat(cards)
            }
            if (ret.length == findNum) fCards.push(ret);
        }

        // 不拆3，4张的情况下，最小的两张牌
        var ret = [];
        for (var i in cinfo.cds) {
            var card = cinfo.cds[i];
            var value = this.calPoint(card);
            if (!ignoreCardValued || !ignoreCardValued[value]) {
                var length = cinfo.mValueToNum[value].length;
                if (length <= 2)
                    ret.push(card);
            }

            if (ret.length == findNum) {
                if (!this.indexOfCards(fCards, ret)) fCards.push(ret);
                break;
            }
        }

        // 最小的两张牌
        var ret = [];
        for (var i in cinfo.cds) {
            var card = cinfo.cds[i];
            var value = this.calPoint(card);
            if (!ignoreCardValued || !ignoreCardValued[value]) {
                ret.push(card);
            }

            if (ret.length == findNum) {
                if (!this.indexOfCards(fCards, ret)) fCards.push(ret);
                break;
            }
        }

        return fCards;
    }

    /** 
     * 用laizi张癞子去拼出type牌型的牌
     * @param {array} hands 按点数按好序的牌
     * @param {number} laizi 所使用的癞子数
     * @param {PDK_CARDTPYE} type 要拼出的牌型
     * @param {array} lastCards 最后一手牌
     * @param {array} buChaiTypes 不拆牌型
     * @param {array} 拼好的 
     */
    GameLogic_RunFaster.prototype.findCardByType = function (hands, laizi, type, lastCards, buChaiTypes) {
        var rets = [];
        var laizis = [];
        var cardNum = typeof (lastCards) != 'undefined' ? lastCards.length : null;
        var cardCount = PDK_CARDCOUNT[type];

        if (cardNum && (type == PDK_CARDTPYE.liandui || type == PDK_CARDTPYE.shunzi))
            cardCount = cardNum;

        if (laizi > cardCount || laizi + hands.length < cardCount) {
            return rets;
        }

        for (var i = 0; i < laizi; i++) {
            laizis.push(this.laiziCard);
        }

        if (type == PDK_CARDTPYE.feiji && hands.length >= cardCount) {
            var handFeiji = this.getSanShunAndSanPai(hands);
            var handCardSanZhangNum = handFeiji[0].length / 3;
            var handCardSanPaiNum = handFeiji[1].length;

            if (handCardSanZhangNum >= 2) {
                if (lastCards && lastCards != -1 && lastCards.length > 0) {
                    var lastCardsFeiji = this.getSanShunAndSanPai(lastCards);
                    var lastCardSanZhangNum = lastCardsFeiji[0].length / 3;
                    var lastCardSanPaiNum = lastCardsFeiji[1].length;

                    if (handCardSanZhangNum >= lastCardSanZhangNum) {
                        var sanShun = [];
                        var sanpai = [];
                        for (var i = 0; i < handCardSanZhangNum; i++) {
                            var startSanIndex = i * 3;
                            var lastSanIndex = i * 3 + lastCardSanZhangNum * 3;
                            sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                            if (sanShun.length != lastCardsFeiji[0].length) continue;
                            var feiJiValue_a = this.formatFeiJiType(handFeiji[0]).value;
                            var feiJiValue_b = this.formatFeiJiType(lastCardsFeiji[0]).value;
                            if (feiJiValue_a < feiJiValue_b) continue;
                            sanpai = handFeiji[0].slice(0, startSanIndex);
                            sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[0].length));
                            sanpai = sanpai.concat(handFeiji[1]);

                            if (lastCardSanPaiNum > 0) {
                                var allSanPaiZhuHe = [];
                                if (this.useNewTip) {
                                    allSanPaiZhuHe = this.findDaiPai(sanpai, PDK_CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);

                                } else {
                                    // allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);   // 列举所有散牌组合
                                    for (var j = 0; j < sanpai.length && sanpai.length >= j + lastCardSanPaiNum; j++) {  // 依次散牌组合
                                        var cards = sanpai.slice(j, j + lastCardSanPaiNum);
                                        allSanPaiZhuHe.push(cards);
                                    }
                                }

                                for (var j in allSanPaiZhuHe) {
                                    var ret = sanShun.concat(allSanPaiZhuHe[j]);
                                    if (this.isFeiJi(ret) != 0) {
                                        rets.push(ret);
                                    }
                                }

                            } else {
                                rets.push(sanShun);
                            }
                        }
                    }
                }
                else {
                    // 首次出牌或者其他玩家过牌

                    // var lastCardSanZhangNum = 0;
                    // var lastCardSanPaiNum = 0;
                    // for(var k = handCardSanZhangNum; k >= 2; k--)
                    // {
                    //     lastCardSanZhangNum = k;

                    //     for(var m = lastCardSanZhangNum; m >= 0; m--)
                    //     {
                    //         lastCardSanPaiNum = Math.min(handCardSanPaiNum,m*2);

                    //         if(handCardSanZhangNum >= lastCardSanZhangNum)
                    //         {
                    //             var sanShun = [];
                    //             var sanpai = [];

                    //             for(var i=0; i<handCardSanZhangNum; i++)
                    //             {
                    //                 var startSanIndex = i*3;
                    //                 var lastSanIndex = i*3+lastCardSanZhangNum*3;

                    //                 sanShun = handFeiji[0].slice(startSanIndex, lastSanIndex)
                    //                 sanpai = handFeiji[0].slice(0, startSanIndex);
                    //                 sanpai = sanpai.concat(handFeiji[0].slice(lastSanIndex, handFeiji[1].length-lastSanIndex));
                    //                 sanpai = sanpai.concat(handFeiji[1]);

                    //                 if (lastCardSanPaiNum > 0) {
                    //                     var allSanPaiZhuHe = [];

                    //                     if (this.useNewTip) 
                    //                     {
                    //                         allSanPaiZhuHe = this.findDaiPai(sanpai, PDK_CARDTPYE.feiji, lastCardSanPaiNum, false, buChaiTypes);
                    //                     } 
                    //                     else 
                    //                     {
                    //                         // allSanPaiZhuHe = this.lieju(sanpai, lastCardSanPaiNum);   // 列举所有散牌组合
                    //                         for(var j=0; j < sanpai.length && sanpai.length >= j+lastCardSanPaiNum; j++) 
                    //                         {  
                    //                             // 依次散牌组合
                    //                             var cards = sanpai.slice(j, j+lastCardSanPaiNum);
                    //                             allSanPaiZhuHe.push(cards);
                    //                         }
                    //                     }

                    //                     for(var j in allSanPaiZhuHe)
                    //                     {
                    //                         var ret = sanShun.concat( allSanPaiZhuHe[j] );

                    //                         ret.sort(this.cardValueCmp.bind(this));

                    //                         if(this.isFeiJi(ret) != 0)
                    //                         {
                    //                             rets.push(ret);
                    //                         }
                    //                     }
                    //                 }
                    //                 else
                    //                 {
                    //                     rets.push(sanShun);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
            }




        } else if (type == PDK_CARDTPYE.sangeA) {
            if (laizi == 0) {
                var find = this.findNSameCard(hands, PDK_APOINT, 3);
                if (find) rets.push(find);
            }
        } else if (type == PDK_CARDTPYE.sangeK) {
            if (laizi == 0) {
                var find = this.findNSameCard(hands, PDK_KPOINT, 3);
                if (find) rets.push(find);
            }
        }
        else if (type == PDK_CARDTPYE.sizha || type == PDK_CARDTPYE.duizi || type == PDK_CARDTPYE.sanzhang || type == PDK_CARDTPYE.sanzha || type == PDK_CARDTPYE.sizhang) {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                var find = this.findNSameCard(hands, i, cardCount - laizi);
                if (find) {
                    rets.push(laizis.concat(find));
                }
            }
        }
        else if (type == PDK_CARDTPYE.liandui) {
            for (var i = PDK_MINPOINT; i <= PDK_APOINT - cardCount / 2 + 1; i++) // 连对首张
            {
                var ldCount = 0;
                var ret = laizis.slice();
                for (var j = 0; j < cardCount / 2; j++) {
                    var p = i + j;
                    for (var k = 0; k < hands.length - 1; k++) {
                        var point1 = this.calPoint(hands[k]);
                        var point2 = this.calPoint(hands[k + 1]);
                        if (point1 != p || point2 != p)
                            continue;

                        ldCount += 2;
                        ret.push(hands[k]);
                        ret.push(hands[k + 1]);
                        break;
                    }
                }
                if (ldCount + laizi == cardCount) {
                    rets.push(ret);
                }
            }
        }
        else if (type == PDK_CARDTPYE.sandaier) {
            for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) {
                for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                    var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                    if (!temp1)
                        continue;

                    if (1 - (laizi - aLaizi) <= 0) {
                        rets.push(laizis.concat(temp1));
                        continue;
                    }

                    var newHands = this.delPoint(hands, [i]);

                    if (this.useNewTip) {
                        var findCards = this.findDaiPai(newHands, type, 2, true, buChaiTypes);
                        for (var j in findCards) {
                            var ret = laizis.concat(temp1);
                            ret = ret.concat(findCards[j]);
                            if (!this.indexOfCards(rets, ret))
                                rets.push(ret);
                        }
                    }
                    else {
                        for (var j = 1; j < newHands.length; j++) {
                            var point1 = this.calPoint(newHands[j]);
                            var point2 = this.calPoint(newHands[j - 1]);
                            if (point1 == point2) {
                                var ret = laizis.concat(temp1);
                                ret.push(newHands[j - 1]);
                                ret.push(newHands[j]);
                                if (!this.indexOfCards(rets, ret))
                                    rets.push(ret);
                            }
                        }
                    }
                }
            }
        }
        else if (type == PDK_CARDTPYE.sandaiyi) {
            for (var aLaizi = 0; aLaizi <= laizi; aLaizi++) {
                for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                    var temp1 = this.findNSameCard(hands, i, 3 - aLaizi);
                    if (!temp1)
                        continue;

                    if (1 - (laizi - aLaizi) <= 0) {
                        rets.push(laizis.concat(temp1));
                        continue;
                    }

                    var newHands = this.delPoint(hands, [i]);
                    if (this.useNewTip) {
                        var findCards = this.findDaiPai(newHands, type, 1, false, buChaiTypes);
                        for (var j in findCards) {
                            var ret = laizis.concat(temp1);
                            ret = ret.concat(findCards[j]);
                            rets.push(ret);
                        }
                    }
                    else {
                        for (var j = 0; j < newHands.length; j++) {
                            var ret = laizis.concat(temp1);
                            ret.push(newHands[j]);
                            rets.push(ret);
                        }
                    }
                }
            }
        }
        else if (type == PDK_CARDTPYE.shunzi) {
            var shunzis = this.findShunZi(hands, cardCount, false)
            for (var i in shunzis) {
                if (!this.indexOfCards(rets, shunzis[i])) rets.push(shunzis[i]);
            }
        }
        else if (type == PDK_CARDTPYE.sztonghua && hands.length >= cardCount) {
            var shunziNum = cardNum && cardNum > 5 ? cardNum : cardCount;
            var shunzis = this.findShunZi(hands, shunziNum, true)
            for (var i in shunzis) {
                if (!this.indexOfCards(rets, shunzis[i])) rets.push(shunzis[i]);
            }
        }
        else if (type == PDK_CARDTPYE.szdaipai && hands.length >= cardCount) {
            var szdaipaiNum = cardNum && cardNum > 5 ? cardNum : cardCount; // 顺子带牌的总数量
            var sznum = 5 + (szdaipaiNum - 8) / 2;  // 同花顺牌数
            var daipainum = szdaipaiNum - sznum;    // 带的牌数
            var shunzis = this.findShunZi(hands, sznum, true)
            if (shunzis) {
                for (var i in shunzis) {
                    var sz = shunzis[i];
                    var newHands = this.delPoint(hands, null, sz);
                    for (var j = 0; j < newHands.length - daipainum + 1; j++) {
                        sz = shunzis[i].slice();
                        sz = sz.concat(newHands.slice(j, j + daipainum));
                        if (!this.indexOfCards(rets, sz)) rets.push(sz);
                    }
                }
            }
        }
        else if (type == PDK_CARDTPYE.danpai) {
            if (laizis.length == 1) {
                rets.push(laizis.slice());
            }
            else {
                var handsCopy = hands.slice();
                handsCopy.sort(this.cardValueCmp.bind(this));

                for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                    //cc.log("hands " + hands + " i = " + i);
                    // 效率太低，废弃
                    // var find = this.findNSameCard(hands, i, 1);
                    // if (find)
                    //     rets.push(find);

                    for (var j = 0; j < handsCopy.length; j++) {
                        if (this.calPoint(handsCopy[j]) == i) {
                            rets.push([handsCopy[j]]);
                            break;
                        }
                    }
                }
            }
        }
        else if (type == PDK_CARDTPYE.sidaier) {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                var find = this.findNSameCard(hands, i, 4);
                if (!find)
                    continue;

                var newHands = this.delPoint(hands, [i]);
                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 2, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(find);
                        ret = ret.concat(findCards[j]);
                        rets.push(ret);
                    }
                } else {
                    for (var j = 1; j < newHands.length; j++) {
                        var ret = laizis.concat(find);
                        ret.push(newHands[j - 1]);
                        ret.push(newHands[j]);
                        rets.push(ret);
                    }
                }
            }
        }
        else if (type == PDK_CARDTPYE.sidaisan) {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                var find = this.findNSameCard(hands, i, 4);
                if (!find)
                    continue;

                var newHands = this.delPoint(hands, [i]);
                if (this.useNewTip) {
                    var findCards = this.findDaiPai(newHands, type, 3, false, buChaiTypes);
                    for (var j in findCards) {
                        var ret = laizis.concat(find);
                        ret = ret.concat(findCards[j]);
                        rets.push(ret);
                    }
                } else {
                    for (var j = 2; j < newHands.length; j++) {
                        var ret = laizis.concat(find);
                        ret.push(newHands[j - 1]);
                        ret.push(newHands[j - 2]);
                        ret.push(newHands[j]);
                        rets.push(ret);
                    }
                }
            }
        }
        return rets;
    };
    // var fc = GameLogic_RunFaster.prototype.findCardByType([19,19,19,15,15], 0, PDK_CARDTPYE.sandaier, [9,9,9,15,15])
    // console.log( fc )

    GameLogic_RunFaster.prototype.getAllMaxCard = function (oCards) {
        var sortHands = oCards.slice();
        sortHands.sort(this.cardValueCmp.bind(this));
        var maxCard = sortHands[sortHands.length - 1];

        var rets = []
        for (var i in sortHands) {
            var ret = []
            if (this.calPoint(maxCard) == this.calPoint(sortHands[i])) {
                ret.push(sortHands[i]);
                rets.push(ret);
            }
        }

        return rets;
    }

    // 对牌型进行排序  目前指准对 炸弹接 3带2 的牌型
    GameLogic_RunFaster.prototype.sortByCardType = function (cardsList, areaSelectMode) {
        var cards = cardsList.slice();

        var sfun = function (a, b) {
            var aType = this.calType(a, areaSelectMode);
            var bType = this.calType(b, areaSelectMode);
            var aValue = this.calCardsValue(a, aType, areaSelectMode);
            var bValue = this.calCardsValue(b, bType, areaSelectMode);

            if (aType == bType) {
                return aValue - bValue;
            }

            if (aType != bType) {
                // 3带儿优先
                if (aValue != bValue) {
                    return bType - aType;
                }

                // 炸弹优先
                if (aValue == bValue) {
                    if (aType == PDK_CARDTPYE.sizha) return -1;
                    if (aType != PDK_CARDTPYE.sizha) return 1;
                }
            }
        }

        cards.sort(sfun.bind(this))
        return cards;
    }

    GameLogic_RunFaster.prototype.findDaiPai = function (oCards, type, findNum, same, buChaiTypes) {
        var ret = [];
        var daiPaiOrder = pdk_daiPaiOrder[type];
        if (!daiPaiOrder || findNum <= 0)
            return ret;

        daiPaiOrder = daiPaiOrder.slice();
        if (same) {
            for (var i = daiPaiOrder.length - 1; i >= 0; i--) {
                if (daiPaiOrder[i][0] == PDK_CARDTPYE.danpai)
                    daiPaiOrder.splice(i, 1);
            }
        }

        var isHaveCards = function (rets, cards) {
            for (var i = 0; i < rets.length; i++) {
                var j = 0;
                for (; j < cards.length; j++) {
                    if (rets[i].indexOf(cards[j]) < 0)
                        break;
                }
                if (j == cards.length)
                    return true;
            }
            return false;
        }

        // for (var index = 0; index < daiPaiOrder.length; index ++) {
        //     var cards = this.findPutTipCards(oCards, [], {}, false, false, [daiPaiOrder[index]], buChaiTypes);

        //     var temp = [];
        //     for (var i = 0; i < cards.length; i++) {
        //         // 6.   选择二张，散牌等于1，有对子比散牌小且非组成顺子的必要条件，提示该对子，不拆三张、顺子/炸弹
        //         // 7.   选择二张，散牌等于1，有对子比散牌大且非组成顺子的必要条件，提示散牌加对子中的一张，不拆三张、顺子/炸弹       *67的意思是留下一张大的单牌
        //         if (cards[i].length == findNum && !(ret.length == 0 && temp.length != 0 && this.calPoint(cards[i][0]) > this.calPoint(temp[temp.length - 1]))) {
        //             if (!isHaveCards(ret, cards[i]))
        //                 ret.push(cards[i]);
        //         } else {
        //             temp = temp.concat(cards[i]);
        //             var subTemp = [];
        //             while (temp.length >= findNum) {
        //                 subTemp = temp.slice(0, findNum);
        //                 if (!isHaveCards(ret, subTemp))
        //                     ret.push(subTemp);
        //                 temp.shift();
        //                 break;
        //             }
        //         }
        //     }

        //     if (temp.length > 0 && !isHaveCards(ret, temp)) {
        //         var allCards = cards.slice();
        //         allCards.push(oCards);
        //         for (var i = 0; i < allCards.length; i++) {
        //             for (var j = 0; j < allCards[i].length; j++) {
        //                 if (temp.indexOf(allCards[i][j]) >= 0)
        //                     continue;

        //                 temp.push(allCards[i][j]);
        //                 if (temp.length >= findNum) {
        //                     ret.push(temp.slice(0, findNum));
        //                     temp.length = 0;
        //                     break;
        //                 }
        //             }
        //             if (temp.length == 0)
        //                 break;
        //         }
        //     }
        // }

        var cards = this.findPutTipCards(oCards, [], {}, false, false, daiPaiOrder, buChaiTypes);

        var temp = [];
        for (var i = 0; i < cards.length; i++) {
            // 6.   选择二张，散牌等于1，有对子比散牌小且非组成顺子的必要条件，提示该对子，不拆三张、顺子/炸弹
            // 7.   选择二张，散牌等于1，有对子比散牌大且非组成顺子的必要条件，提示散牌加对子中的一张，不拆三张、顺子/炸弹       *67的意思是留下一张大的单牌
            if (cards[i].length == findNum && !(ret.length == 0 && temp.length != 0 && this.calPoint(cards[i][0]) > this.calPoint(temp[temp.length - 1]))) {
                if (!isHaveCards(ret, cards[i]))
                    ret.push(cards[i]);
            } else {
                temp = temp.concat(cards[i]);
                var subTemp = [];
                while (temp.length >= findNum) {
                    subTemp = temp.slice(0, findNum);
                    if (!isHaveCards(ret, subTemp))
                        ret.push(subTemp);
                    temp.shift();
                    break;
                }
            }
        }

        if (temp.length > 0 && !isHaveCards(ret, temp)) {
            var allCards = cards.slice();
            allCards.push(oCards);
            for (var i = 0; i < allCards.length; i++) {
                for (var j = 0; j < allCards[i].length; j++) {
                    if (temp.indexOf(allCards[i][j]) >= 0)
                        continue;

                    temp.push(allCards[i][j]);
                    if (temp.length >= findNum) {
                        ret.push(temp.slice(0, findNum));
                        temp.length = 0;
                        break;
                    }
                }
                if (temp.length == 0)
                    break;
            }
        }

        return ret;
    }

    // 此函数只供提示出牌调用
    GameLogic_RunFaster.prototype.findCardByType_fast = function (hands, laizi, type, lastCards, buChaiTypes) {
        if (!this.findCardByTypeCache)
            this.findCardByTypeCache = [];

        var argumentsStr = JSON.stringify(arguments);
        for (var i = 0; i < this.findCardByTypeCache.length; i++) {
            if (this.findCardByTypeCache[i].argumentsStr == argumentsStr)
                return JSON.parse(this.findCardByTypeCache[i].retValueStr);
        }

        var retValue = this.findCardByType(hands, laizi, type, lastCards, buChaiTypes);
        this.findCardByTypeCache.push({ argumentsStr: argumentsStr, retValueStr: JSON.stringify(retValue) });
        return retValue;
    }

    GameLogic_RunFaster.prototype.initCanPutTypes = function (hands, includeCard, areaSelectMode) {
        if (!this.canPutTypesCache)
            this.canPutTypesCache = [];

        var argumentsStr = JSON.stringify(arguments);
        for (var i = 0; i < this.canPutTypesCache.length; i++) {
            if (this.canPutTypesCache[i].argumentsStr == argumentsStr)
                return JSON.parse(this.canPutTypesCache[i].retValueStr);
        }

        var info = this.formatCards(hands);
        info.mValueToCards = info.mValueToNum;
        var tempHands = hands.slice();
        if (includeCard > 0)
            tempHands.splice(tempHands.indexOf(includeCard), 1);

        var getNumFunc = function (hands, value, type, thxCards, sameNum, haveNum) {
            if (haveNum < sameNum)
                return 0;

            var cards = this.findCardByType_fast(hands, 0, type);
            var num = 0;
            for (var i = 0; i < cards.length; i++) {
                for (var j = 0; j < cards[i].length; j++) {
                    if (this.calPoint(cards[i][j]) != value)
                        continue;

                    var newHands = hands.slice();
                    for (var k = 0; k < cards[i].length; k++) {
                        newHands.splice(newHands.indexOf(cards[i][k]), 1);
                    }
                    var ret = getNumFunc(newHands, value, type, thxCards, sameNum, haveNum - sameNum);
                    if (num < ret + sameNum)
                        num = ret + sameNum;
                    break;
                }
            }

            if (PDK_CARDTPYE.sztonghua && PDK_CARDTPYE.sztonghua == type) {
                for (var i = 0; i < cards.length; i++) {
                    for (var j = 0; j < cards[i].length; j++) {
                        if (thxCards.indexOf(cards[i][j]) < 0)
                            thxCards.push(cards[i][j]);
                    }
                }
            }

            return num;
        }.bind(this);

        var valueToCanTypes = {};
        var thxCards = [];
        for (var value in info.mValueToCards) {
            value = Number(value);
            valueToCanTypes[value] = [];
        }

        for (var index = 0; index < pdk_allBuChaiType.length; index++) {
            var type = pdk_allBuChaiType[index];
            if (!type)
                continue;

            var cards = this.findCardByType_fast(tempHands, 0, type);
            if (cards.length <= 0 || this.calType(cards[0], areaSelectMode) != type)
                continue;

            var allValues = [];
            for (var i = 0; i < cards.length; i++) {
                for (var j = 0; j < cards[i].length; j++) {
                    var value = this.calPoint(cards[i][j])
                    allValues[value] = 1;
                }
            }

            var sameNum = 1;
            var point = this.calPoint(cards[0][0]);
            for (var i = 1; i < cards[0].length; i++) {
                if (this.calPoint(cards[0][i]) == point)
                    sameNum++;
            }

            for (var value in allValues) {
                if (info.mValueToCards[value] >= sameNum * 2)
                    valueToCanTypes[value][type] = getNumFunc(tempHands, value, type, thxCards, sameNum, info.mValueToCards[value]);
                else
                    valueToCanTypes[value][type] = sameNum;
            }
        }

        info.mValueToCanTypes = valueToCanTypes;
        info.thxCards = thxCards;

        this.canPutTypesCache.push({ argumentsStr: argumentsStr, retValueStr: JSON.stringify(info) });

        return info;
    }
    /**
     * 提示可出的牌
     * @param  {array} oHands 我的手牌
     * @param  {array} oLastCards 上家出的牌
     * @param  {array} areaSelectMode 创建房间的选项
     * @param  {Boolean} isNextPlayerOneCard 下家是否报单
     * @param  {Boolean} isFirstRound 是否第一局
     * @param  {array} [putOrder] 提示优先级规则
     * @return {array} 提示的牌
     */
    GameLogic_RunFaster.prototype.findPutTipCards = function (hands, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound, putOrder, allBuChaiTypes) {

        var getTypesName = function (types) {
            var ret = "null";
            for (var i = 0; i < types.length; i++) {
                for (var key in PDK_CARDTPYE) {
                    if (PDK_CARDTPYE[key] == types[i])
                        ret = ret == "null" ? key : ret + "|" + key;
                }
            }
            return ret;
        }

        cc.log("hands=" + JSON.stringify(hands) + " lastCards=" + JSON.stringify(lastCards));

        var startTime = new Date().getTime();
        hands = hands.slice();
        hands.sort(this.cardValueCmp.bind(this));

        var rets = [];
        var lastType = 0;
        if (!lastCards || lastCards == -1)
            lastCards = [];

        //  红桃/黑桃3先手提示
        var includeCard = -1;
        if (this.isMustPutCard3(hands, areaSelectMode, isFirstRound)) {
            lastType = 99;
            includeCard = this.cardCfg.firstOutCard;
        } else if (lastCards.length > 0) {
            lastType = this.calType(lastCards, areaSelectMode);
            cc.log('---------------lastType----------------1', lastType)
        }
        if (!putOrder)
            putOrder = pdk_putOrder[lastType];
        if (!putOrder)
            return rets;

        putOrder = putOrder.slice();

        var info = this.initCanPutTypes(hands, includeCard, areaSelectMode);

        // info.mValueToCards = info.mValueToNum = key:牌值  value:[具体的牌...]
        // info.mNumToValue = key:数量  value:[牌值...]
        // info.mValueToCanTypes = key:牌值 value:[牌型1: 占用数量], ...]
        // info.thxCards = [所有同花顺具体的牌...]

        // cc.log("每一牌值可组成的牌型：" + function() {
        //     var ret = "";
        //     for (var value in info.mValueToCanTypes) {
        //         var canTypes = info.mValueToCanTypes[value];
        //         ret += value + ":[";
        //         for (var type in canTypes) {
        //             ret += getTypesName([type]) + ":" + canTypes[type] + ",";
        //         }
        //         ret += "], ";
        //     }
        //     return ret;
        // }());

        var getBuChaiTypes = function (buChaiTypes, allBuChaiTypes) {
            buChaiTypes = buChaiTypes.slice();
            // 不拆牌型中可能还包函数组（为了好配置）
            for (var j = 0; j < buChaiTypes.length; j++) {
                if (buChaiTypes[j] && typeof (buChaiTypes[j]) !== "number") {
                    buChaiTypes = buChaiTypes.concat(buChaiTypes[j]);
                    buChaiTypes.splice(j, 1);
                    j--;
                }
            }
            if (allBuChaiTypes) {
                for (var j = 0; j < allBuChaiTypes.length; j++) {
                    if (buChaiTypes.indexOf(allBuChaiTypes[j]) < 0)
                        buChaiTypes.push(allBuChaiTypes[j]);
                }
            }
            return buChaiTypes;
        }

        // 排除不满足不拆牌型后剩下的牌值-数量对
        var getCanPutValueNums = function (type, buChaiTypes) {
            var canPutValueNums = [];
            for (var value in info.mValueToCards) {
                value = Number(value);
                var canUseNum = info.mValueToCards[value].length; // 不拆牌后的数量
                var canTypes = info.mValueToCanTypes[value].slice();

                if (canTypes[type]) {
                    canTypes[type] = 0;
                }
                if (pdk_cardTypeSub[type]) {
                    for (var i = 0; i < pdk_cardTypeSub[type].length; i++) {
                        if (canTypes[pdk_cardTypeSub[type][i]])
                            canTypes[pdk_cardTypeSub[type][i]] = 0;
                    }
                }

                for (var i in canTypes) {
                    i = Number(i);
                    if (!canTypes[i] || buChaiTypes.indexOf(i) < 0)
                        continue;

                    canUseNum -= canTypes[i];
                }

                if (canUseNum > 0) {
                    canPutValueNums[value] = canUseNum;
                }
            }
            return canPutValueNums;
        }

        var isHaveCards = function (rets, cards) {
            var cardsStr = cards.slice().sort().toString();
            for (var i = 0; i < rets.length; i++) {
                if (rets[i].slice().sort().toString() == cardsStr)
                    return true;
            }
            return false;
        }

        var replaceThxCard = function (info, cards) {
            var thxCards = info.thxCards;
            for (var i = 0; i < cards.length; i++) {
                for (var j = 0; j < cards[i].length; j++) {
                    if (thxCards.indexOf(cards[i][j]) < 0)
                        continue;

                    var v = this.calPoint(cards[i][j]);
                    if (!info.mValueToCards[v])
                        continue;

                    for (var k = 0; k < info.mValueToCards[v].length; k++) {
                        if (thxCards.indexOf(info.mValueToCards[v][k]) >= 0 || cards[i].indexOf(info.mValueToCards[v][k]) >= 0)
                            continue;

                        cards[i][j] = info.mValueToCards[v][k];
                        break;
                    }
                }
            }
            return cards;
        }.bind(this);

        var replaceIncludeCard = function (includeCard, cards) {
            for (var i = cards.length - 1; i >= 0; i--) {
                if (cards[i].indexOf(includeCard) >= 0)
                    continue;

                var includeValue = this.calPoint(includeCard);
                for (var j = cards[i].length - 1; j >= 0; j--) {
                    if (this.calPoint(cards[i][j]) == includeValue) {
                        cards[i][j] = includeCard;
                        break;
                    }
                }

                if (cards[i].indexOf(includeCard) >= 0)
                    continue;

                cards.splice(i, 1);
            }
            return cards;
        }.bind(this);

        var isTypeValid = function (type, putOrder) {
            if (!type || !putOrder)
                return true;

            for (var order = 0; order < putOrder.length; order++) {
                var typeArray = typeof (putOrder[order][0]) === "number" ? [putOrder[order][0]] : putOrder[order][0];
                for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
                    if (type == typeArray[typeIndex])
                        return true;
                }
            }

            return false;
        }

        var originalPutOrder = pdk_putOrder[lastType];
        if (lastType != 99 && lastType != 0 && !originalPutOrder) {
            originalPutOrder = [
                [lastType, []],
                [pdk_allZhaDan, []],
            ];
        }
        for (var order = 0; order < putOrder.length; order++) {
            var typeArray = typeof (putOrder[order][0]) === "number" ? [putOrder[order][0]] : putOrder[order][0];
            for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
                if (!typeArray[typeIndex])
                    continue;

                var type = typeArray[typeIndex];

                // 检查type有效性，避免无效且费力的查找
                if (lastType != 99 && lastType != 0 && !isTypeValid(type, originalPutOrder))
                    continue;

                if (allBuChaiTypes && allBuChaiTypes.indexOf(type) >= 0)
                    continue;

                var buChaiTypes = getBuChaiTypes(putOrder[order][1], allBuChaiTypes);
                var canPutValueNums = getCanPutValueNums(type, buChaiTypes); // 排除不满足不拆牌型后剩下的牌值-数量对

                //cc.log("第" + order + "优先级出:" + getTypesName([type]) + " canPutValueNums=" + JSON.stringify(canPutValueNums) + " buChaiTypes=" + getTypesName(buChaiTypes));

                var cards;
                if (pdk_allZhaDan.indexOf(type) >= 0 && lastType != type)
                    cards = this.findCardByType_fast(hands, 0, type);
                else
                    cards = this.findCardByType_fast(hands, 0, type, lastCards, buChaiTypes);

                // 下家报单强制出最大
                if (isNextPlayerOneCard && type == PDK_CARDTPYE.danpai) {
                    cards = this.getAllMaxCard(hands);
                }

                // 顺子、连对、同花顺尝试更多数量的牌
                if (lastCards.length <= 0 && cards.length > 0 && (type == PDK_CARDTPYE.shunzi || type == PDK_CARDTPYE.liandui || (PDK_CARDTPYE.sztonghua && type == PDK_CARDTPYE.sztonghua))) {
                    var addNum = type == PDK_CARDTPYE.shunzi || type == PDK_CARDTPYE.sztonghua ? 1 : 2;
                    for (var i = cards[0].length + addNum; true; i += addNum) {
                        var tempCards = this.findCardByType_fast(hands, 0, type, new Array(i));
                        if (tempCards.length > 0 && tempCards[0].length == i)
                            cards = tempCards.concat(cards);
                        else
                            break;
                    }
                }

                // 如果不必要，尽量不出同花顺的牌
                if (PDK_CARDTPYE.sztonghua && PDK_CARDTPYE.sztonghua != type && info.thxCards.length > 0) {
                    cards = replaceThxCard(info, cards);
                }

                // 必须包函指定牌
                if (includeCard > 0) {
                    cards = replaceIncludeCard(includeCard, cards);
                }

                for (var i = 0; i < cards.length; i++) {
                    var exist = true;
                    var nums = canPutValueNums.slice();
                    for (var j = 0; j < cards[i].length; j++) {
                        var value = this.calPoint(cards[i][j]);
                        if (!nums[value]) {
                            exist = false;
                            break;
                        }
                        nums[value]--;
                    }

                    // 如果只有一个单牌2，则放到后面提示。
                    if (putOrder[order][2] && putOrder[order][2].buchuOnly2 &&
                        cards[i].length == 1 && this.calPoint(cards[i][0]) == PDK_MAXPOINT)
                        continue;

                    if (!exist || isHaveCards(rets, cards[i]))
                        continue;

                    if (this.canPut(cards[i], lastCards, hands.length, areaSelectMode))
                        rets.push(cards[i]);
                }
            }
        }

        if (!allBuChaiTypes) {
            //cc.log("智能提示用时：" + (new Date().getTime() - startTime) + "ms");
            //cc.log("rets=" + JSON.stringify(rets));
        }

        if (!allBuChaiTypes)
            this.findCardByTypeCache = [];

        return rets;
    }

    /**
     * 是否首手必须先出红桃/黑桃3
     * @param  {array} oHands 我的手牌
     * @param  {object} areaSelectMode 创建房间的选项
     * @param  {Boolean} isFirstRound 是否第一局
     * @return {Boolean} 
     */
    GameLogic_RunFaster.prototype.isMustPutCard3 = function (oHands, areaSelectMode, isFirstRound) {
        let bankerRule = areaSelectMode && areaSelectMode.mustPutHongTaoSan;
        needFindSpade3 = false;
        // if (bankerRule === this.GameBankerRule.FirstRoundMustPlaySpade3 && isFirstRound) {
        //     needFindSpade3 = true;
        // }
        return needFindSpade3 && oHands.indexOf(this.cardCfg.firstOutCard) >= 0;
    }

    /**
     * 提示可出的牌
     * @param  {array} oHands 我的手牌
     * @param  {array} oLastCards 上家出的牌
     * @param  {Boolean} areaSelectMode 创建房间的选项
     * @param  {Boolean} isNextPlayerOneCard 下家是否报单
     * @param  {Boolean} isFirstRound 是否第一局
     * @param  {Boolean} isSmartTip   是否使用智能提示
     * @return {array} 提示的牌
     */
    GameLogic_RunFaster.prototype.tipCards = function (oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound, isSmartTip) {
        if (isSmartTip) {
            this.canPutTypesCache = [];

            this.useNewTip = true;
            var ret = this.findPutTipCards(oHands, oLastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound);
            this.useNewTip = false;
            if (ret.length > 0) return ret;
        }

        //  第一个局 当勾“先出黑桃三”选项时，提示出黑桃三
        if (this.isMustPutCard3(oHands, areaSelectMode, isFirstRound)) {
            return [[this.cardCfg.hx[3]]]
        }

        // 第一个出牌时
        var isFirstPlayerPut = (!oLastCards || oLastCards == -1 || oLastCards.length == 0);
        if (isFirstPlayerPut) {
            var sortHands = oHands.slice();
            sortHands.sort(this.cardValueCmp.bind(this));
            return [[sortHands[sortHands.length - 1]]];
        }

        var hands = [];
        var handLaizi = this.transformAndGetLaizi(oHands, hands);
        var lastCardsType = this.calType(oLastCards, areaSelectMode);
        var rets = [];

        for (var laizi = 0; laizi <= handLaizi; laizi++) {
            if (lastCardsType == PDK_CARDTPYE.sizha) break;
            if (lastCardsType == PDK_CARDTPYE.sangeA) break;
            if (lastCardsType == PDK_CARDTPYE.sangeK) break;

            var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards);
            for (var i = 0; i < sameTypeCards.length; i++) {

                // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
                if (areaSelectMode && areaSelectMode.zhaDanBuChai && this.isChaiZhaDan(oHands, sameTypeCards[i], areaSelectMode)) {
                    continue;
                }

                if (this.canPut(sameTypeCards[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(sameTypeCards[i]);
                }
            }
        }

        //  下家报单强制出最大
        if (isNextPlayerOneCard) {
            // 如果上家出牌且是一张，  才使用报单提示
            if (rets.length > 0 && oLastCards && oLastCards.length <= 1) {
                rets = this.getAllMaxCard(oHands);
                // 如果上家没有出牌， 使用报单提示
            } else if (rets.length > 0 && !oLastCards || oLastCards == -1) {
                rets = this.getAllMaxCard(oHands);
            }
        }

        if (areaSelectMode.can4geZha) {
            var booms = this.findCardByType(hands, 0, PDK_CARDTPYE.sizha);
            // 不是压三带二的时候， 最后提示炸弹
            for (var i = 0; i < booms.length; i++) {
                if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(booms[i]);
                }
            }
        }

        if (areaSelectMode.can3geZha) {
            var booms = this.findCardByType(hands, 0, PDK_CARDTPYE.sanzha);
            // 不是压三带二的时候， 最后提示炸弹
            for (var i = 0; i < booms.length; i++) {
                if (this.canPut(booms[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(booms[i]);
                }
            }
        }

        // 压三带二的时候， 先提示炸弹 , 对提示的牌型进行排序
        if (lastCardsType == PDK_CARDTPYE.sandaier) {
            rets = this.sortByCardType(rets, areaSelectMode);
        }

        //3个A
        if (areaSelectMode.can3aZhaDan) {
            var cardtypes = this.findCardByType(hands, 0, PDK_CARDTPYE.sangeA);
            for (var i = 0; i < cardtypes.length; i++) {
                if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(cardtypes[i]);
                }
            }
        }
        //3个K
        if (areaSelectMode.can3kZhaDan) {
            var cardtypes = this.findCardByType(hands, 0, PDK_CARDTPYE.sangeK);
            for (var i = 0; i < cardtypes.length; i++) {
                if (this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(cardtypes[i]);
                }
            }
        }

        if (areaSelectMode.tongHuaShun) {
            var cardtypes = this.findCardByType(hands, 0, PDK_CARDTPYE.sztonghua);
            for (var i = 0; i < cardtypes.length; i++) {
                if (!this.indexOfCards(rets, cardtypes[i]) && this.canPut(cardtypes[i], oLastCards, oHands.length, areaSelectMode)) {
                    rets.push(cardtypes[i]);
                }
            }
        }

        return rets;
    };

    /**
     * 提示可出的牌，是否相同牌型，相同牌值
     * @param  {array} tipscardsArray 我的手牌
     */
    GameLogic_RunFaster.prototype.IsSametipCards = function (tipscardsArray, areaSelectMode) {
        if (tipscardsArray.length <= 0) return false;
        var cardType = this.calType(tipscardsArray[0], areaSelectMode);
        var cardNum = tipscardsArray[0].length;
        var cardpoint = this.calCardsValue(tipscardsArray[0], cardType, areaSelectMode)
        for (var i = 0; i < tipscardsArray.length; i++) {
            var tmp_cardType = this.calType(tipscardsArray[i], areaSelectMode);
            var tmp_cardNum = tipscardsArray[i].length;
            var tmp_cardpoint = this.calCardsValue(tipscardsArray[i], cardType, areaSelectMode)
            if (tmp_cardType != cardType || tmp_cardNum != cardNum || tmp_cardpoint != cardpoint)
                return false;
        }
        return true;
    };

    /**
     * 如果是有效牌型，剔除带牌
     * @param  {array} Cards 牌组
     * @param  {Boolean} areaSelectMode 创建房间的选项
     */
    GameLogic_RunFaster.prototype.delDaipai = function (Cards, areaSelectMode) {
        var cardtype = this.calType(Cards, areaSelectMode);

        if (cardtype == PDK_CARDTPYE.sanshun ||
            cardtype == PDK_CARDTPYE.sangeA ||
            cardtype == PDK_CARDTPYE.sangeK ||
            cardtype == PDK_CARDTPYE.sizha ||
            cardtype == PDK_CARDTPYE.liandui ||
            cardtype == PDK_CARDTPYE.shunzi ||
            cardtype == PDK_CARDTPYE.sanzhang ||
            cardtype == PDK_CARDTPYE.duizi ||
            cardtype == PDK_CARDTPYE.danpai ||
            cardtype == PDK_CARDTPYE.sztonghua)
            return Cards;

        var point = this.calCardsValue(Cards, cardtype, areaSelectMode)
        if (cardtype == PDK_CARDTPYE.sandaier ||
            cardtype == PDK_CARDTPYE.sandaiyi)
            Cards = this.findNSameCard(Cards, point, 3);
        else if (cardtype == PDK_CARDTPYE.sidaisan ||
            cardtype == PDK_CARDTPYE.sidaier)
            Cards = this.findNSameCard(Cards, point, 4);
        else if (cardtype == PDK_CARDTPYE.feiji) {
            var feiji = this.formatFeiJiType(Cards, areaSelectMode);
            Cards = feiji.sanZhangCards;
        }

        return Cards;
    }


    if (typeof (module) != "undefined" && module.exports)
        module.exports = GameLogic_RunFaster;

    if (typeof (MjClient) != "undefined")
        MjClient.majiang_runfasterya = new GameLogic_RunFaster();

})();

