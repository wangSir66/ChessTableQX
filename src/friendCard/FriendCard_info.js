/**
 * @Author:      XiaoMaoGe
 * @Email:       lms_190865480@163.com
 * @QQ:       190865480
 * @DateTime:     2017-12-25 
 * @Description: 亲友圈创建和修改页面 
 */

var FriendCard_info = cc.Layer.extend({
    onExit: function () {
        this._super();
        FriendCard_Common.reSetRuleParm();
        MjClient.FriendCard_infoUI = null;
    },
    ctor: function (data, layer) {
        this._super();
        this._parentNode = layer;
        this._data = data;
        //注意，如果俱乐部与联盟玩法个数不同不能用次方法
        this._ruleBtnNum = FriendCard_Common.getRuleNumber();
        this._isMatch = this._data ? (this._data.info.matchIsOpen & 2) : false;
        this._clubType = this._data ? this._data.info.type : 0; //房卡俱乐部 普通俱乐部
        for (var i = 1; i <= this._ruleBtnNum; i++) {
            MjClient.RuleParam["rule" + i] = null;
        }

        var UI = ccs.load(res.Friendcard_info_json);
        this.addChild(UI.node);
        MjClient.FriendCard_infoUI = this;

        var _block = UI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        var _back = UI.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0]);
        this._back = _back;
        COMMON_UI.setNodeTextAdapterSize(_back);

        //创建俱乐部时
        if (FriendCard_Common.IsOpenRoomCardPay()) {
            if (!this._data) {
                this.switchLayer(1)
            } else {
                this.switchLayer(2)
            }
        } else {
            this.switchLayer(2);
        }

        this.initLayer();
        this.initSelectLayer(UI.node);

    },
    updateWanfa: function () {
        let alen = 0;
        for (var key in MjClient.RuleParam) {
            let rule = MjClient.RuleParam[key], rInx = Number(key.replace('rule', ''));
            if (!rule) continue;
            //删除
            if (rule == 'delete') {
                for (let _i = 0; _i < this.wanfaBtns.length; _i++) {
                    const wf = this.wanfaBtns[_i];
                    if (wf.wanFaIndex === rInx) {
                        for (let _j = this.wanfaBtns.length - 1; _j > _i; _j--) {
                            let wf1 = this.wanfaBtns[_j],
                                wf2 = this.wanfaBtns[_j - 1];
                            wf1.setPosition(wf2.getPosition());
                        }
                        this.wanfaBtns.splice(_i, 1);
                        this["btton_" + rInx].removeFromParent();
                        delete this["btton_" + rInx];
                        this.xuhaoImgs.splice(this.xuhaoImgs.length - 1, 1)[0].removeFromParent();
                        alen = this.wanfaBtns.length;
                        let ahang = Math.ceil((alen + 1) / 2);
                        let totalHeight = this.STotalHeight = ahang * this._wanfaItemHeight + (ahang - 1) * this._diliverHieght + 50;
                        this._btnScrollView.setInnerContainerSize(cc.size(this._btnScrollView.width, totalHeight));
                        this.resetScrollHeight();
                        break;
                    }
                }
            } else if (rule.ruleName) {
                // 修改
                if (this["btton_" + rInx]) {
                    cc.log('---修改--')
                    var ruleName = unescape(rule.ruleName);
                    this["_play_text_" + rInx].setString(getNewName(ruleName, 10));
                } else {//增加
                    cc.log('---增加--')
                    let len = this.wanfaBtns.length,
                        hang = Math.ceil((len + 2) / 2);
                    let totalHeight = this.STotalHeight = hang * this._wanfaItemHeight + (hang - 1) * this._diliverHieght + 50;
                    this._btnScrollView.setInnerContainerSize(cc.size(this._btnScrollView.width, totalHeight));
                    this.resetScrollHeight();
                    rule.ruleIndex = rInx;
                    let item = this.createItemHander(rule, len + 1, totalHeight, true);
                    this.wanfaBtns.push(item);
                }
            }
        }
        //最有一个
        alen = this.wanfaBtns.length;
        this.wanfaBtns[alen - 1].tempP = this["btn_pos_" + alen];
        this.checkAddBtn();
    },
    //是否需要添加按钮
    checkAddBtn: function () {
        if (this.wanfaBtns.length >= this._ruleBtnNum) {
            if (this.isAddButton) {
                for (let _i = 0; _i < this.wanfaBtns.length; _i++) {
                    const item = this.wanfaBtns[_i];
                    if (item.wanFaIndex == this.isAddButton.wanFaIndex) {
                        this.wanfaBtns.splice(_i, 1);
                        this["btton_" + 999].removeFromParent();
                        delete this["btton_" + 999];
                    }
                }
                this.isAddButton = null;
                this.xuhaoImgs.splice(this.xuhaoImgs.length - 1, 1)[0].removeFromParent();
            }
            this.resetScrollHeight();
            return;
        }
        if (!this.isAddButton) {
            let len = this.wanfaBtns.length,
                hang = Math.ceil((len + 2) / 2);
            let totalHeight = this.STotalHeight = hang * this._wanfaItemHeight + (hang - 1) * this._diliverHieght + 50;
            this._btnScrollView.setInnerContainerSize(cc.size(this._btnScrollView.width, totalHeight));
            this.isAddButton = this.createItemHander({ ruleName: '', ruleIndex: 999 }, len + 1, totalHeight, true);
            this.isAddButton.loadTextures("A_FriendCard/Setting/btn_addRule_n.png", "A_FriendCard/Setting/btn_addRule_s.png", "A_FriendCard/Setting/btn_addRule_s.png", 1);
            this.wanfaBtns.push(this.isAddButton);
            this.wanfaBtns[this.wanfaBtns.length - 1].tempP = this["btn_pos_" + this.wanfaBtns.length];
            this.isAddButton.isAddButton = true;
        }
        let rInx = null;
        for (var key in MjClient.RuleParam) {
            let rule = MjClient.RuleParam[key];
            if (rule == 'delete' || !rule) {
                rInx = Number(key.replace('rule', ''));
                break;
            }
        }
        rInx && (this.isAddButton.wanFaIndex = rInx);
        this.resetScrollHeight();
    },
    resetScrollHeight: function () {
        let arr = [];
        if (this.isAddButton) arr = this.wanfaBtns.filter(w => !w.isAddButton).concat([this.isAddButton]);
        this.wanfaBtns = arr;
        for (let _i = 0; _i < this.wanfaBtns.length; _i++) {
            const item = this.wanfaBtns[_i], xuhao = this.xuhaoImgs[_i];
            var _posY = this.STotalHeight - this._wanfaItemHeight * Math.ceil((_i + 1) / 2) - (Math.ceil((_i + 1) / 2) - 1) * this._diliverHieght;
            item.setPosition(cc.p((_i + 1) % 2 == 1 ? 126 : 326, _posY));
            this["btn_pos_" + (_i + 1)] = item.getPosition();
            xuhao && xuhao.setPosition(cc.p((_i + 1) % 2 == 1 ? 30 : 230, _posY));
            _i > 2 && (this.wanfaBtns[_i - 1].tempP = this["btn_pos_" + _i]);
        }
        this.wanfaBtns[this.wanfaBtns.length - 1].tempP = this["btn_pos_" + this.wanfaBtns.length];
    },
    reqStop: function (createSwitch, clubId) {
        var that = this;
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.clubUpdate", {
            createSwitch: createSwitch,
            clubId: clubId
        },
            function (rtn) {
                MjClient.unblock();
                if (rtn.message) {
                    MjClient.showToast(rtn.message);
                    if (cc.sys.isObjectValid(that)) {
                        that.removeFromParent();
                    }
                } else {
                    MjClient.showToast("修改失败");
                }
            }
        );
    },
    reqJiesan: function (clubId) {
        var that = this;
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.clubDestroy", { clubId: clubId },
            function (rtn) {
                MjClient.unblock();
                if (rtn.code == 0) {
                    if (cc.sys.isObjectValid(that)) {
                        that.removeFromParent();
                        if (that._parentNode && that._parentNode != MjClient.FriendCard_main_ui)
                            that._parentNode.removeFromParent();
                    }
                    if (cc.sys.isObjectValid(MjClient.FriendCard_GuanjiaUI)) {
                        MjClient.FriendCard_GuanjiaUI.removeFromParent();
                    }
                } else {
                    if (rtn.message) {
                        MjClient.showToast(rtn.message);
                    } else {
                        MjClient.showToast("解散失败");
                    }
                }
            }
        );
    },
    reqCreate: function (param, ruleParam) {
        var that = this;
        var param_2 = this.compareChange(param, ruleParam, true);

        var sendInfo = this.getSendInfo(param_2.new_param);
        sendInfo["type"] = this._clubType ? 1 : 0;

        if (FriendCard_Common.isOpenChangeYejiMode() && this._clubType) {
            sendInfo["kpiMode"] = 1
        }
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.clubCreate", sendInfo,
            function (rtn) {
                MjClient.unblock();
                if (rtn.code == 0) {
                    if (MjClient.FriendCard_main_ui)
                        postEvent("friendCard_clubListUpdate", { clubId: rtn.data ? rtn.data.clubId : null });
                    else
                        MjClient.Scene.addChild(new FriendCard_main(rtn.data.clubId));
                    if (cc.sys.isObjectValid(that))
                        that.removeFromParent();

                    MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Qinyouquan_cetan_Chuangjianqinyouquan_Chuangjian_Chenggong", { uid: SelfUid() });
                } else {
                    if (rtn.message) {
                        MjClient.showToast(rtn.message);

                    } else {
                        MjClient.showToast("创建失败");
                    }
                }

            }
        );
    },
    //如果设置自主开房,将不传其他参数
    getSendInfo: function (param) {
        var noDelInfo = ["gameType", "maxPlayer", "round", "payWay", "customInfo", "isFangzuobi", "convertible", "ruleName", "fangkaSource", "fangkaCount", "fangkaFree", "fangkaExtra"];
        for (var i = 0; i < this.wanfaBtns.length; i++) {
            let _indx = this.wanfaBtns[i].ruleIndex;
            if (param["rule" + _indx] && param["rule" + _indx].customInfo == true) {
                for (var info in param["rule" + _indx]) {
                    if (noDelInfo.indexOf(info) == -1) {
                        delete param["rule" + _indx][info];
                    }
                }
            }
        }
        return param;
    },
    reqChange: function (clubId, param, ruleParam) {
        var that = this;
        var param_2 = this.compareChange(param, ruleParam);

        if (!param_2.isChange) {
            if (!param.isRemain)
                that.removeFromParent();
            return;
        }
        param_2.new_param.clubId = clubId;
        var sendInfo = this.getSendInfo(param_2.new_param);
        cc.log('----param_2----', JSON.stringify(param_2))
        MjClient.block();
        MjClient.gamenet.request("pkplayer.handler.clubUpdate", sendInfo,
            function (rtn) {
                MjClient.unblock();
                if (rtn.message) {
                    MjClient.showToast(rtn.message);
                    if (cc.sys.isObjectValid(that) && !param.isRemain)
                        that.removeFromParent();
                } else {
                    MjClient.showToast("修改失败");
                }
            }
        );
    },
    //对比改变
    compareChange: function (param, ruleParam, isCreate) {
        cc.log(" ===== 对比改变 +++++");
        var new_param = {};
        var isChange = false;
        param.title = escape(FriendCard_Common.strReplace(param.title));
        param.notice = escape(FriendCard_Common.strReplace(param.notice));
        let rules = FriendCard_Common.getRuleParm(ruleParam);

        if (isCreate) {
            new_param = param;
            isChange = true;
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                new_param["rule" + rule.ruleIndex] = rule;
            }
        } else {
            if (!param.isRemain) {
                for (var key in param) {
                    if (param[key] != this._data.info[key] && (this._data.info[key] == 0 || this._data.info[key])) {
                        new_param[key] = param[key];
                        isChange = true;
                    }
                }
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    if (JSON.stringify(rule) != JSON.stringify(this._data.info["rule" + rule.ruleIndex] || "")) {
                        new_param["rule" + rule.ruleIndex] = rule;
                        isChange = true;
                    }
                }
            } else {
                var number = param.isRemain;
                if (!this._data.info["rule" + number] && ruleParam["rule" + number]) {
                    //添加新的玩法
                    new_param["rule" + number] = ruleParam["rule" + number];
                    isChange = true;
                } else if (!this._data.info["rule" + number] && ruleParam["rule" + number] == "delete") {
                    // 添加新的玩法的时候，并没有保存而是删除本来就没有的玩法
                    return { new_param: new_param, isChange: isChange };
                } else {
                    if (JSON.stringify(ruleParam["rule" + number]) != JSON.stringify(this._data.info["rule" + number])) {
                        new_param["rule" + number] = ruleParam["rule" + number] || "delete";
                        isChange = true;
                    }
                }
            }
        }

        return { new_param: new_param, isChange: isChange };
    },
    initSelectLayer: function (node) {
        var back_selectType = node.getChildByName("back_selectType")
        if (!back_selectType) return;
        this._back_selectType = back_selectType;
        setWgtLayout(back_selectType, [0.5055, 0.5472], [0.5, 0.5], [0, 0]);
        for (var i = 0; i < 2; i++) {
            var btn = back_selectType.getChildByName("btn_type" + i)
            btn.selType = i;
            btn.addTouchEventListener(function (sender, type) {
                if (type == 2) {
                    this._clubType = sender.selType;
                    this.switchLayer(2)
                }
            }, this);
        }
        var btn_close = back_selectType.getChildByName("btn_close")
        btn_close.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.removeFromParent();
            }
        }, this);
    },
    //index = 1 创建俱乐部 打开选择俱乐部类型
    //index = 2 打开俱乐部设置
    switchLayer: function (index) {
        if (index == 1) {
            this._back.visible = false;
            this._back_selectType.visible = true;
            popupAnm(this._back_selectType);
        } else {
            if (this._back_selectType) {
                this._back_selectType.visible = false;
            }
            this._back.visible = true;
            popupAnm(this._back);
        }
    },
    //设置界面
    initLayer: function () {
        var _close = this._back.getChildByName("close");
        _close.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Qinyouquan_cetan_Chuangjianqinyouquan_Guanbi", {
                    uid: SelfUid()
                });
                this.removeFromParent();
            }
        }, this);
        this.initLeftNode();
        setTimeout(() => {

            this.initRightNode();
        }, 0);
    },
    //设置界面右侧
    initRightNode: function () {
        var that = this, data = this._data;
        //右边的节点
        this._node_2 = this._back.getChildByName("Node_2");
        //描述
        var text_desc = this._node_2.getChildByName("Text_0");
        text_desc.setString("最多配置" + this._ruleBtnNum + "种玩法，拖动玩法按钮可以修改排序");
        this._btnScrollView = this._node_2.getChildByName("ScrollView_1");
        this._btnScrollView.setScrollBarEnabled(false);
        var _btn_achieve = this._node_2.getChildByName("btn_achieve");
        if (data && data.info.creator) {
            _btn_achieve.loadTextures("A_FriendCard/Setting/btn_save_n.png", "A_FriendCard/Setting/btn_save_s.png", "A_FriendCard/Setting/btn_save_s.png", 1);
        }
        var param = {};
        var onAchieve = function (type) {
            this.updateWanfa();
            var _txt = that._textName.getString();
            _txt = _txt.replace(/\n/g, "");
            _txt = _txt.replace(/\r/g, "");
            param.title = _txt;
            that._textName.setString(_txt);
            param.notice = that._textNotice.getString();
            param.isRemain = type;
            var is_noPlay = Object.keys(MjClient.RuleParam).filter(k => k.indexOf('rule') > -1 && !!MjClient.RuleParam[k] && MjClient.RuleParam[k] != 'delete' && k != 'ruleSwitch').length > 0;
            if (data && !is_noPlay) is_noPlay = Object.keys(data.info).filter(k => k.indexOf('rule') > -1 && !!data.info[k] && data.info[k] != 'delete' && k != 'ruleSwitch').length > 0;
            var ruleParam = {};
            for (i = 0; i < that.wanfaBtns.length; i++) {
                //转换移动的玩法，点保存才转换
                var tranPosition = that.wanfaBtns[i].wanFaIndex, changeIndx = that.wanfaBtns[i].changeIndx;
                if (!changeIndx) changeIndx = tranPosition;
                ruleParam["rule" + changeIndx] = MjClient.RuleParam["rule" + tranPosition];
            }
            if (param.title == "") {
                MjClient.showToast("亲友圈名字为空！");
            } else if (param.notice == "") {
                MjClient.showToast("亲友圈公告为空！");
            } else if (!is_noPlay) {
                MjClient.showToast("亲友圈至少有一个玩法！");
            } else {
                if (data) {
                    that.reqChange(data.info.clubId, param, ruleParam);
                } else {
                    that.reqCreate(param, ruleParam);
                }
            }
        }
        this.onAchieve = onAchieve;
        _btn_achieve.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (!data)
                    MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Shezhi_Baocun", {
                        uid: SelfUid()
                    });
                that.onAchieve();
            }
        }, this);

        var wanfaBtns = [];
        this.wanfaBtns = wanfaBtns;
        this.xuhaoImgs = [];
        var _wanfaBtn = this._wanfaBtn = this._btnScrollView.getChildByName("Button_1");
        _wanfaBtn.visible = false;
        var _xuhao = this._xuhao = this._btnScrollView.getChildByName("xuhao_1");
        _xuhao.visible = false;

        let rules = FriendCard_Common.getRuleParm(data.info),
            rLen = rules.length;
        var hang = Math.ceil(rules.length / 2);
        this._diliverHieght = _wanfaBtn.height / 5;
        this._wanfaItemHeight = _wanfaBtn.height;
        var totalHeight = this.STotalHeight = hang * this._wanfaItemHeight + (hang - 1) * this._diliverHieght + 50;
        this._btnScrollView.setInnerContainerSize(cc.size(this._btnScrollView.width, totalHeight));

        for (var i = 0; i < rLen; i++) {
            let item = this.createItemHander(rules[i], i + 1, totalHeight, true);
            MjClient.RuleParam["rule" + rules[i].ruleIndex] = rules[i];
            wanfaBtns.push(item);
        }
        //最有一个
        this.wanfaBtns[rLen - 1].tempP = this["btn_pos_" + rLen];
        this.checkAddBtn();
        //移动玩法
        var touchNode = that._btnScrollView.getChildByName("touchNode");
        touchNode.setZOrder(999);
        function intoDeleteMoveRuleMode() {
            if (that.isDeleteMoveRuleMode) return;
            that.isDeleteMoveRuleMode = true;
            that.canMoveWanfaItem = true;
            that.touchListener = cc.EventListener.create(getTouchListener());
            cc.eventManager.addListener(that.touchListener, touchNode);
        }
        var listViewPos = that._btnScrollView.getPosition(), apoint = that._btnScrollView.getAnchorPoint(), hg = that._btnScrollView.height;
        listViewPos.x = listViewPos.x - (apoint.x - 0.5) * that._btnScrollView.width;
        listViewPos.y = listViewPos.y - (apoint.y - 0.5) * hg;
        hg += 50;
        var listBottomP = that._btnScrollView.getParent().convertToWorldSpace(cc.p(listViewPos.x, listViewPos.y - hg));
        var listTopP = that._btnScrollView.getParent().convertToWorldSpace(cc.p(listViewPos.x, listViewPos.y + hg));
        function getTouchListener() {
            var curIndex = -1;
            var curCloneItem = null;
            var ret = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    //防止多点触摸异常
                    if (curIndex != -1 && curCloneItem) {
                        that.wanfaBtns[curIndex].visible = true;
                        that.wanfaBtns[curIndex].setPosition(that.wanfaBtns[curIndex].tempP);
                        curCloneItem.removeFromParent(true);
                        delete curCloneItem;
                        curCloneItem = null;
                    }
                    if (!that.canMoveWanfaItem) {
                        return false;
                    }
                    curIndex = -1;
                    that.touchBeginTime = new Date().getTime();
                    var p = touchNode.getParent().convertToNodeSpace(touch.getLocation());
                    for (var i = 0; i < that.wanfaBtns.length; i++) {
                        if (that.wanfaBtns[i].visible && cc.rectContainsPoint(that.wanfaBtns[i].getBoundingBox(), p)) {
                            curIndex = i;
                            if (that.wanfaBtns[curIndex].isAddButton) {
                                //wanfaBtns[curIndex].onTouchListerer(wanfaBtns[curIndex],2);
                                return -1;
                            }
                            break;
                        }
                    }

                    return curIndex != -1;
                },
                onTouchMoved: function (touch, event) {
                    cc.log("onTouchMoved friend info");
                    if (curIndex == -1) {
                        return;
                    }
                    if (!curCloneItem) {
                        var nowTime = new Date().getTime();
                        if (nowTime - that.touchBeginTime > 500) {
                            curCloneItem = that.wanfaBtns[curIndex].clone();
                            that.wanfaBtns[curIndex].visible = false;
                            that._btnScrollView.addChild(curCloneItem);
                            curCloneItem.zIndex = 500;
                        } else {
                            return;
                        }
                    }
                    that._btnScrollView.setTouchEnabled(false);
                    var p = touchNode.getParent().convertToNodeSpace(touch.getLocation());
                    curCloneItem.setPosition(p);

                    //判断是否可以玩法区域，偏差30
                    if (p.y > that.STotalHeight || p.y < 0 || p.x < 0 || p.x > that._btnScrollView.width) {
                        //cc.log("onTouchMoved friend info can not move");
                        return;
                    }
                    //找到最近的目标
                    var distance = -1;
                    var moveToIndex = -1;
                    for (var i = 0; i < that.wanfaBtns.length; i++) {
                        if (i != curIndex && that.wanfaBtns[i].visible && !that.wanfaBtns[i].isAddButton) {
                            var tempDistance = Math.sqrt(Math.pow(curCloneItem.x - that.wanfaBtns[i].x, 2) + Math.pow(curCloneItem.y - that.wanfaBtns[i].y, 2));
                            if (distance == -1 || tempDistance < distance) {
                                distance = tempDistance;
                                moveToIndex = i;
                            }
                        }
                    }
                    //最近的目标中心点偏移25内可移动
                    if (moveToIndex > -1 && distance < 25) {
                        //cc.log("onTouchMoved friend info can moveToIndex =  " + moveToIndex);
                        if (!that.canMoveWanfaItem) {
                            return;
                        }
                        that.canMoveWanfaItem = false;

                        //交换数据
                        var tempP = that.wanfaBtns[curIndex].tempP;
                        var moveAction = cc.moveTo(0.3, that.wanfaBtns[curIndex].tempP);
                        that.wanfaBtns[curIndex].tempP = that.wanfaBtns[moveToIndex].tempP;
                        that.wanfaBtns[curIndex].setPosition(that.wanfaBtns[curIndex].tempP);
                        that.wanfaBtns[moveToIndex].tempP = tempP;
                        that.wanfaBtns[curIndex].changeIndx = that.wanfaBtns[moveToIndex].wanFaIndex;
                        that.wanfaBtns[moveToIndex].changeIndx = that.wanfaBtns[curIndex].wanFaIndex;

                        that.wanfaBtns[moveToIndex].runAction(cc.sequence(moveAction, cc.callFunc(function () {
                            that.canMoveWanfaItem = true;
                        })));
                        //这里用用tempP，因为有0.3秒的动画
                        that.wanfaBtns.sort(function (a, b) {
                            if (a.tempP.y > b.tempP.y) {
                                return -1;
                            } else if (a.tempP.y == b.tempP.y) {
                                return a.tempP.x < b.tempP.x ? -1 : 1;
                            } else {
                                return 1;
                            }
                        })
                        curIndex = moveToIndex;
                    }

                    if (moveToIndex > -1) {
                        var oneItemtime = 0.3;//画过1个item要0.5秒
                        var nowP = touch.getLocation();
                        var row = parseInt(that.wanfaBtns.length / 2) + that.wanfaBtns.length % 2;
                        var curRow = parseInt(moveToIndex / 2) + moveToIndex % 2;
                        if (nowP.y - listBottomP.y < 20) {//滑到列表低（不是指最后一个）
                            that._btnScrollView.scrollToBottom(oneItemtime * (row - curRow), false);
                        } else if (listTopP.y - nowP.y < 20) {//滑到列表顶（不是指第一个）
                            that._btnScrollView.scrollToTop(oneItemtime * (curRow + 1), false);
                        } else {
                            that._btnScrollView.stopAutoScroll();
                        }
                    } else {
                        that._btnScrollView.stopAutoScroll();
                    }

                },
                onTouchEnded: function (touch, event) {
                    if (curCloneItem && curIndex > -1) {
                        that.wanfaBtns[curIndex].setPosition(curCloneItem.getPosition());
                        that.wanfaBtns[curIndex].visible = true;
                        curCloneItem.visible = false;
                        curCloneItem.removeFromParent(true);
                        delete curCloneItem;
                        curCloneItem = null;
                        that.canMoveWanfaItem = false;
                        var moveAction = cc.moveTo(0.3, that.wanfaBtns[curIndex].tempP);
                        that.wanfaBtns[curIndex].runAction(cc.sequence(moveAction, cc.callFunc(function () {
                            that.canMoveWanfaItem = true;
                        })));
                    }
                    curIndex = -1;
                    that._btnScrollView.setTouchEnabled(true);
                    that._btnScrollView.stopAutoScroll();
                },
                onTouchCancelled: function (touch, event) {
                    ret.onTouchEnded(touch, event);
                    that._btnScrollView.setTouchEnabled(true);
                    that._btnScrollView.stopAutoScroll();
                }
            };
            return ret;
        }
        intoDeleteMoveRuleMode()
    },
    onTouchListerer: function (sender, type) {
        if (type == 0) {
            sender.beginTime = new Date().getTime();
        } else if (type == 2 || type == 3) {
            if (this.isDeleteMoveRuleMode && new Date().getTime() - sender.beginTime > 500)
                return;
        }
        if (type == 2) {
            MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Tianjiachuangjian", {
                uid: SelfUid()
            });
            var number = sender.wanFaIndex;
            var ruleName = "";
            var isShowLibertyCreRoom = false;
            if (MjClient.RuleParam["rule" + number] && MjClient.RuleParam["rule" + number].ruleName)
                ruleName = MjClient.RuleParam["rule" + number].ruleName;
            else if (this._data && this._data.info["rule" + number] && this._data.info["rule" + number].ruleName)
                ruleName = this._data.info["rule" + number].ruleName;

            if (MjClient.RuleParam["rule" + number] && MjClient.RuleParam["rule" + number].customInfo)
                isShowLibertyCreRoom = MjClient.RuleParam["rule" + number].customInfo;
            else if (this._data && this._data.info["rule" + number] && this._data.info["rule" + number].customInfo)
                isShowLibertyCreRoom = this._data.info["rule" + number].customInfo;

            cc.log('-----------------2121212----------', number, ruleName)
            postEvent("createRoom", {
                IsFriendCard: true,
                ruleNumer: number,
                ruleName: ruleName,
                clubType: this._clubType,
                isShowLibertyCreRoom: isShowLibertyCreRoom,
                isMatch: this._isMatch,
            });
        }
    },
    //设置界面左侧
    initLeftNode: function () {
        this._node_1 = this._back.getChildByName("Node_1"), data = this._data;
        var _btn_jiesan = this._node_1.getChildByName("btn_jiesan");
        if (data && data.info.creator && MjClient.data.pinfo.uid == data.info.creator)
            _btn_jiesan.setVisible(true);
        else
            _btn_jiesan.setVisible(false);

        _btn_jiesan.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                var uiPara = {}
                uiPara.msg = "解散亲友圈后，数据不可恢复，\n请慎重操作！";
                uiPara.yes = function () {
                    that.reqJiesan(data.info.clubId);
                }
                uiPara.no = function () {
                }
                uiPara.close = function () {
                }
                MjClient.FriendCard_main_ui.addChild(new Friendcard_popUpMeg(uiPara))
            }
        }, this);

        var _TextBg = this._node_1.getChildByName("inputimg");
        this._textName = new cc.EditBox(cc.size(_TextBg.width, _TextBg.height), new cc.Scale9Sprite());
        this._textName.setFontColor(cc.color("2b344d"));
        this._textName.setFontSize(30);
        this._textName.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        this._textName.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        this._textName.setFontName("fonts/lanting.TTF");
        this._textName.setPlaceHolder("最多8个字");
        this._textName.setPlaceholderFontSize(30);
        this._textName.setPlaceholderFontColor(cc.color("2b344d"))
        this._textName.setPosition(_TextBg.getContentSize().width / 2, _TextBg.getContentSize().height / 2);
        _TextBg.addChild(this._textName);


        var _TextBg_2 = this._node_1.getChildByName("inputimg_2");
        this._textNotice = new cc.EditBox(cc.size(_TextBg_2.width, _TextBg_2.height), new cc.Scale9Sprite());
        this._textNotice.setFontColor(cc.color("2b344d"));
        this._textNotice.setFontSize(30);
        this._textNotice.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS);
        this._textNotice.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        this._textNotice.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        this._textNotice.setFontName("fonts/lanting.TTF");
        this._textNotice.setPlaceHolder("最多可输入" + FriendCard_Common.FRIEND_NOTICE_MAX_LENGTH + "个字");
        this._textNotice.setPlaceholderFontSize(30);
        this._textNotice.setString("请遵守法律法规，健康游戏，禁止赌博！");
        this.editBoxEditingDidBegin = function (editBox) { }.bind(this);
        this.editBoxEditingDidEnd = function (editBox) { }.bind(this);
        this.editBoxTextChanged = function (editBox, text) {
            var result = stringLengthForMysql(editBox.getString(), FriendCard_Common.FRIEND_NOTICE_MAX_LENGTH * 3);
            if (result.len > FriendCard_Common.FRIEND_NOTICE_MAX_LENGTH * 3) {
                editBox.setString(result.txt);
                MjClient.showToast("最多可输入" + FriendCard_Common.FRIEND_NOTICE_MAX_LENGTH + "个字");
            }
        }.bind(this);
        this.editBoxReturn = function (editBox) { }.bind(this);
        this._textNotice.setDelegate(this);
        this._textNotice.setPosition(_TextBg_2.getContentSize().width / 2, _TextBg_2.getContentSize().height / 2);
        _TextBg_2.addChild(this._textNotice);

        if (data) {
            this._textName.setString(unescape(data.info.title))
            this._textNotice.setString(unescape(data.info.notice))
        }
    },
    createItemHander: function (rule, _indx, totalHeight, isWf = true) {
        var _posY = totalHeight - this._wanfaItemHeight * Math.ceil(_indx / 2) - (Math.ceil(_indx / 2) - 1) * this._diliverHieght;
        //序号
        if (isWf) {
            var xuhao = this._xuhao.clone();
            xuhao.visible = true;
            xuhao.getChildByName("Text").setString(_indx + '');
            xuhao.setPosition(cc.p(_indx % 2 == 1 ? 30 : 230, _posY));
            xuhao.zIndex = _indx;
            this._btnScrollView.addChild(xuhao);
            this.xuhaoImgs.push(xuhao);
        }
        //按钮
        let wanfaBtn = this._wanfaBtn.clone(), rIndx = rule.ruleIndex, txt = wanfaBtn.getChildByName("Text");
        wanfaBtn.setPosition(cc.p((_indx % 2 == 1 ? 126 : 326) + 4, _posY));
        wanfaBtn.zIndex = 100 + _indx;
        wanfaBtn.wanFaIndex = rIndx;
        txt.setString(getNewName(unescape(rule.ruleName), 10));
        wanfaBtn.addTouchEventListener(this.onTouchListerer, this);
        this._btnScrollView.addChild(wanfaBtn);
        wanfaBtn.visible = true;
        this["btton_" + rIndx] = wanfaBtn;
        this["_play_text_" + rIndx] = txt;
        this["btn_pos_" + _indx] = wanfaBtn.getPosition();
        _indx > 1 && (this.wanfaBtns[_indx - 2].tempP = this["btn_pos_" + (_indx - 1)]);
        return wanfaBtn;
    },
});