var settingPanel_xxGaoHuZi = setting_ziPai.extend({
	ctor : function(){
		this._super("settingPanel_ziPai.json");
	},

	//Override
    initChuPai : function(gongNeng){
        this._super(gongNeng);
        var chupai = gongNeng.getChildByName("chupai");
        chupai.visible = false;
    },

    //Override
    initCardType : function(huaMian){
        var ziPaiList = [];
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
        var ziPai4 = huaMian.getChildByName("ziPai").getChildByName("ziPai4");
        ziPai4.visible = false;
        ziPaiList[0].getChildByName("Image").loadTexture("setting/ziPai1.png");
        ziPaiList[1].getChildByName("Image").loadTexture("setting/ziPai4.png");
        ziPaiList[2].getChildByName("Image").loadTexture("setting/ziPai3.png");
        var type = MjClient.playui.getCardFontIdx();
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

    //出牌速度
    initSuDu : function(gongNeng){
        var suDuList = [];
        var man = gongNeng.getChildByName("suDu").getChildByName("man");
        var jiKuai = gongNeng.getChildByName("suDu").getChildByName("jiKuai");
        man.visible = true;
        jiKuai.visible = true;
        var daxiao = gongNeng.getChildByName("daxiao")
        var off = -daxiao.height * 0.8;
        daxiao.y += off;
        var tingpai = gongNeng.getChildByName("tingpai");
        tingpai.y += off;
        var huxi = gongNeng.getChildByName("huxi");
        huxi.y += off;
        var chupai = gongNeng.getChildByName("chupai");
        chupai.y += off;
        suDuList.push(man);
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("yb"));
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("bz"));
        suDuList.push(jiKuai);
        var type = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 1);
        this.suDuRadio = createRadioBoxForCheckBoxs(suDuList, null, type);
        for(var i = 0; i < suDuList.length; i++){
            cc.eventManager.addListener(this.setTextClick(suDuList,i,this.suDuRadio),suDuList[i].getChildByName("text"));
        }
        this.suDuRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, index);
            postEvent("EZP_suDu", {});
        });
    },

    //胡息显示
    initHuXi : function(gongNeng){
        var huxi = gongNeng.getChildByName("huxi");
        huxi.getChildByName("title").ignoreContentAdaptWithSize(true);
        huxi.visible = true;
        var huXiList = [];
        huXiList.push(huxi.getChildByName("guanbi"));
        huXiList.push(huxi.getChildByName("kaiqi"));
        var type = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
        this.huXiRadio = createRadioBoxForCheckBoxs(huXiList, null, type);
        for(var i = 0; i < huXiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(huXiList,i,this.huXiRadio),huXiList[i].getChildByName("text"));
        }
        this.huXiRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, index);
            postEvent("EZP_huXi", index);
        });
    },

    //听牌提示
    initTingPai : function(gongNeng){
        gongNeng.getChildByName("tingpai").visible = false;
    },

    //双击出牌
    initDoubleClick : function(gongNeng){
        var doubleClickToPut = gongNeng.getChildByName("doubleClickToPut");
        doubleClickToPut.getChildByName("title").ignoreContentAdaptWithSize(true);
        doubleClickToPut.y = gongNeng.getChildByName("tingpai").y;//默认放在听牌的位置
        doubleClickToPut.visible = true;//默认没有双击出牌
        var doubleClickToPutList = [];
        doubleClickToPutList.push(doubleClickToPut.getChildByName("guanbi"));
        doubleClickToPutList.push(doubleClickToPut.getChildByName("kaiqi"));
        var type = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_DOUBLE_CLICK_TYPE, 0);
        this.doubleClickToPutRadio = createRadioBoxForCheckBoxs(doubleClickToPutList, null, type);
        cc.eventManager.addListener(this.setTextClick(doubleClickToPutList,0,this.doubleClickToPutRadio),doubleClickToPutList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(doubleClickToPutList,1,this.doubleClickToPutRadio),doubleClickToPutList[1].getChildByName("text"));
        this.doubleClickToPutRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_DOUBLE_CLICK_TYPE, index);
        });
    },

    loadGameBgTexture : function(huaMian){
        for (var i = 0; i<3; i ++)
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
                    loadBgAsync(gameBg,gameBg.getChildByName("Image_1"),file);
                }
            }
            else
                gameBg.setVisible(false);
        }
    }
})