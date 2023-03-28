const Card = require('./Card');
const { PlayerPositon } = require('./Message');
function Red20_CardManager(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.bounds = node.getChildByName("bounds");
    this.backCard = node.getChildByName("backCard");
    this.temporaryCard = node.getChildByName("temporaryCard");
    const n = node.getChildByName("LastOutCard")
    this.TableLastOutCard = new Card(n);
    this.Card = new Card(n.clone());
    let c = n.clone();
    c.setScale(0.6);
    this.OtherCard = new Card(c);
    this.BottomHandCard = ccs.load('Red20_BottomHandCard.json').node;
    this.BRChiCard = ccs.load('Red20_BRChiCards.json').node;
    this.LTChiCard = ccs.load('Red20_LTChiCards.json').node;
    c = n.clone();
    c.setScale(0.6);
    c.setSpriteFrame(new cc.SpriteFrame('Red20/Game/.Card_PList.Dir/' + "back.png", cc.rect(0, 0, 90, 122)));
    this.OtherHandCard = new Card(c);
    this.Mask = node.parent.getChildByName("Mask");
    this.redPoint = node.parent.getChildByName("redPoint");
    this.redPointBg = node.parent.getChildByName("userBg");

    this.BottomHandCards = node.getChildByName('BottomHandCards');
    this.BottomUserChiCards = node.getChildByName('BottomUserChiCards');
    this.BottomOutCards = node.getChildByName('BottomOutCards');

    this.LeftHandCards = node.getChildByName('LeftHandCards');
    this.LeftUserChiCards = node.getChildByName('LeftUserChiCards');
    this.LeftOutCards = node.getChildByName('LeftOutCards');

    this.RightHandCards = node.getChildByName('RightHandCards');
    this.RightUserChiCards = node.getChildByName('RightUserChiCards');
    this.RightOutCards = node.getChildByName('RightOutCards');

    this.TopHandCards = node.getChildByName('TopHandCards');
    this.TopOutCards = node.getChildByName('TopOutCards');
    this.TopUserChiCards = node.getChildByName('TopUserChiCards');

    this.lastOutCardTimer = null;

    //所有timerID
    this.totalTimerID = [];

    this.Rule = null;

    this.cardAtlas = null
    this.IsReplayMode = false;

    //是否允许出牌
    this.allowOutCard = false;
    this.isBaoTing = false;
    //玩家数组
    this.players = [];
    this.doubleTimeEclipse = 0;
    this.startLocation = null;

    //动画播完后改变
    this.selfHandCards = []

    //及时记录自己手牌数据
    this.bottomHandCards = []

    this.EventOutCard = (data) => { };
    this.maskTimer = null;
    this.startTouResultTimer = null;
    this.startTouResultCard = [];

    //初始化
    onReset = function (maxPlayer, rule, isReplayMode) {
        this.players = [];
        this.IsReplayMode = isReplayMode;
        this.Rule = rule;

        this.node.children.forEach(child => {
            if (child.childrenCount > 0)
                child.removeAllChildren();
        })

        //根据人数绑定数据
        let positions = [];
        switch (maxPlayer) {
            case 2:
                positions = [PlayerPositon.Bottom, PlayerPositon.Top]
                break;

            case 3:
                positions = [PlayerPositon.Bottom, PlayerPositon.Right, PlayerPositon.Left]
                break;

            default:
                positions = [PlayerPositon.Bottom, PlayerPositon.Right, PlayerPositon.Top, PlayerPositon.Left]
                break;
        }

        cc.log('++++++++加载position+++++', positions.length, maxPlayer)

        //实例化玩家
        positions.forEach(viewPos => {
            this.players.push(new PlayerCard(this, viewPos))
        })

        this.node.children.forEach((node, index) => {
            if (index < 9)
                node.visible = true
        })

        this.reset();
    }
    //重置
    reset = function () {
        //操作辅助变量
        if (dlgActionNode) dlgActionNode.destroy();
        dlgActionNode = null;
        lastSelectedNode = null;

        cc.log('动画数量', this.totalTimerID.length);
        this.totalTimerID.forEach(val => {
            if (val) clearTimeout(val);
        })

        this.redPoint.visible = false;
        this.redPointBg.visible = false;

        GameData.isActionByTableCard = false;
        GameData.updateActionCard();
        this.performWidget(true);

        this.bounds.visible = false;

        this.allowOutCard = false;
        this.isBaoTing = false;

        lastOutCardPos = null;
        this.selfHandCards = [];
        this.bottomHandCards = [];

        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;
        GameData.lastTableOutCard = null;
        //播动画临时Card
        this.node.stopAllActions();
        this.temporaryCard.stopAllActions();
        this.temporaryCard.removeAllChildren(true);

        this.totalTimerID = [];

        this.players.forEach(player => {
            player.onReset();
        })
    }

    onTouchInit = function () {
        //触碰操作处理
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    offTouchInit = function () {
        if (!this.node.isValid) return;
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    isCanTouch = function () {
        let touch = true;
        this.BottomHandCards.children.forEach(node => {
            if (!touch) return;
            if (node.getOpacity() !== 255) {
                touch = false
                return;
            }
            node.children.forEach(child => {
                if (!touch) return;
                if (child.getOpacity() !== 255) {
                    touch = false
                    return;
                }
            })
        })
        if (this.players[0].reorderTimer !== null) touch = false;
        return touch;
    }

    onTouchStart = function (event) {
        if (!this.isCanTouch()) return;
        if (this.isBaoTing) return;
        // console.log("点击")
        //销毁对象
        if (dlgActionNode) {
            dlgActionNode.destroy();
            dlgActionNode = null;
        }
        //变量声明
        let location = event.getLocation();
        this.startLocation = location;
        let touchInfo = this.findTouchCard(location);
        let target = touchInfo.node;
        if (target !== null) {
            if (target.getOpacity() !== 255) return;

            AudioManager.playSound('effect/other/select_card');

            this.bounds.visible = true;
            lastSelectedNode = target;
            lastSelectedIndex = touchInfo.index;
            //复制一个节点
            dlgActionNode = cc.instantiate(target)
            this.node.addChild(dlgActionNode)
            //?
            dlgActionNode.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;

            //坐标转换
            let wpos = target.convertToWorldSpaceAR(target.getPosition())
            let viewPos = dlgActionNode.convertToNodeSpaceAR(wpos)
            dlgActionNode.setPosition(viewPos)

            //置灰原节点
            target.color = cc.Color.GRAY;
        }
    }

    onTouchMove = function (event) {
        // 不可见过滤
        if (dlgActionNode === null) return
        //修改位置
        let delta = event.getDelta()
        dlgActionNode.x += delta.x
        dlgActionNode.y += delta.y
    }

    onTouchEnd = function (event) {
        this.bounds.visible = false;

        if (dlgActionNode === null) return;

        //清理card
        let nodeReset = () => {
            dlgActionNode.destroy();
            dlgActionNode = null;
            if (lastSelectedNode.parent.childrenCount === 1) {
                lastSelectedNode.parent.destroy();
            } else {
                lastSelectedNode.destroy();
            }
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode = null;
            lastSelectedIndex = null;
        }
        //变量声明
        let location = event.getLocation();
        let wpos = this.bounds.convertToWorldSpaceAR(cc.v2(0, 0));
        let nowTime = Date.now();
        if (nowTime - this.doubleTimeEclipse < 300) { //小于300ms为双击
            console.log('LLL+++双击')
            let card = dlgActionNode.getComponent(Card);
            this.performOutCard(card.Data); //出牌
            dlgActionNode.destroy();
            dlgActionNode = null;
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode.setOpacity(255);
            lastSelectedNode = null;
            this.doubleTimeEclipse = 0;
            return;
        }
        // console.log('LLL+++双击', nowTime - this.doubleTimeEclipse)
        this.doubleTimeEclipse = Date.now();
        if (location.y > wpos.y) {
            let card = dlgActionNode.getComponent(Card);
            this.performOutCard(card.Data); //出牌
            dlgActionNode.destroy();
            dlgActionNode = null;
            lastSelectedNode.color = cc.Color.WHITE;
            lastSelectedNode.setOpacity(255);
            lastSelectedNode = null;

        } else {
            let endInfo = this.findTouchEndNode(location)//actionNode.getBoundingBoxToWorld());
            if (endInfo === null || Math.abs(location.x - this.startLocation.x) < 20 && Math.abs(location.y - this.startLocation.y) < 20) {
                dlgActionNode.destroy();
                dlgActionNode = null;
                lastSelectedNode.color = cc.Color.WHITE;
                lastSelectedNode.setOpacity(255);
                lastSelectedNode = null;
                lastSelectedIndex = null;
            }
            else if (endInfo.isChange) { //交换
                if (lastSelectedIndex === endInfo.index) { //不变
                    lastSelectedNode.color = cc.Color.WHITE;
                    lastSelectedNode.setOpacity(255);
                    dlgActionNode.destroy();
                    dlgActionNode = null;
                    lastSelectedNode = null;
                    lastSelectedIndex = null;
                } else {
                    let node = cc.instantiate(lastSelectedNode);
                    node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                    //单个card的父节点layout
                    let cardLayout = cc.instantiate(this.BottomHandCard);
                    cardLayout.removeAllChildren();
                    cardLayout.addChild(node);
                    node.color = cc.Color.WHITE;
                    node.setOpacity(255);

                    //交换的layout
                    let changeNode = endInfo.node.children[endInfo.index];
                    //copy交换layout 
                    let node1 = cc.instantiate(changeNode);
                    changeNode.children.forEach((child, index) => {
                        node1.children[index].getComponent(Card).Data = child.getComponent(Card).Data;
                    })
                    node1.color = cc.Color.WHITE;
                    //插入新添加的 (先插入位置在前面的)
                    if (endInfo.index < lastSelectedIndex) {
                        endInfo.node.insertChild(node1, lastSelectedIndex)
                        endInfo.node.insertChild(cardLayout, endInfo.index)

                    } else {
                        endInfo.node.insertChild(cardLayout, endInfo.index)
                        endInfo.node.insertChild(node1, lastSelectedIndex)
                    }
                    //移除原来的
                    changeNode.destroy();
                    nodeReset();
                }
            } else {
                //最左侧或最右侧 或者向左挤挤，向右挤挤
                if (endInfo.isNewLayout) {
                    if (endInfo.index < lastSelectedIndex) {
                        let node = cc.instantiate(lastSelectedNode);
                        node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                        let cardLayout = cc.instantiate(this.BottomHandCard);
                        cardLayout.removeAllChildren();
                        cardLayout.addChild(node);
                        node.color = cc.Color.WHITE;
                        node.setOpacity(255);
                        endInfo.node.insertChild(cardLayout, endInfo.index);
                        nodeReset();
                    } else {

                        let node = cc.instantiate(lastSelectedNode);
                        node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                        let cardLayout = cc.instantiate(this.BottomHandCard);
                        cardLayout.removeAllChildren();
                        cardLayout.addChild(node);
                        node.color = cc.Color.WHITE;
                        node.setOpacity(255);
                        if (endInfo.index === this.node.getChildByName('BottomHandCards').childrenCount - 1) {
                            endInfo.node.insertChild(cardLayout, endInfo.index + 1);
                        } else {
                            endInfo.node.insertChild(cardLayout, endInfo.index);
                        }

                        nodeReset();
                    }
                }
                //插入成对或14
                else {
                    let node = cc.instantiate(lastSelectedNode);
                    node.getComponent(Card).Data = lastSelectedNode.getComponent(Card).Data;
                    node.color = cc.Color.WHITE;
                    node.setOpacity(255);
                    endInfo.node.insertChild(node, endInfo.index);
                    nodeReset();
                }
            }
        }

        this.updateRedPointCount();

    }

    //查找触碰的麻将
    findTouchCard = function (pos) {
        let data = { node: null, index: null }
        let card = this.node.getChildByName('BottomHandCards');
        card.children.forEach((child, index) => {
            if (data.node) return;
            if (child.getBoundingBoxToWorld().contains(pos) && child.visible) {
                let indexInfo = [];
                child.children.forEach((val, id) => {
                    if (val.getBoundingBoxToWorld().contains(pos)) {
                        indexInfo.push(id);
                    }
                })
                data.index = index;
                data.node = child.children[Math.max.apply(Math, indexInfo)];
            }
        })
        return data;
    }

    getCardData = function (node) {
        return node.getComponent(Card);
    }
    //结束时插入的位置
    findTouchEndNode = function (pos) {

        let cardNode = this.node.getChildByName('BottomHandCards');
        //不在手牌范围内
        //向右移动，放在最右侧
        if (pos.x > cardNode.getBoundingBoxToWorld().xMax) {
            return { node: cardNode, index: cardNode.childrenCount - 1, isChange: false, isNewLayout: true };
        }
        //向左移动，放在最左侧
        else if (pos.x < cardNode.getBoundingBoxToWorld().xMin) {
            return { node: cardNode, index: 0, isChange: false, isNewLayout: true };
        }
        //中间
        else {
            //endInfo:{node:移动的牌的父节点，index：插入位置，isChange：是否交换,isNewLayout:添加新的layout牌组}
            let indexInfo = [];
            cardNode.children.forEach((child, index) => {
                if (child.getBoundingBoxToWorld().contains(pos) && child.visible) {
                    indexInfo.push(index);
                }
            })
            if (indexInfo.length === 2) {
                //两张牌中间
                return { node: cardNode, index: Math.max.apply(Math, indexInfo), isChange: true };
            } else if (indexInfo.length === 1) {
                //一张layout
                let endParentNode = cardNode.children[indexInfo[0]];
                if (endParentNode.childrenCount === 1) {
                    let acCard = dlgActionNode.getComponent(Card);
                    let curCard = endParentNode.getComponentInChildren(Card);
                    if (acCard.Num === curCard.Num || (acCard.Num + curCard.Num) === 14) { //满足对子或14
                        return { node: endParentNode, index: 1, isChange: false }
                    } else {
                        //全部查找，自动配对
                        let endInfo = null;
                        cardNode.children.forEach((child, index) => {
                            if (endInfo) return;
                            if (child.childrenCount === 1 && child.visible) {
                                if (this.getCardData(child.children[0]).Num === acCard.Num || (this.getCardData(child.children[0]).Num + acCard.Num) === 14) {
                                    //排除自己跟自己组队
                                    if (index !== lastSelectedIndex)
                                        endInfo = { node: child, index: index, isChange: false };
                                }
                            }
                        })
                        if (endInfo) {
                            return endInfo;
                        } else {
                            //交换
                            return { node: cardNode, index: indexInfo[0], isChange: true };
                        }
                    }
                }
                //已经是对子/三张/4张/14
                else {
                    //对子
                    if (this.getCardData(endParentNode.children[0]).Num === this.getCardData(endParentNode.children[1]).Num) {
                        //可以组成碰杠
                        if (this.getCardData(endParentNode.children[0]).Num === this.getCardData(lastSelectedNode).Num) {
                            return { node: endParentNode, index: 0, isChange: false }
                        } else {
                            //向右移动 放在目标后面
                            if (indexInfo[0] > lastSelectedIndex) {
                                return { node: cardNode, index: indexInfo[0] + 1, isChange: false, isNewLayout: true };
                            }
                            //向左移动号，放在目标前面
                            else if (indexInfo[0] < lastSelectedIndex) {
                                return { node: cardNode, index: indexInfo[0], isChange: false, isNewLayout: true };
                            }
                            //位置不变的情况就是可以组成碰杠
                        }
                    }
                    //14
                    else {
                        //向右移动 放在目标后面
                        if (indexInfo[0] > lastSelectedIndex) {
                            return { node: cardNode, index: indexInfo[0] + 1, isChange: false, isNewLayout: true };
                        }
                        //向左移动号，放在目标前面
                        else if (indexInfo[0] < lastSelectedIndex) {
                            return { node: cardNode, index: (indexInfo[0] - 1) < 0 ? 0 : (indexInfo[0] - 1), isChange: false, isNewLayout: true };
                        }
                        //相等 位置不变，移到顶部
                        else {
                            return { node: endParentNode, index: 0, isChange: false }
                        }
                    }
                    //if对子 if 14  ifpeng
                    // return { node: cardNode, index: indexInfo[0], isChange: true };
                }
            } else {
                let cardNodeRect = cardNode.getBoundingBoxToWorld();
                if (pos.x < cardNodeRect.xMin) {
                    return { node: cardNode, index: 0, isChange: true };
                } else if (pos.x > cardNodeRect.xMax) {
                    return { node: cardNode, index: cardNode.childrenCount - 1, isChange: true };
                }
            }
        }
        return null;
    }

    //出牌
    performOutCard = function (card) {

        //禁止出牌
        if (!this.allowOutCard) return false;
        //出牌
        if (this.EventOutCard) this.EventOutCard({ Card: card });
        // GameNetwork.sendData(Message.MainCmd.Game, ClientCmd.UserOutCard, { Card: card });
        return true;
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

    //设置玩家手牌 (游戏开始发牌)
    setUserHandCard = function (viewPos, bankerPos, cards) {
        try {
            IsPlayAction(true);
            this.performWidget(true);
            this.updateRedPointCount();

            if (viewPos === 0) this.bottomHandCards = this.bottomHandCards.concat(cards);

            if (!this.IsReplayMode) {
                this.players.forEach((player, index) => {
                    if (index === viewPos) {
                        this.players[index].setUserHandCards(cards, true)
                    } else if (index === bankerPos && index !== viewPos) {
                        this.players[index].setUserHandCards(8, true)
                    } else {
                        this.players[index].setUserHandCards(7, true)
                    }
                })
            } else {
                this.players[viewPos].setUserHandCards(cards, true)
            }
        } catch (error) {
            cc.error('设置玩家手牌++++++++', error)
        }


    }

    //断线
    resumeUserHandCard = function (viewPos, cards) {
        IsPlayAction(true);
        if (viewPos === 0) {
            this.selfHandCards = [];
            this.bottomHandCards = [];
        }
        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(cards);
        }

        cc.log('手牌恢复', viewPos, cards)
        this.performWidget(true);
        if (this.IsReplayMode) {
            this.players[viewPos].setUserHandCards(cards, false)
        } else this.players[viewPos].setUserHandCards(cards, true);
    }

    //添加桌子上的牌
    setUserTableCard = function (viewPos, cards) {
        //断线恢复时为array
        if (cards instanceof Array) {
            cards.forEach(card => {
                this.players[viewPos].addTableCard(card);
            })
        } else {
            //中央的牌移动到出牌区
            let node = this.players[viewPos].addTableCard(cards, 0);
            setTimeout(() => {
                try {
                    if (!cc.isValid(this.node)) return;

                    // cc.log('游戏消息++++掉', new Date().format('hh:mm:ss:S'))
                    let wpos = node.convertToWorldSpaceAR(cc.v2(0, 0));
                    let npos = this.node.convertToNodeSpaceAR(wpos);
                    let moveLast = cc.moveTo(ActionTime.Fall, npos.x, npos.y);
                    let tableNode = this.TableLastOutCard1;
                    let seq = cc.sequence(cc.spawn(moveLast, cc.scaleTo(ActionTime.Fall, node.scale)), cc.callFunc(() => {
                        tableNode.node.visible = false;
                        node.setOpacity(255);
                        // cc.log('游戏消息++++掉完', new Date().format('hh:mm:ss:S'))
                    }));
                    tableNode.node.runAction(seq);
                    this.TableLastOutCard.node.visible = false;
                } catch (error) {
                    cc.error('添加桌子上的牌', error)
                }
            }, 0.05 * 1000);
        }
    }

    updataLastTableOutData = function (viewPos, card) {
        GameData.lastTableOutCard = card;
        lastOutCardPos = viewPos;
    }

    //自己出牌失败恢复
    onUserResetCard = function(viewPos, card) {
        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(card);
            this.players[viewPos].onUserResetCard(card);
        }
    }

    //玩家摸牌
    /**
     * 
     * @param viewPos 
     * @param cards 新进牌
     * @param newCardLen 偷牌结果，王的数量
     */
    onUserNewCard = function (viewPos, cards, newCardLen) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);

        if (!newCardLen && viewPos === 0) {
            if (cards instanceof Array) this.bottomHandCards = this.bottomHandCards.concat(cards);
            else this.bottomHandCards.push(cards);
        }

        this.updataLastTableOutData(null, null);
        //游戏开始偷牌后新进的牌Array  别人[];
        if (cards instanceof Array) {
            if (viewPos === 0) {
                // cards.forEach((card, index) => {
                //     this.players[viewPos].setUserHandCards(card, index === cards.length - 1 ? true : false, false, true);
                // })
                this.players[viewPos].setUserHandCards(cards, false, true);
            } else {
                if (this.IsReplayMode) {
                    // cards.forEach((card, index) => {
                    //     this.players[viewPos].setUserHandCards(card, index === cards.length - 1 ? true : false, false, true);
                    // })
                    this.players[viewPos].setUserHandCards(cards, false, true);
                } else {
                    if (newCardLen) this.players[viewPos].setUserHandCards(newCardLen, false, true);
                }
            }
        }
        //游戏中偷牌后新进的牌number 别人null;
        else {
            //手牌添加
            if (cards === null && viewPos !== 0) {
                this.players[viewPos].setUserHandCards(1, false, true);
            } else {
                this.players[viewPos].setUserHandCards(cards, false, true);
            }
        }
    }

    //从牌桌翻牌/系统发牌 /玩家出牌
    onSystemCard = function (viewPos, card, isOutCard = false) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);

        this.updataLastTableOutData(viewPos, card);

        this.onTableLastOutCardShow(viewPos, card, isOutCard);
    }

    /**
     * 将已经出的牌显示出来， 避免动画没播完就收到新消息停止了动画
     */
    onShowOutCard = function () {
        // cc.log('游戏消息++++没掉完', new Date().format('hh:mm:ss:S'))
        this.BottomOutCards.children.forEach(card => card.setOpacity(255));
        this.TopOutCards.children.forEach(card => card.setOpacity(255));
        this.LeftOutCards.children.forEach(card => card.setOpacity(255));
        this.LeftOutCards.children.forEach(card => card.setOpacity(255));
        this.removeOtherCard();
        //显示所有吃碰牌
        this.players.forEach(player => {
            player.recoveryWeavesCards();
        })
    }

    //移除未清除的牌
    removeOtherCard = function () {
        let removeCardNode = this.TopHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        });
        removeCardNode = removeCardNode.concat(this.LeftHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        }))
        removeCardNode = removeCardNode.concat(this.RightHandCards.children.filter(card => {
            return (card.getComponent(Card).isRemove)
        }));

        removeCardNode = removeCardNode.concat(this.BottomHandCards.children.filter(child => {
            child.children.forEach(card => {
                return (card.getComponent(Card).isRemove)
            });
        }));
        removeCardNode.forEach(node => {
            cc.log("移除+++++++")
            node.destroy();
        })
    }

    //显示新出的牌
    onTableLastOutCardShow = function (viewPos, card, isOutCard = false) {
        this.onShowOutCard();
        cc.log('显示新出的牌', isOutCard)

        //玩家出牌
        if (isOutCard) {
            this.TableLastOutCard.node.setOpacity(255);
            this.TableLastOutCard.node.stopAllActions();
            //播放出牌动画
            if (viewPos !== 0) {
                let node = this.players[viewPos].getLastCard(card);
                cc.log('添加出牌 +++++ out', viewPos)
                node.getComponent(Card).isRemove = true;
                node.visible = false;
                this.players[viewPos].outCardAction(node, card);
            } else {
                this.TableLastOutCard.node.stopAllActions();
                this.TableLastOutCard.node.scale = 1;

                this.TableLastOutCard.Data = card;
                this.TableLastOutCard.showFace = this.getSpriteFrameByCard(card);
                this.TableLastOutCard.node.visible = true;
                let endPos = this.players[viewPos].getTableCardEndPos();
                this.TableLastOutCard.node.setPosition(endPos);
            }
        } else {
            //播放翻牌动画
            this.players[viewPos].systemCardAction(card);
        }
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

    }


    clearLastOutCardTimer = function () {
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        // this.TableLastOutCard.node.visible = false;
        this.onShowOutCard();
        //
        if (lastOutCardPos !== null && GameData.lastTableOutCard !== null) {
            this.setUserTableCard(lastOutCardPos, GameData.lastTableOutCard);
            this.updataLastTableOutData(null, null);
        }

    }

    //碰杠数据恢复
    resumeWeavesCard = function (viewPos, cards, type) {
        if (type === 'gang') {
            if (cards instanceof Array) this.players[viewPos].onUserAddGang(cards, WeaveType.AnGang);
            else {
                //偷牌阶段暗杠 先不显示
                cards = [-1, -1, -1, -1];
                this.players[viewPos].onUserAddGang(cards, WeaveType.AnGang);
            }
        } else {
            this.players[viewPos].onUserAddWeaves(cards, type);
        }
    }

    //吃碰(断线恢复)
    performResumeWeavesCard = function (viewPos, cards, type) {
        this.onRemoveUserOutCard();
        if (type === 'wang') {
            //游戏中偷为number
            if (typeof (cards) === 'number') {
                //7当王
                if (this.getCardNum(cards) === 7) {
                    this.players[viewPos].onUserAddWeaves(cards, '7ToWang');
                } else {
                    this.players[viewPos].onUserAddWeaves(cards, 'wang');
                }
            }
            //游戏开始为array
            else {
                let Wang7 = cards.filter(card => {
                    return this.getCardNum(card) === 7;
                })
                let Wang = cards.filter(card => {
                    return this.getCardColor(card) === 4;
                })
                if (Wang.length > 0) this.players[viewPos].onUserAddWeaves(Wang, 'wang');

                if (Wang7.length > 0) {
                    this.players[viewPos].onUserAddWeaves(Wang7, '7ToWang');
                }
            }
        } else {
            this.players[viewPos].onUserAddWeaves(cards, type);
        }
    }

    removeHandCardData = function (viewPos, cards) {
        if (viewPos !== 0) return;

        let bottomCards = this.bottomHandCards.slice(0);
        bottomCards.forEach(val => {
            let index = this.bottomHandCards.findIndex(card => card === cards);
            if (index !== -1)
                this.bottomHandCards.splice(index, 1);
        })
    }

    //从手牌中移除吃碰杠的牌
    onRemoveUserHandCard = function (viewPos, cards, isDestroy = true) {
        let removeCardNode = [];
        if (cards instanceof Array) {
            let Cards = new Set(cards)
            Cards.forEach(card => {
                this.removeHandCardData(viewPos, card);
                let node = this.players[viewPos].onRemoveUserHandCard(card, isDestroy);
                removeCardNode = removeCardNode.concat(node);
            })
            console.log("LLL+++removeNode", removeCardNode)
        } else {
            if (typeof (cards) == "number") {
                this.removeHandCardData(viewPos, cards);
                let node = this.players[viewPos].onRemoveUserHandCard(cards, isDestroy);
                removeCardNode = removeCardNode.concat(node);
            }
        }
        return removeCardNode;
    }

    //处理断线恢复(其他玩家操作后移除放入table中的card)
    onRemoveUserOutCard = function () {
        let viewPos = lastOutCardPos;
        let card = GameData.lastTableOutCard;
        if (card && viewPos !== null)
            this.players[viewPos].onRemoveUserOutCard(card);
    }

    /**游戏开始偷牌结果
     * @param data 
     *  
    //偷牌后新进牌（不是自己则是空数组）
    Cards: Array<number>;
    //王牌
    Kings: Array<number>;
    //偷牌玩家座位号
    ChairID
     */
    onUserTouResult = function (viewPos, data) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        let Wang7 = data.Kings.filter(card => {
            return this.getCardNum(card) === 7;
        })
        let Wang = data.Kings.filter(card => {
            return this.getCardColor(card) === 4;
        })
        let wangNode = [];
        if (Wang.length > 0) {
            wangNode = this.players[viewPos].onUserAddWeaves(Wang, 'wang', false);
        }
        let wang7Node = [];
        if (Wang7.length > 0) {
            wang7Node = this.players[viewPos].onUserAddWeaves(Wang7, '7ToWang', false);
        }
        let startNodeInfo = [];
        //从手牌中移除王
        if (viewPos === 0) {
            startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings, false);
        } else {
            if (this.IsReplayMode) {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings, false);
            } else {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, data.Kings.length, false);
            }
        }

        // if (viewPos === 0) {
        let actionInfos = [];
        //王
        wangNode.forEach(wang => {
            let action = {};
            action.endNode = wang;

            let index = startNodeInfo.findIndex(start => {
                return start.getComponent(Card).Data === wang.getComponent(Card).Data;
            })
            if (index < 0) {
                action.startNode = null;
            } else {
                action.startNode = startNodeInfo.splice(index, 1)[0];

            }
            if (!action.startNode) action.startNode = startNodeInfo.shift();
            action.card = wang.getComponent(Card).Data;
            actionInfos.push(action);
        })
        //7当王
        wang7Node.forEach(wang => {
            let action = {};
            action.endNode = wang;
            action.startNode = startNodeInfo.find(start => {
                return start.getComponent(Card).Data === wang.getComponent(Card).Data;
            })
            if (!action.startNode) action.startNode = startNodeInfo.shift();
            action.card = wang.getComponent(Card).Data;
            actionInfos.push(action);
        })
        this.players[viewPos].addweavesAction(actionInfos, viewPos === 0 ? true : false);

        if (viewPos === 0) {
            this.bottomHandCards = this.bottomHandCards.concat(data.Cards);
        }


        if (this.IsReplayMode) {
            if (!cc.isValid(this.node)) return;
            //手牌添加新进牌 
            cc.log('偷startTouResultTimer', data.Cards, viewPos)
            this.onUserNewCard(viewPos, data.Cards, data.Kings.length);
        } else {
            let timerID = setTimeout(() => {
                if (!cc.isValid(this.node)) return;
                //手牌添加新进牌 
                cc.log('偷startTouResultTimer', data.Cards, viewPos)
                this.onUserNewCard(viewPos, data.Cards, data.Kings.length);
            }, 0.9 * 1000)
            this.startTouResultTimer = timerID;
            this.totalTimerID.push(timerID);
        }
        this.startTouResultCard = data.Cards
    }

    /**
     * 游戏中偷牌
     * @param viewPos 
     * @param Card 
     */
    onUserTouKing = function (viewPos, Card) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);
        let weavesNode = [];
        //7当王
        if (this.getCardNum(Card) === 7) {
            weavesNode = this.players[viewPos].onUserAddWeaves(Card, '7ToWang', false);
        } else {
            weavesNode = this.players[viewPos].onUserAddWeaves(Card, 'wang', false);
        }

        this.players[viewPos].onUserTouKing(Card, weavesNode[0]);
    }

    //玩家吃牌
    onUserChiCards = function (viewPos, cards) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true);
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        let actionInfos = [];
        if (cards instanceof Array) {
            let removeCard = cards.find(card => {
                return card !== GameData.lastTableOutCard;
            })

            let startNodeInfo = [];
            if (viewPos === 0) {
                //移除手中吃的牌
                startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
            } else {
                //移除手中吃的牌
                if (this.IsReplayMode) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                } else {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, 1, false);
                }
            }

            //weavea添加
            let chiNode = this.players[viewPos].onUserAddWeaves(cards, 'chi', false);
            chiNode.forEach(chi => {
                let action = {};
                action.endNode = chi;
                action.card = chi.getComponent(Card).Data;
                //要移除的那张
                if (removeCard === chi.getComponent(Card).Data) {
                    action.startNode = startNodeInfo[0];
                }
                else {
                    action.startNode = this.TableLastOutCard1.node;
                }
                actionInfos.push(action);
            })
            this.players[viewPos].addweavesAction(actionInfos, false);

            //移除桌上card
            // this.TableLastOutCard.node.visible = false;
        }

        let timerID = setTimeout(() => {
            if (!cc.isValid(this.node)) return;
            IsPlayAction(false);
        }, 0.9 * 1000);
        this.totalTimerID.push(timerID);
    }

    //玩家出牌
    onUserOutCard = function (viewPos, cards) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        if (typeof (cards) === 'number') {
            //手牌中移除出的牌
            if (viewPos === 0) {
                this.onRemoveUserHandCard(viewPos, cards);
                this.performWidget();
            }
            //桌上显示
            this.onSystemCard(viewPos, cards, true);
        }
    }

    //玩家碰牌
    onUserPengCards = function (viewPos, cards, type) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)
        let actionInfos = [];
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        if (cards instanceof Array) {
            //有时候收到null
            cards = cards.filter(card => {
                return card !== null;
            })
            //移除桌上显示的牌
            // this.TableLastOutCard.node.visible = false;
            if (type === WeaveType.Peng) {
                let lastCard = GameData.lastTableOutCard;
                let removeCard = cards
                if (lastCard) {
                    removeCard = cards.filter(card => {
                        return card !== lastCard;
                    })
                }
                let startNodeInfo = [];
                //移除手牌
                if (viewPos === 0) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                } else {
                    if (this.IsReplayMode) {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard, false);
                    } else {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, removeCard.length, false);
                    }
                }
                //添加weaves
                let pengNode = this.players[viewPos].onUserAddWeaves(cards, 'peng', false);
                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.find(start => {
                        return start.getComponent(Card).Data === peng.getComponent(Card).Data;
                    })
                    if (!action.startNode) {
                        if (viewPos === 0) {
                            action.startNode = this.TableLastOutCard1.node;
                        } else {
                            action.startNode = startNodeInfo.shift();
                            if (!action.startNode) action.startNode = this.TableLastOutCard.node;
                        }
                    }
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
            //anpeng,只有自己是数组
            else {
                //添加weaves
                let pengNode = this.players[viewPos].onUserAddWeaves(cards, 'anpeng', false);
                let startNodeInfo = [];
                //移除手牌
                if (viewPos === 0) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                } else {
                    if (this.IsReplayMode) {
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                    }
                }

                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.find(start => {
                        return start.getComponent(Card).Data === peng.getComponent(Card).Data;
                    })
                    if (!action.startNode) {
                        if (viewPos === 0) {
                            action.startNode = this.TableLastOutCard1.node;
                        } else {
                            action.startNode = startNodeInfo.shift();
                            if (!action.startNode) action.startNode = this.TableLastOutCard.node;
                        }
                    }
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
        }
        //其他玩家 暗碰 number
        else {
            if (type === WeaveType.AnPeng) {
                let startNodeInfo = this.onRemoveUserHandCard(viewPos, 3, false);
                let pengNode = this.players[viewPos].onUserAddWeaves(3, 'anpeng', false);
                pengNode.forEach(peng => {
                    let action = {};
                    action.endNode = peng;
                    action.card = peng.getComponent(Card).Data;
                    action.startNode = startNodeInfo.shift();
                    actionInfos.push(action);
                })
                this.players[viewPos].addweavesAction(actionInfos, false);
            }
        }
    }
    //玩家杠牌
    onUserGangCards = function (viewPos, cards, type) {
        if (viewPos === PlayerPositon.Bottom) IsPlayAction(true)

        this.onRemoveUserOutCard();
        this.TableLastOutCard.node.stopAllActions();
        this.TableLastOutCard.node.scale = 1;
        this.TableLastOutCard.node.visible = false;

        if (cards instanceof Array) {
            let actionInfos = [];
            //添加Weaves
            let gangNode = this.players[viewPos].onUserAddGang(cards, type, false);
            let startNodeInfo = [];
            //移除手牌
            if (viewPos === 0) {
                startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
            } else {
                if (this.IsReplayMode) {
                    startNodeInfo = this.onRemoveUserHandCard(viewPos, cards, false);
                } else {
                    //手牌进3张
                    if (type === WeaveType.AnGang) {
                        //移除手牌
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, cards.length, false);
                    }
                    //手牌3张+ 别人点
                    else if (type === WeaveType.DianGang) {
                        //移除桌上显示的牌
                        // this.TableLastOutCard.node.visible = false;
                        //移除手牌
                        startNodeInfo = this.onRemoveUserHandCard(viewPos, 3, false);
                    }
                    //已碰 + 自己翻或进的牌
                    else if (type === WeaveType.WanGang) {
                        //新翻的
                        if (this.getCardNum(GameData.lastTableOutCard) === this.getCardNum(cards[0])) {
                            //不移除
                            // this.TableLastOutCard.node.visible = false;
                        }
                        //新进的牌杠
                        else {
                            startNodeInfo = this.onRemoveUserHandCard(viewPos, 1, false);
                        }
                    }
                }
            }

            gangNode.forEach(gang => {
                let action = {};
                action.endNode = gang;
                action.card = gang.getComponent(Card).Data;
                action.startNode = startNodeInfo.find(start => {
                    return start.getComponent(Card).Data === gang.getComponent(Card).Data;
                })
                if (!action.startNode) {
                    if (viewPos === 0) {
                        action.startNode = this.TableLastOutCard1.node;
                    } else {
                        action.startNode = startNodeInfo.shift();
                        if (!action.startNode) action.startNode = this.TableLastOutCard1.node;
                    }
                }
                actionInfos.push(action);
            })
            this.players[viewPos].addweavesAction(actionInfos, false);
        }

    }

    //暗杠显示牌面
    onUserShowAnGang = function (viewPos, cards, type) {
        if (viewPos !== 0) {
            if (cards instanceof Array) this.players[viewPos].onUserShowAnGang(cards);
        }
    }

    //能操作的card
    performActionCards = function (Actions) {
        let getCardMap = () => {
            const cards = this.bottomHandCards;
            let cardMap = new Map();
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
            console.log('LLL++getCardMap', cardMap)
            return cardMap;
        }
        cc.log("玩家手牌+++++++++++++", this.bottomHandCards, this.selfHandCards);
        console.log('LLL++lastTableOutCard', GameData.lastTableOutCard)
        Actions.forEach(action => {
            switch (action) {
                case UserAction.Chi: {
                    let lastCard = GameData.lastTableOutCard;
                    if (lastCard) {
                        let lastNum = this.getCardNum(lastCard);
                        let chiCards = [];
                        this.bottomHandCards.forEach(card => {
                            if ((this.getCardNum(card) + lastNum) === 14) {
                                chiCards.push(card)
                            }
                        })
                        chiCards.forEach(card => {
                            if (this.getCardColor(card) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                            let chi = {
                                type: 'chi',
                                card: card
                            }
                            GameData.updateActionCard(chi);
                            GameData.isActionByTableCard = true;
                        })
                    }
                    break;
                }
                case UserAction.Peng: {
                    let lastCard = GameData.lastTableOutCard;
                    //打出的牌或翻的牌
                    if (lastCard) {
                        let lastNum = this.getCardNum(lastCard);
                        let cards = [];
                        this.bottomHandCards.forEach(card => {
                            if (this.getCardNum(card) === lastNum) {
                                cards.push(card)
                            }
                        })

                        if (cards.length >= 2) {
                            if (this.getCardColor(cards[0]) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(cards[0]) === 7) return;
                            let peng = {
                                type: 'peng',
                                card: cards[0]
                            }
                            GameData.updateActionCard(peng);
                            GameData.isActionByTableCard = true;
                        }
                    }
                    //自己进的牌
                    else {
                        let cardMap = getCardMap();
                        let peng = [];
                        cardMap.forEach(value => {
                            if (value.length >= 3) {
                                peng.push(value[0]);
                            }
                        })
                        console.log('LLL+++peng[]', peng)
                        peng.forEach(card => {
                            if (this.getCardColor(card) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                            let peng = {
                                type: 'peng',
                                card: card
                            }
                            GameData.updateActionCard(peng);
                            GameData.isActionByTableCard = false;
                        })
                    }
                    break;
                }
                case UserAction.Gang: {
                    let lastCard = GameData.lastTableOutCard;
                    let lastNum = this.getCardNum(lastCard);
                    //别人打出的牌或翻的牌
                    if (lastCard) {
                        //手牌里找
                        let cards = [];
                        this.bottomHandCards.forEach(card => {
                            if (this.getCardNum(card) === lastNum) {
                                cards.push(card);
                            }
                        })
                        if (cards.length === 3) {
                            if (this.getCardColor(cards[0]) === 4) return;
                            if (this.Rule.Allow7AsKing && this.getCardNum(cards[0]) === 7) return;
                            let gang = {
                                type: 'gang',
                                card: cards[0]
                            }
                            GameData.updateActionCard(gang);
                            GameData.isActionByTableCard = true;
                        }
                        //碰牌里找
                        else {
                            let peng = this.BottomUserChiCards.children.find(child => {
                                return this.getCardNum(child.getComponent(ChiCardLayout).Data) === lastNum && child.getChildByName('weaves').childrenCount === 3;
                            })
                            if (peng) {
                                let gang = {
                                    type: 'gang',
                                    card: peng.getChildByName('weaves').children[0].getComponent(Card).Data
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = true;
                            }
                        }
                    }
                    //自己进的牌
                    else {
                        let cardMap = getCardMap();
                        let gang = [];
                        cardMap.forEach(value => {
                            if (value.length > 3) {
                                gang.push(value[0]);
                            }
                        })
                        //手牌里能杠的牌
                        if (gang.length > 0) {
                            gang.forEach(card => {
                                if (this.getCardColor(card) === 4) return;
                                if (this.Rule.Allow7AsKing && this.getCardNum(card) === 7) return;
                                let gang = {
                                    type: 'gang',
                                    card: card
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = false;
                            })
                        }
                        //碰转杠的牌
                        else {
                            let pengToGang = this.BottomUserChiCards.children.filter(child => {
                                return (child.getComponent(ChiCardLayout).Type === 'peng' || child.getComponent(ChiCardLayout).Type === 'anpeng');
                            })
                            let gangData = [];
                            pengToGang.forEach(gang => {
                                let num = this.getCardNum(gang.getComponent(ChiCardLayout).Data);
                                this.bottomHandCards.forEach(card => {
                                    if (this.getCardNum(card) === num) {
                                        gangData.push(card);
                                    }
                                })
                            })
                            gangData.forEach(card => {
                                let gang = {
                                    type: 'gang',
                                    card: card
                                }
                                GameData.updateActionCard(gang);
                                GameData.isActionByTableCard = false;
                            })
                        }
                    }
                    break;
                }
            }
        });
    }
}

Red20_CardManager.prototype.TableLastOutCard1 = function () {
    let node = this.TableLastOutCard.node.clone();
    this.temporaryCard.addChild(node);
    const ctr = new Card(node);
    ctr.Data = this.TableLastOutCard.Data;
    ctr.showFace = this.getSpriteFrameByCard(this.TableLastOutCard.Data);
    node.visible = true;
    node.setScale(1);
    node.setOpacity(255);
    return ctr;
}

Red20_CardManager.prototype.actionMaskVisible = function (val) {
    // cc.log('禁止点击', val);
    if (!this.node.isValid) return;
    this.Mask.visible = val;
    if (val) {
        if (this.maskTimer) clearTimeout(this.maskTimer);
        this.maskTimer = setTimeout(() => {
            if (!this.node.isValid) return;
            this.Mask.visible = false;
            this.maskTimer = null;
        }, 1.5 * 1000)
        this.totalTimerID.push(this.maskTimer)
    }
}


Red20_CardManager.prototype.updateRedPointCount = function () {
    let num = 0;
    //手牌
    this.bottomHandCards.forEach(card => {
        //wang
        if (this.getCardColor(card) === 4) return;
        //红点
        if (this.getCardColor(card) % 2 === 0) {
            let cardNum = this.getCardNum(card);
            //7当王算点
            if (cardNum === 7) {
                if (this.Rule.Allow7AsKing && this.Rule.IsPoint7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                } else if (!this.Rule.Allow7AsKing) {
                    num += cardNum > 10 ? 1 : cardNum;
                }
            } else {
                num += cardNum > 10 ? 1 : cardNum;
            }
        }
    })
    //碰杠牌
    this.BottomUserChiCards.children.forEach(child => {
        child.getChildByName('weaves').children.forEach(card => {
            if (!card.visible || card.getOpacity() !== 255) return;
            //wang
            if (this.getCardData(card).Color === 4) return;
            //红点
            if (this.getCardData(card).Color % 2 === 0) {
                let cardNum = this.getCardData(card).Num;
                //7当王算点
                if (cardNum === 7) {
                    if (this.Rule.Allow7AsKing && this.Rule.IsPoint7AsKing) {
                        num += cardNum > 10 ? 1 : cardNum;
                    } else if (!this.Rule.Allow7AsKing) {
                        num += cardNum > 10 ? 1 : cardNum;
                    }
                } else {
                    num += cardNum > 10 ? 1 : cardNum;
                }
            }
        })
    })
    this.redPoint.visible = true;
    this.redPointBg.visible = true;
    this.redPoint.setString('红点:' + num);
}

//刷新对齐
Red20_CardManager.prototype.performWidget = function (first) {
    if (!this.BottomHandCards) return;
    let widget = this.BottomHandCards.getComponent(cc.Widget);
    if (widget === null) widget = this.BottomHandCards.addComponent(cc.Widget);
    widget.target = this.node;

    let num = 0;

    if (first) {
        widget.isAlignLeft = true;
        widget.left = 0.35;
    } else {
        this.BottomHandCards.children.forEach(child => {
            if (child.visible && child.childrenCount >= 1) {
                let card = child.children.find(node => {
                    return node.visible && node.getOpacity() === 255;
                })
                if (card) num += 1;
            }
        })

        if (num > 5) {
            widget.isAlignLeft = true;
            widget.left = 0.35;
        } else {
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
        }
    }
    cc.log('数量', num)
    widget.updateAlignment();
}

//报听手牌置灰
Red20_CardManager.prototype.maskCards = function () {
    if (this.isBaoTing) {
        this.BottomHandCards.children.forEach(child => {
            if (child.visible && child.childrenCount >= 1) {
                child.children.forEach(node => {
                    node.setColor(cc.Color.GRAY);
                })
            }
        })
    }
}

Red20_CardManager.prototype.onInit = function (cardAtlas) {
    cardMgr = this;
    this.node.children.forEach((node, index) => {
        if (index < 9)
            node.visible = false
    })
    this.cardAtlas = cardAtlas;
}

Red20_CardManager.prototype.getCardNum = function (card) {
    let cardNum = card % 16;
    return cardNum;
}

Red20_CardManager.prototype.getCardColor = function (card) {
    let cardColor = Math.floor(card / 16);
    return cardColor;
}