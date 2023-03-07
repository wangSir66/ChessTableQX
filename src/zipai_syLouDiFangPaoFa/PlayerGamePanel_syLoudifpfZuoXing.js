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
function SetUserVisible_syLoudifpfZuoXing(node, off){
    var pl = getUIPlayer_xiangxiang(off);
    cc.log("====================off======================" + off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var headBox = head.getChildByName("headBox");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var thishuxi = head.getChildByName("thishuxi");
    var huxi = head.getChildByName("huxi");
    var total_huxi = head.getChildByName("total_huxi");
    var totalhuxi = head.getChildByName("totalhuxi");
    if(pl){
        name.visible = true;
        coin.visible = true;
        offline.visible = false;
        nobody.visible = true;
        headBox.visible = true;
        name_bg.visible = false;
        score_bg.visible = false;
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline_hengYang(node, off);
        // InitUserHandUI_syLoudifpfZuoXing(node, off);
        // cc.log("pl.info.uid = "+pl.info.uid);
    }else{
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        headBox.visible = false;
        thishuxi.visible = false;
        huxi.visible = false;
        total_huxi = false;
        totalhuxi = false;

        nobody.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead){
            WxHead.removeFromParent(true);
        }
    }
}

//设置玩家牌桌上的信息(只有自己才设置手牌，其他玩家不需要设置)
function InitUserHandUI_syLoudifpfZuoXing(node, off){
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer_xiangxiang(off);

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
            MjClient.playui._jiazhuWait.visible = false;
        }
    }else if(pl.jiazhuNum == 1){
        // MjClient.majiang.setJiaZhuNum(node, getUIPlayer_xiangxiang(off));
    }

    if (MjClient.rePlayVideo != -1) {
         MjClient.playui._jiazhuWait.visible = false;
    }

    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard && tData.tState != TableState.waitJiazhu){
        return;
    }

    //添加手牌
    if(MjClient.rePlayVideo == -1){
        //表示正常游戏
        if(pl.mjhand && off == 0){
            cc.log("pl.mjhand====:" + pl.mjhand);
            MjClient.HandCardArr = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
            var selfIndex = tData.uids.indexOf(SelfUid());
            if(off == 0 && selfIndex == tData.xingPlayer){
                node = MjClient.playui._downNode;
            }
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

var PlayLayer_syLoudifpfZuoXing = cc.Layer.extend({
    jsBind: {
        _event: {
            startShuffleCards:function (d) {
                checkCanShowDistance();
            },
            mjhand: function() {
                if(MjClient.endoneui != null)
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
                        ip2pl[ip].push(unescape(pi.info.nickname));
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
                    // AlertSameIP(ipmsg.join("\n"));
                }
                mylog("ipmsg " + ipmsg.length);

                //距离位置显示
                checkCanShowDistance();

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
                    this.addChild(new GameOverLayer_syLoudi(),500);
                }else{
                    MjClient.Scene.addChild(new StopRoomView());
                }    
            },
            roundEnd: function() {
                var self = this;
                function delayExe(){
                    var sData = MjClient.data.sData;
                    resetEatActionAnim_xiangxiang();
                    if (sData.tData.roundNum <= 0){
                        var layer = new GameOverLayer_syLoudi();
                        layer.setVisible(false);
                        self.addChild(layer,500);
                    }
                    if(!MjClient.endoneui){
                        self.addChild(new EndOneView_SYldfpf(),500);//EndOneView_xxghz()
                    }
                }
                this._delayExeAction = this.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(delayExe)));

                MjClient.playui.showAndHideHeadEffect();
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                //tableStartHeadMoveAction_xiangxiang(this);   //不涉及到头像移动动作
            },
            initSceneData: function() {
                if (this._delayExeAction && cc.sys.isObjectValid(this._delayExeAction)){
                    this.stopAction(this._delayExeAction);
                    delete this._delayExeAction;
                }
                //关闭弹框提示
                closeNewPopMsgView(function(){
                    var tData = MjClient.data.sData.tData;
                    var status = tData.tState != TableState.waitPut && tData.tState != TableState.waitEat &&
                                 tData.tState != TableState.waitCard && tData.tState != TableState.waitJiazhu;
                    if(!status){
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
                    }
                });
                
                reConectHeadLayout_xiangxiang(this);        //涉及到头像移动动作
                CheckRoomUiDelete();
                if(MjClient.MaxPlayerNum_xiangxiang != 2){
                    tableStartHeadMoveAction_xiangxiang(this);   //不涉及到头像移动动作
                }

                MjClient.playui.showAndHideHeadEffect();
            },
            MJChat : function(data){
                if(data.type == 4){
                    //距离位置显示
                    checkCanShowDistance();
                }
            },
            removePlayer: function(eD) {
                //距离位置显示
                checkCanShowDistance();
            },            
            addPlayer:function () {
                if(MjClient.MaxPlayerNum_xiangxiang != 2){
                    tableStartHeadMoveAction_xiangxiang(this);   //不涉及到头像移动动作
                }
            },
            onlinePlayer: function() {
                reConectHeadLayout_xiangxiang(this);        //涉及到头像移动动作
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
                changeMJBg_xiangxiang(this, ziPai.getZiPaiType());
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
            EZP_tingPai :function(){   
                calculateHintPutList_hengYang();
                addTingSign_hengYang(MjClient.playui._downNode); 
                MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
                // MjClient.playui.tingLayer.visible = (ziPai.getTingPaiType() == 1);
            },
            EZP_layout : function(){
                if(MjClient.data.sData.tData.maxPlayer < 4){
                    ziPai.changePlayUILayout(MjClient.playui.playuiNode);
                    MjClient.playui.ResetPutCard(MjClient.playui._downNode, 0);
                    MjClient.playui.ResetPutCard(MjClient.playui._xingNode, 1);
                    MjClient.playui.ResetPutCard(MjClient.playui._rightNode, 2);
                    MjClient.playui.ResetPutCard(MjClient.playui._topNode, 3);
                }
            }
        },
        cardNumImg: {
            _visible : false,
            _run:function () {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this,[0.085, 0.085], [0.5, 0.73], [0, 0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible_xiangxiang();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible_xiangxiang();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardNumImg:{
                _event:{
                    initSceneData:function(){
                        if(!IsArrowVisible_xiangxiang()){
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
                           for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                           }
                        } 
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
                           for(var i = 1;i <= next;i++){
                                var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                child.setPosition(cc.p(this.width/2,this.height/2 + i * 0.8));
                                this.addChild(child);
                           }
                        }                     
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
                            if(childNum +1 > next){
                                children[childNum - 1].removeFromParent(true);
                            }
                        } 
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
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        this.y = 40 + next * 0.8
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    initSceneData : function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        this.y = 40 + next * 0.8
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZNewCard: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        this.y = 40 + next * 0.8
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                    },
                    HZCardNum: function() {
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                        this.y = 40 + next * 0.8
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
                //     text.setFontName("fonts/fzcy.ttf");
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
            _layout: [[0.19, 0.19],[0.5, 0.49],[0, 0]]
        },
        roundInfo:{
            _run:function(){
                setWgtLayout(this, [0.11, 0.11],[0.5, 0.62],[0, 0]);

                var tData = MjClient.data.sData.tData;
                var str = "";
                var score_tuo = tData.areaSelectMode.fenshutuo;
                str += (tData.areaSelectMode.payWay == 0) ? "房主/" : "AA/" ;
                if(tData.areaSelectMode.convertible){
                    str += "自由人数/";
                }else{
                    str += tData.areaSelectMode.zuoXing ? "四人坐醒/" : "";
                }
                str += (tData.areaSelectMode.fullperson == true) ? "满人开始/" :"" ;
                str += (tData.areaSelectMode.convertible && tData.areaSelectMode.isMaiPai == true) ? "2人埋牌20张/" : "";

                str += "首局" + (tData.areaSelectMode.zuoZhuang == 0 ? "随机庄/" : "房主庄/");

                if (tData.areaSelectMode.minHuType == 1) {
                    str += "10胡起胡/有炮必接/满百结算/";
                } else {
                    str += "15胡起胡/有炮必接/满百结算/";
                }
                str += (tData.areaSelectMode.isfending == 0) ? "四百封顶/" :"两百封顶/" ;
                str += (tData.areaSelectMode.tuototuo == 0) ? "不打鸟/" : (tData.areaSelectMode.tuototuo == 2) ? "胡息打鸟/" : "打鸟" + score_tuo + "分/";
                str += (tData.areaSelectMode.isjiepao == 1) ? "接炮一百封顶/" :"接炮不封顶/" ;

                if(tData.areaSelectMode.fanBei == 0){
                    str += "不翻倍";
                }else if(tData.areaSelectMode.fanBei == 1){
                    str += "≤50分翻倍";
                }else if(tData.areaSelectMode.fanBei == 2){
                    str += "≤100分翻倍";
                }else if(tData.areaSelectMode.fanBei == 3){
                    str += "≤150分翻倍";
                }else if(tData.areaSelectMode.fanBei == 4){
                    str += "≤200分翻倍";
                }else if(tData.areaSelectMode.fanBei == 5){
                    str += "不限分翻倍";
                }

                str += (tData.areaSelectMode.trustTime == -1) ? "" :"/托管" ;
                str += (tData.areaSelectMode.keSiShou) ? "/可死守" :"" ;
                str += (tData.areaSelectMode.piaohu) ? "/飘胡" :"" ;

                this.ignoreContentAdaptWithSize(true);
                var strPayWay = "";
                var str5 = strPayWay;
                this.setString(str + str5);
                if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                    this.visible = false;
                }
            }
        },
        jiazhuWait:{
            _visible:false,
            _layout: [[0.25, 0.06],[0.5, 0.5],[0, -3]]
        },
        operateWait:{
            _visible:false,
            _layout: [[0.37, 0.09],[0.5, 0.67],[0, 0]],

            _run:function () {
                var i = 1;
                var str = "";
                var str2 = "提示：对方可能正在思考，请等待";

                var callback = function(){
                    switch(i){
                            case 1:
                                str = ".";
                                i++ ;
                                break;
                            case 2:
                                str = "..";
                                i++ ;
                                break;
                            case 3:
                                str = "...";
                                i = 1;
                                break;
                    }
                    this.setString(str2 + str);
                }.bind(this);
                var action = cc.callFunc(callback);

                this.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.7),action)));
            },
            _event:{  
                initSceneData: function(eD) {
                    if(MjClient.MaxPlayerNum_xiangxiang == 2 && curPlayerIsMe_xiangxiang(1) && MjClient.playui._rightTime.getString() == "0"){
                        this.visible = true;
                    }
                    else if(MjClient.MaxPlayerNum_xiangxiang == 3 && curPlayerIsMe_xiangxiang(1) && MjClient.playui._rightTime.getString() == "0"){
                        this.visible = true;
                    }
                    else if(MjClient.MaxPlayerNum_xiangxiang == 3 && curPlayerIsMe_xiangxiang(2) && MjClient.playui._leftTime.getString() == "0"){
                        this.visible = true;
                    }
                    else{
                        this.visible = false;
                    }
                },
                mjhand: function(eD) {
                    this.visible = false;
                },
                onlinePlayer: function(eD) {
                    if(MjClient.MaxPlayerNum_xiangxiang == 2 && curPlayerIsMe_xiangxiang(1) && MjClient.playui._rightTime.getString() == "0"){
                        this.visible = true;
                    }
                    else if(MjClient.MaxPlayerNum_xiangxiang == 3 && curPlayerIsMe_xiangxiang(1) && MjClient.playui._rightTime.getString() == "0"){
                        this.visible = true;
                    }
                    else if(MjClient.MaxPlayerNum_xiangxiang == 3 && curPlayerIsMe_xiangxiang(2) && MjClient.playui._leftTime.getString() == "0"){
                        this.visible = true;
                    }
                    else{
                        this.visible = false;
                    }
                },
                waitPut: function(eD) {
                    this.visible = false;
                },
                HZNewCard: function(ed){
                    this.visible = false;
                },
                MJPeng: function(eD) {
                    this.visible = false;
                },
                HZChiCard: function(eD) {
                    this.visible = false;
                },
                HZGangCard: function(eD) {
                    this.visible = false;
                },
                HZWeiCard: function(eD) {
                    this.visible = false;
                },
                MJPut: function(eD){
                    this.visible = false;
                },
                roundEnd: function(eD){
                    this.visible = false;
                }
            },
        },
        banner: {
            _layout: [[0.35, 0.35],[0.5, 1],[0, 0]],
            _run: function() {
                // setWgtLayout(this, [0.5, 0.5],[0.5, 1],[0, 0]);
                    // if (getCurrentGameBgType() != 0)
                    //     changeGameTitleBg(this);
                },
            _event: {
                changeGameBgEvent: function() {
                    // changeGameTitleBg(this);
                }
            },            
            wifi: {
                _run: function() {
                    updateWifiState(this);
                }
            },
            bg_time:{
                 _run:function()
                {
                    // var text = new ccui.Text();
                    // text.setFontName("fonts/fzcy.ttf");
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
                    this.schedule(function(){
                        var time = MjClient.getCurrentTime();
                        var str = (time[3]<10?"0"+time[3]:time[3])+":"+
                            (time[4]<10?"0"+time[4]:time[4]);
                        this.setString(str);
                    });
                    this.visible = false;
                }

            },
            powerBar: {
                _run: function() {
                    updateBattery(this);
                    this.visible = false;
                    this.parent.getChildByName("power_9").visible = false;
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
                    /*
                     复制房间号-----------------------
                     */
                    var tData = MjClient.data.sData.tData;
                    var str = "";
                    var score_tuo = tData.areaSelectMode.fenshutuo;
                    str += (tData.areaSelectMode.payWay == 0) ? "房主," : "AA," ;
                    if(tData.areaSelectMode.convertible){
                        str += "自由人数,";
                    }else{
                        str += tData.areaSelectMode.zuoXing ? "四人坐醒," : "";
                    }
                    str += "15胡起胡,有炮必接,满百结算,";
                    str += (tData.areaSelectMode.isfending == 0) ? "四百封顶," :"两百封顶," ;
                    str += (tData.areaSelectMode.tuototuo == 0) ? "不打鸟," : (tData.areaSelectMode.tuototuo == 2) ? "胡息打鸟," : "打鸟" + score_tuo + "分,";
                    str += (tData.areaSelectMode.isjiepao == 0) ? "接炮不封顶," :"接炮一百封顶," ;

                    if(tData.areaSelectMode.fanBei == 0){
                        str += "不翻倍,";
                    }else if(tData.areaSelectMode.fanBei == 1){
                        str += "≤50分翻倍,";
                    }else if(tData.areaSelectMode.fanBei == 2){
                        str += "≤100分翻倍,";
                    }else if(tData.areaSelectMode.fanBei == 3){
                        str += "≤150分翻倍,";
                    }else if(tData.areaSelectMode.fanBei == 4){
                        str += "≤200分翻倍,";
                    }else if(tData.areaSelectMode.fanBei == 5){
                        str += "不限分翻倍,";
                    }

                    var sData = MjClient.data.sData;
                    var str7 = "  二缺一";
                    if((MjClient.MaxPlayerNum_xiangxiang - Object.keys(sData.players).length) == 2){
                        str7 = "  一缺二";
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
                    var str6 = str7+",速度加入【"+AppCnName[MjClient.getAppType()]+"】\n" + "(复制此消息打开游戏可直接进入该房间)";
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
                    var settringLayer = new ZiPaiSettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                }
            },
            changeBg: {
                _run: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                        this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                        this.setContentSize(this.getNormalTextureSize());
                    }
                },
                _click: function() {
                    if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                        postEvent("EZP_rule");
                    }else {
                        setCurrentGameBgTypeToNext();
                        postEvent("changeGameBgEvent");
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Pifu", {uid:SelfUid(),gameType:MjClient.gameType});
                    }
                }
            },
            back_btn: {
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
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
            gps_btn: {
                //_layout: [[0.09, 0.09],[0.38, 0.93],[0, 0]],
                _click: function() {
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {uid: SelfUid()});
                    if(MjClient.MaxPlayerNum_xiangxiang == 3){
                        MjClient.Scene.addChild(new showDistance3PlayerLayer());
                    }else if(MjClient.MaxPlayerNum_xiangxiang == 4){
                        MjClient.Scene.addChild(new showDistanceLayer());
                    }
                }
            },
            Button_1: {
                _visible : true,
                _click: function() {
                    MjClient.openWeb({url:MjClient.GAME_TYPE.SU_QIAN,help:true});
                }
            },
            roundnumImg: {
                _run:function () {
                    MjClient.roundnumImgNode = this;
                    //setWgtLayout(this,[0.1, 0.1], [0.5, 0.57], [0, 0]);
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsArrowVisible_xiangxiang();
                    },
                    mjhand: function(eD) {
                        this.visible = IsArrowVisible_xiangxiang();
                    },
                    onlinePlayer: function(eD) {
                        this.visible = IsArrowVisible_xiangxiang();
                    }
                },
                roundnumAtlas: {
                    _run:function () {
                        this.ignoreContentAdaptWithSize(true);
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return ("第" + (tData.roundAll - tData.roundNum + 1).toString()+"局");
                    },
                    _event: {
                        mjhand: function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum + 1).toString()+"局");
                        },
                        initSceneData: function(eD) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum + 1).toString()+"局");
                        },
                    }
                }
            },
            roundnumAtlas_0: {
                _event: {
                    initSceneData: function(eD) {
                        this.visible = !IsArrowVisible_xiangxiang();
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum).toString()+"局");
                    },
                    mjhand: function(eD) {
                        this.visible = !IsArrowVisible_xiangxiang();
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum).toString()+"局");
                    },
                    onlinePlayer: function(eD) {
                        this.visible = !IsArrowVisible_xiangxiang();
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) return this.setString("第" + (tData.roundAll - tData.roundNum).toString()+"局");
                    }
                },
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
            //         if((MjClient.MaxPlayerNum_loudifpf - Object.keys(sData.players).length) == 2){
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
                    // var tData = MjClient.data.sData.tData;
                    // var str = "";
                    // str += (tData.areaSelectMode.payWay == 0) ? "房主," : "AA," ;
                    // str += (tData.maxPlayer == 2) ? "两人," : "三人," ;
                    // str += "15胡起胡,有炮必接,满百结算,";
                    // str += (tData.areaSelectMode.isfending == 0) ? "四百封顶," :"两百封顶," ;
                    // str += (tData.areaSelectMode.tuototuo == 0) ? "不打坨," :"打坨," ;
                    // str += (tData.areaSelectMode.isjiepao == 0) ? "接炮不封顶," :"接炮一百封顶," ;
                    // str += "点击立即加入牌局>>>";

                    // var sData = MjClient.data.sData;
                    // var str7 = "  二缺一";
                    // if((MjClient.MaxPlayerNum_xiangxiang - Object.keys(sData.players).length) == 2){
                    //     str7 = "  一缺二";
                    // }
                    // var txt_club = tData.clubId ? " 亲友圈(" + tData.clubId + ")" : "";
                    // cc.log("str=" + str + " str7=" + str7);
                    // MjClient.native.wxShareUrl(MjClient.remoteCfg.entreRoomUrl+"?vipTable="+tData.tableid, GameCnName[MjClient.gameType] + "  房间号:" + tData.tableid + str7+txt_club, str);
                       getPlayingRoomInfo_paohuzi(2);
                       cc.log("getPlayingRoomInfo_paohuzi" + getPlayingRoomInfo_paohuzi(2));
                },
                _visible:function(){
                    return !MjClient.remoteCfg.guestLogin;
                },
                _event: {
                    initSceneData: function(eD) {
                        this.visible = IsInviteVisible();
                    },
                    addPlayer: function(eD) {
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
                    //     setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0.15]);
                    // }else{
                    //     setWgtLayout(this, [0.11, 0.11],[0.05, 0.5],[0, 0.15]);
                    // }
                },
                // _click: function() {
                //     MjClient.showMsg("是否解散房间？", function () {
                //             MjClient.delRoom(true);
                //         }, function(){}, 1);
                // }
            },
            backHomebtn: {
                _run:function(){
                    setWgtLayout(this, [219/1280, 0],[0.30, 0.12],[0, 0]);
                },
                _click: function(btn) {
                    var sData = MjClient.data.sData;
                    if (sData) {
                        if (IsRoomCreator()) {
                            /*if(!isAgent()){
                                // 如果不是代理直接解散房间
                                MjClient.showMsg("返回大厅房间将会被解散\n确定退出房间吗？",
                                function() {
                                    MjClient.delRoom(true);
                                    if (!MjClient.enterui && !getClubInfoInTable())
                                        MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {},1);
                                return;
                            }*/
                            MjClient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧！",
                                function() {
                                    MjClient.leaveGame();
                                    if (!MjClient.enterui && !getClubInfoInTable())
                                        MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {});
                        } else {
                            MjClient.showMsg("返回大厅房间将退出游戏\n确定退出房间吗？",
                                function() {
                                    MjClient.leaveGame();
                                    if (!MjClient.enterui && !getClubInfoInTable())
                                        MjClient.Scene.addChild(new EnterRoomLayer());
                                },
                                function() {},1);
                        }
                    }
                },
                _event: {
                    returnPlayerLayer: function() {
                        MjClient.playui.visible = true;
                    },
                    initSceneData: function(eD) {
                        this.visible = isShowBackBtn();
                    },
                    removePlayer: function(eD) {
                        this.visible = isShowBackBtn();
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
        BtnReady:{
            _run: function () {
                this.visible = false;
                //setWgtLayout(this,[0.135, 0.128], [0.5, 0.40], [0.0, 0.26]);
                setWgtLayout(this,[219/1280, 0],[0.697, 0.12],[0, 0]);
            },
            _click: function(btn) {
                cc.log("-----------准备-------");
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhunbei", {uid: SelfUid(), gameType:MjClient.gameType});
                //sendQiangdizhu(true);
                HZPassConfirmToServer_xiangxiang();
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
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function(){
                            showUserZhuangLogoZuoXing_hengYang(this, 0);
                        },
                        initSceneData: function(){
                            if (IsArrowVisible_hengYang()) showUserZhuangLogoZuoXing_hengYang(this, 0);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hengYang()) showUserZhuangLogoZuoXing_hengYang(this, 0);
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

                                showUserChat_xiangxiang(this, 0, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_xiangxiang(this, 0, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_xiangxiang(0, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_xiangxiang(this, d, 0);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,0);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,0);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_shaoyangZP(this,0);
                },
                score_bg:{_visible:false},
                datuoflag:{
                    _visible: false,
                    _event:{
                        MJJiazhu:function(msg){
                            var jiaZhuArr = msg.jiazhuNums;
                            var pl = getUIPlayer_xiangxiang(0);
                            var jiazhu = jiaZhuArr[pl.info.uid];
                            this.visible = jiazhu >= 0;
                            if(jiazhu <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }
                        },
                        initSceneData:function(){
                            var pl = getUIPlayer_xiangxiang(0);
                            this.visible = pl.jiazhuNum >= 0;
                            if(MjClient.data.sData.tData.areaSelectMode.tuototuo == 0){
                                this.visible = false;
                            }      
                            if(pl.jiazhuNum <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }                      
                        },
                        removePlayer:function(){
                            this.visible = false;
                        }
                    }
                },
                thishuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        },
                    }
                },
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = 0;
                            if(IsArrowVisible_xiangxiang()){
                                huXi = UpdateHuXi_xiangxiang(0);
                            }
                            return this.setString(huXi + "息");    
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = UpdateHuXi_xiangxiang(0);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(0);
                            return this.setString(huXi + "息");
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_xiangxiang(0);
                            return this.setString(huXi + "息");
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(0);
                            return this.setString(huXi + "息");
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(0);
                            return this.setString(huXi + "息");
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_xiangxiang(0);
                            return this.setString(huXi + "息");
                        }
                    }
                },
                total_huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                totalhuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = GetPlayerAllHuXi_xiangxiang(0);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = GetPlayerAllHuXi_xiangxiang(0);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        roundEnd:function(){
                            var huXi = GetPlayerAllHuXi_xiangxiang(0);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
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
                        // initSceneData: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // mjhand: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // onlinePlayer: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0) && IsArrowVisible_xiangxiang();
                        //     if(MjClient.endoneui)
                        //         this.visible = false;
                        // },
                        // waitPut: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // HZNewCard: function(ed){
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // MJPeng: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // HZChiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // HZGangCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // HZWeiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // MJPut: function(eD){
                        //     this.visible = curPlayerIsMe_xiangxiang(0);
                        // },
                        // roundEnd: function(eD){
                        //     this.visible = false;
                        // }
                    },
                    time:{
                        _run: function() {
                            this.setString("0");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                    this.setString("0");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_xiangxiang(0)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("0");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_xiangxiang(0);
                                if(pl && pl.onLine && curPlayerIsMe_xiangxiang(0)){
                                    arrowbkNumberUpdate_xxghz(this);
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
                            var pl = getUIPlayer_xiangxiang(0);
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
                    GetReadyVisible_xiangxiang(this, 0);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_xiangxiang(this, 0);//根据状态设置ready 是否可见 add by sking
                    },
                    removePlayer: function() {
                        GetReadyVisible_xiangxiang(this, 0);
                    },
                    onlinePlayer: function() {
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 0);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    },
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 0);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    }
                }
            },
            handNode: {
                _visible: false,
                _run:function(){
                    this.zIndex = 100;
                },
                _event:  {
                    initSceneData: function() {
                        calculateHintPutList_hengYang();
                    },
                    HZPickCard: function() {
                        calculateHintPutList_hengYang();
                    },
                    HZAddCards: function() {
                        calculateHintPutList_hengYang();
                    },
                    HZChiCard: function() {
                        calculateHintPutList_hengYang();
                    },
                    MJPeng: function() {
                        calculateHintPutList_hengYang();
                    },
                    MJPut: function() {
                        calculateHintPutList_hengYang();
                    },
                    HZWeiCard: function() {
                        calculateHintPutList_hengYang();
                    },
                    HZGangCard: function() {
                        calculateHintPutList_hengYang();
                    },
                    MJPass: function() { // 天胡 提 偎 跑后过胡
                        calculateHintPutList_hengYang();
                        addTingSign_hengYang(MjClient.playui._downNode);
                    },
                    HZCheckRaise: function() {
                        calculateHintPutList_hengYang();
                        addTingSign_hengYang(MjClient.playui._downNode);
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
                    this.ignoreContentAdaptWithSize(true);
                    ziPai.setWgtLayoutHandCard(this);
                },
                _visible: false,
                _event:{
                    changeMJBgEvent: function() {
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode,0);
                    },
                    changeMJBgSize: function(type) {
                        ziPai.setWgtLayoutHandCard(this);
                        var handNode = MjClient.playui._downNode.getChildByName("handNode");
                        if(handNode){
                            handNode.removeAllChildren();
                        }
                        MjClient.playui.ResetHandCard(MjClient.playui._downNode, 0);
                    },
                    EZP_huXi: function(type){
                        var showStatus = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE);
                        showStatus = showStatus == 1 ?  true : false;
                        UpdateScoreMask_xiangxiang(showStatus);
                    }
                }
            },
            put: {
                _visible: false,
                _run:function()
                {
                    var layoutType = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT,0);
                    if(layoutType == 0){
                        setWgtLayout(this, [0.35, 0.35], [0.63, 0.6], [0, 0]);
                    }else if(layoutType == 1){
                        setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                    }
                    var userData = {scale:this.getScale(), pos:this.getPosition()};
                    this.setUserData(userData);
                },

                _event:{
                    MJPut: function(eD) {
                        this.loadTexture("playing/paohuzi/chupai_bj.png");
                    },
                    HZNewCard: function(eD){
                        this.loadTexture("playing/paohuzi/mopai_bj_0.png");
                    },
                    EZP_layout: function(){
                        var layoutType = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT,0);
                        if(layoutType == 0){
                            setWgtLayout(this, [0.35, 0.35], [0.63, 0.6], [0, 0]);
                        }else if(layoutType == 1){
                            setWgtLayout(this, [0.35, 0.35], [0.5, 0.6], [0, 0]);
                        }
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_xiangxiang(this, 0);
                },
                clearCardArr: function(){
                    var handNode = this.getChildByName("handNode");
                    handNode.removeAllChildren();
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_xiangxiang(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 0);
                    InitUserHandUI_syLoudifpfZuoXing(this, 0);
                    InitUserCoinAndName_xiangxiang(this, 0);
                    MjClient.hasPut = false; // 重连回来重置打掉牌标志（打牌时候断线)
                    ShowPutCardIcon_xiangxiang();
                    DealOffLineCard_xiangxiang(this,0);
                    if(MjClient.data.sData.tData.tState == TableState.waitJiazhu){
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode.tuototuo <= 0){
                            return;
                        }
                        var pl = getUIPlayer_xiangxiang(0);
                        if(!pl || pl.jiazhuNum >= 0){
                            return;
                        }
                        if(MjClient.jiazhuLayer){
                            return;
                        }
                        var layer = new jiazhuXiangLouLayer(function(){
                            //弹窗等待
                            MjClient.jiazhuLayer  = null;
                            MjClient.playui._jiazhuWait.visible = true;
                        });
                        MjClient.playui.addChild(layer,99);
                        MjClient.jiazhuLayer = layer;
                    }
                },
                addPlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 0);
                    InitUserCoinAndName_xiangxiang(this, 0);
                },
                removePlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 0);
                    InitUserCoinAndName_xiangxiang(this, 0);
                    if(MjClient.jiazhuLayer){
                        MjClient.jiazhuLayer.removeFromParent();
                        MjClient.jiazhuLayer = null;
                    }
                    MjClient.playui._jiazhuWait.visible = false;
                },
                mjhand: function(eD) {
                    InitUserHandUI_syLoudifpfZuoXing(this, 0);
                    InitUserCoinAndName_xiangxiang(this, 0);

                    if(MjClient.playui.cutCardView){
                        MjClient.playui.cutCardView.cutCardsEffect(this);
                    }

                    var uid = getUIPlayer_xiangxiang(0).info.uid;
                    if (eD.jiazhuNums)
                    {
                        for (var key in eD.jiazhuNums)
                        {
                            if (key != uid && eD.jiazhuNums[key] == 2)
                                MjClient.playui._jiazhuWait.visible = false;
                        }
                    }
                },
                roundEnd: function() {
                    InitUserCoinAndName_xiangxiang(this, 0);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_xiangxiang(this,eD,0);
                },
                MJPut: function(eD) {
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerPutCard_shaoyang(this,eD,0);
                    }else{
                        DealPutCard_xiangxiang(this,eD,0);
                    }
                },
                HZChiCard: function(eD) {
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerChiCard_shaoyang(this, eD, 0);
                    }else{
                        DealChiCard_shaoyang(this, eD, 0);
                    }
                },
                HZWeiCard: function(eD){
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerWeiCard_shaoyang(this,eD,0);
                    }else{
                        DealWeiCard_shaoyang(this,eD,0);
                    }  
                },
                HZGangCard: function(eD) {
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerGangCard_shaoyang(this, eD, 0);
                    }else{
                        DealGangCard_shaoyang(this, eD, 0);
                    }
                },
                MJPeng: function(eD) {
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerPengCard_shaoyang(this, eD, 0);
                    }else{
                        DealPengCard_shaoyang(this, eD, 0);
                    }
                },
                MJHu: function(eD) {
                    DealHu_xiangxiang(this, eD, 0);
                },
                onlinePlayer: function(eD) {
                    resetHandAfterBegin_xiangxiang();
                    setUserOffline_hengYang(this, 0);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 0);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 0);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 0);
                },
                MJJiazhu: function(msg) {
                    ShowPutCardIcon_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                    MjClient.playui._jiazhuWait.visible = false;
                    MjClient.playui.resetJiaZhuTip();
                    // MjClient.majiang.setJiaZhuNum(MjClient.playui._downNode, getUIPlayer_xiangxiang(0));
                    // MjClient.majiang.setJiaZhuNum(MjClient.playui._rightNode, getUIPlayer_xiangxiang(1));
                    // MjClient.majiang.setJiaZhuNum(MjClient.playui._topNode, getUIPlayer_xiangxiang(2));
                },
                HZPickCard:function (eD) {
                    var pl = getUIPlayer_hengYang(0);
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo != -1){
                        if(eD.uid == pl.info.uid) {
                            var xingIndex = (tData.xingPlayer + MjClient.MaxPlayerNum_xiangxiang - tData.uids.indexOf(SelfUid())) %  MjClient.MaxPlayerNum_xiangxiang;
                            MjClient.OtherHandArr[xingIndex] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var playerNode = [MjClient.playui._downNode,MjClient.playui._xingNode,MjClient.playui._rightNode,MjClient.playui._topNode][xingIndex];
                            MjClient.playui.ResetHandCard(playerNode,xingIndex);
                        }
                    }else if(MjClient.rePlayVideo == -1 && isXingPlayer_shaoyang(0)){
                        pl.mjhand.push(eD.card);
                        MjClient.HandCardArr = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                        MjClient.playui.ResetHandCard(this,0);
                    }
                    if(isXingPlayer_shaoyang(0) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPickCard_shaoyang(this, eD, 0);
                    }else{
                        DealShowLastCard_hengYang(this, eD, 0);
                    }
                },
                HZAddCards:function (eD) {
                    if(isXingPlayer_shaoyang(0)){
                        DealXingPlayerAddCard_xiangxiang(this,eD, 0);
                    }else{
                        DealAddCard_hengYang(this,eD, 0);
                    }
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                },
                waitJiazhu:function(){
                    postEvent("returnPlayerLayer");
                    var tData = MjClient.data.sData.tData;
                    if(tData.areaSelectMode.tuototuo <= 0){
                        return;
                    }
                    var pl = getUIPlayer_xiangxiang(0);
                    if(!pl || pl.jiazhuNum >= 0){
                        return;
                    }
                    if(MjClient.jiazhuLayer){
                        return;
                    }
                    var layer = new jiazhuXiangLouLayer(function(){
                        //弹窗等待
                        MjClient.jiazhuLayer  = null;
                        MjClient.playui._jiazhuWait.visible = true;
                    });
                    MjClient.playui.addChild(layer,99);
                    MjClient.jiazhuLayer = layer;
                    if (MjClient.webViewLayer != null)
                    {
                        MjClient.webViewLayer.close();
                    }
                }
            }
        },
        xing: {
            _visible: true,
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                        if(MjClient.data.sData.tData.areaSelectMode.zuoXing){
                            this.loadTexture("playing/gameTable/youxizhong-1_90.png");
                        }
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogoZuoXing_hengYang(this, 1);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_hengYang()) showUserZhuangLogoZuoXing_hengYang(this, 1);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hengYang()){
                                showUserZhuangLogoZuoXing_hengYang(this, 1);
                            } 
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
                                showUserChat_hengYang(this, 1, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_hengYang(this, 1, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_hengYang(1, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_hengYang(this, d, 1);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,1);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,1);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_shaoyangZP(this,1);
                },
                score_bg:{_visible:false},
                datuoflag:{
                    _visible: false,
                    _event:{
                        MJJiazhu:function(msg){
                            var jiaZhuArr = msg.jiazhuNums;
                            var pl = getUIPlayer_xiangxiang(1);
                            var jiazhu = jiaZhuArr[pl.info.uid];
                            this.visible = jiazhu >= 0;
                            if(jiazhu <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }
                        },
                        initSceneData:function(){
                            if(getUIPlayer_xiangxiang(1))
                                var pl = getUIPlayer_xiangxiang(1);
                            else return ;
                            this.visible = pl.jiazhuNum >= 0; 
                            if(MjClient.data.sData.tData.areaSelectMode.tuototuo == 0){
                                this.visible = false;
                            }
                            if(pl.jiazhuNum <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }                          
                        },
                        removePlayer:function(){
                            this.visible = false;
                        }
                    }
                },
                thishuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                             var huXi = 0;
                            if(IsArrowVisible_xiangxiang()){
                                huXi = UpdateHuXi_xiangxiang(1);
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = UpdateHuXi_xiangxiang(1);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(1);
                            return this.setString(huXi + "息");
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_xiangxiang(1);
                            return this.setString(huXi + "息");
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(1);
                            return this.setString(huXi + "息");
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(1);
                            return this.setString(huXi + "息");
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_xiangxiang(1);
                            return this.setString(huXi + "息");
                        }
                    }
                },
                total_huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                totalhuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = GetPlayerAllHuXi_xiangxiang(1);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = GetPlayerAllHuXi_xiangxiang(1);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        roundEnd:function(){
                            var huXi = GetPlayerAllHuXi_xiangxiang(1);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
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
                        // initSceneData: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // mjhand: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // onlinePlayer: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1) && IsArrowVisible_xiangxiang();
                        //     if(MjClient.endoneui)
                        //         this.visible = false;
                        // },
                        // waitPut: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // HZNewCard: function(ed){
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // MJPeng: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // HZChiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // HZGangCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // HZWeiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // MJPut: function(eD){
                        //     this.visible = curPlayerIsMe_xiangxiang(1);
                        // },
                        // roundEnd: function(eD){
                        //     this.visible = false;
                        // }
                    },
                    time:{
                        _run: function() {
                            this.setString("0");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                    this.setString("0");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_xiangxiang(1)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("0");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_xiangxiang(1);
                                if(pl && pl.onLine && curPlayerIsMe_xiangxiang(1)){
                                    arrowbkNumberUpdate_xxghz(this);
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
                _layout: [[0.2, 0.2], [0.8, 0.25], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, -2.5]],
                _run: function() {
                    GetReadyVisible_xiangxiang(this, 1);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_xiangxiang(this, 1);
                    },
                    removePlayer: function() {
                        GetReadyVisible_xiangxiang(this, 1);
                    },
                    onlinePlayer: function() {
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 1);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    },
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 1);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout:[[0.1, 0.1], [0.91, 0.05], [0, 0]]
            },
            eatNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.23], [0, 0]]
            },
            outNode: {
                _visible: true,
                _layout : [[0.14, 0.14], [1-0.005, 0.15], [0, 0]]
            },
            put: {
                _visible: false,
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
                        this.loadTexture("playing/paohuzi/mopai_bj_0.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_xiangxiang(this, 1);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_xiangxiang(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 1);
                    InitUserHandUI_syLoudifpfZuoXing(this, 1);
                    InitUserCoinAndName_xiangxiang(this, 1);
                    DealOffLineCard_xiangxiang(this,1);
                },
                addPlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 1);
                    InitUserCoinAndName_xiangxiang(this, 1);
                },
                removePlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 1);
                    InitUserCoinAndName_xiangxiang(this, 1);
                },
                mjhand: function(eD) {
                    InitUserHandUI_syLoudifpfZuoXing(this, 1);
                    InitUserCoinAndName_xiangxiang(this, 1);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_xiangxiang(this,eD,1);
                },
                roundEnd: function() {
                    InitUserCoinAndName_xiangxiang(this, 1);
                    MjClient.playui.ResetOtherCard(this, 1);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, 1);
                },
                MJPut: function(eD) {
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPutCard_shaoyang(this,eD,1);
                    }else{
                        DealPutCard_xiangxiang(this,eD,1);
                    }
                },
                HZChiCard: function(eD) {
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerChiCard_shaoyang(this, eD, 1);
                    }else{
                        DealChiCard_shaoyang(this, eD, 1);
                    }
                },
                HZGangCard: function(eD) {
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerGangCard_shaoyang(this, eD, 1);
                    }else{
                        DealGangCard_shaoyang(this, eD, 1);
                    }
                },
                MJPeng: function(eD) {
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPengCard_shaoyang(this, eD, 1);
                    }else{
                        DealPengCard_shaoyang(this, eD, 1);
                    }
                },
                HZWeiCard: function(eD){
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerWeiCard_shaoyang(this,eD,1);
                    }else{
                        DealWeiCard_shaoyang(this,eD,1);
                    } 
                },
                MJHu: function(eD) {
                    DealHu_xiangxiang(this, eD, 1);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_xiangxiang(this, 1);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_xiangxiang(this, 1);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 1);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 1);
                },
                HZPickCard:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo != -1){
                        var pl = getUIPlayer_hengYang(1);
                        if(eD.uid == pl.info.uid) {
                            MjClient.OtherHandArr[1] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var xingIndex = (tData.xingPlayer + MjClient.MaxPlayerNum_xiangxiang - tData.uids.indexOf(SelfUid())) %  MjClient.MaxPlayerNum_xiangxiang;
                            MjClient.OtherHandArr[xingIndex] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var playerNode = [MjClient.playui._downNode,MjClient.playui._xingNode,MjClient.playui._rightNode,MjClient.playui._topNode][xingIndex];
                            MjClient.playui.ResetHandCard(playerNode,xingIndex);
                        }
                    }
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPickCard_shaoyang(this, eD, 1);
                    }else{
                        DealShowLastCard_hengYang(this, eD, 1);
                    }
                },
                HZAddCards:function (eD) {
                    if(isXingPlayer_shaoyang(1) && MjClient.rePlayVideo != -1){
                        DealXingPlayerAddCard_xiangxiang(this,eD, 1);
                    }else{
                        DealAddCard_hengYang(this,eD, 1);
                    }
                    // DealAddCard_hengYang(this, eD, 1);
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_xiangxiang();
                    MjClient.playui.EatVisibleCheck();

                    // var tData = MjClient.data.sData.tData;
                    // var pl = getUIPlayer_xiangxiang(1);
                    // if(!pl){
                    //     return;
                    // }
                    // if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    // {
                    //     if (SelfUid() == pl.info.uid) {
                    //         var layer = new laZhangLayer();
                    //         MjClient.playui.addChild(layer, 99);
                    //         if (MjClient.webViewLayer != null) {
                    //             MjClient.webViewLayer.close();
                    //         }
                    //     }
                    //     else
                    //     {
                    //         MjClient.playui._jiazhuWait.visible = true;
                    //     }
                    // }else if(pl.jiazhuNum == 1){
                    //     MjClient.majiang.setJiaZhuNum(node, getUIPlayer_xiangxiang(off));
                    // }
                }
            }
        },
        right: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogoZuoXing_hengYang(this, 2);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_xiangxiang()) showUserZhuangLogoZuoXing_hengYang(this, 2);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_xiangxiang()) showUserZhuangLogoZuoXing_hengYang(this, 2);
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
                                showUserChat_xiangxiang(this, 2, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_xiangxiang(this, 2, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_xiangxiang(2, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_xiangxiang(this, d, 2);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,2);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,2);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_shaoyangZP(this,2);
                },
                score_bg:{_visible:false},
                datuoflag:{
                    _visible: false,
                    _event:{
                        MJJiazhu:function(msg){
                            var jiaZhuArr = msg.jiazhuNums;
                            var pl = getUIPlayer_xiangxiang(2);
                            var jiazhu = jiaZhuArr[pl.info.uid];
                            this.visible = jiazhu >= 0;
                            if(jiazhu <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }
                        },
                        initSceneData:function(){
                            if(getUIPlayer_xiangxiang(2))
                                var pl = getUIPlayer_xiangxiang(2);
                            else return ;
                            this.visible = pl.jiazhuNum >= 0; 
                            if(MjClient.data.sData.tData.areaSelectMode.tuototuo == 0){
                                this.visible = false;
                            }
                            if(pl.jiazhuNum <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }                          
                        },
                        removePlayer:function(){
                            this.visible = false;
                        }
                    }
                },
                thishuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                             var huXi = 0;
                            if(IsArrowVisible_xiangxiang()){
                                huXi = UpdateHuXi_xiangxiang(2);
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = UpdateHuXi_xiangxiang(2);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(2);
                            return this.setString(huXi + "息");
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_xiangxiang(2);
                            return this.setString(huXi + "息");
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(2);
                            return this.setString(huXi + "息");
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(2);
                            return this.setString(huXi + "息");
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_xiangxiang(2);
                            return this.setString(huXi + "息");
                        }
                    }
                },
                total_huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                totalhuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = GetPlayerAllHuXi_xiangxiang(2);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = GetPlayerAllHuXi_xiangxiang(2);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        roundEnd:function(){
                            var huXi = GetPlayerAllHuXi_xiangxiang(2);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
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
                        // initSceneData: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // mjhand: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // onlinePlayer: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2) && IsArrowVisible_xiangxiang();
                        //     if(MjClient.endoneui)
                        //         this.visible = false;
                        // },
                        // waitPut: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // HZNewCard: function(ed){
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // MJPeng: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // HZChiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // HZGangCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // HZWeiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // MJPut: function(eD){
                        //     this.visible = curPlayerIsMe_xiangxiang(2);
                        // },
                        // roundEnd: function(eD){
                        //     this.visible = false;
                        // }
                    },
                    time:{
                        _run: function() {
                            this.setString("0");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                    this.setString("0");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_xiangxiang(2)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("0");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_xiangxiang(2);
                                if(pl && pl.onLine && curPlayerIsMe_xiangxiang(2)){
                                    arrowbkNumberUpdate_xxghz(this);
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
                _layout: [[0.2, 0.2], [0.8, 0.7], [0, 0.5]],
                _run: function () {
                    this.zIndex = actionZindex;
                },
                _visible:false,
            },
            ready: {
                _layout: [[0.07, 0.07],[0.5, 0.5],[2.5, 2.5]],
                _run: function() {
                    GetReadyVisible_xiangxiang(this, 2);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_xiangxiang(this, -2);
                    },
                    moveHead: function() {
                        GetReadyVisible_xiangxiang(this, -2);
                    },
                    addPlayer: function() {
                        GetReadyVisible_xiangxiang(this, 2);
                    },
                    removePlayer: function() {
                        GetReadyVisible_xiangxiang(this, 2);
                    },
                    onlinePlayer: function() {
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 2);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -2);
                        }
                    },
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 2);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -2);
                        }
                    }
                }
            },
            replayNode:{
                _visible: true,
                _run:function(){
                    this.zIndex = 100;
                },
                _layout : [[0.1, 0.1], [0.85, 0.81], [0, 0.2]]
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
                        this.loadTexture("playing/paohuzi/mopai_bj_0.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_xiangxiang(this, 2);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_xiangxiang(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 2);
                    InitUserHandUI_syLoudifpfZuoXing(this, 2);
                    InitUserCoinAndName_xiangxiang(this, 2);
                    DealOffLineCard_xiangxiang(this,2);
                },
                addPlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 2);
                    InitUserCoinAndName_xiangxiang(this, 2);
                },
                removePlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 2);
                    InitUserCoinAndName_xiangxiang(this, 2);
                },
                mjhand: function(eD) {
                    InitUserHandUI_syLoudifpfZuoXing(this, 2);
                    InitUserCoinAndName_xiangxiang(this, 2);
                },
                HZNewCard: function(eD) {
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_xiangxiang(this,eD,2);
                },
                roundEnd: function() {
                    InitUserCoinAndName_xiangxiang(this, 2);
                    MjClient.playui.ResetOtherCard(this, 2);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, 2);
                },
                 MJPut: function(eD) {
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPutCard_shaoyang(this,eD,2);
                    }else{
                        DealPutCard_xiangxiang(this,eD,2);
                    }
                },
                HZChiCard: function(eD) {
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerChiCard_shaoyang(this, eD, 2);
                    }else{
                        DealChiCard_shaoyang(this, eD, 2);
                    }
                },
                HZGangCard: function(eD) {
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerGangCard_shaoyang(this, eD, 2);
                    }else{
                        DealGangCard_shaoyang(this, eD, 2);
                    }
                },
                MJPeng: function(eD) {
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPengCard_shaoyang(this, eD, 2);
                    }else{
                        DealPengCard_shaoyang(this, eD, 2);
                    }
                },
                HZWeiCard: function(eD){
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerWeiCard_shaoyang(this,eD,2);
                    }else{
                        DealWeiCard_shaoyang(this,eD,2);
                    } 
                },
                MJHu: function(eD) {
                    DealHu_xiangxiang(this, eD, 2);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hengYang(this, 2);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 2);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 2);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 2);
                },
                waitJiazhu:function (msg) {
                    // postEvent("returnPlayerLayer");
                    // /*
                    //  弹窗加注
                    //  */
                    // var layer = new jiazhuXiangLouLayer(function(){
                    //     //弹窗等待
                    //     MjClient.playui._jiazhuWait.visible = true;
                    // });
                    // MjClient.playui.addChild(layer,99);
                    // if (MjClient.webViewLayer != null)
                    // {
                    //     MjClient.webViewLayer.close();
                    // }
                },
                HZPickCard:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo != -1){
                        var pl = getUIPlayer_hengYang(2);
                        if(eD.uid == pl.info.uid) {
                            MjClient.OtherHandArr[2] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var xingIndex = (tData.xingPlayer + MjClient.MaxPlayerNum_xiangxiang - tData.uids.indexOf(SelfUid())) %  MjClient.MaxPlayerNum_xiangxiang;
                            MjClient.OtherHandArr[xingIndex] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var playerNode = [MjClient.playui._downNode,MjClient.playui._xingNode,MjClient.playui._rightNode,MjClient.playui._topNode][xingIndex];
                            MjClient.playui.ResetHandCard(playerNode,xingIndex);
                        }
                    }
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPickCard_shaoyang(this, eD, 2);
                    }else{
                        DealShowLastCard_hengYang(this, eD, 2);
                    }
                },
                HZAddCards:function (eD) {
                    if(isXingPlayer_shaoyang(2) && MjClient.rePlayVideo != -1){
                        DealXingPlayerAddCard_xiangxiang(this,eD, 2);
                    }else{
                        DealAddCard_hengYang(this,eD, 2);
                    }
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_xiangxiang();
                    MjClient.playui.EatVisibleCheck();

                    // var tData = MjClient.data.sData.tData;
                    // var pl = getUIPlayer_xiangxiang(2);
                    // if(!pl){
                    //     return;
                    // }
                    // if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    // {
                    //     if (SelfUid() == pl.info.uid) {
                    //         var layer = new laZhangLayer();
                    //         MjClient.playui.addChild(layer, 99);
                    //         if (MjClient.webViewLayer != null) {
                    //             MjClient.webViewLayer.close();
                    //         }
                    //     }
                    //     else
                    //     {
                    //         MjClient.playui._jiazhuWait.visible = true;
                    //     }
                    // }else if(pl.jiazhuNum == 1){
                    //     MjClient.majiang.setJiaZhuNum(node, getUIPlayer_xiangxiang(off));
                    // }
                }
            }
        },
        left: {
            head: {
                zhuang: {
                    _run: function() {
                        this.visible = false;
                    },
                    _event: {
                        waitPut: function() {
                            showUserZhuangLogoZuoXing_hengYang(this, 3);
                        },
                        initSceneData: function() {
                            if (IsArrowVisible_hengYang()) showUserZhuangLogoZuoXing_hengYang(this,3);
                        },
                        mjhand: function(){
                            if (IsArrowVisible_hengYang()) showUserZhuangLogoZuoXing_hengYang(this,3);
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
                                showUserChat_xiangxiang(this, 3, msg);
                            },
                            playVoice: function(voicePath) {
                                MjClient.data._tempMessage.msg = voicePath;
                                showUserChat_xiangxiang(this, 3, MjClient.data._tempMessage);
                            }
                        }
                    }
                },
                _click: function(btn) {
                    showPlayerInfo_xiangxiang(3, btn);
                },
                _event: {
                    loadWxHead: function(d) {
                        setWxHead_xiangxiang(this, d, 3);
                    },
                    addPlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,3);
                    },
                    removePlayer: function(eD) {
                        showFangzhuTagIcon_shaoyangZP(this,3);
                    }
                },
                _run: function () {
                    showFangzhuTagIcon_shaoyangZP(this,3);
                },
                score_bg:{_visible:false},
                datuoflag:{
                    _visible: false,
                    _event:{
                        MJJiazhu:function(msg){
                            var jiaZhuArr = msg.jiazhuNums;
                            var pl = getUIPlayer_xiangxiang(3);
                            var jiazhu = jiaZhuArr[pl.info.uid];
                            this.visible = jiazhu >= 0;
                            if(jiazhu <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }
                        },
                        initSceneData:function(){
                            if (getUIPlayer_xiangxiang(3))
                                var pl = getUIPlayer_xiangxiang(3);
                            else return;
                            this.visible = pl.jiazhuNum >= 0;
                            if(MjClient.data.sData.tData.areaSelectMode.tuototuo == 0){
                                this.visible = false;
                            }
                            if(pl.jiazhuNum <= 0){
                                this.loadTexture("game_picture/datuotip_no.png");
                            }else{
                                this.loadTexture("game_picture/datuotip.png");
                            }                          
                        },
                        removePlayer:function(){
                            this.visible = false;
                        }
                    }
                },
                thishuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = 0;
                            if(IsArrowVisible_xiangxiang()){
                                huXi = UpdateHuXi_xiangxiang(3);
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = UpdateHuXi_xiangxiang(3);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        HZChiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(3);
                            return this.setString(huXi + "息");
                        },
                        MJPeng:function(){
                            var huXi = UpdateHuXi_xiangxiang(3);
                            return this.setString(huXi + "息");
                        },
                        HZGangCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(3);
                            return this.setString(huXi + "息");
                        },
                        HZWeiCard:function(){
                            var huXi = UpdateHuXi_xiangxiang(3);
                            return this.setString(huXi + "息");
                        },
                        LY_addHandHuXi:function () {
                            var huXi = UpdateHuXi_xiangxiang(3);
                            return this.setString(huXi + "息");
                        }
                    }
                },
                total_huxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                        },
                        mjhand:function(){
                            this.visible = true;
                        }
                    }                    
                },
                totalhuxi:{
                    _visible: false,
                    _event:{
                        clearCardUI: function(){
                            // this.setVisible(false);
                            // return this.setString("0");
                        },
                        addPlayer: function(){
                            return this.setString("0" + "息");
                        },
                        removePlayer: function(){
                            this.visible = false;
                        },
                        initSceneData:function(){
                            this.visible = IsArrowVisible_xiangxiang();
                            var huXi = GetPlayerAllHuXi_xiangxiang(3);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        mjhand:function(){
                            this.visible = true;
                            var huXi = GetPlayerAllHuXi_xiangxiang(3);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
                        },
                        roundEnd:function(){
                            var huXi = GetPlayerAllHuXi_xiangxiang(3);
                            if(!IsArrowVisible_xiangxiang()){
                                huXi = 0;
                            }
                            return this.setString(huXi + "息");
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
                        // initSceneData: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // mjhand: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // onlinePlayer: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3) && IsArrowVisible_xiangxiang();
                        //     if(MjClient.endoneui)
                        //         this.visible = false;
                        // },
                        // waitPut: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // HZNewCard: function(ed){
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // MJPeng: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // HZChiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // HZGangCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // HZWeiCard: function(eD) {
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // MJPut: function(eD){
                        //     this.visible = curPlayerIsMe_xiangxiang(3);
                        // },
                        // roundEnd: function(eD){
                        //     this.visible = false;
                        // }
                    },
                    time:{
                        _run: function() {
                            this.setString("0");
                        },
                        _event: {
                            initSceneData: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                    this.setString("0");
                                }
                            },
                            mjhand: function(eD) {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPeng: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZNewCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZGangCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZChiCard: function() {
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            HZWeiCard: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                if(curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
                                }
                            },
                            MJPut: function(msg) {
                                if (curPlayerIsMe_xiangxiang(3)) {
                                    this.stopAllActions();
                                    stopEffect(playTimeUpEff);
                                    playTimeUpEff = null;
                                    this.setString("0");
                                }
                            },
                            onlinePlayer: function(){
                                this.stopAllActions();
                                stopEffect(playTimeUpEff);
                                playTimeUpEff = null;
                                var pl = getUIPlayer_xiangxiang(3);
                                if(pl && pl.onLine && curPlayerIsMe_xiangxiang(3)){
                                    arrowbkNumberUpdate_xxghz(this);
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
                    GetReadyVisible_xiangxiang(this, 3);
                },
                _event: {
                    startShuffleCards:function (d) {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    moveHead: function() {
                        GetReadyVisible_xiangxiang(this, -1);
                    },
                    addPlayer: function() {
                        GetReadyVisible_xiangxiang(this, 3);
                    },
                    removePlayer: function() {
                        GetReadyVisible_xiangxiang(this, 3);
                    },
                    onlinePlayer: function() {
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 3);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    },
                    initSceneData: function(){
                        var tData = MjClient.data.sData.tData;
                        GetReadyVisible_xiangxiang(this, 3);
                        if(tData.tState != TableState.roundFinish && tData.areaSelectMode.tuototuo > 0){
                            GetReadyVisible_xiangxiang(this, -1);
                        }
                    }
                }
            },
            replayNode:{
                _visible: true,
                _layout : [[0.1, 0.1], [0.15, 0.81], [0, 0.2]]
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
                        this.loadTexture("playing/paohuzi/mopai_bj_0.png");
                    }
                }
            },
            out0: {
                _visible: false
            },
            _event: {
                clearCardUI: function() {
                    clearCardUI_xiangxiang(this, 3);
                },
                clearCardArr: function(){
                    var eatNode = this.getChildByName("eatNode");
                    eatNode.removeAllChildren();
                    var outNode = this.getChildByName("outNode");
                    outNode.removeAllChildren();
                    RemovePutCardOut_xiangxiang(true);
                },
                initSceneData: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 3);
                    InitUserHandUI_syLoudifpfZuoXing(this, 3);
                    InitUserCoinAndName_xiangxiang(this, 3);
                    DealOffLineCard_xiangxiang(this,3);
                },
                addPlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 3);
                    InitUserCoinAndName_xiangxiang(this, 3);
                },
                removePlayer: function(eD) {
                    SetUserVisible_syLoudifpfZuoXing(this, 3);
                    InitUserCoinAndName_xiangxiang(this, 3);
                },
                mjhand: function(eD) {
                    InitUserHandUI_syLoudifpfZuoXing(this, 3);
                    InitUserCoinAndName_xiangxiang(this, 3);
                },
                HZNewCard: function(eD) {
                    console.log("客户端发牌组合...... ");
                    if (typeof(eD) == "number") {
                        eD = {newCard: eD};
                    }
                    DealNewCard_xiangxiang(this,eD,3);
                },
                roundEnd: function() {
                    InitUserCoinAndName_xiangxiang(this, 3);
                    MjClient.playui.ResetOtherCard(this, 3);
                },
                waitPut: function(eD) {
                    DealWaitPut(this, eD, 3);
                },
                MJPut: function(eD) {
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPutCard_shaoyang(this,eD,3);
                    }else{
                        DealPutCard_xiangxiang(this,eD,3);
                    }
                },
                HZChiCard: function(eD) {
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerChiCard_shaoyang(this, eD, 3);
                    }else{
                        DealChiCard_shaoyang(this, eD, 3);
                    }
                },
                HZPaoCard: function(eD) {
                    DealPaoCard_hengYang(this, eD, 3);
                },
                HZGangCard: function(eD) {
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerGangCard_shaoyang(this, eD, 3);
                    }else{
                        DealGangCard_shaoyang(this, eD, 3);
                    }
                },
                MJPeng: function(eD) {
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPengCard_shaoyang(this, eD, 3);
                    }else{
                        DealPengCard_shaoyang(this, eD, 3);
                    }
                },
                HZWeiCard: function(eD){
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerWeiCard_shaoyang(this,eD,3);
                    }else{
                        DealWeiCard_shaoyang(this,eD,3);
                    } 
                },
                MJHu: function(eD) {
                    DealHu_xiangxiang(this, eD, 3);
                },
                onlinePlayer: function(eD) {
                    setUserOffline_hengYang(this, 3);
                },
                playerStatusChange: function(eD) {
                    setUserOffline_hengYang(this, 3);
                },
                MJFlower: function(eD) {
                    HandleMJFlower(this, eD, 3);
                },
                MJTing: function (eD) {
                    HandleMJTing(this, eD, 3);
                },
                HZPickCard:function (eD) {
                    var tData = MjClient.data.sData.tData;
                    if(MjClient.rePlayVideo != -1){
                        var pl = getUIPlayer_hengYang(3);
                        if(eD.uid == pl.info.uid) {
                            MjClient.OtherHandArr[3] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var xingIndex = (tData.xingPlayer + MjClient.MaxPlayerNum_xiangxiang - tData.uids.indexOf(SelfUid())) %  MjClient.MaxPlayerNum_xiangxiang;
                            MjClient.OtherHandArr[xingIndex] = MjClient.majiang.sortHandCardSpecial(pl.mjhand);
                            var playerNode = [MjClient.playui._downNode,MjClient.playui._xingNode,MjClient.playui._rightNode,MjClient.playui._topNode][xingIndex];
                            MjClient.playui.ResetHandCard(playerNode,xingIndex);
                        }
                    }
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerPickCard_shaoyang(this, eD, 3);
                    }else{
                        DealShowLastCard_hengYang(this, eD, 3);
                    }
                },
                HZAddCards:function (eD) {
                    if(isXingPlayer_shaoyang(3) && MjClient.rePlayVideo != -1){
                        DealXingPlayerAddCard_xiangxiang(this,eD, 3);
                    }else{
                        DealAddCard_hengYang(this,eD, 3);
                    }
                },
                HZCheckRaise:function (msg) {
                    ShowPutCardIcon_xiangxiang();
                    MjClient.playui.EatVisibleCheck();

                    // var tData = MjClient.data.sData.tData;
                    // var pl = getUIPlayer_xiangxiang(3);
                    // if(!pl){
                    //     return;
                    // }
                    // if (pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1)
                    // {
                    //     if (SelfUid() == pl.info.uid) {
                    //         var layer = new laZhangLayer();
                    //         MjClient.playui.addChild(layer, 99);
                    //         if (MjClient.webViewLayer != null) {
                    //             MjClient.webViewLayer.close();
                    //         }
                    //     }
                    //     else
                    //     {
                    //         MjClient.playui._jiazhuWait.visible = true;
                    //     }
                    // }else if(pl.jiazhuNum == 1){
                    //     MjClient.majiang.setJiaZhuNum(node, getUIPlayer_xiangxiang(off));
                    // }
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

                                    commitEatCards_xiangxiang(eatCards, null);
                                    
                                    return;
                                }
                            }
                        }
                        showSelectEatCards_hengYang(this,btn.tag);
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
                    if (eT == 2) {
                        if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                            MjClient.showMsg("选择碰后视为过胡，确定碰吗？", function() {
                                HZPengToServer_xiangxiang();
                                setChiVisible_xiangxiang();
                            }, function() {}, "1");
                        } else {
                            HZPengToServer_xiangxiang();
                            setChiVisible_xiangxiang();
                        }
                    }
                }
            },
            guo: {
                _visible: false,
                _layout: [[0, 0.1],[0.5, 0],[4.6, 2.5]],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        if ((MjClient.data.sData.players[SelfUid()].eatFlag & 32) > 0) {
                            MjClient.showMsg("确定过胡吗？", function() {
                                MjClient.MJPass2NetForleiyang();
                                setChiVisible_xiangxiang();
                            }, function() {}, "1");
                        } else {
                            MjClient.MJPass2NetForleiyang();
                            setChiVisible_xiangxiang();
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
                        MJHuToServer_xiangxiang();
                        setChiVisible_xiangxiang();//add by maoyu
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
                        resetChiParam_xiangxiang();
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
                    if (eT == 2) {
                        HZWangChuangToServer_xiangxiang(1);
                        setChiVisible_xiangxiang();//add by maoyu
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
                    if (eT == 2) {
                        HZWangChuangToServer_xiangxiang(2);
                        setChiVisible_xiangxiang();//add by maoyu
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
                    if (eT == 2) {
                        HZWangChuangToServer_xiangxiang(4);
                        setChiVisible_xiangxiang();//add by maoyu
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
                                    if(row === undefined){
                                        return;
                                    }
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
                                    HZChiToServer_xiangxiang(cards_select[0], biCards);
                                    this.visible = false;
                                }.bind(this), function() {
                                    cards_select.pop();
                                    this.adaptChiLayout();
                                }.bind(this), "1");
                            } else {
                                var biCards = cards_select.length > 1 ? cards_select.slice(1) : null;
                                HZChiToServer_xiangxiang(cards_select[0], biCards);
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
                            //row.reverse();
                            var highlightImg = this.getChildByName("highlightImg").clone();
                            highlightImg.visible = true;
                            highlightImg.x = pos_x + 75 / 2;
                            highlightImg.y = 155;
                            chiLayout.addChild(highlightImg);
                            highlightImg.height = 85 * 3 + 36;
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_xiangxiang + "hand" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 85 * j + 72;
                                if (j == row.length - 1) {
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
                            //row.reverse();
                            for (var j = 0; j < row.length; j++) {
                                var chiCardImg = this.getChildByName("chiCardImg").clone();
                                chiCardImg.loadTexture(MjClient.cardPath_xiangxiang + "hand" + row[j] + ".png");
                                chiCardImg.visible = true;
                                chiCardImg.x = pos_x + 75 / 2;
                                chiCardImg.y = 85 * j + 72;
                                if (j == row.length - 1) {
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
                    },
                    initSceneData: function(){
                        this.reset();
                        var chiLayout = this.getChildByName("chiLayout");
                        chiLayout.removeAllChildren(true);
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
                    setQiHuState_xiangxiang();
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
                    setQiHuState_xiangxiang();
                    //放在每个方向节点上去做，因为摸到王霸牌的时候，有个显示动作，动作显示完之后
                    //在显示各种操作按钮
                    if(eD.isCommon && eD.newCard){
                        MjClient.playui.EatVisibleCheck();
                    }
                },
                HZGangCard: function(eD) {
                    console.log("HHH :HZGangCard------");
                    setQiHuState_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    setQiHuState_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    setQiHuState_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                },
                HZChiCard: function(eD) {
                    console.log("HHH :HZChiCard------");
                    setQiHuState_xiangxiang();
                    MjClient.playui.EatVisibleCheck();
                },
                HZWeiCard: function(eD) {
                    console.log("HHH :HZWeiCard------");
                    setQiHuState_xiangxiang();
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
                onlinePlayer: function(){
                    var tData = MjClient.data.sData.tData;
                    if(tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard){
                        this.setVisible(false);
                    }
                }
            }
        },
        lose_btn: {
            _layout: [[55/1280, 0],[0.97, 0.6],[0, 0]],
            _run : function(){
                this.visible = false;
            },
            _click: function() {
                MjClient.showMsg("是否选择认输",
                    function() {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "beDefeat"
                        });
                    },
                    function() {},1);
            },
            _event: {
                HZWeiCard: function(eD) {
                    var tData = MjClient.data.sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (tData.tState != TableState.waitPut && pl.mjState != TableState.waitPut) {
                        return;
                    }

                    if (tData.areaSelectMode.keSiShou && SelfUid() == tData.uids[tData.curPlayer] && eD.defeatState == 0) {
                        this.visible = true;
                    }
                },
                HZGangCard: function(eD) {
                    var tData = MjClient.data.sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (tData.tState != TableState.waitPut && pl.mjState != TableState.waitPut) {
                        return;
                    }

                    if (tData.areaSelectMode.keSiShou && SelfUid() == tData.uids[tData.curPlayer] && eD.defeatState == 0) {
                        this.visible = true;
                    }
                },
                MJPass: function(eD) {
                    var tData = MjClient.data.sData.tData;
                    if (tData.areaSelectMode.keSiShou && eD.defeatState == 0) {
                        this.visible = true;
                    }
                },
                MJPut: function() {
                    this.visible = false;
                },
                HZNewCard: function() {
                    this.visible = false;
                },
                roundEnd: function() {
                    this.visible = false;
                },
                initSceneData: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = MjClient.data.sData.players[SelfUid()];
                    if (!tData.areaSelectMode.keSiShou) {
                        return;
                    }

                    if (pl.defeatState == 0 && tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) {
                        this.visible = true;
                    }

                    for (var uid in sData.players) {
                        if (sData.players[uid].defeatState == 1 && tData.tState != TableState.roundFinish) {
                            MjClient.playui.showDefeatTip(Number(uid));
                        }
                    }
                },
                beDefeat: function(eD) {
                    MjClient.playui.showDefeatTip(eD.uid);
                },
                clearCardUI: function() {
                    MjClient.playui.removeDefeatTip();
                }
            }
        },
        chat_btn: {
            _layout: [[55/1280, 0],[0.97, 0.5-0.007],[0, -0.2]],
            _click: function() {
                var chatlayer = new XXChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        voice_btn: {
            _layout: [[43/1280, 0],[0.91, 0.5],[0, -0.2]],
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
                    downAndPlayVoice_xiangxiang(msg.uid, msg.msg);
                }
            }
        },
        cutLine:{
            _visible: false,
            _run: function () {
                //setWgtLayout(this,[1, 0.3], [0.5, 0.6], [0, -10]);
                ziPai.setWgtLayoutCutLine(this);
            },
            _event: {
                mjhand: function(eD){
                    ShowPutCardIcon_xiangxiang();
                },
                HZNewCard: function(eD){
                    ShowPutCardIcon_xiangxiang();
                },                
                HZChiCard: function(eD) {
                    ShowPutCardIcon_xiangxiang();
                },
                MJPeng: function(eD) {
                    ShowPutCardIcon_xiangxiang();
                },
                MJPut:function(eD) {
                    ShowPutCardIcon_xiangxiang();
                },
                MJPass:function(eD) {
                    ShowPutCardIcon_xiangxiang();
                },
                MJHu:function(eD){
                    this.visible = false;
                },
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
        var playui = ccs.load("Play_xxGaoHuZi.json");
        playMusic("bgFight");
        var tData = MjClient.data.sData.tData;
        MjClient.MaxPlayerNum_xiangxiang = tData.maxPlayer;
        MjClient.MaxPlayerNum_leiyang = tData.maxPlayer;
        MjClient.jiazhuLayer = null;
        this._downNode  = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode  = playui.node.getChildByName("left");
        this._xingNode = playui.node.getChildByName("xing");
        MjClient.HandCardArr = [];
        MjClient.OtherHandArr = {};
        MjClient.playui = this;
        MjClient.playui._AniNode =  playui.node.getChildByName("eat");
        MjClient.playui._jiazhuWait = playui.node.getChildByName("jiazhuWait");
        MjClient.playui._operateWait = playui.node.getChildByName("operateWait");
        MjClient.playui._jiazhuWait.visible = false;
        MjClient.playui._operateWait.visible = false;
        MjClient.playui._rightTime = this._rightNode.getChildByName("head").getChildByName("timeImg").getChildByName("time");
        MjClient.playui._leftTime = this._topNode.getChildByName("head").getChildByName("timeImg").getChildByName("time");
        BindUiAndLogic(playui.node, this.jsBind);
        this.addChild(playui.node);

        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        this.tingLayer = new PhzTingLayer();
        this.addChild(this.tingLayer, 1000);

        this.playuiNode = playui.node;
        if(MjClient.data.sData.tData.maxPlayer < 4){
            ziPai.changePlayUILayout(playui.node);
        }
        // 切牌
        if(MjClient.rePlayVideo == -1){
            this.cutCardView = COMMON_UI.createZiPaiCutCardView();
            playui.node.addChild(this.cutCardView);
        }

        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1){
            addFreeNumberBtn();
        }

        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(5);

        // 俱乐部返回大厅功能：by_jcw
        addClub_BackHallBtn("gps_btn","rigth","back_btn");

        if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()));
        }
        return true;
    },

    resetJiaZhuTip: function()
    {
        // var tData = MjClient.data.sData.tData;
        // if (!tData.areaSelectMode.jushou)
        //     return;
        // var nodes = [this._downNode, this._rightNode, this._topNode, this._leftNode];
        // for (var i = 0; i < MjClient.MaxPlayerNum_loudifpf; i ++)
        // {
        //     var pl = getUIPlayer_xiangxiang(i);
        //     if (!pl) 
        //         continue;

        //     cc.log("resetJiaZhuTip jiazhuNum = " + pl.jiazhuNum);
        //     if (pl.jiazhuNum != 1 && pl.jiazhuNum != 0)
        //         continue;

        //     var node = nodes[i];
        //     var tipNode = node.getChildByName("head").getChildByName("jiaZhuTip");
        //     var playTipNode = node.getChildByName("play_tips");
        //     var point = playTipNode.convertToWorldSpace(playTipNode.getChildByName("hu").getPosition());
        //     tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
        //     tipNode.visible = true;
        //     tipNode.opacity = 255;
        //     tipNode.ignoreContentAdaptWithSize(true);
        //     tipNode.setString(pl.jiazhuNum == 1 ? "举手做声" : "");
        //     tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        // }
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

//庄家打出第一张牌之后，刷新提垅的牌
PlayLayer_syLoudifpfZuoXing.prototype.UpdateEatCardsAfterFirst = function(posNode,off){
    var sData = MjClient.data.sData;
    var tData = MjClient.data.sData.tData;
    var player = sData.players[tData.uids[tData.zhuang]];
    if(tData.curPlayer == tData.zhuang && player.putCount == 1){
        MjClient.playui.ResetOtherCard(posNode,off);
    }
};

//重置手牌的顺序
PlayLayer_syLoudifpfZuoXing.prototype.ResetHandCard = function(posNode,off, needAction, isDelay){

    // needAction = needAction === undefined ? false : needAction;
    needAction = false;

    if(off == 0){

        //todo 千千
        // if(!needAction && !isDelay && MjClient.addGroupIndex != 0){
        //     refreshNode_paohuzi(posNode,off,needAction);

        //     this.scheduleOnce(function(){
        //         this.ResetHandCard(posNode,off,needAction,true);
        //     }.bind(this), 0.35);
        //     return;
        // }

        //if(MjClient.movingCard_loudifpf && MjClient.movingCard_loudifpf.getParent()){
        //    MjClient.movingCard_loudifpf.removeFromParent(true);
        //    MjClient.movingCard_loudifpf = null;
        //}
        //if(MjClient.cloneCard && MjClient.cloneCard.getParent()){
        //    MjClient.cloneCard.removeFromParent(true);
        //    MjClient.cloneCard = null;
        //}
        var showStatus = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
        showStatus = showStatus == 1 ? true : false;

        checkCard_xiangxiang(posNode, off);
        var handNode = posNode.getChildByName("handNode");
        handNode.visible = true;
        handNode.removeAllChildren();
        var cardArr = MjClient.HandCardArr;
        //清理空数组
        for(var k = cardArr.length - 1;k >=0;k--){
            if(cardArr[k].length == 0){
                cardArr.splice(k,1);
            }
        }
        for(var k = 0;k < cardArr.length;k++){
            var groupList = cardArr[k];
            for(var j = 0;j < groupList.length;j++){
                addHandCard_xiangxiang(k,j,groupList[j],off,groupList.length,showStatus);
            }
        }

        addTingSign_hengYang(posNode); // 添加听牌角标

        var handCard = posNode.getChildByName("handCard");
        var scale_x = handCard.scaleX;
        var winSize = MjClient.size;
        var totalWidth = handCard.width * cardArr.length * scale_x;
        for(var i = 0;i < cardArr.length;i++){
            var addNode = handNode.getChildByTag(i);
            // addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * handCard.width * scale_x,0));

            if(needAction){
                addNode.x = winSize.width * 0.5;
                addNode.y = 0;
                this._doMovetoAction(addNode, cc.p((winSize.width - totalWidth)/2 + i * handCard.width * scale_x,0));
            }else{
                addNode.setPosition(cc.p((winSize.width - totalWidth)/2 + i * handCard.width * scale_x,0));    
            }
        }
        postEvent("LY_addHandHuXi");
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
                addHandCardReplay_xiangxiang(k,j,groupList[j],off);
            }
        }       
    }
};

