/*
* @Author: Administrator
* @Date:   2019-06-06 14:15:19
* @Last Modified by:   zzj
* @Last Modified time: 2019-10-10 15:43:57
*/

var winColor = cc.color('#FF0000');
var failColor = cc.color('#1E90FF');

//获取结算界面主要显示的玩家
function getMainPlayer_96poker() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    //1.有抓猪，此处为抓猪玩家 2.没有抓猪取winner 3.流局取庄家
    var uid = tData.uids[tData.zhuang];
    if(tData.zhuaZhuPl >= 0) {
        uid = tData.uids[tData.zhuaZhuPl];
    }else if(tData.winner >= 0) {
        uid = tData.uids[tData.winner];
    }

    return sData.players[uid];
}

//头像
function setHeadTexture_96poker(node, pl) {
    var head = node.getChildByName("head");
    var url = pl.info.headimgurl;
    if(!url) {
        return;
    }
    cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
    {
        if(!err && texture && cc.sys.isObjectValid(head)) {
            var sp = new cc.Sprite(texture);
            head.addChild(sp);
            if(sp.width > head.width) {
                sp.setScale(head.width/sp.width * 0.95);
            }else {
                sp.setScale(sp.width/head.width * 0.95);
            }
            sp.x = head.getChildByName("img_head").width/2;
            sp.y = head.getChildByName("img_head").height/2;
            //setWgtLayout(sp, [0.8, 0.8], [0.2, 0.5], [0, 0], false, true);
        }
    });
}

//添加头像 param3.是否面板主要显示的玩家
function addPlayerHead_96poker(node, pl, isMain, idx) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pnlHead = node.getChildByName("pnl_head");
    if(!isMain) {
        pnlHead = pnlHead.clone();
    }

    //头像
    setHeadTexture_96poker(pnlHead, pl);
    //昵称
    var name = pnlHead.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);
    name.setString(sliceStrByLen_YueYangWaiHuZi(unescape(pl.info.nickname), 6));
    //总分
    var totalScore = pnlHead.getChildByName("totalScore");
    //totalScore.setString(pl.winall >= 0 ? ("+" + pl.winall) : pl.winall);
    totalScore.setString(pl.winall);
    totalScore.ignoreContentAdaptWithSize(true);
    //totalScore.setColor(pl.winall >= 0 ? winColor : failColor);
    //飘分
    var piao = pnlHead.getChildByName("piao");
    if(tData.areaSelectMode.piaoFen == 0) {
        piao.visible = false;
    }else {
        piao.loadTexture("playing/96poker/img/v_piao" + pl.piaoFen + ".png");
    }

    //抓猪、当局分
    var pnlBaoPei = pnlHead.getChildByName("pnl_baoPei");
    var pnlCurRet = pnlHead.getChildByName("pnl_curRet");
    if(pl.isZhuaZhu) {
        pnlCurRet.visible = false;
        pnlBaoPei.visible = true;
        var score = pnlBaoPei.getChildByName("txt_ret");
        score.ignoreContentAdaptWithSize(true);
        score.setString(pl.winone >= 0 ? ("+" + pl.winone) : pl.winone);
    }else {
        pnlBaoPei.visible = false;
        pnlCurRet.visible = true;
        if(!isMain) {
            pnlCurRet.x = pnlHead.width * 0.9;
            pnlCurRet.y = pnlHead.height / 2;
            pnlCurRet.scale = 0.5;
        }
        var flag = pnlCurRet.getChildByName("img_ret");
        flag.loadTexture("playing/96poker/img/" + (pl.winone >= 0 ? "ying" : "shu") + ".png");
        var scoreWin = pnlCurRet.getChildByName("txt_ret");
        var scoreFail = pnlCurRet.getChildByName("txt_ret_fail");
        scoreWin.visible = pl.winone >= 0;
        scoreFail.visible = pl.winone < 0;
        var score = pl.winone >= 0 ? scoreWin : scoreFail;
        score.ignoreContentAdaptWithSize(true);
        score.setString(pl.winone >= 0 ? ("+" + pl.winone) : pl.winone);
        //score.setColor(pl.winone >= 0 ? winColor : failColor); 
        if(!isMain) {
            node.addChild(pnlHead);
            pnlHead.x += (pnlCurRet.x + pnlCurRet.width) * 0.85 * idx - 10;
            pnlHead.y = 105;
        }
    }
}

