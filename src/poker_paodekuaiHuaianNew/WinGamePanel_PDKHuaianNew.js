var EndOneView_PaodekuaiHuaianNew = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiHuaianNew_json);
	    return true;
	},
});

EndOneView_PaodekuaiHuaianNew.prototype.getPlayUIDirNodeData = function() {
	
	var tData = MjClient.data.sData.tData;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    if (MjClient.endoneui.isNewUi)
    {
        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";
    }

    /*text += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
    text += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
    text += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";*/
    text += tData.areaSelectMode.mustPutHongTaoSan ? "红桃3先手," : "赢家先手,";
    text += tData.areaSelectMode.mustPut ? "必管," : "非必管,";
    text += tData.areaSelectMode.isXunHangDaoDanPlay ? "巡航导弹玩法," : "";
    text += tData.areaSelectMode.canZhaDanDai1 ? "炸弹可带一张,":"";
    text += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    text += tData.areaSelectMode.mustPut2 ? "2必管第一张A," : "";
    // text += tData.areaSelectMode.can3dai2 ? "三带二," : "";
    text += tData.areaSelectMode.bombScore == 0 ? ("炸弹加"+(tData.areaSelectMode.bombScoreCnt==0? 5:10)+"分,") : "炸弹翻倍,";
    text += tData.areaSelectMode.tongHuaShun ? "同花顺," : "";
    text += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ",":"";
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

    if (!MjClient.endoneui.isNewUi)
        text += ("房间号:" + tData.tableid);

    if (text.charAt(text.length - 1) == ",")
        text = text.substring(0, text.length - 1);

    
    return text;

};



EndOneView_PaodekuaiHuaianNew.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    
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



EndOneView_PaodekuaiHuaianNew.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

    var arry = [];

    //添加手牌
    for (var i = 0; i < pl.mjhandRecord.length; i++) {
        var card = getNewCard_card(node, "stand", "mjhand", pl.mjhandRecord[i], 0);
        arry.push(card);
        // 如果是打出去的牌， 显示遮罩
        if( pl.mjhand.indexOf(pl.mjhandRecord[i]) < 0) {
            card.isGray = true;
            card.setColor(cc.color(190,190,190));
        }
    }

    for (var i = 0; i < arry.length; i++) {
        arry[i].visible = true;
        arry[i].enabled = false;
        arry[i].setScale(arry[i].getScale() * 0.75);
    }
    CardLayoutRestoreForEndOne_ty(node, pl);

    
}; 
