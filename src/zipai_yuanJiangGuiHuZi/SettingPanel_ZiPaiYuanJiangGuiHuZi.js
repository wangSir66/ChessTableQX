var SettingPanel_ZiPaiYuanJiangGuiHuZi = setting_ziPai.extend({
    //游戏背景
    initBeiJiang : function(huaMian){
        var beiJingList = [];
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg1"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg2"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg3"));
        var gameBg4 = huaMian.getChildByName("beiJing").getChildByName("gameBg4");
        if(gameBg4 && cc.sys.isObjectValid(gameBg4)){
            beiJingList.push(gameBg4);
        }
        this.loadGameBgTexture(huaMian);
        var type = MjClient.playui.getGameBgIdx();
        this.beiJingRadio = createRadioBoxForCheckBoxs(beiJingList, null, type);
        cc.eventManager.addListener(this.setTextClick(beiJingList,0,this.beiJingRadio),beiJingList[0].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,1,this.beiJingRadio),beiJingList[1].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,2,this.beiJingRadio),beiJingList[2].getChildByName("Image_1"));
        if(gameBg4 && cc.sys.isObjectValid(gameBg4)){
            cc.eventManager.addListener(this.setTextClick(beiJingList,3,this.beiJingRadio),beiJingList[3].getChildByName("Image_1"));
        }
        this.beiJingRadio.setSelectCallBack(function(index, sender, nodeList){
            cc.log("EZP_gameBG : " + index);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE,  index);
            postEvent("EZP_gameBG", {});
        });
    },

    loadGameBgTexture : function(huaMian){
        for (var i = 0; i < 4; i ++)
        {
            var gameBg = huaMian.getChildByName("beiJing").getChildByName("gameBg" + (i + 1));
            if (!gameBg)
                break;

            var file = "playing/paohuziTable/beijing_"+(i+1)+".jpg";
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

    //字牌字体
    initCardType : function(huaMian){
        var ziPaiList = [];
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai4"));

        var type = MjClient.playui.getCardFontIdx();
        for(var i = 0; i < ziPaiList.length; i++){
            ziPaiList[i].x = (huaMian.getChildByName("ziPai").width - 40) / (ziPaiList.length) * (i + 1);
        }
        this.ziPaiRadio = createRadioBoxForCheckBoxs(ziPaiList, null, type);
        for(var i = 0; i < ziPaiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(ziPaiList,i,this.ziPaiRadio),ziPaiList[i].getChildByName("Image"));
        }
        this.ziPaiRadio.setSelectCallBack(function(index, sender, nodeList){ 
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, index);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_MJBgType, index);
            postEvent("EZP_cardType", {idx:index, type:"font"});
        });
    },

    initHuXi : function(gongNeng){
       
        var huxi = gongNeng.getChildByName("huxi");
        huxi.getChildByName("title").ignoreContentAdaptWithSize(true);
        huxi.visible = false;
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

    //出牌按钮
    initChuPai : function(gongNeng){
        var chupai = gongNeng.getChildByName("chupai");
        chupai.getChildByName("title").ignoreContentAdaptWithSize(true);
        chupai.visible = true; //默认没有出牌按钮
        var type = MjClient.playui.getChuPaiType();
        var chupaiList = [];
        chupaiList.push(chupai.getChildByName("kaiqi"));
        chupaiList.push(chupai.getChildByName("guanbi"));
        this.chupaiRadio = createRadioBoxForCheckBoxs(chupaiList, null, type);
        for(var i = 0; i < chupaiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(chupaiList,i,this.chupaiRadio),chupaiList[i].getChildByName("text"));
        }
        this.chupaiRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_CHU_PAI_TYPE, index);
            postEvent("EZP_chuPai", index);
        });
    },
});