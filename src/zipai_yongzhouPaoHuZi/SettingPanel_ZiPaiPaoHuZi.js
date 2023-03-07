var SettingPanel_ZiPaiPaoHuZi = cc.Layer.extend({
    jsonFile: "setting_ziPai.json",

    jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		back:
		{	
            _run:function(){
                this.setAnchorPoint(cc.p(0, 0));
                setWgtLayout(this, [0, 1],[1, 0],[-1, 0]);
            },
		    close:{
				_click:function(){
					MjClient.setui.removeFromParent(true);
				}
            },
            noEffect:{
                _run:function(){
                    this.setSelected(util.localStorageEncrypt.getNumberItem("oldEffectVolume", -1) != -1);
                    MjClient.setui.noEffect = this;
                    this.addEventListener(function(sender,type)
                        {
                            switch (type) {
                                case ccui.CheckBox.EVENT_SELECTED:
                                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiaokaiguan", {uid:SelfUid()});
                                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", MjClient.setui.Slider_effect.getPercent() / 100);
                                    MjClient.setui.noEffect.setSelected(true);
                                    MjClient.setui.Slider_effect.setPercent(0);
                                    setEffectsVolume(0);
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiaokaiguan", {uid:SelfUid()});
                                    MjClient.setui.noEffect.setSelected(false);
                                    var v = util.localStorageEncrypt.getNumberItem("oldEffectVolume", 0);
                                    MjClient.setui.Slider_effect.setPercent(v * 100);
                                    setEffectsVolume(v);
                                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                                    break;
                            }
                        },this);
                    
                }
            },
            noMusic:{
                _run:function(){
                    this.setSelected(util.localStorageEncrypt.getNumberItem("oldMusicVolume", -1) != -1);
                    MjClient.setui.noMusic = this;
                    this.addEventListener(function(sender,type)
                        {
                            switch (type) {
                                case ccui.CheckBox.EVENT_SELECTED:
                                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinyuekaiguan", {uid:SelfUid()});
                                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", MjClient.setui.Slider_music.getPercent() / 100);
                                    MjClient.setui.noMusic.setSelected(true);
                                    MjClient.setui.Slider_music.setPercent(0);
                                    setMusicVolume(0);
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinyuekaiguan", {uid:SelfUid()});
                                    MjClient.setui.noMusic.setSelected(false);
                                    var v = util.localStorageEncrypt.getNumberItem("oldMusicVolume", 0);
                                    MjClient.setui.Slider_music.setPercent(v * 100);
                                    setMusicVolume(v);
                                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                                    break;
                            }
                        },this);
                }
            },
            noSpeak:{
                _run:function(){
                    MjClient.setui.noSpeak = this;
                    this.setSelected(util.localStorageEncrypt.getNumberItem("oldSpeakVolume", -1) != -1);
                    this.addEventListener(function(sender, type) {
                        switch (type) {
                            case ccui.CheckBox.EVENT_SELECTED:
                                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_YuYinYinLiangkaiguan", {
                                    uid: SelfUid()
                                });
                                util.localStorageEncrypt.setNumberItem("oldSpeakVolume", MjClient.setui.Slider_speak.getPercent() / 100);
                                MjClient.setui.noSpeak.setSelected(true);
                                MjClient.setui.Slider_speak.setPercent(0);
                                setSpeakVolume(0);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_YuYinYinLiangkaiguan", {
                                    uid: SelfUid()
                                });
                                MjClient.setui.noSpeak.setSelected(false);
                                var v = util.localStorageEncrypt.getNumberItem("oldSpeakVolume", 0);
                                MjClient.setui.Slider_speak.setPercent(v * 100);
                                setSpeakVolume(v);
                                util.localStorageEncrypt.setNumberItem("oldSpeakVolume", -1);
                                break;
                        }
                    }, this);
                }
            },
            Slider_effect:{
                _run:function(){ 
                    MjClient.setui.Slider_effect = this;
                    this.setPercent(getEffectsVolume()*100); 
                },
                _slider:function(sdr,tp){
                    setEffectsVolume(this.getPercent()/100);
                    MjClient.setui.noEffect.setSelected(false);
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                }
            },
            Slider_music:{
                _run:function(){
                    MjClient.setui.Slider_music = this;
                    this.setPercent(setMusicVolume(-1)*100); 
                },
                _slider:function(sdr,tp){
                    setMusicVolume(this.getPercent()/100);
                    MjClient.setui.noMusic.setSelected(false);
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                }
            },
            Slider_speak:{
                _run:function(){
                    MjClient.setui.Slider_speak = this;
                    this.setPercent(getSpeakVolume()*100);
                },
                _slider:function(sdr,tp){
                    setSpeakVolume(this.getPercent()/100);
                    MjClient.setui.noSpeak.setSelected(false);
                    util.localStorageEncrypt.setNumberItem("oldSpeakVolume", -1);
                }
            },
            delBtn:{
                _click:function(){
                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                    {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                // MjClient.setui.removeFromParent(true);
                                MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间
                                if (!MjClient.enterui && !getClubInfoInTable())
                                    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    }
                    else {
                        MjClient.showMsg("是否解散房间？", function () {
                            MjClient.delRoom(true);
                            // MjClient.setui.removeFromParent(true);
                            MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间
                        }, function(){}, 1);
                    }

                    MjClient.setui.removeFromParent();
                }
            },
            Text_ver:{
                _visible:true,
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    
                    if(MjClient.isShenhe == true){
                        this.setVisible(false);
                    }
                    this.setPositionY(this.getPositionY()+(this.getContentSize().height * 1.6));
                    //  一键修复按钮
                    var _fixBtn = new ccui.Button();
                    _fixBtn.loadTextureNormal("game_picture/yijianxiufu.png");
                    _fixBtn.loadTexturePressed("game_picture/yijianxiufu_p.png");
                    _fixBtn.addTouchEventListener(function(sender,Type){
                        switch (Type)
                        {
                            case ccui.Widget.TOUCH_ENDED:
                                removeUpdataDirectory();
                                break;
                            default :
                                break;
                        }
                    });
                    _fixBtn.setPosition(this.getContentSize().width*0.2 - 20, -this.getContentSize().height*2/3);
                    _fixBtn.setScale(1);
                    this.addChild(_fixBtn);
                },
                _text:function(){
                    return "      ";
                }
            }
        }
    },

    ctor:function(){
        this._super();
        var setui = ccs.load(this.jsonFile);
        this.addChild(setui.node);
        this._uiNode = setui.node;
        settingView = this;
        MjClient.setui = this;
        BindUiAndLogic(setui.node,this.jsBind);
        this.initParam();
        return true;
    },

    initParam : function(){
        var back = this._uiNode.getChildByName("back");
        //出牌语音
        this.initYuYin(back);

        //布局
        this.initBuJu(back);

        //游戏背景
        this.initBeiJiang(back);

        //出牌速度
        this.initSuDu(back);
    },

    //游戏背景
    initBeiJiang : function(parentNode){
        var beiJingList = [];
        beiJingList.push(parentNode.getChildByName("gameBg1"));
        beiJingList.push(parentNode.getChildByName("gameBg2"));
        beiJingList.push(parentNode.getChildByName("gameBg3"));

        this.loadGameBgTexture(parentNode);

        var type = MjClient.playui.getGameBgIdx();
        this.beiJingRadio = createRadioBoxForCheckBoxs(beiJingList, null, type);
        cc.eventManager.addListener(this.setTextClick(beiJingList,0,this.beiJingRadio),beiJingList[0].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,1,this.beiJingRadio),beiJingList[1].getChildByName("Image_2"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,2,this.beiJingRadio),beiJingList[2].getChildByName("Image_3"));
    
        this.beiJingRadio.setSelectCallBack(function(index, sender, nodeList){
            cc.log("EZP_gameBG : " + index);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE,  index);
 
            postEvent("EZP_gameBG", {});
        });
    },

    //出牌语音
    initYuYin : function(parentNode){
        var yuYinList = [];
        yuYinList.push(parentNode.getChildByName("voice_1"));
        yuYinList.push(parentNode.getChildByName("voice_2"));
        var type = MjClient.playui.getVoiceType();
        this.yuYinRadio = createRadioBoxForCheckBoxs(yuYinList, null, type);
        cc.eventManager.addListener(this.setTextClick(yuYinList,0,this.yuYinRadio),yuYinList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(yuYinList,1,this.yuYinRadio),yuYinList[1].getChildByName("text"));
        this.yuYinRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_VOICE_TYPE, index);
        });
    },

    //布局
    initBuJu : function(parentNode){
        var buJuList = [];
        buJuList.push(parentNode.getChildByName("effectType1"));
        buJuList.push(parentNode.getChildByName("effectType2"));
        var type = MjClient.playui.getLayoutType();
        this.buJuRadio = createRadioBoxForCheckBoxs(buJuList, null, type);
        cc.eventManager.addListener(this.setTextClick(buJuList,0,this.buJuRadio),buJuList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(buJuList,1,this.buJuRadio),buJuList[1].getChildByName("text"));
        this.buJuRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, index);
            postEvent("EZP_layout", {});
        });
    },

    loadGameBgTexture : function(parentNode){
        for (var i = 0; i<3; i ++)
        {
            var gameBg = parentNode.getChildByName("gameBg" + (i + 1));
            if (!gameBg)
                break;

            var file = "playing/gameTable/beijing_"+(i+1)+".jpg";
            if (file != "")
            {
                var texture = cc.textureCache.getTextureForKey(file);
                if (texture)
                    gameBg.getChildByName("Image_" + (i + 1)).loadTexture(file);
                else {
                    // 预加载游戏背景
                    gameBg.setVisible(false);
                    this.loadBgAsync(gameBg,gameBg.getChildByName("Image_" + (i + 1)), file);
                }
            }
            else
                gameBg.setVisible(false);
        }
    },

    //出牌速度
    initSuDu : function(parentNode){
        var suDuList = [];
        suDuList.push(parentNode.getChildByName("speed_bz"));
        suDuList.push(parentNode.getChildByName("speed_k"));
        suDuList.push(parentNode.getChildByName("speed_m"));
        suDuList.push(parentNode.getChildByName("speed_jk"));
        var type = MjClient.playui.getSuDuType();
        this.suDuRadio = createRadioBoxForCheckBoxs(suDuList, null, type);
        for(var i = 0; i < suDuList.length; i++){
            cc.eventManager.addListener(this.setTextClick(suDuList,i,this.suDuRadio),suDuList[i].getChildByName("text"));
        }
        this.suDuRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, index);
            postEvent("EZP_suDu", {});
        });
    },

    loadBgAsync : function(gameBg,imageView,file) {
        cc.textureCache.addImageAsync(file,function(texture) {
            gameBg.setVisible(true);
            imageView.loadTexture(file);
        });
    },

    //创建房间 点击范围扩大 使得文字也能点击
    setTextClick:function (listnode,number,radio) 
    {   
        var that = this;
        return cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {

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
                if(!cc.rectContainsPoint(box, pos))
                {
                    return false;
                }
                return true;
            },
            onTouchEnded: function (touch, event) { 

                var target = event.getCurrentTarget();
                var pos = target.getParent().convertTouchToNodeSpace(touch); // 世界坐标转换 (子节点相对于父节点的位置)
                if (listnode) {
                    for (var i = 0; i < listnode.length; i++) {
                        if (i==number) {
                            listnode[i].setSelected(true); 
                            radio.selectItem(i);
                        }else{
                            listnode[i].setSelected(false);
                        } 
                    }

                    //游戏语音
                    if (radio == that.yuYinRadio) {
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_VOICE_TYPE, number);
                    }

                    //游戏布局
                    if (radio == that.buJuRadio) {
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, number);
                        postEvent("EZP_layout", {});
                    }

                    //游戏背景
                    if (radio == that.beiJingRadio) {
                        cc.log("EZP_gameBG : " + number);
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, number);
                        setCurrentGameBgType(number);
                        postEvent("EZP_gameBG", {});
                    }

                    //出牌速度
                    if (radio == that.suDuRadio) {
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, number);
                        postEvent("EZP_suDu", {});
                    }
                }else{
                    // 如果触碰起始地点在本区域中
                    if(!cc.rectContainsPoint(target.getBoundingBox(), pos))
                        return;
                    target.parent.setSelected(!target.parent.isSelected());
                } 
            }
        });       
    }
});