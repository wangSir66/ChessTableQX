//贵州，普定麻将
var PlayLayer_guizhouXMYGuiYangZhuoJi;
(function() {
    PlayLayer_guizhouXMYGuiYangZhuoJi = PlayLayer_guizhou.extend({
        getJsBind: function(){
            var jsBind = {
                node_down: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_right: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_top: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_left: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
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
                _run: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    var pl = MjClient.playui.getPlayerInfoByOff();
                    if (tData.tState === TableState.waitSelect && SelfUid() === pl.info.uid && MjClient.rePlayVideo == -1) {
                        if (typeof(pl.que) == "undefined" || pl.que === -1) {
                            var params = {
                                cardTypeArr : [0, 1, 2],
                                number : 1
                            };
                            var layer = new DingQueGuiZhouLayer(params);
                            layer.setName("dingque");
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        }
                    }
                },
                _event:{
                    MJSelect:function(msg){
                        for(var off = 0; off < MjClient.playui.NodeNameArray.length; off++) {
                            var pl = MjClient.playui.getPlayerInfoByOff(off);
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
                        MjClient.playui.updatePlayerEatBtn();

                        var isAllSelected = true;
                        MjClient.AllPlayerRun(function(pl){
                            if(pl.que === -1 || pl.que === undefined)
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
                                    MjClient.playui.playSignAnimation(head, pl.que);
                                }
                            }
                        }

                    },
                    mjhand:function() {
                        if(MjClient.endoneui && cc.sys.isObjectValid(MjClient.endoneui)){
                            MjClient.endoneui.removeFromParent(true);
                            MjClient.endoneui = null;
                        }
                        MjClient.playui.lastPutCardNode = null;
                        //ScanCheatLayer.showStartOnce();
                        MjClient.playui.handleMjhand();

                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var pl = MjClient.playui.getPlayerInfoByName(MjClient.playui.NodeNameArray[0]);
                        if (tData.tState === TableState.waitSelect && SelfUid() === pl.info.uid && MjClient.rePlayVideo === -1) {
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
                    initSceneData:function() {

                        if(MjClient.rePlayVideo !== -1) return; //回放的时候，不弹解散窗口

                        var tData = MjClient.data.sData.tData;
                        if(tData.delEnd !== 0 && !MjClient.delroomui){
                            MjClient.Scene.addChild(new RemoveRoomView());
                            if (MjClient.webViewLayer != null){
                                MjClient.webViewLayer.close();
                            }
                        }else if(tData.delEnd === 0 && MjClient.delroomui){
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
                            if(pl.que === -1 || pl.que === undefined)
                            {
                                isAllSelected = false;
                            }
                        });

                        if(isAllSelected) {
                            for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++){
                                var _nodeName =  MjClient.playui.NodeNameArray[off];
                                var pl = MjClient.playui.getPlayerInfoByName(_nodeName);
                                var tData = MjClient.data.sData.tData;
                                if (pl && pl.que !== -1 && pl.que !== undefined && tData.tState !== TableState.roundFinish )
                                {
                                    var node = MjClient.playui.getNodeByOff(off);
                                    MjClient.playui.playSignAnimation(node.getChildByName("layout_head"), pl.que);
                                }
                            }
                        }
                    },
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
                    clearCardUI:function(){
                        //清理标记
                        for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) MjClient.playui.clearSign(MjClient.playui.getNodeByOff(off));
                        for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++) MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                    },
                    onlinePlayer: function(data){
                        //清理标记
                        var tData = MjClient.data.sData.tData;
                        var player = MjClient.playui.getPlayerInfoByOff();
                        if(tData.tState === TableState.roundFinish &&
                            data.uid === player.info.uid &&
                            player.mjState === TableState.isReady)
                        {
                            for(var off = 0; off < MjClient.playui.NodeNameArray.length;off++) MjClient.playui.clearSign(MjClient.playui.getNodeByOff(off));
                            for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++) MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_guizhouXMYGuiYangZhuoJi.json");
            MjClient.playui = this;
            return true;
        },

        /**
         *  是否已经开始游戏
         *  return {Boolean}
         **/
        isInGame: function () {
            var tData = MjClient.data.sData.tData;
            if (!tData) return false;
            if (tData.tState === TableState.waitPut || tData.tState === TableState.waitEat ||
                tData.tState === TableState.waitCard || tData.tState === TableState.waitSelect) { // waitSelect
                return true;
            }
            return false;
        },

        /**
         * 定缺之后的动画,飞到对应的头像上面
         */
        playSignAnimation: function (node, ques) {

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
        },

        /**
         *  began事件时的验证,返回true ，当前不能出牌
         **/
        checkWhenTouchBegan: function (cardNode) {
            // MjClient.showToast("checkWhenTouchBegan ！");
            //this.addChild(new maJiang_showChicken([11,12,13], function(){}));

            if(!this.isTurnMe()) return true;

            if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
                return true;
            }

            var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
            if(handCount % 3 != 2){
                return true;
            }

            // 自动摸打
            var player = MjClient.playui.getPlayerInfoByName("node_down");
            if (player.tPutCard) {
                if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                    MjClient.showToast("出牌请先取消自动摸打");
                }
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
        resetCardLayout: function(node){
            var is3D = this.is3DStyle();
            if(is3D){
                this.resetCardLayout3D(node);
            }else{
                this.resetCardLayout2D(node);
            }
            this.resetQueCardColor();
        },

        /**
         * 这张牌是否是定缺的那张牌
         */
        isQueCard: function (cd, pl) {
            if(!pl) pl = MjClient.playui.getPlayerInfoByOff();
            if(!pl || pl.que === undefined || pl.que === -1 || pl.que === null) return false;
            return Math.floor(cd / 10) === pl.que[0];
        },


        /**
         * 刷新缺牌颜色
         */
        resetQueCardColor :function() {

            var player = MjClient.playui.getPlayerInfoByOff();
            if(player.isTing || !player.mjhand) return;
            var haveQue = false;
            var handCards = player.mjhand.slice();

            for(var k = 0; k < handCards.length ;k++) {
                if(this.isQueCard(handCards[k])){ //手里有缺的麻将
                    haveQue = true;
                    break;
                }
            }

            var node = MjClient.playui.getNodeByOff(0);
            var children = node.children;
            for(var i = 0; i < children.length; i++) {
                var cd = children[i];
                if (cd.name === this.HandleCardType.Hand) {
                    if (haveQue) {
                        if (this.isQueCard(cd.tag)) {
                            cd.setColor(cc.color(255, 255, 255));
                        } else {
                            cd.setColor(cc.color(170, 170, 170));
                        }
                    } else {
                        cd.setColor(cc.color(255, 255, 255));
                    }
                }
            }
        },

        checkGangBtn: function (player) {

            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            var _gangCardArray = [];
            for(var i = 0;i < this.gangCardArray.length;i++)
            {
                if(!this.isQueCard(this.gangCardArray[i])) //定缺的牌不能吃，碰，杠,把缺的牌排除
                {
                    _gangCardArray.push(this.gangCardArray[i]);
                }
            }
            if(_gangCardArray.length > 0){
                return true;
            }
            return false;
        },
        /**
         * 是否是新的听牌方式
         */
        isNewTing:function()
        {
            return true;
        },
        getPlayerEatNode: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var nodeArr = [];
            this.gangCardArray = [];

            //2，3人才有定缺
            if(tData.maxPlayer !== 4 && (typeof(player.que) == "undefined" || player.que === -1)){
                return nodeArr;
            }

            if(this.isTurnMe()){
                //杠
                if(!player.isTing && MjClient.playui.checkGangBtn(player) && !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }

                //听
                if(!player.isTing && MjClient.playui.checkTingBtn(player)){
                    if(!player.isDoTianTing)
                    {
                        nodeArr = [];
                    }
                    nodeArr.push(eat.btn_ting._node);
                }

                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
            }else{
                if (!player.isTing && player.eatFlag & 4) {
                    nodeArr.push(eat.btn_gang._node);
                    this.gangCardArray.push(tData.lastPutCard);
                }
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                }
                if (player.eatFlag & 1){
                    nodeArr.push(eat.btn_chi._node);
                    this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
                }
            }
            if(nodeArr.length > 0){
                nodeArr.push(eat.btn_guo._node);
            }
            this.reloadBtnTexture(nodeArr);
            return nodeArr;
        }
    });
}());

// override 获取缺牌门列表(按牌数 牌好坏排序)
PlayLayer_guizhouXMYGuiYangZhuoJi.prototype.getQueTypeArr = function() {
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
        if (cards.length >= 5) {
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

    return queTypeArr;
};

// override 是否添加定缺提示特效
PlayLayer_guizhouXMYGuiYangZhuoJi.prototype.hasDingQueTip = function() {
    return true;
};