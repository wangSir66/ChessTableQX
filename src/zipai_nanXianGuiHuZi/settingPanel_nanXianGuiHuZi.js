var settingPanel_nanXianGuiHuZi = setting_ziPai.extend({
    ctor : function(jsonSrc){
        this._super(jsonSrc);
    }, 
    //Override
    initChuPai : function(gongNeng){
        this._super(gongNeng);
        var chupai = gongNeng.getChildByName("chupai");
        chupai.visible = true;
    },

    initHuXi : function(gongNeng){
        var huxi = gongNeng.getChildByName("huxi"); 
        huxi.visible = false;
         
    },

    initBeiJiang : function(huaMian){
        this._super(huaMian);
        var gameBg4 = huaMian.getChildByName("beiJing").getChildByName("gameBg4");
        gameBg4.visible = true;
        huaMian.getChildByName("beiJing").x = huaMian.getChildByName("beiJing").x - 60;
    },
    //字牌字体
    initCardType : function(huaMian){
        var ziPaiList = [];
        for(var i = 0; i < MjClient.playui.getCardFontList().length; i++){
            var pai = huaMian.getChildByName("ziPai").getChildByName("ziPai" + (i + 1));
            ziPaiList.push(pai);
            pai.getChildByName("Image").loadTexture("setting/ziPai" + (i + 1)+ ".png");
        }
        for(var i = 0; i < ziPaiList.length; i++){
            ziPaiList[i].x = (huaMian.getChildByName("ziPai").width - 40) / (ziPaiList.length) * (i + 1);
        }
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
    }
 
    
})