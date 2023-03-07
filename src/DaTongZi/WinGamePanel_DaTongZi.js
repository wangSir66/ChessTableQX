

function SetEndOneUserUI_daTongZi(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    node.setVisible(true);
    node = node.getChildByName("head");

    // var zhuangNode = node.getChildByName("zhuang");
    // var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    // zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    // zhuangNode.zIndex=10;

    //add by sking
    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);


    var uibind = {
        head: {
            name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function () {
                    var _nameStr = unescape(pl.info.nickname ) + "";
                    //this.ignoreContentAdaptWithSize(true);
                    return getNewName_new(_nameStr, 4);
                }
            },
            id: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return "ID:" + pl.info.uid.toString();
                }
            },
            stand: {
                _visible: false,
                _run: function () {
                    var arry = [];

                    //添加手牌
                    for (var i = 0; i < pl.mjhand.length; i++) {
                        arry.push(getNewCard_card(node, "stand", "mjhand", pl.mjhand[i], 0));
                    }

                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                        arry[i].setScale(arry[i].getScale() * 0.75);
                    }
                    CardLayoutRestoreForEndOne_ty(node, pl);
                }
            }
        }
		, winNum: {
		    _text: function () {
		        var pre = "";
		        if (pl.winone > 0) pre = "+";
		        return pre + pl.winone;
		    }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
		}
        , cardNum : {
            _visible: false,
            _run: function() {
                this.ignoreContentAdaptWithSize(true);
                if( pl.mjhand.length > 0)
                    this.visible = true;
            },
            _text: function() {
                return '剩' + pl.mjhand.length + '张';
            }
        }
        , desc: {
            _visible: false,
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                console.log('desc desc pl.zhaDanCount', pl.uid, pl.zhaDanCount, tData.ht10Player)
                var iszhaniao = tData.areaSelectMode.hongTao10Niao && tData.ht10Player == tData.uids.indexOf(pl.info.uid);
                if(pl.zhaDanCount > 0 || iszhaniao)
                    this.visible = true;
            },
            _text: function () {
                var str = '';
                if(pl.zhaDanCount > 0){
                    str += '炸弹:' + pl.zhaDanCount;
                }

                var iszhaniao = tData.areaSelectMode.hongTao10Niao && tData.ht10Player == tData.uids.indexOf(pl.info.uid);
                if(iszhaniao){
                    if(str.length > 0)  str += '\n';
                    str += '扎鸟';
                }
                console.log('desc desc _text pl.zhaDanCount', pl.zhaDanCount, tData.ht10Player)

                return str;
            },  
        }
        , zhadanfanbei: {
            _run: function() {
                if (!tData.areaSelectMode.isZhaDanFanBei || !pl.zhaDanCount || pl.zhaDanCount <= 0 || pl.winone <= 0)
                {
                    this.visible = false;
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
                    sprites[i].y = this.height/2;
                    if (i == 0)
                        sprites[i].x = 65 + width/2;
                    else
                        sprites[i].x = 65 + (len - i) * width + width/2;

                    if (width < sprites[i].width)
                        sprites[i].scale = width/sprites[i].width;

                    this.addChild(sprites[i]);
                }
            }   
        }
    }
    BindUiAndLogic(node.parent, uibind);
    addWxHeadToEndUI(uibind.head._node, off);
    //uibind.winNum._node.y=uibind.head._node.y;
}

function CardLayoutRestoreForEndOne_daTongZi(node, plNode) {
    var layoutType = false;//默认排序
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl; //player 信息

    pl = plNode;//获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    var children = node.children;
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking

    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start;
    start = stand;
    var upSize = start.getSize();
    var upS = start.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = [];//癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (MjClient.data.sData.tData.hunCard == ci.tag) {
                uihun.push(ci);
            }
            else {
                uistand.push(ci);
            }

            if (MjClient.data.sData.tData.hunCard == ci.tag) {
                //ci.setColor(cc.color(255,255,63));
            }

            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(22, 35)
            }

        }
        else if (ci.name == "standPri") {
            uistand.push(ci);
        }
        else if (ci.name == "mjhand_replay") {
            uistand.push(ci);
            var _smallFlower = ci.getChildByName("cardType").getChildByName("smallFlower");
            if (_smallFlower) {
                _smallFlower.setPosition(22, 35)
            }
        }
    }

    /*
     排序方式
     */
    var rankType = 1;//0 从小到大排序 ，1 按照算法排序
    var pro_rankType = false;
    if (!layoutType) {
        pro_rankType = false;
    }
    else {
        pro_rankType = true;
    }

    if (rankType == 0) {
        uistand.sort(TagOrder);
    }
    else {
        if (pl.mjhand.length > 0) {
            var mjhandPai = tempMaJiang.sortHandCards(pl.mjhand, pro_rankType);
            var cardCount = 0;
            var tempuistand = uistand.slice();
            cc.log(pro_rankType + "=========  mjhandPai = " + JSON.stringify(mjhandPai));
            var myUiStand = []; //重新排序后
            for (var j = 0; j < mjhandPai.length; j++) {
                for (var i = 0; i < tempuistand.length; i++) {
                    var tag = tempuistand[i].tag;
                    if (tag == mjhandPai[j]) {
                        myUiStand.push(tempuistand[i]);
                        var index = tempuistand.indexOf(tempuistand[i]);
                        tempuistand.splice(index, 1);
                        cardCount++;
                    }
                }
            }
            uistand = myUiStand;
        }
    }


    if (uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uihun.length; i++) {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }

    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];

    var orders = []; //重新排序后装到数组里 by sking
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            orders.push(uis[i]);
        }
    }

    //设置麻将位置
    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];
        if (i != 0) {
            if (ci.name == orders[i - 1].name) {
                if (ci.name == "mjhand") {
                    ci.x = orders[i - 1].x + upSize.width * upS * 0.4;//调牌的距离的
                }
            }
        }
        else {
            ci.x = start.x + upSize.width * upS * 0.1;
        }

        ci.zIndex = i;
    }
};

