function showUsersUI_daZhaDan(node){
    var sData = MjClient.data.sData;
    var players = sData.players;
    var tData = sData.tData;
    var rank = tData.rank;

    if(!rank || rank.length < tData.maxPlayer){

        for(var uid in players){
            if(rank.indexOf(parseInt(uid)) < 0){
               rank.push(uid); 
            }
        }
    }

    // if(tData.baoType != 2){
    //     //排序 抓分大小-- 抓分相同包牌玩家排前
    //     rank.sort(function(uid1, uid2){
    //         var p1 = players[uid1];
    //         var p2 = players[uid2];
    //         if(p1.score_draw > p2.score_draw){
    //             return -1;
    //         }else if(p1.score_draw < p2.score_draw){
    //             return 1;
    //         }else{
    //             if(p1.info.uid == tData.baoUid){
    //                 return -1;
    //             }
    //             if(p2.info.uid == tData.baoUid){
    //                 return 1;
    //             }
    //             return 0;
    //         }
    //     });
    // }

    console.log("rank:", rank);
    for(var i = 0; i < rank.length; i++){
        var pl = players[rank[i]];
        var item = node.getChildByName("head" + i);
        if(!item){
            break;
        }

        head_bg = item.getChildByName("head_bg");
        head_bg.loadTexture("gameOver/di_green.png");

        var rankImg = item.getChildByName("rankIcon");
        rankImg.loadTexture("playing/niushibie/Ui_you" + (i + 1) + ".png");

        var zhuaFen = item.getChildByName("zhuaFen");
        zhuaFen.ignoreContentAdaptWithSize(true);
        zhuaFen.setString(pl.score_draw);

        var jiangCheng = item.getChildByName("jiangCheng");
        jiangCheng.ignoreContentAdaptWithSize(true);
        jiangCheng.setString(pl.score_rank);

        var xiFen = item.getChildByName("xiFen");
        xiFen.ignoreContentAdaptWithSize(true);
        xiFen.setString(pl.score_xi);

        var bjdFen = item.getChildByName("bjdFen");
        bjdFen.ignoreContentAdaptWithSize(true);
        bjdFen.setString(pl.winone);

        var ljdFen = item.getChildByName("ljdFen");
        ljdFen.ignoreContentAdaptWithSize(true);
        ljdFen.setString(pl.winall);

        var ban = item.getChildByName("ban");
        if(tData.baoType != 2){
            //包牌
            if(pl.info.uid == tData.baoUid){
                ban.loadTexture("daZhaDan/banRed.png"); 
            }else{
                ban.loadTexture("daZhaDan/banBlue.png"); 
            }
            
        }else{
            //分组
            if(pl.info.uid == SelfUid() || pl.friendUid == SelfUid()){
                ban.loadTexture("daZhaDan/banBlue.png");
            }else{
                ban.loadTexture("daZhaDan/banRed.png"); 
            }
        }

        addWxHeadToEndUI_daZhaDan(item.getChildByName("head"), pl);

        var nameTxt = item.getChildByName("head").getChildByName("name");
        nameTxt.setString(sliceStrByLen_daZhaDan(unescape(pl.info.nickname), 6));
        nameTxt.setFontName("Arial");
        nameTxt.setFontSize(nameTxt.getFontSize());
    }
};

function addWxHeadToEndUI_daZhaDan(node,pl)
{
    var head = node;
    var url = pl.info.headimgurl;
    if(!url) url = "png/default_headpic.png";
    cc.loader.loadImg(url, {isCrossOrigin : true}, function(err, texture)
    {
        if(!err && texture && cc.sys.isObjectValid(head))
        {
            var clippingNode = new cc.ClippingNode();
            var mask = new cc.Sprite("gameOver/gameOver_headBg2.png");
            clippingNode.setAlphaThreshold(0);
            clippingNode.setStencil(mask);
            var img = new cc.Sprite(texture);
            img.setScale(mask.getContentSize().width / img.getContentSize().width);
            clippingNode.addChild(img);
            clippingNode.setPosition(head.getContentSize().width / 2, head.getContentSize().height / 2);
            //遮罩框
            var hideblock = new cc.Sprite("gameOver/gameOver_headBg3.png");
            hideblock.setPosition(head.getContentSize().width / 2, head.getContentSize().height / 2);
            head.addChild(clippingNode);
            head.addChild(hideblock);
        }
    });

    setRoundEndUserOffline_daZhaDan(node,pl);
};

