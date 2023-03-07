/*
* @Author: Administrator
* @Date:   2018-08-21 17:30:58
* @Last Modified by:   zzj
* @Last Modified time: 2019-09-10 17:15:36
*/

var actionZindex = 1000;

function SetUserVisible_fuLuShou(node, off){
    var pl = getUIPlayer_fuLuShou(off);
    cc.log("====================off======================" + off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var headBox = head.getChildByName("headBox");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var huxi = head.getChildByName("huxi");
    if(pl){
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        nobody.visible = true;
        headBox.visible = true;
        name_bg.visible = false;
        score_bg.visible = false;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline_fuLuShou(node, off);
        // InitUserHandUI_syZiPai(node, off);
        // cc.log("pl.info.uid = "+pl.info.uid);
    }else{
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        huxi.visible = false;
        nobody.visible = false;
        headBox.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead){
            WxHead.removeFromParent(true);
        }
    }
}

//设置玩家牌桌上的信息(只有自己才设置手牌，其他玩家不需要设置)
function InitUserHandUI_fuLuShou(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_fuLuShou(off);

    if(!pl){
        return;
    }

    setAreaTypeInfo(true);

    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1){
        //表示正常游戏
        if(pl.mjhand && off == 0){
            cc.log("pl.mjhand====:" + pl.mjhand);
            MjClient.isCommon = false;  //接到起手牌消息一定要把这变量置false，否则从回放回来可能导致出不了牌
            pl.autoCard = null;      //自动摸打的牌
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
        }
    }else{
        /*
            播放录像
         */
        //cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand){
            if(off == 0){
                MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
            }else{
                if(!MjClient.OtherHandArr){
                    MjClient.OtherHandArr = {};
                }
                if(!MjClient.OtherHandArr[off]){
                    MjClient.OtherHandArr[off] = MjClient.majiang.sortCard(pl.mjhand);
                }
            }
        }

    }
    MjClient.playui.CardLayoutRestore(node,off);
}

