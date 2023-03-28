function Red20_GameOver(node) {
    this.node = node;
    // @property(cc.Node)
    this.userNodes = null;

    // @property(cc.Prefab)
    this.Card = null;

    // @property(cc.Prefab)
    this.Weaves = null;

    //正分字体
    // @property(cc.Font)
    this.positiveFont = null;

    //负分字体
    // @property(cc.Font)
    this.negativeFont = null;


    this.EventNextGame = () => { };
    this.handCardsNode = [];
    this.weavesNode = [];
    this.players = [];

    this.cardAtlas = null;

    onReset = function () {
        this.userNodes.children.forEach(child => {
            child.active = false;
            child.getChildByName('banker').active = false;
            let handCards = child.getChildByName('handCards');
            handCards.removeAllChildren();
            let weaves = child.getChildByName('weaves');
            weaves.removeAllChildren();
            child.getChildByName('huCard').active = false;
            child.getChildByName('base').getComponent(cc.Label).string = '';

            let otherFan = child.getChildByName('scrollview').getComponent(cc.ScrollView).content.getChildByName('item');
            otherFan.getComponent(cc.Label).string = '';
            child.getChildByName('fan').getComponent(cc.Label).string = '';

            this.handCardsNode.push(handCards);
            this.weavesNode.push(weaves);
        })
    }

    loadAvatar = function (ava, url) {
        if (!!url) {
            let type = '';
            const extName = url.substr(-3, 3).toLowerCase();
            if (extName === 'jpg' || extName === 'png') {
                type = extName;
            }
            cc.loader.load({ url, type }, (err, tex) => {
                cc.log('加载小结算头像+++++++++++', err, url, type);
                if (err) cc.error(err);
                else {
                    cc.loader.setAutoRelease(tex.url, true);
                    if (cc.isValid(this.node) && cc.isValid(ava))
                        ava.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                }
            })
        }
    }

    onInit = function (cardAtlas, users, data, gameBase) {
        cc.log('小结算界面++++++++++++++', cardAtlas);
        if (gameBase.IsReplayMode) this.node.getChildByName('nextGame').active = false;
        else this.node.getChildByName('nextGame').active = true;

        this.node.getChildByName('roomID').getComponent(cc.Label).string = `房间号:${gameBase.RoomID}`;
        this.node.getChildByName('time').getComponent(cc.Label).string = new Date().format('yyyy-MM-dd hh:mm:ss');


        this.cardAtlas = cardAtlas;
        this.onReset();

        this.userNodes.children.forEach((child, index) => {
            let user = users[index];
            this.players.push(child);
            if (user) {
                child.active = true;
                child.getChildByName('banker').active = index === gameBase.banker;
                let userInfo = child.getChildByName('userInfo');
                userInfo.getChildByName('NickName').getComponent(cc.Label).string = Utils.clampString(user.NickName, 8);
                let ava = userInfo.getChildByName('AvatarPanel').getChildByName('Mask').getChildByName('Avatar');
                this.loadAvatar(ava, user.AvatarUrl);
            }
        })

        //获取基础番型
        let baseData = [];
        data.Base.forEach((base, index) => {
            if (base.length > 0) {
                baseData.push(base);
            } else {
                let str = [];
                let len = data.Kings[index].length;
                if (len > 0) str.push(['王', len]);
                let pengLen = 0;
                let gangLen = 0;
                if (data.Weaves[index]) {
                    data.Weaves[index].forEach(value => {
                        if (value.length === 3) {
                            pengLen += 1;
                        }
                        else if (value.length === 4) {
                            gangLen += 1;
                        }
                    })
                }
                if (pengLen > 0) str.push(['碰', pengLen]);
                //杠是2番
                if (gangLen > 0) str.push(['杠', gangLen * 2]);

                baseData.push(str);
            }
        })

        //番型
        let fan = [0, 0, 0];
        baseData.forEach((base, index) => {
            let str = '';
            base.forEach(value => {
                fan[index] += value[1];
                if (value[0] === '杠') {
                    str += `${value[1] / 2}${value[0]}` + ' \n ';
                } else {
                    str += `${value[1]}${value[0]}` + ' \n';
                }
            })
            this.players[index].getChildByName('base').getComponent(cc.Label).string = str;
        })
        data.Other.forEach((other, index) => {
            let str = '';
            other.forEach(value => {
                if (!value) return;
                fan[index] += value[1];
                str += `${value[0]}` + ' \n';
            })
            let otherFan = this.players[index].getChildByName('scrollview').getComponent(cc.ScrollView).content.getChildByName('item');
            otherFan.getComponent(cc.Label).string = str;
            //番
            if (data.Winner === index || data.Scores[index] > 0)
                this.players[index].getChildByName('fan').getComponent(cc.Label).string = fan[index] > 0 ? `${fan[index]}` : '0';
            else {
                this.players[index].getChildByName('fan').getComponent(cc.Label).string = '';
            }
        })
        //分数
        data.Scores.forEach((score, index) => {
            this.players[index].getChildByName('score').getComponent(cc.Label).string = `:${Utils.gameScoreWrapper(score)}`;
            if (score >= 0) {
                this.players[index].getChildByName('score').getComponent(cc.Label).font = this.positiveFont;
            } else {
                this.players[index].getChildByName('score').getComponent(cc.Label).font = this.negativeFont;
            }
        })
        //胡牌取手牌最后一张
        let huCardData = data.Card;
        if (data.Winner !== null && !data.Card) {
            let cards = data.Cards[data.Winner];
            huCardData = cards[cards.length - 1];
        }
        //剩余手牌
        data.Cards.forEach((cards, index) => {
            let newCards = cards;
            if (index === data.Winner && data.Card) {
                let huCard = cards.find(val => {
                    return val === data.Card;
                })
                if (!huCard) {
                    newCards.push(data.Card);
                }
            }
            this.onUserHandCards(index, newCards);
        });

        //王
        data.Kings.forEach((king, index) => {
            this.onUserWeavesCard(index, king, 'wang')
        })
        //weaves
        data.Weaves.forEach((value, index) => {
            value.forEach(cards => {
                this.onUserWeavesCard(index, cards, 'weaves')
            })
        })
        //胡牌
        if (data.Winner !== null) {
            // if (!data.Card) {
            //     let cards = data.Cards[data.Winner];
            //     data.Card = cards[cards.length - 1];
            // }
            let node = this.players[data.Winner].getChildByName('huCard');
            node.active = true;
            node.getComponent(Card).Data = huCardData;
            node.getComponent(Card).showFace = this.getSpriteFrameByCard(huCardData);
        }

        if (!gameBase.IsReplayMode) {
            let countDown = this.node.getChildByName('nextGame').getChildByName('countDown').getComponent(cc.Label);
            countDown.string = '(5s)'
            let curDate = Date.now();

            let time = 5;
            let timer = setInterval(() => {
                if (gameBase.isStop) {
                    curDate += 1000;
                    return;
                }
                let space = time - Math.floor((Date.now() - curDate) / 1000)
                if (cc.isValid(this.node)) {
                    if (space < 0) {
                        clearInterval(timer);
                        return;
                        //时间到了就服务器自动准备
                        // if (this.EventNextGame) this.EventNextGame();
                        // if (cc.isValid(this.node)) this.node.destroy();
                    }
                    countDown.string = `(${space}s)`
                } else {
                    clearInterval(timer);
                }
            }, 1 * 1000);
        }
    }

    onUserHandCards = function (viewPos, handCards) {
        const cardSort = (cardsData) => {
            try {
                cardsData.sort((a, b) => {
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

                //获取碰牌和对子
                const getDui = (leftCardData) => {
                    //碰杠对子
                    let totalPeng = new Map();
                    let len = leftCardData.length;
                    for (let k = 0; k < len; k++) {
                        let peng = [];
                        peng.push(leftCardData[k]);
                        let pengNum = this.getCardNum(leftCardData[k]);
                        for (let i = k + 1; i < len; i++) {
                            if (pengNum === this.getCardNum(leftCardData[i])) {
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
                    let dui14Arr = [];
                    len = lastCard.length;
                    for (let k = 0; k < len; k++) {
                        let dui = [];
                        dui.push(lastCard[k]);
                        let duiNum = this.getCardNum(lastCard[k]);
                        for (let i = k + 1; i < len; i++) {
                            if ((duiNum + this.getCardNum(lastCard[i])) === 14) {
                                dui.push(lastCard[i]);
                            }
                        }
                        if (dui.length === 2 && dui14.indexOf(dui[0]) === -1 && dui14.indexOf(dui[1]) === -1) {
                            dui14 = dui14.concat(dui);
                            dui14Arr.push(dui);
                        }
                    }

                    //去掉对子
                    cardsData = lastCard.filter(card => {
                        if (dui14.indexOf(card) !== -1) return false;
                        else return true;
                    })

                    //合并碰和对
                    let pengAndDui = [];
                    totalPeng.forEach((value) => {
                        pengAndDui.push(value);
                    })
                    pengAndDui = pengAndDui.concat(dui14Arr);
                    return pengAndDui
                }

                let newCards = [];
                let pengDui = getDui(cardsData);
                newCards = pengDui.concat(cardsData);
                return newCards;
            } catch (error) {
                cc.log('结算手牌跑错')
                return handCards;
            }
        }
        let newCards = cardSort(handCards);
        newCards.forEach((card, index) => {
            let weaves = cc.instantiate(this.Weaves);
            weaves.getChildByName('weaves').removeAllChildren();
            if (!(card instanceof Array)) card = [card];
            card.forEach(card => {
                let node = cc.instantiate(this.Card);
                node.getComponent(Card).Data = card;
                node.getComponent(Card).showFace = this.getSpriteFrameByCard(card);
                weaves.getChildByName('weaves').addChild(node);
            })
            weaves.getComponent(cc.Layout).updateLayout;
            weaves.getComponent(ChiCardLayout).updateSpacingY(4, -65);
            this.handCardsNode[viewPos].addChild(weaves);
            this.handCardsNode[viewPos].getComponent(cc.Layout).updateLayout();
        })
    }

    //吃碰
    onUserWeavesCard = function (viewPos, cards, type) {
        if (type === 'wang') {
            let Wang7 = cards.filter(card => {
                return this.getCardNum(card) === 7;
            })
            let Wang = cards.filter(card => {
                return this.getCardColor(card) === 4;
            })
            if (Wang.length > 0) this.onUserAddWeaves(viewPos, Wang);

            if (Wang7.length > 0) {
                this.onUserAddWeaves(viewPos, Wang7);
            }
        } else {
            this.onUserAddWeaves(viewPos, cards);
        }
    }

    onUserAddWeaves = function(viewPos, cards) {
        let weaves = cc.instantiate(this.Weaves);
        weaves.getChildByName('weaves').removeAllChildren();
        cards.forEach(card => {
            let node = cc.instantiate(this.Card);
            node.getComponent(Card).Data = card;
            node.getComponent(Card).showFace = this.getSpriteFrameByCard(card);
            weaves.getChildByName('weaves').addChild(node);
        })
        weaves.getComponent(cc.Layout).updateLayout;
        weaves.getComponent(ChiCardLayout).updateSpacingY(4, -65);
        this.weavesNode[viewPos].addChild(weaves);
        this.weavesNode[viewPos].getComponent(cc.Layout).updateLayout();
    }

    getCardNum = function(card) {
        let cardNum = card % 16;
        return cardNum;
    }

    getCardColor = function(card) {
        let cardColor = Math.floor(card / 16);
        return cardColor;
    }

    //获取资源
    getSpriteFrameByCard = function(card) {
        if (card === -1) {
            return this.cardAtlas.getSpriteFrame(`back`)
        }
        let cardNum = card % 16;
        let cardColor = Math.floor(card / 16);
        return this.cardAtlas.getSpriteFrame(`${cardColor}-${cardNum}`)
    }

    onClickNextGame = function(event) {
        if (this.EventNextGame) this.EventNextGame();
        this.node.destroy();
    }
}