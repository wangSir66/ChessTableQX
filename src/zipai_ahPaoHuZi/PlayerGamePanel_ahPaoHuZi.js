/**
 * Created by Administrator on 2017/3/9.
 */
// var cdsNums = 0;
// var windPos = [];
// var windObj = [];
// var roundnumImgObj;
var actionZindex = 1000;

// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_ahPaoHuZi(node, off){
    var pl = getUIPlayer_ahPaoHuZi(off);
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
        setUserOffline_ahPaoHuZi(node, off);
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
function InitUserHandUI_ahPaoHuZi(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_ahPaoHuZi(off);

    if(!pl){
        return;
    }

    //初

    setAreaTypeInfo(true);

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
        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_ahPaoHuZi(off));
    }

    if (MjClient.rePlayVideo != -1) {
         MjClient.playui._jiazhuWait.visible = false;
    }

    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1){
        //表示正常游戏
        if(pl.mjhand && off == 0){
            cc.log("pl.mjhand====:" + pl.mjhand);
            MjClient.HandCardArr = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
        }
    }else{
        /*
            播放录像
         */
        cc.log("_________________mjhand_replay_______________"+JSON.stringify(pl.mjhand));
        if (pl.mjhand){
            if(off == 0){
                MjClient.HandCardArr = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
            }else{
                if(!MjClient.OtherHandArr){
                    MjClient.OtherHandArr = {};
                }
                if(!MjClient.OtherHandArr[off]){
                    MjClient.OtherHandArr[off] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                }
            }
        }

    }
    MjClient.playui.CardLayoutRestore(node,off);
}

