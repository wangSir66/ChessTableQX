var PlayLayer_guizhou;
(function() {
    PlayLayer_guizhou = majiang_panel.extend({
        getJsBind: function() {
            var jsBind = {
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
                }
            };
            return jsBind;
        },

        ctor: function(subObj, JsonFile){
            this._super(PlayLayer_guizhou, JsonFile);

            subObj.jsBind = subObj.prototype.getJsBind();
            util.assign(subObj.jsBind, PlayLayer_guizhou.jsBind); // 拷贝base jsBind
            this.jsBind = subObj.jsBind;
            
            this.initData();
            this.bindPlayUI();
            this.guizhouInit();
        },
        handleInitSceneData:function(){
            cc.log("===========handleInitSceneData===============");
            MjClient.playui.frontShowedJiCards = {}; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签
            MjClient.playui.frontShowedJiCardsArr = [];
            var _showJiLayer = this.getChildByName("showChickenLayer");
            if(_showJiLayer && cc.sys.isObjectValid(_showJiLayer)) this.removeChildByName("showChickenLayer");
        },
        guizhouInit:function() {
            var node = MjClient.playui.getNodeByOff().getParent();
            var jiNode = new ccui.ImageView("res/playing/gameTable/zhuobian_07_2.png");
            setWgtLayout(jiNode,[0.1, 0.1], [0.1, 0.1], [0, 0], true);
            jiNode.setName("jiNode");
            jiNode.setRotation(15);
            node.addChild(jiNode);
            MjClient.playui.huPaiImageArr = [];    // 存放胡牌类型的节点数组
            MjClient.playui.menCardArr = [];       // 存放闷牌数组
            MjClient.maxPlayer = parseInt(MjClient.data.sData.tData.maxPlayer);
            this.setTingIconPostion();
        },
        showAccount: function () {
            if(cc.sys.isObjectValid(MjClient.endoneui)){
                MjClient.endoneui.setVisible(true);
            }
            if(cc.sys.isObjectValid(MjClient.endallui)){
                MjClient.endallui.setVisible(true);
            }
            MjClient.playui.jsBind.panel_showAccount._node.visible = false;
        },
        //从小结算跳到牌桌
        showTableLayer: function () {
            MjClient.playui.jsBind.panel_showAccount._node.visible = true;
        },

        getHunCard: function(){
            return null;
        },

        // 手牌【小, 中, 大】   默认大, index = 2
        getCardSizeType: function(){
            return util.localStorageEncrypt.getNumberItem(MjClient.KEY_MJ_CARD_SIZE_TYPE, 2);
        },

        // 手牌 [小, 中, 大]    [0, 1, 2]
        updateHandCardSize: function(node){
            var playNode = node.getParent();
            var is3D = this.is3DStyle();
            var maxPlayer = MjClient.playui.getMaxPlayer();
            var sizeType = this.getCardSizeType();
            if(playNode.getName() === "node_down"){
                switch (sizeType) {
                    case 0:
                        if (!is3D) {
                            setWgtLayout(node, [0.066, 0], [0.05, 0], [0, 0.55]);
                        } else {
                            setWgtLayout(node, [0.050, 0], [0.5, 0], [8, 0.72]);
                        }
                        break;
                    case 1:
                        if (!is3D) {
                            setWgtLayout(node, [0.068, 0], [0.05, 0], [0, 0.55]);
                        } else {
                            setWgtLayout(node, [0.052, 0], [0.5, 0], [8, 0.72]);
                        }
                        break;
                    case 2:
                        if (!is3D) {
                            setWgtLayout(node, [0.070, 0], [0.05, 0], [0, 0.55]);
                        } else {
                            setWgtLayout(node, [0.054, 0], [0.5, 0], [8, 0.72]);
                        }
                        break;
                }
            }else if(playNode.getName() === "node_top"){
                if(!is3D){
                    if(this.isIPad())
                        setWgtLayout(node, [0, 0.07], [0.5, 1], [8, -1.3]);
                    else
                        setWgtLayout(node, [0, 0.09], [0.5, 1], [8, -1.3]);
                }else{
                    if(maxPlayer === 4){
                        setWgtLayout(node, [0, 0.07], [0.45, 1], [-6, -0.8]);
                    }else if(maxPlayer === 2){
                        setWgtLayout(node, [0, 0.07], [0.5, 1.033], [6, -1.4]);
                    }
                }
            }
        },

        isShowTingCards: function () {
            var player = this.getPlayerInfoByOff();
            if(player && (player.isCanTing || player.isTing)){
                return true;
            }
            return false;
        },

        setTingIconPostion:function()
        {
            //设置听icon的位置
            var is3D =  this.get3DType();
            var _posArray;
            var _2dPosArray = [cc.p(780,-6.64),cc.p(-85.91,-104.50),cc.p(631.93,34.50),cc.p(233.10,-97.36)];
            var _3dPosArray = [cc.p(780,-6.64),cc.p(-140,-20),cc.p(400,50),cc.p(300,-20)];
            cc.log("==============guizhouInit=======is3D = " + is3D);
            if(is3D)
                _posArray = _3dPosArray;
            else
                _posArray = _2dPosArray;

            if(MjClient.playui.jsBind.node_down)
            {
                MjClient.playui.jsBind.node_down.layout_head.img_tingIcon._node.setScale(1.6);
                MjClient.playui.jsBind.node_down.layout_head.img_tingIcon._node.setPosition(_posArray[0]);
            }
            if(MjClient.playui.jsBind.node_right)
            {
                MjClient.playui.jsBind.node_right.layout_head.img_tingIcon._node.setScale(1.6);
                MjClient.playui.jsBind.node_right.layout_head.img_tingIcon._node.setPosition(_posArray[1]);
            }
            if(MjClient.playui.jsBind.node_top)
            {
                MjClient.playui.jsBind.node_top.layout_head.img_tingIcon._node.setScale(1.6);
                MjClient.playui.jsBind.node_top.layout_head.img_tingIcon._node.setPosition (_posArray[2]);
            }
            if(MjClient.playui.jsBind.node_left)
            {
                MjClient.playui.jsBind.node_left.layout_head.img_tingIcon._node.setScale(1.6);
                MjClient.playui.jsBind.node_left.layout_head.img_tingIcon._node.setPosition(_posArray[3]);
            }
        },
        /**
         * 切换23D的时候，有些数据需要处理
         */
        updata2DTo3DData : function()
        {
            MjClient.playui.movingCard = null;
            MjClient.playui.hasClickBtn = false;
            MjClient.playui.lastPutCardNode = null;
            MjClient.playui.frontShowedJiCards = {}; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签
            MjClient.playui.frontShowedJiCardsArr = [];
            this.setTingIconPostion();
        },
        initDirctionNode: function () {
            var nodeNameArr = ["node_down", "node_right", "node_top", "node_left"];
            this.DefaultNodeNameArray = nodeNameArr;
            if (this.getMaxPlayer() == 2) {
                nodeNameArr = ["node_down", "node_top"];
            } else if (this.getMaxPlayer() == 3) {
                nodeNameArr = ["node_down",  "node_right", "node_left"];
            }
            this.NodeNameArray = nodeNameArr;
        },
        isTianTing:function(player)
        {
            if(!this.isNewTing()) return false;
            if(!player || !player.mjhand) return;
            if(player.isDoTianTing) return false;
            var _copyHand = player.mjhand.slice(0);
            var _canTing = MjClient.majiang.canTing(_copyHand);
            if(_canTing && player.mjgang0.length === 0 && player.mjgang1.length === 0 && player.mjput.length == 1 && player.mjpeng.length == 0 && player.putCount == 1){
                return true;
            }
            return false;
        },
        oldTianTing:function(player)
        {
            //天听才显示听的按钮，其他情况下不显示
            if(player.mjgang0.length === 0 && player.mjgang1.length === 0 && player.mjput.length === 0 && player.mjpeng.length === 0 && player.putCount == 0){
                for (var i = 0; i < player.mjhand.length; i++) {
                    var _copyHand = player.mjhand.slice(0);
                    _copyHand.splice(i,1); //依次去掉某张牌看能不能听
                    if(MjClient.majiang.canTing(_copyHand)){
                        player.isCanTing = true;
                        return true;
                    }
                }
            }
            return false;
        },
        checkTingBtn: function (player) {
            // 天听过之后，不弹听
            if(this.clickTingPass)
            {
                return false;
            }

            if(this.isNewTing())
            {
                return this.isTianTing(player);
            }
            else
            {
                return this.oldTianTing(player);
            }
        },

        /**
         * 点击听按钮的时候调用
         */
        clickTingBtn : function()
        {
            MjClient.playui.clickTing = true;
            var downNode = MjClient.playui.getNodeByOff(0);
            MjClient.playui.hideEatNodeChildren();
            var btn_cancel = MjClient.playui.jsBind.node_eat.btn_cancel._node;
            btn_cancel.visible = false; //点了听按钮后，要显示取消按钮
            if(this.isNewTing())
            {
                this.sendTingToServer(MjClient.data.sData.tData.lastPutCard);
            }
            else
            {
                downNode.getChildByName("img_tingCardsWithNum").visible = false;
                downNode.getChildByName("img_tingCards").visible = false;
                btn_cancel.visible = true; //点了听按钮后，要显示取消按钮
                MjClient.playui.updateCardColorAfterTing();
            }
        },

        /**
         *  刷新玩家操作按钮
         **/
        updatePlayerEatBtn : function(msg){
            this.hideEatNodeChildren();
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];

            if(!this.isTianTing(player))
            {
                if(!this.isTurnMe() && player.mjState != TableState.waitEat){
                    return;
                }
            }

            if(tData.haveTianTing && !this.isTurnMe() && this.isNewTing()) return;


            var eatNodeArr = this.getPlayerEatNode();
            var pct = this.isIPad() ? 0.12 : 0.18;
            var pos = this.isIPad() ? 0.75 : 0.70;
            var space = this.isIPad() ? 1.4 : 1.5;
            var off_y = this.isIPad() ? 1.7 : 2.0;
            for(var i = 0;i < eatNodeArr.length;i++){
                var btn = eatNodeArr[i];
                if(btn) btn.visible = true;
                setWgtLayout(btn, [0, pct], [pos, 0], [(i - eatNodeArr.length + 1) * space, off_y], false, false);
            }
        },
        /**
         * 是否是新的听牌方式,听牌流程有变化,后台服务器代码需要配合修改
         */
        isNewTing:function()
        {
            return false;
        },
        /**
         *  是否轮到自己摸牌然后操作
         *  return {Boolean}
         **/
        isTurnMe : function(){
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var pl = sData.players[this.getSelfUid()];

            if(this.isTianTing(pl) && (pl.mjState == TableState.waitPut || pl.mjState == TableState.waitCard))
            {
                return true;
            }

            if (this.getSelfUid() == tData.uids[tData.curPlayer] && pl.mjState == TableState.waitPut && tData.tState == TableState.waitPut){
                return true;
            }
            return false;
        },
        /**
         *  刷新打出的牌
         **/
        resetPutCards:function(node){
            //重新删除添加，是为了2D 3D切换时可能会导致显示的顺序不一致
            this.removeCardsByName(node, this.HandleCardType.Put);
            var player = this.getPlayerInfoByName(node.getName());
            if(!player) return;
            for(var i = 0; i < player.mjput.length; i++){
                var putCard = this.createCard(node, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, player.mjput[i]);
                this.addJiIcon2D(putCard);
            }

            this.setLastPutCardNode();
            var self = this;
            var callback = function(){
                self.addPutCardTip();
            };
            var is3D = this.is3DStyle();
            if(is3D){
                this.resetPutCards3D(node, callback);
            }else{
                this.resetPutCards2D(node, callback);
            }
        },
        /**
         * mjhand 事件后的处理
         */
        handleMjhand:function()
        {
            cc.log("===========================handleMjhand ====================== ");
            var _showJiLayer = this.getChildByName("showChickenLayer");
            if(_showJiLayer && cc.sys.isObjectValid(_showJiLayer)) this.removeChildByName("showChickenLayer");
        },
        /**
         * 处理打出去的牌的回调
         * @param playerNode
         * @param msg
         */
        handlerBeforePut:function(playerNode, msg)
        {
            if(msg.isChongFengji)
            {
                var node = MjClient.playui.getNodeByOff();
                var _backNode = node.getParent().getChildByName("jiNode");
                var chongfengji = _backNode.getChildByName("chongfengji");
                if(!chongfengji) {
                    chongfengji = createSpine("spine/chongfengji/skeleton.json", "spine/chongfengji/skeleton.atlas");
                    chongfengji.setAnimation(0, 'animation', false);
                    chongfengji.setScale(0.3);
                    chongfengji.setName("chongfengji");

                    _backNode.addChild(chongfengji,100);
                }
                else {
                    chongfengji.setAnimation(0, 'animation', false);
                }
                MjClient.playui.playEffect("chongfengji");
            }
        },
        handleOtherMJTing:function(msg)
        {
            var sData = MjClient.data.sData;
            if (!sData) return;
            var tData = sData.tData;
            tData.haveTianTing = false;
            if(!this.isNewTing()) return;
            cc.log("===========================handleOtherMJTing ======================msg.eatFlags =  " + msg.eatFlags);
            if (msg.eatFlags) {
                for(var uid in msg.eatFlags) {
                    sData.players[uid].eatFlag = msg.eatFlags[uid];
                }
            }
            MjClient.playui.updateTingTips();
            MjClient.playui.updatePlayerEatBtn();
        },
        handleOtherMJPass:function(msg)
        {
            var tData = MjClient.data.sData.tData;
            tData.haveTianTing = false;

            if(!this.isNewTing()) return;
            cc.log("===========================handleOtherMJPass ====================== ");
            MjClient.playui.updatePlayerEatBtn();
        },
        /**
         *  添加打出去的牌
         **/
        addPutCard:function(cardNode, callback, isPut){
            this.addJiIcon2D(cardNode);
            this.lastPutCardNode = cardNode;
            var is3D = this.is3DStyle();
            if(is3D){
                this.addPutCard3D(cardNode, callback, isPut);
            }else{
                this.addPutCard2D(cardNode, callback, isPut);
            }
        },
        addJiIcon2D:function(cardNode)
        {
            var playerNode = cardNode.getParent();
            var pl = MjClient.playui.getPlayerInfoByName(playerNode.getName());
            MjClient.playui.frontShowedJiCards = MjClient.playui.frontShowedJiCards || {}; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签

            if(pl.chongJiCard && pl.chongJiCard[cardNode.tag] && pl.chongJiCard[cardNode.tag] > 0 && ! MjClient.playui.frontShowedJiCards [cardNode.tag])
            {
                MjClient.playui.frontShowedJiCards [cardNode.tag] = true; //为了标记这张牌已经加个冲的字样
                var offIndex =  this.getNodeIndexDefaultByName(cardNode.getParent().getName());
                var laiZiPosArr = this.getHunIconPosition2D();
                var laiZiNode  = this.getJiTagIcon();
                laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
                var _rotation = [0,-90 ,-180,-270];
                laiZiNode.setRotation( _rotation[offIndex]);
                cardNode.addChild(laiZiNode);
            }
            else {
                // cc.log("add ji ++++++++++++++++++++++++++ cardNode.tag  = " + cardNode.tag);
                // cc.log("add ji ++++++++++++++++++++++++++ pl.chongJiCard = " + JSON.stringify(pl.chongJiCard));
                // cc.log("add ji ++++++++++++++++++++++++++ MjClient.playui.frontShowedJiCards = " + JSON.stringify(MjClient.playui.frontShowedJiCards));
            }
        },
        handlerAfterChiPengGang: function(cardNode){
            this.addChiPengGangTag(cardNode);
        },
        addChiPengGangTag:function(cardNode)
        {
            return; //todo.. 碰，杠，走的暂时不加鸡的标签
            //存在其他玩家手里的冲鸡
            var bChongJi = false;
            MjClient.AllPlayerRun(function (pl) {

                pl.chongJiCard = pl.chongJiCard || {};

                if(pl.chongJiCard[cardNode.tag])
                {
                    bChongJi = true;
                }
            });

            //吃，碰，杠里面存在默认鸡，必定有一张是冲锋鸡
            if(MjClient.majiang.isDefaultJi(cardNode.tag) && bChongJi)
            {
                var offIndex = this.getNodeIndexDefaultByName(cardNode.getParent().getName());
                var laiZiPosArr = this.getHunIconPosition2D();
                var laiZiNode  = this.getJiTagIcon();
                laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
                var _rotation = [0,-90 ,-180,-270];
                laiZiNode.setRotation( _rotation[offIndex]);
                cardNode.addChild(laiZiNode);
            }
        },
        getJiTagIcon:function()
        {
            var laiZiNode  = new ccui.ImageView();
            laiZiNode.setName("laiZi");
            laiZiNode.loadTexture("res/playing/MJ/chong.png");
            return laiZiNode;
        },
        isShowTingCards : function(){
            return true;
        },
        /***
         * 插牌动画默认关闭
         * @returns {*|ret}
         */
        getInsertCardAniConfig: function(){
            return util.localStorageEncrypt.getBoolItem(MjClient.hasInsertAni, false);
        },
        /**
         * 前端先行加载手牌做的事情
         * @param copyNode
         */
        doBeforeAddPutOutCard:function(copyNode)
        {
            MjClient.playui.frontShowedJiCards = MjClient.playui.frontShowedJiCards  || {}; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签
            var playerNode = copyNode.getParent();
            var player = MjClient.playui.getPlayerInfoByName(playerNode.getName());
            player.chongJiCard = player.chongJiCard || {};//如果不存在
            if(!player.chongJiCard[copyNode.tag])
            {
                if(MjClient.majiang.isDefaultJi(copyNode.tag) && ! MjClient.playui.frontShowedJiCards [copyNode.tag])
                {
                    player.chongJiCard[copyNode.tag] = 1;
                }
            }
            this.addJiIcon2D(copyNode);
        },
        getIsBenJi: function(cd, showCards){
            if(cd == 71) return true;

            if(showCards.length == 2 && cd === showCards[0]){
                return true;
            }

            if(showCards.length == 3 && cd === showCards[1]){
                return true;
            }
            
            return false;
        },
        handlerAfterChiPengGang:function(cardNode)
        {
            //this.addChiPengGangTag(cardNode) //碰杠的鸡标签先不加
        },
        /**
         *	处理结算
         **/
        handleRoundEnd: function () {
            var tData = MjClient.data.sData.tData;
            var self = this;
            MjClient.playui.frontShowedJiCards = {};//没小局结束，要清空数据

            if(MjClient.playui.isInGame()) return;

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
                self.addChild(new EndOneView_guizhou());
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
        },
        /**
         *  暗杠牌的坐标
         **/
        setAnGangPosition2D:function(node, cardArr, pos, index){
            var cardNode = cardArr[index];
            var nextNode = cardArr[index + 1];
            if(nextNode && nextNode.tag != cardNode.tag)
            {
                var nodeIndex = this.getNodeIndexDefaultByName(node.getName());
                var dir = this.getDirectByNodeIndex(nodeIndex);
                var secondNodePos = cardArr[index - 2].getPosition();
                if(nodeIndex % 2 == 0){
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 16 * (1 - nodeIndex / 4));
                }else{
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 4);
                }
                cardNode.zIndex = cardArr[index - 2].zIndex + 1;

                nodeIndex = nodeIndex == -1 ? 0 : nodeIndex;
                var _cardImg =  cardNode.getChildByName("cardImg");
                _cardImg.setRotation(-90 * nodeIndex);
                var cardFacePosArr = this.getCardFacePositon2D(this.getMaJiangBgType(), cardNode.getName());
                _cardImg.setPosition(cardFacePosArr[nodeIndex][0], cardFacePosArr[nodeIndex][1]);
            }
            else {
                cardNode.removeChildByName("cardImg");
                var cardBackNode = node.getChildByName(this.CsdDefaultCardType.EatCardBack);
                cardNode.loadTexture(cardBackNode.getRenderFile().file);
                this.updateAfterChangeMjBg2D(cardNode);
            }

            if(index == 0)
            {
                this.addChiPengGangTag(cardNode);
            }
            cardNode.setPosition(pos);
        },
        /**
         *  明杠牌的坐标
         **/
        setMingGangPosition2D:function(node, cardArr, pos, index){
            var cardNode = cardArr[index];
            var nextNode = cardArr[index + 1];
            if(nextNode && nextNode.tag != cardNode.tag){
                var nodeIndex = this.getNodeIndexDefaultByName(node.getName());
                var dir = this.getDirectByNodeIndex(nodeIndex);
                cardNode.zIndex = cardArr[index - 2].zIndex + 1;
                var secondNodePos = cardArr[index - 2].getPosition();
                if(nodeIndex % 2 == 0){
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 16 * (1 - nodeIndex / 4));
                }else{
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 5);
                }
                var player = this.getPlayerInfoByName(node.getName());
                this.setCardArrow(cardNode, this.getOperateFrom(node, cardNode.tag), this.getUidIndex(player.info.uid));
            }

            if(index == 0)
            {
                this.addChiPengGangTag(cardNode);
            }
            cardNode.setPosition(pos);
        },
        /**
         *  碰杠牌的坐标
         **/
        setPengGangPosition2D:function(node, cardArr, pos, index){
            var cardNode = cardArr[index];
            var nextNode = cardArr[index + 1];
            if(nextNode && nextNode.tag != cardNode.tag){
                var nodeIndex = this.getNodeIndexDefaultByName(node.getName());
                var dir = this.getDirectByNodeIndex(nodeIndex);
                cardNode.zIndex = cardArr[index - 2].zIndex + 1;
                var secondNodePos = cardArr[index - 2].getPosition();
                if(nodeIndex % 2 == 0){
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 16 * (1 - nodeIndex / 4));
                }else{
                    pos = cc.p(secondNodePos.x, secondNodePos.y + 5);
                }
                var player = this.getPlayerInfoByName(node.getName());
                this.setCardArrow(cardNode, this.getOperateFrom(node, cardNode.tag), this.getUidIndex(player.info.uid));

                cardNode.removeChildByName("cardImg");
                var cardBackNode = node.getChildByName(this.CsdDefaultCardType.EatCardBack);
                cardNode.loadTexture(cardBackNode.getRenderFile().file);
                this.updateAfterChangeMjBg2D(cardNode);
            }
            cardNode.setPosition(pos);
        },

        /**
         * 取消听按钮
         */
        updataClickCancelTingBtn : function(){
            var player = this.getPlayerInfoByOff();

            if(player.isTing){
                return;
            }

            if(!this.isTurnMe()){
                return;
            }

            var playerNode = this.getNodeByOff();
            var copyNode = playerNode.getChildByName(this.CsdDefaultCardType.HandCard);
            var children = playerNode.children;
            for(var i = 0;i < children.length;i++){
                var cardNode = children[i];
                if(cardNode.name === this.HandleCardType.Hand){
                    var tingSign = cardNode.getChildByName("tingSign");
                    if(!cc.sys.isObjectValid(tingSign) || (tingSign && !tingSign.visible)){
                        cardNode.setColor(cc.color(255,255,255));
                        this.setTouchCardHandler(copyNode, cardNode);
                    }
                }
            }

            if(this.setQueCardColor) this.setQueCardColor();
        },

        // 倒牌之后添加胡牌类型
        addHuTypeImage: function () {

            var huTypeinfo = {
                "shuangqing":    {name: "双清",     uname: "shuangqing.png"},
                "qinglongqidui": {name: "青龙七对", uname: "qinglongqidui.png"},
                "qingqidui":     {name: "清七对",   uname: "qingqidui.png"},
                "qingdadui":     {name: "清大对",   uname: "qingdadui.png"},
                "qingdandiao":   {name: "清单吊",   uname: "qingdandiao"},
                "qingyise":      {name: "清一色",   uname: "qingyise.png"},
                "hunlongqidui":  {name: "混龙七对", uname: "hunlongqidui.png"},
                "hunqidui":      {name: "混七对",   uname: "hunqidui.png"},
                "hundadui":      {name: "混大对",   uname: "hundadui.png"},
                "hunyise":       {name: "混一色",   uname: "hunyise.png"},
                "dilong":        {name: "地龙",     uname: "dilong.png"},
                "daduizi":       {name: "大对子",   uname: "daduizi.png"},
                "longqidui":     {name: "龙七对",   uname: "longqidui.png"},
                "qidui":         {name: "七对",     uname: "qidui.png"},
                "pinghu":        {name: "平胡",     uname: "pinghu.png"},
                "dandiao":       {name: "单吊",     uname: "dandiao"},
                "tingpai":       {name: "听牌",     uname: "tingpai.png"},
                "weitingpai":    {name: "未听牌",   uname: "weitingpai.png"},
                "jiepao":        {name: "接炮",     uname: "jiepao.png"},
                "zimo":          {name: "自摸",     uname: "zimo.png"}
            };

            var refer = MjClient.size.width/1280;
            var originUrl = 'playing/paixing/';
            for(var off = 0; off < MjClient.MaxPlayerNum; off ++){
                var player = MjClient.playui.getPlayerInfoByOff(off);
                var playerNode = MjClient.playui.getNodeByOff(off);
                var animateNode = playerNode.getChildByName("node_animation");
                var pos = animateNode.getPosition();
                var huPaiImage = new ccui.ImageView();
                huPaiImage.setPosition(pos);
                huPaiImage.setName("huPaiImage");
                huPaiImage.setVisible(true);
                huPaiImage.setScale(refer * 0.7);
                playerNode.addChild(huPaiImage, 999);
                if(player.winType > 0){
                    huPaiImage.setScale(refer);
                }
                MjClient.playui.huPaiImageArr.push(huPaiImage);
                if(player){
                    var stringKey;
                    if(player.huPaiTypeText){
                        stringKey = player.huPaiTypeText;
                    }else{
                        if(player.mjhand && player.mjhand.length > 0){
                            var tingSet = MjClient.majiang.calTingSet(player.mjhand, null, player);
                            stringKey = Object.keys(tingSet).length > 0 ? "tingpai" : "weitingpai";
                        }
                    }

                    if(stringKey){
                        var url = originUrl + huTypeinfo[stringKey].uname;
                        if(jsb.fileUtils.isFileExist(url) && huPaiImage){
                            huPaiImage.loadTexture(url);
                        }
                    }
                }
            }
        },

        clearHuTypeImage: function (node) {
            if(!node) return;
            var huPaiImage = node.getChildByName("huPaiImage");
            if(huPaiImage){
                huPaiImage.removeFromParent(true);
            }
        },

        /**
         * 处理新摸的一张牌
         */
        dealNewCard: function(data,newCardNode) {
            MjClient.newGrayCard = newCardNode; //贵州的需求，新摸的牌，要提示已经出的牌变灰
        },


        /***
         * 贵州牌桌默认2D
         * @returns {*|boolean}
         */
        get3DType: function() {
            var is3DNormal = util.localStorageEncrypt.getBoolItem(MjClient.KEY_MJ_3D_STYLE_COMMON, false);
            var is3DGoldField = util.localStorageEncrypt.getBoolItem(MjClient.KEY_MJ_3D_STYLE_GOLD_FIELD, false);
            var sData = MjClient.data.sData;
            if(MjClient.playui && sData){
                var isGoldField = sData.tData.fieldId;
                return isGoldField ? is3DGoldField : is3DNormal;
            }
            return is3DNormal;
        },

        /***
         * 贵州麻将背景默认第一个
         * @returns {*|number}
         */
        getGameBgType: function () {
            if(this.get3DType()){
                return util.localStorageEncrypt.getNumberItem(MjClient.KEY_3D_GAME_BG_TYPE, 0);
            }
            return util.localStorageEncrypt.getNumberItem(MjClient.KEY_GAME_BG_TYPE, 0);
        },

        /**
         *  所有的牌进行排序
         **/
        getCardSortArray2D:function(node, newCardTag) {
            var tData = MjClient.data.sData.tData;
            var handArr = [], anGangArr = [], mingGangArr = [], pengGangArr = [],pengArr = [], chiArr = [], queArray = [];
            var children = node.children;
            var i, newCard = null;
            if(newCardTag > 0 ){
                this.newCardNode  = null;
            }

            for(i = 0;i < children.length;i++){
                var child = children[i];
                if(child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)){
                    if(!newCard && child.tag == newCardTag && !child.isGray){
                        newCard = child;
                        this.newCardNode  = child;
                        this.newCardNode.isNew = true;
                        continue;
                    }
                    if(MjClient.playui.isQueCard && MjClient.playui.isQueCard(child.tag)){
                        queArray.push(child);
                        continue;
                    }
                    handArr.push(child);
                }else if(child.name == this.HandleCardType.AnGang){
                    anGangArr.push(child);
                }else if(child.name == this.HandleCardType.MingGang){
                    mingGangArr.push(child);
                }else if(child.name == this.HandleCardType.PengGang){
                    pengGangArr.push(child);
                }else if(child.name == this.HandleCardType.Peng){
                    pengArr.push(child);
                }else if(child.name == this.HandleCardType.Chi){
                    chiArr.push(child);
                }
            }

            var sortArray = function(cardArray){
                cardArray.sort(function(a, b){
                    return a.tag - b.tag;
                });
                return cardArray;
            };
            handArr = sortArray(handArr);
            pengArr = sortArray(pengArr);
            anGangArr = sortArray(anGangArr);
            mingGangArr = sortArray(mingGangArr);
            pengGangArr = sortArray(pengGangArr);


            queArray.sort(function(a, b){
                return a.tag - b.tag;
            });

            for(i = 0;i < queArray.length;i++){
                handArr.push(queArray[i]);
            }

            if(newCard){
                handArr.push(newCard);
            }

            return [].concat(anGangArr, mingGangArr, pengGangArr,pengArr, chiArr, handArr);
        },
        /**
         *  所有的牌进行排序
         **/
        getCardSortArray3D:function(node, newCardTag){
            var tData = MjClient.data.sData.tData;
            var handArr = [], anGangArr = [], mingGangArr = [], pengArr = [], chiArr = [], queArray = [];
            var children = node.children;
            var i, newCard = null;
            if(newCardTag > 0 ){
                this.newCardNode  = null;
            }

            for(i = 0;i < children.length;i++){
                var child = children[i];
                if(child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)){
                    if(!newCard && child.tag == newCardTag && !child.isGray){
                        newCard = child;
                        this.newCardNode  = child;
                        this.newCardNode.isNew = true;
                        continue;
                    }
                    if(MjClient.playui.isQueCard && MjClient.playui.isQueCard(child.tag)){
                        queArray.push(child);
                        continue;
                    }
                    handArr.push(child);
                }else if(child.name == this.HandleCardType.AnGang){
                    anGangArr.push(child);
                }else if(child.name == this.HandleCardType.MingGang){
                    mingGangArr.push(child);
                }else if(child.name == this.HandleCardType.PengGang){
                    mingGangArr.push(child);
                }else if(child.name == this.HandleCardType.Peng){
                    pengArr.push(child);
                }else if(child.name == this.HandleCardType.Chi){
                    chiArr.push(child);
                }
            }

            var sortArray = function(cardArray){
                cardArray.sort(function(a, b){
                    return a.tag - b.tag;
                });
                return cardArray;
            };
            handArr = sortArray(handArr);
            pengArr = sortArray(pengArr);
            anGangArr = sortArray(anGangArr);
            mingGangArr = sortArray(mingGangArr);

            queArray.sort(function(a, b){
                return a.tag - b.tag;
            });

            for(i = 0;i < queArray.length;i++){
                handArr.push(queArray[i]);
            }

            if(newCard){
                handArr.push(newCard);
            }

            var cardArray = [].concat(anGangArr, mingGangArr, pengArr, chiArr, handArr);
            var nodeIndex = this.getNodeIndexDefaultByName(node.getName());
            if(nodeIndex == 1 || nodeIndex == 2){
                cardArray.reverse();
            }
            return cardArray;
        },

        isCanInsertcard: function(){
            var node = this.getNodeByOff(0);
            var children = node.children;
            for(var i = 0;i < children.length;i++){
                var child = children[i];
                if(child.name === this.HandleCardType.Hand)
                {
                    if(MjClient.playui.isQueCard && MjClient.playui.isQueCard(child.tag)){
                        return false; //手牌有缺牌，屏蔽插牌动画
                    }
                }
            }
            return true
        },

        /**
         *  是否可以自动摸打
         **/
        isCanAutoPut: function(){
            return true;
        },
        /*
        *  是否开启显示最多听牌标识
        **/
        isShowMaxTingCards:function(){
            return true;
        },
        /**
         *  贵州增加新的道具，所以重写
         */
        playChatAni: function (startOff,endOff,kind) {
            var startPlayerNode = this.getNodeByOff(startOff);
            var endPlayerNode = this.getNodeByOff(endOff);
            if (!MjClient.playui || !startPlayerNode || !endPlayerNode) {
                return;
            }

            //道具的运动轨迹
            var startHeadNode = startPlayerNode.getChildByName("layout_head");
            var endHeadNode = endPlayerNode.getChildByName("layout_head");

            if(kind >= 10000){
                //贵族互动道具
                playChatAniGuizu(MjClient.playui.jsBind.node_eat._node,startHeadNode,endHeadNode,kind);
                return;
            }
            var distance = cc.pDistance(startHeadNode.getPosition(), endHeadNode.getPosition());
            var costTime = 0.4;
            var midX = (endHeadNode.getPositionX() - startHeadNode.getPositionX()) / 2 + startHeadNode.getPositionX();
            if (Math.abs(endHeadNode.getPositionX() - startHeadNode.getPositionX()) < 10) {
                midX += distance / 5;
            }
            var midY = Math.max(startHeadNode.getPositionY(), endHeadNode.getPositionY());
            if (Math.abs(endHeadNode.getPositionY() - startHeadNode.getPositionY()) < 10) {
                midY += distance / 5;
            }
            var bezierRound = cc.bezierTo(costTime, [startHeadNode.getPosition(), cc.p(midX, midY), endHeadNode.getPosition()]);
            if (kind == 2) {
                bezierRound = cc.spawn(bezierRound, cc.rotateBy(costTime,360*2));
            } else if (kind == 6) {
                bezierRound = cc.spawn(bezierRound, cc.rotateBy(costTime,360));
            }


            //道具声音和动画
            var delayTime = [0.8, 0, 0.1, 0, 0.1, 0.1, 0.1, 0];
            var sound = ["ie_chicken", "ie_flower", "ie_diamond", "ie_egg", "ie_boom", "ie_kiss", "ie_cheer", "ie_tomato"];
            var aniImg = ["prop_chicken", "info_n_send_0", "info_n_send_1", "info_n_send_2", "info_n_send_3", "info_n_send_4_0", "info_n_send_5_0", "info_n_send_6_0"];
            var animate = this.setChatAnimate(kind);
            var moveSoundFunc = cc.callFunc(function(){
                this.playEffect("chatFlyEffect");
            });
            var playSoundFunc = cc.callFunc(function(){
                this.playEffect(sound[kind]);
            });

            //添加道具精灵并播放动画
            var aniSprite = new cc.Sprite("playing/other/" + aniImg[kind] + ".png");
            if(kind === 0) aniSprite.addChild(animate);
            aniSprite.setPosition(startHeadNode.getPosition());
            aniSprite.setScale(MjClient.size.height / 800);
            aniSprite.runAction(cc.sequence(moveSoundFunc, bezierRound, playSoundFunc, cc.delayTime(delayTime[kind]), animate, cc.removeSelf()));
            MjClient.playui.jsBind.node_eat._node.addChild(aniSprite, 10000);
        },

        /***
         * 播放互动道具动画
         * @param kind
         */
        setChatAnimate: function (kind) {

            // 铁公鸡动画 spine
            if(kind === 0)
            {
                var ani = createSpine("spine/chat/tiegongji/tiegongji.json", "spine/chat/tiegongji/tiegongji.atlas");
                ani.setAnimation(0, 'animation', false);
                ani.setScale(0.7);
                return ani;
            }
            // 其他的是帧动画
            else
            {
                kind = kind - 1;
                cc.spriteFrameCache.addSpriteFrames("playing/other/emj.plist","playing/other/emj.png");
                var fc = cc.spriteFrameCache;
                var frames = [];
                var frameTime = [0.08, 0.1, 0.08, 0.08, 0.12, 0.12, 0.08];
                var frameNum = [15, 15, 10, 15, 15, 15, 15];
                var prefix = "info_n_send_" + kind + "_";

                for (var i = 1; i < frameNum[kind]; i++) {
                    var name = prefix + i + ".png";
                    var f = fc.getSpriteFrame(name);
                    if (f) {
                        frames.push(f);
                    }
                }

                return cc.animate(new cc.Animation(frames, frameTime[kind], 1));
            }
        },

        //
        // checkWhenPass : function(){
        //     //todo 比如"有胡必胡"
        //     // var pl = this.getPlayerInfoByOff(0);
        //     // if(pl.mustHu){
        //     //     MjClient.showToast("有胡必胡");
        //     //     return true;
        //     // }
        //     return true;
        // },
        /**
         *  发送过的命令给服务器
         *  return {void}
         **/
        clickPass : function(){

            cc.log("==================clickPass======================");
            var that = this;
            var player = that.getPlayerInfoByOff(0);
            if (that.checkWhenPass()){
                return;
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

                    // 不要过弹窗的【过碰、过天听、过暗杠】
                    if(that.checkTingBtn(player)){   //过天听不用每次提示
                        that.clickTingPass = true;
                    }

                    if (that.checkGangBtn(player)){  //过杠不用每次提示
                        that.clickGangPass = true;
                    }

                    that.hideEatNodeChildren();
                    that.sendPassToServer();

                }

            }else{
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
});
}());

