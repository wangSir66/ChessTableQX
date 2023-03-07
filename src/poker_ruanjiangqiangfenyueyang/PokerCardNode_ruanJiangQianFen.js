/**
 * 斗地主手牌组件
 */
var PokerCardNode_Rujiangqianfen = cc.Node.extend({
    node: null,
    ctor: function(off) {
        this._super();
        // 加载csb资源
        var  csbNode = ccs.load("Ruanjiangqianfen_CardNode.json").node;
        this.node=csbNode;

        this.NOR_HAND_NAME = "pkhand";
        this.REP_HAND_NAME = "pkhand_replay";
        this.OUT = "out";
        this.SHOW = "show";
        this.SCALE1 = 1.0;
        this.SCALE2 = 1.0;

        this.stand = csbNode.getChildByName("stand");
        this.stand.visible = false;
        this.off=off;
        this.standPosY = this.stand.y-70 + (off > 0 ? 0 : 25);
        this.standSize = this.stand.getSize();
        this.standScale = this.stand.scale;
        this.selectedCardsUi = [];
        this.cardUisGroup = [];
    }
});

// =========================[[ 流程方法 ]] ================================

//添加手牌
PokerCardNode_Rujiangqianfen.prototype.initHandCards = function () {
    var pl = getUIPlayer(this.off);
    if (pl==null || pl.mjhand==null) { return; }
    if(MjClient.rePlayVideo == -1 && this.off > 0) { return; }// 表示正常游戏, 只初始化自己的手牌
    var name = this.off == 0 ? this.NOR_HAND_NAME : this.REP_HAND_NAME;
    
    var scale = MjClient.rePlayVideo == -1 ? this.SCALE1 : this.SCALE2;
    this.createHandCards(pl.mjhand, name, scale);
    this.cardLayoutRestoreForPlay();
};

// 打牌的摆放
PokerCardNode_Rujiangqianfen.prototype.cardLayoutRestoreForPlay = function() {
    var pl = getUIPlayer(this.off);
    if (pl==null || pl.mjhand==null) { return; }

    this.cardLayoutRestore(pl.mjhand);
};

// =========================[[ 操作手牌方法 ]] =============================
PokerCardNode_Rujiangqianfen.prototype.dealTouchCards = function (worldSp, isBegan) {
    var children = this.node.children;
    var locationInNode = this.node.convertToNodeSpace(worldSp);
    for(var i = 0; i < children.length; i++) {
        if(children[i].name == this.NOR_HAND_NAME){
            var _boundingBox = children[i].getBoundingBox();
            if(children[i].getUserData() > 1) {
                _boundingBox.y += (_boundingBox.height * 0.68);
                _boundingBox.height = _boundingBox.height * 0.32;
            }
            if (cc.rectContainsPoint(_boundingBox, locationInNode)) {
                var val = MjClient.majiang.calPoint(children[i].tag);
                var isZhaDan = this.cardUisGroup[val] && this.cardUisGroup[val].length >= 4;
                if (isBegan)//如果是touchbegin
                {
                    this.selectedCardsUi = [];
                    if (isZhaDan!==this.isOnZhaDan || (isZhaDan &&  this.getCardSelected(children[i]) == false)) 
                        this.clearCardsUpStatus();
                    this.isOnZhaDan = isZhaDan;
                }
                if (this.isOnZhaDan == isZhaDan && this.selectedCardsUi.indexOf(children[i]) == -1) 
                {
                    if (this.isOnZhaDan && isZhaDan && this.getCardSelected(children[i]) == false) 
                    {
                        this.selectedCardsUi = [];
                        this.clearCardsUpStatus();
                    }
                    this.selectedCardsUi.push(children[i]);
                    children[i].setColor(MjClient.grayColor);
                    if (this.cardUisGroup[val] && this.cardUisGroup[val].length >= 4) {
                        for(var j =0;j<this.cardUisGroup[val].length;j++) {
                            var ci = this.cardUisGroup[val][j];
                            if (this.selectedCardsUi.indexOf(ci) == -1) {
                                this.selectedCardsUi.push(ci);
                            }
                        }
                    }
                }              

                return true;
            }
        }
    }
    return false;
};
PokerCardNode_Rujiangqianfen.prototype.handleCardsWithinMoveRange = function() {
    var children = this.node.children;
    for(var i = 0; i < children.length; i++) {
        if(children[i].name == this.NOR_HAND_NAME){
            children[i].setColor(MjClient.whiteColor);
        }
    }
    if (this.selectedCardsUi.length == 0) {
        return ;
    }
    for (var i = 0;i < this.selectedCardsUi.length; i++) {
        var ci = this.selectedCardsUi[i];
        if(this.getCardSelected(ci) == false) {
            this.setCardSelected(ci,true);
        } else {
            this.setCardSelected(ci,false);
        }
    }
    this.selectedCardsUi = [];
}