PlayLayer_syLoudifpfZuoXing.prototype._doMovetoAction = function(node,endP){
    node.stopAllActions();
    var ac = cc.moveTo(0.3,endP);
    node.runAction(ac);
};

PlayLayer_syLoudifpfZuoXing.prototype.ResetOtherCard = function(posNode,off){
    //添加吃、碰、跑、偎、提
    var sData = MjClient.data.sData;
    var tData = null;
    if(sData){
        tData = sData.tData;
    }

    var eatNode = posNode.getChildByName("eatNode");
    eatNode.visible = true;
    eatNode.removeAllChildren();
    var pl = getUIPlayer_xiangxiang(off);
    if (!pl) return;
    if(tData.xingPlayer == tData.uids.indexOf(pl.info.uid)){
        return;
    }
    var mjSortArr = pl.mjsort;
    cc.log("=====off=====:" + off + "mjSortArr:" + JSON.stringify(mjSortArr));
    if(mjSortArr){
        var childArr = null;
        
        //提/偎牌的特殊处理
        var callback = function(childList){
            var cardNum = pl.mjwei[pos];
            for(var i = 0; i < childList.length; i++){
                var child = childList[i];
                if(off != 1 && off != 0 && i == 0){
                    // if(childList.length == 4 && tData.isLastDraw){
                    //     child.loadTexture(MjClient.cardPath_xiangxiang+"huxiBG.png");
                    // }
                }else if((off == 0 || off == 1) && i == childList.length - 1){

                }else{
                    child.loadTexture(MjClient.cardPath_xiangxiang+"huxiBG.png");
                }
            }
        };

        for(var k = 0;k < mjSortArr.length;k++){
            var mjsort = mjSortArr[k];
            var pos = mjsort.pos;
            var name = mjsort.name;
            //提
            if(name == "mjgang1"){
                var cardNum = pl.mjgang1[pos];
                for(var i = 0;i < 4;i++){
                    addEatCard_xiangxiang(posNode,"mjgang1" + k,cardNum,off);
                }

                var tiParentNode = eatNode.getChildByName("mjgang1" + k);
                var childArr = tiParentNode.children;
                callback(childArr);
            }
            //偎
            if(name == "mjwei"){
                var cardNum = pl.mjwei[pos];
                for(var i = 0;i < 3;i++){
                    addEatCard_xiangxiang(posNode,"mjwei" + k,cardNum,off);
                }

                var weiParentNode = eatNode.getChildByName("mjwei" + k);
                var childArr = weiParentNode.children;
                var skipPeng = pl.skipPeng;
                callback(childArr);
            }
            //跑
            if(name == "mjgang0"){
                var cardNum = pl.mjgang0[pos];
                for(var i = 0;i < 4;i++){
                    addEatCard_xiangxiang(posNode,"mjgang0" + k,cardNum,off);
                }
            }
            //碰
            if(name == "mjpeng"){
                var cardNum = pl.mjpeng[pos];
                for(var i = 0;i < 3;i++){
                    addEatCard_xiangxiang(posNode,"mjpeng" + k,cardNum,off);
                }
            }
            //吃
            if(name == "mjchi"){
                var cardNum = pl.mjchi[pos];
                var eatCards = pl.mjchi[pos].eatCards;
                if(off == 0){
                    //eatCards.reverse();
                }
                for(var i = 0;i < eatCards.length;i++){
                    addEatCard_xiangxiang(posNode,"mjchi" + k,eatCards[i],off);
                }
                var biCards = pl.mjchi[pos].biCards;
                if(biCards && biCards.length > 0){
                    for(var i = 0;i < biCards.length;i++){
                        var biArr = biCards[i];
                        if(off == 0){
                            //biArr.reverse();
                        }
                        for(var m = 0;m<biArr.length;m++){
                            addEatCard_xiangxiang(posNode,"mjbi" + k + i,biArr[m],off);
                        }
                    }        
                }

                var mjchiCardArr = pl.mjchiCard;
                var chiParentNode = eatNode.getChildByName("mjchi" + k);
                if(chiParentNode){
                    var childArr = chiParentNode.children;
                    //var index = off == 0?0:childArr.length - 1;
                    var index = childArr.length - 1;
                    // 耒阳吃牌放在最上面一张
                    if (childArr.length > 0 && childArr[index].tag == mjchiCardArr[pos]) {
                        childArr[index].setColor(cc.color(170, 170, 170));
                    }
                }

                if(biCards && biCards.length > 0){
                    for(var i = 0;i < biCards.length;i++){
                        var chiParentNode = eatNode.getChildByName("mjbi" + k + i); // "mjbi32"
                        if(chiParentNode){
                            var childArr = chiParentNode.children;
                            // 比牌放在最上面一张
                            // var index = off == 0?0:childArr.length - 1;
                            var index = childArr.length - 1;
                            if (childArr.length > 0 && childArr[index].tag == mjchiCardArr[pos]) {
                                childArr[index].setColor(cc.color(170, 170, 170));
                            }
                        }                        
                    }
                }
            }
        }        
    }
};

