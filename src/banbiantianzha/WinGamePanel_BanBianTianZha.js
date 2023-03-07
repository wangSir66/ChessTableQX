function setEndOneViewRoomInfo_BanBianTianZha(node){
    var tData = MjClient.data.sData.tData;
    var text = ""
    text += "房号：" + tData.tableid;
    text += "局数：" + (tData.roundNum_play || (tData.roundAll - tData.roundNum)) + "/" + tData.roundAll + "\n";
    text += getPlaySelectPara(MjClient.gameType, tData.areaSelectMode) + "\n";
    text += MjClient.native.GetVersionName();
    //text += tData.roundEndTime;
    node.setString(text);
    //node.ignoreContentAdaptWithSize(true);
}

function setEndOneViewScoreInfo_BanBianTianZha(node){
    var tData = MjClient.data.sData.tData;

    var score_z = node.getChildByName("score_z");
    var jianfen_num_z = score_z.getChildByName("jianfen_num");
    var chaofen_bum_z = score_z.getChildByName("chaofen_bum");
    var zongfen_num_z = score_z.getChildByName("zongfen_num");
    jianfen_num_z.setString(tData.teams.zhuang.score_draw);
    jianfen_num_z.ignoreContentAdaptWithSize(true);
    chaofen_bum_z.setString(tData.teams.zhuang.score_rank);
    chaofen_bum_z.ignoreContentAdaptWithSize(true);
    zongfen_num_z.setString(tData.teams.zhuang.score_all);
    zongfen_num_z.ignoreContentAdaptWithSize(true);

    var score_x = node.getChildByName("score_x");
    var jianfen_num_x = score_x.getChildByName("jianfen_num");
    var chaofen_bum_x = score_x.getChildByName("chaofen_bum");
    var zongfen_num_x = score_x.getChildByName("zongfen_num");
    jianfen_num_x.setString(tData.teams.xian.score_draw);
    jianfen_num_x.ignoreContentAdaptWithSize(true);
    chaofen_bum_x.setString(tData.teams.xian.score_rank);
    chaofen_bum_x.ignoreContentAdaptWithSize(true);
    zongfen_num_x.setString(tData.teams.xian.score_all);
    zongfen_num_x.ignoreContentAdaptWithSize(true);
}

function setEndOneViewItemHead_BanBianTianZha(node, pl) {
    var img = "png/default_headpic.png";
    if(pl && pl.wxHeadImg)
    {
        img = pl.wxHeadImg;
    }
    var sp = new cc.Sprite(img);
    node.addChild(sp);
    setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);

    setRoundEndUserOffline_hengYang(node,pl);
}

function setEndOneViewItemLabel_BanBianTianZha(node, type) {
    var path = banBianTianZhaSelect.label[type - 1][0];
    if(path) {
        var label = new cc.Sprite(path);
        label.setAnchorPoint(cc.p(0, 0));
        label.setPositionX(node.childrenCount * label.width);
        node.addChild(label);
    }
}

function getEndOneViewCardType_BanBianTianZha(cards) {
    if(MjClient.majiang.isTianZha(cards)){
        return "banbiantianzha/tianzha.png";
    }else if(MjClient.majiang.isDiZha(cards)){
        return "banbiantianzha/dizha.png";
    }else if(MjClient.majiang.isTongHuaShun(cards)){
        return "banbiantianzha/tonghua.png";
    }else if(MjClient.majiang.isZhaDan(cards)){
        return "banbiantianzha/zhadan.png";
    }else if(MjClient.majiang.isTongHuaWuShiK(cards)){
        return "banbiantianzha/zheng510k.png";
    }else if(MjClient.majiang.isZaHuaWuShiK(cards)){
        return "banbiantianzha/fu510k.png";
    }else{
        return null;
    }
}

function setEndOneViewItemCard_BanBianTianZha(node, pl) {
    var posX = 0;
    for(var i = 0; i < pl.cards_put_record.length; i++){
        var putNode = new cc.Node();
        putNode.x = posX;
        putNode.setAnchorPoint(0, 0);
        node.addChild(putNode);
        var poxOffest = 0;
        for(var j = 0; j < pl.cards_put_record[i].length; j++){
            var info = {type:pl.cards_put_record[i][j]};
            var card = new banBianTianZha.Card(info);
            card.x = poxOffest;
            card.setAnchorPoint(0, 0);
            card.scale = 0.4;
            putNode.addChild(card);

            if(j != pl.cards_put_record[i].length - 1){
                poxOffest += 20;
            }
        }
        var path = getEndOneViewCardType_BanBianTianZha(pl.cards_put_record[i]);
        if(path){
            var type = new cc.Sprite(path);
            type.x = (poxOffest + 20) / 2;
            type.y = 30;
            putNode.addChild(type);
        }
        posX += poxOffest + 40;
    }
}

