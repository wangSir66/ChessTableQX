/**
 * 斗地主手牌组件
 */
var PokerCardNode_zhaGuZi = cc.Node.extend({
    node: null,
    ctor: function(off) {
        this._super();
        // 加载csb资源
        var  csbNode = ccs.load(res.Doudizhu_CardNode_json).node;
        this.node=csbNode;

        this.NOR_HAND_NAME = "pkhand";
        this.REP_HAND_NAME = "pkhand_replay";
        this.OUT = "out";
        this.SHOW = "show";
        this.SCALE1 = 1.5;
        this.SCALE2 = 1.3;

        this.stand = csbNode.getChildByName("stand");
        this.stand.visible = false;
        this.off=off;
        this.standPosY = this.stand.y;
        this.standSize = this.stand.getSize();
        this.standScale = this.stand.scale;
    }
});

// =========================[[ 流程方法 ]] ================================

//添加手牌
PokerCardNode_zhaGuZi.prototype.initHandCards = function () {
    var pl = getUIPlayer(this.off);
    if (pl==null || pl.mjhand==null) { return; }
    if(MjClient.rePlayVideo == -1 && this.off > 0) { return; }// 表示正常游戏, 只初始化自己的手牌
    var name = this.off == 0 ? this.NOR_HAND_NAME : this.REP_HAND_NAME;
    
    var scale = MjClient.rePlayVideo == -1 ? this.SCALE1 : this.SCALE2;
    this.createHandCards(pl.mjhand, name, scale);
    this.cardLayoutRestoreForPlay();
};

// 打牌的摆放
PokerCardNode_zhaGuZi.prototype.cardLayoutRestoreForPlay = function() {
    var pl = getUIPlayer(this.off);
    if (pl==null || pl.mjhand==null) { return; }
    var isZhuang = this.isZhuangByOff();
    this.cardLayoutRestore(pl.mjhand, isZhuang);
};

// =========================[[ 操作手牌方法 ]] =============================
PokerCardNode_zhaGuZi.prototype.getSelectCardsIdx = function (worldSp) {
    var children = this.node.children;
    var locationInNode = this.node.convertToNodeSpace(worldSp);
    var lastMouseIn = -1;
    for(var i = 0; i < children.length; i++) {
        if(children[i].name == this.NOR_HAND_NAME){
            var _boundingBox = children[i].getBoundingBox();
            if (this.getLastCardX() != parseInt(children[i].x)) {
                _boundingBox.width -= (_boundingBox.width*0.56);
            }
            if (cc.rectContainsPoint(_boundingBox, locationInNode)) {
                children[i].setColor(MjClient.grayColor);
                lastMouseIn = i;
                break;
            }
        }
    }
    return lastMouseIn;
};

// 处理滑动手牌的颜色
PokerCardNode_zhaGuZi.prototype.handleTouchMoveOutOfRange = function(posSt, posEnd){
    var st = posSt>posEnd ? posEnd : posSt;
    var end = posSt>posEnd ? posSt : posEnd;
    var children = this.node.children;
    for(var i = 0;i<children.length;i++){
        if(children[i].canNotOut) continue;
        if(i >= st && i <= end) {
            children[i].setColor(MjClient.grayColor);
        } else {
            children[i].setColor(MjClient.whiteColor);
        }
    }
};

// 更新点击／滑动的手牌
PokerCardNode_zhaGuZi.prototype.updatePostionInMoveRange = function(posSt, posEnd) {
    var st = posSt>posEnd ? posEnd : posSt;
    var end = posSt>posEnd ? posSt : posEnd;
    var children = this.node.children;
    for(var i = 0; i< children.length; i++) {
        if(i >= st && i <= end){
            if(children[i].y > this.stand.y) {
                this.putCardNodeDown(children[i]);
            } else {
                this.putCardNodeUp(children[i]);
            }
        }
    }
};

// 提起手牌
PokerCardNode_zhaGuZi.prototype.putCardNodeUp = function(nodeCard) {
    if( !cc.sys.isObjectValid(nodeCard) ) return;
    if(nodeCard.name != this.NOR_HAND_NAME) { return ; }
    var cardY = this.standSize.width * this.standScale *1.5; //一张牌的长度
    var cardOut = parseInt(cardY/4);//点击牌弹起的高度,以前是20像素
    nodeCard.setColor(MjClient.whiteColor);
    nodeCard.y = this.standPosY + cardOut;
}

// 放下手牌
PokerCardNode_zhaGuZi.prototype.putCardNodeDown = function(nodeCard) {
    if( !cc.sys.isObjectValid(nodeCard) ) return;
    if(nodeCard.name != this.NOR_HAND_NAME) { return ; }
    nodeCard.y = this.standPosY;
    if(nodeCard.canNotOut) return;
    nodeCard.setColor(MjClient.whiteColor);
};

