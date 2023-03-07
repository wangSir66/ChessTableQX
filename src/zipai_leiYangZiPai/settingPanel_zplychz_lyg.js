var settingPanel_zplychz_lyg = setting_ziPai.extend({
	ctor : function(){
		this._super();
	},

    //出牌语音
    initYuYin : function(huaMian){
        huaMian.getChildByName("music").getChildByName("yyin").visible = false;
        huaMian.getChildByName("music").getChildByName("voice_1").visible = false;
        huaMian.getChildByName("music").getChildByName("voice_2").visible = false;
    },
})