PokerCardNode_Rujiangqianfen.prototype.setCardSelected =function(nodeCard,bSelect) {
    if(cc.isUndefined(nodeCard) || nodeCard.name != this.NOR_HAND_NAME) { return ; }
    nodeCard.getChildByName("img_select").visible = bSelect;
}

PokerCardNode_Rujiangqianfen.prototype.getCardSelected =function(nodeCard) {
    if(cc.isUndefined(nodeCard) || nodeCard.name != this.NOR_HAND_NAME) { return ; }
    return nodeCard.getChildByName("img_select").visible;
}

// 清除手牌提起状态
PokerCardNode_Rujiangqianfen.prototype.clearCardsUpStatus = function() {
    var children = this.node.children;
    for(var i = 0; i < children.length; i++) {
        if (children[i].name == this.NOR_HAND_NAME) {
            this.setCardSelected(children[i],false);
        }
    }
};

// 根据牌值,提起手牌
PokerCardNode_Rujiangqianfen.prototype.liftCardUp = function(valueArr) {
    var children = this.node.children;
    var tmpArr = valueArr.slice();
    for(var i = children.length - 1; i >= 0; i--) {
        if (children[i].name == this.NOR_HAND_NAME) {
            for (var j = 0; j < tmpArr.length; j++) {
                if(MjClient.majiang.calPoint(children[i].tag) == MjClient.majiang.calPoint(tmpArr[j])) {
                    this.setCardSelected(children[i],true);
                    tmpArr.splice(j, 1);
                    break;
                }
            }
        }
    }
};
// =========================[[ 手牌属性方法 ]] =============================
//获取提起的牌值，返回牌值数组(有序)
PokerCardNode_Rujiangqianfen.prototype.getUpCardArr = function() {
    var children = this.node.children;
    var selectCards = [];
    for(var i = 0;i <children.length; i++){
        if(children[i].name == this.NOR_HAND_NAME && this.getCardSelected(children[i])) {
            selectCards.push(children[i].tag);
        }
    }
    return selectCards;
};
PokerCardNode_Rujiangqianfen.prototype.cardLayoutRestore = function(oCards,isOutPut) {
    if(cc.isUndefined(oCards) || oCards.length == 0){ return; }
    if(isOutPut) {
        var cards = oCards.slice()
        var orders = this.getNodeCards();
        if (orders.length == 0) {
            return;
        }
        var startX = this.getStartXForDeskCard(orders, isOutPut);
        var cardWidth = orders[0].width;
        var width = cardWidth * 0.55;
        for (var i = 0; i < orders.length; i++) {
            var ci = orders[i];
            ci.x = startX;
            startX += width;
            ci.zIndex = 600 + i;

            if (i == orders.length - 1 && MjClient.majiang.calType(cards) == MjClient.majiang.CARDTPYE.zhadan) {
                this.showNum(ci,orders.length);
            }
        }
    } else {
        this.cardLayoutRestoreForhand(oCards);
    }
};

