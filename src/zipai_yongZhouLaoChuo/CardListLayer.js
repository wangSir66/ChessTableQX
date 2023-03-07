var yzLaoChuo = yzLaoChuo || {};


yzLaoChuo.CardThrowListLayer = cc.Node.extend({
    /**
     * @type {ui.LayoutNode}
     */
    _layerNode : null,
    ctor : function () {
        this._super();
        this.setContentSize(218,135);

        this._layerNode = new daTongZi.LayoutNode();
        this._layerNode.setScale(0.36);
        this.addChild(this._layerNode);

        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_baodan);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_feiji);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_liandui);
        cc.spriteFrameCache.addSpriteFrames(res.DaTongZi_zhadan);

        //test
        // var list = [];
        // for(var i = 0; i < 8; i++){
        //     list.push(10);
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
    showCards : function (list, sex, isLocal, isBiggest) {
        isLocal = isLocal === undefined ? false : isLocal;

        // list = [105,106,107,108,109];
        this._sex = sex;
        this.unscheduleAllCallbacks();
        this._layerNode.removeAllChildren();
        var len = list.length;

        var tData = MjClient.data.sData.tData;
        var flg = false//MjClient.majiang.isFeiJi(list, tData.hasWings);
        var isSZ = false//MjClient.majiang.isSanZhang(list, tData.hasWings);
        //ceshi xian
        var card = null;
        if( false && (flg || isSZ)) {
            var feiJiObj; 
            if(isSZ){
                feiJiObj = MjClient.majiang.splitSanZhang(list); 
            }else{
                feiJiObj = MjClient.majiang.splitFeiJi(list, tData.hasWings, tData.bodyLen); 
            }

            cc.log("feiJiObj:" + JSON.stringify(feiJiObj));

            //bocy
            var len = feiJiObj.body.length;
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = feiJiObj.body[i];
                var card = new yzLaoChuo.Card(info);
                card.setStatus(daTongZi.CardStatus.UNHOOD);
                this._layerNode.addChild(card);
            }

            //中间占个坐
            var card = new yzLaoChuo.Card({type:105});
            card.setStatus(daTongZi.CardStatus.UNHOOD);
            card.visible = false;
            this._layerNode.addChild(card);

            //wing
            var len = feiJiObj.wing.length;
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = feiJiObj.wing[i];
                var card = new yzLaoChuo.Card(info);
                card.setStatus(daTongZi.CardStatus.GRAY);
                card.setGaryAlpha(255 * 0.4);
                this._layerNode.addChild(card);
            }

            len = feiJiObj.body.length + feiJiObj.wing.length + 1;

        }else{
            //var list = MjClient.majiang.formatPutCard(list, tData.lastPutCardType, tData.shunType, tData.hasWings, tData.bodyLen);
            for(var i = 0; i < len; i++)
            {
                var info = new daTongZi.CardInfo();
                info.type = list[i];
                info.name = "put";
                if(i == 0 && isBiggest){
                 //   info.showBigIcon = true;
                }
                
                card = new yzLaoChuo.Card(info);
                card.setStatus(daTongZi.CardStatus.UNHOOD);
                this._layerNode.addChild(card);
                cc.log("==========cardscale",card.getScale())
            }
        }

        // var c = 21;
        // if(len < 21){
        //     c = len;
        // }
        // var r = Math.ceil(len / c);//没这个需求
        this._layerNode.doLayoutGrid(1, len, 0, 0); 
        // this._layerNode.setAnchorPoint(0,0);
        this._layerNode.x = 0;

        this.playSound(list, this._sex, isLocal);
    },

    hideCards : function () {
        this._layerNode.removeAllChildren();
    },

    showCardIcon : function(){
        if(this._layerNode && this._layerNode.children.length > 0 && this._layerNode.children[0]){
            this._layerNode.children[0]._bigBg.setVisible(true);
        }
    },

    /**
     * 播放效果
     */
    playSound : function (cards, sex, isLocal) {
        isLocal = isLocal === undefined ? false : isLocal;

        var tData = MjClient.data.sData.tData;
        var type;
        if(isLocal){
            type = MjClient.majiang.getCardsType(cards, tData.areaSelectMode).type;
        }else{
            type = tData.lastPutCardType;
        }
        
        var cardVal = cards[0] % 100; 

        cc.log("playSound:cards:", cards);
        cc.log("playSound:type:", type);

        var url = "yongZhouLaoChuo/nan/";
        switch (type){
            case yzLaoChuo.CARD_TYPE.dan:
                url += cardVal;
                // playEffect(url, false, sex);
                break;
            case yzLaoChuo.CARD_TYPE.dui:
                url +=  "dui";
                // playEffect(url, false, sex);
                break;
            case yzLaoChuo.CARD_TYPE.daMian:
                url += "daMian";
                // playEffect(url, false, sex);
                //this._showEffect("liandui_", 17);
                break;
            case yzLaoChuo.CARD_TYPE.xiaoMian:
                url += "xiaoMian";
                break;

                // var obj = MjClient.majiang.analyzeSanZhang(cards);
                // cardVal = obj.body;
                // url += cardVal + "t";
                // // playEffect(url, false, sex);
                // break;
            case yzLaoChuo.CARD_TYPE.canHe:
                url += "canHe";
                // playEffect(url, false, sex);

                //this._showFeiJiEffect("feiji_", 8, 0.1, 2);
                break;
            case yzLaoChuo.CARD_TYPE.kan:
                url += "kan_" + cards.length - 3;
                break;
            case yzLaoChuo.CARD_TYPE.long:
                url += "long_" + cards.length - 4;
                break;
            case yzLaoChuo.CARD_TYPE.shun:
                url += "shun";
                break;
            // case yzLaoChuo.CARD_TYPE.zhaDan:
                
            //     if(cards.length > 10){
            //         url += "zhaDan_ty";
            //     }else if(cards.length == 4 && (cardVal == 16 || cardVal == 17)){
            //         this._doDiZhaeffect();
            //         break;
            //     }else{
            //         url += cards.length + "bomb";
            //     }
                
            //     // playEffect(url, false, sex);

            //     // this._showEffect("zhadan_", 23);
            //     this._showEffect("zhadan_", 15, undefined, undefined, 9);
            //     break;
            // case yzLaoChuo.CARD_TYPE.zaHuaWuShiK:
            // case yzLaoChuo.CARD_TYPE.tongHuaWuShiK:
            //     url += "zhaDan_ty";
            //     this._showEffect("zhadan_", 15, undefined, undefined, 9);
            //     break;
            // case yzLaoChuo.CARD_TYPE.shunZi:
            //     this._showShunZiEffect();
            //     break;
        }
    },

    _showShunZiEffect : function(){
        var sp = cc.Sprite("playing/shaoyangOptimize/shunzi.png");
        sp.setScale(this._layerNode.getScale()*2);
        sp.setAnchorPoint(0.5,0.5);
        sp.y = this._layerNode.height * 0.5;
        sp.x = 0;
        this._layerNode.addChild(sp);

        var gap = this._layerNode.width * 0.5 + 20;
        sp.runAction(cc.sequence(
            cc.moveBy(0.3, gap, 0),
            cc.delayTime(1.5),
            cc.removeSelf()
        ));
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


yzLaoChuo.CardListLayer = cc.Node.extend({

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
    _gap : 98,

    /**
     * 提示按钮
     * @type ui.Button
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
     _rowNum : 19,

     _maxCol : 12,

    ctor : function () {
        this._super();
        this.setContentSize(1568, 720);
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
        // var cardTypes = MjClient.majiang.getDisabledList(pl.mjhand, cards, type, tData.deckNum, tData.hasWings, tData.bodyLen);
        // cc.log("hand:", pl.mjhand);
        // cc.log("cards:", cards);
        // cc.log("type:", type);
        // cc.log("unTouchCards:", cardTypes);

        // if(cardTypes.length >= this._list.length && tData.areaSelectMode.isBiChu){
        //     this.showBtnNode(false);
        // }
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

        // var btn = new ui.Button("playing/paodekuaiTable/buchu.png", null, null, ccui.Widget.LOCAL_TEXTURE);
        // btn.addClickEvent(this._handBtnClick, this);
        // node.addChild(btn);
        // this._buChuBtn = btn;

        // var btn = new ui.Button("playing/paodekuaiTable/tishi.png",null, null, ccui.Widget.LOCAL_TEXTURE);
        // btn.addClickEvent(this._handBtnClick, this);
        // node.addChild(btn);
        // this._tipBtn = btn;

        var btn = new ui.Button("playing/paohuzi/chupai.png", null, "playing/paohuzi/chupai_2.png", ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._chuBtn = btn;
        this._chuBtn.setBright(false);
        this._chuBtn.setIsTouchEnable(false);
        node.doLayoutGrid(1,2,0,0);
        node.setAnchorPoint(0.5,0);
        node.x = this.width * 0.5;
        node.y = 360;
        this.addChild(node, 100);
        this._btnNode = node;
        this._btnNode.visible = false;
        this._btnNode.setScale(1.22);

        this._chuBtn.setAnchorPoint(0.5,0);
        //this._initOtherBtn();

        //队友手牌
        // this._teamSp = new cc.Sprite("baZhaDan/dyShouPai.png");
        // this._teamSp.setAnchorPoint(0.5,1);
        // this._teamSp.x = this.width * 0.5 - 65;
        // this._teamSp.visible = false;
        // this.addChild(this._teamSp, 100);


        //node.setBackGroundColor(cc.color(255,0,0));
    },

    _initOtherBtn : function(){
        //3带1
        cc.log("_initOtherBtn");
        var node = new daTongZi.LayoutNode();
        var btn = new ui.Button("baZhaDan/threeOne.png", null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._oneBtn = btn;
        var btn = new ui.Button("baZhaDan/bomb4.png",null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._bomb4Btn = btn;
        node.doLayoutGrid(2,1,0,20);
        this._threeOneNode = node;
        this._threeOneNode.visible = false;
        this._btnNode.addChild(this._threeOneNode);

        //3带2
        var node = new daTongZi.LayoutNode();
        var btn = new ui.Button("baZhaDan/threeTwo.png", null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._twoBtn = btn;
        var btn = new ui.Button("baZhaDan/bomb5.png",null, null, ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(this._handBtnClick, this);
        node.addChild(btn);
        this._bomb5Btn = btn;
        node.doLayoutGrid(2,1,0,20);
        this._threeTwoNode = node;
        this._threeTwoNode.visible = false;
        this._btnNode.addChild(this._threeTwoNode);
    },

    // showTeamHand : function(isShow, handCards){
    //     cc.log("showTeamHand...");
    //     this._teamSp.visible = isShow && handCards.length > 0;
    //     if(isShow){
    //         handCards = handCards.concat();
    //         handCards = MjClient.majiang.sortCard(handCards, MjClient.majiang.sortType);
    //         var arr = [];
    //         for(var i = 0; i < handCards.length; i++){
    //             var info = new daTongZi.CardInfo();
    //             info.type = handCards[i];
    //             arr.push(info);
    //         }
    //         this.addCards(arr, true);
    //         this.setTouchOpen(false);
    //     }else{
    //         this.addCards([], true);
    //         this.setTouchOpen(true);
    //     }
        
    // },

    upBtnNode : function () {
        var len = 3;
        //this._buChuBtn.visible = true;
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        if(!tData) return;

        //霸炸弹没有自动过
        // if(tData.maxPlayer == 3 || (tData.maxPlayer == 2 && tData.areaSelectMode.isBiChu))
        // {
        //     this._buChuBtn.visible = false;
        //     len = 2;
        // }
        //this._buChuBtn.visible = false;
        //this._tipBtn.visible = false;
        len = 2;
        //this._btnNode.doLayoutGrid(1,1,0,0);

        cc.log("---upBtnNode._btnNode-----"+ JSON.stringify(this._btnNode.getContentSize()));
        cc.log("---upBtnNode._chuBtn-----",this._chuBtn.x);
        if(true){
            return ;
        }
        // if(len == 2){
        //     // this._chuBtn.x = this._buChuBtn.x;
        //     this._chuBtn.x = this._tipBtn.x;
        //     this._tipBtn.x = this._buChuBtn.x;
        //     this._btnNode.x = this.width * 0.5 - 100;
        // }else{
        //     this._btnNode.x = this.width * 0.5 - 100;
        // }

        //是否要显示多牌型按钮
        this._checkAndShowOtherBtn();
    },

    _checkAndShowOtherBtn : function(){
        var type = 0;
        if(type == 1){
            //显示3带1
            this._chuBtn.visible = false;
            this._threeOneNode.visible = true;
            this._threeTwoNode.visible = false;
            this._threeOneNode.x = this._chuBtn.x;
        }else if(type == 2){
            //显示3带2
            this._chuBtn.visible = false;
            this._threeOneNode.visible = false;
            this._threeTwoNode.visible = true;
            this._threeTwoNode.x = this._chuBtn.x;
        }else{
            //不显示
            this._chuBtn.visible = true;
            this._threeOneNode.visible = false;
            this._threeTwoNode.visible = false;
        }
    },

    showBtnNode : function (flg) {
        if(MjClient.rePlayVideo !== -1){
            this._btnNode.visible = false;
            return;
        }
        this._btnNode.visible = flg;
        if(flg){
            this.unTouchCards();
            // this._unSelectAllCards();
            this._tipList = null;
            this._tipIndex = 0;

            var sData = MjClient.data.sData;
            var tData = sData.tData;
            cc.log("showBtnNode:" + tData, tData.lastPutPlayer);
            // if(!tData || tData.lastPutPlayer < 0){
            //     this._buChuBtn.setIsTouchEnable(false);
            //     this._buChuBtn.setBright(false);
            // }else{
            //     var uid = tData.uids[tData.lastPutPlayer];
            //     cc.log("showBtnNode uid:" + uid, "self uid:" + MjClient.data.pinfo.uid);
            //     if(uid == MjClient.data.pinfo.uid || !MjClient.data.sData.tData.lastPutCard){
            //         this._buChuBtn.setIsTouchEnable(false);
            //         this._buChuBtn.setBright(false);
            //     }else{
                    
            //         this._buChuBtn.setIsTouchEnable(true);
            //         this._buChuBtn.setBright(true);
            //         // if(tData.lastPutCard){
            //         //     var pl = sData.players[MjClient.data.pinfo.uid];
            //         //     var cards = tData.lastPutCard;
            //         //     var type = tData.lastPutCardType;
            //         //     var flg = MjClient.majiang.canBeat(pl.mjhand, cards, type, tData.deckNum, tData.hasWings, tData.bodyLen);
            //         //     if(!flg){
            //         //         MjClient.showToast("你没有牌大过上家");
            //         //     }
            //         // } 
            //     }
            // }

            // if(tData.areaSelectMode.isBiChu){
            //     this._buChuBtn.setIsTouchEnable(false);
            //     this._buChuBtn.setBright(false);
            // }


            this.upBtnNode();
            this._checkBtnStatus();
            this.setHandMode();
        }else{
            this._tipList = null;
            this._tipIndex = 0;
            // this._unGrayAllCards();
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

            this._tipList = MjClient.majiang.hintPutCard(mjhand, tData.lastPutCard, tData.lastPutCardType, tData.shunType, tData.hasWings, tData.bodyLen);

            cc.log("this._tipList:", this._tipList);
        }
        var cards = this._tipList[this._tipIndex];
        if(cards){
            cc.log("tip cards :", cards);
            var ignoreSpcl = cards.length >= this._list.length;

            var isSpcl = this._isSpclType(cards);
            var tipCards = [];
            var hasFinds = [];  //已经找到的牌的下标
            var startIndex = 0;
            for(var i = 0; i < cards.length; i++){
                var obj = this._findCardByType(cards[i], isSpcl, startIndex, ignoreSpcl, hasFinds);
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
        return false;
        // return MjClient.majiang.isTongZi(cards) || MjClient.majiang.isXi(cards) || MjClient.majiang.isDiZha(cards, deckNum);
    },

    _handBtnClick : function (sender) {
       /* if(sender == this._tipBtn)
        {   
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            if(tData.lastPutCard){
                var pl = sData.players[MjClient.data.pinfo.uid];
                var cards = tData.lastPutCard;
                var type = tData.lastPutCardType;
                var flg = MjClient.majiang.canBeat(pl.mjhand, cards, type, tData.shunType, tData.hasWings, tData.bodyLen);
                if(!flg){
                    MjClient.showToast("你没有牌大过上家");
                }else{
                    this.getTipList();
                }
            } else{
                this.getTipList();
            }
            
            playEffect("datongzi/effect/btnClick", false);

        }else*/ if(sender == this._chuBtn /*|| 
            sender == this._bomb4Btn || 
            sender == this._bomb5Btn || 
            sender == this._oneBtn || 
            sender == this._twoBtn*/)
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
                    var type = this._list[i];
                    hand.push(type);
                }
                cc.log("hand:",hand);
                cc.log("arr:",arr);
                cc.log("deckNum:", MjClient.data.sData.tData.deckNum);
                var tData = MjClient.data.sData.tData;
               /* var desc = MjClient.majiang.getBreakUpDesc(hand, arr, tData.deckNum, tData.shunType, tData.hasWings);
                if(desc.length > 0){
                    var msg = "要出的牌将会拆" + desc + "，是否确认出牌?";
                    var self = this;
                    MjClient.showMsg(msg,
                        function() {
                            var tData = MjClient.data.sData.tData;
                            var type = MjClient.majiang.getCardType(arr, tData.shunType, tData.hasWings);
                            if(type == yzLaoChuo.CARD_TYPE.noType){
                                MjClient.showToast("不是合法的牌型");
                            }else{

                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "PKPut",
                                    card: arr,
                                    tingAfterPut: MjClient.clickTing
                                });

                                self.removeCardByCardList(cards);
                                // self.remoeCards(infoList);
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
                }else{*/
                    var tData = MjClient.data.sData.tData;
                    var type = MjClient.majiang.getCardsType(arr, tData.areaSelectMode).type;
                    //var type = MjClient.majiang.getCardType(arr, tData.shunType, tData.hasWings);
                    
                    if(type == yzLaoChuo.CARD_TYPE.noType){
                        MjClient.showToast("不是合法的牌型");
                    }else{

                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "PKPut",
                            card: arr,
                            tingAfterPut: MjClient.clickTing
                        });

                        this.removeCardByCardList(cards);
                        // this.remoeCards(infoList);
                        this._unSelectAllCards();
                        this._unGrayAllCards();
                        this._tipList = null;
                        this._tipIndex = 0;
                        this.setCardsRedStatus();

                        this.showBtnNode(false);

                        this.handSelfPutCards(arr);
                        this.refreshHandCards();
                    }
                //}
            }
        }/*else if(sender == this._buChuBtn){
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "PKPass"
            });
            this._tipList = null;
            this._tipIndex = 0;
            this._unSelectAllCards();
            this._unGrayAllCards();

            this.showBtnNode(false);

            playEffect("datongzi/effect/btnClick", false);
        } */
    },

    handSelfPutCards : function(cards){
        //本地直接处理出牌
        cc.log("MjClient.data.pinfo.sex:",MjClient.data.pinfo.sex);
        postEvent("PKPut_YongZhouLaoChuo",{cards:cards, sex: MjClient.data.pinfo.sex});
        playEffect("yongZhouLaoChuo/effect/cardOut", false);
        playSoundEffect_YongZhouLaoChuo(cards, SelfUid(), true);
    },

    refreshHandCards : function(){
        //新UI
        this.refreshAllCards();
        return;
    },

    setCardsRedStatus : function(){
        if(true){
            return;
        }
        var hand = [];
        for(var i = 0; i < this._list.length; i++){
            var info = this._list[i];
            hand.push(info.type);
        }
        var spclMatrix = MjClient.majiang.getSpclMatrix(hand, MjClient.data.sData.tData.deckNum);
        //搜索是否有地炸 并找出所在位置  
        var diZhaList = [];     
        var xiList = []; 

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
    _findCardByType : function (type, isSpcl, startIndex, ignoreSpcl, hasFinds) {
        var len = this._cardsList.length;
        for(var i = startIndex; i < len; i++){
            var c = this._cardsList[i];
            var cInfo = c.getInfo();

            if(type == cInfo.type && hasFinds.indexOf(i)< 0){
                hasFinds.push(i);
                return {c:c, index : -1};
            }


            // if(ignoreSpcl){
            //     if(type == cInfo.type){
            //         return {c:c, index: i};
            //     }
            // }else{
            //     if(isSpcl){
            //         if(type == cInfo.type && c.isSpclType){
            //             return {c:c, index: i};
            //         }
            //     }else{
            //         if(type == cInfo.type && !c.isSpclType){
            //             return {c:c, index: i};
            //         }
            //     }
            // }
            
            
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
    _movingCard : null,
    _addTouchEvent : function () {
        var self = this;
        var starP = cc.p(0, 0);
        var cClone = null;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                starP = self.convertTouchToNodeSpace(touch);
                self._lastP = starP;
                //if(MjClient.playui._handMode == 1){
                    var index = self.getCardIndexByPos(starP);
                    if(index >= 0 && self._movingCard == null){
                        var c = self._cardsList[index];
                        cClone = new yzLaoChuo.Card(c.getInfo());
                        cClone.sourceCard = c;
                        c.parent.addChild(cClone);
                        cClone.y = c.y;
                        cClone.x = c.x;
                        c.setOpacity(125);
                        self._movingCard = cClone.clone();
                    }else{
                        if(self._movingCard !== null && cc.sys.isObjectValid(self._movingCard)){
                            if(self._movingCard.sourceCard && cc.sys.isObjectValid(self._movingCard.sourceCard)){
                                self._movingCard.sourceCard.setOpacity(255);
                            }
                            self._movingCard.removeFromParent(true);
                            self._movingCard = null;
                            cClone = null;
                            return false;
                        }
                    }
                //}
                return self._isTouchOpen;
            },
            onTouchMoved: function (touch, event) {
                var p = self.convertTouchToNodeSpace(touch);
                //if(MjClient.playui._handMode == 1){
                    if(cClone){
                        cClone.x = p.x;
                        cClone.y = p.y;
                    }
                //}else{
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

                        //self._markCardsByPos(self._lastP, p);
                        self._lastP = p;

                        // var index = self.getCardIndexByPos(p);
                        // if(index >= 0){
                        //     var c = self._cardsList[index];
                        //     if(c && !c.isSelected){
                        //         self.playSelectSound();
                        //         self.doSelectAction(c);
                        //     }
                        // }
                    }
                //}
                
            },
            onTouchCancelled: function (touch, event) {
                self._isMove = false;
                self._moveDir = 0;
            },
            onTouchEnded: function (touch, event) {
                var p = self.convertTouchToNodeSpace(touch);
                //if(MjClient.playui._handMode == 1){
                    if(cClone){
                        cClone.removeFromParent(true);
                        cClone.sourceCard.setOpacity(255);

                        var oldX = cClone.sourceCard.x;
                        var index = Math.floor((p.x) / self._gap);
                        var oldIndex = Math.floor((oldX) / self._gap);
                        console.log(index);
                        var arr = self.cardsMatrix[index];
                        if(arr){
                            if(oldIndex != index && arr.length < 4){
                                //删除 原来的
                                self.removeAndRefreshCards(cClone.sourceCard, oldIndex);
                                arr.push(cClone.sourceCard);
                                self.refreshAllCards();
                            }
                        }else{
                            if(self.cardsMatrix.length < self._maxCol){
                                //删除 原来的
                                self.removeAndRefreshCards(cClone.sourceCard, oldIndex);
                                //添加到新位置
                                var len = self.cardsMatrix.length;
                                self.cardsMatrix[len] = [];
                                self.cardsMatrix[len].push(cClone.sourceCard);
                                self.refreshAllCards();
                            }else if(index > self._maxCol - 1){
                                if(index >= self._maxCol){

                                }else{
                                    if(oldIndex != index){
                                        //删除 原来的
                                        self.removeAndRefreshCards(cClone.sourceCard, oldIndex);
                                        var len = self.cardsMatrix.length - 1;
                                        arr = self.cardsMatrix[len];
                                        arr.push(cClone.sourceCard);
                                        self.refreshAllCards();
                                    }
                                }
                            }else if(index < 0){
                                //删除 原来的
                                self.removeAndRefreshCards(cClone.sourceCard, oldIndex);
                                arr = self.cardsMatrix[0];
                                arr.push(cClone.sourceCard);
                                self.refreshAllCards();
                            }
                        }
                        cClone = null;
                        self._movingCard = null;
                    }
                //}else{
                    if(self._isMove){
                        self._isMove = false;
                        self._moveDir = 0;
                        // self.showMarkCards();
                        return;
                    }

                    var index = self.getCardIndexByPos(p);
                    if(index == -1){
                        self._unSelectAllCards();
                    }else{
                        var c = self._cardsList[index];
                        if(c && !c.isSelected){
                            self.playSelectSound();
                        }
                        self.doSelectAction(c);

                        // self.doMarkCard(c);
                    }
                    self._moveDir = 0;
                    cClone = null;
               // }

            }
        });
        cc.eventManager.addListener(touchListener, this);
    },

    playSelectSound : function(){
        playEffect("yongZhouLaoChuo/effect/cardClick", false);
    },

    setTouchOpen : function (flg) {
        this._isTouchOpen = flg;
    },

    _markCardsByPos : function (startP, endP) {
        var pGap = cc.pDistance(startP, endP);
        var step = 25;
        var num = Math.floor(pGap / step);
        for(var i = 0; i < num; i++){
            var tx = startP.x + (endP.x - startP.x)/num * i; 
            var ty = startP.y + (endP.y - startP.y)/num * i; 
            console.log(tx, ty);
            var index = this.getCardIndexByPos(cc.p(tx, ty));
            if(index >= 0){
                var c = this._cardsList[index];
                if(c && !c.isSelected){
                    this.doSelectAction(c);
                }
            }
        }
        var index = this.getCardIndexByPos(endP);
        if(index >= 0){
            var c = this._cardsList[index];
            if(c && !c.isSelected){
                this.doSelectAction(c);
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
                // ty = card.row * card.rowGap ;
                this.doMarkCard(card);
            }else{
                // card.y = card.row * card.rowGap + 20;
                // ty = card.row * card.rowGap + 20;
                this.doMarkCard(card);
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
            if(tData.lastPutCard && tData.lastPutCard.length > 0 /*&& tData.lastPutCardType >= 0*/){
                var flg = MjClient.majiang.isBigger(typeList, tData.lastPutCard, tData.lastPutCardType, tData.areaSelectMode);
                this._chuBtn.setBright(flg);
                this._chuBtn.setIsTouchEnable(flg);
            }else{
                this._chuBtn.setIsTouchEnable(true);
                this._chuBtn.setBright(true);

                var tData = MjClient.data.sData.tData;
                //var type = MjClient.majiang.getCardType(typeList, tData.shunType, tData.hasWings);

                var type = MjClient.majiang.getCardsType(typeList, tData.areaSelectMode).type;
                if(type == yzLaoChuo.CARD_TYPE.noType){
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
                card.removeFromParent(true);
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

        var cards = [];
        for(var i = 0; i < typeList.length; i++){
            var c = this._findCardByInfo({type:typeList[i]}, true);
            if(c){
                c.isSelected = true;
                cards.push(c);
            }
        }
        this.removeCardByCardList(cards);
        // this.remoeCards(infoList);
    },

    remoeCards : function (list) {
        var len = list.length;
        for(var i = 0; i < len; i++){
            if(list[i]){
                this._removeCardByInfo(list[i]);
                this._removeInfoByInfo(list[i]);
            }
        }


        // var count = this._cardsList.length;
        // var obj = this._getStartObj(count);

        // for(var i = 0; i < count; i++){
        //     var card = this._cardsList[i];
        //     var tx = obj.startX + i * obj.gap;
        //     card.x = tx;
        //     card.y = 0;
        //     card.row = 0;
        //     card.setLocalZOrder(i);

        //     if(i >= this._rowNum){
        //         var row = Math.floor(i / this._rowNum);
        //         var col = Math.abs(i - this._rowNum);
        //         tx = obj.startX + col * obj.gap;
        //         var ty = row * card.rowGap;
        //         card.setLocalZOrder(row*-1);
        //         card.row = row;
        //         card.x = tx;
        //         card.y = ty;
        //     }
        // }
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
            var type = this._list[i];
            if(type == info.type){
                this._list.splice(i,1);
                return;
            }
        }
    },

    // groupCards : function(list){
    //     var arr1 = list.slice(0, this._rowNum).reverse();
    //     var arr2 = [];
    //     if(list.length > this._rowNum){
    //         arr2 = list.slice(this._rowNum).reverse();
    //     }
    //     arr1 = arr1.concat(arr2);
    //     return arr1;
    // },

    addCards : function (list,isShow) {
        var len = list.length;
        var arr = []; 
        for(var i = 0; i < len; i++){
            arr.push(list[i].type);
        }
        this.addCards2(arr, isShow);
        return;
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
        var card = new yzLaoChuo.Card(info);
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
                // this._tipBtn.setBright(true);
                // this._tipBtn.setIsTouchEnable(true);
                // this.showFaceAllCards();
                this.refreshHandCards();

                if(IsTurnToMe()/*curPlayerIsMe_leiyang(0)*/){
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
    },

    doLiPai : function(){
        if(!this._isTouchOpen){
            return;
        }

        this._chuBtn.setIsTouchEnable(false);
        this._chuBtn.setBright(false);

        var arr = [];
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var c = this._cardsList[i];
            var type = c.getInfo().type;
            if(type){
                arr.push(type);
            }
        }

        cc.log("doLiPai arr:", arr);
        arr = MjClient.majiang.sortCard(arr);
        cc.log("doLiPai arr:", arr);

        var list = [];
        for(var i = 0; i < arr.length; i++){
            var info = {type:arr[i]};
            list.push(info);
        }
        this.addCards(list, true);
        // this._tipBtn.setBright(true);
        // this._tipBtn.setIsTouchEnable(true);
    },

    addCards2 : function(list, isShow){
        console.log("addCards2 @@@");
        this.setTouchOpen(false);
        this.removeAllCards();
        this.unscheduleAllCallbacks();
        this._count = 0;

        if(this._cardsList && this._cardsList.length > 0){
            // this.remoeCards(this._list);
            this._cardsList = [];
            this._list = [];
        }

        this._list = list;
        //var obj = MjClient.majiang.formatHandCard(list);

        var countRet = {};
        function formatHandCard(list){
            var ret = {};
            for(var i = 0; i < list.length; i++){
                var item = list[i];
                var p = item > 20 ? (item%20) : item;
                if(ret[p]){
                    ret[p].push(item);
                }else{
                    ret[p] = [item];
                }

                if(countRet[item]){
                    countRet[item]++;
                }else{
                    countRet[item] = 1;
                }
            }
            return ret;
        }
        var obj = formatHandCard(list);

        var indexMax = 99;
        var all = {};
        var single = [];
        for(var k in obj){
            if(obj[k] && obj[k].length == 1){
                single = single.concat(obj[k]);
            }else if(obj[k] && obj[k].length > 1){
                all[k] = obj[k];
            }
        }
        single.sort(function(a,b){
            var p1 = a%20;
            var p2 = b%20;
            return p1-p2;
        });
        all[indexMax] = [];
        for(let i = 0; i < single.length; i++){
            all[indexMax].push(single[i]);
        }


        obj = {};
        obj = all;

        for(var k in obj){

            if( Number(k) == indexMax ){
                continue;
            }

            if( obj[k] && obj[k].length > 1 ){
                let _big = Number(k) + 20;
                if( countRet[k] && countRet[k] > 0 &&  
                    countRet[_big] && countRet[_big] > 0){
                    if(countRet[k] > countRet[_big]){
                        obj[k].sort(function(a, b){
                            return a-b;
                        })
                    }else if(countRet[k] <= countRet[_big]){
                        obj[k].sort(function(a, b){
                            return b-a;
                        })
                    }
                }

            } 
        }

        var len = Object.keys(obj).length;
        for(var k in obj){
            if(obj[k].length > 4){//1列最多4个
                len++;
            }
        }

        var num = 0;
        if(len < this._maxCol){
            //说明有空列 居中
            var num = Math.floor((this._maxCol - len)*0.5);  
        }
        cc.log("jjjjjjjjj-------" + JSON.stringify(obj));

        var index = num;
        this.cardsMatrix = [];
        var dt = 0;
        for(var key in obj){
            var arr = obj[key];
            if(!arr || (arr && arr.length == 0)){
                continue;
            }
            //优化
            this.cardsMatrix[index] = [];
            for(var i = 0; i < arr.length; i++){

                if(i == 4){
                    index += 1;
                    this.cardsMatrix[index] = [];
                }
                var card = new yzLaoChuo.Card({type:arr[i], name:"hand"});
                // card.setAnchorPoint(0,0);
                card.x =  card.width * 0.5 + index * this._gap;
                card.y = (i%4) * card.rowGap;
                card.row = (i%4);
                card.setStatus(daTongZi.CardStatus.UNHOOD);
                this.addChild(card);
                card.setLocalZOrder((i%4)*-1);
                this._cardsList.push(card);
                card.tag = i;

                if(!isShow )
                {   
                    card.setOpacity(255);
                    // dt = this._cardsList.length * 0.0005;
                    // card.runAction(cc.sequence(cc.delayTime(dt),cc.fadeIn(0.1))); 
                }else{
                    if (MjClient.rePlayVideo == -1){
                        card.setOpacity(0);//不可见让
                    }
                }
                
                this.cardsMatrix[index].push(card);
            }
            index += 1;
        }
        if(!isShow){
            // this._tipBtn.setIsTouchEnable(false);
            // this._tipBtn.setBright(false);
            setTimeout(function(){
                this.setTouchOpen(true);
                // this._tipBtn.setIsTouchEnable(true);
                // this._tipBtn.setBright(true);
            }.bind(this), 2000);
        }else{
            this.setTouchOpen(true);
        }
        
        this.setCardsRedStatus();

        this.refreshAllCards(dt);
    },

    removeAndRefreshCards : function(c, index){
        var cards = this.cardsMatrix[index];
        for(var i = 0; i < cards.length; i++){
            if(c == cards[i]){
                cards.splice(i,1);
                break;
            }
        }

        // this.refreshCards(index);
    },

    resetCards : function(){
        var pl = getUIPlayer_YongZhouLaoChuo(0);
        if(pl){
            this._movingCard = null;
            this.removeAllCards();
            this.addCards2(this._list, true);
            this.refreshAllCards();
            this._checkBtnStatus();
        }
    },
    refreshCards : function(index){
        var cards = this.cardsMatrix[index];

        if(cards && cards.length == 0){
            this.cardsMatrix.splice(index,1);
            this.refreshAllCards();
        }else{
            for(var i = 0; i < cards.length; i++){
                var card = cards[i];
                card.y = i * card.rowGap;
                card.row = i;
                card.x = index * this._gap + card.width * 0.5;
                card.setLocalZOrder(i * -1);
            }
        }

    },

    refreshAllCards : function(dt){
        var len = this.cardsMatrix.length;
        for(var i = 0; i < this.cardsMatrix.length; i++){
            var list = this.cardsMatrix[i];
            if(!list || list.length == 0){
                this.cardsMatrix.splice(i,1);
                i -= 1;
            }
        }
        len = this.cardsMatrix.length;
        if(len < this._maxCol){
            //说明有空列 居中
            var num = this._maxCol - len;
            for(var i = 0; i < num; i++){
                if(i % 2 == 1){
                    this.cardsMatrix.unshift([]);
                }else{
                    this.cardsMatrix.push([]);
                }
            }
        }
        var xCol = 0;
        for(var i = 0; i < this.cardsMatrix.length; i++){
            var list = this.cardsMatrix[i];
            //MjClient.majiang.sortColumnArr(list);
            for(var j = 0; j < list.length; j++){
                var card = list[j];
                if(card && cc.sys.isObjectValid(card)){
                    card.y = j%4 * card.rowGap;
                    card.row = j%4;
                    card.x = ((j == 5) ? (++xCol) : xCol) * this._gap + card.width * 0.5 ;
                    card.setLocalZOrder(j%4 * -1);
                }else{
                    list.splice(j,1);
                    j -= 1;
                }
                
            }
            xCol++;
        }

        /*if(dt){
            setTimeout(function(){
                this.addNumTips();
            }.bind(this), dt * 1000);
        }else{
            this.addNumTips();
        }*/
        
    },

    setHandMode : function(){
        this._upBtn
        var type = MjClient.playui._handMode;
        if(type == 1){
            this._btnNode.visible = false;
            this._unSelectAllCards();
        }else{
            if(IsTurnToMe()){
                this._btnNode.visible = true;
                this._checkBtnStatus();
            }
        }

        if(this._movingCard !== null && cc.sys.isObjectValid(this._movingCard)){
            if(this._movingCard.sourceCard && cc.sys.isObjectValid(this._movingCard.sourceCard)){
                this._movingCard.sourceCard.setOpacity(255);
            }
            this._movingCard.removeFromParent(true);
            this._movingCard = null;
        }
    },

    numTipsList : [],
    addNumTips : function(){
        var len = this.numTipsList.length;
        for(var i = 0; i < len; i++){
            var tip = this.numTipsList[i];
            tip.removeFromParent(true);
        }
        this.numTipsList = [];

        len = this.cardsMatrix.length;
        for(var i = 0; i < len; i++){
            var arr = this.cardsMatrix[i];
            var num = this.getTipsNum(arr);
            if(num >= 4){
                var sp = new cc.Sprite("baZhaDan/numBg.png");
                sp.x = this._gap * i + 56;
                sp.y = 0;
                this.addChild(sp,100);
                this.numTipsList.push(sp);

                var text = new ccui.Text();
                text.setFontName("fonts/fzcy.ttf");
                text.setString(num + " 张");
                text.setColor(cc.color.YELLOW);
                text.enableOutline(cc.color(136,54,7), 2);
                text.setFontSize(22);
                text.setPosition(sp.getContentSize().width/2, sp.getContentSize().height/2);
                sp.addChild(text);
            }
        }
    },

    getTipsNum : function(arr){
        var len = arr.length;
        var type = 0;
        var count = 0;
        for(var i = 0; i < len; i++){
            var c = arr[i];
            var ct = c._info.type % 100;
            if(type == 0){
                type = ct;
            }else if(type != ct){
                return 0;
            }
            count += 1;
        }
        return count;
    },
    removeCardByCardList : function(cards){
        var len = cards.length;
        while(cards.length){
            console.log(cards.length);
            var c = cards[0];
            var cx = c.x;
            var index = Math.floor((cx) / this._gap);
            this.removeAndRefreshCards(c, index);
            cards.splice(0, 1);
            this._removeCard(c);
        }
    },

    _removeCard : function (card) {
        var len = this._cardsList.length;
        for(var i = 0; i < len; i++){
            var tempC = this._cardsList[i];
            if(card == tempC){
                this._removeInfoByInfo(card._info);
                card.removeFromParent();
                card = null;
                this._cardsList.splice(i,1);
                return;
            }
        }
    },
});