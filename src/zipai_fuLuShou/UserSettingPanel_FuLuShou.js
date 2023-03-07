
MjClient.KEY_voiceType_HongZi = "KEY_voiceType_HongZi";
MjClient.KEY_MJBgType_HongZi  = "KEY_MJBgType_HongZi";
MjClient.KEY_gameBgType_HongZi = "KEY_gameBgType_HongZi";  

MjClient.KEY_bgMusicType = "BG_MUSIC_TYPE"

//选项选中时的颜色处理  统一处理
var FLS_SETTNG_COLOR_1 = cc.color(255,119,28);
var FLS_SETTNG_COLOR_2 = cc.color(118,99,42);

/*
    获取语言语音,返回值 0 表示普通话，1 表示本地话
 */
function getCurrentVoiceType_HongZi()
{
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_voiceType_HongZi, 0);
}

var UserSetting_MJBgType_HongZi = -1;
var UserSetting_GameBgType_HongZi = -1;
var UserSetting_pdkTableBgType = -1;
var UserSetting_sdhTableBgType = -1;
var UserSetting_ddzTableBgType = -1;

/**
 * 获取当前选择的游戏桌面背景
 * @return {Number}
 */
function getCurrentGameBgType_HongZi()
{
    if (UserSetting_GameBgType_HongZi != -1)
        return UserSetting_GameBgType_HongZi;
    else
        return util.localStorageEncrypt.getNumberItem(MjClient.KEY_gameBgType_HongZi, 0);
}

function setCurrentGameBgType_HongZi(gameBgType)
{
	UserSetting_GameBgType_HongZi = gameBgType;
    util.localStorageEncrypt.setNumberItem(MjClient.KEY_gameBgType_HongZi, gameBgType);
}

function setCurrentGameBgTypeToNext_HongZi()
{
    if (!MjClient.playui || typeof(GameClass[MjClient.gameType]) == "undefined")
        return;

    var max = 4;
    for (; max > 0; max --)
    {
        if (getGameBgFile(max) != "")
            break;
    }

    var current = getCurrentGameBgType_HongZi();
    if (current < max)
        current ++;
    else
        current = 0;

    setCurrentGameBgType_HongZi(current);
}

/**
 * 获取当前选择的麻将背景
 * @return {Number}
 */
function getCurrentMJBgType_HongZi()
{
    return ziPai.getZiPaiType();
    // if (UserSetting_MJBgType_HongZi != -1)
    //     return UserSetting_MJBgType_HongZi;
    // else
    //     return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJBgType_HongZi, 1);
}

