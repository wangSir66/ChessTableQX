// 邵阳娄底放炮罚字牌
var playPanel_hhHongGuaiWan = playLayer_ziPai.extend({
    ctor: function() {
        this._super("Play_shaoYangHongGuaiWan.json");
        //自由人数
        if (MjClient.data.sData.tData.areaSelectMode["convertible"] && MjClient.rePlayVideo == -1)
            addFreeNumberBtn([0.5, 0.4]);

        var _rightNode = this.jsBind.node_right._node;
        var _topNode = this.jsBind.node_left._node;
        this._rightTime = _rightNode.getChildByName("layout_head").getChildByName("img_waitCountDown").getChildByName("text_countDown");
        this._leftTime = _topNode.getChildByName("layout_head").getChildByName("img_waitCountDown").getChildByName("text_countDown");
        this._operateWait = this.jsBind.operateWait._node;
        this._jiazhuWait = this.jsBind.jiazhuWait._node;
        this._jiazhuWait.visible = false;

        MjClient.jiazhuLayer = null;
        MjClient.MaxPlayerNum_xiangxiang = this.getPlayersNum();        //兼容旧版结算，算法等文件
    },

    getJsBind: function() {
        var jsBind = {
            _event: {
                startShuffleCards: function(d) {
                    MjClient.playui.checkCanShowDistance();
                },
                mjhand: function() {
                    MjClient.playui.checkCanShowDistance();
                    MjClient.MaxPlayerNum_xiangxiang = MjClient.playui.getPlayersNum();        //刷新下(防止自由人数不对)
                },
                MJChat: function(data) {
                    if (data.type == 4) {
                        MjClient.playui.checkCanShowDistance();
                    }
                },
                removePlayer: function() {
                    MjClient.playui.checkCanShowDistance();
                },
            },
            text_roundInfo: {
                _layout: [[0.11, 0.11], [0.5, 0.66], [0, 0]],
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                    this.setString(MjClient.playui.getRuleInfo());
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ) {
                        this.visible = false;
                    }
                }
            },
            jiazhuWait:{
                _visible:false,
                _layout: [[0.25, 0.06],[0.5, 0.52],[0, 0]]
            },
            layout_cardNum: {
                img_card: {
                    _run:function() {
                        this.refreshCardsTotal = function(isRemove) {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var maiPai = (tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? 20 : 0;
                            var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                            if(next <= 0) {
                                this.visible = false; 
                            }
                            else {
                                this.visible = true;
                                if(isRemove) {
                                    var children = this.getChildren();
                                    var childNum = this.getChildrenCount();
                                    if(childNum > 0 && childNum + 1 > next && next < 20) {
                                        //少于20张时开始减高度
                                        children[childNum - 1].removeFromParent(true);
                                    }
                                }
                                else {
                                    this.removeAllChildren();
                                    next = next > 20 ? 20 : next;
                                    for(var i = 1; i <= next; i++) {
                                        var child = ccui.ImageView("playing/ziPaiBanner/paidui.png");
                                        child.setPosition(cc.p(this.width/2, this.height/2 + i * 0.8));
                                        this.addChild(child);
                                    }
                                }
                            }
                        }
                    },
                    _event: {
                        initSceneData: function() {
                            this.refreshCardsTotal();
                            this.getParent().getChildByName("text_cardNum").refreshText();
                        },
                        mjhand: function() {
                            this.refreshCardsTotal();
                            this.getParent().getChildByName("text_cardNum").refreshText();
                        }
                    }
                }
            },
            img_banner: {
                _layout: [[0.35, 0.35], [0.5, 1], [0, 0]],
                _run: function() {
                    var btn_changeBg = this.getChildByName("btn_changeBg");
                    var btn_setting = this.getChildByName("btn_setting");
                    var btn_gps = this.getChildByName("btn_gps");
                    var btn_trust = this.getChildByName("btn_trust");
                    var btn_getGold = this.getChildByName("btn_getGold");
                    var btn_exit = this.getChildByName("btn_exit");
                    if (MjClient.playui.isCoinField()) {
                        btn_setting.loadTextureNormal("playing/gameTable/gold/shezhi.png");
                        btn_setting.loadTexturePressed("playing/gameTable/gold/shezhi_s.png");
                        btn_setting.setContentSize(cc.size(65, 74));

                        btn_setting.x = btn_gps.x;
                        btn_trust.x = btn_setting.x - 100;
                        btn_getGold.x = btn_setting.x - 200;
                    } else if (MjClient.playui.getPlayersNum() == 2) {
                        btn_changeBg.x = btn_setting.x;
                        btn_setting.x = btn_exit.x;
                        btn_exit.x = btn_gps.x;
                    }
                },
                btn_setting: {
                    _click: function() {
                        MjClient.Scene.addChild(new settingPanel_hhHongGuaiWan(), 6000);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                            uid: SelfUid(),
                            gameType: MjClient.gameType
                        });
                    }
                },
                btn_changeBg:{
                    _run: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                            this.setContentSize(this.getNormalTextureSize());
                        }else {
                            this.visible = !MjClient.playui.isCoinField();
                        }
                    },
                    _click: function() {
                        if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                            postEvent("isRuleVisible");
                        }else {
                            MjClient.playui.changeGameBgToNext();
                        }
                    }
                },
                text_round: {
                    _visible : function () {
                        if(MjClient.playui.isCoinField()) {//金币场显示场次名称
                            return false;
                        }
                        return true;
                    },
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.getRoundInfo = function() {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var extraNum = tData.extraNum ? tData.extraNum:0;
                            if (tData) return ("第" + (tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"局");
                        }
                    },
                    _text: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var extraNum = tData.extraNum ? tData.extraNum:0;
                        if (tData) return ("第" + (tData.roundAll - tData.roundNum + 1 + extraNum).toString()+"局");
                    },
                    _event: {
                        mjhand: function() {
                            this.setString(this.getRoundInfo());
                        },
                        initSceneData: function() {
                            this.setString(this.getRoundInfo());
                        },
                    }
                },
            },
            img_cutLine: { 
                _event: {
                    beDefeat: function() {
                        MjClient.playui.checkCutLineVisible(this);
                    }
                },
            },
            btn_sort: {
                _click: function () {
                    if (!MjClient.playui.isInPlay()) {
                        return;
                    }
                    MjClient.HandCardArr = MjClient.majiang.sortByUser();
                    MjClient.playui.refreshHandCard(0);
                }
            },
            layout_rule: {
                _layout: [[1, 0.51],[0.015, 0.24],[0, 0]],
                text_roundInfo:{
                    _run:function(){
                    var tData = MjClient.data.sData.tData;
                    var area = tData.areaSelectMode;
                    var flag = 0;
                    var str = "";
                    // str += (tData.areaSelectMode.payWay == 0) ? "房主支付\n\n" : "AA支付\n\n" ;
                    str += "总局数：" + tData.roundAll + "\n";
                    str += tData.areaSelectMode.shiwuzimo ? "15胡可自摸胡\n" : "";
                    str += (tData.areaSelectMode.iszimo == 0) ? "3胡1囤\n" : "3胡1囤,  自摸+1囤\n" ;
                    str += tData.areaSelectMode.huangzhuang ? "黄庄" : "" ;
                    str += tData.areaSelectMode.datuanyuan ? ",  大团圆" : "" ;
                    str += tData.areaSelectMode.shuahou ? ",  耍猴" : "" ;
                    str += (area.huangzhuang || area.datuanyuan || area.shuahou) ? "\n" : "" ;

                    str += (tData.areaSelectMode.redguaiwanOne == 1) ? "名堂：红拐弯(234)\n" : "名堂：红拐弯(468)\n" ;
                    str += (tData.areaSelectMode.trustTime > 0) ? tData.areaSelectMode.trustTime / 60 + "分钟后托管\n" : "" ;
                    str += "不换位\n";
                    str += tData.areaSelectMode.fanBei == 0 ? "不翻倍\n" : "低于" + tData.areaSelectMode.fanBeiScore + "分翻倍\n";
                    str += tData.areaSelectMode.jieSuanDiFen > 0 ? "积分底分" + tData.areaSelectMode.jieSuanDiFen + "\n" : "";

                    if((tData.areaSelectMode.redguaiwanwanfa & 1) == 1){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "天胡：4" : "天胡：8" ;
                        flag ++;
                        if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }
                    
                    if((tData.areaSelectMode.redguaiwanwanfa & 2) == 2){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "地胡：3" : "地胡：6" ;
                        flag ++;
                        if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }
                    
                    if((tData.areaSelectMode.redguaiwanwanfa & 4) == 4){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "点胡：3" : "点胡：6" ;
                        flag ++;
                        if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }
                    
                    if((tData.areaSelectMode.redguaiwanwanfa & 8) == 8){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "红胡：2+n" : "红胡：4+n" ;
                        flag ++;
                        if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }
                    

                    if((tData.areaSelectMode.redguaiwanwanfa & 16) == 16){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "乌胡：5" : "乌胡：8" ;
                        flag ++;
                        if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }
                    

                    if((tData.areaSelectMode.redguaiwanwanfa & 32) == 32){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "碰碰胡：4" : "碰碰胡：8" ;
                        flag ++;
                         if(flag == 1){
                            str += ",  ";
                        }else if(flag == 2){
                            str += "\n";
                            flag = 0;
                        }
                    }

                    if(flag == 1){
                        str = str.substr(0, str.length - 3);
                        str += "\n";
                    }

                    if((tData.areaSelectMode.redguaiwanwanfa & 64) == 64){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "十八大：4+n\n" : "十八大：8+n\n" ;
                    }

                    if((tData.areaSelectMode.redguaiwanwanfa & 128) == 128){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "十六小：4+n\n" : "十六小：8+n\n" ;
                    }

                    if((tData.areaSelectMode.redguaiwanwanfa & 256) == 256){
                        str += (tData.areaSelectMode.redguaiwanOne == 1) ? "海底胡：2" : "海底胡：6" ;
                    }

                    if(tData.areaSelectMode.maipai && tData.areaSelectMode.maxPlayer == 2){
                        if(tData.areaSelectMode.hasOwnProperty("maiPaiType")){
                            var maiPaiCount = parseInt(tData.areaSelectMode.maiPaiType) * 10;
                            if(maiPaiCount > 0){
                                str += "\n";
                                str += "2人埋"+maiPaiCount+"张";
                            } 
                        }
                    }
                
                    this.ignoreContentAdaptWithSize(true);
                    var strPayWay = "";
                    var str5 = strPayWay;
                    this.setString(str + str5);
                    }
                },
                _event:{
                    isRuleVisible: function(){
                        this.visible = !this.visible;
                    },
                    initSceneData: function(eD) {
                        var checkRuleVisible = function() {
                            var tData = MjClient.data.sData.tData;
                            if(MjClient.rePlayVideo != -1){
                                return true;
                            }
                            if (tData.tState == TableState.waitJoin || tData.tState == TableState.waitReady || tData.tState == TableState.isReady) {
                                return true;
                            }
                            return false;
                        };
                        this.visible = checkRuleVisible();
                    },
                    mjhand:function () {
                        if(MjClient.rePlayVideo == -1){
                            this.visible = false;
                        }else{
                            this.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(()=>{
                                this.visible = false;
                            })));
                        }
                    },
                    startShuffleCards: function() {
                        this.visible = false;
                    },
                    waitJiazhu: function() {
                        this.visible = false;
                    },
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
            node_down: {
                layout_head: {
                    skipHuIconTag: {
                        _visible:false,
                        _event: {
                            clearCardUI: function() {
                                this.visible = false;
                            },
                            initSceneData:function()
                            {
                                var pl = MjClient.playui.getUIPlayer(0);
                                if (pl && pl.isQiHu) {
                                    this.visible = true;
                                }
                            }
                        }
                    },
                    img_waitCountDown: {
                        text_countDown: {
                            _run: function() {
                                this.setString("0");
                            },
                            _event: {
                                initSceneData: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                mjhand: function(eD) {
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPeng: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZNewCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZGangCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZWeiCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPut: function(msg) {
                                    if (MjClient.playui.isCurPlayer(0)) {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
                                        this.setString("0");
                                    }
                                },
                                onlinePlayer: function(){
                                    MjClient.playui.excCountDown(this);
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
                layout_eatDisplay: {
                    _run:function() {
                        setWgtLayout(this, [0.12, 0.12], [0.5, 0.45], [0, 0]);
                    }
                },
                img_putCard: {
                    _layout: [[0.35, 0.35], [0.65, 0.6], [0, 0]]
                },
                _event: {
                    initSceneData: function(eD) {
                        MjClient.playui.showDaTuoNode(this);
                        MjClient.playui.showAndHideTrust(this);
                        if(MjClient.data.sData.tData.tState == TableState.waitJiazhu){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.tuototuo <= 0){
                                return;
                            }
                            var pl = MjClient.playui.getUIPlayer(0);
                            if(!pl || pl.jiazhuNum >= 0){
                                return;
                            } 
                        }
                    },
                    waitJiazhu: function(){
                        var tData = MjClient.data.sData.tData;
                        if(tData.areaSelectMode.tuototuo <= 0){
                            return;
                        }
                        var pl = MjClient.playui.getUIPlayer(0);
                        if(!pl || pl.jiazhuNum >= 0){
                            return;
                        }
                        if(MjClient.jiazhuLayer){
                            return;
                        }
                        var layer = new jiazhuXiangLouLayer(function(){
                            //弹窗等待
                            // if(cc.sys.isObjectValid(MjClient.jiazhuLayer)) {
                            //     MjClient.jiazhuLayer.removeFromParent();
                            // }
                            MjClient.jiazhuLayer  = null;
                            MjClient.playui._jiazhuWait.visible = true;
                        });
                        MjClient.playui.addChild(layer,99);
                        MjClient.jiazhuLayer = layer;
                        if (MjClient.webViewLayer != null)
                        {
                            MjClient.webViewLayer.close();
                        }
                    },
                    mjhand: function(eD) {
                        MjClient.playui.showDaTuoNode(this);
                        if (eD.jiazhuNums)
                        {
                            for (var key in eD.jiazhuNums)
                            {
                                if (key != SelfUid() && eD.jiazhuNums[key] == 2)
                                    MjClient.playui._jiazhuWait.visible = false;
                            }
                        }
                    },
                    removePlayer: function() {
                        if(cc.sys.isObjectValid(MjClient.jiazhuLayer)){
                            MjClient.jiazhuLayer.removeFromParent();
                            MjClient.jiazhuLayer = null;
                        }
                        MjClient.playui._jiazhuWait.visible = false;
                    },
                    MJJiazhu: function() {
                        MjClient.playui._jiazhuWait.visible = false;
                    },
                    cancelTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    },
                    beTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    },
                    roundEnd: function() {
                        if(cc.sys.isObjectValid(MjClient.playui.trustLayer)) {
                            MjClient.playui.trustLayer.visible = false;
                        }
                    }
                }
            },
            node_right: {
                layout_head: {
                    img_waitCountDown: {
                        text_countDown: {
                            _run: function() {
                                this.setString("0");
                            },
                            _event: {
                                initSceneData: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                mjhand: function(eD) {
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPeng: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZNewCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZGangCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZWeiCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPut: function(msg) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    if (MjClient.playui.isCurPlayer(off)) {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
                                        this.setString("0");
                                    }
                                },
                                onlinePlayer: function(){
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(pl && pl.onLine){
                                        MjClient.playui.excCountDown(this);
                                    }else {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
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
                layout_eatDisplay: {
                    _run:function() {
                        setWgtLayout(this, [0.12, 0.12], [0.95, 0.93], [0, 0]);
                    }
                },
                _event: {
                    initSceneData: function() {
                        MjClient.playui.showDaTuoNode(this);
                        MjClient.playui.showAndHideTrust(this);
                    },
                    mjhand: function() {
                        MjClient.playui.showDaTuoNode(this);
                    },
                    cancelTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    },
                    beTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    }
                }
            },
            node_left: {
                layout_head: {
                    img_waitCountDown: {
                        text_countDown: {
                            _run: function() {
                                this.setString("0");
                            },
                            _event: {
                                initSceneData: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                mjhand: function(eD) {
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPeng: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZNewCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZGangCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                HZChiCard: function() {
                                    MjClient.playui.excCountDown(this);
                                },
                                HZWeiCard: function(){
                                    MjClient.playui.excCountDown(this);
                                },
                                MJPut: function(msg) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    if (MjClient.playui.isCurPlayer(off)) {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
                                        this.setString("0");
                                    }
                                },
                                onlinePlayer: function(){
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(pl && pl.onLine){
                                        MjClient.playui.excCountDown(this);
                                    }else {
                                        this.stopAllActions();
                                        stopEffect(playTimeUpEff);
                                        playTimeUpEff = null;
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
                layout_eatDisplay: {
                    _run:function() {
                        setWgtLayout(this, [0.12, 0.12], [0.05, 0.95], [0, 0]);
                    }
                },
                _event: {
                    initSceneData: function() {
                        MjClient.playui.showDaTuoNode(this);
                        MjClient.playui.showAndHideTrust(this);
                    },
                    mjhand: function() {
                        MjClient.playui.showDaTuoNode(this);
                    },
                    cancelTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    },
                    beTrust : function(){
                        MjClient.playui.showAndHideTrust(this);
                    }
                }
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
                    initSceneData: function() {
                        var num = MjClient.playui.getPlayersNum();
                        if(num == 2 && MjClient.playui.isCurPlayer(1) && 
                            MjClient.playui._leftTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else if(num == 3 && MjClient.playui.isCurPlayer(1) &&
                         MjClient.playui._rightTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else if(num == 3 && MjClient.playui.isCurPlayer(2) &&
                         MjClient.playui._leftTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else{
                            this.visible = false;
                        }
                    },
                    mjhand: function() {
                        this.visible = false;
                    },
                    onlinePlayer: function() {
                        var num = MjClient.playui.getPlayersNum();
                        if(num == 2 && MjClient.playui.isCurPlayer(1) && 
                            MjClient.playui._leftTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else if(num == 3 && MjClient.playui.isCurPlayer(1) &&
                         MjClient.playui._rightTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else if(num == 3 && MjClient.playui.isCurPlayer(2) &&
                         MjClient.playui._leftTime.getString() == "0" && MjClient.playui.isInPlay()){
                            this.visible = true;
                        }
                        else{
                            this.visible = false;
                        }
                    },
                    waitPut: function() {
                        this.visible = false;
                    },
                    HZNewCard: function(){
                        this.visible = false;
                    },
                    MJPeng: function() {
                        this.visible = false;
                    },
                    HZChiCard: function() {
                        this.visible = false;
                    },
                    HZGangCard: function() {
                        this.visible = false;
                    },
                    HZWeiCard: function() {
                        this.visible = false;
                    },
                    MJPut: function(){
                        this.visible = false;
                    },
                    roundEnd: function(){
                        this.visible = false;
                    }
                },
            },
        };

        return jsBind;
    }
});

//倒计时
playPanel_hhHongGuaiWan.prototype.excCountDown = function(node) {
    var off = this.getUIOffByNode(node);
    node.stopAllActions();
    stopEffect(playTimeUpEff);
    playTimeUpEff = null;
    if(MjClient.playui.isCurPlayer(off) && MjClient.playui.isInPlay()){
        node.setString("10");
        var cb = function() {
            if(node.getString() == "0") {
                node.stopAllActions();
            }
            else {
                var num = Number(node.getString()) - 1;
                node.setString(num);
                if(num <= 9) {
                    var tData = MjClient.data.sData.tData;
                    if(tData.uids[tData.curPlayer] == SelfUid()) {
                        if(num == 0) {
                            //记录音效的handle
                            playTimeUpEff = playEffect("loop_alarm", true);
                            MjClient.native.NativeVibrato();
                        }
                    }
                    else {
                        if(num == 0 && !MjClient.endoneui)
                            MjClient.playui._operateWait.visible = true;
                    }
                }
            }
        }

        node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(cb))));
        //node.setString("0");
    }
}

playPanel_hhHongGuaiWan.prototype.showAndHideTrust = function(node){
    var off = this.getUIOffByNode(node);
    var pl = getUIPlayer_xiangxiang(off);
    if(!pl){
        return;
    }
    var tData = MjClient.data.sData.tData;
    var head = node.getChildByName("layout_head");
    var trust = head.getChildByName("img_trustFlag");
    if(pl.trust){
        trust.visible = true;
    }else{
        trust.visible = false;
    }

    if(cc.sys.isObjectValid(this.trustLayer)){
        var pl = this.getUIPlayer(0);
        if(pl.trust && tData.tState != TableState.roundFinish){
            this.trustLayer.visible = true;
            if(!MjClient.hasPut && this.isCurPlayer(0) && tData.tState == TableState.waitPut){
                var putNode = this._downNode.getChildByName("img_putCard");
                //putNode.removeAllChildren();
                putNode.setVisible(false);
            }

            this.refreshHandCard(0);
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

// 打坨UI
playPanel_hhHongGuaiWan.prototype.showDaTuoNode = function(node) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if(pl && pl.jiazhuNum == 2 && MjClient.rePlayVideo == -1) {
        if(SelfUid() == pl.info.uid) {
            var layer = new laZhangLayer();
            this.addChild(layer, 99);
            if(MjClient.webViewLayer != null)
                MjClient.webViewLayer.close();
        }else {
            this._jiazhuWait.visible = false;
        }
    }

    if (MjClient.rePlayVideo != -1) {
         MjClient.playui._jiazhuWait.visible = false;
    }
}

//检测距离信息
playPanel_hhHongGuaiWan.prototype.checkCanShowDistance = function(layoutData) {
    var disLayer = this.disLayer;
    if (disLayer) {
        disLayer.removeFromParent();
        this.disLayer = null;
    }

    var tState = MjClient.data.sData.tData.tState;
    if (!tState || tState > TableState.waitReady) {
        return;
    }
    if (MjClient.data.sData.tData.fieldId) {
        return;
    }
    if (MjClient.timeoutShowDistanceID) {
        clearTimeout(MjClient.timeoutShowDistanceID);
        MjClient.timeoutShowDistanceID = null;
    }

    if (this.getPlayersNum() == 3) {
        disLayer = new Distance3PlayerLayer(layoutData);
    } else if (this.getPlayersNum() == 4) {
        disLayer = new DistanceLayer(layoutData);
    } else {
        return;
    }
    this.disLayer = disLayer;
    this.addChild(disLayer);
};

playPanel_hhHongGuaiWan.prototype.calculateHintPutList = function() {
    MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//规则说明
playPanel_hhHongGuaiWan.prototype.getRuleInfo = function() {
    return "";
}

//Override
playPanel_hhHongGuaiWan.prototype.calculateHintPutList = function() {
    MjClient.hintPutList_ziPai = MjClient.huzi.hintPutCardsToTing();
};

//Override
playPanel_hhHongGuaiWan.prototype.createEndOneLayer = function(type) {
    return MjClient.playui.isCoinField() ? (new EndOneView_ziPaiGold()) : (new EndOneView_hhHongGuaiWan());
};

playPanel_hhHongGuaiWan.prototype.getTingCards = function(sData, pl, putCard) {
    return MjClient.huzi.getTingCards(sData, pl, putCard);
};

//总结算面板
playPanel_hhHongGuaiWan.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_hhHongGuaiWan();
};

//字牌字体列表
playPanel_hhHongGuaiWan.prototype.getCardFontList = function() {
    return ["type1", "type2", "type3"];
};

//Override 
playPanel_hhHongGuaiWan.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT  = "KEY_ZI_PAI_PLAY_UI_LAYOUT";   //字牌布局
    MjClient.KEY_ZI_PAI_GAME_BG_TYPE  = "KEY_ZI_PAI_GAME_BG_TYPE";   //字牌游戏背景类型
    MjClient.KEY_ZI_PAI_ZI_PAI_TYPE  = "KEY_ZI_PAI_ZI_PAI_TYPE";   //字牌游戏字体类型
    MjClient.KEY_ZI_PAI_HAND_SIZE_TYPE  = "KEY_ZI_PAI_HAND_SIZE_TYPE";   //字牌游戏字体大小类型
    MjClient.KEY_ZI_PAI_FAST_EAT_TYPE  = "KEY_ZI_PAI_FAST_EAT_TYPE";   //字牌游戏快速吃牌类型
    MjClient.KEY_ZI_PAI_HU_XI_TYPE  = "KEY_ZI_PAI_HU_XI_TYPE";   //字牌游戏 显示胡息
    MjClient.KEY_ZI_PAI_XU_XIAN_TYPE  = "KEY_ZI_PAI_XU_XIAN_TYPE";   //字牌游戏 虚线位置
    MjClient.KEY_ZI_PAI_SU_DU_TYPE  = "KEY_ZI_PAI_SU_DU_TYPE";   //字牌游戏 动画速度
    MjClient.KEY_ZI_PAI_TING_PAI_TYPE  = "KEY_ZI_PAI_TING_PAI_TYPE";   //字牌游戏 听牌开关
};

//Override
playPanel_hhHongGuaiWan.prototype.isShowLongCard = function() {
    return true;
};

//Override
playPanel_hhHongGuaiWan.prototype.isCheckTingStats = function() {
    return true;
}

//字牌字体idx
playPanel_hhHongGuaiWan.prototype.getCardFontIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_ZI_PAI_TYPE, 2);
};

//布局类型
playPanel_hhHongGuaiWan.prototype.getLayoutType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_UI_LAYOUT, 0);
};

//Override
playPanel_hhHongGuaiWan.prototype.getGameBgList = function() {
    return ["playing/gameTable/beijing_1.jpg", "playing/gameTable/beijing_2.jpg", "playing/gameTable/beijing_3.jpg"];
};

//Override
playPanel_hhHongGuaiWan.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 0);
};

//Override
playPanel_hhHongGuaiWan.prototype.getHuXiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, 0);
    return [1, 0][idx];
};

//Override
playPanel_hhHongGuaiWan.prototype.getXuXianType = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_XU_XIAN_TYPE, 1);
};

