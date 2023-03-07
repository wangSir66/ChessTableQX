
var EndOneView_FuLuShou = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 0], [0.5, 0.5], [0, 0]],
        },
        back: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0]],
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
            winner: {
                _run: function() {
                    var huIcon = this.getChildByName("huIcon");
                    huIcon.visible = true;

                    var bg = this.getChildByName("bg");
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = sData.players[tData.uids[tData.winner]];
                    if(!pl){
                        //如果没有赢家 显示自己的
                        pl = sData.players[SelfUid()];

                        huIcon.visible = false;
                    }
                    
                    var isSelf = pl.info.uid == SelfUid();
                    if(isSelf){
                        bg.loadTexture("hongZi/gameResult/zijiying.png");
                    }else{
                        bg.loadTexture("hongZi/gameResult/hujia.png");
                    }
                },
                headIcon : {
                    _run : function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = sData.players[tData.uids[tData.winner]];
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                        }
                        // 岳阳新版裁剪头像
                        CircularCuttingHeadImg(this, pl);
                    }
                },
                nameText : {
                    _run : function(){
                        this.ignoreContentAdaptWithSize(true);
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = sData.players[tData.uids[tData.winner]];
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                        }
                        this.setString(unescape(pl.info.nickname));
                    }
                },
                piaoText: {
                    _run:function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = sData.players[tData.uids[tData.winner]];
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                        }
                        this.setString(pl.piaoFen > 0 ? ("飘"+pl.piaoFen+"分") : "不飘");
                    }
                },
                hutip: {
                    _run : function(){
                        //this.ignoreContentAdaptWithSize(true);
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData.winner == -1) {
                            this.setString("");
                            return;
                        }
                        /*
                        var nameObj = {"门清自摸", "门清捉炮", "碰碰胡自摸", "碰碰胡捉炮", 
                        "杠上开花", "杠上炮", "海底捞", "滚滚", "满天飞"};
                        */ 
                                        
                        var str = "";
                        var pl = sData.players[tData.uids[tData.winner]];
                        for (var k in pl.mjdesc) {
                            //str += (" (" + pl.mjdesc[k] + ")\n");
                            str += (k == pl.mjdesc.length-1) ? pl.mjdesc[k] : pl.mjdesc[k] + ", "; 
                        }

                        this.setString(str);
                    },
                },
                fenshuTxt: {
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;

                        var pl = sData.players[tData.uids[tData.winner]];
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                        }
                        var num = pl.winone;
                        if(num > 0){
                            num = "+" + num;
                        }
                        return num;
                    }
                },
                cardsNode: {
                    acIcon: {
                        _visible: false
                    },
                    card0: {
                        _visible: false
                    },
                    card1: {
                        _visible: false
                    },
                    card2: {
                        _visible: false
                    },
                    card3: {
                        _visible: false
                    },
                    _run: function() {
                        var that = this;
                        var sData = MjClient.data.sData;
                        //cc.log("结算中的牌组Data:", JSON.stringify(sData));
                        var tData = sData.tData;
                        var pl = sData.players[tData.uids[tData.winner]];
                        var temp_winner = true;
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                            temp_winner = false;
                        }

                        var idx = 0;
                        var showMenPai = function(list, opName) {
                            for (var i = 0; i < list.length; i++) {
                                if(list.length == 0) {
                                    continue;
                                }
                                var acIcon = that.getChildByName("acIcon").clone();
                                that.addChild(acIcon);
                                acIcon.x += idx * 42 * 1;
                                cc.log("acIcon.x:", acIcon.x);
                                acIcon.visible = true;
                                var titlePath = "playing/fulushou/gameResult/";
                                var loopCnt = 0;
                                if(opName == "chi" || opName == "peng") {
                                    loopCnt = 3;
                                } else {
                                    loopCnt = 4;
                                }
                                acIcon.loadTexture(titlePath + opName + ".png");
                                for (var j = 0; j < loopCnt; j++) {
                                    var card;
                                    if (opName == "chi") {
                                        card = list[i][j];
                                    } else {
                                        card = opName == "peng" ? list[i] : list[i];
                                    }
                                    if (!card) {
                                        continue;
                                    }
                                    var name = ["card0", "card1", "card2", "card3"][j];
                                    var node = that.getChildByName(name).clone();
                                    node.visible = true;
                                    node.x += idx * 42 * 1;
                                    node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + card + ".png");
                                    that.addChild(node);
                                }
                                idx++;
                            }
                        }
                        
                        showMenPai(pl.mjchi, "chi");
                        showMenPai(pl.mjpeng, "peng");
                        showMenPai(pl.mjzhao0, "zhao");
                        showMenPai(pl.mjzhao1, "zhao");
                        showMenPai(pl.mjgang0, "gang");
                        showMenPai(pl.mjgang1, "gang");

                        //手牌
                        var addHandCard = function(list) {
                            for (var i=0; i<list.length; i++) {
                                var row = list[i];
                                if(row.length == 0) {
                                    continue;
                                }
                                for (var j = 0; j < row.length; j++) {
                                    if(j >= 4)
                                        break;   //正常不会出现，容错
                                    var card = row[j];
                                    var name = ["card0", "card1", "card2", "card3"][j];
                                    var node = that.getChildByName(name).clone();
                                    node.visible = true;
                                    node.x += idx * 42 * 1;
                                    node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + card + ".png");
                                    that.addChild(node);   

                                    /*
                                    if(!MjClient.endoneui._isShowHu && card == tData.lastPutCard && tData.winner != -1 && temp_winner){
                                        var nodeSize = node.getContentSize();
                                        var icon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                                        icon.setAnchorPoint(cc.p(1,0));
                                        icon.setPosition(cc.p(nodeSize.width,0));
                                        node.addChild(icon);
                                        MjClient.endoneui._isShowHu = true;
                                    }   
                                    */
                                }
                                idx++;
                            }
                        }

                        /*//赢家按照服务器给的序列显示
                        var handSort = MjClient.majiang.sortOverHand(pl.mjhand);
                        //话
                        var huaList = handSort.hua;
                        //坎
                        var kanList = handSort.kan;
                        //杠
                        var gangList = handSort.gang;
                        //烂牌
                        var lanList = handSort.lan;
                        addHandCard(huaList);
                        addHandCard(kanList);
                        addHandCard(gangList);
                        addHandCard(lanList);
                        */

                        var laniuHand = function(){
                            if(pl.mjhand.length == 2){
                                pl.mjhand.push(tData.lastPutCard);
                                // 
                            }

                            for (var j = 0; j < pl.mjhand.length; j++) {  
                                var card = pl.mjhand[j];
                                var name = ["card0", "card1", "card2", "card3"][j];
                                var node = that.getChildByName(name).clone();
                                node.visible = true; 
                                node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + card + ".png");
                                that.addChild(node);   

                                /*
                                if(!MjClient.endoneui._isShowHu && card == tData.lastPutCard && tData.winner != -1 && temp_winner){
                                    var nodeSize = node.getContentSize();
                                    var icon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                                    icon.setAnchorPoint(cc.p(1,0));
                                    icon.setPosition(cc.p(nodeSize.width,0));
                                    node.addChild(icon);
                                    MjClient.endoneui._isShowHu = true;
                                }
                                */   
                            }
                        }

                        //有赢家，按照服务器给的赢家手牌展示
                        if(temp_winner) {

                            var laniuPos = (tData.zhuang + 2) % tData.maxPlayer; // 拉牛的位置 
                            //是否拉牛
                            if(tData.maxPlayer == 4 && tData.winner == laniuPos) {
                                // cc.log("拉牛 ====================================",pl.mjhand);
                                // addHandCard(pl.mjhand);     
                                laniuHand(); 
                            }
                            else if(pl.huSort && pl.huSort.length > 0) {
                                for (var i=0; i < pl.huSort.length; i++) {
                                    addHandCard(pl.huSort[i]);
                                }
                            }
                        }
                        else {
                            //没有赢家，展示自己的
                            var handSort = MjClient.majiang.sortOverHand(pl.mjhand);
                            //话
                            var huaList = handSort.hua;
                            //坎
                            var kanList = handSort.kan;
                            //杠
                            var gangList = handSort.gang;
                            //烂牌
                            var lanList = handSort.lan;
                            addHandCard(huaList);
                            addHandCard(kanList);
                            addHandCard(gangList);
                            addHandCard(lanList);
                        }

                        //胡牌单独列一组
                        if(!MjClient.endoneui._isShowHu && tData.lastPutCard && tData.winner != -1 && temp_winner) {
                            var tIcon = that.getChildByName("acIcon").clone();
                            that.addChild(tIcon);
                            tIcon.x += idx * 42 * 1 + 42*1;
                            tIcon.visible = true;
                            var titlePath = "playing/fulushou/gameResult/";
                            tIcon.loadTexture(titlePath + "hu.png");
                            var node = that.getChildByName("card0").clone();
                            node.visible = true;
                            node.x += idx * 42 * 1 + 42*1;
                            node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + tData.lastPutCard + ".png");
                            that.addChild(node);
                            MjClient.endoneui._isShowHu = true;
                            idx++;
                        }

                        //超过9列动态调整X坐标，使其居中(每多一列，往左移一半牌宽)
                        if(idx > 8) {
                            that.x -= (idx - 8) * 42 * 0.5;
                        }
                    }
                }
            },
            diPai: {
                _run: function(){
                    // var imgCard = this.getChildByName("cardNode");
                    // imgCard.visible = false;

                    

                    var tData = MjClient.data.sData.tData;
                    var cards = MjClient.data.sData.cards;                  
                    var listNode = this.getChildByName("cardList");
                    listNode.removeAllChildren();
                    var imgCard = this.getChildByName("card"); 
                    imgCard.setVisible(false);
                    if(tData.cardNext < cards.length){
                        var len = cards.length;
                         
                        var cardItem = this.getChildByName("item");
                        var cloneItem = cardItem.clone();
                        cloneItem.setPositionY( imgCard.getPositionY() - 40);
                        this.addChild(cloneItem );
                        var index = 0;
                        var cardSize = imgCard.getContentSize().width * imgCard.getScale() * 1.1;
                        var itemHeight = cardItem.getContentSize();
                        var isClone = false;
                        for (var i = tData.cardNext; i < len; i++) { 
                            var cloneImgCard = imgCard.clone();
                            var posX = (cardSize / 2) + index * cardSize;
                            if(posX > itemHeight.width){
                                cardItem = cloneItem;
                                index = 0;
                                posX = (cardSize / 2) + index * cardSize;
                            }

                            cloneImgCard.loadTexture(MjClient.cardPath_fuLuShou + "out_" + cards[i] +".png");
                            cloneImgCard.setPosition(cc.p(posX,itemHeight.height / 2 ));
                            cloneImgCard.setVisible(true);
                            cardItem.addChild(cloneImgCard);  
 
                            index++;   
                        } 
                     
                    }
                }
            },
            wanfa: {
                _run: function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            desText: {
                _run: function(){
                    this.ignoreContentAdaptWithSize(true);
                }
            },
            share: {
                _click:function(btn,eT){
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});
                    
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                    }
                }
                ,_visible: function () {
                    return !MjClient.remoteCfg.guestLogin;
                }
            },
            ready: {
                _run: function () {
                    if (MjClient.remoteCfg.guestLogin) {
                        setWgtLayout(this, [0.15, 0.15], [0.5, 0.085], [0, 0], false, true);
                    }
                },
                _click: function (btn, eT) {
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
                    // if (MjClient.arrowbkNode) {
                    //     MjClient.arrowbkNode.setVisible(false);
                    // }
                    //reInitarrCardVisible();
                }
            }
        }
    },
    _isShowHu:false,
    ctor: function () {
        this._super();

        //test
        // MjClient.data.sData = {"players":{"1000045":{"info":{"uid":1000045,"appid":"yueyang","unionid":"unionid-1000045","sex":2,"nickname":"%u6E38%u5BA2045","headimgurl":"http://cdn.jtcfgame.com/images/2.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"65.74.185.79","lastLoginTime":1524708912103,"lastShareDay":20180419,"createRoomNum":10,"createTime":1522130860424,"money":77,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":3,"fid":"pkcon000","remoteIP":"172.17.100.241","lockMoney":0,"did":"pkplayer001"},"eatFlag":0,"mjState":4,"mjwei":[],"mjpeng":[7],"mjgang0":[],"mjgang1":[],"mjchi":[],"mjchiCard":[],"mjput":[4],"onLine":true,"skipPeng":[],"delRoom":0,"isNew":true,"winall":10,"canNotPutCard":[7],"mjsort":[{"name":"mjpeng","pos":0}],"tableMsg":[-4,14],"locationMsg":"0;0;2;1000045;[\"\",\"\",\"\",\"\",\"\",\"\"]","wxHeadImg":{},"isQiHu":false,"putType":1,"putCount":null,"mjhand":[27,4,3,27,1,2,29,5,91,6],"mjdesc":[],"winone":14,"winType":0,"baseWin":0,"handSort":[{"card":[29,29],"name":"dui"},{"card":[27,27,91],"name":"chi"},{"card":[1,2,3],"name":"chi"},{"card":[4,5,6],"name":"chi"}],"be":[27],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjflower":[],"longCard":[],"skipHu":false,"isZiMoHu":false,"linkZhuang":0},"1000046":{"info":{"uid":1000046,"appid":"yueyang","unionid":"unionid-1000046","sex":2,"nickname":"%u6E38%u5BA2046","headimgurl":"http://cdn.jtcfgame.com/images/1.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"229.123.107.106","lastLoginTime":1524708913183,"lastShareDay":20180424,"createRoomNum":10,"createTime":1522130860424,"money":103,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":3,"fid":"pkcon001","remoteIP":"172.17.100.241","lockMoney":0,"did":"pkplayer000"},"eatFlag":0,"mjState":4,"mjwei":[],"mjpeng":[28],"mjgang0":[],"mjgang1":[],"mjchi":[],"mjchiCard":[],"mjput":[6,2,29],"onLine":true,"skipPeng":[],"delRoom":0,"isNew":true,"winall":-11,"canNotPutCard":[28],"mjsort":[{"name":"mjpeng","pos":0}],"tableMsg":[-4,-7],"locationMsg":"0;0;1;1000046;[\"\",\"\",\"\",\"\",\"\",\"\"]","wxHeadImg":{},"isQiHu":false,"putType":1,"putCount":null,"mjhand":[23,24,30,21,21,22,27,27,30,26],"mjdesc":[],"winone":-7,"winType":0,"baseWin":0,"handSort":[],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjflower":[],"longCard":[],"skipHu":false,"isZiMoHu":false},"1000048":{"info":{"uid":1000048,"appid":"yueyang","unionid":"unionid-1000048","sex":2,"nickname":"%u6E38%u5BA2048","headimgurl":"http://cdn.jtcfgame.com/images/8.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"194.11.133.234","lastLoginTime":1524708916226,"lastShareDay":"20180426","createRoomNum":10,"createTime":1522130860424,"money":354,"integral":0,"limitMoney":0,"myMemberId":123457,"memberId":123457,"bindHistory":0,"sid":4,"fid":"pkcon001","remoteIP":"172.17.100.241","lockMoney":0,"did":"pkplayer000"},"eatFlag":2,"mjState":3,"mjwei":[],"mjpeng":[9],"mjgang0":[],"mjgang1":[],"mjchi":[],"mjchiCard":[],"mjput":[8,21,2],"onLine":true,"skipPeng":[],"delRoom":0,"isNew":false,"winall":1,"canNotPutCard":[9],"mjsort":[{"name":"mjpeng","pos":0}],"tableMsg":[8,-7],"locationMsg":"0;0;0;1000048;[\"\",\"\",\"\",\"\",\"\",\"\"]","mjhand":[29,29,4,5,91,22,25,21,26,30],"mjpeng4":[],"wxHeadImg":{},"putType":1,"skipHu":false,"isQiHu":false,"putCount":null,"mjdesc":[],"winone":-7,"winType":0,"baseWin":0,"handSort":[],"be":[10,21],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjflower":[],"longCard":[],"isZiMoHu":false,"linkZhuang":0}},"tData":{"initCoin":0,"gameType":2018092,"roundAll":8,"roundNum":6,"isValidTable":true,"fanNum":0,"maxPlayer":3,"uids":[1000048,1000046,1000045],"owner":1000048,"maxHunNum":4,"tableid":"628039","cardNext":46,"winner":2,"zhuang":0,"curPlayer":1,"lastPutPlayer":0,"putType":1,"lastDrawPlayer":1,"tState":6,"lastPutCard":29,"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":0,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"datuoNum":0,"mingCard":0,"areaSelectMode":{"maxPlayer":3,"payWay":0,"minRedNum":3,"kingNum":4,"isShuangHe":true},"minRedNum":3,"gameCnName":"ãèÂÞºì×Ö","hunCard":-1,"currCard":29,"drawType":0,"isLastDraw":false,"isFirstPut":false},"serverNow":-88655,"cards":[29,29,9,4,5,91,22,9,25,21,8,26,2,23,24,30,21,28,21,22,7,27,27,30,26,28,27,7,4,3,27,7,1,2,29,5,9,91,6,30,6,4,21,2,28,29,8,30,2,8,23,24,9,10,91,4,91,10,22,5,23,25,8,10,23,3,6,3,10,24,25,22,26,1,1,6,25,28,26,3,24,1,5,7]}
        MjClient.endoneui = this;
        var endoneui = ccs.load("endOne_fulushou.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        
        

        this._uiNode = endoneui.node.getChildByName("back");
        this.setMsg();
        this.showPlItems();

        var titleImg = this._uiNode.getChildByName("title");
        titleImg.setLocalZOrder(20);
        return true;
    },

    showPlItems : function(){
        var plItem = this._uiNode.getChildByName("plItem");
        plItem.visible = false;

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var players = sData.players;
        var plLen = players.length;
        var hasWinner = tData.winner >= 0;
        var index = 0;
        var jianxi = (Object.keys(players).length == 3 ? 10 : 7);
        for(var uid in players){
            if(!hasWinner && uid == SelfUid()){
                continue;
            }
            if(hasWinner && uid == tData.uids[tData.winner]){
                continue;
            }

            var pl = players[uid];
            var cloneItem = plItem.clone();
            cloneItem.visible = true;
            this._uiNode.addChild(cloneItem);
            var h = this.setItemInfoByPl(pl, cloneItem);
            cloneItem.y -= h * index + jianxi * index;
            index += 1;

            var detail = cloneItem.getChildByName("txt_detail");
            detail.setVisible(false);
            if(MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
                //福禄寿20张才会有其它玩家明细
                var str = "";
                for (var k in pl.mjdesc) {
                    str += (k == pl.mjdesc.length-1) ? pl.mjdesc[k] : pl.mjdesc[k] + ", "; 
                }
                detail.setString(str);
                detail.setVisible(true);
            }
        }

    },

    setItemInfoByPl : function(pl, cloneItem){
        var itemH = 0;

        var bg = cloneItem.getChildByName("bg"); 
        var bg1 = cloneItem.getChildByName("bg1");
        var fenshuTxt = cloneItem.getChildByName("fenshuTxt");
        var fenshu = cloneItem.getChildByName("fenshu");
        var nameText = cloneItem.getChildByName("nameText");
        var headIcon = cloneItem.getChildByName("headIcon");
        var cardsNode = cloneItem.getChildByName("cardsNode");
        var txtPiao = cloneItem.getChildByName("txt_piao");

        setRoundEndUserOffline_fuLuShou(headIcon,pl);

        cardsNode.getChildByName("acIcon").visible = false;
        cardsNode.getChildByName("card0").visible = false;
        cardsNode.getChildByName("card1").visible = false;
        cardsNode.getChildByName("card2").visible = false;
        cardsNode.getChildByName("card3").visible = false;

        bg.visible = false;
        bg1.visible = false;
        fenshu.visible = false;

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var maxPlayer = tData.maxPlayer;

        var isSelf = pl.info.uid == SelfUid();
        var tempBg = bg1;
        if(maxPlayer == 3){
            tempBg = bg1;
            bg1.visible = true;
            fenshu.visible = true;
            fenshuTxt.x = fenshu.x + fenshu.width * 0.5 + 5;
            fenshuTxt.y = fenshu.y;

            itemH = bg1.height;
        }else{
            tempBg = bg;
            bg.visible = true;
            itemH = bg.height;
            //飘分文本坐标
            txtPiao.y = txtPiao.y + 60;
        }

        if(isSelf){
            tempBg.loadTexture("hongZi/gameResult/ziji.png");
        }

        //分数
        fenshuTxt.ignoreContentAdaptWithSize(true);
        var num = pl.winone;
        if(num > 0){
            num = "+" + num;
        }
        fenshuTxt.setString(num);

        //玩家名称
        nameText.setString(unescape(pl.info.nickname));

        // 岳阳新版裁剪头像
        CircularCuttingHeadImg(headIcon, pl);

        // return itemH;

        //飘分
        txtPiao.setString(pl.piaoFen > 0 ? ("飘" + pl.piaoFen + "分") : "不飘");

        //牌
        var idx = 0;
        var showMenPai = function(list, opName) {
            for (var i = 0; i < list.length; i++) {
                if(list.length == 0) {
                    continue;
                }
                var acIcon = cardsNode.getChildByName("acIcon").clone();
                cardsNode.addChild(acIcon);
                acIcon.x += idx * 36 * 0.8;
                cc.log("acIcon.x:", acIcon.x);
                acIcon.visible = true;
                var titlePath = "playing/fulushou/gameResult/";
                var loopCnt = 0;
                if(opName == "chi" || opName == "peng") {
                    loopCnt = 3;
                } else {
                    loopCnt = 4;
                }
                acIcon.loadTexture(titlePath + opName + ".png");
                for (var j = 0; j < loopCnt; j++) {
                    var card;
                    if (opName == "chi") {
                        card = list[i][j];
                    } else {
                        card = opName == "peng" ? list[i] : list[i];
                    }
                    if (!card) {
                        continue;
                    }
                    var name = ["card0", "card1", "card2", "card3"][j];
                    var node = cardsNode.getChildByName(name).clone();
                    node.visible = true;
                    node.x += idx * 36 * 0.8;
                    node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + card + ".png");
                    cardsNode.addChild(node);
                }
                idx++;
            }
        }
        
        showMenPai(pl.mjchi, "chi");
        showMenPai(pl.mjpeng, "peng");
        showMenPai(pl.mjzhao0, "zhao");
        showMenPai(pl.mjzhao1, "zhao");
        showMenPai(pl.mjgang0, "gang");
        showMenPai(pl.mjgang1, "gang");

        //手牌
        var addHandCard = function(list) {
            for (var i=0; i<list.length; i++) {
                var row = list[i];
                if(row.length == 0) {
                    continue;
                }
                for (var j = 0; j < row.length; j++) {
                    var card = row[j];
                    var name = ["card0", "card1", "card2", "card3"][j];
                    var node = cardsNode.getChildByName(name).clone();
                    node.visible = true;
                    node.x += idx * 36 * 0.8;
                    node.loadTexture(MjClient.cardPath_fuLuShou + "out_" + card + ".png");
                    cardsNode.addChild(node);     
                }
                idx++;
            }
        }

        var handSort = MjClient.majiang.sortOverHand(pl.mjhand);
        //话
        var huaList = handSort.hua;
        //坎
        var kanList = handSort.kan;
        //杠
        var gangList = handSort.gang;
        //烂牌
        var lanList = handSort.lan;
        addHandCard(huaList);
        addHandCard(kanList);
        addHandCard(gangList);
        addHandCard(lanList);

        return  itemH;
    },

    setMsg : function(){
        var wanfa = this._uiNode.getChildByName("wanfa");

        wanfa.ignoreContentAdaptWithSize(false); 
        wanfa.setSize(cc.size(370, 100)); 

        wanfa.setString(this.getWanFa());

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var txt = GameCnName[tData.gameType];
        txt += " 房号:" + tData.tableid;

        if(tData.roundNum == -2){
            var nowRound = tData.roundNum_play || 1;
            txt += " 第" + (nowRound) + "局";
        }else{
            txt += " 第" + (tData.roundAll - tData.roundNum) + "局";
        }
        
        var desText = this._uiNode.getChildByName("desText");
        desText.setString(txt);

        var title = this._uiNode.getChildByName("title");
        if(tData.winner == -1){
            //平局
            title.loadTexture("gameOver/pingju_03.png");
            if(MjClient.isDismiss){
                title.loadTexture("gameOver/jiesan.png");
            }
        }else{
            if(tData.uids[tData.winner] == SelfUid()){
                title.loadTexture("gameOver/duihuan_10.png");
            }else{
                title.loadTexture("gameOver/duihuan_16.png");
            }
        }
    },

    getWanFa : function(){
        var txt = "";

        var tData = MjClient.data.sData.tData;
        var areaSelectMode = tData.areaSelectMode;
        txt = getPlaySelectPara(MjClient.gameType, areaSelectMode);
        return txt;
    }
});