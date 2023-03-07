//永州，邵阳，湘乡，耒阳，衡阳的跑得快公用
var EndOneView_PaoDeKuaiYZTY = EndOneView_PaoDeKuai.extend({
	getJsBind: function() {
        return {
            back: {
                xiPai: {
                    _run: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        // 非回放状态、自动切牌、牌局没有结束  洗牌按钮可见
                        this.visible = MjClient.gameType == MjClient.GAME_TYPE.YZ_PAO_DE_KUAI_TY && (MjClient.rePlayVideo == -1 && tData.areaSelectMode.isPlayerShuffle == 0 && sData.tData.roundNum > 0 && !tData.matchId);

                        if (!this.visible) {
                            return;
                        }

                        if (tData.areaSelectMode.fangkaCount > 0) {
                            // 元宝场
                            this.getChildByName("icon").loadTexture("gameOver/newOver/ico_zuanshi.png");
                            this.getChildByName("numTxt").setString("x" + 1);
                        }
                    },
                    _click: function(btn,eT){ 
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJShuffle"
                        },function(data) {
                            if (data && data.code == -1)
                            {
                                MjClient.showToast(data.message);
                                return;
                            }

                            postEvent("clearCardUI");
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;

                            PKPassConfirmToServer_card();

                            if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                                MjClient.arrowbkNode.setVisible(false);
                            }
                        });
                    } 
                }
            }
        };
    },
	ctor: function() {
	    this._super("endOne_PaoDeKuaiTY.json");
	    return true;
	},
});

EndOneView_PaoDeKuaiYZTY.prototype.getPlayUIDirNodeData = function() {
	
	var tData = MjClient.data.sData.tData;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";
    
    text += tData.areaSelectMode.cardNumIndex == 0 ? "16张," : "15张,";
    text += tData.areaSelectMode.mustPut ? "" : "非必管,";
    text += tData.areaSelectMode.zhaDanBuChai ? "炸弹不可拆," : "";
    text += tData.areaSelectMode.isAutoTip ? "自动提示," : "";
    var firstOutRuleStr = "";
    switch (tData.areaSelectMode.firstPutRule){
        case 1:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃3,":"首局先出黑桃3,"
            break;
        }
        case 2:{
            firstOutRuleStr = ""
            break;
        }
        case 3:{
            firstOutRuleStr = tData.areaSelectMode.isPreRoundFirstRule==true?  "每局先出黑桃3,":"首局先出黑桃3,"
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
    
    text += firstOutRuleStr;
    
    text += tData.areaSelectMode.hongTao10Niao ? "红桃10扎鸟," : "";

    if (tData.areaSelectMode.zhaniao) {
        if (tData.areaSelectMode.zhaniao == 1)
            text += "红桃9翻倍,";
        else if (tData.areaSelectMode.zhaniao == 2)
            text += "红桃10翻倍,";
        else if (tData.areaSelectMode.zhaniao == 3)
            text += "红桃10飘5分,";
        else if (tData.areaSelectMode.zhaniao == 4)
            text += "红桃10飘10分,";
    }

    text += tData.areaSelectMode.can3aZhaDan ? "3个A算炸弹," : "";
    text += tData.areaSelectMode.can3ge3ZhaDan ? "3个3算炸弹," : "";
    text += tData.areaSelectMode.isPlayerShuffle == 1 ? "手动切牌," : "系统切牌,";

    var piaoFenStr = "";
    switch (tData.areaSelectMode.piaofen){
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
                text += "30/32分封顶,";
                break;
            case 2:
                text += "60/64分封顶,";
                break;
        }
    }
    
    if (typeof(tData.areaSelectMode.fanBei) != 'undefined') 
        text += tData.areaSelectMode.fanBei == 0 ? "不翻倍," : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍,";
    //text += tData.areaSelectMode.showCardNumber ? "显示牌数," : "";
    if (tData.fieldBase) // 金币场底分
        text += "底分X" + tData.fieldBase + ",";
    else
        text += tData.areaSelectMode.paodekuaiTY_difen ? "底分X" + tData.areaSelectMode.paodekuaiTY_difen + ",":"";
    if (MjClient.getAppType() != MjClient.APP_TYPE.HUNANWANGWANG && MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ && 
        MjClient.getAppType() != MjClient.APP_TYPE.QXLYQP){
        text += ("房间号:" + tData.tableid);
    }
    return text;

};