//Override
playPanel_hhHongGuaiWan.prototype.getSuDuType = function() {
    var old = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, 2);
    return [2,0,1,3][old];
};

//Override
playPanel_hhHongGuaiWan.prototype.getTingPaiType = function() {
    var idx = util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PLAY_TING_PAI, 1);
    return [1, 0][idx];
};

//Override
playPanel_hhHongGuaiWan.prototype.displayEatLabel = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurEatPlayer(msg, off)) {
        return;
    }

    var eatType = this.apartGangType(eatType, msg);
    var uiNode = this.getUINode(off);
    var layout_eatCards = uiNode.getChildByName("layout_eatDisplay");
    var labels = {
        mjchi: "img_chi",
        mjpeng: "img_peng",
        mjgang0: "img_pao",
        mjwei: "img_wei",
        mjgang1: "img_ti",
        hu: "img_hu"
    };
    var eatLabel = layout_eatCards.getChildByName(labels[eatType]);
    eatLabel.visible = true;

    var callback = function (){
        eatLabel.visible = false;
    };

    var showEatActionAnim = function(node, name){
        node.visible = true;
        //邵阳放炮罚播放吃碰偎跑提的骨骼动画
        var delayActionTime = 2;
        var path1 = "spine/ziPaiEatAnim/" + name + "/skeleton.json";
        var path2 = "spine/ziPaiEatAnim/" + name + "/skeleton.atlas";
        var projNode = createSpine(path1, path2);
        projNode.setAnimation(0, 'animation', false);
        projNode.setPosition(70,20);

        projNode.setScale(1.4);
        projNode.setTimeScale(0.75);

        node.removeAllChildren();
        node.loadTexture("playing/gameTable/empty.png");
        node.setContentSize(cc.size(120, 120));
        node.runAction(cc.sequence(cc.delayTime(delayActionTime + (this.isAniParallel ? 1 : 0)), cc.callFunc(callback)));
        node.addChild(projNode,999999);
    };

    switch(eatType)
    {
        case 'mjchi':
            showEatActionAnim(eatLabel,"chi");
            break;

        case "mjpeng":
            showEatActionAnim(eatLabel,"peng");
            break;

        case "mjwei":
            showEatActionAnim(eatLabel,"wei");
            break;

        case "hu":
            showEatActionAnim(eatLabel,"hu");
            break;

        case "mjgang0":
            showEatActionAnim(eatLabel,"pao");
            break;

        case "mjgang1":
            showEatActionAnim(eatLabel,"ti");
            break;
    }
}

