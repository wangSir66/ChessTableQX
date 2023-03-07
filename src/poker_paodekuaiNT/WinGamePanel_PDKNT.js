var EndOneView_paodekuaiNT = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiNT_json);
	    return true;
	},
});

EndOneView_paodekuaiNT.prototype.SetInvalidPlayUI_PaoDeKuai = function() {};

EndOneView_paodekuaiNT.prototype.getPlayUIDirNodeData = function() {
    
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";
    text += "南通跑得快,";
    text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
    text += tData.areaSelectMode.handCardType == 0 ? "AAAA," : "AAA+2,",
    //text += tData.areaSelectMode.isZhaDanFanBei ? "炸弹翻倍," : "";
    //text += tData.areaSelectMode.mustPutHongTaoSan ? "先出红桃三," : "";
    text += tData.areaSelectMode.mustPut ? "能管必管," : "";
    text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    text += tData.areaSelectMode.isBiMenFanBei ? "16张牌32分," : "";
    text += tData.areaSelectMode.winCountType == 0 ? "一个赢家," : "两两结算,";
    text += tData.areaSelectMode.baoDanMustPut ? "报单必顶," : "";
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

    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
    {
        if(tData.areaSelectMode.fanBei == 0)
            text += "不翻倍,"
        else if (tData.areaSelectMode.fanBei == 1)
            text += "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
        else if (tData.areaSelectMode.fanBei == 2)
            text += "低于5分翻3倍,";
    }
        
    text += ("房间号:" + tData.tableid);

    return text;
};



EndOneView_paodekuaiNT.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

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

EndOneView_paodekuaiNT.prototype.setHeadUIZhaDanFanBei = function(node, pl) {

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    
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