//大结算和小结算   设置玩家掉线头像
function setRoundEndUserOffline_daZhaDan(node, pl){
    //var pl = getPlayerByIndex(off);
    if(!pl)
    {
        return;
    }
    if (pl.onLine == false )
    {
        var _offline = new cc.Sprite("playing/paohuzi/offLine.png");
        _offline.setName("offline");
        node.addChild(_offline);
        node.getChildByName("offline").x = 44;
        node.getChildByName("offline").y = 44;
        node.getChildByName("offline").zIndex = 99;
        node.setScale(0.8);
        node.getChildByName("offline").visible = !pl.onLine;
    }

    if (pl.onLine == false)
    { 
        var _offLineNode = node.getChildByName("offline");
        _offLineNode.unscheduleAllCallbacks();
        var _currentTime = new Date().getTime();
        _offLineNode.schedule(function(){
            var _timeNode = _offLineNode.getChildByName("offLineTime");
            if (!_timeNode) {

                _timeNode = new ccui.Text();
                _timeNode.setName("offLineTime");
                _timeNode.setFontSize(26);
                _offLineNode.addChild(_timeNode)
            }
            else
            {
                _timeNode.visible = true;
            }

            _timeNode.setPosition(cc.p(_offLineNode.getContentSize().width/2,_offLineNode.getContentSize().height*0.8));

            if (pl.offLineTime)
            {
                var _showTime = _currentTime - pl.offLineTime;
                _timeNode.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            }
            else
            {
                _timeNode.setString("");
            }
        });
    }

}
var EndOneView_daZhaDan = cc.Layer.extend({
    jsBind: {
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back: {
            _layout: [[1, 1], [0.5, 0.48], [0, 0]],
            _run : function(){
                showUsersUI_daZhaDan(this);
            },
            share:{
                _click:function(btn,eT){
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});

                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function()
                    {
                        postEvent("capture_screen");
                        MjClient.endoneui.capture_screen = true;
                        btn.setTouchEnabled(false);
                    });
                }
                ,_event:{
                    captureScreen_OK: function () {
                        if (MjClient.endoneui.capture_screen != true)
                            return;
                        MjClient.endoneui.capture_screen = false;
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
                ,_visible :function()
                {
                        var tData = MjClient.data.sData.tData;
                        return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
                }
            },
            ready:{
                _run:function ()
                {
                    if(MjClient.remoteCfg.guestLogin)
                    {
                        setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0], false, true);
                    }
                },
                _click:function(btn,eT)
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    postEvent("clearCardUI");
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                    clearJiFen_daZhaDan();
                   
                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }
                    else {
                        PKPassConfirmToServer_card();
                    }
                    if (MjClient.endallui)
                    {
                        MjClient.endallui.setVisible(true);
                    }
                    if (MjClient.arrowbkNode && cc.sys.isObjectValid( MjClient.arrowbkNode )) {
                        MjClient.arrowbkNode.setVisible(false);
                    }
                }
            },
            delText:
            {
                _run: function() {
                    this.setFontName("Arial");
                    if (MjClient.isDismiss) {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if (!pl) {  // 会长或管理员解散房间时 pl 会为 null
                            pl = getUIPlayer(0);
                            if (pl)
                                delStr = pl.mjdesc[0];
                        }else{
                            var name  =  unescape(pl.info.nickname );
                            delStr = name + pl.mjdesc[0];
                        }
                        this.setString(delStr);
                    } else {
                        this.setString("");
                    }
                }
            },  
        }
    },
    ctor: function () {
        this._super();
        var endoneui = ccs.load("endOne_yueYangDaZhaDan.json");
        BindUiAndLogic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);

        MjClient.endoneui = this;
        return true;
    },
});