//Override（0：不可见   1：蒙层   2 可见  3 置灰
playPanel_hhHongGuaiWan.prototype.getCardShowType = function(card, off) {
    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    // 展示
    if (!pl.mjHide || pl.mjHide.indexOf(card) < 0 || pl.info.uid == SelfUid() || pl.mjgang1.indexOf(card) >= 0) {
        return 2;
    }

    return 0;
};

//Override 收入亮张动画
playPanel_hhHongGuaiWan.prototype.showPickCardAnimation = function(node) {
    var self = this;
    var off = this.getUIOffByNode(node);
    var tData = MjClient.data.sData.tData;
    if (!this.isCurPlayer(off)) {
        return;
    }

    if(!tData.isLastDraw){
        node.visible = false;
        self.updateHandCardByHZPickCard(self.getUINode(off).getChildByName("img_putCard"));
        return;
    } 

    var movePos = cc.p(node.getUserData().pos.x, node.getUserData().pos.y - 160);
    if (off != 0) {
        var uiNode = this.getUINode(off);
        movePos = uiNode.getChildByName("layout_head").getPosition()
        movePos = cc.p(movePos.x, movePos.y - 50);
    }
    
    if(tData.uids[tData.zhuang] == this.getUIPlayer(0).info.uid ){
        // 预防动画停止，导致闲家没恢复参数
        MjClient.hasPut = true;
    } 

    var delay = cc.delayTime(0.5);
    var action1 = cc.moveTo(0.5, movePos);
    var action2 = cc.fadeTo(0.5, 0.1);
    // var action3 = cc.fadeIn(0.1);
    var spawn = cc.spawn(action1, action2);
    var seq = cc.sequence(delay, spawn, cc.callFunc(function() {
        // node.setOpacity(255);
        // node.visible = false;
        node.opacity = 0;
        MjClient.hasPut = false; 
        MjClient.playui.checkCutLineVisible(); // 重置出牌提示文本
        self.updateHandCardByHZPickCard(self.getUINode(off).getChildByName("img_putCard"));
    }));

    if(MjClient.rePlayVideo != -1 ){ // 回放的话，亮张刷一次牌  
        node.visible = false;
        self.updateHandCardByHZPickCard(self.getUINode(off).getChildByName("img_putCard"));
    }else{
        node.runAction(seq); 
    }
};

