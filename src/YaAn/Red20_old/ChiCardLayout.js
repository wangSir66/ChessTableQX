function Red20_ChiCardLayout(node) {
    this.node = node;
    this.pengCard = -1;//card
    this.type = '';
    //偷牌阶段暗杠显示牌背，等到下一轮在显示牌面
    this.isShowback = false;

    setData = function (card) {
        this.pengCard = card;
    }

    getIsShowBack = function () {
        return this.isShowback;
    }

    setIsShowBack = function (val) {
        this.isShowback = val;
    }

    getData = function () {
        return this.pengCard;
    }

    setType = function (val) {
        this.type = val;
    }
    getType = function () {
        return this.type;
    }

    updateSpacingY = function (num = 5, isGameOver) {
        let layout = this.node.getComponentInChildren(cc.Layout);
        let childrenCount = this.node.getChildByName('weaves').childrenCount;
        if (isGameOver) {
            if (childrenCount === 3) {
                layout.spacingY = -55;
                layout.updateLayout();
                this.node.getChildByName('desc').active = false;
            } else if (childrenCount > 3) {
                if (childrenCount >= 13) layout.spacingY = -72;
                else if (childrenCount >= 8) layout.spacingY = -71;
                else if (childrenCount >= 6) layout.spacingY = -69;
                else layout.spacingY = -67;
                layout.updateLayout();
                this.node.getChildByName('desc').active = true;
                this.node.getChildByName('desc').getComponent(cc.Label).string = `${childrenCount}张`;
            } else {
                layout.spacingY = -40;
                layout.updateLayout();
                this.node.getChildByName('desc').active = false;
            }
        } else {
            //缩小距离 -60
            if (childrenCount >= num) {
                let space = -60;
                layout.spacingY = space;
                layout.updateLayout();
                this.node.getChildByName('desc').active = true;
                this.node.getChildByName('desc').getComponent(cc.Label).string = `${childrenCount}张`;
            }
            //间隔-40
            else {
                layout.spacingY = -40;
                layout.updateLayout();
                this.node.getChildByName('desc').active = false;
            }
        }
    }
}