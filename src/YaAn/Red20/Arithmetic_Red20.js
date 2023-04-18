(function () {
    let majiang = {};
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
        let rule = MjClient.data.sData.tData.Rule;
        cardsData.sort((a, b) => {
            if (majiang.getCardNum(b) === majiang.getCardNum(a)) {
                //两都为红
                if (majiang.getCardColor(a) % 2 === 0 && majiang.getCardColor(b) % 2 === 0) {
                    return majiang.getCardColor(a) - majiang.getCardColor(b);
                } else if (majiang.getCardColor(a) % 2 === 0) {
                    return -1;
                } else if (majiang.getCardColor(b) % 2 === 0) {
                    return 1;
                } else {
                    return majiang.getCardColor(a) - majiang.getCardColor(b);
                }
            } else {
                //从大到小
                return majiang.getCardNum(b) - majiang.getCardNum(a)
            }
        });
        let wang = cardsData.filter(card => {
            return majiang.getCardColor(card) === 4;
        })

        //获取碰牌和对子
        const getDui = (leftCardData) => {
            //碰杠对子
            let totalPeng = new Map();
            let len = leftCardData.length;
            for (let k = 0; k < len; k++) {
                let peng = [];
                peng.push(leftCardData[k]);
                let pengNum = majiang.getCardNum(leftCardData[k]);
                for (let i = k + 1; i < len; i++) {
                    if (pengNum === majiang.getCardNum(leftCardData[i])) {
                        peng.push(leftCardData[i]);
                    }
                }
                if (peng.length >= 2 && !totalPeng.has(pengNum)) {
                    totalPeng.set(pengNum, peng);
                }
            }
            //去掉碰杠
            let lastCard = leftCardData.filter(card => {
                let out = false;
                totalPeng.forEach((value) => {
                    if (value.indexOf(card) !== -1) {
                        out = true;
                    }
                })
                if (out) return false;
                else return true;
            })
            //对子
            let dui14 = [];
            len = lastCard.length;
            for (let k = 0; k < len; k++) {
                let dui = [];
                dui.push(lastCard[k]);
                let duiNum = majiang.getCardNum(lastCard[k]);
                for (let i = k + 1; i < len; i++) {
                    if ((duiNum + majiang.getCardNum(lastCard[i])) === 14) {
                        dui.push(lastCard[i]);
                    }
                }
                if (dui.length === 2 && dui14.indexOf(dui[0]) === -1 && dui14.indexOf(dui[1]) === -1) {
                    dui14 = dui14.concat(dui);
                }
            }
            //碰和对
            let pengAndDui = [];
            totalPeng.forEach((value) => {
                pengAndDui = pengAndDui.concat(value);
            })
            pengAndDui = pengAndDui.concat(dui14);


            cardsData = leftCardData.filter(card => {
                if (pengAndDui.indexOf(card) !== -1) return false;
                else return true;
            })
            return pengAndDui
        }

        let noWang = [];
        let newCards = [];
        if (rule.Allow7AsKing) {
            let wangBy7 = cardsData.filter(card => {
                return majiang.getCardNum(card) === 7;
            })
            noWang = cardsData.filter(card => {
                return majiang.getCardColor(card) !== 4 && majiang.getCardNum(card) !== 7
            })
            let pengDui = getDui(noWang);

            newCards = pengDui.concat(cardsData).concat(wangBy7).concat(wang);

        } else {
            noWang = cardsData.filter(card => {
                return majiang.getCardColor(card) !== 4;
            })
            let pengDui = getDui(noWang);
            newCards = pengDui.concat(cardsData).concat(wang);
        }
        cc.log('------------排序之后的牌------------',JSON.stringify(newCards))
        return newCards;
    }

    //叠牌 找相加等于14的
    majiang.StackCards = function (cards) {
        let rule = MjClient.data.sData.tData.Rule;
        let sumCard = [];
        cards = cards.concat([]);
        for (let i = 0; i < cards.length; i++) {
            let cNumI = this.getCardNum(cards[i]), flg = true;
            if (cNumI === 15 || (rule.Allow7AsKing && cNumI === 7)) {
                sumCard.push([cards[i]])
                cards.splice(i, 1);
                --i;
                continue;
            }
            for (let j = i + 1; j < cards.length; j++) {
                if (cNumI + this.getCardNum(cards[j]) === 14) {
                    sumCard.push([cards[i], cards[j]])
                    cards.splice(i, 1);
                    --j;
                    cards.splice(j, 1);
                    --i;
                    flg = false;
                    break;
                }
            }
            if (flg) {
                sumCard.push([cards[i]]);
                cards.splice(i, 1);
                --i;
            }
        }
        cc.log("LLL++排序SumCard", JSON.stringify(sumCard));
        return sumCard;
    }

    majiang.CardCount = function (pl)
    {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand)
        {
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
    majiang.isEqualHunCard = function(card)
    {
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