// 清除手牌提起状态
PokerCardNode_zhaGuZi.prototype.clearCardsUpStatus = function() {
    var children = this.node.children;
    for(var i = 0; i < children.length; i++) {
        if (children[i].name == this.NOR_HAND_NAME) {
            this.putCardNodeDown(children[i]);
        }
    }
};

// 根据牌值,提起手牌
PokerCardNode_zhaGuZi.prototype.liftCardUp = function(valueArr) {
    var children = this.node.children;
    if(!cc.isArray(valueArr)) return;
    var tmpArr = valueArr.slice();
    for(var i = 0; i < children.length; i++) {
        if (children[i].name == this.NOR_HAND_NAME) {
            for (var j = 0; j < tmpArr.length; j++) {
                if (children[i].tag == tmpArr[j]) {
                    this.putCardNodeUp(children[i]);
                    tmpArr.splice(j, 1);
                    break;
                }
            }
        }
    }
};

// =========================[[ 手牌属性方法 ]] =============================

//获取提起的牌值，返回牌值数组(有序)
PokerCardNode_zhaGuZi.prototype.getUpCardArr = function() {
    var children = this.node.children;
    var selectCards = [];
    var tData = MjClient.data.sData.tData;
    for(var i = 0;i <children.length; i++){
        if(children[i].name == this.NOR_HAND_NAME && children[i].y > this.stand.y) {
            selectCards.push(children[i].tag);
        }
    }
    return MjClient.majiang.sortHandCards(selectCards, tData.isShowFuCard);
};

PokerCardNode_zhaGuZi.prototype.getLastCardX = function() {
    var children = this.node.children;
    var lastX = 0;
    for(var i = 0; i < children.length; i++){
        if (children[i].name == this.NOR_HAND_NAME){
            if(children[i].x > lastX) {
                lastX = children[i].x;
            }
        }
    }
    return parseInt(lastX);
};

PokerCardNode_zhaGuZi.prototype.cardLayoutRestore = function(oCards, isZhuang,isOutPut,isJiaZhu) {
    if(cc.isUndefined(oCards) || oCards.length == 0){ return; }
    var cards = oCards.slice();
    if(isJiaZhu)
    {
        for(var i = 0;i < cards.length;i++)
        {
            cards[i] += 8;
        }
    }
    var tData = MjClient.data.sData.tData;
    cards = MjClient.majiang.sortHandCards(cards, tData.isShowFuCard);
    var orders = this.getNodeByValues(cards,isJiaZhu);
    if(orders.length == 0) {return; }
    var startX = this.getStartX(orders,isOutPut);
    var cardWidth = orders[0].width;
    var offset = cards.length>17 ? 3 : 12;
    var width = cardWidth*0.55 + offset;
    for(var i = 0; i < orders.length; i++){
        var ci = orders[i];
        ci.x = startX;
        startX += width;
        ci.zIndex = 600 + i;
        ci.getChildByName("dizhuTag").visible = isZhuang && (i == orders.length-1);
    }
};

PokerCardNode_zhaGuZi.prototype.getNodeByValues = function (cards){
    var cardLength = cards.length;
    var orders = []; //排序后的牌节点
    for (var i = 0; i < cardLength; i++) {
        for (var j = 0; j < this.node.children.length; j++) {
            var ci = this.node.children[j];
            if((ci.name == this.NOR_HAND_NAME || ci.name == this.REP_HAND_NAME || ci.name == this.OUT || ci.name == this.SHOW) && ci.tag == cards[i]) {
                orders.push(ci);
            }
        }
    }
    return orders;
}

