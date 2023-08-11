var UIManager = {};

//弹窗由小到大的效果。
UIManager.popupAnm = function (node) {
    var _currentScale = node.getScale();
    node.setScale(0);
    node.runAction(cc.scaleTo(0.2, _currentScale).easing(cc.easeBackOut()));
}
