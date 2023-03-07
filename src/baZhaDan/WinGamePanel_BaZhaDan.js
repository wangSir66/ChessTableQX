
function showUsersUI4_BaZhaDan(node){
    var sData = MjClient.data.sData;
    var players = sData.players;
    var tData = sData.tData;
    var teams = sData.teams;
    var rank = tData.rank;
    for(var tid in teams){
        var item = node.getChildByName("item" + tid);
        if(!item){
            break;
        }

        var teamInfo = teams[tid];
        var uids = teamInfo.uids;
        var t_score_spclType_pre = 0;
        for(var i = 0; i < uids.length; i++){
            var rankImg = item.getChildByName("rank" + i);
            rankImg.ignoreContentAdaptWithSize(true);
            var rankIndex = getRankIndexByUid_BaZhaDan(uids[i]);
            rankImg.loadTexture("daTongZi/gameResult/rank" + (rankIndex + 1) + ".png");

            var pl = players[uids[i]];
            addWxHeadToEndUI_BaZhaDan(item.getChildByName("head" + i), pl);

            t_score_spclType_pre += pl.score_spclType_pre;
            var nameTxt = item.getChildByName("name" + i);
            nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
            nameTxt.setFontName("Arial");    
            nameTxt.setFontSize(nameTxt.getFontSize());
            //剩余牌
            var leftNode = item.getChildByName("leftNode" + i);
            var mjhand = pl.mjhand ? pl.mjhand : [];
            MjClient.majiang.formatSort(mjhand);
            var arr = [];
            for(var j = 0; j < mjhand.length; j++){
                var info = new daTongZi.CardInfo();
                info.type = mjhand[j];
                arr.push(info);
            }
            setCardsList_BaZhaDan(arr, leftNode);        
        }  

        teamInfo.score_spclType_pre = t_score_spclType_pre;
        setUserEndOneInfo_BaZhaDan(item, teamInfo);
    }
};

function getRankIndexByUid_BaZhaDan (uid){
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var rank = tData.rank;
    for(var i = 0; i < rank.length; i++){
        if(rank[i] == uid){
            return i;
        }
    }
    return 3;

};

function showUsersUIThree_Two_BaZhaDan(node){
    var sData = MjClient.data.sData;
    var players = sData.players;
    var tData = sData.tData;
    var rank = tData.rank;

    if(MjClient.isDismiss){
        rank = [];
        //解散特殊处理
        for(var n in players){
            rank.push(n);
        }
    }

    for(var i = 0; i < rank.length; i++){
        var pl = players[rank[i]];
        var item = node.getChildByName("item" + i);
        if(!item){
            break;
        }

        var rankImg = item.getChildByName("rank");
        rankImg.loadTexture("daTongZi/gameResult/rank" + (i + 1) + ".png");

        addWxHeadToEndUI_BaZhaDan(item.getChildByName("head"), pl);

        var nameTxt = item.getChildByName("name");
        nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
        nameTxt.setFontName("Arial"); 
        nameTxt.setFontSize(nameTxt.getFontSize());

        setUserEndOneInfo_BaZhaDan(item, pl);

        //剩余牌
        var leftNode = item.getChildByName("leftNode");
        var mjhand = pl.mjhand ? pl.mjhand : [];
        MjClient.majiang.formatSort(mjhand);
        var arr = [];
        for(var j = 0; j < mjhand.length; j++){
            var info = new daTongZi.CardInfo();
            info.type = mjhand[j];
            arr.push(info);
        }
        setCardsList_BaZhaDan(arr, leftNode);
    }
};

