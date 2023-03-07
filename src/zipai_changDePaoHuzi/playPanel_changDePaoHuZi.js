// 岳阳常德跑胡子
var playPanel_changDePaoHuzi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_cdPaoHuZi.json"); 

         MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(this.getRoundRules())); 
        MjClient.MaxPlayerNum_changDePaoHuZi = this.getPlayersNum();        //兼容旧版结算，算法等文件
    },
    getJsBind: function() {
		var jsBind = {
            node_down:{
                _event:{
                     EZP_cardType: function(eD) {
                        
                        MjClient.playui.changeHandCardSize(this.getChildByName("img_handCard"));
                        var layoutHand = this.getChildByName("layout_handCards");
                        if (layoutHand) {
                            layoutHand.removeAllChildren();
                        }
                        MjClient.playui.refreshHandCard(0); 
                        MjClient.playui.changeCardFrame(this, eD.type);
                    }
                }
            },
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
                btn_setting: {
                    _click: function() {
                        MjClient.Scene.addChild(new settingPanel_cdPaoHuZi(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                            uid: SelfUid(),
                            gameType: MjClient.gameType
                        });
                    }
                },
			},
            layout_cardNum: {
                img_card: {
                    _run: function() {
                        var newResPath = "playing/changDePaoHuZi/paidui.png";
                        this.loadTexture(newResPath);
                        this.refreshCardsTotal = function(isRemove) {
                            var tData = MjClient.data.sData.tData;
                            var cardsTotal = MjClient.playui.getInitDiPaiCount();
                            var left = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                            if (isRemove) {
                                var children = this.getChildren();
                                var count = this.getChildrenCount();
                                var factRemoveCount = (cardsTotal - left) / (cardsTotal / 20);
                                if (Math.floor(count + factRemoveCount) > 20) {
                                    children[count - 1].removeFromParent(true);
                                }
                            } else {
                                this.removeAllChildren();
                                left = left / (cardsTotal / 20);
                                for (var i = 1; i <= left; i++) {
                                    var child = ccui.ImageView(newResPath);
                                    child.setPosition(cc.p(this.width / 2, this.height / 2 + i * 0.8));
                                    this.addChild(child);
                                }
                            }
                            this.parent.getChildByName("text_cardNum").y = 40 + this.getChildrenCount() * 0.8;
                        }
                    },
                    _event: {
                        initSceneData: function() {
                            this.refreshCardsTotal();
                        },
                        mjhand: function() {
                            this.refreshCardsTotal();
                        },
                        HZNewCardDelay: function() {
                            this.refreshCardsTotal(true);
                        }
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

playPanel_changDePaoHuzi.prototype.getRoundRules = function () {
    var tData = MjClient.data.sData.tData;
    var areaSelectMode = JSON.parse(JSON.stringify(tData.areaSelectMode));
    var rulesArr = [];
    for (var k in areaSelectMode) {
        var str = getGameCnDesc(tData.gameType, k, areaSelectMode[k], areaSelectMode);
        if(k == "playList" || k == "hongHeiDianList" || k == "duoHongDuiList"){
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
// 获取提、偎牌的显示类型
playPanel_changDePaoHuzi.prototype.getCardShowType = function(card, off) {
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

playPanel_changDePaoHuzi.prototype.getEatCardShowType = function(eatType, card, cardIndex, off) {
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

//字牌字体列表
playPanel_changDePaoHuzi.prototype.getCardFontList = function() {  
    return ["type1", "type5", "type3", "type6"];
};

playPanel_changDePaoHuzi.prototype.getGameBgList = function() {
    return ["playing/paohuziTable/beijing_3.jpg", "playing/paohuziTable/beijing_4.jpg", "playing/paohuziTable/beijing_1.jpg"];
};

//Override
playPanel_changDePaoHuzi.prototype.isShowLongCard = function(){
    return true;
}

playPanel_changDePaoHuzi.prototype.isAniParallel = function() {
    return false;
};

//Override
playPanel_changDePaoHuzi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_changDePaoHuZi();
};

//Override
playPanel_changDePaoHuzi.prototype.createEndOneLayer = function(type) { 
    return new EndOneView_changDePaoHuZi_new();
};

//字牌字体idx
playPanel_changDePaoHuzi.prototype.getCardFontIdx = function() {
	var type = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2); 
 
    return type;
};

playPanel_changDePaoHuzi.prototype.changeHandCardSize = function(handCard) {
    var src = this.getCardSrc("hand", 1)
    //handCard.loadTexture(src, this.getResType());
    this.loadCardTexture(handCard, src, this.getResType());
    var idx = this.getCardSizeIdx();
    var type4Size = 103;
    var cardSize = [[87,87,87,type4Size],[75,75,75,type4Size],[95,95,95,type4Size]]; 
    setWgtLayout(handCard, [cardSize[idx][ziPai.getZiPaiType()] / 1280, 0], [0.27, 0.75], [0, 0]);
 
};
   
playPanel_changDePaoHuzi.prototype.initCardType = function(huaMian){
    var ziPaiList = [];
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai1"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai2"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai3"));
    ziPaiList.push(huaMian.getChildByName("ziPai").getChildByName("ziPai4")); 
    ziPaiList[0].getChildByName("Image").loadTexture("setting/ziPai_1.png");
    ziPaiList[1].getChildByName("Image").loadTexture("setting/ziPai_5.png");
    ziPaiList[2].getChildByName("Image").loadTexture("setting/ziPai_3.png");
    ziPaiList[3].getChildByName("Image").loadTexture("setting/zipai4.png");
    ziPaiList[0].visible = false;
    var type = MjClient.playui.getCardFontIdx();
    this.ziPaiRadio = createRadioBoxForCheckBoxs(ziPaiList, null, type);
    for(var i = 0; i < ziPaiList.length; i++){
        ziPaiList[i].x -= 50
        cc.eventManager.addListener(this.setTextClick(ziPaiList,i,this.ziPaiRadio),ziPaiList[i].getChildByName("Image"));
    }
    this.ziPaiRadio.setSelectCallBack(function(index, sender, nodeList){ 
        util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, index);
        util.localStorageEncrypt.setNumberItem(MjClient.KEY_MJBgType, index);
        postEvent("EZP_cardType", {idx:index, type:"font"}); 
        postEvent("EZP_cardType", {idx:index, type:"size"}); 
    }.bind(this));
};

playPanel_changDePaoHuzi.prototype.isCheckTingStats = function() {
    return true;
};

playPanel_changDePaoHuzi.prototype.isPutCardLayout = function() {
    return true;
};

playPanel_changDePaoHuzi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    // 调用自己的听牌算法
    return MjClient.majiang.getTingStats(sData, pl, putCard);
};

playPanel_changDePaoHuzi.prototype.getCardSrc = function(name, tag, isTurn) {
    var path = this.getCardFilePath();

    if(this.getResType() == 1 && name != "put"){
        path = path.replace("playing/ziPai/", "");
    }

    if (isTurn) {
        path = "playing/changDePaoHuZi/";
        switch (name) {
            case "out":
                return path + "huxiBG.png";
            case "put":
                return path + "normalBG.png";
        }
    }

    return (path + name + tag + ".png");
};
 