PlayLayer_syLoudifpfZuoXing.prototype.ResetPutCard = function(posNode,off){
    //添加打出的牌
    var pl = getUIPlayer_xiangxiang(off);
    if (!pl || !pl.mjput) return;
    var outNode = posNode.getChildByName("outNode");
    outNode.visible = true;
    outNode.removeAllChildren();
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var curUId = tData.uids[tData.curPlayer];
    if(tData.xingPlayer == tData.uids.indexOf(pl.info.uid)){
        return;
    }

    for(var i = 0; i < pl.mjput.length; i++){
        // if(curUId == pl.info.uid && i == pl.mjput.length - 1 && tData.currCard == pl.mjput[i]){
        //     continue;
        // }
        // var childCount = outNode.childrenCount;
        var outCard = getNewCard_xiangxiang(pl.mjput[i], 2, off);
        // if(off == 0){
        //     outCard.anchorX = 1;
        //     outCard.anchorY = 0;
        //     var line = Math.floor(i/7);
        //     var sur = i%7;
        //     outCard.x = outNode.width - sur* outCard.width;
        //     outCard.y = -line * outCard.height ;
        // }else if(off == 1){
        //     outCard.anchorX = 1;
        //     outCard.anchorY = 1;
        //     outCard.x = outNode.width - childCount * outCard.width;
        //     outCard.y = outNode.height;
        // }else if(off == 2){
        //     outCard.anchorX = 0;
        //     outCard.anchorY = 1;
        //     outCard.x = childCount * outCard.width;
        //     outCard.y = outNode.height;
        // }
        // outNode.addChild(outCard);
        outNode.addChild(outCard);
        // setPutCardPos_xiangxiang(outNode, outCard, i, off);
        setPutCardPos_hengYang(outNode, outCard, i, off);
        

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
PlayLayer_syLoudifpfZuoXing.prototype.CardLayoutRestore = function(posNode,off){
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
PlayLayer_syLoudifpfZuoXing.prototype.EatVisibleCheck = function(off){
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
    eat.chiSelect._node.visible = false;
    eat.biSelect._node.visible = false;
    eat.biSelect1._node.visible = false;
    eat.chiBg._node.visible = false;

    eat.chi._node.setTouchEnabled(false);
    eat.peng._node.setTouchEnabled(false);
    eat.hu._node.setTouchEnabled(false);
    eat.guo._node.setTouchEnabled(false);
    eat.cancel._node.setTouchEnabled(false);
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
    //自摸getUIPlayer_xiangxiang
    if(tData.tState != TableState.roundFinish && pl.mjState != TableState.roundFinish){
        if(IsTurnToMe()){
            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            } 
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
                    MJHuToServer_xiangxiang();
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
                    // HZGangToServer_loudifpf(2);
                    return;
                }
            }

            if(vnode.length > 0){
                vnode.push(eat.guo._node);
                isCheckedTing = false;
            }
        }
        if(!IsTurnToMe()){
            //吃
            if(pl.eatFlag & 1){
                vnode.push(eat.chi._node);
            } 
            //碰
            if(pl.eatFlag & 2){
                vnode.push(eat.peng._node);
            }
            //胡
            if(pl.eatFlag & 32){
                vnode.push(eat.hu._node);
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
            "peng": ["playing/paohuzi/youxizhong-27.png", "playing/paohuzi/youxizhong-27.png"],
            "gang": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi": ["playing/paohuzi/youxizhong-274.png", "playing/paohuzi/youxizhong-274.png"],
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
            var scale = 0.20;
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                if(btnName == "guo"){
                    scale = 103 / 720;
                }else if(btnName == "hu"){
                    scale = 149 / 720;
                }
            }
            setWgtLayout(vnode[i], [0, scale], [0.5, 0.18], [ (i - (vnode.length - 1) / 2) * 1.3 * 0.20 / scale, 1.8 * 0.20 / scale], false, false);
            if(ziPai.getUiLayoutType() == 0){
                setWgtLayout(vnode[i], [0, scale], [0.88 - (vnode.length - 1 - i) * 0.12 * 0.20 / scale, 0.11], [ 0, 1.8 * 0.20 / scale], false, false);
            }
        }
    }
};

