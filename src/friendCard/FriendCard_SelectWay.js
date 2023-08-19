var CREATEROOM_COLOR_1 = cc.color(237, 101, 1);
var CREATEROOM_COLOR_2 = cc.color(123, 78, 63);

var FriendCardSelectWay = cc.Layer.extend({
    ctor: function (that) {
        this._super();
        this.parentScript = that;
        this.rules = that.gameTypes;
        this.clubId = that.clubId;
        var userInfoLayerUi = ccs.load(res.SelectRulePanel_json);
        this.addChild(userInfoLayerUi.node);
        var _block = userInfoLayerUi.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);
        _block.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.removeFromParent();
            }
        }.bind(this));

        var _back = userInfoLayerUi.node.getChildByName("back");
        _back.setScale(MjClient.size.width / 1280, MjClient.size.height / 720);
        this.btn_all_rule = _back.getChildByName('btn_all_rule'), btn_outline_rule = _back.getChildByName('btn_outline_rule');
        btn_outline_rule.visible = false;
        let p8 = _back.getChildByName('Panel_8');
        p8.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.removeFromParent();
            }
        }.bind(this));
        this.list = p8.getChildByName('ListView_rule');
        this.wayPanel = this.list.getChildByName('Panel_9');
        this.wayList = this.wayPanel.getChildByName('waygame');
        this.list.setScrollBarEnabled(false);
        this.wayList.setScrollBarEnabled(false);
        this.listItem = this.list.getChildByName('btn_rule_cell');
        this.wayItem = this.wayList.getChildByName('itemcopy');
        this.list.children.map(l => {
            if (l.name != 'Panel_9') l.removeFromParent();
            else l.visible = false;
        });
        this.wayItem.visible = false;
        this.initList();
        return true;
    },
    initList: function () {
        const rules = this.rules;
        if (!rules || !rules.length) return;
        let gameItems = [];
        this.gameAndIndex = {};
        for (let _i = 0; _i < rules.length; _i++) {
            const rule = rules[_i], type = rule.gameType;
            if (!this.gameAndIndex[type]) {
                let item = this.listItem.clone(), txt = item.getChildByName('text');
                this.list.addChild(item);
                item.setTag(type);
                item.setName("btn_rule_" + type);
                item.visible = true;
                txt.setString(GameCnName[type]);
                txt.ignoreContentAdaptWithSize(true);
                gameItems.push(item);
                this.gameAndIndex[type] = [rule.ruleIndex];
            } else this.gameAndIndex[type].push(rule.ruleIndex);
        }
        let itemW = this.listItem.width;
        for (var i = 0; i < gameItems.length; i++) {
            var dx = i * itemW, item1 = gameItems[i];
            item1.getChildByName('1').visible = i === 0
            item1.setPositionX(itemW / 2 + dx);
        }
        //修正scrollView的滑动区域
        let oldS = this.list.getInnerContainerSize()
        this.list.setInnerContainerSize(cc.size(itemW * gameItems.length, oldS.height));
        this.gameBtnRadio = createRadioBoxForCheckBoxs([this.btn_all_rule, ...gameItems], this.callSelectBack.bind(this), 0);
        this.setCheckState();
        let sindx = this.gameBtnRadio.getSelectIndex()
        if (sindx != 0) {
            sindx == 1 && (sindx = 0)
            this.list.scrollToPercentHorizontal(sindx / gameItems.length * 100, 0.1, true);
        }
    },
    callSelectBack: function (indx, item, list) {
        let slIndx = [];
        if (indx == 0) slIndx.push(-1);
        else {
            let gsK = Object.keys(this.gameAndIndex);
            slIndx = this.gameAndIndex[gsK[indx - 1]];
        }
        this.initWayList(slIndx, slIndx);
        util.localStorageEncrypt.setStringItem("clubRulesSelect_" + this.clubId, JSON.stringify(slIndx));
        this.parentScript.refreshDeskList();
        this.gameBtnRadio._nodeList.map(n => {
            let isTurn = n.isSelected(),
                text = n.getChildByName("text");
            n.setEnabled(!isTurn);
            this.selectedCB(text, isTurn);
        })
    },
    initWayList: function (indxs, sIndx) {
        this.wayPanel.visible = !(!indxs || indxs.indexOf(-1) != -1);
        if (!this.wayPanel.visible || !this.rules) return;
        this.selectedBtn = [];
        let curWay = this.rules.filter(r => indxs.indexOf(r.ruleIndex) > -1),
            btns = this.wayList.children.filter(w => w.name.indexOf('btn_rule_') > -1),
            len = curWay.length > btns.length ? curWay.length : btns.length,
            hIndx = 0;
        for (let _i = 0; _i < len; _i++) {
            const rule = curWay[_i];
            var btn = btns[_i];
            if (rule && !btn) {
                btn = this.wayItem.clone();
                this.wayList.addChild(btn);
                btn.setName("btn_rule_" + _i);
                btn.addTouchEventListener(function (sender, type) {
                    if (type == 2) {
                        this.parentScript.closeClubList();
                        var index = sender.getTag(), sl = !sender.isSelected();
                        this.selectedCB(sender.getChildByName('text'), sl);
                        FriendCard_Common.reSetClubRulesSelect(this.clubId, index, sl, true);
                        this.parentScript.refreshDeskList();
                        if (sl) {
                            this.selectedBtn.push(sender)
                        } else {
                            for (let _i = 0; _i < this.selectedBtn.length; _i++) {
                                const ites = this.selectedBtn[_i];
                                if (ites.getTag() == index) {
                                    this.selectedBtn.splice(_i, 1);
                                    break;
                                }
                            }
                        }
                        this.checkBtnSelected();
                    }
                }, this);
            } else if (!rule && btn) {
                btn.visible = false;
                continue;
            }
            let fg = sIndx.indexOf(rule.ruleIndex) > -1;
            fg && this.selectedBtn.push(btn);
            btn.setSelected(fg);
            btn.setPositionX(this.wayList.width / 2);
            btn.setPositionY((this.wayItem.height / 2 + 2) + _i * (this.wayItem.height + 5));
            hIndx = _i;
            btn.visible = true;
            btn.setTag(rule.ruleIndex);
            var text = btn.getChildByName("text");
            if (rule.ruleName) {
                var splitRuleName = FriendCard_Common.splitClubRuleName1(unescape(rule.ruleName));
                var ruleName = splitRuleName[0];
                text.setString(getNewName(ruleName));
            }
            this.selectedCB(text, btn.isSelected());
            text.ignoreContentAdaptWithSize(true);
        }
        //修正scrollView的滑动区域
        let oldS = this.wayList.getInnerContainerSize()
        this.wayList.height = (hIndx + 1) * this.wayItem.height + 5 * hIndx + 4;
        this.wayList.setInnerContainerSize(cc.size(oldS.width, (hIndx + 1) * this.wayItem.height + 5 * hIndx));
        this.wayList.scrollToTop(0.1, true);
        this.wayPanel.getChildByName('bg').height = this.wayItem.height * (hIndx + 1) + 5 * hIndx + 14;
        let sNode = this.gameBtnRadio.getSelectItem();
        this.wayPanel.setPositionX(sNode.x);
        this.checkBtnSelected();
    },
    checkBtnSelected: function () {
        if (!this.selectedBtn) return;
        let sNum = this.selectedBtn;
        if (sNum.length == 1) {
            sNum[0].setEnabled(false);
        } else {
            sNum.map(s => { s.setEnabled(true); })
        }
    },
    selectedCB: function (text, isSelected) {
        if (isSelected) {
            text.setTextColor(cc.color('#A14B06'));
        } else {
            text.setTextColor(cc.color('#9B8C7F'));
        }
    },
    //选中情况
    setCheckState: function () {
        let clubRulesSelect = FriendCard_Common.getClubRulesSelect(this.clubId),
            sIndx = -1,
            gsK = Object.keys(this.gameAndIndex);
        if (clubRulesSelect.indexOf(-1) > -1) sIndx = 0;
        else {
            for (let _i = 0; _i < gsK.length; _i++) {
                const gs = this.gameAndIndex[gsK[_i]];
                if (gs.filter(g => clubRulesSelect.indexOf(g) > -1).length > 0) {
                    sIndx = _i + 1;
                    break;
                }
            }
        }
        sIndx != -1 || (sIndx = 0);
        this.gameBtnRadio.selectItem(sIndx);
        this.initWayList(sIndx == 0 ? [-1] : this.gameAndIndex[gsK[sIndx - 1]], clubRulesSelect);
        this.gameBtnRadio._nodeList.map(n => {
            let isTrue = n.isSelected(),
                text = n.getChildByName("text");
            n.setEnabled(!isTrue);
            this.selectedCB(text, isTrue);
        })
    },
});


