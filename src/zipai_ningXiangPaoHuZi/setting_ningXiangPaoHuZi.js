
var setting_ningXiangPaoHuZi = setting_ziPai.extend({
	ctor : function(jsonSrc){
		this._super(jsonSrc);
	},
    //字牌字体
    initCardType : function(huaMian){
        var ziPaiList = [];
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
        ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
        var ziPai4 = huaMian.getChildByName("ziPai").getChildByName("ziPai4");
        ziPai4.visible = false;
        ziPaiList[0].getChildByName("Image").loadTexture("setting/ziPai_5.png");
        ziPaiList[1].getChildByName("Image").loadTexture("setting/ziPai_4.png");
        ziPaiList[2].getChildByName("Image").loadTexture("setting/ziPai_3.png");
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
})