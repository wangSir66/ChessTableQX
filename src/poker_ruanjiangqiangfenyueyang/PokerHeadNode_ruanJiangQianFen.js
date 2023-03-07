/**
 *  斗地主头像
 */
var PokerHeadNode_ruanJiangQianfen = cc.Node.extend({
    node: null,
    ctor: function(off) {
        this._super();
        // 加载csb资源 断线重连不走 构造函数需把这部分独立出来
        var  csbNode = ccs.load("Ruanjiangqianfen_HeadNode.json");
        this.node = csbNode.node;
        this.initHeadUI(off);
        this.initHeadTouch(off);
        this.hideHeadUI();
        this.updateScores();
    }
});

PokerHeadNode_ruanJiangQianfen.prototype.hideHeadUI = function () {
    this.createFangIcon();
    this.setWxHead(false);
    this.updateNameAndCoin();
    this.setUserOffline();
    this.flyScore.visible = false;
};

PokerHeadNode_ruanJiangQianfen.prototype.initHeadUI = function(off)
{
    var coinBg = this.node.getChildByName("score_bg1");
    this.textCoin = coinBg.getChildByName("score_zong");
    this.textCoin.ignoreContentAdaptWithSize(true);
    this.textCoin.setScale(1.2);

    var fenBg = this.node.getChildByName("score_bg2");
    this.score_fen = fenBg.getChildByName("score_fen");
    this.score_fen.ignoreContentAdaptWithSize(true);
    this.score_fen.setScale(1.2);

    var xiBg = this.node.getChildByName("score_bg3")
    this.score_xifen = xiBg.getChildByName("score_xifen");
    this.score_xifen.ignoreContentAdaptWithSize(true);
    this.score_xifen.setScale(1.2);

    var totalXiBg = this.node.getChildByName("score_bg4");
    this.score_totalxifen = totalXiBg.getChildByName("score_totalxifen");
    this.score_totalxifen.ignoreContentAdaptWithSize(true);
    this.score_totalxifen.setScale(1.2);

    this.textName = this.node.getChildByName("name");
    this.textName.zIndex=103;
    this.textName.setScale(1.5);
    this.textName.ignoreContentAdaptWithSize(true);

    this.offLine = this.node.getChildByName("offline");
    this.offLine.zIndex = 99;
    this.emoji = this.node.getChildByName("emoji");
    this.chatbg = this.node.getChildByName("chatbg");
    this.chatbg.setPositionX((off==1 ?-90:89));
    this.chatbg.setAnchorPoint((off==1?1:0),0.5);
    var tmp="playing/other/";
    this.chatbg.loadTexture((off==1?(tmp+"chatbg_rd.png"):(tmp+"chatbg_ld.png")));
    if(off == 0){
        this.emoji.setPosition(108,142);
    }else if(off ==1){
        this.emoji.setPosition(-111,5);
    }else if(off ==2){
        this.emoji.setPosition(114,-10);
    }

    if(MjClient.MaxPlayerNum == 4 && off == 2) {
        for(var i = 0;i < 4; i++) {
            var scoreBg = this.node.getChildByName("score_bg" + (i+1));
            scoreBg.setPosition(cc.p(115 + (i == 3 ? 16 : 0),117 - i*33));
        }
    }
    this.flyScore = this.node.getChildByName("flyScore");
    this.countDownBg = this.node.getChildByName("countDownBg");
    this.countDownBg.visible = false;
    this.countDownBg.getChildByName("TG_CountDown").ignoreContentAdaptWithSize(true);
    this.tuoguan = this.node.getChildByName("tuoguan");
    this.tuoguan.visible = false;
}
PokerHeadNode_ruanJiangQianfen.prototype.initHeadTouch = function(off) {
    var nobody = this.node.getChildByName("nobody");
    nobody.setTouchEnabled(true);
    nobody.addTouchEventListener(function (sender,type) {
        if(type==2){
            showPlayerInfo(off,sender);
        }
    },nobody);
};

