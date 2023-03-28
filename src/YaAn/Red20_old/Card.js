function Red20_Card(node) {
    this.node = node;
    this.cardNum = -1;
    this.cardColor = -1; //0:方块，1：梅花，2：红桃，3：黑桃，4:王
    this.card = -1;
    this.isRemove = false;
}

Red20_Card.prototype.showFace = function (sp) {
    if (sp) this.node.setSpriteFrame(sp);
}
//获取牌面
Red20_Card.prototype.getData = function () {
    return this.card
}
//设置牌面
Red20_Card.prototype.setData = function (card) {
    this.isRemove = false;
    this.card = card;
    this.cardNum = card % 16;
    this.cardColor = Math.floor(card / 16);
}
Red20_Card.prototype.Color = function () {
    return this.cardColor;
}

Red20_Card.prototype.Num = function () {
    return this.cardNum;
}

Red20_Card.prototype.faceName = function () {
    return this.cardColor + '' + this.cardNum;
}