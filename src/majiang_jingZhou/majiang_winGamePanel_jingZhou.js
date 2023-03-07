//靖州麻将小结算
var majiang_winGamePanel_jingZhou = majiang_winGamePanel_shaoyang.extend({
});

// 显示抓鸟内容
majiang_winGamePanel_jingZhou.prototype.showAddBird = function(back, tData){
	//显示抓鸟的牌
    var img_bridTips = back.getChildByName("img_bridTips");
    var cards = tData.mopai || [];
    var cardNode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
    var countNode = img_bridTips.getChildByName("text_count");
    cardNode.visible = false;
    var slotwith = cardNode.width * cardNode.scale * 0.9;//0.05;

	var zhongCount = 0;
    for(var i = 0;i < cards.length;i++){
        var cloneNode = util.clone(cardNode);
        cloneNode.setName(MjClient.playui.HandleCardType["Chi"]);
        cloneNode.setTag(cards[i]);
        cloneNode.visible = true;
        cloneNode.setPosition(cc.p(cardNode.x + slotwith*i,cardNode.y));
		img_bridTips.addChild(cloneNode);
        MjClient.playui.setCardSprite(cloneNode, cards[i], true);

        if (this.isZhongNiao(cards[i])) {
            zhongCount++;
        }else{
        	cloneNode.setColor(cc.color(170,170,170));
        }
    }

    if(zhongCount == 0){
    	countNode.setVisible(false);
    }else{
    	var pos = cc.p(cardNode.x + slotwith * cards.length  - slotwith/2, cardNode.y);
    	countNode.setPosition(pos);
    	countNode.setString("+" + zhongCount);
    }
};