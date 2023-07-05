
(function () {
    var majiang = {};
    var flowerArray = [];//花的列表，根据不同来设置


    majiang.handCount = 13;
    majiang.AllCardCount = 0;

    majiang.initAreaSelectMode = function (areaSelectMode) {
        //牌张
        let formIng = areaSelectMode.Forming;
        if (!formIng) formIng = 13;
        this.handCount = formIng;
        if (areaSelectMode.subRule == 0 || areaSelectMode.subRule == 1) {
            this.AllCardCount = 108;
        } else {
            this.AllCardCount = 36 * (areaSelectMode.JustoneEnabled == 2 ? 1 : 2)
        }
    }

    //是否是花
    majiang.isCardFlower = function (card) {
        return flowerArray.indexOf(card) >= 0;
    }

    //设置花，参数是[]，必须设置
    majiang.setFlower = function (flower) {
        flowerArray = flower || [];
    }

    //是否是混子
    majiang.isEqualHunCard = function (card) {
        return card == 200;
    }

    //是否可以胡
    majiang.canHu = function (cards, cd) {
        if (is7Dui(cards, cd)) {
            return true;
        }
        return canHuLaizi(cards, cd);
    }

    //听牌函数，判断手牌能否听牌
    majiang.canTing = function (cds) {
        return this.canHu(cds, 200);
    }

    majiang.canGangWhenTing = function (hand, card) {
        var hangAfterGang = [];
        for (var i = 0; i < hand.length; i++) {
            if (card != hand[i]) {
                hangAfterGang.push(hand[i]);
            }
        }
        //若听牌状态下，去掉所杠的牌不能再听则不能杠
        if (!majiang.canTing(hangAfterGang)) {
            return false;
        }
        //求出之前听的牌
        var tingSet1 = calTingSet(hand);
        //求出杠之后听的牌
        var tingSet2 = calTingSet(hangAfterGang);
        //对比前后听的牌
        for (var tingCard in tingSet2) {
            if (!(tingCard in tingSet1)) {
                return false;
            }
        }
        //听牌不变可以杠
        return true;
    }

    //是否可以杠
    majiang.canGang1 = function (peng, hand, isTing, que) {
        var rtn = [];
        for (var i = 0; i < peng.length; i++) {
            if (hand.indexOf(peng[i]) >= 0 && (!isTing || majiang.canGangWhenTing(hand, peng[i]))) {
                //手牌里的牌Push到rtn中
                if (Math.floor(peng[i] / 10) != que) {
                    rtn.push(peng[i]);
                }
            }
        }
        var cnum = {};
        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if (majiang.isEqualHunCard(cd)) {
                continue;
            }
            var num = cnum[cd];
            if (!num) {
                num = 0;
            }
            num++;
            cnum[cd] = num;
            if (num == 4 && (!isTing || majiang.canGangWhenTing(hand, cd))) {
                if (Math.floor(cd / 10) != que) {
                    rtn.push(cd);
                }
            }
        }
        return rtn;
    };

    //是否可以明杠
    majiang.canGang0 = function (hand, cd, isTing) {
        if (majiang.isEqualHunCard(cd))//混牌不能杠
        {
            return false;
        }
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        return num == 3 && (!isTing || majiang.canGangWhenTing(hand, cd));
    };

    //是否可以碰
    majiang.canPeng = function (hand, cd) {
        var num = 0;
        if (majiang.isEqualHunCard(cd))//混牌不能碰
        {
            return false;
        }
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) {
                num++;
            }
        }
        return num >= 2;
    };

    majiang.CardCount = function (pl) {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if (pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function () {
        return this.AllCardCount;
    };

    majiang.setFlowerImg = function (node, pl) {
    };

    majiang.setJiaZhuNum = function (node, pl) {

    };
    majiang.hasquesecard = function (cards, que) {
        if (!cards) {
            return false;
        }
        for (var i = 0; i < cards.length; i++) {
            if (Math.floor(cards[i] / 10) == que) {
                return false;
            }
        }
        return true;
    };

    //是否可以吃
    majiang.canChi = function (hand, cd) {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - cd;
            switch (dif) {
                case -2:
                case -1:
                case 1:
                case 2:
                    if (!majiang.isEqualHunCard(hand[i]) && !majiang.isEqualHunCard(cd)) {
                        num[dif + 2]++;
                    }
                    break;
            }
        }

        if (num[3] > 0 && num[4] > 0) {
            rtn.push(0);
        }

        if (num[1] > 0 && num[3] > 0) {
            rtn.push(1);
        }

        if (num[0] > 0 && num[1] > 0) {
            rtn.push(2);
        }

        return rtn;
    };
    majiang.getRecommendHuanPaiArr = function (handCards, min = 3) {
        let _Tiles = [...handCards].sort((a, b) => a - b), _Dn = 100, _Bn = 200, _Cn = 300, K = [];
        // 计算各花色的牌数量
        for (let _i = 0; _i < _Tiles.length; _i++) {
            const g = _Tiles[_i];
            let type = ~~(g / 10);
            (type === 2 && _Dn++) || (type === 0 && _Bn++) || (type === 1 && _Cn++);
        }
        _Dn - 100 >= min && K.push(_Dn);
        _Bn - 200 >= min && K.push(_Bn);
        _Cn - 300 >= min && K.push(_Cn);
        let F = ~~(K.sort((a, b) => {
            let Fa = ~~(a / 100), Fb = ~~(b / 100), Na = a % 100, Nb = b % 100;
            return Na < 3 ? -1 : (Na === Nb ? Fa - Fb : Na - Nb);
        })[0] / 100);
        cc.log('---------------------------0------------', F)
        let G = this.GroupingTiles(_Tiles.filter(e => ~~(e / 10) === { 1: 2, 2: 0, 3: 1 }[F])), R = [];
        // 取单张
        const G_Keys = Object.keys(G);
        for (let _j = 0; _j < G_Keys.length; _j++) {
            let n = Number(G_Keys[_j]), n1 = n + 1, n2 = n + 2, p1 = n - 1, p2 = n - 2;
            if (G[n] !== 1 || (G[n1] === 1 && G[n2] === 1) || (G[p1] === 1 && G[p2] === 1) || (G[n1] === 1 && G[p1] === 1)) continue;
            R.push(n);
            G[n] = 0;
            if (R.length === min) break;
        }
        cc.log('---------------------------1------------', JSON.stringify(R))
        if (R.length === min) return R;
        // 拆顺子
        for (let _j = 0; _j < G_Keys.length; _j++) {
            let n = Number(G_Keys[_j]), n1 = n + 1, n2 = n + 2;
            if (!G[n] || !G[n1] || !G[n2]) continue;
            for (let i = 0, m = min - R.length; i < m; i++) {
                R.push(n + i);
                G[n + i]--;
            }
        }
        cc.log('---------------------------2------------', JSON.stringify(R))
        if (R.length === min) return R;
        // 拆对子
        for (let _j = 0; _j < G_Keys.length; _j++) {
            if (R.length === min) break;
            let n = Number(G_Keys[_j]);
            if (G[n] < 1) continue;
            while (G[n] > 0) {
                R.push(n);
                G[n]--;
                if (R.length === min) break;
            }
        }
        cc.log('---------------------------3------------', JSON.stringify(R))
        return R;
    };

    /**
     * 将牌分组
     * @param tiles 牌数组
     */
    majiang.GroupingTiles = function (tiles) {
        let list = {}
        for (let _i = 0; _i < tiles.length; _i++) {
            const e = tiles[_i];
            if (!list.hasOwnProperty(e)) list[e] = 0;
            list[e]++;
        }
        return list;
    }

    if (typeof (MjClient) != "undefined") {
        MjClient.majiang_ynxuezhan = majiang;
    }
    else {
        module.exports = majiang;
    }
})();
