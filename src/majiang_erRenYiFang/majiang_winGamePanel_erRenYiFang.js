

var majiang_winGamePanel_erRenYiFang, father;

if(MjClient.getAppType() === MjClient.APP_TYPE.QXYYQP){
    father = majiang_winGamePanel_yueyang;
}else if(MjClient.getAppType() === MjClient.APP_TYPE.QXSYDTZ){
    father = majiang_winGamePanel_shaoyang;
}else if(MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP){
    father = majiang_winGamePanel_yongzhou;
}

majiang_winGamePanel_erRenYiFang = father.extend({

    ctor: function (jsonFile) {
        this._super(jsonFile);

        // 修改得分显示
        postEvent("updateEndScore");
    },


    setGameOverPanelPlayerState: function (stateNode, pl) {
        var fileName = "";
        var cardCount = MjClient.majiang.CardCount(pl);
        if (pl.winType === 3 && cardCount === 8){
            fileName = "gameOver/ico_zimo.png";

        }else if (pl.winType > 0 && cardCount === 8){
            fileName = "gameOver/ico_hu-0.png";

        } else if ((pl.mjdesc + "").indexOf("点炮") >= 0 && cardCount === 7){
            stateNode.visible = true;
            fileName = "gameOver/ico_dianpao.png";
        }


        if (fileName != ""){
            stateNode.loadTexture(fileName);
            stateNode.ignoreContentAdaptWithSize(true);
        } else {
            stateNode.visible = false;
        }
    },


    createEndSortCardArr: function (pl, infoImg) {
        //明杠
        var i, j, cardNode, arry = [];
        for (i = 0; i < pl.mjgang0.length; i++) {
            for (j = 0; j < 4; j++) {
                cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront,
                    MjClient.playui.HandleCardType.MingGang, pl.mjgang0[i], true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }
        //添加暗杠
        for (i = 0; i < pl.mjgang1.length; i++) {
            for (j = 0; j < 4; j++) {
                // 给牌背
                var handleCardType = j == 2 ? MjClient.playui.CsdDefaultCardType.EatCardBack : MjClient.playui.CsdDefaultCardType.EatCardFront;
                var cardTag = j == 2 ? null : pl.mjgang1[i];
                cardNode = MjClient.playui.createCard(infoImg, handleCardType, MjClient.playui.HandleCardType.AnGang, cardTag, true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }
        //添加碰
        for (i = 0; i < pl.mjpeng.length; i++) {
            for (j = 0; j < 3; j++) {
                cardNode= MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront,
                    MjClient.playui.HandleCardType.Peng, pl.mjpeng[i], true);
                arry.push(cardNode);
            }
            arry.push(1); // 标志多移动一点
        }

        var isSeparate = false; // 是否需要隔开最后一张-
        if (pl.mjhand && pl.mjhand.length > 0){
            var count = MjClient.majiang.CardCount(pl);
            isSeparate = (count === 8);
        }
        var sortHandCard = this.getHandSort(pl.mjhand, isSeparate);
        if(!sortHandCard) return MjClient.endoneui.removeFromParent(true);
        //添加手牌
        for (i = 0; i < sortHandCard.length; i++) {
            if( isSeparate && i === (sortHandCard.length - 1)){
                arry.push(1); // 标志多移动一点
            }
            cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.HandCard,
                MjClient.playui.HandleCardType.Hand, sortHandCard[i], true);
            arry.push(cardNode);

        }
        return arry;
    },


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
            }else{
                cloneCard.setColor(cc.color(170,170,170));
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
    },
});