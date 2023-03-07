
// 切牌
var cutcardsLayer = function () {
    var Layer = cc.Layer.extend({
        ctor: function() {
            this._super();
            this.screenScaleX = MjClient.size.width/1280;
            this.screenScaleY = MjClient.size.height/720;
            this.screenScale = Math.min(this.screenScaleX, this.screenScaleY);
            this.setVisible(false);
            this.initMsgEvent();
        },
        initMsgEvent: function () {
            UIEventBind(null, this, "initSceneData", function (eD) {
                this.dealInitSceneData(eD);
            });
            UIEventBind(null, this, "showPlayerShuffleView", function (eD) {
                this.dealShowPlayerShuffleView(eD);
            });
            UIEventBind(null, this, "select_shuffle_index", function (eD) {
                this.dealSelectShuffleIndex(eD);
            });
            UIEventBind(null, this, "showPlayerShuffleAnim", function (eD) {
                this.dealshowPlayerShuffleAnim(eD);
            });
        },
        dealInitSceneData: function (d) {
            if (d.tData.tState == TableState.afterReady && d.tData.actionName == 'qiepai'){
                var tData = MjClient.data.sData.tData;
                var isMe = SelfUid() == tData.uids[d.tData.curPlayer];
                var players = MjClient.data.sData.players;
                var player = players[tData.uids[d.tData.curPlayer]];
                this.showView(isMe,d.tData.shuffleCardsNum, player.info.nickname)
            }else{
                this.setVisible(false)
            }
        },
        dealShowPlayerShuffleView: function (d) {
            var tData = MjClient.data.sData.tData;
            var isMe = SelfUid() == tData.uids[d.curPlayer];
            var players = MjClient.data.sData.players
            var player = players[tData.uids[d.curPlayer]]
            this.showView(isMe,d.shuffleCardsNum, player.info.nickname)
        },
        dealSelectShuffleIndex: function (d) {
            if(this._isMe != true){
                this.viewPokerBgListShouldScrollToPoker(this._viewCards, this._viewCards.cardList[d.index])
            }
        },
        dealshowPlayerShuffleAnim: function (d) {
            // 播放动画
            // 从切牌位置，从两边移动，再合并到屏幕中间
            var centerPoker = this._viewCards.cardList[Math.ceil(this._viewCards.cardList.length / 2)]
            var leftPoker = this._viewCards.cardList[0];
            var rightPoker = this._viewCards.cardList[this._viewCards.cardList.length - 1];
            var that = this
            for(var i = 0;i <this._viewCards.cardList.length;i++){
                var poker = this._viewCards.cardList[i];
                var actionMove1 = cc.moveTo(0.4, poker.tag >= this._shuffleIndex ? rightPoker.getPosition() : leftPoker.getPosition()).easing(cc.easeOut(0.4));
                var actionMove2 = cc.moveTo(0.3, centerPoker.getPosition()).easing(cc.easeIn(0.3));
                var actions;
                if(i != this._viewCards.cardList.length - 1) {
                    actions = cc.sequence(actionMove1, actionMove2)
                } else {
                    actions = cc.sequence(actionMove1, actionMove2,cc.delayTime(0.2), cc.callFunc(function () {
                        that.hideView();
                    }))
                }
                poker.runAction(actions)
            }
            this._viewFinger.setVisible(false)
            this._btnShuffle.setVisible(false)
            this._lbTip.setVisible(false)
            this._lbIndex.setVisible(false)
        },
        showView: function (isMe, cardNum, playerName) {
            this.setVisible(true)
            if (!this._btnShuffle) {
                var btnShuffle = new ccui.Button();
                btnShuffle.setTouchEnabled(true);
                btnShuffle.setPressedActionEnabled(true);
                btnShuffle.loadTextures("playing/paodekuaiTable/qiepai.png", "playing/paodekuaiTable/qiepai.png", "");
                btnShuffle.addTouchEventListener(this.onBtnShuffleClicked.bind(this), this);
                btnShuffle.setScale(this.screenScale)
                btnShuffle.setPosition(0, -180 * this.screenScaleY)
                this._btnShuffle = btnShuffle
                this.addChild(btnShuffle);
            }
            if (!this._lbTip) {
                var lbTip = new ccui.Text()
                lbTip.setFontName("fonts/lanting.TTF");
                lbTip.setFontSize(30)
                lbTip.setVisible(false)
                lbTip.setPosition(0, -180 * this.screenScaleY)
                this._lbTip = lbTip
                this.addChild(lbTip)
            }
            if (!this._lbIndex) {
                var _lbIndex = new ccui.Text()
                _lbIndex.setFontName("fonts/lanting.TTF");
                _lbIndex.setFontSize(20)
                _lbIndex.setVisible(true)
                this._lbIndex = _lbIndex
                this.addChild(_lbIndex,1)
            }
            this._lbIndex.setVisible(true)
            if (isMe) {
                this._btnShuffle.setVisible(true)
                this._lbTip.setVisible(false)
            } else {
                this._btnShuffle.setVisible(false)
                this._lbTip.setVisible(true)
                this._lbTip.setString("等待‘"+unescape(playerName)+"’切牌")
            }
            // 手指
            if (!this._viewFinger) {
                var viewFinger = cc.Sprite.create("playing/paodekuaiTable/finger.png")
                viewFinger.setScale(this.screenScale)
                this.addChild(viewFinger,1)
                this._viewFinger = viewFinger
            }

            this._viewFinger.setVisible(true)

            if(this._viewCards){
                this._viewCards.removeFromParent(true)
            }

            this.viewCfg = {
                pokerNum:cardNum,
                pokerBgIcon:"playing/cardPic/beimian_puke.png",
                pokerWidth:120 * this.screenScale * 0.62,
                pokerHeight:178 * this.screenScale * 0.60,
                pokerSpace:12 * this.screenScale * 0.62,
            }

            var viewCards = this.getViewPokerBgList(this,isMe, this._viewFinger.getBoundingBox().height)
            viewCards.y = 56 * this.screenScaleY;
            this._isMe = isMe
            this.addChild(viewCards,0)
            this._viewCards = viewCards

            // 默认选择第一张
            this._shuffleIndex = 0
            this.viewPokerBgListShouldScrollToPoker(viewCards, viewCards.cardList[0])
        },
        hideView: function () {
            this.setVisible(false)
        },
        getViewPokerBgList: function (delegate, isEnabled, touchOffHeight) {
            var viewPokerBgList = new cc.Node()
            var pokerSpace =  this.viewCfg.pokerSpace
            var pokerNum = this.viewCfg.pokerNum
            var viewCardsWidth  = (pokerNum - 1) * pokerSpace + this.viewCfg.pokerWidth;
            var startX = -(viewCardsWidth / 2) + this.viewCfg.pokerWidth / 2
            var cardList = []
            for (var i = 0; i < pokerNum; i++){
                var pokerBg = cc.Sprite.create(this.viewCfg.pokerBgIcon)
                pokerBg.setTag(i)
                var idx = i
                pokerBg.x = startX + (pokerSpace * idx)
                pokerBg.zIndex = i;
                pokerBg.setScale(this.viewCfg.pokerWidth / pokerBg.getContentSize().width ,this.viewCfg.pokerHeight / pokerBg.getContentSize().height)
                viewPokerBgList.addChild(pokerBg)
                cardList.push(pokerBg)
            }
            viewPokerBgList.cardList = cardList
            viewPokerBgList.setContentSize(viewCardsWidth,this.viewCfg.pokerHeight)
            if (isEnabled){
                var onTouchEvent = function(touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var size = target.getContentSize();
                    // 让鼠标手可以滑
                    var rect = cc.rect(-size.width / 2, -size.height / 2 - touchOffHeight , size.width, size.height + touchOffHeight * 2);
                    // 在扑克范围内
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        // 获取具体扑克牌
                        for (var i = 0; i < cardList.length; i++)
                        {
                            var _boundingBox = cardList[i].getBoundingBox();
                            _boundingBox.width = pokerSpace
                            _boundingBox.y -= touchOffHeight
                            _boundingBox.height += touchOffHeight
                            if (cc.rectContainsPoint(_boundingBox, locationInNode))
                            {
                                if (delegate && delegate.viewPokerBgListShouldScrollToPoker){
                                    delegate.viewPokerBgListShouldScrollToPoker(target,cardList[i])
                                }
                                break
                            }
                        }
                        return true;
                    }
                    return true
                }
                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: false,
                    onTouchBegan: function(touch, event)
                    {
                        return onTouchEvent(touch,event)
                    },
                    onTouchMoved: function (touch, event) {
                        return onTouchEvent(touch,event)
                    },
                    onTouchEnded: function (touch, event) {
                        return onTouchEvent(touch,event)
                    }
                });
                //添加触摸监听
                cc.eventManager.addListener(listener, viewPokerBgList);
            }
            return viewPokerBgList
        },
        viewPokerBgListShouldScrollToPoker: function (viewPokerBgList, sender) {
            var pokers = viewPokerBgList.cardList
            // 第一张和最后一张不置灰
            var targetPokers = pokers.filter(function (poker) {
                if (poker.tag < sender.tag){
                    poker.setColor(MjClient.grayColor);
                }else{
                    poker.setColor(cc.color(255,255,255));
                }
                return poker.tag  >= sender.tag
            })
            // 设置当前张数提示
            this._lbIndex.setString("第"+(sender.tag + 1)+"张")
            this._lbIndex.width = sender.getContentSize().width
            this._lbIndex.setAnchorPoint(0.5,0)
            this._lbIndex.x = sender.x - this._lbIndex.getContentSize().width / 2
            // 扑克牌上方10
            this._lbIndex.y = viewPokerBgList.y + sender.getBoundingBox().height / 2 + 10 * this.screenScaleY;
            this._viewFinger.x = sender.x - 8
            // 扑克牌下方10
            this._viewFinger.y = viewPokerBgList.y - (this._viewFinger.getContentSize().height / 2) - 10 * this.screenScaleY;
            // 选中的和上次一样不进行网络请求
            if (sender.tag == this._shuffleIndex){
                return
            }
            // 如果可以交互
            this._shuffleIndex = sender.tag
            if(this._isMe) {
                // 避免频繁请求，将请求放到一个队列，两秒扫描一次，取最后一个请求,发起并清空
                this._requestQueue = this._requestQueue || []
                this._requestQueue.push(sender.tag)
                this.scheduleOnce(function () {
                    if (this._requestQueue.length > 0){
                        var targetIndex = this._requestQueue[this._requestQueue.length - 1]
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "c2s_playerShuffleIndex",
                            index: targetIndex
                        });
                        this._requestQueue = []
                    }
                }, 1.5);
            }
        },
        onBtnShuffleClicked: function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:{
                    this._requestQueue = []
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "c2s_playerShuffleFinish",
                        dealyTime:800,
                    });
                }
            }
        },
    })
    return new(Layer);
}