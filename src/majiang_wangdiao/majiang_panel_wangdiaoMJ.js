//邵阳红中麻将
var majiang_panel_wangdiaoMJ;
(function() {
    majiang_panel_wangdiaoMJ = majiang_panel_shaoyang.extend({
        getJsBind: function(){
            var jsBind = {
                node_jiaPiao:{
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
                            MjClient.playui.sendJiaZhuToServer(5, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao2: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(10, MjClient.playui.getSelfUid());
                        }
                    },
                    btn_piao3: {
                        _click:function(btn) {  
                            MjClient.playui.sendJiaZhuToServer(15, MjClient.playui.getSelfUid());
                        }
                    },
                    _event: {
                        initSceneData: function(){
                            var tData = MjClient.data.sData.tData;
                            if(!tData.areaSelectMode.piaoFen && !tData.areaSelectMode.quanKaiFang){
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
                            if(!tData.areaSelectMode.piaoFen && !tData.areaSelectMode.quanKaiFang){
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
                            if(!tData.areaSelectMode.piaoFen && !tData.areaSelectMode.quanKaiFang){
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
                node_down: {
                    layout_head:{ 
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    },
                    node_animation: {
                        _visible: false,
                        _run: function() {
                            this.zIndex = 1000;
                            this.setPositionX(cc.winSize.width * 0.5);
                            this.setPositionY(cc.winSize.height * 0.25);
                        },
                        _event: {
                            MJHu: function(data){
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if(player.info.uid != data.uid){
                                    return;
                                }
                                MjClient.playui.showEatActionAnim(this.getParent(), MjClient.playui.AnimationType.HU,data);
                            }
                        }
                    }
                },
                node_right: {
                    layout_head:{ 
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    },
                    node_animation: {
                        _visible: false,
                        _run: function() {
                            this.zIndex = 1000;
                            this.setPositionX(cc.winSize.width * 0.75);
                            this.setPositionY(cc.winSize.height * 0.5);
                        },
                        _event: {
                            MJHu: function(data){
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if(player.info.uid != data.uid){
                                    return;
                                }
                                MjClient.playui.showEatActionAnim(this.getParent(),MjClient.playui.AnimationType.HU,data);
                            }
                        }
                    },
                },
                node_top: {
                    layout_head:{ 
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    },
                    node_animation: {
                        _visible: false,
                        _run: function() {
                            this.zIndex = 1000;
                            this.setPositionX(cc.winSize.width * 0.5);
                            this.setPositionY(cc.winSize.height * 0.75);
                        },
                        _event: {
                            MJHu: function(data){
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if(player.info.uid != data.uid){
                                    return;
                                }
                                MjClient.playui.showEatActionAnim(this.getParent(),MjClient.playui.AnimationType.HU,data);
                            }
                        }
                    },
                },
                node_left: {
                    layout_head:{ 
                        node_gangScore:{
                            _visible: false,
                        },
                        _event: {
                            showTableEvent: function(isShow){ 
                                MjClient.playui.nowRoundScore(this, isShow);
                            }
                        }
                    },
                    node_animation: {
                        _visible: false,
                        _run: function() {
                            this.zIndex = 1000;
                            this.setPositionX(cc.winSize.width * 0.25);
                            this.setPositionY(cc.winSize.height * 0.5);
                        },
                        _event: {
                            MJHu: function(data){
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if(player.info.uid != data.uid){
                                    return;
                                }
                                MjClient.playui.showEatActionAnim(this.getParent(),MjClient.playui.AnimationType.HU,data);
                            }
                        }
                    }
                },
                img_jiaPiaoTip:{
                    _visible: false
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
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super(majiang_panel_wangdiaoMJ, "Play_WangDiaoMJ.json");
            return true;
        },
        
        // @Override 显示大结算
        createGameOverPanel: function(){
            return new majiang_gameOver_SYHZ();
        },
    }); 
 

    // 抓鸟数
    majiang_panel_wangdiaoMJ.prototype.getIsZhongBird = function(cd,birdArr) {
        if (cd == 71 || (cd <= 29 && cd % 10 == 1 || cd % 10 == 5 || cd % 10 == 9)) {
            return true;
        }
        return false;
    };
    majiang_panel_wangdiaoMJ.prototype.isHunCardShow = function(){
        return false;
    };
    majiang_panel_wangdiaoMJ.prototype.isHunCardShow3D = function(){
        return false;
    };
    majiang_panel_wangdiaoMJ.prototype.isShowTextPiao = function(){
        var tData = MjClient.data.sData.tData;
        return (tData.areaSelectMode.piaoFen || tData.areaSelectMode.quanKaiFang);
    };

    majiang_panel_wangdiaoMJ.prototype.isZiMo = function(huDesc){
        if(!huDesc){
            return false;
        } 

        return huDesc.indexOf("zimo") >= 0 || huDesc.indexOf("gangkai") >= 0 ||
        huDesc.indexOf("wangchuang") >= 0 || huDesc.indexOf("wangdiao") >= 0;
    };

    /**
     *  @Override 是否能添加癞子标识
     **/
    majiang_panel_wangdiaoMJ.prototype.isCanAddLaiZiIcon = function(cardTag){
        return false;
    };

    /**
     *  获取吃碰杠的骨骼动画
     **/
    majiang_panel_wangdiaoMJ.prototype.getEatSpineNode = function(actType) { 
        var atlasSrc = "spine/" + actType + "/" + actType + ".atlas";
        var jsonSrc = "spine/" + actType + "/" + actType + ".json";

        // 输出的文件类型有两种，下面这种特意处理通用
        if(!jsb.fileUtils.isFileExist(atlasSrc)){
            atlasSrc = "spine/" + actType + "/skeleton.atlas";
            jsonSrc = "spine/" + actType + "/skeleton.json";
        }
        var name = "idle";
        if(actType == "wangchuang" || actType == "wangdiao"){
            name = "animation";
        }

        // animation


        var projNode = createSpine(jsonSrc, atlasSrc);
        projNode.setAnimation(0, name, false);
        projNode.setTimeScale(1);
        projNode.setScale(0.5);
        return projNode;
    };

    /**
     *  吃碰杠胡动画
     **/
    majiang_panel_wangdiaoMJ.prototype.showEatActionAnim = function(playerNode, actType,data) {
        var delayTime = 2;
        var animateNode = playerNode.getChildByName("node_animation");
        var nodeName = playerNode.getName();
        var callback = function (){
            animateNode.visible = false;
        };

        var isOpenEffect = this.get3DTeXiaoType();
        var projNode = null;
        var _scale = 1;

        if(data && data.huWord == "wangchuang"){
            actType = "wangchuang";
        }else if(data && data.huWord == "wangdiao"){
            actType = "wangdiao";
        } 
        

        if (this.is3DStyle() && isOpenEffect == 0 && this.isNeedEatActionEffect3D()) {
            if(actType == "wangchuang" || actType == "wangdiao" ){
                 projNode = this.getEatSpineNode(actType);
                _scale = cc.winSize.height / 1280; //根据当前的屏幕的高度动态算缩放大小
            }else{
                projNode = this.getEatSpineNode3D(actType, nodeName);
                _scale = cc.winSize.height / 640;
                delayTime = 0.8;
            } 
            
            
        } else {
            projNode = this.getEatSpineNode(actType);
            _scale = cc.winSize.height / 1280; //根据当前的屏幕的高度动态算缩放大小
        }
        projNode.setScale(_scale);

        animateNode.visible = true;
        animateNode.removeAllChildren();
        animateNode.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));
        animateNode.addChild(projNode);
    };



    /**
     *  began事件时的验证 
     **/
    majiang_panel_wangdiaoMJ.prototype.checkWhenTouchBegan = function(cardNode){
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        
        if(MjClient.movingCard !== null && MjClient.movingCard != cardNode){
            return true;
        } 
        var handCount = this.getCardNodeCountByName(cardNode.getParent(), this.HandleCardType.Hand);
        if(!(handCount % 3 == 2 && this.isTurnMe() || handCount % 3 == 1 && !this.isTurnMe())){
            return true;
        }
        var sData = MjClient.data.sData;
        var tData = sData.tData;

        // 王钓麻将 红中（赖子）只有在手里麻将全是红中的情况下才允许出
        if(MjClient.gameType == MjClient.GAME_TYPE.WANG_DIAO_MA_JIANG && cardNode.tag == tData.hunCard )
        {
            var isClick = true;
            //手里的牌必须全是红中 
            for (var i = 0; i < player.mjhand.length; i++) {
                if(player.mjhand[i] != 71){
                    isClick = false;
                    break;
                }
            }
            if(!isClick)
                return true;
        }

        // 自动摸打 
        if (player.tPutCard && this.isTurnMe()) {
            if (!MjClient.Scene.ToastNodeArray || MjClient.Scene.ToastNodeArray.length == 0) {
                MjClient.showToast("出牌请先取消自动摸打");
            }
            return true;
        }

        return false;
    };

    /**
     *  检查杠的按钮
     **/
    majiang_panel_wangdiaoMJ.prototype.checkGangBtn = function(player){
        var tData = MjClient.data.sData.tData;
        this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing, tData.hunCard);
        if(this.gangCardArray.length > 0){
            return true;
        }
        return false;
    };

    /**
     *  获得玩家可操作按钮
     **/
    majiang_panel_wangdiaoMJ.prototype.getPlayerEatNode = function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];

        // 王闯王钓更换按钮资源
        var wangType = player.wangType;
        eat.btn_hu._node.loadTextureNormal("playing/gameTable/youxizhong-2_53.png"); 
        if(wangType == 1){  
             eat.btn_hu._node.loadTextureNormal("playing/paohuzi/youxizhong-299.png"); 
        }else if(wangType == 2){   
            eat.btn_hu._node.loadTextureNormal("playing/paohuzi/youxizhong-298.png");  
        }  
        cc.log("ssssssssssssssssssssssss",wangType);
        if(this.isTurnMe()){
            //杠
            if(this.checkGangBtn(player) && !this.clickGangPass){
                nodeArr.push(eat.btn_gang._node);
            }

            //胡
            if (player.eatFlag & 8) {
                nodeArr.push(eat.btn_hu._node);
            }
        }else{
            if (player.eatFlag & 4 ) {
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
    };

    /**
     *  是否可以自动摸打
     **/
    majiang_panel_wangdiaoMJ.prototype.isCanAutoPut = function(){
        return false;
    };

    // @Override 发送过的命令给服务器
    majiang_panel_wangdiaoMJ.prototype.clickPass = function() {
        var that = this;
        if (that.checkWhenPass()){
            return;
        }
        // 过杠记录存储
        var tData = MjClient.data.sData.tData;
        var roomMsgValue = tData.tableid +":"+tData.roundNum;
        var saveRoomMsgValueG = util.localStorageEncrypt.getStringItem("IGNORE_G_TIP","");
        var player = that.getPlayerInfoByOff(0);
        if (that.isTurnMe()){
            var canGang = that.checkGangBtn(player);
            var passCallBack = function(){
                if(canGang){
                    util.localStorageEncrypt.setStringItem("IGNORE_G_TIP",roomMsgValue);
                    that.clickGangPass = true;
                }
                that.showPassHuTips();
                that.hideEatNodeChildren();
                that.sendPassToServer();
            } 

            if (!canGang && (player.eatFlag & 8)){
                passCallBack();
                return ;
            }

            var msg = "确认过";
            if (canGang){
                // 只有杠就不弹出确认框了
                if(roomMsgValue == saveRoomMsgValueG){
                    passCallBack();
                    return;
                } 

                msg += " 杠 ";
            }

            msg += "吗?";
            MjClient.showMsg(msg, function(){
                passCallBack();
            }, function() {}, "1");
        }else{
            if((player.eatFlag & 8) > 0){
                that.showPassHuTips();
            }
            that.hideEatNodeChildren();
            that.sendPassToServer();
        }
    };

    //Override
    majiang_panel_wangdiaoMJ.prototype.handlerWhenCardTouchEnded = function(cardNode, cardTag){
        var player = MjClient.playui.getPlayerInfoByName("node_down");
        if(player && player.eatFlag & 8){
            if(this.isNeedSkipHuTip()){
                this.showPassHuTips();
            }
            this.sendPassToServer();
            this.putOutCard(cardNode, cardTag);
        }else{
            this.putOutCard(cardNode, cardTag);
        }
    };

    // 显示当前局数增加的分数
    majiang_panel_wangdiaoMJ.prototype.nowRoundScore = function(node, isShow) { 
        var tData = MjClient.data.sData.tData;
        var playerNodeName = node.getParent().getName();
        var player = MjClient.playui.getPlayerInfoByName(playerNodeName);
        if (!tData || !player) {
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
    majiang_panel_wangdiaoMJ.prototype.createEndOnePanel = function(){
        return new majiang_winGamePanel_wangdiao();
    };

    //是否显示飘分
    majiang_panel_wangdiaoMJ.prototype.isShowPiao = function(){
        var tData = MjClient.data.sData.tData;
        return (tData.areaSelectMode.piaoFen || tData.areaSelectMode.quanKaiFang);
    };
}());