var PlayLayer_ahPaoHuZi = cc.Layer.extend({
    jsBind: {
        _event: {
            startShuffleCards:function (d) {
                //checkCanShowDistance();
            },
            mjhand: function() {
                if(MjClient.endoneui != null)
                {
                    cc.log("=======mjhand====endoneui====" + typeof (MjClient.endoneui) );
                    if(cc.sys.isObjectValid(MjClient.endoneui)){
                        MjClient.endoneui.removeFromParent(true);
                    }
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
                if (ipmsg.length > 0) {
                    //AlertSameIP(ipmsg.join("\n"));
                }
                mylog("ipmsg " + ipmsg.length);

                //距离位置显示
                //checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]] );

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
                    this.addChild(new GameOverLayer_ahPaoHuZi(),500);
                }else{
                    MjClient.Scene.addChild(new StopRoomView());
                }    
            },
            roundEnd: function() {
                var self = this;

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                var time = 0;
                if(!MjClient.isDismiss && tData.hunCard && tData.hunCard != -1 && tData.areaSelectMode.xingType==2){
                    time = 1.8;
                    var hunCard = sData.cards[tData.cardNext];
                    if(!hunCard){
                        hunCard = tData.lastPutCard;
                    }
                    ShowEatActionAnim_ahPaoHuZi(MjClient.playui._downNode, ActionType_paohuzi.FANXING, 0);
                    DealFanXingNewCard_ahPaoHuZi(hunCard);
                }

                function delayExe(){
                    var sData = MjClient.data.sData;
                    resetEatActionAnim_ahPaoHuZi();
                    if (sData.tData.roundNum <= 0 && !sData.tData.fieldId){
                        var layer = new GameOverLayer_ahPaoHuZi();
                        layer.setVisible(false);
                        self.addChild(layer,500);
                    }

                    if (!MjClient.endoneui){
                        if(!sData.tData.fieldId){
                            self.addChild(new EndOneView_ahPaoHuZi(),500); //EndOneView_shaoYang
                        }else{
                            //金币场
                            self.addChild(new EndOneView_ahPaoHuZiGold(),500);
                        }
                    }

                    var putNode = MjClient.playui._downNode.getChildByName("xingPai");
                    putNode.removeAllChildren();
                    putNode.setVisible(false);
                }
                this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(delayExe)));

                MjClient.playui.showAndHideHeadEffect();
                MjClient.playui.trustLayer.visible = false;
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                //tableStartHeadMoveAction_ahPaoHuZi(this);   //不涉及到头像移动动作
            },
            initSceneData: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                reConectHeadLayout_ahPaoHuZi(this);        //不涉及到头像移动动作
                CheckRoomUiDelete();
                tableStartHeadMoveAction_ahPaoHuZi(this);   //不涉及到头像移动动作

                //距离位置显示
                //checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]] );

                MjClient.playui.showAndHideHeadEffect();
            },
            MJChat : function(data){
                if(data.type == 4){
                    //距离位置显示
                    //checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]] );
                }
            }, 
            removePlayer: function(eD) {
                //距离位置显示
                //checkCanShowDistance([[0.25, 0.25], [0.5, 0.5], [0, 0]] );
            },
            addPlayer:function () {
                tableStartHeadMoveAction_ahPaoHuZi(this);   //不涉及到头像移动动作
            },
            onlinePlayer: function() {
                reConectHeadLayout_ahPaoHuZi(this);        //不涉及到头像移动动作
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
                changeMJBg_ahPaoHuZi(this, ziPai.getZiPaiType());
            },
            MJPeng: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZNewCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            HZGangCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            HZChiCard: function() {
                MjClient.playui.showAndHideHeadEffect();
            },
            HZWeiCard: function(){
                MjClient.playui.showAndHideHeadEffect();
            },
            MJPut: function(msg) {
                MjClient.playui.showAndHideHeadEffect();
            },
            waitPut: function(eD) {
                MjClient.playui.showAndHideHeadEffect();
            },
            EZP_huXi : function(){
                MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
            },
            EZP_layout : function(){
                ziPai.changePlayUILayout(MjClient.playui.playuiNode);
                if(IsArrowVisible_ahPaoHuZi()){
                    MjClient.playui.ResetPutCard(MjClient.playui._downNode, 0);
                    MjClient.playui.ResetPutCard(MjClient.playui._rightNode, 1);
                    MjClient.playui.ResetPutCard(MjClient.playui._topNode, 2);
                }
            },
            trustTime : function(){
                // MjClient.playui.showCountdown(this.getChildByName("head"), 0);
                if(!MjClient.data.sData){
                    return;
                }
                MjClient.playui.showAndHideHeadEffect();
            },
        },
        cardNumImg: {
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.085, 0.085], [0.5, 0.73], [0, 0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_ahPaoHuZi();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_ahPaoHuZi();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardNumImg:{
                _run: function(){
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    this.cardNumPaiDui = MjClient.majiang.getAllCardsTotal() - tData.maxPlayer * 20;
                    this.cardnumAtlas = this.getParent().getChildByName("cardnumAtlas");
                },
                _event:{
                    initSceneData:function(){
                        if(!IsArrowVisible_ahPaoHuZi()){
                            return;
                        }
                        var sData = MjClient.data.sData;
                        var tData = sData.tData; 
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        if(next <= 0){
                            this.visible = false;
                        }else if(next > 1){
                            this.visible = true;
                            // return;
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
                            // return;
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
                           //  this.visible = true;
                           // this.removeAllChildren();
                           // for(var i = 1;i <= next;i++){
                           //      var child = ccui.ImageView("playing/paohuzi/fapai_pai.png");
                           //      child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                           //      this.addChild(child);
                           // }
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
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    mjhand: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    initSceneData : function() {
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
                    // waitPut: function() {
                    //     var sData = MjClient.data.sData;
                    //     var tData = sData.tData;
                    //     if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    //     cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
                    // }
                    roundEnd: function(){
                        this.visible = false;
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
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
                // _run:function()
                // {
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
        },
        info:{
            _layout: [[0.16, 0.16],[0.01, 0.935],[0, 0]]
        },
        gameName:{
            _layout: [[0.12, 0],[0.5, 0.83],[0, 0]]
        },
        roundInfo:{
            _layout: [[0.11, 0.11],[0.5, 0.66],[0, 0]],
            _run:function(){
                var tData = MjClient.data.sData.tData;
                var str = "";
                str += tData.areaSelectMode.maxPlayer + "人";
                str += tData.areaSelectMode.isMaiPai ? ",埋牌20张" : "";
                str += (tData.areaSelectMode.huXiType == 3)?",三息一囤":",一息一囤";
                str += tData.areaSelectMode.isZiMoFanBei ? ",自摸翻倍" : "";
                str += tData.areaSelectMode.isZiMoJiaYiTun ? ",自摸加一囤" : "";
                str += tData.areaSelectMode.isTikan ? ",三提、五坎" : "";
                str += tData.areaSelectMode.isPapo ? ",爬坡" : "";
                str += tData.areaSelectMode.isMingWei ? ",明偎" : ",暗偎";
                if (!tData.fieldId){
                    str += tData.areaSelectMode.isShiWuXiErFen ? ",15息2底分" : "";
                    if (tData.areaSelectMode.zuoZhuang != null){
                        str += [",首局随机坐庄", ",首局房主坐庄"][tData.areaSelectMode.zuoZhuang];
                    }
                    str += tData.areaSelectMode.isManualCutCard ? ",手动切牌" : ",系统切牌";
                }
                if (tData.fieldId && tData.fieldBase){
                    str += ",底分" + tData.fieldBase + "金币";
                }

                this.ignoreContentAdaptWithSize(true);
                var strPayWay = "";
                var str5 = strPayWay;
                this.setString(str + str5);
            }
        },
        jiazhuWait:{
            _visible:false,
            _layout: [[0.45, 0.12],[0.5, 0.5],[0, 0]]
        },
        banner: {
            _layout: [[0.35, 0.35],[0.5, 1],[0, 0]],
            _run: function() {
                    // if (getCurrentGameBgType() != 0)
                        // changeGameTitleBg(this);

                    if (MjClient.data.sData.tData.fieldId){
                        var nodeGpsBg = this.getChildByName("gps_btn");
                        var nodeSettingBg = this.getChildByName("setting");
                        var trustBtn = this.getChildByName("trust_btn");
                        var getGoldBtn = this.getChildByName("get_gold_btn");
                        nodeSettingBg.x = nodeGpsBg.x;
                        trustBtn.x = nodeSettingBg.x - 100;
                        getGoldBtn.x = nodeSettingBg.x - 200;

                        nodeSettingBg.loadTextureNormal("playing/gameTable/gold/shezhi.png");
                        nodeSettingBg.loadTexturePressed("playing/gameTable/gold/shezhi_s.png");
                        nodeSettingBg.setContentSize(cc.size(65,74));
                        return;
                    }

                    if (MjClient.MaxPlayerNum_ahPaoHuZi == 2){
                        var nodeChangeBg = this.getChildByName("changeBg");
                        var nodeSettingBg = this.getChildByName("setting");
                        var nodeGpsBg = this.getChildByName("gps_btn");
                        nodeGpsBg.visible = false;
                        nodeChangeBg.x = nodeSettingBg.x;
                        nodeSettingBg.x = nodeGpsBg.x;
                    }
                },
            _event: {
                changeGameBgEvent: function() {
                    // changeGameTitleBg(this);
                }
            },
            roomNo : {
                _run: function() {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                }
            },
            wifi: {
                _run: function() {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                    updateWifiState(this);
                }
            },
            bg_time:{
                 _run:function()
                {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                    // var text = new ccui.Text();
                    // text.setFontName(MjClient.fzcyfont);
                    // text.setFontSize(20);
                    
                    // text.setAnchorPoint(0.5,0.5);
                    // text.setPosition(28.5, 12);
                    // this.addChild(text);
                    // text.schedule(function(){
                        
                    //     var time = MjClient.getCurrentTime();
                    //     var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                    //         (time[4]<10?"0"+time[4]:time[4]);
                    //     this.setString(str);
                    // });
                }

            },
            timeTxt : {
                _run:function()
                {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                    this.ignoreContentAdaptWithSize(true);
                    this.schedule(function(){
                        var time = MjClient.getCurrentTime();
                        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                            (time[4]<10?"0"+time[4]:time[4]);
                        this.setString(str);
                    });
                }
            },
            power_9:{
                _run: function() {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                },
            },
            powerBar: {
                _run: function() {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        if(MjClient.data.sData.tData.fieldId){
                            return;
                        }
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function() {
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                        return;
                    }
                    this.ignoreContentAdaptWithSize(true);
                    // if(MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId){//金币场显示场次名称
                    //     this.setString(MjClient.data.sData.tData.fieldTitle+"   底分"+getJinbiStr(MjClient.data.sData.tData.fieldBase)+"金币");
                    // }
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        // if(MjClient.data.sData.tData.fieldId){//金币场显示场次名称
                        //     this.setString(MjClient.data.sData.tData.fieldTitle+"   底分"+getJinbiStr(MjClient.data.sData.tData.fieldBase)+"金币");
                        // }else{
                            this.setString(MjClient.data.sData.tData.tableid);
                        //}
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
                    str += tData.areaSelectMode.maxPlayer + "人";
                    str += tData.areaSelectMode.isMaiPai ? ",埋牌20张" : "";
                    str += (tData.areaSelectMode.huXiType == 3)?",三息一囤":",一息一囤";
                    str += tData.areaSelectMode.isZiMoFanBei ? ",自摸翻倍" : "";
                    str += tData.areaSelectMode.isZiMoJiaYiTun ? ",自摸加一囤" : "";
                    str += tData.areaSelectMode.isTikan ? ",三提、五坎" : "";
                    str += tData.areaSelectMode.isPapo ? ",爬坡" : "";
                    str += tData.areaSelectMode.isMingWei ? ",明偎" : ",暗偎";
                    str += tData.areaSelectMode.isShiWuXiErFen ? ",15息2底分" : "";
                    if (!tData.fieldId){
                        if (tData.areaSelectMode.zuoZhuang != null){
                            str += [",首局随机坐庄", ",首局房主坐庄"][tData.areaSelectMode.zuoZhuang];
                        }
                        str += tData.areaSelectMode.isManualCutCard ? ",手动切牌" : ",系统切牌";
                    }

                    if (tData.fieldId && tData.fieldBase){
                        str += ",底分" + tData.fieldBase + "金币";
                    }

                    var sData = MjClient.data.sData;
                    var str7 = " ";
                    if (Object.keys(sData.players).length > 0 && MjClient.MaxPlayerNum_ahPaoHuZi > Object.keys(sData.players).length){
                        str7 += ["一","二","三"][Object.keys(sData.players).length - 1] + "缺" + ["一","二","三"][MjClient.MaxPlayerNum_ahPaoHuZi - Object.keys(sData.players).length - 1];
                    }

                    // var _nameStr = unescape(pl.info.nickname );
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
                    var str6 = tData.roundNum + "局,"+str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
                    cc.log(str+str6);
                    MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str+str6);
                    MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
                        MjClient.native.openWeixin();
                    }, function(){});
                },
                // _event: {
                //     initSceneData: function(eD) {
                //         this.visible = IsInviteVisible();
                //     },
                //     addPlayer: function(eD) {
                //         console.log(">>>>>> play add player >>>>");
                //         this.visible = IsInviteVisible();
                //     },
                //     removePlayer: function(eD) {
                //         this.visible = IsInviteVisible();
                //     }
                // }
            },
            setting: {
                _click: function() {
                    // var settringLayer = new SettingView();
                    var settringLayer = new ZiPaiSettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer, 6000);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            changeBg: {
                _run : function(){
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                    }
                },
                _click: function() {
                    ziPai.setCurrentGameBgTypeToNext();
                    postEvent("changeGameBgEvent");
                }
            },
            gps_btn: {
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
                _run : function(){
                    if(MjClient.data.sData.tData.fieldId){
                        this.visible = false;
                    }
                },
                _click: function() {
                    if(MjClient.MaxPlayerNum_ahPaoHuZi == 3){
                        MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    }else if(MjClient.MaxPlayerNum_ahPaoHuZi == 4){
                        MjClient.Scene.addChild(new showDistanceLayer());
                    }
                }

            },
            back_btn: {
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
                _run:function () {
                    if(MjClient.data.sData.tData.fieldId){
                        this.setVisible(false);
                    }
                },
                _click: function() {
                    if (!IsRoomCreator() &&
                        (MjClient.data.sData.tData.tState == TableState.waitJoin || MjClient.data.sData.tData.tState == TableState.waitReady))
                    {
                        MjClient.showMsg("确定要退出房间吗？",
                            function() {
                                MjClient.leaveGame();
                                if (!MjClient.enterui && !getClubInfoInTable())
                                    MjClient.Scene.addChild(new EnterRoomLayer());
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
            trust_btn:{
                _run:function () {
                    this.setVisible(false);
                    if(MjClient.data.sData.tData.fieldId){
                        this.setVisible(true);
                    }
                },
                _click: function() {
                    if(MjClient.data.sData.tData.tState != TableState.waitReady &&
                        MjClient.data.sData.tData.tState != TableState.roundFinish &&
                        MjClient.data.sData.tData.tState != TableState.waitJoin)
                    {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "beTrust"
                        });
                    }
                }
            },
            get_gold_btn:{
                _run:function () {
                    if(MjClient._GOLD_RECHARGE && MjClient.data.sData.tData.fieldId){
                        this.setVisible(true);
                    }else {
                        this.setVisible(false);
                    }

                    // 隐藏按钮，暂不开放
                    this.setVisible(false);
                },
                _click: function() {
                    MjClient.Scene.addChild(new goldStoreLayer());
                }
            },
            Button_1: {
                _visible : false,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI,help:true});
                }
            },
            roundnumImg: {
                _run:function () {
                    MjClient.roundnumImgNode = this;
                    //setWgtLayout(this,[0.1, 0.1], [0.5, 0.57], [0, 0]);
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsArrowVisible_ahPaoHuZi();
                    },
                    mjhand: function(eD) {
                        this.visible = IsArrowVisible_ahPaoHuZi();
                    },
                    onlinePlayer: function(eD) {
                        this.visible = IsArrowVisible_ahPaoHuZi();
                    }
                },
                roundnumAtlas: {
                    _visible : function () {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData){
                            if(tData.fieldId) {//金币场显示场次名称
                                return false;
                            }
                        }
                        return true;
                    },
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) return ((tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"/"+tData.roundAll.toString()+"局");
                    },
                    _event: {
                        mjhand: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var extraNum = tData.extraNum ? tData.extraNum:0;
                            if (tData) return this.setString((tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"/"+tData.roundAll.toString()+"局");
                        },
                        initSceneData: function(eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var extraNum = tData.extraNum ? tData.extraNum:0;
                            if (tData) return this.setString((tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"/"+tData.roundAll.toString()+"局");
                        },
                    }
                }
            },
        },
        wait: {
            // getRoomNum: {
            //     _run:function(){
            //         if (MjClient.remoteCfg.guestLogin){
            //             setWgtLayout(this, [0.18, 0.18],[0.5, 0.3],[0, 0]);
            //         }else{
            //             setWgtLayout(this, [0.18, 0.18],[0.5, 0.2],[0, 0]);
            //         }
            //     },
            //     _visible:function(){
            //         return !MjClient.remoteCfg.guestLogin;
            //     },
            //     _click: function() {
            //         /*
            //          复制房间号-----------------------
            //          */
            //         var tData = MjClient.data.sData.tData;
            //         var str1 = "扯胡子,";
            //         var str2 = (tData.areaSelectMode.kingNum == 2) ? "双王," : "三王,";
            //         var str3 = (tData.areaSelectMode.isFanXing == 1) ? "单醒," : "双醒,";
            //         str3 += (tData.areaSelectMode.fengDing == -1) ? "无上限," : (tData.areaSelectMode.fengDing == 300)?"300分封顶,":"600分封顶,";
            //         var str5 = "三人场,";
            //         var sData = MjClient.data.sData;
            //         var str7 = "  二缺一";
            //         if((MjClient.MaxPlayerNum_ahPaoHuZi - Object.keys(sData.players).length) == 2){
            //             str7 = "  一缺二";
            //         }
            //         // var _nameStr = unescape(pl.info.nickname );
            //         str7 += "(";
            //         var index = 0;
            //         for(var uid in sData.players){
            //             var pl = sData.players[uid + ""];
            //             str7 += unescape(pl.info.nickname );
            //             if(index < Object.keys(sData.players).length - 1){
            //                 str7 += ",";
            //             }
            //             index ++;
            //         }
            //         str7 += ")";
            //         var str6 = tData.roundNum + "局,"+str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
            //         MjClient.native.doCopyToPasteBoard("房间号:[" + tData.tableid + "]\n" + str1+str2+str3+str5+str6);
            //         MjClient.showMsg("已复制房间号，请不要返回大厅。打开微信后粘贴房间信息。", function(){
            //             MjClient.native.openWeixin();
            //         });
            //     }
            // },
            wxinvite: {
                _layout: [[219/1280, 0],[0.697, 0.12],[0, 0]],
                _click: function() {
                    getPlayingRoomInfo(2);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

                },
                _visible:function(){
                    if( MjClient.data.sData && MjClient.data.sData.tData && MjClient.data.sData.tData.fieldId){
                        return false;
                    }
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
                    // if (MjClient.remoteCfg.guestLogin){
                    //     setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                    // }else{
                    //     setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0]);
                    // }
                },
                // _click: function() {
                //     MjClient.delRoom(true);
                // },
                // _event: {
                //     initSceneData: function(eD) {
                //         this.visible = isShowBackBtn();
                //     },
                //     removePlayer: function(eD) {
                //         this.visible = isShowBackBtn();
                //     },
                //     mjhand: function(){
                //         this.visible = false;
                //     },
                //     waitReady:function()
                //     {
                //         this.visible = true;
                //     },
                // }
            },
            backHomebtn: {
                _run:function(){
                    setWgtLayout(this, [219/1280, 0],[0.30, 0.12],[0, 0]);
                },
                _click: function(btn) {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Likaifangjian", {uid:SelfUid(), gameType:MjClient.gameType});

                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function() {
                                    MjClient.leaveGame();
                                    if (!MjClient.enterui && !getClubInfoInTable())
                                        MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("确定要退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
                                    if (!MjClient.enterui && !getClubInfoInTable())
                                        MjClient.Scene.addChild(new EnterRoomLayer());
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
                        this.visible = isShowBackBtn_ahPaoHuZi();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn_ahPaoHuZi();
                    },
                    mjhand: function(){
                        this.visible = false;
                    },
                    waitReady:function()
                    {
                        this.visible = true;
                    },
                    startShuffleCards : function(){
                        this.visible = false;
                    },
                    waitJiazhu : function(){
                        this.visible = false;
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
            // _event: {
            //     initSceneData: function(eD) {
            //         this.visible = IsInviteVisible();
            //     },
            //     addPlayer: function(eD) {
            //         console.log(">>>>>> play add player >>>>");
            //         this.visible = IsInviteVisible();
            //     },
            //     removePlayer: function(eD) {
            //         this.visible = IsInviteVisible();
            //     }
            // }
        },
        jiachuiBtn_node: {
            _visible: false,
            // _run: function() {
            //     this.visible = false;
            //     var pl = getUIPlayer_ahPaoHuZi(0);
            //     var tData = MjClient.data.sData.tData;
            //
            //     if (tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1) {
            //         this.visible = true;
            //     }
            // },
            // _event: {
            //     initSceneData: function() { // 原地重连 不会走_run
            //         this.visible = false;
            //         var pl = getUIPlayer_ahPaoHuZi(0);
            //         var tData = MjClient.data.sData.tData;
            //
            //         if (tData.tState == TableState.waitJiazhu && pl.jiachuiNum == -1) {
            //             this.visible = true;
            //         }
            //     },
            //     waitJiazhu: function() {
            //         this.visible = true;
            //     },
            //     MJJiazhu: function() {
            //         var pl = getUIPlayer_ahPaoHuZi(0);
            //         if (pl.jiachuiNum != -1) {
            //             this.visible = false;
            //         }
            //     }
            // },
            // jiachuiBtn: {
            //     _layout: [
            //         [0.12, 0.12],
            //         [0.4, 0.4],
            //         [0, 0]
            //     ],
            //     _click: function(btn) {
            //         MjClient.gamenet.request("pkroom.handler.tableMsg", {
            //             cmd: "MJJiazhu",
            //             jiachuiNum: 1,
            //         });
            //     }
            // },
            // no_jiachuiBtn: {
            //     _layout: [
            //         [0.12, 0.12],
            //         [0.6, 0.4],
            //         [0, 0]
            //     ],
            //     _click: function(btn) {
            //         MjClient.gamenet.request("pkroom.handler.tableMsg", {
            //             cmd: "MJJiazhu",
            //             jiachuiNum: 0,
            //         });
            //     }
            // }
        },
        BtnReady:{
            _run: function () {
                this.visible = false;
                //setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [0.0, 0.26]);
                setWgtLayout(this,[219/1280, 0],[0.697, 0.12],[0, 0]);
            },
            _click: function(btn) {
                cc.log("-----------准备-------");
                //sendQiangdizhu(true);
                HZPassConfirmToServer_ahPaoHuZi();
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

                    var pl = getUIPlayer_ahPaoHuZi(0);
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
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                },
                trustTime : {
                    _run:function()
                    {
                        this.ignoreContentAdaptWithSize(true);
                    }
                },
                chuizi_tips : {
                    _visible:false,
                    // _run: function(){
                    //     setJiachuiImgTips_ahPaoHuZi(this, 0);
                    // },
                    // _event: {
                    //     initSceneData: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 0);
                    //     },
                    //     mjhand: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 0);
                    //     },
                    //     roundEnd: function() {
                    //         // this.visible = false;
                    //     },
                    //     waitJiazhu: function() {
                    //         this.visible = false;
                    //     }
                    // }
                },
                jiachuiText_tips : {
                    _visible:false,
                    // _run: function() {
                    //     setJiachuiTextTips_ahPaoHuZi(this, 0);
                    // },
                    // _event:{
                    //     initSceneData: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 0);
                    //     },
                    //     MJJiazhu: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 0);
                    //     },
                    //     mjhand: function() {
                    //         this.visible = false;
                    //     }
                    // }
                }, 
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(){
                            showUserZhuangLogo_ahPaoHuZi(this, 0);
                        },
                        initSceneData: function(){
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 0);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 0);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 600;
                    },
                    chattext: {
                        _event: {

                            MJChat: function(msg) {

                                showUserChat_ahPaoHuZi(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_ahPaoHuZi(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_ahPaoHuZi(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_ahPaoHuZi(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,0);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_ahPaoHuZi(this,0);
                },
                score_bg:{_visible:false},
                huxi:{
                    _run:function () {
                        // if (MjClient.data.sData.tData.fieldId){
                        //     this.setTextColor(cc.color(166, 174, 25));
                        // }
                    },
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            this.setVisible(false);
                            return this.setString("胡息:0");
                        },
                        addPlayer: function(){
                            this.visible = false;
                            return this.setString("胡息:0");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = true;
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
                            if(!IsArrowVisible_ahPaoHuZi()){
                                huXi = 0;
                                this.visible = false;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
                            return this.setString("胡息:" + huXi);
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_ahPaoHuZi(0);
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
                    // _event:{
                    //     initSceneData: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     mjhand: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0) && IsArrowVisible_ahPaoHuZi();
                    //     },
                    //     waitPut: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     HZNewCard: function(ed){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     MJPeng: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     HZChiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     HZGangCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     HZWeiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     MJPut: function(eD){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(0);
                    //     },
                    //     roundEnd: function(eD){
                    //         this.visible = false;
                    //     }
                    // },
                    // time:{
                    //     _run: function() {
                    //         this.setString("00");
                    //     },
                    //     _event: {
                    //         initSceneData: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         mjhand: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPeng: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZNewCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZGangCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZChiCard: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZWeiCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPut: function(msg) {
                    //             if (curPlayerIsMe_ahPaoHuZi(0)) {
                    //                 this.stopAllActions();
                    //                 stopEffect(playTimeUpEff);
                    //                 playTimeUpEff = null;
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         onlinePlayer: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             var pl = getUIPlayer_ahPaoHuZi(0);
                    //             if(pl && pl.onLine && curPlayerIsMe_ahPaoHuZi(0)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         roundEnd: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //         }
                    //     }
                    // }
                },
                skipHuIconTag: {
                    _visible:false,
                    _event: {
                        clearCardUI: function(eD) {
                            this.visible = false;
                        },
                        initSceneData:function(eD)
                        {
                            var pl = getUIPlayer_ahPaoHuZi(0);
                            //cc.log("====================initSceneData=============== pl.isQiHu = " + pl.isQiHu);
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
                    GetReadyVisible_ahPaoHuZi(this, 0);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    waitJiazhu: function() {
                        GetReadyVisible_ahPaoHuZi(this, 0);
                    },
                    addPlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 0);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 0);
                    },
                    initSceneData: function(){
                        GetReadyVisible_ahPaoHuZi(this, 0);
                    }
                }
            },
            handNode: {
                _visible: false,
                _event:  {
                    mjhand:function(){
                        calculateHintPutList_ahPaoHuZi();
                    },
                    initSceneData: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    HZPickCard: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    HZAddCards: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    HZChiCard: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    MJPeng: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    MJPut: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    HZWeiCard: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    HZGangCard: function() {
                        calculateHintPutList_ahPaoHuZi();
                    },
                    MJPass: function() { // 天胡 提 偎 跑后过胡
                        calculateHintPutList_ahPaoHuZi();
                        addTingSign_ahPaoHuZi(MjClient.playui._downNode);
                    },
                    HZCheckRaise: function() {
                        calculateHintPutList_ahPaoHuZi();
                        addTingSign_ahPaoHuZi(MjClient.playui._downNode);
                    },
                    EZP_tingPai :function(){   
                        calculateHintPutList_ahPaoHuZi();
                        addTingSign_ahPaoHuZi(MjClient.playui._downNode); 
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
                        // MjClient.playui.tingLayer.visible = (ziPai.getTingPaiType() == 0);
                    }
                }
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.005, 0.23], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.23], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [0.7, 0.5], [0, 0]]
            },
            handCard: {
                _run:function () {
                    // setWgtLayout(this, [0.185, 0.17],[0.27,0.75],[0,0]);
                    this.ignoreContentAdaptWithSize(true);
                    ziPai.setWgtLayoutHandCard(this);
                },
                _visible: false,
                _event:{
                    changeMJBgEvent: function() {
                        ziPai.setWgtLayoutHandCard(this);
                        var handNode = MjClient.playui._downNode.getChildByName("handNode");
                        if(handNode){
                            handNode.removeAllChildren();
                        }
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode,0, true);
                        // setWgtLayout(this, [0.185, 0.17],[0.27,0.75],[0,0]);
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
            _event: {
                clearCardUI: function() {
                    clearCardUI_ahPaoHuZi(this, 0);
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
                    RemovePutCardOut_ahPaoHuZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 0);
                    InitUserHandUI_ahPaoHuZi(this, 0);
                    InitUserCoinAndName_ahPaoHuZi(this, 0);
                    MjClient.hasPut = false; // 重连回来重置打掉牌标志（打牌时候断线)
                    ShowPutCardIcon();
                    DealOffLineCard_ahPaoHuZi(this,0);
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 0);
                    InitUserCoinAndName_ahPaoHuZi(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 0);
                    InitUserCoinAndName_ahPaoHuZi(this, 0);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ahPaoHuZi(this, 0);
                    InitUserCoinAndName_ahPaoHuZi(this, 0);

                    if(MjClient.playui.playuiNode.cutCardView){
                        MjClient.playui.playuiNode.cutCardView.cutCardsEffect(this);
                    }

                    var uid = getUIPlayer_ahPaoHuZi(0).info.uid;
                    // if (eD.jiazhuNums)
                    // {
                    //     for (var key in eD.jiazhuNums)
                    //     {
                    //         if (key != uid && eD.jiazhuNums[key] == 2)
                    //             MjClient.playui._jiazhuWait.visible = true;
                    //     }
                    // }
                },
                roundEnd: function() {
                    InitUserCoinAndName_ahPaoHuZi(this, 0);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_ahPaoHuZi(this,eD,0);
                },
                MJPut: function(eD) {
                    DealPutCard_ahPaoHuZi(this,eD,0);
                },
                HZChiCard: function(eD) {
                    DealChiCard_ahPaoHuZi(this, eD, 0);
                },
                HZWeiCard: function(eD){
                    DealWeiCard_ahPaoHuZi(this,eD,0);
                },
                HZGangCard: function(eD) {
                    DealGangCard_ahPaoHuZi(this, eD, 0);
                },
                MJPeng: function(eD) {
                    DealPengCard_ahPaoHuZi(this, eD, 0);
                },
                MJHu: function(eD) {
                    DealHu_ahPaoHuZi(this, eD, 0);
                },
                onlinePlayer: function(eD) {
                    resetHandAfterBegin_ahPaoHuZi();
                    setUserOffline_ahPaoHuZi(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_ahPaoHuZi(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                MJJiazhu: function(msg) {
                    ShowPutCardIcon();
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui._jiazhuWait.visible = false;
                    MjClient.playui.resetJiaZhuTip();
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._downNode, getUIPlayer_ahPaoHuZi(0));
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._rightNode, getUIPlayer_ahPaoHuZi(1));
                    MjClient.majiang.setJiaZhuNum(MjClient.playui._topNode, getUIPlayer_ahPaoHuZi(2));
                },
                HZPickCard:function (eD) {
                    // var pl = getUIPlayer_ahPaoHuZi(0);
                    // if(eD.uid == pl.info.uid) {
                    //     MjClient.HandCardArr = MjClient.majiang.sortHandCardSpecial(pl.mjhand)
                    // }
                    // RemovePutCardOut_ahPaoHuZi(true);
                    // MjClient.playui.ResetHandCard(this,0);

                    DealShowLastCard_ahPaoHuZi(this, eD, 0);
                },
                HZAddCards:function (eD) {
                    DealAddCard_ahPaoHuZi(this,eD, 0);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon();
                    MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_ahPaoHuZi(0);
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
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_ahPaoHuZi(off));
                    }
                },
                cancelTrust : function(){
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                beTrust : function(){
                    MjClient.playui.showAndHideTrust(this, 0);
                },
                updateInfo:function (d) {
                    if(MjClient.data.sData.tData.fieldId && d && d.gold){
                        InitUserCoinAndName_ahPaoHuZi(this,0);
                    }
                },
            }
        },
        right: {
            head: {
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                },
                trustTime : {
                    _run:function()
                    {
                        this.ignoreContentAdaptWithSize(true);
                    }
                },
                chuizi_tips : {
                    _visible:false,
                    // _run: function(){
                    //     setJiachuiImgTips_ahPaoHuZi(this, 1);
                    // },
                    // _event: {
                    //     initSceneData: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 1);
                    //     },
                    //     mjhand: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 1);
                    //     },
                    //     roundEnd: function() {
                    //         // this.visible = false;
                    //     },
                    //     waitJiazhu: function() {
                    //         this.visible = false;
                    //     }
                    // }
                },
                jiachuiText_tips : {
                    _visible:false,
                    // _run:function() {
                    //     setJiachuiTextTips_ahPaoHuZi(this, 1);
                    // },
                    // _event:{
                    //     initSceneData: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 1);
                    //     },
                    //     MJJiazhu: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 1);
                    //     },
                    //     mjhand: function() {
                    //         this.visible = false;
                    //     }
                    // }
                }, 
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_ahPaoHuZi(this, 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 1);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 1);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                showUserChat_ahPaoHuZi(this, 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_ahPaoHuZi(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_ahPaoHuZi(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_ahPaoHuZi(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,1);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_ahPaoHuZi(this,1);
                },
                score_bg:{_visible:false},
                huxi:{
                    _run:function () {
                        // if (MjClient.data.sData.tData.fieldId){
                        //     this.setTextColor(cc.color(166, 174, 25));
                        // }
                    },
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
                            this.visible = true;
                            var huXi = UpdateHuXi_ahPaoHuZi(1);
                            if(!IsArrowVisible_ahPaoHuZi()){
                                huXi = 0;
                                this.visible = false;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(1);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(1);
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(1);
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(1);
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
                    // _event:{
                    //     initSceneData: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     mjhand: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1) && IsArrowVisible_ahPaoHuZi();
                    //     },
                    //     waitPut: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     HZNewCard: function(ed){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     MJPeng: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     HZChiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     HZGangCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     HZWeiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     MJPut: function(eD){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(1);
                    //     },
                    //     roundEnd: function(eD){
                    //         this.visible = false;
                    //     }
                    // },
                    // time:{
                    //     _run: function() {
                    //         this.setString("00");
                    //     },
                    //     _event: {
                    //         initSceneData: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         mjhand: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPeng: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZNewCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZGangCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZChiCard: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZWeiCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPut: function(msg) {
                    //             if (curPlayerIsMe_ahPaoHuZi(1)) {
                    //                 this.stopAllActions();
                    //                 stopEffect(playTimeUpEff);
                    //                 playTimeUpEff = null;
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         onlinePlayer: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             var pl = getUIPlayer_ahPaoHuZi(1);
                    //             if(pl && pl.onLine && curPlayerIsMe_ahPaoHuZi(1)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         roundEnd: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //         }
                    //     }
                    // }
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
                    GetReadyVisible_ahPaoHuZi(this, 1);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 1);
                    },
                    waitJiazhu: function() {
                        GetReadyVisible_ahPaoHuZi(this, 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 1);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 1);
                    },
                    initSceneData: function(){
                        GetReadyVisible_ahPaoHuZi(this, 1);
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.85, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.76], [0, 0]]
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.835], [0, 0]]
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
            _event: {
                clearCardUI: function() {
                    clearCardUI_ahPaoHuZi(this, 1);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_ahPaoHuZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 1);
                    InitUserHandUI_ahPaoHuZi(this, 1);
                    InitUserCoinAndName_ahPaoHuZi(this, 1);
                    DealOffLineCard_ahPaoHuZi(this,1);
                    MjClient.playui.showAndHideTrust(this, 1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 1);
                    InitUserCoinAndName_ahPaoHuZi(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 1);
                    InitUserCoinAndName_ahPaoHuZi(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ahPaoHuZi(this, 1);
                    InitUserCoinAndName_ahPaoHuZi(this, 1);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_ahPaoHuZi(this,eD,1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_ahPaoHuZi(this, 1);
                    MjClient.playui.ResetOtherCard(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, 1);
                },
                MJPut: function(eD) {
                    DealPutCard_ahPaoHuZi(this, eD, 1);
                },
                HZChiCard: function(eD) {
                    DealChiCard_ahPaoHuZi(this, eD, 1);
                },
                HZGangCard: function(eD) {
                    DealGangCard_ahPaoHuZi(this, eD, 1);
                },
                MJPeng: function(eD) {
                    DealPengCard_ahPaoHuZi(this, eD, 1);
                },
                HZWeiCard: function(eD){
                    DealWeiCard_ahPaoHuZi(this, eD, 1);
                },
                MJHu: function(eD) {
                    DealHu_ahPaoHuZi(this, eD, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_ahPaoHuZi(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_ahPaoHuZi(this, 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                },
                HZPickCard:function (eD) {
                    if(MjClient.rePlayVideo != -1){
                        MjClient.playui._doPickResetHandCardForPlayBack(eD, 1);
                    }

                    // RemovePutCardOut_ahPaoHuZi(true);
                    // MjClient.playui.ResetHandCard(this,1);

                    DealShowLastCard_ahPaoHuZi(this, eD, 1);
                },
                HZAddCards:function (eD) {
                    DealAddCard_ahPaoHuZi(this,eD, 1);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_ahPaoHuZi(1);
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
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_ahPaoHuZi(off));
                    }
                },
                cancelTrust : function(){
                    MjClient.playui.showAndHideTrust(this, 1);
                },
                beTrust : function(){
                    MjClient.playui.showAndHideTrust(this, 1);
                }
            }
        },
        left: {
            head: {
                trust : {
                    _run : function(){
                        this.visible = false;
                    },
                },
                trustTime : {
                    _run:function()
                    {
                        this.ignoreContentAdaptWithSize(true);
                    }
                },
                chuizi_tips : {
                    _visible:false,
                    // _run: function(){
                    //     setJiachuiImgTips_ahPaoHuZi(this, 2);
                    // },
                    // _event: {
                    //     initSceneData: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 2);
                    //     },
                    //     mjhand: function() {
                    //         setJiachuiImgTips_ahPaoHuZi(this, 2);
                    //     },
                    //     roundEnd: function() {
                    //         // this.visible = false;
                    //     },
                    //     waitJiazhu: function() {
                    //         this.visible = false;
                    //     }
                    // }
                },
                jiachuiText_tips : {
                    _visible:false,
                    // _run:function() {
                    //     setJiachuiTextTips_ahPaoHuZi(this, 2);
                    // },
                    // _event:{
                    //     initSceneData: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 2);
                    //     },
                    //     MJJiazhu: function() {
                    //         setJiachuiTextTips_ahPaoHuZi(this, 2);
                    //     },
                    //     mjhand: function() {
                    //         this.visible = false;
                    //     }
                    // }
                },
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogo_ahPaoHuZi(this, 2);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 2);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_ahPaoHuZi()) showUserZhuangLogo_ahPaoHuZi(this, 2);
                        }
                    }
                },
                chatbg: {
                    _run: function() {
                        this.getParent().zIndex = 500;
                    },
                    chattext: {
                        _event: {
                            MJChat: function(msg) {
                                showUserChat_ahPaoHuZi(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_ahPaoHuZi(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_ahPaoHuZi(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_ahPaoHuZi(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_ahPaoHuZi(this,2);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_ahPaoHuZi(this,2);
                },
                score_bg:{_visible:false},
                huxi:{
                    _run:function () {
                        // if (MjClient.data.sData.tData.fieldId){
                        //     this.setTextColor(cc.color(166, 174, 25));
                        // }
                    },
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
                            this.visible = true;
                            var huXi = UpdateHuXi_ahPaoHuZi(2);
                            if(!IsArrowVisible_ahPaoHuZi()){
                                huXi = 0;
                                this.visible = false;
                            }
                            return this.setString("胡息:" + huXi);
                        },
                        mjhand:function(){
                            this.visible = true;
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(2);
                            return this.setString("胡息:" + huXi);
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(2);
                            return this.setString("胡息:" + huXi);
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(2);
                            return this.setString("胡息:" + huXi);
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_ahPaoHuZi(2);
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
                    // _event:{
                    //     initSceneData: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     mjhand: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     onlinePlayer: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2) && IsArrowVisible_ahPaoHuZi();
                    //     },
                    //     waitPut: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     HZNewCard: function(ed){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     MJPeng: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     HZChiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     HZGangCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     HZWeiCard: function(eD) {
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     MJPut: function(eD){
                    //         this.visible = curPlayerIsMe_ahPaoHuZi(2);
                    //     },
                    //     roundEnd: function(eD){
                    //         this.visible = false;
                    //     }
                    // },
                    // time:{
                    //     _run: function() {
                    //         this.setString("00");
                    //     },
                    //     _event: {
                    //         initSceneData: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         mjhand: function(eD) {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPeng: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZNewCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZGangCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZChiCard: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         HZWeiCard: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             if(curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         MJPut: function(msg) {
                    //             if (curPlayerIsMe_ahPaoHuZi(2)) {
                    //                 this.stopAllActions();
                    //                 stopEffect(playTimeUpEff);
                    //                 playTimeUpEff = null;
                    //                 this.setString("00");
                    //             }
                    //         },
                    //         onlinePlayer: function(){
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //             var pl = getUIPlayer_ahPaoHuZi(2);
                    //             if(pl && pl.onLine && curPlayerIsMe_ahPaoHuZi(2)){
                    //                 arrowbkNumberUpdate(this);
                    //             }
                    //         },
                    //         roundEnd: function() {
                    //             this.stopAllActions();
                    //             stopEffect(playTimeUpEff);
                    //             playTimeUpEff = null;
                    //         }
                    //     }
                    // }
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
                    GetReadyVisible_ahPaoHuZi(this, 2);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_ahPaoHuZi(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 2);
                    },
                    waitJiazhu: function() {
                        GetReadyVisible_ahPaoHuZi(this, 2);
                    },
                    removePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 2);
                    },
                    onlinePlayer: function() {
                        GetReadyVisible_ahPaoHuZi(this, 2);
                    },
                    initSceneData: function(){
                        GetReadyVisible_ahPaoHuZi(this, 2);
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.15, 0.81], [0, 0]]
            },
            eatNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.76], [0, 0]],
                _run:function(){
                    if(isIPhoneX()){
                        setWgtLayout(this, [0.14, 0.14], [0.045, 0.76], [0, 0]);
                    }
                }
            },
            outNode: {
                _visible: false,
                _layout : [[0.14, 0.14], [0.005, 0.84], [0, 0]]
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
            _event: {
                clearCardUI: function() {
                    clearCardUI_ahPaoHuZi(this, 2);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_ahPaoHuZi(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 2);
                    InitUserHandUI_ahPaoHuZi(this, 2);
                    InitUserCoinAndName_ahPaoHuZi(this, 2);
                    DealOffLineCard_ahPaoHuZi(this,2);
                    MjClient.playui.showAndHideTrust(this, 2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 2);
                    InitUserCoinAndName_ahPaoHuZi(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_ahPaoHuZi(this, 2);
                    InitUserCoinAndName_ahPaoHuZi(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_ahPaoHuZi(this, 2);
                    InitUserCoinAndName_ahPaoHuZi(this, 2);
                },
                HZNewCard: function(eD) {
                    console.log("客户端发牌组合...... ");
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_ahPaoHuZi(this,eD,2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_ahPaoHuZi(this, 2);
                    MjClient.playui.ResetOtherCard(this, 2);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, 2);
                },
                MJPut: function(eD) {
                    DealPutCard_ahPaoHuZi(this, eD, 2);
                },
                HZChiCard: function(eD) {
                    DealChiCard_ahPaoHuZi(this, eD, 2);
                },
                HZGangCard: function(eD) {
                    DealGangCard_ahPaoHuZi(this, eD, 2);
                },
                MJPeng: function(eD) {
                    DealPengCard_ahPaoHuZi(this, eD, 2);
                },
                HZWeiCard: function(eD){
                    DealWeiCard_ahPaoHuZi(this, eD, 2);
                },
                MJHu: function(eD) {
                    DealHu_ahPaoHuZi(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_ahPaoHuZi(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_ahPaoHuZi(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                HZPickCard:function (eD) {
                    if(MjClient.rePlayVideo != -1) {
                        MjClient.playui._doPickResetHandCardForPlayBack(eD, 2);
                    }
                    // RemovePutCardOut_ahPaoHuZi(true);
                    // MjClient.playui.ResetHandCard(this,2);

                    DealShowLastCard_ahPaoHuZi(this, eD, 2);
                },
                HZAddCards:function (eD) {
                    DealAddCard_ahPaoHuZi(this,eD, 2);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon();
                    //MjClient.playui.EatVisibleCheck();

                    var tData = MjClient.data.sData.tData;
                    var pl = getUIPlayer_ahPaoHuZi(2);
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
                        MjClient.majiang.setJiaZhuNum(node, getUIPlayer_ahPaoHuZi(off));
                    }
                },
                cancelTrust : function(){
                    if(MjClient.data.sData.tData.maxPlayer != 2){
                        MjClient.playui.showAndHideTrust(this, 2);
                    }
                },
                beTrust : function(){
                    if(MjClient.data.sData.tData.maxPlayer != 2){
                        MjClient.playui.showAndHideTrust(this, 2);
                    }
                }
            }
        },
        eat: {
            chi: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[1.3, 3.8]],
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
                        if(ziPai.getHasFastEat()){
                            // 快速吃牌
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var putCard = tData.lastPutCard;
                            var pl = sData.players[SelfUid()];
                            var chiSet = MjClient.majiang.getChiCards(pl.mjhand, putCard);
                            if (chiSet.length == 1) {
                                var eatCards = chiSet[0];
                                var copy = chiSet[0].slice();
                                copy.splice(copy.indexOf(putCard), 1);
                                if (pl.mjhand.indexOf(putCard) < 0 || copy.indexOf(putCard) >= 0) {

                                    commitEatCards_ahPaoHuZi(eatCards, null);
                                    
                                    return;
                                }
                            }
                        }
                        
                        showSelectEatCards_ahPaoHuZi(this,btn.tag);

                        // var eat = MjClient.playui.jsBind.eat;
                        // eat.chi._node.visible = false;
                        // eat.guo._node.visible = false;
                        // eat.peng._node.visible = false;
                        // eat.hu._node.visible = false;
                        // eat.cancel._node.visible = false;

                        // eat.chi._node.setTouchEnabled(false);
                        // eat.guo._node.setTouchEnabled(false);
                        // eat.peng._node.setTouchEnabled(false);
                        // eat.hu._node.setTouchEnabled(false);
                        // postEvent("showChiLayout");

                        // MJChiCardchange_ahPaoHuZi();
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
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
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
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择碰后视为过胡，确定碰吗？", function() {
                                    HZPengToServer_ahPaoHuZi();
                                    setChiVisible_ahPaoHuZi(); 
                                }, function() {}, "1");
                            } else {
                                HZPengToServer_ahPaoHuZi();
                                setChiVisible_ahPaoHuZi();   
                            }
                        }
                }
            },
            guo: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2){
                        if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                            MjClient.showMsg("确定过胡吗？", function() {
                                MJPass2Net_ahPaoHuZi();
                                setChiVisible_ahPaoHuZi();
                            }, function() {}, "1");
                        } else {
                            MJPass2Net_ahPaoHuZi();
                            setChiVisible_ahPaoHuZi();
                        }  
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[-3, 2.5]],
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
                        MJHuToServer_ahPaoHuZi();
                        setChiVisible_ahPaoHuZi();//add by maoyu
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
                        var parent = btn.getParent();
                        parent.getChildByName("chiSelect").visible = false;
                        parent.getChildByName("biSelect").visible = false;
                        parent.getChildByName("biSelect1").visible = false;
                        resetChiParam_ahPaoHuZi();
                        MjClient.playui.EatVisibleCheck();
                        // MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            wangDiao:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
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
                    if (eT == 2) {
                        HZWangChuangToServer_ahPaoHuZi(1);
                        setChiVisible_ahPaoHuZi();//add by maoyu
                    }
                }
            },
            wangChuang:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
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
                    if (eT == 2) {
                        HZWangChuangToServer_ahPaoHuZi(2);
                        setChiVisible_ahPaoHuZi();//add by maoyu
                    }
                }
            },
            wangZha:{
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[0, 2.5]],
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
                    if (eT == 2) {
                        HZWangChuangToServer_ahPaoHuZi(4);
                        setChiVisible_ahPaoHuZi();//add by maoyu
                    }
                }
            },
            chiSelect: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            biSelect: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            biSelect1: {
                _visible: false,
                _layout: [[0,0.38],[0.5,0.76],[0,0]],
            },
            chiBg: {
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
                            if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                                MjClient.showMsg("选择吃后视为过胡，确定吃吗？", function() {
                                    var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                    HZChiToServer_ahPaoHuZi(cards_select[0], biCards);
                                    this.visible = false;
                                }.bind(this), function() {
                                    cards_select.pop();
                                    this.adaptChiLayout();
                                }.bind(this), "1");
                            } else {
                                var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                HZChiToServer_ahPaoHuZi(cards_select[0], biCards);
                                this.visible = false;
                            }

                            return;
                        } 

                        this.visible = true;
                        var chiLayout = this.getChildByName("chiLayout");
                        chiLayout.removeAllChildren();
                        width = (cards_select.length + 1) * 205 + cards_option.length * 75;
                        if (cards_option.length >= 2) {
                            width += 15 * (cards_option.length - 1);
                        }

                        // cc.log("width@@ " + width);
                        // console.log("cards_select@@ " + JSON.stringify(cards_select));
                        // console.log("cards_option@@ " + JSON.stringify(cards_option));
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
                                chiCardImg.loadTexture(MjClient.cardPath_ahPaoHuZi + "out" + row[j] + ".png");
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
                                chiCardImg.loadTexture(MjClient.cardPath_ahPaoHuZi + "out" + row[j] + ".png");
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
                    console.log("HHH :，MJPass------");
                    setQiHuState_ahPaoHuZi();
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function(eD) {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                HZNewCard: function(eD) {
                    console.log("HHH :HZNewCard------");
                    setQiHuState_ahPaoHuZi();
                    //放在每个方向节点上去做，因为摸到王霸牌的时候，有个显示动作，动作显示完之后
                    //在显示各种操作按钮
                    if(eD.isCommon && eD.newCard){
                        MjClient.playui.EatVisibleCheck();
                    }
                },
                HZGangCard: function(eD) {
                    console.log("HHH :HZGangCard------");
                    setQiHuState_ahPaoHuZi();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    setQiHuState_ahPaoHuZi();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    setQiHuState_ahPaoHuZi();
                    MjClient.playui.EatVisibleCheck();
                },
                HZChiCard: function(eD) {
                    console.log("HHH :HZChiCard------");
                    setQiHuState_ahPaoHuZi();
                    MjClient.playui.EatVisibleCheck();
                },
                HZWeiCard: function(eD) {
                    console.log("HHH :HZWeiCard------");
                    setQiHuState_ahPaoHuZi();
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
                HZWang:function(eD){
                    console.log("HHH :HZWang------");
                    MjClient.playui.EatVisibleCheck();                    
                },
                HZWangChuang:function(eD){
                    console.log("HHH :HZWangChuang------");
                    console.log("HHH :HZWangChuang------");
                    if(MjClient.rePlayVideo != -1){
                        MjClient.playui.EatVisibleCheck();
                    }                   
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
            _run: function() {
                if(MjClient.data.sData.tData.fieldId){
                    this.loadTextureNormal("playing/gameTable/gold/lipai.png");
                    this.loadTexturePressed("playing/gameTable/gold/lipai_s.png");
                    this.setContentSize(cc.size(65,65));
                    setWgtLayout(this,[this.width/1280, 0],[0.04, 0.18],[0, 0]);
                }
            },
            _click: function() {
                var tData = MjClient.data.sData.tData;
                if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                    return;
                }
                MjClient.HandCardArr = MjClient.majiang.sortByUser();
                MjClient.playui.ResetHandCard(MjClient.playui._downNode,0);
            },
            _event: {
                mjhand:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    } 
                    this.setVisible(true);
                },
                initSceneData: function(eD) {
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        return;
                    }
                    this.setVisible(true);
                },
            }
        },
        chat_btn: {
            _layout: [[55/1280, 0],[0.97, 0.5-0.007],[0, -0.2]],
            _run: function() {
                if(MjClient.data.sData.tData.fieldId){
                    this.loadTextureNormal("playing/gameTable/gold/xiaoxi.png");
                    this.loadTexturePressed("playing/gameTable/gold/xiaoxi_s.png");
                    this.setContentSize(cc.size(65,74));
                    setWgtLayout(this,[this.width/1280, 0],[0.97, 0.5-0.007],[0, -0.2]);
                }
            },
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout:  [[43/1280, 0],[0.91, 0.5],[0, -0.2]],
            _run: function() {
                if(MjClient.data.sData.tData.fieldId){
                    this.visible = false;
                    return;
                }
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
                    downAndPlayVoice_ahPaoHuZi(msg.uid, msg.msg);
                }
            }
        },
        cutLine:{
            _visible: false,
            _run: function () {
                // setWgtLayout(this,[1, 0.3], [0.5, 0.6], [0, -2]);
                 ziPai.setWgtLayoutCutLine(this);
            },
            _event: {
                mjhand: function(eD){
                    ShowPutCardIcon();
                },
                HZNewCard: function(eD){
                    ShowPutCardIcon();
                },                
                HZChiCard: function(eD) {
                    ShowPutCardIcon();
                },
                MJPeng: function(eD) {
                    ShowPutCardIcon();
                },
                MJPut:function(eD) {
                    ShowPutCardIcon();
                },
                MJPass:function(eD) {
                    ShowPutCardIcon();
                },
                HZPickCard:function (eD) {
                    ShowPutCardIcon();
                },
                MJHu:function(eD){
                    this.visible = false;
                },
                // HZGangCard:function(eD){
                //     ShowPutCardIcon();
                // },
                // HZWeiCard:function(eD){
                //     ShowPutCardIcon();
                // },
                EZP_xuXian : function(){
                    ziPai.setWgtLayoutCutLine(this);
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
        var playui = ccs.load("Play_AnHuaPaoHuZi.json");
        playMusic("bgFight");
        var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_ahPaoHuZi = tData.maxPlayer;

        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode  = playui.node.getChildByName("left");
        MjClient.HandCardArr = [];
        MjClient.OtherHandArr = {};
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        MjClient.playui._jiazhuWait.visible = false;

        //二人玩法直接移除掉对left节点的处理
        if (MjClient.MaxPlayerNum_ahPaoHuZi == 2){
            this.jsBind.left = {_visible:false};
        //三人玩时恢复
        }else{
            this.jsBind.left = PlayLayer_ahPaoHuZi.jsBindLeftCopy;
        }

        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        this.tingLayer = new AnHuaPaoHuZiTingLayer();
        this.addChild(this.tingLayer, 1000);

        this.playuiNode = playui.node;
        if(MjClient.data.sData.tData.maxPlayer < 4){
            ziPai.changePlayUILayout(playui.node);
        }

        // 切牌
        if(MjClient.rePlayVideo == -1){
            this.playuiNode.cutCardView = COMMON_UI.createZiPaiCutCardView();
            playui.node.addChild(this.playuiNode.cutCardView);
        }

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(5);    

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn(true, [[0.036, 0], [0.84, 0.95], [0, 0]], [[0.036, 0], [0.84, 0.95], [0, 0]]);

        //托管层
        this.trustLayer = new TrustLayer_ziPai();
        this.addChild(this.trustLayer);
        this.trustLayer.visible = false;

        return true;
    },

    resetJiaZhuTip: function()
    {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.jushou)
            return;
        var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        for (var i = 0; i < MjClient.MaxPlayerNum_ahPaoHuZi; i ++)
        {
            var pl = getUIPlayer_ahPaoHuZi(i);
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
    }
});

