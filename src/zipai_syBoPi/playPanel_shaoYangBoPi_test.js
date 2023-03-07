//新版剥皮
var playPanel_shaoYangBoPi_test = cc.Layer.extend({
    card:null,
    size:null,
	ctor: function() {
		this._super();
        cc.eventManager.addListener(this.getHandCardListener(), -1);
        MjClient.playui = this;
        this.init();
	},
    init:function () {
        this.size = cc.director.getWinSize();
        var back = new ccui.ImageView("playing/gameTable/beijing_3.jpg");
        back.setPosition(cc.p(this.size.width / 2, this.size.height / 2));
        this.addChild(back);

        var layout_handCards = new ccui.Layout();
        layout_handCards.setName("layout_handCards")
        this.addChild(layout_handCards);

        MjClient.HandCardArr = [[1, 2, 3],[4, 5, 6], [7, 8, 9], [10], [21, 22, 23], [24, 25, 26], [27, 28, 29], [30]];

        cc.spriteFrameCache.addSpriteFrames("playing/ziPai/big/type1/cardType1.plist", "playing/ziPai/big/type1/cardType1.png");

        this.card = new ccui.ImageView(/*"playing/ziPai/big/type1/hand1.png"*/);
        this.card.loadTexture("hand1.png", 1);
        this.addChild(this.card);
        setWgtLayout(this.card, [75 / 1280, 0], [0.27, 0.75], [0, 0]);
        this.card.setPosition(0, 0);

        this.refreshHandCard();
    }
});
playPanel_shaoYangBoPi_test.prototype.refreshHandCard = function() {
    var layout_handCards = this.getChildByName("layout_handCards");
    layout_handCards.visible = true;
    this.handleHandCardBeforeRefresh();
    layout_handCards.removeAllChildren();
     var cardArr = MjClient.HandCardArr;
    //清理空数组
    for (var k = cardArr.length - 1; k >= 0; k--) {
        if (cardArr[k].length == 0) {
            cardArr.splice(k, 1);
        }
    }
    for (var k = 0; k < cardArr.length; k++) {
        var groupList = cardArr[k];
        for (var j = 0; j < groupList.length; j++) {
            this.addOneHandCard(k, j, groupList[j], 0);
        }
    }
    this.releaseHandCardNode(0);

    var handCard = this.card;
    var width = handCard.getVirtualRendererSize().width;
    var scale_x = handCard.scaleX;
    var winSize = MjClient.size;
    var totalWidth = width * cardArr.length * scale_x;
    for (var i = 0; i < cardArr.length; i++) {
        var addNode = layout_handCards.getChildByTag(i);

        if (addNode.lastPosition) {
            addNode.setPosition(addNode.lastPosition);
            this.doMoveToAction(addNode, cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
        } else {
            addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
        }
    }
};

playPanel_shaoYangBoPi_test.prototype.getHandCardListener = function () {
    return {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function(touch, event){
            return MjClient.playui.updateHandCardByTouchBegan(touch, event);
        },
        onTouchMoved:function (touch, event) {
            MjClient.playui.updateHandCardByTouchMoved(touch, event);
        },
        onTouchEnded:function (touch, event) {
            MjClient.playui.updateHandCardByTouchEndnd(touch, event);
        },
        onTouchCancelled: function(touch, event){
            MjClient.playui.updateHandCardByTouchEndnd(touch, event);
        }
    };
};

playPanel_shaoYangBoPi_test.prototype.updateHandCardByTouchBegan = function (touch, event){
    var point = touch.getLocation();
    cc.log("chow onTouchBegan", "world point = " + JSON.stringify(point));
    if(MjClient.movingCard_paohuzi == null){
        var layout_handCards = this.getChildByName("layout_handCards");
        for(var i = 0; i < layout_handCards.children.length; i++){
            var colNode = layout_handCards.children[i];
            for(var  j = 0; j < colNode.children.length; j++){
                var card = colNode.children[j];
                var nodePoint = colNode.convertToNodeSpace(point);
                cc.log("chow onTouchBegan", "nodePoint = " + JSON.stringify(nodePoint));
                //cc.log("chow onTouchBegan", "card = " + JSON.stringify(card.getBoundingBox()));
                if(cc.rectContainsPoint(card.getBoundingBox(), nodePoint)
                    && ((card.tag >= 1 && card.tag <= 10) || (card.tag >= 21 && card.tag <= 30))){
                    MjClient.movingCard_paohuzi = card;

                    card.setAnchorPoint(0.5, 0.5);
                    card.x += card.width * card.scaleX * 0.5;
                    card.y += card.height * card.scaleY * 0.5;

                    if (MjClient.playui.isShowLongCard()) { // 显示长牌
                        var alignWidth = card.scale * card.width;
                        card.loadTexture("playing/ziPai/big/type1/put" + card.tag + ".png");
                        card.scale = alignWidth / card.width;
                    }
                    return true;
                }
            }
        }
    }
    return false;
};

//test
playPanel_shaoYangBoPi_test.prototype.updateHandCardByTouchMoved = function (touch, event){
    if(MjClient.movingCard_paohuzi){
        MjClient.movingCard_paohuzi.setPosition(cc.pAdd(touch.getDelta(), MjClient.movingCard_paohuzi.getPosition()));
    }
};

//test
playPanel_shaoYangBoPi_test.prototype.updateHandCardByTouchEndnd = function (touch, event){
    var btn = MjClient.movingCard_paohuzi;
    if(btn && cc.sys.isObjectValid(btn)){
        MjClient.moveCard = {};
        MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX, btn.y - btn.anchorY * btn.height * btn.scaleY));
        var col = MjClient.moveCard.curCIndex = MjClient.moveCard.nexCIndex = btn.parent.tag;
        var row = MjClient.moveCard.curRIndex = MjClient.moveCard.nexRIndex = btn.name;
        var pos = btn.parent.convertToWorldSpace(btn.getPosition());
        var card = btn.tag;

        if (MjClient.playui.isShowLongCard()) {
            btn.loadTexture("playing/ziPai/big/type1/hand" + card.tag + ".png");
            btn.scale = cc.director.getWinSize().width / 1280;
            setWgtLayout(btn, [75 / 1280, 0], [0.27, 0.75], [0, 0]);
        }

        if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
            MjClient.playui.checkTingCards();
            MjClient.playui.refreshHandCard(0);
            delete MjClient.moveCard;
            return;
        }
        // cc.log("pos.x@@ ", pos.x, " btn.parent.x@@ ", btn.parent.x);
        var dstCol = col + Math.round((pos.x - btn.parent.x) / (btn.parent.width * btn.scaleX) - 0.5); // 目的列
        // cc.log("dstCol@@ ", dstCol);
        if (dstCol == col) { // 列未变
            MjClient.HandCardArr[col].splice(parseInt(row), 1);
            MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
        } else if (dstCol >= 0 && dstCol < MjClient.HandCardArr.length) { // 当前有手牌列
            if (MjClient.HandCardArr[dstCol].length < 4) { // 插牌
                MjClient.moveCard.nexCIndex = dstCol;
                MjClient.HandCardArr[col].splice(row, 1);
                MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
            }
        } else if (MjClient.HandCardArr.length < 10) { // 最前或最后 新增一列
            MjClient.HandCardArr[col].splice(parseInt(row), 1);
            if (dstCol < 0) {
                MjClient.HandCardArr.unshift([card]);
                MjClient.addGroupIndex = 0;
            } else if (dstCol >= MjClient.HandCardArr.length) {
                MjClient.HandCardArr.push([card]);
                MjClient.addGroupIndex = MjClient.HandCardArr.length - 1;
            }

            MjClient.moveCard.nexCIndex = MjClient.addGroupIndex;
            MjClient.moveCard.nexRIndex = 0;
        }
        btn.setAnchorPoint(0, 0);
    }
    MjClient.playui.refreshHandCard(0);
    MjClient.addGroupIndex = -1;
    delete MjClient.moveCard;
    MjClient.movingCard_paohuzi = null;
    //cc.log("chow onTouchEnded", "MjClient.movingCard_paohuzi = " + MjClient.movingCard_paohuzi);
};

