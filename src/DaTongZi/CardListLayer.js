var daTongZi = daTongZi || {};


daTongZi.CardThrowListLayer = cc.Node.extend({
    /**
     * @type {ui.LayoutNode}
     */
    _layerNode : null,
    ctor : function () {
        this._super();
        this.setContentSize(218,135);

        this._layerNode = new daTongZi.LayoutNode();
        this._layerNode.setScale(0.5);
        this.addChild(this._layerNode);

        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_baodan);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_dtz_dizha);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_feiji);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_liandui);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_zhadan);

        //test
        // var list = [];
        // for(var i = 0; i < 8; i++){
        //     list.push(115);
        // }
        // this.showCards(list,1);
    },

    setCardsAnchorPoint : function(ax, ay){
        this._layerNode.setAnchorPoint(ax,ay);
    },

    /**
     * 显示牌
     * @param list 牌数据
     * @param isLocal 是否自己本地出牌
     */
    showCards : function (list, sex, isLocal) {
        isLocal = isLocal === undefined ? false : isLocal;

        // list = [105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105];
        this._sex = sex;
        this.unscheduleAllCallbacks();
        this._layerNode.removeAllChildren();
        var len = list.length;

        var tData = MjClient.data.sData.tData;
        var flg = MjClient.majiang.isFeiJi(list, tData.areaSelectMode, tData.deckNum, tData.hasWings);
        var isSZ = MjClient.majiang.isSanZhang(list, tData.deckNum, tData.hasWings);
        if(flg || isSZ) {
            var feiJiObj; 
            if(isSZ){
                feiJiObj = MjClient.majiang.splitSanZhang(list, MjClient.data.sData.tData.deckNum); 
            }else{
                feiJiObj = MjClient.majiang.splitFeiJi(list, tData.areaSelectMode, tData.deckNum, tData.hasWings, tData.bodyLen); 
            }
            //bocy
            var len = feiJiObj.body.length;
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = feiJiObj.body[i];
                var card = new daTongZi.Card(info);
                card.setStatus(daTongZi.CardStatus.UNHOOD);
                this._layerNode.addChild(card);
            }

            //中间占个坐
            var card = new daTongZi.Card({type:105});
            card.setStatus(daTongZi.CardStatus.UNHOOD);
            card.visible = false;
            this._layerNode.addChild(card);

            //wing
            var len = feiJiObj.wing.length;
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = feiJiObj.wing[i];
                var card = new daTongZi.Card(info);
                card.setStatus(daTongZi.CardStatus.GRAY);
                card.setGaryAlpha(255 * 0.4);
                this._layerNode.addChild(card);
            }

            len = feiJiObj.body.length + feiJiObj.wing.length + 1;

        }else{
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = list[i];
                var card = new daTongZi.Card(info);
                card.setStatus(daTongZi.CardStatus.UNHOOD);
                this._layerNode.addChild(card);
            }
        }

        var c = 21;
        if(len < 21){
            c = len;
        }
        var r = Math.ceil(len / c);
        this._layerNode.doLayoutGrid(r,c,-70,-70); 
        // this._layerNode.setAnchorPoint(0,0);
        this._layerNode.x = 0;

        this.playSound(list, this._sex, isLocal);
    },

    hideCards : function () {
        this._layerNode.removeAllChildren();
    },
    /**
     * 播放效果
     */
    playSound : function (cards, sex, isLocal) {
        isLocal = isLocal === undefined ? false : isLocal;

        var tData = MjClient.data.sData.tData;
        var type;
        if(isLocal){
            type = MjClient.majiang.getCardType(cards, tData.areaSelectMode, tData.deckNum, tData.hasWings);
        }else{
            type = tData.lastPutCardType;
        }
        
        var cardVal = cards[0] % 100; 

        cc.log("playSound:cards:", cards);
        cc.log("playSound:deckNum:", MjClient.data.sData.tData.deckNum);
        cc.log("playSound:type:", type);

        var url = "datongzi/nv/";
        switch (type){
            case daTongZi.CARD_TYPE.danZhang:
                url += cardVal;
                // playEffect(url, false, sex);
                break;
            case daTongZi.CARD_TYPE.duiZi:
                url += cardVal + "d";
                // playEffect(url, false, sex);
                break;
            case daTongZi.CARD_TYPE.lianDui:
                url += "double_line";
                // playEffect(url, false, sex);

                this._showEffect("liandui_", 17);

                break;
            case daTongZi.CARD_TYPE.sanZhang:
                var obj = MjClient.majiang.analyzeSanZhang(cards);
                cardVal = obj.body;
                url += cardVal + "t";
                // playEffect(url, false, sex);
                break;
            case daTongZi.CARD_TYPE.feiJi:
                url += "wing";
                // playEffect(url, false, sex);

                this._showFeiJiEffect("feiji_", 8, 0.1, 2);
                break;
            case daTongZi.CARD_TYPE.zhaDan:
                
                if(cards.length > 10){
                    url += "zhaDan_ty";
                }else{
                    url += cards.length + "bomb";
                }
                
                // playEffect(url, false, sex);

                // this._showEffect("zhadan_", 23);
                this._showEffect("zhadan_", 15, undefined, undefined, 9);
                break;
            case daTongZi.CARD_TYPE.tongZi:
                url += cardVal + "tongzi";
                // playEffect(url, false, sex);
                this._showTongZiEffect();
                break;
            case daTongZi.CARD_TYPE.diZha:
                url += "diZha";
                // playEffect(url, false, sex);
                // this._showEffect("dtz_dizha_", 13);
                
                this._doDiZhaeffect();
                break;
            case daTongZi.CARD_TYPE.xi:
                url += cardVal + "Xi";
                // playEffect(url, false, sex);
                this._showXiEffect();
                break;
        }
    },

    _doDiZhaeffect : function(){
        var index = 0;
        var count = 0;
        var tID = setInterval(function(){
            count += 1;
            if(count < 5){
                return;
            }

            count = 0;
            if(index >= 3){
                clearInterval(tID);
                return;
            }
            this._showDiZhaEffect(index);
            index += 1;
        }.bind(this), 50);
    },

    _showDiZhaEffect : function(index){
        var tag = 20183140 + index;
        var sp = MjClient.Scene.getChildByTag(tag);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent();
            sp = null;
        }

        var sp = new cc.Sprite("daTongZi/effect/dz/0.png");
        sp.setScale(this.getScale());
        sp.setTag(tag);
        MjClient.Scene.addChild(sp);
        if(index == 0){
            setWgtLayout(sp, [382/1280, 0], [0.55, 0.60], [0,0]);
        }else if(index == 1){
            setWgtLayout(sp, [382/1280, 0], [0.45, 0.70], [0,0]);
        }else{
            setWgtLayout(sp, [382/1280, 0], [0.65, 0.65], [0,0]);
        }

        var ac = createAnimation("daTongZi/effect/dz/",14,cc.rect(0, 0,382,278),0.1);
        var cb = cc.callFunc(function () {
            sp.removeFromParent();
        },this);
        sp.runAction(cc.sequence([ac,cc.delayTime(0.1),cb]))
    },

     _showXiEffect : function(){
        var sp = MjClient.Scene.getChildByTag(2018314);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent();
            sp = null;
        }

        var sp = new cc.Sprite("daTongZi/effect/xi/xi1.png");
        sp.setScale(this.getScale());
        sp.setTag(2018313);
        MjClient.Scene.addChild(sp);
        setWgtLayout(sp, [306/1280, 0], [0.5, 0.5], [0,0]);

        var ac = createAnimation("daTongZi/effect/xi/xi",16,cc.rect(0, 0,306,475),0.05);
        var cb = cc.callFunc(function () {
            sp.removeFromParent();
        },this);
        sp.runAction(cc.sequence([ac,cc.delayTime(0.1),cb]))
    },

    _showTongZiEffect : function(){
        var sp = MjClient.Scene.getChildByTag(2018313);
        if(sp && cc.sys.isObjectValid(sp)){
            sp.stopAllActions();
            sp.removeFromParent();
            sp = null;
        }

        var sp = new cc.Sprite("daTongZi/effect/tz/tz1.png");
        // sp.setAnchorPoint(0.5,0.5);
        sp.setScale(this.getScale());
        sp.setTag(2018313);
        MjClient.Scene.addChild(sp);
        setWgtLayout(sp, [715/1280, 0], [0.5, 0.7], [0,0]);

        var ac = createAnimation("daTongZi/effect/tz/tz",38,cc.rect(0, 0,715,317),0.05);
        var cb = cc.callFunc(function () {
            sp.removeFromParent();
        },this);
        sp.runAction(cc.sequence([ac,cc.delayTime(0.5),cb]))
    },

    _showFeiJiEffect : function(preName, len, delaytime, playCount){
        var sp = new cc.Sprite("#" + preName + (len - 1) +".png");
        sp.setAnchorPoint(0,0);
        // sp.y = this._layerNode.height;
        // sp.x = this._layerNode.width * 0.5 + 20;
        MjClient.Scene.addChild(sp);
        setWgtLayout(sp, [sp.width/1280, 0], [1, 0.5], [0,0]);
        sp.y = this.y + (this._layerNode.height * 0.5) * this.width/1280;

        var ac = this._getAnimate(preName, len, delaytime, playCount);
        var mtAc = cc.moveTo(2, cc.p(0 - sp.width * sp.getScale(), sp.y));
        var spawn = cc.spawn(ac, mtAc);
        var cb = cc.callFunc(function () {
            sp.removeFromParent();
        },this);
        sp.runAction(cc.sequence([spawn,cb]))
    },

    _showEffect : function(preName, len, delaytime, playCount, startIndex){
        var sp = new cc.Sprite("#" + preName + (len - 1) +".png");
        sp.setAnchorPoint(0.5,0.5);
        sp.y = this._layerNode.height * 0.5;
        sp.x = this._layerNode.width * 0.5 + 20;
        this._layerNode.addChild(sp);

        var ac = this._getAnimate(preName, len, delaytime, playCount, startIndex);
        var cb = cc.callFunc(function () {
            sp.removeFromParent();
        },this);
        sp.runAction(cc.sequence([ac,cb]))
    },

    _getAnimate : function(preName, len, delaytime, playCount, startIndex){
        playCount = playCount === undefined ? 1 : playCount;
        delaytime = delaytime === undefined ? 0.1 : delaytime;
        startIndex = startIndex === undefined ? 1 : startIndex;

        var arry = [];
        for(var i = startIndex; i <= len; i++)
        {
            var frame = cc.spriteFrameCache.getSpriteFrame(preName + i + ".png");
            if(frame)
            {
                arry.push(frame);
            }
        }
        return cc.animate(new cc.Animation(arry, delaytime, playCount));
    }
});