//Override
playPanel_hhHongGuaiWan.prototype.updateHandCardByHZPickCard = function(node) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off)) {
        if (off == 0) {
            this.refreshHandCard(off);
        }
        return;
    }

    if (MjClient.rePlayVideo == -1 && off != 0) {
        return;
    }
 
    var self = this;
    setTimeout(function() { 
        if (off == 0) {
            var pl = self.getUIPlayer(off);
            MjClient.HandCardArr = MjClient.majiang.sortCard(pl.mjhand, 1);
        }
        self.initHandCards(node);
    }, 0);
};

//Override
playPanel_hhHongGuaiWan.prototype.updateHandCardByPick = function(node) {
    return;
};

//Override
playPanel_hhHongGuaiWan.prototype.showPutCardAnimation = function(node) {
    var off = this.getUIOffByNode(node);
    var putType = MjClient.data.sData.tData.putType;

    var pos; // 起始位置
    if (putType == 1) { // 摸牌
        pos = MjClient.playui.jsBind.layout_cardNum._node.getPosition();
    } else if (putType == 0) { // 出牌
        if (off == 0) {
            pos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 120);
        } else {
            pos = this.getUINode(off).getChildByName("layout_head").getPosition();
        }
    } else {
        return;
    }

    var actTime = this.getAniTimeByType("send");
    var scale =  node.getUserData().scale;
    
    node.setPosition(pos);
    node.stopAllActions();
    node.setScale(scale);
    var seq = cc.sequence(
        cc.moveTo(actTime, node.getUserData().pos),
        cc.callFunc(function() {})
    );
    node.runAction(seq);
};

