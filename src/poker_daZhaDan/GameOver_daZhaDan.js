// function addWxHeadToEndUI_daZhaDan(node, off) {
//     var pl = MjClient.getPlayerByIndex(off);
//     var img = "png/default_headpic.png";
//     if (pl && pl.wxHeadImg) {
//         img = pl.wxHeadImg;
//         loadWxHead();
//     } else { // 回放直接弹总结算 没有缓存头像
//         cc.loader.loadImg(pl.info.headimgurl, {isCrossOrigin: true}, function(err, texture) {
//             if (!err && texture) {
//                 img = texture;
//                 loadWxHead();
//             }
//         });
//     }

//     function loadWxHead() {
//         var sp = new cc.Sprite(img);
//         var frame = node;
//         var clippingNode = new cc.ClippingNode();
//         var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
//         clippingNode.setAlphaThreshold(0);
//         clippingNode.setStencil(mask);

//         sp.setScale(mask.getContentSize().width / sp.getContentSize().width);
//         clippingNode.addChild(sp);
//         clippingNode.setPosition(frame.getContentSize().width / 2, frame.getContentSize().height / 2);
//         //遮罩框
//         var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
//         hideblock.setPosition(frame.getContentSize().width / 2, frame.getContentSize().height / 2);
//         frame.addChild(clippingNode);

//         setRoundEndUserOffline_yueYangPengHu(frame,pl);
//         frame.addChild(hideblock);
//     }
// }

