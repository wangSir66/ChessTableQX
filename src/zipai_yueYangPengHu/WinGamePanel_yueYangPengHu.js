
function addUserCards_yueYangPengHu(node, pl){
    //胡哪张牌
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var winPl = sData.players[tData.uids[tData.winner] + ""];
    var isWinner = false;
    var isInHand = false; //胡的牌是否在手牌
    var huCard = tData.lastPutCard;
    var huCardNode = null;
    if(winPl == pl){
        isWinner = true;
        isInHand = !pl.isHuByHand;
        if(isInHand){
            huCard = pl.mjhand[pl.mjhand.length -1];
        }
    }

    var up = node.getChildByName("up");
    var sx = up.x;
    var index = 0;
    var createCardSp = function(card, isHand){
        var sp = up.clone();
        sp.visible = true;
        sp.x = index * sp.width * sp.getScale() + sx;
        sp.loadTexture(MjClient.cardPath_yueYangPengHu + "out" + card + ".png");
        node.addChild(sp);
        if(isWinner && isInHand && isHand && card == huCard){
            huCardNode = sp;
        }else if(isWinner && !isInHand && !isHand && card == huCard){
            huCardNode = sp;
        }
        return sp;
    };
    
    var tempC = null;
    //跑
    for (var i = 0; i < pl.mjgang0.length; i++) {
        for (var j = 0; j < 4; j++) {
            var c = createCardSp(pl.mjgang0[i]);
            index += 1;
            if(j == 1){
                tempC = c;
            }
        }
        index += 1;
        var sp = new cc.Sprite("penghu/pao.png");
        sp.setAnchorPoint(cc.p(0.5, 0.5));
        sp.x = tempC.x + tempC.width * tempC.getScale() * 0.5;
        sp.y = -45;
        node.addChild(sp);
    }

    //提
    for (var i = 0; i < pl.mjgang1.length; i++) {

        for (var j = 0; j < 4; j++) {
            var c = createCardSp(pl.mjgang1[i]);
            index += 1;
            if(j == 1){
                tempC = c;
            }
        }
        index += 1;
        var sp = new cc.Sprite("penghu/ti.png");
        sp.setAnchorPoint(cc.p(0.5, 0.5));
        sp.x = tempC.x + tempC.width * tempC.getScale() * 0.5;
        sp.y = -45;
        node.addChild(sp);
    }
    //添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        for (var j = 0; j < 3; j++) {
            var c = createCardSp(pl.mjpeng[i]);
            index += 1;
            if(j == 1){
                tempC = c;
            }
        }
        index += 1;
        var sp = new cc.Sprite("penghu/peng.png");
        sp.setAnchorPoint(cc.p(0.5, 0.5));
        sp.x = tempC.x;
        sp.y = -45;
        node.addChild(sp);
    }

    //添加偎
    for (var i = 0; i < pl.mjwei.length; i++) {
        for (var j = 0; j < 3; j++) {
            var c = createCardSp(pl.mjwei[i]);
            index += 1;
            if(j == 1){
                tempC = c;
            }
        }
        index += 1;
        var sp = new cc.Sprite("penghu/wei.png");
        sp.setAnchorPoint(cc.p(0.5, 0.5));
        sp.x = tempC.x;
        sp.y = -45;
        node.addChild(sp);
    }

    //添加吃
    for (var i = 0; i < pl.mjchi.length; i++) {
        var eatCards = pl.mjchi[i].eatCards;
        for(var j = 0; j < eatCards.length; j++){
            createCardSp(eatCards[j]);
            index += 1;
        }
        index += 1;
        if(pl.mjchi[i].biCards){
            var biCardsList = pl.mjchi[i].biCards;
            for(var n = 0; n < biCardsList.length; n++){
                var arr = biCardsList[n];
                for(var j = 0; j < arr.length; j++){
                    createCardSp(arr[j]);
                    index += 1;
                }
                index += 1;
            }
        }
        
    }
    //添加手牌
    var handSort = pl.handSort;
    if(winPl != pl || !handSort){
        handSort = MjClient.majiang.sortCard(pl.mjhand);
    }
    for (var i = 0; handSort && i < handSort.length; i++) {
        var cards = handSort[i].cards;
        if(!cards){
            cards = handSort[i];
        }
        for(var j = 0; j < cards.length; j++){
            createCardSp(cards[j], true);
            index += 1;
        } 
    }

    //胡的牌标记
    if(huCardNode){
        var huMark = ccui.ImageView("playing/paohuzi/huIcon.png");
        huMark.setAnchorPoint(cc.p(1,1));
        huMark.scale = 2;
        huMark.setPosition(cc.p(huCardNode.width,huCardNode.height));
        huCardNode.addChild(huMark);
    }
}