PokerCardNode_Rujiangqianfen.prototype.cardLayoutRestoreForhand = function(oCards){
    if(cc.isUndefined(oCards) || oCards.length == 0){ return; }
    var cards = oCards.slice();
    cards = MjClient.majiang.sortCardsValues(cards);
    var orders = this.getNodeCards();
    if(orders.length == 0) {return; }
    var cardUimaps = this.divideCardByPoint(orders);

    var startX = this.getStartXForHandCard(cardUimaps);
    var cardWidth = this.standSize.width * 0.95;

    for(var i = cardUimaps.length -1; i >= 0; i--){
        var offSetY = this.standSize.height * (this.off > 0 ? 0.5 : 0.45);
        var startY = this.standPosY;
        if(cardUimaps[i].length >= 4) {
            offSetY = 16;
        }
        for(var j = 0;j<cardUimaps[i].length;j++) {
            var ci = cardUimaps[i][j];
            ci.x = startX;
            ci.y = startY;
            startY += offSetY;
            ci.setUserData(j+1);
            ci.zIndex = 600 - i + 20 -j;
            if(j == cardUimaps[i].length-1 && MjClient.playui.isSendCard == 0) {
                this.showNum(ci,cardUimaps[i].length,true);
            } else {
                this.showNum(ci,0, true);
            }
        }
        startX += cardWidth;
    }
}
PokerCardNode_Rujiangqianfen.prototype.divideCardByPoint = function(orders) {
    var cardUiMaps = [];
    orders.sort(function(a,b){
        return a.tag - b.tag;
    });
    this.cardUisGroup = [];
    for(var i = 0;i < 60;i++){
        cardUiMaps[i] = [];
        this.cardUisGroup[i] = []
    }
    for(var i = 0;i < orders.length;i++) {
        var val = MjClient.majiang.calPoint(orders[i].tag);
        cardUiMaps[val].push(orders[i]);
        this.cardUisGroup[val].push(orders[i]);
    }
    var cardUiMaps2 = cardUiMaps.filter(function(arr){
        return arr.length > 0;
    });
    return cardUiMaps2;
}
PokerCardNode_Rujiangqianfen.prototype.getStartXForHandCard = function (orders){
    var startX;
    var screenScale = MjClient.size.width/MjClient.size.height*720/1280;
    var width = this.standSize.width;
    if(this.off==1)
    {
        startX = -width*orders.length;
    }else if(this.off==2){
        startX = 0;
    } else if(this.off == 0){
        startX = (screenScale*1280 - screenScale*width * (orders.length - 4))/2 + screenScale*width/2;
    }
    else{//存在第四个玩家
        startX = 0;
    }
    return startX;
}
PokerCardNode_Rujiangqianfen.prototype.getNodeCards = function (){
    var orders = []; //排序后的牌节点
    for (var j = 0; j < this.node.children.length; j++) {
        var ci = this.node.children[j];
        if((ci.name == this.NOR_HAND_NAME || ci.name == this.REP_HAND_NAME || ci.name == this.OUT || ci.name == this.SHOW)) {
            orders.push(ci);
        }
    }
    return orders;
}

PokerCardNode_Rujiangqianfen.prototype.getStartXForDeskCard = function (orders,isOutPut){
    var startX;
    var cardWidth = orders[0].width;
    var screenScale = MjClient.size.width/1280;
    var areaWidth = MjClient.size.width - screenScale * 120;
    var width = cardWidth*0.55;
    var offset = orders.length>17 ? 3 : 12;
    width += offset;
    if(this.off==1)
    {
        startX = -width*orders.length; // 420
    }else if(this.off==2){
        if(MjClient.MaxPlayerNum == 2) {
            startX = -width*orders.length; // 420
        } else  {
            startX = (areaWidth - width * (orders.length - 1))/2 - screenScale * 484;
        }
    }else if(this.off==3){
        startX = 0;
    }else if(this.off==4){
        startX = 0;
    }else if(this.off==0 || !isOutPut){
        startX = (areaWidth - width * (orders.length - 1))/2 - screenScale * 484;
    }
    return startX;
}

// =========================[[ 手牌创建删除方法 ]] ==========================