PlayLayer_syLoudifpfZuoXing.prototype.showAndHideHeadEffect = function(){
    var tData = MjClient.data.sData.tData;
    var arr = [this._downNode, this._xingNode, this._rightNode, this._topNode];
    var uids = tData.uids;
    var selfIndex = tData.uids.indexOf(SelfUid());
    var nodeIndex = (selfIndex - tData.curPlayer + tData.maxPlayer) % tData.maxPlayer;
    var curPlayerNode = null;
    if (curPlayerIsMe_xiangxiang(0)){
        curPlayerNode = arr[0].getChildByName("head");
    }
    else if (curPlayerIsMe_xiangxiang(1)){
        curPlayerNode = arr[1].getChildByName("head");
    }else if (curPlayerIsMe_xiangxiang(2)){
        curPlayerNode = arr[2].getChildByName("head");
    }else if(curPlayerIsMe_xiangxiang(3)){
        curPlayerNode = arr[3].getChildByName("head");
    }

    if (curPlayerNode)
    {   
        var tag = 2018322;
        this._downNode.getChildByName("head").removeChildByTag(tag, true);
        this._rightNode.getChildByName("head").removeChildByTag(tag, true);
        this._topNode.getChildByName("head").removeChildByTag(tag, true);
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
        _armature.setPosition(curPlayerNode.width/2, curPlayerNode.height/2 + 16);
        _armature.setTag(tag);
        _armature.getAnimation().setSpeedScale(0.35);
        curPlayerNode.addChild(_armature);
    }
};