// 出牌线&出牌手指动画
// playPanel_hhHongGuaiWan.prototype.checkCutLineVisible = function(node) {
//     var cutLine = node || this.jsBind.img_cutLine._node;
//     var finger = this.jsBind.img_finger._node

//     cutLine.visible = false;
//     finger.visible = false;
//     if (MjClient.hasPut) {
//         return;
//     }

//     var tData = MjClient.data.sData.tData;
//     var pl = this.getUIPlayer(0);
//     if (IsTurnToMe() && tData.tState == TableState.waitPut && pl && !pl.isQiHu) {
//         cutLine.visible = true;

//         finger.visible = this.getChuPaiGuide() == 0;
//         finger.stopAllActions();
//         finger.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 0), cc.fadeTo(0.5, 255))));
//     }
// };

playPanel_hhHongGuaiWan.prototype.showDefeatTip = function (uid) {
    var playerNode = this.getUINodeByUid(Number(uid));
    var playerHead = playerNode.getChildByName("layout_head");
    var defeatTip = new ccui.ImageView("playing/paohuzi/defeatTip.png");
    var defeatBG = new ccui.ImageView("playing/paohuzi/defeatBG.png");
    var posX = playerHead.getContentSize().width / 2;
    var posY = playerHead.getContentSize().height * 3 / 5
    defeatTip.setPosition(posX, posY);
    defeatTip.setName("defeatTip");
    defeatBG.setPosition(posX, posY);
    defeatBG.setName("defeatBG");

    playerHead.addChild(defeatBG);
    playerHead.addChild(defeatTip);
};

