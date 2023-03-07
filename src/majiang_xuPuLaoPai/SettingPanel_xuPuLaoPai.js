/***
 * 房间设置界面
 * @type {function(): void}
 */
var SettingPanel_xuPuLaoPai = cc.Layer.extend({

    jsBind:{
        _event:{
            roundEnd: function() {
                MjClient.setui.removeSettingLayer();
            },
            LeaveGame: function () {
                MjClient.setui.removeSettingLayer();
            },
            endRoom: function () {
                MjClient.setui.removeSettingLayer();
            }
        },
        block:{
            _layout:[[1,1],[0.5,0.5],[0,0],true],
            _click: function () {
                MjClient.setui.removeSettingLayer();
            }
        },
        back:{
            _layout:[[1, 1], [1, 0], [0, 0]],
            menu:{
                _run: function(){
                    MjClient.setui.getRoomSettingPanel();
                },
                picture:{
                    _click: function () {
                        var type = 1;
                        var curGameType = GameClass[MjClient.gameType];
                        MjClient.setui.getRoomSettingPanel(type);
                        postEvent("showRoomSettingPanel", {type: type, gameType: curGameType});
                        util.localStorageEncrypt.setNumberItem("menu", type);
                    }
                },
                function:{
                    _click: function () {
                        var type = 2;
                        var curGameType = GameClass[MjClient.gameType];
                        MjClient.setui.getRoomSettingPanel(type);
                        postEvent("showRoomSettingPanel", {type: type, gameType: curGameType});
                        util.localStorageEncrypt.setNumberItem("menu", type);
                    }
                }
            },
            panel1:{   // 画面设置
                _event: {
                    showRoomSettingPanel: function (ed) {
                        this.visible = ed.type === 1;
                    },
                },
                _run:function(){
                    var type = util.localStorageEncrypt.getNumberItem("menu", 1);
                    this.visible = type === 1;
                },
            },
            panel2:{   // 房间功能设置
                _event: {
                    showRoomSettingPanel: function (ed) {
                        this.visible = ed.type === 2;
                    }
                },
                _run: function(){
                    var type = util.localStorageEncrypt.getNumberItem("menu", 1);
                    this.visible = type === 2;
                },
                CheckBoxMusic:{
                    _run: function () {
                        this.setSelected(util.localStorageEncrypt.getNumberItem("oldMusicVolume", -1) !== -1);
                    },
                    _check: function (sender, type) {
                        var sliderMusic = sender.parent.getChildByName("SliderMusic");
                        switch (type){
                            case ccui.CheckBox.EVENT_SELECTED:
                                util.localStorageEncrypt.setNumberItem("oldMusicVolume", sliderMusic.getPercent() / 100);
                                sender.setSelected(true);
                                sliderMusic.setPercent(0);
                                setMusicVolume(0);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                var v = util.localStorageEncrypt.getNumberItem("oldMusicVolume", 0);
                                sender.setSelected(false);
                                sliderMusic.setPercent(v * 100);
                                setMusicVolume(v);
                                util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                                break;
                        }
                    }
                },
                CheckBoxVoice:{
                    _run: function () {
                        this.setSelected(util.localStorageEncrypt.getNumberItem("oldEffectVolume", -1) !== -1);
                    },
                    _check: function (sender, type){
                        var sliderVoice = sender.parent.getChildByName("SliderVoice");
                        switch (type) {
                            case ccui.CheckBox.EVENT_SELECTED:
                                util.localStorageEncrypt.setNumberItem("oldEffectVolume", sliderVoice.getPercent() / 100);
                                sender.setSelected(true);
                                sliderVoice.setPercent(0);
                                setEffectsVolume(0);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                var v = util.localStorageEncrypt.getNumberItem("oldEffectVolume", 0);
                                sender.setSelected(false);
                                sliderVoice.setPercent(v * 100);
                                setEffectsVolume(v);
                                util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                                break;
                        }
                    }
                },
                CheckBoxSpeak:{
                    _run: function () {
                        this.setSelected(util.localStorageEncrypt.getNumberItem("oldSpeakVolume", -1) !== -1);
                    },
                    _check: function (sender, type){
                        var sliderSpeak = sender.parent.getChildByName("SliderSpeak");
                        switch (type) {
                            case ccui.CheckBox.EVENT_SELECTED:
                                util.localStorageEncrypt.setNumberItem("oldSpeakVolume", sliderSpeak.getPercent() / 100);
                                sender.setSelected(true);
                                sliderSpeak.setPercent(0);
                                setSpeakVolume(0);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                var v = util.localStorageEncrypt.getNumberItem("oldSpeakVolume", 0);
                                sender.setSelected(false);
                                sliderSpeak.setPercent(v * 100);
                                setSpeakVolume(v);
                                util.localStorageEncrypt.setNumberItem("oldSpeakVolume", -1);
                                break;
                        }
                    }
                },
                SliderVoice:{
                    _run:function(){ this.setPercent(getEffectsVolume()*100); },
                    _slider:function(sender,tp){
                        var checkBoxVoice = sender.parent.getChildByName("CheckBoxVoice");
                        setEffectsVolume(this.getPercent()/100);
                        checkBoxVoice.setSelected(false);
                        util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Gongenengshezhi_YinXiao_Tuodongtiao", {uid: SelfUid(),gameType:MjClient.gameType});

                    }
                },
                SliderMusic:{
                    _run:function(){ this.setPercent(setMusicVolume(-1)*100); },
                    _slider:function(sender,tp){
                        var checkBoxMusic = sender.parent.getChildByName("CheckBoxMusic");
                        setMusicVolume(this.getPercent()/100);
                        checkBoxMusic.setSelected(false);
                        util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Gongenengshezhi_Yinyue_Tuodongtiao", {uid: SelfUid(),gameType:MjClient.gameType});
                    }
                },
                SliderSpeak:{
                    _run:function(){ this.setPercent(getSpeakVolume()*100);},
                    _slider:function(sender,tp){
                        var checkBoxSpeak = sender.parent.getChildByName("CheckBoxSpeak");
                        setSpeakVolume(this.getPercent()/100);
                        checkBoxSpeak.setSelected(false);
                        util.localStorageEncrypt.setNumberItem("oldSpeakVolume", -1);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Gongenengshezhi_YuYin_Tuodongtiao", {uid: SelfUid(),gameType:MjClient.gameType});
                    }
                },
            },
            delRoom:{
                _run:function(){
                    if(!MjClient.data || !MjClient.data.sData ||!MjClient.data.sData.tData){
                        this.setVisible(false);
                        return;
                    }
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.matchId || tData.fieldId) {
                        this.setVisible(false);
                    }
                },
                _click:function() {
                    if (!IsRoomCreator() && (MjClient.data.sData.tData.tState === TableState.waitJoin || MjClient.data.sData.tData.tState === TableState.waitReady)) {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                MjClient.setui.removeSettingPanel();
                            },
                            function() {});
                    } else {
                        MjClient.showMsg("确认解散房间？", function () {
                            MjClient.delRoom(true);
                            MjClient.setui.removeSettingLayer();
                            MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间
                        }, function(){}, 1);
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Jiesanfangjian", {uid:SelfUid()});
                }
            },
            fixBtn: {
                _visible: function () {
                    return !MjClient.isShenhe;
                },
                _click: function () {
                    removeUpdataDirectory();
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Yijianxiufu", {uid:SelfUid()});
                }
            },
        }

    },
    ctor: function () {
        this._super();
        var nodeUI = ccs.load("setting_changPai.json");
        this.node = nodeUI.node;
        this.back = this.node.getChildByName("back");
        MjClient.setui = this;
        BindUiAndLogic(nodeUI.node, this.jsBind);
        this.addChild(nodeUI.node);

        this.initTabelBackground();
        this.initOtherFunction();
    },
    initTabelBackground: function(){
        var panel1 = this.back.getChildByName("panel1");
        var bgNodeList = [];
        var bgName = ["经典绿", "深夜蓝", "质朴黄"];
        for (var i = 0; true; i ++) {
            var gameBg = panel1.getChildByName("gameBg" + (i + 1));
            if (!gameBg) break;
            var file = getGameBgFile(i);
            if (file !== ""){
                gameBg.getChildByName("image").loadTexture(file);
                gameBg.getChildByName("text").setString(bgName[i]);
            } else{
                gameBg.setVisible(false);
            }
            bgNodeList.push(gameBg);
        }
        this._playNode_GameBg_radio = createRadioBoxForCheckBoxs(bgNodeList, this.radioBoxSelectCB);

        for (var i = 0; i < bgNodeList.length; i ++) {
            var image_node = bgNodeList[i].getChildByName("image");
            cc.eventManager.addListener(this.setTextClick(bgNodeList, i, this._playNode_GameBg_radio), image_node);
            var text_node = bgNodeList[i].getChildByName("text");
            if (text_node) {
                cc.eventManager.addListener(this.setTextClick(bgNodeList, i, this._playNode_GameBg_radio), text_node);
            }
        }


        var gameBgEventCb = function (sender, type) {
            if (type === ccui.CheckBox.EVENT_SELECTED || type === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < bgNodeList.length; i ++) {
                    var color = sender === bgNodeList[i] ? COLOR.SETTNG_COLOR_1 : COLOR.SETTNG_COLOR_2;
                    bgNodeList[i].setSelected(sender === bgNodeList[i]);
                    if(bgNodeList[i].getChildByName("text")) {
                        bgNodeList[i].getChildByName("text").setTextColor(color);
                    }

                    if(sender === bgNodeList[i]) {
                        setCurrentGameBgType(i);
                        postEvent("changeGameBgEvent");
                    }
                }
            }
        };

        var gameBgType = getCurrentGameBgType();
        for (var i = 0; i < bgNodeList.length; i ++){
            bgNodeList[i].setSelected(gameBgType === i);
            bgNodeList[i].getChildByName("text").setTextColor(gameBgType === i ? COLOR.SETTNG_COLOR_1 : COLOR.SETTNG_COLOR_2);
            bgNodeList[i].addEventListener(gameBgEventCb, this);
        }
    },
    initOtherFunction: function(){
        var panel2 = this.back.getChildByName("panel2");
        var checkBoxMandarin = panel2.getChildByName("CheckBoxMandarin");  // 普通话
        var checkBoxDialect = panel2.getChildByName("CheckBoxDialect");  // 本地话
        var languageList = [checkBoxMandarin, checkBoxDialect];

        this.language_radio = createRadioBoxForCheckBoxs(languageList, function(idx){
            this.radioBoxSelectCB(idx, languageList[idx], languageList);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType, idx);
        }.bind(this));
        this.addListenerText(languageList, this.language_radio);

        var voiceType = util.localStorageEncrypt.getNumberItem(MjClient.KEY_voiceType, 1);
        this.language_radio.selectItem(voiceType);
        this.radioBoxSelectCB(voiceType, languageList[voiceType], languageList);
    },
    removeSettingLayer: function () {
        if(cc.sys.isObjectValid(MjClient.setui)) {
            MjClient.setui.removeFromParent(true);
            delete MjClient.setui;
        }
    },
    getRoomSettingPanel:function (type) {
        var menu = this.back.getChildByName("menu");
        var btnPicture = menu.getChildByName("picture");
        var btnFunction = menu.getChildByName("function");
        var type = type ? type : util.localStorageEncrypt.getNumberItem("menu", 1);
        if (type === 1) {
            btnPicture.loadTextureNormal("setting/setting_new/bg_menu1.png");
            btnPicture.loadTexturePressed("setting/setting_new/bg_menu1.png");
            btnFunction.loadTextureNormal("setting/setting_new/bg_menu2_n.png");
            btnFunction.loadTexturePressed("setting/setting_new/bg_menu2_n.png");
        } else {
            btnPicture.loadTextureNormal("setting/setting_new/bg_menu1_n.png");
            btnPicture.loadTexturePressed("setting/setting_new/bg_menu1_n.png");
            btnFunction.loadTextureNormal("setting/setting_new/bg_menu2.png");
            btnFunction.loadTexturePressed("setting/setting_new/bg_menu2.png");
        }
    },
    addListenerText: function(node, radio, callback) {
        if (node && radio) {
            for (var i = 0; i < node.length; i++) {
                node[i].getChildByName("text").ignoreContentAdaptWithSize(true);
                cc.eventManager.addListener(this.setTextClick(node, i, radio, callback), node[i].getChildByName("text"));
            }
        } else if (callback) {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(null, null, null, callback), node.getChildByName("text"));
        }else {
            node.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(), node.getChildByName("text"));
        }
    },
    setTextClick: function (listnode,number,radio,callback) {
        var that = this;
        var _callback = callback || function(){};
        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                radio.childIsMove = false;
                var target = event.getCurrentTarget();
                var parent = target;
                for (; parent; parent = parent.parent)
                {
                    if (!parent.visible)
                        return false;
                }

                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)

                // 如果触碰起始地点在本区域中
                var box = target.getBoundingBox();
                box.width += 10;
                box.height += 10;
                box.x -= 10;
                box.y -= 10;
                if(!cc.rectContainsPoint(box, pos)) {
                    return false;
                }
                return true;
            },
            onTouchMoved: function (touch, evnet) {
                radio.childIsMove = true;
            },
            onTouchEnded: function (touch, event) {
                if(radio.childIsMove) return;    // 如果复选框孩子节点（图片或者文字）被滑动，则阻止事件触发
                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)
                if (listnode) {
                    for (var i = 0; i < listnode.length; i++) {
                        if (i===number) {
                            listnode[i].setSelected(true);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(COLOR.SETTNG_COLOR_1);
                            txt.ignoreContentAdaptWithSize(true);
                            radio.selectItem(i);
                        }else{
                            listnode[i].setSelected(false);
                            var txt = listnode[i].getChildByName("text");
                            txt.setTextColor(COLOR.SETTNG_COLOR_2);
                            txt.ignoreContentAdaptWithSize(true);
                        }
                    }

                    // _playNode_MJGameBg_radio
                    if (radio === that._playNode_GameBg_radio) {
                        setCurrentGameBgType(number);
                        postEvent("changeGameBgEvent");
                    }

                    if (radio === that.language_radio) {
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType, number);
                    }
                }
                else {
                    // 如果触碰起始地点在本区域中
                    if(!cc.rectContainsPoint(target.getBoundingBox(), pos))
                        return;

                    target.parent.setSelected(!target.parent.isSelected());

                    var txt = target.parent.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    if (txt && target.parent.isSelected()) {
                        txt.setTextColor(COLOR.SETTNG_COLOR_1);
                    } else {
                        txt.setTextColor(COLOR.SETTNG_COLOR_2);
                    }
                }
                _callback(number);
            }
        });
    },
    radioBoxSelectCB: function(index, sender, list) {
        if (sender) {
            var txt = sender.getChildByName("text");
            txt.setTextColor(COLOR.SETTNG_COLOR_1);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var radioBox = list[i];
                if (radioBox !== sender || sender.isSelected() === false) {
                    txt = radioBox.getChildByName("text");
                    txt.setTextColor(COLOR.SETTNG_COLOR_2);
                }
            }
        }
    },
});