function showUsersUI4_daTongZi(node){
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
        for(var i = 0; i < uids.length; i++){
            var rankImg = item.getChildByName("rank" + i);
            rankImg.ignoreContentAdaptWithSize(true);
            var rankIndex = getRankIndexByUid_daTongZi(uids[i]);
            rankImg.loadTexture("daTongZi/gameResult/rank" + (rankIndex + 1) + ".png");

            var pl = players[uids[i]];
            addWxHeadToEndUI_daTongZi(item.getChildByName("head" + i), pl);

            var nameTxt = item.getChildByName("name" + i);
            nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4)); 
            nameTxt.setFontName("Arial");   

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
            setCardsList_daTongZi(arr, leftNode);        
        }  

        setUserEndOneInfo_daTongZi(item, teamInfo);
    }
};

function getRankIndexByUid_daTongZi (uid){
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

function addTrustIcon_daTongZi(head){
    var sp = new cc.Sprite("daTongZi/playing/tuoguan.png");
    sp.setAnchorPoint(0.5,0.5);
    sp.x = 10;
    sp.y = head.height - 10;
    head.addChild(sp);
};

function showUsersUIThree_Two_daTongZi(node){
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

        addWxHeadToEndUI_daTongZi(item.getChildByName("head"), pl);

        if(pl.isTrust){
            addTrustIcon_daTongZi(item.getChildByName("head"));
        }

        var nameTxt = item.getChildByName("name");
        nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
        nameTxt.setFontName("Arial");
        nameTxt.setFontSize(nameTxt.getFontSize());

        setUserEndOneInfo_daTongZi(item, pl);

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
        setCardsList_daTongZi(arr, leftNode);
    }
};

