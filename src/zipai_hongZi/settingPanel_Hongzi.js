var settingPanel_Hongzi = setting_ziPai.extend({
	ctor : function(){
		this._super("ziPai_Setting.json");
	},
	//游戏背景
    initBeiJiang : function(huaMian){
        var beiJingList = [];
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg1"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg2"));
        beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg3"));
        if(huaMian.getChildByName("beiJing").getChildByName("gameBg4")){
            beiJingList.push(huaMian.getChildByName("beiJing").getChildByName("gameBg4"));
        }
        this.loadGameBgTexture(huaMian);
        //huaMian.getChildByName("beiJing").x = huaMian.getChildByName("beiJing").x + 60;
        var gameBg4 = huaMian.getChildByName("beiJing").getChildByName("gameBg4");
        if(cc.sys.isObjectValid(gameBg4))
            gameBg4.visible = true;
        var type = MjClient.playui.getGameBgIdx();
        this.beiJingRadio = createRadioBoxForCheckBoxs(beiJingList, null, type);
        cc.eventManager.addListener(this.setTextClick(beiJingList,0,this.beiJingRadio),beiJingList[0].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,1,this.beiJingRadio),beiJingList[1].getChildByName("Image_1"));
        cc.eventManager.addListener(this.setTextClick(beiJingList,2,this.beiJingRadio),beiJingList[2].getChildByName("Image_1"));
        if(gameBg4){
            cc.eventManager.addListener(this.setTextClick(beiJingList,3,this.beiJingRadio),beiJingList[3].getChildByName("Image_1"));
        }
        this.beiJingRadio.setSelectCallBack(function(index, sender, nodeList){
            cc.log("EZP_gameBG : " + index);
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE,  index);
            // postEvent("changeGameBgEvent", {});
            postEvent("EZP_gameBG", {});
        });
    },
	loadGameBgTexture : function(huaMian){
        for (var i = 0; i<4; i ++)
        {
            var gameBg = huaMian.getChildByName("beiJing").getChildByName("gameBg" + (i + 1));
            if (!gameBg)
                break;

            var file = "hongZi/gameTable/beijing_"+(i+1)+".jpg";
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
    initCardType : function(huaMian){
        var ziPaiList = [];
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
        var ziPai4 = huaMian.getChildByName("ziPai").getChildByName("ziPai4");
        ziPai4.visible = false;
        ziPaiList[0].getChildByName("Image").loadTexture("setting/ziPai1.png");
        ziPaiList[1].getChildByName("Image").loadTexture("setting/ziPai2.png");
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
        //胡息显示
    initHuXi : function(gongNeng){
        var huxi = gongNeng.getChildByName("huxi");
        huxi.visible = false;
    },
        //听牌提示
    initTingPai : function(gongNeng){
        var tingpai = gongNeng.getChildByName("tingpai");
        tingpai.visible = false;
    },

    //出牌速度
    initSuDu : function(gongNeng){
        var suDuList = [];
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("yb"));
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("bz"));
        var man = gongNeng.getChildByName("suDu").getChildByName("man");
        var jiKuai = gongNeng.getChildByName("suDu").getChildByName("jiKuai");
        man.visible = false;
        jiKuai.visible = false;
        suDuList.push(man);
        suDuList.push(jiKuai);
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

    //手牌大小
    initCardSize : function(gongNeng){
        var cardSizeList = [];
        cardSizeList.push(gongNeng.getChildByName("daxiao").getChildByName("da"));
        cardSizeList.push(gongNeng.getChildByName("daxiao").getChildByName("xiao"));
        var superCard = gongNeng.getChildByName("daxiao").getChildByName("super");
        superCard.visible = false;
        var smallCard = gongNeng.getChildByName("daxiao").getChildByName("xiao");
        // var tempX = smallCard.x;
        // smallCard.x = superCard.x;
        // superCard.x = tempX;
        //cardSizeList.push(superCard);
        // cardSizeList.push(gongNeng.getChildByName("suDu").getChildByName("js"));
        var type = MjClient.playui.getCardSizeIdx();
        this.cardSizeRadio = createRadioBoxForCheckBoxs(cardSizeList, null, type);
        for(var i = 0; i < cardSizeList.length; i++){
            cc.eventManager.addListener(this.setTextClick(cardSizeList,i,this.cardSizeRadio),cardSizeList[i].getChildByName("text"));
        }
        this.cardSizeRadio.setSelectCallBack(function(index, sender, nodeList){  
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_CARD_SIZE, index);
            // postEvent("changeMJBgEvent", {});
            postEvent("EZP_cardType", {idx:index, type:"size"});
        });
    },
})