// 房主icon
PokerHeadNode_ruanJiangQianfen.prototype.createFangIcon = function() {
    this.fangTag = this.node.getChildByName("fangTag");
    var headFrame = this.node.getChildByName("headFrame");
    if (this.fangTag == null) {
        var sp = new cc.Sprite("playing/gameTable/fangzhu3.png");
        sp.setScale(1.2);
        sp.setPosition(headFrame.getContentSize().width/2 + 10, 0);
        sp.setAnchorPoint(1,0);
        sp.zIndex=102;
        sp.setName("fangTag");
        this.fangTag = sp;
        this.node.addChild(sp, 110);
    }
    this.fangTag.visible=false;
};
PokerHeadNode_ruanJiangQianfen.prototype.updateNameAndCoin=function(pl){
    this.textName.visible = (pl != null);
    this.textCoin.visible = (pl != null);
    this.textCoin.getParent().visible = (pl != null);
    this.score_fen.visible = (pl != null);
    this.score_fen.getParent().visible = (pl != null);
    this.score_xifen.visible = (pl != null);
    this.score_xifen.getParent().visible = (pl != null);
    this.score_totalxifen.visible = (pl != null);
    this.score_totalxifen.getParent().visible = (pl != null);
    if (pl == null)
    {
        return;
    }
    var strname=getNewName(unescape(pl.info.nickname ));
    this.textName.setString(strname);
};

PokerHeadNode_ruanJiangQianfen.prototype.setWxHead=function (flag, imgUrl) {
    var nobody = this.node.getChildByName("nobody");
    var WxHead = nobody.getChildByName("WxHead");
    if(WxHead) {
        WxHead.removeFromParent();
    }
    if (flag) {
        var headSprite = new cc.Sprite(imgUrl);
        headSprite.setName("WxHead");
        nobody.addChild(headSprite);
        setWgtLayout(headSprite, [0.91, 0.91], [0.5, 0.5], [0, 0], false, true);
    }
};

PokerHeadNode_ruanJiangQianfen.prototype.loadWxHead = function(uid, url)
{
    if (!url) url = "png/default_headpic.png";
    if (uid && url) cc.loader.loadImg(url, { isCrossOrigin: true }, function(err, texture) {
        if (!err && texture) {
            //使用新的事件循环机制
            MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: uid, img: texture }]);
        }
    });
};

//设置玩家掉线头像
PokerHeadNode_ruanJiangQianfen.prototype.setUserOffline=function(pl) {
    this.offLine.visible = false;
    if (pl == null) { return; }
    if (!pl.onLine) {
        var textTime = this.offLine.getChildByName("offLineTime");
        if (textTime == null) {
            textTime = new ccui.Text();
            textTime.setName("offLineTime");
            textTime.setFontSize(26);
            this.offLine.addChild(textTime)
        }

        textTime.setPosition(cc.p(this.offLine.getContentSize().width/2,this.offLine.getContentSize().height*0.8));
        this.offLine.unscheduleAllCallbacks();
        this.offLine.schedule(function(){
            if (pl.offLineTime){
                var _currentTime = new Date().getTime();
                var _showTime = _currentTime - pl.offLineTime;
                if(_showTime < 0) _showTime = 0;
                textTime.setString(MjClient.dateFormat(new Date(_showTime),"mm:ss"));
            } else {
                textTime.setString("");
            }
        });
    }
    this.offLine.visible = !pl.onLine;
};
// off 是四个位置，根据off 显示四个位置的信息
PokerHeadNode_ruanJiangQianfen.prototype.updateUserInfo = function(pl) {
    if (pl == null) {
        this.hideHeadUI();
        return;
    }

    var tData = MjClient.data.sData.tData;
    this.loadWxHead(pl.info.uid, pl.info.headimgurl);
    if(!MjClient.data.sData.tData.fieldId) {
        this.setUserOffline(pl);
        this.fangTag.visible = tData.owner == pl.info.uid;
    } else {
        this.fangTag.visible = false;
    }
    this.updateNameAndCoin(pl);

};
//显示玩家文字
PokerHeadNode_ruanJiangQianfen.prototype.showUserChat=function(off, msg)
{
    var node1=this.node.getChildByName("chatbg");
    var node=node1.getChildByName("chattext");
    var tData = MjClient.data.sData.tData;
    if(msg.type == 4 && off == 0 && tData.roundNum==tData.roundAll){ //位置截取
        var geogData = [];
        for (var i = 0; i < tData.uids.length; i++) {
            var pl = MjClient.data.sData.players[tData.uids[i]];
            if (pl && pl.locationMsg) {
                geogData.push(pl.locationMsg);
            }
        }

        if (geogData.length == tData.maxPlayer && tData.maxPlayer > 2 && MjClient.tableid != tData.tableid) {
            MjClient.tableid = tData.tableid;
            var displayCount = 0;
            for(var i=0; i<geogData.length; i++) {
                for(var j=i+1; j<geogData.length; j++){
                    var plyoneV = new Array();
                    var plytwoV = new Array();
                    plyoneV = geogData[i].split(";");
                    plytwoV = geogData[j].split(";");

                    var distance = MjClient.native.CalculateLineDistance(plyoneV[0], plyoneV[1], plytwoV[0], plytwoV[1]);
                    if( distance <= 50 && distance >=0 ) {
                        displayCount++;
                        break;
                    }
                }
                if (displayCount>0){
                    break;
                }
            }

            //当有人距离小于50米 时候提示
            if(displayCount >= 1 && !tData.matchId && !tData.fieldId)
            {
                if (tData.maxPlayer == 4)
                    MjClient.Scene.addChild(new showDistanceLayer());
                else
                    MjClient.Scene.addChild(new showDistance3PlayerLayer(tData.maxPlayer));
            }
        }
        return;
    }

    var pl = getUIPlayer(off);
    var type = msg.type;
    var message = msg.msg;
    var num = msg.num;

    if(pl && msg.uid == pl.info.uid){
        if(type == 0){
            node.getParent().visible = true;
            node.setString(message);
            var callback = function(){
                node.getParent().visible = false;
            };

            node.getParent().width = node.getString().length * node.getFontSize() + 72;
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        } else if(type == 1) {
            node.getParent().visible = true;
            var text = message.text;
            node.setString(text);
            var callback = function() {
                node.getParent().visible = false;
            };

            var musicnum = msg.num + 1;
            node.getParent().width = node.getString().length * node.getFontSize() + 72;

            message.voiceType = 0;//产品要求改
            var voiceType = message.voiceType == 0 ? "normal" : MjClient.gameType;
            if(cc.sys.isObjectValid(MjClient.playui) && MjClient.playui.__proto__.getCahtText) {
                voiceType = MjClient.gameType;
            }
            if(GameSound4Chat[voiceType]){
                playEffect(GameSound4Chat[voiceType][getRandomRange(0,GameSound4Chat[voiceType].length-1)] + musicnum, false, pl.info.sex);
            }
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        } else if(type == 2) {
            var em_node = node.getParent().getParent().getChildByName("emoji");
            PlayEmojiAct(em_node, msg.num);
        } else if(type == 3) { //播放录音
            playRecord(node, num, message);
        }
        else if (type == 5) // 转运道具
        {
            var em_node = node.getParent().getParent().getChildByName("emoji");
            playZhuanYunPropAct(em_node, msg.num);
        }
    }
}

