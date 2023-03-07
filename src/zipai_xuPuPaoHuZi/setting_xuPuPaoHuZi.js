var setting_xuPuPaoHuZi = setting_ziPai.extend({
	ctor : function(){
		this._super("settingPanel_ziPai.json");
	},

	//胡息显示
    initHuXi : function(gongNeng){
        huxi = gongNeng.getChildByName("huxi").visible = false;
    },
    //手牌大小
    initCardSize : function(gongNeng){
        gongNeng.getChildByName("daxiao").visible = false;
        gongNeng.getChildByName("tingpai").y += 50;
    },
    //出牌语音
    initYuYin : function(huaMian){
        huaMian.getChildByName("music").getChildByName("voice_1").visible = false;
        huaMian.getChildByName("music").getChildByName("voice_2").visible = false;
        huaMian.getChildByName("music").getChildByName("yyin").visible = false;
    },

    //背景
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
    },

    //字体
    initCardType : function(huaMian){
        this._super(huaMian);
        var node = huaMian.getChildByName("ziPai");
        for (var i = 1; i <= 3; i++) {
            var img = node.getChildByName("ziPai" + i).getChildByName("Image");
            img.loadTexture('setting/xupuPhzFont_' + i + '.png');
            img.ignoreContentAdaptWithSize(true);
        }
    },
})