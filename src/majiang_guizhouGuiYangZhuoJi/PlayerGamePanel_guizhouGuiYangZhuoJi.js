//贵州，闷胡血流麻将
var PlayLayer_guizhouGuiYangZhuoJi;
(function() {
    PlayLayer_guizhouGuiYangZhuoJi = PlayLayer_guizhou.extend({
        getJsBind: function() {
            var jsBind = {
                _run: function() {
                    MjClient.playui.dingqueLayer();
                },
                _event:{
                    endRoom: function(msg){
                        if(MjClient.playui.getChildByName("dingqueLayer"))
                        {
                            MjClient.playui.removeChildByName("dingqueLayer");
                        }
                        if (msg.showEnd) {
                            this.addChild(new GameOverLayer_guizhou(),500);
                        }else{
                            MjClient.Scene.addChild(new StopRoomView());
                        }
                    },
                    clearCardUI:function () {
                        for(var off = 0; off < MjClient.playui.huPaiImageArr.length; off++) {
                            MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                        }

                        for(var i = 0; i < MjClient.playui.menCardArr.length; i++){
                            if(cc.sys.isObjectValid(MjClient.playui.menCardArr[i])){
                                MjClient.playui.menCardArr[i].removeFromParent();
                            }
                        }
                        //清理标记
                        for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) MjClient.playui.clearSign(MjClient.playui.getNodeByOff(off));
                        for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++) MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                    },
                    onlinePlayer: function (d) {
                        var tData = MjClient.data.sData.tData;
                        var player = MjClient.playui.getPlayerInfoByOff();
                        if(tData.tState === TableState.roundFinish && d.uid === player.info.uid)
                        {
                            for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++)
                            {
                                MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                            }
                        }

                        //清理标记
                        var tData = MjClient.data.sData.tData;
                        var player = MjClient.playui.getPlayerInfoByOff();
                        if(tData.tState === TableState.roundFinish &&
                            d.uid === player.info.uid &&
                            player.mjState === TableState.isReady)
                        {
                            for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) MjClient.playui.clearSign(MjClient.playui.getNodeByOff(off));
                            for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++) MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                        }
                    },
                    MJSelect:function(msg){
                        for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) {
                            var _nodeName = MjClient.playui.NodeNameArray[off];
                            var pl = MjClient.playui.getPlayerInfoByName(_nodeName);
                            if (pl && msg.uid === pl.info.uid)
                            {
                                pl.que = msg.que;
                            }
                        }
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        tData.tState = msg.tState;
                        MjClient.playui.updatePlayerCards(MjClient.playui.getNodeByName(MjClient.playui.NodeNameArray[0]));
                        MjClient.playui.updateTingTips();
                        // MjClient.playui.updatePlayerEatBtn();

                        var isAllSelected = true;
                        MjClient.AllPlayerRun(function(pl){
                            if(pl.que == -1 || pl.que == undefined)
                            {
                                isAllSelected = false;
                            }
                        });

                        if(isAllSelected) {
                            for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) {
                                var _nodeName = MjClient.playui.NodeNameArray[off];
                                var pl = MjClient.playui.getPlayerInfoByName(_nodeName);
                                if(pl) {
                                    var head = MjClient.playui.getNodeByOff(off).getChildByName("layout_head");
                                    MjClient.playui.playSignAnimation(head, pl.que, off);
                                }
                            }
                        }

                    },
                    mjhand:function()
                    {
                        if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;
                        }
                        MjClient.playui.lastPutCardNode = null;
                        //ScanCheatLayer.showStartOnce();
                        MjClient.playui.handleMjhand();
                        
                        MjClient.playui.dingqueLayer();
                    },
                    initSceneData:function()
                    {
                        if(MjClient.rePlayVideo != -1) return; //回放的时候，不弹解散窗口



                        var tData = MjClient.data.sData.tData;
                        if(tData.delEnd != 0 && !MjClient.delroomui){
                            MjClient.Scene.addChild(new RemoveRoomView());
                            if (MjClient.webViewLayer != null){
                                MjClient.webViewLayer.close();
                            }
                        }else if(tData.delEnd == 0 && MjClient.delroomui){
                            MjClient.delroomui.removeFromParent(true);
                            delete MjClient.delroomui;
                        }
                        if(MjClient.gemewaitingui && cc.sys.isObjectValid(MjClient.gemewaitingui)){
                            MjClient.gemewaitingui.removeFromParent(true);
                            delete MjClient.gemewaitingui;
                        }
                        if(MjClient.playerChatLayer && cc.sys.isObjectValid(MjClient.playerChatLayer)){
                            MjClient.playerChatLayer.removeFromParent(true);
                            delete MjClient.playerChatLayer;
                        }
                        MjClient.playui.resetPlayerHeadLayout();
                        MjClient.playui.updateGPSData();

                        var isAllSelected = true;
                        MjClient.AllPlayerRun(function(pl){
                            if(pl.que == -1 || pl.que == undefined)
                            {
                                isAllSelected = false;
                            }
                        });

                        if(isAllSelected)
                        {
                            for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++){
                                var _nodeName =  MjClient.playui.NodeNameArray[off];
                                var pl = MjClient.playui.getPlayerInfoByName(_nodeName);
                                var tData = MjClient.data.sData.tData;
                                if (pl && pl.que != -1 && pl.que != undefined  && tData.tState != TableState.roundFinish )
                                {
                                    var node = MjClient.playui.getNodeByOff(off);
                                    MjClient.playui.playSignAnimation(node.getChildByName("layout_head"), pl.que, off);
                                }
                            }
                        }

                        MjClient.playui.dingqueLayer();
                    },
                },
                node_wait: {
                    //解散房间
                    btn_delete: {
                        _event: {
                            waitJiazhu: function(){
                                this.visible = !this.getDeleteBtnStatus();
                            },   
                        },
                        getDeleteBtnStatus: function(){
                            return MjClient.playui.isBeganGame();
                        },
                    },
                    //返回主界面
                    btn_backHome: {
                        _event: {
                            waitJiazhu: function(){
                                this.visible = !this.getBackBtnStatus();
                            }   
                        },
                        getBackBtnStatus: function(){
                            return MjClient.playui.isBeganGame();
                        },
                    },
                },
                panel_showAccount:{
                    _visible: false,
                    _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
                    btn_showAccounnt:{
                        _click: function () {
                            MjClient.playui.showAccount();
                        },
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.jsBind.panel_showAccount._node.visible = false;
                            }
                        }
                    }
                },
                panel_showGuMai:{
                    _visible: false,
                    _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
                    bg:{
                        buguBtn: {
                            _click: function () {
                                MjClient.playui.selectedGuMai(0);
                            },
                        },
                        mai_1_btn: {
                            _click: function () {
                                MjClient.playui.selectedGuMai(1);
                            },
                        },
                        mai_2_btn: {
                            _click: function () {
                                MjClient.playui.selectedGuMai(2);
                            },
                        }
                    },
                    _event:{
                        initSceneData:function () {
                            var tData = MjClient.data.sData.tData;
                            var player = MjClient.playui.getUIPlayerByUID(MjClient.playui.getSelfUid());if (!player) return;
                            
                            if (tData.areaSelectMode.gumai && tData.tState == TableState.waitJiazhu 
                                && (typeof(player.gumaiValue) == "undefined" || player.gumaiValue == -1)) {
                                this.visible = true;
                            }
                        },
                        waitJiazhu: function () {
                            this.visible = true;
                        },
                        selectGuMai: function (msg) {
                            if (MjClient.playui.getSelfUid() == msg.uid) this.visible = false;
                        }
                    }
                },
                node_down:{
                    _event:{
                        switch2Dor3D: function(){
                            if(!MjClient.playui.isInGame()){
                                return;
                            }
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.lastPutCardNode = null;
                            MjClient.playui.updata2DTo3DData();
                            MjClient.playui.updatePlayerCards(this);
                            MjClient.playui.updateCardColorAfterTing();
                            MjClient.playui.updateCardColorAfterMenCard();
                            MjClient.playui.updateTingTips();
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                        },
                        mjhand: function(){
                            var player = MjClient.playui.getUIPlayerByUID(MjClient.playui.getSelfUid());
                            player.isZiMo = false;
                            MjClient.playui.initGameData();
                            MjClient.playui.updatePlayerCards(this);
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.searchAllTingCards();
                        },
                        waitPut: function(data){
                            var tData = MjClient.data.sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if(tData.uids[tData.curPlayer] === player.info.uid){
                                MjClient.playui.resetCardLayout(this);
                                MjClient.playui.updatePlayerEatBtn();
                                MjClient.playui.updateTingTips();
                                MjClient.playui.updateCardColorAfterTing();
                                MjClient.playui.updateCardColorAfterMenCard();
                                if(player.isTing) this.getChildByName("img_tingCards").setTingCards();
                            }
                        },
                        initSceneData: function(){
                            var player = MjClient.playui.getUIPlayerByUID(MjClient.playui.getSelfUid());
                            if(player.mjState !== TableState.roundFinish){
                                player.isZiMo = false;
                            }
                            MjClient.playui.initGameData();
                            MjClient.playui.handleInitSceneData();
                            MjClient.playui.updatePlayerCards(this);
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.updataClickCancelTingBtn();
                            MjClient.playui.updateCardColorAfterTing();
                            MjClient.playui.updateCardColorAfterMenCard();
                            //听牌
                            MjClient.playui.searchAllTingCards();
                            if(player.isTing) this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();
                            MjClient.playui.cutDownCardsBeforEndOneWhen23D(this);
                        },
                        newCard: function(data) {
                            var playerNode = MjClient.playui.getNodeByName("node_down");
                            var cardNode = MjClient.playui.createCard(playerNode, MjClient.playui.CsdDefaultCardType.HandCard,
                                MjClient.playui.HandleCardType.Hand, data.newCard);
                            MjClient.playui.dealNewCard(data, cardNode);
                            MjClient.playui.searchAllTingCards();
                            MjClient.playui.resetCardLayout(this);
                            MjClient.playui.updateTingTips();
                        },
                        waitBaoTing: function (d) {
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if(d.uid === player.info.uid){
                                MjClient.playui.updatePlayerEatBtn();
                            }
                        },
                        updateEatFlags: function () {
                            MjClient.playui.updatePlayerEatBtn();
                        },
                        MJBaoTing: function () {
                            var player = MjClient.playui.getPlayerInfoByOff();
                            if(player.isTing){
                                MjClient.playui.updateTingTips();
                                MjClient.playui.getNodeByOff().getChildByName("img_tingCards").setTingCards();
                            }
                        }
                    },
                    layout_head:{
                        img_tingIcon:{
                            _event:{
                                MJBaoTing: function (msg) {
                                    MjClient.playui.processBaoTingIcon(this, "node_down", msg);
                                }
                            }
                        },
                        gumaiIcon: {
                            _visible: false,
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) return;
                                    if (typeof(player.gumaiValue) == "undefined" || player.gumaiValue <= 0) {
                                        this.visible = false;
                                    }
                                    else {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (player && player.info.uid == msg.uid && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                mjhand:function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (player && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                            }
                        },
                        gumaiTip: {
                            _visible: false,
                            _run: function () {
                                var that = this;
                                var num = 0;
                                this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                    num++;
                                    var idx = num % 3;
                                    var str = "";
                                    if (idx == 0) str = "估卖中.";
                                    else if (idx == 1) str = "估卖中..";
                                    else if (idx == 2) str = "估卖中...";
                                    that.setString(str);
                                })).repeatForever());
                            },
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) return;
                                    if (tData.areaSelectMode.gumai && player.gumaiValue < 0 && tData.tState == TableState.waitJiazhu) {
                                        this.visible = true;
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                waitJiazhu: function () {
                                    this.visible = true;
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (player.info.uid == msg.uid) {
                                        this.visible = false;
                                    }
                                }
                            }
                        }
                    },
                    img_menCards:{
                        _visible: false,
                        _event:{
                            MJMenHu: function(msg){
                                MjClient.playui.processMenHu(this.getParent(), msg);
                            },
                            clearCardUI: function () {
                                this.setVisible(false);
                            }
                        }
                    }
                },
                node_right:{
                    layout_head:{
                        img_tingIcon:{
                            _event:{
                                MJBaoTing: function (msg) {
                                    MjClient.playui.processBaoTingIcon(this, "node_right", msg);
                                }
                            }
                        },
                        gumaiIcon: {
                            _visible: false,
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) return;
                                    if (typeof(player.gumaiValue) == "undefined" || player.gumaiValue <= 0) {
                                        this.visible = false;
                                    }
                                    else {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (player && player.info.uid == msg.uid && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                mjhand:function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (player && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                            }
                        },
                        gumaiTip: {
                            _visible: false,
                            _run: function () {
                                var that = this;
                                var num = 0;
                                this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                    num++;
                                    var idx = num % 3;
                                    var str = "";
                                    if (idx == 0) str = "估卖中.";
                                    else if (idx == 1) str = "估卖中..";
                                    else if (idx == 2) str = "估卖中...";
                                    that.setString(str);
                                })).repeatForever());
                            },
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) return;
                                    if (tData.areaSelectMode.gumai && player.gumaiValue < 0 && tData.tState == TableState.waitJiazhu) {
                                        this.visible = true;
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                waitJiazhu: function () {
                                    this.visible = true;
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (player.info.uid == msg.uid) {
                                        this.visible = false;
                                    }
                                }
                            }
                        }
                    },
                    img_menCards:{
                        _visible: false,
                        _event:{
                            MJMenHu: function(msg){
                                MjClient.playui.processMenHu(this.getParent(), msg);
                            },
                            clearCardUI: function () {
                                this.setVisible(false);
                            }
                        }
                    }
                },
                node_top:{
                    layout_head:{
                        img_tingIcon:{
                            _event:{
                                MJBaoTing: function (msg) {
                                    MjClient.playui.processBaoTingIcon(this, "node_top", msg);
                                }
                            }
                        },
                        gumaiIcon: {
                            _visible: false,
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) return;
                                    if (typeof(player.gumaiValue) == "undefined" || player.gumaiValue <= 0) {
                                        this.visible = false;
                                    }
                                    else {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (player && player.info.uid == msg.uid && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                mjhand:function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (player && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                            }
                        },
                        gumaiTip: {
                            _visible: false,
                            _run: function () {
                                var that = this;
                                var num = 0;
                                this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                                    num++;
                                    var idx = num % 3;
                                    var str = "";
                                    if (idx == 0) str = "估卖中.";
                                    else if (idx == 1) str = "估卖中..";
                                    else if (idx == 2) str = "估卖中...";
                                    that.setString(str);
                                })).repeatForever());
                            },
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) return;
                                    if (tData.areaSelectMode.gumai && player.gumaiValue < 0 && tData.tState == TableState.waitJiazhu) {
                                        this.visible = true;
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                waitJiazhu: function () {
                                    this.visible = true;
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (player.info.uid == msg.uid) {
                                        this.visible = false;
                                    }
                                }
                            }
                        }
                    },
                    img_menCards:{
                        _visible: false,
                        _event:{
                            MJMenHu: function(msg){
                                MjClient.playui.processMenHu(this.getParent(), msg);
                            },
                            clearCardUI: function () {
                                this.setVisible(false);
                            }
                        }
                    }
                },
                node_left:{
                    layout_head:{
                        img_tingIcon:{
                            _event:{
                                MJBaoTing: function (msg) {
                                    MjClient.playui.processBaoTingIcon(this, "node_left", msg);
                                }
                            }
                        },
                        gumaiIcon: {
                            _visible: false,
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) return;
                                    if (typeof(player.gumaiValue) == "undefined" || player.gumaiValue <= 0) {
                                        this.visible = false;
                                    }
                                    else {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (player && player.info.uid == msg.uid && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                mjhand:function()
                                {
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (player && player.gumaiValue > 0) {
                                        this.visible = true;
                                        this.loadTexture("res/playing/gameTable/gumai/mai" + player.gumaiValue + "_1.png");
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                            }
                        },
                        gumaiTip: {
                            _visible: false,
                            _run: function () {
                                var that = this;
                                var num = 0;
                                this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                    num++;
                                    var idx = num % 3;
                                    var str = "";
                                    if (idx == 0) str = "估卖中.";
                                    else if (idx == 1) str = "估卖中..";
                                    else if (idx == 2) str = "估卖中...";
                                    that.setString(str);
                                })).repeatForever());
                            },
                            _event:{
                                initSceneData:function () {
                                    var tData = MjClient.data.sData.tData;
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) return;
                                    if (tData.areaSelectMode.gumai && player.gumaiValue < 0 && tData.tState == TableState.waitJiazhu) {
                                        this.visible = true;
                                    }
                                    else {
                                        this.visible = false;
                                    }
                                },
                                waitJiazhu: function () {
                                    this.visible = true;
                                },
                                selectGuMai: function (msg) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (player.info.uid == msg.uid) {
                                        this.visible = false;
                                    }
                                }
                            }
                        }
                    },
                    img_menCards:{
                        _visible: false,
                        _event:{
                            MJMenHu: function(msg){
                                MjClient.playui.processMenHu(this.getParent(), msg);
                            },
                            clearCardUI: function () {
                                this.setVisible(false);
                            }
                        }
                    }
                },
                node_eat:{
                    // 闷胡按钮
                    btn_menhu: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if(eventType !== ccui.Widget.TOUCH_ENDED){
                                return;
                            }
                            MjClient.playui.hideEatNodeChildren();
                            MjClient.playui.sendMenHuToServer();
                        }
                    },
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_guizhouGuiYangZhuoJi.json");
            MjClient.playui = this;
            return true;
        },

        initAnimationType: function(){
            var AnimationType = {
                "CHI"     : "chi",              //吃牌
                "PENG"    : "peng",             //碰牌
                "GANG"    : "gang",             //杠牌
                "HU"      : "hu",               //胡牌
                "MENHU"   : "menhu",            //闷胡
                "TING"    : "ting",             //听牌
            };
            this.AnimationType = AnimationType;
        },

        isInGame: function(){
            var tData = MjClient.data.sData.tData;
            if (!tData) return false;
            if (tData.tState === TableState.waitPut ||
                tData.tState === TableState.waitEat ||
                tData.tState === TableState.waitCard ||
                tData.tState === TableState.waitSelect ||
                tData.tState === TableState.waitBaoTing) {
                return true;
            }
            return false;
        },

        /**
         *  是否已经开始游戏
         *  return {Boolean}
         **/
        isBeganGame: function(){
            var tData = MjClient.data.sData.tData;
            if (!tData) return false;
            if (tData.tState === TableState.waitJiazhu ||
                tData.tState === TableState.waitPut ||
                tData.tState === TableState.waitEat ||
                tData.tState === TableState.waitCard ||
                tData.tState === TableState.waitSelect ||
                tData.tState === TableState.roundFinish ||
                tData.tState === TableState.waitBaoTing) {
                return true;
            }
            return false;
        },

        dingqueLayer: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var pl = MjClient.playui.getPlayerInfoByName(MjClient.playui.NodeNameArray[0]);
            if (tData.tState === TableState.waitSelect && SelfUid() === pl.info.uid && MjClient.rePlayVideo == -1) {
                if (typeof(pl.que) == "undefined" || pl.que === -1)
                {
                    if(!MjClient.playui.getChildByName("dingqueLayer"))
                    {
                        var params = {
                            cardTypeArr : [0, 1, 2],
                            number : 1
                        };
                        var layer = new DingQueGuiZhouLayer(params);
                        layer.setName("dingqueLayer");
                        MjClient.playui.addChild(layer, 10);
                    }
                    if (MjClient.webViewLayer != null) {
                        MjClient.webViewLayer.close();
                    }
                }
            }
        },

         /**
         * 定缺之后的动画,飞到对应的头像上面
         */
        playSignAnimation: function (node, ques, dir) {

            var tData = MjClient.data.sData.tData;
            if(tData && tData.tState === TableState.waitJiazhu){
                return;
            }

            function queIconAction(que, idx) {
                var filePath = "playing/queUI/sign" + que + ".png";
                if (!jsb.fileUtils.isFileExist(filePath)) return;
                var sign = new ccui.ImageView();
                var plusX = 85 + 60;
                var plusY = idx === 1 ? -35 : 35;
                var offX = node.width - plusX + node.getContentSize().width;
                var offY = node.height + plusY - 50;


                sign.loadTexture(filePath);
                sign.name = "sign" + idx;
                node.addChild(sign);
                var endPos = cc.p(offX, offY);
                var worldCenterPos = cc.p(MjClient.size.width/2, MjClient.size.height/2);
                var startPos = sign.getParent().convertToNodeSpace(worldCenterPos);
                sign.setPosition(startPos);
                sign.runAction(cc.spawn(cc.scaleTo(0.8,1.2, 1.2), cc.moveTo(0.8, endPos)));
            }
            queIconAction(ques[0], 0);
            queIconAction(ques[1], 1);
        },

        // 回放创建Card重置名字
        resetCardName: function(dirctionNode, copyNodeName){
            if(MjClient.rePlayVideo !== -1 && copyNodeName === this.CsdDefaultCardType.HandCard && dirctionNode.getName() !== "node_down"
                && dirctionNode.getName() !== "layout_infoData" && dirctionNode.getName() !== "layout_cardInfoItem"
                && dirctionNode.getName() !== "panel_scoreInfoItem"){ // 小结算不更改名字
                copyNodeName = this.CsdDefaultCardType.PutCardOne;
            }
            return copyNodeName;
        },

        /**
         * 清除头像上的标记
         * @param off
         */
        clearSign: function (node) {
            if (!node) return;
            var sign0 = node.getChildByName("layout_head").getChildByName("sign0");
            if (sign0) {
                sign0.removeFromParent();
            }
            var sign1 = node.getChildByName("layout_head").getChildByName("sign1");
            if (sign1) {
                sign1.removeFromParent();
            }

            var tData = MjClient.data.sData.tData;
            if(tData && tData.tState === TableState.roundFinish){
                var gumai = node.getChildByName("layout_head").getChildByName("gumaiIcon");
                if (gumai) {
                    gumai.setVisible(false);
                }
            }
        },

        /**
         *  began事件时的验证,返回true ，当前不能出牌
         **/
        checkWhenTouchBegan: function (cardNode) {
            // MjClient.showToast("checkWhenTouchBegan ！");
            //this.addChild(new maJiang_showChicken([11,12,13], function(){}));
            // 自动摸打


            if(!this.isTurnMe()){
                return true;
            }
            if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
                return true;
            }
            var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
            if(handCount % 3 != 2){
                return true;
            }

            var sData = MjClient.data.sData;
            var tData = sData.tData;
            if(tData.tState === TableState.waitSelect){ //定缺未完成不能打牌
                MjClient.showToast("等待其他玩家定缺！");
                return true;
            }

            var _haveQue = false;
            var player = MjClient.playui.getPlayerInfoByOff();
            for(var k = 0; k < player.mjhand.length ;k++)
            {
                var _cd = player.mjhand[k];
                if(this.isQueCard(_cd)) //手里有缺的麻将
                {
                    _haveQue = true;
                    break;
                }
            }

            if(_haveQue && !this.isQueCard(cardNode.tag)) //打出去的这张牌,不是缺，则不让打(先把缺的牌打完才能打)
            {
                MjClient.showToast("先打定缺的牌！");
                return true;
            }
            return false;
        },

        /**
         *  刷新吃、碰、杠、手牌
         **/
        resetCardLayout : function(node){
            var is3D = this.is3DStyle();
            if(is3D){
                this.resetCardLayout3D(node);
            }else{
                this.resetCardLayout2D(node);
            }
            this.setQueCardColor();
        },
        /**
         * 这张牌是否是定缺的那张牌
         * @param cd
         * @returns {boolean}
         */
        isQueCard: function (cd, pl) {
            if(!pl)  pl = MjClient.playui.getPlayerInfoByOff();
            if(pl.que === -1) return false;
            var value = Math.floor(cd/10);
            if(pl.que.indexOf(value) > -1) return true;
            return false;
        },
        setQueCardColor :function()
        {
            var _haveQue = false;
            var player = MjClient.playui.getPlayerInfoByOff();

            if(player.isTing) return;
            if(!player.mjhand) return;
            for(var k = 0; k < player.mjhand.length ;k++)
            {
                var _cd = player.mjhand[k];
                if(this.isQueCard(_cd)) //手里有缺的麻将
                {
                    _haveQue = true;
                    break;
                }
            }
            var node = MjClient.playui.getNodeByOff(0);
            var children = node.children;
            for(i = 0;i < children.length;i++) {
                var child = children[i];
                if (child.name == this.HandleCardType.Hand) {
                    if(_haveQue)
                    {
                        if(!this.isQueCard(child.tag)) {
                            child.setColor(cc.color(170,170,170));
                        }
                        else
                        {
                            child.setColor(cc.color(255,255,255));
                        }
                    }
                    else
                    {
                        child.setColor(cc.color(255,255,255));
                    }
                }
            }
        },

        selectedGuMai: function (value) {
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "selectGuMai",
                gumaiValue: value,
            });
        },

        isCanAutoPut: function(){
            return false;
        },

        // 检测是否显示听按钮
        checkTingBtn: function (player) {
            var tData = MjClient.data.sData.tData;
            return tData.tState === TableState.waitBaoTing && player.mjState === TableState.waitBaoTing;
        },

        // 点击听按钮
        clickTingBtn: function(){
            MjClient.playui.clickTing = true;
            MjClient.playui.hideEatNodeChildren();
            MjClient.playui.setCardGrayAndUnTouchEnabled();
            this.sendBaoTingToServer(1);
        },

        // 向服务器发送BaoTing消息
        sendBaoTingToServer: function(choice){
            var sendMsg = {
                cmd: "MJBaoTing",
                choice: choice,
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },

        checkGangBtn: function (player) {
            //选择过闷胡之后，不能杠
            if(this.checkIsMenHu(player)) return false;
            this.gangCardArray = [];
            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            var gangArr = this.gangCardArray;
            for(var i = 0; i < gangArr.length; i ++){
                if(player.skipMingGang || this.isQueCard(gangArr[i])) //定缺的牌不能吃，碰，杠,把缺的牌排除
                {
                    var idx = player.skipMingGang.indexOf(gangArr[i]);
                    if(idx > -1){
                        gangArr.splice(idx, 1);
                    }
                }
            }
            return gangArr.length > 0;
        },

        isShowTingCards: function(){
            return true;
        },

        isNeedTingTips: function(){
            var player = MjClient.playui.getPlayerInfoByOff();
            return !(this.checkIsMenHu(player) || player.isTing);
        },

        updateTingTips: function(){

            if(!this.isShowTingCards()){
                return;
            }

            var i, child, tingSign;
            var directNode = this.getNodeByOff();
            var children = directNode.children;
            for(i = 0; i < children.length; i++){
                child = children[i];
                tingSign = child.getChildByName("tingSign");
                if(child.name === this.HandleCardType.Hand && tingSign){
                    tingSign.visible = false;
                }
            }

            if(!this.isNeedTingTips() || !this.isTurnMe()){
                return;
            }


            var maxTingCards = this.getMaxTingHandCards();
            for (i = 0; i < children.length; i++){
                child = children[i];
                if(child.name !== this.HandleCardType.Hand){
                    continue;
                }
                var tingCards = this.tingCardsArray[child.tag] ? this.tingCardsArray[child.tag] : {};
                if(Object.keys(tingCards).length === 0){
                    continue;
                }
                tingSign = child.getChildByName("tingSign");
                var cardSize = child.getContentSize();
                var tingSignFile = "playing/MJ/ting_tips.png";
                if(maxTingCards.indexOf(child.tag) >= 0){
                    tingSignFile = "playing/other/tingcardmost.png";
                }
                if(tingSign){
                    tingSign.loadTexture(tingSignFile);
                    tingSign.visible = true;
                    tingSign.setPosition(cc.p(cardSize.width / 2, cardSize.height * 1.1));
                    continue;
                }
                tingSign = new ccui.ImageView(tingSignFile);
                tingSign.setName("tingSign");
                tingSign.setPosition(cc.p(cardSize.width / 2, cardSize.height * 1.1));
                child.addChild(tingSign, 10);
            }
        },

        // 是否可以检测吃碰杠按钮
        isCanCheckEatBtn: function(){
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var pl = sData.players[this.getSelfUid()];
            if(tData.tState === TableState.waitEat && pl.mjState === TableState.waitEat){
                return true;
            }
            if(tData.tState === TableState.waitBaoTing && pl.mjState === TableState.waitBaoTing){
                return true;
            }
            return false;
        },

        updatePlayerEatBtn: function(){
            this.hideEatNodeChildren();

            if(!this.isTurnMe() && !this.isCanCheckEatBtn()){
                return;
            }
            var eatNodeArr = this.getPlayerEatNode();
            var pct = this.isIPad() ? 0.12 : 0.18;
            var pos = this.isIPad() ? 0.80 : 0.77;
            var space = this.isIPad() ? 1.4 : 1.5;
            var off_y = this.isIPad() ? 1.7 : 2.0;
            for(var i = 0;i < eatNodeArr.length;i++){
                var btn = eatNodeArr[i];
                btn.visible = true;
                setWgtLayout(btn, [0, pct], [pos, 0], [(i - eatNodeArr.length + 1) * space, off_y], false, false);
            }
        },

        getPlayerEatNode: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var nodeArr = [];
            this.gangCardArray = [];

            //2，3人才有定缺
            if(tData.areaSelectMode.dingque && (typeof(player.que) == "undefined" || player.que === -1)){
                return nodeArr;
            }

            if(this.isTurnMe()){
                //杠
                if(!player.isTing && MjClient.playui.checkGangBtn(player) && !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }

                //听
                if(!player.isTing && MjClient.playui.checkTingBtn(player)){
                    nodeArr.push(eat.btn_ting._node);
                }

                //闷胡
                if(player.eatFlag & 16){
                    nodeArr.push(eat.btn_menhu._node);
                }

                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
            }else{
                //听
                if(!player.isTing && MjClient.playui.checkTingBtn(player)){
                    nodeArr.push(eat.btn_ting._node);
                }
                if (!player.isTing && player.eatFlag & 4 ) {
                    nodeArr.push(eat.btn_gang._node);
                    this.gangCardArray.push(tData.lastPutCard);
                }
                if (player.eatFlag & 16){
                    nodeArr.push(eat.btn_menhu._node);
                }
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                }
            }
            if(!this.checkIsMenHu(player) && nodeArr.length > 0){
                nodeArr.push(eat.btn_guo._node);
            }
            this.reloadBtnTexture(nodeArr);
            return nodeArr;
        },

        clickPass: function(){
            var that = this;
            var player = that.getPlayerInfoByOff(0);

            if(that.checkTingBtn(player)){   //过软报硬报
                that.clickTingPass = true;
                that.hideEatNodeChildren();
                return that.sendBaoTingToServer(0);
            }

            if (that.isTurnMe()){

                // 需要过弹窗的【过胡】
                if(player.eatFlag & 8){

                    var msg = "确认过胡吗？";
                    MjClient.showMsg(msg, function(){         // 过胡弹窗处理
                        that.hideEatNodeChildren();
                        that.sendPassToServer();
                    }, function() {}, "1");

                } else {

                    // 不要过弹窗的【过碰、过暗杠】

                    if (that.checkGangBtn(player)){  //过杠不用每次提示
                        that.clickGangPass = true;
                    }

                    that.hideEatNodeChildren();
                    that.sendPassToServer();

                }

            }else{
                if(that.checkTingBtn(player)){   //过天听不用每次提示
                    that.clickTingPass = true;
                    return that.sendBaoTingToServer(0);
                }

                if(player.eatFlag & 8){
                    MjClient.showMsg("确认不胡吗?", function(){
                        that.hideEatNodeChildren();
                        that.sendPassToServer();
                    }, function() {}, "1");
                }else{
                    that.hideEatNodeChildren();
                    that.sendPassToServer();
                }
            }
        },

        // 检测是否已经闷胡过了
        checkIsMenHu: function(player){
            return player.menHu && player.menHu.length > 0;
        },

        sendMenHuToServer:function () {
            if (MjClient.rePlayVideo !== -1) {
                return;
            }

            var sendMsg = {
                cmd: "MJMenHu",
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },

        isDianPaoMenHu: function(msg){
            var len = msg.menHuOfShow.length;
            return msg.menHuOfShow[len - 1] !== -1;
        },

        processMenHu: function(node, msg) {
            var tData = MjClient.data.sData.tData;
            var nodePlayer = MjClient.playui.getPlayerInfoByName(node.getName());
            if(nodePlayer.info.uid !== msg.uid) return;
            var selfUid = MjClient.playui.getSelfUid();
            var isSelfMenHu = selfUid === msg.uid;

            var menHuIndex = tData.uids.indexOf(msg.uid);
            var menHuPlayerNode = MjClient.playui.getUIBind(menHuIndex);

            var isDianPaoMenhu = MjClient.playui.isDianPaoMenHu(msg);
            var dianPaoIndex = msg.from;
            var dianPaoPlayerNode = MjClient.playui.getUIBind(dianPaoIndex);

            if(isDianPaoMenhu){
                var menCard = tData.lastPutCard;
                this.removeCard(dianPaoPlayerNode, this.HandleCardType.Put, menCard, 1);
                MjClient.playui.removePutCardTip();
            }else{
                MjClient.playui.updateCardColorAfterMenCard();
                this.removeCard(menHuPlayerNode, this.HandleCardType.Hand);
            }

            this.resetCardLayout(menHuPlayerNode);
            var menHuCard = isSelfMenHu ? msg.menHu : msg.menHuOfShow;
            MjClient.playui.updateMenHuCard(node, menHuCard);
            MjClient.playui.updatePlayerEatBtn();
            MjClient.playui.showEatActionAnim(menHuPlayerNode, MjClient.playui.AnimationType.MENHU);
        },

        doBeforeAddPutOutCard:function(copyNode) {
            MjClient.playui.frontShowedJiCardsArr = MjClient.playui.frontShowedJiCardsArr || []; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签
            var playerNode = copyNode.getParent();
            var player = MjClient.playui.getPlayerInfoByName(playerNode.getName());
            player.chongFengJi = player.chongFengJi || [];//如果不存在
            if(player.chongFengJi.indexOf(copyNode.tag) < 0) {
                if(MjClient.majiang.isDefaultJi(copyNode.tag) && MjClient.playui.frontShowedJiCardsArr.indexOf(copyNode.tag) < 0) {
                    player.chongFengJi.push(copyNode.tag);
                }
            }
            this.addJiIcon2D(copyNode);
        },

        addJiIcon2D:function(cardNode) {
            var playerNode = cardNode.getParent();
            var pl = MjClient.playui.getPlayerInfoByName(playerNode.getName());
            MjClient.playui.frontShowedJiCardsArr = MjClient.playui.frontShowedJiCardsArr || []; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签
            if(pl.chongFengJi && pl.chongFengJi.indexOf(cardNode.tag) > -1 && MjClient.playui.frontShowedJiCardsArr.indexOf(cardNode.tag) < 0) {
                MjClient.playui.frontShowedJiCardsArr.push(cardNode.tag);//为了标记这张牌已经加个冲的字样
                var offIndex = this.getNodeIndexDefaultByName(cardNode.getParent().getName());
                var laiZiPosArr = this.getHunIconPosition2D();
                var laiZiNode = this.getJiTagIcon();
                laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
                var _rotation = [0, -90, -180, -270];
                laiZiNode.setRotation(_rotation[offIndex]);
                cardNode.addChild(laiZiNode);
            }
        },


        updateCardColorAfterMenCard : function(){
            var player = this.getPlayerInfoByOff();
            if(MjClient.playui.checkIsMenHu(player)){
                this.setCardGrayAndUnTouchEnabled();
            }
        },

        updateCardColorAfterTing: function(){
            var player = this.getPlayerInfoByOff();
            if(player && player.isTing){
                this.setCardGrayAndUnTouchEnabled();
            }
        },


        setCardGrayAndUnTouchEnabled: function(){
            var playerNode = this.getNodeByOff();
            var color = cc.color(190, 190, 190);
            var standNode = playerNode.getChildByName(this.CsdDefaultCardType.HandCard);
            var children = playerNode.children;
            for(var i = 0; i < children.length; i++){
                var cardNode = children[i];
                if(cardNode.name === this.HandleCardType.Hand){
                    cardNode.isGray = true;
                    cardNode.setColor(color);
                    cardNode.addTouchEventListener(function () {});
                    cardNode.y = standNode.y;
                }
            }
        },

        updateMenNodePosition: function(playerNode, menNode){
            var nodeName = playerNode.getName();
            var is3D = MjClient.playui.get3DType();
            switch (nodeName) {
                case "node_down":
                    setWgtLayout(menNode, [0.25, 0.25], [0.55, 0.24], [0, 0]);
                    break;
                case "node_right":
                    if(is3D){
                        setWgtLayout(menNode, [0.2, 0.2], [0.74, 0.83], [0, 0]);
                    }else{
                        setWgtLayout(menNode, [0.2, 0.2], [0.78, 0.83], [0, 0]);
                    }
                    break;
                case "node_top":
                    if(is3D){
                        setWgtLayout(menNode, [0.2, 0.2], [0.33, 0.88], [0, 0])
                    }else{
                        setWgtLayout(menNode, [0.2, 0.2], [0.28, 0.85], [0, 0])
                    }
                    break;
                case "node_left":
                    if(is3D){
                        setWgtLayout(menNode, [0.2, 0.2], [0, 0.83], [0, 0])
                    }else{
                        setWgtLayout(menNode, [0.2, 0.2], [0, 0.67], [0, 0])
                    }
                    break;
            }
        },

        updateMenHuCard: function (playerNode, cardList) {
            var menNode = playerNode.getChildByName("img_menCards");
            var menCard = menNode.getChildByName("img_menCard");
            var menCardX = menCard.x;
            var menCardY = menCard.y;
            var menCardGap = menCard.width * menCard.scale;
            if(!cardList) return;
            if(cardList.length > 0) menNode.setVisible(true);
            menNode.setLocalZOrder(999);
            for(var i = 0; i < cardList.length; i ++){
                var cardTag = cardList[i];
                var cardNode = menCard.clone();
                menNode.addChild(cardNode);
                MjClient.playui.setCardSprite(cardNode, cardTag, true);
                if(cardTag === -1) cardNode.loadTexture("playing/gameTable/menCard_bei.png");
                var imageNode = cardNode.getChildByName("cardImg");
                cardNode.setName("menCard");
                cardNode.setPosition(cc.p(menCardX + i * menCardGap, menCardY));
                MjClient.playui.menCardArr.push(cardNode);    // 所有人闷的牌都存起来
                if(imageNode) {
                    imageNode.setScale(0.35);
                    imageNode.setPosition(cardNode.width/2, cardNode.height/2);
                }
            }
            this.updateMenNodePosition(playerNode, menNode);
        },

        updatePlayerCards: function (node) {
            if(!node) return;
            this._super(node);

            if(MjClient.data.sData.tData.tState === TableState.roundFinish) return;
            var nodeName = node.getName();
            var player = MjClient.playui.getPlayerInfoByName(nodeName);
            if(!player) return;
            var menHuArr = [];
            if(nodeName === "node_down"){
                menHuArr = player.menHu;
            }else{
                menHuArr = player.menHuOfShow;
            }
            MjClient.playui.updateMenHuCard(node, menHuArr);
        },

        processBaoTingIcon: function(tingIconNode, playerNodeName, msg){
            var baoTingUid = msg.uid;
            var player = MjClient.playui.getPlayerInfoByName(playerNodeName);
            if (player && player.info.uid === baoTingUid && player.isTing){
                tingIconNode.visible = true;
            }
        },

        handleRoundEnd: function () {
            var tData = MjClient.data.sData.tData;
            var self = this;
            MjClient.playui.frontShowedJiCardsArr = [];   //小局结束，要清空数据
            var finishCallBack = function () {
                if (tData.roundNum <= 0){
                    if(!tData.matchId){
                        self.addChild(new GameOverLayer_guizhou());
                    }else{
                        self.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
                            self.addChild(new GameOverLayer_guizhou());
                        })));
                    }
                }
                self.addChild(new EndOneView_guizhouGuiYangZhuoJi());
            };

            //0.5s -> 倒牌,显示牌型 ->3s->翻鸡->显示大小结算
            var action = cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                self.showMjhandBeforeEndOne();
                self.addHuTypeImage();
            }),cc.delayTime(1),cc.callFunc(function(){
                var showCards = tData.showFanJiCards;
                if(showCards.length > 0){
                    var layer = new maJiang_showChicken(showCards, finishCallBack);
                    layer.setName("showChickenLayer");
                    self.addChild(layer);
                }else{
                    finishCallBack();
                }
            }));
            self.runAction(action);
        }
});
}());