playPanel_shaoYangBoPi_test.prototype.getEmptyIndex = function(cardArray) {
    var empty = [];
    for (var i = 0; i < cardArray.length; i++) {
        if (cardArray[i].length == 0) {
            empty.push(i);
        }
    }
    return empty;
}

playPanel_shaoYangBoPi_test.prototype.handleHandCardBeforeRefresh = function(off) {
    var layout_handCards = this.getChildByName("layout_handCards");

    //root列节点 card 牌节点
    layout_handCards.cardRoot = [];
    layout_handCards.cardList = [];

    //获取所有的牌节点
    var children1 = layout_handCards.getChildren();
    //cc.log("chow children1", JSON.stringify(children1, null, "  ") + "");
    if (children1) {
        for (var i = 0; i < children1.length; i++) {
            var children2 = children1[i].getChildren();
            //cc.log("chow children2", JSON.stringify(children2, null, "  ") + "");
            if (children2) {
                for (var j = 0; j < children2.length; j++) {
                    if (children2[j]) {
                        layout_handCards.cardList.push(children2[j]);
                    }
                }
            }
        }
    }
    //去除非卡牌节点,例如胡息显示
    function clearNotNumber(cardList) {
        if (cardList) {
            for (var i = cardList.length - 1; i >= 0; i--) {
                if (!((cardList[i].tag >= 1 && cardList[i].tag <= 10) || (cardList[i].tag >= 21 && cardList[i].tag <= 30))) {
                    var node = cardList.splice(i, 1);
                    node[0].removeFromParent();
                }
            }
        }
    }
    clearNotNumber(layout_handCards.cardList);
    if (layout_handCards.cardList.length == 0) {
        return;
    }
    //按列从下而上排序 与上一次数据一一对应起来
    layout_handCards.cardList.sort(function(a, b) {
        if (a.parent.tag < b.parent.tag) {
            return -1;
        } else if (a.parent.tag == b.parent.tag) {
            if (a.name < b.name) {
                return -1;
            } else if (a.name == b.name) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    })
    /*for(var k = 0; k < layout_handCards.cardList.length; k++){
     cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " name = " + layout_handCards.cardList[k].name + " parentTag =" + layout_handCards.cardList[k].parent.tag);
     }*/
    //查找当前移动的牌 并更新移动位置
    if (MjClient.moveCard) {
        cc.log("chow", "cleanCardNode" + " moveCard curCIndex = " + MjClient.moveCard.curCIndex + " curRIndex = " + MjClient.moveCard.curRIndex + " nexCIndex = " + MjClient.moveCard.nexCIndex + " nexRIndex = " + MjClient.moveCard.nexRIndex);

        var oldIndex = layout_handCards.cardList.length;
        //var moveCard;
        //查找当前移动牌
        for (var i = 0; i < layout_handCards.cardList.length; i++) {
            if (layout_handCards.cardList[i].parent.tag == MjClient.moveCard.curCIndex && layout_handCards.cardList[i].name == MjClient.moveCard.curRIndex) {
                //cc.log("chow", "cleanCardNode" + " layout_handCards i = " + i + " tag = " + layout_handCards.cardList[i].parent.tag + " name = " + layout_handCards.cardList[i].name);
                oldIndex = i;
                //moveCard = layout_handCards.cardList.splice(i, 1);
                break;
            }
        }
        if (oldIndex != layout_handCards.cardList.length) {
            //转化成当前坐标
            //moveCard[0].setPosition(moveCard[0].parent.convertToNodeSpace(MjClient.moveCard.curPosition));
            layout_handCards.cardList[oldIndex].setPosition(layout_handCards.cardList[oldIndex].parent.convertToNodeSpace(MjClient.moveCard.curPosition));

            if (MjClient.moveCard.curCIndex != MjClient.moveCard.nexCIndex || MjClient.moveCard.curRIndex != MjClient.moveCard.nexRIndex) {
                var moveCard = layout_handCards.cardList.splice(oldIndex, 1);
                //cc.log("chow", "cleanCardNode" + " moveCard tag = " + moveCard[0].tag + " name = " + moveCard[0].name);
                var newIndex = layout_handCards.cardList.length;
                //查到当前移动牌移动的目标位置
                for (var i = 0; i < layout_handCards.cardList.length; i++) {
                    //cc.log("chow", "cleanCardNode" + " layout_handCards.cardList tag = " + layout_handCards.cardList[i].parent.tag + " name = " + layout_handCards.cardList[i].name);
                    if (layout_handCards.cardList[i].parent.tag == MjClient.moveCard.nexCIndex && layout_handCards.cardList[i].name >= MjClient.moveCard.nexRIndex || layout_handCards.cardList[i].parent.tag > MjClient.moveCard.nexCIndex) {
                        newIndex = i;
                        break;
                    }
                }
                cc.log("chow", "cleanCardNode" + " newIndex = " + newIndex);
                if (newIndex == layout_handCards.cardList.length) {
                    layout_handCards.cardList.push(moveCard[0]);
                } else {
                    layout_handCards.cardList.splice(newIndex, 0, moveCard[0]);
                }
            }
            // else {
            //     //00位置移动到00位置
            //     layout_handCards.cardList.unshift(moveCard[0]);
            // }
        }
    }
    //将按数据排序好的牌复用 后续直接取
    // cc.log("chow cleanCardNode cardList.length = ", layout_handCards.cardList.length + "");
    /*for(var k = 0; k < layout_handCards.cardList.length; k++){
     cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " name = " + layout_handCards.cardList[k].name + " parentTag =" + layout_handCards.cardList[k].parent.tag);
     }*/
    //cc.log("chow", JSON.stringify(layout_handCards.cardList, null, "  ") + "");
    for (var k = 0; k < layout_handCards.cardList.length; k++) {
        layout_handCards.cardList[k].lastPosition = layout_handCards.cardList[k].parent.convertToWorldSpace(layout_handCards.cardList[k].getPosition());
        layout_handCards.cardList[k].isSelect = false;
        layout_handCards.cardList[k].retain();
        layout_handCards.cardList[k].removeFromParent(false);
        // cc.log("chow", "cleanCardNode cardList: k = " + k + " tag = " + layout_handCards.cardList[k].tag + " pos = " + JSON.stringify(layout_handCards.cardList[k].lastPosition), null, "  ");
    }

    //获取所有的列节点 按照数据顺序0-X
    for (var i = 0; i < layout_handCards.childrenCount; i++) {
        layout_handCards.cardRoot.push(layout_handCards.getChildByTag(i));
    }
    if (layout_handCards.cardRoot.length == 0) {
        return;
    }
    //复用列节点 ,后续直接查找使用
    // cc.log("chow cleanCardNode cardRoot.length = ", layout_handCards.cardRoot.length + "");
    for (var k = 0; k < layout_handCards.cardRoot.length; k++) {
        //cc.log("chow", "cleanCardNode cardRoot: k = " + k + " : " + layout_handCards.cardRoot[k].tag);
        layout_handCards.cardRoot[k].retain();
        layout_handCards.cardRoot[k].removeFromParent(false);

        //layout_handCards.cardRoot[k].lastPosition = layout_handCards.cardRoot[k].getPosition();
        //cc.log("chow", JSON.stringify(layout_handCards.cardRoot[k].lastPosition), null, "  ");
    }
    //查找数据中被删除的列索引
    // cc.log("chow", "cleanCardNode : MjClient.HandCardArr = "  + JSON.stringify(MjClient.HandCardArr));
    var empty = this.getEmptyIndex(MjClient.HandCardArr);
    for (var i = 0; i < empty.length; i++) {
        // cc.log("chow", "cleanCardNode empty[" + i + "] = " + empty[i]);
    }

    //区分左右新建列和无变化
    // cc.log("chow", "cleanCardNode addGroupIndex:" + MjClient.addGroupIndex);
    if (MjClient.addGroupIndex == 0) {
        //最左边新建
        if (empty.length == 0) {
            //新增列，新增一个列结点插入最前面
            var cardParent = new cc.Node();
            cardParent.width = layout_handCards.cardList[0].width;
            cardParent.retain();
            cardParent.setPosition(cc.p(layout_handCards.cardRoot[0].x - layout_handCards.cardRoot[0].width / 2, layout_handCards.cardRoot[0].y));

            layout_handCards.cardRoot.unshift(cardParent);
        } else {
            //只有当列数大于1时才取出设置 否则不用移动
            if (layout_handCards.cardRoot.length > 1) {
                //移动列，取出移动列插入到最前面
                var cardParent = layout_handCards.cardRoot.splice(empty[0] - 1, 1); //这里需要减去前面新增的一个位置
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[0].x - layout_handCards.cardRoot[0].width / 2, layout_handCards.cardRoot[0].y));
                layout_handCards.cardRoot.unshift(cardParent[0]);
            }
        }
    } else if (MjClient.addGroupIndex == MjClient.HandCardArr.length - 1) {
        //最右边新建
        if (empty.length == 0) {
            //新增列，新增一个列结点插入最后面
            var cardParent = new cc.Node();
            cardParent.width = layout_handCards.cardList[0].width;
            cardParent.retain();
            cardParent.setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));

            layout_handCards.cardRoot.push(cardParent);
        } else {
            //只有当列数大于1时才取出设置 否则不用移动
            if (layout_handCards.cardRoot.length > 1) {
                //移动列，取出移动列插入到最后面
                var cardParent = layout_handCards.cardRoot.splice(empty[0], 1);
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));
                layout_handCards.cardRoot.push(cardParent[0]);
            }
        }
    } else {
        //删除无数据列
        for (var i = empty.length - 1; i >= 0; i--) {
            var cardParent = layout_handCards.cardRoot.splice(empty[i], 1);
            if (layout_handCards.cardRoot.length > 0) {
                cardParent[0].setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));
            }
            layout_handCards.cardRoot.push(cardParent[0]);
        }
        //刷新时导致列数不够需要先补齐列数
        if (layout_handCards.cardRoot.length > 0) {
            var addRootCount = MjClient.HandCardArr.length - layout_handCards.cardRoot.length;
            // cc.log("chow", "cleanCardNode" + " addRootCount = " + addRootCount);
            for (var i = 0; i < addRootCount; i++) {
                var cardParent = new cc.Node();
                cardParent.width = layout_handCards.cardList[0].width;
                cardParent.retain();
                cardParent.setPosition(cc.p(layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].x + layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].width / 2, layout_handCards.cardRoot[layout_handCards.cardRoot.length - 1].y));

                layout_handCards.cardRoot.push(cardParent);
            }
        }
    }
    //排好顺序的列节点，重置顺序Id
    for (var k = 0; k < layout_handCards.cardRoot.length; k++) {
        layout_handCards.cardRoot[k].tag = k;
        layout_handCards.cardRoot[k].lastPosition = layout_handCards.cardRoot[k].getPosition();
        // cc.log("chow", JSON.stringify(layout_handCards.cardRoot[k].lastPosition), null, "  ");
    }
};