PlayLayer_ahPaoHuZi.jsBindLeftCopy = PlayLayer_ahPaoHuZi.prototype.jsBind.left;

//重置手牌的顺序
PlayLayer_ahPaoHuZi.prototype.ResetHandCard = function(posNode,off, needAction, isDelay){

    needAction = needAction === undefined ? false : needAction;
    // needAction = false;

    if(off == 0){
        resetHandCard_ahPaoHuZiEx(posNode,off, needAction, isDelay);
    }else if(MjClient.rePlayVideo != -1 && off != 0){
        cc.log(posNode.getName());
        var handNode = posNode.getChildByName("replayNode");
        handNode.visible = true;
        handNode.removeAllChildren();
        var cardArr = MjClient.OtherHandArr[off];
        if(!cardArr){
            return;
        }
        //清理空数组
        for(var k = cardArr.length - 1;k >=0;k--){
            if(cardArr[k].length == 0){
                cardArr.splice(k,1);
            }
        }
        for(var k = 0;k < cardArr.length;k++){
            var groupList = cardArr[k];
            for(var j = 0;j < groupList.length;j++){
                addHandCardReplay_ahPaoHuZi(k,j,groupList[j],off);
            }
        }       
    }
};

//回放时其他家补牌重置手牌的处理
PlayLayer_ahPaoHuZi.prototype._doPickResetHandCardForPlayBack = function(msg, off){
    var pl = getUIPlayer_ahPaoHuZi(off);

    var handArr;
    if(msg.uid == pl.info.uid) {
        handArr = MjClient.OtherHandArr[off];
    }
    if (handArr){
        var mjhand = [];
        for (var i = 0; i < handArr.length; ++i){
            mjhand = mjhand.concat(handArr[i]);
        }
        mjhand.push(msg.card);
        pl.mjhand = mjhand;
    }

    MjClient.OtherHandArr[off] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
};