function setGameOverPanelPlayerState_yueYangPengHu(stateNode, pl, checkCount)
{
    var fileName = "";
    if (pl.winType == 3)
    {
        fileName = "gameOver/ico_zimo.png";
    }
    else if (pl.winType > 0)
    {
        fileName = "gameOver/ico_hu-0.png";
    }

    else if (pl.winType == -1)
    {

        fileName = "gameOver/ico_dianpao.png";
    }

    if (fileName != "")
    {
        stateNode.loadTexture(fileName);
        stateNode.ignoreContentAdaptWithSize(true);
    }
    else
    {
        stateNode.visible = false;
    }
}

function SetEndOneUserUI_yueYangPengHu(node,off)
{
    var sData=MjClient.data.sData;
    var tData=sData.tData;
    var pl=MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if(!pl)return;
    node.setVisible(true);
    setUserOfflineWinGamePanel(node,pl);
    addUserCards_yueYangPengHu(node, pl);
    node=node.getChildByName("head");
    var zhuangNode = node.getChildByName("zhuang");
    var tempZhuang = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    zhuangNode.setVisible(tData.uids[tempZhuang] == pl.info.uid);
    zhuangNode.zIndex=10;

    var name = node.getChildByName("name");
    name.ignoreContentAdaptWithSize(true);

    var uibind= {
        head_bg: {
            _run: function(){
                if(pl.winone > 0)
                {
                    this.loadTexture("gameOver/di_red.png");
                }
            }
        },
        head: {
            name: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
                _text: function () {
                    var _nameStr = unescape(pl.info.nickname ) + "";
                    //this.ignoreContentAdaptWithSize(true);
                    return getNewName (_nameStr, 4);
                }
            },
            id: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return "ID:" + pl.info.uid.toString();
                }
            },

            up: {
                _visible: false
            },

            winType: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    return pl.baseWin > 0 ? ("X" + pl.baseWin) : "0";
                },
                // _run:function()
                // {
                //  if(MjClient.gameType == MjClient.GAME_TYPE.NING_BO || MjClient.gameType == MjClient.GAME_TYPE.WEN_ZHOU)
                //  this.setVisible(false);
                // }
            },
            cardType: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if (MjClient.isDismiss && !sData.players[tData.firstDel] && pl.mjdesc[1]) // 会长或管理员解散房间
                        return pl.mjdesc[1];
                    else{
                        // return pl.mjdesc + ""
                        var hzdesc = pl.hzdesc;
                        var arr = [];
                        for(var key in hzdesc){
                            if(key != "huXi" && key != "totalFan" && key != "totalTun" && key != "xing"){
                               arr.push(hzdesc[key]); 
                            }
                        }
                        return arr.join(",");
                    }
                },
            }

        }
        , winNum: {
            _run : function(){
                this.setLocalZOrder(2);
            },
            _text: function () {
                var pre = "";
                if (pl.winone > 0) pre = "+";
                return pre + pl.winone;
            }
            , hu: {
                _run: function () {
                    setGameOverPanelPlayerState_yueYangPengHu(this, pl, true);
                }
            }
            , fenshu: {
                _run:function()
                {
                    this.ignoreContentAdaptWithSize(true);
                },
            }
        }
    }
    BindUiAndLogic(node.parent,uibind);
    var pl = MjClient.getPlayerByIndex(off);
    CircularCuttingHeadImg(uibind.head._node, pl);
}

function reInitarrCardVisible_yueYangPengHu()
{
    // MjClient.arrowbkNode.setVisible(false);
    if(cc.sys.isObjectValid(MjClient.roundnumImgNode)){
        MjClient.roundnumImgNode.setVisible(false);
    }
    if(cc.sys.isObjectValid(MjClient.cardNumImgNode)){
        MjClient.cardNumImgNode.setVisible(false);
    }
}

