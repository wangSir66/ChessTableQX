var SettingPanel_CheHuZI = setting_ziPai.extend({
    jsonFile: "settingPanel_ziPai.json",
    ctor: function(){
        this._super(this.jsonFile);
    },
    //游戏背景
    initBeiJiang : function(huaMian){
        var beiJingList = [];
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg1"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg2"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg3"));
        var gameBg4 = huaMian.getChildByName("beiJing").getChildByName("gameBg4");
        if(gameBg4 && cc.sys.isObjectValid(gameBg4)){
            gameBg4.setVisible(false);
        }

        this.loadGameBgTexture(huaMian);
        huaMian.getChildByName("beiJing").x = huaMian.getChildByName("beiJing").x + 60;
        var type = MjClient.playui.getGameBgIdx();
        this.beiJingRadio = createRadioBoxForCheckBoxs(beiJingList, null, type);
        cc.eventManager.addListener(this.setTextClick(beiJingList,0,this.beiJingRadio),beiJingList[0].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,1,this.beiJingRadio),beiJingList[1].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,2,this.beiJingRadio),beiJingList[2].getChildByName("Image_1"));
        this.beiJingRadio.setSelectCallBack(function(index, sender, nodeList){
            cc.log("EZP_gameBG : " + index);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE,  index);
            postEvent("EZP_gameBG", {});
        });
    },

    loadGameBgTexture : function(huaMian){
        for (var i = 0; i < 3; i ++)
        {
            var gameBg = huaMian.getChildByName("beiJing").getChildByName("gameBg" + (i + 1));
            if (!gameBg)
                break;

                var file = "playing/gameTable/beijing_"+(i+1)+".jpg";
            if (file != "")
            {
                var texture = cc.textureCache.getTextureForKey(file);
                if (texture)
                    gameBg.getChildByName("Image_1").loadTexture(file);
                else {
                    // 预加载游戏背景
                    gameBg.setVisible(false);
                    this.loadBgAsync(gameBg,gameBg.getChildByName("Image_1"),file);
                }
            }
            else
                gameBg.setVisible(false);
        }
    },

    //字牌大小
    initCardType : function(huaMian){
        var ziPaiList = [];
        var font4 = huaMian.getChildByName("ziPai").getChildByName("ziPai4");
        if(font4 && cc.sys.isObjectValid(font4))
            font4.removeFromParent();

        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));

        var fontSize =["小", "大", "超大"];     
        for(var idx in ziPaiList){
            var child = ziPaiList[idx];
            child.removeAllChildren();
            child.x = child.x - 60;
            var text = ccui.Text.create(fontSize[idx], MjClient.fzcyfont, 28);
            text.setColor(cc.color(68,51,51));
            text.setAnchorPoint(cc.p(0, 0.5));
            text.setName("Text");
            child.addChild(text);
            text.setPosition(cc.p(50, child.getContentSize().height/2));
        }

        var type = MjClient.playui.getCardSizeIdx();
        this.cardSizeRadio = createRadioBoxForCheckBoxs(ziPaiList, null, type);
        for(var i = 0; i < ziPaiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(ziPaiList,i,this.cardSizeRadio),ziPaiList[i].getChildByName("Text"));
        }
        this.cardSizeRadio.setSelectCallBack(function(index, sender, nodeList){ 
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_CARD_SIZE, index);
            postEvent("EZP_cardType", {idx:index, type:"size"});
        });
    },

    //手牌大小
    initCardSize : function(gongNeng){
        var cardSizeList = [];
        gongNeng.getChildByName("daxiao").visible = false;
    },

     //听牌提示
     initTingPai : function(gongNeng){
        var tingpai = gongNeng.getChildByName("tingpai");
        tingpai.visible = false;
    },
    
    //胡息显示
    initHuXi : function(gongNeng){
        var huxi = gongNeng.getChildByName("huxi");
        huxi.setPosition(cc.pAdd(cc.p(huxi.x, huxi.y), cc.p(0, 100)));
        huxi.getChildByName("title").ignoreContentAdaptWithSize(true);
        var huXiList = [];
        huXiList.push(huxi.getChildByName("kaiqi"));
        huXiList.push(huxi.getChildByName("guanbi"));
        var type = MjClient.playui.getHuXiType();
        this.huXiRadio = createRadioBoxForCheckBoxs(huXiList, null, type);
        for(var i = 0; i < huXiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(huXiList,i,this.huXiRadio),huXiList[i].getChildByName("text"));
        }
        this.huXiRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, index);
            postEvent("EZP_huXi", index);
        });
    },
});