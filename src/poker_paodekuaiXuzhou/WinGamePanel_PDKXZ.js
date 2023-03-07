var EndOneView_paodekuaiXuzhou = EndOneView_PaoDeKuai.extend({
	
	ctor: function() {
	    this._super(res.EndOne_PaoDeKuaiXuzhou_json);
	    return true;
	},
});

EndOneView_paodekuaiXuzhou.prototype.getPlayUIDirNodeData = function() {

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var text = "";

        if (MjClient.endoneui.isNewUi) 
            text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";

        //text += "跑得快,";
        //text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
        //text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
        //text += tData.areaSelectMode.firstHeiTao3 ? "黑桃3先出," : "赢家先出,";
        text += tData.areaSelectMode.isXiaoGuan ? "小关X2," : "";
        text += tData.areaSelectMode.isDaGuan ? "大关X3," : "";
        text += tData.areaSelectMode.isDaGuanX2 ? "大关X2," : "";
        text += tData.areaSelectMode.can3daiNum == 1 ? "3带1," : "3带2,";
        //text += tData.areaSelectMode.can4dai2 ? "4带2," : "";
        text += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
        text += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
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
        
        text += tData.areaSelectMode.isZhaDanJiaFen ? "炸弹加分," : "";
        if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
        //text += tData.areaSelectMode.difen ? "底分X" + tData.areaSelectMode.difen + ",":"";

        if (!MjClient.endoneui.isNewUi)
            text += ("房间号:" + tData.tableid);

        if (text.charAt(text.length - 1) == ",")
            text = text.substring(0, text.length - 1);
        return text;
};
 

EndOneView_paodekuaiXuzhou.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

    if( (!pl.mjhandRecord) || (!pl.mjhandRecord.length) || (!pl.mjhand) ){
        return;
    }

    var arry = [];

    //添加手牌
    for (var i = 0; i < pl.mjhandRecord.length; i++) {
        var card = getNewCard_card(node, "stand", "mjhand", pl.mjhandRecord[i], 0);
        arry.push(card);
        // 如果是打出去的牌， 显示遮罩
        if( pl.mjhand.indexOf(pl.mjhandRecord[i]) < 0) {
            card.isGray = true;
            card.setColor(MjClient.grayColor);
        }
    }

    for (var i = 0; i < arry.length; i++) {
        arry[i].visible = true;
        arry[i].enabled = false;
        arry[i].setScale(arry[i].getScale() * 0.75);
    }
    CardLayoutRestoreForEndOne_ty(node, pl);  

};

EndOneView_paodekuaiXuzhou.prototype.setHeadUIWinNumColor = function(node,pl) {
    
    if(pl.winone < 0) { 
        node.setTextColor(cc.color(124,198,236));
        node.enableOutline(cc.color(92,100,199), 2);
    }   
};


EndOneView_paodekuaiXuzhou.prototype.SetInvalidPlayUI_PaoDeKuai = function(node, off) {


    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) {
        // 二人玩时，显示剩余的底牌
        if(tData.otherCards) {
            node.setVisible(true);
            for(var i in node.children) {
                var child = node.children[i];
                child.setVisible(false);
            }

            //添加手牌
            var stand_other = node.getChildByName("stand_other");
            node.getChildByName("head_bg").setVisible(true);
            node.getChildByName("stand_other_desc").setVisible(true);
            node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
            stand_other.setVisible(false)

            var stand = stand_other//head.getChildByName("stand");
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;

            for (var i = 0; i < tData.otherCards.length; i++) {
                var card = getNewCard_card(node, "stand_other", "mjhand", tData.otherCards[i], 0);
                card.visible = true;
                card.enabled = false;
                card.setScale(0.48);
                if (i != 0) {
                    offX += upSize.width * upS * 0.4;//调牌的距离的
                    card.x = offX;//调牌的距离的
                }else {
                    card.x = offX + upSize.width * upS * 0.1;
                }

            }

        }

        return;
    }

    node.setVisible(true);
    setUserOfflineWinGamePanel(node,pl);
}; 