var GameOverLayer_daZhaDan = cc.Layer.extend({
    sprite:null,
    jsBind:{
        back:{
            close :{
            },
            share :{
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
                        if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    }
                }
            }
        }

    },
    ctor:function () {
        this._super();
        var endallui = ccs.load("endAll_yueYangDaZhaDan.json");
        BindUiAndLogic(endallui.node,this.jsBind);
        this.addChild(endallui.node);
        // setWgtLayout(endallui.node,[0,1],[0,0],[0,0]);
        MjClient.endallui=this;

        var _block = endallui.node.getChildByName("block");
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);
        var _back = endallui.node.getChildByName("back");
        setWgtLayout(_back,[0.95,0.95],[0.5,0.5],[0,0]);
        // //分享
        var _share =  _back.getChildByName("share");
        this._share = _share;
        var sData=MjClient.data.sData;
        var tData=sData.tData;
        _share.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;

        //_share.x = 713.24;//屏蔽再来一局的时候，坐标要移动一下
        _share.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        COMMON_UI.getShareCodeTexture(tData.tableInfoUrl,_back,function(){
                            postEvent("capture_screen");
                            if(MjClient.endallui && cc.sys.isObjectValid(MjClient.endallui)){
                                MjClient.endallui.capture_screen = true;
                            }
                            _share.setTouchEnabled(false);
                        });
                    });
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fanxiang",  {uid:SelfUid(),gameType:MjClient.gameType});
                    break;
                default :
                    break;
            }
        },this);


        //四个玩家的详细信息
        var infoBg = _back.getChildByName("infoBg");
        var infoBgSize = infoBg.getCustomSize();
        for(var i = 0 ; i < 4 ; i++){
            var info = infoBg.getChildByName("info" + i);
            this.setPlayerInfo(info,i);

            COMMON_UI.addGameOverNotSameClubUI(info,MjClient.getPlayerByIndex(i))

        }

        // // 如果是亲友圈的房间显示亲友圈图标及名称
        var clubNode = _back.getChildByName("Image_club");
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && typeof(clubInfoTable.clubAvatar) != "undefined" && clubInfoTable.clubId && clubNode != null)
        {
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

            
            cc.loader.loadImg(clubInfoTable.clubAvatar, {
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

        var sData=MjClient.data.sData;
        var tData=sData.tData;

        // var jieSanIcon = _back.getChildByName("jieSanIcon");
        // jieSanIcon.setVisible(MjClient.isDismiss);

        var _infoMation =  _back.getChildByName("infoMation");
        if (_infoMation) {
            _infoMation.setString("")
            _infoMation.visible = true;
            //描述结算
            if (MjClient.isDismiss)
            {

                var id = tData.firstDel;
                var pl = sData.players[id];
                var delStr = "";
                if(pl) {
                    var name  =  unescape(pl.info.nickname );
                    delStr = name + pl.mjdesc[0];
                } else {
                    delStr = tData.dissolveWay == -1? '系统停服自动解散房间':'会长或管理员解散房间';
                }
                _infoMation.setString("" + delStr) ;
            }
        }

        // 结束时间
        if(!MjClient.isDismiss && _infoMation){
            _infoMation.setString( MjClient.roundEndTime+"");
        }

        function _infoText(){
            var sData=MjClient.data.sData;
            var tData=sData.tData;
            var text = "";//GameCnName[MjClient.gameType];
            var roomID = tData.tableid;
            text += GameCnName[MjClient.gameType] +  ",房间号:" + roomID +  "," + getPlaySelectPara(MjClient.gameType, tData.areaSelectMode);

            if(MjClient.gameType == MjClient.GAME_TYPE.YY_AN_HUA_PAO_HU_ZI) {
                var textArr = text.split(",");
                var tempText = "";
                for (var i = 0; i < textArr.length; i++) {
                    if(i != 0 && textArr[i] != "" && i < textArr.length  )
                        tempText += ",";
                    tempText += textArr[i];
                }
                return tempText;
            }
            return text;
        }


        var information = _back.getChildByName("infoMation");
        information.ignoreContentAdaptWithSize(false);
        information.setSize(cc.size(330, 90));


        information.setString(_infoText());

        cc.log(JSON.stringify(MjClient.data.sData));

        // //close ,关闭
        var _close1 =  _back.getChildByName("close");
        this._close1 = _close1;
        _close1.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Tuichu", {uid:SelfUid(),gameType:MjClient.gameType});
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable && !(MjClient.rePlayVideo >= 0 && MjClient.replayui)) {
                        if (!MjClient.FriendCard_main_ui)
                            MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                    }
                    //MjClient.leaveGame();
                    //这里的leaveGame肯定会返回{"result":0,"msg":"alreadyLeave"}，所以不用等待返回后再继续
                    //MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.gamenet.request("pkplayer.handler.LeaveGame",{},function(rtn){});
                    delete MjClient.data.sData;
                    delete MjClient.gameType;
                    postEvent("LeaveGame");
                    if (!MjClient.enterui && !MjClient.FriendCard_main_ui)
                        MjClient.Scene.addChild(new EnterRoomLayer());

                    if(MjClient.endallui){
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }

                    if(MjClient.rePlayVideo >= 0 && MjClient.replayui){
                        MjClient.replayui.replayEnd();
                    }


                    break;
                default :
                    break;
            }
        },this);

        //时间
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString("");
        if(MjClient.roundEndTime){
            _time.setString(MjClient.roundEndTime);
        }

        // 显示复制按钮
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

    setPlayerInfo : function(node,off){
        var sData=MjClient.data.sData;
        var tData=sData.tData;
        var pl=MjClient.getPlayerByIndex(off);
        if(!pl){
            node.setVisible(false);
            return;
        }

        var uidSelf = SelfUid();
        var MaxWinAll=0;
        var MaxDianPao=0;
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

        var uibind={
            name:{
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text:function(){
                    if(!pl){
                        return "";
                    }
                    return getNewName(unescape(pl.info.nickname)+"");
                }
            },
            id: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if(!pl){
                        return "ID:";
                    }
                    return  "ID: " + pl.info.uid.toString();
                }
            },
            bigWinner:{
                _visible : false
            },
            fangzhu:{
                _visible : false,
                _run:function(){
                    if(MjClient.data.sData.tData.owner == pl.info.uid){
                        this.visible = true;
                    }
                },
            }
        };

        var wxNode = node.getChildByName("head");
        addWxHeadToEndUI_daZhaDan(wxNode,pl);
        BindUiAndLogic(node,uibind);

        //最高得分
        var bigWinner = node.getChildByName("bigWinner");
        bigWinner.setVisible(false);

        // 玩家分数
        var winNum = node.getChildByName("winNum");
        winNum.ignoreContentAdaptWithSize(true);
        var icon = node.getChildByName("icon");
        var scoreContnet = pl.winall;
        if(scoreContnet <= 0){
            winNum.setProperty(scoreContnet + "", "daZhaDan/blueNum.png", 28, 42, "+");
        }else{
            winNum.setString("+" + pl.winall);
        }

        // 大赢家
        var nodeParent = node.getParent().getParent();

        if( scoreContnet == MaxWinAll  && scoreContnet != 0  ){
            bigWinner.visible = true;
            node.setBackGroundImage("gameOver/pjjs_9.png");
        } 
        AddFangKaIcon(sData, node, tData, pl, MaxWinAll, MaxWinPlayer,  MaxloseAll, MaxlosePlayer, cc.p(40, 445));

        // 玩家数据信息
        var showRoomStatistics = function(node,data){
            for (var i = 0; i < 5; i++) {
                var name = "item" + i;
                var text = node.getChildByName(name).getChildByName("text");
                text.setString(data[i]);
                text.ignoreContentAdaptWithSize(true);
            }
        }
        var textNode = node.getChildByName("statistc");
        showRoomStatistics(textNode,pl.roomStatistics);
    },

    //提前查看总结算的一些设置
    replaySet : function(cb){
        var btn = new ui.Button("ui/zhanji/huikanMj_n.png", "ui/zhanji/huikanMj_s.png", "ui/zhanji/huikanMj_s.png", ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(function(){
            MjClient.goOnReplay();
        }, this);
        btn.x = this._share.x + 120;
        btn.y = this._share.y;
        // btn.scale = 1.2;
        this._share.parent.addChild(btn);
        this._share.x -= 120;

        this._close1.addTouchEventListener(function(sender,Type){
            if(MjClient.endallui){
                MjClient.endallui.removeFromParent(true);
                MjClient.endallui = null;
            }

            if(MjClient.rePlayVideo >= 0 && MjClient.replayui){
                MjClient.replayui.replayEnd();
            }
        },this);
    }
});