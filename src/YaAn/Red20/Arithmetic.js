(function () {
    let majiang = {};
    majiang.actionCardList = [];
    majiang.lastTableOutCard = 0; //最后出的牌或翻的牌
    majiang.isActionByTableCard = false;
    majiang.updateActionCard = function (card = null) {
        if (card) {
            this.actionCardList.push(card);
        } else {
            this.actionCardList = [];
        }
    }
    /**
     * 能操作的card
     * @param {玩家数据} pl 
     */
    majiang.performActionCards = function (pl) {
        const cards = pl.mjhand,
            eatFlg = pl.eatFlag,
            Rule = MjClient.data.sData.tData.Rule,
            lastD = MjClient.playui.TableOutData;
        this.lastTableOutCard = lastD.pos != -1 ? MjClient.playui.TableOutData.Card : null;
        let getCardMap = () => {
            let cardMap = new Map();
            cc.log("玩家手牌+++++++++getCardMap++++", JSON.stringify(cards));
            cards.forEach(card => {
                let num = this.getCardNum(card);
                let data = cardMap.get(num);
                if (data) {
                    data.push(card);
                    cardMap.set(num, data);
                } else {
                    cardMap.set(num, [card]);
                }
            })
            cc.log('LLL++getCardMap', JSON.stringify(cardMap))
            return cardMap;
        }
        cc.log("玩家手牌+++++++++++++", JSON.stringify(cards));
        cc.log('LLL++lastTableOutCard', this.lastTableOutCard);
        if (eatFlg & 1) {//吃
            let lastCard = this.lastTableOutCard;
            if (lastCard) {
                let lastNum = this.getCardNum(lastCard), chiCards = [];
                cards.forEach(card => {
                    if ((this.getCardNum(card) + lastNum) === 14) chiCards.push(card);
                })
                for (let _i = 0; _i < chiCards.length; _i++) {
                    const card = chiCards[_i];
                    if (this.getCardColor(card) === 4) continue;
                    if (Rule.Allow7AsKing && this.getCardNum(card) === 7) continue;
                    let chi = {
                        type: 'chi',
                        card: card
                    }
                    this.updateActionCard(chi);
                    this.isActionByTableCard = true;
                }
            }
        }
        if (eatFlg & 2) {
            let lastCard = this.lastTableOutCard;
            //打出的牌或翻的牌
            if (lastCard) {
                let lastNum = this.getCardNum(lastCard), pengCards = [];
                cards.forEach(card => {
                    if (this.getCardNum(card) === lastNum) pengCards.push(card);
                })

                if (pengCards.length >= 2) {
                    if (!(this.getCardColor(pengCards[0]) === 4 || (Rule.Allow7AsKing && this.getCardNum(pengCards[0]) === 7))) {
                        let peng = {
                            type: 'peng',
                            card: pengCards[0]
                        }
                        this.updateActionCard(peng);
                        this.isActionByTableCard = true;
                    }
                }
            } else {//自己进的牌
                let cardMap = getCardMap();
                let peng = [];
                cardMap.forEach(value => {
                    if (value.length >= 3) peng.push(value[0]);
                })
                cc.log('LLL+++peng[]', JSON.stringify(peng));
                for (let _i = 0; _i < peng.length; _i++) {
                    let card = peng[_i];
                    if (this.getCardColor(card) === 4) continue;
                    if (Rule.Allow7AsKing && this.getCardNum(card) === 7) continue;
                    let p = {
                        type: 'peng',
                        card: card
                    }
                    this.updateActionCard(p);
                    this.isActionByTableCard = false;
                }
            }
        }
        if (eatFlg & 4) {
            let lastCard = this.lastTableOutCard, lastNum = this.getCardNum(lastCard);
            //别人打出的牌或翻的牌
            if (lastCard) {
                //手牌里找
                let gangCards = [];
                cards.forEach(card => {
                    if (this.getCardNum(card) === lastNum) gangCards.push(card);
                })
                if (gangCards.length === 3) {
                    if (this.getCardColor(gangCards[0]) != 4 && Rule.Allow7AsKing && this.getCardNum(gangCards[0]) != 7) {
                        let gang = {
                            type: 'gang',
                            card: gangCards[0]
                        }
                        this.updateActionCard(gang);
                        this.isActionByTableCard = true;
                    }
                }
                //碰牌里找
                else {
                    cc.log('-------peng-----', JSON.stringify(pl.mjpeng.concat(pl.mjanpeng)))
                    let peng = pl.mjpeng.find(child => {
                        return this.getCardNum(child[0]) === lastNum;
                    })
                    if (!peng) peng = pl.mjanpeng.find(child => {
                        return this.getCardNum(child[0]) === lastNum;
                    })
                    if (peng) {
                        let gang = {
                            type: 'gang',
                            card: lastCard
                        }
                        this.updateActionCard(gang);
                        this.isActionByTableCard = true;
                    }
                }
            }
            //自己进的牌
            else {
                let cardMap = getCardMap();
                let gang = [];
                cardMap.forEach(value => {
                    if (value.length > 3) gang.push(value[0]);
                })
                //手牌里能杠的牌
                if (gang.length > 0) {
                    gang.forEach(card => {
                        if (this.getCardColor(card) != 4 && Rule.Allow7AsKing && this.getCardNum(card) != 7) {
                            let gang = {
                                type: 'gang',
                                card: card
                            }
                            this.updateActionCard(gang);
                            this.isActionByTableCard = false;
                        }
                    })
                }
                //碰转杠的牌
                else {
                    let gangData = [];
                    cc.log('-----------------pl.mjanpeng-----', JSON.stringify(pl.mjanpeng), JSON.stringify(pl.mjpeng))
                    pl.mjanpeng && pl.mjanpeng.forEach(gang => {
                        let num = this.getCardNum(gang[0]);
                        cards.forEach(card => {
                            if (this.getCardNum(card) === num) gangData.push(card);
                        })
                    })
                    pl.mjpeng && pl.mjpeng.forEach(gang => {
                        let num = this.getCardNum(gang[0]);
                        cards.forEach(card => {
                            if (this.getCardNum(card) === num) gangData.push(card);
                        })
                    })
                    gangData.forEach(card => {
                        let gang = {
                            type: 'gang',
                            card: card
                        }
                        this.updateActionCard(gang);
                        this.isActionByTableCard = false;
                    })
                }
            }
        }
    }
    //牌张数量
    majiang.getAllCardsTotal = function () {
        var tData = MjClient.data.sData.tData;
        var numOfKing = tData.Rule.MaxKingCount || 0;
        return numOfKing ? numOfKing + 52 : 52
    };
    //获取花色
    majiang.getCardColor = function (card) {
        return Math.floor(card / 16)
    }
    //获取点数
    majiang.getCardNum = function (card) {
        return card % 16
    }
    //手牌排序
    majiang.cardSort = (cardsData) => {
        return cardsData;
    }

    //叠牌 找相加等于14的
    majiang.StackCards = function (cards, first = false) {
        let rule = MjClient.data.sData.tData.Rule;
        cards = cards.concat([]);
        first && cards.sort((a, b) => {
            if (this.getCardNum(b) === this.getCardNum(a)) {
                //两都为红
                if (this.getCardColor(a) % 2 === 0 && this.getCardColor(b) % 2 === 0) {
                    return this.getCardColor(a) - this.getCardColor(b);
                } else if (this.getCardColor(a) % 2 === 0) {
                    return -1;
                } else if (this.getCardColor(b) % 2 === 0) {
                    return 1;
                } else {
                    return this.getCardColor(a) - this.getCardColor(b);
                }
            } else {
                //从大到小
                return this.getCardNum(b) - this.getCardNum(a)
            }
        });
        //王
        let wang = [], wangBy7 = [], mulCards = [], sumCard = [];
        for (let _i = 0; _i < cards.length; _i++) {
            const c = cards[_i],
                cCol = this.getCardColor(c),
                cNum = this.getCardNum(c);
            if (cCol === 4) {
                wang.push([c]);
                cards.splice(_i, 1);
                _i--;
            } else if (cNum === 7 && rule.Allow7AsKing) {
                wangBy7.push([c]);
                cards.splice(_i, 1);
                _i--;
            } else {
                let mul = [];
                for (let _j = _i + 1; _j < cards.length; _j++) {
                    const cj = cards[_j],
                        cNumj = this.getCardNum(cj);
                    if (cNum === cNumj) {
                        mul.push(cj);
                        cards.splice(_j, 1);
                        _j--;
                    }
                }
                if (mul.length > 0) {
                    mul.unshift(c);
                    cards.splice(_i, 1);
                    _i--;
                    mulCards.push(mul);
                } else {
                    for (let _j = _i + 1; _j < cards.length; _j++) {
                        const cj1 = cards[_j],
                            cNumj1 = this.getCardNum(cj1);
                        if (cNum + cNumj1 === 14) {
                            mul.push(cj1);
                            cards.splice(_j, 1);
                            _j--;
                            break;
                        }
                    }
                    if (mul.length > 0) {
                        mul.unshift(c);
                        cards.splice(_i, 1);
                        _i--;
                        mulCards.push(mul);
                    }
                }
            }
        }
        let sing = [];
        cards.map(cds => { sing.push([cds]) });
        if (rule.Allow7AsKing) {
            sumCard = mulCards.sort((a, b) => b.length - a.length).concat(sing).concat(wangBy7).concat(wang);
        } else {
            sumCard = mulCards.sort((a, b) => b.length - a.length).concat(sing).concat(wang);
        }
        cc.log("LLL++排序SumCard", JSON.stringify(sumCard), first);
        return sumCard;
    }

    majiang.CardCount = function (pl) {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if (pl.mjhand) {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    //容错
    majiang.setFlowerImg = function () { }
    majiang.setJiaZhuNum = function () { }
    majiang.canHu = function () { }
    majiang.canTing = function () { }
    majiang.canChi = function () { }
    majiang.canGang1 = function () { return [] }
    majiang.isCardFlower = function () { return false }
    //是否是混子
    majiang.isEqualHunCard = function (card) {
        return card == 200;
    }

    if (typeof (MjClient) != "undefined") {
        MjClient.majiang_red20 = majiang;
    }
    else {
        module.exports = majiang;
        //DoTest();
    }
})();