//显示玩家文字
PokerHeadNode_ruanJiangQianfen.prototype.updateScores=function(totalFenData,zhuaFenData,xiFenData,totalXiFenData) {
    this.updateTotalFen(totalFenData);
    this.updateZhuaFen(zhuaFenData);
    this.updateXiFen(xiFenData);
    this.updateTotalXiFen(totalXiFenData);
}
PokerHeadNode_ruanJiangQianfen.prototype.updateTotalFen = function(totalFenData) {
    this.textCoin.setString(totalFenData?totalFenData:0);
}
PokerHeadNode_ruanJiangQianfen.prototype.updateZhuaFen = function(zhuaFenData) {
    this.score_fen.setString(zhuaFenData?zhuaFenData:0);
}
PokerHeadNode_ruanJiangQianfen.prototype.updateXiFen = function(xiFenData) {
    this.score_xifen.setString(xiFenData?xiFenData:0);
}
PokerHeadNode_ruanJiangQianfen.prototype.updateTotalXiFen = function(totalXiFenData) {
    this.score_totalxifen.setString(totalXiFenData?totalXiFenData:0);
}
PokerHeadNode_ruanJiangQianfen.prototype.showScoreMoveAni =function(score,centerPos,totalFenData,zhuaFenData) {
    if(score == 0) { return; }
    var flyScorePos = this.flyScore.getPosition();
    this.flyScore.visible = true;
    this.flyScore.setString("+"+score+"分");
    this.flyScore.setOpacity(0);
    var centerPos2= this.node.convertToNodeSpace(cc.p(centerPos.x,centerPos.y));
    this.flyScore.setPosition(cc.p(centerPos2.x,centerPos2.y+80));
    this.flyScore.runAction(cc.sequence(
        cc.fadeIn(0.5),
        cc.MoveTo(1, flyScorePos),
        cc.fadeOut(1),
        cc.callFunc(function(){
            this.updateTotalFen(totalFenData);
            this.updateZhuaFen(zhuaFenData);
        }.bind(this))
        ));
};

