/***
 * 邵阳麻将新框架
 * @type {void | Class | *}
 */

var majiang_panel_SYMJ;
(function () {
    majiang_panel_SYMJ = majiang_panel_shaoyang.extend({

        jsonFile: "Play_MaJiangSYMJ.json",
        getJsBind: function(){
            var jsBind = {
                node_down : {
                    layout_head: {
                        img_chuizi:{
                            _run:function(){
                                this.visible = false
                            },
                            _event:{
                                newCard:function(){
                                    postEvent("closeChiTips"); 
                                },
                                MJChi:function(ed){
                                    postEvent("closeChiTips");  
                                    if(IsTurnToMe()){ 
                                        var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                        pl.isShowChiTips = false; 
                                    }
                                },
                                roundEnd:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    pl.isShowChiTips = true;
                                    this.visible = false;
                                },
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = ed.jiachuiNum === 1; 
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    this.visible = pl.jiachuiNum === 1; 
                                },
                                initSceneData:function(){

                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl)
                                        return;
                                    var isShow = true;
                                    if(TableState.waitJiazhu == pl.mjState ||  TableState.roundFinish == pl.mjState  ){
                                        isShow = false;
                                    }

                                     // 重连检验
                                    this.visible = pl.jiachuiNum == 1 && isShow;
                                },
                                mjhand:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl) return;   
                                    this.visible = pl.jiachuiNum === 1;                            
                                }, 

                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        },
                        img_buChui:{
                            _visible: false, 
                            _event:{
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = true;  
                                    setJiaChuiTipsShow(this,ed);
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                initSceneData:function(){
                                    this.visible = false;
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl) return; 
                                    var tData = MjClient.data.sData.tData;  
                                    if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                        && tData.areaSelectMode.isJiaChui  ){
                                        this.visible = true;
                                    }  
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                mjhand:function(){  
                                    this.visible = false;                            
                                },  
                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        }
                    },
                    _event: {
                        waitPut: function(data){
                            var tData = MjClient.data.sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if(tData.uids[tData.curPlayer] == player.info.uid){
                                MjClient.playui.updateColoeAfterSelectCard();
                                MjClient.playui.resetCardLayout(this);
                                MjClient.playui.updateTingTips();
                                MjClient.playui.autoPutAfterTing();
                                var cardCount = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                                if(cardCount < tData.maxPlayer){
                                    MjClient.showToast("最后一圈不能吃碰");
                                }
                            }
                        },
                    }
                },
                node_right : {
                    layout_head: {
                        img_chuizi:{
                            _run:function(){
                                this.visible = false
                            },
                            _event:{
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = ed.jiachuiNum === 1; 
                                },
                                roundEnd:function(){ 
                                    this.visible = false;
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    this.visible = pl.jiachuiNum === 1; 
                                },
                                initSceneData:function(){

                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl)
                                        return;
                                    var isShow = true;
                                    if(TableState.waitJiazhu == pl.mjState ||  TableState.roundFinish == pl.mjState  ){
                                        isShow = false;
                                    }

                                     // 重连检验
                                    this.visible = pl.jiachuiNum == 1 && isShow;
                                },
                                mjhand:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl) return;   
                                    this.visible = pl.jiachuiNum === 1;                            
                                }, 

                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        },
                        img_buChui:{
                            _visible: false, 
                            _event:{
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = true;  
                                    setJiaChuiTipsShow(this,ed);
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                initSceneData:function(){
                                    this.visible = false;
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl) return; 
                                    var tData = MjClient.data.sData.tData;  
                                    if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                        && tData.areaSelectMode.isJiaChui  ){
                                        this.visible = true;
                                    }  
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                mjhand:function(){  
                                    this.visible = false;                            
                                },  
                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        }
                    }
                },
                node_top : {
                    layout_head: {
                        img_chuizi:{
                            _run:function(){
                                this.visible = false
                            },
                            _event:{
                                roundEnd:function(){ 
                                    this.visible = false;
                                },
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = ed.jiachuiNum === 1; 
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    this.visible = pl.jiachuiNum === 1; 
                                },
                                initSceneData:function(){

                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl)
                                        return;
                                    var isShow = true;
                                    if(TableState.waitJiazhu == pl.mjState ||  TableState.roundFinish == pl.mjState  ){
                                        isShow = false;
                                    }

                                     // 重连检验
                                    this.visible = pl.jiachuiNum == 1 && isShow;
                                },
                                mjhand:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl) return;   
                                    this.visible = pl.jiachuiNum === 1;                            
                                }, 

                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        },
                        img_buChui:{
                            _visible: false, 
                            _event:{
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = true;  
                                    setJiaChuiTipsShow(this,ed);
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                initSceneData:function(){
                                    this.visible = false;
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl) return; 
                                    var tData = MjClient.data.sData.tData;  
                                    if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                        && tData.areaSelectMode.isJiaChui  ){
                                        this.visible = true;
                                    }  
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                mjhand:function(){  
                                    this.visible = false;                            
                                },  
                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        }
                    }
                },
                node_left : {
                    layout_head: {
                        img_chuizi:{
                            _run:function(){
                                this.visible = false
                            },
                            _event:{
                                roundEnd:function(){ 
                                    this.visible = false;
                                },
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = ed.jiachuiNum === 1; 
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    this.visible = pl.jiachuiNum === 1; 
                                },
                                initSceneData:function(){

                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl)
                                        return;
                                    var isShow = true;
                                    if(TableState.waitJiazhu == pl.mjState ||  TableState.roundFinish == pl.mjState  ){
                                        isShow = false;
                                    }

                                     // 重连检验
                                    this.visible = pl.jiachuiNum == 1 && isShow;
                                },
                                mjhand:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl) return;   
                                    this.visible = pl.jiachuiNum === 1;                            
                                }, 

                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        },
                        img_buChui:{
                            _visible: false, 
                            _event:{
                                MJJiazhu:function(ed){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(pl && pl.info.uid != ed.uid) 
                                        return;
                                    this.visible = true;  
                                    setJiaChuiTipsShow(this,ed);
                                },
                                // 连锤 检测是否已经加锤
                                checkJiaChui:function(){
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl || pl.jiachuiNum == -1) return;   
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                initSceneData:function(){
                                    this.visible = false;
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl) return; 
                                    var tData = MjClient.data.sData.tData;  
                                    if(pl.jiachuiNum != -1 && (pl.mjState == TableState.waitJiazhu || pl.mjState ==TableState.isReady) 
                                        && tData.areaSelectMode.isJiaChui  ){
                                        this.visible = true;
                                    }  
                                    setJiaChuiTipsShow(this,pl); 
                                },
                                mjhand:function(){  
                                    this.visible = false;                            
                                },  
                                closeJiaChuiUI:function(){
                                    this.visible = false; 
                                }
                            }
                        }
                    }
                },
                node_wait: {
                    checkBox_autoPut:{
                        _visible: false,
                        _run: function(){

                        },
                        showAutoPut: function(){
                            return;
                        }
                    }
                },
                // 吃牌后的提示
                img_chiTips: {
                    _run:function(){ 
                        this.setPosition(0,0);
                        setWgtLayout(this,[0.8, 0.8], [0.5, 0.55], [0, 0]); 
                        this.setOpacity(0); 
                        // this.setPosition(cc.p(MjClient.size.width / 2,MjClient.size.height *0.65));    
                    }, 
                    _event:{
                        showChiTips:function(){ 
                            this.setOpacity(0); 
                            var pl = getUIPlayer(0);
                            if(!pl)
                                return;
                            var tData = MjClient.data.sData.tData;  
                            if(!tData.areaSelectMode.isQingYiSeChi || pl.isShowChiTips === false)
                                return; 
                            // pl.isShowChiTips = false;
                            this.runAction(cc.fadeIn(0.5));
                        },
                        clearCardUI: function(eD) {
                            this.setOpacity(0); 
                        },
                        closeChiTips:function(){
                            this.runAction(cc.fadeOut(0.5));
                        }
                    } 
                },
                layout_jiachui:{
                    _run:function(){  
                        this.visible = false;
                        setWgtLayout(this,[200/1280, 0], [0.5, 0.45], [0, 0]);  
                    },
                    btn_bujiachui:{
                        _click:function(){
                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                cmd: "MJJiazhu",
                                uid: SelfUid(),
                                jiachuiNum: 0,
                            }); 

                            postEvent("closeJiaChuiView");

                            var pl = getUIPlayer(0);
                            if(!pl)
                                return;
                            pl.jiachuiNum = 0;
                        }
                    },
                    btn_jiachui:{
                        _click: function(btn){   
                             //todo.... 加注数量。。。itag
                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                cmd: "MJJiazhu",
                                uid: SelfUid(),
                                jiachuiNum: 1,
                            });
                            postEvent("closeJiaChuiView");

                            var pl = getUIPlayer(0);
                            if(!pl)
                                return;
                            pl.jiachuiNum = 1; 
                        }
                    },
                    _event:{
                        onlinePlayer:function(d){
                            var p = getUIPlayer(0);
                            if(!p)
                                return; 
                            var tData = MjClient.data.sData.tData;

                            if(tData.tState == TableState.waitJiazhu || tData.tState ==TableState.isReady || tData.tState == TableState.roundFinish){
                                postEvent("waitJiazhu");// 显示加锤按钮
                            } 

                            var tData = MjClient.data.sData.tData;
                            if(tData.areaSelectMode.isLianChui  && d.onLine){
                                postEvent("checkJiaChui");  // 显示是否已经加锤的图标
                            } 
                            
                        },
                        waitJiazhu:function(ed){    
                            var sData = MjClient.data.sData
                            var count = 0;
                            for(var uid in sData.players){
                                var p = sData.players[uid];
                                if(p.mjState == TableState.waitJiazhu || p.mjState ==TableState.isReady){
                                    count++;
                                }
                            }
                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer(0);
                            if(count != MjClient.MaxPlayerNum && !tData.areaSelectMode.isLianChui || !pl ){
                                return;
                            }
         
                            
                                // jiachuiNum  
                            if((tData.tState == TableState.waitJiazhu || TableState.isReady == tData.tState ||
                                tData.tState == TableState.roundFinish) && pl.jiachuiNum == -1){ 
                                this.visible = true;  
                            }   
                            if(tData.areaSelectMode.isLianChui){
                                postEvent("checkJiaChui"); 
                            }
                            
                        },
                        closeJiaChuiView:function(){
                            this.visible = false;
                        },
                        initSceneData : function(){ 

                            var sData = MjClient.data.sData
                            var count = 0;
                            for(var uid in sData.players){
                                var p = sData.players[uid];
                                if(p.mjState == TableState.waitJiazhu || p.mjState ==TableState.isReady){
                                    count++;
                                }
                            }
                            if(count != MjClient.MaxPlayerNum){
                                return;
                            }

                            var tData = MjClient.data.sData.tData;
                            var pl = getUIPlayer(0);
                            if(!pl)
                                return;
                                // jiachuiNum 
                            if((tData.tState == TableState.waitJiazhu || TableState.isReady == tData.tState ||
                                tData.tState == TableState.roundFinish) && pl.jiachuiNum == -1){  
                                this.visible = true;
                            }    
                        }
                    } 
                }
            };
            return jsBind;
        },

        ctor: function(){
            var jsonFile = this.jsonFile;
            this._super(majiang_panel_SYMJ, jsonFile); 
            return true;
        }  
    });

    /**
     *  是否可以自动摸打
     **/
    majiang_panel_SYMJ.prototype.isCanAutoPut = function(){
        return false;
    };


    /**
     * [createEndOnePanel 创建小结算界面]
     */
    majiang_panel_SYMJ.prototype.createEndOnePanel = function(){
        return new majiang_winGamePanel_SYMJ();
    };

    /**
     *  发送过的命令
     **/
    majiang_panel_SYMJ.prototype.sendPassToServer = function(){
        if (MjClient.rePlayVideo != -1) {
            return;
        }

        var tData = MjClient.data.sData.tData;
        var sendMsg = {
            cmd: "MJPass",
            eatFlag: this.getEatFlag(),
            cardNext: tData.cardNext
        };
        MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        postEvent("closeChiTips");
    };


    // /**
    //  * [createGameOverPanel 创建大结算界面]
    //  */
    // majiang_panel_SYMJ.prototype.createGameOverPanel = function(){
    //     return new majiang_gameOver();
    // };

    /**
     *  获得玩家可操作按钮
     **/
    majiang_panel_SYMJ.prototype.getPlayerEatNode = function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var player = sData.players[this.getSelfUid()];
        var eat = MjClient.playui.jsBind.node_eat;
        var nodeArr = [];
        this.gangCardArray = [];
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
                postEvent("showChiTips");
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


        // 抓鸟数
    majiang_panel_SYMJ.prototype.getIsZhongBird = function(cd, birdArr) {
        var dataNum = cd % 10;
        if(dataNum == 1 || dataNum == 5 || dataNum == 9 || cd > 30 ){ 
            return true;
        } 
        return false;  
    };
}());




























