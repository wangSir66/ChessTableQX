var setting_96poker = setting_ziPai.extend({
	ctor : function(){
		this._super("ziPai_96pokerSetting.json");
	},

    initExtend:function(huaMian, gongNeng) {
        if(cc.sys.isObjectValid(huaMian)) {
            //布局
            huaMian.getChildByName("buJu").visible = false;
            huaMian.getChildByName("line_0").visible = false;
            //语音
            var music = huaMian.getChildByName("music");
            music.getChildByName("voice_1").visible = false;
            music.getChildByName("voice_2").visible = false;
            music.getChildByName("yyin").visible = false;
            //字牌
            huaMian.getChildByName("ziPai").visible = false;
        }

        if(cc.sys.isObjectValid(gongNeng)) {
            //快速吃牌
            gongNeng.getChildByName("chiPai").visible = false;
            //听牌
            var daxiao = gongNeng.getChildByName("daxiao")
            var off = daxiao.height * 0.8;
            var tingpai = gongNeng.getChildByName("tingpai");
            tingpai.visible = false;
            //tingpai.y += off;
            //胡息显示
            gongNeng.getChildByName("huxi").visible = false;
        }

        this.initPaiBei(huaMian);
    },

    initPaiBei:function(huaMian) {
        var paiBei = huaMian.getChildByName("paiBei");
        var paiBeiList = [];
        paiBeiList.push(paiBei.getChildByName("paiBei1"));
        paiBeiList.push(paiBei.getChildByName("paiBei2"));
        paiBeiList.push(paiBei.getChildByName("paiBei3"));
        paiBeiList[0].getChildByName("Image").loadTexture("playing/96poker/cards/paiBei0.png");
        paiBeiList[1].getChildByName("Image").loadTexture("playing/96poker/cards/paiBei1.png");
        paiBeiList[2].getChildByName("Image").loadTexture("playing/96poker/cards/paiBei2.png");
        var type = MjClient.playui.getPaiBeiIdx();
        this.paiBeiRadio = createRadioBoxForCheckBoxs(paiBeiList, null, type);
        for(var i = 0; i < paiBeiList.length; i++){
            cc.eventManager.addListener(this.setTextClick(paiBeiList,i,this.paiBeiRadio),paiBeiList[i].getChildByName("Image"));
        }
        this.paiBeiRadio.setSelectCallBack(function(index, sender, nodeList){ 
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_PAI_BEI, index);
            postEvent("EZP_paiBei", index);
        });
    }
})