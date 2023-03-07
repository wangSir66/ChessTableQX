function SetGameOverLayer_hongZi(node,off,isNewUi){
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

    setDismissTypeImg(pl,node,0.5,0.22,"chang");

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
                this.setFontName("Arial");
                this.setFontSize(this.getFontSize());
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
                    return "";
                }
                return  pl.info.uid.toString();
            }
        },
        allscore:{
            winNum1:{
            },
            winNum2:{
            },
            bigWinner:{
                _visible : false
            }
        },
        listView:{
            _run:function(){
                this.setScrollBarEnabled(false);
                var itemModel = this.children[0];
                this.setItemModel(itemModel);
                this.removeAllChildren();
                var tableMsg = pl.tableMsg;
           
                cc.log("----------tableMsg doudizhu---- " + JSON.stringify(tableMsg));
                  
                var listView = this;


                var nameText = [" 单局最高"," 大胡次数"," 小胡次数"];

                var describeMsg = pl.roomStatistics; 
                for (var i = 0; i < describeMsg.length; i++) {
                    listView.pushBackDefaultItem(); 
                    var listChild = listView.children;//listView.getChildByName("maxTextItem_" + i);
                    var item = listChild[i];
                    var itemName = item.getChildByName("title");
                    itemName.setString(nameText[i]);
                    var scoreText = item.getChildByName("score");
                    scoreText.setString(describeMsg[i]);
                    scoreText.ignoreContentAdaptWithSize(true);
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                        if (Number(scoreText.getString()) > 0) {
                            scoreText.setColor(cc.color("#D3260E"));
                        }
                        else {
                            scoreText.setColor(cc.color("#00824C"));
                        }
                    }
                } 


                for(var i = 0;i < tableMsg.length;i++){
                    listView.pushBackDefaultItem();
                    var children = listView.children;
                    var insertItem = children[children.length-1];

                    insertItem.getChildByName("title").setString(" 第" + (i+1) + "局");
                    var scoreLabel = insertItem.getChildByName("score");
                    scoreLabel.ignoreContentAdaptWithSize(true);
                    if(tableMsg[i])
                    {
                        scoreLabel.setString(tableMsg[i]);
                    }
                    else {
                        scoreLabel.setString("0");
                    }
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
                        if (Number(scoreLabel.getString()) > 0) {
                            scoreLabel.setColor(cc.color("#D3260E"));
                        }
                        else {
                            scoreLabel.setColor(cc.color("#00824C"));
                        }
                    }
                }
            }
        },
    };

    // var wxNode = node.getChildByName("head");
    // addWxHeadToEndUI(wxNode,off);
    // setRoundEndUserOffline_hongzi(wxNode,pl);

    // 显示玩家头像
    var head = node.getChildByName("head");
    if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
        CircularCuttingHeadImg(head, pl);
    }
    else {
       addWxHeadToEndUI(head, off);
    }

 

    BindUiAndLogic(node,uibind);
    // node.getChildByName("fangzhu").visible =false;

    if(MjClient.getAppType() ==  MjClient.APP_TYPE.QXJSMJ ||
        MjClient.getAppType() ==  MjClient.APP_TYPE.QXHAIANMJ ||
        MjClient.getAppType() ==  MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ)
    {
        setUserOfflineWinGamePanel(node,pl);
    }

    if(!pl)
    {
        uibind.allscore.visible = false;
        node.getChildByName("fangzhu").visible =false;
        return;
    }

    var numValue = Math.abs(pl.winall) + "";
    //最高得分
    uibind.allscore.visible = true;
    uibind.allscore.bigWinner._node.visible = false;
    var winNum1 = node.getChildByName("allscore").getChildByName("winNum1");
    winNum1.ignoreContentAdaptWithSize(true);
    var winNum2 = node.getChildByName("allscore").getChildByName("winNum2");
    winNum2.ignoreContentAdaptWithSize(true);
    if(pl.winall >= 0){
        winNum1.setString("" + pl.winall);
        winNum2.visible = false;
    }else{
        winNum1.visible = false;
        winNum2.setString("" + Math.abs(pl.winall));
    }
    var nodeParent = node.getParent().getParent();
    var _share = nodeParent.getChildByName("share");
    var _shine = _share.getChildByName("img_shine");
    var _point = _share.getChildByName("img_point");
    var _txt = _share.getChildByName("img_txt");
    if(pl.winall == MaxWinAll && pl.winall != 0){
        uibind.allscore.bigWinner._node.visible = true;
        var act_Func = function() {
            var a = cc.scaleTo(0.5, 1.0);
            var aa = cc.fadeIn(0.5);
            var a1 = cc.scaleTo(1.0, 4);
            var a2 = cc.fadeOut(1.0);
            var act_2 = cc.rotateBy(0.8, 30);
            var act_3 = cc.rotateBy(0.8, -30);
            var a3 =  cc.callFunc(function() {
                _shine.setScale(1);
            }.bind(_shine));
            _shine.runAction(cc.sequence(cc.spawn(a,aa), cc.spawn(a1,a2),a3,cc.delayTime(0.1)).repeatForever());
            _point.runAction(cc.sequence(act_2, act_3).repeatForever());

        }
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && pl.info.uid == SelfUid()) {
            _shine.setVisible(true);
            _point.setVisible(true);
            _txt.setVisible(true);
            act_Func();
        }
        // 设置背景大赢家图片/字体颜色（岳阳app）
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            node.loadTexture("gameOver/pjjs_9.png");
        }
        
    }
    AddFangKaIcon(sData, uibind.allscore._node, tData, pl, MaxWinAll, MaxWinPlayer,  MaxloseAll, MaxlosePlayer, cc.p(10, 345));

    if (tData.owner == pl.info.uid)
    {
        node.getChildByName("fangzhu").visible =true;
    }
    else{
        node.getChildByName("fangzhu").visible =false;
    }

    if(tData.isFanBei){
        var fanBei_text = node.getChildByName("fanBei");
        fanBei_text.visible = true;
        fanBei_text.setString("( " + pl.winall * 0.5 + " x2 )");
        fanBei_text.ignoreContentAdaptWithSize(true);
        if(pl.winall < 0){
            fanBei_text.setTextColor(cc.color(165,255,255));
            fanBei_text.enableOutline(cc.color(66,60,102), 2);
        }
    }
}

