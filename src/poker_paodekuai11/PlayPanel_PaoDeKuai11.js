
var PlayLayer_PaoDeKuai11 = PlayLayer_PaoDeKuaiTY.extend({
    ctor: function() {
        var json = null;
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ){
            json = res.Play_PaoDeKuai11_json ;
        }
        cc.log("into 99999999999999999 PAO_DE_KUAI_ELEVEN");
        this._super(json);

        return true;
    }
    
});

/**
 * 拼接游戏玩法及付费信息
 * @function
 * @return {String}
 */
PlayLayer_PaoDeKuai11.prototype.getGameInfoString = function(param)
{
    var tData = MjClient.data.sData.tData;
    var str = "";

    if (param != "roundInfo")
        str += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
//    str += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
    str += tData.areaSelectMode.mustPut ? "" : "非必管,";
    str += tData.areaSelectMode.zhaDanBuChai ? "炸弹不可拆," : "";
    var firstOutRuleStr = "";
    switch (tData.areaSelectMode.firstPutRule){
        case 1:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃6,":"首局先出黑桃6,"
            break;
        }
        case 2:{
            firstOutRuleStr = ""
            break;
        }
        case 3:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃6,":"首局先出黑桃6,"
            break;
        }
        case 4:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局随机先手,":"首局随机先手,"
            break;
        }
        default:{
            firstOutRuleStr = ""
            break
        }
    };

    switch (tData.areaSelectMode.piaofen){
        case 0:{ str += ""; break; }
        case 1:{ str += "飘123,"; break; }
        case 2:{ str += "飘235,"; break; }
        case 3:{ str += "飘258,"; break; }
        default:{ str += ""; break }
    };

    // str += tData.areaSelectMode.firstHeiTao3 ? "首局先出黑桃三," : "";
    str += firstOutRuleStr;
    str += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    str += tData.areaSelectMode.can4dai3 ? "四带三," : "";
    str += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";
    str += tData.areaSelectMode.hongTao10JiaFen ? "红桃10加5分," :"";
    str += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "";

    if (typeof(tData.areaSelectMode.fengDing) == "number") {
        switch (tData.areaSelectMode.fengDing)
        {
            case 1:
                str += "22分封顶,";
                break;
            case 2:
                str += "44分封顶,";
                break;
        }
    }

    str += tData.areaSelectMode.paoDeKuai11_difen ? "底分X" + tData.areaSelectMode.paoDeKuai11_difen + ","  : "";
    str += tData.areaSelectMode.fangQiangGuan ? "防强关," : "";

    if (param != "roundInfo")
    {
        str += tData.areaSelectMode.fangZuoBi ? "防作弊," : "";
        str += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    }

    if(tData.areaSelectMode.fanBei == 1)
    {
        str += "小于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    } 

    if (param != "roundInfo")
    {
        switch (tData.areaSelectMode.payWay)
        {
            case 0:
                str += "房主付";
                break;
            case 1:
                str += "AA付";
                break;
            case 2:
                str += "大赢家付";
                break;
        }
    }

    if(tData.areaSelectMode.trustTime > 0)
    {
        str += Math.floor(tData.areaSelectMode.trustTime/60) + "分钟,";
    } 


    if (str.charAt(str.length - 1) == ",")
        str = str.substring(0, str.length - 1);

    //比赛场
    var BSStr = "";
    if(tData.matchId){
        BSStr = ",10秒出牌";
        str += BSStr;
        str = GameCnName[MjClient.gameType]+","+str;
    }

    if(MjClient.isInGoldField())
    {
        str = "";
//        str += tData.areaSelectMode.cardNumIndex == 0 ? "16张" : "15张";
        str += tData.areaSelectMode.paoDeKuai11_difen ? ",底分X" + tData.fieldBase: "";
    }
    return str;
};

PlayLayer_PaoDeKuai11.prototype.GetEndOneViewObj = function()
{
    return new EndOneView_PaoDeKuai11();
}

PlayLayer_PaoDeKuai11.prototype.shwoFlyCardAnim = function(flyNode)
{
    var tData = MjClient.data.sData.tData;
    var off = getOffByIndex(tData.curPlayer);
    var playerNode = getNode_cards(off);
    if (!playerNode)
        return;

    if(4 == tData.areaSelectMode.firstPutRule)     // 2人完 随机先手，可以不出3，不播放黑桃3加入手牌的动画
        return;

    var headNode = playerNode.getChildByName("head");
    var point = headNode.convertToWorldSpace(cc.p(headNode.width/2, headNode.height/2));
    point = flyNode.getParent().convertToNodeSpace(point);
    setCardSprite_card(flyNode, 24, false);
    flyNode.setVisible(true);
    flyNode.setScale(flyNode.getScale() * 1.5);
    flyNode.runAction(cc.sequence(cc.delayTime(0.2), cc.spawn(cc.moveTo(1.0, point), cc.scaleTo(1.0, flyNode.getScale()/1.5)), cc.callFunc(function() {
        flyNode.setVisible(false);

        if(!MjClient.playui.isFaPai)
        {
            postCardsEnded();
        }
    })));
}