// 获取缺牌门列表
PlayLayer_guizhou.prototype.getQueTypeArr = function() {
    return [0, 1, 2];
};

// 缺牌门数
PlayLayer_guizhou.prototype.getQueNum = function() {
    return 1;
};

// 是否有定缺智能提示
PlayLayer_guizhou.prototype.hasDingQueTip = function() {
    return false;
};

// 是否添加定缺特效
PlayLayer_guizhou.prototype.checkAddDingQueEffect = function(queNode) {
    if (!this.hasDingQueTip()) {
        return;
    }

    var name2Idx = {
        "quetiao": 0,
        "quewan": 1,
        "quetong": 2,
        "quezhong": 7,
    }
    var idx = name2Idx[queNode.getName()];

    if (this.getQueTypeArr().indexOf(idx) < 0) {
        return;
    }

    if (this.getQueTypeArr().indexOf(idx) + 1 > this.getQueNum()) {
        return;
    }

    cc.spriteFrameCache.addSpriteFrames("playing/queUI/que.plist", "playing/queUI/que.png");
    var frameArr = [];
    for (var i = 1; i <= 10; i++) {
        frameArr.push(cc.spriteFrameCache.getSpriteFrame("que_" + i + ".png"));
    }

    var queEffect = new cc.Sprite(frameArr[0]);
    queEffect.runAction((new cc.Animate(new cc.Animation(frameArr, 0.6 / 10))).repeatForever());
    queEffect.x = queNode.x;
    queEffect.y = queNode.y - 2;
    queEffect.scale = queNode.scale;
    queNode.getParent().addChild(queEffect);
};