var PlayLayer_fuLuShou = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if(cc.sys.isObjectValid(MjClient.endoneui))
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }
                MjClient.hasPut = false;
                var sData = MjClient.data.sData;
                var tData = sData.tData;
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname ));
                    }
                }
                var ipmsg = [];
                for (var ip in ip2pl) {
                    var ips = ip2pl[ip];
                    if (ips.length > 1) {
                        ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                    }
                }
            },
            LeaveGame: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                stopEffect(playTimeUpEff);
                playTimeUpEff = null;
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd){
                    this.addChild(new GameOverLayer_FuLuShou(),500);      //结算后续再改
                }else{
                    MjClient.Scene.addChild(new StopRoomView());
                }    
            },
            roundEnd: function() {
                var self = this;

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var time = 0.2;
                
                function delayExe(){
                    var sData = MjClient.data.sData;
                    resetEatActionAnim_fuLuShou();
                    if (sData.tData.roundNum <= 0){
                        var layer = new GameOverLayer_FuLuShou();
                        self.addChild(layer,500);
                    }
                    if(!MjClient.endoneui){
                        self.addChild(new EndOneView_FuLuShou(),500);         //小结算后续处理
                    }

                    var putNode = MjClient.playui._downNode.getChildByName("xingPai");
                    putNode.removeAllChildren();
                    putNode.setVisible(false);
                }
                this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(delayExe)));
                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
            },
            initSceneData: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                reConectHeadLayout_fuLuShou(this);        //不涉及到头像移动动作
                CheckRoomUiDelete();
                tableStartHeadMoveAction_fuLuShou(this);   //不涉及到头像移动动作

                MjClient.playui.showAndHideHeadEffect();
            },
            MJChat : function(data){
            }, 
            addPlayer:function () {
                tableStartHeadMoveAction_fuLuShou(this);   //不涉及到头像移动动作
            },
            removePlayer: function(eD) {
            },
            onlinePlayer: function() {
                reConectHeadLayout_fuLuShou(this);        //不涉及到头像移动动作
            },
            logout: function() {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function() {
                CheckRoomUiDelete();
            },
            changeMJBgEvent: function() {
                changeMJBg_fuLuShou(this, 1);   //福禄寿默认1
            },
            MJPeng: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZNewCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            MJGang: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            FLSChiCard: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZWeiCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            MJZhao: function(eD) {
                MjClient.playui.showAndHideHeadEffect();
            },
            MJPut: function(msg) {
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(eD) {
                MjClient.playui.showAndHideHeadEffect();
            },
            EZP_layout : function(){
                if(MjClient.data.sData.tData.maxPlayer < 4){
                    ziPai.changePlayUILayout(MjClient.playui.playuiNode);
                    MjClient.playui.ResetPutCard(MjClient.playui._downNode, 0);
                    if(MjClient.data.sData.tData.maxPlayer == 2) {
                        MjClient.playui.ResetPutCard(MjClient.playui._topNode, 1);
                    }
                    else {
                        MjClient.playui.ResetPutCard(MjClient.playui._rightNode, 1);
                        MjClient.playui.ResetPutCard(MjClient.playui._topNode, 2);
                    }
                    
                }
                
            }
        },
        cardNumImg: {
            _run:function () {
                this.visible = false;
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.085, 0.085], [0.5, 0.73], [0, 0]);
            },
            _event: {
                initSceneData: function(eD) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.visible = IsArrowVisible_chenZhouZiPai() && TableState.waitJiazhu != tData.tState;
                },
                mjhand: function(eD) {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.visible = IsArrowVisible_chenZhouZiPai() && TableState.waitJiazhu != tData.tState;
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardNumImg:{
                _run:function() {
                    this.visible = false;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.cardNumPaiDui = 59;
                    if (tData.maxPlayer == 4){
                        this.cardNumPaiDui = 39;
                    }else if (tData.maxPlayer == 3){
                        this.cardNumPaiDui = 41;
                    }
                    this.cardnumAtlas = this.getParent().getChildByName("cardnumAtlas");
                },
                _event:{
                    initSceneData:function(){
                        if(!IsArrowVisible_fuLuShou()){
                            return;
                        }
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if(tData.tState != TableState.waitPut &&
                           tData.tState != TableState.waitEat &&
                           tData.tState != TableState.waitCard) {
                            this.visible = false;
                            return;
                        }
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = true;
                            this.removeAllChildren();
                            next = next / (this.cardNumPaiDui / 20);
                            for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                            }
                        }
                        this.cardnumAtlas.y = 40 + this.getChildrenCount() * 0.8;
                    },
                    mjhand:function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = true;
                            this.removeAllChildren();
                            next = next / (this.cardNumPaiDui / 20);
                            for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                            }
                        }
                        this.cardnumAtlas.y = 40 + this.getChildrenCount() * 0.8;
                    },
                    HZNewCard:function(){
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = true;
                            var children = this.getChildren();
                            var childNum = this.getChildrenCount();
                            var factRemoveCount = (this.cardNumPaiDui - next)/(this.cardNumPaiDui/20);
                            if(Math.floor(childNum + factRemoveCount) > 20){
                                children[childNum - 1].removeFromParent(true);
                            }
                        }
                        this.cardnumAtlas.y = 40 + this.getChildrenCount() * 0.8;
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }                    
                }
            },
            cardnumAtlas: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.visible = false;
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    initSceneData : function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    mjhand: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZNewCard: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZCardNum: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    waitPut: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg_fuLuShou(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg_fuLuShou(this);
                    }
                },
                _layout: [[1, 1],[0.5, 0.5],[0, 0], true],
            },
            LeftBottom:{
                _layout: [[0.1, 0.1],[0.03, 0.045],[0, 0]],
            },
            RightBottom:{
                _layout: [[0.1, 0.1],[0.97,0.05],[0, 0]],
            },
            RightTop:{
                _layout: [[0.1, 0.1],[0.97,0.95],[0, 0]],
            },
            leftTop:{
                _layout: [[0.1, 0.1],[0.03,0.95],[0,0]],
            }
        },
        info:{
            _layout: [[0.16, 0.16],[0.01, 0.935],[0, 0]]
        },
        gameName:{
            _layout: [[0.12, 0],[0.5, 0.8292],[0, 0]]

        },
        roundInfo:{
            _layout: [[0.11, 0.11],[0.5, 0.66],[0, 0]],
            _run:function () {
                if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) {
                    this.visible = false;
                }
            },
        },
        jiazhuWait:{
            _visible:false,
            _layout: [[0.45, 0.12],[0.5, 0.5],[0, 0]]
        },
        pnl_piao:{
            _layout: [[0.008, 0.008], [0.45, 0.1], [0, 0]],
            _run:function() {
                this.setVisible(false);
                var pl = getUIPlayer_fuLuShou(0);
                var tData = MjClient.data.sData.tData;
                if(!pl) return;
                if ( tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 &&
                    (tData.areaSelectMode.piaoType <= 3 ||
                     (tData.areaSelectMode.piaoType == 4 && tData.areaSelectMode.piaoFlag > 0)
                    )) {
                    this.visible = true;

                    if(tData.areaSelectMode.piaoType == 4) {
                        MjClient.playui.adjustPiaoBtn(this);
                    }
                }
                if (MjClient.gameType != MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU) {
                    this.visible = false;
                }
            },
            _event: {
                initSceneData: function() { // 原地重连 不会走_run
                    this.visible = false;
                    var pl = getUIPlayer_fuLuShou(0);
                    var tData = MjClient.data.sData.tData;
                    if(!pl) return;
                    if (tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 &&
                        MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU &&
                        (tData.areaSelectMode.piaoType <= 3 ||
                         (tData.areaSelectMode.piaoType == 4 && tData.areaSelectMode.piaoFlag > 0)
                        )) {
                        this.visible = true;

                        if(tData.areaSelectMode.piaoType == 4) {
                            MjClient.playui.adjustPiaoBtn(this);
                        }
                    }
                },
                waitJiazhu:function (msg) {
                    this.visible = true;
                    if (MjClient.gameType != MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU) {
                        this.visible = false;
                    }
                    if(MjClient.data.sData.tData.areaSelectMode.piaoType == 4) {
                        MjClient.playui.adjustPiaoBtn(this);
                    }

                    if (MjClient.webViewLayer != null)
                    {
                        MjClient.webViewLayer.close();
                    }
                }
            },
            btn_piao0: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 0,
                    });
                },
                _event: {
                    initSceneData: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        cc.log(tData.areaSelectMode.piaoType, pl.lastPiaoFen, "上一次飘分");
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 0));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 0));
                    },
                    waitJiazhu: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        cc.log(tData.areaSelectMode.piaoType, pl.lastPiaoFen, "上一次飘分");
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 0));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 0));
                    }
                }
            },
            btn_piao1: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 1,
                    });
                },
                _event: {
                    initSceneData: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        cc.log(tData.areaSelectMode.piaoType, pl.lastPiaoFen, "上一次飘分");
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 1));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 1));
                    },
                    waitJiazhu: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 1));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 1));
                    }
                }
            },
            btn_piao2: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 2,
                    });
                },
                _event: {
                    initSceneData: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        cc.log(tData.areaSelectMode.piaoType, pl.lastPiaoFen, "上一次飘分");
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 2));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 2));
                    },
                    waitJiazhu: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 2));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 2));
                    }
                }  
            },
            btn_piao3: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 3,
                    });
                },
                _event: {
                    initSceneData: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        cc.log(tData.areaSelectMode.piaoType, pl.lastPiaoFen, "上一次飘分");
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 3));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 3));
                    },
                    waitJiazhu: function() {
                        var pl = getUIPlayer_fuLuShou(0);
                        if(!pl) return;
                        var tData = MjClient.data.sData.tData;
                        this.setBright(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 3));
                        this.setTouchEnabled(!(tData.areaSelectMode.piaoType == 1 && pl.lastPiaoFen > 3));
                    }
                }  
            },
            btn_piao4: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 5,
                    });
                }
            }
        },
        pnl_piao_20:{
            _layout: [[0.008, 0.008], [0.45, 0.1], [0, 0]],
            _run:function() {
                this.visible = false;
                //子节点都隐藏
                var child = this.getChildren();
                for (var k in child) {
                    child[k].setVisible(false);
                }
                var pl = getUIPlayer_fuLuShou(0);
                var tData = MjClient.data.sData.tData;
                if(!pl) return;
                if (tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 &&
                    MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG &&
                    tData.areaSelectMode.piaoFlag > 1) {
                    this.visible = true;
                }
            },
            _event: {
                initSceneData: function() { // 原地重连 不会走_run
                    this.visible = false;
                    var pl = getUIPlayer_fuLuShou(0);
                    var tData = MjClient.data.sData.tData;
                    if(!pl) return;
                    if (tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 &&
                        MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG &&
                        tData.areaSelectMode.piaoFlag > 1) {
                        this.visible = true;

                        MjClient.playui.adjustPiaoBtn(this);
                    }
                },
                waitJiazhu:function (msg) {
                    this.visible = true;
                    MjClient.playui.adjustPiaoBtn(this);
                    if (MjClient.webViewLayer != null)
                    {
                        MjClient.webViewLayer.close();
                    }
                }
            },
            btn_piao0: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 0,
                    });
                },
            },
            btn_piao1: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 1,
                    });
                },
            },
            btn_piao2: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 2,
                    });
                },
            },
            btn_piao3: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 3,
                    });
                },
            },
            btn_piao4: {
                _click:function() {
                    var pl = getUIPlayer_fuLuShou(0);
                    pl.piaoFen = -1;
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJJiazhu",
                        piaoFen: 5,
                    });
                },
            }
        },
        banner: {
            _layout: [[0.35, 0.35],[0.5, 1],[0, 0]],
            _run: function() {
                var nodeChangeBg = this.getChildByName("changeBg");
                var nodeSettingBg = this.getChildByName("setting");
                var nodeGpsBg = this.getChildByName("gps_btn");
                var nodeTuoGuan = this.getChildByName("Btn_tuoGuan");
                if (MjClient.MaxPlayerNum_fuLuShou == 2){
                    nodeGpsBg.visible = false;
                    nodeTuoGuan.x = nodeSettingBg.x;
                    //nodeChangeBg.x = nodeSettingBg.x;
                    nodeSettingBg.x = nodeGpsBg.x;
                }else{
                    nodeTuoGuan.x = nodeSettingBg.x;
                    nodeSettingBg.x = nodeGpsBg.x + nodeTuoGuan.x - nodeChangeBg.x;
                }
                //changeGameBg_fuLuShou(this);
            },
                /*
            _event: {
                changeGameBgEvent: function() {
                    changeGameTitleBg(this);
                }
            },
            */
            wifi: {
                _run: function() {
                    updateWifiState_new(this);
                }
            },
            timeTxt:{
                 _run:function()
                {
                    this.schedule(function(){
                        var time = MjClient.getCurrentTime();
                        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                            (time[4]<10?"0"+time[4]:time[4]);
                        this.setString(str);
                    });
                }

            },
            powerBar: {
                _run: function() {
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            getRoomNum: {
                // _run:function(){
                //     if (MjClient.remoteCfg.guestLogin){
                //         setWgtLayout(this, [0.18, 0.18],[0.5, 0.3],[0, 0]);
                //     }else{
                //         setWgtLayout(this, [0.18, 0.18],[0.5, 0.2],[0, 0]);
                //     }
                // },
                // _visible:function(){
                //     return !MjClient.remoteCfg.guestLogin;
                // },
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fuzhifangjianxinxi", {uid:SelfUid(), gameType:MjClient.gameType});

                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;

                    var str = "";
                    str += tData.areaSelectMode.maxPlayer + "人,";
                    str += tData.areaSelectMode.bankType == 1 ? "轮庄," : "胡牌庄,";
                    if (tData.areaSelectMode.piaoType == 1) {
                        str += "热飘";
                    } else if (tData.areaSelectMode.piaoType == 2) {
                        str += "冷飘";
                    } else if (tData.areaSelectMode.piaoType == 3) {
                        str += "不飘"
                    }
                    str += tData.areaSelectMode.qingZuiType == 1 ? "亲嘴0胡," : "亲嘴2胡,";
                    str += tData.areaSelectMode.isPenPenHuTwo ? "碰碰胡每个字不少于2个字," : "";
                    str += tData.areaSelectMode.isZhaoGang6Xi ? "杠招6息," : "杠招4息,";
                    str += tData.areaSelectMode.isSuanFenDieJia ? "叠加算分" : "不叠加算分";

                    var sData = MjClient.data.sData;
                    var dis = MjClient.MaxPlayerNum_fuLuShou - Object.keys(sData.players).length;
                    var str7 = "  二缺一";
                    if(MjClient.MaxPlayerNum_fuLuShou == 3){
                        str7 = dis==1 ? "三缺一" : "三缺二";
                    }else if(MjClient.MaxPlayerNum_fuLuShou == 4){
                        if(dis == 1){
                            str7 = "四缺一";
                        }else if(dis == 2){
                            str7 = "四缺二";
                        }else if(dis == 3){
                            str7 = "四缺三";
                        }
                    }

                    str7 += "(";
                    var index = 0;
                    for(var uid in sData.players){
                        var pl = sData.players[uid + ""];
                        if (!pl) continue;
                        str7 += unescape(pl.info.nickname );
                        if(index < Object.keys(sData.players).length - 1){
                            str7 += ",";
                        }
                        index ++;
                    }
                    str7 += ")";
                    var str6 = str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    cc.log(str+str6);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str+str6);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
                        MjClient.native.openWeixin();
                    }, function(){});
                },
            },
            setting: {
                _click: function() {
                    var settringLayer = new ZiPaiSettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            changeBg: {
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize());
                    }
                },
                _click: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
                        postEvent("EZP_rule");
                    }else {
                        ziPai.setCurrentGameBgTypeToNext();
                        postEvent("changeGameBgEvent", {});
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
                    }
                }
            },
            gps_btn: {
                _click: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 3){
                        MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    }else if(MjClient.MaxPlayerNum_fuLuShou == 4){
                        MjClient.Scene.addChild(new showDistanceLayer());
                    }
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid(),gameType:MjClient.gameType});
                }
            },
            Btn_tuoGuan: {
                _click: function() {
                    var tData = MjClient.data.sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid()];
                    cc.log("听牌判定", pl.mjState, pl.eatFlag);
                    //if (pl && pl.mjState == TableState.waitCard) {
                    //if (!curPlayerIsMe_fuLuShou(0)) {  //点击托管时，当前操作人不能是自己
                    var num = pl.mjhand.length % 3;
                    var isNumValid = MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU ? (num == 0) : (num == 1);
                    //福禄寿拉牛只有两张牌
                    if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU && tData.maxPlayer == 4) {
                        var pos = (tData.zhuang + 2) % tData.maxPlayer; // 拉牛的位置
                         var laniuID = tData.uids[pos];
                         if (laniuID && laniuID == SelfUid()) {
                            isNumValid = num == 2;
                         }
                    }
                    if (isNumValid && (pl.eatFlag == 0) && 
                        (pl.mjState == TableState.waitPut || pl.mjState == TableState.waitCard || pl.mjState == TableState.waitEat)) {
                        //判断是否处于听牌状态
                        var ting = MjClient.majiang.getTingCards(MjClient.data.sData, pl);
                        if (ting && ting.length > 0) {
                            //给服务器发送托管
                            cc.log("发送托管");
                            HZTrustToServer_fuLuShou();
                        } else {
                            cc.log("111111111");
                            MjClient.showToast("未听牌不能托管");
                        }
                        return;
                    }

                    MjClient.showToast("未听牌不能托管");
                }
            },
            back_btn: {
                _click: function() {
                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                    {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                            },
                            function() {});
                    }
                    else {
                        MjClient.showMsg("是否解散房间？", function () {
                            MjClient.delRoom(true);
                        }, function(){}, 1);
                    }
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    //MjClient.openWeb({url:MjClient.GAME_TYPE.YUE_YANG_FU_LU_SHOU, help:true});   //此按钮好像被作废了？
                    MjClient.openWeb({url:MjClient.gameType, help:true});
                }
            },
            roundnumImg: {
                _run:function () {
                    MjClient.roundnumImgNode = this;
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsArrowVisible_fuLuShou();
                    },
                    mjhand: function(eD) {
                        this.visible = IsArrowVisible_fuLuShou();
                    },
                    onlinePlayer: function(eD) {
                        this.visible = IsArrowVisible_fuLuShou();
                    }
                },
                roundnumAtlas: {
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return ((tData.roundAll - tData.roundNum + 1).toString()+"/"+tData.roundAll.toString()+"局");
                    },
                    _event: {
                        mjhand: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) return this.setString((tData.roundAll - tData.roundNum + 1).toString()+"/"+tData.roundAll.toString()+"局");
                        }
                    }
                }
            },
        },
        wait: {
            wxinvite: {
                _layout: [[0.176, 0.176],[0.7, 0.18],[0, -0.5]],
                _click: function() {
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                },
                _visible:function(){
                    return !MjClient.remoteCfg.guestLogin;
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
                        console.log(">>>>>> play add player >>>>");
                        this.visible = IsInviteVisible();
                    },
                    removePlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    }
                }
            },
            delroom: {
                _run:function(){
                    this.visible = false;
                    /*
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.5],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                    }
                    */
                },
                /*
                _click: function() {
                    MjClient.delRoom(true);
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = isShowBackBtn_fuLuShou();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn_fuLuShou();
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady:function()
                    {
                        this.visible = true;
                    },
                    waitJiazhu:function() {
                        this.visible = false;
                    }
                }
                */
            },
            backHomebtn: {
                _layout: [[0.176, 0.176],[0.3, 0.18],[0, -0.5]],
                _run:function(){
                    /*
                    if (isIPhoneX()) {
                        setWgtLayout(this, [0.11, 0.11],[0.1, 0.65],[0, 0]);
                    }
                    else {
                        setWgtLayout(this, [0.11, 0.11],[0.05, 0.65],[0, 0]);
                    }
                    */
                },
                _click: function(btn) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function() {
                                    MjClient.leaveGame();
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
                                },
                                function() {});
                        }
                    }
                },
                _event: {
                    returnPlayerLayer: function() {
                        MjClient.playui.visible = true;
                    },
                    initSceneData: function(eD) {
                        this.visible = isShowBackBtn_fuLuShou();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn_fuLuShou();
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady:function()
                    {
                        this.visible = false;
                    },
                    waitJiazhu:function() {
                        this.visible = false;
                    }
                }
            },
            waitFriends:{
                _layout: [[0.06, 0.06],[0.5, 0.5],[0, -4]],
                _run:function () {
                    for(var i=0 ; i<9 ; i++){
                        var imgZi = this.getChildByName("waitFriend_" + i);

                        var hei = 20;
                        if(i>=6){
                            hei = 10;
                        }
                        if(imgZi){
                            imgZi.runAction(cc.repeatForever(cc.sequence(
                                cc.delayTime(i*0.3),
                                cc.moveBy(0.3, 0, hei),
                                cc.moveBy(0.3, 0, -hei),
                                cc.delayTime(3 - i*0.3)
                            )));
                        }
                    }
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
                        console.log(">>>>>> play add player >>>>");
                        this.visible = IsInviteVisible();
                    },
                    removePlayer: function(eD) {
                        this.visible = IsInviteVisible();
                    }
                }
            },
        },
        BtnReady:{
            _run: function () {
                this.visible = false;
                setWgtLayout(this,[0.176, 0.176], [0.5, 0.3], [0, 0]);
            },
            _click: function(btn) {
                cc.log("-----------准备-------");
                HZPassConfirmToServer_fuLuShou();
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
            },
            _event:{
                waitReady:function()
                {
                    this.visible = true;
                },
                mjhand: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    this.visible = false;
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData.roundNum != tData.roundAll) {
                        return;
                    }

                    if (Object.keys(sData.players).length < tData.maxPlayer) {
                        return;
                    }

                    var pl = getUIPlayer(0);
                    if(tData.tState == TableState.waitReady && pl.mjState == TableState.waitReady)
                    {
                        this.visible = true;
                    }
                },
                PKPass:function () {
                    this.visible = false;
                },
                onlinePlayer: function(msg) {
                    if(msg.uid  == SelfUid())
                    {
                        this.visible = false;
                    }
                },
                removePlayer: function() {
                    this.visible = false;
                }
            }
        },        
        down: {
            head: {
                img_piao: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            var pl = getUIPlayer_fuLuShou(0);
                            var tData = MjClient.data.sData.tData;
                            if (pl && pl.piaoFen != -1 && tData.tState == TableState.waitJiazhu) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + pl.piaoFen + ".png");
                            }
                        },
                        MJJiazhu: function(msg) {
                            if(!msg.uid || msg.piaoFen == undefined)
                                return;
                            var pl = getUIPlayer_fuLuShou(0);
                            if (msg.uid == pl.info.uid && pl.piaoFen != -1) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + msg.piaoFen + ".png");
                            }
                        },
                        mjhand: function(msg) {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                img_piaoFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            setPiaoFlag_fuLuShou(this, 0);
                        },
                        mjhand: function() {
                            setPiaoFlag_fuLuShou(this, 0);
                        },
                        roundEnd: function() {
                            // this.visible = false;
                        },
                        waitJiazhu: function() {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                img_guoHuFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            var pl = MjClient.data.sData.players[SelfUid()];
                            this.setVisible(pl.isGuoHu);
                        },
                        MJPut: function(eD) {
                            if(eD && eD.uid == SelfUid()) {
                                this.setVisible(false);
                            }
                        },
                        MJPass: function(eD) {
                            if(eD && eD.isGuoHu && eD.uid == SelfUid()) {
                                this.setVisible(true);
                            }
                        },
                        roundEnd: function() {
                            this.setVisible(false);
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(){
                            showUserZhuangLogo_fuLuShou(this, 0);
                        },
                        initSceneData: function(){
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, 0);
                            showUserZhuangLogo_fuLuShou(this, 0);
                        },
                        mjhand: function(){
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, 0);
                            showUserZhuangLogo_fuLuShou(this, 0);
                        }
                        /*,
                        roundEnd: function() {
                            showUserZhuangLogo_fuLuShou(this, 0);
                        }
                        */
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {
                                showUserChat_fuLuShou(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_fuLuShou(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_fuLuShou(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_fuLuShou(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_fuLuShou(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_fuLuShou(this,0);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_fuLuShou(this,0);
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            var huXi = UpdateHuXi_fuLuShou(0);
                            if(!IsArrowVisible_fuLuShou()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                        },
                        FLSChiCard:function(){
                            var huXi = UpdateHuXi_fuLuShou(0);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_fuLuShou(0);
                            return this.setString("胡息:" + huXi);
                        },
                        MJGang:function(){
                            var huXi = UpdateHuXi_fuLuShou(0);
                            return this.setString("胡息:" + huXi);
                        },
                        //还有"招"的胡息计算
                        //下面这条?-----------mark
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_fuLuShou(0);
                            return this.setString("胡息:" + huXi);
                        }
                    }
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        mjhand: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0) && IsArrowVisible_fuLuShou();
                        },
                        waitPut: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        HZNewCard: function(ed){
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        MJPeng: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        FLSChiCard: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        MJGang: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        //需要补"招" ------mark
                        MJZhao: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        MJPut: function(eD){
                            //this.visible = curPlayerIsMe_fuLuShou(0);
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJGang: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            FLSChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            //需要补"招" ----------mark
                            MJZhao:function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_fuLuShou(0)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_fuLuShou(0);
                                if(pl && pl.onLine && curPlayerIsMe_fuLuShou(0)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                },
                skipHuIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer_fuLuShou(0);
                            if (pl && pl.isQiHu) {
                                this.visible = true;
                            }
                        }
                    }
                },
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.5, 0.45], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            tai_layout:{
                _layout: [[0.018, 0.018],[0, 0],[0, 0.2]],
                tai_info:{
                    _visible:true,
                    _run: function () {
                        this.setString("");
                    }
                },
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[-2.5, -2.5]],
                _run: function() {
                    GetReadyVisible_fuLuShou(this, 0);
                },
                _event: {
                    mjhand: function(){
                        GetReadyVisible_fuLuShou(this, 0);
                    },
                    moveHead: function() {
                        GetReadyVisible_fuLuShou(this, 0);
                    },
                    addPlayer: function() {
                        GetReadyVisible_fuLuShou(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible_fuLuShou(this, 0);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_fuLuShou(this, 0);
                    },
                    waitJiazhu: function() {
                        GetReadyVisible_fuLuShou(this, 0);
                    },initSceneData: function() {
                        GetReadyVisible_fuLuShou(this, 0);
                    }
                }
            },
            handNode: {
                _visible: false,
                _event:  {
                    initSceneData: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    HZNewCard: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    HZPickCard: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    HZAddCards: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    FLSChiCard: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    MJPeng: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    MJPut: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    //此处需要补"招" ------------mark
                    MJZhao: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    MJGang: function() {
                        calculateHintPutList_fuLuShou();
                    },
                    MJPass: function() { // 天胡 提 偎 跑后过胡
                        calculateHintPutList_fuLuShou();
                        addTingSign_fuLuShou(MjClient.playui._downNode);
                    },
                    HZCheckRaise: function() {
                        calculateHintPutList_fuLuShou();
                        addTingSign_fuLuShou(MjClient.playui._downNode);
                    }
                }
            },
            replayNode:{
                _visible:true,
                _layout:[[0.1, 0.1], [0.15, 0.05], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.005, 0.2], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.2], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.7, 0.5], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.7, 0.54], [0, 0]);
                    }
                }
            },
            handCard: {
                _run:function () {
                    this.ignoreContentAdaptWithSize(true); 
                    ziPai.setWgtLayoutHandCard(this);
                    
                    var changeCardSize = ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
                    if(ziPai.getZiPaiType() == 0){
                        setWgtLayout(this, [98/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);  
                    }else if (ziPai.getZiPaiType() == 1){
                        setWgtLayout(this, [0.09 * changeCardSize, 0],[0.27,0.75],[0,0]);
                    }else{
                        setWgtLayout(this, [100/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
                    }   
                },
                _visible: false,
                _event:{
                    changeMJBgEvent: function() {
                       ziPai.setWgtLayoutHandCard(this);
                        var changeCardSize = ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
                        if(ziPai.getZiPaiType() == 0){
                            setWgtLayout(this, [98/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);  
                        }else if (ziPai.getZiPaiType() == 1){
                            setWgtLayout(this, [0.09 * changeCardSize, 0],[0.27,0.75],[0,0]); 

                        }else{
                            setWgtLayout(this, [100/1280 * changeCardSize, 0],[0.27,0.75],[0,0]);
                        }  
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode,0,false,true);
                    }
                }
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35], [0.5, 0.6], [0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            xingPai: {
                _visible: false,
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                }
            },
            out0: {
                _visible: false
            },
            /*
            out_qshu_layout: {
                //起手胡
                _visible: false,
                _run:function()
                {
                    setWgtLayout(this, [0.35, .35], [0.5, 0.56], [0, 0]);
                },
                _event: {
                    sendStartFlag: function(eD){
                        cc.log("接到事件...");
                        playQiShouHuAnim_fuLuShouErShiZhang(this, eD, 0);
                    }        
                }
            },
            */
            _event: {
                clearCardUI: function() {
                    clearCardUI_fuLuShou(this, 0);
                },
                clearCardArr: function(){
                    var handNode = this.getChildByName("handNode");
                    handNode.removeAllChildren();
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    var putNode = this.getChildByName("xingPai");
                    putNode.removeAllChildren();
                    putNode.setVisible(false);
                    RemovePutCardOut_fuLuShou(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_fuLuShou(this, 0);
                    InitUserHandUI_fuLuShou(this, 0);
                    InitUserCoinAndName_fuLuShou(this, 0);
                    MjClient.hasPut = false; // 重连回来重置打掉牌标志（打牌时候断线)
                    ShowPutCardIcon_fuLuShou();
                    DealOffLineCard_fuLuShou(this,0);
                    MjClient.playui.ResetMenCard(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_fuLuShou(this, 0);
                    InitUserCoinAndName_fuLuShou(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_fuLuShou(this, 0);
                    InitUserCoinAndName_fuLuShou(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_fuLuShou(this, 0);
                    InitUserCoinAndName_fuLuShou(this, 0);

                    var uid = getUIPlayer_fuLuShou(0).info.uid;
                    if (eD.jiazhuNums)
                    {
                        for (var key in eD.jiazhuNums)
                        {
                            if (key != uid && eD.jiazhuNums[key] == 2)
                                MjClient.playui._jiazhuWait.visible = true;
                        }
                    }
                },
                roundEnd: function() {
                    InitUserCoinAndName_fuLuShou(this, 0);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_fuLuShou(this,eD,0);
                },
                MJPut: function(eD) {
                    DealPutCard_fuLuShou(this,eD,0);
                },
                FLSChiCard: function(eD) {
                    DealChiCard_fuLuShou(this, eD, 0);
                    ShowPutCardIcon_fuLuShou();
                },
                //需要补"招"牌 -------------mark
                MJZhao: function(eD) {
                    DealGangCard_fuLuShou(this, eD, 0, true);
                },
                MJGang: function(eD) {
                    DealGangCard_fuLuShou(this, eD, 0);       //没实现------mark
                },
                MJPeng: function(eD) {
                    DealPengCard_fuLuShou(this, eD, 0);
                    ShowPutCardIcon_fuLuShou();
                },
                MJHu: function(eD) {
                    DealHu_fuLuShou(this, eD, 0);
                },
                onlinePlayer: function(eD) {
                    resetHandAfterBegin_fuLuShou();
                    setUserOffline_fuLuShou(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_fuLuShou(this, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                //补飘------------mark
                MJJiazhu: function(msg) {
                    if(!msg.uid || msg.piaoFen == undefined)
                        return;
                    if (msg.piaoFen != -1 && msg.uid == SelfUid()) {
                        this.parent.getChildByName("pnl_piao").setVisible(false);
                        this.parent.getChildByName("pnl_piao_20").setVisible(false);
                    }
                },
                HZPickCard:function (eD) {
                    var pl = getUIPlayer_fuLuShou(0);
                    if(eD.uid == pl.info.uid) {
                        MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand)
                    }
                    RemovePutCardOut_fuLuShou(true);
                    MjClient.playui.ResetHandCard(this,0);

                    ShowPutCardIcon_fuLuShou();
                },
                HZAddCards:function (eD) {
                    DealAddCard_fuLuShou(this,eD, 0);
                },
                waitPut: function(eD) {
                    RemovePutCardOut_fuLuShou();
                    DealWaitPut_fuLuShou(this, eD, 0);
                },
                //HZCheckRaise干嘛的？
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_fuLuShou();
                    MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_fuLuShou(0);
                    if(!pl){
                        return;
                    }
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_fuLuShou(off));
                    }
                },
            }
        },
        xing: {
            _run:function () {
                if(MjClient.MaxPlayerNum_fuLuShou != 4){
                    this.setVisible(false);
                }
            },
            head: {
                img_piao: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou != 4)
                                return;
                            var pl = getUIPlayer_fuLuShou(1);
                            var tData = MjClient.data.sData.tData;
                            if (pl && pl.piaoFen != -1 && tData.tState == TableState.waitJiazhu) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + pl.piaoFen + ".png");
                            }
                        },
                        MJJiazhu: function(msg) {
                            if(!msg.uid || msg.piaoFen == undefined)
                                return;
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                var pl = getUIPlayer_fuLuShou(1);
                                if (msg.uid == pl.info.uid && pl.piaoFen != -1) {
                                    this.visible = true;
                                    this.loadTexture("playing/fulushou/xian_piao" + msg.piaoFen + ".png");
                                }
                            }
                        },
                        mjhand: function(msg) {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                img_piaoFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                setPiaoFlag_fuLuShou(this, 1);
                            }   
                        },
                        mjhand: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                setPiaoFlag_fuLuShou(this, 1);
                            }
                        },
                        roundEnd: function() {
                            // this.visible = false;
                        },
                        waitJiazhu: function() {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                showUserZhuangLogo_fuLuShou(this, 1);
                            }
                        },
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, 1);
                                showUserZhuangLogo_fuLuShou(this, 1);
                            }
                        },
                        mjhand: function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, 1);
                                showUserZhuangLogo_fuLuShou(this, 1);
                            }
                        }
                        /*
                        ,
                        roundEnd: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                showUserZhuangLogo_fuLuShou(this, 1);
                            }
                        }
                        */
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    showUserChat_fuLuShou(this, 1, msg);
                                }
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    MjClient.data._tempMessage.msg = voicePath;
                                    showUserChat_fuLuShou(this, 1, MjClient.data._tempMessage);
                                }
                            }
                        }
                    }
                },
                _click: function(btn) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        showPlayerInfo_fuLuShou(1, btn);
                    }
                },
                _event: {
                    loadWxHead: function(d) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            setWxHead_fuLuShou(this, d, 1);
                        }
                    },
                    addPlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            showFangzhuTagIcon_fuLuShou(this, 1);
                        }
                    },
                    removePlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            showFangzhuTagIcon_fuLuShou(this, 1);
                        }
                    }
                },
                _run: function () {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        showFangzhuTagIcon_fuLuShou(this, 1);
                    }
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                this.setVisible(false);
                                return this.setString("胡息:0");
                            }
                        },
                        addPlayer: function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                return this.setString("胡息:0");
                            }
                        },
                        removePlayer: function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                this.visible = false;
                            }
                        },
                        initSceneData:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                // this.visible = true;
                                var huXi = UpdateHuXi_fuLuShou(1);
                                if (!IsArrowVisible_fuLuShou()) {
                                    huXi = 0;
                                }
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        mjhand:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                // this.visible = true;
                            }
                        },
                        FLSChiCard:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                var huXi = UpdateHuXi_fuLuShou(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        MJPeng:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                var huXi = UpdateHuXi_fuLuShou(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        MJGang:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                var huXi = UpdateHuXi_fuLuShou(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                        //补"招" ----------mark
                        MJZhao:function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                var huXi = UpdateHuXi_fuLuShou(1);
                                return this.setString("胡息:" + huXi);
                            }
                        },
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        mjhand: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        onlinePlayer: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1) && IsArrowVisible_fuLuShou();
                            }
                        },
                        waitPut: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        HZNewCard: function(ed){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        MJPeng: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        FLSChiCard: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        MJGang: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        //补"招" ------------mark
                        MJZhao: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                        },
                        MJPut: function(eD){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = curPlayerIsMe_fuLuShou(1);
                            }
                            // MjClient.playui.refreshHeadLight(true);
                        },
                        roundEnd: function(eD){
                            if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                //this.visible = false;
                            }
                            // MjClient.playui.refreshHeadLight(false);
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                        this.setString("00");
                                    }
                                }
                            },
                            mjhand: function(eD) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            MJPeng: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            HZNewCard: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            MJGang: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            FLSChiCard: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            //补"招" ----------------mark
                            /*
                            HZWeiCard: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            */
                            MJZhao: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            MJPut: function(msg) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    if (curPlayerIsMe_fuLuShou(1)) {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
                                        this.setString("00");
                                    }
                                }
                            },
                            onlinePlayer: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    var pl = getUIPlayer_fuLuShou(1);
                                    if (pl && pl.onLine && curPlayerIsMe_fuLuShou(1)) {
                                        arrowbkNumberUpdate(this);
                                    }
                                }
                            },
                            roundEnd: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                }
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.8, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, -2.5]],
                _run: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        GetReadyVisible_fuLuShou(this, 1);
                    }
                },
                _event: {
                    mjhand: function(){
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },
                    moveHead: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },
                    addPlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },
                    removePlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },
                    onlinePlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },
                    waitJiazhu: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    },initSceneData: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                            GetReadyVisible_fuLuShou(this, 1);
                        }
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout:[[0.1, 0.1], [0.85, 0.05], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.2], [0, 0]]
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.15], [0, 0]]
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35],[0.73, 0.6],[0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.73, 0.6],[0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        clearCardUI_fuLuShou(this, 1);
                    }
                },
                clearCardArr: function(){
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        var eatNode = this.getChildByName("eatNode");
                        eatNode.removeAllChildren();
                        var outNode = this.getChildByName("outNode");
                        outNode.removeAllChildren();
                        RemovePutCardOut_fuLuShou(true);
                    }
                },
                initSceneData: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        SetUserVisible_fuLuShou(this, 1);
                        InitUserHandUI_fuLuShou(this, 1);
                        InitUserCoinAndName_fuLuShou(this, 1);
                        DealOffLineCard_fuLuShou(this, 1);
                        MjClient.playui.ResetMenCard(this, 1);
                    }
                },
                addPlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        SetUserVisible_fuLuShou(this, 1);
                        InitUserCoinAndName_fuLuShou(this, 1);
                    }
                },
                removePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        SetUserVisible_fuLuShou(this, 1);
                        InitUserCoinAndName_fuLuShou(this, 1);
                    }
                },
                mjhand: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        InitUserHandUI_fuLuShou(this, 1);
                        InitUserCoinAndName_fuLuShou(this, 1);
                    }
                },
                HZNewCard: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        if (typeof(eD) == "number") {
                            eD = {newCard: eD};
                        }
                        DealNewCard_fuLuShou(this, eD, 1);
                    }
                },
                roundEnd: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        InitUserCoinAndName_fuLuShou(this, 1);
                        MjClient.playui.ResetOtherCard(this, 1);
                    }
                },
                waitPut: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        RemovePutCardOut_fuLuShou();
                        DealWaitPut_fuLuShou(this, eD, 1);
                    }
                },
                MJPut: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealPutCard_fuLuShou(this, eD, 1);
                    }
                },
                FLSChiCard: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealChiCard_fuLuShou(this, eD, 1);
                    }
                },
                MJGang: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealGangCard_fuLuShou(this, eD, 1);
                    }
                },
                MJPeng: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealPengCard_fuLuShou(this, eD, 1);
                    }
                },
                //补"招" ----------------------mark
                /*
                HZWeiCard: function(eD){
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealWeiCard_fuLuShou(this, eD, 1);
                    }
                },
                */
                MJZhao: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealGangCard_fuLuShou(this, eD, 1, true);
                    }
                },
                MJHu: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealHu_fuLuShou(this, eD, 1);
                    }
                },
                onlinePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        setUserOffline_fuLuShou(this, 1);
                    }
                },
                playerStatusChange: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        setUserOffline_fuLuShou(this, 1);
                    }
                },
                /*
                MJFlower: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        HandleMJFlower(this, eD, 1);
                    }
                },
                */
                MJTing: function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        HandleMJTing(this, eD, 1);
                    }
                },
                //补"飘" ---------------mark
                waitJiazhu:function (msg) {
                    /*
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        postEvent("returnPlayerLayer");
                        var layer = new jiaZhuXuzhouLayer(function () {
                            //弹窗等待
                            MjClient.playui._jiazhuWait.visible = true;
                        });
                        MjClient.playui.addChild(layer, 99);
                        if (MjClient.webViewLayer != null) {
                            MjClient.webViewLayer.close();
                        }
                    }
                    */
                },
                HZPickCard:function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        if (MjClient.rePlayVideo != -1) {
                            var pl = getUIPlayer_fuLuShou(1);
                            if (eD.uid == pl.info.uid) {
                                MjClient.OtherHandArr[1] = MjClient.majiang.sortCard(pl.mjhand)
                            }
                        }

                        RemovePutCardOut_fuLuShou(true);
                        MjClient.playui.ResetHandCard(this, 1);
                    }
                },
                HZAddCards:function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        DealAddCard_fuLuShou(this, eD, 1);
                    }
                },
                HZCheckRaise:function (msg) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 4) {
                        ShowPutCardIcon_fuLuShou();
                        //MjClient.playui.EatVisibleCheck();

                        var tData = MjClient.data.sData.tData;
                        var pl = getUIPlayer_fuLuShou(1);
                        if (!pl) {
                            return;
                        }
                        if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1) {
                            if (SelfUid() == pl.info.uid) {
                                var layer = new laZhangLayer();
                                MjClient.playui.addChild(layer, 99);
                                if (MjClient.webViewLayer != null) {
                                    MjClient.webViewLayer.close();
                                }
                            }
                            else {
                                MjClient.playui._jiazhuWait.visible = true;
                            }
                        } else if (pl.jiazhuNum == 1) {
                            MjClient.majiang.setJiaZhuNum(node, getUIPlayer_fuLuShou(off));
                        }
                    }
                }
            }
        },
        right: {
            _run: function() {
                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                    this.visible = false;
                }
            },
            head: {
                img_piao: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            var tData = MjClient.data.sData.tData;
                            if (pl && pl.piaoFen != -1 && tData.tState == TableState.waitJiazhu) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + pl.piaoFen + ".png");
                            }
                        },
                        MJJiazhu: function(msg) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            if(!msg.uid || msg.piaoFen == undefined)
                                return;
                            var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            if (msg.uid == pl.info.uid && pl.piaoFen != -1) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + msg.piaoFen + ".png");
                            }
                        },
                        mjhand: function(msg) {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                img_piaoFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            setPiaoFlag_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        mjhand: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            setPiaoFlag_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        roundEnd: function() {
                            // this.visible = false;
                        },
                        waitJiazhu: function() {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        initSceneData: function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        mjhand: function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        }
                        /*,
                        roundEnd: function() {
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                        }
                        */
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                showUserChat_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2, msg);
                            },
                            playVoice: function(voicePath) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    showPlayerInfo_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        setWxHead_fuLuShou(this, d, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    addPlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    removePlayer: function(eD) {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 2);
                    }
                },
                _run: function () {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            // this.visible = true;
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            if(!IsArrowVisible_fuLuShou()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            // this.visible = true;
                        },
                        FLSChiCard:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            return this.setString("胡息:" + huXi);
                        },
                        MJGang:function(){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            return this.setString("胡息:" + huXi);
                        },
                        //补“招” -----------mark
                        MJZhao:function() {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                            return this.setString("胡息:" + huXi);
                        },
                    }
                },
                jiaZhu: {
                   _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        mjhand: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        onlinePlayer: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2) && IsArrowVisible_fuLuShou();
                        },
                        waitPut: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        HZNewCard: function(ed){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        MJPeng: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        FLSChiCard: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        MJGang: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        //补"招" -------------mark
                        /*
                        HZWeiCard: function(eD) {
                            this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        */
                        MJZhao: function(eD) {
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        MJPut: function(eD){
                            if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                return
                            }
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJGang: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            FLSChiCard: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            //补"招" ----------------mark
                            /*
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            */
                            MJZhao: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                if (curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                                if(pl && pl.onLine && curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                                    return
                                }
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.8, 0.7], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, 2.5]],
                _run: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                _event: {
                    mjhand: function(){
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    moveHead: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    addPlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    removePlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    onlinePlayer: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    waitJiazhu: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    },
                    initSceneData: function() {
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return
                        }
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.85, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.73], [0, 0]],
                _run:function(){
                    //回放下移
                    if (MjClient.rePlayVideo != -1) {
                        setWgtLayout(this, [0.14, 0.14], [1-0.005, 0.76 - 0.04], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.835], [0, 0]],
                _run:function(){
                    //回放下移
                    if (MjClient.rePlayVideo != -1) {
                        setWgtLayout(this, [0.14, 0.14], [1-0.005, 0.835 - 0.04], [0, 0]);
                    }
                }
            },
            put: {
                _visible: false,
                //_layout : [[0.35, 0.35],[0.73, 0.75],[0, 0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.73, 0.75],[0, 0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            /*
            out_qshu_layout: {
                //起手胡
                _visible: false,
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.8, 0.76], [0, 0]);
                },
                _event: {
                    sendStartFlag: function(eD){
                        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                            return;
                        }
                        playQiShouHuAnim_fuLuShouErShiZhang(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                    }
                }
            },
            */
            _event: {
                clearCardUI: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    clearCardUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_fuLuShou(true);
                },
                initSceneData: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    InitUserHandUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    DealOffLineCard_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 2);
                    MjClient.playui.ResetMenCard(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                addPlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                removePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                mjhand: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    InitUserHandUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                HZNewCard: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_fuLuShou(this,eD,MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                roundEnd: function() {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                    MjClient.playui.ResetOtherCard(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                waitPut: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    RemovePutCardOut_fuLuShou();
                    DealWaitPut_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                MJPut: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealPutCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                FLSChiCard: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealChiCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                MJGang: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealGangCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                MJPeng: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealPengCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                //补"招" --------------mark
                /*
                HZWeiCard: function(eD){
                    DealWeiCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                */
                MJZhao: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealGangCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2, true);
                },
                MJHu: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealHu_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                onlinePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    setUserOffline_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                playerStatusChange: function(eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    setUserOffline_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                //补"飘" -----------mark
                /*
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                */
                MJTing: function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    HandleMJTing(this, eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                waitJiazhu:function (msg) {
                    cc.log("等待加注");
                    /*
                    postEvent("returnPlayerLayer");
                    var layer = new jiaZhuXuzhouLayer(function(){
                        //弹窗等待
                        MjClient.playui._jiazhuWait.visible = true;
                    });
                    MjClient.playui.addChild(layer,99);
                    */
                    /*
                    if (MjClient.webViewLayer != null)
                    {
                        MjClient.webViewLayer.close();
                    }
                    */
                },
                HZPickCard:function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    if(MjClient.rePlayVideo != -1){
                        var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                        if(eD.uid == pl.info.uid) {
                            MjClient.OtherHandArr[MjClient.MaxPlayerNum_fuLuShou - 2] = MjClient.majiang.sortCard(pl.mjhand)
                        }
                    }

                    RemovePutCardOut_fuLuShou(true);
                    MjClient.playui.ResetHandCard(this,MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                HZAddCards:function (eD) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    DealAddCard_fuLuShou(this,eD, MjClient.MaxPlayerNum_fuLuShou - 2);
                },
                HZCheckRaise:function (msg) {
                    if(MjClient.MaxPlayerNum_fuLuShou == 2) {
                        return
                    }
                    ShowPutCardIcon_fuLuShou();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 2);
                    if(!pl){
                        return;
                    }
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_fuLuShou(off));
                    }
                }
            }
        },
        left: {
            head: {
                img_piao: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            var tData = MjClient.data.sData.tData;
                            if (pl && pl.piaoFen != -1 && tData.tState == TableState.waitJiazhu) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + pl.piaoFen + ".png");
                            }
                        },
                        MJJiazhu: function(msg) {
                            if(!msg.uid || msg.piaoFen == undefined)
                                return;
                            var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            if (msg.uid == pl.info.uid && pl.piaoFen != -1) {
                                this.visible = true;
                                this.loadTexture("playing/fulushou/xian_piao" + msg.piaoFen + ".png");
                            }
                        },
                        mjhand: function(msg) {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                img_piaoFlag: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        initSceneData: function() {
                            setPiaoFlag_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        mjhand: function() {
                            setPiaoFlag_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        roundEnd: function() {
                            // this.visible = false;
                        },
                        waitJiazhu: function() {
                            this.visible = false;
                        },
                        clearCardUI: function(){
                            this.visible = false;
                        }
                    }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        initSceneData: function() {
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        mjhand: function(){
                            //if (IsArrowVisible_fuLuShou()) showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        }
                        /*,
                        roundEnd: function() {
                            showUserZhuangLogo_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                        }
                        */
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                showUserChat_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_fuLuShou(this, d, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 1);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                score_bg:{_visible:false},
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            // this.visible = true;
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            if(!IsArrowVisible_fuLuShou()){
                                huXi = 0;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            // this.visible = true;
                        },
                        FLSChiCard:function(){
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        MJGang:function(){
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            return this.setString("胡息:" + huXi);
                        },
                        //补'招' -------------------mark
                        MJZhao:function() {
                            var huXi = UpdateHuXi_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                            return this.setString("胡息:" + huXi);
                        },
                    }
                },
                jiaZhu: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                jiaZhuTip: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        }
                    }
                },
                name_bg:{_visible:false},
                timeImg:{
                    _visible:false,
                    _event:{
                        initSceneData: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        mjhand: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        onlinePlayer: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1) && IsArrowVisible_fuLuShou();
                        },
                        waitPut: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        HZNewCard: function(ed){
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        MJPeng: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        FLSChiCard: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        MJGang: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        //补"招"-----------------mark
                        MJZhao: function(eD) {
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        MJPut: function(eD){
                            //this.visible = curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        },
                        roundEnd: function(eD){
                            //this.visible = false;
                        }
                    },
                    time:{
                        _run: function() {
                            this.setString("00");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                    this.setString("00");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJGang: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            FLSChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            //补"招"-----------------------mark
                            MJZhao: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("00");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                                if(pl && pl.onLine && curPlayerIsMe_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1)){
                                    arrowbkNumberUpdate(this);
                                }
                            },
                            roundEnd: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                            }
                        }
                    }
                }
            },
            play_tips: {
                _layout: [[0.2, 0.2], [0.2, 0.7], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[-2.5, 2.5]],
                _run: function() {
                    GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                _event: {
                    mjhand: function(){
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    moveHead: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },
                    waitJiazhu: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    },initSceneData: function() {
                        GetReadyVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.15, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.73], [0, 0]],
                _run:function(){
                    //回放下移
                    if (MjClient.rePlayVideo != -1) {
                        var _x = isIPhoneX() ? 0.045 : 0.005;
                        var _y = 0.76;
                        if(MjClient.MaxPlayerNum_fuLuShou == 2){
                            _y -= 0.08;
                        }else{
                            _y -= 0.04;
                        }
                        setWgtLayout(this, [0.14, 0.14], [_x, _y], [0, 0]);
                        return;
                    }
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.76], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.84], [0, 0]],
                _run:function(){
                    //回放下移
                    if (MjClient.rePlayVideo != -1) {
                        var _x = isIPhoneX() ? 0.045 : 0.005;
                        var _y = 0.84;
                        if(MjClient.MaxPlayerNum_fuLuShou == 2){
                            _y -= 0.08;
                        }else{
                            _y -= 0.04;
                        }
                        setWgtLayout(this, [0.14, 0.14], [_x, _y], [0, 0]);
                        return;
                    }

                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.84], [0, 0]);
                    }
                }
            },

            put: {
                _visible: false,
                //_layout: [[0.35, 0.35],[0.27,0.75],[0,0]],
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35],[0.27,0.75],[0,0]);
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            /*
            out_qshu_layout: {
                //起手胡
                _visible: false,
                _run:function()
                {
                    setWgtLayout(this, [0.35, 0.35], [0.2, 0.76], [0, 0]);
                },
                _event: {
                    sendStartFlag: function(eD){
                        playQiShouHuAnim_fuLuShouErShiZhang(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                    }
                }
            },
            */
            _event: {
                clearCardUI: function() {
                    clearCardUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_fuLuShou(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    InitUserHandUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    DealOffLineCard_fuLuShou(this,MjClient.MaxPlayerNum_fuLuShou - 1);
                    MjClient.playui.ResetMenCard(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                HZNewCard: function(eD) {
                    console.log("客户端发牌组合...... ");
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_fuLuShou(this,eD,MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                    MjClient.playui.ResetOtherCard(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                waitPut: function(eD) {
                    RemovePutCardOut_fuLuShou();
                    DealWaitPut_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                MJPut: function(eD) {
                    DealPutCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                FLSChiCard: function(eD) {
                    DealChiCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                HZPaoCard: function(eD) {
                    DealPaoCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                MJGang: function(eD) {
                    DealGangCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                MJPeng: function(eD) {
                    DealPengCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                //补"招"----------------mark
                MJZhao: function(eD) {
                    DealGangCard_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1, true);
                },
                MJHu: function(eD) {
                    DealHu_fuLuShou(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_fuLuShou(this, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                //补"飘"---------------------mark
                MJTing: function (eD) {
                    HandleMJTing(this, eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                HZPickCard:function (eD) {
                    if(MjClient.rePlayVideo != -1) {
                        var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                        if(eD.uid == pl.info.uid){
                            MjClient.OtherHandArr[MjClient.MaxPlayerNum_fuLuShou - 1] = MjClient.majiang.sortCard(pl.mjhand)
                        }
                    }
                    RemovePutCardOut_fuLuShou(true);
                    MjClient.playui.ResetHandCard(this,MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                HZAddCards:function (eD) {
                    DealAddCard_fuLuShou(this,eD, MjClient.MaxPlayerNum_fuLuShou - 1);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_fuLuShou();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_fuLuShou(MjClient.MaxPlayerNum_fuLuShou - 1);
                    if(!pl){
                        return;
                    }
                    /* 这是什么鬼，不要了
                    if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    {
                        if (SelfUid() == pl.info.uid) {
                            var layer = new laZhangLayer();
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                        else
                        {
                            MjClient.playui._jiazhuWait.visible = true;
                        }
                    }else if(pl.jiazhuNum == 1){
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_fuLuShou(off));
                    }
                    */
                }
            }
        },
        eat: {
            chi: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[-900, 3.8]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2){
                        // 快速吃牌
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var putCard = tData.lastPutCard;
                        var pl = sData.players[SelfUid()];
                        setChiVisible_fuLuShou();
                        HZChiToServer_fuLuShou();
                        //加个判定标志，防止此时点击出牌导致出错
                        MjClient.isInOp = true;
                    }
                }
            },
            noTing : {
                _visible : false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2){
                        // hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[-6, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                        console.log(">>>> lf，点击碰按钮");
                        if (eT == 2){
                            HZPengToServer_fuLuShou();
                            setChiVisible_fuLuShou(); 
                            //加个判定标志，防止此时点击出牌导致出错
                            MjClient.isInOp = true;
                        }
                }
            },
            zhao: {
                _visible:false,
                _layout:[[0, 0.1], [0.5, 0], [-3, 2.5]],
                bg_img:{
                    _run:function() {
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    }
                },
                _touch:function(btn, eT) {
                    if (eT == 2) {
                        //HZZhaoToServer_fuLuShou();
                        checkZhaoGangList(false);
                        setChiVisible_fuLuShou();
                        //加个判定标志，防止此时点击出牌导致出错
                        //MjClient.isInOp = true;
                    }
                }
            },
            gang: {
                _visible:false,
                _layout:[[0, 0.1], [0.5, 0], [0, 2.5]],
                bg_img:{
                    _run:function() {
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    }
                },
                _touch:function(btn, eT) {
                    if (eT == 2) {
                        //HZGangToServer_fuLuShou();
                        checkZhaoGangList(true);
                        setChiVisible_fuLuShou();
                        //加个判定标志，防止此时点击出牌导致出错
                        //MjClient.isInOp = true;
                    }
                }
            },
            guo: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2){
                        //福禄寿进入自动摸打状态后，点击过直接出牌
                        var pl = MjClient.data.sData.players[SelfUid()];
                        if(pl && pl.isTing && pl.newSendCard) {
                            if (MjClient.rePlayVideo == -1 && (MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("确定过胡吗？", function() {
                                    autoPutCard();
                                    HZPassConfirmToServer_fuLuShou(); // todo 
                                    setChiVisible_fuLuShou();//add by maoyu
                                }, function() {}, "1");
                            } else {
                                autoPutCard();
                                HZPassConfirmToServer_fuLuShou(); // todo 
                                setChiVisible_fuLuShou();//add by maoyu
                            }
                        }
                        else {
                            if (MjClient.rePlayVideo == -1 && (MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("确定过胡吗？", function() {
                                    HZPassConfirmToServer_fuLuShou(); // todo 
                                    setChiVisible_fuLuShou();//add by maoyu
                                }, function() {}, "1");
                            } else {
                                HZPassConfirmToServer_fuLuShou(); // todo 
                                setChiVisible_fuLuShou();//add by maoyu
                            } 
                        }
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[1.3, 2.5]],
                bg_img:{
                    _run:function(){
                        var _Image_light_scale = this.getScale();
                        
                        var a = cc.scaleTo(0.5,_Image_light_scale*1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1,_Image_light_scale*1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function(){
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale*0.95);
                        }.bind(this));
            
                        this.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2).easing(cc.easeCubicActionOut()),a3,cc.delayTime(0.2)).repeatForever());
                    
                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        MJHuToServer_fuLuShou();
                        setChiVisible_fuLuShou();//add by maoyu
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        resetChiParam_fuLuShou();
                        MjClient.playui.EatVisibleCheck();
                    }
                }
            },
            
            chiBg: { //---------------------------------------mark，需要调整
                _visible: false,
                _layout: [[1, 0], [0.5, 404 / 720], [0, 0]],
                _run: function() {
                    var width = 0;
                    var cards_select = [];
                    var cards_option = [];
                    this.reset = function() {
                        width = 0;
                        cards_select = [];
                        cards_option = [];
                    }

                    this.calculateOptionCards = function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = sData.players[SelfUid()];
                        var putCard = tData.lastPutCard;
                        // console.log("cards_select.length@@" + cards_select.length);
                        switch (cards_select.length) {
                            case 0:
                                cards_option = MjClient.majiang.getChiCards(pl.mjhand, putCard);
                                break;
                            case 1:
                            case 2:
                            case 3:
                                var hand = pl.mjhand.concat();
                                hand.push(putCard);
                                for (var i = 0; i < cards_select.length; i++) {
                                    var row = cards_select[i];
                                    for (var j = 0; j < row.length; j++) {
                                        hand.splice(hand.indexOf(row[j]), 1);
                                    }
                                }

                                if (hand.indexOf(putCard) < 0) {
                                    cards_option = [];
                                } else {
                                    cards_option = MjClient.majiang.getBiCards(hand, putCard);
                                }
                                break;
                        }

                        for (var i = 0; i < cards_option.length; i++) {
                            var row = cards_option[i];
                            row.splice(row.indexOf(putCard), 1);
                            row.sort(function(a, b) {
                                if (a % 20 == b % 20) {
                                    return b - a;
                                }

                                return a - b;
                            });
                            row.push(putCard);
                        }
                    }

                    this.adaptChiLayout = function() {
                        this.calculateOptionCards();
                        if (cards_option.length == 0) { // 吃牌选好了
                            var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                            HZChiToServer_fuLuShou(cards_select[0], biCards);
                            this.visible = false;
                            return;
                        } 

                        this.visible = true;
                        var chiLayout = this.getChildByName("chiLayout");
                        chiLayout.removeAllChildren();
                        width = (cards_select.length + 1) * 205 + cards_option.length * 75;
                        if (cards_option.length >= 2) {
                            width += 15 * (cards_option.length - 1);
                        }

                        var pos_x = 1280 / 2 - width / 2;
                        if (pos_x < 210) {
                            pos_x = 1280 - 210 - width;
                        }

                        // 添加已选择的吃牌
                        for (var i = 0; i < cards_select.length; i++) {
                            var chiTipImg = this.getChildByName("chiTipImg").clone();
                            var src = i == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                            chiTipImg.loadTexture(src);
                            chiTipImg.visible = true;
                            chiTipImg.x = pos_x + 130 / 2;
                            chiLayout.addChild(chiTipImg);
                            pos_x += 130;

                            var row = cards_select[i];
                            var highlightImg = this.getChildByName("highlightImg").clone();
                            highlightImg.visible = true;
                            highlightImg.x = pos_x + 75 / 2;
                            highlightImg.y = 142;
                            chiLayout.addChild(highlightImg);
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_fuLuShou + "out_" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 70 * j + 72;
                                if (j == 2) {
                                    chiCardImg.setColor(cc.color(170, 170, 170));
                                }
                                chiLayout.addChild(chiCardImg);
                                (function(tag) {
                                    chiCardImg.setTouchEnabled(true);
                                    chiCardImg.addTouchEventListener(function(sender, type) {
                                        if (type == 2) {
                                            // cc.log("回到第 " + (tag + 1) + "步");
                                            cards_select = cards_select.slice(0, tag);
                                            this.adaptChiLayout();
                                        }
                                    }.bind(this));
                                }.bind(this)(i));
                            }
                                
                            pos_x += 75;
                        }

                        // 添加当前可选吃牌
                        var chiTipImg = this.getChildByName("chiTipImg").clone();
                        var src = cards_select.length == 0 ? "playing/paohuzi/chiTip.png" : "playing/paohuzi/biTip.png";
                        chiTipImg.loadTexture(src);
                        chiTipImg.visible = true;
                        chiTipImg.x = pos_x + 130 / 2;
                        chiLayout.addChild(chiTipImg);
                        pos_x += 130;
                        for (var i = 0; i < cards_option.length; i++) {
                            var row = cards_option[i];
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_fuLuShou + "out_" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 70 * j + 72;
                                if (j == 2) {
                                    chiCardImg.setColor(cc.color(170, 170, 170));
                                }
                                chiLayout.addChild(chiCardImg);
                                (function(tag) {
                                    chiCardImg.setTouchEnabled(true);
                                    chiCardImg.addTouchEventListener(function(sender, type) {
                                        if (type == 2) {
                                            // console.log("选择吃@@ ");
                                            cards_select.push(cards_option[tag]);
                                            this.adaptChiLayout();
                                        }
                                    }.bind(this));
                                }.bind(this)(i));
                            }

                            pos_x += 90;
                        }
                    }
                },
                _event: {
                    showChiLayout: function() {
                        this.reset();
                        this.adaptChiLayout();
                    }
                },
                chiTipImg: {
                    _visible: false
                },
                highlightImg: {
                    _visible: false
                },
                chiCardImg: {
                    _visible: false,
                    _run: function() {
                        this.scale = 70 / this.getContentSize().width;
                    }
                },
                cancleBtn: {
                    _run: function() {
                        this.x = 1136;
                    },
                    _click: function(sender, et) {
                        sender.parent.visible = false;
                        MjClient.playui.EatVisibleCheck();
                    }
                }

            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPass: function(eD) {
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if(pl && pl.passHu){
                        MjClient.showToast("你选择了过，暂时放弃胡牌");
                    }
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function(eD) {
                    console.log("HHH :，waitPut------");
                    //MjClient.playui.EatVisibleCheck();
                },
                HZNewCard: function(eD) {
                    console.log("HHH :HZNewCard------");
                    setQiHuState_fuLuShou();
                    //放在每个方向节点上去做，因为摸到王霸牌的时候，有个显示动作，动作显示完之后
                    //在显示各种操作按钮
                    if(eD.isCommon && eD.newCard){
                        //MjClient.playui.EatVisibleCheck();
                    }
                },
                MJGang: function(eD) {
                    console.log("HHH :HZGangCard------");
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                },
                FLSChiCard: function(eD) {
                    console.log("HHH :FLSChiCard------");
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                },
                //补"招"-------------------mark
                MJZhao: function(eD) {
                    setQiHuState_fuLuShou();
                    MjClient.playui.EatVisibleCheck();
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe()
                    {
                        cc.log("MjClient.playui == >");
                        cc.log(MjClient.playui);
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(delayExe)));
                },
            }
        },
        finger:{
            _visible: false,
            _run: function () {
                setWgtLayout(this,[0.18, 0.18], [0.68, 0.3], [0.7, -0.1]);
            },
            _event:{
                MJHu:function(){
                    this.visible = false;
                }
            }
        },
        li_btn: {
            _layout: [[0.07, 0.07],[0.04, 0.18],[0, 0]],
            _run: function(){
                _visible: false;
                this.zIndex = 99;
            },
            /*
            _click: function() {
                var sData = MjClient.data.sData;
                var tData = sData.tData;  
                if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                    return;
                }
                var pl = sData.players[MjClient.data.pinfo.uid];
                MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand);
                MjClient.playui.ResetHandCard(MjClient.playui._downNode,0); 
            },
            _event: {
                mjhand:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    }
                    this.setVisible(true)
                },
                initSceneData: function(eD) {

                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    }
                    this.setVisible(true);
                },
            } 
             */
        },
        chat_btn: {
            _run: function() {
                //setWgtLayout(this, [5, 5], [0.97, 0.5], [0, -0.2], true, true);
            },
            _layout: [[55/1280, 0],[0.97, 0.5-0.007],[0, -0.2]],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout:  [[43/1280, 0],[0.91, 0.5],[0, -0.2]],
            _run: function() {
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if(MjClient.isShenhe) this.visible=false;
            },
            _touch: function(btn, eT) {
                // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                if (eT == 0) {
                    startRecord();
                } else if (eT == 2) {
                    endRecord();
                } else if (eT == 3) {
                    cancelRecord();
                }
            },
            _event: {
                cancelRecord: function() {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function(filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function(fullFilePath) {
                    if (!fullFilePath) {
                        console.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    console.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime//录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function(msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    // downAndPlayVoice_fuLuShou(msg.uid, msg.msg);
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },
        cutLine:{
            _visible: false,
            _run: function () {
                setWgtLayout(this,[1, 0.3], [0.5, 0.6], [0, -2]);
                ziPai.setWgtLayoutCutLine(this);
            },
            _event: {
                mjhand: function(eD){
                    ShowPutCardIcon_fuLuShou();
                },
                HZNewCard: function(eD){
                    //ShowPutCardIcon_fuLuShou();
                },                
                MJPut:function(eD) {
                    ShowPutCardIcon_fuLuShou();
                },
                MJPass:function(eD) {
                    cc.log("虚线接收过胡消息");
                    ShowPutCardIcon_fuLuShou();
                },
                MJHu:function(eD){
                    this.visible = false;
                },
                EZP_xuXian : function(){
                    ziPai.setWgtLayoutCutLine(this);
                },
                roundEnd : function(){
                    ShowPutCardIcon_fuLuShou();
                },
                waitPut : function() {
                    ShowPutCardIcon_fuLuShou();
                }
            },
        },
        img_xiaoHuBg: {
            //起手胡
            _visible: false,
            _run:function()
            {
                setWgtLayout(this, [0.35, .35], [0.5, 0.46], [0, 0]);
            },
            _event: {
                roundEnd: function(eD) {
                    this.visible = false;
                },
                sendStartFlag: function(eD){
                    cc.log("接到事件...");
                    var that = this;
                    //从庄家开始轮播起手胡动画
                    var tData = MjClient.data.sData.tData;
                    var off = getUiOffByUid_fuLuShou(tData.uids[tData.zhuang]);
                    var cur = off;
                    var cb = function() {
                        if(++cur > (MjClient.MaxPlayerNum_fuLuShou - 1))
                            cur = 0;
                        if (cur == off) {
                            this.visible = false;
                            return;
                        }
                        playQiShouHuAnim_fuLuShouErShiZhang(that, eD, cur, cb);
                    };
                    playQiShouHuAnim_fuLuShouErShiZhang(that, eD, cur, cb);
                }        
            }
        },
        pnl_trust:{
            _visible: false,
            _run: function() {
                setWgtLayout(this,[1, 1], [0, 0], [0, 0]);
                this.setLocalZOrder(99);
                this.setVisible(false);
            },
            _event: {
                mjhand: function(eD) {
                    this.setVisible(false);
                },
                initSceneData: function(eD) {
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (pl && pl.isTuoGuan) {
                        this.setVisible(true);
                    }else {
                        this.setVisible(false);
                    }
                },
                waitJiazhu: function(eD) {
                    this.setVisible(false);
                },
                FLSdoTrust: function(eD) {
                    cc.log('托管事件', JSON.stringify(eD));
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (pl && pl.isTuoGuan) {
                        this.setVisible(true);
                    }
                    else {
                        this.setVisible(false);
                    }

                    //重新刷手牌(因为要考虑是否要置灰，FLS处于杠后自动摸打的状态就要置灰)
                    if(MjClient.rePlayVideo == -1){
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
                    }
                },
                roundEnd: function() {
                    this.setVisible(false);
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (pl) {
                        pl.isTuoGuan = false;   //小局结算默认非托管
                    }
                },
            },
            btn_cancel:{
                _visible: true,
                _click:function() {
                    HZTrustToServer_fuLuShou();
                },
            }
        },
        pnl_zhaoGang:{
            _visible: false,
            _run: function() {
                setWgtLayout(this,[1, 1], [0, 0.01], [0, 0]);
                this.setLocalZOrder(100);
                this.setVisible(false);
                this.addTouchEventListener(function(sender, event) {
                    if(event == ccui.Widget.TOUCH_BEGAN) {
                        var pos = sender.convertToNodeSpace(sender.getTouchBeganPosition());
                        var imgKuang = this.getChildByName("img_kuang");
                        var w = imgKuang.getContentSize().width;
                        var x = imgKuang.getPositionX() - w/2;
                        var h = imgKuang.getContentSize().height;
                        var y = imgKuang.getPositionY() - h/2;
                        if(!cc.rectContainsPoint(cc.rect(x, y, w, h), pos)) {
                            this.setVisible(false);
                            MjClient.playui.EatVisibleCheck();
                        }
                    }
                    return false;
                });
            },
            _event: {
                MJZhao:function(eD) {
                    this.setVisible(false);
                },
                MJGang:function(eD) {
                    this.setVisible(false);
                }
            },
        },
    },
    _downNode:null,
    _rightNode:null,
    _topNode:null,
    ctor: function() {
        this._super();
        ziPai.initZiPaiData(); 
        var playui = ccs.load("Play_FuLuShou.json");
        playMusic("bgHongZi");
        var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_fuLuShou = tData.maxPlayer;
        cc.log(MjClient.MaxPlayerNum_fuLuShou);

        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode  = playui.node.getChildByName("left");
        this._xingNode = playui.node.getChildByName("xing");
        this._finger = playui.node.getChildByName("finger");
        //新版换了手指图片
        if (cc.sys.isObjectValid(this._finger)) {
            this._finger.loadTexture("playing/fingerEffer/finger.png");
        }
        MjClient.HandCardArr = [];
        MjClient.OtherHandArr = {};
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        MjClient.playui._jiazhuWait.visible = false;
        BindUiAndLogic(playui.node, this.jsBind);

        this.addChild(playui.node);

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        //this.newTingLayer = new flsNewTingLayer(); 
        //playui.node.addChild(this.newTingLayer);

        this.tingLayer = new flsPhzTingLayer(); 
        playui.node.addChild(this.tingLayer);

        this.tingLayer.setLocalZOrder(14);
        //this.newTingLayer.setLocalZOrder(10);
        this._downNode.setLocalZOrder(11);
        this._xingNode.setLocalZOrder(12);
        this._finger.setLocalZOrder(13);
        MjClient.playui._AniNode.setLocalZOrder(20);
        this.playuiNode = playui.node;

        //自由人数
        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(5);

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn(true, [[0.036, 0], [0.84, 0.95], [0, 0]], [[0.036, 0], [0.84, 0.95], [0, 0]]);
        ziPai.changePlayUILayout(playui.node);
        /*
        if(MjClient.data.sData.tData.maxPlayer < 4){
            ziPai.changePlayUILayout(playui.node);
        }
        */
        if(MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ || MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
        return true;
    },

    resetJiaZhuTip: function()
    {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.jushou)
            return;
        var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        if(MjClient.MaxPlayerNum_fuLuShou == 2) {
            nodes = [this._downNode, this._topNode, this._rightNode, this._leftNode];
        }
        for (var i = 0; i < MjClient.MaxPlayerNum_fuLuShou; i ++)
        {
            var pl = getUIPlayer_fuLuShou(i);
            if (!pl) 
                continue;

            cc.log("resetJiaZhuTip jiazhuNum = " + pl.jiazhuNum);
            if (pl.jiazhuNum != 1 && pl.jiazhuNum != 0)
                continue;

            var node = nodes[i];
            var tipNode = node.getChildByName("head").getChildByName("jiaZhuTip");
            var playTipNode = node.getChildByName("play_tips");
            var point = playTipNode.convertToWorldSpace(playTipNode.getChildByName("hu").getPosition());
            tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
            tipNode.visible = true;
            tipNode.opacity = 255;
            tipNode.ignoreContentAdaptWithSize(true);
            tipNode.setString(pl.jiazhuNum == 1 ? "举手做声" : "");
            tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        }
    },

    refreshHeadLight:function(visible)
    {
    },

    adjustPiaoBtn:function(ref) 
    {
        var tData = MjClient.data.sData.tData;
        //判断子节点显示
        var flag = tData.areaSelectMode.piaoFlag

        if (MjClient.gameType == MjClient.GAME_TYPE.FU_LU_SHOU_ER_SHI_ZHANG) {
            ref.getChildByName("btn_piao0").setVisible((flag & 1) > 0);
            ref.getChildByName("btn_piao1").setVisible((flag & 2) > 0);
            ref.getChildByName("btn_piao2").setVisible((flag & 4) > 0);
            ref.getChildByName("btn_piao3").setVisible((flag & 8) > 0);
            ref.getChildByName("btn_piao4").setVisible((flag & 16) > 0);
        }
        else {
            ref.getChildByName("btn_piao0").setVisible(false);
            ref.getChildByName("btn_piao1").setVisible((flag & 1) > 0);
            ref.getChildByName("btn_piao2").setVisible((flag & 2) > 0);
            ref.getChildByName("btn_piao3").setVisible((flag & 4) > 0);
            ref.getChildByName("btn_piao4").setVisible((flag & 8) > 0);
        }

        //动态调整坐标
        var showBtn = [];
        var pos = MjClient.playui.piaoBtnPos;
        if (!pos || pos.length == 0) {
            pos = [];
        }
        var child = ref.getChildren();
        for (var i = 0; i < child.length; i++) {
            if (child[i].isVisible()) {
                showBtn.push(child[i]);
            }
            var x = child[i].getPositionX();
            var y = child[i].getPositionY();
            if (!MjClient.playui.piaoBtnPos || MjClient.playui.piaoBtnPos.length == 0) {
                pos.push({x:x, y:y});
            }
        }
        MjClient.playui.piaoBtnPos = pos;
        cc.log("动态调整坐标", showBtn.length);
        var mX = (pos[0].x + pos[4].x)/2;
        var mY = (pos[1].y + pos[0].y)/2;
        if (showBtn.length == 1) {
            showBtn[0].setPosition(cc.p(mX, mY));
        } else if (showBtn.length == 2) {
            showBtn[0].setPosition(cc.p(pos[4].x, mY));
            showBtn[1].setPosition(cc.p(pos[0].x, mY));
        } else if (showBtn.length == 3) {
            showBtn[0].setPosition(cc.p(pos[1].x, mY));
            showBtn[1].setPosition(cc.p(pos[2].x, mY));
            showBtn[2].setPosition(cc.p(pos[3].x, mY));
        } else if (showBtn.length == 4) {
            showBtn[0].setPosition(cc.p(pos[4].x, pos[1].y));
            showBtn[1].setPosition(cc.p(pos[0].x, pos[1].y));
            showBtn[2].setPosition(cc.p(pos[4].x, pos[0].y));
            showBtn[3].setPosition(cc.p(pos[0].x, pos[0].y));
        }
    },

    /*
        判断当前是否可以出牌，add by sking
     */
    isCanPutCard:function(){
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for(var i = 0; i < children.length; i++){
            if(children[i].name == "mjhand"){
                if(children[i].y > standUI.y + 10){
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },

    showZhaoGangListLayer:function(isGang, list) {
        if(!list || list.length <= 0) {
            return;
        }
        var pnl = MjClient.playui.jsBind.pnl_zhaoGang._node;
        var imgKuang = pnl.getChildByName("img_kuang");
        if(!cc.sys.isObjectValid(imgKuang)) {
            return;
        }
        pnl.setVisible(true);
        var children = imgKuang.getChildren();
        for (var k in children) {
            if(children[k].getName() != "img_op") {
                children[k].removeFromParent();
            }
        }
        var flagPath = "playing/fulushou/gameResult/";
        var icon = isGang ? "gang.png" : "zhao.png";
        imgKuang.getChildByName("img_op").loadTexture(flagPath + icon);
        imgKuang.getChildByName("img_op").setScale(1.8);
        //宽度
        var gap = 5;
        var h = imgKuang.getContentSize().height;
        var w = 100;  //一张牌固定100宽 //imgKuang.getContentSize().width;
        var width = 100 + (w + gap * 2) * list.length; //标识宽100, 每张牌占 牌宽+间隙*2
        imgKuang.setContentSize(cc.size(width, h));
        //重新调整位置使居中
        setWgtLayout(imgKuang, [0.2, 0.2], [0.5, 0.52], [0, 0], true, true);
        //放入牌
        for(var i = 0; i < list.length; i++) {
            var card = ccui.ImageView.create("playing/fulushou/card/hand_" + list[i] +".png");
            card.setTouchEnabled(true);
            card.setName("img_card" + i);
            card.setTag(list[i]);
            card.setScale(0.9);
            var w = card.getContentSize().width;
            var x = 100 + i*(gap+w) + w/2;
            card.setPosition(x, h/2);
            imgKuang.addChild(card);
            card.addClickEventListener(function(sender) {
                if(isGang) {
                    HZGangToServer_fuLuShou(sender.getTag());
                }else {
                    HZZhaoToServer_fuLuShou(sender.getTag());
                }
                MjClient.playui.jsBind.pnl_zhaoGang._node.setVisible(false);
            });
        }
    }
});

//重置手牌的顺序
PlayLayer_fuLuShou.prototype.ResetHandCard = function(posNode,off, needAction, isDelay){
    needAction = needAction === undefined ? false : needAction;
    // needAction = false;
    var changeCardSize = 1;//ziPai.getCardSize() == 0 ? 1 : 0.8;// 手牌大小修改
    if(MjClient.rePlayVideo == -1){
        if(off == 0) {
            /*
            if(!needAction && !isDelay && MjClient.addGroupIndex != 0){
                refreshNode_fuLuShou(posNode,off,needAction);
                this.scheduleOnce(function(){
                    this.ResetHandCard(posNode,off,needAction,true);
                }.bind(this), 0.35);
                return;
            }
            */

            var handNode = posNode.getChildByName("handNode");
            handNode.visible = true;
            handNode.removeAllChildren();
            var cardArr = MjClient.HandCardArr;
            //cc.log("wxd.............MjClient.HandCardArr..............." + JSON.stringify(MjClient.HandCardArr));
            //清理空数组
            for (var k = cardArr.length - 1; k >= 0; k--) {
                if (cardArr[k].length == 0) {
                    cardArr.splice(k, 1);
                }
            }

            for (var k = 0; k < cardArr.length; k++) {
                var groupList = cardArr[k];
                for (var j = 0; j < groupList.length; j++) {
                    addHandCard_fuLuShou(k, j, groupList[j], off);  //判断是否堆叠牌
                }
            }

            calculateHintPutList_fuLuShou();
            addTingSign_fuLuShou(posNode); // 添加听牌角标

            var handCard = posNode.getChildByName("handCard");
            var type = ziPai.getZiPaiType();
            var sizeArr = [98,84,100];
            var width =sizeArr[type] * changeCardSize;; // handCard.getVirtualRendererSize().width; 
             
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = width * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = handNode.getChildByTag(i);
                // addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * width * scale_x,0)); 

                if (needAction) {
                    addNode.x = winSize.width * 0.5;
                    addNode.y = 100;
                    this._doMovetoAction(addNode, cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                } else {
                    addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                }
            }

            postEvent("LY_addHandHuXi");
        }
    }else{
        //回放
        var handNode = null;
        var cardArr = null;
        var handCard = null;
        if(off == 0){
            if(MjClient.MaxPlayerNum_fuLuShou == 3 || MjClient.MaxPlayerNum_fuLuShou == 2){
                handNode = posNode.getChildByName("handNode");
                handCard = posNode.getChildByName("handCard");
            }else if(MjClient.MaxPlayerNum_fuLuShou == 4){
                handNode = posNode.getChildByName("replayNode");
                handCard = posNode.getChildByName("out0");
            }
            cardArr = MjClient.HandCardArr;
        }else {
            handNode = posNode.getChildByName("replayNode");
            handCard = posNode.getChildByName("out0");
            cardArr = MjClient.OtherHandArr[off];
        }
        handNode.visible = true;
        handNode.removeAllChildren();

        //清理空数组
        if(!cardArr){
            return;
        }
        for(var k = cardArr.length - 1;k >=0;k--){
            if(cardArr[k].length == 0){
                cardArr.splice(k,1);
            }
        }
        for(var k = 0;k < cardArr.length;k++){
            var groupList = cardArr[k];
            for(var j = 0;j < groupList.length;j++){
                if(off == 0){
                    if(MjClient.MaxPlayerNum_fuLuShou == 3 || MjClient.MaxPlayerNum_fuLuShou == 2){
                        addHandCard_fuLuShou(k,j,groupList[j],off);
                    }else if(MjClient.MaxPlayerNum_fuLuShou == 4){
                        addHandCardReplay_fuLuShou(k,j,groupList[j],off);
                    }
                }else {
                    addHandCardReplay_fuLuShou(k,j,groupList[j],off);
                }
            }
        }

        if(off == 0 && (MjClient.MaxPlayerNum_fuLuShou == 3 || MjClient.MaxPlayerNum_fuLuShou == 2)) {
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = handCard.width * cardArr.length * scale_x;
            for(var i = 0;i < cardArr.length;i++){
                var addNode = handNode.getChildByTag(i);
                addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * handCard.width * scale_x,0));
            }
        }
        //cc.log("================off:" + off +"----------"+JSON.stringify(cardArr));
    }
};

PlayLayer_fuLuShou.prototype._doMovetoAction = function(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.3,endP);
    node.runAction(ac);
};

PlayLayer_fuLuShou.prototype.ResetMenCard = function(posNode, off) {
    // 添加吃、碰、跑、招、杠
    var sData = MjClient.data.sData;
    var tData = null;
    if (sData) {
        tData = sData.tData;
    }

    var eatNode = posNode.getChildByName("eatNode");
    eatNode.visible = true;
    //eatNode.removeAllChildren();
    var pl = getUIPlayer_fuLuShou(off);
    if (!pl) return;

  

    if(tData.tState == TableState.roundFinish || tData.tState == TableState.waitJiazhu ||
        tData.tState == TableState.isReady || tData.tState == TableState.waitReady){ 
        return;
    }

    var order = pl.chiPengZhaoGangPos;
    if(!order || order.length <= 0) {
        return;
    }

    var sortType = 1;
    if(posNode.getName() == "down" || posNode.getName() == "xing") {
        sortType = 2;
    }
    var chiIdx = 0;
    for(var k=0; k<order.length; k++) {
        var list = order[k];
        for(var key in list) {
            var menData = [];
            var pai = pl[key][list[key]];
            if(key == "mjchi") {
                menData = pai;
                if(pl.chiCard) {
                    var chiCard = pl.chiCard[chiIdx];
                    chiIdx++;
                    SortChiCard_fuLuShou(menData, chiCard, sortType);
                }
            }
            else if(key == "mjpeng") {
                menData.push(pai, pai, pai);
            }
            else if(key == "mjzhao0" || key == "mjzhao1" ||
                key == "mjgang0" || key == "mjgang1") {
                menData.push(pai, pai, pai, pai);
            }
            if(!menData || menData.length == 0) {
                break;
            }
            for (var i = 0; i < menData.length; i++) {
                var isTurn = false;
                if(off==0) {
                    isTurn = ((key == "mjgang1" || key == "mjzhao1") && i!=menData.length-1);
                }
                else
                {
                    isTurn = (key == "mjgang1" || key == "mjzhao1");
                }
                if(key == "mjzhao0" || key == "mjzhao1" ||
                key == "mjgang0" || key == "mjgang1") {
                    addEatCard_fuLuShou(posNode, key + k, menData[i], off, isTurn);
                }
                else {
                    addEatCard_fuLuShou(posNode, key + k, menData[i], off);
                }
            }
        }
    }
};

PlayLayer_fuLuShou.prototype.ResetOtherCard = function(posNode, off) {
    var eatNode = posNode.getChildByName("eatNode");
    eatNode.visible = true;
    return;
};

PlayLayer_fuLuShou.prototype.ResetPutCard = function(posNode,off){
    //添加打出的牌
    var pl = getUIPlayer_fuLuShou(off);
    if (!pl) return;
    var outNode = posNode.getChildByName("outNode");
    outNode.visible = true;
    outNode.removeAllChildren();
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var curUId = tData.uids[tData.curPlayer];
    var maxPlayer = tData.maxPlayer;

    /*
    这里有个特殊逻辑，假如在等待吃碰杠的时候断线重连，需要对上一个打出牌的人的最后一张mjput牌不做展示
    需要等到吃碰杠过操作之后展示，否则会造成多了一张牌的假象
    */
    var copy = pl.mjput.slice();
    var selfIndex = (tData.uids.indexOf(SelfUid()) + off) % MjClient.MaxPlayerNum_fuLuShou;
    if(tData.tState == TableState.waitEat && tData.lastPutCard 
        && tData.lastPutCard != -1 
        && typeof(tData.lastPutPlayer) != "undefined" && tData.lastPutPlayer != -1) {
        if(tData.uids[selfIndex] == tData.uids[tData.lastPutPlayer] && pl.mjput.length > 0 && pl.mjput[pl.mjput.length-1] == tData.lastPutCard) {
            pl.mjput.length = pl.mjput.length - 1;
        }
    }

    var type = ziPai.getUiLayoutType();
    if (MjClient.data.sData.tData.maxPlayer == 2) {
        var index = 0;
        var tx = 0;
        var ty = 0;
        for (var i = 0; i < pl.mjput.length; i++) {
            if (curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]) {
                continue;
            }
            //2人玩法17张，换行，第二行起空6张之后开始显示。
            if (off == 1){
                if (i > 17){
                    index = (i - 18) % 12 + 6 + 1;
                    ty = (1 + Math.floor((i - 18) / 12)) * outCard.height;
                }else{
                    index = i + 1;
                }
            }else{
                if (i > 17){
                    index = i % 18 + 1;
                    ty = Math.floor(i / 18) * outCard.height;
                }else{
                    index = i + 1;
                }
            }
            var outCard = getNewCard_fuLuShou(pl.mjput[i], 2, off);
            if (off == 0) {
                outCard.anchorX = 1;
                outCard.anchorY = 0;
                outCard.x = outNode.width - index * outCard.width;
                outCard.y = ty;
            } else if (off == 1) {
                outCard.anchorX = 1;
                outCard.anchorY = 1;
                outCard.x = index * outCard.width;
                outCard.y = outNode.height + ty;

                // outCard.x = outNode.width - index * outCard.width;
                // outCard.y = outNode.height + ty;
            }
            outNode.addChild(outCard);
        }
    }
    else if (MjClient.data.sData.tData.maxPlayer == 3) {
        var index = 0;
        var tx = 0;
        var ty = 0;
        for (var i = 0; i < pl.mjput.length; i++) {
            if (curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]) {
                continue;
            }
            var childCount = outNode.childrenCount;

            // if (index >= 10) {
            //     index = 0;
            //     ty = outCard.height * Math.floor(childCount / 10);
            // }

            var outCard = getNewCard_fuLuShou(pl.mjput[i], 2, off);
            if (off == 0) {
                outCard.anchorX = 1;
                outCard.anchorY = 0;
                outCard.x = outNode.width - index * outCard.width;
                outCard.y = ty;
            } else if (off == 1) {
                outCard.anchorX = 1;
                outCard.anchorY = 1;
                outCard.x = outNode.width - index * outCard.width;
                outCard.y = outNode.height + ty;
            } else if (off == 2) {
                outCard.anchorX = 0;
                outCard.anchorY = 1;
                outCard.x = index * outCard.width;
                outCard.y = outNode.height + ty;
            }
            outNode.addChild(outCard);
            index += 1;
        }
    }
    else {// 4人
        for (var i = 0; i < pl.mjput.length; i++) {
            if (curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]) {
                continue;
            }

            var outCard = getNewCard_fuLuShou(pl.mjput[i], 2, off);
            var childCount = outNode.childrenCount;
            if (off == 0) {
                outCard.anchorX = 1;
                outCard.anchorY = 0;
                outCard.x = outNode.width - childCount * outCard.width;
                outCard.y = 0;
                //outCard.x = outNode.width - (childCount % 8) * outCard.width;
                //outCard.y = outCard.height * Math.floor(childCount / 8);
            } else if (off == 1) {
                outCard.anchorX = 1;
                outCard.anchorY = 0;
                outCard.x = outNode.width - childCount * outCard.width;
                outCard.y = 0;
                //outCard.x = outNode.width - (childCount % 8) * outCard.width;
                //outCard.y = outCard.height * Math.floor(childCount / 8);
            } else if (off == 2) {
                outCard.anchorX = 1;
                outCard.anchorY = 1;
                outCard.x = outNode.width - childCount * outCard.width;
                outCard.y = outNode.height;
                //outCard.x = outNode.width - (childCount % 8) * outCard.width;
                //outCard.y = outNode.height + outCard.height * Math.floor(childCount / 8);
            } else if (off == 3) {
                outCard.anchorX = 0;
                outCard.anchorY = 1;
                outCard.x = childCount * outCard.width;
                outCard.y = outNode.height;
                //outCard.x = (childCount % 8) * outCard.width;
                //outCard.y = outNode.height + outCard.height * Math.floor(childCount / 8);
            }
            outNode.addChild(outCard);
        }
    }

    pl.mjput = copy;
};

//重置牌的顺序
PlayLayer_fuLuShou.prototype.CardLayoutRestore = function(posNode,off,isReconnect){
    if(MjClient.rePlayVideo == -1){
        this.ResetHandCard(posNode,off);
    }else{
        //回放时不执行发牌动画
        this.ResetHandCard(posNode,off);
    }
    //this.ResetOtherCard(posNode,off);
    //this.ResetMenCard(posNode, off);
    this.ResetPutCard(posNode,off);
};

// 判断吃、碰、跑、偎、提、胡的状态
PlayLayer_fuLuShou.prototype.EatVisibleCheck = function(off){
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    // MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    eat.chi._node.visible = false;
    eat.peng._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.zhao._node.visible = false;
    eat.gang._node.visible = false;
    eat.cancel._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.zhao._node.setTouchEnabled(false);
    eat.gang._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
    
    var pl = sData.players[SelfUid() + ""];
    if (!pl) return;
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    var mj = MjClient.majiang;
    //吃碰杠招胡node
    var vnode = [];
    cc.log(pl.eatFlag, "状态值");
    //自摸getUIPlayer_fuLuShou
    //福禄寿显示顺序: 过、吃、碰、招、杠、胡
    if(tData.tState != TableState.roundFinish && pl.mjState != TableState.roundFinish){
        if(IsTurnToMe()){

            //过
            if(pl.eatFlag > 0) {
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            } 

            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            }

            // 碰
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            //招
            if (pl.eatFlag & 4) {
                vnode.push(eat.zhao._node);
            }
             
            //杠
            if (pl.eatFlag & 8) {
                vnode.push(eat.gang._node);
            }

            //胡
            if(pl.eatFlag & 32) {
                vnode.push(eat.hu._node); 
            }

            /*
            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
            */
        }
        if(!IsTurnToMe()){
            //过
            if(pl.eatFlag > 0) {
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            } 
            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            } 
            //碰
            if(pl.eatFlag & 2){
                vnode.push(eat.peng._node);
            }
            //招
            if (pl.eatFlag & 4) {
                vnode.push(eat.zhao._node);
            }
            //杠
            if (pl.eatFlag & 8) {
                vnode.push(eat.gang._node);
            }
            //胡
            if(pl.eatFlag & 32){
                vnode.push(eat.hu._node);  
            }

            /*
            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
            */
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0){
        for(var i = 0; i < vnode.length; i++){
            vnode[i].visible = true;
            vnode[i].setTouchEnabled(true);
            vnode[i].setBright(true);
            
            if(vnode[i].getChildByName("bgimg")){
                vnode[i].getChildByName("bgimg").visible = true;
            }

            setWgtLayout(vnode[i], [0, 0.20], [0.5, 0.18], [(i - (vnode.length - 1) / 2) * 1.3 + (vnode.length-i-1)*0.3, 1.8], false, false);
        }
    }
};

//只用来进牌后快速刷新自己手牌
PlayLayer_fuLuShou.prototype.updateHandCardUI = function(node, msg, off) {
    if(!cc.sys.isObjectValid(node) || !msg || !msg.newCard || off != 0) {
        return;
    }
    var newCard = msg.newCard;
    var handNode = posNode.getChildByName("handNode");
    handNode.visible = true;

    var cardPnls = handNode.getChildren();  //每列牌的牌托节点
    //查找对应列
    var row = -1;
    for(var i=0; i<cardPnls.length; i++) {
        var cardNodes = cardPnls[i]  //当前牌托中的所有牌节点
        for(var j=0; j<cardNodes.length; j++) {
            var card = cardNodes[j];
            if(Math.floor(msg.newCard/10)==Math.floor(card.tag/10)) {
                row = i;
                break; //该牌有列
            }
        }
        if(row != -1) {
            break;
        }
    }
    if(row != -1) {
        //找到了对应列，则计算新牌应放的位置，同列不相等的旧牌需要上下挪动坐标
        var cardNodes = cardPnls[row];

    } else {
        //放入新的一列
    }
}
PlayLayer_fuLuShou.prototype.showAndHideHeadEffect = function(){
    var arr = [this._downNode, this._rightNode, this._topNode];
    if (MjClient.MaxPlayerNum_fuLuShou == 4)
    {
        arr = [this._downNode, this._xingNode, this._rightNode, this._topNode];
    }else if (MjClient.MaxPlayerNum_fuLuShou == 2)
    {
        arr = [this._downNode, this._topNode];
    }

    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;

    var curPlayerNode = null;
    if (curPlayerIsMe_fuLuShou(0)){
        curPlayerNode = arr[0].getChildByName("head");
    }
    else if (curPlayerIsMe_fuLuShou(1)){
        curPlayerNode = arr[1].getChildByName("head");
    }else if (curPlayerIsMe_fuLuShou(2)){
        curPlayerNode = arr[2].getChildByName("head");
    }else if (curPlayerIsMe_fuLuShou(3)){
        curPlayerNode = arr[3].getChildByName("head");
    }


    if (curPlayerNode)
    {
        var tag = 2018322;
        this._downNode.getChildByName("head").removeChildByTag(tag, true);
        this._topNode.getChildByName("head").removeChildByTag(tag, true);
        this._rightNode.getChildByName("head").removeChildByTag(tag, true);
        this._xingNode.getChildByName("head").removeChildByTag(tag, true);

        var _armature = curPlayerNode.getChildByTag(tag);
        if(_armature && cc.sys.isObjectValid(_armature)){
            _armature.stopAllActions();
            _armature.removeFromParent(true);
            _armature = null;
        }

        if (MjClient.data.sData.tData.tState == TableState.waitReady || MjClient.data.sData.tData.tState == TableState.roundFinish){
            return;
        }

        cc.spriteFrameCache.addSpriteFrames("playing/paohuzi/effect/djs/djs0.plist","playing/paohuzi/effect/djs/djs0.png");
        ccs.armatureDataManager.addArmatureFileInfo("playing/paohuzi/effect/djs/djs.ExportJson");
        var _armature = new ccs.Armature("djs");
        _armature.scale = curPlayerNode.getChildByName("headBox").width / _armature.width;
        _armature.animation.play("Animation1");
        _armature.setPosition(curPlayerNode.width/2, curPlayerNode.height/2 + 15);
        _armature.setTag(tag);
        _armature.getAnimation().setSpeedScale(0.5);
        curPlayerNode.addChild(_armature);
    }
};


/**
     * trace
     * @param [int] [count=10]
     */
    function trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        cc.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            cc.log(caller.toString());
            caller = caller.caller;
            i++;
            cc.log("***---------------------------------------- ** " + (i + 1));
        }
    }