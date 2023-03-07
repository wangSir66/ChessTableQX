//打码子算法类
(function() {
    function PokerDaMaZi() {
        this.handCount = 27;
        this.laiziCard = -1;
    
        this.cardCfg = {};
        this.cardCfg.fk = {};
        this.cardCfg.mh = {};
        this.cardCfg.hx = {};
        this.cardCfg.ht = {};
        this.cardCfg.jokerRed = 54;
        this.cardCfg.jokerBlack = 53;
        for(var i=1; i<=52; i++ ){
            // 0:方块  1:梅花  2:梅花  3:黑桃
            var cardType = (i + 3) % 4;
            // 牌值 1 - 13
            var cardValue = Math.ceil(i / 4);
            if(0 == cardType) this.cardCfg.fk[cardValue] = i;
            if(1 == cardType) this.cardCfg.mh[cardValue] = i;
            if(2 == cardType) this.cardCfg.hx[cardValue] = i;
            if(3 == cardType) this.cardCfg.ht[cardValue] = i;
        }
    }
    
    if(typeof(cc)=='undefined') {
        var cc = function(){}
        cc.log = function(){
            var str = '';
            for (var i=0; i<arguments.length; i++){
                str  = str + arguments[i] + ' ';
            }
        }
    }
    
    var PDK_MINPOINT = 1;
    var PDK_KPOINT = 13;
    var PDK_APOINT = 14;
    var PDK_2POINT = 15;// 
    var PDK_MAXPOINT = PDK_2POINT; 
    // 牌型排序优先级 和 id
    var PDK_CARDTPYE = {
        zhadan8:21,
        zhadan7:20,
        zhadan6:19,          
        zhadan:18,
        wangzha:17,
        sanwang:16,
        b_2wang:15,
        s_2wang:14,
        f_510k:13,
        z_510k:12,
        sishun:11,
        sanshun: 10,
        liandui: 5,
        sizhang:4,
        sanzhang: 3, 
        duizi: 2,
        danpai: 1,
    };
    PokerDaMaZi.prototype.CARDTPYE = PDK_CARDTPYE;
    var PDK_CARDCOUNT = {};
    

    PDK_CARDCOUNT[PDK_CARDTPYE.zhadan8] = 8;
    PDK_CARDCOUNT[PDK_CARDTPYE.zhadan7] = 7;
    PDK_CARDCOUNT[PDK_CARDTPYE.zhadan6] = 6;    
    PDK_CARDCOUNT[PDK_CARDTPYE.zhadan] = 5;
    PDK_CARDCOUNT[PDK_CARDTPYE.wangzha] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.sanwang] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.b_2wang] = 2;
    PDK_CARDCOUNT[PDK_CARDTPYE.s_2wang] = 2;
    PDK_CARDCOUNT[PDK_CARDTPYE.z_510k] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.f_510k] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.sishun] = 8;   
    PDK_CARDCOUNT[PDK_CARDTPYE.sanshun] = 6;
    PDK_CARDCOUNT[PDK_CARDTPYE.liandui] = 4;
    PDK_CARDCOUNT[PDK_CARDTPYE.sizhang] = 4;    
    PDK_CARDCOUNT[PDK_CARDTPYE.sanzhang] = 3;
    PDK_CARDCOUNT[PDK_CARDTPYE.duizi] = 2;
    PDK_CARDCOUNT[PDK_CARDTPYE.danpai] = 1;
    
    var PDK_CARD_VALUE = {};
