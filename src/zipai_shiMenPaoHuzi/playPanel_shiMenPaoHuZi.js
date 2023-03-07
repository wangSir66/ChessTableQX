// 岳阳常德跑胡子
var playPanel_shiMenPaoHuzi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_smPaoHuZi.json"); 

        MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(this.getRoundRules()));
        MjClient.MaxPlayerNum_shiMenPaoHuZi = this.getPlayersNum();        //兼容旧版结算，算法等文件
    },
    getJsBind: function() {
		var jsBind = {
			img_banner: { 
                btn_changeBg:{
                    _run: function() { 
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize()); 
                    },
                    _click: function() {
                        postEvent("EZP_rule");
                        
                    }
                },
			},
			text_roundInfo: {
		        _layout: [[0.11, 0.11], [0.5, 0.66], [0, 0]],
		        _run: function() {
		            this.ignoreContentAdaptWithSize(true);
		            this.setString("");
		        }
		    },
		    img_gameName: {
		        _layout: [[0.2, 0], [0.5, 0.83], [0, 0]],
		        _run: function() {
		            this.loadTexture(GameBg[MjClient.gameType]);
		            this.ignoreContentAdaptWithSize(true);
		        }
		    }

		};

		return jsBind;
	}

});

//Override
playPanel_shiMenPaoHuzi.prototype.getGameBgList = function() {
    return ["playing/paohuziTable/beijing_2.jpg", "playing/paohuziTable/beijing_4.jpg", "playing/paohuziTable/beijing_1.jpg"];
};


//Override
// 获取提、偎牌的显示类型
playPanel_shiMenPaoHuzi.prototype.getCardShowType = function(card, off) {
    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    // 展示
    if (!(pl.mjHide && pl.mjHide.indexOf(card) >= 0)) {
        return 2;
    }
    // 隐藏牌 提偎牌玩家自己展示
    if (pl.info.uid == SelfUid()) {
        return 2;
    }

    return 0;
};

//Override
playPanel_shiMenPaoHuzi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
    var showType = 2;
    if (eatType == "mjchi") {
        showType = cardIndex < 2 ? 2 : 3;
    } else if (eatType == "mjwei" ) {
        showType = this.getCardShowType(card, off);
        if (showType == 2) {
            showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0;
        }
    } else if(eatType == "mjgang1"){  
        showType = this.getShowCardIndex(eatType, off) == cardIndex ? 2 : 0; 
    }
    return showType;
};
//Override
playPanel_shiMenPaoHuzi.prototype.getRoundRules = function () {
    var tData = MjClient.data.sData.tData;
    var areaSelectMode = JSON.parse(JSON.stringify(tData.areaSelectMode));
    var rulesArr = [];
    for (var k in areaSelectMode) {
        var str = getGameCnDesc(tData.gameType, k, areaSelectMode[k], areaSelectMode);
        if(k == "allPlayList" || k == "tuPlayList" ){
        	var temp = str.split(",");
        	for (var i = 0; i < temp.length; i++) {
        		if(temp[i] !== "")
        			rulesArr.push(temp[i]);
        	}  
        } 
        else if(cc.isArray(str))
        {
            for(var i = 0; i < str.length; i++)
            {
                rulesArr.push(str[i]);
            }
        }
        else if (str) {
            rulesArr.push(str);
        }
    }
    return rulesArr;
};

//Override
playPanel_shiMenPaoHuzi.prototype.isShowLongCard = function(){
    return true;
}

playPanel_shiMenPaoHuzi.prototype.isAniParallel = function() {
    return false;
};

//字牌字体列表
playPanel_shiMenPaoHuzi.prototype.getCardFontList = function() {  
    return ["type1", "type5", "type3"];
};

//Override
playPanel_shiMenPaoHuzi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_shiMenPaoHuZi();
};

//Override
playPanel_shiMenPaoHuzi.prototype.createEndOneLayer = function(type) { 
    return new EndOneView_shiMenPaoHuZi();
};
//Override
playPanel_shiMenPaoHuzi.prototype.isCheckTingStats = function() {
    return true;
};

playPanel_shiMenPaoHuzi.prototype.isPutCardLayout = function() {
    return true;
};

playPanel_shiMenPaoHuzi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    // 调用自己的听牌算法
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

 
 