PlayLayer_ahPaoHuZi.prototype._doMovetoAction = function(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.3,endP);
    node.runAction(ac);
};

PlayLayer_ahPaoHuZi.prototype.ResetOtherCard = function(posNode, off) {
    //添加吃、碰、跑、偎、提
    var sData = MjClient.data.sData;
    var tData = null;
    if (sData) {
        tData = sData.tData;
    }

    var eatNode = posNode.getChildByName("eatNode");
    eatNode.visible = true;
    eatNode.removeAllChildren();
    var pl = getUIPlayer_ahPaoHuZi(off);
    if (!pl) return;
    var mjSortArr = pl.mjsort;
    cc.log("=====off=====:" + off + "mjSortArr:" + JSON.stringify(mjSortArr));
    if (mjSortArr) {
        var childArr = null;

        //提/偎牌的特殊处理
        var callback = function(childList) {
            var cardNum = pl.mjwei[pos];
            var skipPeng = pl.skipPeng;
            for (var i = 0; i < childList.length; i++) {
                var child = childList[i];
                //if(pl.info.uid == SelfUid() || (tData && TableState.roundFinish == tData.tState) || i==0){
                if ((i == 0 && off != 0) || (i == childList.length - 1 && off == 0)) {
                    // var shade = new cc.Sprite("playing/paohuzi/huxiBG1.png");
                    // shade.opacity = 100;
                    // shade.x = shade.width/2;
                    // shade.y = shade.height/2;
                    // child.addChild(shade);
                } else {
                    child.loadTexture(MjClient.cardPath_ahPaoHuZi + "huxiBG.png");
                }
            }
        };

        for (var k = 0; k < mjSortArr.length; k++) {
            var mjsort = mjSortArr[k];
            var pos = mjsort.pos;
            var name = mjsort.name;
            //提
            if (name == "mjgang1") {
                var cardNum = pl.mjgang1[pos];
                for (var i = 0; i < 4; i++) {
                    addEatCard_ahPaoHuZi(posNode, "mjgang1" + k, cardNum, off);
                }

                var tiParentNode = eatNode.getChildByName("mjgang1" + k);
                var childArr = tiParentNode.children;
                callback(childArr);
            }
            //偎
            if (name == "mjwei") {
                var cardNum = pl.mjwei[pos];
                for (var i = 0; i < 3; i++) {
                    addEatCard_ahPaoHuZi(posNode, "mjwei" + k, cardNum, off);
                }

                var weiParentNode = eatNode.getChildByName("mjwei" + k);
                var childArr = weiParentNode.children;
                var skipPeng = pl.skipPeng;
                if(MjClient.majiang.getCardShowType(pl.info.uid, cardNum) != 2){
                    //callback(childArr);
                    for(var i = 0;i < childArr.length;i++){
                        var child = childArr[i];
                        if(off == 0){
                            var shade = new cc.Sprite("playing/paohuzi/huxiBG1.png");
                            shade.opacity = 100;
                            shade.x = shade.width / 2;
                            shade.y = shade.height / 2;
                            child.addChild(shade);
                        }else{
                            child.loadTexture(MjClient.cardPath_ahPaoHuZi+"huxiBG.png");
                        }
                    }
                }else{
                    callback(childArr);
                }
            }
            //跑
            if (name == "mjgang0") {
                var cardNum = pl.mjgang0[pos];
                for (var i = 0; i < 4; i++) {
                    addEatCard_ahPaoHuZi(posNode, "mjgang0" + k, cardNum, off);
                }
            }
            //碰
            if (name == "mjpeng") {
                var cardNum = pl.mjpeng[pos];
                for (var i = 0; i < 3; i++) {
                    addEatCard_ahPaoHuZi(posNode, "mjpeng" + k, cardNum, off);
                }
            }
            //吃
            if (name == "mjchi") {
                var cardNum = pl.mjchi[pos];
                var eatCards = pl.mjchi[pos].eatCards;
                for (var i = 0; i < eatCards.length; i++) {
                    addEatCard_ahPaoHuZi(posNode, "mjchi" + k, eatCards[i], off);
                }
                var biCards = pl.mjchi[pos].biCards;
                if (biCards && biCards.length > 0) {
                    for (var i = 0; i < biCards.length; i++) {
                        var biArr = biCards[i];
                        for (var m = 0; m < biArr.length; m++) {
                            addEatCard_ahPaoHuZi(posNode, "mjbi" + k + i, biArr[m], off);
                        }
                    }
                }

                var mjchiCardArr = pl.mjchiCard;
                var chiParentNode = eatNode.getChildByName("mjchi" + k);
                if (chiParentNode) {
                    var childArr = chiParentNode.children;
                    // for(var i = 0;i < childArr.length;i++){
                    //     if(childArr[i].tag == mjchiCardArr[pos] && ){
                    //         childArr[i].setColor(cc.color(170, 170, 170));
                    //         break;
                    //     }
                    // }
                    // 耒阳吃牌放在最上面一张
                    if (childArr.length > 0 && childArr[childArr.length - 1].tag == mjchiCardArr[pos]) {
                        childArr[childArr.length - 1].setColor(cc.color(170, 170, 170));
                    }
                }

                if (biCards && biCards.length > 0) {
                    for (var i = 0; i < biCards.length; i++) {
                        var chiParentNode = eatNode.getChildByName("mjbi" + k + i); // "mjbi32"
                        if (chiParentNode) {
                            var childArr = chiParentNode.children;
                            // for(var m = 0;m < childArr.length;m++){
                            //     if(childArr[m].tag == mjchiCardArr[pos]){
                            //         childArr[m].setColor(cc.color(170, 170, 170));
                            //         break;
                            //     }
                            // }

                            // 比牌放在最上面一张
                            if (childArr.length > 0 && childArr[childArr.length - 1].tag == mjchiCardArr[pos]) {
                                childArr[childArr.length - 1].setColor(cc.color(170, 170, 170));
                            }
                        }
                    }
                }
            }
        }
    }

    //添加打出的牌
    //var outNode = posNode.getChildByName("outNode");
    //outNode.visible = true;
    //outNode.removeAllChildren();
    //var sData = MjClient.data.sData;
    //var tData = sData.tData;
    //var curUId = tData.uids[tData.curPlayer];
    //for(var i = 0; i < pl.mjput.length; i++){
    //    if(curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]){
    //        continue;
    //    }
    //    var childCount = outNode.childrenCount;
    //    var outCard = getNewCard_ahPaoHuZi(pl.mjput[i], 2, off);
    //    if(off == 0){
    //        outCard.anchorX = 1;
    //        outCard.anchorY = 0;
    //        outCard.x = outNode.width - childCount * outCard.width;
    //        outCard.y = 0;
    //    }else if(off == 1){
    //        outCard.anchorX = 1;
    //        outCard.anchorY = 1;
    //        outCard.x = outNode.width - childCount * outCard.width;
    //        outCard.y = outNode.height;
    //    }else if(off == 2){
    //        outCard.anchorX = 0;
    //        outCard.anchorY = 1;
    //        outCard.x = childCount * outCard.width;
    //        outCard.y = outNode.height;
    //    }
    //    outNode.addChild(outCard);
    //}
};
PlayLayer_ahPaoHuZi.prototype.ResetPutCard = function(posNode,off){
    //添加打出的牌
    var pl = getUIPlayer_ahPaoHuZi(off);
    if (!pl || !pl.mjput) return;
    var outNode = posNode.getChildByName("outNode");
    outNode.visible = true;
    outNode.removeAllChildren();
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var curUId = tData.uids[tData.curPlayer];

    var type = ziPai.getUiLayoutType();
    var index = 0;
    for (var i = 0; i < pl.mjput.length; i++) {
        // if (curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]) {
        //     continue;
        // }

        var outCard = getNewCard_ahPaoHuZi(pl.mjput[i], 2, off);
        var childCount = outNode.childrenCount;
        outNode.addChild(outCard);


        setPutCardPos_ahPaoHuZi(outNode, outCard, i, off);
        // if (type == 0 && MjClient.data.sData.tData.maxPlayer < 4) { //新布局 偏右
        //     var ty = 0;
        //     if (index >= 5) {
        //         index = 0;
        //         ty = outCard.height * Math.floor(childCount / 5);
        //     }

        //     var outCard = getNewCard_ahPaoHuZi(pl.mjput[i], 2, off);
        //     if (off == 0) {
        //         outCard.anchorX = 1;
        //         outCard.anchorY = 0;
        //         outCard.x = outNode.width - index * outCard.width;
        //         outCard.y = ty;
        //     } else if (off == 1) {
        //         outCard.anchorX = 1;
        //         outCard.anchorY = 1;
        //         outCard.x = outNode.width - index * outCard.width;
        //         outCard.y = outNode.height + ty;
        //     } else if (off == 2) {
        //         outCard.anchorX = 0;
        //         outCard.anchorY = 1;
        //         outCard.x = index * outCard.width;
        //         outCard.y = outNode.height + ty;
        //     }
        //     index += 1;
        // } else {
        //     if (off == 0) {
        //         outCard.anchorX = 1;
        //         outCard.anchorY = 0;
        //         outCard.x = outNode.width - childCount * outCard.width;
        //         outCard.y = 0;
        //     } else if (off == 1) {
        //         outCard.anchorX = 1;
        //         outCard.anchorY = 1;
        //         outCard.x = outNode.width - childCount * outCard.width;
        //         outCard.y = outNode.height;
        //     } else if (off == 2) {
        //         outCard.anchorX = 0;
        //         outCard.anchorY = 1;
        //         outCard.x = childCount * outCard.width;
        //         outCard.y = outNode.height;
        //     }
        // }

        // 当前展示的牌 弃牌中先添加,隐藏
        if (curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]) {
            outCard.visible = false;
            var tmpNode = new cc.Node();
            outCard.addChild(tmpNode);

            var jsBind = { // 有人要移除 没人要显示
                _event: {
                    HZPickCard: function() {
                        outCard.removeFromParent(true);
                    },
                    HZChiCard: function() {
                        outCard.removeFromParent(true);
                    },
                    MJPeng: function() {
                        outCard.removeFromParent(true);
                    },
                    HZWeiCard: function() {
                        outCard.removeFromParent(true);
                    },
                    HZGangCard: function(eD) {
                        if (eD.type == 1 && eD.isGangHand) {
                            return;
                        }
                        outCard.removeFromParent(true);
                    },
                    HZNewCard: function() {
                        this.removeFromParent(true);
                    },
                }
            };
            BindUiAndLogic(tmpNode, jsBind);
        }
    }
};

