function Red20_Controller(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.Operation = null;
    this.ActionChu = null;

    this.controllerAtlas = null

    this.cardAtlas = null

    this.CurActions = [];
    this.IsReplayMode = false;
    this.gameBase


    this.isBaoTing = false;

    this.EventActionCard = (type, data) => { };

    onInit = function (cardAtlas, controllerAtlas, gameBase) {
        this.gameBase = gameBase;
        this.IsReplayMode = this.gameBase.isReplayMode;
        this.cardAtlas = cardAtlas;
        this.controllerAtlas = controllerAtlas;
        this.hideOperationPanel();
    }

    //获取资源
    getSpriteFrameByCard = function (card) {
        if (card === -1) {
            return this.cardAtlas.getSpriteFrame(`back`)
        }
        let cardNum = card % 16;
        let cardColor = Math.floor(card / 16);
        return this.cardAtlas.getSpriteFrame(`${cardColor}-${cardNum}`)
    }

    hideOperationPanel = function () {
        this.Operation.children.forEach(child => {
            child.active = false;
            child.getComponent(cc.Button).interactable = true;
            child.getChildByName('Background').active = true;
            let desc = child.getChildByName('Desc');
            if (desc) desc.active = false;
        })
        this.ActionChu.active = false;
        this.CurActions = [];
    }

    //点击过
    onClickPass = function () {
        if (this.EventActionCard) this.EventActionCard('guo');
        // GameNetwork.sendData(Message.MainCmd.Game, ClientCmd.UserPass);
        // this.hideOperationPanel();
    }

    canChuCard = function () {
        if (this.IsReplayMode) return;
        this.hideOperationPanel();
        this.ActionChu.active = true;
    }

    canOperate = function (data) {
        if (this.IsReplayMode) return;
        //
        data.sort((a, b) => { return b - a });
        if (data.toString() === this.CurActions.toString()) return;
        this.hideOperationPanel();
        this.CurActions = data;

        console.log("LLL++ActionList+", GameData.getActionList());
        //吃，碰，杠数据
        let actionList = GameData.getActionList();

        let actions = this.Operation.children.filter(child => {
            return child.name === 'Action'
        });

        let getActionCards = (type) => {
            let list = actionList.filter(value => {
                return value.type === type;
            })
            //去重
            let newlist = [];
            list.forEach(value => {
                let aa = newlist.find(val => {
                    return val.type === value.type && val.card === value.card;
                })
                if (!aa) {
                    newlist.push(value);
                }
            })

            return newlist;
        }

        let isShowPass = true;
        let isHu = false;
        cc.log('按钮+actions+++++', actions.length)
        actions[0].active = true;
        let index = 0;
        data.forEach(action => {
            if (action === UserAction.Tou) {
                //有偷就不显示过
                isShowPass = false;
                this.setAction(actions[index], 'tou')
                index += 1;
            }
            if (action === UserAction.Chi) {
                let list = getActionCards('chi');
                if (list.length === 0) {
                    this.setAction(actions[index], 'chi')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'chi', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Gang) {
                let list = getActionCards('gang');
                if (list.length === 0) {
                    this.setAction(actions[index], 'gang')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'gang', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Peng) {
                let list = getActionCards('peng');
                if (list.length === 0) {
                    this.setAction(actions[index], 'peng')
                } else {
                    let Cards = [];
                    list.forEach(value => {
                        Cards.push(value.card);
                    })
                    this.setAction(actions[index], 'peng', Cards);
                }
                index += 1;
            }
            if (action === UserAction.Ting) {
                this.setAction(actions[index], 'ting')
                index += 1;
            }
            if (action === UserAction.Hu) {
                cc.log('胡+++', index)
                isHu = true;
                this.setAction(actions[index], 'hu')
                index += 1;
            }

        })

        this.Operation.getChildByName('BtnPass').active = isShowPass;
        //报听后能胡不显示过按钮time:02/13
        if (isHu && this.isBaoTing) {
            this.Operation.getChildByName('BtnPass').active = false;
        }
    }

    //动作设置
    setAction = function (node, action, cards) {
        if (!node) return;
        //设置操作
        node.active = true;
        let attrs = { action: action };
        node.attr(attrs);

        let bg = node.getChildByName('Background').getComponent(cc.Sprite);
        bg.spriteFrame = this.controllerAtlas.getSpriteFrame(`btn_${action}`);
        let isShowDesc = false;
        if (cards && cards.length === 1) {
            node.getChildByName('Card').active = false//cardShow;暂时???
            node.getComponentInChildren(Card).Data = cards[0];
            node.getComponentInChildren(Card).showFace = this.getSpriteFrameByCard(cards[0])
        } else if (cards && cards.length > 1) {
            isShowDesc = true;
            node.getChildByName('Card').active = false;
            node.getComponentInChildren(Card).Data = -1;

            let desc = node.getChildByName('Desc');
            let CardNode = desc.getChildByName("Card");
            CardNode.children.forEach(child => child.active = false);
            cards.forEach((card, index) => {
                this.setCardAction(CardNode.children[index], action, card);
            })
            //取消按钮
            let cancel = desc.getChildByName('Cancel').getComponent(cc.Button);
            if (cancel) {
                cancel.clickEvents = []
                cancel.interactable = true;

                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "Controller";
                clickEventHandler.handler = "onClickCancel";
                clickEventHandler.customEventData = action

                cancel.clickEvents.push(clickEventHandler);
            }
            //最后一张牌
            let lastCard = desc.getChildByName('LastCard');
            if (GameData.lastTableOutCard) {
                lastCard.active = true;
                lastCard.getComponent(Card).Data = GameData.lastTableOutCard;
                lastCard.getComponent(Card).showFace = this.getSpriteFrameByCard(GameData.lastTableOutCard);
            } else {
                lastCard.active = false;
            }
        }
        else {
            node.getChildByName('Card').active = false;
            node.getComponentInChildren(Card).Data = -1;
        }

        let button = node.getComponent(cc.Button)
        if (button) {
            button.clickEvents = []
            button.interactable = true;

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "Controller";
            //多张牌
            if (isShowDesc) {
                clickEventHandler.handler = "onClickShowDesc";
            } else {
                clickEventHandler.handler = "onClickAction";
            }
            clickEventHandler.customEventData = action

            button.clickEvents.push(clickEventHandler);
        }
    }

    //
    setCardAction = function (node, action, card) {
        node.active = true;
        if (card) {
            node.getChildByName('Card').active = true
            node.getComponentInChildren(Card).Data = card;
            node.getComponentInChildren(Card).showFace = this.getSpriteFrameByCard(card)
        }
        let button = node.getComponent(cc.Button)
        if (button) {
            button.clickEvents = []
            button.interactable = true;

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "Controller";
            clickEventHandler.handler = "onClickAction";
            clickEventHandler.customEventData = action

            button.clickEvents.push(clickEventHandler);
        }
    }

    //点击操作
    onClickAction = function (event, action) {
        console.log("LLL++ActionNode", event.target)
        let target = event.target;
        let card = target.getComponentInChildren(Card);
        console.log('LLL++ActionCard', card.Data);
        if (this.EventActionCard) this.EventActionCard(action, { Card: card.Data });

        // this.hideOperationPanel();
    }

    updateDesc = function () {
        this.Operation.children.forEach(child => {
            let desc = child.getChildByName('Desc');
            if (desc) desc.active = false;
        })
    }

    //多个牌操作
    onClickShowDesc = function (event, action) {
        if (this.gameBase.TuoGuanMaskNode.activeInHierarchy) return;
        this.updateDesc();
        let target = event.target;
        let desc = target.getChildByName('Desc');
        if (desc) desc.active = true;
        target.getComponent(cc.Button).interactable = false;
        target.getChildByName('Background').active = false;
    }
    //点击取消
    onClickCancel = function (event) {
        let target = event.target;
        let desc = target.parent;
        desc.parent.getComponent(cc.Button).interactable = true;
        desc.parent.getChildByName('Background').active = true;
        desc.active = false;
    }
}