function setEndOneViewItemScoreCard_BanBianTianZha(node, pl) {
    for(var i = pl.stats_draw.length - 1; i >= 0; i--){
        var info = {type:pl.stats_draw[i]};
        var card = new banBianTianZha.Card(info);
        card.anchorX = 1;
        card.anchorY = 0;
        card.scale = 0.35;
        card.x = -node.childrenCount * 20 + node.width;
        card.zIndex = i;
        node.addChild(card);
    }
}

function setEndOneViewItem_BanBianTianZha(node, pl, isZhuang) {
    var head = node.getChildByName("head");
    setEndOneViewItemHead_BanBianTianZha(head, pl);

    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);
    name.setString(getNewName_new(unescape(pl.info.nickname), 4));
    name.setFontName("Arial");
    name.setFontSize(name.getFontSize());

    var label = node.getChildByName("label");
    if(pl.jiachuiNum == 1){
        setEndOneViewItemLabel_BanBianTianZha(label, JIA_ZHU_TYPE.JIA_ZHU);
    }
    if(pl.qiang == 1){
        setEndOneViewItemLabel_BanBianTianZha(label, JIA_ZHU_TYPE.KAI_QIANG);
    }
    if(pl.dou == 1 || pl.dou == 3){
        setEndOneViewItemLabel_BanBianTianZha(label, JIA_ZHU_TYPE.DOU);
    }
    if(pl.fanDou == 1){
        setEndOneViewItemLabel_BanBianTianZha(label, JIA_ZHU_TYPE.FAN_DOU);
    }

    var card = node.getChildByName("card");
    setEndOneViewItemCard_BanBianTianZha(card, pl);

    var scorecard = node.getChildByName("scorecard");
    setEndOneViewItemScoreCard_BanBianTianZha(scorecard, pl);

    var score = node.getChildByName("score");
    var num1 = score.getChildByName("num1");
    var num2 = score.getChildByName("num2");
    num1.ignoreContentAdaptWithSize(true);
    num2.ignoreContentAdaptWithSize(true);
    if(pl.winone >= 0){
        num1.setString(pl.winone);
        num1.setVisible(true);
        num2.setVisible(false);
    }else{
        num2.setString(Math.abs(pl.winone));
        num1.setVisible(false);
        num2.setVisible(true);

        var fuhao = new cc.Sprite("daTongZi/gameOver/biaoti_shuzi2.png", cc.rect(28 * 2, 0, 28, 43));
        fuhao.setPosition(-fuhao.width / 2, num2.height / 2);
        num2.addChild(fuhao);
    }
}

var EndOneView_BanBianTianZha = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[1, 1], [0.5, 0.48], [0, 0]],
            roominfo: {
                _run: function () {
                    setEndOneViewRoomInfo_BanBianTianZha(this);
                }
            },
            scoreinfo: {
                _run: function () {
                    setEndOneViewScoreInfo_BanBianTianZha(this);
                }
            },
            ready: {
                _click: function () {
                    postEvent("clearCardUI");

                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }

                    if (MjClient.endallui)
                    {
                        MjClient.endallui.setVisible(true);
                    }
                }
            },
        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_BanBianTianZha.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        var item = endoneui.node.getChildByName("back").getChildByName("item");
        item.visible = false;

        var tData = MjClient.data.sData.tData;
        for(var i = 0; i < tData.maxPlayer; i++){
            var pl = MjClient.data.sData.players[tData.uids[(tData.zhuang + i) % tData.maxPlayer]];

            var itemNode = item.clone();
            itemNode.visible = true;
            endoneui.node.getChildByName("back").addChild(itemNode);
            itemNode.setPosition(item.x, item.y - i * 140);

            setEndOneViewItem_BanBianTianZha(itemNode, pl, i == 0);
        }

        MjClient.endoneui = this;
        return true;
    },
});