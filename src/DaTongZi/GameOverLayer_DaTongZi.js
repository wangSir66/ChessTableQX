var GameOverLayer_daTongZi = cc.Layer.extend({
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
                    var tData = MjClient.data.sData.tData;
                    this.visible =  MjClient.MaxPlayerNum == 4 && !tData.areaSelectMode.isSiXi;
                    if(this.visible){
                        
                    }
                }
            },

            threeRen : {
                _run : function(){
                    var tData = MjClient.data.sData.tData;
                    this.visible =  MjClient.MaxPlayerNum <= 3 && !tData.areaSelectMode.isSiXi;
                    if(this.visible){
                        
                    }
                }
            },
            siRenXi : {
                _run : function(){
                    var tData = MjClient.data.sData.tData;
                    this.visible =  MjClient.MaxPlayerNum == 4 && tData.areaSelectMode.isSiXi;
                }
            },

            threeRenXi : {
                _run : function(){
                    var tData = MjClient.data.sData.tData;
                    this.visible =  MjClient.MaxPlayerNum <= 3 && tData.areaSelectMode.isSiXi;
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
        var endallui = ccs.load("endAll_DaTongZi.json");
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
        this._share = _share;
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
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fanxiang",  {uid:SelfUid(),gameType:MjClient.gameType});
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
                    var name  =  unescape(pl.info.nickname);
                    delStr = name + pl.mjdesc[0]; 
                } else {
                    // 系统、会长或管理员解散房间
                    pl = getUIPlayer(0);
                    if (pl)
                        delStr = pl.mjdesc[0];
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
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zailaiyiju", {uid:SelfUid(),gameType:para.gameType});
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
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Tuichu", {uid:SelfUid(),gameType:MjClient.gameType});
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP && !tData.matchId)//南通APP再来一局退出到主界面再提示
                        nantongReplay();

                    var tData = MjClient.data.sData.tData;
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable && !(MjClient.rePlayVideo >= 0 && MjClient.replayui)) {
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

                    var tData = MjClient.data.sData.tData;
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable && !(MjClient.rePlayVideo >= 0 && MjClient.replayui)) {
                        if (!MjClient.FriendCard_main_ui)
                            MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                    } 

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
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zailaiyiju", {uid:SelfUid(),gameType:MjClient.gameType});
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

        var zjjlTxt = _back.getChildByName("zjjlTxt");
        zjjlTxt.setString(tData.areaSelectMode.lastRoundScore);
        
        if(MjClient.MaxPlayerNum == 4){
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

    getGameInfoString : function(param)
    {
        var tData = MjClient.data.sData.tData;
        var str = "";

        if (param != "roundInfo"){
            str += ["","","二","三","四"][MjClient.MaxPlayerNum] + "人玩,";
        }
        if(tData.areaSelectMode.isSiXi){
            str += "天天四喜,";
        }else{
            str += tData.deckNum + "副牌,";
        }
        if(tData.areaSelectMode.scoreLine == 1) {
            str += tData.areaSelectMode.scoreLine + "局结算,";
        }else {
            str += tData.areaSelectMode.scoreLine + "分结算,";
        }
        str += tData.areaSelectMode.hasWings ? "可带牌," : "";
        str += "终局奖励" + tData.areaSelectMode.lastRoundScore + "分,";
        
        if (tData.areaSelectMode.jieSuanDiFen){
            str += "积分底分" + tData.areaSelectMode.jieSuanDiFen;
        }
        if (str.charAt(str.length - 1) == ",")
            str = str.substring(0, str.length - 1);
        return str;
    },

    setUsersInfoThreeOrTwo : function(){
        var tData = MjClient.data.sData.tData;
        var isSiXi = tData.areaSelectMode.isSiXi;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;
        var index = 0;
        var threeRen = this.uiNode.getChildByName("back").getChildByName("threeRen");
        if(isSiXi){
            threeRen = this.uiNode.getChildByName("back").getChildByName("threeRenXi");
        }
        var copyItem = threeRen.getChildByName("item");
        for(var n in players){
            var pl = players[n];
            var item = copyItem.clone();
            copyItem.getParent().addChild(item);

            if(!isSiXi){
                this.setItemTxtPos(item, 3, deckNum);
            }
            
            item.x = copyItem.x;
            item.y = copyItem.y - (copyItem.height + 5) * index;

            if(isSiXi){
                this.setItemInfoXi_three(item, pl);
            }else{
               this.setItemInfo_three(item, pl); 
            }
            COMMON_UI.addGameOverNotSameClubUI(item,pl);
            index += 1;
        }
        copyItem.visible = false;
    },

    setItemInfo_three : function(item, pl){
        var sData = MjClient.data.sData;
        var tData = MjClient.data.sData.tData;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;

        var MaxWinAll=0;
        var MaxlosePlayer = null;
        var MaxWinPlayer = null;
        var MaxloseAll = 999999999;

        for(var uid in players){
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

        setDismissTypeImg(pl,item.getChildByName("head"),1.1,0.5,"zheng"); 

        var nameTxt = item.getChildByName("name");
        nameTxt.ignoreContentAdaptWithSize(true);
        nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
        nameTxt.setFontName("Arial");
        nameTxt.setFontSize(nameTxt.getFontSize());

        var jushu = item.getChildByName("jushu");
        jushu.setString((tData.roundNum_play ? tData.roundNum_play : 0) + "局");

        // var SPCL_TYPE = {
        //     noType: 0,      // 非特殊牌型
        //     tongZiK: 1,     // K筒子
        //     tongZiA: 2,     // A筒子
        //     tongZi2: 3,     // 2筒子
        //     tongZiJoker: 4, // 王筒子
        //     diZha: 5,       // 地炸
        //     xiSmallJoker: 6,// 小王喜
        //     xiBigJoker: 7,  // 大王喜
        //     xiOther: 8      // 除大小王外 喜
        // }
        var stats_spclType = pl.stats_spclType;
        var allScore = 0;   //总分

        if(deckNum == 3){
            //3副牌时显示：K筒子 A筒子 2筒子 王筒子 地炸分
            this.setTitleIcon(3, deckNum);

            var tzNames = ["","ktz","Atz","ztz","wtz"];
            for(var j = 1; j <= 4; j++){
                var score = MjClient.majiang.getSpclTypeScore(j);
                var tzCount = parseInt(stats_spclType[j]);//筒子个数

                var countTxt = item.getChildByName(tzNames[j] + "Num");
                countTxt.ignoreContentAdaptWithSize(true);
                countTxt.setString(tzCount);
                var scoreTxt = item.getChildByName(tzNames[j] + "Fen");
                scoreTxt.ignoreContentAdaptWithSize(true);
                scoreTxt.setString(score * tzCount);
            }
            var scoreDz = 0; //地炸分
            var dZCount = 0; //个数
            var score = MjClient.majiang.getSpclTypeScore(5);
            dZCount = parseInt(stats_spclType[5]); 
            scoreDz += score * dZCount;
            var dzFen = item.getChildByName("xiFen");
            dzFen.setString(scoreDz + "分");
        }else if(deckNum == 4){
            //四副牌时显示：喜 小王喜 大王喜  （null）   喜分
            this.setTitleIcon(3, deckNum);

            var tzNames = ["","Atz","ztz","ktz","wtz"];
            var scoreXi = 0; //喜分
            var index = 1;
            for(var j = 6; j <= 8; j++){
                var score = MjClient.majiang.getSpclTypeScore(j);
                var count = parseInt(stats_spclType[j]);//喜个数
                scoreXi += score * count;

                var countTxt = item.getChildByName(tzNames[index] + "Num");
                countTxt.ignoreContentAdaptWithSize(true);
                countTxt.setString(count);
                var scoreTxt = item.getChildByName(tzNames[index] + "Fen");
                scoreTxt.ignoreContentAdaptWithSize(true);
                scoreTxt.setString(score * count);

                index += 1;
            }

            var dzFen = item.getChildByName("xiFen");
            dzFen.setString(scoreXi + "分");
        } 

        //牌面分
        var paiMianFen = item.getChildByName("paiMianFen");
        paiMianFen.setString(pl.winall);

        //总分
        var zfTxt = item.getChildByName("zfTxt");
        zfTxt.ignoreContentAdaptWithSize(true);
        var all = pl.winall + pl.score_spclType;
        cc.log("pl.winall + pl.score_spclType:", pl.winall, pl.score_spclType);
        // zfTxt.setString(all > 0 ? ("+" + all) : all);
        if(all < 0){
            zfTxt.setProperty(all, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            zfTxt.setProperty("+" + all, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //终局奖励
        var zjjlTxt = item.getChildByName("zjjlTxt");
        zjjlTxt.ignoreContentAdaptWithSize(true);
        zjjlTxt.setString(tData.areaSelectMode.lastRoundScore);
        zjjlTxt.visible = false;
        if(pl.score_lastRound > 0){
            zjjlTxt.visible = true;
        }

        //胜负分
        var sffTxt = item.getChildByName("sffTxt");
        sffTxt.ignoreContentAdaptWithSize(true);
        // sffTxt.setString(pl.windif > 0 ? ("+" + pl.windif) :  pl.windif);
        if(pl.windif < 0){
            sffTxt.setProperty(pl.windif, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            sffTxt.setProperty("+" + pl.windif, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //评级
        var pingjiTxt = item.getChildByName("pingjiTxt");
        if(pl.windif >= 0){
            pingjiTxt.setString("(正" + Math.abs(Math.floor(pl.windif / 100)) + "级)");
        }else{
            pingjiTxt.setString("(负" + Math.floor(Math.abs(pl.windif) / 100) + "级)");
        }
        AddFangKaIcon(sData, item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0,50));
    },

    setItemInfoXi_three : function(item, pl){
        var tData = MjClient.data.sData.tData;
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

        setDismissTypeImg(pl,item.getChildByName("head"),1.1,0.5,"zheng"); 

        var nameTxt = item.getChildByName("name");
        nameTxt.ignoreContentAdaptWithSize(true);
        nameTxt.setString(getNewName_new(unescape(pl.info.nickname), 4));
        nameTxt.setFontName("Arial");
        nameTxt.setFontSize(nameTxt.getFontSize());

        var jushu = item.getChildByName("jushu");
        jushu.setString((tData.roundNum_play ? tData.roundNum_play : 0) + "局");

        // var SPCL_TYPE = {
        //     noType: 0,      // 非特殊牌型
        //     tongZiK: 1,     // K筒子
        //     tongZiA: 2,     // A筒子
        //     tongZi2: 3,     // 2筒子
        //     tongZiJoker: 4, // 王筒子
        //     diZha: 5,       // 地炸
        //     xiSmallJoker: 6,// 小王喜
        //     xiBigJoker: 7,  // 大王喜
        //     xiOther: 8      // 除大小王外 喜
            // xiSmall: 9,     // 5-Q喜
            // xiK: 10,        // K喜 
            // xiA: 11,        // A喜
            // xi2: 12,        // 2喜
        // }
        var stats_spclType = pl.stats_spclType;
        var allScore = 0;   //总分

        var spclObj = {
            1:{tName:"ktzFen", cnName:"K筒"},
            2:{tName:"AtzFen", cnName:"A筒"},
            3:{tName:"ztzFen", cnName:"2筒"},
            9:{tName:"Q5", cnName:"5-Q喜"},
            10:{tName:"kxFen", cnName:"K喜"},
            11:{tName:"AxFen", cnName:"A喜"},
            12:{tName:"zxFen", cnName:"2喜"}
        };

        var txFen = 0; //喜分
        for(var j = 1; j <= 12; j++){
            if(!spclObj[j]){
                continue;
            }

            var score = MjClient.majiang.getSpclTypeScore(j);
            var count = parseInt(stats_spclType[j]);//喜个数
            txFen += score * count;

            var tName = spclObj[j]["tName"];
            var cnName = spclObj[j]["cnName"];
            if(j == 9){
                var countTxt = item.getChildByName(tName + "Num");
                if(countTxt){
                    countTxt.ignoreContentAdaptWithSize(true);
                    countTxt.setString(count);
                    var scoreTxt = item.getChildByName(tName + "Fen");
                    scoreTxt.ignoreContentAdaptWithSize(true);
                    scoreTxt.setString(score * count + "分");
                }
            }else{
                var scoreTxt = item.getChildByName(tName);
                scoreTxt.ignoreContentAdaptWithSize(true);
                scoreTxt.setString(cnName + score + "x" + count); 
            }
            
        }

        var TongXiFen = item.getChildByName("TongXiFen");
        TongXiFen.setString(txFen + "分");

        //牌面分
        var paiMianFen = item.getChildByName("paiMianFen");
        paiMianFen.setString(pl.winall);

        //总分
        var zfTxt = item.getChildByName("zfTxt");
        zfTxt.ignoreContentAdaptWithSize(true);
        var all = pl.winall + pl.score_spclType;
        cc.log("pl.winall + pl.score_spclType:", pl.winall, pl.score_spclType);
        // zfTxt.setString(all > 0 ? ("+" + all) : all);
        if(all < 0){
            zfTxt.setProperty(all, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            zfTxt.setProperty("+" + all, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //终局奖励
        var zjjlTxt = item.getChildByName("zjjlTxt");
        zjjlTxt.ignoreContentAdaptWithSize(true);
        zjjlTxt.setString(tData.areaSelectMode.lastRoundScore);
        zjjlTxt.visible = false;
        if(pl.score_lastRound > 0){
            zjjlTxt.visible = true;
        }

        //胜负分
        var sffTxt = item.getChildByName("sffTxt");
        sffTxt.ignoreContentAdaptWithSize(true);
        // sffTxt.setString(pl.windif > 0 ? ("+" + pl.windif) :  pl.windif);
        if(pl.windif < 0){
            sffTxt.setProperty(pl.windif, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            sffTxt.setProperty("+" + pl.windif, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //评级
        var pingjiTxt = item.getChildByName("pingjiTxt");
        if(pl.windif >= 0){
            pingjiTxt.setString("(正" + Math.abs(Math.floor(pl.windif / 100)) + "级)");
        }else{
            pingjiTxt.setString("(负" + Math.floor(Math.abs(pl.windif) / 100) + "级)");
        }
        AddFangKaIcon(MjClient.data.sData, item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 50));
    },

    setItemTxtPos : function(item, playerNum, deckNum){
        if(playerNum <= 3){
            var AtzNum = item.getChildByName("AtzNum");
            var AtzFen = item.getChildByName("AtzFen");

            var ztzNum = item.getChildByName("ztzNum");
            var ztzFen = item.getChildByName("ztzFen");

            var wtzNum = item.getChildByName("wtzNum");
            wtzNum.visible = false;
            var wtzFen = item.getChildByName("wtzFen");
            wtzFen.visible = false;

            if(deckNum == 3){
                ztzNum.x = 431.81;
                ztzFen.x = 431.81;

                AtzNum.x = 341.48;
                AtzFen.x = 341.19;

                var hasWTZ = MjClient.data.sData.tData.areaSelectMode.haveKingTz;//是否有王筒子
                if(!hasWTZ){
                    ztzNum.x = 515.81;
                    ztzFen.x = 515.81;

                    AtzNum.x = 390.49;
                    AtzFen.x = 389.19;
                }else{
                    wtzNum.visible = true;
                    wtzFen.visible = true;
                }

            }else if(deckNum == 4){
                ztzNum.x = 515.81;
                ztzFen.x = 515.81;

                AtzNum.x = 390.49;
                AtzFen.x = 389.19;
            }


        }else if(playerNum == 4){

        }
    },

    setTitleIcon : function(playerNum, deckNum){
        if(playerNum <= 3){
            var threeRen = this.uiNode.getChildByName("back").getChildByName("threeRen");
            var Ktz = threeRen.getChildByName("title_Ktz");//k筒子
            Ktz.ignoreContentAdaptWithSize(true);
            var Atz = threeRen.getChildByName("title_Atz");//A筒子
            Atz.ignoreContentAdaptWithSize(true);
            var ertz = threeRen.getChildByName("title_2tz");//2筒子
            ertz.ignoreContentAdaptWithSize(true);
            var wtz = threeRen.getChildByName("title_wtz");//王筒子
            wtz.ignoreContentAdaptWithSize(true);
            var dzf = threeRen.getChildByName("title_dzf");//地炸分
            dzf.ignoreContentAdaptWithSize(true);

            if(deckNum == 3){
                wtz.visible = true;
                wtz.x = 586.35;
                ertz.x = 485.96;
                Atz.x = 393.33;

                Ktz.loadTexture("daTongZi/gameOver/113TongZi.png");
                Atz.loadTexture("daTongZi/gameOver/114TongZi.png");
                ertz.loadTexture("daTongZi/gameOver/115TongZi.png");
                wtz.loadTexture("daTongZi/gameOver/wangtongzi.png");
                dzf.loadTexture("daTongZi/gameOver/dizhafen.png");
                var hasWTZ = MjClient.data.sData.tData.areaSelectMode.haveKingTz;//是否有王筒子
                if(!hasWTZ){
                    wtz.visible = false;
                    ertz.x = 571.96;
                    Atz.x = 451.32;
                }

            }else if(deckNum == 4){
                wtz.visible = false;
                ertz.x = 571.96;
                Atz.x = 451.32;
                Ktz.loadTexture("daTongZi/gameOver/xi.png");
                Atz.loadTexture("daTongZi/gameOver/xiaowangxi.png");
                ertz.loadTexture("daTongZi/gameOver/dawangxi.png");
                dzf.loadTexture("daTongZi/gameOver/xifen.png");
            }


        }else if(playerNum == 4){
            var threeRen = this.uiNode.getChildByName("back").getChildByName("siRen");
            var Ktz = threeRen.getChildByName("title_Ktz");//k筒子
            Ktz.ignoreContentAdaptWithSize(true);
            var Atz = threeRen.getChildByName("title_Atz");//A筒子
            Atz.ignoreContentAdaptWithSize(true);
            var ertz = threeRen.getChildByName("title_2tz");//2筒子
            ertz.ignoreContentAdaptWithSize(true);
            var dzf = threeRen.getChildByName("title_dzf");//地炸分
            dzf.ignoreContentAdaptWithSize(true);

            if(deckNum == 3){
                Ktz.loadTexture("daTongZi/gameOver/113TongZi.png");
                Atz.loadTexture("daTongZi/gameOver/114TongZi.png");
                ertz.loadTexture("daTongZi/gameOver/115TongZi.png");
                dzf.loadTexture("daTongZi/gameOver/dizhafen.png");

            }else if(deckNum == 4){
                Ktz.loadTexture("daTongZi/gameOver/xi.png");
                Atz.loadTexture("daTongZi/gameOver/xiaowangxi.png");
                ertz.loadTexture("daTongZi/gameOver/dawangxi.png");
                dzf.loadTexture("daTongZi/gameOver/xifen.png");
            }
        }
    }, 

    setUsersInfoFour : function(){
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var deckNum = tData.deckNum;
        var players = MjClient.data.sData.players;
        var teams = sData.teams;
        var isSiXi = tData.areaSelectMode.isSiXi;
        var threeRen = this.uiNode.getChildByName("back").getChildByName("siRen");
        if(isSiXi){
            threeRen = this.uiNode.getChildByName("back").getChildByName("siRenXi");
        }
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

            if(isSiXi){
                this.setItemInfoXi_four(item, teamInfo);
            }else{
                this.setItemInfo_four(item, teamInfo);
            }

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

        //哪对赢
        var duiWuYing = threeRen.getChildByName("duiWuYing");
        duiWuYing.setString(winTid + "组总赢分:");
        //胜负分
        var fenshu = duiWuYing.getChildByName("fenshu");
        fenshu.ignoreContentAdaptWithSize(true);
        fenshu.setString(pl.windif > 0 ? ("+" + winTeam.windif) :  winTeam.windif);

        //评级
        var pingjiTxt = duiWuYing.getChildByName("pingjiTxt");
        if(winTeam.windif >= 0){
            pingjiTxt.setString("(正" + Math.abs(Math.floor(winTeam.windif / 100)) + "级)");
        }else{
            pingjiTxt.setString("(负" + Math.floor(Math.abs(winTeam.windif) / 100) + "级)");
        }
    },

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

        // var SPCL_TYPE = {
        //     noType: 0,      // 非特殊牌型
        //     tongZiK: 1,     // K筒子
        //     tongZiA: 2,     // A筒子
        //     tongZi2: 3,     // 2筒子
        //     tongZiJoker: 4, // 王筒子
        //     diZha: 5,       // 地炸
        //     xiSmallJoker: 6,// 小王喜 Atz
        //     xiBigJoker: 7,  // 大王喜  ztz
        //     xiOther: 8      // 除大小王外 喜 ktz
        // }
        var stats_spclType = pl.stats_spclType;
        var allScore = 0;   //总分

        if(deckNum == 3){
            //3副牌时显示：K筒子 A筒子 2筒子 王筒子 地炸分
            this.setTitleIcon(4, deckNum);

            var tzNames = ["","ktz","Atz","ztz","wtz"];
            for(var j = 1; j <= 4; j++){
                var score = MjClient.majiang.getSpclTypeScore(j);
                var tzCount = parseInt(stats_spclType[j]);//筒子个数

                var countTxt = item.getChildByName(tzNames[j] + "Num");
                if(countTxt){
                    countTxt.ignoreContentAdaptWithSize(true);
                    countTxt.setString(tzCount);
                    var scoreTxt = item.getChildByName(tzNames[j] + "Fen");
                    scoreTxt.ignoreContentAdaptWithSize(true);
                    scoreTxt.setString(score * tzCount);
                }
            }
            var scoreDz = 0; //地炸分
            var dZCount = 0; //个数
            var score = MjClient.majiang.getSpclTypeScore(5);
            dZCount = parseInt(stats_spclType[5]); 
            scoreDz += score * dZCount;
            var dzFen = item.getChildByName("xiFen");
            dzFen.setString(scoreDz + "分");
        }else if(deckNum == 4){
            //四副牌时显示：喜 小王喜 大王喜  （null）   喜分
            this.setTitleIcon(4, deckNum);

            var tzNames = ["","Atz","ztz","ktz","wtz"];
            var scoreXi = 0; //喜分
            var index = 1;
            for(var j = 6; j <= 8; j++){
                var score = MjClient.majiang.getSpclTypeScore(j);
                var count = parseInt(stats_spclType[j]);//喜个数
                scoreXi += score * count;

                var countTxt = item.getChildByName(tzNames[index] + "Num");
                if(countTxt){
                    countTxt.ignoreContentAdaptWithSize(true);
                    countTxt.setString(count);
                    var scoreTxt = item.getChildByName(tzNames[index] + "Fen");
                    scoreTxt.ignoreContentAdaptWithSize(true);
                    scoreTxt.setString(score * count);
                }

                index += 1;
            }

            var dzFen = item.getChildByName("xiFen");
            dzFen.setString(scoreXi + "分");
        } 

        //牌面分
        var paiMianFen = item.getChildByName("paiMianFen");
        paiMianFen.setString(pl.winall);

        //总分
        var zfTxt = item.getChildByName("zfTxt");
        zfTxt.ignoreContentAdaptWithSize(true);
        var all = pl.winall + pl.score_spclType;
        // zfTxt.setString(all > 0 ? ("+" + all) : all);
        if(all < 0){
            zfTxt.setProperty(all, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            zfTxt.setProperty("+" + all, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //终局奖励
        var zjjlTxt = item.getChildByName("zjjlTxt");
        zjjlTxt.ignoreContentAdaptWithSize(true);
        zjjlTxt.setString(tData.areaSelectMode.lastRoundScore);
        zjjlTxt.visible = false;
        if(pl.score_lastRound > 0){
            zjjlTxt.visible = true;
        }

        AddFangKaIconTeam(item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 80));

    },

    setItemInfoXi_four : function(item, pl){
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

        // var SPCL_TYPE = {
        //     noType: 0,      // 非特殊牌型
        //     tongZiK: 1,     // K筒子
        //     tongZiA: 2,     // A筒子
        //     tongZi2: 3,     // 2筒子
        //     tongZiJoker: 4, // 王筒子
        //     diZha: 5,       // 地炸
        //     xiSmallJoker: 6,// 小王喜 Atz
        //     xiBigJoker: 7,  // 大王喜  ztz
        //     xiOther: 8      // 除大小王外 喜 ktz
        //     xiSmall: 9,     // 5-Q喜
        //     xiK: 10,        // K喜 
        //     xiA: 11,        // A喜
        //     xi2: 12,        // 2喜
        // }
        var stats_spclType = pl.stats_spclType;
        var allScore = 0;   //总分

        var spclObj = {
            1:{tName:"ktzFen", cnName:"K筒"},
            2:{tName:"AtzFen", cnName:"A筒"},
            3:{tName:"ztzFen", cnName:"2筒"},
            9:{tName:"Q5", cnName:"5-Q喜"},
            10:{tName:"kxFen", cnName:"K喜"},
            11:{tName:"AxFen", cnName:"A喜"},
            12:{tName:"zxFen", cnName:"2喜"}
        };

        var txFen = 0; //喜分
        for(var j = 1; j <= 12; j++){
            if(!spclObj[j]){
                continue;
            }

            var score = MjClient.majiang.getSpclTypeScore(j);
            var count = parseInt(stats_spclType[j]);//喜个数
            txFen += score * count;

            var tName = spclObj[j]["tName"];
            var cnName = spclObj[j]["cnName"];
            if(j == 9){
                var countTxt = item.getChildByName(tName + "Num");
                if(countTxt){
                    countTxt.ignoreContentAdaptWithSize(true);
                    countTxt.setString(count);
                    var scoreTxt = item.getChildByName(tName + "Fen");
                    scoreTxt.ignoreContentAdaptWithSize(true);
                    scoreTxt.setString(score * count + "分");
                }
            }else{
                var scoreTxt = item.getChildByName(tName);
                scoreTxt.ignoreContentAdaptWithSize(true);
                scoreTxt.setString(cnName + score + "x" + count); 
            }
            
        }

        var TongXiFen = item.getChildByName("TongXiFen");
        TongXiFen.setString(txFen + "分");

        //牌面分
        var paiMianFen = item.getChildByName("paiMianFen");
        paiMianFen.setString(pl.winall);

        //总分
        var zfTxt = item.getChildByName("zfTxt");
        zfTxt.ignoreContentAdaptWithSize(true);
        var all = pl.winall + pl.score_spclType;
        // zfTxt.setString(all > 0 ? ("+" + all) : all);
        if(all < 0){
            zfTxt.setProperty(all, "daTongZi/gameOver/biaoti_shuzi2.png", 28, 43, "+");
        }else{
            zfTxt.setProperty("+" + all, "daTongZi/gameOver/biaoti_shuzi1.png", 28, 43, "+");
        }

        //终局奖励
        var zjjlTxt = item.getChildByName("zjjlTxt");
        zjjlTxt.ignoreContentAdaptWithSize(true);
        zjjlTxt.setString(tData.areaSelectMode.lastRoundScore);
        zjjlTxt.visible = false;
        if(pl.score_lastRound > 0){
            zjjlTxt.visible = true;
        }

        pl.scoreContnet = all;
        AddFangKaIconTeam(item, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 80));
    },
});