function setUserEndOneInfo_BaZhaDan(item, pl){

    var lsjfTxt = item.getChildByName("lsjfTxt"); //历史积分
    lsjfTxt.setString(pl.winall);
    var bjjfTxt = item.getChildByName("bjjfTxt"); //本局积分
    bjjfTxt.setString(pl.winone - pl.score_rank);
    var xfTxt = item.getChildByName("xfTxt"); //喜分
    xfTxt.setString(pl.score_spclType - pl.score_spclType_pre);
    var zxfTxt = item.getChildByName("zxfTxt"); //总喜分
    zxfTxt.setString(pl.score_spclType);

    var danguanJL = item.getChildByName("danguanJL");
    danguanJL.ignoreContentAdaptWithSize(true);
    if(pl.score_rank < 0){

        danguanJL.setProperty(pl.score_rank, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
    }else{
        danguanJL.setProperty("+" + pl.score_rank, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
    }

    var maxPlayer = MjClient.data.sData.tData.maxPlayer;
    if(maxPlayer == 4 && MjClient.data.sData.tData.areaSelectMode.isDivideTeam){
        var icon = item.getChildByName("icon");
        icon.visible = true;
        var val = Math.abs(pl.score_rank);
        var deckNum = parseInt(MjClient.data.sData.tData.areaSelectMode.deckNum);
        deckNum = !deckNum ? 1 : deckNum;
        var num = 40 *  deckNum;
        var src = "daTongZi/gameResult/guanJian1.png";
        if(pl.score_rank < 0){
            if(val >= num){
                src = "daTongZi/gameResult/guanJian2.png";
            }
        }else if(pl.score_rank > 0){
            src = "daTongZi/gameResult/guanJia1.png";
            if(val >= num){
                src = "daTongZi/gameResult/guanJia2.png";
            }
        }else{
            icon.visible = false;
        }
        icon.loadTexture(src);
    }

    if(pl.score_rank == 0){
        danguanJL.setString("");
    }
};

//显示牌
function setCardsList_BaZhaDan(cards, node, colNum){
    var col = Math.ceil(cards.length / 2);
    var row = Math.ceil(cards.length / col);
    cc.log("row:" + row, "col:" + col);
    if(cards.length < 23){
        row = 1;
        col = cards.length;
    }

    if(colNum !== undefined){
        col = colNum;
        row = 2;
    }

    var cardsNode = new daTongZi.LayoutNode();
    for(var i = 0; i < cards.length; i++){
        var card = new baZhaDan.Card(cards[i]);
        cardsNode.addChild(card);
    }
    cardsNode.doLayoutGrid(row,col,-50,-50);
    cardsNode.setAnchorPoint(0,0);
    var scale = Math.min(node.width/cardsNode.width, node.height/cardsNode.height);
    cardsNode.setScaleX(scale);
    cardsNode.setScaleY(scale);
    var ty = (node.height - cardsNode.height * scale) * 0.5;
    if(ty){
        cardsNode.y = ty;
    }
    
    node.addChild(cardsNode);
};

function addWxHeadToEndUI_BaZhaDan(node,pl)
{
    var img = "png/default_headpic.png";
    if(pl && pl.wxHeadImg)
    {
        img = pl.wxHeadImg;
    }
    else
    {
        return;
    }
    var sp = new cc.Sprite(img);
    node.addChild(sp);
    setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);

    setRoundEndUserOffline_BaZhaDan(node,pl);
};

//大结算和小结算   设置玩家掉线头像
function setRoundEndUserOffline_BaZhaDan(node, pl){
    //var pl = getPlayerByIndex(off);
    if(!pl)
    {
        return;
    }
    if (pl.onLine == false )
    {
        var _offline = new cc.Sprite("playing/paohuzi/offLine.png");
        _offline.setName("offline");
        node.addChild(_offline);
        node.getChildByName("offline").x = 44;
        node.getChildByName("offline").y = 44;
        node.getChildByName("offline").zIndex = 99;
        node.setScale(0.8);
        node.getChildByName("offline").visible = !pl.onLine;
    }

    if (pl.onLine == false)
    { 
        var _offLineNode = node.getChildByName("offline");
        _offLineNode.unscheduleAllCallbacks();
        var _currentTime = new Date().getTime();
        _offLineNode.schedule(function(){
            var _timeNode = _offLineNode.getChildByName("offLineTime");
            if (!_timeNode) {

                _timeNode = new ccui.Text();
                _timeNode.setName("offLineTime");
                _timeNode.setFontSize(26);
                _offLineNode.addChild(_timeNode)
            }
            else
            {
                _timeNode.visible = true;
            }

            _timeNode.setPosition(cc.p(_offLineNode.getContentSize().width/2,_offLineNode.getContentSize().height*0.8));

            if (pl.offLineTime)
            {
                var _showTime = _currentTime - pl.offLineTime;
                _timeNode.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            }
            else
            {
                _timeNode.setString("");
            }
        });
    }

}

var EndOneView_BaZhaDan = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[1, 1], [0.5, 0.48], [0, 0]], 
            pingju:
    		{
                 _run: function () {
    		        var sData = MjClient.data.sData;
    		        var tData = sData.tData;
    		        if (MjClient.isDismiss) {
    		            this.loadTexture("daTongZi/gameResult/jiesan.png");
    		        }else{
                        this.loadTexture("daTongZi/gameResult/xiaojie.png");
                    }
    		    }
    		},

            siRen:{
                _run : function(){
                    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
                    this.visible =  (MjClient.MaxPlayerNum == 4 && !areaSelectMode.isDivideTeam);
                    if(this.visible){
                        showUsersUIThree_Two_BaZhaDan(this);
                    }
                }
            },

            siRenTeam:{
                _run : function(){
                    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
                    this.visible =  (MjClient.MaxPlayerNum == 4 && areaSelectMode.isDivideTeam);
                    if(this.visible){
                        showUsersUI4_BaZhaDan(this);
                    }
                }
            },

            sanRen:{
                _run : function(){
                    this.visible = MjClient.MaxPlayerNum == 3;
                    if(this.visible){
                        showUsersUIThree_Two_BaZhaDan(this);
                    }
                },
                dipaiNode:{
                    _run : function(){
                        if(MjClient.MaxPlayerNum == 3){
                            var cards = MjClient.data.sData.cards ? MjClient.data.sData.cards : [];
                            MjClient.majiang.formatSort(cards);
                            var arr = [];
                            for(var j = 0; j < cards.length; j++){
                                var info = new daTongZi.CardInfo();
                                info.type = cards[j];
                                arr.push(info);
                            }
                            setCardsList_BaZhaDan(arr, this, 40);
                        }
                        
                    }
                }
            },

            erRen:{
                _run : function(){
                    this.visible = MjClient.MaxPlayerNum == 2;
                    if(this.visible){
                        showUsersUIThree_Two_BaZhaDan(this);
                    }
                },
                dipaiNode:{
                    _run : function(){
                        if(MjClient.MaxPlayerNum == 2){
                            var cards = MjClient.data.sData.cards ? MjClient.data.sData.cards : [];
                            MjClient.majiang.formatSort(cards);
                            var arr = [];
                            for(var j = 0; j < cards.length; j++){
                                var info = new daTongZi.CardInfo();
                                info.type = cards[j];
                                arr.push(info);
                            }
                            setCardsList_BaZhaDan(arr, this, 35);
                        }
                        
                    }
                }
            },

            ready: {
                _run: function () {
                    this.visible = true;
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },
                _click: function (btn, eT) {
                    cc.log("ready ==== click");

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

                    //reInitarrCardVisible();
                }
            },

        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_BaZhaDan.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        MjClient.endoneui = this;
        return true;
    },
});