//头像数据处理
function excPlayerHead_96poker(node) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var mainPl = getMainPlayer_96poker();
    addPlayerHead_96poker(node, mainPl, true);

    //设置闲家头像数据+
    var isIgnoreMain = false;
    for(var i = 0 ; i < tData.uids.length; i++) {
        if(tData.uids[i] == mainPl.info.uid) {
            isIgnoreMain = true;
            continue;
        }
        var pl = sData.players[tData.uids[i]];
        addPlayerHead_96poker(node, pl, false, isIgnoreMain ? (i-1) : i);
    }
}

//获取桌面手牌节点对应的玩家
function getPlayerByHand(node) {
    var name = node.getName();
    var num = MjClient.playui.getPlayersNum();
    var off = -1;
    switch (name) {
        case 'pnl_hand_1':
            if (num != 2) {
                off = MjClient.playui.getUIOffByNodeName('node_left');
            }
            break;
        case 'pnl_hand_2':
            if (num == 2) {
                off = MjClient.playui.getUIOffByNodeName('node_left');
            } else if(num == 4) {
                off = MjClient.playui.getUIOffByNodeName('node_right');
            }
            break;
        case 'pnl_hand_3':
            if (num == 3) {
                off = MjClient.playui.getUIOffByNodeName('node_right');
            } else if(num == 4) {
                off = MjClient.playui.getUIOffByNodeName('node_xing');
            }
            break;
    }

    return MjClient.playui.getUIPlayer(off);
};

//设置结算主图标
function setTitleImg(node) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if(MjClient.isDismiss) {
        node.loadTexture("gameOver/newOver/title_2.png");
    }else if(tData.winner == -1) {
        if(tData.zhuaZhuPl == -1) {
            node.loadTexture("gameOver/newOver/title_1.png");
        }else {
            node.loadTexture("playing/96poker/img/zhuazhu.png");
        }
    }else {
        if(tData.uids[tData.winner] == SelfUid()) {
            node.loadTexture("gameOver/newOver/title_3.png");
        }else {
            node.loadTexture("gameOver/newOver/title_4.png");
        }
    }
}

//设置桌面手牌
function addPlayerHandCards_96poker(node) {
    var name = node.getName();
    var tempCd = node.getChildByName("img_card");
    tempCd.visible = false;
    var pl = getPlayerByHand(node);
    if(!pl || !pl.mjhand || pl.mjhand.length == 0) {
        return;
    }

    if(MjClient.rePlayVideo != -1) {
        return;
    }

    var cardArr = MjClient.majiang.sortCardEx(pl.mjhand);
    for(var i = 0; i < cardArr.length; i++) {
        for(var j = 0; j < cardArr[i].length; j++) {
            var card = tempCd.clone();
            card.visible = true;
            node.addChild(card);
            card.loadTexture("playing/96poker/cards/pk_" + cardArr[i][j] + ".png");
            
            if(name == 'pnl_hand_1') {
                card.x += 23 * i;   //美术给定的23   
            }else {
                //从右往左添加, 且右边层次更高
                card.x -= 23 * i;
                card.zIndex = 100 - i;
            }
            card.y -= 28 * j;   //美术给定的23
        }
    }
}

//设置门牌名称
function setEatCardsName_96poker(node, name, gangInfo) {
    var eatName = {mjtie:'贴', mjchi:'吃', mjpeng:'碰', mjwei:'勺', 
    zou:'走', long:'龙', zhao:'招', shuangLong:'双龙'};

    if(gangInfo) {
        //分析杠牌
        if(name == 'mjgang0') {
            var gang = gangInfo.gang;
            var ex = gangInfo.ex;
            if(!ex || ex.length == 0) {
                name = gangInfo.isGangHand ? 'long' : 'zou';
            }else {
                name = 'zhao';   //不区分 半招 满招
            }
        }else if(name == 'mjgang1') {
            name = 'shuangLong'; //不区分 双龙 双龙抱柱
        }
    }

    node.setString(eatName[name]);
}

