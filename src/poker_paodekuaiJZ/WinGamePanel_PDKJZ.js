var EndOneView_PaoDeKuaiJZ = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiJZ_json);
	    return true;
	},
});

EndOneView_PaoDeKuaiJZ.prototype.getPlayUIDirNodeData = function() {
    
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";
    var _roundText = "";
    var _currentRound = tData.roundAll - tData.roundNum;
    if(_currentRound > tData.roundAll) _currentRound = tData.roundAll;
    _roundText = ",局数:" + _currentRound + "/" + tData.roundAll;
    var roundNumPre = typeof(tData.roundNumPre) != "undefined" ? tData.roundNumPre : tData.roundNum;
    if (roundNumPre && tData.roundAll - tData.roundNumPre + 1 <= tData.roundAll)
    {
        var _currentRound = tData.roundAll - tData.roundNumPre + 1;
        if(_currentRound > tData.roundAll) _currentRound = tData.roundAll;
        _roundText = ",局数:" + _currentRound + "/" + tData.roundAll;
    }
    text += ("房间号:" + tData.tableid);
    text += _roundText;

    return text;
};

EndOneView_PaoDeKuaiJZ.prototype.SetInvalidPlayUI_PaoDeKuai = function(node, off) {
};

EndOneView_PaoDeKuaiJZ.prototype.getPlayUIDir_0NodeData = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    text += GameCnName[MjClient.gameType] + ",";
    text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";

    if (tData.areaSelectMode.firstHeiTao3)
        text += "黑桃3先出,";
    else if (tData.areaSelectMode.firstOutOption == 2)
        text += "轮庄,";
    else
        text += "赢家先出,";

    text += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";
    text += tData.areaSelectMode.mustPut ? "能管必管," : "";
    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "";

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

    text += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ",":"";
    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";

    text += tData.areaSelectMode.baoDanPutMax ? "下家报单出大牌," : "";
    text += tData.areaSelectMode.playerPutZhaDan ? "打出玩家," : "";
    text += tData.areaSelectMode.zhaDanBuFanBei ? "炸弹不翻倍," : "";

    if (text.charAt(text.length - 1) == ",")
        text = text.substring(0, text.length - 1);

    return text;
            
};


EndOneView_PaoDeKuaiJZ.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

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

EndOneView_PaoDeKuaiJZ.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    
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