daTongZi.TrustLayer = ccui.Widget.extend({
    _cancelBtn : null,
    ctor : function(){
        this._super();

        this.setTouchOpen(true);
        this._initUI();
    },

    setTouchOpen : function(flg){
        this.setTouchEnabled(flg);
        this.setSwallowTouches(flg);
    },

    _initUI : function(){
        this.setContentSize(1280, 350);
        var bg = new cc.Sprite("daTongZi/playing/trustBg.png");
        bg.setAnchorPoint(0.5,0.5);
        bg.x = this.width * 0.5;
        bg.y = this.height * 0.5;
        this.addChild(bg);

        var btn = new ui.Button("daTongZi/playing/cancelTuoguan.png", null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._cancelTrust, this);
        btn.x = this.width * 0.5;
        btn.y = this.height * 0.5;
        this.addChild(btn);

        var tipTxt = new cc.Sprite("daTongZi/playing/tuoguanDesc.png");
        tipTxt.x = btn.x;
        tipTxt.y = btn.y - btn.height * 0.5 - 20;
        this.addChild(tipTxt);
    },
    _cancelTrust : function (sender, eventType){
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "TZCancelTrust"
        });
    }
});


daTongZi.CardListLayer = cc.Node.extend({

    /**
     * 牌信息列表
     * @type Array.<daTongZi.CardInfo>
     */
    _list : null,
    /**
     * 卡牌列表
     * @type Array.<daTongZi.Card>
     */
    _cardsList : null,

    /**
     * 临时选择的卡牌列表
     * @type Array.<daTongZi.Card>
     */
    _selectCardsList : null,

    /**
     * 移动方向 1 向右 －1 向左
     */
    _moveDir : 0,

    /**
     * 牌之间的距离
     */
    _gap : 45,

    /**
     * 提示按钮
     * @type ui.Buttons
     */
    _tipBtn : null,

    /**
     * 出牌按钮
     * @type ui.Button
     */
    _chuBtn : null,

    /**
     * 出牌按钮
     * @type ui.Button
     */
    _buChuBtn : null,

    _isTouchOpen : true,

    _cardsNode : null,

    /**
     * 每行最大的牌数
     * @type 
     */
     _rowNum : 23,

     //托管层
     _trustLayer : null,

    ctor : function () {
        this._super();
        this.setContentSize(1280, 720);
        this._list = [];
        this._cardsList = [];
        this._selectCardsList = [];
        this._addTouchEvent();

        this._initUI();
    },

    /**
     * 设置指定卡牌以外牌不可点
     * @param list
     */
    unTouchCards : function () {

        this.showFaceAllCards();

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[MjClient.data.pinfo.uid];
        var cards = tData.lastPutCard;
        var type = tData.lastPutCardType;
        var cardTypes = MjClient.majiang.getDisabledList(pl.mjhand, cards, type, tData.areaSelectMode, tData.deckNum, tData.hasWings, tData.bodyLen);
        cc.log("hand:", pl.mjhand);
        cc.log("cards:", cards);
        cc.log("type:", type);
        cc.log("unTouchCards:", cardTypes);

        if(cardTypes.length >= this._list.length && tData.areaSelectMode.isBiChu){
            this.showBtnNode(false);
        }
        return; //暂时取消变灰功能
        
        for(var i = 0; i < this._cardsList.length; i++){
            var c = this._cardsList[i];
            var flg = this._hasTypeInArr(c.getInfo().type, cardTypes);
            if(flg){
                c.setStatus(daTongZi.CardStatus.GRAY);
                var ty = c.row * c.rowGap;
                c.isSelected = false;
                c.isMark = false;
                c.y = ty;
            }
        }
    },

    _hasTypeInArr : function (type, arr) {
        var len = arr.length;
        for(var i = 0; i < len; i++){
            if(type == arr[i]){
                return true;
            }
        }
        return false;
    },

    _initUI : function () {
        var node = new daTongZi.LayoutNode();

        var btn = new ui.Button("playing/paodekuaiTable/buchu.png", null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._buChuBtn = btn;

        var btn = new ui.Button("playing/paodekuaiTable/tishi.png",null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._tipBtn = btn;

        var btn = new ui.Button("playing/paodekuaiTable/chupai.png",null, "playing/paodekuaiTable/chupai_2.png", ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._chuBtn = btn;
        this._chuBtn.setBright(false);
        this._chuBtn.setIsTouchEnable(false);

        node.doLayoutGrid(1,3,50,0);
        node.setAnchorPoint(0.5,0);
        node.x = this.width * 0.5;
        node.y = 200;
        this.addChild(node);
        this._btnNode = node;
        this._btnNode.visible = false;

        //托管
        this._trustLayer = new daTongZi.TrustLayer();
        this._trustLayer.setAnchorPoint(0.5,0.5);
        this._trustLayer.x = this.width * 0.5 - 63;
        this._trustLayer.y = 80;
        this.addChild(this._trustLayer,100);
        this.setTrust(false);
    },

    /**
     * 设置托管
     * @param isTrust 是否托管
     */
    setTrust : function(isTrust){
        this._trustLayer.visible = isTrust;
        this._trustLayer.setTouchOpen(isTrust);
    },

    upBtnNode : function () {
        var len = 3;
        this._buChuBtn.visible = true;
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(!tData) return;


        if(tData.maxPlayer == 3 || (tData.maxPlayer == 2 && tData.areaSelectMode.isBiChu))
        {
            this._buChuBtn.visible = false;
            len = 2;
        }
        this._btnNode.doLayoutGrid(1,len,50,0);
        if(len == 2){
            // this._chuBtn.x = this._buChuBtn.x;
            this._chuBtn.x = this._tipBtn.x;
            this._tipBtn.x = this._buChuBtn.x;
            this._btnNode.x = this.width * 0.5 - 60;
        }else{
            this._btnNode.x = this.width * 0.5 - 60;
        }
    },

    showBtnNode : function (flg, isTrust) {
        if(MjClient.rePlayVideo !== -1){
            this._btnNode.visible = false;
            return;
        }

        isTrust = isTrust === undefined ? false : isTrust;
        this._btnNode.visible = flg && !isTrust;
        if(flg){
            this.unTouchCards();
            // this._unSelectAllCards();
            this._tipList = null;
            this._tipIndex = 0;

            var sData = MjClient.data.sData;
            var tData = sData.tData;
            cc.log("showBtnNode:" + tData, tData.lastPutPlayer);
            if(!tData || tData.lastPutPlayer < 0){
                this._buChuBtn.setIsTouchEnable(false);
                this._buChuBtn.setBright(false);
            }else{
                var uid = tData.uids[tData.lastPutPlayer];
                cc.log("showBtnNode uid:" + uid, "self uid:" + MjClient.data.pinfo.uid);
                if(uid == MjClient.data.pinfo.uid || !MjClient.data.sData.tData.lastPutCard){
                    this._buChuBtn.setIsTouchEnable(false);
                    this._buChuBtn.setBright(false);
                }else{
                    
                    this._buChuBtn.setIsTouchEnable(true);
                    this._buChuBtn.setBright(true);
                    // if(tData.lastPutCard){
                    //     var pl = sData.players[MjClient.data.pinfo.uid];
                    //     var cards = tData.lastPutCard;
                    //     var type = tData.lastPutCardType;
                    //     var flg = MjClient.majiang.canBeat(pl.mjhand, cards, type, tData.deckNum, tData.hasWings, tData.bodyLen);
                    //     if(!flg){
                    //         MjClient.showToast("你没有牌大过上家");
                    //     }
                    // } 
                }
            }

            if(tData.areaSelectMode.isBiChu){
                this._buChuBtn.setIsTouchEnable(false);
                this._buChuBtn.setBright(false);
            }


            this.upBtnNode();
            this._checkBtnStatus();
        }else{
            this._tipList = null;
            this._tipIndex = 0;
            this._unGrayAllCards();
        }
    },

    _tipIndex : 0,
    /**
     * 获取可以大过当前牌型的牌一种组合
     * @return {Array.<daTongZi.CardInfo>}
     */
    getTipList : function () {
        this._unSelectAllCards();

        if(this._tipList && this._tipIndex >= this._tipList.length){
            this._tipIndex = 0;
        }else{
            if(!this._tipList){
                this._tipIndex = 0;
            }
        }

        if(this._tipList && this._tipList.length <= 0){
            this._tipList = null;
            this._tipIndex = 0;
        }

        if(!this._tipList){
            var tData = MjClient.data.sData.tData;
            var mjhand = MjClient.data.sData.players[MjClient.data.pinfo.uid].mjhand;
            cc.log("mjhand:", mjhand);
            cc.log("tData.lastPutCard:", tData.lastPutCard);
            cc.log("tData.lastPutCardType:", tData.lastPutCardType);
            cc.log("tData.deckNum:", tData.deckNum);

            this._tipList = MjClient.majiang.hintPutCard(mjhand, tData.lastPutCard, tData.lastPutCardType, tData.areaSelectMode, tData.deckNum, tData.hasWings, tData.bodyLen);

            cc.log("this._tipList:", this._tipList);
        }
        var cards = this._tipList[this._tipIndex];
        if(cards){
            var ignoreSpcl = cards.length >= this._list.length;

            var isSpcl = this._isSpclType(cards.concat());
            var tipCards = [];
            var startIndex = 0;
            for(var i = 0; i < cards.length; i++){
                var obj = this._findCardByType(cards[i], isSpcl, startIndex, ignoreSpcl);
                if(obj && obj.c){
                    tipCards.push(obj.c);
                    startIndex = obj.index + 1;
                }
            }

            this._selectCards(tipCards);
        }
        this._tipIndex += 1;
    },

    _isSpclType : function(cards){
        var deckNum = MjClient.data.sData.tData.deckNum;
        return MjClient.majiang.isTongZi(cards) || MjClient.majiang.isXi(cards) || MjClient.majiang.isDiZha(cards, deckNum);
        // return MjClient.majiang.isTongZi(cards) || MjClient.majiang.isXi(cards) || MjClient.majiang.isDiZha(cards, deckNum);
    },

    _handBtnClick : function (sender) {
        if(sender == this._tipBtn)
        {   
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            if(tData.lastPutCard){
                var pl = sData.players[MjClient.data.pinfo.uid];
                var cards = tData.lastPutCard;
                var type = tData.lastPutCardType;
                var flg = MjClient.majiang.canBeat(pl.mjhand, cards, type, tData.areaSelectMode, tData.deckNum, tData.hasWings, tData.bodyLen);
                if(!flg){
                    MjClient.showToast("你没有牌大过上家");
                }else{
                    this.getTipList();
                }
            } else{
                this.getTipList();
            }
            
            playEffect("datongzi/effect/btnClick", false);

        }else if(sender == this._chuBtn)
        {
            var cards = this._getSelectCards();
            if(cards.length <= 0){
                MjClient.showToast("请先选择要出的牌");
            }else{
                var infoList = [];
                var arr = [];
                var len = cards.length;
                for(var i = 0; i < len; i++){
                    var info = cards[i].getInfo();
                    infoList.push(info);
                    arr.push(info.type);
                }

                //检查是否拆大的牌型
                var hand = [];
                for(var i = 0; i < this._list.length; i++){
                    var info = this._list[i];
                    hand.push(info.type);
                }
                cc.log("hand:",hand);
                cc.log("arr:",arr);
                cc.log("deckNum:", MjClient.data.sData.tData.deckNum);
                var tData = MjClient.data.sData.tData;
                var desc = MjClient.majiang.getBreakUpDesc(hand, arr, tData.areaSelectMode, tData.deckNum, tData.hasWings);
                if(desc.length > 0){
                    var msg = "要出的牌将会拆" + desc + "，是否确认出牌?";
                    var self = this;
                    MjClient.showMsg(msg,
                        function() {
                            var tData = MjClient.data.sData.tData;
                            var type = MjClient.majiang.getCardType(arr, tData.areaSelectMode, tData.deckNum, tData.hasWings);
                            if(type == daTongZi.CARD_TYPE.noType){
                                MjClient.showToast("不是合法的牌型");
                            }else{

                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "PKPut",
                                    card: arr,
                                    tingAfterPut: MjClient.clickTing
                                });

                                self.remoeCards(infoList);
                                self._unSelectAllCards();
                                self._unGrayAllCards();
                                self._tipList = null;
                                self._tipIndex = 0;

                                self.showBtnNode(false);

                                self.handSelfPutCards(arr);
                            }
                            self.setCardsRedStatus();

                            self.refreshHandCards();
                        },
                        function() {}, "1", "nantongAgain");
                }else{
                    var tData = MjClient.data.sData.tData;
                    var type = MjClient.majiang.getCardType(arr, tData.areaSelectMode, tData.deckNum, tData.hasWings);
                    if(type == daTongZi.CARD_TYPE.noType){
                        MjClient.showToast("不是合法的牌型");
                    }else{

                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "PKPut",
                            card: arr,
                            tingAfterPut: MjClient.clickTing
                        });

                        this.remoeCards(infoList);
                        this._unSelectAllCards();
                        this._unGrayAllCards();
                        this._tipList = null;
                        this._tipIndex = 0;
                        this.setCardsRedStatus();

                        this.showBtnNode(false);

                        this.handSelfPutCards(arr);
                    }
                }
            }
        }else if(sender == this._buChuBtn){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "PKPass"
            });
            this._tipList = null;
            this._tipIndex = 0;
            this._unGrayAllCards();

            this.showBtnNode(false);

            playEffect("datongzi/effect/btnClick", false);
        }
    },

    trustAction : function(cards){
        this.removeCardsByTypes(cards);
        this._unSelectAllCards();
        this._unGrayAllCards();
        this._tipList = null;
        this._tipIndex = 0;
        this.setCardsRedStatus();

        this.showBtnNode(false);

        this.handSelfPutCards(cards);
    },

    handSelfPutCards : function(cards){
        //本地直接处理出牌
        cc.log("MjClient.data.pinfo.sex:",MjClient.data.pinfo.sex);
        postEvent("PKPut_daTongZi",{cards:cards, sex: MjClient.data.pinfo.sex});
        playEffect("datongzi/effect/cardOut", false);
        playSoundEffect_daTongZi(cards, SelfUid(), true);
    },

    refreshHandCards : function(){
        //拆炸弹时 重新刷新手牌
        var arr = [];
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var c = this._cardsList[i];
            var type = c.getInfo().type;
            if(type){
                arr.push(type);
            }
        }

        cc.log("refreshHandCards arr:", arr);
        var arr = MjClient.majiang.sort2(arr, MjClient.data.sData.tData.deckNum);
        cc.log("refreshHandCards arr:", arr);

        var list = [];
        for(var i = 0; i < arr.length; i++){
            var info = {type:arr[i]};
            list.push(info);
        }
        this.addCards(list, true);
        this._tipBtn.setBright(true);
        this._tipBtn.setIsTouchEnable(true);
        this.setCardsRedStatus();
    },

    setCardsRedStatus : function(){
        var hand = [];
        for(var i = 0; i < this._list.length; i++){
            var info = this._list[i];
            hand.push(info.type);
        }
        var spclMatrix = MjClient.majiang.getSpclMatrix(hand, MjClient.data.sData.tData.deckNum);
        //搜索是否有地炸 并找出所在位置  
        var diZhaList = [];     
        var xiList = []; 
        for(var i = 0; i < spclMatrix.length; i++){
            var isDiZha = MjClient.majiang.isDiZha(spclMatrix[i], MjClient.data.sData.tData.deckNum);
            var isXi = MjClient.majiang.isXi(spclMatrix[i]);
            if(isDiZha){
                diZhaList.push(i);
            }
            if(isXi){
                xiList.push(i);
            }
        }

        countObj = {};
        var len = this._cardsList.length;
        for(var i = len - 1; i >= 0; i--){
            var c = this._cardsList[i];
            var flgObj = this.cardHasInSpclMatrix(c, spclMatrix);
            if(flgObj){
                var isDiZha = diZhaList.indexOf(flgObj.index) >= 0;
                if(!isDiZha && MjClient.data.sData.tData.deckNum == 3){
                    var type = c.getInfo().type;
                    var p = type % 100;;
                    if(p == 13 || p == 14 || p == 15 || p == 16 || p == 17){
                        //三副牌玩法下，K筒子、A筒子、2筒子、王筒子的颜色改为与地炸一样的黄色
                        isDiZha = true; 
                    }
                }else if(!isDiZha && MjClient.data.sData.tData.deckNum == 4){
                    //喜也用黄色
                    var isXi = xiList.indexOf(flgObj.index) >= 0;
                    isDiZha = isXi;
                }

                c.isSpcl(flgObj.isSpcl, isDiZha);
            }else{
                c.isSpcl(false);
            }
            
        }
        
    },

    cardHasInSpclMatrix : function(card, spclMatrix){
        var type = card.getInfo().type;
        for(var i = 0; i < spclMatrix.length; i++){
            var arr = spclMatrix[i];
            for(var j = 0; j < arr.length; j++){
                if(arr[j] == type){
                    arr.splice(j,1);
                    return {isSpcl: true, index: i};
                }
            }
        }
        return false;
    },

    /**
     *
     * @private
     * @return {Array.<daTongZi.Card>}
     */
    _getSelectCards : function () {
        var arr = [];
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var c = this._cardsList[i];
            if(c.isSelected){
                arr.push(c);
            }
        }
        return arr;
    },

    /**
     *
     * @param type
     * @return {Array.<daTongZi.CardInfo>}
     * @private
     */
    _findCardByType : function (type, isSpcl, startIndex, ignoreSpcl) {
        var len = this._cardsList.length;
        for(var i = startIndex; i < len; i++){
            var c = this._cardsList[i];
            var cInfo = c.getInfo();
            if(ignoreSpcl){
                if(type == cInfo.type){
                    return {c:c, index: i};
                }
            }else{
                if(isSpcl){
                    if(type == cInfo.type && c.isSpclType){
                        return {c:c, index: i};
                    }
                }else{
                    if(type == cInfo.type && !c.isSpclType){
                        return {c:c, index: i};
                    }
                }
            }
            
            
        }
        return null;
    },

    /**
     * 选择指定的牌列表
     * @param cardList
     * @private
     */
    _selectCards : function (cardList) {
        var len = cardList.length;
        for(var i = 0; i < len; i++)
        {
            // var info = cardList[i].getInfo();
            // var c = this._findCardByInfo(info, true);
            // this.doSelectAction(c);
            this.doSelectAction(cardList[i]);
        }
    },

    /**
     * 变灰指定的牌列表
     * @param cardList
     * @private
     */
    _grayCards : function (cardList) {
        var len = cardList.length;
        for(var i = 0; i < len; i++)
        {
            var info = cardList[i].getInfo();
            var c = this._findCardByInfo(info);
            c.setStatus(daTongZi.CardStatus.GRAY);
        }
    },

    /**
     * 变亮所有的牌
     * @private
     */
    _unGrayAllCards : function () {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++)
        {
            var c = this._cardsList[i];
            c.setStatus(daTongZi.CardStatus.UNHOOD);
        }
    },

    _findCardByInfo : function (info, isSelected) {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var c = this._cardsList[i];
            var cInfo = c.getInfo();
            if(cInfo.type == info.type && cInfo.suit == info.suit){
                if(isSelected !== undefined){
                    if(!c.isSelected){
                        return c;
                    }
                }else{
                    return c;
                } 
            }
        }
        return null;
    },

    _lastP : null,
    _addTouchEvent : function () {
        var self = this;
        var starP = cc.p(0, 0);
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                starP = self.convertTouchToNodeSpace(touch);
                self._lastP = starP;
                return self._isTouchOpen;
            },
            onTouchMoved: function (touch, event) {
                var p = self.convertTouchToNodeSpace(touch);
                var cha = p.x - self._lastP.x;
                var dir = cha <= 0 ? 1 : -1;
                if(dir !== self._moveDir)
                {
                    self._selectCardsList = [];
                }

                var gap = cc.pDistance(starP,p);
                if(gap > 20){
                    self._isMove = true;
                    self._moveDir = dir;
                    // self._showCardsByPos(self._lastP,p);

                    self._markCardsByPos(self._lastP, p);
                    self._lastP = p;
                }
            },
            onTouchCancelled: function (touch, event) {
                self._isMove = false;
                self._moveDir = 0;
            },
            onTouchEnded: function (touch, event) {
                var p = self.convertTouchToNodeSpace(touch);
                if(self._isMove){
                    self._isMove = false;
                    self._moveDir = 0;
                    self.showMarkCards();
                    return;
                }

                var index = self.getCardIndexByPos(p);
                if(index == -1){
                    self._unSelectAllCards();
                    self._tipIndex = 0;
                }else{
                    var c = self._cardsList[index];
                    if(c && !c.isSelected){
                        self.playSelectSound();
                    }
                    self.doSelectAction(c);

                    // self.doMarkCard(c);
                }
                self._moveDir = 0;

            }
        });
        cc.eventManager.addListener(touchListener, this);
    },

    playSelectSound : function(){
        playEffect("datongzi/effect/cardClick", false);
    },

    setTouchOpen : function (flg) {
        this._isTouchOpen = flg;
    },

    _markCardsByPos : function (startP, endP) {
        var flg = true;

        var index1 = this.getCardIndexByPos(startP);
        var index2 = this.getCardIndexByPos(endP);
        var min = Math.min(index1, index2);
        var max = Math.max(index1, index2);

        var cha = max - min;
        if(max >= this._rowNum && min < this._rowNum){
            //跳行
            return;
        }

        var hasSelectCard = false;

        if(min != -1 && max != -1)
        {
            for(var i = min; i <= max; i++){
                var c = this._cardsList[i];
                if(!this._isContainsCard(c, this._selectCardsList)){
                    this.doMarkCard(c);
                    this._selectCardsList.push(c);
                }

            }
        }
    },

    doMarkCard : function (card) {
        if(card && card.status != daTongZi.CardStatus.GRAY)
        {
            var ty = card.y;
            if(card.isMark)
            {
                card.isMark = false;
                card.setStatus(daTongZi.CardStatus.UNHOOD);
            }else{
                card.isMark = true;
                card.setStatus(daTongZi.CardStatus.MARK);
            }
        }else
        {
            var len = this._cardsList.length;
            for(var i = 0; i < len; i++)
            {
                var c = this._cardsList[i];
                if(card.status == daTongZi.CardStatus.MARK){
                    c.isMark = false;
                    c.setStatus(daTongZi.CardStatus.UNHOOD);
                }
                
            }
        }
    },

    showMarkCards : function(){
        var arr = [];
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var c = this._cardsList[i];
            if(c.isMark){
                arr.push(c);
                //取消标记
                c.isMark = false;
                c.setStatus(daTongZi.CardStatus.UNHOOD);
            }
        }

        this._selectCards(arr);
        if(arr.length > 0){
            this.playSelectSound();
        }
    },

    _showCardsByPos : function (startP, endP) {
        var flg = true;

        var index1 = this.getCardIndexByPos(startP);
        var index2 = this.getCardIndexByPos(endP);
        var min = Math.min(index1, index2);
        var max = Math.max(index1, index2);

        var cha = max - min;
        if(max >= this._rowNum && min < this._rowNum){
            //跳行
            return;
        }

        var hasSelectCard = false;

        if(min != -1 && max != -1)
        {
            for(var i = min; i <= max; i++){
                var c = this._cardsList[i];
                if(!this._isContainsCard(c, this._selectCardsList)){
                    this.doSelectAction(c);
                    this._selectCardsList.push(c);
                    if(c && c.isSelected){
                        hasSelectCard = true;
                    }
                }

            }
        }

        if(hasSelectCard){
            this.playSelectSound();
        }
    },

    /**
     * 返回位置最后的那个card
     * @param pos
     * @return {number}
     */
    getCardIndexByPos : function (pos) {
        var arr = [];
        var tx = 0;
        var index = 0;
        var len = this._cardsList.length;
        var flg = false;
        for(var i = 0; i < len; i++)
        {
            var c = this._cardsList[i];
            if(c.isContainsP(pos))
            {
                flg = true;
                if(c.x >= tx)
                {
                    tx = c.x;
                    index = i;
                }
            }
        }

        if(flg){
            return index;
        }
        return -1;
    },

    _isContainsCard : function (card, arr) {
        var len = arr.length;
        for(var i = 0; i < len; i++)
        {
            var c = arr[i];
            if(c == card){
                return true;
            }
        }
        return false;
    },

    doSelectAction : function (card) {
        if(card && card.status != daTongZi.CardStatus.GRAY)
        {
            card.stopAllActions();
            var ty = card.y;
            if(card.isSelected)
            {
                card.isSelected = false;
                // card.y = card.row * card.rowGap ;
                ty = card.row * card.rowGap ;
            }else{
                // card.y = card.row * card.rowGap + 20;
                ty = card.row * card.rowGap + 20;
                card.isSelected = true;
            }
            this._doCardMoveAction(card, card.x, ty);
        }else if(card && card.status == daTongZi.CardStatus.GRAY){
            card.stopAllActions();
            var ty = card.y;
            if(card.isSelected)
            {
                card.isSelected = false;
            }
            ty = card.row * card.rowGap ;
            this._doCardMoveAction(card, card.x, ty);
        }
        else
        {
            var len = this._cardsList.length;
            for(var i = 0; i < len; i++)
            {
                var c = this._cardsList[i];
                // c.y = c.row * c.rowGap;
                var ty = c.row * c.rowGap;
                c.isSelected = false;
                c.stopAllActions();
                this._doCardMoveAction(c, c.x, ty);
            }
        }

        this._checkBtnStatus();
    },

    _doCardMoveAction : function(card, tx,ty){
        // var ac = cc.moveTo(0.1,tx,ty);
        // card.runAction(ac);

        card.x = tx;
        card.y = ty;
    },

    //检查和变更按钮状态
    _checkBtnStatus : function(){
        if(this._btnNode.visible){
            var cards = this._getSelectCards();
            var typeList = [];
            for(var i = 0; i < cards.length; i++){
                var info = cards[i].getInfo();
                typeList.push(info.type);
            }

            var tData = MjClient.data.sData.tData;
            if(tData.lastPutCard && tData.lastPutCard.length > 0 && tData.lastPutCardType >= 0){
                var flg = MjClient.majiang.isBigger(typeList, tData.lastPutCard, tData.lastPutCardType, tData.areaSelectMode, tData.deckNum, tData.hasWings, tData.bodyLen);
                this._chuBtn.setBright(flg);
                this._chuBtn.setIsTouchEnable(flg);
            }else{
                this._chuBtn.setIsTouchEnable(true);
                this._chuBtn.setBright(true);

                var tData = MjClient.data.sData.tData;
                var type = MjClient.majiang.getCardType(typeList, tData.areaSelectMode, tData.deckNum, tData.hasWings);
                if(type == daTongZi.CARD_TYPE.noType){
                    this._chuBtn.setIsTouchEnable(false);
                    this._chuBtn.setBright(false);
                }
            }
            
        }
    },

    _unSelectAllCards : function()
    {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++)
        {
            var c = this._cardsList[i];
            if(c && cc.sys.isObjectValid(c))
            {
                // c.y = c.row * c.rowGap;
                c.isSelected = false;
                if(c.status != daTongZi.CardStatus.GRAY)
                {
                    c.isMark = false;
                    c.setStatus(daTongZi.CardStatus.UNHOOD);
                    
                }
                this._doCardMoveAction(c, c.x, c.row * c.rowGap);
            }
        }

        this._chuBtn.setBright(false);
        this._chuBtn.setIsTouchEnable(false);
    },

    removeAllCards : function () {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var card = this._cardsList[i];
            if(card && cc.sys.isObjectValid(card)){
                card.removeFromParent();
            }
            card = null;
        }
        this._cardsList = [];
    },

    _getStartObj : function (count) {
        if(count > this._rowNum){
            count = count - (count - this._rowNum);
        }
        var gap = this._gap;
        var w = (count-1) * gap + 130;
        var startX = (this.width - w) * 0.5 + 20;
        var obj = {};
        obj.gap = gap;
        obj.startX = startX;// < 0 ? 0 : startX;


        return obj;
    },

    removeCardsByTypes : function(typeList){
        var infoList = [];
        var len = typeList.length;
        for(var i = 0; i < len; i++){
            var info = {type:typeList[i]};
            infoList.push(info);
        }
        this.remoeCards(infoList);
    },

    remoeCards : function (list) {
        var len = list.length;
        for(var i = 0; i < len; i++){
            if(list[i]){
                this._removeCardByInfo(list[i]);
                this._removeInfoByInfo(list[i]);
            }
        }

        var count = this._cardsList.length;
        var obj = this._getStartObj(count);

        for(var i = 0; i < count; i++){
            var card = this._cardsList[i];
            var tx = obj.startX + i * obj.gap;
            card.x = tx;
            card.y = 0;
            card.row = 0;
            card.setLocalZOrder(i);

            if(i >= this._rowNum){
                var row = Math.floor(i / this._rowNum);
                var col = Math.abs(i - this._rowNum);
                tx = obj.startX + col * obj.gap;
                var ty = row * card.rowGap;
                card.setLocalZOrder(row*-1);
                card.row = row;
                card.x = tx;
                card.y = ty;
            }
        }
    },

    _removeCardByInfo : function (info) {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var card = this._cardsList[i];
            var cardInfo = card.getInfo();
            if(cardInfo.type == info.type){
                card.removeFromParent();
                card = null;
                this._cardsList.splice(i,1);
                return;
            }
        }
    },

    _removeInfoByInfo : function (info) {
        var len = this._list.length;
        for(var i = 0; i < len; i++){
            var temp = this._list[i];
            if(temp.type == info.type){
                this._list.splice(i,1);
                return;
            }
        }
    },

    addCards : function (list,isShow) {
        this.removeAllCards();
        this.unscheduleAllCallbacks();
        this._count = 0;
        this.setTouchOpen(false);
        this._tipBtn.setBright(false);
        this._tipBtn.setIsTouchEnable(false);

        if(this._cardsList && this._cardsList.length > 0){
            this.remoeCards(this._list);
            this._cardsList = [];
            this._list = [];
        }

        this._list = list;
        var len = this._list.length;
        // this._btnNode.x = this.width * 0.5;
        if(isShow){

            var count = this._list.length;
            var obj = this._getStartObj(count);
            //for(var i = 0; i < len; i++){
            //    var info = this._list[i];
            //    var card = new daTongZi.Card(info);
            //    card.setAnchorPoint(0,0);
            //    card.x = obj.startX + i * obj.gap;
            //    card.y = 0;
            //    card.setStatus(daTongZi.CardStatus.UNHOOD);
            //    this.addChild(card);
            //    this._cardsList.push(card);
            //}
            for(var i = 0; i < 2; i++){
                for(var j = 0; j < this._rowNum; j++){
                    var info = this._list[j + i * this._rowNum];
                    if(!info){
                        break;
                    }
                    var card = new daTongZi.Card(info);
                    // card.setAnchorPoint(0,0);
                    card.x = obj.startX + j * obj.gap;
                    card.y = i * card.rowGap;
                    card.row = i;
                    card.setStatus(daTongZi.CardStatus.UNHOOD);
                    this.addChild(card);
                    card.setLocalZOrder(i*-1);
                    this._cardsList.push(card);
                }
            }
            this.setTouchOpen(true);

            this.setCardsRedStatus();
        }else{
            this.schedule(this._addCard,0.02,cc.REPEAT_FOREVER,0.1);
        }

    },

    _count:0,
    _addCard : function () {
        if(this._count >= this._list.length)
        {
            this.unscheduleAllCallbacks();
            // this._count = 0;
            // this.schedule(this._unhoodCard,0.02,cc.REPEAT_FOREVER,0.1);

            this._unhoodCard();
            return;
        }

        // Sound.playEffect(2,false);

        var info = this._list[this._count];
        var card = new daTongZi.Card(info);
        // card.setAnchorPoint(0,0);
        card.x = this.width;
        card.y = 0;
        card.row = 0;
        card.setStatus(daTongZi.CardStatus.HOOD);
        this.addChild(card);
        this._cardsList.push(card);

        var count = this._list.length;
        var obj = this._getStartObj(count);


        var tx = obj.startX + this._count * obj.gap;
        var ty = 0;

        var countNum = this._count;
        if(countNum >= this._rowNum){
            var row = Math.floor(countNum / this._rowNum);
            // row = row -1;
            // if(row < 0) row = 1;
            var col = Math.abs(countNum - this._rowNum);
            tx = obj.startX + col * obj.gap;
            ty = row * card.rowGap;
            card.setLocalZOrder(row*-1);
            card.row = row;
        }
        
        // var cb = cc.callFunc(function(){
        //     this.rotateAction();
        // }.bind(card));

        // var ac = cc.moveTo(0.1,tx,ty);
        // card.runAction(cc.sequence(ac));


        card.x = tx;
        card.y = ty;
        card.rotateAction();


        this._count += 1;
    },

    showFaceAllCards : function () {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var card = this._cardsList[i];
            if(card && cc.sys.isObjectValid(card)){
                card.showFace();
            }
        }
    },

    _unhoodCard : function () {
        if(this._count >= this._cardsList.length)
        {
            this.unscheduleAllCallbacks();
            this._count = 0;

            this.setCardsRedStatus();

            this.scheduleOnce(function(){
                this._tipBtn.setBright(true);
                this._tipBtn.setIsTouchEnable(true);
                // this.showFaceAllCards();
                this.refreshHandCards();

                if(curPlayerIsMe_leiyang(0)){
                    this.unTouchCards();
                } 

                this.setTouchOpen(true);
            }.bind(this),1);
            
            return;
        }

        var card = this._cardsList[this._count];
        // card && card.setStatus(daTongZi.CardStatus.UNHOOD);
        card && card.rotateAction(true);

        this._count += 1;
    }
});