PlayLayer_syLoudifpfZuoXing.prototype.showDefeatTip = function (uid) {
    var off = getUiOffByUid_xiangxiang(uid);
    var playerNode = getNode_xiangxiang(off);
    var playerHead = playerNode.getChildByName("head");
    var defeatTip = cc.Sprite("playing/paohuzi/defeatTip.png");
    var defeatBG = cc.Sprite("playing/paohuzi/defeatBG.png");
    var posX = playerHead.getContentSize().width / 2;
    var posY = playerHead.getContentSize().height * 3 / 5
    defeatTip.setPosition(posX, posY);
    defeatTip.setName("defeatTip");
    defeatBG.setPosition(posX, posY);
    defeatBG.setName("defeatBG");


    playerHead.addChild(defeatBG);
    playerHead.addChild(defeatTip);
};

PlayLayer_syLoudifpfZuoXing.prototype.removeDefeatTip = function () {
    var sData = MjClient.data.sData;
    for (var uid in sData.players) {
        var off = getUiOffByUid_xiangxiang(Number(uid));
        var playerNode = getNode_xiangxiang(off);
        var playerHead = playerNode.getChildByName("head");
        var defeatBG = playerHead.getChildByName("defeatBG");
        var defeatTip = playerHead.getChildByName("defeatTip");

        if (defeatBG) {
            defeatBG.removeFromParent();
        }

        if (defeatTip) {
            defeatTip.removeFromParent();
        }
    }
}

PlayLayer_syLoudifpfZuoXing.prototype.getHandCount = function () {
    return 20;   
}

PlayLayer_syLoudifpfZuoXing.prototype.loadCardTexture = function(cardImg, cardTag){
    setCardSprite_xiangxiang(cardImg, cardTag, 2);
}