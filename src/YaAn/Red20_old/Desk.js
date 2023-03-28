function Red20Desk(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    this.cardNumlabel = node.getChildByName("CardNum")
    this.ruleNode = node.getChildByName("ruleNode")
}

Red20Desk.prototype.onInit = function (rule) {
    let num = 52 + rule.MaxKingCount;
    this.cardNumlabel.setString(num);
}

Red20Desk.prototype.showCardNum = function(val) {
    this.node.getChildByName('cocos').visible = val;
    this.node.getChildByName('CardNum').visible = val;
}

Red20Desk.prototype.CardNum = function (val) {
    let oldNum = Number(this.cardNumlabel.getString())
    this.cardNumlabel.setString(oldNum - val);
}

Red20Desk.prototype.showRule = function (val, ruleInfo) {
    this.ruleNode.visible = val;
    if (ruleInfo) {
        this.ruleNode.getChildByName('rule').setString(ruleInfo);
    }
}
module.exports = Red20Desk;