// override 获取缺牌门列表(按牌数 牌好坏排序)
PlayLayer_guizhouGuiYangZhuoJi.prototype.getQueTypeArr = function() {
    var pl = this.getPlayerInfoByOff(0);
    var mjhand = pl.mjhand;

    // 门子牌型信息
    var menInfo = [
        {type: 0, cards: [], priority: 0}, // 条
        {type: 1, cards: [], priority: 0}, // 万
        {type: 2, cards: [], priority: 0}, // 筒
    ];

    for (var i = 0; i < mjhand.length; i++) {
        var idx = Math.floor(mjhand[i] / 10);
        menInfo[idx].cards.push(mjhand[i]);
    }

    // 门子优先级
    for (var i = 0; i < menInfo.length; i++) {
        var info = menInfo[i];
        var cards = info.cards;
        info.priority += cards.length * 100;
        if (cards.length >= 5) { // 2门
            continue;
        }

        var dict = {};
        for (var j = 0; j < cards.length; j++) {
            dict[cards[j]] = dict[cards[j]] ? dict[cards[j]] + 1 : 1;
        }

        for (var k in dict) { // todo 优化(杠 坎与顺 连牌 单牌之间比较)
            // 顺
            if (dict[k] > 0 && dict[k + 1] > 0 && dict[k + 2] > 0) {
                dict[k]--; dict[k + 1]--; dict[k + 2]--;
                info.priority += 10;
            }

            // 坎
            if (dict[k] >= 3) {
                dict[k] -= 3;
                info.priority += 10;
            } else if (dict[k] >= 2) { // 对
                dict[k] -= 2;
                info.priority += 1;
            }
        }
    }

    menInfo.sort(function(a, b) {
        return a.priority - b.priority;
    });

    var queTypeArr = [];
    for (var i = 0; i < menInfo.length; i++) {
        queTypeArr.push(menInfo[i].type);
    }

    console.log("queTypeArr@@ ", queTypeArr);

    return queTypeArr;
};

// override  缺牌门数
PlayLayer_guizhouGuiYangZhuoJi.prototype.getQueNum = function() {
    return 1;
};

// override 是否添加定缺提示特效
PlayLayer_guizhouGuiYangZhuoJi.prototype.hasDingQueTip = function() {
    return true;
};