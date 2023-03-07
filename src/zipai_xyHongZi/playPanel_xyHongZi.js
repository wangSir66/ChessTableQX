//新版湘阴捉红字
var playPanel_xyHongZi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_ZiPaiXyHongZi.json");
        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn([0.5, 0.4]);
        }
        MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
    },
     getJsBind: function() {
        var jsBind = {
            img_cutLine:{
                 _event: {
                    HZPickCard:function() {
                        MjClient.playui.checkCutLineVisible(this);
                    }
                }
            },
            img_banner: {
                btn_changeBg: {
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
                        MjClient.Scene.addChild(new settingPanel_xyHongZi(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                            uid: SelfUid(),
                            gameType: MjClient.gameType
                        });
                    }
                },
            },
            text_roundInfo: {
                _run:function () {
                    this.visible = false;
                }
            },
            img_gameName: {
                _layout: [[0.15, 0], [0.5, 0.83], [0, 0]],
                _run: function() {
                    this.loadTexture(GameBg[MjClient.gameType]);
                }
            },
            node_down:{ // down玩家节点
                _event: {
                    EZP_cardType: function(eD) {
                        MjClient.playui.changeHandCardSize(this.getChildByName("img_handCard"));
                        var layoutHand = this.getChildByName("layout_handCards");
                        if (layoutHand) {
                            layoutHand.removeAllChildren();
                        }
                        MjClient.playui.refreshHandCard(0);
                        MjClient.playui.changeCardFrame(this, eD.type);
                    }
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]],
                },
                layout_replayCards: {
                    _layout: [[0.1, 0.1], [0.15, 0.05], [0, 0]],
                }
            },
        };
        return jsBind;
    },
});

//手牌张数 
playPanel_xyHongZi.prototype.getHandCount = function() {
    return 13;
};

/**
 * 坎牌是否可操作
 */
 playPanel_xyHongZi.prototype.is34Mask = function() {
    return false;
};

//Override
playPanel_xyHongZi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_xyHongZi();
};

//Override
playPanel_xyHongZi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_xyHongZi();
};

//Override
playPanel_xyHongZi.prototype.checkBiCards = function () {
  return false;
};

//Override
playPanel_xyHongZi.prototype.getChiCards = function () {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;
    return MjClient.majiang.getChiList(pl, putCard);
};

//Override
playPanel_xyHongZi.prototype.checkCardCanPut = function(pl, card) {
    return (!MjClient.majiang.isEqualHunCard(card) && (!pl.canNotPutCard||pl.canNotPutCard.indexOf(card)==-1 || MjClient.majiang.getCanPutCardNum(pl) == 0));
};

// 胡息
playPanel_xyHongZi.prototype.updateHuXi = function(node) {
    node.setString("");
};

playPanel_xyHongZi.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT = MjClient.gameType + "_KEY_ZI_PAI_PLAY_UI_LAYOUT";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE = MjClient.gameType + "_KEY_ZI_PAI_GAME_BG_TYPE";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_ZI_PAI_TYPE";   //字牌游戏字体类型
    MjClient.KEY_ZI_PAI_FAST_EAT_TYPE = MjClient.gameType + "_KEY_ZI_PAI_FAST_EAT_TYPE";   //字牌游戏快速吃牌类型
    MjClient.KEY_ZI_PAI_XU_XIAN_TYPE = MjClient.gameType + "_KEY_ZI_PAI_XU_XIAN_TYPE";   //字牌游戏 虚线位置
    MjClient.KEY_ZI_PAI_SU_DU_TYPE = MjClient.gameType + "_KEY_ZI_PAI_SU_DU_TYPE";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_CARD_SIZE = MjClient.gameType + "_KEY_ZI_PAI_CARD_SIZE"; // 字牌大小
    MjClient.KEY_ZI_PAI_VOICE_TYPE = MjClient.gameType + "_KEY_ZI_PAI_VOICE_TYPE"; // 字牌游戏语音
    MjClient.KEY_ZI_PAI_PLAY_TING_PAI = MjClient.gameType + "_KEY_ZI_PAI_PLAY_TING_PAI";   //听牌提示
    MjClient.KEY_ZI_PAI_HU_XI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_HU_XI_TYPE";   //胡息显示
    MjClient.KEY_ZI_PAI_CHU_PAI_TYPE = MjClient.gameType + "_KEY_ZI_PAI_CHU_PAI_TYPE";   //字牌出牌按钮
    MjClient.KEY_ZI_PAI_CHU_PAI_GUIDE = MjClient.gameType + "_KEY_ZI_PAI_CHU_PAI_GUIDE";   //字牌出牌提示
};

playPanel_xyHongZi.prototype.getGameBgList = function() {
    return ["hongZi/gameTable/beijing_1.jpg","hongZi/gameTable/beijing_2.jpg","hongZi/gameTable/beijing_3.jpg","hongZi/gameTable/beijing_4.jpg"];
};

/**
 * @param node 
 * @param {String} type 改变的类型:font|size
 */
