var EndOneView_PaodekuaiHuaian = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiHuaian_json);
	    return true;
	},
});

EndOneView_PaodekuaiHuaian.prototype.getPlayUIDirNodeData = function() {

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    if (MjClient.endoneui.isNewUi)
        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";

    text += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
    text += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
    text += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";
    text += tData.areaSelectMode.mustPutHongTaoSan ? "红桃3先手," : "赢家先手,";
    text += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    // text += tData.areaSelectMode.can3dai2 ? "三带二," : "";
    text += tData.areaSelectMode.isZhaDanFanBei ? "炸弹翻倍," : "";
    text += tData.areaSelectMode.tongHuaShun ? "同花顺," : "";
    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

    if (typeof(tData.areaSelectMode.fengDing) == "number") {
        switch (tData.areaSelectMode.fengDing)
        {
            case 1:
                text += "30/32分封顶,";
                break;
            case 2:
                text += "60/64分封顶,";
                break;
        }
    }
    
    //text += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ",":"";
    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";

    if (!MjClient.endoneui.isNewUi)
        text += ("房间号:" + tData.tableid);

    if (text.charAt(text.length - 1) == ",")
        text = text.substring(0, text.length - 1);
    
    return text;

};



EndOneView_PaodekuaiHuaian.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    
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


EndOneView_PaodekuaiHuaian.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

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
