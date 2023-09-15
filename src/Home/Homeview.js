// ------雅安 home--------

var HomeView_yaan = cc.Layer.extend({
    _gamePanelLeftNode: null,
    _joinRoom: null,
    _createRoom: null,
    _clubRoom: null,
    _playGroundRoom: null,
    _guangbo: null,
    _myFuHaoData: null,
    _myQueShenData: null,
    ctor: function () {
        this._super();

        var homeui = ccs.load(res.Home_json);
        this.uiNode = homeui.node;
        this.addChild(homeui.node);
        MjClient.homeui = this;
        playMusic("bgFight_xinsiyang");
        setMusicVolume(-1);

        UIEventBind(null, homeui.node, "logout", function () {
            if (MjClient.homeui) {
                MjClient.homeui.removeFromParent(true);
                delete MjClient.homeui;
            }
        });

        var _back = homeui.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);

        //小姐姐
        var _girlPanel = _back.getChildByName("Panel_girl");
        this._girlPanel = _girlPanel;
        this._girlPanel.setVisible(true);
        // var _girlSprite = _girlPanel.getChildByName("girl");
        // if (_girlSprite) _girlSprite.visible = false;
        // var _girlBone = createSpine("spine/home/girl/renwunv.json", "spine/home/girl/renwunv.atlas");
        // _girlBone.setAnimation(0, 'animation', true);
        // _girlPanel.addChild(_girlBone, 1);
        setWgtLayout(_girlPanel, [0.86, 0.86], [0.22, 0], [0, -0.036], false, true);

        //底部按钮的地板
        this._Panel_bottom = _back.getChildByName("Panel_bottom");
        this._Panel_bottom.zIndex = 200;
        this._Panel_bottom.visible = true;
        setWgtLayout(this._Panel_bottom, [1, 1], [0.5, 0], [0, 0], false, true);

        var _tilebg = homeui.node.getChildByName("tilebg");
        _tilebg.visible = true;
        this._titlePanel = _tilebg;
        setWgtLayout(_tilebg, [1, 1], [0.5, 1], [0, 0]);

        //设置
        var _setting = _tilebg.getChildByName("setting");
        //setWgtLayout(_setting, [0.08, 0.12], [1, 1.02], [-0.6, -0.8]);
        _setting.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var settringLayer = new HomeSettingView();
                    settringLayer.setName("HomeClick");
                    let blac = settringLayer.jsBind.back._node, nC = blac.children;
                    for (var i = 0; i < nC.length; i++) {
                        let cn = nC[i].name;
                        if (cn === 'txtOther' ||
                            cn === 'CheckBoxPrepare' ||
                            cn === 'CheckBoxShark' ||
                            cn === 'CheckBoxDialect' ||
                            cn === 'CheckBoxMandarin' ||
                            cn === 'txtLanguage') nC[i].visible = false;
                        else if (cn === 'txtMusic' || cn === 'SliderMusic' || cn === 'CheckBoxMusic') {
                            nC[i].y = blac.getSize().height / 2 + 70;
                        } else if (cn === 'txtVoice' || cn === 'SliderVoice' || cn === 'CheckBoxVoice') {
                            nC[i].y = blac.getSize().height / 2 + 10;
                        } else if (cn === 'txtSpeak' || cn === 'SliderSpeak' || cn === 'CheckBoxSpeak') {
                            nC[i].y = blac.getSize().height / 2 - 50;
                        } else if (cn === 'packageName') {
                            nC[i].setString(MjClient.native.GetPackageName());
                        }
                    }
                    //默认震动
                    util.localStorageEncrypt.setBoolItem("isVibrato", false);
                    //默认自动准备
                    util.localStorageEncrypt.setBoolItem(MjClient.KEY_autoRelay, false);
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("ShezhiClick", { uid: SelfUid() });
                    updateUserBehavior("设置");
                    break;
                default:
                    break;
            }
        }, this);

        //右上角的帮助按钮,
        var _BtnHTP = this._Panel_bottom.getChildByName("BtnHTP");
        _BtnHTP.visible = true;
        _BtnHTP.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.openWeb({ url: null, help: true });
                    MjClient.native.umengEvent4CountWithProperty("WanfaClick", { uid: SelfUid() });
                    updateUserBehavior("玩法");
                    break;
                default:
                    break;
            }
        }, this);

        //战绩
        var _zhanji = this._Panel_bottom.getChildByName("zhanji");
        _zhanji.visible = true;
        _zhanji.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    //MjClient.showMsg("暂未开放!");
                    if (!MjClient.data.sData) {
                        MjClient.Scene.addChild(new PlayLogView());
                        MjClient.native.umengEvent4CountWithProperty("ZhanjiClick", { uid: SelfUid() });
                        updateUserBehavior("战绩");
                    } else
                        MjClient.showMsg("正在游戏中，不能查看战绩");
                    break;
                default:
                    break;
            }
        }, this);

        //邮件
        this._youjian = _tilebg.getChildByName("youjian");
        this._youjian.visible = true;
        this._youjian.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var emailLayer = new EmailLayer();
                    MjClient.Scene.addChild(emailLayer);
                    MjClient.native.umengEvent4CountWithProperty("YoujianClick", { uid: SelfUid() });
                    updateUserBehavior("邮件");
                    break;
                default:
                    break;
            }
        }, this);
        this._youjian.getChildByName("hongDian").setVisible(false);
        this.updateYoujianCount();

        //客服按钮
        var _BtnKeFu = this._Panel_bottom.getChildByName("BtnKeFu");
        _BtnKeFu.getChildByName("hongDian").setVisible(false);
        _BtnKeFu.visible = true;
        _BtnKeFu.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.showToast('敬请期待!');
                    break;
                default:
                    break;
            }
        }, this);

        //实名认证
        var sm = _tilebg.getChildByName("shiming");
        sm.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.Scene.addChild(new shiMingRenZhengLayer());
                    break;
                default:
                    break;
            }
        }, this);

        //广播
        this._guangbo = homeui.node.getChildByName("guangbo");

        //头像
        var _headbg = homeui.node.getChildByName("headbg");
        this._headPanel = _headbg;

        //亲友圈邀请审核
        var btnFriendcardInvite = _tilebg.getChildByName("btnFriendcardInvite");
        if (!btnFriendcardInvite) {
            btnFriendcardInvite = new ccui.Button("A_Home/Main/btn_shenhe.png", null, null, 1);
            btnFriendcardInvite.setName("btnFriendcardInvite");
            btnFriendcardInvite.addTouchEventListener(function (sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    MjClient.Scene.addChild(new Friendcard_Invite_Shenhe());
                }
            }, this)
            _tilebg.addChild(btnFriendcardInvite);
            var hongDian = new ccui.ImageView("hall/hongdian-home.png");
            hongDian.setName("hongDian");
            hongDian.setPosition(cc.p(btnFriendcardInvite.width * 0.1, btnFriendcardInvite.height * 0.9));
            hongDian.setScale(0.6)
            btnFriendcardInvite.addChild(hongDian);
            var Text = new ccui.Text();
            Text.setName("Text");
            Text.setFontName("fonts/lanting.ttf");
            Text.setFontSize(30);
            Text.setTextColor(cc.color(255, 255, 255));
            Text.setPosition(hongDian.width / 2, hongDian.height / 2);
            Text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            Text.ignoreContentAdaptWithSize(true);
            hongDian.addChild(Text);
            hongDian.visible = false;
            UIEventBind(null, btnFriendcardInvite, "refresh_inviteShenhe_num", function (data) {
                if (typeof (data.num) != "undefined") {
                    if (data.num == 0) {
                        hongDian.visible = false;
                    } else {
                        hongDian.visible = true;
                        Text.setString(data.num);
                    }
                }
            });
        }
        btnFriendcardInvite.visible = isAgent();
        btnFriendcardInvite.setPosition(cc.p(66.6, -75))
        setWgtLayout(this._guangbo, [0.5, 0.5], [0.5, 0.84], [0, 0]);

        setWgtLayout(_headbg, [0.11, 0.11], [0.02, 0.89], [0, 0]);

        var _scroll = this._guangbo.getChildByName("scroll");
        var _msg = _scroll.getChildByName("msg");
        var scrollDataArr = [];
        scrollDataArr.push(MjClient.remoteCfg.guestLogin ? "欢迎来到天涯棋牌，快和朋友一起对战吧！" : MjClient.systemConfig.homeScroll);
        homePageRunText(_msg, scrollDataArr);
        function getMsg() {
            var content = "" + MjClient.systemConfig.homeScroll;
            return MjClient.remoteCfg.guestLogin ? "欢迎来到天涯棋牌，快和朋友一起对战吧！" : content;
        }
        _msg.setString(getMsg());
        UIEventBind(null, _scroll, "userReportPush", function (scrollData) {
            if (scrollData.length > 0) {
                var scrollDataNew = [];
                for (var i = 0; i < scrollData.length; i++) {
                    scrollDataNew.push("经公司核实，" + unescape(scrollData[i].nickname) + "存在" + unescape(scrollData[i].type) + "等不良行为，已对该用户进行封号处理。")
                }
                homePageRunText(_msg, scrollDataNew);

            }
            _scroll.schedule(function () {
                homePageRunText(_msg, scrollDataArr);
            }, 600);
        });

        var selfHead = SelfHeadInfo();
        MjClient.loadWxHead(selfHead.uid, selfHead.url);

        var _head = _headbg.getChildByName("head");
        UIEventBind(this.jsBind, _head, "loadWxHead", function (d) {
            if (d.uid === MjClient.data.pinfo.uid) {
                var avatar = _head.getChildByName('homeheadsp');
                if (avatar) {
                    avatar.initWithSpriteFrame(d.img);
                }
                else {
                    avatar = new cc.Sprite(d.img);
                    var stencil = new cc.Sprite("A_Common/default_headpic.png");
                    var clip = new cc.ClippingNode(stencil);
                    clip.setAlphaThreshold(0);
                    clip.addChild(avatar);
                    clip.setPosition(_head.width / 2, _head.height / 2);
                    _head.addChild(clip);
                    clip.setScale(0.95)
                    clip.name = 'homeheadsp'
                }
            }
        });

        _head.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.showPlayerInfoBind(MjClient.data.pinfo, true, true);
                    MjClient.native.umengEvent4CountWithProperty("TouxiangClick", { uid: SelfUid() });
                    break;
                default:
                    break;
            }
        }, this);

        //昵称
        var _name = _head.getChildByName("name");
        function _getName() {
            var pinfo = MjClient.data.pinfo;
            return unescape(pinfo.nickname);
        }
        _name.setString(getNewName(_getName()));
        _name.ignoreContentAdaptWithSize(true);

        UIEventBind(null, _name, "changeNickname", function () {
            _name.setString(getNewName(_getName()));
            _name.ignoreContentAdaptWithSize(true);
        });

        //ID
        var _uid = _head.getChildByName("uid");
        _uid.setString("ID:" + SelfUid());
        _uid.ignoreContentAdaptWithSize(true);
        if (MjClient.remoteCfg.hideMoney) {
            //_uid.y=45;
        }

        var _moneyBack = _head.getChildByName("moneyback");
        _moneyBack.visible = !MjClient.remoteCfg.hideMoney;

        var _money = _moneyBack.getChildByName("money");
        _money.ignoreContentAdaptWithSize(true);

        var btn_addYB = _moneyBack.getChildByName("btn_add");
        btn_addYB.visible = false;
        // btn_addYB.addTouchEventListener(function (sender, type) {
        //     if (type === 2) {
        //         MjClient.native.umengEvent4CountWithProperty("Yuanbaozengjia", { uid: SelfUid() });
        //         MjClient.Scene.addChild(enter_store());
        //     }
        // }, this);

        changeAtalsForLabel(_money, MjClient.data.pinfo.money);
        UIEventBind(this.jsBind, _money, "updateInfo", function () {

            var icurrentMoney = parseInt(_money.getString());
            var lastMoney = parseInt(MjClient.data.pinfo.money);
            if (lastMoney > icurrentMoney) {
                //成功后，加粒子效果
                var starParticle = new cc.ParticleSystem("Particle/diamondtail.plist");
                starParticle.setPosition(_money.getContentSize().width / 2, _money.getContentSize().height / 2);
                _money.addChild(starParticle);
                _money.runAction(cc.sequence(cc.scaleTo(1, 1.5).easing(cc.easeBackOut()), cc.scaleTo(0.3, 1)));
            }
            changeAtalsForLabel(_money, MjClient.data.pinfo.money);
        });

        UIEventBind(this.jsBind, _money, "loginOK", function () {//这里监听这个事件没用，数据还没刷新呢，刷新数据在scene的绑定事件里
            changeAtalsForLabel(_money, MjClient.data.pinfo.money);
        });

        //活动伸缩按钮
        var _btnActive = _tilebg.getChildByName("gonggao");
        function _btnActiveTouchEvent(sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    updateUserBehavior("活动");
                    if (MjClient.systemConfig && MjClient.systemConfig.activity) {
                        var layer = new activityLayer();
                        MjClient.Scene.addChild(layer);
                        MjClient.native.umengEvent4CountWithProperty("HuodongClick", { uid: SelfUid() });
                    }
                    break;
                default:
                    break;
            }
        }
        _btnActive.addTouchEventListener(_btnActiveTouchEvent, this);

        /*
         商店 
         */
        var _BtnShop = this._Panel_bottom.getChildByName("Button_store");
        _BtnShop.visible = true;
        if (MjClient.remoteCfg.hideMoney == true) {
            _BtnShop.visible = false;
            _BtnShop.setTouchEnabled(false);
        }
        // _BtnShop.runAction(cc.sequence(cc.rotateBy(1, 20), cc.rotateBy(1, -20)).repeatForever());
        _BtnShop.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.showToast('敬请期待!');
                    // var layer = enter_store();
                    // MjClient.Scene.addChild(layer);
                    // MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shop", { uid: SelfUid() });
                    // updateUserBehavior("商城");
                    break;
                default:
                    break;
            }
        }, this);

        //设置游戏Panel和广告Panel
        this._gamePanelLeftNode = _back.getChildByName("Panel_left");
        this.setPanel(this._gamePanelLeftNode);
        // COMMON_UI.addHintText(homeui.node);


        //金币场回来显示金币场界面
        if (MjClient.data && MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId) {
            if (MjClient.GoldHallLayer) {
                MjClient.GoldHallLayer.removeFromParent(true);
            }
            var goldHallLayer = new GoldHallLayer();
            this.goldHallLayer = goldHallLayer;
            this.addChild(goldHallLayer);
            this.showJinbiView();
        }
        return true;
    },
    //扩展定义
    LoadPackage: function (path) {
        return new Promise((resolve, reject) => {
            fgui.UIPackage.loadPackage(path, err => {
                if (err) reject(err);//@ts-ignore
                else resolve();
            })
        })
    },
    showNomalHome: function () {
        MjClient.homeui._gamePanelNode.setVisible(true);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    if (this._keyBackClickedTime && (new Date()).getTime() - this._keyBackClickedTime <= 1 * 1000) {
                        delete this._keyBackClickedTime;
                        showExitGameLayer();
                    }
                    else {
                        if (MjClient.exitLayer && cc.sys.isObjectValid(MjClient.exitLayer)) {
                            MjClient.exitLayer.removeFromParent();
                            MjClient.exitLayer = null;
                        }
                        else {
                            this._keyBackClickedTime = (new Date()).getTime();
                        }
                    }
                }
            }
        }, this);


        //检查剪切板
        this.schedule(function () {
            if (MjClient.playui) {
                return;
            }

            var clipboardStr = MjClient.native.doGetPasteBoard();
            if (!cc.isUndefined(clipboardStr) && clipboardStr.length > 0) {
                var tableID = clipboardStr.substring(clipboardStr.indexOf('[') + 1, clipboardStr.indexOf(']'));
                if (tableID.length == 6) {
                    MjClient.showMsg("是否立即加入房间号[" + tableID + "]的房间？", function () {
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fenxiang_Jiaru_sure", { uid: SelfUid() });
                        MjClient.joinGame(parseInt(tableID));
                    }, function () { });
                    MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fenxiang_Jiaru", { uid: SelfUid() });
                }
                if (tableID.length == 8 && tableID != MjClient.myReplayCode) {
                    MjClient.showMsg("是否立即播放回放码为[" + tableID + "]的比赛？", function () {
                        MjClient.getOtherPlayLog(parseInt(tableID));
                    }, function () { });
                    MjClient.native.doCopyToPasteBoard("");//清空剪切板
                }
            }
        }, 1, cc.REPEAT_FOREVER, 1.5);


        this._Panel_bottom.setOpacity(0);
        this._titlePanel.setOpacity(0);
        this._headPanel.setOpacity(0);
        this._guangbo.setOpacity(0);
        var p0 = this._gamePanelLeftNode._movePoint;
        var p2 = this._Panel_bottom._movePoint;
        var p3 = this._girlPanel._movePoint;
        var p4 = this._titlePanel._movePoint;
        var p5 = this._headPanel._movePoint;
        var p6 = this._guangbo._movePoint;
        this._gamePanelLeftNode.runAction(cc.moveTo(0.6, p0).easing(cc.easeBackOut()));
        this._girlPanel.runAction(cc.moveTo(0.6, p3).easing(cc.easeBackOut()));
        this._Panel_bottom.runAction(cc.spawn(cc.moveTo(1, p2).easing(cc.easeSineOut()), cc.fadeIn(1.3)));
        this._titlePanel.runAction(cc.spawn(cc.moveTo(1, p4).easing(cc.easeSineOut()), cc.fadeIn(1.3)));
        this._headPanel.runAction(cc.spawn(cc.moveTo(1, p5).easing(cc.easeSineOut()), cc.fadeIn(1.3)));
        this._guangbo.runAction(cc.spawn(cc.moveTo(1, p6).easing(cc.easeSineOut()), cc.fadeIn(1.3)));
    },

    onExit: function () {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
    },
    saveActionPosition: function () {

        this._gamePanelLeftNode._movePoint = this._gamePanelLeftNode.getPosition();
        this._gamePanelLeftNode.setPositionX(MjClient.size.width + this._gamePanelLeftNode.width);

        this._Panel_bottom._movePoint = this._Panel_bottom.getPosition();
        var oldBottomPanelh = this._Panel_bottom.height;
        this._Panel_bottom.setPositionY(-oldBottomPanelh);

        this._girlPanel._movePoint = this._girlPanel.getPosition();
        this._girlPanel.setPositionX(-1280);

        this._titlePanel._movePoint = this._titlePanel.getPosition();
        var oldTitlePanelh = this._titlePanel.height;
        this._titlePanel.setPositionY(oldTitlePanelh + MjClient.size.height);

        this._headPanel._movePoint = this._headPanel.getPosition();
        var oldHeadPanelh = this._headPanel.height;
        this._headPanel.setPositionY(oldHeadPanelh + MjClient.size.height);

        this._guangbo._movePoint = this._guangbo.getPosition();
        var oldGuangBoh = this._guangbo.height;
        this._headPanel.setPositionY(oldGuangBoh + MjClient.size.height);
    },
    showJinbiView: function () {
        // goldField_start();
        MjClient.showToast("敬请期待！");
    },
    doShowAction: function () {

        var topActionList = this._topActionList || [];
        var bottomActionList = this._bottomActionList || [];
        var rightActionList = this._rightActionList || [];
        var leftActionList = this._leftActionList || [];

        var actionTime1 = 0.3;
        var actionTime2 = 0.1;
        for (var i = 0; i < topActionList.length; i++) {
            topActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, cc.p(topActionList[i].truePosition.x, topActionList[i].truePosition.y * 0.99)), cc.moveTo(actionTime2, topActionList[i].truePosition)));
        }

        for (var i = 0; i < bottomActionList.length; i++) {
            bottomActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, cc.p(bottomActionList[i].truePosition.x, bottomActionList[i].truePosition.y * 1.01)), cc.moveTo(actionTime2, bottomActionList[i].truePosition)));
        }

        for (var i = 0; i < rightActionList.length; i++) {
            rightActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, cc.p(rightActionList[i].truePosition.x * 0.95, rightActionList[i].truePosition.y)), cc.moveTo(actionTime2, rightActionList[i].truePosition)));
        }

        for (var i = 0; i < leftActionList.length; i++) {
            leftActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, cc.p(leftActionList[i].truePosition.x * 1.05, leftActionList[i].truePosition.y)), cc.moveTo(actionTime2, leftActionList[i].truePosition)));
        }
        this._isShowingGoldHall = false;
    },
    doHideAction: function () {
        if (this._isShowingGoldHall) {
            return;
        }
        this._isShowingGoldHall = true;
        var that = this;

        //dX,dY是增加偏移
        var topActionList = [];
        var tilebg = this.uiNode.getChildByName("tilebg");
        var headbg = this.uiNode.getChildByName("headbg");
        tilebg._dY = tilebg.height;
        headbg._dY = headbg.height;
        topActionList.push(tilebg);
        topActionList.push(headbg);

        var bottomActionList = [];
        this._Panel_bottom._dY = this._Panel_bottom.height;
        bottomActionList.push(this._Panel_bottom);

        var leftActionList = [];
        this._girlPanel._dX = this._girlPanel.width * 2;
        leftActionList.push(this._girlPanel);
        this._gamePanelLeftNode._dX = this._gamePanelLeftNode.width;
        leftActionList.push(this._gamePanelLeftNode);

        var rightActionList = [];


        //其余的通过计算估算动画
        var childrens = this.uiNode.getChildren();
        for (var i in childrens) {
            if (topActionList.indexOf(childrens[i]) !== -1 ||
                bottomActionList.indexOf(childrens[i]) !== -1 ||
                leftActionList.indexOf(childrens[i]) !== -1 ||
                rightActionList.indexOf(childrens[i]) !== -1) {
                continue;
            }
            if (childrens[i].name === "back") {
                continue;
            }
            var centerPoint = cc.p((childrens[i].x + (childrens[i].getAnchorPoint().x - 0.5) * childrens[i].width), (childrens[i].y + (childrens[i].getAnchorPoint().y - 0.5) * childrens[i].height));
            if (centerPoint.y >= MjClient.size.height * 0.9) {
                //加到顶部
                topActionList.push(childrens[i]);
            } else if (centerPoint.y <= MjClient.size.height * 0.1) {
                //加到底部
                bottomActionList.push(childrens[i]);
            } else if (centerPoint.x <= MjClient.size.width * 0.5) {
                //加到左边
                leftActionList.push(childrens[i]);
            } else {
                //加到右边
                rightActionList.push(childrens[i]);
            }
        }
        this._topActionList = topActionList;
        this._bottomActionList = bottomActionList;
        this._rightActionList = rightActionList;
        this._leftActionList = leftActionList;


        var windowSize = { width: 1280, height: 720 };
        windowSize.width = MjClient.size.width > windowSize.width ? MjClient.size.width : windowSize.width;
        windowSize.height = MjClient.size.height > windowSize.height ? MjClient.size.height : windowSize.height;

        var actionTime1 = 0.3;
        var actionTime2 = 0.1;
        for (var i = 0; i < topActionList.length; i++) {
            topActionList[i].truePosition = topActionList[i].getPosition();
            topActionList[i].hidePosition = cc.p(topActionList[i].getPositionX(), windowSize.height + (topActionList[i].height / 2 + Math.abs(0.5 - topActionList[i].getAnchorPoint().y) * topActionList[i].height + (topActionList[i]._dY ? topActionList[i]._dY : 0)) * topActionList[i].scale);
            topActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, topActionList[i].hidePosition)));
        }

        for (var i = 0; i < bottomActionList.length; i++) {
            bottomActionList[i].truePosition = bottomActionList[i].getPosition();
            bottomActionList[i].hidePosition = cc.p(bottomActionList[i].getPositionX(), (- bottomActionList[i].height / 2 - Math.abs(bottomActionList[i].getAnchorPoint().y - 0.5) * bottomActionList[i].height - (bottomActionList[i]._dY ? bottomActionList[i]._dY : 0)) * bottomActionList[i].scale);
            bottomActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, bottomActionList[i].hidePosition)));
        }

        for (var i = 0; i < rightActionList.length; i++) {
            rightActionList[i].truePosition = rightActionList[i].getPosition();
            rightActionList[i].hidePosition = cc.p(windowSize.width + (rightActionList[i].width / 2 + Math.abs(0.5 - rightActionList[i].getAnchorPoint().x) * rightActionList[i].width + (rightActionList[i]._dX ? rightActionList[i]._dX : 0)) * rightActionList[i].scale, rightActionList[i].getPositionY());
            rightActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, rightActionList[i].hidePosition)));
        }

        for (var i = 0; i < leftActionList.length; i++) {
            leftActionList[i].truePosition = leftActionList[i].getPosition();
            leftActionList[i].hidePosition = cc.p((- leftActionList[i].width / 2 - Math.abs(leftActionList[i].getAnchorPoint().x - 0.5) * leftActionList[i].width - (leftActionList[i]._dX ? leftActionList[i]._dX : 0)) * leftActionList[i].scale, leftActionList[i].getPositionY());
            leftActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1, leftActionList[i].hidePosition)));
        }
        this.runAction(cc.sequence(cc.delayTime(actionTime1), cc.callFunc(function () {
            var intoType = 1;
            if (MjClient.GoldHallLayer) {
                intoType = 0;
                MjClient.GoldHallLayer.removeFromParent(true);
            }
            var goldHallLayer = new GoldHallLayer(intoType);
            that.goldHallLayer = goldHallLayer;
            that.addChild(goldHallLayer);

        }.bind(this))));
    },
    setPanel: function (leftPanel) {
        var that = this;
        var gamePanel = leftPanel || this._gamePanelLeftNode;

        this.saveActionPosition();

        // 创建房间相关
        this._createRoom = gamePanel.getChildByName("createRoom");
        this._createRoom.setZoomScale(0.05);

        this._createRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Chuangjianfangjian", { uid: SelfUid() });
                    updateUserBehavior("创建房间");
                    if (!MjClient.data.sData) {
                        postEvent("createRoom", {});
                    } else {
                        MjClient.showMsg("房间已经创建,请直接加入房间。");
                    }
                    break;
                default:
                    break;
            }
        }, this);

        // 加入房间相关
        this._joinRoom = gamePanel.getChildByName("joinRoom");
        this._joinRoom.setZoomScale(0.05);
        this._joinRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.Scene.addChild(new EnterRoomLayer());
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jiarufangjian", { uid: SelfUid() });
                    updateUserBehavior("加入房间");
                    break;
                default:
                    break;
            }
        }, this);


        // 娱乐场相关
        this._playGroundRoom = gamePanel.getChildByName("playGroundRoom");
        this._playGroundRoom.setVisible(MjClient.systemConfig.matchRoomEnable === "true");
        this._playGroundRoom.setZoomScale(0.05);

        UIEventBind(this.jsBind, this._playGroundRoom, "goldfieldchange", function () {
            if (cc.sys.isObjectValid(MjClient.GoldHallLayer)) {
                return;
            }
            if (!MjClient._GOLD_FIELD || MjClient._GOLD_FIELD.length === 0) {
                MjClient.showToast("金币场暂未开放");
                that.showNomalHome();
                return;
            }
            that.doHideAction();
        });

        goldField_updateListener(this._playGroundRoom);

        this._playGroundRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jinbichang", { uid: SelfUid() });
                    updateUserBehavior("娱乐场");
                    that.showJinbiView();
                    break;
                default:
                    break;
            }
        }, this);


        // 亲友圈相关
        this._clubRoom = gamePanel.getChildByName("clubRoom");
        this._clubRoom.setZoomScale(0.05); MjClient.native.GetPackageName()
        this._clubRoom.setVisible(MjClient.systemConfig.clubEnable === "true");

        this._clubRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.Scene.addChild(new FriendCard_main(null, 1));
                    updateUserBehavior("亲友圈");
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Qinyouquan", { uid: SelfUid() });
                    break;
                default:
                    break;
            }
        }, this);
    },
    setGameType: function (type) {
        if (this._gonggao && MjClient.systemConfig.rankEnable == "true")
            this._gonggao.visible = false;

        this._gamePanelNode.visible = true;
        MjClient.gameClass = type;

        // this._joinRoom.loadTextureNormal(JoinRoomBtn[MjClient.gameClass]);
        // this._createRoom.loadTextureNormal(CreateRoomBtn[MjClient.gameClass]);

        if (MjClient.gameClass == MjClient.GAME_CLASS.PAO_DE_KUAI ||
            MjClient.gameClass == MjClient.GAME_CLASS.DOU_DI_ZHU ||
            MjClient.gameClass == MjClient.GAME_CLASS.TUAN_TUAN_ZHUAN) {
            this._joinRoom.loadTextureNormal("game_picture/jion_nantonh.png");
        }
        else {
            this._joinRoom.loadTextureNormal("game_picture/jion.png");
        }

        this._createRoom.loadTextureNormal("game_picture/chuangjian.png");



        // var gameClassList = JSON.parse(MjClient.systemConfig.gameClass);
        // if (gameClassList.length > 1) {
        //     this._tileIcon.loadTexture(GameClassTitleIcon[MjClient.gameClass]);
        // }
        // else {
        //     this._tileIcon.loadTexture("game_picture/logo_home.png");
        // }
        if (MjClient.systemConfig.rankEnable === "true") this.gameRankLayer();
    },
    updateYoujianCount: function () {
        var _sprite = this._youjian.getChildByName("hongDian");
        var _num = _sprite.getChildByName("Text");
        _num.ignoreContentAdaptWithSize(true);
        UIEventBind(null, _sprite, "refresh_mail_list", function () {
            if (MjClient.emailData) {
                var count = MjClient.emailData.length;

                for (var i = 0; i < MjClient.emailData.length; i++) {
                    if (MjClient.emailData[i].type == 1 || MjClient.emailData[i].type == 3) {
                        count--;
                    }
                }
                if (count > 0) {
                    _sprite.setVisible(true);
                    _num.setString(count);
                }
                else {
                    _sprite.setVisible(false);
                }
            }
        });
    },

    /**************
        bagan 排行榜
     *************/
    gameRankLayer: function () {
        // var parentNode = this._rank_bg;
        // this._ListViewQueShen = parentNode.getChildByName("ListView_queshen");
        // this._ListViewQueShen.removeAllChildren();
        // this._ListViewTuHao = parentNode.getChildByName("ListView_tuhao");
        // this._ListViewTuHao.removeAllChildren();
        //
        // this._cell_queshen = parentNode.getChildByName("cell_queshen");
        // this._cell_queshen.visible = false;
        // this._textDesc = parentNode.getChildByName("Text_30");
        // this._textDesc.ignoreContentAdaptWithSize(true);
        //
        // var that = this;
        // var _btnTip = parentNode.getChildByName("shang_xuanxiang_2").getChildByName("Image_7");
        // this.myNode = parentNode.getChildByName("selfCell");
        //
        // that._btnQueShen = parentNode.getChildByName("queshen");
        // that._btnQueShen.setTouchEnabled(true);
        //
        // //
        // // this._btnTipIcon  =  parentNode.getChildByName("queshen");
        // cc.log("MjClient.gameClass = " + MjClient.gameClass);
        // switch (MjClient.gameClass) {
        //     case MjClient.GAME_CLASS.MA_JIANG:
        //     case MjClient.GAME_CLASS.CHANG_PAI:
        //         that._btnQueShen.loadTexture("gameRank/queshenbang.png");
        //         break;
        //     case MjClient.GAME_CLASS.NIU_NIU:
        //         break;
        //     case MjClient.GAME_CLASS.GUAN_DAN:
        //         that._btnQueShen.loadTexture("gameRank/guanDanWang.png");
        //         break;
        //     case MjClient.GAME_CLASS.PAO_HU_ZI:
        //         break;
        //     case MjClient.GAME_CLASS.PAO_DE_KUAI:
        //         that._btnQueShen.loadTexture("gameRank/kuaipaoWang.png");
        //         break;
        // }
        //
        // function queShenEventCallBack(sender, type) {
        //     if (type == 2) {
        //         var childrenCount = that._ListViewQueShen.getItems().length;
        //         if (childrenCount == 0) {
        //             switch (MjClient.gameClass) {
        //                 case MjClient.GAME_CLASS.MA_JIANG:
        //                 case MjClient.GAME_CLASS.CHANG_PAI:
        //                     that.reqQueShenSeverData();
        //                     break;
        //                 case MjClient.GAME_CLASS.NIU_NIU:
        //                     break;
        //                 case MjClient.GAME_CLASS.GUAN_DAN:
        //                     that.reqGuanDanSeverData();
        //                     break;
        //                 case MjClient.GAME_CLASS.PAO_HU_ZI:
        //                     break;
        //                 case MjClient.GAME_CLASS.PAO_DE_KUAI:
        //                     that.reqPaoDeKuaiSeverData();
        //                     break;
        //             }
        //         }
        //         _btnTip.setPosition(277.32, 27.21);
        //         that._ListViewQueShen.visible = true;
        //         that._ListViewTuHao.visible = false;
        //         that._textDesc.setString("昨日胜局数前十名排行榜,每日24点更新");
        //         if (that._myQueShenData) {
        //             that.initSelfInfo(that._myQueShenData);
        //         }
        //     }
        // }
        //
        // that._btnQueShen.addTouchEventListener(queShenEventCallBack, this);
        //
        // that._btnTuHao = parentNode.getChildByName("tuhao");
        // that._btnTuHao.setTouchEnabled(true);
        // switch (MjClient.gameClass) {
        //     case MjClient.GAME_CLASS.MA_JIANG:
        //     case MjClient.GAME_CLASS.CHANG_PAI:
        //     case MjClient.GAME_CLASS.GUAN_DAN:
        //     case MjClient.GAME_CLASS.PAO_HU_ZI:
        //     case MjClient.GAME_CLASS.NIU_NIU:
        //         that._btnTuHao.loadTexture("gameRank/tuhaobang.png");
        //         break;
        //     case MjClient.GAME_CLASS.PAO_DE_KUAI:
        //         that._btnTuHao.loadTexture("gameRank/guanDanWang.png");
        //         break;
        // }
        //
        //
        //
        // function fuHaoEventCallBack(sender, type) {
        //     if (type == 2) {
        //         var childrenCount = that._ListViewTuHao.getItems().length;
        //         if (childrenCount == 0) {
        //             switch (MjClient.gameClass) {
        //                 case MjClient.GAME_CLASS.MA_JIANG:
        //                 case MjClient.GAME_CLASS.NIU_NIU:
        //                 case MjClient.GAME_CLASS.GUAN_DAN:
        //                     that.reqFuHaoSeverData();
        //                     that._textDesc.setString("昨日充值前十名排行榜,每日24点更新");
        //                     break;
        //                 case MjClient.GAME_CLASS.PAO_DE_KUAI:
        //                     that.reqGuanDanSeverData();
        //                     that._textDesc.setString("昨日胜局数前十名排行榜,每日24点更新");
        //                     break;
        //             }
        //         }
        //         _btnTip.setPosition(100.94, 27.21);
        //         that._ListViewQueShen.visible = false;
        //         that._ListViewTuHao.visible = true;
        //         if (that._myFuHaoData) {
        //             that.initSelfInfo(that._myFuHaoData);
        //         }
        //     }
        // }
        // that._btnTuHao.addTouchEventListener(fuHaoEventCallBack, this);
        //
        // // this._queshenList = _back.getChildByName("ListView");
        // // this._zijiNode = _back.getChildByName("Image_ziji");
        //
        // //初始化，土豪排行榜,去掉富豪榜，跑得快的富豪榜是掼蛋王
        // if (MjClient.gameClass == MjClient.GAME_CLASS.PAO_DE_KUAI) {
        //     that._btnTuHao.visible = true;
        //     that._btnTuHao.setTouchEnabled(true);
        //     that._btnQueShen.setTouchEnabled(true);
        //     that._btnTuHao.setUserData(1);
        //     //_btnTip.ignoreContentAdaptWithSize(true);
        //     _btnTip.setAnchorPoint(0.5, 0.5);
        //     _btnTip.setPosition(277.32, 27.21);
        //     _btnTip.setContentSize(187.00, 44.00);
        //     //_btnTip.loadTexture("rank/shang_anniu.png");
        //     that._btnQueShen.x = 295;
        //     fuHaoEventCallBack(that._btnTuHao, 2);
        // }
        // else {
        //
        //     queShenEventCallBack(that._btnQueShen, 2);
        //     that._btnQueShen.setTouchEnabled(false);
        //     that._btnTuHao.setTouchEnabled(false);
        //     that._btnTuHao.setUserData(0);
        //     that._btnTuHao.visible = false;
        //
        //     _btnTip.setAnchorPoint(0.5, 0.5);
        //     _btnTip.setPosition(189, 27.21);
        //     //_btnTip.loadTexture("rank/kuangchang.png");
        //     //_btnTip.ignoreContentAdaptWithSize(true);
        //     _btnTip.setContentSize(365.00, 44.00);
        //     that._btnQueShen.x = 214;
        // }
        //

    },

    //雀神榜
    reqQueShenSeverData: function () {
        // var that = this;
        // that._btnQueShen.setTouchEnabled(false);
        // MjClient.gamenet.request("pkplayer.handler.rankListMJ", { index: 1, pageNum: 10 },
        //     function (rtn) {
        //         if (that._btnQueShen.getUserData()) {
        //             that._btnQueShen.setTouchEnabled(true);
        //         }
        //
        //         if (rtn.code == 0) {
        //             that.rspQueShen(rtn.data);
        //         }
        //     }
        // );
    },
    rspQueShen: function (data) {
        // //保存自己的数据
        // this._myQueShenData = { myRank: data.mine_today_rank, winCount: data.mine_win_count + "局", QueShenCount: (data.mine_number > 0 ? "雀神次数×" + data.mine_number : "") };
        // var that = this;
        //
        // function _createQueShenOneCell(oneData) {
        //     var copyNode = that._cell_queshen.clone();
        //     copyNode.visible = true;
        //     copyNode.setTouchEnabled(true);
        //     copyNode.addTouchEventListener(function (sender, Type) {
        //         if (Type == 2) {
        //             MjClient.showPlayerInfo(oneData, false, false);
        //         }
        //     });
        //     var headicon = copyNode.getChildByName("nobody");
        //     var url = oneData.headimgurl;
        //     if (!url) url = "A_Common/default_headpic.png";
        //     cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        //         if (!err && texture&&cc.sys.isObjectValid(headicon)) {
        //             var headSprite = new cc.Sprite(texture);
        //             headSprite.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //             headSprite.setScale((headicon.getContentSize().width - 8) / headSprite.getContentSize().width);
        //             headicon.addChild(headSprite);
        //         }
        //     });
        //
        //     var _rankText = copyNode.getChildByName("Text_rank");
        //     _rankText.visible = false;
        //     _rankText.ignoreContentAdaptWithSize(true);
        //
        //     var _rankImage = copyNode.getChildByName("image_rank");
        //     _rankImage.visible = false;
        //     var _pathIcon = "gameRank/"
        //     var rank = oneData.rank;
        //
        //     if (rank == 1)
        //         copyNode.loadTexture("gameRank/DK_diyiming.png");
        //
        //     if (rank >= 1 && rank <= 3) {
        // 	var imageArray = ["one.png", "two.png", "three.png"];
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + imageArray[rank - 1]);
        //
        //         var txk = new cc.Sprite("gameRank/txk_" + (rank - 1) + ".png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else {
        //         _rankText.visible = true;
        //         _rankText.setString("" + rank);
        //     }
        //
        //     var _Text_name = copyNode.getChildByName("Text_name");
        //     var _nameStr = unescape(oneData.nickname);
        //     _Text_name.setString(getNewName(_nameStr, 8));
        //
        //     var _winCount = copyNode.getChildByName("Text_winCount");
        //     _winCount.ignoreContentAdaptWithSize(true);
        //     _winCount.setString("");
        //     _winCount.setString(oneData.winCount + "局");
        //
        //     //雀神次数
        //     var _queCount = copyNode.getChildByName("Text_queshen");
        //     _queCount.ignoreContentAdaptWithSize(true);
        //     _queCount.setString("");
        //     if (oneData.number && oneData.number > 1) {
        //         _queCount.setString("雀神称号×" + oneData.number);
        //     }
        //
        //     return copyNode;
        // }
        //
        // var _rankList = data.list;
        // for (var i = 0; i < _rankList.length ; i++) {
        //     that._ListViewQueShen.pushBackCustomItem(_createQueShenOneCell(_rankList[i]));
        // }
        //
        // that.initSelfInfo(that._myQueShenData);
    },

    //富豪榜
    reqFuHaoSeverData: function () {
        // var that = this;
        // that._btnTuHao.setTouchEnabled(false);
        // MjClient.gamenet.request("pkplayer.handler.rankListRecharge", { index: 1, pageNum: 10 },
        //     function (rtn) {
        //         that._btnTuHao.setTouchEnabled(true);
        //         if (rtn.code == 0) {
        //
        //             that.rspFuHao(rtn.data);
        //         }
        //     }
        // );
    },
    rspFuHao: function (data) {
        // this._myFuHaoData = { myRank: data.mine_today_rank, winCount: data.mine_recharge + "元", QueShenCount: (data.mine_number > 0 ? "富豪次数×" + data.mine_number : "") };
        // var that = this;
        // function _createFuHaoOneCell(oneData) {
        //     var copyNode = that._cell_queshen.clone();
        //     copyNode.visible = true;
        //     copyNode.setTouchEnabled(true);
        //     copyNode.addTouchEventListener(function (sender, Type) {
        //         if (Type == 2) {
        //             MjClient.showPlayerInfo(oneData, false, false);
        //         }
        //     });
        //     var headicon = copyNode.getChildByName("nobody");
        //     var url = oneData.headimgurl;
        //     if (!url) url = "A_Common/default_headpic.png";
        //     cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        //         if (!err && texture&&cc.sys.isObjectValid(headicon)) {
        //             var headSprite = new cc.Sprite(texture);
        //             headSprite.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //             headSprite.setScale((headicon.getContentSize().width - 8) / headSprite.getContentSize().width);
        //             headicon.addChild(headSprite);
        //         }
        //     });
        //
        //     var _rankText = copyNode.getChildByName("Text_rank");
        //     _rankText.visible = false;
        //     _rankText.ignoreContentAdaptWithSize(true);
        //
        //     var _rankImage = copyNode.getChildByName("image_rank");
        //     _rankImage.visible = false;
        //     var _pathIcon = "gameRank/"
        //     var rank = oneData.rank;
        //     if (rank == 1)
        //         copyNode.loadTexture("gameRank/DK_diyiming.png");
        //
        //     if (rank >= 1 && rank <= 3) {
        // 	var imageArray = ["one.png", "two.png", "three.png"];
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + imageArray[rank - 1]);
        //
        //
        //         var txk = new cc.Sprite("gameRank/txk_" + (rank - 1) + ".png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else {
        //         _rankText.visible = true;
        //         _rankText.setString("" + rank);
        //     }
        //
        //     var _Text_name = copyNode.getChildByName("Text_name");
        //     var _nameStr = unescape(oneData.nickname);
        //     _Text_name.setString(getNewName(_nameStr, 8));
        //
        //     var _winCount = copyNode.getChildByName("Text_winCount");
        //     _winCount.ignoreContentAdaptWithSize(true);
        //     _winCount.setString("0");
        //     _winCount.setString(oneData.recharge + "元");
        //
        //     //雀神次数
        //     var _queCount = copyNode.getChildByName("Text_queshen");
        //     _queCount.ignoreContentAdaptWithSize(true);
        //     _queCount.setString("");
        //     if (oneData.number && oneData.number > 1) {
        //         _queCount.setString("富豪称号×" + oneData.number);
        //     }
        //
        //     return copyNode;
        //
        // }
        //
        // var _rankList = data.list;
        // for (var i = 0; i < _rankList.length ; i++) {
        //     this._ListViewTuHao.pushBackCustomItem(_createFuHaoOneCell(_rankList[i]));
        // }
        //
        // this.initSelfInfo(this._myFuHaoData);
    },

    //掼蛋排行榜
    reqGuanDanSeverData: function () {
        // var that = this;
        // that._btnTuHao.setTouchEnabled(false);
        //
        // MjClient.gamenet.request("pkplayer.handler.rankListGD", { index: 1, pageNum: 10 },
        //     function (rtn) {
        //         that._btnTuHao.setTouchEnabled(true);
        //
        //         if (rtn.code == 0) {
        //
        //             that.rspGuanDan(rtn.data);
        //         }
        //         else {
        //
        //         }
        //     }
        // );
    },
    rspGuanDan: function (data) {
        // //保存自己的数据
        // this._myFuHaoData = { myRank: data.mine_today_rank, winCount: data.mine_win_count + "局", QueShenCount: (data.mine_number > 0 ? "掼蛋王次数×" + data.mine_number : "") };
        // var that = this;
        //
        // function _createQueShenOneCell(oneData) {
        //     var copyNode = that._cell_queshen.clone();
        //     copyNode.visible = true;
        //     copyNode.setTouchEnabled(true);
        //     copyNode.addTouchEventListener(function (sender, Type) {
        //         if (Type == 2) {
        //             MjClient.showPlayerInfo(oneData, false, false);
        //         }
        //     });
        //     var headicon = copyNode.getChildByName("nobody");
        //     var url = oneData.headimgurl;
        //     if (!url) url = "A_Common/default_headpic.png";
        //     cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        //         if (!err && texture&&cc.sys.isObjectValid(headicon)) {
        //             var headSprite = new cc.Sprite(texture);
        //             headSprite.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //             headSprite.setScale((headicon.getContentSize().width - 8) / headSprite.getContentSize().width);
        //             headicon.addChild(headSprite);
        //         }
        //     });
        //
        //     var _rankText = copyNode.getChildByName("Text_rank");
        //     _rankText.visible = false;
        //     _rankText.ignoreContentAdaptWithSize(true);
        //
        //     var _rankImage = copyNode.getChildByName("image_rank");
        //     _rankImage.visible = false;
        //     var _pathIcon = "gameRank/"
        //     var rank = oneData.rank;
        //     if (rank == 1) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "one.png");
        //         copyNode.loadTexture("gameRank/DK_diyiming.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_0.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else if (rank == 2) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "two.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_1.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else if (rank == 3) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "three.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_2.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else {
        //         _rankText.visible = true;
        //         _rankText.setString("" + rank);
        //     }
        //
        //
        //     var _Text_name = copyNode.getChildByName("Text_name");
        //     var _nameStr = unescape(oneData.nickname);
        //     _Text_name.setString(getNewName(_nameStr, 8));
        //
        //     var _winCount = copyNode.getChildByName("Text_winCount");
        //     _winCount.ignoreContentAdaptWithSize(true);
        //     _winCount.setString("");
        //     _winCount.setString(oneData.winCount + "局");
        //
        //     //雀神次数
        //     var _queCount = copyNode.getChildByName("Text_queshen");
        //     _queCount.ignoreContentAdaptWithSize(true);
        //     _queCount.setString("");
        //     if (oneData.number && oneData.number > 1) {
        //         _queCount.setString("掼蛋王×" + oneData.number);
        //     }
        //
        //
        //     return copyNode;
        // }
        //
        // var _rankList = data.list;
        // for (var i = 0; i < _rankList.length ; i++) {
        //     that._ListViewTuHao.pushBackCustomItem(_createQueShenOneCell(_rankList[i]));
        // }
        //
        // that.initSelfInfo(that._myFuHaoData);
    },

    //跑得快排行榜
    reqPaoDeKuaiSeverData: function () {
        // var that = this;
        // that._btnQueShen.setTouchEnabled(false);
        // MjClient.gamenet.request("pkplayer.handler.rankListPDK", { index: 1, pageNum: 10 },
        //     function (rtn) {
        //         that._btnQueShen.setTouchEnabled(true);
        //         if (rtn.code == 0) {
        //
        //             that.rspPaoDeKuai(rtn.data);
        //         }
        //         else {
        //
        //         }
        //     }
        // );
    },
    rspPaoDeKuai: function (data) {
        // //保存自己的数据
        // this._myQueShenData = { myRank: data.mine_today_rank, winCount: data.mine_win_count + "局", QueShenCount: (data.mine_number > 0 ? "快跑王次数×" + data.mine_number : "") };
        // var that = this;
        //
        // function _createQueShenOneCell(oneData) {
        //     var copyNode = that._cell_queshen.clone();
        //     copyNode.visible = true;
        //     copyNode.setTouchEnabled(true);
        //     copyNode.addTouchEventListener(function (sender, Type) {
        //         if (Type == 2) {
        //             MjClient.showPlayerInfo(oneData, false, false);
        //         }
        //     });
        //     var headicon = copyNode.getChildByName("nobody");
        //     var url = oneData.headimgurl;
        //     if (!url) url = "A_Common/default_headpic.png";
        //     cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        //         if (!err && texture&&cc.sys.isObjectValid(headicon)) {
        //             var headSprite = new cc.Sprite(texture);
        //             headSprite.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //             headSprite.setScale((headicon.getContentSize().width - 8) / headSprite.getContentSize().width);
        //             headicon.addChild(headSprite);
        //         }
        //     });
        //
        //     var _rankText = copyNode.getChildByName("Text_rank");
        //     _rankText.visible = false;
        //     _rankText.ignoreContentAdaptWithSize(true);
        //
        //     var _rankImage = copyNode.getChildByName("image_rank");
        //     _rankImage.visible = false;
        //     var _pathIcon = "gameRank/"
        //     var rank = oneData.rank;
        //     if (rank == 1) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "one.png");
        //         copyNode.loadTexture("gameRank/DK_diyiming.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_0.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else if (rank == 2) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "two.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_1.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else if (rank == 3) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "three.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_2.png");
        //         txk.setPosition(headicon.getContentSize().width / 2, headicon.getContentSize().height / 2);
        //         txk.setScale(headicon.getContentSize().width / txk.getContentSize().width);
        //         headicon.addChild(txk, 10);
        //     }
        //     else {
        //         _rankText.visible = true;
        //         _rankText.setString("" + rank);
        //     }
        //
        //     var _Text_name = copyNode.getChildByName("Text_name");
        //     var _nameStr = unescape(oneData.nickname);
        //     _Text_name.setString(getNewName(_nameStr, 8));
        //
        //     var _winCount = copyNode.getChildByName("Text_winCount");
        //     _winCount.ignoreContentAdaptWithSize(true);
        //     _winCount.setString("");
        //     _winCount.setString(oneData.winCount + "局");
        //
        //     //雀神次数
        //     var _queCount = copyNode.getChildByName("Text_queshen");
        //     _queCount.ignoreContentAdaptWithSize(true);
        //     _queCount.setString("");
        //     if (oneData.number && oneData.number > 1) {
        //         _queCount.setString("快跑王×" + oneData.number);
        //     }
        //
        //
        //     return copyNode;
        // }
        //
        // var _rankList = data.list;
        // for (var i = 0; i < _rankList.length ; i++) {
        //     that._ListViewQueShen.pushBackCustomItem(_createQueShenOneCell(_rankList[i]));
        // }
        //
        // that.initSelfInfo(that._myQueShenData);
    },

    initSelfInfo: function (MyData) {
        // var zijiNode = this.myNode
        // var _myHead = zijiNode.getChildByName("nobody");
        // var url = SelfHeadInfo().url;
        // if (!url) url = "A_Common/default_headpic.png";
        // cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        //     if (!err && texture&&cc.sys.isObjectValid(_myHead)) {
        //         var headSprite = new cc.Sprite(texture);
        //         headSprite.setPosition(_myHead.getContentSize().width / 2, _myHead.getContentSize().height / 2);
        //         headSprite.setScale((_myHead.getContentSize().width - 8) / headSprite.getContentSize().width);
        //         _myHead.addChild(headSprite);
        //     }
        // });
        //
        // function _getName() {
        //     var pinfo = MjClient.data.pinfo;
        //     return unescape(pinfo.nickname );
        // }
        //
        // var _name = zijiNode.getChildByName("Text_name");
        // _name.setString(getNewName(_getName(), 7));
        //
        // var _rankText = zijiNode.getChildByName("Text_rank");
        // _rankText.ignoreContentAdaptWithSize(true);
        // _rankText.visible = false;
        //
        // //我的今日排名
        // var _rankImage = zijiNode.getChildByName("image_rank");
        // _rankImage.visible = false;
        // var _pathIcon = "gameRank/";
        // var rank = MyData.myRank;//我的排名
        // if (rank) {
        //     if (rank == 1) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "one.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_0.png");
        //         txk.setPosition(_myHead.getContentSize().width / 2, _myHead.getContentSize().height / 2);
        //         txk.setScale(_myHead.getContentSize().width / txk.getContentSize().width);
        //         _myHead.addChild(txk, 10);
        //     }
        //     else if (rank == 2) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "two.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_1.png");
        //         txk.setPosition(_myHead.getContentSize().width / 2, _myHead.getContentSize().height / 2);
        //         txk.setScale(_myHead.getContentSize().width / txk.getContentSize().width);
        //         _myHead.addChild(txk, 10);
        //     }
        //     else if (rank == 3) {
        //         _rankImage.visible = true;
        //         _rankImage.loadTexture(_pathIcon + "three.png");
        //
        //         var txk = new cc.Sprite("gameRank/txk_2.png");
        //         txk.setPosition(_myHead.getContentSize().width / 2, _myHead.getContentSize().height / 2);
        //         txk.setScale(_myHead.getContentSize().width / txk.getContentSize().width);
        //         _myHead.addChild(txk, 10);
        //     }
        //     else {
        //         _rankText.visible = true;
        //         _rankText.setString("" + rank);
        //     }
        // }
        // else {
        //     _rankText.visible = true;
        //     _rankText.setString("无");
        // }
        //
        // //我的胜利场次
        // var _text_winCount = zijiNode.getChildByName("Text_winCount");
        // _text_winCount.ignoreContentAdaptWithSize(true);
        // _text_winCount.setString(MyData.winCount);
        //
        // //我的胜利场次
        // var _Text_queshen = zijiNode.getChildByName("Text_queshen");
        // _Text_queshen.ignoreContentAdaptWithSize(true);
        // _Text_queshen.setString(MyData.QueShenCount);
    },

    /****************
        end of 排行榜
    *****************/

    /*
    显示广告小图标  by sking 2018.4.19
    */
    getAdvShow: function () {
        cc.spriteFrameCache.addSpriteFrames("png/adv/menghuan.plist", "png/adv/menghuan.png");
        var _path = "png/adv/pic_";
        var _image = new ccui.ImageView();
        _image.loadTexture("png/adv/menghuan_bg.png");
        _image.setTouchEnabled(true);
        _image.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Guanggaowei", { uid: SelfUid() });
                //todo...跳转地址
                //cc.log("======================show adv url = " + MjClient.systemConfig.showAdvUrl);
                if (MjClient.systemConfig.showOtherGameUrl) {
                    MjClient.native.OpenUrl(MjClient.systemConfig.showOtherGameUrl);
                }
                else {
                    cc.log("======================show adv url = " + MjClient.systemConfig.showOtherGameUrl);
                }
            }
        }, _image);


        var frames = [];
        var prefix = "menghuan_";
        var fc = cc.spriteFrameCache;
        for (var i = 0; i < 8; i++) {
            var name = prefix + i + ".png";
            var f = fc.getSpriteFrame(name);
            if (f) {
                frames.push(f);
            }
        }
        var firstFrame = new cc.Sprite("#menghuan_0.png");
        var animate = cc.sequence(cc.animate(new cc.Animation(frames, 0.08, 1)), cc.delayTime(3));
        firstFrame.runAction(animate.repeatForever());
        firstFrame.setPosition(_image.getContentSize().width / 2, _image.getContentSize().height / 6);
        _image.addChild(firstFrame);
        return _image;
    }


});