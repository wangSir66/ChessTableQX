//新版捉红字
var playPanel_Hongzi = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_ZiPaiHongzi.json");
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
                        MjClient.Scene.addChild(new settingPanel_Hongzi(), 6000);
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
            },
        };
        return jsBind;
    },
});

//手牌张数 
playPanel_Hongzi.prototype.getHandCount = function() {
    return 13;
};

/**
 * 坎牌是否可操作
 */
 playPanel_Hongzi.prototype.is34Mask = function() {
    return false;
};

//Override
playPanel_Hongzi.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_HongZi();
};

//Override
playPanel_Hongzi.prototype.createEndOneLayer = function(type) {
    return new EndOneView_HongZi();
};

//Override
playPanel_Hongzi.prototype.checkBiCards = function () {
  return false;
};

//Override
playPanel_Hongzi.prototype.getChiCards = function () {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    var putCard = sData.tData.lastPutCard;
    return MjClient.majiang.getChiList(pl, putCard);
};

//Override
playPanel_Hongzi.prototype.checkCardCanPut = function(pl, card) {
    return (!MjClient.majiang.isEqualHunCard(card) && (!pl.canNotPutCard||pl.canNotPutCard.indexOf(card)==-1 || MjClient.majiang.getCanPutCardNum(pl) == 0));
};

// 胡息
playPanel_Hongzi.prototype.updateHuXi = function(node) {
    node.setString("");
};

playPanel_Hongzi.prototype.initSettingData = function() {
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

playPanel_Hongzi.prototype.getGameBgList = function() {
    return ["hongZi/gameTable/beijing_1.jpg","hongZi/gameTable/beijing_2.jpg","hongZi/gameTable/beijing_3.jpg","hongZi/gameTable/beijing_4.jpg"];
};

/**
 * @param node 
 * @param {String} type 改变的类型:font|size
 */
playPanel_Hongzi.prototype.changeCardFrame = function(node, type) {
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
playPanel_Hongzi.prototype.getCardFontList = function() {
    return ["playing/paohuzi/", "playing/paohuzi/MJBg1/", "playing/paohuzi/MJBg2/"];
};

//字牌资源路径
playPanel_Hongzi.prototype.getCardFilePath = function() {
    var fontList = this.getCardFontList();
    var fontIdx = this.getCardFontIdx();
    return fontList[fontIdx];
};

// 改变手牌大小
playPanel_Hongzi.prototype.changeHandCardSize = function(handCard) {
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
playPanel_Hongzi.prototype.getHandCardSize = function() 
{
    var handCard = this.getUINode(0).getChildByName("img_handCard");
    var size = handCard.getVirtualRendererSize();
    if (this.getCardFontIdx() == 2) {
        size.width = 100;
    }
    return size;
}

//Override
playPanel_Hongzi.prototype.getOffYByCard = function(card){
    if (this.getCardFontIdx() == 2) {
        return card.height * card.scaleY - card.height / 7 * card.scaleY;
    }
    return card.height * card.scaleY - card.height / 4 * card.scaleY;
}

//Override
playPanel_Hongzi.prototype.getDefaultSetting = function() {
    return {
        layout: 1,
        bg: 0,
        pai: 1,
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

/**
 * 是否需要听听牌提示
 * @returns {boolean}
 */
playPanel_Hongzi.prototype.hasTingByPut = function() {
    return true;
};
//显示操作按钮时的特殊操作
playPanel_Hongzi.prototype.showEatSpecialDeal = function(){
    this.ShowHuTypeText();
};

playPanel_Hongzi.prototype.ShowHuTypeText = function(){
    var pl = this.getUIPlayer(0);

    if(pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var huData = MjClient.majiang.getHuInfo(sData,pl,tData.currCard);

        var nameObj = {heiHu:"黑胡", dianHu: "点胡", shiHong: "十红", manTangHong: "满堂红", xiaoYiSe: "小一色", 
                        daYiSe: "大一色", qiDui: "7对", pengPengHu: "碰碰胡", juJuHong: "句句红", yiGuaBian: "一挂匾",
                        huDieFei: "蝴蝶飞", banBanHu: "板板胡",siPengDanDiao: "四碰单吊", shuangHe:"双合",shiErHong:"十二红",
                        shiYiHong: "十一红", fengDing: "80分封顶", huaHu:"花胡"}; 
        var str = ""; 
        var hzdescNum = 0; // 番型的种类  
        for (var k in huData.hzdesc) {
            str += (nameObj[k] + " " + huData.hzdesc[k] + "分" );
            hzdescNum++;
            var text = huData.hzdesc[k];  
        }

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
playPanel_Hongzi.prototype.isShowCardBack = function(msg) {
    var tData = MjClient.data.sData.tData;  
    return getOffByIndex(tData.curPlayer) != 0 && tData.putType==1 && tData.isLastDraw;
};

playPanel_Hongzi.prototype.isCheckTingStats = function() {
    return true;
}

playPanel_Hongzi.prototype.getTingStats = function(putCard) {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid()];
    return MjClient.majiang.getTingStats(sData, pl, putCard);
}

playPanel_Hongzi.prototype.isPutCardLayout = function() {
    return true;
}

playPanel_Hongzi.prototype.isChargeShuffle = function() {
    return true;
};