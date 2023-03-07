//邵阳转转麻将
var majiang_panel_TYZZ;
(function() {
    majiang_panel_TYZZ = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                node_down: {
                    layout_head:{
                        text_piao: {
                            _visible: false,
                            _event: {
                                initSceneData: function(){
                                    this.updatePiaoContent();
                                },
                                MJJiazhu: function(data){
                                    this.updatePiaoContent(data);
                                },
                                mjhand: function(){
                                    this.updatePiaoContent();
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            },
                            updatePiaoContent:function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                var jiazhuNum;
                                if(arguments.length === 0){
                                    if(!player || player.jiazhuNum < 0){
                                        return;
                                    }
                                    jiazhuNum = player.jiazhuNum;
                                }else{
                                    var param = arguments[0];
                                    if(player && player.info.uid != param.uid) {
                                        return;
                                    }
                                    jiazhuNum = param.jiazhuNum;
                                }
                                if (cc.isUndefined(jiazhuNum)){
                                    return;
                                }
                                this.visible = true;
                                var content = jiazhuNum == 0 ? "不飘" : "飘" + jiazhuNum;
                                this.setString(content);
                            }
                        },
                        node_gangScore:{
                            _run:function(){
                                this.visible = false;
                                this.setUserData({pos:this.getPosition()}); 
                            },
                            _event: {
                                MJGangScore: function(d){
                                    MjClient.playui.updateGangScore(this, "node_down", d);
                                },
                                initSceneData: function(){
                                    this.visible = false;
                                }
                            }
                        },
                        atlas_score: {
                            _visible: true,
                            _event: {
                                addPlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        return;
                                    }

                                    this.visible = true;
                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                removePlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        this.visible = false;
                                        changeAtalsForLabel(this, "");
                                    }
                                },
                                mjhand: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        return;
                                    }
                                    
                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                roundEnd: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        return;
                                    }

                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                initSceneData: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        return;
                                    }

                                    if (!MjClient.playui.isInGame()) {
                                        player.gangScore = 0;
                                    }

                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                }
                            }
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
                                    this.updatePiaoContent();
                                },
                                MJJiazhu: function(data){
                                    this.updatePiaoContent(data);
                                },
                                mjhand: function(){
                                    this.updatePiaoContent();
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            },
                            updatePiaoContent:function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                var jiazhuNum;
                                if(arguments.length === 0){
                                    if(!player || player.jiazhuNum < 0){
                                        return;
                                    }
                                    jiazhuNum = player.jiazhuNum;
                                }else{
                                    var param = arguments[0];
                                    if(player && player.info.uid != param.uid) {
                                        return;
                                    }
                                    jiazhuNum = param.jiazhuNum;
                                }
                                if (cc.isUndefined(jiazhuNum)){
                                    return;
                                }
                                this.visible = true;
                                var content = jiazhuNum == 0 ? "不飘" : "飘" + jiazhuNum;
                                this.setString(content);
                            }
                        },
                        node_gangScore:{
                            _run: function(){
                                this.visible = false;
                                this.setUserData({pos:this.getPosition()}); 
                            },
                            _event: {
                                MJGangScore: function(d){
                                    MjClient.playui.updateGangScore(this, "node_right", d);
                                },
                                initSceneData: function(){
                                    this.visible = false;
                                }
                            }
                        },
                        atlas_score: {
                            _visible: true,
                            _run: function(){
                                this.setString("");
                            },
                            _event: {
                                addPlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) {
                                        return;
                                    }

                                    this.visible = true;
                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                removePlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) {
                                        this.visible = false;
                                        changeAtalsForLabel(this, "");
                                    }
                                },
                                mjhand: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) {
                                        return;
                                    }
                                    
                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                roundEnd: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");

                                    if (!player) {
                                        return;
                                    }

                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                initSceneData: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) {
                                        return;
                                    }

                                    if (!MjClient.playui.isInGame()) {
                                        player.gangScore = 0;
                                    }

                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                }
                            }
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
                                    this.updatePiaoContent();
                                },
                                MJJiazhu: function(data){
                                    this.updatePiaoContent(data);
                                },
                                mjhand: function(){
                                    this.updatePiaoContent();
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            },
                            updatePiaoContent:function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                var jiazhuNum;
                                if(arguments.length === 0){
                                    if(!player || player.jiazhuNum < 0){
                                        return;
                                    }
                                    jiazhuNum = player.jiazhuNum;
                                }else{
                                    var param = arguments[0];
                                    if(player && player.info.uid != param.uid) {
                                        return;
                                    }
                                    jiazhuNum = param.jiazhuNum;
                                }
                                if (cc.isUndefined(jiazhuNum)){
                                    return;
                                }
                                
                                this.visible = true;
                                var content = jiazhuNum == 0 ? "不飘" : "飘" + jiazhuNum;
                                this.setString(content);
                            }
                        },
                        node_gangScore:{
                            _run: function(){
                                this.visible = false;
                                this.setUserData({pos:this.getPosition()}); 
                            },
                            _event: {
                                MJGangScore: function(d){
                                    MjClient.playui.updateGangScore(this, "node_top", d);
                                },
                                initSceneData: function(){
                                    this.visible = false;
                                }
                            }
                        },
                        atlas_score: {
                            _visible: true,
                            _run: function(){
                                this.setString("");
                            },
                            _event: {
                                addPlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        return;
                                    }

                                    this.visible = true;
                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                removePlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        this.visible = false;
                                        changeAtalsForLabel(this, "");
                                    }
                                },
                                mjhand: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        return;
                                    }
                                    
                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                roundEnd: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        return;
                                    }

                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                initSceneData: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        return;
                                    }

                                    if (!MjClient.playui.isInGame()) {
                                        player.gangScore = 0;
                                    }

                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                }
                            }
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
                                    this.updatePiaoContent();
                                },
                                MJJiazhu: function(data){
                                    this.updatePiaoContent(data);
                                },
                                mjhand: function(){
                                    this.updatePiaoContent();
                                },
                                clearCardUI:function(){
                                    this.visible = false;
                                }
                            },
                            updatePiaoContent:function(){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                var jiazhuNum;
                                if(arguments.length === 0){
                                    if(!player || player.jiazhuNum < 0){
                                        return;
                                    }
                                    jiazhuNum = player.jiazhuNum;
                                }else{
                                    var param = arguments[0];
                                    if(player && player.info.uid != param.uid) {
                                        return;
                                    }
                                    jiazhuNum = param.jiazhuNum;
                                }
                                if (cc.isUndefined(jiazhuNum)){
                                    return;
                                } 
                                
                                this.visible = true;
                                var content = jiazhuNum == 0 ? "不飘" : "飘" + jiazhuNum;
                                this.setString(content);
                            }
                        },
                        node_gangScore:{
                            _run: function(){
                                this.visible = false;
                                this.setUserData({pos:this.getPosition()}); 
                            },
                            _event: {
                                MJGangScore: function(d){
                                    MjClient.playui.updateGangScore(this, "node_left", d);
                                },
                                initSceneData: function(){
                                    this.visible = false;
                                }
                            }
                        },
                        atlas_score: {
                            _visible: true,
                            _run: function(){
                                this.setString("");
                            },
                            _event: {
                                addPlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        return;
                                    }

                                    this.visible = true;
                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                removePlayer: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        this.visible = false;
                                        changeAtalsForLabel(this, "");
                                    }
                                },
                                mjhand: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        return;
                                    }
                                    
                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                roundEnd: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        return;
                                    }

                                    if (player.winall) {
                                        changeAtalsForLabel(this, player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                },
                                initSceneData: function(){
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        return;
                                    }

                                    if (!MjClient.playui.isInGame()) {
                                        player.gangScore = 0;
                                    }
                                    
                                    if (player.gangScore + player.winall) {
                                        changeAtalsForLabel(this, player.gangScore + player.winall);
                                    } else {
                                        changeAtalsForLabel(this, 0);
                                    }
                                }
                            }
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    }
                },
                node_eat: {
                    node_showCards: {
                        _visible: true,
                        img_showCardsBg: {
                            _layout: [[0.3, 0.3], [0.5, 0.16], [0, 0]],
                            _event: {
                                changeMJBgEvent: function(){
                                    var children = this.children;
                                    var mjBgType = MjClient.playui.getMaJiangBgType();
                                    for(var i = 0;i < children.length;i++){
                                        var child = children[i];
                                        if(child.name == MjClient.playui.HandleCardType.Put){
                                            MjClient.playui.updateAfterChangeMjBg(child, mjBgType, 0);
                                        }
                                    }                    
                                }
                            },
                            img_card: {
                                _visible: false
                            },
                            btn_pass:{
                                _visible: false
                            },
                            btn_back: {
                                _touch: function(sender, eventType){
                                    if(eventType != ccui.Widget.TOUCH_ENDED){
                                        return;
                                    }
                                    sender.getParent().visible = false;
                                    MjClient.playui.hasClickBtn = false;
                                    MjClient.playui.updatePlayerEatBtn();        
                                }
                            },
                            updateSize: function(row, col){
                                var templatCard = this.getChildByName("img_card");
                                var factSize = this.getContentSize();
                                var width = templatCard.width * templatCard.scale * col;
                                var height = templatCard.height * templatCard.scale * row;
                                width = width > factSize.width ? width : factSize.width;
                                height = height > factSize.height ? height : factSize.height;
                                this.setContentSize(width, height);
                            },
                            getStartPos: function(row, col){
                                var templatCard = this.getChildByName("img_card");
                                var factSize = this.getContentSize();
                                var width = templatCard.width * templatCard.scale * col;
                                var height = templatCard.height * templatCard.scale * row;
                                var space_w = (factSize.width - width) / 2;
                                var space_h = (factSize.height - height) / 2;
                                var start_x = space_w + templatCard.width * templatCard.scale / 2;
                                var start_y = space_h + templatCard.height * templatCard.scale / 2;
                                return cc.p(start_x, start_y);
                            },
                            showCards: function(){
                                var children = this.children;
                                for(var i = 0;i < children.length;i++){
                                    var child = children[i];
                                    if(child.name == MjClient.playui.HandleCardType.Put){
                                        child.removeFromParent(true);
                                    }
                                }
                                MjClient.playui.hideEatNodeChildren();
                                this.getParent().visible = true;
                            },
                            hideCards: function(){
                                this.getParent().visible = false;
                                MjClient.playui.updatePlayerEatBtn();
                            },
                            showEatCards: function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.eatCardArray;
                                this.updateSize(cardArr.length, 3);
                                var startPos = this.getStartPos(cardArr.length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var lastPutCard = MjClient.data.sData.tData.lastPutCard;
                                var self = this;
                                for(var i = 0;i < cardArr.length;i++){
                                    for (var j = 0; j < 3; j ++){
                                        var card = util.clone(templatCard);
                                        if (cardArr[i] == j){
                                            card.color = cc.color(255, 255, 0);
                                        }
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);
                                        card.tag = cardArr[i];
                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(cc.p(x, y));
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, lastPutCard - cardArr[i] + j);

                                        card.addTouchEventListener(function(sender, eventType){
                                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                                MjClient.playui.sendChiToServer(sender.tag);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            },
                            showGangCards: function(){
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.gangCardArray;
                                this.updateSize(cardArr.length, 4);
                                var startPos = this.getStartPos(cardArr.length, 4);
                                var templatCard = this.getChildByName("img_card");
                                var self = this;
                                for(var i = 0;i < cardArr.length;i++){
                                    for (var j = 0; j < 4; j ++){
                                        var card = util.clone(templatCard);
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);
                                        card.tag = cardArr[i];
                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(x, y);
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, cardArr[i]);

                                        card.addTouchEventListener(function(sender, eventType){
                                            if (MjClient.playui.refuseGangWhenHu(sender.tag)) {
                                                return ;
                                            }

                                            if(eventType == ccui.Widget.TOUCH_BEGAN){
                                                MjClient.playui.hasClickBtn = true;
                                            }
                                            if(eventType == ccui.Widget.TOUCH_CANCELED){
                                                MjClient.playui.hasClickBtn = false;
                                            }
                                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                                if (player.eatFlag & 8) {
                                                    MjClient.showMsg("确认不胡吗?", function(){
                                                        MjClient.playui.sendGangToServer(sender.tag);
                                                        MjClient.playui.hideEatNodeChildren();
                                                        self.getParent().visible = false;
                                                    }, function() {}, "1");
                                                } else {
                                                    MjClient.playui.sendGangToServer(sender.tag);
                                                    MjClient.playui.hideEatNodeChildren();
                                                    self.getParent().visible = false;
                                                }
                                                
                                            }
                                        }, card);
                                    }
                                }
                            }
                        }
                    },
                    btn_gang: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if(eventType == ccui.Widget.TOUCH_BEGAN){
                                MjClient.playui.hasClickBtn = true;
                            }
                            if(eventType == ccui.Widget.TOUCH_CANCELED){
                                MjClient.playui.hasClickBtn = false;
                            }
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if(sender.checkGang()){
                                    return;
                                }

                                if(MjClient.playui.gangCardArray.length > 1){
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {}, "1");
                                } else {
                                    MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        },
                        checkGang: function(){
                            return MjClient.playui.refuseGangWhenHu(MjClient.playui.gangCardArray[0]);
                        }      
                    },
                    btn_peng: {
                        _visible: false,
                        _touch: function(sender, eventType) {
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if(sender.checkPeng()){
                                    return;
                                }
                                
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendPengToServer();
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {}, "1");
                                } else {
                                    MjClient.playui.sendPengToServer();
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        },
                        checkPeng: function(){
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            var tData = MjClient.data.sData.tData;
                            if (tData.areaSelectMode.bihuType && player.eatFlag & 8) {
                                MjClient.showToast("有胡必胡");
                                return true;
                            }
                            return false;
                        }
                    },
                    btn_chi: {
                        _visible: false,
                        _touch: function(sender, eventType){
                            if(eventType == ccui.Widget.TOUCH_ENDED){
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if(sender.checkChi()){
                                    return;
                                }

                                if(MjClient.playui.eatCardArray.length > 1){
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showEatCards();
                                    return;
                                }

                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function(){
                                        MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function() {}, "1");
                                } else {
                                    MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        },
                        checkChi: function(){
                            var player = MjClient.playui.getPlayerInfoByOff(0);
                            var tData = MjClient.data.sData.tData;
                            if (tData.areaSelectMode.bihuType && player.eatFlag & 8) {
                                MjClient.showToast("有胡必胡");
                                return true;
                            }
                            return false;
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
                        MJJiazhu: function(eD){
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
                img_piaoNiao: {
                    _run: function(){
                        this.visible = false;
                        setWgtLayout(this,[0.12, 0.12], [0.5, 0.25], [0, 0]);
                    },
                    btn_buZha: {
                        _click:function(btn){
                            MjClient.playui.sendJiaZhuToServer(0, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_zhaNiao: {
                        _click:function(btn){
                            MjClient.playui.sendJiaZhuToServer(2, MjClient.playui.getSelfUid());
                        }
                    },
                    _event:{
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff();
                            if(!pl){
                                return;
                            }
                            if(pl.mjState == TableState.waitJiazhu){
                                this.visible = true;
                                if(pl.jiazhuNum > 0){
                                    var piao0Btn = this.getChildByName("btn_buZha");
                                    piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                                    var piao1Btn = this.getChildByName("btn_zhaNiao");
                                    piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");                            
                                }else{
                                    var piao0Btn = this.getChildByName("btn_buZha");
                                    piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                                    var piao1Btn = this.getChildByName("btn_zhaNiao");
                                    piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                                }
                            }
                        },
                        waitJiazhu: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff();
                            if(!pl){
                                return;
                            }
                            //如果赢家选了扎鸟，则替换为"戳"的按钮
                            if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 2){
                                var piao0Btn = this.getChildByName("btn_buZha");
                                piao0Btn.loadTextures("playing/gameTable/buchuo_n.png","playing/gameTable/buchuo_s.png");
                                var piao1Btn = this.getChildByName("btn_zhaNiao");
                                piao1Btn.loadTextures("playing/gameTable/chuoda_n.png","playing/gameTable/chuoda_s.png");
                            }else{
                                var piao0Btn = this.getChildByName("btn_buZha");
                                piao0Btn.loadTextures("playing/gameTable/buzha_n.png","playing/gameTable/buzha_s.png");
                                var piao1Btn = this.getChildByName("btn_zhaNiao");
                                piao1Btn.loadTextures("playing/gameTable/zhaniao_n.png","playing/gameTable/zhaniao_s.png");
                            }
                            if(cc.isArray(eD.chuoId) && eD.chuoId.indexOf(pl.info.uid) >= 0 && pl.jiazhuNum == 4){
                                this.visible = false;
                            }else{
                                this.visible = true;
                            }
                        },
                        mjhand: function(){
                            this.visible = false;
                        },
                        MJJiazhu: function(eD){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoniao){
                                this.visible = false;
                                return;
                            }
                            var pl = MjClient.playui.getPlayerInfoByOff();
                            if(!pl){
                                return;
                            }
                            if(pl.info.uid == eD.uid){
                                this.visible = false;
                            }
                        }
                    }
                },
                img_jiaPiaoTip: {
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
                        MJJiazhu: function(eD){
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
                _event: {
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
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_TYZZ, "Play_MaJiangTYZZ.json");
            return true;
        }
    });

    //Override
    majiang_panel_TYZZ.prototype.isCanAutoPut = function() {
        return true;
    };

    //Override
    majiang_panel_TYZZ.prototype.getPlayerEatNode = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var isOnlyHu = tData.areaSelectMode.bihuType && player.eatFlag & 8;
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
        if(this.isTurnMe()){
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }

            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                nodeArr.push(eat.btn_gang._node);
            }

            if (player.eatFlag & 8 && player.isNew) {
                player.isZiMoHu = true;
            } else {
                player.isZiMoHu = false;
            }
        } else {
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }

            if (player.eatFlag & 4 ) {
                nodeArr.push(eat.btn_gang._node);
                this.gangCardArray.push(tData.lastPutCard);
            }
            
            if (player.eatFlag & 2) {
                nodeArr.push(eat.btn_peng._node);
            }
            if (player.eatFlag & 1){
                nodeArr.push(eat.btn_chi._node);
                this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
            }
        }

        if(nodeArr.length > 0 && !isOnlyHu){
            nodeArr.push(eat.btn_guo._node);
        }
        this.reloadBtnTexture(nodeArr);
        return nodeArr;
    };

    //Override
    majiang_panel_TYZZ.prototype.checkWhenPass = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = MjClient.playui.getPlayerInfoByOff(0);

        if (player.isZiMoHu) {
            MjClient.showToast("自摸必须胡牌");
            return true;
        }

        if (tData.areaSelectMode.bihuType && player.eatFlag & 8){
            MjClient.showToast("有胡必胡");
            return true;
        }
        return false;
    };

    //Override
    majiang_panel_TYZZ.prototype.checkWhenTouchBegan = function(cardNode) {
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

        if(player.mustHu){
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

    // 可以胡牌时的禁止操作
    majiang_panel_TYZZ.prototype.refuseGangWhenHu = function(cardTag) {
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        var tData = MjClient.data.sData.tData;
        var canHuAfterGang = MjClient.majiang.canHuAfterGang(player.mjhand, cardTag, tData.hunCard);
        if(player && player.isZiMoHu && !canHuAfterGang) {
            MjClient.showToast("自摸必须胡牌");
            return true;
        } else if(tData.areaSelectMode.bihuType && player.eatFlag & 8 && !canHuAfterGang) {
            MjClient.showToast("有胡必胡");
            return true;
        }
        return false;
    };

    // 计算杠分
    majiang_panel_TYZZ.prototype.updateGangScore = function(node, playerNodeName, data) {
        var sData = MjClient.data.sData;
        if(!sData){
            return;
        }

        var pl = MjClient.playui.getPlayerInfoByName(playerNodeName);
        if(!pl){
            return;
        }

        var score = data.scoreArr[pl.info.uid + ""];
        if(!score || score == 0){
            return;
        }

        node.visible = true;
        node.setPosition(node.getUserData().pos);

        var iconImg = node.getChildByName("img_icon");
        var scoreText = node.getChildByName("text_score");

        pl.winall = pl.winall || 0;

        var iconFileName = score > 0 ? "playground/gang_addIcon.png":"playground/gang_subIcon.png";
        var scoreFileName = score > 0 ? "playground/gang_addText.png":"playground/gang_subText.png";

        iconImg.loadTexture(iconFileName);
        scoreText.setProperty(score, scoreFileName, 50, 73, ".");
        scoreText.ignoreContentAdaptWithSize(true);
        scoreText.x = iconImg.x + scoreText.getContentSize().width;

        var moveAction = cc.moveBy(0.5,cc.p(0, 10));
        var callFunc = cc.callFunc(function(){
            var parent = node.parent;
            var scoreText = parent.getChildByName("atlas_score");
            changeAtalsForLabel(scoreText, pl.gangScore + pl.winall);
        });
        var delayAction = cc.delayTime(1.5);
        var endCallFunc = cc.callFunc(function(){
            node.visible = false;
        });
        var seqAction = cc.sequence(moveAction, callFunc, delayAction, endCallFunc);
        node.runAction(seqAction);
    };

    // 抓鸟数
    majiang_panel_TYZZ.prototype.getIsZhongBird = function(cd, birdArr) {
        var tData = MjClient.data.sData.tData;
        if(!birdArr) birdArr = tData.mopai;
        //转转麻将上中下鸟不显示光效
        if(tData.areaSelectMode.anzhuang){
            var cardNum = cd % 10;

            if ((tData.zhuang + cardNum + tData.maxPlayer - 1) % tData.maxPlayer == tData.uids.indexOf(SelfUid()))
            {
                return true;
            }
        }
        else if(tData.areaSelectMode.buLunKong){
            var cardNum = cd % 10;

            if ((cardNum + tData.maxPlayer) % tData.maxPlayer == 1)
            {
                return true;
            }
        }
        else if(birdArr && birdArr.length > 1 && tData.areaSelectMode.zhuaniao != 1){
            if (cd == 31 || cd == 71 ||
                (cd <= 29 && cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9))
            {
                return true
            }
        }
        return false;
    };

    // 显示当前局数增加的分数
    majiang_panel_TYZZ.prototype.nowRoundScore = function(node, isShow) { 
        var tData = MjClient.data.sData.tData;
        var playerNodeName = node.getParent().getName();
        var player = MjClient.playui.getPlayerInfoByName(playerNodeName);
        if (!tData || tData.areaSelectMode.jiapiao || !player) {
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
}());