EndOneView_PaoDeKuaiYZTY.prototype.getPlayUIDir_0NodeData = function() {

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var text = "";
    
    if(MjClient.data.sData.tData.fieldId)
    {
        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人";
    }else{
        text = GameCnName[MjClient.gameType] + " " + tData.maxPlayer + " 人   房号：" + tData.tableid;
    }

    return text;
};

// EndOneView_PaoDeKuaiYZTY.prototype.getHeadUICardScale = function() {
//     return 0.5;
// };

EndOneView_PaoDeKuaiYZTY.prototype.getHeadUIOff = function(off) {

    var nRet = off;
    
    var selfindex = getPlayerIndex(0);
    off = MjClient.data.sData.tData.fieldId? (selfindex + off ): off;//金币场要求头像，第一个是自己，然后按出牌顺序排列
    off = off % 3;

    nRet = off;

    return nRet;
};

EndOneView_PaoDeKuaiYZTY.prototype.addWXHeadUIItem_PaoDeKuai = function(bindObj, off) {

    var pl = MjClient.getPlayerByIndex(off);
    var uibind = bindObj;

    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ || MjClient.getAppType() == MjClient.APP_TYPE.QXLYQP) {
        // 背景切换
        for(var i in pl.mjdesc2) {
            var str = pl.mjdesc2[i];
            var s_num = 0;
            if (str.indexOf("总分") != -1 ) {
                s_num = str.slice(str.indexOf(":") + 1);
                cc.log("jiangcw: s_num = " + s_num);
            }
            if (Number(s_num) > 0) {
                uibind.head_bg._node.loadTexture("gameOver/di_red.png");
            }
        }
        // 头像圆形裁剪
        var pl = MjClient.getPlayerByIndex(off);
        CircularCuttingHeadImg(uibind.head._node, pl);
    }
    else {
        addWxHeadToEndUI(uibind.head._node, off);
    }

    if(MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ){
        var pl = MjClient.getPlayerByIndex(off);
        setRoundEndUserOffline_xiangxiang(uibind.head._node,pl);
    }

};  


EndOneView_PaoDeKuaiYZTY.prototype.showAllCardItem_PaoDeKuai = function(node, pl) {

        var arry = [];

        if (pl.mjhandRecord)
        {
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
        }

        for (var i = 0; i < arry.length; i++) {
            arry[i].visible = true;
            arry[i].enabled = false;
            arry[i].setScale(arry[i].getScale() * 0.75);
        }
        CardLayoutRestoreForEndOne_ty(node, pl);
};


EndOneView_PaoDeKuaiYZTY.prototype.SetInvalidPlayUI_PaoDeKuai = function(node, off) {

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var pl = MjClient.getPlayerByIndex(off);
    
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
            if(MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() === MjClient.APP_TYPE.BDYZPHZ || 
                MjClient.getAppType() === MjClient.APP_TYPE.QXLYQP || MjClient.getAppType() === MjClient.APP_TYPE.BDHYZP){
                node.getChildByName("head_bg").setVisible(false);
            }else{
                node.getChildByName("head_bg").setVisible(true);
            }
            node.getChildByName("stand_other_desc").setVisible(true);
            node.getChildByName("stand_other_desc").ignoreContentAdaptWithSize(true);
            stand_other.setVisible(false)

            var stand = stand_other//head.getChildByName("stand");
            var offX = stand.x;
            var upSize = stand.getSize();
            var upS = stand.scale;

            var otrCards = MjClient.majiang.sortHandCards(tData.otherCards, 0);
            for (var i = 0; i < otrCards.length; i++) {
                var card = getNewCard_card(node, "stand_other", "mjhand", otrCards[i], 0);
                card.visible = true;
                card.enabled = false;
                card.setScale(0.5); //MjClient.endoneui.getHeadUICardScale()
                if (i != 0) {
                    offX += upSize.width * upS * 0.4;//调牌的距离的
                    card.x = offX;//调牌的距离的
                }else {
                    card.x = offX /*+ upSize.width * upS * 0.1*/;
                }

            }

        }
        return;
    }
    if (MjClient.getAppType() != MjClient.APP_TYPE.BDHYZP &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXXXGHZ)
        setUserOfflineWinGamePanel(node,pl);//不知道为什么，衡阳在下面代码的addWxHeadToEndUI里会实现相关功能，所以屏蔽

}; 