//添加手牌
function addWinMjHand_yueYangPengHu(_node,off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    //fix by 千千
    var pl = getUIPlayer_yueYangPengHu(off);
    var copyMjhand = pl.mjhand.concat();
    // 胡家手牌 去掉桌面当前展示牌
    if (tData.currCard != -1 && tData.winner != -1 && pl.info.uid == tData.uids[tData.winner]) {
        copyMjhand.pop();
    }

    var sortArr = MjClient.majiang.sortHandCardSpecial(copyMjhand);
    //end

    //根据牌的类型获得需要添加的节点
    var cardNode = _node.getChildByName("card");
    for(var i = 0;i < sortArr.length;i++){
        var cardParent = new cc.Node();
        if (_node.getName() == "rightPanel"){
            cardParent.x = _node.width - i * cardNode.width;
            cardParent.y = _node.height;
        }else if (_node.getName() == "leftPanel"){
            cardParent.x = i * cardNode.width;
            cardParent.y = _node.height;
        }else if (_node.getName() == "xingPanel"){
            cardParent.x = _node.width - i * cardNode.width;
            cardParent.y = 0;
        }
        _node.addChild(cardParent);

        cc.log("winGame_ZPLYPHZ@@@");
        var childSort = sortArr[i];
        for(var j = 0;j < childSort.length;j++){
            var card = childSort[j];
            var clone = cardNode.clone();
            clone.visible = true;
            clone.loadTexture(MjClient.cardPath_yueYangPengHu +"out" + card +".png");
            var off_y = 0;
            if(_node.getName() == "rightPanel"){
                off_y = clone.height;
                clone.anchorX = 1;
                clone.anchorY = 0;
            }else if(_node.getName() == "leftPanel"){
                off_y = clone.height;
                clone.anchorX = 0;
                clone.anchorY = 0;
            }else if(_node.getName() == "xingPanel"){
                off_y = clone.height;
                clone.anchorX = 1;
                clone.anchorY = 0;
            }

            //          if(_node.getName() == "rightPanel"){
            //  off_y = -clone.height;
            //  clone.anchorX = 1;
            //  clone.anchorY = 1;
            // }else if(_node.getName() == "leftPanel"){
            //  off_y = -clone.height;
            //  clone.anchorX = 0;
            //  clone.anchorY = 1;
            // }else if(_node.getName() == "xingPanel"){
            //              off_y = clone.height;
            //              clone.anchorX = 1;
            //              clone.anchorY = 0;
            //          }

            clone.zIndex = j;
            clone.x = 0;
            clone.y = ( j -2 - 54 /42)* off_y;
            cardParent.addChild(clone);
        }
    }
}

