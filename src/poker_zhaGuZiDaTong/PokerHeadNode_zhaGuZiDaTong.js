/**
 *  大同扎股子头像
 */
var PokerHeadNode_daTongZhaGuZi = cc.Node.extend({
    node: null,
    ctor: function(off) {
        this._super();
        // 加载csb资源 断线重连不走 构造函数需把这部分独立出来
        var  csbNode = ccs.load("zhaGuZiDaTong_HeadNode.json");
        this.node = csbNode.node;
        this.initHeadUI(off);
        this.initHeadTouch(off);
        this.createFangIcon();
        this.seticonJiaZhuType(-1,true);
        // this.setJiaBeiIcon(false);
        this.updateNameAndCoin();
        this.showCurrentLeftCardCount();
        this.showFlowerOf3Panel();
    }
});
PokerHeadNode_daTongZhaGuZi.prototype.initHeadUI = function(off)
{
    this.node.getChildByName("zhuang").visible=false;
    this.bgScore =  this.node.getChildByName("score_bg");
    this.textCoin = this.node.getChildByName("coin");
    this.textCoin.ignoreContentAdaptWithSize(true);
    this.textCoin.setScale(1.2);
    this.bgName = this.node.getChildByName("name_bg")
    this.bgName.zIndex=101;
    this.textName = this.node.getChildByName("name");
    this.textName.zIndex=103;
    this.textName.setScale(1.5);
    this.textName.ignoreContentAdaptWithSize(true);

    this.offLine = this.node.getChildByName("offline");
    this.offLine.zIndex = 99;
    this.iconJiaZhuType = this.node.getChildByName("iconJiaZhuType");
    this.nodeCardCount = this.node.getChildByName("tingCard");
    this.emoji = this.node.getChildByName("emoji");
    this.chatbg = this.node.getChildByName("chatbg");

    this.flowerOf3Panel = this.node.getChildByName("flowerOf3Panel");
    this.fangkuai = this.flowerOf3Panel.getChildByName("fangkuai");
    this.meihua = this.flowerOf3Panel.getChildByName("meihua");
    this.hongtao = this.flowerOf3Panel.getChildByName("hongtao");
    this.heitao = this.flowerOf3Panel.getChildByName("heitao");

    if(off == 1 || off == 2)
    {
        this.iconJiaZhuType.setPositionX(-90.5);
        this.nodeCardCount.setPositionX(-93);
    }
   else {
        this.iconJiaZhuType.setPositionX(89.5);
        this.nodeCardCount.setPositionX(86.7);
    }

    this.chatbg.setPositionX(((off == 1 || off == 2) ?-90:89));
    this.chatbg.setAnchorPoint(((off == 1 || off == 2)?1:0),0.5);
    var tmp="playing/other/";
    this.chatbg.loadTexture(((off == 1 || off == 2)?(tmp+"chatbg_rd.png"):(tmp+"chatbg_ld.png")));
    if(off == 0){
        this.emoji.setPosition(108,142);
    }else if(off ==1){
        this.emoji.setPosition(-111,5);
    }else if(off ==2){
        this.emoji.setPosition(114,-10);
    } else if(off ==3){
        this.emoji.setPosition(114,-10);
    }else if(off ==4){
        this.emoji.setPosition(114,-10);
    }

}
PokerHeadNode_daTongZhaGuZi.prototype.initHeadTouch = function(off) {
    var headFrame = this.node.getChildByName("headFrame");
    headFrame.setTouchEnabled(true);
    headFrame.addTouchEventListener(function (sender,type) {
        if(type==2){
            showPlayerInfo(off,sender);
        }
    }, headFrame);
};

// 房主icon
PokerHeadNode_daTongZhaGuZi.prototype.createFangIcon = function() {
    this.fangTag = this.node.getChildByName("fangTag");
    var headFrame = this.node.getChildByName("headFrame");
    if (this.fangTag == null) {
        var sp = new cc.Sprite("playing/gameTable/fangzhu3.png");
        sp.setScale(1.2);
        sp.setPosition(headFrame.getContentSize().width/2, 21);
        sp.setAnchorPoint(1,0);
        sp.zIndex=102;
        sp.setName("fangTag");
        sp.visible=false;
        this.fangTag = sp;
        this.node.addChild(sp, 100);
    }
};

PokerHeadNode_daTongZhaGuZi.prototype.updateNameAndCoin=function(pl){
    this.bgName.visible = (pl != null);
    this.textName.visible = (pl != null);
    this.textCoin.visible = (pl != null);
    this.bgScore.visible = (pl != null);
    this.offLine.visible = false;
    if (pl == null)
    {
        return;
    }
    var strname=getNewName(unescape(pl.info.nickname ));
    this.textName.setString(strname);
    var coin = MjClient.data.sData.tData.initCoin;
    var countCopy = Number(coin+ pl.winall);
    countCopy = revise(countCopy);
    var tmpcount = countCopy<0 ? ("-"+ (-countCopy)) : countCopy;
    this.textCoin.setString(tmpcount);
};