function setUserEndOneInfo_daTongZi(item, pl){
    

    var jifenTxt = item.getChildByName("jifen");
    jifenTxt.setString(pl.winone);

    var danguanJL = item.getChildByName("danguanJL");
    danguanJL.ignoreContentAdaptWithSize(true);
    if(pl.score_rank < 0){

        danguanJL.setProperty(pl.score_rank, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
    }else{
        danguanJL.setProperty("+" + pl.score_rank, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
    }

    var maxPlayer = MjClient.data.sData.tData.maxPlayer;
    if(maxPlayer == 4){
        var icon = item.getChildByName("icon");
        icon.visible = true;
        var val = Math.abs(pl.score_rank);
        var src = "daTongZi/gameResult/guanJian1.png";
        if(pl.score_rank < 0){
            if(val >= 100){
                src = "daTongZi/gameResult/guanJian2.png";
            }
        }else if(pl.score_rank > 0){
            src = "daTongZi/gameResult/guanJia1.png";
            if(val >= 100){
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


    var fenShuDes = item.getChildByName("fenShuDes");
    var stats_draw = pl.stats_draw;
    for(var n in stats_draw){
        var fenNode = fenShuDes.getChildByName("fen"+n);
        var numTxt = fenNode.getChildByName("numTxt");
        numTxt.setString("x" + stats_draw[n]);

        var zongfen = fenNode.getChildByName("zongfen");
        var score = MjClient.majiang.getCardScore(parseInt(n));
        zongfen.setString(score * parseInt(stats_draw[n]) + "分");
    }

    // var SPCL_TYPE = {
        //     noType: 0,      // 非特殊牌型
        //     tongZiK: 1,     // K筒子
        //     tongZiA: 2,     // A筒子
        //     tongZi2: 3,     // 2筒子
        //     tongZiJoker: 4, // 王筒子
        //     diZha: 5,       // 地炸
        //     xiSmallJoker: 6,// 小王喜
        //     xiBigJoker: 7,  // 大王喜
        //     xiOther: 8      // 除大小王外 喜
            // xiSmall: 9,     // 5-Q喜
            // xiK: 10,        // K喜 
            // xiA: 11,        // A喜
            // xi2: 12,        // 2喜
        // }
    var stats_spclType = pl.stats_spclType;

    var scoreTz = 0; //筒子分
    var tzCount = 0; //筒子个数
    for(var j = 1; j <= 4; j++){
        var score = MjClient.majiang.getSpclTypeScore(j);
        var count = parseInt(stats_spclType[j]);
        scoreTz += score * count;
        tzCount += count;
    }
    var fenNode = fenShuDes.getChildByName("fenTz");
    var numTxt = fenNode.getChildByName("numTxt");
    numTxt.setString("x" + tzCount);
    var zongfen = fenNode.getChildByName("zongfen");
    zongfen.setString(scoreTz + "分");

    var scoreXi = 0; //喜分
    var xiCount = 0; //喜个数
    for(var j = 6; j <= 12; j++){
        if(!stats_spclType[j]){
            continue;
        }
        var score = MjClient.majiang.getSpclTypeScore(j);
        var count = parseInt(stats_spclType[j]);
        scoreXi += score * count;
        xiCount += count;
    }
    var fenNode = fenShuDes.getChildByName("fenXi");
    var numTxt = fenNode.getChildByName("numTxt");
    numTxt.setString("x" + xiCount);
    var zongfen = fenNode.getChildByName("zongfen");
    zongfen.setString(scoreXi + "分");

    var scoreDz = 0; //地炸分
    var dZCount = 0; //个数
    var score = MjClient.majiang.getSpclTypeScore(5);
    dZCount = parseInt(stats_spclType[5]); 
    scoreDz += score * dZCount;
    var fenNode = fenShuDes.getChildByName("fenDz");
    var numTxt = fenNode.getChildByName("numTxt");
    numTxt.setString("x" + dZCount);
    var zongfen = fenNode.getChildByName("zongfen");
    zongfen.setString(scoreDz + "分");
};

//显示牌
function setCardsList_daTongZi(cards, node, colNum){
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
        var card = new daTongZi.Card(cards[i]);
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

function addWxHeadToEndUI_daTongZi(node,pl)
{
    var img = "png/default_headpic.png";
    if(pl && pl.wxHeadImg)
    {
        img = pl.wxHeadImg;
        loadWxHead();
    }
    else
    {
        cc.loader.loadImg(pl.info.headimgurl, {isCrossOrigin: true}, function(err, texture) {
            if (!err && texture) {
                img = texture;
                loadWxHead();
            }
        });
    }

    function loadWxHead() {
        var sp = new cc.Sprite(img);
        node.addChild(sp);
        setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);

        setRoundEndUserOffline_daTongZi(node,pl);
    }
    
};

//大结算和小结算   设置玩家掉线头像
function setRoundEndUserOffline_daTongZi(node, pl){
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




var EndOneView_daTongZi = cc.Layer.extend({
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
                    this.visible =  MjClient.MaxPlayerNum == 4;
                    if(this.visible){
                        showUsersUI4_daTongZi(this);
                    }
                },
                dipaiNode:{
                    _run : function(){
                        if(MjClient.MaxPlayerNum == 4){
                            var cards = MjClient.data.sData.cards ? MjClient.data.sData.cards : [];
                            MjClient.majiang.formatSort(cards);
                            var arr = [];
                            for(var j = 0; j < cards.length; j++){
                                var info = new daTongZi.CardInfo();
                                info.type = cards[j];
                                arr.push(info);
                            }
                            setCardsList_daTongZi(arr, this);
                        }
                    }
                }
            },

            sanRen:{
                _run : function(){
                    this.visible = MjClient.MaxPlayerNum == 3;
                    if(this.visible){
                        showUsersUIThree_Two_daTongZi(this);
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
                            setCardsList_daTongZi(arr, this, 32);
                        }
                        
                    }
                }
            },

            erRen:{
                _run : function(){
                    this.visible = MjClient.MaxPlayerNum == 2;
                    if(this.visible){
                        showUsersUIThree_Two_daTongZi(this);
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
                            setCardsList_daTongZi(arr, this);
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

            xiPai: {
                    _run: function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        // 非回放状态 洗牌按钮可见
                        this.visible = (MjClient.rePlayVideo == -1 && sData.tData.roundNum > 0 && !tData.matchId);

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
                        });
                    } 
                }

        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_DaTongZi.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        MjClient.endoneui = this;
        return true;
    },
});