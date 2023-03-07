var GameOverLayer_BaZhaDan = cc.Layer.extend({
    sprite:null,
    jsBind:{
        back:{
            share:{
                img_shine:{
                    _visible:false
                },
                img_txt:{
                    _visible:false
                },
                img_point:{
                    _visible:false
                },
                _event:{
                    captureScreen_OK:function(){
                        if (MjClient.endallui.capture_screen != true)
                            return;
                        MjClient.endallui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath+textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function()
                        {
                            this.setTouchEnabled(true);
                        }.bind(this))));
                    }
                }
            },
            siRen : {
                _run : function(){
                    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
                    this.visible =  (MjClient.MaxPlayerNum == 4 && !areaSelectMode.isDivideTeam);
                }
            },

            siRenTeam : {
                _run : function(){
                    var areaSelectMode = MjClient.data.sData.tData.areaSelectMode;
                    this.visible =  (MjClient.MaxPlayerNum == 4 && areaSelectMode.isDivideTeam);
                }
            },

            threeRen : {
                _run : function(){
                    this.visible =  MjClient.MaxPlayerNum <= 3;
                    if(this.visible){
                        
                    }
                }
            },

            jieSanIcon:{
                _run : function(){
                    this.visible = false;
                    if(MjClient.isDismiss){
                        this.visible = true;
                    }
                }
            }
        }
    },
    ctor:function () {
        this._super();
        var endallui = ccs.load("endAll_BaZhaDan.json");
        BindUiAndLogic(endallui.node,this.jsBind);
        this.addChild(endallui.node);
        this.uiNode = endallui.node;
        MjClient.endallui=this;
        
        var _block = endallui.node.getChildByName("block");
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
        /*
         changed by sking
         */
        var _back = endallui.node.getChildByName("back");
        setWgtLayout(_back,[1,1],[0.5,0.48],[0,0]);
        
        //分享
        var _share =  _back.getChildByName("share");
        var tData = MjClient.data.sData.tData;
        _share.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;
        
        //_share.x = 713.24;//屏蔽再来一局的时候，坐标要移动一下
        _share.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endallui.capture_screen = true;
                        _share.setTouchEnabled(false);
                    });
                    break;
                default :
                    break;
            }
        },this);
        
        // 如果是亲友圈的房间显示亲友圈图标及名称
        var image_title = _back.getChildByName("Image_title");
        var clubNode = _back.getChildByName("Image_club");
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && typeof(clubInfoTable.clubAvatar) != "undefined" && clubInfoTable.clubId && clubNode != null)
        {
            if (image_title)
                image_title.setVisible(false);

            var clubName = clubNode.getChildByName("Text_name");
            clubName.ignoreContentAdaptWithSize(true);
            clubName.setString("" + unescape(clubInfoTable.clubTitle));

            var _nameStr = unescape(clubInfoTable.ruleName);
            var _ruleName = clubName.clone();
            _ruleName.ignoreContentAdaptWithSize(true);
            _ruleName.setString(_nameStr);
            _ruleName.y = clubName.y + clubName.height/2 + _ruleName.height/2;
            _ruleName.x = clubName.x;
            clubNode.addChild(_ruleName);
            

            cc.loader.loadImg(clubInfoTable.clubAvatar ? clubInfoTable.clubAvatar : "png/default_headpic.png", {
                isCrossOrigin: true
            }, function(err, texture) {
                if (err || !texture || !sys.isObjectValid(clubNode))
                    return;

                var sp = new cc.Sprite(texture);
                if (!sp)
                    return;

                sp.setScale((clubNode.width - 8) / sp.width);
                sp.setPosition(cc.p(clubNode.width / 2, clubNode.height / 2));
                clubNode.addChild(sp);
            });
        }
        else if (clubNode != null)
        {
            clubNode.setVisible(false);
        }
        
        //信息 说明
        var _infoMation =  _back.getChildByName("infoMation");
        _infoMation.visible = true;
        var self = this;
        function _infoText(){
            var sData=MjClient.data.sData;
            var tData=sData.tData;
            var text = self.getGameInfoString();
            
            return text;
        }
        _infoMation.setString(_infoText());
        // _infoMation.ignoreContentAdaptWithSize(true);
        
        
        
        
        //解散信息 说明
        var _infoMation_1 =  _back.getChildByName("infoMation_1"); 
        if (_infoMation_1) { 
            _infoMation_1.setString("")
            _infoMation_1.visible = true;
            //描述结算  
            if (MjClient.isDismiss)
            {  
                var sData=MjClient.data.sData;
                var tData=sData.tData;

                var id = tData.firstDel;
                var pl = sData.players[id];
                var delStr = "";
                if(pl) {
                    var name  =  unescape(pl.info.nickname );
                    delStr = name + pl.mjdesc[0]; 
                } else {
                    delStr = tData.dissolveWay == -1? '系统停服自动解散房间':'会长或管理员解散房间';
                }  
                _infoMation_1.setString("" + delStr) ;
                _infoMation_1.setFontName("Arial");
                _infoMation_1.setFontSize(_infoMation_1.getFontSize());
            }
        }
        
        
        //时间
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString("");
        cc.log("MjClient.roundEndTime == " + MjClient.roundEndTime);
        
        if(MjClient.roundEndTime){
            _time.setString(MjClient.roundEndTime);
        }else {
            _time.setString("");
        }
        _time.ignoreContentAdaptWithSize(true);
        
        
        var nantongReplay = function() {
            var tData = MjClient.data.sData.tData;
            var para = tData.areaSelectMode;
            var inviteVipTable = MjClient.data.inviteVipTable;
            para.maxPlayer = tData.maxPlayer;
            para.gameType = tData.gameType;
            
            MjClient.showMsg("是否再来一局？", function () {
                if (inviteVipTable)
                {
                    MjClient.joinGame(inviteVipTable);
                }
                else
                {
                    MjClient.createRoom(para, tData.roundAll, tData.areaSelectMode.payWay, function (rtn)
                    {
                        if(rtn.result==0)
                        {
                            MjClient.rematchInfo(MjClient.data.vipTable, tData.uids);
                        }
                    });
                }
            }, function(){}, "1", "nantongReplay");
        };
        
        //close ,关闭
        var _close1 =  _back.getChildByName("close");
        this._close1 = _close1;
        _close1.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP && !tData.matchId)//南通APP再来一局退出到主界面再提示
                        nantongReplay();
                    
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable) {
                        if (!MjClient.FriendCard_main_ui)
                            MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                    }
                    
                    //MjClient.leaveGame();
                    //这里的leaveGame肯定会返回{"result":0,"msg":"alreadyLeave"}，所以不用等待返回后再继续，为了优化永州垃圾网络
                    //MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.gamenet.request("pkplayer.handler.LeaveGame",{},function(rtn){});
                    delete MjClient.data.sData;
                    delete MjClient.gameType;
                    postEvent("LeaveGame");
                    
                    
                    if(MjClient.endallui){
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }

                    if(MjClient.rePlayVideo != -1 && MjClient.replayui){
                        MjClient.replayui.replayEnd(); 
                    } 

                    

                    
                    break;
                default :
                    break;
            }
        },this);
        
        //返回大厅 
        var _returnBtn =  _back.getChildByName("tohome");
        this._returnBtn = _returnBtn;
        _returnBtn.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    
                    //MjClient.leaveGame();
                    //这里的leaveGame肯定会返回{"result":0,"msg":"alreadyLeave"}，所以不用等待返回后再继续，为了优化永州垃圾网络
                    //MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.gamenet.request("pkplayer.handler.LeaveGame",{},function(rtn){});
                    delete MjClient.data.sData;
                    delete MjClient.gameType;
                    this.removeFromParent();
                    postEvent("LeaveGame");
                    
                    if(MjClient.endallui){
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }
                    if(MjClient.rePlayVideo != -1 && MjClient.replayui){
                        MjClient.replayui.replayEnd(); 
                    }
                    break;
                default :
                    break;
            }
        },this);
        
        
        //再来一局
        var _btnReplay =  _back.getChildByName("btnReplay");
        var tData = MjClient.data.sData.tData;
        _btnReplay.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;
        
        _btnReplay.visible = false;  //屏蔽再来一局
        
        _btnReplay.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP)//南通APP再来一局退出到主界面再提示
                    {
                        nantongReplay();
                        MjClient.leaveGame();
                        if(MjClient.endallui){
                            MjClient.endallui.removeFromParent(true);
                            MjClient.endallui = null;
                        }
                        
                    }
                    else
                    {
                        if (MjClient.data.inviteVipTable)
                        {
                            MjClient.leaveGame(function()
                            {
                                MjClient.joinGame(MjClient.data.inviteVipTable);
                            });
                        }
                        else
                        {
                            MjClient.reCreateRoom();
                        }
                    }
                    break;
                default :
                    break;
            }
        },this);
        
        var self = this;
        if(tData.matchId){
            _close1.setVisible(false);
            // function delayExe()
            // {
            //   self.addChild(new roundEndLayer(),500);
            // }
            // this.runAction(cc.sequence(cc.DelayTime(3),cc.callFunc(delayExe)));
            var endTitle = _back.getChildByName("end_title");
            endTitle.loadTexture("winGame/BL_jieshu.png");
            
            var _btnReplay =  _back.getChildByName("roundEndText");
            _btnReplay.setVisible(true);
        }
        var textNum =  _back.getChildByName("Text_num");
        var text3 =  _back.getChildByName("Text_3");
        var text5 =  _back.getChildByName("Text_5");
        UIEventBind(null,this,"leftTable",function(data){
            //num.setString(self._data.condition - data.signUpCount);
            textNum.setString(data.leftTable);
            textNum.setVisible(true);
            text3.setVisible(true);
            text5.setVisible(true);
        })

        var tData = MjClient.data.sData.tData;
        var fhTxt = _back.getChildByName("fhTxt");
        fhTxt.setString(tData.tableid);
        
        if(MjClient.MaxPlayerNum == 4 && tData.areaSelectMode.isDivideTeam){
            this.setUsersInfoFour();
        }else{
            this.setUsersInfoThreeOrTwo();
        }

        //复制战绩
        addCopyBtnToGameOverLayer(endallui.node);

        return true;
    },
    onEnter:function()
    {
        this._super();
        if (MjClient.homeui && MjClient.systemConfig.rankEnable == "true")
        {
            MjClient.homeui.gameRankLayer();
        }
    },

    getGameInfoString : function(param)
    {
        var tData = MjClient.data.sData.tData;
        var str = "";

        if (param != "roundInfo"){
            str += ["","","二","三","四"][MjClient.MaxPlayerNum] + "人玩,";
        }
        str += tData.deckNum + "副牌,";
        str += tData.areaSelectMode.isNo34 ? "去掉3、4," : "";
        str += tData.areaSelectMode.scoreLine + "结算,";
        str += tData.areaSelectMode.hasJoker ? "带双王," : "";
        str += tData.areaSelectMode.addJoker ? "加双王," : "";
        str += tData.areaSelectMode.noJoker ? "不要王," : "";
        str += tData.areaSelectMode.hasWings ? "可带牌," : "";
        if(tData.areaSelectMode.isRandomTeam){
            str += "随机分组,";
        }else if(tData.areaSelectMode.isDivideTeam){
            str += "分组,";
        }
        if(tData.areaSelectMode.shunType !== undefined){
            str += tData.areaSelectMode.shunType == 0 ? "顺子到2," : "顺子到小王,";
        }
        if(tData.areaSelectMode.isDivideTeam){
            str += tData.areaSelectMode.jieFengType == 1 ? "下家接风," : "队友接风,";
        }
        if (tData.areaSelectMode.isAnCards) {
            str += "暗8张底牌,";
        }
        if (tData.areaSelectMode.jieSuanDiFen){
            str += "积分底分" + tData.areaSelectMode.jieSuanDiFen;
        }

        if (str.charAt(str.length - 1) == ",")
            str = str.substring(0, str.length - 1);
        return str;
    },

    replaySet : function(){
        this._close1.addTouchEventListener(function(sender,type){
            if (type == ccui.Widget.TOUCH_ENDED)
                MjClient.goOnReplay();
        }, this);
        
        // var btn = new ui.Button("ui/zhanji/huikan_n.png", "ui/zhanji/huikan_s.png", "ui/zhanji/huikan_s.png", ccui.Widget.LOCAL_TEXTURE);
        // btn.addClickEvent(function(){
        //     MjClient.goOnReplay();
        // }, this);
        // btn.x = this._returnBtn.x;
        // btn.y = this._returnBtn.y;
        // // btn.scale = 1.2;
        // this._returnBtn.parent.addChild(btn);
        // this._returnBtn.visible = false;

        // this._close1.addTouchEventListener(function(sender,Type){
        //     if(MjClient.endallui){
        //         MjClient.endallui.removeFromParent(true);
        //         MjClient.endallui = null;
        //     }

        //     if(MjClient.rePlayVideo >= 0 && MjClient.replayui){
        //         MjClient.replayui.replayEnd();
        //     }
        // },this); 
    },

    setUsersInfoThreeOrTwo : function(){
        var tData = MjClient.data.sData.tData;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;
        var index = 0;
        var threeRen = this.uiNode.getChildByName("back").getChildByName("threeRen");
        var gap = 5;
        if(MjClient.MaxPlayerNum == 4){
            threeRen = this.uiNode.getChildByName("back").getChildByName("siRen");
            gap = -5;
        }
        var copyItem = threeRen.getChildByName("item");
        for(var n in players){
            var pl = players[n];
            var item = copyItem.clone();
            copyItem.getParent().addChild(item);

            item.x = copyItem.x;
            item.y = copyItem.y - (copyItem.height + gap) * index;

            this.setItemInfo_three(item, pl);
            index += 1;

            COMMON_UI.addGameOverNotSameClubUI(item,pl);
        }
        copyItem.visible = false;
    },

    setItemInfo_three : function(item, pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;

        var MaxWinAll=0;
        var MaxlosePlayer = null;
        var MaxWinPlayer = null;
        var MaxloseAll = 999999999;
        
        for (var uid in players) {
            var team = players[uid];
            var pi = players[uid];
            if(pi){

                if (MaxWinAll < pi.windif) {
                    MaxWinAll = pi.windif;
                    MaxWinPlayer = uid;

                }else if (MaxWinAll == pi.windif) {
                    if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                        MaxWinAll = pi.windif;
                        MaxWinPlayer = uid;
                    }
                }
                if (pi.windif < MaxloseAll) {
                    MaxloseAll = pi.windif;
                    MaxlosePlayer = uid;
                }else if (pi.windif == MaxloseAll) {
                    if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                        MaxloseAll = pi.windif;
                        MaxlosePlayer = uid;
                    }
                }
            }
            
        }

        addWxHeadToEndUI_daTongZi(item.getChildByName("head"), pl);

        setDismissTypeImg(pl,item.getChildByName("head"),1.54,0.5,"zheng"); 

        var nameTxt = item.getChildByName("name");
        nameTxt.ignoreContentAdaptWithSize(true);
        nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
        nameTxt.setFontName("Arial");
        nameTxt.setFontSize(nameTxt.getFontSize());

        var jushu = item.getChildByName("jushu");
        jushu.setString((tData.roundNum_play ? tData.roundNum_play : 0) + "局");

        //抓分
        var zhuaFen = item.getChildByName("zhuaFen");
        zhuaFen.setString(pl.winall - pl.rankall);
        //奖罚分
        var jiangFaFen = item.getChildByName("jiangFaFen");
        jiangFaFen.setString(pl.rankall);
        //喜分
        var xiFen = item.getChildByName("xiFen");
        xiFen.setString(pl.score_spclType);
        //总分
        var zongFen = item.getChildByName("zongFen");
        zongFen.setString(pl.winall + pl.score_spclType);

        //胜负分
        var sffTxt = item.getChildByName("sffTxt");
        sffTxt.ignoreContentAdaptWithSize(true);
        // sffTxt.setString(pl.windif > 0 ? ("+" + pl.windif) :  pl.windif);
        if(pl.windif < 0){
            sffTxt.setProperty(pl.windif, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            sffTxt.setProperty("+" + pl.windif, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }
        AddFangKaIcon(sData, item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 60));
    },
    //4人分组的 
    setUsersInfoFour : function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;
        var teams = sData.teams;
        var threeRen = this.uiNode.getChildByName("back").getChildByName("siRenTeam");
        var winTeam = null;
        var winTid = "";

        for(var tid in teams){
            var team = teams[tid]
            var item = threeRen.getChildByName("item" + tid);

            var teamInfo = teams[tid];
            var uids = teamInfo.uids;
            for(var i = 0; i < uids.length; i++){
                var pl = players[uids[i]];
                addWxHeadToEndUI_daTongZi(item.getChildByName("head" + i), pl);

                var nameTxt = item.getChildByName("name" + i);
                nameTxt.ignoreContentAdaptWithSize(true);
                nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));  
                nameTxt.setFontName("Arial");
                nameTxt.setFontSize(nameTxt.getFontSize());

                setDismissTypeImg(pl,item.getChildByName("head" + i),0.5,1.2,"zheng");
      
            }

            this.setItemInfo_four(item, teamInfo);

            if(winTeam == null){
                winTeam = team;
                winTid = tid;
            }else{
                if(winTeam.windif < team.windif){
                    winTeam = team;
                    winTid = tid;
                }
            }
        }
        // //胜负分
        // var fenshu = duiWuYing.getChildByName("fenshu");
        // fenshu.ignoreContentAdaptWithSize(true);
        // fenshu.setString(pl.windif > 0 ? ("+" + winTeam.windif) :  winTeam.windif);
    },
    //4人分组的 
    setItemInfo_four : function(item, pl){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var deckNum = tData.deckNum;
        var teams = sData.teams;

        var MaxWinAll=0;
        var MaxlosePlayer = null;
        var MaxWinPlayer = null;
        var MaxloseAll = 999999999;


        for (var tid in teams) {
            var pi = teams[tid];
            if(pi){

                if (MaxWinAll < pi.windif) {
                    MaxWinAll = pi.windif;
                    MaxWinPlayer = teams[tid];
                }
                if (pi.windif < MaxloseAll) {
                    MaxloseAll = pi.windif;
                    MaxlosePlayer = teams[tid];
                }
            }
            
        }

        var jushu = item.getChildByName("jushu");
        jushu.setString((tData.roundNum_play ? tData.roundNum_play : 0) + "局");

        var stats_spclType = pl.stats_spclType;
        var allScore = 0;   //总分

        //抓分
        var zhuaFen = item.getChildByName("zhuaFen");
        zhuaFen.setString(pl.winall - pl.rankall);
        //奖罚分
        var jiangFaFen = item.getChildByName("jiangFaFen");
        jiangFaFen.setString(pl.rankall);
        //喜分
        var xiFen = item.getChildByName("xiFen");
        xiFen.setString(pl.score_spclType);
        //总分
        var zongFen = item.getChildByName("zongFen");
        zongFen.setString(pl.winall + pl.score_spclType);

        //胜负分
        var sffTxt = item.getChildByName("sffTxt");
        sffTxt.ignoreContentAdaptWithSize(true);
        var all = pl.windif;
        if(all < 0){
            sffTxt.setProperty(all, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            sffTxt.setProperty("+" + all, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }
        AddFangKaIconTeam(item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 80));
    },
});