//设置吃牌数据
function setMainEatCards_96poker(node) {
    var tData = MjClient.data.sData.tData;
    node.visible = false;
    //流局不显示
    if(tData.winner == -1 && tData.zhuaZhuPl == -1) {
        return;
    }
    
    var pl = getMainPlayer_96poker();
    var sort = pl.mjsort.slice();
    var isHuIconAdded = false;
    var itemX = node.x;
    var gap = 10;  //横向间隔

    //添加一组门牌数据  
    var addOneItem = function(name, cards, idx, huxi, gangInfo, groupIdx, isHand) {
        var item = node.clone();
        item.visible = true;
        //item.x += (item.width + 10) * idx;
        item.x = itemX;
        node.getParent().addChild(item);
        var tempCd = item.getChildByName("img_card");
        tempCd.visible = false;

        //组名
        var itemName = item.getChildByName("name");
        itemName.ignoreContentAdaptWithSize(true);
        //itemName.setString(eatName[name]);  //todo
        setEatCardsName_96poker(itemName, name, gangInfo);
        //itemName.x += (tempCd.width * tempCd.scaleX + 20) * idx;
        //牌
        var num = item.getChildByName("num");
        var lastY = num.y;

        for(var i = 0; i < cards.length; i++) {
            for(var j = 0; j < cards[i].length; j++) {
                var card = tempCd.clone();
                card.visible = true;
                card.loadTexture("playing/96poker/cards/pk_" + cards[i][j] + ".png");
                item.addChild(card);
                card.x += i * 23; 
                card.y = tempCd.y - 28 * j; //美术给定的28
                if(j == cards[i].length - 1) {
                    lastY = Math.min(lastY, card.y);
                }

                //胡牌角标 天胡不显示角标
                if(tData.winner >= 0 && pl.huCard && pl.huCardPos != -1) {
                    if (isHuIconAdded) {
                        continue;
                    }
                    //var huRow = pl.huCardPos % 100;
                    if((pl.huCardPos >= 100 && !isHand) || (pl.huCardPos < 100 && isHand)) {
                        var flag = pl.huCard == cards[i][j];
                        if(pl.huCardPos == 200 && flag) {
                            flag = j == (cards[i].length - 1); //优化显示，单牌胡贴列最后一张
                        } 
                        if(flag) {
                            var huIcon = ccui.ImageView.create('playing/96poker/img/huIcon.png');
                            huIcon.setScale(2.4);
                            huIcon.x = card.width/2;
                            huIcon.y = card.height/2;
                            card.addChild(huIcon);
                            isHuIconAdded = true;
                        }  
                    }
                }
            }
        }

        item.width = node.width + (cards.length-1) * 23;
        itemX += item.width + gap;
        itemName.x = item.width/2;
        //num.y = lastY - tempCd.height * tempCd.scaleY - 10; //固定在同一直线上
        num.ignoreContentAdaptWithSize(true);
        num.visible = true;
        num.setString(huxi);  //胡息设置 
        num.x = item.width/2;
    }

    var i = 0;
    for(i = 0; i < sort.length; i++) {
        var name = sort[i].name;
        var pos = sort[i].pos;
        var cards = pl[name][pos];
        // if(!cards) {
        //     continue;
        // }
        var cardArr = [];
        var gangInfo = null;
        if(name == 'mjchi') {
            if(pl.single && pl.matchPos.group == 'mjchi' && pl.matchPos.pos == pos) {
                cardArr.push(cards.eatCards.concat(pl.single));
            } else {
                cardArr.push(cards.eatCards); 
            }
        }else if(name == 'mjgang0') {
            gangInfo = cards;
            if (pl.single && pl.matchPos.group == 'mjgang0' && pl.matchPos.pos == pos) {
                cardArr.push((cards.gang).concat(cards.ex).concat(pl.single));
            } else {
                cardArr.push((cards.gang).concat(cards.ex));
            }
        }else if(name == 'mjgang1' && cards.length == 2) {
            gangInfo = cards;
            var long1 = gangInfo[0];
            var long2 = gangInfo[1];
            if (pl.single && pl.matchPos.group == 'mjgang1' && pl.matchPos.pos == pos) {
                if (long1.ex.length == 1) {
                    cardArr.push((long1.gang).concat(long1.ex).concat(pl.single));
                    cardArr.push((long2.gang).concat(long2.ex));
                } else {
                    cardArr.push((long1.gang).concat(long1.ex));
                    cardArr.push((long2.gang).concat(long2.ex).concat(pl.single));
                }
            } else {
                cardArr.push((long1.gang).concat(long1.ex));
                cardArr.push((long2.gang).concat(long2.ex));
            }
        }else {
            cardArr.push(cards);
        }

        //获取门牌胡息
        var huxi = 0;
        if(pl.single && pl.matchPos.group == 'mjchi' && name == 'mjchi' && pl.matchPos.pos == pos) {
            name = 'mjtie';     //策划要求显示4张并显示名称为贴
            huxi = 4 * (MjClient.majiang.isRed(pl.single) ? 1 : 0);
        } else {
            huxi = MjClient.majiang.getMenHuXi(name, cardArr[0], gangInfo);
            //满招/双龙拆2贴
            if(pl.single && pl.matchPos.pos == pos) {
                if((pl.matchPos.group == 'mjgang0' && name == 'mjgang0') ||
                   (pl.matchPos.group == 'mjgang1' && name == 'mjgang1')) {
                    huxi += MjClient.majiang.isRed(pl.single) ? 1 : 0;
                }
            }
        }
        addOneItem(name, cardArr, i, huxi, gangInfo, i, false);
    }

    //手牌也列进去
    for(var j = 0; j < pl.handSort.length; j++) {
        var data = pl.handSort[j];
        var cards = [];
        cards.push(data.cards);
        addOneItem(data.name, cards, i+j, data.huxi, null, j, true);
    }
}