/**
 * 定缺的弹窗
 * @param params.cardTypeArr：当前定缺的牌的种类
 * @param params.number：定缺个数
 * @param params.reqCallBack：回调函数
 */
var DingQueGuiZhouLayer = cc.Layer.extend({
    quewan:null,
    quetiao:null,
    quetong:null,
    quezhong:null,
    quementip:null,
    quese:-1,
    ctor: function(params) {
        this._super();
        // var cardTypeArr = params.cardTypeArr || []; // todo 删除调用传入参数
        // var number = params.number || 0;
        var reqCallBack = params.reqCallBack || function() {};

        var cardTypeArr = MjClient.playui.getQueTypeArr();
        var number = MjClient.playui.getQueNum();

        var UI = ccs.load("res/DingQueLayer.json");
        this.addChild(UI.node);

        this.block_back = UI.node.getChildByName("block");
        setWgtLayout(this.block_back, [0, 1], [0.5, 0.5], [0, 0]);

        this.block_back.setScaleX(cc.winSize.width / this.block_back.getContentSize().width);

        this.block = UI.node.getChildByName("block_bg");
        setWgtLayout(this.block, [0, 1], [0.5, 0.5], [0, 0]);


        var that = this;
        var _queArray = []; //定缺种类

        function createSelectSign() {
            var image = new ccui.ImageView("res/playing/queUI/gou.png");
            image.setName("sign");
            return image;
        }


        function selectQue(node, value) {
            if (_queArray.indexOf(value) >= 0) {
                _queArray.splice(_queArray.indexOf(value), 1);
                if (node.getChildByName("sign")) node.removeChildByName("sign");
            } else {
                _queArray.push(value);
                var _sign = createSelectSign();
                if (!node.getChildByName("sign")) {
                    _sign.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
                    node.addChild(_sign, 10);
                }
            }

            cc.log("select que _queArray = " + JSON.stringify(_queArray));

            if (_queArray.length === number) // 选了 number 个定缺，才发送给服务器
            {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                    cmd: "MJSelect",
                    que: _queArray,
                });
                if (reqCallBack) {
                    reqCallBack();
                }
                that.removeFromParent();
            }
        }

        this.quetiao = this.block.getChildByName("quetiao");
        if (cardTypeArr.indexOf(0) >= 0) { // 条
            this.quetiao.setVisible(true);
            this.quetiao.x = this.block.getContentSize().width * 1 / (cardTypeArr.length + 1);
            this.quetiao.y = this.block.getContentSize().height * 0.4;
            this.quetiao.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    selectQue(that.quetiao, 0);
                }
            }, this);
        } else {
            this.quetiao.setVisible(false);
        }

        this.quewan = this.block.getChildByName("quewan");
        if (cardTypeArr.indexOf(1) >= 0) { // 万
            this.quewan.setVisible(true);
            this.quewan.x = this.block.getContentSize().width * 2 / (cardTypeArr.length + 1);
            this.quewan.y = this.block.getContentSize().height * 0.4;
            this.quewan.addTouchEventListener(function(sender, type) {
                if (type === 2) {
                    selectQue(that.quewan, 1);
                }
            }, this);
        } else {
            this.quewan.setVisible(false);
        }

        this.quetong = this.block.getChildByName("quetong");
        if (cardTypeArr.indexOf(2) >= 0) { // 筒
            this.quetong.setVisible(true);
            this.quetong.x = this.block.getContentSize().width * 3 / (cardTypeArr.length + 1);
            this.quetong.y = this.block.getContentSize().height * 0.4;
            this.quetong.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    selectQue(that.quetong, 2);
                }
            }, this);
        } else {
            this.quetong.setVisible(false);
        }

        this.quezhong = this.block.getChildByName("quezhong");
        if (cardTypeArr.indexOf(7) >= 0) { // 红中
            this.quezhong.setVisible(true);
            this.quezhong.x = this.block.getContentSize().width * 4 / (cardTypeArr.length + 1);
            this.quezhong.y = this.block.getContentSize().height * 0.4;
            this.quezhong.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    selectQue(that.quezhong, 7);
                }
            }, this);
        } else {
            this.quezhong.setVisible(false);
        }

        MjClient.playui.checkAddDingQueEffect(this.quetiao);
        MjClient.playui.checkAddDingQueEffect(this.quewan);
        MjClient.playui.checkAddDingQueEffect(this.quetong);
        MjClient.playui.checkAddDingQueEffect(this.quezhong);

        var _queTip = this.block.getChildByName("quementip");
        _queTip.loadTexture("res/playing/queUI/tishi_dingque_" + number + ".png");
        // _queTip.setAnchorPoint(0.5, 1);
        _queTip.x = this.block.getContentSize().width * 0.5;
        _queTip.y = this.quewan.y - 100;


        // /*定缺提示优化*/
        // var player = MjClient.playui.getPlayerInfoByOff();
        // var _tiao = [];
        // var _wan = [];
        // var _tong = [];
        // var _hongzhong = [];
        // for(var i = 0; player.mjhand.length;i++)
        // {
        //     var _cd = player.mjhand[i];
        //
        //
        // }





    }
});