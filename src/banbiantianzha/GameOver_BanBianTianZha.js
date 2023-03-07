function setEndAllViewItemHead_BanBianTianZha(node, pl) {
    var img = "png/default_headpic.png";
    if(pl && pl.wxHeadImg)
    {
        img = pl.wxHeadImg;
        loadWxHead();
    }else
    {
        cc.loader.loadImg(pl.info.headimgurl, {isCrossOrigin: true}, function(err, texture) {
            if (!err && texture) {
                img = texture;
                loadWxHead();
            }
        });
    }
    function loadWxHead() {
        var sp = new cc.Sprite(img);
        node.addChild(sp);
        setWgtLayout(sp,[0.88,0.88],[0.5,0.5],[0,0],false,true);

        setRoundEndUserOffline_hengYang(node,pl);
    }
}

function setEndAllViewItemInfo_BanBianTianZha(node, pl) {
    cc.log("chow", "setEndAllViewItemInfo_BanBianTianZha" + " pl = " + JSON.stringify(pl));

    var sData=MjClient.data.sData;
    var tData=sData.tData;
    var MaxWinAll=0;
    var MaxlosePlayer = null;
    var MaxWinPlayer = null;
    var MaxloseAll = 999999999;

    //计算所有人数据
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            if (MaxWinAll < pi.winall) {
                MaxWinAll = pi.winall;
                MaxWinPlayer = uid;

            }else if (MaxWinAll == pi.winall) {
                if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                    MaxWinAll = pi.winall;
                    MaxWinPlayer = uid;
                }
            }
            if (pi.winall < MaxloseAll) {
                MaxloseAll = pi.winall;
                MaxlosePlayer = uid;
            }else if (pi.winall == MaxloseAll) {
                if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                    MaxloseAll = pi.winall;
                    MaxlosePlayer = uid;
                }
            }
        }
    }




    var head = node.getChildByName("head");
    setEndAllViewItemHead_BanBianTianZha(head, pl);

    setDismissTypeImg(pl,head,1.1,0.5,"zheng"); 

    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);
    name.setString(getNewName_new(unescape(pl.info.nickname), 4));
    name.setFontName("Arial");
    name.setFontSize(name.getFontSize());

    var id = node.getChildByName("id");
    id.ignoreContentAdaptWithSize(true);
    id.setString(pl.info.uid);

    var zhuang = node.getChildByName("zhuang");
    zhuang.ignoreContentAdaptWithSize(true);
    zhuang.setString(pl.zhuang_total + "次");

    var shangyou = node.getChildByName("shangyou");
    shangyou.ignoreContentAdaptWithSize(true);
    shangyou.setString(pl.shangyou_total + "次");

    var shengli = node.getChildByName("shengli");
    shengli.ignoreContentAdaptWithSize(true);
    shengli.setString(pl.win_total + "局");

    var zongchengji = node.getChildByName("zongchengji");
    var num1 = zongchengji.getChildByName("num1");
    var num2 = zongchengji.getChildByName("num2");
    num1.ignoreContentAdaptWithSize(true);
    num2.ignoreContentAdaptWithSize(true);
    if(pl.winall >= 0){
        num1.setString(pl.winall);
        num1.setVisible(true);
        num2.setVisible(false);
    }else{
        num2.setString(Math.abs(pl.winall));
        num1.setVisible(false);
        num2.setVisible(true);

        var fuhao = new cc.Sprite("daTongZi/gameOver/biaoti_shuzi2.png", cc.rect(28 * 2, 0, 28, 43));
        fuhao.setPosition(-fuhao.width / 2, num2.height / 2);
        num2.addChild(fuhao);
    }
    AddFangKaIcon(sData, head, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(0, 60));
}

var GameOverLayer_BanBianTianZha = cc.Layer.extend({
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
        var endallui = ccs.load("endAll_BanBianTianZha.json");
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

        var item = this.uiNode.getChildByName("back").getChildByName("item");
        item.visible = false;

        for(var i = 0; i < tData.maxPlayer; i++){
            var pl = MjClient.data.sData.players[tData.uids[(tData.zhuang + i) % tData.maxPlayer]];

            var itemNode = item.clone();
            itemNode.visible = true;

            this.uiNode.getChildByName("back").addChild(itemNode);
            itemNode.setPosition(item.x, item.y - i * 137);

            setEndAllViewItemInfo_BanBianTianZha(itemNode, pl);
            
            COMMON_UI.addGameOverNotSameClubUI(itemNode,pl)
        }

        //复制战绩
        addCopyBtnToGameOverLayer(endallui.node);

        return true;
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
        str += tData.areaSelectMode.isJiaChui ? "加锤," : "";
        str += tData.areaSelectMode.isZhuDou ? "助陡," : "";
        str += tData.areaSelectMode.isWuShiKHuaSe ? "正510K分花色," : "";
        str += tData.areaSelectMode.isPaiShu ? "显示剩余牌," : "";
        str += tData.areaSelectMode.isSiDaiSan ? "4带3," : "";
        str += tData.areaSelectMode.isFanBaoSuanKaiQiang ? "反包算开枪," : "";
        str += tData.areaSelectMode.isFanBaoShuangJin ? "反包双进单出," : "";
        str += tData.areaSelectMode.jieSuanDiFen ? "积分底分" + tData.areaSelectMode.jieSuanDiFen : "";

        if (str.charAt(str.length - 1) == ",")
            str = str.substring(0, str.length - 1);
        return str;
    }
});