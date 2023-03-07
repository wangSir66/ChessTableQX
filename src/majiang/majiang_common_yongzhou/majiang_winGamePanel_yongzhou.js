/***
 * 永州App，通用小结算文件   对应endOne_maJiang.json
 * @type {void | Class | *}
 */
var majiang_winGamePanel_yongzhou = majiang_winGamePanel.extend({

    jsBind:{},

    ctor: function(jsonFile){
        this._super(jsonFile);
    },


    //override  获取小结算中单个玩家的牌型描述
    getCardTypeDesc: function(pl, sData){
        var tData=sData.tData;
        if (MjClient.isDismiss && !sData.players[tData.firstDel] && pl.mjdesc[1]) // 会长或管理员解散房间
            return pl.mjdesc[1];
        return this._super(pl,sData);
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



    // @Override 点击准备, 不重置 jiazhuNum 数据
    btnReadyEvent: function(){
        var sData=MjClient.data.sData;
        var tData=sData.tData;
        for(var i = 0; i < tData.maxPlayer;i++){
            var pl = MjClient.playui.getPlayerWithIndex(i);
            if (!pl)
                continue;
            if (pl.mjflower)
                pl.mjflower = [];
            // if (pl.jiazhuNum)
            //     pl.jiazhuNum = 0;
        }
        postEvent("clearCardUI");
        MjClient.endoneui.removeFromParent(true);
        MjClient.endoneui = null;
        if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
            MjClient.replayui.replayEnd();
        } else {
            MjClient.playui.sendPassToServer();
        }
        if (MjClient.endallui){
            MjClient.endallui.setVisible(true);
        }

        if(MjClient.playui) {
            MjClient.playui.hideEatNodeChildren();
            var playerNodeArr = MjClient.playui.playerNodeArr;
            for (var k = 0; k < playerNodeArr.length; k++) {
                MjClient.playui.removeAllCards(playerNodeArr[k]);
            }
        }
    },


    addWxHeadToEndUI: function (node, off) {
        if(!node) return;
        var pl = MjClient.playui.getPlayerWithIndex(off);
        var img = "png/default_headpic.png";
        if(pl && pl.wxHeadImg){
            img = pl.wxHeadImg;
            loadWxHead();
        }else{
            cc.loader.loadImg(pl.info.headimgurl, {isCrossOrigin: true}, function(err, texture) {
                if (!err && texture) {
                    img = texture;
                    loadWxHead();
                }
            });
        }

        function loadWxHead() {
            var sp = new cc.Sprite(img);
            sp.setScale(node.scale);
            sp.setContentSize(cc.size(node.width * 0.9, node.height * 0.9));
            sp.setPosition(node.width/2, node.height/2);
            node.addChild(sp);
        }
    }
});