EndOneView_PaoDeKuaiYZTY.prototype.setHeadUIZhaDanFanBei = function(node, pl) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    
    if (!tData.areaSelectMode.isZhaDanFanBei || !pl.zhaDanCount || pl.zhaDanCount <= 0 || pl.winone <= 0)
    {
        node.visible = false;
        return;
    }

    // "炸弹 x XX 倍"
    var sprites = [];
    sprites[0] = new cc.Sprite("gameOver/zhadan_cheng.png");
    var beishu = 1 << pl.zhaDanCount;
    for (var i = 1; beishu > 0; i ++)
    {
        var num = beishu % 10; 
        beishu = Math.floor(beishu / 10);
        sprites[i] = new cc.Sprite("gameOver/zhadan_" + num + ".png");
    }

    var width = 80 / sprites.length;
    for (var i = 0, len = sprites.length; i < len; i ++)
    {
        sprites[i].y = node.height/2;
        if (i == 0)
            sprites[i].x = 65 + width/2;
        else
            sprites[i].x = 65 + (len - i) * width + width/2;

        if (width < sprites[i].width)
            sprites[i].scale = width/sprites[i].width;

        node.addChild(sprites[i]);
    }
};


EndOneView_PaoDeKuaiYZTY.prototype.SetEndOneUserUIItem_PaoDeKuai = function(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    off = this.getHeadUIOff(off);
    
    node.setVisible(false);

    this.SetInvalidPlayUI_PaoDeKuai(node, off);

    var pl = MjClient.getPlayerByIndex(off);
    if(!pl)
    {
        return;
    }
    
    node.setVisible(true);
    
    var nodeS = node;
    node = node.getChildByName("head");

    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    this.BindHeadUIItem_PaoDeKuai(node, off); 
    this.addInfoScoreNotEnough(nodeS, off);
    var pl = MjClient.getPlayerByIndex(off);
    if (pl && node)
    {
        this.showAllCardItem_PaoDeKuai(node, pl);  
    }
    
};

//积分不能低于0份  调用注意 在setEndOneUserUI函数 最前面 调用
EndOneView_PaoDeKuaiYZTY.prototype.addInfoScoreNotEnough= function(infoImg,off){

	var sData = MjClient.data.sData;
	var tData = sData.tData;
	if(!tData.areaSelectMode.scoreNeedEnough) return;
	var pl = MjClient.getPlayerByIndex(off);
    if(!pl)return;

    if(pl.winone == pl.winone2){
		return;
	}
    
	var nameNode = infoImg.getChildByName("head").getChildByName("name");
	var winNumNode = infoImg.getChildByName("winNum1");
	// 低分不能低于0
    // cc.log(" ======lms --- UUUU ",tData.areaSelectMode.scoreNeedEnough,JSON.stringify(tData.matchScoreLimitUser) != "{}",
    // JSON.stringify(tData.matchScoreLimitUser));
    if(tData.areaSelectMode.scoreNeedEnough && JSON.stringify(tData.matchScoreLimitUser) != "{}"){
        if ((tData.areaSelectMode.scoreNeedEnough == 1) && tData.matchScoreLimitUser[tData.uids[off]] &&
        tData.matchScoreLimitUser[tData.uids[off]].score <= 0) {
            // var textTip = new ccui.Text("积分不足","fonts/lanting.TTF",20);
            var textTip = new ccui.ImageView("gameOver/newOver/jifenbuzu.png");
            var poy1 = nameNode.y + 30;
            textTip.setPosition(cc.p(nameNode.x, poy1));
            infoImg.addChild(textTip);
        }
        // var text_winNum = infoImg.getChildByName("text_winNum");
		var textScores = new ccui.Text("", "fonts/lanting.TTF", 20);
		// text_winNum.ignoreContentAdaptWithSize(true);
        var pox2 = winNumNode.x + winNumNode.width * 0.5 + 80;
        textScores.setPosition(cc.p(pox2, winNumNode.y));
        textScores.setColor(cc.color("#fff000"));
        textScores.setString("("+pl.winone+")");
        infoImg.addChild(textScores);

        //////////////////////////////////////////////////////
        var winNum1Node =  infoImg.getChildByName("winNum1");
        var winNum2Node =  infoImg.getChildByName("winNum2");
        if(pl.winone2 >= 0)
        {
            winNum1Node.visible = true;
            winNum1Node.setString(Math.abs(Number(pl.winone2)) + "");
        }
        else
        {
            winNum2Node.visible = true;
            winNum2Node.setString(Math.abs(Number(pl.winone2)) + "");            
        }
    }

};