//重置牌的顺序
PlayLayer_ahPaoHuZi.prototype.CardLayoutRestore = function(posNode,off){
    if(MjClient.rePlayVideo == -1){
        this.ResetHandCard(posNode,off,true);
    }else{
        //回放时不执行发牌动画
        this.ResetHandCard(posNode,off);
    }
    this.ResetOtherCard(posNode,off);
    this.ResetPutCard(posNode,off);
};

// 判断吃、碰、跑、偎、提、胡的状态
PlayLayer_ahPaoHuZi.prototype.EatVisibleCheck = function(off){
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
    eat.cancel._node.visible = false;
    eat.wangDiao._node.visible = false;
    eat.wangChuang._node.visible = false;
    eat.wangZha._node.visible = false;
    eat.chiSelect._node.visible = false;
    eat.biSelect._node.visible = false;
    eat.biSelect1._node.visible = false;
    eat.chiBg._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
    eat.wangDiao._node.setTouchEnabled(false);
    eat.wangChuang._node.setTouchEnabled(false);
    eat.wangZha._node.setTouchEnabled(false);
    eat.chiSelect._node.setTouchEnabled(false);
    eat.biSelect._node.setTouchEnabled(false);
    eat.biSelect1._node.setTouchEnabled(false);
    
    var pl = sData.players[SelfUid() + ""];
    if (!pl) return;
    MjClient.gangCards = [];
    MjClient.eatpos = [];
    var mj = MjClient.majiang;
    //吃碰杠胡node
    var vnode = [];
    //自摸getUIPlayer_ahPaoHuZi
    if(tData.tState != TableState.roundFinish && pl.mjState != TableState.roundFinish){
        if(IsTurnToMe()){
            //王炸
            if(pl.wangType == 4 && !(pl.eatFlag & 32)){
                vnode.push(eat.wangZha._node);
            }
            //王闯
            if(pl.wangType == 2 && !(pl.eatFlag & 32)){
                vnode.push(eat.wangChuang._node);
            }
            //王钓
            if(pl.wangType == 1 && !(pl.eatFlag & 32)){
                vnode.push(eat.wangDiao._node);
            }
            //提
            if(pl.eatFlag & 16) {
                return;
            }
            //偎
            if(pl.eatFlag & 8){
                return;
            }
            //胡
            if(pl.eatFlag & 32){
                if(pl.wangType !=0 && pl.wangStatus){
                    pl.wangType = 0;
                    MJHuToServer_ahPaoHuZi();
                    return;
                }else if(!pl.wangStatus){
                    vnode.push(eat.hu._node);
                }
            }
            //跑牌
            if(pl.eatFlag & 4){
                //其他玩家不能胡的情况下才能跑
                var canHu = false;
                for(var uid in sData.players){
                    if(pl.uid != uid){
                        var p = sData.players[uid + ""];
                        if(p.eatFlag & 32){
                            canHu = true;
                        }
                    }
                }
                if(!canHu){
                    // HZGangToServer_ahPaoHuZi(2);
                    return;
                }
            }
            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            } 

            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
        }
        if(!IsTurnToMe()){
            //胡
            if(pl.eatFlag & 32){
                vnode.push(eat.hu._node);
            }
            //吃
            if(pl.eatFlag & 1){
                    vnode.push(eat.chi._node);
            } 
            //碰
            if(pl.eatFlag & 2){
                vnode.push(eat.peng._node);
            }
            //如果，有跑，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
        }
    }

    //吃碰杠胡过处理
    if(vnode.length > 0){
        var btnImgs ={
            "peng": ["playing/anhuapaohuzi/youxizhong-27.png", "playing/anhuapaohuzi/youxizhong-27.png"],
            "gang": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi": ["playing/anhuapaohuzi/youxizhong-274.png", "playing/anhuapaohuzi/youxizhong-274.png"],
        }

        for(var i = 0; i < vnode.length; i++){
            vnode[i].visible = true;
            vnode[i].setTouchEnabled(true);
            vnode[i].setBright(true);
            if(vnode[i].getChildByName("card1")){
                vnode[i].getChildByName("card1").visible = false;
            }

            if(vnode[i].getChildByName("bgground")){
                vnode[i].getChildByName("bgground").visible = false;
            }

            if(vnode[i].getChildByName("bgimg")){
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if(btnName == "peng" || btnName == "chi0" || btnName == "gang0"){
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if(i == 0){
                var cardVal = 0;
                if(vnode[i].getChildByName("bgimg")){
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if(btnName == "peng" || btnName == "chi0" || btnName == "gang0"){
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if(btnName == "peng"){
                    cardVal = tData.lastPutCard;
                }
                else if(btnName == "chi0"){
                    if(MjClient.eatpos.length == 1){
                        cardVal = tData.lastPutCard;
                    }
                }
                else if(btnName == "gang0"){
                    if(MjClient.gangCards.length == 1){
                        cardVal = MjClient.gangCards[0];
                    }
                }
                else if(btnName == "hu"){
                    if(IsTurnToMe()){
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    }else{
                        cardVal = tData.lastPutCard;
                    }
                }

                if(cardVal && cardVal > 0){
                    // setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    // vnode[0].getChildByName("card1").visible = true;
                }

                if(vnode[0].getChildByName("bgground")){
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if(vnode[0].getChildByName("bgground")){
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if(vnode[i].getChildByName("card1")){
                    vnode[i].getChildByName("card1").visible = false;
                }
            }
            // setWgtLayout(vnode[i], [0, 0.16], [0.5, 0.3], [(1 - vnode.length) / 1.6 + i * 1.6, 1.8], false, false);
            setWgtLayout(vnode[i], [0, 0.20], [0.5, 0.18], [ (i - (vnode.length - 1) / 2) * 1.3, 1.8], false, false);
            if(ziPai.getUiLayoutType() == 0){
                setWgtLayout(vnode[i], [0, 0.20], [0.88 - (vnode.length - 1 - i) * 0.12, 0.11], [ 0, 1.8], false, false);
            }
        }
    }
};

PlayLayer_ahPaoHuZi.prototype.showAndHideHeadEffect = function(){
    console.log("xw showCountdown 1");

    var arr = [this._downNode, this._rightNode, this._topNode];
    var tData = MjClient.data.sData.tData;
    var uids = tData.uids;

    var curPlayerNode = null;
    if (curPlayerIsMe_ahPaoHuZi(0)){
        curPlayerNode = arr[0].getChildByName("head");
    }
    else if (curPlayerIsMe_ahPaoHuZi(1)){
        curPlayerNode = arr[1].getChildByName("head");
    }else if (curPlayerIsMe_ahPaoHuZi(2)){
        curPlayerNode = arr[2].getChildByName("head");
    }

    
    if (curPlayerNode)
    {   
        var tag = 2018322;
        this._downNode.getChildByName("head").removeChildByTag(tag, true);
        this._rightNode.getChildByName("head").removeChildByTag(tag, true);
        this._topNode.getChildByName("head").removeChildByTag(tag, true);

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
        _armature.setPosition(curPlayerNode.width/2, curPlayerNode.height/2 + 16);
        _armature.setTag(tag);
        _armature.getAnimation().setSpeedScale(0.35);
        curPlayerNode.addChild(_armature);

        //托管倒计时
        this.showCountdown(curPlayerNode);
    }
};

PlayLayer_ahPaoHuZi.prototype.showAndHideTrust = function(node, uiOff){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_ahPaoHuZi(uiOff);
    if(!pl){
        return;
    }
    var head = node.getChildByName("head");
    var trust = head.getChildByName("trust");
    if(pl.trust){
        trust.visible = true;
    }else{
        trust.visible = false;
    }

    if(this.trustLayer){
        var pl = getUIPlayer_ahPaoHuZi(0);
       if(pl.trust && MjClient.data.sData.tData.tState != TableState.roundFinish){
            this.trustLayer.visible = true;
            //关闭弹框提示
            // closeNewPopMsgView(function(){
            //     MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
            // });
            MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
            if(MjClient.movingCard_paohuzi && cc.sys.isObjectValid(MjClient.movingCard_paohuzi)){
                MjClient.movingCard_paohuzi.removeFromParent(true);
            }
            MjClient.movingCard_paohuzi = null;
            delete MjClient.moveCard;
        }else{
            this.trustLayer.visible = false;
        }
    }
};

PlayLayer_ahPaoHuZi.prototype.showCountdown = function(node){
    var timeTxt = this._downNode.getChildByName("head").getChildByName("trustTime")
    timeTxt.setString("");
    timeTxt.unscheduleAllCallbacks();
    timeTxt = this._rightNode.getChildByName("head").getChildByName("trustTime");
    timeTxt.setString("");
    timeTxt.unscheduleAllCallbacks();
    timeTxt = this._topNode.getChildByName("head").getChildByName("trustTime");
    timeTxt.setString("");
    timeTxt.unscheduleAllCallbacks();

    console.log("xw showCountdown 2");
    timeTxt = node.getChildByName("trustTime");
    timeTxt.visible = true;
    if(MjClient.rePlayVideo == -1){
        var time = util.Timer.getCountdownByTime(MjClient.data.sData.tData.trustEnd);
        console.log("====time:", time);
        if(time > 0){
            timeTxt.schedule(function(){
                var time = util.Timer.getCountdownByTime(MjClient.data.sData.tData.trustEnd);
                this.setString("" + time);
                if(time <= 0){
                    this.setString("");
                    this.unscheduleAllCallbacks();
                }
            },1);
        }else{
            timeTxt.setString("");
            timeTxt.unscheduleAllCallbacks();
        }
    }
};