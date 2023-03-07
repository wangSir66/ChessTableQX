var daTongZi = daTongZi || {};

/**
 * 排序Node
 *  1.所有的子节点会设置锚点(0,0);
 *  2.所有的子节点从上往下排，从左往右
 *  3.先添加的节点会在最上面 最左边
 *  4.只支持 左 右 居中 对齐
 * @type {*|Object|void|Function}
 */
daTongZi.LayoutNode = ccui.Layout.extend({
    _childArr : null,
    _alignType: null,
    _gap : 0,
    ctor: function () {
        this._super();
        this._childArr = [];
    },
    addChild: function (child, localZOrder, tag) {
        this._super(child);
        this._childArr.push(child);
    },
    removeAllChildren:function(){
        this._super();
        this._childArr = [];
    },
    removeChildrenNode : function (node) {
        var len = this._childArr.length;
        for(var i = 0; i < len; i++){
            var child = this._childArr[i];
            if(child === node){
                this._childArr.splice(i,1);
                break;
            }
        }
    },
    /**
     * 排版
     * @param alignType {ui.LayoutNode.LayoutAlignType}
     * @param gap 间隔 {number}
     */
    doLayout:function(alignType, gap){
        this._alignType = alignType;
        this._gap = gap;
        var len = this._childArr.length;
        var node = null;
        var w = 0;
        var h = 0;
        for(var i = 0; i < len; i++){
            node = this._childArr[i];
            w = node.width > w ? node.width : w;
            h += node.height + gap;
        }
        h -= gap;
        this.setContentSize(w,h);

        for(var j = 0; j < len; j++){
            node = this._childArr[j];
            if(j == 0){
                this._setNodePosition(node,null);
            }
            else{
                this._setNodePosition(node,this._childArr[j-1]);
            }
        }
    },
    /**
     * 设置位置
     * @param node 要设置的对象
     * @param preNode   上一个对象
     * @private
     */
    _setNodePosition:function(node, preNode){
        var tx = 0;
        var ty = 0;
        var tw = 0;
        var th = 0;
        if(preNode != null){
            node.y = preNode.y - node.height - this._gap;
        }
        else{
            node.y = this.height - node.height;
        }
        node.setAnchorPoint(0,0);

        switch (this._alignType){
            case daTongZi.LayoutNodeAlignType.LEFT:
                node.x = 0;
                break;
            case daTongZi.LayoutNodeAlignType.RIGHt:
                node.x = this.width;
                break;
            case daTongZi.LayoutNodeAlignType.CENTER:
                node.x = (this.width - node.width) * 0.5;
                break;
        }
    },

    /**
     * 排版，适合节点的宽高一直的情况
     * @param row 行
     * @param col 列
     * @param hGap 水平间隔
     * @param vGap 垂直间隔
     */
    doLayoutGrid:function(row,col,hGap,vGap) {
        var len = this._childArr.length;
        if (len <= 0) {
            return;
        }
        var child = this._childArr[0];
        var w = child.width;
        var h = child.height;
        var width = w * col + hGap * (col - 1);
        var height = h * row + vGap * (row - 1);
        this.setContentSize(width, height);

        var tx = 0;
        var ty = this.height - h;
        for (var r = 0; r < row; r++) {
            tx = 0;
            for (var c = 0; c < col; c++) {
                var index = r * col + c;
                if (index >= len) return;
                child = this._childArr[index];
                child.setAnchorPoint(0, 0);
                child.x = tx;
                child.y = ty;
                tx += (hGap + w);
            }
            ty -= (h + vGap);
        }
    },

    /**
     * 通过指定的宽度排版, 超过宽度自动换行, 暂时只支持所有节点高度一样的情况
     * @param {number} width 限制的宽度
     * @param {number} hGap 水平间隔
     * @param {number} vGap 行间距
     */
    doLayoutByWidth : function (width, hGap, vGap) {
        var len = this._childArr.length;
        cc.log("doLayoutGrid:" + len);
        if (len <= 0) {
            return;
        }

        var child = this._childArr[0];
        var height = child.height;
        var h = 0;
        var w = 0;
        for(var i = 0; i < len; i++){
            var child = this._childArr[i];
            w += child.width;
            if(w + child.width > width && i != 0){
                w = 0;
                h += child.height + vGap;
            }
            else if(i < len - 1){
                w += hGap;
            }
        }
        height += h;

        this.setContentSize(width, height);

        child = this._childArr[0];
        var tx = 0;
        var ty = this.height - child.height;
        for(var i = 0; i < len; i++){
            var child = this._childArr[i];
            child.setAnchorPoint(0, 0);
            child.x = tx;
            child.y = ty;

            if(i < len - 1){
                tx += child.width;
                child = this._childArr[i + 1];
                if(tx + child.width > width && i != 0){
                    tx = 0;
                    ty -= child.height + vGap;
                }
                else if(i < len - 1){
                    tx += hGap;
                }
            }
        }
    },

    //排成一行
    doLayoutOneLine : function (hGap) {
        var len = this._childArr.length;
        cc.log("doLayoutGrid:" + len);
        if (len <= 0) {
            return;
        }

        var child = this._childArr[0];
        var height = child.height;
        var h = 0;
        var w = 0;
        for(var i = 0; i < len; i++){
            var child = this._childArr[i];
            w += child.width;
            if(i < len - 1){
                w += hGap;
            }
        }

        this.setContentSize(w, height);

        child = this._childArr[0];
        var tx = 0;
        var ty = this.height - child.height;
        for(var i = 0; i < len; i++){
            var child = this._childArr[i];
            child.setAnchorPoint(0, 0);
            child.x = tx;
            child.y = ty;

            if(i < len - 1){
                tx += child.width;
                child = this._childArr[i + 1];
                if(i < len - 1){
                    tx += hGap;
                }
            }
        }
    },

    getChildLength: function() {
        return this._childArr.length;
    },

    getLayoutChildren: function() {
        return this._childArr;
    }
});
daTongZi.LayoutNodeAlignType = {
    // 左对齐
    LEFT:0,
    // 右对齐
    RIGHt:1,
    // 居中
    CENTER:2
};

