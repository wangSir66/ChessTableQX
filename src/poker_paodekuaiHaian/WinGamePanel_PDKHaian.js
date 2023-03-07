var EndOneView_paodekuaiHaian = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiHaian_json);
	    return true;
	},
});

EndOneView_paodekuaiHaian.prototype.getPlayUIDirNodeData = function() {
	
	var tData = MjClient.data.sData.tData;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    text += "海安跑得快,";
    text += MjClient.MaxPlayerNum == 3 ? "3人场," : "2人场,";
    text += tData.areaSelectMode.handCardType == 0 ? "AAAA," : "AAA+2,",
    
    text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    text += tData.areaSelectMode.isBiMenFanBei ? "16张牌32分," : "";
    text += tData.areaSelectMode.winCountType == 0 ? "一个赢家," : "两两结算,";
    text += tData.areaSelectMode.baoDanMustPut ? "报单必顶," : "";
    text += tData.areaSelectMode.is15Thirty ? "15张牌30分," : "";
    text += tData.areaSelectMode.isZhaDanJiaFen ? "炸弹加分," : "";
    text += tData.areaSelectMode.canZhaDanDai1 ? "炸弹可带一张," : "";
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
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    text += ("房间号:" + tData.tableid);
    
    
    return text;

};


EndOneView_paodekuaiHaian.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    
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


EndOneView_paodekuaiHaian.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

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