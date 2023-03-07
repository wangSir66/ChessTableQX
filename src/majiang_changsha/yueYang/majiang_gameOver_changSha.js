var majiang_gameOver_changSha = majiang_gameOver.extend({
    _jsBind:{
        bgBox:{
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },
        back:{
            _run:function() {
                setWgtLayout(this, [1, 1], [0.5, 0.5], [0, 0])
            },

            btn_close :{ 
                _click:function(btn,eT){ 
                    MjClient.endallui.closeOverView();
                },
            },
            // 房间结束的信息
            text_infoMation: {
                _text:function(){
                    return MjClient.endallui.getRoomEndInfoText();
                }
            },
            // 房间信息
            text_roomInfo: {
                _text:function(){
                    return MjClient.endallui.getRoomInfoText();
                }
            },
            btnCopy:{
                _run:function() {
                    var clubInfoTable = getClubInfoInTable();

                    if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {
                        this.loadTextureNormal("gameOver/btn_replay_n.png");
                        this.loadTexturePressed("gameOver/btn_replay_s.png");
                    } 
                },
                _click:function(btn, eventType){
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {

                        // MjClient.showToast("这是再来一局");
                        clubReplay(clubInfoTable.clubId, clubInfoTable.ruleId, MjClient.gameType);

                    } else {
                        if (MjClient.playui) {
                            MjClient.playui.copyBntSharLogic();
                        }
                    } 

                },
            },
            // 分享按钮
            btn_share :{
                _run:function() {
                    // var clubInfoTable = getClubInfoInTable();
                    // cc.log(" ======= MjClient.friendCard_replay ",MjClient.friendCard_replay)
                    // if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {    
                    // } 
                },
                _click:function(btn, eventType){
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function(){
                        MjClient.endallui.getShareCodeTexture(MjClient.data.sData.tData.tableInfoUrl, function(){
                            postEvent("capture_screen");
                            if(MjClient.endallui && cc.sys.isObjectValid(MjClient.endallui)){
                                MjClient.endallui.capture_screen = true;
                            }   
                            btn.setTouchEnabled(false);
                        });
                    });
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Fanxiang",  {uid:MjClient.playui.getSelfUid(),gameType:MjClient.gameType});
                },
                _visible:function(){ 
                    return !MjClient.remoteCfg.guestLogin && !MjClient.data.sData.tData.matchId;
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

                        if(MjClient.Scene.getChildByName("shareCode")) {
                            MjClient.Scene.removeChildByName("shareCode");
                        }
                    }
                }
            },
        } 
    },
    //用于子类
    jsBind : {},
    
    ctor:function (jsonSrc) {
        this._super(); 
        return true;
    },
    onEnter:function(){
        this._super();
        if (MjClient.homeui && MjClient.systemConfig.rankEnable == "true"){
            MjClient.homeui.gameRankLayer();
        }
    }
});


// 开始跑得时候把大小结算下面这种类型的东西都放到设置里面去
majiang_gameOver_changSha.prototype.getEndallStatisticsName = function(pl) {  
    return pl.roomStatistics || [];
};

majiang_gameOver_changSha.prototype.getEndallStatisticsKey = function(pl) {  
    return pl.roomStatisticsDesc || ["大胡自摸","小胡自摸","大胡接炮","小胡接炮","大胡点炮","小胡点炮"];
};
// 设置房间统计内容
majiang_gameOver_changSha.prototype.setRoomStatistics = function(layout_typeText,pl) { 
    var infoType = this.getEndallStatisticsName(pl);
    var infoName = this.getEndallStatisticsKey(pl);

    var text_score = layout_typeText.getChildByName("text_score");
    var text_type = layout_typeText.getChildByName("text_type");
    var scoreSize = 28 * 1.2; // CSD中的高度 * 额外增加一点间距 
    for (var i = 0; i < infoType.length; i++) {
        var cloneName = text_type;
        var cloneScore = text_score;
        if(i != 0){
            cloneName = text_type.clone();
            cloneScore = text_score.clone();
            layout_typeText.addChild(cloneName);
            layout_typeText.addChild(cloneScore);
        } 
        cloneName.y -= scoreSize*i;
        cloneScore.y -= scoreSize*i;
        cloneName.ignoreContentAdaptWithSize(true);
        cloneScore.ignoreContentAdaptWithSize(true);
        var statistics = infoType[i];
        cloneScore.setString(statistics > 0 ? statistics : "0");
        cloneName.setString(infoName[i]);
    }
};
