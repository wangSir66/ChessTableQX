function Red20_GameData(params) {
    this.actionCardList = [];

    //最后出的牌或翻的牌
    this.lastTableOutCard;

    this.isActionByTableCard = false;

    updateActionCard = function (card) {
        if (card) {
            this.actionCardList.push(card);
        } else {
            this.actionCardList = [];
        }
    }

    getActionList = function () {
        return this.actionCardList;
    }
}