PokerHeadNode_daTongZhaGuZi.prototype.setWxHead=function (imgUrl) {
    var nobody = this.node.getChildByName("nobody");
    var WxHead = nobody.getChildByName("WxHead");
    if(WxHead) {
        WxHead.removeFromParent();
    }
    var headSprite = new cc.Sprite(imgUrl);
    loadzhezhao(headSprite,nobody);
};

PokerHeadNode_daTongZhaGuZi.prototype.loadWxHead = function(uid, url)
{
    if (!url) url = "png/default_headpic.png";
    if (uid && url) cc.loader.loadImg(url, { isCrossOrigin: true }, function(err, texture) {
        if (!err && texture) {
            //postEvent("QueueNetMsg", ["loadWxHead", { uid: uid, img: texture }]);
            //使用新的事件循环机制
            MjClient.Scene.pushQueueNetMsg(["loadWxHead", { uid: uid, img: texture }]);
        }
    });
};

//设置玩家掉线头像
PokerHeadNode_daTongZhaGuZi.prototype.setUserOffline=function(pl) {
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
PokerHeadNode_daTongZhaGuZi.prototype.updateUserInfo = function(pl){
    if (pl == null) { return; }
    var tData = MjClient.data.sData.tData;
    this.loadWxHead(pl.info.uid, pl.info.headimgurl);
    this.setUserOffline(pl);
    this.updateNameAndCoin(pl);
    this.fangTag.visible = tData.owner == pl.info.uid;
};

// 扎股或者亮三玩家标志
 PokerHeadNode_daTongZhaGuZi.prototype.seticonJiaZhuType=function(type,isRoundEnd){
    if(isRoundEnd)
    {
        this.iconJiaZhuType.visible = false;
        return;
    }
    this.iconJiaZhuType.visible = true;
    this.iconJiaZhuType.loadTexture("playing/zhaGuZi/"+type+".png");
};
// 剩余牌数
PokerHeadNode_daTongZhaGuZi.prototype.showCurrentLeftCardCount = function(pl ){
    if (!pl || !MjClient.data.sData.tData.areaSelectMode.showHandNum) {
        this.nodeCardCount.visible = false;
        return;
    }
    this.nodeCardCount.visible = true;
    var textCount = this.nodeCardCount.getChildByName("Text_count");
    this.nodeCardCount.getChildByName("unKnow").visible = false;
    textCount.visible = true;
    textCount.setString(pl.handCount);
}


//显示玩家文字
PokerHeadNode_daTongZhaGuZi.prototype.showUserChat=function(off, msg)
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

                    var plone = getUIPlayerByUID(plyoneV[3]);
                    var _oneLatitude = plone.info.location.latitude;
                    var _oneLongitude = plone.info.location.longitude;
                    if(!_oneLatitude)  _oneLatitude = plyoneV[0];
                    if(!_oneLongitude)  _oneLongitude =  plyoneV[1];

                    var pltwo = getUIPlayerByUID(plytwoV[3]);
                    var _twoLatitude = pltwo.info.location.latitude;
                    var _twoLongitude = pltwo.info.location.longitude;
                    if(!_twoLatitude) _twoLatitude = plytwoV[0];
                    if(!_twoLongitude) _twoLongitude =  plytwoV[1];

                    var distance = MjClient.native.CalculateLineDistance(_oneLatitude, _oneLongitude, _twoLatitude, _twoLongitude);
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
            // if(displayCount >= 1 && !tData.matchId)
            // {
            //     if (tData.maxPlayer == 4)
            //         MjClient.Scene.addChild(new showDistanceLayer());
            //     else
            //         MjClient.Scene.addChild(new showDistance3PlayerLayer(tData.maxPlayer));
            // }
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
};
//显示亮出3的花色
PokerHeadNode_daTongZhaGuZi.prototype.showFlowerOf3Panel=function(pl,isRoundEnd)
{
    if (!pl || isRoundEnd ) {
        this.flowerOf3Panel.visible =false;
        this.fangkuai.visible = false;
        this.meihua.visible = false;
        this.hongtao.visible = false;
        this.heitao.visible = false;
        return;
    }
    this.flowerOf3Panel.visible =true;
    this.fangkuai.visible = false;
    this.meihua.visible = false;
    this.hongtao.visible = false;
    this.heitao.visible = false;
    var tData = MjClient.data.sData.tData;
    var jiaZhuData = tData.jiaZhuData;
    if(!jiaZhuData) return;
    var selfUid = pl.info.uid;
    var liang = jiaZhuData[selfUid].liang;
    for(var j = 0; j<liang.length; j++)
    {
        switch (liang[j]){
            case 1: this.fangkuai.visible = true;
            break;
            case 2: this.meihua.visible = true;
            break;
            case 3: this.hongtao.visible = true;
            break;
            case 4: this.heitao.visible = true;
            break;
        }
    }
}
PokerHeadNode_daTongZhaGuZi.prototype.showHead=function(pl)
{
    this.updateNameAndCoin(pl);
    if(pl == null)
    {
        var fangzhu = this.node.getChildByName('fangTag');
        var nobody = this.node.getChildByName("nobody");
        var WxHead = nobody.getChildByName("WxHead");
        if(WxHead) {
            WxHead.removeFromParent();
        }
        if(fangzhu) {
            fangzhu.visible = false;
        }
    }
}



