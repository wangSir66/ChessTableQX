
var EndOneView_HongZi = cc.Layer.extend({
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
                    var dissTypeText = this.getChildByName("dissType");
                    dissTypeText.ignoreContentAdaptWithSize(true);
                    dissTypeText.setVisible(MjClient.isDismiss);
                    if(MjClient.isDismiss){
                        dissTypeText.setString(getDismissTypeName(pl));
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

                        /*
                        var self = this;
                        var url = pl.info.headimgurl;
                        if(!url) url="png/default_headpic.png";
                        cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
                        {
                            if(!err&&texture)
                            {
                                var headSprite = new cc.Sprite(texture);
                                var WxHead = self.getChildByName("WxHead");
                                if(WxHead)
                                {
                                    WxHead.removeFromParent();
                                }
                                headSprite.setName("WxHead");
                                self.addChild(headSprite);
                                setWgtLayout(headSprite, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
                            }
                        });
                        */
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
                hutip: {
                    _run : function(){
                        this.ignoreContentAdaptWithSize(true);
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData.winner == -1) {
                            this.setString("");
                            return;
                        }

                        var nameObj = {heiHu:"黑胡", dianHu: "点胡", shiHong: "十红", manTangHong: "满堂红", xiaoYiSe: "小一色", 
                                        daYiSe: "大一色", qiDui: "7对", pengPengHu: "碰碰胡", juJuHong: "句句红", yiGuaBian: "一挂匾",
                                        huDieFei: "蝴蝶飞", banBanHu: "板板胡",siPengDanDiao: "四碰单吊", shuangHe:"双合",shiErHong:"十二红",
                                        shiYiHong: "十一红", fengDing: "80分封顶",  huaHu:"花胡"}; 
                                        
                        var str = "";
                        var pl = sData.players[tData.uids[tData.winner]];
                        for (var k in pl.hzdesc) {
                            str += (nameObj[k] + " (" + pl.hzdesc[k] + ")\n");
                        }

                        // this.setTextColor(cc.color(255,237,99));
                        if(str.length <= 0){
                            // this.setTextColor(cc.color(255,255,255));
                            str = "小胡," + pl.winone / (tData.maxPlayer - 1) + "红";
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
                    card0_0: {
                        _visible: false
                    },
                    card0_1: {
                        _visible: false
                    },
                    _run: function() {
                        var sData = MjClient.data.sData;
                        cc.log("sData:", JSON.stringify(sData));
                        var tData = sData.tData;
                        var pl = sData.players[tData.uids[tData.winner]];
                        var temp_winner = true;
                        if(!pl){
                            //如果没有赢家 显示自己的
                            pl = sData.players[SelfUid()];
                            temp_winner = false;
                        }

                        var idx = 0;
                        for (var i = 0; i < pl.mjchi.length; i++) {
                            var acIcon = this.getChildByName("acIcon").clone();
                            this.addChild(acIcon);
                            acIcon.visible = true;
                            acIcon.x += idx * 42;
                            acIcon.loadTexture("hongZi/gameResult/chi.png");
                            for (var j = 0; j < 3; j++) {
                                var card = pl.mjchi[i].eatCards[j];
                                var name = ["card0", "card0_0", "card0_1"][j];
                                var node = this.getChildByName(name).clone();
                                node.visible = true;
                                node.x += idx * node.getContentSize().width;
                                cc.log("%%%%%%% chi card:", MjClient.cardPath_hongZi + "out" + card + ".png");
                                node.loadTexture( MjClient.cardPath_hongZi + "out" + card + ".png");
                                this.addChild(node);
                            }
                            idx++;
                        }

                        for (var i = 0; i < pl.mjpeng.length; i++) {
                            var acIcon = this.getChildByName("acIcon").clone();
                            this.addChild(acIcon);
                            acIcon.visible = true;
                            acIcon.x += idx * 42;
                            acIcon.loadTexture("hongZi/gameResult/peng.png");
                            for (var j = 0; j < 3; j++) {
                                var card = pl.mjpeng[i];
                                var name = ["card0", "card0_0", "card0_1"][j];
                                var node = this.getChildByName(name).clone();
                                node.visible = true;
                                node.x += idx * node.getContentSize().width;
                                cc.log("%%%%%%% mjpeng card:", MjClient.cardPath_hongZi + "out" + card + ".png");
                                node.loadTexture(MjClient.cardPath_hongZi + "out" + card + ".png");
                                this.addChild(node);
                            }
                            idx++;
                        }

                        var handSort = pl.handSort;
                        if(!handSort || handSort.length <= 0){
                            handSort = MjClient.majiang.sortCard(pl.mjhand);
                        }
 

                        for (var i = 0; i < handSort.length; i++) {
                            var row = handSort[i].card;
                            if(!row){
                                row = handSort[i];
                            }
                            for (var j = 0; j < row.length; j++) {

                                var card = row[j];
                                var name = ["card0", "card0_0", "card0_1"][j];
                                var node = this.getChildByName(name).clone();
                                node.visible = true;
                                node.x += idx * node.getContentSize().width;
                                cc.log("%%%%%%%card:", MjClient.cardPath_hongZi + "out" + card + ".png");
                                node.loadTexture(MjClient.cardPath_hongZi + "out" + card + ".png");
                                this.addChild(node);   

                                if(!MjClient.endoneui._isShowHu && card == tData.lastPutCard && tData.winner != -1 && temp_winner){
                                    var nodeSize = node.getContentSize();
                                    var icon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                                    icon.setAnchorPoint(cc.p(1,0));
                                    icon.setPosition(cc.p(nodeSize.width,0));
                                    node.addChild(icon);
                                    MjClient.endoneui._isShowHu = true;
                                }   
                            }
                            idx++;

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
                        var diPaiList = this.getChildByName("diPaiList");
                        var cardItem = this.getChildByName("item");
                        var cloneItem = cardItem.clone();
                        cloneItem.setPositionY( imgCard.getPositionY() - 50);
                        this.addChild(cloneItem );
                        
                        var cardSize = imgCard.getContentSize().width * imgCard.getScale() * 1.1;
                        var itemHeight = cardItem.getContentSize();
                        var isClone = false;

                        var index = 0;
                        var self = this;
                        function showDiPaiCard(idx,subNum,isMaiPai){
                            if(isMaiPai){
                                cardItem = cloneItem; 
                                index = 0;
                                posX = (cardSize / 2) + index * cardSize; 
                                self.getChildByName("icon_maipai").setVisible(true);
                            } 
                            else
                            {
                                diPaiList.setInnerContainerSize(cc.size((len-subNum-idx+1)*cardSize, diPaiList.getInnerContainerSize().height));
                                cardItem = diPaiList;
                            }
                            self.getChildByName("icon_dipai").setPositionY(imgCard.getPositionY() + 5);
                            for (var i = idx; i < len - subNum; i++) { 
                                var cloneImgCard = imgCard.clone();
                                var posX = (cardSize / 2) + index * cardSize;
                                cloneImgCard.loadTexture(MjClient.cardPath_xyHongZi + "out" + cards[i] +".png");
                                cloneImgCard.setPosition(cc.p(posX,itemHeight.height / 2 ));
                                cloneImgCard.setVisible(true);
                                cardItem.addChild(cloneImgCard);  
                                index++;   
                            } 
                        }

                        var isMaiPai = tData.areaSelectMode.isMaiPai && tData.maxPlayer == 2;
                        var maiPaiNum = 0;
                        if (isMaiPai) {
                            maiPaiNum = tData.areaSelectMode.maiPaiNum ? tData.areaSelectMode.maiPaiNum : 20;
                        }
                        showDiPaiCard(tData.cardNext,maiPaiNum, false); // 二人玩法减去20张用于埋牌
                        // 二人玩法埋牌20张
                        if(isMaiPai)
                            showDiPaiCard(len - maiPaiNum,0,true); 
                    }
                }
            },
            wanfa: {
                _run: function(){
                    this.ignoreContentAdaptWithSize(false);
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
                    if (MjClient.endallui)
                    {
                        MjClient.endallui.setVisible(true);
                    }
                    // if (MjClient.arrowbkNode) {
                    //     MjClient.arrowbkNode.setVisible(false);
                    // }
                    //reInitarrCardVisible();
                }
            },
            btn_xiPai: {
                _run: function(){
                    //setWgtLayout(this, [0.18, 0.18],[0.2562, 0.06],[0, 0]);

                    if(MjClient.rePlayVideo == -1 &&
                        !MjClient.data.sData.tData.areaSelectMode.isManualCutCard &&
                        !MjClient.endallui) {
                        this.visible = true;
                        var icon = this.getChildByName("icon");
                        var numTxt = this.getChildByName("numTxt");
                        if(MjClient.data.sData.tData.areaSelectMode.fangkaCount != undefined) {
                            //钻石场
                            icon.loadTexture("gameOver/newOver/ico_zuanshi.png");
                            numTxt.setString("x1");
                        }else {
                            //元宝场
                            icon.loadTexture("gameOver/newOver/ico_yuanbao.png");
                            numTxt.setString("x2");
                        }

                    }else {
                        var ready = MjClient.endoneui.jsBind.back.ready._node;
                        var share = MjClient.endoneui.jsBind.back.share._node;
                        ready.x -= (ready.x - share.x ) / 2;
                        share.x -= (share.x - this.x ) / 2;
                        this.visible = false;
                    }
                },
                _click: function(btn,eT){
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJShuffle"
                    },function(data) {
                        if (data != null && data.code == -1)
                        {
                            console.log("======MJShuffle=====", JSON.stringify(data));
                            MjClient.showToast(data.message);
                            return;
                        }

                        postEvent("clearCardUI");
                        postEvent("clearCardArr");
                        MjClient.endoneui.gameMain = null;
                        MjClient.endoneui.removeFromParent(true);
                        MjClient.endoneui = null;
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "MJPass"
                        });
                    });

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
        var endoneui = ccs.load("endOne_zhuaHongZi.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        
 

        this._uiNode = endoneui.node.getChildByName("back");
        this.setMsg();
        this.showPlItems();

        var titleImg = this._uiNode.getChildByName("title");
        titleImg.setZOrder(20);
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

        setRoundEndUserOffline_hongzi(headIcon,pl);

        var dissTypeText = cloneItem.getChildByName("dissType");
        dissTypeText.ignoreContentAdaptWithSize(true);
        dissTypeText.setVisible(MjClient.isDismiss);
        if(MjClient.isDismiss){
            dissTypeText.setString(getDismissTypeName(pl));
        }

        cardsNode.getChildByName("acIcon").visible = false;
        cardsNode.getChildByName("card0").visible = false;
        cardsNode.getChildByName("card1").visible = false;
        cardsNode.getChildByName("card2").visible = false;

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

        //玩家头像
        /*
        var url = pl.info.headimgurl;
        if(!url) url="png/default_headpic.png";
        cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
        {
            if(!err&&texture)
            {
                var headSprite = new cc.Sprite(texture);
                var WxHead = headIcon.getChildByName("WxHead");
                if(WxHead)
                {
                    WxHead.removeFromParent();
                }
                headSprite.setName("WxHead");
                headIcon.addChild(headSprite);
                setWgtLayout(headSprite, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
            }
        });
        */
        // 岳阳新版裁剪头像
        CircularCuttingHeadImg(headIcon, pl);

        // return itemH;

        //牌
        var idx = 0;
        for (var i = 0; i < pl.mjchi.length; i++) {
            var acIcon = cardsNode.getChildByName("acIcon").clone();
            cardsNode.addChild(acIcon);
            acIcon.x += idx * 42 * 0.8;
            cc.log("acIcon.x:", acIcon.x);
            acIcon.visible = true;
            acIcon.loadTexture("hongZi/gameResult/chi.png");
            for (var j = 0; j < 3; j++) {
                var card = pl.mjchi[i].eatCards[j];
                var name = ["card0", "card1", "card2"][j];
                var node = cardsNode.getChildByName(name).clone();
                node.visible = true;
                node.x += idx * node.getContentSize().width * 0.8;
                node.loadTexture( MjClient.cardPath_hongZi + "out" + card + ".png");
                cardsNode.addChild(node);
            }
            idx++;
        }
  
         
        for (var i = 0; i < pl.mjpeng.length; i++) {
            var acIcon = cardsNode.getChildByName("acIcon").clone();
            cardsNode.addChild(acIcon);
            acIcon.x += idx * 42 * 0.8;
            cc.log("acIcon.x:", acIcon.x);
            acIcon.visible = true;
            acIcon.loadTexture("hongZi/gameResult/peng.png");
            for (var j = 0; j < 3; j++) {
                var card = pl.mjpeng[i];
                var name = ["card0", "card1", "card2"][j];
                var node = cardsNode.getChildByName(name).clone();
                node.visible = true;
                node.x += idx * node.getContentSize().width * 0.8;
                node.loadTexture(MjClient.cardPath_hongZi + "out" + card + ".png");
                cardsNode.addChild(node);
                 
            }
            idx++;
        }

        var handSort = MjClient.majiang.sortCard(pl.mjhand);
        for (var i = 0; i < handSort.length; i++) {
            var row = handSort[i];
            for (var j = 0; j < row.length; j++) {

                var card = row[j];
                var name = ["card0", "card1", "card2"][j];
                var node = cardsNode.getChildByName(name).clone();
                node.visible = true;
                node.x += idx * node.getContentSize().width * 0.8;
                node.loadTexture(MjClient.cardPath_hongZi + "out" + card + ".png");
                cardsNode.addChild(node);

                // if(!this._isShowHu && card == tData.lastPutCard && tData.winner != -1){
                //     var nodeSize = node.getContentSize();
                //     var icon = ccui.ImageView.create("playing/paohuzi/huIcon.png");
                //     icon.setAnchorPoint(cc.p(1,0));
                //     icon.setPosition(cc.p(nodeSize.width,0));
                //     node.addChild(icon);
                //     this._isShowHu = true;
                // } 

            }
            idx++;
        }

        return  itemH;
    },

    setMsg : function(){
        var wanfa = this._uiNode.getChildByName("wanfa");

        //wanfa.ignoreContentAdaptWithSize(false);
        //wanfa.setSize(cc.size(370, 100));

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