playPanel_shaoYangBoPi_test.prototype.getCardNodeFromList = function(cardList, cardNum) {
    for (var i = 0; i < cardList.length; i++) {
        //防止拖动卡牌时点击刷新或者吃碰导致优先使用了克隆的结点,所以取非透明度结点
        if (cardList[i].tag == cardNum && cardList[i].isSelect == false && cardList[i].opacity == 255) {
            cardList[i].isSelect = true;
            //cc.log("chow", "getCardNode : " + i);
            return cardList[i];
        }
    }
    return null;
};

playPanel_shaoYangBoPi_test.prototype.getCardRoot = function(cardRoot, col) {
    for (var i = 0; i < cardRoot.length; i++) {
        if (cardRoot[i].tag == col) {
            //cc.log("chow", "getCardRoot : " + i);
            return cardRoot[i];
        }
    }
    return null;
};

playPanel_shaoYangBoPi_test.prototype.doMoveToAction = function(node, targetPos) {
    node.stopAllActions();
    var action = cc.moveTo(0.15, targetPos);
    node.runAction(action);
};

playPanel_shaoYangBoPi_test.prototype.addOneHandCard = function(col, row, cardNum, off) {
    //根据牌的类型获得需要添加的节点
    var layout_handCards = this.getChildByName("layout_handCards");
    //取一个对应的牌节点
    var newCard = this.getCardNodeFromList(layout_handCards.cardList, cardNum);
    if (!newCard) {
        // cc.log("chow", "newCard");
        newCard = this.card.clone();
        newCard.loadTexture("playing/ziPai/big/type1/hand" + cardNum + ".png");
        setWgtLayout(newCard, [75 / 1280, 0], [0.27, 0.75], [0, 0]);
    } else {
        // cc.log("chow", "getCard");
    }
    var scale_y = newCard.scaleY;

    var cardParent = layout_handCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = this.getCardRoot(layout_handCards.cardRoot, col);
        if (!cardParent) {
            // cc.log("chow", "newRoot");
            cardParent = new cc.Node();
            cardParent.tag = col;
            cardParent.width = newCard.width;
            layout_handCards.addChild(cardParent);
        } else {
            // cc.log("chow", "getRoot from list");
            layout_handCards.addChild(cardParent);
        }
        cardParent.zIndex = 0;
    } else {
        // cc.log("chow", "getRoot from parent");
    }

    if (MjClient.movingCard_paohuzi == newCard) {
        if (this.isShowLongCard()) {
            newCard = this.card.clone();
            newCard.loadTexture("playing/ziPai/big/type1/hand" + cardNum + ".png");
            newCard.scale = cc.director.getWinSize().width / 1280;
            setWgtLayout(newCard, [75 / 1280, 0], [0.27, 0.75], [0, 0]);
        }
    }
    newCard.tag = cardNum;
    var beginPoint = cc.p(0, 0);
    var off_y = newCard.height * scale_y - newCard.height / 4 * scale_y
    var cardCount = cardParent.childrenCount;

    newCard.setName(row);
    newCard.zIndex = 4 - row;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    //newCard.x = beginPoint.x;
    //newCard.y = beginPoint.y + cardCount * off_y;
    cardParent.addChild(newCard);
    if (newCard.lastPosition) {
        newCard.setPosition(cardParent.convertToNodeSpace(newCard.lastPosition));
        this.doMoveToAction(newCard, cc.p(beginPoint.x, beginPoint.y + cardCount * off_y));
    } else {
        newCard.x = beginPoint.x;
        newCard.y = beginPoint.y + cardCount * off_y;
    }
};