playPanel_xyHongZi.prototype.changeCardFrame = function(node, type) {
    var childArray = node.getChildren();
    var len = childArray.length;
    for (var i = 0; i < len; i++) {
        var child = childArray[i];
        this.changeCardFrame(child, type);
    }
    if (node.toString() != "[object ImageView]") {
        return;
    }
    var oldFile = node.getRenderFile().file;
    var list = [];
    var idx = 0;

    idx = this.getCardFontIdx();
    var cardFontList = this.getCardFontList();
    var newFile = "";
    for (var i = cardFontList.length-1; i >=0; i--) {
        if (oldFile.indexOf(cardFontList[i]) != -1) {
            newFile = oldFile.replace(cardFontList[i], cardFontList[idx]);
            break;
        }
    }
    if (newFile != oldFile && ((jsb.fileUtils.isFileExist(newFile) && this.getResType() == 0) || this.getResType() == 1)) {
        this.loadCardTexture(node, newFile, (node.getParent().getName() == "img_putCard" || (this.isShowLongCard() && node == MjClient.movingCard_paohuzi)) ? 0 : this.getResType())
    }
};

//字牌字体列表
playPanel_xyHongZi.prototype.getCardFontList = function() {
    return ["playing/paohuzi/", "playing/paohuzi/MJBg1/", "playing/paohuzi/MJBg2/"];
};

//字牌资源路径
playPanel_xyHongZi.prototype.getCardFilePath = function() {
    var fontList = this.getCardFontList();
    var fontIdx = this.getCardFontIdx();
    return fontList[fontIdx];
};

// 改变手牌大小
playPanel_xyHongZi.prototype.changeHandCardSize = function(handCard) {
    var src = this.getCardSrc("hand", 1)
    //handCard.loadTexture(src, this.getResType());
    this.loadCardTexture(handCard, src, this.getResType());
    var sizeIdx = this.getCardSizeIdx();
    var changeCardSize = sizeIdx == 0 ? 1 : 0.8;// 手牌大小修改
    var fontIdx = this.getCardFontIdx()

    switch (fontIdx) {
        case 0:
            setWgtLayout(handCard, [98/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
            break;
        case 1:
            setWgtLayout(handCard, [95/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
            break;
        case 2:
            setWgtLayout(handCard, [100/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
            break;
    }
};

//Override
playPanel_xyHongZi.prototype.getHandCardSize = function() 
{
    var handCard = this.getUINode(0).getChildByName("img_handCard");
    var size = handCard.getVirtualRendererSize();
    if (this.getCardFontIdx() == 2) {
        size.width = 100;
    }
    return size;
}

//Override
playPanel_xyHongZi.prototype.getOffYByCard = function(card){
    if (this.getCardFontIdx() == 2) {
        return card.height * card.scaleY - card.height / 7 * card.scaleY;
    }
    return card.height * card.scaleY - card.height / 4 * card.scaleY;
}

//Override
playPanel_xyHongZi.prototype.getDefaultSetting = function() {
    return {
        layout: 1,
        bg: 2,
        pai: 2,
        fastEat: 0,
        huXi: 1,
        xuXian: 0,
        suDu: 0,
        size: 0,
        voice: 0,
        ting: 0,
        chuBtn: 0,
        dblClick: 1,
        chuGuide:0,
    };
};

//显示操作按钮时的特殊操作
playPanel_xyHongZi.prototype.showEatSpecialDeal = function(){
    this.ShowHuTypeText();
};

playPanel_xyHongZi.prototype.ShowHuTypeText = function(){
    var pl = this.getUIPlayer(0);

    if(pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var huData = MjClient.majiang.getHuInfo(sData,pl,tData.currCard);

        var nameObj = {heiHu:"黑胡", dianHu: "点胡", shiHong: "十红",  xiaoYiSe: "小一色", 
                        daYiSe: "大一色", qiDui: "7对", pengPengHu: "碰碰胡", juJuHong: "花胡", siPengDanDiao: "四碰单吊" }; 
        var str = ""; 
        var hzdescNum = 0; // 番型的种类  
        for (var k in huData.hzdesc) {
            str += (nameObj[k] + " " + huData.hzdesc[k] + "分" );
            hzdescNum++;
            var text = huData.hzdesc[k];  
        }

        cc.log(JSON.stringify(huData));
        if(str.length <= 0){ 
            str = "小胡 " + huData.score + "分";
        }else if(hzdescNum > 1){
            str = "大胡 " + huData.score + "分";
        }
        var node_eatChoice = MjClient.playui.jsBind.node_eatChoice;
        var huText = node_eatChoice.btn_hu._node.getChildByName("huTypeText");     
        huText.setString(str);
    }
};

 // 摸牌是否显示牌背
playPanel_xyHongZi.prototype.isShowCardBack = function(msg) {
    var tData = MjClient.data.sData.tData;  
    return getOffByIndex(tData.curPlayer) != 0 && tData.putType==1 && tData.isLastDraw;
};

playPanel_xyHongZi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_xyHongZi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playPanel_xyHongZi.prototype.hasTingByPut = function() {
    return true;
};

playPanel_xyHongZi.prototype.isChargeShuffle = function() {
    return true;
};