var majiang_winGamePanel_SYMJ = majiang_winGamePanel_shaoyang.extend({

    //override
    ctor:function(){
        this._super();
    },
});



// 显示抓鸟内容
majiang_winGamePanel_SYMJ.prototype.showAddBird = function(back, tData){
    //显示抓鸟的牌
    var img_bridTips = back.getChildByName("img_bridTips");
    var cards = tData.mopai;
    var cardNode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
    var countNode = img_bridTips.getChildByName("text_count");
    cardNode.visible = false;
    var slotwith = cardNode.width * cardNode.scale * 0.9;//0.05;

    var sData = MjClient.data.sData; 
    
    var huNum = 0;
    var dianpaoPlayer = null;
    for (var index in sData.players) {
        if(sData.players[index].winType > 0){
            huNum++;
            dianpaoPlayer = sData.players[index].dianPaoPlayer;
        }
    }

    var zhongCount = 0;
    for(var i = 0;i < cards.length;i++){
        var cloneNode = util.clone(cardNode);
        cloneNode.setName(MjClient.playui.HandleCardType["Chi"]);
        cloneNode.visible = true;
        cloneNode.setPosition(cc.p(cardNode.x + slotwith*i,cardNode.y));
        img_bridTips.addChild(cloneNode);
        MjClient.playui.setCardSprite(cloneNode, cards[i], true);

        if(huNum > 1){ // 多胡
            var niaoData = MjClient.majiang.getNiaoIsShow(cards[i],4); 
             cc.log("cards[i] =" +  cards[i] + "niaoData = " + niaoData);
            if(niaoData != -1){
                var index = (dianpaoPlayer + niaoData) % 4; // 可以获得这个鸟的位置  
                var temp_Pl = sData.players[tData.uids[index] ]; // 通过位置来获取玩家信息
                if(!temp_Pl || temp_Pl.winType <= 0)
                    continue; 
                cloneNode.setColor(cc.color(255,255,255));
                zhongNiaoNum++;
            }else{
                cloneNode.setColor(cc.color(170,170,170));
            } 

        }else if(this.isZhongNiao(cards[i])){  
            cloneNode.setColor(cc.color(255,255,255));  
            zhongCount++; 
        }else{
            cloneNode.setColor(cc.color(170,170,170));
        }

        // if (this.isZhongNiao(cards[i])) {
        //     zhongCount++;
        // }else{
        //     cloneNode.setColor(cc.color(170,170,170));
        // }
    }

    if(zhongCount == 0){
        countNode.setVisible(false);
    }else{
        var pos = cc.p(cardNode.x + slotwith * cards.length  - slotwith/2, cardNode.y);
        countNode.setPosition(pos);
        countNode.setString("+" + zhongCount);
    }
};

// 写中鸟条件
majiang_winGamePanel_SYMJ.prototype.isZhongNiao = function(card){
    if(MjClient.playui.getIsZhongBird) return MjClient.playui.getIsZhongBird(card);

    return card === 71 || (card < 30 && card % 10 === 1 || card % 10 === 5 || card % 10 === 9);
};

 
