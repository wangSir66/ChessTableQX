/***
 * 安化七王麻将通用小结算文件
 * @type {void | Class | *}
 */
var majiang_winGamePanel_anHuaQiWang = majiang_winGamePanel_yueyang.extend({

    jsBind:{},

    ctor: function(jsonFile){
        this._super(jsonFile);
    },

    //override 小结算显示捉鸟内容【岳阳统一增加listview存放鸟牌】
    showAddBird : function (back, tData) {
        var img_bridTips = back.getChildByName("img_bridTips");
        var listViewBirds = img_bridTips.getChildByName("listview_niao");
        var cards = tData.mopai ? tData.mopai : tData.showFanJiCards;
        var cardnode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
        var countNode = img_bridTips.getChildByName("text_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;
        var zhongCount = 0, posX;
        for(var i = 0; i < cards.length; i++) {
            var cloneCard = util.clone(cardnode);
            cloneCard.setName(MjClient.playui.HandleCardType["Chi"]);
            cloneCard.visible = true;
            listViewBirds.pushBackCustomItem(cloneCard);
            MjClient.playui.setCardSprite(cloneCard, cards[i], true);
            if (this.isZhongNiao(cards[i])) {
                zhongCount++;
            }

            if(i === cards.length - 1){
                posX = cardnode.x + slotwith * (i + 1);
            }
        }

        if(zhongCount === 0){
            countNode.setVisible(false);
        }else{
            listViewBirds.refreshView();
            countNode.setPosition(cc.p(posX, listViewBirds.y));
            countNode.setString("+" + zhongCount);
        }
    }
});

//是否可以码牌(默认为false)
majiang_winGamePanel_anHuaQiWang.prototype.isCanShuffleCards = function(){
    return true;
};