PokerCardNode_zhaGuZi.prototype.getStartX = function (orders,isOutPut){
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
        startX = 0;
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
PokerCardNode_zhaGuZi.prototype.createHandCards = function(cardValueArr, name, scale){
    //this.clearHandCard();
    this.removeAllCards();
    for(var i= 0; i<cardValueArr.length; i++) {
        var nodeCard = this.createOneCardNode(cardValueArr[i], name, scale);
        this.node.addChild(nodeCard);
    }
};

// 增加手牌
PokerCardNode_zhaGuZi.prototype.addCardsForHand = function(cardValueArr) {
    if (cardValueArr == null || cardValueArr.length == 0) {
        return;
    }
    
    for(var i= 0; i<cardValueArr.length; i++) {
        var scale = MjClient.rePlayVideo == -1 ? this.SCALE1 : this.SCALE2;
        var nodeCard = this.createOneCardNode(cardValueArr[i], this.NOR_HAND_NAME, scale);
        this.node.addChild(nodeCard);
    }
    this.cardLayoutRestoreForPlay();
}; 

// 创建一张手牌
PokerCardNode_zhaGuZi.prototype.createOneCardNode = function(value, name, scale){
    var cpnode = this.stand.clone();
    cpnode.setName(name);
    cpnode.setScale(cpnode.getScale() * scale);
    cpnode.visible = true;
    cpnode.setUserData(0);
    cpnode.setSwallowTouches(true);
    this.setSpriteCard(cpnode, value,getCurrentPKImgType());
    this.createDiZhuCorner(cpnode);
    return cpnode;
};
PokerCardNode_zhaGuZi.prototype.setSpriteCard=function(node,cd,type){
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
    Rsmall.setScale(tmp = type == 0 ? 0.34 : 0.25);
    Rsmall.visible = (tmp = type == 0 ? false : true);
    Rvalue.visible = (tmp = type == 0 ? false : true);
    big.visible = (tmp = type ==0 ? true : false);
    path = (tmp = type ==0 ? "playing/cardPic2/" :"playing/cardPic3/");
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
PokerCardNode_zhaGuZi.prototype.changPkImageBack=function(type){
    var children = this.node.children;
    for(var i=0;i < children.length; i++) {
        var ci = children[i];
        if (ci.name == this.NOR_HAND_NAME) {
            this.setSpriteCard(ci,ci.tag,type);
        }
    }
}


//删除，根据牌值数组删除对应的牌
PokerCardNode_zhaGuZi.prototype.removeHandCardByValueArr = function(valueArr){
    for(var i =0;i< valueArr.length;i++){
        var children = this.node.children;
        for(var j = 0;j < children.length; j++){
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
PokerCardNode_zhaGuZi.prototype.removeAllCards = function(){
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

// 创建地主角标
PokerCardNode_zhaGuZi.prototype.createDiZhuCorner = function(parent) {
    if(!parent.getChildByName("dizhuTag")){
        var path = "playing/cardPic2/dizhu_biao.png";
        var corner = new ccui.ImageView(path);
        corner.setPosition(parent.width - corner.width/2, parent.height - corner.height/2);
        corner.setName("dizhuTag");
        parent.addChild(corner);
        corner.visible = false;
    }
};



//添加打出去的牌
PokerCardNode_zhaGuZi.prototype.addPutCards = function(putCards,isJiaZhu) {
    this.removeAllCards();
    var name = isJiaZhu ? this.SHOW : this.OUT;
    var cards = putCards.slice();
    for(var i = 0; i < cards.length;i++){
        var scale = MjClient.rePlayVideo == -1 ? 1.3 : 1;
        var deskCard = this.createOneCardNode(cards[i], name, scale);
        if(isJiaZhu)
        {
            deskCard = this.createOneCardNode(cards[i]+8, name, scale);
        }
        this.node.addChild(deskCard);
    }

    var isZhuang=this.isZhuangByOff();
    this.cardLayoutRestore(putCards,isZhuang,true,isJiaZhu); // 返回摆放手牌
};
PokerCardNode_zhaGuZi.prototype.isZhuangByOff=function () {
    var pl = getUIPlayer(this.off);
    var tData = MjClient.data.sData.tData;
    var isZhuang = tData.uids[tData.zhuang] == pl.info.uid;
    return isZhuang;
};
PokerCardNode_zhaGuZi.prototype.cannotOutLiangSanGray = function (isJiaZhu) {
    var children = this.node.children;
    for(var i=0;i < children.length; i++) {
        var ci = children[i];
        var tag = ci.tag;
        var cardType = Math.ceil(tag / 4);
        if(isJiaZhu)
        {
            if (cardType == 3)
                ci.setColor(MjClient.whiteColor);
            else
            {
                ci.setColor(MjClient.grayColor);
                ci.canNotOut = true;
            }
        }
        else {
            ci.setColor(MjClient.whiteColor);
            ci.canNotOut = false;
        }
    }
};
PokerCardNode_zhaGuZi.prototype.grayCardCannotOut = function (worldSp) {
    var children = this.node.children;
    var locationInNode = this.node.convertToNodeSpace(worldSp);
    for(var i = 0;i < children.length; i++) {
        var ci = children[i];
        if(ci.name == this.NOR_HAND_NAME){
            var _boundingBox = ci.getBoundingBox();
            if (this.getLastCardX() != parseInt(ci.x)) {
                _boundingBox.width -= (_boundingBox.width*0.56);
            }
            if (cc.rectContainsPoint(_boundingBox, locationInNode)) {
                if(ci.canNotOut)
                {
                    return true;
                }
                else {
                    return false;
                }
            }
         }
    }
};
PokerCardNode_zhaGuZi.prototype.removeShowCardOf3 = function(){
    var children = this.node.children;
    var len = children.length;
    for(var i = len-1; i >= 0; i--){
        if(!cc.sys.isObjectValid(children[i])) continue;
        var ci =children[i];
        if (ci.name == this.SHOW) {
            ci.removeFromParent(true);
        }
    }
};