var SettingView_HongZi = cc.Layer.extend({
	jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		back:
		{	_layout:[[0.80,0.93],[0.5,0.5],[0,0]],
		    close:{
				_click:function(){
				    if(MjClient.setui)
                    {
                        MjClient.setui.removeFromParent(true);
                        MjClient.setui = null;
                    }
				}
			},
			delBtn:{
				_click:function(){
                    //MjClient.delRoom(true);
                    //if(MjClient.setui)
                    //{
                    //    MjClient.setui.removeFromParent(true);
                    //    MjClient.setui = null;
                    //}
                    //MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间

                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                    {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                if(MjClient.setui)
                                {
                                    MjClient.setui.removeFromParent(true);
                                    MjClient.setui = null;
                                }
                                //if (!MjClient.enterui && !getClubInfoInTable())
                                //    MjClient.Scene.addChild(new EnterRoomLayer());
                            },
                            function() {});
                    }
                    else {
                        MjClient.showMsg("是否解散房间？", function () {
                            MjClient.delRoom(true);
                            if(MjClient.setui)
                            {
                                MjClient.setui.removeFromParent(true);
                                MjClient.setui = null;
                            }
                            MjClient.delRoomTime = new Date().getTime();//记录点击申请解散房间按钮的时间
                        }, function(){}, 1);
                    }
				}
			}
			,
			exitBtn:
			{
				_visible:MjClient.playui,
				_click:function(){
                   MjClient.logout();
                    if(MjClient.setui)
                    {
                        MjClient.setui.removeFromParent(true);
                        MjClient.setui = null;
                    }
				}
			},
            Btn_playrule: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.gameType,help:true});
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi_Chakanguize", {uid: SelfUid()});
                }
            },
            Text_ver:
                {
                    _visible:true,
                    _run:function(){
                      this.ignoreContentAdaptWithSize(true);
                      if(MjClient.isShenhe == true){
                          this.setVisible(false);
                      }
                    },
                    _text:function(){
                        return "Ver:" + MjClient.native.GetVersionName() + "(" + MjClient.resVersion + ")";
                    }
                },
			Slider_effect:{
				_run:function(){ this.setPercent(getEffectsVolume()*100); },
				_slider:function(sdr,tp){
				    setEffectsVolume(this.getPercent()/100);
                    MjClient.setui.noEffect.setSelected(false);
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
				}
			},
			Slider_music:{
				_run:function(){ this.setPercent(setMusicVolume(-1)*100); },
				_slider:function(sdr,tp){
				    setMusicVolume(this.getPercent()/100);
				    MjClient.setui.noMusic.setSelected(false);
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
				}
			}
		}
		

    },
    ctor:function () {
        this._super();

        var jsonFile = "setting.json";
        if (MjClient.playui && typeof(GameClass[MjClient.gameType]) != "undefined" && typeof(GameClassSettingJson[GameClass[MjClient.gameType]]) != "undefined")
        {
            var file = GameClassSettingJson[GameClass[MjClient.gameType]];
            if (jsb.fileUtils.isFileExist(file))
                jsonFile = file;
        } 


        var setui = ccs.load(jsonFile);
		BindUiAndLogic(setui.node,this.jsBind);
        this.addChild(setui.node);
		this.spNode = setui.node
        settingView = this;

		var _back = setui.node.getChildByName("back");
		var puTongHua = _back.getChildByName("voice_1");
        var puTongHua_txt = puTongHua.getChildByName("text")
        this.puTongHua_txt = puTongHua_txt;
        var benDiHua  = _back.getChildByName("voice_2");
        var benDiHua_txt = benDiHua.getChildByName("text")
        this.benDiHua_txt = benDiHua_txt;
        var nodeListHua = [];
        nodeListHua.push( puTongHua );
        nodeListHua.push( benDiHua );
        this._playNode_Hua_radio = createRadioBoxForCheckBoxs(nodeListHua);
        cc.eventManager.addListener(this.setTextClick(nodeListHua,0,this._playNode_Hua_radio),nodeListHua[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListHua,1,this._playNode_Hua_radio),nodeListHua[1].getChildByName("text"));
    
        this.noEffect = _back.getChildByName("noEffect");
        this.noMusic = _back.getChildByName("noMusic");
        this.Slider_effect = _back.getChildByName("Slider_effect");
        this.Slider_music = _back.getChildByName("Slider_music");

        this.noEffect.setSelected(util.localStorageEncrypt.getNumberItem("oldEffectVolume", -1) != -1);
        this.noMusic.setSelected(util.localStorageEncrypt.getNumberItem("oldMusicVolume", -1) != -1);

        this.noEffect.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiaokaiguan", {uid:SelfUid()});
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", this.Slider_effect.getPercent() / 100);
                    this.noEffect.setSelected(true);
                    this.Slider_effect.setPercent(0);
                    setEffectsVolume(0);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinxiaokaiguan", {uid:SelfUid()});
                    this.noEffect.setSelected(false);
                    var v = util.localStorageEncrypt.getNumberItem("oldEffectVolume", 0);
                    this.Slider_effect.setPercent(v * 100);
                    setEffectsVolume(v);
                    util.localStorageEncrypt.setNumberItem("oldEffectVolume", -1);
                    break;
            }
        },this);

        this.noMusic.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinyuekaiguan", {uid:SelfUid()});
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", this.Slider_music.getPercent() / 100);
                    this.noMusic.setSelected(true);
                    this.Slider_music.setPercent(0);
                    setMusicVolume(0);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    MjClient.native.umengEvent4CountWithProperty("Zhujiemian_Shezhi_Yinyuekaiguan", {uid:SelfUid()});
                    this.noMusic.setSelected(false);
                    var v = util.localStorageEncrypt.getNumberItem("oldMusicVolume", 0);
                    this.Slider_music.setPercent(v * 100);
                    setMusicVolume(v);
                    util.localStorageEncrypt.setNumberItem("oldMusicVolume", -1);
                    break;
            }
        },this);

        if(MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ){
            FLS_SETTNG_COLOR_1 = cc.color(94,119,199);
            FLS_SETTNG_COLOR_2 = cc.color(91,95,128);
        }

        //海安隐藏普通话，本地话声音
        if( MjClient.getAppType() === MjClient.APP_TYPE.QXHAIANMJ)
        {
            puTongHua.visible = false;
            benDiHua.visible = false;
            benDiHua.setTouchEnabled(false);
        }




        puTongHua.setSelected(true);
        benDiHua.setSelected(false);
        puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
        benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
        benDiHua_txt.ignoreContentAdaptWithSize(true);
        puTongHua_txt.ignoreContentAdaptWithSize(true);
		var voiceType = getCurrentVoiceType_HongZi();
        if(voiceType  == 0)
        {
            puTongHua.setSelected(true);
            benDiHua.setSelected(false);
            puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
            benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
        }else{
            puTongHua.setSelected(false);
            benDiHua.setSelected(true);
            benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
            puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
        }

        benDiHua.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    puTongHua.setSelected(false);
                    benDiHua.setSelected(true);
                    benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
                    puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
                    util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType_HongZi, 1);
                    break;
            }
        },this);

        puTongHua.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    puTongHua.setSelected(true);
                    benDiHua.setSelected(false);
                    puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
                    benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
                    util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType_HongZi, 0);
                    break;
            }
        },this);

        var gameBgText = _back.getChildByName("gameBg");
        if (gameBgText)
            gameBgText.ignoreContentAdaptWithSize(true);

        var MJBgext = _back.getChildByName("MJBg");
        if (MJBgext)
            MJBgext.ignoreContentAdaptWithSize(true);

        // 桌面背景设置：
        var nodeListgameBg = [];
        for (var i = 0; true; i ++)
        {
            var gameBg = _back.getChildByName("gameBg" + (i + 1));
            if (!gameBg)
                break;
            cc.log(" ============== " + (i + 1));
            var file = getGameBgFile(i);
            if (file != "")
                gameBg.getChildByName("Image_" + (i + 1)).loadTexture(file);
            else
                gameBg.setVisible(true);

            nodeListgameBg.push(gameBg);
        }
        this._playNode_gameBg_radio = createRadioBoxForCheckBoxs(nodeListgameBg);
        for (var i = 0; i < nodeListgameBg.length; i ++)
        {
            var image_node = nodeListgameBg[i].getChildByName("Image_" + (i + 1));
            cc.eventManager.addListener(this.setTextClick(nodeListgameBg, i, this._playNode_gameBg_radio), image_node);
            var text_node = nodeListgameBg[i].getChildByName("text");
            if (text_node)
                cc.eventManager.addListener(this.setTextClick(nodeListgameBg, i, this._playNode_gameBg_radio), text_node);
        }

        var gameBgEventCb = function (sender, type) {
            if (type == ccui.CheckBox.EVENT_SELECTED || type == ccui.CheckBox.EVENT_UNSELECTED)
            {
                var gameBgType = 0;
                for (var i = 0; i < nodeListgameBg.length; i ++)
                {
                    nodeListgameBg[i].setSelected(sender == nodeListgameBg[i]);
                    if (sender == nodeListgameBg[i])
                        gameBgType = i; 
                }

                setCurrentGameBgType_HongZi(gameBgType);
                postEvent("changeGameBgEvent");
            }
        }

        var gameBgType = getCurrentGameBgType_HongZi();
        for (var i = 0; i < nodeListgameBg.length; i ++)
        {
            nodeListgameBg[i].setSelected(gameBgType == i);
            nodeListgameBg[i].addEventListener(gameBgEventCb, this);
        }

        // 字牌字体设置：
        var nodeListMJBg = [];
        for (var i = 0; true; i ++)
        {
            var MJBg = _back.getChildByName("MJBg" + (i + 1));
            if (!MJBg)
                break;

            nodeListMJBg.push(MJBg);
        }
        this._playNode_MJBg_radio = createRadioBoxForCheckBoxs(nodeListMJBg);
        for (var i = 0; i < nodeListMJBg.length; i ++)
        {
            cc.eventManager.addListener(this.setTextClick(nodeListMJBg, i, this._playNode_MJBg_radio), nodeListMJBg[i].getChildByName("Image"));
            var text_node = nodeListMJBg[i].getChildByName("text");
            if (text_node)
                cc.eventManager.addListener(this.setTextClick(nodeListMJBg, i, this._playNode_MJBg_radio), text_node);
        }

        var MJBgEventCb = function (sender, type) {
            if (type == ccui.CheckBox.EVENT_SELECTED || type == ccui.CheckBox.EVENT_UNSELECTED)
            {
                var type = 0;
                for (var i = 0; i < nodeListMJBg.length; i ++)
                {
                    nodeListMJBg[i].setSelected(sender == nodeListMJBg[i]);
                    if (sender == nodeListMJBg[i])
                        type = i;
                }

                if (MjClient.getAppType() == MjClient.APP_TYPE.QXTHMJ)
                {
                    if (type == 0)
                        type = 3;
                }

                util.localStorageEncrypt.setNumberItem(MjClient.KEY_MJBgType_HongZi, type);
                UserSetting_MJBgType_HongZi = type;
                postEvent("changeMJBgEvent", type);
            }
        }

        var MJBgType = getCurrentMJBgType_HongZi();
        cc.log("MJBgType = " + MJBgType);
        for (var i = 0; i < nodeListMJBg.length; i ++)
        {
            if (i == 0 && MjClient.getAppType() == MjClient.APP_TYPE.QXTHMJ)
                nodeListMJBg[i].setSelected(MJBgType == 3);
            else
                nodeListMJBg[i].setSelected(MJBgType == i);
            nodeListMJBg[i].addEventListener(MJBgEventCb, this);
        }

		MjClient.setui=this;
		//cc.log("machao_data "+JSON.stringify(MjClient.data));
        return true;
    },
    //创建房间 点击范围扩大 使得文字也能点击
    setTextClick:function (listnode,number,radio,callback) 
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
                    // gameBgEventCb  this._playNode_gameBg_radio
                    if (radio == that._playNode_gameBg_radio) {
                         cc.log(" ======= sender  gameBg",number);
                        var gameBgType = number;
                        setCurrentGameBgType_HongZi(gameBgType);
                        postEvent("changeGameBgEvent");
                    }
                    // _playNode_MJBg_radio
                    if (radio == that._playNode_MJBg_radio) {
                         cc.log(" ======= sender  MJBg  ",number);
                        var type = number;

                        if (MjClient.getAppType() == MjClient.APP_TYPE.QXTHMJ)
                        {
                            if (type == 0)
                                type = 3;
                        }
                        
                        util.localStorageEncrypt.setNumberItem(MjClient.KEY_MJBgType_HongZi, type);
                        UserSetting_MJBgType_HongZi = type;
                        postEvent("changeMJBgEvent", type);
                    }

                    // _playNode_Hua_radio 
                    if (radio == that._playNode_Hua_radio) {
                         cc.log(" ======= sender  Hua  ",number);
                        if (number == 0) {
                            that.puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
                            that.benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
                            util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType_HongZi, 0);
                        }
                        if (number == 1) {
                            that.benDiHua_txt.setTextColor(FLS_SETTNG_COLOR_1);
                            that.puTongHua_txt.setTextColor(FLS_SETTNG_COLOR_2);
                            util.localStorageEncrypt.setNumberItem(MjClient.KEY_voiceType_HongZi, 1);
                        }
                    }
                    // _playNode_bgMusic_radio
                    if (radio == that._playNode_bgMusic_radio) {
                         cc.log(" ======= sender  bgMusic  ",number);
                    var bgMusicType = number;
                    
                    that.bgMusic1_txt.setTextColor(bgMusicType  == 0 ? FLS_SETTNG_COLOR_1 : FLS_SETTNG_COLOR_2);
                    that.bgMusic2_txt.setTextColor(bgMusicType  == 1 ? FLS_SETTNG_COLOR_1 : FLS_SETTNG_COLOR_2);
                    that.bgMusic3_txt.setTextColor(bgMusicType  == 2 ? FLS_SETTNG_COLOR_1 : FLS_SETTNG_COLOR_2);

                    util.localStorageEncrypt.setNumberItem(MjClient.KEY_bgMusicType, bgMusicType);
                    playMusic(getCurrentBgMusicName());
                        
                    }

                }else{
                    // 如果触碰起始地点在本区域中
                    if(!cc.rectContainsPoint(target.getBoundingBox(), pos))
                        return;
                    
                    target.parent.setSelected(!target.parent.isSelected());
                    if (callback)
                        callback();
                }
                
            }
        });       
    },
    onEnter:function () 
	{
        this._super();
       	if (this.getName() == "HomeClick") 
       	{
       		this.jsBind.back.exitBtn._node.visible = true;
       		this.jsBind.back.exitBtn._node.setEnabled(true);
       		this.jsBind.back.delBtn._node.visible= false;
       		this.jsBind.back.delBtn._node.setEnabled(false);
       	}
		else if(this.getName() == "PlayLayerClick")
       	{
       		var sData=MjClient.data.sData;
			var tData=sData.tData;
			//cc.log("machao_data "+JSON.stringify(MjClient.data));
       		//cc.log("machao_tdata "+JSON.stringify(tData));

       		this.jsBind.back.exitBtn._node.visible = false;
       		this.jsBind.back.exitBtn._node.setEnabled(false);

            //增加CD时间10s
            this.jsBind.back.delBtn._node.visible = true;
            var text = new ccui.Text();
            text.setTextColor(cc.color(123,78,63));
            text.setFontSize(32);
            text.setString("");
            text.setPosition(94,98);
            text.setName("textString");
            this.jsBind.back.delBtn._node.addChild(text);
            if (cc.isUndefined(MjClient.delRoomTime))
            {
                MjClient.delRoomTime = 0;
            }
            this.jsBind.back.delBtn._node.schedule(function()
            {
                var time = (new Date().getTime()) - MjClient.delRoomTime;
                time = parseInt(time/1000);
                if (time >= 10)
                {
                    MjClient.setui.jsBind.back.delBtn._node.setEnabled(true);
                    text.setString("");
                }
                else
                {
                    MjClient.setui.jsBind.back.delBtn._node.setEnabled(false);+
                    text.setString((10-time).toString() + "秒后可再次申请");
                }
            });
            if(tData.matchId){
                this.jsBind.back.delBtn._node.visible = false;
                MjClient.setui.jsBind.back.delBtn._node.setEnabled(false);
            }
       	}
	}
});