playPanel_shaoYangBoPi_test.prototype.isShowLongCard = function() {
    return true;
};

playPanel_shaoYangBoPi_test.prototype.releaseHandCardNode = function(off) {
    //根据牌的类型获得需要添加的节点
    var layout_handCards = this.getChildByName("layout_handCards");
    // cc.log("chow resetCardNode cardList.length", addNode.cardList.length + "");
    for (var i = 0; i < layout_handCards.cardList.length; i++) {
        layout_handCards.cardList[i].release();
    };

    // cc.log("chow resetCardNode cardRoot.length", addNode.cardRoot.length + "");
    for (var i = 0; i < layout_handCards.cardRoot.length; i++) {
        layout_handCards.cardRoot[i].release();
    }
};

playPanel_shaoYangBoPi_test.prototype.isKan = function(arr) {
    if (arr) {
        var len = arr.length;
        if (len < 3) {
            return false;
        }

        var count = 1;
        var temTag = arr[0];
        for (var i = 1; i < len; i++) {
            var tag = arr[i];
            if (tag == temTag) {
                count += 1;
            }
        }
        if (count >= 3) {
            return true;
        }
    }
    return false;
};

/**
 * 数据插入
 * @param arr
 * @param cardNum
 * @param card
 */
playPanel_shaoYangBoPi_test.prototype.fixArrIndex = function(arr, cardNum, card) {
    if (arr) {
        if (this.isKan(arr)) {
            arr.push(cardNum);
            MjClient.moveCard.nexRIndex = 3;
        } else {
            var off_y = card.height / 4 * card.scaleY;
            var maxH = card.height * card.scaleY * 3 - off_y * 2;
            if (card.y > maxH) {
                arr.push(cardNum);
                MjClient.moveCard.nexRIndex = 3;
            } else if (card.y > card.height * card.scaleY * 2 - off_y) {
                arr.splice(2, 0, cardNum);
                MjClient.moveCard.nexRIndex = 2;
            } else if (card.y > card.height * card.scaleY) {
                arr.splice(1, 0, cardNum);
                MjClient.moveCard.nexRIndex = 1;
            } else {
                arr.splice(0, 0, cardNum);
                MjClient.moveCard.nexRIndex = 0;
            }
        }
    }
};