//设置结算界面手牌数据
function setMainHandCards_96poker(node) {
    var pl = getMainPlayer_96poker();
    if(!pl.isZhuaZhu || !pl.mjhand || pl.mjhand.length == 0) {
        node.visible = false;
        return;
    }
    var cardArr = MjClient.majiang.sortCard(pl.mjhand);
    var tempCd = node.getChildByName("img_card");
    tempCd.visible = false;

    var addOneItem = function(cards, pX) {
        for(var i = 0; i < cards.length; i++) {
            var card = tempCd.clone();
            node.addChild(card);
            card.visible = true;
            card.loadTexture("playing/96poker/cards/pk_" + cards[i] + ".png");
            card.x = pX;
            card.y -= 28 * i; //美术给定的28;
        }
    }

    var x = tempCd.x;
    for(var i = 0; i < cardArr.length; i++) {
        addOneItem(cardArr[i], x);
        x += 23;    //美术给定的23
    }
}

//设置胡牌名堂信息
function setMingTangInfo_96poker(node) {
    var tempTxt = node.getChildByName("txt_info");
    tempTxt.visible = false;
    var pl = getMainPlayer_96poker();
    if(pl.isZhuaZhu) {
        node.visible = false;
        return;
    } 

    var info = pl.hzdesc;
    var curX = tempTxt.x;
    var curY = tempTxt.y;
    var gapX = 60;
    var gapY = 46;
    for(var k in info) {
        if(k == 'piaoFen') {
            continue;
        }
        var txt = tempTxt.clone();
        txt.visible = true;
        node.addChild(txt);
        txt.ignoreContentAdaptWithSize(true);
        txt.setString(info[k].name + info[k].desc);
        txt.x = curX;
        txt.y = curY;

        if((node.width - curX - txt.width) < (tempTxt.width + gapX)) {
            curY -= gapY;
            curX = tempTxt.x;
        }else {
            curX += txt.width + gapX;
        }
    }
}