//创建一组手牌, 创建手牌先清理手牌
PokerCardNode_Rujiangqianfen.prototype.createHandCards = function(cardValueArr, name, scale){
    //this.clearHandCard();
    this.removeAllCards();
    for(var i= 0; i<cardValueArr.length; i++) {
        var nodeCard = this.createOneCardNode(cardValueArr[i], name, scale);
        this.setCardSelected(nodeCard,false);
        this.node.addChild(nodeCard);
    }
};
// 创建一张手牌
PokerCardNode_Rujiangqianfen.prototype.createOneCardNode = function(value, name, scale){
    var cpnode = this.stand.clone();
    cpnode.setName(name);
    cpnode.setScale(cpnode.getScale() * scale);
    cpnode.visible = true;
    cpnode.setSwallowTouches(true);
    this.setSpriteCard(cpnode, value,getCurrentPKImgType());
    return cpnode;
};
PokerCardNode_Rujiangqianfen.prototype.setSpriteCard=function(node,cd,type){
    var cardvalue=node.getChildByName("value");
    var small=node.getChildByName("small");
    var big=node.getChildByName("big");
    var Rsmall=node.getChildByName("Rsmall");
    var Rvalue=node.getChildByName("Rvalue");
    var joker=node.getChildByName("joker");
    var path;
    cardvalue.ignoreContentAdaptWithSize(true);
    Rvalue.ignoreContentAdaptWithSize(true);
    var tmp;
    cardvalue.setScale(tmp = type == 0 ? 1 : 1);
    Rvalue.setScale(tmp = type == 0 ? 1 : 1);
    small.setScale(tmp = type == 0 ? 0.34 : 0.25);
    path = (tmp = type ==0 ? "playing/cardPic/" :"playing/cardPic2/");
    var cardType = Math.ceil( cd / 4);// A,2 ,3, 4, 。。。。 j ,Q .k
    var flowerType = cd % 4;// 0 黑桃 ，1 方块 ，2 梅花 ，3 红桃
    var isJoker = false;
    if(cd == 53 || cd == 54)//小王， 大王
    {
        isJoker = true;
    }
    if(!isJoker)
    {
        //小花
        big.loadTexture(path+"flower_"+flowerType+".png");
        small.loadTexture(path+"flower_"+flowerType+".png");
        Rsmall.loadTexture(path+"flower_"+flowerType+".png");
        if(flowerType == 0||flowerType == 2)
        {
            cardvalue.loadTexture(path+"hei_"+cardType+".png");
            Rvalue.loadTexture(path+"hei_"+cardType+".png");
        }else{
            cardvalue.loadTexture(path+"hong_"+cardType+".png");
            Rvalue.loadTexture(path+"hong_"+cardType+".png");
        }
        joker.visible=false;
        small.visible=true;
    }else{
        joker.loadTexture(tmp = cd == 53 ?(path + "xiaowang_hua.png"):(path + "dawang_hua.png"));
        cardvalue.loadTexture(tmp = cd == 53 ?(path + "joker_xiao.png"):(path + "joker_da.png"));
        Rvalue.loadTexture(tmp = cd == 53 ?(path + "joker_xiao.png"):(path + "joker_da.png"));
        joker.visible=true;
        big.visible=false;
        small.visible=false;
    }
    node.tag=cd;
}
PokerCardNode_Rujiangqianfen.prototype.changPkImageBack=function(type){
    var children = this.node.children;
    for(var i=0;i < children.length; i++) {
        var ci = children[i];
        if (ci.name == this.NOR_HAND_NAME) {
            this.setSpriteCard(ci,ci.tag,type);
        }
    }
}


//删除，根据牌值数组删除对应的牌
PokerCardNode_Rujiangqianfen.prototype.removeHandCardByValueArr = function(valueArr){
    for(var i =0;i< valueArr.length;i++){
        var children = this.node.children;
        for(var j = children.length - 1;j >= 0; j--){
            if(!cc.sys.isObjectValid(children[j])) continue;
            if (children[j].name != this.NOR_HAND_NAME && children[j].name != this.REP_HAND_NAME) continue;
            if(children[j].tag == valueArr[i]) {
                children[j].removeFromParent(true);
                break;
            }
        }
    }
    this.cardLayoutRestoreForPlay();
};

