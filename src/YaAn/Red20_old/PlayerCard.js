function PlayerCard(cardMgr, viewPos) {
    this.cardMgr = cardMgr
    this.viewPos = viewPos

    this.tableCardPool = new cc.NodePool()
    this.handCardPool = new cc.NodePool()
    this.chiCardsPool = new cc.NodePool()
    reorderTimer = null;

    this.isHuPai = false;
    getIsHuPai = function () {
        return this.isHuPai;
    }

    //回收
    giveBackNodes = function (node, pool) {
        for (; ;) {
            if (node.childrenCount === 0) break;
            pool.put(node.children[0])
        }
        node.stopAllActions();
        node.removeAllChildren();
    }

    giveBackCard = function (node, poolType) {
        if (poolType === 'hand') this.handCardPool.put(node);
        else if (poolType === 'chi') this.chiCardsPool.put(node);
        else if (poolType === 'table') this, this.tableCardPool.put(node);
        else {
            node.destroy();
        }
    }

    //获取牌资源
    getSpriteFrameByCard = function (card) {
        return this.cardMgr.getSpriteFrameByCard(card)
    }

    getCardNum = function (card) {

        return this.cardMgr.getCardNum(card);
    }
    getCardColor = function (card) {
        return this.cardMgr.getCardColor(card);
    }

    setCardFace = function (node, card) {
        if (node === null) {
            cc.error('setCardFace', card);
            return;
        }

        let mahjong = node.getComponent(Card)
        if (mahjong) {
            mahjong.Data = card
            if (card !== null) {
                mahjong.showFace = this.getSpriteFrameByCard(card)
            }
        }
        return mahjong
    }

    //构造函数
    constructor = function (cardMgr, viewPos) {
        this.cardMgr = cardMgr
        this.viewPos = viewPos
    }

    //重置数据
    onReset = function () {
        this.isHuPai = false;
        switch (this.viewPos) {
            case PlayerPositon.Bottom:
                this.giveBackNodes(this.cardMgr.BottomHandCards, this.handCardPool)
                this.giveBackNodes(this.cardMgr.BottomOutCards, this.tableCardPool)
                this.giveBackNodes(this.cardMgr.BottomUserChiCards, this.chiCardsPool)
                break;
            case PlayerPositon.Top:
                this.giveBackNodes(this.cardMgr.TopHandCards, this.handCardPool)
                this.giveBackNodes(this.cardMgr.TopOutCards, this.tableCardPool)
                this.giveBackNodes(this.cardMgr.TopUserChiCards, this.chiCardsPool)
                break;
            case PlayerPositon.Right:
                this.giveBackNodes(this.cardMgr.RightHandCards, this.handCardPool)
                this.giveBackNodes(this.cardMgr.RightOutCards, this.tableCardPool)
                this.giveBackNodes(this.cardMgr.RightUserChiCards, this.chiCardsPool)
                break;
            case PlayerPositon.Left:
                this.giveBackNodes(this.cardMgr.LeftHandCards, this.handCardPool)
                this.giveBackNodes(this.cardMgr.LeftOutCards, this.tableCardPool)
                this.giveBackNodes(this.cardMgr.LeftUserChiCards, this.chiCardsPool)
                break;
        }
    }

    //添加出牌
    addTableCard = function (card, opacity = 255) {
        let node = null;
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                node = cc.instantiate(this.cardMgr.OtherCard);
                this.setCardFace(node, card);
                node.y = 0;
                node.opacity = opacity;
                this.cardMgr.BottomOutCards.addChild(node);
                break;
            }
            case PlayerPositon.Top: {
                node = cc.instantiate(this.cardMgr.OtherCard);
                this.setCardFace(node, card);
                node.y = 0;
                node.opacity = opacity;
                this.cardMgr.TopOutCards.addChild(node);
                break;
            }
            case PlayerPositon.Right: {
                node = cc.instantiate(this.cardMgr.OtherCard);
                this.setCardFace(node, card);
                node.y = 0;
                node.opacity = opacity;
                this.cardMgr.RightOutCards.addChild(node);
                break;
            }
            case PlayerPositon.Left: {
                node = cc.instantiate(this.cardMgr.OtherCard);
                this.setCardFace(node, card);
                node.y = 0;
                node.opacity = opacity;
                this.cardMgr.LeftOutCards.insertChild(node, 0);
                break;
            }
        }
        return node;
    }

    //处理断线恢复(其他玩家操作后移除放入table中的card)
    onRemoveUserOutCard = function (card) {
        console.log('LLL++移除outCard', card)
        let removeNode = (parent) => {
            let removeCard = parent.children.find(child => {
                return child.getComponent(Card).Data === card;
            })
            if (removeCard) {
                parent.removeChild(removeCard);
                removeCard.destroy();
                parent.getComponent(cc.Layout).updateLayout();
            }
        }
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                removeNode(this.cardMgr.BottomOutCards);
                break;
            }
            case PlayerPositon.Top: {
                removeNode(this.cardMgr.TopOutCards);
                break;
            }
            case PlayerPositon.Right: {
                removeNode(this.cardMgr.RightOutCards);
                break;
            }
            case PlayerPositon.Left: {
                removeNode(this.cardMgr.LeftOutCards);
                break;
            }
        }
    }

    //移除手牌
    onRemoveUserHandCard = function (cards, isDestroy = true) {
        let removeCardNode = [];

        const otherRemoveCard = (parentLayout) => {
            if (!this.cardMgr.IsReplayMode) {
                let len = cards;
                for (let i = 0; i < len; i++) {
                    if (isDestroy) {
                        let index = parentLayout.childrenCount - 1;
                        let node = parentLayout.children[index];
                        node.destroy();
                    } else {
                        let index = parentLayout.childrenCount - 1;
                        let node = null;
                        for (let k = index; k >= 0; k--) {
                            if (!node && !parentLayout.children[k].getComponent(Card).isRemove) {
                                node = parentLayout.children[k];
                                cc.log('移除+++++++ Left')
                            }
                        }
                        if (!node) node = parentLayout.children[index - i];

                        // node.opacity = 0;
                        node.getComponent(Card).isRemove = true;
                        removeCardNode.push(node);
                    }
                }
            } else {
                parentLayout.children.forEach(child => {
                    if (child.getComponent(Card).Data === cards) {
                        removeCardNode.push(child);
                    }
                })
                if (isDestroy) {
                    removeCardNode.forEach(node => {
                        node.destroy();
                    })
                } else {
                    removeCardNode.forEach(node => {
                        node.getComponent(Card).isRemove = true;
                        node.active = false;
                    })
                }
                parentLayout.getComponent(cc.Layout).updateLayout();
            }
        }
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                //还在播动画
                cc.log('玩家手牌Action', this.reorderTimer, cards, this.cardMgr.selfHandCards);
                if (this.reorderTimer !== null || (this.cardMgr.startTouResultTimer && this.cardMgr.IsReplayMode)) {
                    this.reorderTimer && clearTimeout(this.reorderTimer);
                    this.reorderTimer = null;

                    clearTimeout(this.cardMgr.startTouResultTimer);
                    this.cardMgr.startTouResultTimer = null;
                    this.cardMgr.startTouResultCard = [];
                    this.cardMgr.startTouResultCard.forEach(val => {
                        if (this.cardMgr.selfHandCards.indexOf(val) === -1) {
                            this.cardMgr.selfHandCards.push(val);
                        }
                    })
                    this.recoveryHandCards();
                    cc.log('AAAAA+++', this.cardMgr.selfHandCards)
                }

                this.cardMgr.BottomHandCards.children.forEach(child => {
                    let list = child.children.filter(node => {
                        return node.getComponent(Card).Data === cards;
                    })
                    list.forEach(node => {
                        if (isDestroy) {
                            child.removeChild(node);
                            node.destroy();
                        } else {
                            // node.opacity = 0;
                            node.getComponent(Card).isRemove = true;
                            removeCardNode.push(node);
                        }
                    })
                })
                let removeLayout = this.cardMgr.BottomHandCards.children.filter(child => {
                    return child.childrenCount === 0;
                })
                for (let cardNode of removeLayout) {
                    this.cardMgr.BottomHandCards.removeChild(cardNode);
                    cardNode.destroy();
                }
                //移除手牌
                // this.cardMgr.performWidget();
                this.cardMgr.updateRedPointCount();
                this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();
                let bottomCards = this.cardMgr.selfHandCards.slice(0);
                bottomCards.forEach(val => {
                    let index = this.cardMgr.selfHandCards.findIndex(card => card === cards);
                    if (index !== -1)
                        this.cardMgr.selfHandCards.splice(index, 1);
                })
                cc.log('玩家手牌移除', this.cardMgr.selfHandCards, removeCardNode.length);

                break;
            }
            case PlayerPositon.Top: {
                otherRemoveCard(this.cardMgr.TopHandCards);
                break;
            }
            case PlayerPositon.Right: {
                otherRemoveCard(this.cardMgr.RightHandCards);
                break;
            }
            case PlayerPositon.Left: {
                otherRemoveCard(this.cardMgr.LeftHandCards);
                cc.log('添加出牌 +++++ Hand', removeCardNode)
                break;
            }
        }
        return removeCardNode;
    }


    //手中最后一张牌
    getLastCard = function (card) {
        let node = null;
        const otherLastCard = (parentLayout) => {
            if (this.cardMgr.IsReplayMode) {
                node = parentLayout.children.find(child => {
                    return child.getComponent(Card).Data === card;
                })
            } else {
                let index = parentLayout.childrenCount - 1;
                for (let i = index; i >= 0; i--) {
                    if (!node && !parentLayout.children[i].getComponent(Card).isRemove) {
                        node = parentLayout.children[i];
                    }
                }
                if (!node) node = parentLayout.children[index]
            }
        }
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                break;
            }
            case PlayerPositon.Top: {
                otherLastCard(this.cardMgr.TopHandCards);
                break;
            }
            case PlayerPositon.Right: {
                otherLastCard(this.cardMgr.RightHandCards);
                break;
            }
            case PlayerPositon.Left: {
                otherLastCard(this.cardMgr.LeftHandCards);
                break;
            }
        }
        return node;
    }

    //暗杠显示牌面
    onUserShowAnGang = function (cards) {
        let addWeaves = (parent) => {
            let gangNode = parent.children.find(child => {
                let CardLayout = child.getComponent(ChiCardLayout);
                if (CardLayout) {
                    return (CardLayout.Type === 'gang' && CardLayout.IsShowBack)
                }
            });
            //暗杠显示牌面
            if (gangNode) {
                cc.log('暗杠显示牌面')
                gangNode.getChildByName('weaves').children.forEach((child, index) => {
                    this.setCardFace(child, cards[index] || -1);
                })
                gangNode.getComponent(ChiCardLayout).IsShowBack = false;
                gangNode.getComponent(cc.Layout).updateLayout();
            }
        }
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                break;
            }
            case PlayerPositon.Top: {
                addWeaves(this.cardMgr.TopUserChiCards)
                break;
            }
            case PlayerPositon.Right: {
                addWeaves(this.cardMgr.RightUserChiCards)
                break;
            }
            case PlayerPositon.Left: {
                addWeaves(this.cardMgr.LeftUserChiCards);
                break;
            }
        }
    }

    //玩家杠牌
    onUserAddGang = function (cards, type, isShow = true) {
        let weaveaNode = [];
        let addWeaves = (parent, childNode, childIndex, insertIndex = null) => {
            //弯杠
            if (type === WeaveType.WanGang) {
                //杠最后一张牌
                let findLastCard = (pengLayout) => {
                    let lastCard = null;
                    cards.forEach(card => {
                        if (lastCard) return;
                        let lastNode = pengLayout.getChildByName('weaves').children.find(child => {
                            return child.getComponent(Card).Data === card;
                        })
                        if (!lastNode) {
                            lastCard = card;
                        }
                    })
                    return lastCard;
                }
                let pengNode = parent.children.find(child => {
                    let CardLayout = child.getComponent(ChiCardLayout);
                    if (CardLayout) {
                        return (CardLayout.Data === this.getCardNum(cards[0]) && CardLayout.Type === 'peng')
                    }
                });
                //碰转杠
                if (pengNode) {
                    let card = findLastCard(pengNode);
                    let child = cc.instantiate(this.cardMgr.OtherCard);

                    if (childIndex === 0)
                        pengNode.getChildByName('weaves').insertChild(child, 0);
                    else
                        pengNode.getChildByName('weaves').addChild(child);

                    this.setCardFace(child, card);
                    pengNode.getComponent(ChiCardLayout).updateSpacingY();
                    pengNode.getComponent(ChiCardLayout).Type = 'gang';
                    pengNode.getComponent(cc.Layout).updateLayout();

                    child.opacity = isShow === true ? 255 : 0;
                    weaveaNode.push(child);
                }
                //暗碰转杠
                else {

                    //自己 添加一张牌
                    if (this.viewPos === PlayerPositon.Bottom) {
                        let anPengNode = parent.children.find(child => {
                            let CardLayout = child.getComponent(ChiCardLayout);
                            if (CardLayout) {
                                return (CardLayout.Data === this.getCardNum(cards[0]) && CardLayout.Type === 'anpeng')
                            }
                        });
                        if (anPengNode) {
                            let card = findLastCard(anPengNode);
                            let child = cc.instantiate(this.cardMgr.OtherCard);

                            if (childIndex === 0)
                                anPengNode.getChildByName('weaves').insertChild(child, 0);
                            else
                                anPengNode.getChildByName('weaves').addChild(child);

                            this.setCardFace(child, card);
                            anPengNode.getComponent(ChiCardLayout).updateSpacingY();
                            anPengNode.getComponent(cc.Layout).updateLayout();
                            anPengNode.getComponent(ChiCardLayout).Type = 'gang';

                            child.opacity = isShow === true ? 255 : 0;
                            weaveaNode.push(child);
                        }
                    }
                    //其他玩家 牌背显示为牌面
                    else {
                        let anPengNode = parent.children.find(child => {
                            let CardLayout = child.getComponent(ChiCardLayout);
                            if (CardLayout) {
                                return CardLayout.Type === 'anpeng'
                            }
                        });
                        if (anPengNode) {
                            anPengNode.getChildByName('weaves').removeAllChildren();
                            cards.forEach((card, index) => {
                                let child = cc.instantiate(this.cardMgr.OtherCard);

                                if (childIndex === 0)
                                    anPengNode.getChildByName('weaves').insertChild(child, 0);
                                else
                                    anPengNode.getChildByName('weaves').addChild(child);

                                this.setCardFace(child, card);
                                if (index === cards.length - 1) {
                                    child.opacity = isShow === true ? 255 : 0;
                                    weaveaNode.push(child);
                                }
                            })
                            anPengNode.getComponent(ChiCardLayout).updateSpacingY();
                            anPengNode.getComponent(cc.Layout).updateLayout();
                            anPengNode.getComponent(ChiCardLayout).Type = 'gang';
                        }
                    }
                }
            }
            //暗杠/点杠
            else {
                let node = this.chiCardsPool.get()
                if (node === null) {
                    node = cc.instantiate(childNode);
                }
                node.getChildByName('weaves').removeAllChildren();

                //偷牌阶段暗杠不显示
                if (cards.length === 0) {
                    cards = [-1, -1, -1, -1];
                }
                cards.forEach(card => {
                    let child = cc.instantiate(this.cardMgr.OtherCard);
                    this.setCardFace(child, card);

                    if (childIndex === 0)
                        node.getChildByName('weaves').insertChild(child, 0);
                    else
                        node.getChildByName('weaves').addChild(child);

                    child.opacity = isShow === true ? 255 : 0;
                    weaveaNode.push(child);
                })
                node.getComponent(ChiCardLayout).updateSpacingY();
                node.getComponent(cc.Layout).updateLayout();
                node.getComponent(ChiCardLayout).Type = 'gang';
                //暗杠显示牌背
                if (cards[0] === -1) node.getComponent(ChiCardLayout).IsShowBack = true;

                node.getComponent(ChiCardLayout).Data = this.getCardNum(cards[0]);
                if (insertIndex !== null) parent.insertChild(node, insertIndex);
                else parent.addChild(node);
            }
            parent.getComponent(cc.Layout).updateLayout();
        }

        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                addWeaves(this.cardMgr.BottomUserChiCards, this.cardMgr.BRChiCard, 0);
                break;
            }
            case PlayerPositon.Top: {
                addWeaves(this.cardMgr.TopUserChiCards, this.cardMgr.LTChiCard, 0)
                break;
            }
            case PlayerPositon.Right: {
                addWeaves(this.cardMgr.RightUserChiCards, this.cardMgr.BRChiCard, 0, 0)
                break;
            }
            case PlayerPositon.Left: {
                addWeaves(this.cardMgr.LeftUserChiCards, this.cardMgr.LTChiCard, 0);
                break;
            }
        }
        return weaveaNode;
    }

    //吃/碰/王
    onUserAddWeaves = function (cards, type, isShow = true) {
        let weaveaNode = [];
        let newCards = [];
        if (cards instanceof Array) {
            newCards = cards;
        } else {
            newCards.push(cards);
        }
        let addWeaves = (parent, childNode, childIndex, insertIndex = null) => {
            let wangCards = [];
            parent.children.forEach(child => {
                let CardLayout = child.getComponent(ChiCardLayout);
                if (CardLayout) {
                    if (CardLayout.Type === 'wang') {
                        wangCards.push(child);
                    }
                }
            });
            let wang7Cards = [];
            parent.children.forEach(child => {
                let CardLayout = child.getComponent(ChiCardLayout);
                if (CardLayout) {
                    if (CardLayout.Type === '7ToWang') {
                        wang7Cards.push(child);
                    }
                }
            });
            //添加
            if (type === "wang" && wangCards.length > 0) {
                let node = wangCards[0];
                if (newCards instanceof Array) {
                    newCards.forEach(card => {
                        let child = cc.instantiate(this.cardMgr.OtherCard);
                        if (childIndex === 0)
                            node.getChildByName('weaves').insertChild(child, 0);
                        else
                            node.getChildByName('weaves').addChild(child);
                        this.setCardFace(child, card);

                        child.opacity = isShow === true ? 255 : 0;
                        weaveaNode.push(child);
                    })
                }
                node.getComponent(ChiCardLayout).updateSpacingY();
                node.getComponent(cc.Layout).updateLayout();
                node.getComponent(ChiCardLayout).Data = -1;
            } else if (type === "7ToWang" && wang7Cards.length > 0) {
                let node = wang7Cards[0];
                if (newCards instanceof Array) {
                    newCards.forEach(card => {
                        let child = cc.instantiate(this.cardMgr.OtherCard);
                        if (childIndex === 0)
                            node.getChildByName('weaves').insertChild(child, 0);
                        else
                            node.getChildByName('weaves').addChild(child);

                        this.setCardFace(child, card);

                        child.opacity = isShow === true ? 255 : 0;
                        weaveaNode.push(child);
                    })
                }
                node.getComponent(ChiCardLayout).updateSpacingY();
                node.getComponent(cc.Layout).updateLayout();
                node.getComponent(ChiCardLayout).Data = -1;
            }
            //新加
            else {
                let node = this.chiCardsPool.get()
                if (node === null) {
                    node = cc.instantiate(childNode);
                }
                node.getChildByName('weaves').removeAllChildren();
                if (type !== 'anpeng' || (type === 'anpeng' && cards instanceof Array)) {
                    newCards.forEach(card => {
                        let child = cc.instantiate(this.cardMgr.OtherCard);
                        this.setCardFace(child, card);
                        if (childIndex === 0)
                            node.getChildByName('weaves').insertChild(child, 0);
                        else
                            node.getChildByName('weaves').addChild(child);

                        child.opacity = isShow === true ? 255 : 0;
                        weaveaNode.push(child);
                    })
                    node.getComponent(ChiCardLayout).updateSpacingY();
                    node.getComponent(cc.Layout).updateLayout();

                    node.getComponent(ChiCardLayout).Type = type;
                    if (type === 'peng' || type === 'anpeng') {
                        node.getComponent(ChiCardLayout).Data = this.getCardNum(cards[0]);
                    } else {
                        node.getComponent(ChiCardLayout).Data = -1;
                    }
                }
                //暗碰 其他玩家 数字 长度
                else {
                    for (let i = 0; i < cards; i++) {
                        let child = cc.instantiate(this.cardMgr.OtherCard);
                        this.setCardFace(child, -1);
                        if (childIndex === 0)
                            node.getChildByName('weaves').insertChild(child, 0);
                        else
                            node.getChildByName('weaves').addChild(child);

                        child.opacity = isShow === true ? 255 : 0;
                        weaveaNode.push(child);
                    }

                    node.getComponent(ChiCardLayout).updateSpacingY();
                    node.getComponent(cc.Layout).updateLayout()
                    node.getComponent(ChiCardLayout).Type = type;
                    node.getComponent(ChiCardLayout).Data = -1;
                }

                if (insertIndex !== null) parent.insertChild(node, insertIndex);
                else parent.addChild(node);
            }
            parent.getComponent(cc.Layout).updateLayout();
        }

        cc.log('添加吃碰杠')

        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                addWeaves(this.cardMgr.BottomUserChiCards, this.cardMgr.BRChiCard, 0);
                break;
            }
            case PlayerPositon.Top: {
                addWeaves(this.cardMgr.TopUserChiCards, this.cardMgr.LTChiCard, 0)
                break;
            }
            case PlayerPositon.Right: {
                addWeaves(this.cardMgr.RightUserChiCards, this.cardMgr.BRChiCard, 0, 0)
                break;
            }
            case PlayerPositon.Left: {
                addWeaves(this.cardMgr.LeftUserChiCards, this.cardMgr.LTChiCard, 0);
                break;
            }
        }
        return weaveaNode
    }

    //手牌重新排序
    /**
     * 
     * @param endPos 移动的牌<endpos，不移动（后进的牌）
     * @param isFirst 首次进牌需要对齐，后面不需要对齐
     */
    userHandCardReorder = function (endPos, isFirst) {
        cc.log('当前数量', endPos)
        let node = this.cardMgr.BottomHandCards.children;
        let len = node.length;
        // //先全部显示(避免新进牌还在播动画中)
        node.forEach(child => {
            if (!child.active) {
                child.active = true;
            }
            child.children.forEach(val => {
                val.opacity = 255;
            })
        })
        let getDataNum = (node) => {
            return node.getComponent(Card).Num;
        }

        //查找重复的
        let repeatCard = [];
        for (let i = 0; i < node.length; i++) {
            let index = {};

            let isPass = repeatCard.find(val => {
                return val.end.indexOf(i) !== -1
            })
            if (isPass) continue;
            index.start = i;
            index.end = [];
            if (getDataNum(node[i].children[0]) === 15 || (this.cardMgr.Rule.Allow7AsKing && getDataNum(node[i].children[0]) === 7)) continue;
            //单个的或相等的
            if (node[i].childrenCount === 1 || getDataNum(node[i].children[0]) === getDataNum(node[i].children[1])) {
                for (let j = i + 1; j < node.length; j++) {
                    if (node[j].childrenCount === 1 && getDataNum(node[i].children[0]) === getDataNum(node[j].children[0]) && node[j].active) {
                        isPass = repeatCard.find(val => {
                            return val.end.indexOf(j) !== -1
                        })
                        if (!isPass) index.end.push(j);
                    }
                }
            }
            if (index.end.length > 0) {
                repeatCard.push(index);
                // i += index.end.length;
            }
        }
        console.log("LLL++排序repeatCard", repeatCard)
        //start:父节点index end：需要移动的牌的index
        repeatCard.forEach(value => {
            let parent = node[value.start];
            value.end.forEach(index => {
                //只操作新进的牌
                if (index < endPos) return;

                let child = cc.instantiate(node[index].children[0]);
                child.getComponent(Card).Data = node[index].children[0].getComponent(Card).Data;
                node[index].active = false;
                parent.insertChild(child, 0);
            })
        })

        for (let k = 0; k < len; k++) {
            node.forEach((child, index) => {
                if (!child.active) {
                    // console.log("LLL++destroy", index)
                    child.destroy();
                    this.cardMgr.BottomHandCards.removeChild(child);
                }
            })
        }
        this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();

        //找相加等于14的
        let sumCard = [];
        for (let i = 0; i < node.length; i++) {
            let index = {};
            let isPass = sumCard.find(val => {
                return val.end === i
            })
            if (isPass) continue;

            index.start = i;
            index.end = -1;
            if (getDataNum(node[i].children[0]) === 15 || (this.cardMgr.Rule.Allow7AsKing && getDataNum(node[i].children[0]) === 7)) continue;

            if (node[i].childrenCount === 1 && node[i].active) {
                for (let j = i + 1; j < node.length; j++) {
                    if (node[j].childrenCount === 1 && node[j].active && (getDataNum(node[i].children[0]) + getDataNum(node[j].children[0]) === 14)) {
                        index.end = j;
                        break;
                    }
                }
            }
            if (index.end !== -1) {
                let endNode = sumCard.find(val => {
                    return val.end === index.end;
                })
                if (!endNode) sumCard.push(index);
            }
        }
        console.log("LLL++排序SumCard", sumCard)

        sumCard.forEach(value => {
            let parent = node[value.start];
            //只操作新进的牌
            if (value.end < endPos) return;

            let child = cc.instantiate(node[value.end].children[0]);
            child.getComponent(Card).Data = node[value.end].children[0].getComponent(Card).Data;
            node[value.end].active = false;
            // cc.log('LLL++destroy++False', value.end)
            parent.insertChild(child, 0);
        })

        for (let k = 0; k < len; k++) {
            node.forEach((child) => {
                if (!child.active) {
                    // console.log("LLL++destroy+sum", index)
                    child.destroy();
                    this.cardMgr.BottomHandCards.removeChild(child);
                }
            })
        }

        this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();
        //理牌后
        if (isFirst) this.cardMgr.performWidget();
        this.cardMgr.actionMaskVisible(false);

        this.cardMgr.updateRedPointCount();
        this.reorderTimer = null;
        cc.log('理牌结束+++++', new Date().format('hh:mm:ss:S'))
    }

    /**
     * @param cards 
     * @param isFirst 首次发牌，移动显示牌背后，再翻转
     * @param isAction 新进牌，需要播放进牌动画，直接显示牌面移动
     * @param isReorder 重新排序
     * 场景恢复不需要动画
     */
    //设置玩家手牌
    setUserHandCards = function (cards, isFirst = false, isAction = false) {
        try {
            if (cards === null) return;
            const cardSort = (cardsData) => {
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
                let wang = cardsData.filter(card => {
                    return this.getCardColor(card) === 4;
                })

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
                if (this.cardMgr.Rule.Allow7AsKing) {
                    let wangBy7 = cardsData.filter(card => {
                        return this.getCardNum(card) === 7;
                    })
                    noWang = cardsData.filter(card => {
                        return this.getCardColor(card) !== 4 && this.getCardNum(card) !== 7
                    })
                    let pengDui = getDui(noWang);

                    newCards = pengDui.concat(cardsData).concat(wangBy7).concat(wang);

                } else {
                    noWang = cardsData.filter(card => {
                        return this.getCardColor(card) !== 4;
                    })
                    let pengDui = getDui(noWang);
                    newCards = pengDui.concat(cardsData).concat(wang);
                }
                return newCards;
            }

            const renderOtherCard = (parentLayout) => {
                let newCards = cards;
                if (cards instanceof Array) {
                    newCards = cardSort(cards);
                }
                let opacity = 255;
                if (isFirst || isAction) opacity = 0;
                this.setOtherHandCards(parentLayout, newCards, opacity);
            }
            switch (this.viewPos) {
                case PlayerPositon.Bottom: {
                    cc.log('理牌最开始+++++', new Date().format('hh:mm:ss:S'))
                    this.cardMgr.actionMaskVisible(true);
                    let bottomNum = 0;
                    this.cardMgr.BottomHandCards.children.forEach(child => {
                        if (child.active && child.childrenCount >= 1) {
                            let card = child.children.find(node => {
                                return node.active && node.opacity === 255;
                            })
                            if (card) bottomNum += 1;
                        }
                    })

                    if (cards instanceof Array) {
                        //保存玩家手牌信息
                        this.cardMgr.selfHandCards = this.cardMgr.selfHandCards.concat(cards);
                        let newCards = [];
                        if (isFirst) {
                            newCards = cardSort(this.cardMgr.selfHandCards);
                            this.cardMgr.selfHandCards = newCards;
                        } else {
                            newCards = cards;
                        }
                        let moveCards = [];
                        //数据显示
                        newCards.forEach((card, index) => {
                            let node = cc.instantiate(this.cardMgr.BottomHandCard)
                            if (node) {
                                if (node.childrenCount > 1)
                                    node.removeAllChildren();

                                let child = cc.instantiate(this.cardMgr.Card);

                                this.setCardFace(child, card);
                                node.addChild(child);
                                node.getComponent(cc.Layout).updateLayout();
                                //纠正透明度
                                if (node.opacity !== 255) node.opacity = 255

                                //添加到布局器中
                                this.cardMgr.BottomHandCards.addChild(node);
                                this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();

                                if (isFirst || isAction) {
                                    moveCards.push({ child, card });
                                    child.opacity = 0;
                                }
                            }
                        })
                        //手牌移动动画
                        if (isFirst || isAction) {
                            let timerID = setTimeout(() => {
                                try {
                                    if (!cc.isValid(this.cardMgr.node)) return;
                                    moveCards.forEach((node, index) => {
                                        if (!cc.isValid(this.cardMgr.node)) return;
                                        if (!node.child || !cc.isValid(node.child)) return;
                                        let del = cc.delayTime(0.03 * index);
                                        let wpos = node.child.convertToWorldSpaceAR(cc.v2(0, 0));
                                        node.child.runAction(cc.sequence(del, cc.callFunc(() => {
                                            // if (isFirst) {
                                            //新进牌都是背面进，然后再翻牌
                                            this.newCardAction(node.child, wpos, true, node.card, (index === moveCards.length - 1));
                                            // }
                                            // else if (isAction) {
                                            //     this.newCardAction(node.child, wpos);
                                            // }
                                        })))
                                    })
                                } catch (error) {
                                    cc.error('手牌移动动画', error)
                                }

                            }, 100)
                            this.cardMgr.totalTimerID.push(timerID);
                        }
                    } else {
                        this.cardMgr.selfHandCards.push(cards);

                        let node = cc.instantiate(this.cardMgr.BottomHandCard)
                        let child = null;
                        if (node) {
                            if (node.childrenCount > 1)
                                node.removeAllChildren();
                            child = cc.instantiate(this.cardMgr.Card);
                            if (isFirst || isAction) {
                                child.opacity = 0;
                            }
                            this.setCardFace(child, cards);
                            node.addChild(child);
                            node.getComponent(cc.Layout).updateLayout();

                            //纠正透明度
                            if (node.opacity !== 255) node.opacity = 255

                            //添加到布局器中
                            this.cardMgr.BottomHandCards.addChild(node)
                        }
                        this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();

                        if (isAction) {
                            let timerID = setTimeout(() => {
                                try {
                                    if (!cc.isValid(this.cardMgr.node)) return;
                                    let wpos = child.convertToWorldSpaceAR(cc.v2(0, 0));
                                    this.newCardAction(child, wpos, true, cards, true);
                                } catch (error) {
                                    cc.error('手牌移动单', error)
                                }
                            }, 100)
                            this.cardMgr.totalTimerID.push(timerID);
                        }
                    }
                    cc.log('更新玩家手牌', this.cardMgr.selfHandCards)
                    // this.cardMgr.performWidget();
                    this.cardMgr.actionMaskVisible(true);
                    this.cardMgr.updateRedPointCount();
                    // //1.5s后重新排序
                    let spaceTime = 1.5;
                    if (isFirst) {
                        spaceTime = 1.7;
                    } else {
                        spaceTime = 1.7;
                    }

                    let isHaveWang = null;
                    if (this.cardMgr.Rule.Allow7AsKing) {
                        isHaveWang = this.cardMgr.selfHandCards.find(val => {
                            return this.getCardNum(val) === 7 || this.getCardColor(val) == 4;
                        })
                    } else {
                        isHaveWang = this.cardMgr.selfHandCards.find(val => {
                            return this.getCardColor(val) == 4;
                        })
                    }

                    //后续进牌有王
                    if (isFirst || !isHaveWang) {
                        //新进牌有王不进行理牌
                        if (!cc.isValid(this.cardMgr.node)) return;
                        this.cardMgr.actionMaskVisible(true);
                        this.reorderTimer = setTimeout(() => {
                            try {
                                cc.log('理牌开始+++++', new Date().format('hh:mm:ss:S'))
                                if (!cc.isValid(this.cardMgr.node)) return;
                                this.cardMgr.actionMaskVisible(true);
                                this.userHandCardReorder(bottomNum, isFirst);
                            } catch (error) {
                                cc.error('理牌开始+++++', error)
                            }
                        }, spaceTime * 1000);
                        this.cardMgr.totalTimerID.push(this.reorderTimer);
                    }
                    break;
                }
                case PlayerPositon.Top: {
                    renderOtherCard(this.cardMgr.TopHandCards);
                    break;
                }
                case PlayerPositon.Right: {
                    renderOtherCard(this.cardMgr.RightHandCards);
                    break;
                }
                case PlayerPositon.Left: {
                    renderOtherCard(this.cardMgr.LeftHandCards);
                    break;
                }
            }
        } catch (error) {
            cc.error(error)
        }

    }

    //自己出牌失败恢复
    onUserResetCard = function (card) {
        this.cardMgr.selfHandCards.push(card);
        let node = cc.instantiate(this.cardMgr.BottomHandCard)
        let child = null;
        if (node) {
            if (node.childrenCount > 1)
                node.removeAllChildren();
            child = cc.instantiate(this.cardMgr.Card);
            this.setCardFace(child, card);
            node.addChild(child);
            node.getComponent(cc.Layout).updateLayout();
            //纠正透明度
            if (node.opacity !== 255) node.opacity = 255

            //添加到布局器中
            this.cardMgr.BottomHandCards.addChild(node)
        }
        this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();
        //清掉出牌
        let outNode = this.cardMgr.BottomOutCards.children.find(child => {
            return (child.getComponent(Card)) && child.getComponent(Card).Data === card;
        });
        outNode.destroy();
        this.cardMgr.BottomOutCards.getComponent(cc.Layout).updateLayout();
    }

    //other手牌
    setOtherHandCards = function (parent, cards, opacity = 255) {
        const nodeRunAction = (node, index) => {
            node.opacity = opacity;
            //添加到布局器中
            parent.addChild(node);
            parent.getComponent(cc.Layout).updateLayout();
            if (opacity !== 255) {
                let del = cc.delayTime(0.03 * index);
                let wpos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                node.runAction(cc.sequence(del, cc.callFunc(() => {
                    this.newCardAction(node, wpos)
                })))
            }
        }
        if (cards instanceof Array) {
            for (let i = 0; i < cards.length; i++) {
                let node = cc.instantiate(this.cardMgr.OtherHandCard)
                this.setCardFace(node, cards[i]);
                nodeRunAction(node, i);
            }
        } else {
            //实例化几张牌背
            if (!this.cardMgr.IsReplayMode) {
                for (let i = 0; i < cards; i++) {
                    let node = cc.instantiate(this.cardMgr.OtherHandCard)
                    node.opacity = opacity;
                    this.setCardFace(node, -1);
                    nodeRunAction(node, i);
                }
            } else {
                let node = cc.instantiate(this.cardMgr.OtherHandCard)
                node.opacity = opacity;
                this.setCardFace(node, cards);
                nodeRunAction(node, 0);
            }
        }

    }

    //桌上展示的card位置
    getTableCardEndPos = function () {
        let endPos = null;
        switch (this.viewPos) {
            case PlayerPositon.Bottom: {
                let wpos = this.cardMgr.BottomOutCards.convertToWorldSpaceAR(cc.v2(0, 0));
                let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);
                npos.x = 0;
                endPos = npos;
                break;
            }
            case PlayerPositon.Top: {
                let wpos = this.cardMgr.TopOutCards.convertToWorldSpaceAR(cc.v2(0, 0));
                let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);
                npos.x = 0;
                endPos = npos;
                break;
            }
            case PlayerPositon.Right: {
                let wpos = this.cardMgr.RightOutCards.convertToWorldSpaceAR(cc.v2(0, 0));
                let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);
                npos.x += 80;
                endPos = npos;
                break;
            }
            case PlayerPositon.Left: {
                let wpos = this.cardMgr.LeftOutCards.convertToWorldSpaceAR(cc.v2(0, 0));
                let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);
                npos.x -= 80;
                endPos = npos;
                break;
            }
        }
        return endPos;
    }

    /**
     * 进牌动画 先从中间移到下方
     * @param node 移动的card 牌背或牌面
     * @param wpos  node的世界坐标
     * @param isShowBack  false:node是啥显示啥，true:显示背面
     */
    newCardAction = function (node, wpos, isShowBack = false, card, isLast = false) {
        // cc.log('游戏消息++++新进牌', card, new Date().format('hh:mm:ss:S'))
        let actionNode = null;
        if (isShowBack) {
            actionNode = cc.instantiate(this.cardMgr.backCard);
        } else {
            actionNode = cc.instantiate(node);
        }

        //到达目标位置后的缩放
        let scale = node.scale;
        let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);

        this.cardMgr.temporaryCard.addChild(actionNode);
        actionNode.active = true;
        actionNode.scale = 0.1;
        actionNode.opacity = 255;
        actionNode.setPosition(0, 50);


        //先移到下方100，并缩放至目标大小
        let moveCenter = cc.moveTo(ActionTime.MoveCenter, cc.v2(0, -100));
        //移动到最后位置
        let moveLast = cc.moveTo(ActionTime.MoveHand, npos.x, npos.y);
        let seq = cc.sequence(cc.spawn(moveCenter, cc.scaleTo(ActionTime.MoveCenter, scale)), moveLast, cc.callFunc(() => {
            if (isShowBack) {
                //翻转
                actionNode.runAction(cc.sequence(cc.delayTime(0.1), cc.scaleTo(0.05, 0.2, 1), cc.callFunc(() => {
                    this.setCardFace(actionNode, card);
                }), cc.scaleTo(0.05, 1, 1), cc.callFunc(() => {
                    actionNode.opacity = 0;
                    actionNode.destroy();
                    node.opacity = 255;
                    if (isLast) {
                        // cc.log('游戏消息++++最后一张牌', new Date().format('hh:mm:ss:S'))
                    }
                })));
            } else {
                actionNode.opacity = 0;
                actionNode.destroy();
                node.opacity = 255;
                // console.log('LLL++NewAction', node)
            }
        }));
        actionNode.runAction(seq)
        let timerID = setTimeout(() => {
            if (!cc.isValid(this.cardMgr.node)) return;
            this.cardMgr.actionMaskVisible(false);
        }, 0.7 * 1000);
        this.cardMgr.totalTimerID.push(timerID);
    }

    /**添加
     * @param nodesInfo {startNode, endNode, card}
                            * @param isUP 是否先上移（只有自己偷牌是上移的）
                            *
                            * node为weaves里的opacity=0的card;
                            */
    addweavesAction = function (nodesInfo, isUP = false) {
        cc.log('添加吃碰杠++addweavesAction00', nodesInfo.length);
        // this.cardMgr.performWidget();
        let timerID = setTimeout(() => {
            try {
                if (!cc.isValid(this.cardMgr.node)) return;
                nodesInfo.forEach(value => {
                    cc.log('添加吃碰杠++addweavesAction1111111111');
                    //初始化
                    if (!value.startNode || !value.endNode) return;

                    if (!cc.isValid(value.startNode) || !cc.isValid(value.endNode)) return;
                    let actionNode = cc.instantiate(value.startNode);
                    actionNode.getComponent(Card).Data = value.card;
                    //其他玩家找的是牌背
                    if (this.viewPos !== PlayerPositon.Bottom) {
                        actionNode.getComponent(Card).showFace = this.getSpriteFrameByCard(value.card);
                    }
                    actionNode.opacity = 255;
                    actionNode.active = true;
                    actionNode.scale = value.startNode.scale;
                    this.cardMgr.temporaryCard.addChild(actionNode);

                    value.startNode.opacity = 0;

                    let startWpos = value.startNode.convertToWorldSpaceAR(cc.v2(0, 0));
                    let startPos = this.cardMgr.node.convertToNodeSpaceAR(startWpos);
                    actionNode.setPosition(startPos);

                    let endWpos = value.endNode.convertToWorldSpaceAR(cc.v2(0, 0));
                    let endPos = this.cardMgr.node.convertToNodeSpaceAR(endWpos);
                    //展示等待时间
                    let wait = cc.delayTime(ActionTime.WaitTime);
                    //上移0.33,暂停0.2
                    let moveUp = cc.moveTo(ActionTime.MoveUp, cc.v2(startPos.x, startPos.y + 200));
                    let stop = cc.delayTime(ActionTime.UpStop);
                    //移动
                    let moveEnd = cc.moveTo(ActionTime.MoveWeaves, cc.v2(endPos.x, endPos.y));

                    let callFunc = cc.callFunc(() => {
                        actionNode.opacity = 0;
                        actionNode.destroy();
                        if (this.viewPos === PlayerPositon.Bottom) {
                            if (value.startNode.parent.name === "BottomHandCard") {
                                if (value.startNode.parent.childrenCount === 1) {
                                    value.startNode.parent.destroy();
                                } else {
                                    value.startNode.parent.removeChild(value.startNode);
                                    if (cc.isValid(value.startNode)) value.startNode.destroy();
                                }
                            } else {
                                if (value.startNode.name === 'LastOutCard') {
                                    value.startNode.opacity = 255;
                                    value.startNode.active = false;
                                }
                                else {
                                    if (cc.isValid(value.startNode)) value.startNode.destroy();
                                }
                            }

                        } else {
                            if (value.startNode.name === 'LastOutCard') {
                                value.startNode.opacity = 255;
                                value.startNode.active = false;
                            }
                            else {
                                if (cc.isValid(value.startNode)) value.startNode.destroy();
                            }
                        }
                        value.endNode.opacity = 255;
                        this.cardMgr.updateRedPointCount();
                    })
                    let seq = null;
                    if (isUP) {
                        seq = cc.sequence(moveUp, stop, moveEnd, callFunc);
                    } else {
                        //其他玩家需要先展示0.2（当暗碰或偷牌时暗杠不需要展示）
                        if (this.viewPos !== PlayerPositon.Bottom && value.card !== -1) {
                            seq = cc.sequence(wait, moveEnd, callFunc);
                        } else {
                            seq = cc.sequence(moveEnd, callFunc);
                        }
                    }
                    actionNode.runAction(seq);
                })
            } catch (error) {
                cc.error('添加吃碰杠动画+++', error)
            }

        }, 0.05 * 1000)
        this.cardMgr.totalTimerID.push(timerID);

        let timerID2 = setTimeout(() => {
            if (!cc.isValid(this.cardMgr.node)) return;
            this.cardMgr.onShowOutCard();
            this.recoveryWeavesCards();
            console.log('LLL++WeaveaAction++recoveryWeavesCards', nodesInfo)
        }, 0.3 * 1000);
        this.cardMgr.totalTimerID.push(timerID2);
        console.log('LLL++WeaveaAction', nodesInfo)
    }

    //恢复吃牌数据
    recoveryWeavesCards = function () {
        // cc.log('恢复吃牌数据', this.viewPos)
        const showWeavesCards = (parent) => {
            parent.children.forEach(child => {
                child.opacity = 255;
                // cc.log('恢复吃牌数据Child', this.viewPos)
                child.children.forEach(node => {
                    // cc.log('恢复吃牌数据node', this.viewPos)
                    node.opacity = 255;
                    node.active = true;
                })
                child.getComponent(ChiCardLayout).updateSpacingY();
                if (child.getComponent(cc.Layout)) child.getComponent(cc.Layout).updateLayout();
            })
        }
        switch (this.viewPos) {
            case PlayerPositon.Bottom:
                showWeavesCards(this.cardMgr.BottomUserChiCards);
                break;
            case PlayerPositon.Top:
                showWeavesCards(this.cardMgr.TopUserChiCards);
                break;
            case PlayerPositon.Right:
                showWeavesCards(this.cardMgr.RightUserChiCards);
                break;
            case PlayerPositon.Left:
                showWeavesCards(this.cardMgr.LeftUserChiCards);
                break;
        }
    }
    //恢复手牌
    recoveryHandCards = function () {
        this.cardMgr.temporaryCard.removeAllChildren(true);
        if (this.viewPos === PlayerPositon.Bottom) {
            this.cardMgr.BottomHandCards.removeAllChildren();
            //强制刷新手牌7/8
            this.cardMgr.bottomHandCards.forEach((card, index) => {
                if (card === null) return;
                let node = cc.instantiate(this.cardMgr.BottomHandCard)
                if (node) {
                    if (node.childrenCount > 1)
                        node.removeAllChildren();

                    let child = cc.instantiate(this.cardMgr.Card);

                    this.setCardFace(child, card);
                    node.addChild(child);
                    node.getComponent(cc.Layout).updateLayout();
                    //纠正透明度
                    if (node.opacity !== 255) node.opacity = 255
                    //添加到布局器中
                    this.cardMgr.BottomHandCards.addChild(node);
                    this.cardMgr.BottomHandCards.getComponent(cc.Layout).updateLayout();
                }
            })
            // this.cardMgr.performWidget();
            this.cardMgr.updateRedPointCount();
        }
    }


    //系统翻牌动画
    systemCardAction = function (card) {
        let timerID = setTimeout(() => {
            try {
                if (!cc.isValid(this.cardMgr.node)) return;
                let tableCard = this.cardMgr.TableLastOutCard;
                tableCard.node.stopAllActions();
                tableCard.Data = card;
                tableCard.showFace = this.getSpriteFrameByCard(card);
                let actionNode = tableCard.node;
                actionNode.scale = 0.1;
                actionNode.opacity = 255;
                actionNode.setPosition(0, 50);
                tableCard.node.active = true;
                let endPos = this.getTableCardEndPos();
                let moveLast = cc.moveTo(ActionTime.MoveCenter, endPos.x, endPos.y);
                actionNode.runAction(cc.spawn(moveLast, cc.scaleTo(ActionTime.MoveCenter, 1)))
                this.cardMgr.actionMaskVisible(false);
            } catch (error) {
                cc.error('系统翻牌动画+++', error)
            }

        }, 0.05 * 1000)
        this.cardMgr.totalTimerID.push(timerID);
    }

    /**
     * 游戏中偷牌动画
     * @param card 
     * @param endNode 移动结束位置
     */
    onUserTouKing = function (card, endNode) {
        if (this.viewPos === PlayerPositon.Bottom) this.cardMgr.actionMaskVisible(true);

        let timerID1 = setTimeout(() => {
            try {
                if (!cc.isValid(this.cardMgr.node)) return;
                if (!cc.isValid(endNode)) return;
                let actionNode = cc.instantiate(this.cardMgr.backCard);
                actionNode.getComponent(Card).Data = card;
                actionNode.getComponent(Card).showFace = this.getSpriteFrameByCard(card);
                this.cardMgr.temporaryCard.addChild(actionNode);

                actionNode.active = true;
                actionNode.scale = 0.1;
                actionNode.opacity = 255;
                actionNode.setPosition(0, 50);

                let endWpos = endNode.convertToWorldSpaceAR(cc.v2(0, 0));
                let endNodePos = this.cardMgr.node.convertToNodeSpaceAR(endWpos);
                let scale = endNode.scale;

                let centerPos = this.getTableCardEndPos();
                let moveCenter = cc.moveTo(ActionTime.MoveCenter, centerPos.x, centerPos.y);
                let spawnCenter = cc.spawn(moveCenter, cc.scaleTo(ActionTime.MoveCenter, 1));

                let moveLast = cc.moveTo(ActionTime.MoveWeaves, endNodePos.x, endNodePos.y);
                let spawnEnd = cc.spawn(moveLast, cc.scaleTo(ActionTime.MoveWeaves, scale));

                let callFunc = cc.callFunc(() => {
                    actionNode.destroy();
                    endNode.opacity = 255;
                })
                actionNode.runAction(cc.sequence(spawnCenter, spawnEnd, callFunc));
            } catch (error) {
                cc.error('游戏中偷牌动画', error)
            }

        }, 0.05 * 1000)
        this.cardMgr.totalTimerID.push(timerID1);

        let timerID = setTimeout(() => {
            if (!cc.isValid(this.cardMgr.node)) return;
            this.recoveryWeavesCards();
            this.cardMgr.actionMaskVisible(false);
        }, 0.5 * 1000);
        this.cardMgr.totalTimerID.push(timerID);
    }

    //玩家出牌
    outCardAction = function (node, card) {
        let timerID = setTimeout(() => {
            try {
                if (!cc.isValid(this.cardMgr.node)) return;
                if (!cc.isValid(node)) return;
                let scale = node.scale;
                let wpos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                let npos = this.cardMgr.node.convertToNodeSpaceAR(wpos);
                let startPos = npos;
                let endPos = this.getTableCardEndPos();
                node.destroy();

                let tableCard = this.cardMgr.TableLastOutCard;
                tableCard.node.stopAllActions();

                tableCard.Data = card;
                tableCard.showFace = this.getSpriteFrameByCard(-1);
                tableCard.node.active = true;
                let actionNode = tableCard.node;
                actionNode.scale = scale;
                actionNode.opacity = 255;
                actionNode.setPosition(startPos);

                let moveLast = cc.moveTo(ActionTime.HandMoveCenter, endPos.x, endPos.y);
                let seq = cc.sequence(cc.spawn(moveLast, cc.scaleTo(ActionTime.HandMoveCenter, 1)), cc.callFunc(() => {
                    tableCard.showFace = this.getSpriteFrameByCard(card);
                    this.cardMgr.actionMaskVisible(false);
                }));
                actionNode.runAction(seq);
            } catch (error) {
                cc.error('玩家出牌', error)
            }

        }, 0.05 * 1000)
        this.cardMgr.totalTimerID.push(timerID);
    }
}