playPanel_hhHongGuaiWan.prototype.removeDefeatTip = function () {
    var sData = MjClient.data.sData;
    for (var uid in sData.players) {
        var playerNode = this.getUINodeByUid(Number(uid));
        var playerHead = playerNode.getChildByName("layout_head");
        playerHead.removeChildByName("defeatTip");
        playerHead.removeChildByName("defeatBG");
    }
}

// 更新展示牌(背光跟牌)
playPanel_hhHongGuaiWan.prototype.updatePutCard = function(node, msg, isReconnect) {
    var tData = MjClient.data.sData.tData;
    var putType = tData.putType;
    var card = tData.currCard;

    var off = this.getUIOffByNode(node);
    if (!this.isCurPlayer(off) || card == -1 || !this.isInPlay()) {
        return;
    }

    // 牌局中自己手动出牌
    if (putType == 0 && off == 0 && MjClient.rePlayVideo == -1 && !this.isInTrust(SelfUid()) && !isReconnect) {
        return;
    }

    node.loadTexture(putType == 0 ? "playing/paohuzi/chupai_bj.png" : "playing/paohuzi/mopai_bj_0.png");
    node.visible = true;
    node.opacity = 255;

    var putCard = node.getChildByName("img_card"); // 牌
    var src = this.getCardSrc("put", card, this.isShowCardBack(msg));
    putCard.loadTexture(src, 0);

    this.showPutCardAnimation(node);
};

playPanel_hhHongGuaiWan.prototype.isAniParallel = function() {
    return false;
};

// 发牌间隔
playPanel_hhHongGuaiWan.prototype.getSendCardInterval = function() {
    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
    if ([0, 1, 2].indexOf(areaSelectMode.faPai) < 0) {
        return 1;
    }

    return [1.5, 1.1, 0.8][areaSelectMode.faPai];
};

playPanel_hhHongGuaiWan.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    var scale = 0.20;
    if(MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
        if(btnNode.name == "btn_guo"){
            scale = 103 / 720;
        }else if(btnNode.name == "btn_hu"){
            scale = 149 / 720;
        }
    }
    var type = this.getLayoutType();
    switch (type) {
        case 1:
            setWgtLayout(btnNode, [0, scale], [0.5, 0.18], [(idx - (len - 1) / 2) * 1.3 * 0.20 / scale, 1.8 * 0.20 / scale], false, false);
            break;
        case 0:
            setWgtLayout(btnNode, [0, scale], [0.88 - (len - 1 - idx) * 0.12 * 0.20 / scale, 0.11], [0, 1.8 * 0.20 / scale], false, false);
            break;
    }
};