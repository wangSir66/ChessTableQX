var EndOneView_PaoDeKuai11 = EndOneView_PaoDeKuaiTY.extend({
	
	ctor: function() {
	    this._super();
	    return true;
	},
});

EndOneView_PaoDeKuai11.prototype.getPlayUIDirNodeData = function() {
	
	var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";

    if (MjClient.endoneui.isNewUi) {
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            text = "";
        }
        else {
            text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid + "\n";
        }
    }

    //text += "跑得快,";
    //text += MjClient.MaxPlayerNum == 3 ? "三人玩," : "两人玩,";
//    text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
    text += tData.areaSelectMode.mustPut ? "" : "非必管,";
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
    }
    text += tData.areaSelectMode.zhaDanBuChai ? "炸弹不可拆," : "";
    // text += tData.areaSelectMode.firstHeiTao3 ? "首局先出黑桃三," : "";
    text += firstOutRuleStr;
    // text += tData.areaSelectMode.can4dai2 ? "四带二," : "";
    // text += tData.areaSelectMode.can4dai3 ? "四带三," : "";
    text += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";
    text += tData.areaSelectMode.hongTao10JiaFen ? "红桃10加5分," :"";
    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "";


    var piaoFenStr = "";
    switch (tData.areaSelectMode.piaofen){
        case 0:{
            piaoFenStr = "不飘,";
            break;
        }

        case 1:{
            piaoFenStr = "飘123,";
            break;
        }
        case 2:{
            piaoFenStr = "飘235,";
            break;
        }
        case 3:{
            piaoFenStr = "飘258,";
            break;
        }
        case 4:{
            piaoFenStr = "每局飘1,";
            break;
        }
        case 5:{
            piaoFenStr = "每局飘2,";
            break;
        }
        default:{
            piaoFenStr = ""
            break;
        }
    }
    text += piaoFenStr;


    if (typeof(tData.areaSelectMode.fengDing) == "number") {
        switch (tData.areaSelectMode.fengDing)
        {
            case 1:
                text += "22分封顶,";
                break;
            case 2:
                text += "44分封顶,";
                break;
        }
    }
    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";


    text += tData.areaSelectMode.fangQiangGuan ? "防强关," : "";
    if (tData.fieldBase) // 金币场底分
        text += "底分X" + tData.fieldBase + ",";
    else
        text += tData.areaSelectMode.paoDeKuai11_difen ? "底分X" + tData.areaSelectMode.paoDeKuai11_difen + ",":"";

    if (!MjClient.endoneui.isNewUi)
        text += ("房间号:" + tData.tableid);

    if (text.charAt(text.length - 1) == ",")
        text = text.substring(0, text.length - 1);
    return text;

};

// EndOneView_PaoDeKuai11.prototype.getPlayUIDir_0NodeData = function() {
//     var sData = MjClient.data.sData;
//     var tData = sData.tData;
//     var text = "";
    
//     if (MjClient.endoneui.isNewUi){
//         if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
//             if(MjClient.data.sData.tData.fieldId){
//                 text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人";
//             }else{
//                 text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid;
//             }
//             //
//         }
//     }

//     return text;
// };

// // EndOneView_PaoDeKuaiYZTY.prototype.getHeadUICardScale = function() {
// //     return 0.5;
// // };

// EndOneView_PaoDeKuai11.prototype.getHeadUIOff = function(off) {

//     var nRet = off;
    
//     var selfindex = getPlayerIndex(0);
//     off = MjClient.data.sData.tData.fieldId? (selfindex + off ): off;//金币场要求头像，第一个是自己，然后按出牌顺序排列
//     off = off % 3;

//     nRet = off;

//     return nRet;
// };

// EndOneView_PaoDeKuai11.prototype.addWXHeadUIItem_PaoDeKuai = function(bindObj, off) {

//     var pl = MjClient.getPlayerByIndex(off);
//     var uibind = bindObj;

//     if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ ||
//      MjClient.getAppType() == MjClient.APP_TYPE.AYGUIZHOUMJ) {
//         // 背景切换
//         for(var i in pl.mjdesc2) {
//             var str = pl.mjdesc2[i];
//             var s_num = 0;
//             if (str.indexOf("总分") != -1 ) {
//                 s_num = str.slice(str.indexOf(":") + 1);
//                 cc.log("jiangcw: s_num = " + s_num);
//             }
//             if (Number(s_num) > 0) {
//                 uibind.head_bg._node.loadTexture("gameOver/di_red.png");
//             }
//         }
//         // 头像圆形裁剪
//         var pl = MjClient.getPlayerByIndex(off);
//         CircularCuttingHeadImg(uibind.head._node, pl);
//     }
//     else {
//         addWxHeadToEndUI(uibind.head._node, off);
//     }


// };  


// EndOneView_PaoDeKuai11.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {
//         if((!pl.mjhandRecord) || (!pl.mjhand)){
//             return;
//         }

//         var arry = [];

//         if (pl.mjhandRecord)
//         {
//             //添加手牌
//             for (var i = 0; i < pl.mjhandRecord.length; i++) {
//                 var card = getNewCard_card(node, "stand", "mjhand", pl.mjhandRecord[i], 0);
//                 arry.push(card);
//                 // 如果是打出去的牌， 显示遮罩
//                 if( pl.mjhand.indexOf(pl.mjhandRecord[i]) < 0) {
//                     card.isGray = true;
//                     card.setColor(MjClient.grayColor);
//                 }
//             }
//         }

//         for (var i = 0; i < arry.length; i++) {
//             arry[i].visible = true;
//             arry[i].enabled = false;
//             arry[i].setScale(arry[i].getScale() * 0.75);
//         }
//         CardLayoutRestoreForEndOne_ty(node, pl);
// };


// EndOneView_PaoDeKuai11.prototype.SetInvalidPlayUI_PaoDeKuai = function(node, off) {

//     var pl = MjClient.getPlayerByIndex(off);
//     var sData = MjClient.data.sData;
//     var tData = sData.tData;
    
//     if (!pl) {
//         // 二人玩时，显示剩余的底牌
//         if(tData.otherCards) {
//             node.setVisible(true);
//             for(var i in node.children) {
//                 var child = node.children[i];
//                 child.setVisible(false);
//             }

//             //添加手牌
//             var stand_other = node.getChildByName("stand_other");
            
//             node.getChildByName("stand_other_desc").setVisible(true);
//             node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
//             stand_other.setVisible(false)

//             var stand = stand_other//head.getChildByName("stand");
//             var offX = stand.x;
//             var upSize = stand.getSize();
//             var upS = stand.scale;

//             var otrCards = MjClient.majiang.sortHandCards(tData.otherCards, 0);
//             for (var i = 0; i < otrCards.length; i++) {
//                 var card = getNewCard_card(node, "stand_other", "mjhand", otrCards[i], 0);
//                 card.visible = true;
//                 card.enabled = false;
//                 card.setScale(0.5); //MjClient.endoneui.getHeadUICardScale()
//                 if (i != 0) {
//                     offX += upSize.width * upS * 0.4;//调牌的距离的
//                     card.x = offX;//调牌的距离的
//                 }else {
//                     card.x = offX /*+ upSize.width * upS * 0.1*/;
//                 }

//             }

//         }
//         return;
//     }
    

// }; 

