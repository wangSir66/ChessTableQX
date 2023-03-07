//邵阳红中麻将
var majiang_panel_SYHZ;
(function() {
    majiang_panel_SYHZ = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                node_down: {
                    layout_head:{
                        text_piao: {
                            _visible: false,
                            _event: {
                                initSceneData: function(){
                                    MjClient.playui.updatePiaoContent("node_down", this);
                                },
                                mjhand: function(){
                                    MjClient.playui.updatePiaoContent("node_down", this);
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            }
                        },
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    }
                },
                node_right: {
                    layout_head:{
                        text_piao: {
                            //每个麻将的实现方式不一样，每个麻将按照下面的模板重写
                            _visible: false,
                            _event: {
                                initSceneData: function(){
                                    MjClient.playui.updatePiaoContent("node_right", this);
                                },
                                mjhand: function(){
                                    MjClient.playui.updatePiaoContent("node_right", this);
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            }
                        },
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    }
                },
                node_top: {
                    layout_head:{
                        text_piao: {
                            //每个麻将的实现方式不一样，每个麻将按照下面的模板重写
                            _visible: false,
                            _event: {
                                initSceneData: function(){
                                    MjClient.playui.updatePiaoContent("node_top", this);
                                },
                                mjhand: function(){
                                    MjClient.playui.updatePiaoContent("node_top", this);
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            }
                        },
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    }
                },
                node_left: {
                    layout_head:{
                        text_piao: {
                            //每个麻将的实现方式不一样，每个麻将按照下面的模板重写
                            _visible: false,
                            _event: {
                                initSceneData: function(){
                                    MjClient.playui.updatePiaoContent("node_left", this);
                                },
                                mjhand: function(){
                                    MjClient.playui.updatePiaoContent("node_left", this);
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            }
                        },
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    }
                },
                node_jiaPiao: {
                    _run: function() {
                        this.visible = false;
                        this.scale = cc.winSize.width / 1422;
                        this.x = cc.winSize.width / 2;
                        this.y = cc.winSize.height / 4;
                    },
                    btn_buPiao: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(0, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao1: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(1, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao2: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(2, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao3: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(3, MjClient.playui.getSelfUid());
                        }
                    },
                    _event: {
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff(0);
                            if(!pl){
                                return;
                            }
                            if(pl.mjState == TableState.waitJiazhu){
                                this.visible = true;
                            }
                        },
                        waitJiazhu: function(){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4){
                                this.visible = false;
                                return;
                            }
                            this.visible = true;
                        },
                        mjhand: function(){
                            this.visible = false;
                        },
                        onlinePlayer: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff(0);
                            if(!pl){
                                return;
                            }
                            if(pl.info.uid == eD.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                img_piaoNiao:{
                    _visible: false
                },
                img_jiaPiaoTip:{
                    _run: function(){
                        this.visible = false;
                        setWgtLayout(this,[0.5, 0.5], [0.5, 0.5], [0, 0]);
                    },
                    _event: {
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4 && !tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff(0);
                            if(!pl){
                                return;
                            }

                            if (tData.tState === TableState.waitJiazhu) {
                                this.visible = true;
                            }

                            if (pl.mjState == TableState.waitJiazhu){
                                this.loadTexture("playing/gameTable/selectPiao.png");
                            } else {
                                this.loadTexture("playing/gameTable/waitPiao.png");
                            }
                        },
                        waitJiazhu: function(){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4 && !tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            this.visible = true;
                            this.loadTexture("playing/gameTable/selectPiao.png");
                        },
                        mjhand: function(){
                            this.visible = false;
                        },
                        moveHead: function(){
                            this.visible = false;
                        },
                        onlinePlayer: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.piaoType < 4 && !tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff(0);
                            if(!pl){
                                return;
                            }
                            if(pl.info.uid == eD.uid){
                                this.loadTexture("playing/gameTable/waitPiao.png");
                            }
                        }
                    }
                },
                img_roomInfo2D:{
                    node_hunPai:{
                        img_hunCard:{
                            cardAction: function(){
                                this.visible = false;
                                var hunCard = MjClient.playui.getHunCard();
                                var tData = MjClient.data.sData.tData;
                                if (!hunCard || hunCard <= 0 || !MjClient.playui.isInGame() || !tData){
                                    return;
                                }

                                this.visible = true;
                                var cardValue = parseInt(hunCard);
                                if (tData.areaSelectMode.hongzhong8 == 1 || tData.areaSelectMode.hongzhong8 == 2) {
                                    cardValue = parseInt(tData.showCard);
                                }

                                this.tag = cardValue;
                                MjClient.playui.setCardSprite(this, cardValue, true);
                                this.runAction(cc.sequence(cc.delayTime(1), cc.spawn(cc.scaleTo(0.6,0.5))));
                            }
                        }
                    }
                },
                img_roomInfo3D:{
                    img_hunpaiBg: {
                        setBaiDaCard3D: function() {
                            var isShowHunCard = MjClient.playui.isHunCardShow3D();
                            var hunCard = MjClient.playui.getHunCard();
                            var tData = MjClient.data.sData.tData;
                            if (!hunCard || !isShowHunCard || hunCard <= 0 || !tData) {
                                this.visible = false;
                                return;
                            }

                            this.visible = true;
                            var cardValue = parseInt(hunCard);
                            if (tData.areaSelectMode.hongzhong8 == 1 || tData.areaSelectMode.hongzhong8 == 2) {
                                cardValue = parseInt(tData.showCard);
                            }

                            var hunCardNode = this.getChildByName("img_hunCard");
                            hunCardNode.tag = cardValue;
                            MjClient.playui.setCardSprite(hunCardNode, cardValue, true);
                        }
                    }
                },
                _event:{
                    mjhand: function() {
                        if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;
                        }

                        MjClient.playui.lastPutCardNode = null;
                        //ScanCheatLayer.showStartOnce();
                        for (var i = 0; i < MjClient.playui.getMaxPlayer(); i ++) {
                            var playerNode = MjClient.playui.getNodeByName(MjClient.playui.NodeNameArray[i]);
                            MjClient.playui.nowRoundScore(playerNode.getChildByName("layout_head"), false);
                        }
                        checkCanShowDistance();
                        MjClient.playui.resetJiaZhuTip();
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_SYHZ, "Play_MaJiangSYHZ.json");
            this.shuffleList = [];  //洗牌玩家
            return true;
        },
        
        // @Override 显示大结算
        createGameOverPanel: function(){
            return new majiang_gameOver_SYHZ();
        },
    });

    //Override
    majiang_panel_SYHZ.prototype.isCanAutoPut = function() {
        return true;
    };

    //Override
    majiang_panel_SYHZ.prototype.isCheckDistance = function() {
        return false;
    };

    //Override
    majiang_panel_SYHZ.prototype.checkWhenTouchBegan = function(cardNode) {
        if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
            return true;
        }

        var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
        if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
            return true;
        }

        var player = MjClient.playui.getPlayerInfoByName("node_down");
        var sData = MjClient.data.sData;
        var tData = sData.tData;

        if(player.isZiMoHu) {
            MjClient.showToast("必须胡牌");
            return true;
        }

        if(tData.areaSelectMode.bihuType && player.eatFlag & 8){
            MjClient.showToast("有胡必胡");
            return true;
        }

        if(MjClient.majiang.isHunCard(cardNode.tag, tData.hunCard)) {
            MjClient.showToast("癞子牌不可出");
            return true;
        }

        // 自动摸打
        if (player.tPutCard && this.isTurnMe()) {
            if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                MjClient.showToast("出牌请先取消自动摸打");
            }
            return true;
        }

        if (MjClient.clickTing && !MjClient.canTingCards[cardNode.tag] && this.isTurnMe()){
            cc.log("MjClient.canTingCards  ",JSON.stringify(MjClient.canTingCards),MjClient.canTingCards[cardNode.tag]);
            return true;
        }

        return false;
    };

    //Override
    majiang_panel_SYHZ.prototype.getPlayerEatNode = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
        if(this.isTurnMe()){
            if (player.eatFlag & 8 && player.isNew) {
                nodeArr.push(eat.btn_hu._node);
                player.isZiMoHu = true;
            } else {
                player.isZiMoHu = false;
            }

            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                if (player.isZiMoHu) {
                    MjClient.majiang.gangWhenZimo(player.mjhand, this.gangCardArray, tData.hunCard)
                }

                if (this.gangCardArray.length > 0 && (player.isNew || tData.areaSelectMode["suiShiKeGang"])) {
                    nodeArr.push(eat.btn_gang._node);
                }
            }

            if(nodeArr.length > 0 && !this.isOnlyHu(player.isZiMoHu)){
                nodeArr.push(eat.btn_guo._node);
            }
        } else {
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }

            if (player.eatFlag & 4 && !this.isOnlyHu()) {
                nodeArr.push(eat.btn_gang._node);
                this.gangCardArray.push(tData.lastPutCard);
            }
            
            if (player.eatFlag & 2 && !this.isOnlyHu()) {
                nodeArr.push(eat.btn_peng._node);
            }
            if (player.eatFlag & 1 && !this.isOnlyHu()){
                nodeArr.push(eat.btn_chi._node);
                this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
            }

            if(nodeArr.length > 0 && !this.isOnlyHu()){
                nodeArr.push(eat.btn_guo._node);
            }
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    // 判断是否只能胡牌
    majiang_panel_SYHZ.prototype.isOnlyHu = function(isZiMo) {
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        var tData = MjClient.data.sData.tData;
        if(isZiMo || tData.areaSelectMode.bihuType && player.eatFlag & 8) {
            return true;
        }

        return false;
    };

    // 是否飘分显示
    majiang_panel_SYHZ.prototype.resetJiaZhuTip =  function() {
        var tData = MjClient.data.sData.tData;
        if (!tData.areaSelectMode.jiapiao) {
            return;
        }

        for (var i = 0; i < this.NodeNameArray.length; i ++) {
            var nodeName = this.NodeNameArray[i];
            var player = this.getPlayerInfoByName(nodeName);
            var playerNode = this.getNodeByName(nodeName);
            var point = playerNode.getChildByName("node_animation").getPosition();
            if (playerNode.getChildByName("tipNode")) {
                playerNode.removeChildByName("tipNode");
            }

            var tipNode = new ccui.Text();
            playerNode.addChild(tipNode, 101);
            tipNode.setFontName("fonts/fzcy.ttf");
            tipNode.setColor(cc.color(255, 165, 0));
            tipNode.setFontSize(36);
            tipNode.setName("tipNode");
            tipNode.setPosition(tipNode.parent.convertToNodeSpace(point));
            tipNode.ignoreContentAdaptWithSize(true);
            tipNode.setString(player.jiazhuNum > 0 ? "飘分" : "不飘分");
            tipNode.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function(){ this.visible = false;}, tipNode)));
        }
    };

    // 玩家飘分数显示
    majiang_panel_SYHZ.prototype.updatePiaoContent = function(nodeName, textNode){
        var player = MjClient.playui.getPlayerInfoByName(nodeName);
        if (!MjClient.playui.isInGame() || !player || player.jiazhuNum < 0) {
            return;
        }

        var content = player.jiazhuNum == 0 ? "" : "飘" + player.jiazhuNum + "分";
        textNode.visible = true;
        textNode.setString(content);
        textNode.ignoreContentAdaptWithSize(true);
    }

    // 抓鸟数
    majiang_panel_SYHZ.prototype.getIsZhongBird = function(cd,birdArr) {
        if (cd == 71 || (cd <= 29 && cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9)) {
            return true;
        }
        return false;
    };

    // 显示当前局数增加的分数
    majiang_panel_SYHZ.prototype.nowRoundScore = function(node, isShow) { 
        var tData = MjClient.data.sData.tData;
        var playerNodeName = node.getParent().getName();
        var player = MjClient.playui.getPlayerInfoByName(playerNodeName);
        if (!tData || !player || tData.areaSelectMode.jiapiao || tData.areaSelectMode.piaoType < 3) {
            return;
        }

        var score = null;
        if (node.getChildByName("roundScore")) {
            score = node.getChildByName("roundScore"); 
        } else {
            score = new ccui.Text();
            score.setFontName("fonts/fzcy.ttf");
            score.setColor(cc.color.WHITE);
            score.setName("roundScore");
            score.setFontSize(30);
            node.addChild(score,100); 
            var sumScore = node.getChildByName("img_scoreBg");
            if(MjClient.MaxPlayerNum == 2){
                var nobody = node.getChildByName("img_headBg");
                score.setPosition(cc.p(nobody.x + (nobody.width * 0.8),nobody.y)); 
            }else{  
                if(playerNodeName == "node_right"){
                    score.setPosition(cc.p(sumScore.x - (sumScore.width *0.8),sumScore.y)); 
                }else{
                    score.setPosition(cc.p(sumScore.x + (sumScore.width *0.8),sumScore.y)); 
                }  

            } 
        }    
        score.setVisible(isShow);
        score.setColor(cc.color(114,255,0));
        if(player.winone >= 0 ){
            score.setColor(cc.color(255,192,0));
        }
        score.setString((player.winone > 0 ?"+":"") + player.winone );  
    };

    // @Override 显示小结算
    majiang_panel_SYHZ.prototype.createEndOnePanel = function(){
        return new majiang_winGamePanel_SYTYHZ();
    };
}());