var EndOneView_yueYangPengHu = cc.Layer.extend({
    jsBind:{
        block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            _run:function () {
                MjClient.endoneui.block = this;
            },
        },
        back:{
            _layout:[[1,1],[0.538,0.5],[-0.035,0]],
            _run:function () {
                MjClient.endoneui.resultPanel = this;
            },
            wintitle:
            {
                _visible:function(){
                      var pl=getUIPlayer(0);
                      if(pl)
                      {
                          //playEffect("win");
                          return pl.winone >=1;
                      }
                      return false;
                }
            },losetitle:
            {
                _visible:function(){
                      var pl=getUIPlayer(0);
                      if(pl)
                      {
                          //playEffect("lose");
                          return pl.winone <0;
                      }
                      return false;
                }
            },pingju:
            {
                _visible:function(){

                      var pl=getUIPlayer(0);
                      
                      if(pl)
                      {
                          //playEffect("lose");
                          return pl.winone==0;
                      }
                      return false;
                },_run:function()
                {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (MjClient.isDismiss)
                    {
                        this.loadTexture("gameOver/jiesan.png");
                    }
                    else if(MjClient.CheckPlayerCount(function(p){ if(p.winone==0){return true;} return false;}) == tData.maxPlayer)
                    {
                        if(isRealHuangZhuang()) this.loadTexture("gameOver/huangzhuan_35.png");
                    }

                }
            }
            ,
            delText:
            {
                _run: function() {
                    if (MjClient.isDismiss) {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        var id = tData.firstDel;
                        var pl = sData.players[id];
                        var delStr = "";
                        if(pl) {
                            var name  =  unescape(pl.info.nickname);
                            delStr = name + pl.mjdesc[0]; 
                        } else {
                            pl = getUIPlayer(0);
                            if (pl)
                                delStr = pl.mjdesc[0];
                        } 
                        this.setString(delStr);
                    } else {
                        this.setString("");
                    }
                }
            },
            info: // 左上角
            {
                _visible:true,
                _text: function () {
                    return getPlayingRoomInfo(5);
                }
            },
            dir:  // 右下角
            {
                _visible:true,
                _text: function () {
                    return getPlayingRoomInfo(0);
                }
            },
            head0:{
                head:{
                    zhuang:{_visible:false}
                },
                winNum:{
                },
               _run:function(){ SetEndOneUserUI_yueYangPengHu(this,0); },
               
            }
            ,head1:{ 
               head:{
                   zhuang:{_visible:false}
               },
               winNum:{
                   // _layout:[[0.08,0.08],[1,0.5],[-2.5,0.75]]
               },
              _run:function(){ SetEndOneUserUI_yueYangPengHu(this,1); }
            }
            
            ,head2:{ 
               head:{
                   zhuang:{_visible:false}
               },
               winNum:{
                   // _layout:[[0.08,0.08],[1,0.5],[-2.5,-0.75]]
               },
               _run:function(){ SetEndOneUserUI_yueYangPengHu(this,2); }
            }
            ,head3:{
                 head:
                 {
                    zhuang:{_visible:false}
                 },
                 winNum:{
                     // _layout:[[0.08,0.08],[1,0.5],[-2.5,-2.25]]
                 },
                _run:function(){ SetEndOneUserUI_yueYangPengHu(this,3); }
                },
            count_down:{
                _visible :function()
                {
                    var tData = MjClient.data.sData.tData;
                    return tData.matchId;
                },
                _run:function()
                {
                    schedulLoadTexture(this);
                }
            }
        },
        switchBtn: {
            _run: function(){
                setWgtLayout(this, [377/1280, 0],[0.1499, 0.0481],[0, 0]);
            },
            buttonBg: {
                _run: function () {
                    MjClient.endoneui.switchButtonBg = this;
                }
            },
            resultShow: {
                _click: function (btn, eT) {
                    MjClient.endoneui.switchButtonBg.x = btn.x;
                    MjClient.endoneui.block.visible = true;
                    MjClient.endoneui.playerPanel.visible = false;
                    MjClient.endoneui.resultPanel.visible = true;
                }
            },
            playShow: {
                _click: function (btn, eT) {
                    MjClient.endoneui.switchButtonBg.x = btn.x;
                    MjClient.endoneui.block.visible = false;
                    MjClient.endoneui.playerPanel.visible = true;
                    MjClient.endoneui.resultPanel.visible = false;
                }
            }
        },
        share:{
            _run: function(){
                setWgtLayout(this, [213/1280, 0],[0.39, 0.0457],[0, 0]);
            },
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
                setWgtLayout(this, [213/1280, 0],[0.61, 0.0457],[0, 0]);
                if(MjClient.remoteCfg.guestLogin)
                {
                    setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0]);
                }
            },
            _click:function(btn,eT)
            {
                postEvent("clearCardUI");
                postEvent("clearCardArr");
                MjClient.endoneui.gameMain = null;
                MjClient.endoneui.removeFromParent(true);
                MjClient.endoneui = null;
                var sData=MjClient.data.sData;
                var tData=sData.tData;
                if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                    MjClient.replayui.replayEnd();
                }else {
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJPass"
                    });
                }

                if (MjClient.endallui)
                {
                    MjClient.endallui.setVisible(true);
                }
                reInitarrCardVisible_yueYangPengHu();
            }
        },
        main:{
            _layout:[[0,1],[0.5,0.5],[0,0],true],
            _run:function(){
                MjClient.endoneui.playerPanel = this;
                this.setTouchEnabled(true);
                // 跑胡非胡玩家处理 去掉展示牌(已经在胡家吃牌中)
                var sData = MjClient.data.sData;
                var tData = sData.tData;

                function delPutCard(){
                    for(var i = 0; i < 4; i++){
                        var node = getNode_paohuzi(i);
                        if(node){
                            var put = node.getChildByName("put");
                            if (put) {
                                put.visible = false;
                            }
                        }
                    }
                }

                if (tData.winner != -1 && tData.uids[tData.winner] != SelfUid()) {
                    var huPl = sData.players[tData.uids[tData.winner]];
                    if (huPl.mjgang0.indexOf(tData.lastPutCard) >= 0) {
                        delPutCard();
                    }
                }
            },
            diPai:{
                title:{
                    _visible:false
                },
                _run:function(){
                    var sData = MjClient.data.sData;
                    var tData = sData.cards;
                    if(tData.winner == -1){
                        return;
                    }

                    var cards = sData.cards;
                    if(tData.cardNext < cards.length){
                        var size = this.getContentSize();
                        var cardObj = this.getChildByName("card");
                        var totalWidth = cardObj.width * (cards.length - tData.cardNext);
                        var width20Cards = cardObj.width * 20;
                        var startPos = cc.p((size.width - totalWidth)/2 + cardObj.width/2,size.height/2);
                        if((cards.length - tData.cardNext) > 20){
                            startPos = cc.p((size.width - width20Cards)/2 + cardObj.width/2,size.height/2);
                        }
                        var nameImg = this.getChildByName("title");
                        nameImg.visible = true;
                        nameImg.setPosition(cc.p(startPos.x - nameImg.width/2,startPos.y));

                        for(var i = tData.cardNext;i < cards.length;i++){
                            var card = cards[i];
                            var cloneCard = cardObj.clone();
                            cloneCard.visible = true;
                            cloneCard.loadTexture(MjClient.cardPath_yueYangPengHu+"out" + card +".png");
                            var cardPos = cc.p(0, 0);
                            if(i < tData.cardNext + 20){
                                cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext), startPos.y);
                            }else {
                                cardPos = cc.p(startPos.x + cloneCard.width*(i - tData.cardNext - 20), -startPos.y+15);
                            }
                            cloneCard.setPosition(cardPos);
                            this.addChild(cloneCard);
                        }
                    }
                }
            },
            leftPanel:{
                _run:function(){
                    if(MjClient.rePlayVideo != -1){
                        this.visible = false;
                        return;
                    }
                    if(MjClient.data.sData.tData.maxPlayer == 2){
                        addWinMjHand_yueYangPengHu(this, changeUIOff_yueYangPengHu(1));
                    }else{
                        addWinMjHand_yueYangPengHu(this, changeUIOff_yueYangPengHu(3));
                    }
                    
                }
            },
            rightPanel:{
                _run:function(){

                    if(MjClient.rePlayVideo != -1 || MjClient.data.sData.tData.maxPlayer < 3){
                        this.visible = false;
                    }
                    addWinMjHand_yueYangPengHu(this, changeUIOff_yueYangPengHu(2));
                }
            },
            xingPanel:{
                _run:function(){
                    if(MjClient.rePlayVideo != -1 || MjClient.data.sData.tData.maxPlayer < 4){
                        this.visible = false;
                        return;
                    }
                    addWinMjHand_yueYangPengHu(this, changeUIOff_yueYangPengHu(1));
                }
            }
        },
    },
    ctor:function () {
        this._super();
        var endoneui = ccs.load("endOne_yueYangPengHu.json");
        MjClient.endoneui=this;
        if (MjClient.playui.getCardFilePath) {
            //兼容新版
            MjClient.cardPath_yueYangPengHu = MjClient.playui.getCardFilePath();
        }
        BindUiAndLogic(endoneui.node,this.jsBind);
        this.addChild(endoneui.node);

        //时间
        var _back = endoneui.node.getChildByName("back");
        var _time =  _back.getChildByName("time");
        _time.visible = true;
        _time.setString(MjClient.roundEndTime);

        

        changeMJBg(this, getCurrentMJBgType());

        this.showDiPai(_back);
        
        return true;
    },

    // 显示麻将小结算底牌
    showDiPai : function (_back) {
        var dipaiListView = _back.getChildByName("dipaiListView");
        var dipaiItem = _back.getChildByName("dipaiImg");
        var dipai = MjClient.data.sData.cards;

        var cardNext = MjClient.data.sData.tData.cardNext;
        var allCount = MjClient.majiang.cardsCount(MjClient.data.sData);
        if (dipai) {
            for (var i = cardNext; i < allCount; i ++) {
                var cardNum = dipai[i];
                var cloneCard = dipaiItem.clone();
                cloneCard.loadTexture(MjClient.cardPath_yueYangPengHu + "out" + cardNum + ".png");
                dipaiListView.pushBackCustomItem(cloneCard);
            }
            dipaiListView.forceDoLayout();
        }
        dipaiItem.setVisible(false);
    }
});