PDK_CARD_VALUE[PDK_CARDTPYE.zhadan8] = 10;
PDK_CARD_VALUE[PDK_CARDTPYE.zhadan7] = 9;
PDK_CARD_VALUE[PDK_CARDTPYE.wangzha] = 8;  
PDK_CARD_VALUE[PDK_CARDTPYE.zhadan6] = 7;
PDK_CARD_VALUE[PDK_CARDTPYE.sanwang] = 6; 
PDK_CARD_VALUE[PDK_CARDTPYE.zhadan] = 5;
PDK_CARD_VALUE[PDK_CARDTPYE.b_2wang] = 4;
PDK_CARD_VALUE[PDK_CARDTPYE.s_2wang] = 3;
PDK_CARD_VALUE[PDK_CARDTPYE.f_510k] = 2;
PDK_CARD_VALUE[PDK_CARDTPYE.z_510k] = 1;
    
    
    // 包函关系的牌型
    var pdk_cardTypeSub = function() {
        var ret = {};
        // ret[PDK_CARDTPYE.sizha] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.sanzhang] = [PDK_CARDTPYE.duizi];
        ret[PDK_CARDTPYE.liandui] = [PDK_CARDTPYE.duizi];
        // ret[PDK_CARDTPYE.sandaier] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        // ret[PDK_CARDTPYE.sandaiyi] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.duizi];
        // ret[PDK_CARDTPYE.feiji] = [PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.liandui, PDK_CARDTPYE.duizi];
        return ret;
    }();
    
    // 出牌提示顺序
    var pdk_putOrder = [];
    var pdk_daiPaiOrder = [];
    var pdk_allZhaDan = [
        PDK_CARDTPYE.zhadan,
    ];
    
    // 出牌提示时不拆的所有牌型
    var pdk_allBuChaiType = [
        PDK_CARDTPYE.duizi,
        PDK_CARDTPYE.sanzhang,
        // PDK_CARDTPYE.shunzi,
        PDK_CARDTPYE.liandui,
        // PDK_CARDTPYE.feiji,
        PDK_CARDTPYE.zhadan,
        // PDK_CARDTPYE.tonghuashun,
        PDK_CARDTPYE.z_510k,
        PDK_CARDTPYE.f_510k,
    ];
    
    // PokerDaMaZi.prototype.allTipsNoOrder = [
    //     [PDK_CARDTPYE.danpai, []],
    //     [PDK_CARDTPYE.duizi, []],
    //     [PDK_CARDTPYE.sandaier, []],
    //     [PDK_CARDTPYE.liandui, []],
    //     [PDK_CARDTPYE.shunzi, []],
    //     [PDK_CARDTPYE.feiji, []],
    //     [PDK_CARDTPYE.tonghuashun, []],
    //     [PDK_CARDTPYE.z_510k, []],
    //     [PDK_CARDTPYE.f_510k, []],
    //     [pdk_allZhaDan, []],
    // ];
    
    /*红桃/黑桃3先手提示
    主动提起一张先手的三，可点提示
    对3  不拆炸弹
    提起所有3 实现成 三带二 三带一 不拆炸弹
    带3的连对 不拆炸弹
    带3顺子最长的顺子 不拆炸弹
    */
    pdk_putOrder[99] = [
        // [PDK_CARDTPYE.danpai, []],
        // [PDK_CARDTPYE.duizi, [pdk_allZhaDan]],
        // [PDK_CARDTPYE.sandaier, [pdk_allZhaDan]],
        // [PDK_CARDTPYE.sandaiyi, [pdk_allZhaDan]],
        // [PDK_CARDTPYE.liandui, [pdk_allZhaDan]],
        // [PDK_CARDTPYE.shunzi, [pdk_allZhaDan]],
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
        // [PDK_CARDTPYE.danpai, pdk_allBuChaiType, {buchuOnly2:true}],
        // [PDK_CARDTPYE.duizi, pdk_allBuChaiType],
        // [PDK_CARDTPYE.shunzi, pdk_allBuChaiType],
        // [PDK_CARDTPYE.sandaier, [pdk_allBuChaiType]],
        // [PDK_CARDTPYE.sandaiyi, [pdk_allBuChaiType]],
        // [PDK_CARDTPYE.liandui, [pdk_allBuChaiType]],
    
        // [PDK_CARDTPYE.shunzi, []],
        // [PDK_CARDTPYE.sandaier, []],
        // [PDK_CARDTPYE.sandaiyi, []],
        // [PDK_CARDTPYE.liandui, []],
        // [PDK_CARDTPYE.duizi, []],
    
        // [PDK_CARDTPYE.danpai, []],
        // [pdk_allZhaDan, []],
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
    // pdk_putOrder[PDK_CARDTPYE.shunzi] = [
    //     [PDK_CARDTPYE.shunzi, pdk_allBuChaiType],
    //     [PDK_CARDTPYE.shunzi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.duizi]],
    //     [PDK_CARDTPYE.shunzi, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
    //     [PDK_CARDTPYE.shunzi, [pdk_allZhaDan]],
    //     [PDK_CARDTPYE.shunzi, []],
    //     [pdk_allZhaDan, []],
    // ];
    
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
    var pdk_get_sandaiyi_sandaier_putOrder = function(type) {
        return [
            [type, pdk_allBuChaiType],
            [type, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
            [type, [pdk_allZhaDan]],
            [pdk_allZhaDan, []],
            [type, []],
        ];
    }
    
    pdk_putOrder[PDK_CARDTPYE.sandaier] = pdk_get_sandaiyi_sandaier_putOrder(PDK_CARDTPYE.sandaier);
    
    /* 三带二 带牌顺序
    5.  选择二张，散牌大于2，提示散牌
    6.  选择二张，散牌等于1，有对子比散牌小且非组成顺子的必要条件，提示该对子，不拆三张、顺子/炸弹
    7.  选择二张，散牌等于1，有对子比散牌大且非组成顺子的必要条件，提示散牌加对子中的一张，不拆三张、顺子/炸弹       *67的意思是留下一张大的单牌
    8.  提示对子（接对子逻辑）
    9.  选择二张，拆顺子，不拆飞机/炸弹
    10. 选择二张，拆三张不拆/炸弹
    */
    // pdk_daiPaiOrder[PDK_CARDTPYE.sandaier] = [
    //     [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
    //     [PDK_CARDTPYE.duizi, [pdk_allBuChaiType]],
    //     [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
    //     [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang]],
    //     [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
    //     [PDK_CARDTPYE.duizi, [pdk_allZhaDan]],
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.feiji]],
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    // ];
    
    /*接飞机
    优先不拆炸弹的飞机
    提示炸弹
    需要拆炸弹的飞机
    */
    // pdk_putOrder[PDK_CARDTPYE.feiji] = [
    //     [PDK_CARDTPYE.feiji, [pdk_allZhaDan]],
    //     [pdk_allZhaDan, []],
    //     [PDK_CARDTPYE.feiji, []],
    // ];
    
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
    // pdk_daiPaiOrder[PDK_CARDTPYE.feiji] = [
    //     [PDK_CARDTPYE.danpai, [pdk_allBuChaiType]],
    
    //     // 新增带对子的规则
    //     [PDK_CARDTPYE.duizi, [pdk_allBuChaiType]],
    //     [PDK_CARDTPYE.duizi, [pdk_allZhaDan, PDK_CARDTPYE.feiji, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
        
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang, PDK_CARDTPYE.shunzi]],
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan, PDK_CARDTPYE.sanzhang]],
    //     [PDK_CARDTPYE.danpai, [pdk_allZhaDan]],
    // ];
    
    //设置喜牌，喜牌提示时不能拆（打码子专有）存的是point
    PokerDaMaZi.prototype.setXiCards = function(xiCards) {
        if (!xiCards)return;
        this.xiCards = xiCards.slice();
    }

    PokerDaMaZi.prototype.isChaiXiCards = function(mjhand, oCards) {
        if (!this.xiCards || this.xiCards.length == 0 || !mjhand || !oCards)return false;

        var jokerAy = [];
        for(var xi = 0; xi < this.xiCards.length; xi++)
        {
            var xipt = this.xiCards[xi];
            var tmpAryhand = [];
            var tmpAryout = [];
            for(var hd = 0; hd < mjhand.length; hd++)
            {
                if (this.calPoint(mjhand[hd]) == xipt)
                tmpAryhand.push(mjhand[hd]);
            }

            for(var hd = 0; hd < oCards.length; hd++)
            {
                if (this.calPoint(oCards[hd]) == xipt)
                tmpAryout.push(oCards[hd]);
            }

            if(xipt > PDK_MAXPOINT) jokerAy.push(xipt);//王的话先缓存

            if (tmpAryout.length != 0 && tmpAryhand.length != tmpAryout.length) return true;
        }

        //王特殊处理
        if (jokerAy.length > 0)
        {
            var tmpAryhand = [];
            var tmpAryout = [];
            for(var hd = 0; hd < mjhand.length; hd++)
            {
                if (jokerAy.indexOf( this.calPoint(mjhand[hd]) ) != -1)
                    tmpAryhand.push(mjhand[hd]);
            }

            for(var hd = 0; hd < oCards.length; hd++)
            {
                if (jokerAy.indexOf( this.calPoint(oCards[hd]) ) != -1)
                    tmpAryout.push(oCards[hd]);
            }

            if (tmpAryout.length != 0 && tmpAryhand.length != tmpAryout.length) return true;
        }

        return false;
    }
    
    //两副牌，4人，每人27张
    PokerDaMaZi.prototype.randomCards = function(areaSelectMode, tData) {
        var cards = [];
        //两副牌
        for (var i = 1; i <= 54; i++) {
            cards.push(i);
        }
        for (var i = 1; i <= 54; i++) {
            cards.push(i);
        }
        // 洗牌
        cards.sort(function (a, b) {
            return .5 - Math.random();
        });
        // 切牌
        cards = shuffleArray(cards);
        return cards;
    };
    
    /**
     * 计算牌点数
     * @param {number} num
     * @return {number}
     */
    PokerDaMaZi.prototype.calPoint = function(num) {
        if (!num)
            return -1;
        
        var ceilNum = Math.ceil(num / 4);
        if (ceilNum == 1)
            return PDK_APOINT; // A记为14
        
        if (ceilNum == 2)
            return PDK_MAXPOINT; // 2记为16

        if (ceilNum > PDK_KPOINT) {
            return num; // 大小王原数字返回53、54
        }        
        return ceilNum;
    };
    
    /**
     * 计算牌花色
     * @param {number} num
     * @return {number}
     */
    PokerDaMaZi.prototype.calFlower = function(num) {
        return (num + 3) % 4;
    }
    
        /**
     * 判断是否是连对
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerDaMaZi.prototype.isLiandui = function(oCards) { //oCards有序
        var cardNum = PDK_CARDCOUNT[PDK_CARDTPYE.liandui];// 连对最小牌数

        if (!oCards || oCards.length < cardNum || oCards.length % 2 != 0)
            return false;

        var cardCount = oCards.length;
        var points = [];
        for (var i = 0; i < oCards.length; i++) {
            var pt = this.calPoint(oCards[i]);
            if (pt > PDK_MAXPOINT) return false;
            points.push(pt);
        }

        for (var i = 0; i < cardCount - 2; i += 2) {
            var abs = Math.abs(points[i] - points[i + 2]);
            if ( abs != 1 || (points[i + 1] != points[i]) ||  (points[i + 2] != points[i + 3]) )  return false;
        }

        return true;
    };
    
    /**
     * 判断是否为3顺  : 555666 , 555666777
     * @param  {array} oCards 按点数排序好的皮
     * @return {boll} 
     */
    PokerDaMaZi.prototype.isSanShun = function(oCards){

        if ( 0 != oCards.length % 3 || oCards.length<6) 
            return false;

        for(var i in oCards){
            if(i==0) continue;

            var cardPoint1 = this.calPoint(oCards[i]);
            var cardPoint2 = this.calPoint(oCards[i-1]);

            if(0!=i && 0!=i%3 && cardPoint1!=cardPoint2 )
                return false;

            // 每第3张牌比第4张牌少1点, 否则不是3顺
            if(0!=i && 0==i%3 && (cardPoint1-cardPoint2)!=1 )
                return false;
        }

        return true;
    }
    /**
     * 判断是否为4顺  : 55556666 , 555566667777
     * @param  {array} oCards 按点数排序好的皮
     * @return {boll} 
     */
    PokerDaMaZi.prototype.isSiShun = function(oCards){
        if ( 0 != oCards.length % 4 || oCards.length<8) 
            return false;

        for(var i in oCards){
            if(i==0) continue;

            var cardPoint1 = this.calPoint(oCards[i]);
            var cardPoint2 = this.calPoint(oCards[i-1]);

            if(0!=i && 0!=i%4 && cardPoint1!=cardPoint2 )
                return false;

            // 每第3张牌比第4张牌少1点, 否则不是3顺
            if(0!=i && 0==i%4 && (cardPoint1-cardPoint2)!=1 )
                return false;
        }

        return true;
    }
    // console.log( PokerDaMaZi.prototype.isSanShun([3,3,3]) );
    
    /**
     * 获取所有3顺的组合
     * @param  {array} oCards 按点数排序好的牌
     * @return {array} 所有3顺的组合 和 散牌
     */
    PokerDaMaZi.prototype.getSanShunAndSanPai = function(oCards){
        var countSanSame = 0;
        // 记录所有3张的数值
        var sanSameList = [];
        // 记录散牌
        var sanPaiList = [];
    
        for(var i = 0; i < oCards.length; i++){
    
            // 如 是第一张牌 或 重置搜索, 记录已搜索一张牌， 跳过牌值对比
            if(0 == i || 0 == countSanSame)  {
                countSanSame = 1;
                // 最后一张牌，放到散牌里
                if(i == (oCards.length - 1) ){
                    sanPaiList.push( oCards[i] );
                }
                continue;
            }
    
            var cardPoint1 = this.calPoint(oCards[i]);
            var cardPoint2 = this.calPoint(oCards[i-1]);
    
            // 如果此牌 和 搜索的牌值相等, 搜索记录+1
            if(cardPoint1==cardPoint2){
                countSanSame++;
    
            }else{
                // 如 已搜索的牌 是散牌， 记录为散牌
                for(var j=1; j <= countSanSame; j++)
                    sanPaiList.push( oCards[i-j] );
                
                // 此牌oCards[i] 继续和后面的牌对比, 所以记录此牌在搜索 
                countSanSame = 1;
                
            }
    
            // 如果3张 ，记录， 重置搜索  
            if(3 == countSanSame){
                for(var j=0; j < countSanSame; j++)
                    sanSameList.push( oCards[i-j] );
                countSanSame = 0;
    
            // 如 最后一张牌没有3张
            }else if(i == (oCards.length - 1) ){
                for(var j=0; j < countSanSame; j++)
                    sanPaiList.push( oCards[i-j] );
                countSanSame = 0;
            }
        }
    
    
        var tmpsanShun1 = [];
        var tmpsanShun2 = [];
        var handIndex = 0;
        sanSameList.sort(this.cardSortBigToSmall.bind(this));// 从大到小排序

        //找出最大的三顺
        for (var i = sanSameList.length/3 -1; i >=0 ; i--)
        {
            var cmpCds = sanSameList.slice(0, (i+1)*3);
            var ss = this.findCardByType(sanSameList, 0, PDK_CARDTPYE.sanshun,cmpCds, null);
            if (ss.length <= 0)continue;
            var maxidx = 0;
            for (var j = 0; j < ss.length; j++)
            {
                if (this.calPoint(ss[maxidx]) <= this.calPoint(ss[j]))
                    maxidx = j;
            }
            tmpsanShun1 = ss[maxidx];
            break;
        }

    
        for(var i in tmpsanShun1) {
            var card = tmpsanShun1[i]
            sanSameList.splice(sanSameList.indexOf(card), 1);
        }
        sanPaiList = sanPaiList.concat(sanSameList);
    
        return [tmpsanShun1, sanPaiList];
    }
    
    PokerDaMaZi.prototype.countDuiNum = function(oCards){
        var num = 0;
        var cardNumByValue = {};
        for(var i in oCards){
            var cardValue = this.calPoint(oCards[i]);
            if(!cardNumByValue[cardValue]){
                cardNumByValue[cardValue] = 1;  
            } else {
                cardNumByValue[cardValue]++;
                if(cardNumByValue[cardValue] % 2 == 0)
                    num++;
            }
        }
    
        if(num == oCards.length/2){
            return num;
        }else{
            return 0;
        }
    }
    

    
    /**
     * 判断是否是同花
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerDaMaZi.prototype.isTongHua = function(oCards) {
        if (!oCards || oCards.length <= 0)
            return false;
    
        var fl = this.calFlower(oCards[0]);
        for (var i = 0; i < oCards.length; i++) {
            var p = this.calPoint(oCards[i], true);
            if (p > 15)return false;
            if (this.calFlower(oCards[i]) != fl) return false;
        }
    
        return true;
    };
    
    // /**
    //  * 判断是否是同花顺子
    //  * @param {array} oCards 按点数排好序的牌
    //  * @return {bool}
    //  */
    // PokerDaMaZi.prototype.isTongHuaShun = function(oCards) {
    //     if (!oCards || oCards.length < 5)
    //         return false;
    
    //     for (var i = 0; i < oCards.length-1; i++) {
    //         if (!this.IsStraight(oCards[i], oCards[i+1]))
    //             return false
    //     }
    
    //     return this.isTongHua(oCards);
    // };
    
    /**
     * 判断是否是5,10,k
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerDaMaZi.prototype.is_5_10_k = function(oCards) {
        if (!oCards || oCards.length != 3)
            return false;
    
        var c = [5, 10, 13];
        var pi = [];
        for (var i = 0; i < oCards.length; i++)
        {
            pi.push(this.calPoint(oCards[i]));
        }
        for(var i = 0; i < c.length; i++)
        {
            if (pi.indexOf(c[i]) < 0) return false;
        }
    
        return true;
    };
    
    /**
     * 判断是否是同花5,10,k
     * @param {array} oCards 按点数排好序的牌
     * @return {bool}
     */
    PokerDaMaZi.prototype.isTongHua_5_10_k = function(oCards) {
        return this.is_5_10_k(oCards) && this.isTongHua(oCards);
    };
    
    
    PokerDaMaZi.prototype.isZhaDan = function(oCards, areaSelectMode) {
        if(!oCards || oCards.length ==0) return false;
    
        var cardType = this.calType(oCards, areaSelectMode);
    
        // 四炸
        if( cardType == PDK_CARDTPYE.zhadan
            || cardType == PDK_CARDTPYE.wangzha  )
        {
            return true;
        } else {
            return false;
        }
    }
    
    PokerDaMaZi.prototype.isHadZhaDan = function(cards, areaSelectMode) {
        for(var i=0; i < cards.length; i++){
            var cardValue = this.calPoint(cards[i]);
            var isHadZhaDan = this.find_SameCard(cards, cardValue);
            if(isHadZhaDan && isHadZhaDan.length >= 5) return true;
        }
        if (cards.indexOf(this.cardCfg.jokerRed) >=0 && cards.indexOf(this.cardCfg.jokerBlack) >=0)
            return true;
    
        return false;
    }
    
    //统计牌里有多少炸弹
    PokerDaMaZi.prototype.ZhadanCount = function(cards, areaSelectMode) {
        if (!cards) return 0;
        var ZhaDanAry = [];
        for(var i=0; i < cards.length; i++){
            var cardValue = this.calPoint(cards[i]);
            var isHadZhaDan = this.find_SameCard(cards, cardValue);
            if(isHadZhaDan && isHadZhaDan.length >= 5 && ZhaDanAry.indexOf(cardValue) < 0)
            {
                ZhaDanAry.push(cardValue);
            }
        }
    
        if (cards.indexOf(this.cardCfg.jokerRed) >=0 && cards.indexOf(this.cardCfg.jokerBlack) >=0)
            ZhaDanAry.push(this.cardCfg.jokerRed);
    
        return ZhaDanAry.length;
    }
    
    
    // 是否拆散了炸弹牌型
    PokerDaMaZi.prototype.isChaiZhaDan = function(handCards, putCards, areaSelectMode){
         // 炸弹不可拆 但是可以 四带2 四代3 等四张一块出
        for(var i=0; i < putCards.length; i++){
            var cardValue = this.calPoint(putCards[i]);
            var findHand = this.findNSameCard(handCards, cardValue);
            var findCards = this.findNSameCard(putCards, cardValue);
            // putCards 有属于炸弹的牌， 而且 没有包含完整的炸弹牌型
            if(findHand && findHand.length > 4 && findCards && findCards.length > 4 && findHand.length != findCards.length) {
                return true;
            }
        }
    
        if (handCards.indexOf(this.cardCfg.jokerRed) >=0 && handCards.indexOf(this.cardCfg.jokerBlack) >=0)
        {
            if(putCards.indexOf(this.cardCfg.jokerRed) < 0 || putCards.indexOf(this.cardCfg.jokerBlack) < 0)
            {
                return true;
            }
        }
    
        return false;
    }

    
    /**
     * 计算牌型
     * @param {array} cards 按点数排好序的牌
     * @return {PDK_CARDTPYE} 牌型，-1 = 不成型
     */
    PokerDaMaZi.prototype.calType = function(pCards, areaSelectMode) {
        if(!areaSelectMode) areaSelectMode = {};
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
    
        //4顺
        if(cardCount >= 4 && maxCount == 4 && this.isSiShun(cards)){
            return PDK_CARDTPYE.sishun;
        }
    
        //3顺
        if(cardCount >= 3 && maxCount == 3 && this.isSanShun(cards)){
            return PDK_CARDTPYE.sanshun;
        }
    
        // 同花510k
        if (cardCount == 3 && maxCount == 1 && this.isTongHua_5_10_k(cards))
            return PDK_CARDTPYE.f_510k;
    
        // 510k
        if (cardCount == 3 && maxCount == 1 && this.is_5_10_k(cards))
            return PDK_CARDTPYE.z_510k;
    
    
        // 连对，2对起
        if (cardCount >= PDK_CARDCOUNT[PDK_CARDTPYE.liandui] && maxCount == 2 && this.isLiandui(cards))
            return PDK_CARDTPYE.liandui;


    
        //炸弹
        if (cardCount >= 5 && allSame)
        {   
            if (cardCount == 5)
                return PDK_CARDTPYE.zhadan;
            if (cardCount == 6)
                return PDK_CARDTPYE.zhadan6;
            if (cardCount == 7)
                return PDK_CARDTPYE.zhadan7;
            if (cardCount == 8)
                return PDK_CARDTPYE.zhadan8;
        }

        //王炸
        if(cardCount == 4 && pointCounts[this.cardCfg.jokerBlack]==2 && pointCounts[this.cardCfg.jokerRed ]==2)
        {
            return PDK_CARDTPYE.wangzha;
        }

        //3个王炸
        if(cardCount == 3 && 
            ((pointCounts[this.cardCfg.jokerBlack]==2 && pointCounts[this.cardCfg.jokerRed ]==1) ||
            (pointCounts[this.cardCfg.jokerBlack]==1 && pointCounts[this.cardCfg.jokerRed ]==2))
            )
        {
            return PDK_CARDTPYE.sanwang;
        }

        //两个大个王炸
        if(cardCount == 2 && pointCounts[this.cardCfg.jokerRed ]==2)
        {
            return PDK_CARDTPYE.b_2wang;
        }
        //两个王炸(非两个大王)
        if(cardCount == 2 && 
            (pointCounts[this.cardCfg.jokerBlack]==2 ||(pointCounts[this.cardCfg.jokerBlack]==1 && pointCounts[this.cardCfg.jokerRed ]==1)))
        {
            return PDK_CARDTPYE.s_2wang;
        }
    
        // 四张
        if (cardCount == 4 && allSame)
            return PDK_CARDTPYE.sizhang;
    
        // 三张
        if (cardCount == 3 && allSame)
            return PDK_CARDTPYE.sanzhang;
    
        // 对子
        if (cardCount == 2 && allSame)
            return PDK_CARDTPYE.duizi;
    
        // 单牌
        if (cardCount == 1)
            return PDK_CARDTPYE.danpai;
    
        return -1;
    };
    
    PokerDaMaZi.prototype.cardsType = function(cards, areaSelectMode) {
        return this.calType(cards, areaSelectMode)
    }
    
    /**
     * 计算牌型点数
     * @param {array} cards 按点数排好序的牌
     * @return {number}
     */
    PokerDaMaZi.prototype.calCardsValue = function(cards, type, areaSelectMode) {
    
        if (!cards || cards.length == 0)
            return -1;  
        if (!type)
            type = this.calType(cards, areaSelectMode);
        
        var lastCard = cards[cards.length - 1];
            

        // if (type == PDK_CARDTPYE.liandui ||
        //     type == PDK_CARDTPYE.sanshun ||
        //     type == PDK_CARDTPYE.sishun)
        // {
        //     var cdPoint = [];
        //     for(var i = 0; i < cards.length; i++)
        //         cdPoint.push(this.calPoint(cards[i]));
        //     if (cdPoint.indexOf(3)>=0&&cdPoint.indexOf(PDK_MAXPOINT)>=0)
        //     {//A或者2组成小顺的时候
        //         for (var i = 0; i < cdPoint.length-1; i++)
        //         {
        //             var point = cdPoint[i+1];
        //             if (point == PDK_APOINT || point == PDK_MAXPOINT)
        //                 return cdPoint[i];
        //         }
        //     }
        // }

        // 单牌，对子，三张，顺子，连对，三顺，同花顺，炸弹，王炸
        return this.calPoint(lastCard);
    };
    
    // 牌点比较函数
    PokerDaMaZi.prototype.cardValueCmp = function(a, b) {
        var pa = this.calPoint(a);
        var pb = this.calPoint(b);
        if (pa == pb)
            return a - b;
        
        return pa - pb;
    };
    
    PokerDaMaZi.prototype.cardSortBigToSmall = function(a, b) {
        var pa = this.calPoint(a);
        var pb = this.calPoint(b);
        if (pa == pb)
            return b - a;
        
        return pb - pa;
    }
    
    /** 剔除癞子
     * @param {array} oCards [in] 
     * @param {array} cards [out] 剔除癞子后的按点数据序的牌
     * @return {number} 返回癞子数
     */
    PokerDaMaZi.prototype.transformAndGetLaizi = function(oCards, cards) {
        var laizi = 0;
        for (var i = 0; i < oCards.length; i++) {
            if (oCards[i] == this.laiziCard)
                laizi ++;
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
    PokerDaMaZi.prototype.canPut = function(oCards, oLastCards, handsNum, areaSelectMode) {
        var cardsType = this.calType(oCards, areaSelectMode);
        if (cardsType == -1)
            return false;
    
        // 没有上次打的牌，三家过自己再出牌
        if (!oLastCards || oLastCards.length==0 || oLastCards=='undefined')
            return true;
    
        if (cardsType == PDK_CARDTPYE.liandui && oCards.length != oLastCards.length)
            return false;
    
        oCards.sort(this.cardValueCmp.bind(this));
        oLastCards.sort(this.cardValueCmp.bind(this));
    
        var lastCardsType = this.calType(oLastCards, areaSelectMode);
        if (cardsType == lastCardsType && oCards.length == oLastCards.length) {
            var typeValue = this.calCardsValue(oCards, cardsType, areaSelectMode);
            var lastTypeValue = this.calCardsValue(oLastCards, lastCardsType, areaSelectMode);
            if (cardsType == PDK_CARDTPYE.f_510k)
            {
                return this.calFlower(oCards[0]) > this.calFlower(oLastCards[0]);
            }
            else
                return typeValue > lastTypeValue;
        }
        // else if (cardsType == lastCardsType && cardsType == PDK_CARDTPYE.zhadan)//不同张数的炸弹，比张数
        // {
        //     return oCards.length > oLastCards.length;
        // }
        // else if (oCards.length != oLastCards.length &&  
        //     ((cardsType == PDK_CARDTPYE.zhadan && lastCardsType == PDK_CARDTPYE.tonghuashun)||
        //     (cardsType == PDK_CARDTPYE.tonghuashun && lastCardsType == PDK_CARDTPYE.zhadan)))//炸弹和同花顺以张数比较大小，同张数情况下同花顺大
        // {
        //     return oCards.length > oLastCards.length;
        // }
        else if(PDK_CARD_VALUE[cardsType]) {
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
    PokerDaMaZi.prototype.checkPut = function(oHands, cards, lastCards, areaSelectMode, isNextPlayerOneCard, isFirstRound) {
        if(cards && typeof(cards)!='undefined' && cards.length == 0) return null;
    
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

        if (this.isChaiXiCards(oHands, cards)) return null;
    
        if(!areaSelectMode && cc ) {
            areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
        }
    
        var cardType = this.calType(cards, areaSelectMode);
        var pthis = this;
        var sortCards = cards;
        var sortLastCards = lastCards;
    
        if (typeof(sortLastCards) == "number")
            sortLastCards = null;
        
        if (sortCards){
            sortCards = sortCards.slice();
            sortCards.sort(this.cardValueCmp.bind(this));
        }
        if (sortLastCards){
            sortLastCards = sortLastCards.slice();
            sortLastCards.sort(this.cardValueCmp.bind(this));
        }
    
        if (this.canPut(sortCards, sortLastCards, oHands.length, areaSelectMode)) {
            return hands; // 能打得过上家的牌
        }
        return null;
    };
    
    PokerDaMaZi.prototype.getMaxDanPai = function(oCards) {
        var sortCards = oCards.slice();
        sortCards.sort(this.cardValueCmp.bind(this));
        return sortCards[sortCards.length -1];
    }
    
    /**
     * 对手牌排序
     * @param {array} 
     * @param {number} sortType 1 = 花色排序, 2 = 张数排序, 0 ==普通牌型
     */
    PokerDaMaZi.prototype.sortHandCards = function(oCards, sortType) {
        var cards = oCards.slice();
        var commonCmp = this.cardValueCmp.bind(this);
        var cardValueCmp = this.cardValueCmp.bind(this);
        if (sortType == 1) { // 花色排序
            commonCmp = function (a, b) {
                var c1 = (a + 3) % 4;
                var c2 = (b + 3) % 4;
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
                    pointCounts[p] ++;
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
    
        cards.sort(function(a, b) {
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
    PokerDaMaZi.prototype.findNSameCard = function(hands, point, n) {
        var newh = hands.slice();
        newh.sort(this.cardValueCmp.bind(this));
        for (var i = 0; i < newh.length; i++) {
            if (this.calPoint(newh[i]) == point && this.calPoint(newh[i + n - 1]) == point)
                return newh.slice(i, i + n);
        }
        return null;
    };
    
    PokerDaMaZi.prototype.find_SameCard = function(hands, point) {
        var samecards = []
        var newh = hands.slice();
        newh.sort(this.cardValueCmp.bind(this));
        for (var i = 0; i < newh.length; i++) {
            if (this.calPoint(newh[i]) == point)
                samecards.push(newh[i])
        }
        return samecards.length>0? samecards:[];
    };
    
    // 删除相应牌值
    PokerDaMaZi.prototype.delPoint = function(hands, points){
        var arr = hands.slice();
        for(var i=0; i < points.length; i++){
            for (var j = 0; j < arr.length; j++) {
                if( this.calPoint(arr[j]) == points[i] ){
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
    PokerDaMaZi.prototype.lieju = function(parr, num){
        var tmps = [];
    
        var zhuhe = function(srcArr, eleNum, tagArr){
            if(eleNum == 0) return tagArr;
            var newZhuHe = [];
    
            if(!tagArr){
                tagArr = [];
                tagArr.push(srcArr[0]);
                newZhuHe.push(tagArr);
            }else{
                for(var i=0; i<tagArr.length; i++){
                    for(var j=i; j<srcArr.length; j++){
                        newZhuHe.push( tagArr[i].concat( srcArr[j] ) );
                    }
                }
            }
    
            var pSrcArr = srcArr.slice(1, srcArr.length);
            return zhuhe(pSrcArr, --eleNum, newZhuHe)
        }
    
        for(var i=0; i < parr.length-num+1; i++){
            var tmp = zhuhe(parr.slice(i, parr.length), num) ;
            tmps = tmps.concat(tmp);
        }
    
        return tmps;
    }
    
    PokerDaMaZi.prototype.formatCards = function(oCards) {
        var info = {};
        // key:牌值  value:数量  (10有3张）
        info.mValueToNum = {};
        // key:数量  value:牌值  (3张的牌有10, K, 4)
        info.mNumToValue = {};
    
        var cds = oCards.slice();
        cds.sort(this.cardValueCmp.bind(this));
        info.cds = cds;
    
        for(var i in cds){
            var value = this.calPoint(cds[i]);
            if( !info.mValueToNum[value] ) info.mValueToNum[value] = [];
    
            info.mValueToNum[value].push(cds[i]);
        }
    
        for(var i in cds){
            var value = this.calPoint(cds[i]);
            var num = info.mValueToNum[value].length;
    
            if( !info.mNumToValue[num] ) info.mNumToValue[num] = [];
    
            if( info.mNumToValue[num].indexOf(value) < 0 )
                info.mNumToValue[num].push(value);
        }
    
        return info;
    }
    
    PokerDaMaZi.prototype.indexOfCards = function(cardList, cards) {
        for(var i in cardList) {
            var tmpCards = cardList[i];
            if( this.isSameCards(tmpCards, cards) )
                return true;
        }
        return false;
    }
    
    PokerDaMaZi.prototype.isSameCards = function(cards1, cards2) {
        if(cards1.length != cards2.length) return false;
    
        var cds1 = cards1.slice();
        var cds2 = cards2.slice();
        cds1.sort(this.cardValueCmp.bind(this));
        cds2.sort(this.cardValueCmp.bind(this));
    
        for(var i in cds1){
            if(cds1[i] != cds2[i])
                return false;
        }
    
        return true;
    }
    
    /** 
     * 用laizi张癞子去拼出type牌型的牌
     * @param {array} hands 按点数按好序的牌
     * @param {number} laizi 所使用的癞子数
     * @param {PDK_CARDTPYE} type 要拼出的牌型
     * @param {array} lastCards 最后一手牌
     * @param {array} 拼好的 
     */
    PokerDaMaZi.prototype.findCardByType = function(hands, laizi, type, lastCards, areaSelectMode) {
        var rets = [];
        var laizis = [];
        var cardNum = typeof(lastCards)!='undefined' && lastCards ? lastCards.length : null;
        var cardCount = PDK_CARDCOUNT[type];
    
        if (cardNum && (type == PDK_CARDTPYE.liandui  || type == PDK_CARDTPYE.sanshun))
            cardCount = cardNum;
    
        if (laizi > cardCount || laizi + hands.length < cardCount) {
            // 如果是用所有手牌压 飞机 或 三带二 , 牌数少于被压的牌
            if(type != PDK_CARDTPYE.feiji && type != PDK_CARDTPYE.sandaier)
                return rets;
        }
    
        for (var i = 0; i < laizi; i++) {
            laizis.push(this.laiziCard);
        }
 
        if (type == PDK_CARDTPYE.danpai) {
            if (laizis.length == 1) {
                rets.push(laizis.slice());
            }
            else {
                var handsCopy = hands.slice();
                handsCopy.sort(this.cardValueCmp.bind(this));
    
                for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) 
                {
                    for (var j = 0; j < handsCopy.length; j++) {
                        if (this.calPoint(handsCopy[j]) == i) {
                            rets.push([handsCopy[j]]);
                            break;
                        }
                    }
                }

                if (handsCopy.indexOf(this.cardCfg.jokerRed)>=0)rets.push([this.cardCfg.jokerRed]);
                if (handsCopy.indexOf(this.cardCfg.jokerBlack)>=0)rets.push([this.cardCfg.jokerBlack]);
            }
        }
        else if (type == PDK_CARDTPYE.duizi || type == PDK_CARDTPYE.sanzhang || type == PDK_CARDTPYE.sizhang) { 
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) {
                var find = this.findNSameCard(hands, i, cardCount - laizi);
                if (find) {
                    rets.push(laizis.concat(find));
                }
            }

            var find =this.findNSameCard(hands, this.cardCfg.jokerRed, cardCount - laizi);
            if (find)rets.push(laizis.concat(find));

            var find =this.findNSameCard(hands, this.cardCfg.jokerBlack, cardCount - laizi);
            if (find)rets.push(laizis.concat(find));
        }
        else if (type == PDK_CARDTPYE.liandui) {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT - cardCount/2 + 1; i++) // 连对首张
            {
                var ldCount = 0;
                var ret = laizis.slice();
                for (var j = 0; j < cardCount/2; j++) 
                {
                    var p = i + j;
                    for (var k = 0; k < hands.length - 1; k++) 
                    {   
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
        else if(type == PDK_CARDTPYE.sanshun)
        {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT - cardCount/3 + 1; i++) // 连对首张
            {
                var ldCount = 0;
                var ret = laizis.slice();
                for (var j = 0; j < cardCount/3; j++) 
                {
                    var p = i + j;
                    for (var k = 0; k < hands.length - 1; k++) 
                    {
                        var point1 = this.calPoint(hands[k]);
                        var point2 = this.calPoint(hands[k + 1]);
                        var point3 = this.calPoint(hands[k + 2]);
                        
                        if (point1 != p || point2 != p || point3 != p)
                            continue;
    
                        ldCount += 3;
                        ret.push(hands[k]);
                        ret.push(hands[k + 1]);
                        ret.push(hands[k + 2]);
                        break;
                    }
                }
                if (ldCount + laizi == cardCount) {
                    rets.push(ret);
                }
            }
        }   
        else if(type == PDK_CARDTPYE.sishun)
        {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT - cardCount/4 + 1; i++) // 连对首张
            {
                var ldCount = 0;
                var ret = laizis.slice();
                for (var j = 0; j < cardCount/4; j++) 
                {
                    var p = i + j;
                    for (var k = 0; k < hands.length - 1; k++) 
                    {
                        var point1 = this.calPoint(hands[k]);
                        var point2 = this.calPoint(hands[k + 1]);
                        var point3 = this.calPoint(hands[k + 2]);
                        var point4 = this.calPoint(hands[k + 3]);
                      
                        
                        if (point1 != p || point2 != p || point3 != p || point4 != p )
                            continue;
    
                        ldCount += 4;
                        ret.push(hands[k]);
                        ret.push(hands[k + 1]);
                        ret.push(hands[k + 2]);
                        ret.push(hands[k + 3]);
                        break;
                    }
                }
                if (ldCount + laizi == cardCount) {
                    rets.push(ret);
                }
            }
        } 
        else if(type == PDK_CARDTPYE.z_510k)
        {
            var c5 = this.find_SameCard(hands,5);
            var c10 = this.find_SameCard(hands,10);
            var ck = this.find_SameCard(hands,13);
    
            for (var i5 = 0; i5 < c5.length; i5++)
            {
                for (var i10 = 0; i10 < c10.length; i10++)
                {
                    for (var ik = 0; ik < ck.length; ik++)
                    {
                        if (!this.isTongHua([c5[i5], c10[i10], ck[ik]] )&& !this.indexOfCards(rets, [c5[i5], c10[i10], ck[ik]]))
                            rets.push([ck[ik], c10[i10], c5[i5]]);
                    }
                }
            }
        }
        else if(type == PDK_CARDTPYE.f_510k)
        {
            var c5 = this.find_SameCard(hands,5);
            var c10 = this.find_SameCard(hands,10);
            var ck = this.find_SameCard(hands,13);
    
            for (var i5 = 0; i5 < c5.length; i5++)
            {
                for (var i10 = 0; i10 < c10.length; i10++)
                {
                    for (var ik = 0; ik < ck.length; ik++)
                    {
                        if (this.isTongHua([c5[i5], c10[i10], ck[ik]]) && !this.indexOfCards(rets, [c5[i5], c10[i10], ck[ik]]))
                            rets.push([ck[ik], c10[i10], c5[i5]]);
                    }
                }
            }
        }
        else if(type == PDK_CARDTPYE.s_2wang)
        {
            var blackj = this.find_SameCard(hands,this.cardCfg.jokerBlack);
            var redj = this.find_SameCard(hands,this.cardCfg.jokerRed );
            if (blackj.length == 2)
                rets.push(blackj);
            else if(blackj.length >= 1 && redj.length >= 1)
                rets.push([blackj[0], redj[0]]);
        }
        else if(type == PDK_CARDTPYE.b_2wang)
        {
            var redj = this.find_SameCard(hands,this.cardCfg.jokerRed );
            if (redj.length == 2)
                rets.push(redj);
        }
        else if(type == PDK_CARDTPYE.sanwang)
        {
            var blackj = this.find_SameCard(hands,this.cardCfg.jokerBlack);
            var redj = this.find_SameCard(hands,this.cardCfg.jokerRed );
            if ((redj.length + blackj.length)  >= 3)
            {
                var re = blackj.concat(redj)
                if (re.length >= 4)
                    re.splice(re.length-1,1);
                rets.push(re);
            }
        }
        else if (type == PDK_CARDTPYE.wangzha)
        {
            var blackj = this.find_SameCard(hands,this.cardCfg.jokerBlack);
            var redj = this.find_SameCard(hands,this.cardCfg.jokerRed );
            if ((blackj.length + redj.length) == 4)
            {
                rets.push(blackj.concat(redj));
            }
        }
        else if(type >= PDK_CARDTPYE.zhadan)
        {
            for (var i = PDK_MINPOINT; i <= PDK_MAXPOINT; i++) 
            {
                var samecards = this.find_SameCard(hands,i);
                if (samecards.length >= PDK_CARDCOUNT[type] )
                {
                    rets.push(samecards.slice(0,PDK_CARDCOUNT[type]));
                }
            }
        }
        return rets;
    };

    
    PokerDaMaZi.prototype.tipCardsInLiPai = function(oLastCards, areaSelectMode)
    {
        if(typeof(MjClient) == "undefined") return [];
        var oHands = MjClient.playui._LiPaiCards;
        if (!oHands)return;
        var resLiPai = this.tipCardsEx(oHands, oLastCards, areaSelectMode, false);
        return resLiPai;
    }

    PokerDaMaZi.prototype.isTipCardsInLiPai = function(tipcards)
    {
        if(!tipcards || typeof(MjClient) == "undefined" )return false;
        var liPaiCards = MjClient.playui._LiPaiCards;
        if (!liPaiCards)return;
        for (var i = 0; i < tipcards.length; i++)
        {
            if (liPaiCards.indexOf(tipcards[i]) < 0)return false;
        }
        return true;
    }
    
    PokerDaMaZi.prototype.tipCardsEx = function(oHands, oLastCards, areaSelectMode, isInCheckLiPai)
    {
        // 第一个出牌时
        // var isFirstPlayerPut = (!oLastCards || oLastCards == -1 || oLastCards.length == 0);
        // if(isFirstPlayerPut)
        // {
        //     var sortHands = oHands.slice();
        //     sortHands.sort(this.cardValueCmp.bind(this));
        //     return [[sortHands[sortHands.length - 1]]];
        // }

        var hands = [];
        var handLaizi = this.transformAndGetLaizi(oHands, hands);
        var lastCardsType = this.calType(oLastCards, areaSelectMode);
        var rets = [];


        for (var laizi = 0; laizi <= handLaizi; laizi++) {
            if(lastCardsType >=  PDK_CARDTPYE.f_510k) break;

            var sameTypeCards = this.findCardByType(hands, laizi, lastCardsType, oLastCards, areaSelectMode);
            for (var i = 0; i < sameTypeCards.length; i++) {
                if (this.canPut(sameTypeCards[i], oLastCards, oHands.length, areaSelectMode) &&
                    this.isChaiXiCards(hands, sameTypeCards[i])==false &&
                    (isInCheckLiPai? this.isTipCardsInLiPai(sameTypeCards[i]) == false : true)) {
                    rets.push(sameTypeCards[i]);
                }
            }
        }

        for (var i = PDK_CARDTPYE.z_510k; i <= PDK_CARDTPYE.zhadan8; i++)
        {
            console.log("tipscard================", i);
            var booms = this.findCardByType(hands, 0, i, oLastCards, areaSelectMode);
            for (var n = 0; n < booms.length; n++) {
                if (this.canPut(booms[n], oLastCards, oHands.length, areaSelectMode) &&
                    this.isChaiXiCards(hands, booms[n])==false && 
                    (isInCheckLiPai? this.isTipCardsInLiPai(booms[n]) == false : true)) {
                    rets.push(booms[n]);
                }
            }
        }

        return rets;
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
    PokerDaMaZi.prototype.tipCards = function(oHands, oLastCards, areaSelectMode){//, isNextPlayerOneCard, isFirstRound, isSmartTip) {
    
    
        // 第一个出牌时
        var isFirstPlayerPut = (!oLastCards || oLastCards == -1 || oLastCards.length == 0);
        if(isFirstPlayerPut)
        {
            var sortHands = oHands.slice();
            sortHands.sort(this.cardValueCmp.bind(this));
            return [[sortHands[sortHands.length - 1]]];
        }
        
        
        var retsLiPai = this.tipCardsInLiPai(oLastCards, areaSelectMode);
        var rets = this.tipCardsEx(oHands, oLastCards, areaSelectMode, true);

        var rere = retsLiPai.concat(rets);
        return rere;
    };
    

    // PokerDaMaZi.prototype.randomCards_test = function(areaSelectMode, tData) {
    //     var cards = [];
    //     //两副牌
    //     for (var i = 1; i <= 54; i++) {
    //         cards.push(i);
    //     }
    //     for (var i = 1; i <= 54; i++) {
    //         cards.push(i);
    //     }
    //     // 洗牌
    //     cards.sort(function (a, b) {
    //         return .5 - Math.random();
    //     });
    //     // 切牌
    //     cards = this.shuffleArray(cards);
    //     return cards;
    // };

    // PokerDaMaZi.prototype.shuffleArray = function(arr) {
    //     for (var i = 0; i < arr.length; i++) {
    //         var randIndex = i + Math.floor(Math.random() * (arr.length - i));
    //         var temp = arr[i];
    //         arr[i] = arr[randIndex];
    //         arr[randIndex] = temp;
    //     }
    //     for (var i = 0; i < arr.length; i++) {
    //         var randIndex = i + Math.floor(Math.random() * (arr.length - i));
    //         var temp = arr[i];
    //         arr[i] = arr[randIndex];
    //         arr[randIndex] = temp;
    //     }
    //     return arr;
    // };

    // PokerDaMaZi.prototype.doF = function(areaSelectMode, tData)
    // {
    //     var shuuffleCnt = 10000;
    //     var shuffleType = "=========NewShuffle==============";
    //     console.log(shuffleType, "ShuffleCnt", shuuffleCnt)
    //     var xipai = 0;
    //     var xipai_2 = 0;
    //     var xipai_3 = 0;
    //     for (var i = 0; i < shuuffleCnt; i++)
    //     {
    //         var mjhand = this.randomCards_test(areaSelectMode, tData);
    //         cardNext=0;
    //         var plyarr = [];
    //         for (var n =0; n < areaSelectMode.maxPlayer; n++)
    //         {
    //             if (!plyarr[n])plyarr[n]=[];
    //             for (var j = 0; j < this.handCount; j++) {
    //                 var newCard = mjhand[cardNext++];
    //                 plyarr[n].push(newCard);
    //             }
    //         }

    //         var roundcnt = 0;
    //         for(var m = 0; m < plyarr.length; m++)
    //         {
    //             // var re = this.findCardByType(plyarr[m], 0, PDK_CARDTPYE.zhadan, [1,1,1,1], areaSelectMode)


    //             for (var n = PDK_MINPOINT; n <= PDK_MAXPOINT; n++) 
    //             {
    //                 var samecards = this.find_SameCard(plyarr[m],n);
    //                 if (samecards.length >= 6 )
    //                 {
    //                     xipai += 1;
    //                     roundcnt += 1;
    //                 }
    //             }
                
    //         }
    //         if (roundcnt == 2)xipai_2++;
    //         if (roundcnt >= 2)xipai_3++;
    //     }

    //     console.log("xipai all count:", xipai)
    //     console.log("xipai == 2 round:", xipai_2)
    //     console.log("xipai > 2 round:", xipai_3)
    // }
    
    if(typeof(module)!="undefined" && module.exports)    
        module.exports = PokerDaMaZi;
    
    if(typeof(MjClient)!="undefined")
        MjClient.majiang_DaMaZiZhuZhou = new PokerDaMaZi();
    
})();