/*
    红字大结算
 */
var GameOverLayer_HongZi = cc.Layer.extend({
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
                        if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    }
                }
            },
        }
    },
    ctor:function () {
        this._super();

        //test
        // MjClient.data.sData = {"players":{"1000140":{"mjhand":[10,8,1,26,6,3,2,28,27,4,30,29,9],"mjdesc":[" ÓÚ2018-04-19 22:27:40ÉêÇë½âÉ¢"],"winone":0,"winall":34,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"be":[2],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000140,"appid":"yueyang","unionid":"unionid-1000140","sex":2,"nickname":"%u6E38%u5BA2140","headimgurl":"http://cdn.jtcfgame.com/images/8.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"233.69.220.83","lastLoginTime":1524144707673,"lastShareDay":0,"createRoomNum":10,"createTime":1522130860424,"money":84,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":28,"fid":"pkcon001","remoteIP":"172.17.100.42","lockMoney":4,"did":"pkplayer000","lastGameTime":1524148005207},"tableMsg":[6,-4,40,-8,0],"longCard":[]},"1000141":{"mjhand":[25,29,28,7,30,4,2,21,23,10,25,3,91,24],"mjdesc":["Í¬Òâ½âÉ¢"],"winone":0,"winall":1,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"be":[10],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000141,"appid":"yueyang","unionid":"unionid-1000141","sex":2,"nickname":"%u6E38%u5BA2141","headimgurl":"http://cdn.jtcfgame.com/images/0.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"51.72.78.192","lastLoginTime":1524140486058,"lastShareDay":0,"createRoomNum":10,"createTime":1522130860424,"money":100,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":28,"fid":"pkcon000","remoteIP":"172.17.100.42","lockMoney":0,"did":"pkplayer001","lastGameTime":1524148005208},"tableMsg":[-3,8,-20,16,0],"longCard":[]},"1000142":{"mjhand":[3,27,1,7,27,91,29,8,22,23,26,28,21],"mjdesc":["Í¬Òâ½âÉ¢"],"winone":0,"winall":-35,"winType":0,"baseWin":0,"mjwei":[],"mjsort":[],"handSort":[],"hzdesc":{},"zimoTotal":0,"dianpaoTotal":0,"minggangTotal":0,"angangTotal":0,"mjpeng":[],"mjgang0":[],"mjflower":[],"info":{"uid":1000142,"appid":"yueyang","unionid":"unionid-1000142","sex":2,"nickname":"%u6E38%u5BA2142","headimgurl":"http://cdn.jtcfgame.com/images/6.jpg","district":"¹ã¶«Ê¡ÉîÛÚÊÐ","mobileNum":null,"registerIp":"221.17.206.152","lastLoginTime":1524140487757,"lastShareDay":0,"createRoomNum":10,"createTime":1522130860424,"money":100,"integral":0,"limitMoney":0,"myMemberId":null,"memberId":null,"bindHistory":0,"sid":30,"fid":"pkcon001","remoteIP":"172.17.100.42","lockMoney":0,"did":"pkplayer000","lastGameTime":1524148005208},"tableMsg":[-3,-4,-20,-8,0],"longCard":[]}},"tData":{"initCoin":0,"gameType":2018092,"roundAll":16,"roundNum":-2,"isValidTable":true,"fanNum":0,"maxPlayer":3,"uids":[1000140,1000141,1000142],"owner":1000140,"maxHunNum":4,"tableid":"493386","cardNext":40,"winner":-1,"zhuang":1,"curPlayer":1,"lastPutPlayer":1,"putType":1,"lastDrawPlayer":1,"tState":6,"lastPutCard":24,"genpaiCount":0,"isHunCardPlay":false,"canHu7":false,"delEnd":0,"delEndHePai":0,"firstDel":1000140,"canEatHu":true,"huangNum":14,"lastGangType":0,"lastGangDianpaoPlayer":-1,"xingPlayer":-1,"datuoNum":0,"mingCard":0,"areaSelectMode":{"maxPlayer":3,"payWay":0},"gameCnName":"ãèÂÞºì×Ö","hunCard":-1,"currCard":-1,"drawType":0,"isLastDraw":true,"isFirstPut":false,"hasPay":true,"hePai":false,"roundNumPre":12},"cards":[25,29,28,7,30,4,2,21,23,10,25,3,91,3,27,1,7,27,91,29,8,22,23,26,28,21,10,8,1,26,6,3,2,28,27,4,30,29,9,24,22,23,8,10,26,2,27,91,30,3,1,22,25,6,5,10,22,21,7,29,5,30,9,7,24,91,25,2,9,6,5,21,8,5,4,24,28,9,26,23,6,1,24,4],"hunCard":-1,"roundEndTime":"2018-04-19 22:26:45","isDismiss":true,"playInfo":{"gametype":2018092,"owner":1000140,"money":4,"now":"2018-04-19 22:26:45","tableid":"493386","players":[{"uid":1000140,"winall":34,"nickname":"%u6E38%u5BA2140","money":84},{"uid":1000141,"winall":1,"nickname":"%u6E38%u5BA2141","money":100},{"uid":1000142,"winall":-35,"nickname":"%u6E38%u5BA2142","money":100}]}};

        var endallui = ccs.load("endAll_ZhuaHongZi.json");
        BindUiAndLogic(endallui.node,this.jsBind);
        this.addChild(endallui.node);
        MjClient.endallui=this;

        var _block = endallui.node.getChildByName("block");
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0], true);

        var _bg = endallui.node.getChildByName("bg");
        if (_bg) {
            setWgtLayout(_bg, [1, 1], [0.5, 0.0], [0, 0]);
            _bg.height += (MjClient.size.height / _bg.scaleY - _bg.height) / 2;
        }

        var isNewUi = (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP|| MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ);

        /*
         changed by sking
         */
        var _back = endallui.node.getChildByName("back");
        setWgtLayout(_back,[1,1],[0.5,0.5],[0,0]);

        //分享
        var _share =  _back.getChildByName("share");
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
                            cc.log("====================capture_screen=======================");
                            postEvent("capture_screen");
                            if(MjClient.endallui && cc.sys.isObjectValid(MjClient.endallui)){
                                MjClient.endallui.capture_screen = true;
                            }
                            _share.setTouchEnabled(false);
                        });
                    });
                    break;
                default :
                    break;
            }
        },this);
        var clubInfoTable = getClubInfoInTable();

        if (clubInfoTable && clubInfoTable.clubId) {
            _share.x = _share.getParent().width / 2;
        }
        // 如果是亲友圈的房间显示亲友圈图标及名称
        var image_title = _back.getChildByName("Image_title");
        var clubNode = _back.getChildByName("Image_club");
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

        //信息 说明
        var _infoMation =  _back.getChildByName("infoMation");
        _infoMation.visible = true;

        var _infoMation2 =  _back.getChildByName("infoMation_2"); 
        if (_infoMation2) {
            _infoMation2.setString("")
            _infoMation2.visible = true;
            //描述结算
            var sData=MjClient.data.sData;
            var tData=sData.tData; 
            if (MjClient.isDismiss)
            { 
                var id = tData.firstDel;
                var pl = sData.players[id];
                var name  =  unescape(pl.info.nickname );

                var delStr = name + pl.mjdesc[0];
                _infoMation2.setString("" + delStr) ;
            }
        }

        function _infoText(){
            var sData=MjClient.data.sData;
            var tData=sData.tData;
            var text = "";//GameCnName[MjClient.gameType];
            var roomID = tData.tableid;

            text += "房间号:" + roomID + "," + getPlaySelectPara(MjClient.gameType, tData.areaSelectMode);
            
            return text;
        }



        _infoMation.ignoreContentAdaptWithSize(false); 
        _infoMation.setSize(cc.size(340, 90)); 
        // _infoMation.setPositionX(870);

        _infoMation.setString(_infoText());
        // if (!isNewUi)
        //     _infoMation.ignoreContentAdaptWithSize(true);

        //时间
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString("");



        if (isNewUi) {
            if (MjClient.getAppType() != MjClient.APP_TYPE.QXTHMJ) {
                //描述结算
                if (MjClient.isDismiss) {
                    var id = tData.firstDel;
                    var pl = sData.players[id];
                    if (pl) {
                        var name = unescape(pl.info.nickname );
                        delStr = name + pl.mjdesc[0];
                    } else { // 会长或管理员解散房间时 pl 会为 null
                        pl = getUIPlayer(0);
                        if (pl)
                            delStr = pl.mjdesc[0];
                    }
                    _time.setString(delStr);
                }
            }
        } else {
            cc.log("MjClient.roundEndTime == " + MjClient.roundEndTime);
            if(MjClient.roundEndTime)
                _time.setString(MjClient.roundEndTime);
        }

        // 结束时间
        if(!MjClient.isDismiss) _time.setString( MjClient.roundEndTime);

        var nantongReplay = function() {
            var tData = MjClient.data.sData.tData;
            var para = tData.areaSelectMode;
            var inviteVipTable = MjClient.data.inviteVipTable;
            para.maxPlayer = tData.maxPlayer;
            para.gameType = tData.gameType;

            MjClient.showMsg("是否再来一局？", function () {
                if (inviteVipTable)
                {
                    MjClient.joinGame(inviteVipTable, null, false, para.gameType);
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
        _close1.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable) {
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
                    break;
                default :
                    break;
            }
        },this);



        //再来一局
        var _btnReplay =  _back.getChildByName("btnReplay");
        var tData = MjClient.data.sData.tData;
        

        if(MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ ||
            isJinZhongAPPType()||
            MjClient.getAppType() == MjClient.APP_TYPE.TXLVLIANGMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ
        )
        {
            // _btnReplay.visible = true;
            _btnReplay.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;
            _btnReplay.visible = !getClubInfoInTable();

        }
        else
        {
            _btnReplay.visible = false;  //屏蔽再来一局
        }


        _btnReplay.addTouchEventListener(function(sender,Type){
            switch (Type)
            {
                case ccui.Widget.TOUCH_ENDED:
                    if(MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP)//南通APP再来一局退出到主界面再提示
                    {
                        nantongReplay();

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

                    }
                    else
                    {
                        if (MjClient.data.inviteVipTable)
                        {
                            MjClient.leaveGame(function()
                            {
                                MjClient.joinGame(MjClient.data.inviteVipTable, null, false, MjClient.gameType);
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


        // 七星江苏麻将 显示复制按钮
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ && !tData.matchId){
            

            var _btnCopy =  _back.getChildByName("btnCopy");
            var copytext = "\n";
            _btnCopy.visible = true;

            var clubInfoTable = getClubInfoInTable();
            // 亲友圈再来一句按钮会隐藏
            if(clubInfoTable) {
                var midx = _btnCopy.getParent().width / 2
                _btnCopy.x = midx - 100;
                _share.x = midx + 100;
            } else {
                var offX = 160;
                _share.x += offX;
                _btnReplay.x += offX - 30;
            }

            // 亲友圈玩法名称
            if (clubInfoTable && clubInfoTable.ruleName) {
                var ruleName = unescape(clubInfoTable.ruleName);
                copytext += ruleName + "\n";
            }

            // 房间id
            var strTableid = '【' + tData.tableid + '】 '; 
            // 玩法名称
            var strRoomName = GameCnName[MjClient.gameType] + ' ';
            // 局数 
            var extraNum = tData.extraNum ? tData.extraNum:0;
            var strRoundNum = (tData.roundAll - tData.roundNumPre + 1 + extraNum) + "/" + tData.roundAll + "局";
            copytext += strTableid + strRoomName + strRoundNum + '\n';
            // 日期
            var strDate = MjClient.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            copytext += strDate + '\n';

            copytext += "=====  战绩  ===== \n"

            var sData = MjClient.data.sData;
            var MaxWinAll = 0;
            //计算所有人数据
            for (var uid in sData.players) {
                var pi = sData.players[uid];
                if(pi)
                {
                    MaxWinAll = MaxWinAll>pi.winall?MaxWinAll:pi.winall;
                }
            }

            for(var i in sData.players) {
                var pl_data = MjClient.data.sData.players[i];
                var name = getNewName(unescape(pl_data.info.nickname));
                copytext += "【" + name + "】";

                if(MaxWinAll != 0 && MaxWinAll == pl_data.winall) copytext += ' 大赢家';

                copytext += '\n';
                if(pl_data.winall > 0) {
                    copytext += '战绩: +' + pl_data.winall;
                } else if( pl_data.winall < 0) {
                    copytext += '战绩: ' + pl_data.winall;
                } else {
                    copytext += '战绩: ' + pl_data.winall;
                }
                copytext += '\n';
            }

            var clubInfoTable = getClubInfoInTable();
            if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {
                _btnCopy.loadTextureNormal("gameOver/btn_replay_n.png");
                _btnCopy.loadTexturePressed("gameOver/btn_replay_s.png");
            } 


            _btnCopy.addTouchEventListener(function(sender,Type){
                switch (Type)
                {
                    case ccui.Widget.TOUCH_ENDED:
                        var clubInfoTable = getClubInfoInTable();
                        if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {

                            // MjClient.showToast("这是再来一局");
                            clubReplay(clubInfoTable.clubId, clubInfoTable.ruleId, MjClient.gameType);

                        } else {
                            cc.log(copytext)
                            MjClient.showToast('战绩已复制到粘贴板,快去分享吧');
                            MjClient.native.doCopyToPasteBoard(copytext);
                        } 
                        break;
                    default :
                        break;
                }
            },this);
        }

        //四个玩家的详细信息
        var infoBg = _back.getChildByName("infoBg");
        var infoBgSize = infoBg.getCustomSize();

        var info = infoBg.getChildByName("info");
        info.visible = false;
        var bgSize = info.getCustomSize();
        var sData = MjClient.data.sData;
        var players = sData.players;
        var playerCount = Object.keys(players).length;

        if(Object.keys(players).length == 2)
            playerCount = 3;

        var off_x = (infoBgSize.width - playerCount*bgSize.width)/(playerCount-1);
        var startPos = cc.p(bgSize.width/2,infoBgSize.height/2);
        if(Object.keys(players).length == 2)
            startPos.x += (bgSize.width+off_x) / 2;

        var clone = null;
        for(var i = 0 ; i < playerCount ; i++){
            clone = info.clone();
            clone.visible = true;
            clone.setPosition(startPos);
            infoBg.addChild(clone);

            SetGameOverLayer_hongZi(clone,i, isNewUi);
            
            COMMON_UI.addGameOverNotSameClubUI(clone,MjClient.getPlayerByIndex(i))

            startPos = cc.p(startPos.x + bgSize.width+off_x,startPos.y);
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
    }
});