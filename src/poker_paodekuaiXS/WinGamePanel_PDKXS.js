var EndOneView_PaodekuaiXS= EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiXS_json);
	    return true;
	},
});

EndOneView_PaodekuaiXS.prototype.getPlayUIDirNodeData = function() {
    
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    if (MjClient.endoneui.isNewUi)
        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";

    text += tData.areaSelectMode.firstOutOption == 1 ? "红桃3先手," : "赢家先手(首局红桃3),";
    text += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    text += tData.areaSelectMode.can4dai1 ? "炸弹带一张," : "";
    text += tData.areaSelectMode.zhaDanFen ? "炸弹10分," : "";
    text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    text += tData.areaSelectMode.daGuan ? "大关," : "";
    text += tData.areaSelectMode.xiaoGuan ? "小关," : "";
    text += tData.areaSelectMode.mustPut ? "必管," : "非必管,";
    text += tData.areaSelectMode.difen == 1 ? "底分1分," : "底分2分,";


    if (!MjClient.endoneui.isNewUi)
        text += ("房间号:" + tData.tableid);

    if (text.charAt(text.length - 1) == ",")
        text = text.substring(0, text.length - 1);
    return text;
};



EndOneView_PaodekuaiXS.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

    
    var arry = [];

    //添加手牌
    for (var i = 0; i < pl.mjhand.length; i++) {
        arry.push(getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], 0));
    }

    for (var i = 0; i < arry.length; i++) {
        arry[i].visible = true;
        arry[i].enabled = false;
        arry[i].setScale(arry[i].getScale() * 0.75);
    }
    CardLayoutRestoreForEndOne_ty(node, pl);
};

EndOneView_PaodekuaiXS.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    
    var tData = MjClient.data.sData.tData;

    if (!tData.areaSelectMode.isZhaDanFanBei || !pl.zhaDanCount || pl.zhaDanCount <= 0 || pl.winone <= 0)
    {
        node.visible = false;
        return;
    }

    // "炸弹 x XX 倍"
    var sprites = [];
    sprites[0] = new cc.Sprite("gameOver/zhadan_cheng.png");
    var beishu = 1 << pl.zhaDanCount;
    for (var i = 1; beishu > 0; i ++)
    {
        var num = beishu % 10; 
        beishu = Math.floor(beishu / 10);
        sprites[i] = new cc.Sprite("gameOver/zhadan_" + num + ".png");
    }

    var width = 80 / sprites.length;
    for (var i = 0, len = sprites.length; i < len; i ++)
    {
        sprites[i].y = node.height/2;
        if (i == 0)
            sprites[i].x = 65 + width/2;
        else
            sprites[i].x = 65 + (len - i) * width + width/2;

        if (width < sprites[i].width)
            sprites[i].scale = width/sprites[i].width;

        node.addChild(sprites[i]);
    }

   

};