//设置底牌
function setDiPaiCards_96poker(node) {  
    var sData = MjClient.data.sData;
    var tData = sData.tData;  
    var card = node.getChildByName("card");
    card.scaleX = 0.32;
    card.scaleY = 0.32;
    card.visible = false;
    //一行最大数量 
    var lineMax = Math.floor((node.width - (card.x - card.width * card.scaleX / 2)) / (card.width * card.scaleX));
    //cc.log("最大数量", lineMax);
    var remainNum = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
    for(var i = tData.cardNext; i < MjClient.majiang.getAllCardsTotal(); i++) {
        var item = card.clone();
        item.visible = true;
        node.addChild(item);
        item.loadTexture("playing/96poker/cards/pk_" + sData.cards[i] + ".png");

        item.x += (i - tData.cardNext) % lineMax * item.width * item.scaleX;
        if(remainNum <= lineMax) {
            item.y = node.height/2;
        }else {
            item.y -= Math.floor((i - tData.cardNext) / lineMax) * 38;
        }
    }
}

var EndOneView_96poker = cc.Layer.extend({
    
    jsBind: {
        block: {
            _visible: true,
            _layout: [[1, 0], [0.5, 0.5], [0, 0]],
            _run:function () {
                MjClient.endoneui.block = this;
            }
        },
        pnl_table: {
            _visible: true,
            _layout: [[1, 1], [0, 0], [0, 0], true],
            pnl_hand_1: {
                _run: function() {
                    var maxPlayer = MjClient.data.sData.tData.maxPlayer;
                    if(maxPlayer == 2) {
                        this.visible = false;
                        return;
                    }
                    if(isIPhoneX()) {
                        this.y -= 80;
                        this.scale *= 0.8;
                    }
                    this.visible = true;
                    addPlayerHandCards_96poker(this);
                }
            },
            pnl_hand_2: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 3) {
                        this.visible = false;
                        return;
                    }
                    if(isIPhoneX()) {
                        this.y -= 105;
                        this.x += 40;
                        this.scale *= 0.8;
                    }
                    this.visible = true;
                    addPlayerHandCards_96poker(this);
                }
            },
            pnl_hand_3: {
                _run: function() {
                    if(MjClient.data.sData.tData.maxPlayer == 2) {
                        this.visible = false;
                        return;
                    }
                    if(isIPhoneX()) {
                        this.y -= 85;
                        this.x += 40;
                        this.scale *= 0.8;
                    }
                    this.visible = true;
                    addPlayerHandCards_96poker(this);
                }
            }
        },
        pnl_over: {
            _visible: true,
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
            _run: function() {
                excPlayerHead_96poker(this);
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
            },
            roundInfo: {
                _visible: true,
                _run: function() {
                    this.setString(MjClient.playui.getGameCnDesc());
                    if(isIPhoneX()) {
                        this.x += 100;
                    }
                }
            },
            pnl_eat: {
                _visible: true,
                _run: function() {
                    setMainEatCards_96poker(this);
                }
            },
            pnl_handCard: {
                _visible: true,
                _run: function() {
                    setMainHandCards_96poker(this);
                }
            },
            pnl_scoreInfo: {
                _visible: true,
                _run: function() {
                    setMingTangInfo_96poker(this);
                }
            },
            pnl_diPai: {
                _visible: true,
                _run: function() {
                    setDiPaiCards_96poker(this);
                }
            },
            title_img: {
                _visible: true,
                _run: function() {
                    setTitleImg(this);
                }
            }
        },
        btn_ready: {
            _visible: true,
            _layout: [[0.18, 0.18], [0.65, 0.0531], [0, 0]],
            _click: function(ref) {
                playMusic("bgHongZi");
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
        btn_showTable: {
            _layout: [[0.18, 0.18], [0.35, 0.0531], [0, 0]],
            _visible: true,
            _click: function(ref) {
                ref.visible = false;
                var parent = ref.getParent();
                parent.getChildByName("btn_showEnd").visible = true;
                MjClient.endoneui.block.visible = false;
                parent.getChildByName("pnl_over").visible = false;
            }
        },
        btn_showEnd: {
            _visible: false,
            _layout: [[0.18, 0.18], [0.35, 0.0531], [0, 0]],
            _click: function(ref) {
                ref.visible = false;
                var parent = ref.getParent();
                parent.getChildByName("btn_showTable").visible = true;
                MjClient.endoneui.block.visible = true;
                parent.getChildByName("pnl_over").visible = true;
            }
        },
        btn_share: {
            _visible:false,
        }
    },
    
    ctor: function () {
        this._super();
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_96poker.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        return true;
    }
});