//删除所有
PokerCardNode_Rujiangqianfen.prototype.removeAllCards = function(){
    var children = this.node.children;
    var len = children.length;
    for(var i = len-1; i >= 0; i--){
        if(!cc.sys.isObjectValid(children[i])) continue;
        var ci =children[i];
        if (ci.name != this.NOR_HAND_NAME && ci.name != this.REP_HAND_NAME && ci.name != this.OUT && ci.name != this.SHOW) {
            continue;
        }
        if(MjClient.data.sData.tData.tState != TableState.waitJiazhu && ci.name == this.SHOW)   continue;
        ci.removeFromParent(true);
    }
};
//添加打出去的牌
PokerCardNode_Rujiangqianfen.prototype.addPutCards = function(putCards) {
    this.removeAllCards();
    var name = this.OUT;
    var cards = putCards.slice();
    cards = MjClient.majiang.sortCardsValues(cards,-1);
    for(var i = 0; i < cards.length;i++){
        var scale = MjClient.rePlayVideo == -1 ? 1.3 : 1;
        var deskCard = this.createOneCardNode(cards[i], name, scale);
        this.node.addChild(deskCard);
        this.setCardSelected(deskCard,false);
        this.showNum(deskCard,0);
    }
    this.cardLayoutRestore(putCards,true); // 返回摆放手牌
};

PokerCardNode_Rujiangqianfen.prototype.countCards = function(){
    var cnt = 0;
    var children = this.node.children;
    for(var i = 0;i< children.length; i++) {
        if(children[i].name == this.NOR_HAND_NAME){
            cnt += 1;
        }
    }
    return cnt;
}
PokerCardNode_Rujiangqianfen.prototype.showNum = function(node,num, isHand) {
    // var imgNum = node.getChildByName("img_num");
    // imgNum.visible = num >=4;
    // if(!imgNum.visible) { return ; }
    var Text_num = node.getChildByName("Text_num");
    Text_num.visible = num >=4;
    if(!Text_num.visible) { return ; }
    Text_num.setString(num + "张");
    if (isHand)
        Text_num.setPositionY(200);
}
PokerCardNode_Rujiangqianfen.prototype.sendCardToMe = function() {
    var handCardUi = [];
    for(var i = 0;i < 12;i++) {
        for(var j = 0;j < this.cardUisGroup.length;j++)
        {
            if(this.cardUisGroup[j][i] !== undefined) {
                handCardUi.push(this.cardUisGroup[j][i]);
            }
        }
    }
    for(var i = 0; i < handCardUi.length; i++)
    {
        var card = handCardUi[i];
        card.runAction(cc.sequence(
            cc.hide(),
            cc.delayTime(i * 0.03),
            cc.show()
        ));
    }
}
PokerCardNode_Rujiangqianfen.prototype.dealSendEnd = function() {
    var children = this.node.children;
    for(var i = 0; i < children.length; i++) {
        if (children[i].name == this.NOR_HAND_NAME) {
            var val = MjClient.majiang.calPoint(children[i].tag);
            if(this.cardUisGroup[val] && this.cardUisGroup[val].length >= 4) {
                if(children[i].getUserData() == this.cardUisGroup[val].length) {
                    this.showNum(children[i],this.cardUisGroup[val].length,true);
                }
            }
        }
    }
}

PokerCardNode_Rujiangqianfen.prototype.getMiddleCardsPos = function () {
    var children = this.node.children;
    var x1 = 0, x2 = 0, y1 = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i].name != "out")
            continue;
        if (y1 == 0) {
            y1 = children[i].y;
        }
        if (children[i].x < x1 || x1 == 0)
            x1 = children[i].x;
        if (children[i].x > x2 || x2 == 0)
            x2 = children[i].x;
    }
    var pos = cc.p((x1 + x2) / 2, y1);
    return pos;
}