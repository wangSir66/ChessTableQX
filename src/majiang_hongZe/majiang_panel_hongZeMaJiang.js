//洪泽麻将
var majiang_panel_hongZeMaJiang = majiang_panel_huaian.extend({
    jsonFile:"Play_hongZeMaJiang.json",

    ctor:function(){
		  this._super(majiang_panel_hongZeMaJiang, this.jsonFile);
    },
});

/**
 *  began事件时的验证 
 **/
majiang_panel_hongZeMaJiang.prototype.checkWhenTouchBegan = function(cardNode){
    if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
        return true;
    } 
    var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
    if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
        return true;
    }
    // 自动摸打
    var player = MjClient.playui.getPlayerInfoByName("node_down");
    if (player.tPutCard && this.isTurnMe()) {
        if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
            MjClient.showToast("出牌请先取消自动摸打");
        }
        return true;
    }

    // if(cardNode.tag == this.getHunCard()){
    //     if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
    //         MjClient.showToast("红中不能打出");
    //     }
    //     return true;
    // }

    return false;
};

majiang_panel_hongZeMaJiang.prototype.isShowTingCards = function(){
    return true;
};