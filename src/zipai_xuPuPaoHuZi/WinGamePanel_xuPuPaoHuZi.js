/*
* @Author: Administrator
* @Date:   2019-08-20 14:15:19
* @Last Modified by:   zzj
* @Last Modified time: 2019-10-17 17:03:39
*/
function addPlayerHandCards_xuPuPaoHuZi(node, off) {
    var card = node.getChildByName("card");
    card.visible = false;
    var pl = MjClient.playui.getUIPlayer(off);
    var cardArr = MjClient.majiang.sortCard(pl.mjhand, 1);
    for(var i  = 0; i < cardArr.length; i++){
        var lineNode = new cc.Node();
        for(var j = 0; j < cardArr[i].length; j++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.playui.getCardSrc("out", cardArr[i][j]));
            lineNode.addChild(cardClone);
            cardClone.y = j * cardClone.height * cardClone.scale;
        }
        node.addChild(lineNode);
        if(node.getName() == "leftPanel"){
            lineNode.x = i * card.width * card.scale;
        }else if(node.getName() == "rightPanel"){
            lineNode.x = node.width - i * card.width * card.scale;
        }
    }
}
function addDiPaiCards_xuPuPaoHuZi(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    var cnt = MjClient.majiang.getAllCardsTotal();
    for(var i = tData.cardNext; i < cnt; i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.playui.getCardSrc("out", cards[i]));

        cardClone.x = (i - tData.cardNext) % 40 * cardClone.width * cardClone.scale;
    }
    node.setInnerContainerSize(cc.size(card.width * card.scaleX * (cnt - tData.cardNext) + 6, node.height));
    node.setBounceEnabled(true);
}
function addMaiPaiCards_xuPuPaoHuZi(node) {
    var card = node.getChildByName("card");
    card.visible = false;

    var tData = MjClient.data.sData.tData;
    var cards = MjClient.data.sData.cards;
    var index = MjClient.majiang.getAllCardsTotal();
    for(var i = index; i < cards.length; i++){
        var cardClone = card.clone();
        cardClone.visible = true;
        node.addChild(cardClone);
        cardClone.loadTexture(MjClient.playui.getCardSrc("out", cards[i]));

        cardClone.x = (i - index) % 40 * cardClone.width * cardClone.scale;
        cardClone.y = (1 - Math.floor((i - index) / 40)) * cardClone.height * cardClone.scale;
    }
} 
function CircularCuttingHeadImg_xuPuPaoHuZi(node, pl) {
    var url = pl.info.headimgurl;
    if(!url) url = "png/default_headpic.png";
    cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
    {
        if(!err && texture && cc.sys.isObjectValid(node))
        {
            var clippingNode = new cc.ClippingNode();
            var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
            clippingNode.setAlphaThreshold(0);
            clippingNode.setStencil(mask);
            var img = new cc.Sprite(texture);
            img.setScale(mask.getContentSize().width / img.getContentSize().width);
            clippingNode.addChild(img);
            clippingNode.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            //遮罩框
            var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
            hideblock.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            node.addChild(clippingNode);
            node.addChild(hideblock);
        }
    });
}
function setSortCard_xuPuPaoHuZi(node, item, pl) {
    var sortArr = pl.mjsort;
    var tData = MjClient.data.sData.tData;
    var mathXp = MjClient.majiang;
    var sortTitle = {
                mjwei:{resPath:"gameOver/xuPuPaoHuZi/wei.png", count:3},
                wei:{resPath:"gameOver/xuPuPaoHuZi/wei.png", count:3},
                mjpeng:{resPath:"gameOver/xuPuPaoHuZi/peng.png", count:3},
                peng:{resPath:"gameOver/xuPuPaoHuZi/peng.png", count:3},
                mjchi:{resPath:"gameOver/xuPuPaoHuZi/chi.png", count:3},
                chi:{resPath:"gameOver/xuPuPaoHuZi/chi.png", count:3},
                kan:{resPath:"gameOver/xuPuPaoHuZi/kan.png", count:3},
                jiao:{resPath:"gameOver/xuPuPaoHuZi/jiao.png", count:3},
                mjgang0:{resPath:"gameOver/xuPuPaoHuZi/pao.png", count:4},
                pao:{resPath:"gameOver/xuPuPaoHuZi/pao.png", count:4},
                mjgang1:{resPath:"gameOver/xuPuPaoHuZi/ti.png", count:4},
                ti:{resPath:"gameOver/xuPuPaoHuZi/ti.png", count:4},
                dan:{resPath:"gameOver/xuPuPaoHuZi/dan.png", count:1}
    };
    
    this.huCard = null;
    var xGap = 1;   //横向间隙
    function addOneItem(itemName, cards, huXi, isCheckHuIcon) {
        var itemClone = item.clone();
        itemClone.visible = true;
        node.addChild(itemClone);

        var head = itemClone.getChildByName("head");
        head.loadTexture(sortTitle[itemName].resPath);

        var card = itemClone.getChildByName("card");
        card.visible  = false;

        for(var i = 0; i < cards.length; i++){
            var cardClone = card.clone();
            cardClone.visible = true;
            cardClone.loadTexture(MjClient.playui.getCardSrc("out", cards[i]));
            itemClone.addChild(cardClone);

            if(isCheckHuIcon && cards[i] == this.huCard) {
                var huIcon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                huIcon.setAnchorPoint(cc.p(1,1));
                huIcon.setPosition(cc.p(cardClone.width * cardClone.scale, cardClone.height * cardClone.scale));
                cardClone.addChild(huIcon);
                this.huCard = null;
            }

            cardClone.y += i * cardClone.height * cardClone.scale * 0.6;
            cardClone.zIndex = cards.length - i;
        }

        //列胡息
        var txtHuXi = itemClone.getChildByName("txt_huXi");
        if (cc.sys.isObjectValid(txtHuXi)) {
            txtHuXi.ignoreContentAdaptWithSize(true);
            txtHuXi.setString(huXi);
            //txtHuXi.y = lastY - (card.height * card.scaleY / 2) - 20;
        }

        item.x += item.width + xGap;
    }

    var handArr;
    if(tData.uids[tData.winner] == pl.info.uid && !tData.isLastDraw) {
        this.huCard = tData.lastPutCard;
    }

    for(var i = 0; i < sortArr.length; i++){
        var name =  sortArr[i].name;
        var pos = sortArr[i].pos;
        var cards = [];
        var biCards = null;
        if(name == "mjchi"){
            cards = pl[name][pos].eatCards.slice();
            var bi = pl[name][pos].biCards;
            if (bi) {
                biCards = bi.slice();
            }
        } else if (name == 'mjgang1' || name == 'mjgang0') {
            //构造数据
            var card = pl[name][pos];
            if (card > 300) {
                cards = [card, card - 200, card - 200, card];
            } else {
                cards = [card, card, card + 200, card + 200];
            }
        } else {
            cards = pl[name][pos].slice();
        }

        var huXi = getRowHuXi(cards, name);
        addOneItem(name, cards, huXi, pl.isHuByHand);

        if (biCards) {
            for (var j = 0; j < biCards.length; j++) {
                huXi = getRowHuXi(biCards[j], name);
                addOneItem(name, biCards[j], huXi, false);
            }
        }
    }

    if(tData.uids[tData.winner] == pl.info.uid){
        handArr = pl.handSort;
    }else{
        handArr = mathXp.sortCard(pl.mjhand, 1);
        //提取单牌列
        var okArr = [];
        var danArr = [];
        for(var i=0; i<handArr.length; i++) {
            var arr = handArr[i];
            if(isTi(arr) || isKan(arr) || isJu(arr) || isJiao(arr)) {
                okArr.push(arr);
            }
            else {
                for (var j = 0; j < arr.length; j++) {
                    danArr.push(arr[j]);
                }
            }
        }

        //单牌组成列并排序
        var copy = danArr.slice();
        copy.sort(function(a, b){
            return mathXp.value(a) - mathXp.value(b);
        });
        danArr = [];
        var temp = [];
        for(var i=0; i<copy.length; i++) {
            if(temp.length < 3) {
                temp.push(copy[i]);
            }else {
                danArr.push(temp);
                temp = [];
                temp.push(copy[i]);
            }
            if(i == (copy.length -1)) {
                danArr.push(temp);
            }
        }

        handArr = okArr.concat(danArr);
    }

    //剔除空列
    for (var i = handArr.length - 1; i >= 0; i--) {
        if(handArr[i].length == 0) {
            handArr.splice(i, 1);
        }
    }   

    //按照策划要求，对牌型进行排列
    var ti = [];
    var kan = [];
    var ju = [];
    var jiao = [];
    var dan = [];
    for(var i=0; i<handArr.length; i++) {
        var arr = handArr[i];
        if((arr.name && arr.name == 'ti')) 
            ti.push(arr);
        else if(arr.name && arr.name == 'kan')
            kan.push(arr);
        else if(arr.name && arr.name == 'chi')
            ju.push(arr);
        else if(arr.name && arr.name == 'jiao')
            jiao.push(arr);
        else 
            dan.push(arr);
    }
    handArr = [];
    handArr = handArr.concat(ti);
    handArr = handArr.concat(kan);
    handArr = handArr.concat(ju);
    handArr = handArr.concat(jiao);
    handArr = handArr.concat(dan);

    for(var i = 0; i < handArr.length; i++){
        if(handArr[i].name) {   //只有赢家服务器才是服务器发的
            addOneItem(handArr[i].name, handArr[i].cards, handArr[i].score, !pl.isHuByHand);
        }else{
            if(isTi(handArr[i])){
                addOneItem("ti", handArr[i], getRowHuXi(handArr[i], 'mjgang1'), !pl.isHuByHand);
            }else if(isKan(handArr[i])) {
                addOneItem("kan", handArr[i], getRowHuXi(handArr[i], 'mjwei'), !pl.isHuByHand);
            }else if(isJu(handArr[i])){
                addOneItem("chi", handArr[i], getRowHuXi(handArr[i], 'mjchi'), !pl.isHuByHand);
            }else if(isJiao(handArr[i])){
                addOneItem("jiao", handArr[i], 0, !pl.isHuByHand);
            }else{
                addOneItem("dan", handArr[i], 0, !pl.isHuByHand);
            }
        }
    }

    // 算息, 写在这里也是操蛋
    function getRowHuXi(row, name) {
        var huXi = 0;
        if ((name == 'mjgang0' || name == 'mjgang1') && isTi(row)) {
            huXi += isRedCard(row[0]) ? (name == 'mjgang0' ? 9 : 12) : (name == 'mjgang0' ? 6 : 9);
        } else if (name == 'mjpeng' && isKan(row)) {
            huXi += isRedCard(row[0]) ? 3 : 1;
        } else if (name == 'mjwei' && isKan(row)) {
            huXi += isRedCard(row[0]) ? 6 : 3;
        } else if (name == 'mjchi' && isXiJu(row)) {
            huXi += isRedCard(row[0]) ? 6 : 3;
        }
        return huXi;
    }

    // 判断提
    function isTi(row) {
        return (row.length == 4 &&
                mathXp.value(row[0]) == mathXp.value(row[1]) &&
                mathXp.value(row[1]) == mathXp.value(row[2]) &&
                mathXp.value(row[2]) == mathXp.value(row[3]))
    }

    // 判断坎
    function isKan(row) {
        return (row.length == 3 &&
                mathXp.value(row[0]) == mathXp.value(row[1]) &&
                mathXp.value(row[1]) == mathXp.value(row[2]))
    }

    // 判断有息句
    function isXiJu(row) {
        if (row.length != 3 || !isSameColor(row)) {
            return false;
        }
        row = row.slice();
        row.sort(function(a, b) {
            return mathXp.value(a) - mathXp.value(b);
        })
        return ((row[0] % 100 == 1 && row[1] % 100 == 2 && row[2] % 100 == 3) ||
                (row[0] % 100 == 2 && row[1] % 100 == 7 && row[2] % 100 == 10))
    }

    // 判断句
    function isJu(row) {
        if (row.length != 3 || !isSameColor(row)) {
            return false;
        }
        row = row.slice();
        row.sort(function(a, b) {
            return mathXp.value(a) - mathXp.value(b);
        })
        return ((row[0] % 100 + 1 == row[1] % 100 && row[1] % 100 + 1 == row[2] % 100) ||
                (row[0] % 100 == 2 && row[1] % 100 == 7 && row[2] % 100 == 10))
    }

    // 判断绞
    function isJiao(row) {
        if (row.length != 3 || isSameColor(row)) {
            return false;
        }
        return ((row[0] % 100 == row[1] % 100) &&
                (row[1] % 100 == row[2] % 100));

    }

    // 是否红牌
    function isRedCard(card) {
        return Math.floor(card / 100) % 2 == 1;
    }

    // 是否同色
    function isSameColor(row) {
        var bRed = isRedCard(row[0]);
        for (var i = 1; i < row.length; i++) {
            if (isRedCard(row[i]) != bRed) {
                return false;
            }
        }
        return true;
    }
}
function setScore_xuPuPaoHuZi(node, pl){
    var tData = MjClient.data.sData.tData;
    var isWinner = (tData.winner != -1 && tData.uids[tData.winner] == pl.info.uid);

    var winKuang = node.getChildByName("img_kuang");
    if (cc.sys.isObjectValid(winKuang)) {
        winKuang.visible = isWinner;
    }

    var pnlHuInfo = node.getChildByName("pnl_winInfo");
    if (cc.sys.isObjectValid(pnlHuInfo)) {
        pnlHuInfo.visible = isWinner;
    }

    //胡息
    var huXi = node.getChildByName("huXi");
    if (cc.sys.isObjectValid(huXi)) {
        huXi.ignoreContentAdaptWithSize(true);
        huXi.visible = false;
        if (isWinner) {
            huXi.visible = true;
            huXi.setString("胡息:" + pl.hzdesc.huXi);
        }
    }
    
    //分数
    var winScore = node.getChildByName("txt_winScore");
    var loseScore = node.getChildByName("txt_loseScore");
    winScore.visible = isWinner || tData.winner == -1;
    loseScore.visible = !isWinner && tData.winner != -1;
    var scoreNode = winScore.visible ? winScore : loseScore;
    scoreNode.ignoreContentAdaptWithSize(true);
    scoreNode.setString(pl.winone);
    if (MjClient.isDismiss) {
        scoreNode.visible = false;
    }

    //名堂(只有 自摸、平胡、放炮 三选一...)
    if (!isWinner) {
        return;
    }
    var mingTangItem = pnlHuInfo.getChildByName("mingTangItem");
    mingTangItem.ignoreContentAdaptWithSize(true);
    mingTangItem.visible = true;
    mingTangItem.setString(pl.hzdesc.name);
}
function setPlayer_xuPuPaoHuZi(node, pl) {
    node.visible = true;
    var headBg = node.getChildByName("headBg");
    CircularCuttingHeadImg_xuPuPaoHuZi(headBg, pl);

    setRoundEndUserOffline_shaoyang(headBg, pl);

    var playerName = node.getChildByName("playerName");
    var _nameStr = unescape(pl.info.nickname ) + "";
    playerName.setString(getNewName (_nameStr)); 
    playerName.setFontName("Arial");
    playerName.setFontSize(playerName.getFontSize());

    var playerId = node.getChildByName("txt_Id");
    playerId.ignoreContentAdaptWithSize(true);
    playerId.setString("ID:" + pl.info.uid);

    var cardSort = node.getChildByName("cardSort");
    var cardItem = cardSort.getChildByName("cardItem");
    cardItem.visible = false;
    setSortCard_xuPuPaoHuZi(cardSort, cardItem, pl);
    setScore_xuPuPaoHuZi(node, pl);
}
function addPlayerItem_xuPuPaoHuZi(node) {
    var winner = node.getChildByName("winner");
    winner.visible = false;
    var player = node.getChildByName("player");
    player.visible = false;

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var firstIndex = tData.winner != -1 ? tData.winner : tData.uids.indexOf(SelfUid());
    var firstPlayer = tData.uids[firstIndex];

    var firstNode = winner.clone();
    node.addChild(firstNode);
    setPlayer_xuPuPaoHuZi(firstNode, sData.players[firstPlayer]);

    var cnt = 0;
    for(var uid in sData.players){
        if(uid == firstPlayer){
            continue;
        }
        var item;
        if(MjClient.playui.getPlayersNum() == 2){
            item = winner.clone();
            item.x += winner.width + 23;
        }else{
            item = player.clone();
            item.y -= cnt * (item.height * item.scaleY + 10);
            cnt++;
        }
        setPlayer_xuPuPaoHuZi(item, sData.players[uid]);
        node.addChild(item);
    }
}
var EndOneView_xuPuPaoHuZi = cc.Layer.extend({
    
    jsBind: {
        root: {
            _layout: [[1, 0], [0.5, 0.5], [0, 0]],
            _visible: true
        },
        block: {
            _layout: [[1, 0], [0.5, 0.5], [0, 0]],
            _run:function () {
                MjClient.endoneui.block = this;
            }
        },
        playPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                this.visible = false;
                MjClient.endoneui.playerPanel = this;
            },
            leftPanel: {
                _run: function () {
                    if(MjClient.rePlayVideo != -1){
                        this.visible = false;
                    }
                    addPlayerHandCards_xuPuPaoHuZi(this, MjClient.playui.getPlayersNum() - 1);
                }
            },
            rightPanel: {
                _run: function () {
                    if (MjClient.playui.getPlayersNum() == 2 || MjClient.rePlayVideo != -1) {
                        this.visible = false;
                    }
                    addPlayerHandCards_xuPuPaoHuZi(this, MjClient.playui.getPlayersNum() - 2);
                }
            },
        },
        resultPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function () {
                MjClient.endoneui.resultPanel = this;
                addPlayerItem_xuPuPaoHuZi(this);
            },
            titleResult: {
                _run: function () {
                    var tData = MjClient.data.sData.tData;
                    if (tData.winner == -1) {
                        this.loadTexture("gameOver/pingju_03.png");
                        if (MjClient.isDismiss) {
                            this.loadTexture("gameOver/jiesan.png");
                        }
                    } else {
                        if (tData.uids[tData.winner] == SelfUid()) {
                            this.loadTexture("gameOver/duihuan_10.png");
                        } else {
                            this.loadTexture("gameOver/duihuan_16.png");
                        }
                    }
                }
            },
            diPai:{
                view_dipai:{
                    _run:function () {
                        addDiPaiCards_xuPuPaoHuZi(this);
                    }
                }
            },
            maiPai:{
                _run:function () {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.visible = tData.areaSelectMode.maiPaiNum > 0;
                },
                cardList:{
                    _run:function () {
                        addMaiPaiCards_xuPuPaoHuZi(this);
                    }
                }
            },
            dissType: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setVisible(MjClient.isDismiss);
                    if (MjClient.isDismiss)
                    {  
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if(pl) {
                            var name  =  unescape(pl.info.nickname );
                            delStr = name + pl.mjdesc[0]; 
                        } else {
                            delStr = tData.dissolveWay == -1? '系统停服自动解散房间':'会长或管理员解散房间';
                        }  
                        this.setString("" + delStr) ;
                    }
                }
            }
        },
        commonPanel: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            switchBtn: {
                buttonBg: {
                    _run: function () {
                        MjClient.endoneui.switchButtonBg = this;
                    }
                },
                resultShow: {
                    _click: function (btn, eT) {
                        MjClient.endoneui.switchButtonBg.x = btn.x;
                        MjClient.endoneui.block.visible = true;
                        MjClient.endoneui.playerPanel.visible = false;
                        MjClient.endoneui.resultPanel.visible = true;
                    }
                },
                playShow: {
                    _click: function (btn, eT) {
                        MjClient.endoneui.switchButtonBg.x = btn.x;
                        MjClient.endoneui.block.visible = false;
                        MjClient.endoneui.playerPanel.visible = true;
                        MjClient.endoneui.resultPanel.visible = false;
                    }
                }
            },
            continueBtn: {
                _click: function (btn, eT) {
                    postEvent("clearCardUI");
                    postEvent("clearCardArr");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPass"
                        });
                    }
                    if (MjClient.endallui)
                    {
                        MjClient.endallui.visible = true;
                    }
                }
            },
            roundInfo: {
                _run: function () {
                    this.setString(GameCnName[MjClient.gameType]);
                }
            },
        }
    },
    
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_xuPuPaoHuZi.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        return true;
    }
});