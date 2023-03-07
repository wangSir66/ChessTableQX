 // ------七星岳阳棋牌 home--------

var HomeView_qxyyqp = cc.Layer.extend({
    _btnKaiFangGift: null,
    _btnChangCiGift: null,
    _gameListPanelNode: null,
    _gamePanelNode: null,
    _joinRoom: null,
    _createRoom: null,
    _BtnRuturn: null,
    _tileIcon: null,
    _myFuHaoData: null,
    _myQueShenData: null,
    _jueSeNode: null,
    _matchBtn:null,
    _yuepaiBtn:null,
    ctor: function () {
        this._super();
        var homeui = ccs.load(res.Home_json);
        this.uiNode = homeui.node;
        //BindUiAndLogic(homeui.node,this.jsBind);
        this.addChild(homeui.node);
        MjClient.homeui = this;
        playMusic("bgMain");
        setMusicVolume(-1);

        UIEventBind(this.jsBind, homeui.node, "logout", function () {
            if (MjClient.homeui) {
                MjClient.homeui.removeFromParent(true);
                delete MjClient.homeui;
            }
        });

        var _back = homeui.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);

        //飞鸟
        var _flyNode = _back.getChildByName("Panel_flyBire");
        setWgtLayout(_flyNode, [0.06, 0.06], [0.65, 0.9], [0, 0], false,true);
        var path = "hall/homeEffect/birdfly";
        var skyfly = COMMON_UI.creatFrameAni(path,"daniao_",198);
        _flyNode.addChild(skyfly);

        // 烟花（帧动画）
        // var _flyNode = _back.getChildByName("Panel_flyBire");
        // setWgtLayout(_flyNode, [0.08, 0.08], [0.5, 0.9], [0, 0], false,true);
        // var path = "hall/homeEffect/fireFlower";
        // var yanhua = COMMON_UI.creatFrameAni(path, "firework_", 25);
        // _flyNode.addChild(yanhua);

        /*
        // 烟花（粒子动画）
        var starParticle_yanhua =  new cc.ParticleSystem("hall/homeEffect/particle_texture.plist");
        starParticle_yanhua.setPosition(_back.getContentSize().width/2, _back.getContentSize().height*5/6);
        // starParticle_yanhua.setScale(1);
        // starParticle_yanhua.setTotalParticles(10);
        _back.addChild(starParticle_yanhua);
        */

        // //一群蝴蝶
        // var _buterflysNode = _back.getChildByName("Panel_buterflys");
        // setWgtLayout(_buterflysNode, [0.05, 0.05], [0.98, 0.5], [0, 0], false,true);
        // var path = "hall/homeEffect/buterflys";
        // var butterflys = COMMON_UI.creatFrameAni(path,"huidie_",32);
        // _buterflysNode.addChild(butterflys);

        //人物
        // var _roleNode = _back.getChildByName("Panel_role");
        // this._roleNode = _roleNode;
        // var posX = isIPhoneX() ? 0.42 : 0.40;
        // setWgtLayout(_roleNode, [0.25, 0.25], [posX, 0], [0, 0], false,true);
        // var roleAni = createSpine("spine/home/renwu/ren.json", "spine/home/renwu/ren.atlas");
        // roleAni.setAnimation(0, 'animation', true);
        // roleAni.setPosition(-160,-500);
        // roleAni.setScale(1);
        // roleAni.setTimeScale(0.7);
        // _roleNode.addChild(roleAni,100);

        //底部功能按钮
        var _bottom_bg = _back.getChildByName("bottom_bg");
        this._bottom_bg = _bottom_bg;
        _bottom_bg.setAnchorPoint(0.5,0);
        setWgtLayout(_bottom_bg, [1, 1], [0.5, 0], [0, 0], false,true);

        var _bottomHigh = _bottom_bg.getContentSize().height;
        var _Image_women = _back.getChildByName("Image_women");
        _Image_women.setPositionY(_bottomHigh*0.98);

        //樱花
        var starParticle1 =  new cc.ParticleSystem("Particle/particle_texture.plist");
        starParticle1.setPosition(-20, _back.getContentSize().height+10);
        starParticle1.setScale(2);
        starParticle1.setTotalParticles(8);
        _back.addChild(starParticle1,0);


        //活动伸缩按钮
        var _btnActive = _bottom_bg.getChildByName("Btn_Active");
        // _Image_light.visible = true;

        function _btnActiveTouchEvent(sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Activity", {uid:SelfUid()});
                    updateUserBehavior("活动");
                    if (MjClient.systemConfig && MjClient.systemConfig.activity)
                    {
                        cc.log("-----------0000------suisuisi....................");
                        var layer = new activityLayer();
                        MjClient.Scene.addChild(layer);
                    }
                    break;
                default:
                    break;
            }
        }

        _btnActive.addTouchEventListener(_btnActiveTouchEvent, this);

        //设置
        var _setting = homeui.node.getChildByName("setting");
        //setWgtLayout(_setting, [0.06, 0.13], [1, 1.02], [-0.6, -0.8]);
        _setting.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var settringLayer = new HomeSettingView_yueyang();                    
                    settringLayer.setName("HomeClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi", {uid:SelfUid()});
                    updateUserBehavior("设置");
                    break;
                default:
                    break;
            }
        }, this);

        //不用切换新旧皮肤
         var switchSkin = homeui.node.getChildByName("switchSkin");
        switchSkin.visible = false;
        // switchSkin.addTouchEventListener(function(sender, Type) {
        //     if (Type != ccui.Widget.TOUCH_ENDED)
        //         return;
        //
        //     MjClient.setSkinToServer(2, function() {
        //         if (MjClient.homeui && cc.sys.isObjectValid(MjClient.homeui)) {
        //             MjClient.homeui.removeFromParent(true);
        //             MjClient.homeui = null;
        //             MjClient.addHomeView();
        //         }
        //         MjClient.switch_skinFresh();
        //     });
        // });

        //右上角的客服按钮
        var _BtnKeFu = _bottom_bg.getChildByName("BtnKeFu");
        _BtnKeFu.visible = true;
        var _BtnKeFu_HongDian = _BtnKeFu.getChildByName("hongDian");
        if(_BtnKeFu_HongDian){
            _BtnKeFu_HongDian.setVisible(false);
            UIEventBind(null, _BtnKeFu, "QiYuUnreadCount", function(data) {
                if(data.count) {
                    _BtnKeFu_HongDian.setVisible(true);
                    _BtnKeFu_HongDian.getChildByName("Text").setString(data.count);
                }else {
                    _BtnKeFu_HongDian.setVisible(false);
                }
            });
        }
        _BtnKeFu.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Kefu", {uid:SelfUid()});
                    updateUserBehavior("客服");
                    if (!isCurrentNativeVersionBiggerThan("14.0.0"))
                    {
                        MjClient.gamenet.request("pkplayer.handler.openBrowser", { type: 9 }, function (rtn) {
                            if (rtn.code == 0) {
                                MjClient.Scene.addChild(new NormalWebviewLayer(rtn.data));
                            }
                            else {
                                if (rtn.message) {
                                    MjClient.showToast(rtn.message);
                                }
                                else {
                                    MjClient.showToast("获取数据失败");
                                }
                            }
                        });
                    }
                    else
                    {
                        MjClient.native.showQiYuChatDialog();
                    }
                    break;
                default:
                    break;
            }
        }, this);



        //右上角的帮助按钮,
        var _BtnHTP = homeui.node.getChildByName("BtnHTP");
        _BtnHTP.visible = true;
        _BtnHTP.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.openWeb({ url: null, help: true });
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Wanfa", {uid:SelfUid()});
                    updateUserBehavior("玩法");
                    break;
                default:
                    break;
            }
        }, this);

        //战绩
        var _zhanji = _bottom_bg.getChildByName("zhanji");
        _zhanji.visible = true;
        _zhanji.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    updateUserBehavior("战绩");
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Zhanji", {uid:SelfUid()});
                    //MjClient.showMsg("暂未开放!");
                    if (!MjClient.data.sData) {
                        MjClient.Scene.addChild(new PlayLogView());
                    }
                    else MjClient.showMsg("正在游戏中，不能查看战绩");
                    break;
                default:
                    break;
            }
        }, this);

        //邮件
        this._youjian = homeui.node.getChildByName("youjian");
        this._youjian.visible = true;
        this._youjian.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var emailLayer = new EmailLayer();
                    MjClient.Scene.addChild(emailLayer);
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_YoujianClick", {uid:SelfUid()});
                    updateUserBehavior("邮件");
                    break;
                default:
                    break;
            }
        }, this);
        this._youjian.getChildByName("hongDian").setVisible(false);
        this.updateYoujianCount();

        //亲友圈邀请审核
        var btnFriendcardInvite = homeui.node.getChildByName("btnFriendcardInvite");
        if (btnFriendcardInvite) {
            btnFriendcardInvite.visible = isAgent();
            setWgtLayout(btnFriendcardInvite, [0.06, 0.13], [0.0423,1.03], [0, -0.9]);
            btnFriendcardInvite.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        MjClient.Scene.addChild(new Friendcard_Invite_Shenhe());
                        break;
                    default:
                        break;
                }
            }, this);
            var hongDian = btnFriendcardInvite.getChildByName("hongDian");
            var Text = hongDian.getChildByName("Text");
            Text.ignoreContentAdaptWithSize(true);
            hongDian.visible = false;
            UIEventBind(null, btnFriendcardInvite, "refresh_inviteShenhe_num", function(data) {
                if (typeof(data.num) != "undefined") {
                    
                    if (data.num == 0) {
                        hongDian.visible = false;
                    }else{
                        hongDian.visible = true;
                        Text.setString(data.num);
                    }
                }
            });
        }


        //广告代理
        var _btnAdv = _bottom_bg.getChildByName("btnAdv");
        var daili_qipao = _btnAdv.getChildByName("daili_qipao");
        daili_qipao.runAction(cc.repeatForever(cc.sequence(
            cc.fadeIn(1),
            cc.repeat(cc.sequence(cc.moveBy(0.3, 0, 2), cc.moveBy(0.6, 0, -4), cc.moveBy(0.3, 0, 2)), 5),
            cc.fadeOut(1),
            cc.delayTime(0.5))));
        var Text_qipao = daili_qipao.getChildByName("Text_qipao");
        Text_qipao.setString("双11庆典！场次冲一冲，购物车清空！");
        daili_qipao.setVisible(false);
        // if(MjClient.systemConfig.dailiZixun && MjClient.systemConfig.dailiZixun.length > 0){
        //     daili_qipao.setVisible(true);
        //     Text_qipao.setString("申请代理，加我微信："+MjClient.systemConfig.dailiZixun);
        // }
        _btnAdv.visible = true;
        if (MjClient.remoteCfg.guestLogin == true||MjClient.isShenhe == true) {
            _btnAdv.visible = false;
            _btnAdv.setTouchEnabled(false);
        }
        var bAdvShow = true;
        // _btnAdv.schedule(function () {
        //     if (bAdvShow) {
        //         _btnAdv.loadTextureNormal("game_picture/btn_adv_normal.png");
        //         bAdvShow = false;
        //     }
        //     else {
        //         bAdvShow = true;
        //         _btnAdv.loadTextureNormal("game_picture/btn_adv_normal.png");
        //     }
        // }, 0.5);
        _btnAdv.addTouchEventListener(function (sender, Type) {

            var jumbFunc = function () {
                MjClient.gamenet.request("pkplayer.handler.openBrowser", { type: 1 }, function (rtn) {
                    if (rtn.code == 0) {
                        // MjClient.native.OpenUrl(rtn.data);
                        var layer = new DaiLiWebviewLayer(rtn.data);
                        if (layer.isInitSuccess())
                            MjClient.Scene.addChild(layer);
                    }
                    else {
                        if (rtn.message) {
                            MjClient.showToast(rtn.message);
                        }
                        else {
                            MjClient.showToast("获取数据失败");
                        }
                    }
                });
            };

            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Daili", {uid:SelfUid()});
                    updateUserBehavior("代理");
                    //是代理
                    if (isAgent()) {
                        jumbFunc();
                    }
                    else {
                        var layer = new BindingCodeLayer3();
                        MjClient.Scene.addChild(layer);
                    }

                    break;
                default:
                    break;
            }
        }, this);

        //游戏
        this._gamePanelNode = homeui.node.getChildByName("Panel_game");

        // //标题
        this._tileIcon = this._gamePanelNode.getChildByName("laba_bg");

        //排行榜
        var _btnRank = homeui.node.getChildByName("btnRank");
        var starParticle = new cc.ParticleSystem("game_picture/diamondStar.plist");
        starParticle.setPosition(_btnRank.getContentSize().width / 2, _btnRank.getContentSize().height / 2);
        _btnRank.addChild(starParticle);


        //更多游戏
        var _btnmoreGame = homeui.node.getChildByName("moreGame");

        //分享有礼
        var _btnShareGet = _bottom_bg.getChildByName("fenxiang");

        //推荐有礼
        var _btntuijian = _bottom_bg.getChildByName("tuijian");
        //_btntuijian.visible = false;// 暂时不用

        ////头像
        var _headbg = _back.getChildByName("headbg");

        var creatFrameAni = function(resPath,frameName,frameCount,dt,dealyTime)
        {
            dt = dt || 1;
            dealyTime = dealyTime || 0;
            cc.spriteFrameCache.addSpriteFrames(resPath + ".plist",resPath + ".png");
            var frames = [];
            var prefix = frameName; //"HDH000";
            var fc = cc.spriteFrameCache;
            var count = 0;
            for (var i = dt; count <  frameCount; i++) {
                var k = i%frameCount + 1;
                var name = prefix + k + ".png";
                var f = fc.getSpriteFrame(name);
                if(f)
                {
                    frames.push(f);
                }
                count++;
            }
            var firstFrame = new cc.Sprite("#" + frameName + "1.png");
            var ani = cc.animate(new cc.Animation(frames, 0.06, 1));
            var animate = cc.sequence(ani.repeat(3),cc.delayTime(dealyTime));
            firstFrame.runAction(animate.repeatForever());
            return firstFrame;
        }


        var path = "hall/homeEffect/headfly";
        var headButterfly = creatFrameAni(path,"zihudie_",9,1,2);
        headButterfly.setPosition(cc.p(-120,113.6));
        _headbg.addChild(headButterfly);

        // 返回
        //this._BtnRuturn = homeui.node.getChildByName("BtnRuturn");

        //商城
        var _BtnShop  = _bottom_bg.getChildByName("Button_store");

        //炮神榜
        //var _btnPao   = homeui.node.getChildByName("btnPao");


        //要新
        var _btnYaoXin = homeui.node.getChildByName("btnYaoXin");

        //红包背景
        var _btnHongBao_bg = homeui.node.getChildByName("btnHongBao_bg");

        //红包
        var _btnHongBao = homeui.node.getChildByName("btnHongBao");

        showHomeActivityIcon(homeui); 

    

        //咨询按钮
        var btn_zixun = homeui.node.getChildByName("btnZiXun");
        if (btn_zixun)
        {
            btn_zixun.setVisible(false);
            if (MjClient.remoteCfg.guestLogin === true) btn_zixun.setVisible(false);
            btn_zixun.addTouchEventListener(function (sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
					MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Gonggao", {uid:SelfUid()});
                    MjClient.Scene.addChild(new HomeZiXunLayer());
                }
            },this)
        }

        //实名认证
        var btnRenzheng = homeui.node.getChildByName("btnRenzheng");
        if (!btnRenzheng) {
            btnRenzheng =  new ccui.Button("game_picture/activeBtn/renzheng.png", "game_picture/activeBtn/renzheng_s.png","game_picture/activeBtn/renzheng_s.png");
            btnRenzheng.setName("btnRenzheng");
            btnRenzheng.addTouchEventListener(function (sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    MjClient.Scene.addChild(new shiMingRenZhengLayer());
                }
            },this)
            homeui.node.addChild(btnRenzheng);
        }
        btnRenzheng.visible = !MjClient.data.pinfo.identityNum;

        btnRenzheng.visible = false; ///by sking 暂时不用

        //var topBtns = [_setting, switchSkin, _BtnHTP, this._youjian, _btnAdv, btnRenzheng, btn_zixun];
        var topBtns = [_setting, _BtnHTP, this._youjian];
        for (var i = 0; i < topBtns.length; i ++) {
            setWgtLayout(topBtns[i], [0.05, 0.11], [1, 1.03], [-0.9 - 1.2*i , -0.9]);
        }
        //setWgtLayout(this._tileIcon, [0.4, 0.4], [0.65, 0.7], [0, 0],false,true);

        setWgtLayout(_btnmoreGame, [0.12, 0.12], [-0.5, -0.5], [0, 0.6]);
        //setWgtLayout(_btntuijian, [0.12, 0.12], [0.6, 0.025], [0, 0.0]);
        //setWgtLayout(_btnShareGet, [0.12, 0.12], [0.7, 0.025], [0, -0.03]);
        setWgtLayout(_headbg, [0.2, 0.2], [0.08, 0.99], [0, 0],false,true);
        //setWgtLayout(this._BtnRuturn, [0.065, 0.132], [0.08, 0.99], [0, -0.025]);

        //runLightEffectAction(_Image_light);//右边活动的光

        var _scroll = this._tileIcon.getChildByName("scroll");

        var _msg = _scroll.getChildByName("msg");
        var scrollDataArr = [];
        scrollDataArr.push(MjClient.remoteCfg.guestLogin ? "欢迎来到" + AppCnName[MjClient.getAppType()] : MjClient.systemConfig.homeScroll);
        homePageRunText(_msg,scrollDataArr);
        function getMsg() {
            var content = ""+MjClient.systemConfig.homeScroll;
            return MjClient.remoteCfg.guestLogin ? "欢迎来到" + AppCnName[MjClient.getAppType()] : content;
        }
        _msg.setString(getMsg());
        UIEventBind(null, _scroll, "userReportPush", function(scrollData) {
            if(scrollData.length > 0){
                var scrollDataNew = [];
                for(var i = 0; i < scrollData.length; i++){
                    scrollDataNew.push("经公司核实，"+unescape(scrollData[i].nickname)+"存在"+unescape(scrollData[i].type)+"等不良行为，已对该用户进行封号处理。")
                }
                homePageRunText(_msg,scrollDataNew);

            }
            _scroll.schedule(function () {
                homePageRunText(_msg,scrollDataArr);
            },600);
        });


        //排行榜
        if (MjClient.remoteCfg.guestLogin == true || MjClient.systemConfig.bisaiEnable != "true") {
            _btnRank.visible = false;
            _btnRank.setTouchEnabled(false);
        }
        _btnRank.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.Scene.addChild(new rankLayer());
                    break;
                default:
                    break;
            }
        }, this);

        if (MjClient.remoteCfg.guestLogin == true ||
            MjClient.systemConfig.moreGameEnable != "true" ||
            MjClient.isShenhe) {
            _btnmoreGame.visible = false;
            _btnmoreGame.setTouchEnabled(false);
        }
        _btnmoreGame.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    //更多游戏
                    MjClient.native.OpenUrl(MjClient.systemConfig.moreGameUrl);
                    break;
                default:
                    break;
            }
        }, this);

        if (MjClient.remoteCfg.guestLogin == true) {
            _btnShareGet.visible = false;
            _btnShareGet.setTouchEnabled(false);
        }

        _btnShareGet.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    {
                        var _sprite = _btnShareGet.getChildByName("hongDian");
                        MjClient.Scene.addChild(new shareTodayLayer(_sprite.visible));
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Share", {uid:SelfUid()});
                        updateUserBehavior("分享");
                    }
                    break;
                default:
                    break;
            }
        }, this);
        var _shareTip = _btnShareGet.getChildByName("fenxiang_tip");
        var _shareTipText = null;
        if (_shareTip) {
            _shareTipText = _shareTip.getChildByName("Text_4");
            _shareTipText.ignoreContentAdaptWithSize(true);
            _shareTipText.setString("100%中奖");
        }
        var checkShareTipFunc = function () {
            var lastStr = MjClient.data.pinfo.lastShareDay;
            var currentStr = MjClient.dateFormat(new Date(), "yyyyMMdd");
            var _sprite = _btnShareGet.getChildByName("hongDian");


            if (currentStr <= lastStr) {
                _sprite.visible = false;
            }else{
                _sprite.visible = true;
            }
            if (_sprite && _shareTip)
                _shareTip.visible = _sprite.visible;

        }
        checkShareTipFunc();
        _btnShareGet.schedule(checkShareTipFunc, 1);

        if (_shareTip) {
            if (_btnActive)
                _btnShareGet.setZOrder(_btnActive.getZOrder() + 1);
            _shareTip.setOpacity(0);
            _shareTip.runAction(cc.repeatForever(cc.sequence(
                cc.fadeIn(1),
                cc.repeat(cc.sequence(cc.moveBy(0.3, 0, 2), cc.moveBy(0.6, 0, -4), cc.moveBy(0.3, 0, 2)), 5),
                cc.fadeOut(1),
                cc.delayTime(0.5))));
        }

        if (MjClient.remoteCfg.guestLogin == true) {
            _btntuijian.visible = false;
            _btntuijian.setTouchEnabled(false);
        }

        _btntuijian.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
					MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Invite", {uid:SelfUid()});
                    updateUserBehavior("邀请下载");
                    var layer = new recommendLayer_active();
                    MjClient.Scene.addChild(layer);
                    break;
                default:
                    break;
            }
        }, this);

        var selfHead = SelfHeadInfo();
        MjClient.loadWxHead(selfHead.uid, selfHead.url);

        ////房卡
        //var _fangKa = _headbg.getChildByName("fangKa");
        //_fangKa.visible = true;

        var _head = _headbg.getChildByName("head");
        this._headNode = _head;
        UIEventBind(this.jsBind, _head, "loadWxHead", function (d) {
            if (d.uid == MjClient.data.pinfo.uid) {
                // var sp = new cc.Sprite(d.img);
                // this.addChild(sp);
                // setWgtLayout(sp, [0.93, 0.93], [0.5, 0.5], [0, 0], false, true);

                // var clippingNode = new cc.ClippingNode();
                // var mask = new cc.Sprite("hall/headMask.png");
                // clippingNode.setAlphaThreshold(0);
                // clippingNode.setStencil(mask);
                // var img = new cc.Sprite(d.img);
                // img.setScale(mask.getContentSize().width/img.getContentSize().width);
                // clippingNode.addChild(img);
                // clippingNode.setScale(0.999);

                // clippingNode.setPosition(_head.getContentSize().width/2,_head.getContentSize().height/2);

                // //遮罩框
                // _head.addChild(clippingNode);
                

                var img = new cc.Sprite(d.img);
                img.setScale(_head.getContentSize().width/img.getContentSize().width);
                img.setPosition(_head.getContentSize().width/2,_head.getContentSize().height/2);
                _head.addChild(img);

            }
        });

        _head.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.showPlayerInfoBind(MjClient.data.pinfo, true, true);
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Selfinformation_Touxiang", {uid:SelfUid()});
                    break;
                default:
                    break;
            }
        }, this);
        AddGuiZuHeadFrame_old(_headbg);
        //
        //昵称
        var _name = _head.getChildByName("name");
        function _getName() {
            var pinfo = MjClient.data.pinfo;
            return unescape(pinfo.nickname );
        }
        _name.setString(getNewName(_getName()));
        _name.ignoreContentAdaptWithSize(true);

        //ID
        var _uid = _head.getChildByName("uid");
        _uid.setString("ID:" + SelfUid());
        _uid.ignoreContentAdaptWithSize(true);
        if (MjClient.remoteCfg.hideMoney) {
            //_uid.y=45;
        }

        var arr = ["liquanNum", "liquan", "btn_add_liquan"];
        if(!MjClient.isOpentFunctionType(MjClient.FUNCTION_CONFIG_TYPE.JI_FEN_SHANG_CHENG) && cc.sys.isObjectValid(_head))
        {
            for(var i = 0; i < arr.length; i++)
            {
                _head.getChildByName(arr[i]).setVisible(false);
            }
        }


        var moneyNum = _head.getChildByName("moneyNum");
        moneyNum.ignoreContentAdaptWithSize(true);


        var liquanNum = _head.getChildByName("liquanNum");
        liquanNum.ignoreContentAdaptWithSize(true);

        var btn_addYB = _head.getChildByName("btn_add_money");
        var btn_addLQ = _head.getChildByName("btn_add_liquan");
        btn_addYB.addTouchEventListener(function(sender,type){
            if(type === 2){
				MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Selfinformation_Gold_Add", {uid:SelfUid()});
                this.changeMoney();
                MjClient.Scene.addChild(enter_store());
            }
        },this);
        btn_addLQ.addTouchEventListener(function(sender,type){
            if(type === 2){
				MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Selfinformation_Liquan_Add", {uid:SelfUid()});
                this.changeMoney();
                MjClient.Scene.addChild(new ShopOfJifen_layer());
            }
        },this);
        UIEventBind(this.jsBind, _head, "updateInfo", function () {
            var icurrentMoney = parseInt(moneyNum.preValue);
            var lastMoney = parseInt(MjClient.data.pinfo.money);
            var icurrentLiquan = parseInt(liquanNum.preValue);
            var lastLiquan = Number(MjClient.data.pinfo.integral);

            var starParticle = new cc.ParticleSystem("Particle/diamondtail.plist");
            starParticle.setPosition(moneyNum.getContentSize().width / 2, moneyNum.getContentSize().height / 2);

            if (lastMoney > icurrentMoney)
            {
                moneyNum.addChild(starParticle);
                moneyNum.runAction(cc.sequence(cc.scaleTo(1, 1.5).easing(cc.easeBackOut()), cc.scaleTo(0.3, 1)));
            }
            else if (lastLiquan > icurrentLiquan)
            {
                liquanNum.addChild(starParticle);
                liquanNum.runAction(cc.sequence(cc.scaleTo(1, 1.5).easing(cc.easeBackOut()), cc.scaleTo(0.3, 1)));
            }
            MjClient.homeui.changeMoney();
        });

        UIEventBind(this.jsBind, _head, "loginOK", function () {
            MjClient.homeui.changeMoney();
        });

        /*
         商店
         */
        //var _BtnShop = _headbg.getChildByName("Button_store");
        if (MjClient.remoteCfg.hideMoney == true||MjClient.isShenhe == true) {
            _BtnShop.visible = false;
            _BtnShop.setTouchEnabled(false);
        }
        _BtnShop.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var layer = enter_store();
                    MjClient.Scene.addChild(layer);
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shop", {uid:SelfUid()});
                    updateUserBehavior("商城");
                    break;
                default:
                    break;
            }
        }, this);



        //游戏列表
        //this._gameListPanelNode = homeui.node.getChildByName("Panel_GameList");
        //游戏
        this._gamePanelNode = homeui.node.getChildByName("Panel_game");
        //金币场
        this.setGamePanel(this._gamePanelNode);
        //this.setGameListPanel(this._gameListPanelNode);

        this.changeMoney();
        //比赛场
        this._matchBtn = homeui.node.getChildByName("matchBtn");
        if(isIPhoneX()){
            setWgtLayout(this._matchBtn, [0.35, 0.35], [0, 0.5], [0, 0]);
        }else {
            setWgtLayout(this._matchBtn, [0.35, 0.35], [-0.045, 0.5], [0, 0]);
        }
        this._matchBtn.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    //reallyPlayEffect("sound/home_click.mp3",false);
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_BisaichangClick", {uid:SelfUid()});
                    if (MjClient.systemConfig.matchRoomEnable == "true") {
                        MjClient.Scene.addChild(new playgroundLayer());
                    }
                    else {
                        MjClient.showToast("即将开放,敬请期待");
                    }
                    break;
                default:
                    break;
            }
        }, this);
        this._matchBtn.visible = false;
        //约牌
        this._yuepaiBtn = homeui.node.getChildByName("yuepaiBtn");
        this._yuepaiBtn.setVisible(false);
        if(isIPhoneX()){
            setWgtLayout(this._yuepaiBtn, [0.35, 0.35], [0, 0.5], [0, 0]);
        }else {
            setWgtLayout(this._yuepaiBtn, [0.35, 0.35], [-0.045, 0.5], [0, 0]);
        }
        this._yuepaiBtn.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    //reallyPlayEffect("sound/home_click.mp3",false);
                    this.showNomalHome();
                    break;
                default:
                    break;
            }
        }, this);

        //金币场回来显示金币场界面
        if (MjClient.data && MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId){
            
            if(MjClient.data.sData.tData.fieldType == 1){//快速赛回到快速赛大厅
                this.showQuickMatchHall();
            }else{//金币场大厅
                if(MjClient.GoldHallLayer){
                    MjClient.GoldHallLayer.removeFromParent(true);
                }
                var goldHallLayer = new GoldHallLayer();
                this.goldHallLayer = goldHallLayer;
                this.addChild(goldHallLayer);
                this.showJinbiView();
            }
        }

        return true;
    },
    //显示金币场大厅
    showGoldHall: function(intoType){
        if(MjClient.GoldHallLayer){
            MjClient.GoldHallLayer.removeFromParent(true);
        }

        var goldHallLayer = new GoldHallLayer();
        this.goldHallLayer = goldHallLayer;
        this.addChild(goldHallLayer);
        this.showJinbiView();
    },
    //显示金币场快速赛大厅
    showQuickMatchHall: function(){
        if(MjClient.goldMatchHallLayer){
            MjClient.goldMatchHallLayer = null;
            MjClient.goldMatchHallLayer.removeFromParent(true);
        }
        var goldMatchHallLayer = new GoldMatchHallLayer();
        this.goldMatchHallLayer = goldMatchHallLayer;
        this.addChild(goldMatchHallLayer);
        MjClient.goldfield_quick(true);
    },

    showNomalHome:function () {
        MjClient.homeui._matchBtn.setVisible(false);
        MjClient.homeui._yuepaiBtn.setVisible(false);
        MjClient.homeui._gamePanelNode.setVisible(true);
        this.changeMoney();
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    if (this._keyBackClickedTime && (new Date()).getTime() - this._keyBackClickedTime <= 1*1000)
                    {
                        delete this._keyBackClickedTime;
                        showExitGameLayer();
                    }
                    else
                    {
                        if (MjClient.exitLayer && cc.sys.isObjectValid(MjClient.exitLayer))
                        {
                            MjClient.exitLayer.removeFromParent();
                            MjClient.exitLayer = null;
                        }
                        else
                        {
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
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fenxiang_Jiaru_sure", {uid: SelfUid()});
                        MjClient.joinGame(parseInt(tableID));
                    }, function () { });
                    MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fenxiang_Jiaru", {uid: SelfUid()});
                }
                if (tableID.length == 8 && tableID != MjClient.myReplayCode) {
                    MjClient.showMsg("是否立即播放回放码为[" + tableID + "]的比赛？", function () {
                        MjClient.getOtherPlayLog(parseInt(tableID));
                    }, function () { });
                    MjClient.native.doCopyToPasteBoard("");//清空剪切板
                }
            }
        }, 1, cc.REPEAT_FOREVER, 1.5);
    },
    doShowAction:function () {

        var topActionList = this._topActionList || [];
        var bottomActionList = this._bottomActionList || [];
        var rightActionList = this._rightActionList || [];
        var leftActionList = this._leftActionList || [];

        var actionTime1 = 0.3;
        var actionTime2 = 0.1;
        for(var i = 0 ; i < topActionList.length; i ++){
            topActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,cc.p(topActionList[i].truePosition.x,topActionList[i].truePosition.y * 0.99)),cc.moveTo(actionTime2,topActionList[i].truePosition)));
        }

        for(var i = 0 ; i < bottomActionList.length; i ++){
            bottomActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,cc.p(bottomActionList[i].truePosition.x,bottomActionList[i].truePosition.y * 1.01)),cc.moveTo(actionTime2,bottomActionList[i].truePosition)));
        }

        for(var i = 0 ; i < rightActionList.length; i ++){
            rightActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,cc.p(rightActionList[i].truePosition.x * 0.95,rightActionList[i].truePosition.y)),cc.moveTo(actionTime2,rightActionList[i].truePosition)));
        }

        for(var i = 0 ; i < leftActionList.length; i ++){
            leftActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,cc.p(leftActionList[i].truePosition.x * 1.05,leftActionList[i].truePosition.y)),cc.moveTo(actionTime2,leftActionList[i].truePosition)));
        }
        this._isShowingGoldHall = false;
    },
    doHideAction:function () {
        if(this._isShowingGoldHall){
            return;
        }
        this._isShowingGoldHall = true;
        var that = this;
        var topActionList = [];
        topActionList.push(this.uiNode.getChildByName("youjian"));
        topActionList.push(this.uiNode.getChildByName("BtnHTP"));
        topActionList.push(this.uiNode.getChildByName("setting"))
        topActionList.push(this.uiNode.getChildByName("laba_bg"))
        //topActionList.push(this.uiNode.getChildByName("btnAdv"))

        //dX,dY是增加偏移
        var bottomActionList = [];
        this._bottom_bg._dY = this._bottom_bg.height * 0.2;
        bottomActionList.push(this._bottom_bg);

        var leftActionList = [];
        leftActionList.push(this._matchBtn);
        leftActionList.push(this._yuepaiBtn);

        // this._roleNode._dX = this._roleNode.width * 0.6;
        // leftActionList.push(this._roleNode);
        
        // 左边功能按钮
        // this._gamePanelNode.getChildByName("game_bg")._dX = this._gamePanelNode.getChildByName("game_bg").width * 2;
        // leftActionList.push(this._gamePanelNode.getChildByName("game_bg"));

        var rightActionList = [];
        // rightActionList.push(this._gamePanelNode);
        // 右边功能按钮
        this._gamePanelNode.getChildByName("adv_bg")._dX = this._gamePanelNode.getChildByName("adv_bg").width * 2;
        rightActionList.push(this._gamePanelNode.getChildByName("adv_bg"));

        //其余的通过计算估算动画
        var childrens = this.uiNode.getChildren();
        for(var i in childrens){
            if( topActionList.indexOf(childrens[i]) != -1||
                bottomActionList.indexOf(childrens[i]) != -1||
                leftActionList.indexOf(childrens[i]) != -1||
                rightActionList.indexOf(childrens[i])!= -1 ){
                continue;
            }
            if(childrens[i].name == "back" || childrens[i].name == "Panel_game"){
                continue;
            }
            var centerPoint = cc.p((childrens[i].x + (childrens[i].getAnchorPoint().x-0.5) * childrens[i].width),(childrens[i].y + (childrens[i].getAnchorPoint().y-0.5) * childrens[i].height));
            if(centerPoint.y >= MjClient.size.height * 0.9){
                //加到顶部
                topActionList.push(childrens[i]);
            }else if(centerPoint.y <= MjClient.size.height * 0.1){
                //加到底部
                bottomActionList.push(childrens[i]);
            }else if(centerPoint.x <= MjClient.size.width * 0.5){
                //加到左边
                leftActionList.push(childrens[i]);
            }else {
                //加到右边
                rightActionList.push(childrens[i]);
            }
        }
        this._topActionList = topActionList;
        this._bottomActionList = bottomActionList;
        this._rightActionList = rightActionList;
        this._leftActionList = leftActionList;


        var windowSize = {width: 1280, height: 720};
        windowSize.width = MjClient.size.width > windowSize.width ? MjClient.size.width : windowSize.width;
        windowSize.height = MjClient.size.height > windowSize.height ? MjClient.size.height : windowSize.height;
        
        var actionTime1 = 0.3;
        var actionTime2 = 0.1;
        for(var i = 0 ; i < topActionList.length; i ++){
            topActionList[i].truePosition = topActionList[i].getPosition();
            topActionList[i].hidePosition = cc.p(topActionList[i].getPositionX(),windowSize.height + (topActionList[i].height/2 + Math.abs( 0.5-topActionList[i].getAnchorPoint().y) * topActionList[i].height+(topActionList[i]._dY?topActionList[i]._dY:0))*topActionList[i].scale);
            topActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,topActionList[i].hidePosition)));
        }

        for(var i = 0 ; i < bottomActionList.length; i ++){
            bottomActionList[i].truePosition = bottomActionList[i].getPosition();
            bottomActionList[i].hidePosition = cc.p(bottomActionList[i].getPositionX(),(- bottomActionList[i].height/2 - Math.abs( bottomActionList[i].getAnchorPoint().y-0.5) * bottomActionList[i].height-(bottomActionList[i]._dY?bottomActionList[i]._dY:0))*bottomActionList[i].scale);
            bottomActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,bottomActionList[i].hidePosition)));
        }

        for(var i = 0 ; i < rightActionList.length; i ++){
            rightActionList[i].truePosition = rightActionList[i].getPosition();
            rightActionList[i].hidePosition = cc.p(windowSize.width + (rightActionList[i].width/2 + Math.abs( 0.5-rightActionList[i].getAnchorPoint().x) * rightActionList[i].width+(rightActionList[i]._dX?rightActionList[i]._dX:0))*rightActionList[i].scale,rightActionList[i].getPositionY());
            rightActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,rightActionList[i].hidePosition)));
        }

        for(var i = 0 ; i < leftActionList.length; i ++){
            leftActionList[i].truePosition = leftActionList[i].getPosition();
            leftActionList[i].hidePosition = cc.p((- leftActionList[i].width/2 - Math.abs( leftActionList[i].getAnchorPoint().x-0.5) * leftActionList[i].width-(leftActionList[i]._dX?leftActionList[i]._dX:0))*leftActionList[i].scale,leftActionList[i].getPositionY());
            leftActionList[i].runAction(cc.sequence(cc.moveTo(actionTime1,leftActionList[i].hidePosition)));
        }
        this.runAction(cc.sequence(cc.delayTime(actionTime1),cc.callFunc(function () {
            var intoType = 1;
            if(MjClient.GoldHallLayer){
                intoType = 0;
                MjClient.GoldHallLayer.removeFromParent(true);
            }
            var goldHallLayer = new GoldHallLayer(intoType);
            that.goldHallLayer = goldHallLayer;
            that.addChild(goldHallLayer);

        }.bind(this))));
    },
    // 金币场和大厅，元宝和礼券都显示
    // 金币场： 黄金：gold     礼券：integral
    // 大厅：   黄金：money    礼券：integral
    changeMoney:function () {
        var liquanNum = this._headNode.getChildByName("liquanNum");
        var moneyNum = this._headNode.getChildByName("moneyNum");
        moneyNum.preValue = MjClient.data.pinfo.money;
        changeAtalsForLabel(moneyNum, MjClient.data.pinfo.money);
        liquanNum.preValue = MjClient.data.pinfo.integral;
        changeAtalsForLabel(liquanNum, MjClient.data.pinfo.integral);
    },
    showJinbiView:function () {
        goldField_start();
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
    },
    setGameListPanel: function (gameListPanelNode) {

        setWgtLayout(gameListPanelNode, [0.6, 0.6], [0.5, 0.5], [0, -0.1]);


        var gameClassList = [];
        if(MjClient.systemConfig && MjClient.systemConfig.gameClass){
            gameClassList = JSON.parse(MjClient.systemConfig.gameClass);//[MjClient.GAME_CLASS.NIU_NIU];//
        } else {
            this.scheduleOnce(function(){
                MjClient.showMsg("网络开小差，请重启游戏或者联系客服\n systemConfig.gameClass no gameClass");
            } , 0.1);
            
            cc.log('error MjClient.systemConfig no gameClass', JSON.stringify(MjClient.systemConfig) );
        }
        cc.log("================gameClassList = " + JSON.stringify(gameClassList));
        for (var i = 0; i < gameClassList.length; i++) {
            var gameClass = gameClassList[i];
            var btn = new ccui.Button(GameClassEnterBtn[gameClass]);
            btn.setTag(gameClass);
            btn.setScale(0.85);
            btn.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        var gameclass = sender.getTag();
                        this.setGameType(gameclass);
                        break;
                    default:
                        break;
                }
            }, this);
            gameListPanelNode.pushBackCustomItem(btn);
        }
        if (gameClassList.length == 1 || MjClient.isAroundBeijing() || MjClient.isShenhe) {
            this.setGameType(gameClassList[0]);
            //this._BtnRuturn.visible = false;
        }
    },
    setGamePanel: function (gamePanelNode) {
        var that = this;
        setWgtLayout(gamePanelNode, [0.95, 0.95], [0.5, 0.5], [0, 0]);
        if(isIPhoneX())
        {
            setWgtLayout(gamePanelNode, [0.85, 0.85], [0.5, 0.5], [0, 0]);
        }

        var gameBgNode = gamePanelNode.getChildByName("game_bg");

        var advBgNode  = gamePanelNode.getChildByName("adv_bg");

        this._joinRoom = gameBgNode.getChildByName("joinRoom");
        //var joinName =this._joinRoom.getChildByName("Image_21");
        //this._joinRoom.setName("soundSelf");
        //joinName.setLocalZOrder(20);
        this._joinRoom.setPressedActionEnabled(true);
        this._joinRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.Scene.addChild(new EnterRoomLayer());
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jiarufangjian", {uid:SelfUid()});
                    updateUserBehavior("加入房间");
                    break;
                default:
                    break;
            }
        }, this);
        /*加入房间特效*/
        var _joinIcon = this._joinRoom.getChildByName("icon");
        _joinIcon.runAction(cc.sequence(cc.scaleTo(1.2,0.9).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(2,1.05).easing(cc.easeQuadraticActionInOut())).repeatForever());
        // var left1 = this._joinRoom.getChildByName("Image_flowerleft1");
        // var rigth0 = this._joinRoom.getChildByName("Image_flowerright0");
        // var left2 = this._joinRoom.getChildByName("Image_flower");
        // left0.runAction(cc.sequence(cc.rotateBy(1.8,-6).easing(cc.easeQuadraticActionInOut()), cc.rotateBy(2,6).easing(cc.easeQuadraticActionInOut())).repeatForever());
        // left1.runAction(cc.sequence(cc.rotateBy(1.8,-6).easing(cc.easeQuadraticActionInOut()), cc.rotateBy(2,6).easing(cc.easeQuadraticActionInOut())).repeatForever());
        // left2.runAction(cc.sequence(cc.rotateBy(1.8,-8).easing(cc.easeQuadraticActionInOut()), cc.rotateBy(2,-8).easing(cc.easeQuadraticActionInOut())).repeatForever());
        // rigth0.runAction(cc.sequence(cc.rotateBy(1.8,4).easing(cc.easeQuadraticActionInOut()), cc.rotateBy(2,-4).easing(cc.easeQuadraticActionInOut())).repeatForever());
        // var rightFlower = this._joinRoom.getChildByName("Image_flowerright");
        // var f0 = cc.moveBy(1.5,cc.p(-10,-10)).easing(cc.easeQuadraticActionInOut());
        // var f1 = cc.moveBy(1.5,cc.p(10,10)).easing(cc.easeQuadraticActionInOut());
        // var seq = cc.sequence(f0,f1).repeatForever();
        // rightFlower.runAction(seq);

        // var light = this._joinRoom.getChildByName("Image_30");
        // light.visible = false;
        // var al0 = cc.fadeOut(0.8).easing(cc.easeQuadraticActionInOut());
        // var al1 = cc.scaleTo(1,1.5).easing(cc.easeQuadraticActionInOut());
        // var action1 = cc.spawn(al0,al1);
        //
        // var al2 = cc.fadeIn(0.3).easing(cc.easeQuadraticActionInOut());
        // var al3 = cc.scaleTo(0.5,1).easing(cc.easeQuadraticActionInOut());
        // var action2 = cc.spawn(al2,al3);
        //
        // var seq = cc.sequence(action1,cc.callFunc(function(){
        //     light.setOpacity(255);
        //     light.setScale(1);
        // })).repeatForever();
        // light.runAction(seq);

        //扫光效果
        // var clipper = new cc.ClippingNode();
        // var sten = cc.Sprite.create("game_picture/join/card.png");
        // var sten1 = cc.Sprite.create("game_picture/join/card.png");
        // var stenSize = sten.getContentSize();
        // sten.setPosition(stenSize.width / 2, stenSize.height / 2);
        // sten1.setPosition(sten.getPosition());
        // clipper.setContentSize(stenSize);
        // clipper.setStencil(sten);
        // clipper.addChild(sten1);
        // clipper.setAlphaThreshold(0.5);
        // clipper.setPosition(this._joinRoom.getContentSize().width*0.3,this._joinRoom.getContentSize().height/6);
        // this._joinRoom.addChild(clipper,0);
        // var sprite1 = new cc.Sprite("game_picture/match/liuguang_01.png");
        // sprite1.setBlendFunc(cc.ONE,cc.ONE);
        // sprite1.setOpacity(255*0.9);
        // clipper.addChild(sprite1, 1);
        // var repeatAction = cc.repeatForever(cc.sequence(
        //     cc.moveTo(0.0, cc.p(-sten.width / 2, sten.height / 2)),
        //     cc.moveTo(1.8, cc.p(sten.width + sten.width, sten.height / 2)),
        //     cc.delayTime(1.5)));
        // sprite1.runAction(repeatAction); //进行向右移动的重复动作
        // var sprite3 = new cc.Sprite("game_picture/match/liuguang_02.png");
        // sprite3.setBlendFunc(cc.ONE,cc.ONE);
        // sprite3.setOpacity(255*0.9);
        // clipper.addChild(sprite3, 1);
        // var repeatAction3 = cc.repeatForever(cc.sequence(
        //     cc.moveTo(0.0, cc.p(sten.width + sten.width / 2, sten.height)),
        //     cc.moveTo(1.8, cc.p(-sten.width, 0)),
        //     cc.delayTime(1.5)));
        // sprite3.runAction(repeatAction3); //进行向右移动的重复动作


        // var _joinNode = this._joinRoom.getChildByName("Panel_mask");
        // var _joinRoomPar =  new cc.ParticleSystem("Particle/joinRoomPar.plist");
        // _joinRoomPar.setPosition(this._joinRoom.getContentSize().width/2, this._joinRoom.getContentSize().height/6);
        // _joinRoomPar.setScale(1);
        // //_joinRoomPar.setTotalParticles(5);
        // _joinNode.addChild(_joinRoomPar,0);


        // 闪光效果
        // var cardlight = this._joinRoom.getChildByName("Image_card");
        // var clipper = cc.ClippingNode.create();
        // var sten = cc.Sprite.create("game_picture/join/card.png");
        // var stenSize = sten.getContentSize();
        // clipper.setContentSize(stenSize);
        // clipper.setStencil(sten);
        // clipper.setAlphaThreshold(0.5);
        // sten.setPosition(stenSize.width / 2, stenSize.height / 2);
        // var sprite = new cc.Sprite("game_picture/join/light0.png");
        // var repeatAction = cc.RepeatForever.create(cc.Sequence.create(
        //     cc.MoveTo.create(0.0, cc.p(sten.width / 2, -sten.height / 2)),
        //     cc.MoveTo.create(1.3, cc.p(sten.width /2 , sten.height +  sten.height / 2)),
        //     cc.delayTime(0.8)));
        // sprite.runAction(repeatAction);//进行向右移动的重复动作
        // clipper.addChild(sprite, 1);
        // cardlight.addChild(clipper);

        this._createRoom = gameBgNode.getChildByName("createRoom");
        //this._createRoom.setName("soundSelf");
        this._createRoom.setPressedActionEnabled(true);
        // var starParticle1 =  new cc.ParticleSystem("game_picture/diamondStar.plist");
        // starParticle1.setPosition(this._createRoom.getContentSize().width/2, this._createRoom.getContentSize().height/2 - 30);
        // this._createRoom.addChild(starParticle1);
        this._createRoom.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Chuangjianfangjian", {uid:SelfUid()});
                    updateUserBehavior("创建房间");
                    if (!MjClient.data.sData)
                    {
                        postEvent("createRoom",{});
                    }
                    else
                    {
                        MjClient.showMsg("房间已经创建,请直接加入房间。");
                    }
                    break;
                default:
                    break;
            }
        }, this);
        /* 创建房间特效*/
        var _icon = this._createRoom.getChildByName("icon");
        // _creatName.setLocalZOrder(20);
        //
        // var card0 = this._createRoom.getChildByName("Image_card0");
        // var card1 = this._createRoom.getChildByName("Image_card1");
        var upA0 = cc.moveBy(1,cc.p(0,10)).easing(cc.easeQuadraticActionInOut());
        var upA1 = cc.moveBy(1,cc.p(0,-10)).easing(cc.easeQuadraticActionInOut());
        _icon.runAction(cc.sequence(upA0,upA1).repeatForever());
        //
        // var upA2 = cc.moveBy(1.1,cc.p(0,8)).easing(cc.easeQuadraticActionInOut());
        // var upA3 = cc.moveBy(1.1,cc.p(0,-8)).easing(cc.easeQuadraticActionInOut());
        // card1.runAction(cc.sequence(upA2,upA3).repeatForever());
        //
        // var shazi2 = this._createRoom.getChildByName("Image_shaizi2");
        // var shazi1 = this._createRoom.getChildByName("Image_shaizi1");
        // var shazi0 = this._createRoom.getChildByName("Image_shaizi0");
        //
        //
        // var shaiA2 = cc.moveBy(4,cc.p(-10,10)).easing(cc.easeQuadraticActionInOut());
        // var shaiB2 = cc.moveBy(4,cc.p(10,-10)).easing(cc.easeQuadraticActionInOut());
        // shazi2.runAction(cc.sequence(shaiA2,shaiB2).repeatForever());
        //
        // var shaiA1 = cc.moveBy(4,cc.p(-10,10)).easing(cc.easeQuadraticActionInOut());
        // var shaiB1 = cc.moveBy(4,cc.p(10,-10)).easing(cc.easeQuadraticActionInOut());
        // shazi1.runAction(cc.sequence(shaiA1,shaiB1).repeatForever());
        //
        // var shaiA0 = cc.moveBy(2,cc.p(5,5)).easing(cc.easeQuadraticActionInOut());
        // var shaiB0= cc.moveBy(2,cc.p(-5,-5)).easing(cc.easeQuadraticActionInOut());
        // shazi0.runAction(cc.sequence(shaiA0,shaiB0).repeatForever());
        //
        // var _MaskNode = this._createRoom.getChildByName("Panel_mask");
        // _MaskNode.setLocalZOrder(19);
        // var starParticleqp =  new cc.ParticleSystem("Particle/ceate.plist");
        // starParticleqp.setPosition(this._createRoom.getContentSize().width/2, this._createRoom.getContentSize().height*0.6);
        // starParticleqp.setScale(0.9);
        // _MaskNode.addChild(starParticleqp,0);

        /* end of 创建房间特效*/


        //金币场
        var goldBtn = gameBgNode.getChildByName("goldBtn");
        goldBtn.visible = false; //金币场暂时不开放
        //
        // goldBtn.setPressedActionEnabled(true);
        // UIEventBind(this.jsBind, goldBtn, "goldfieldchange", function () {
        //     if(cc.sys.isObjectValid(MjClient.GoldHallLayer)){
        //         return;
        //     }
        //     if (!MjClient._GOLD_FIELD || MjClient._GOLD_FIELD.length == 0){
        //         MjClient.showToast("金币场暂未开放");
        //         that.showNomalHome();
        //         return;
        //     }
        //     that.doHideAction();
        // });
        // goldField_updateListener(goldBtn);
        // var jiaoBiao = new cc.Sprite("game_picture/mainMenu/jiaobiao2.png");
        // jiaoBiao.setPosition(jiaoBiao.width*0.65, goldBtn.height - jiaoBiao.height*0.5);
        // goldBtn.addChild(jiaoBiao);
        // goldBtn.addTouchEventListener(function (sender, Type) {
        //     switch (Type) {
        //         case ccui.Widget.TOUCH_ENDED:
        //             MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Jinbichang", {uid:SelfUid()});
        //             updateUserBehavior("娱乐场");
        //             goldField_start();
        //             break;
        //         default:
        //             break;
        //     }
        // }, this);
        // /* 金币场的特效*/
        //
        // var _Image_gold = goldBtn.getChildByName("Image_gold"); //发财这个字
        // _Image_gold.runAction(cc.sequence(cc.moveBy(1.8,cc.p(0,-6)).easing(cc.easeQuadraticActionInOut()), cc.moveBy(2,cc.p(0,6)).easing(cc.easeQuadraticActionInOut())).repeatForever());
        //
        // var hongbaoEffect = goldBtn.getChildByName("Node_hongbaoEffect");
        // for(var i = 0; i < 5; i++){
        //     var hongbao = hongbaoEffect.getChildByName("hongbao_"+i);
        //     hongbao.runAction(cc.sequence(
        //         cc.delayTime(0.2*i),
        //         cc.moveBy(1.0, cc.p(0, 6)).easing(cc.easeSineInOut()),
        //         cc.moveBy(1.0, cc.p(0, -6)).easing(cc.easeSineInOut())
        //     ).repeatForever());
        //     var light = hongbaoEffect.getChildByName("light_"+i);
        //     light.setScale(0);
        //     light.runAction(cc.sequence(
        //         cc.delayTime(0.2*i),
        //         cc.scaleTo(0.2, 1),
        //         cc.delayTime(0.2),
        //         cc.scaleTo(0.2, 0),
        //         cc.delayTime(0.8 - 0.2*i)
        //     ).repeatForever());
        // }
        // if(MjClient.systemConfig.fieldRedpacketActivityOpen){
        //     _Image_gold.setVisible(false);
        //     hongbaoEffect.setVisible(true);
        // }else {
        //     _Image_gold.setVisible(true);
        //     hongbaoEffect.setVisible(false);
        // }
        //
        //
        // //扫光
        // var clipper = cc.ClippingNode.create();
        // var sten = cc.Sprite.create("game_picture/mainMenu/yule_di.png");
        // var stenSize = sten.getContentSize();
        // clipper.setContentSize(stenSize);
        // clipper.setStencil(sten);
        // clipper.setAlphaThreshold(0.5);
        // sten.setPosition(stenSize.width / 2, stenSize.height / 2);
        // var sprite = new cc.Sprite("game_picture/mainMenu/saoguang.png");
        // sprite.setScale(1.5);
        // var repeatAction = cc.RepeatForever.create(cc.Sequence.create(
        //     cc.MoveTo.create(0.0, cc.p(-sten.width / 2, sten.height / 2)),
        //     cc.MoveTo.create(2, cc.p(sten.width + 100,sten.height / 2)),
        //     cc.delayTime(1.5)));
        // sprite.runAction(repeatAction);//进行向右移动的重复动作
        // clipper.addChild(sprite, 1);
        // goldBtn.addChild(clipper);
        /* end of 金币场的特效*/

        var clubEnter = gameBgNode.getChildByName("clubEnter");
        //clubEnter.setName("soundSelf");
        if (MjClient.systemConfig.clubEnable == "true" && MjClient.isShenhe == false)
        {
            clubEnter.addTouchEventListener(function (sender, Type) {
                switch (Type) {
                    case ccui.Widget.TOUCH_ENDED:
                        //reallyPlayEffect("sound/home_click.mp3",false);
                         MjClient.Scene.addChild(new FriendCard_main(null, 1));
                        updateUserBehavior("亲友圈");
                        MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Qinyouquan", {uid:SelfUid()});
                        break;
                    default:
                        break;
                }
            }, this);
        }
        else
        {
            clubEnter.visible = false;
            this._joinRoom.x += this._joinRoom.width+50;
            this._joinRoom.setScale(1.5);
            // this._createRoom.x += this._createRoom.width/3;
        }


        var _clubIcon = clubEnter.getChildByName("icon_0");
        var upA0 = cc.moveBy(1.5,cc.p(0,6)).easing(cc.easeQuadraticActionInOut());
        var upA1 = cc.moveBy(1.5,cc.p(0,-6)).easing(cc.easeQuadraticActionInOut());
        _clubIcon.runAction(cc.sequence(upA0,upA1).repeatForever());

        // var _pocker = clubEnter.getChildByName("Image_poker");
        // _pocker.runAction(cc.sequence(cc.rotateBy(1.8,-6).easing(cc.easeQuadraticActionInOut()), cc.rotateBy(2,6).easing(cc.easeQuadraticActionInOut())).repeatForever());


        var _joinRoomPar =  new cc.ParticleSystem("Particle/joinRoomPar.plist");
        _joinRoomPar.setPosition(clubEnter.getContentSize().width/2, clubEnter.getContentSize().height/3);
        _joinRoomPar.setScale(1);
        clubEnter.addChild(_joinRoomPar,0);


        /* 俱乐部特效*/
        // var shazi0 = clubEnter.getChildByName("sazi0");
        // var shazi1 = clubEnter.getChildByName("sazi1");
        // var shaiA2 = cc.moveBy(2,cc.p(0,15)).easing(cc.easeQuadraticActionInOut());
        // var shaiB2 = cc.moveBy(2,cc.p(0,-15)).easing(cc.easeQuadraticActionInOut());
        // shazi0.runAction(cc.sequence(shaiA2,shaiB2).repeatForever());
        //
        // var shaiA1 = cc.moveBy(2,cc.p(0,8)).easing(cc.easeQuadraticActionInOut());
        // var shaiB1 = cc.moveBy(2,cc.p(0,-8)).easing(cc.easeQuadraticActionInOut());
        // shazi1.runAction(cc.sequence(shaiA1,shaiB1).repeatForever());
        // var _clubPanel = clubEnter.getChildByName("Panel_1");
        // var starParticleqp =  new cc.ParticleSystem("Particle/ceate.plist");
        // starParticleqp.setPosition(clubEnter.getContentSize().width/2, clubEnter.getContentSize().height*0.6);
        // starParticleqp.setScale(0.9);
        // _clubPanel.addChild(starParticleqp,0);





        // var _clubName = clubEnter.getChildByName("Image_20");
        //
        // _clubName.setLocalZOrder(10);
        // var clipper = new cc.ClippingNode();
        // var sten = cc.Sprite.create("game_picture/club/huangguan.png");
        // var sten1 = cc.Sprite.create("game_picture/club/huangguan.png");
        // var stenSize = sten.getContentSize();
        // sten.setPosition(stenSize.width / 2, stenSize.height / 2);
        // sten1.setPosition(sten.getPosition());
        // clipper.setContentSize(stenSize);
        // clipper.setStencil(sten);
        // clipper.addChild(sten1);
        // clipper.setAlphaThreshold(0.5);
        // clipper.setPosition(40,65);
        // clubEnter.addChild(clipper,0);
        // var sprite1 = new cc.Sprite("game_picture/match/liuguang_01.png");
        // sprite1.setBlendFunc(cc.ONE,cc.ONE);
        // sprite1.setOpacity(255*0.9);
        // clipper.addChild(sprite1, 1);
        // var repeatAction = cc.repeatForever(cc.sequence(
        //     cc.moveTo(0.0, cc.p(-sten.width / 2, sten.height / 2)),
        //     cc.moveTo(1.8, cc.p(sten.width + sten.width, sten.height / 2)),
        //     cc.delayTime(1.5)));
        // sprite1.runAction(repeatAction); //进行向右移动的重复动作
        // var sprite3 = new cc.Sprite("game_picture/match/liuguang_02.png");
        // sprite3.setBlendFunc(cc.ONE,cc.ONE);
        // sprite3.setOpacity(255*0.9);
        // clipper.addChild(sprite3, 1);
        // var repeatAction3 = cc.repeatForever(cc.sequence(
        //     cc.moveTo(0.0, cc.p(sten.width + sten.width / 2, sten.height)),
        //     cc.moveTo(1.8, cc.p(-sten.width, 0)),
        //     cc.delayTime(1.5)));
        // sprite3.runAction(repeatAction3); //进行向右移动的重复动作
        //
        // var sprite_star = cc.Sprite.create("game_picture/match/yaoguang.png");
        // sprite_star.setScale(0);
        // sprite_star.setPosition(120,85);
        // sprite_star.runAction(cc.sequence(
        //     cc.spawn(cc.scaleTo(0.5,2), cc.rotateBy(0.5,180)),
        //     cc.spawn(cc.scaleTo(0.5,0), cc.rotateBy(0.5,180)),
        //     cc.delayTime(2)
        // ).repeatForever());
        // clipper.addChild(sprite_star, 1);
        //
        // //四个角的牌
        // var card0 = clubEnter.getChildByName("Image_card0");
        // var card1 = clubEnter.getChildByName("Image_card1");
        // var card2 = clubEnter.getChildByName("Image_card2");
        // var card3 = clubEnter.getChildByName("Image_card3");
        //
        // function getMoveAction(beganPos,endPos)
        // {
        //     var a0 = cc.moveBy(1.5,beganPos).easing(cc.easeQuadraticActionInOut());
        //     var a1 = cc.moveBy(1.5,endPos).easing(cc.easeQuadraticActionInOut());
        //     var seq = cc.sequence(a0,a1).repeatForever();
        //     return seq;
        // }
        //
        // card0.runAction(getMoveAction(cc.p(10,-10),cc.p(-10,10)));
        // card1.runAction(getMoveAction(cc.p(-10,-10),cc.p(10,10)));
        // card2.runAction(getMoveAction(cc.p(-8,8),cc.p(8,-8)));
        // card3.runAction(getMoveAction(cc.p(6,6),cc.p(-6,-6)));
        /* end of 俱乐部特效*/

        // /* 广告 传奇 入口 */
        // var chuanqiBtn = advBgNode.getChildByName("chuanqiBtn");
        // if (chuanqiBtn) {
        //
        //     var anim = cc.Sprite("chuanqi/anim/0.png");
        //     var ac = createAnimation("chuanqi/anim/", 20, cc.rect(0, 0, 329, 109), 0.15);
        //     anim.runAction(cc.sequence(ac).repeatForever());
        //     anim.setPosition(63, 60);
        //     chuanqiBtn.addChild(anim);
        //
        //     chuanqiBtn.runAction(cc.sequence(cc.delayTime(0.01), cc.callFunc(function() {
        //         anim.setScale(chuanqiBtn.getRendererNormal().getScale());
        //     })).repeatForever());
        //
        //     chuanqiBtn.addTouchEventListener(function(sender, type) {
        //         if (type == ccui.Widget.TOUCH_ENDED)
        //         {
        //             MjClient.native.umengEvent4CountWithProperty("zhujiemian_chuanqi_dianji", {uid:SelfUid()});
        //             MjClient.Scene.addChild(new ChuanQiWebviewLayer());
        //         }
        //     });
        // }
        //
        // /* 广告 八字算命 入口 */
        // var baZisuanMianBtn = advBgNode.getChildByName("bazisuanmianBtn");
        // if (baZisuanMianBtn) {
        //     var zhezhao = baZisuanMianBtn.getChildByName("zhezhao");
        //     var lightLayer = zhezhao.getChildByName("lightLayer");
        //
        //     var light = new cc.ParticleSystem("bazisuanmian/light.plist");
        //     light.setPosition(0, 200);
        //     light.setScale(0.5);
        //     lightLayer.addChild(light);
        //
        //     var cai = zhezhao.getChildByName("cai");
        //     cai.runAction(cc.sequence(cc.scaleTo(0.5, 0.98), cc.scaleTo(0.5, 1.2)).repeatForever());
        //
        //     var particle = new cc.ParticleSystem("chuanqi/particle.plist");
        //     particle.setPosition(zhezhao.width/2, 20);
        //     particle.setScale(0.3);
        //     zhezhao.addChild(particle);
        //
        //     var clippingNode2 = new cc.ClippingNode();
        //     var mask = new cc.Sprite("bazisuanmian/zhezhao.png");
        //     clippingNode2.setAlphaThreshold(0);
        //     clippingNode2.setStencil(mask);
        //
        //     zhezhao.removeFromParent(false);
        //     clippingNode2.setPosition(baZisuanMianBtn.width / 2, baZisuanMianBtn.height / 2 + 17);
        //     zhezhao.setPosition(0, 0)
        //     clippingNode2.addChild(zhezhao);
        //     baZisuanMianBtn.addChild(clippingNode2);
        //
        //     baZisuanMianBtn.runAction(cc.sequence(cc.delayTime(0.01), cc.callFunc(function() {
        //         clippingNode2.setScale(baZisuanMianBtn.getRendererNormal().getScale());
        //     })).repeatForever());
        //
        //     baZisuanMianBtn.addTouchEventListener(function(sender, type) {
        //         if (type == ccui.Widget.TOUCH_ENDED)
        //         {
        //             MjClient.native.umengEvent4CountWithProperty("zhujiemian_bazisuanmian_dianji", {uid:SelfUid()});
        //             MjClient.Scene.addChild(new BaZiSuanMianWebviewLayer());
        //         }
        //     });
        // }
        //
        // // 热血合击
        // var rexueHejiBtn = advBgNode.getChildByName("rexueHejiBtn");
        // if (rexueHejiBtn) {
        //     rexueHejiBtn.addTouchEventListener(function(sender, type) {
        //         if (type == ccui.Widget.TOUCH_ENDED)
        //         {
        //             MjClient.native.umengEvent4CountWithProperty("zhujiemian_rexueheji_dianji", {uid:SelfUid()});
        //             MjClient.Scene.addChild(new RexueHejiWebviewLayer());
        //         }
        //     });
        //
        //     cc.spriteFrameCache.addSpriteFrames("game_picture/mainMenu/adv/rexue.plist","game_picture/mainMenu/adv/rexue.png");
        //     var rexueAniBG = rexueHejiBtn.getChildByName("rexue");
        //     var frames = [];
        //     var prefix = "cq_0000";
        //     var fc = cc.spriteFrameCache;
        //     for (var i = 0; i < 9; i++) {
        //         var name = prefix + i + ".png";
        //         var f = fc.getSpriteFrame(name);
        //         if(f)
        //         {
        //             frames.push(f);
        //         }
        //     }
        //     var firstFrame = new cc.Sprite("#cq_00000.png");
        //     var animate = cc.sequence(cc.animate(new cc.Animation(frames, 0.08, 1)));
        //     firstFrame.runAction(animate.repeatForever());
        //     firstFrame.setPosition(rexueAniBG.getContentSize().width/2,rexueAniBG.getContentSize().height/2);
        //     rexueAniBG.addChild(firstFrame);
        //
        // }
        //
        // // 捕鱼
        // var buyuBtn = advBgNode.getChildByName("buyuBtn");
        // if (buyuBtn) {
        //     var zhezhao = buyuBtn.getChildByName("zhezhao");
        //     var kaifang = true;
        //     if(kaifang){
        //         buyuBtn.setTouchEnabled(true);
        //         if(zhezhao) zhezhao.setVisible(false);
        //         buyuBtn.addTouchEventListener(function(sender, type) {
        //             if (type == ccui.Widget.TOUCH_ENDED)
        //             {
        //                 MjClient.native.umengEvent4CountWithProperty("zhujiemian_buyu_dianji", {uid:SelfUid()});
        //                 MjClient.Scene.addChild(new BuyuWebviewLayer());
        //             }
        //         });
        //
        //         var _tile = buyuBtn.getChildByName("Image_5_0");
        //
        //         //扫光
        //         var clipper = cc.ClippingNode.create();
        //         var sten = cc.Sprite.create("game_picture/mainMenu/adv/buyu_baiwanbuyu.png");
        //         var stenSize = sten.getContentSize();
        //         clipper.setContentSize(stenSize);
        //         clipper.setStencil(sten);
        //         clipper.setAlphaThreshold(0.5);
        //         sten.setPosition(stenSize.width / 2, stenSize.height / 2);
        //         var sprite = new cc.Sprite("game_picture/btn_800yuan_gx.png");
        //         var repeatAction = cc.RepeatForever.create(cc.Sequence.create(
        //             cc.MoveTo.create(0.0, cc.p(-sten.width / 2, sten.height / 2)),
        //             cc.MoveTo.create(1.3, cc.p(sten.width + 100,sten.height / 2)),
        //             cc.delayTime(0.8)));
        //         sprite.runAction(repeatAction);//进行向右移动的重复动作
        //         clipper.addChild(sprite, 1);
        //         _tile.addChild(clipper);
        //
        //         var _gold0 = buyuBtn.getChildByName("Panel_4").getChildByName("gold0");
        //         var _gold1 = buyuBtn.getChildByName("Panel_4").getChildByName("gold1");
        //         var _gold2 = buyuBtn.getChildByName("Panel_4").getChildByName("gold2");
        //
        //         var shaiA2 = cc.moveBy(4,cc.p(-10,10)).easing(cc.easeQuadraticActionInOut());
        //         var shaiB2 = cc.moveBy(4,cc.p(10,-10)).easing(cc.easeQuadraticActionInOut());
        //         _gold0.runAction(cc.sequence(shaiA2,shaiB2).repeatForever());
        //
        //         var shaiA1 = cc.moveBy(4,cc.p(0,8)).easing(cc.easeQuadraticActionInOut());
        //         var shaiB1 = cc.moveBy(4,cc.p(0,-8)).easing(cc.easeQuadraticActionInOut());
        //         _gold1.runAction(cc.sequence(shaiA1,shaiB1).repeatForever());
        //
        //         var shaiA0 = cc.moveBy(2,cc.p(0,15)).easing(cc.easeQuadraticActionInOut());
        //         var shaiB0= cc.moveBy(2,cc.p(0,-15)).easing(cc.easeQuadraticActionInOut());
        //         _gold2.runAction(cc.sequence(shaiA0,shaiB0).repeatForever());
        //     }else{
        //         buyuBtn.setTouchEnabled(false);
        //         if(zhezhao) zhezhao.setVisible(true);
        //     }
        // }
        //
        // // 王者战神
        // var wangzheZhanshenBtn = advBgNode.getChildByName("wangzheZhanshenBtn");
        // if (wangzheZhanshenBtn) {
        //     wangzheZhanshenBtn.visible = false; //暂时不显示
        //     wangzheZhanshenBtn.addTouchEventListener(function(sender, type) {
        //         if (type == ccui.Widget.TOUCH_ENDED)
        //         {
        //             MjClient.native.umengEvent4CountWithProperty("zhujiemian_wangzhezhanshen_dianji", {uid:SelfUid()});
        //             MjClient.Scene.addChild(new WangzheZhanshenWebviewLayer());
        //         }
        //     });
        // }

        //添加第三方应用
        //COMMON_UI.addHomeAdvMode(advBgNode);
    },


    setGameType: function (type) {

        //this._gameListPanelNode.visible = false;
        this._gamePanelNode.visible = true;
        //this._jueSeNode.visible = true;
        MjClient.gameClass = type;
        cc.log("=================type =  " + type);

        // 闪光效果
        // var clipper = cc.ClippingNode.create();
        // var sten = cc.Sprite.create("joinGame/createRoom.png");
        // var stenSize = sten.getContentSize();
        // clipper.setContentSize(stenSize);
        // clipper.setStencil(sten);
        // clipper.setAlphaThreshold(0.5);
        // sten.setPosition(stenSize.width / 2, stenSize.height / 2);

        // this._joinRoom.addChild(clipper);

        // var sprite = new cc.Sprite("joinGame/guangxiao.png");
        // clipper.addChild(sprite, 1);

        // var repeatAction = cc.RepeatForever.create(cc.Sequence.create(
        //     cc.MoveTo.create(0.0, cc.p(-sten.width / 2, sten.height / 2)),
        //     cc.MoveTo.create(1.3, cc.p(sten.width + sten.width / 2, sten.height / 2)),
        //     cc.delayTime(3.0)));
        // sprite.runAction(repeatAction);//进行向右移动的重复动作

        // var gameClassList = JSON.parse(MjClient.systemConfig.gameClass);
        // if (gameClassList.length > 1) {
        //     this._tileIcon.loadTexture(GameClassTitleIcon[MjClient.gameClass]);
        // }
        // else {
        //     this._tileIcon.loadTexture("game_picture/logo_home.png");
        // }
        // if (MjClient.systemConfig.rankEnable == "true")
        //     this.gameRankLayer();
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

    },

    //雀神榜
    reqQueShenSeverData: function () {

    },
    rspQueShen: function (data) {

    },

    //富豪榜
    reqFuHaoSeverData: function () {

    },
    rspFuHao: function (data) {

    },
    initSelfInfo: function (MyData) {

    }

    /****************
        end of 排行榜
    *****************/
});

