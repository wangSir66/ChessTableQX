var majiang_winGamePanel_changSha = majiang_winGamePanel_yueyang.extend({

    //override
    ctor:function(){
        this._super();

        this.showQiShouHuBtn();
    },
    
    // 起手胡按扭
    showQiShouHuBtn: function() {
        var qiShouHuBtn = new ccui.Button("gameOver/hu.png");
        qiShouHuBtn.setPosition(430, 35);
        var backLayer = this.endOneJson.node.getChildByName("back");
        backLayer.addChild(qiShouHuBtn);

        qiShouHuBtn.addTouchEventListener(function(sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                var layer = new showQiShouHuView();
                MjClient.Scene.addChild(layer);
            }
        });
    },

    //override 小结算显示捉鸟内容【岳阳统一增加listview存放鸟牌】
    showAddBird : function (back, tData) {
        var img_bridTips = back.getChildByName("img_bridTips");
        var listViewBirds = img_bridTips.getChildByName("listview_niao");
        var cards = tData.mopai;
        var niaoCards = tData.niaoCards;
        var cardnode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
        var countNode = img_bridTips.getChildByName("text_count");
        cardnode.visible = false;
        var slotwith = cardnode.width * cardnode.scale * 0.9;
        var zhongCount = 0, posX;
        for(var i = 0; i < cards.length; i++) {
            var cloneCard = util.clone(cardnode);
            cloneCard.setName(MjClient.playui.HandleCardType["Chi"]);
            cloneCard.visible = true;
            listViewBirds.pushBackCustomItem(cloneCard);
            MjClient.playui.setCardSprite(cloneCard, cards[i], true);
            if(niaoCards.indexOf(cards[i]) == -1){
                cloneCard.setColor(cc.color(170,170,170));
            }
            // if (this.isZhongNiao(cards[i])) {
            //     zhongCount++;
            // }else{
            //     cloneCard.setColor(cc.color(170,170,170));
            // }

            if(i === cards.length - 1){
                posX = cardnode.x + slotwith * (i + 1);
            }
        }

        countNode.setVisible(false);
        // if(zhongCount === 0){
        //     countNode.setVisible(false);
        // }else{
        //     listViewBirds.refreshView();
        //     countNode.setPosition(cc.p(posX, listViewBirds.y));
        //     countNode.setString("+" + zhongCount);
        // }
    },
});



//获取小结算中单个玩家的牌型描述
majiang_winGamePanel_changSha.prototype.getCardTypeDesc = function(pl,sData){
	if(pl.qiShouHuScore){
        var str = pl.qiShouHuScore > 0? "起手胡+":"起手胡";
        str += pl.qiShouHuScore;
        pl.mjdesc.push(str);
    }
	return pl.mjdesc + ""; 
};

// 设置单个玩家面板数据
majiang_winGamePanel_changSha.prototype.setEndOneUserUI = function(infoImg,off){
    this.addInfoScoreNotEnough(infoImg,off);
	var sData = MjClient.data.sData;
	var tData = sData.tData;
    var pl = MjClient.playui.getPlayerWithIndex(off);
    // cc.log(" ===== lms 99999 ----- ",JSON.stringify(pl));
	if(!pl)return;

	infoImg.setVisible(true);
	infoImg = infoImg.getChildByName("layout_infoData");
	 
	var img_zhuang = infoImg.getChildByName("img_zhuang");
	var zhuangIndex = (typeof MjClient.preZhuang != 'undefined') ? MjClient.preZhuang : tData.zhuang;
    img_zhuang.setVisible(tData.uids[zhuangIndex] == pl.info.uid);
	img_zhuang.zIndex=10;
	var temp = this;
	var uibind= {
		layout_infoData: {
			text_name: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                    this.setFontName("Arial");
                    this.setFontSize(this.getFontSize());
                },
				_text: function () {
				    var nameStr = unescape(pl.info.nickname ) + "";
                    return MjClient.playui.formatUserName(nameStr, 7, true);
				}
			},
			text_id: {
                _run:function(){
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					return "ID:" + pl.info.uid.toString();
				}
			},
			img_eatFrontCard: {_visible: false},
			img_eatBackCard: {_visible: false},
			img_handCard: {_visible: false},
			text_cardType: {
                _run:function(){
                    this.visible = false;
                    this.ignoreContentAdaptWithSize(true);
                },
				_text: function () {
					// return MjClient.endoneui.getCardTypeDesc(pl,sData);
				},
            },
            scrollView: {
	            _run:function()
	            {
                    this.x = 607;
                    this.y = 96;
                    this.visible = true;
					var cardType = this.getChildByName("cardType");
					cardType.ignoreContentAdaptWithSize(true);
					// var str = "" + pl.qiShouHuScore > 0? "起手胡+"+ pl.qiShouHuScore: pl.qiShouHuScore < 0? "起手胡"+ pl.qiShouHuScore:"";
					// if (MjClient.isDismiss && !sData.players[tData.firstDel] && pl.mjdesc[1]){
					// 	if(pl.mjdesc[1].length) str = "," + str;
					// 	cardType.setString(pl.mjdesc[1] + str);
					// } // 会长或管理员解散房间
					// else{
					// 	if(pl.mjdesc.length) str = "," + str;
					// 	cardType.setString(pl.mjdesc + str);
					// }
					cardType.setString(MjClient.endoneui.getCardTypeDesc(pl,sData));
					
					this.setScrollBarOpacity(0);
					if (cardType.getContentSize().width > this.getContentSize().width) {
						this.setInnerContainerSize(cc.size(cardType.getContentSize().width, this.getInnerContainerSize().height))
						cardType.x = cardType.getContentSize().width/2;
					}
	            },
			},
			img_tingIcon:{
				_run: function(){
                    this.visible = false;
					// MjClient.endoneui.showTingIcon(pl,this);
				}
			},
			text_winNum: {
				_run:function(){
					this.ignoreContentAdaptWithSize(true);
				},
				_text: function () {
                    var pre = "";
                    // 精度修正
                    var revise = function(num, times) {
                        // times = 1/允许误差
                        times = times || 1e6;
                        return Math.round(num * times) / times;
                    };
					if(pl.qiShouHuScore){
                        pl.winone += pl.qiShouHuScore;
                        pl.winone = revise(pl.winone);
                        
					}
					if (pl.winone > 0) pre = "+";
                    if(tData.areaSelectMode.scoreNeedEnough){
                        if(pl.qiShouHuScore){
                            pl.winone2 += pl.qiShouHuScore;
                            pl.winone2 = revise(pl.winone2);
                            
                        }
                        pl.winone2 = revise(pl.winone2);
                        return pre + pl.winone2;
                    }
					return pre + pl.winone;
				}
			},
			img_huType: {
				_run: function () {
					MjClient.endoneui.setGameOverPanelPlayerState(this, pl, true);
				}
			}
		}
	};
	BindUiAndLogic(infoImg.parent,uibind); 
    this.addWxHeadToEndUI(infoImg.getChildByName("img_head"), off);
    this.showHandCard(pl, infoImg);
    this.setEndOneHasBirds(pl.niaoCards, infoImg);
    MjClient.playui.setUserOfflineInWinGame(infoImg.getChildByName("img_head"), pl);    

};

// 获取小结算手牌排序过的数组 【明杠,1，暗杠，1，碰，吃，赖子，手牌】 数组内容带1 增加间隔
majiang_winGamePanel_changSha.prototype.createEndSortCardArr = function(pl, infoImg){
	//明杠
	var i, j, cardNode, arry = [];
	for (i = 0; i < pl.mjgang0.length; i++) {
		for (j = 0; j < 4; j++) {
			cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront, 
				MjClient.playui.HandleCardType.MingGang, pl.mjgang0[i], true);
			arry.push(cardNode);
		}
		arry.push(1); // 标志多移动一点
	}
	//添加暗杠
	for (i = 0; i < pl.mjgang1.length; i++) {
		for (j = 0; j < 4; j++) { 
			// 给牌背
			var handleCardType = j == 2 ? MjClient.playui.CsdDefaultCardType.EatCardBack : MjClient.playui.CsdDefaultCardType.EatCardFront;
			var cardTag = j == 2 ? null : pl.mjgang1[i];
            cardNode = MjClient.playui.createCard(infoImg, handleCardType, MjClient.playui.HandleCardType.AnGang, cardTag, true);
			arry.push(cardNode);
		}
		arry.push(1); // 标志多移动一点
	}
	//添加碰
	for (i = 0; i < pl.mjpeng.length; i++) {
		for (j = 0; j < 3; j++) {
			cardNode= MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront, 
				MjClient.playui.HandleCardType.Peng, pl.mjpeng[i], true);
			arry.push(cardNode);
		}
		arry.push(1); // 标志多移动一点
	}
	//添加吃
	for (i = 0; i < pl.mjchi.length; i++) {
		cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.EatCardFront, 
			MjClient.playui.HandleCardType.Chi, pl.mjchi[i], true);
		arry.push(cardNode);
		if(i != 0 && (i + 1) % 3 == 0) arry.push(1); // 标志多移动一点
	} 
	arry.push(1); // 标志多移动一点 ;

	 
	var isSeparate = false; // 是否需要隔开最后一张-
    if (pl.mjhand && pl.mjhand.length > 0){
        var count = MjClient.majiang.CardCount(pl);
        isSeparate = (count >= 14); 
    }  
    while(pl.mjhand.length > 14){
        pl.mjhand.pop();
    }
    var sortHandCard = this.getHandSort(pl.mjhand, isSeparate);
    if(!sortHandCard) return MjClient.endoneui.removeFromParent(true);
    var huCards = 0;
    var sData = MjClient.data.sData;
	var tData = sData.tData;
    for(var g = 2;g<=4;g++){
        if(pl["hu" + g] && tData["lastPutCard" + g]){
            huCards ++;
            sortHandCard.push(tData["lastPutCard" + g]);
        }
        
    }
    
	//添加手牌
	for (i = 0; i < sortHandCard.length; i++) {
		if( isSeparate && i == (sortHandCard.length - 1 - huCards)){
			arry.push(1); // 标志多移动一点
		}
		cardNode = MjClient.playui.createCard(infoImg, MjClient.playui.CsdDefaultCardType.HandCard, 
			MjClient.playui.HandleCardType.Hand, sortHandCard[i], true);
		arry.push(cardNode);

    } 
    
	return arry;
};

// 设置单个玩家面板数据
majiang_winGamePanel_changSha.prototype.setEndOneHasBirds = function(cardArr, infoImg){
    if(cardArr.length <= 0) return;
    var _card = infoImg.getChildByName("img_eatFrontCard");
    _card.setScale(0.3);
    var _posxStart = 170;
    var _posy = 20;
    if(cardArr.length > 3){
        _posxStart = _posxStart - 20 * (cardArr.length - 3);
    }
    var addFace = function(n, card) {
        var cardImg = MjClient.playui.getCardFaceImg3D(n);
        cardImg.x = card.width / 2;
        cardImg.y = card.height * 0.6;
        card.removeAllChildren();
        card.addChild(cardImg);
    }
    for(var i = 0;i< cardArr.length;i++){
        var node = _card.clone();
        node.visible = true;
        addFace(cardArr[i], node);
        node.y = _posy;
        node.x = _posxStart + (i * 30);
        infoImg.addChild(node);

    }
};

// 分享按钮点击事件
majiang_winGamePanel_changSha.prototype.btnShareEevent = function(btn){
    var tData = MjClient.data.sData.tData;
    if (tData.roundNum >0){
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJShuffle"
        },function(data) {
            if (data != null && data.code == -1){
                MjClient.showToast(data.message);
                return;
            }
            MjClient.endoneui.btnReadyEvent();
            // 重置头像所在位置
            if(MjClient.playui) MjClient.playui.resetPlayerHeadLayout();
        });
    }else{
        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Xiaojiesuanjiemian_Fenxiang", {uid:SelfUid()});
        MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function() {
            postEvent("capture_screen");
            MjClient.endoneui.capture_screen = true;
            btn.setTouchEnabled(false);
        });
    }
};

//重置分享按钮是码牌还是分享
majiang_winGamePanel_changSha.prototype.resetShareBtn = function(btn){
    var tData = MjClient.data.sData.tData;
    if (tData.roundNum >0 && MjClient.rePlayVideo == -1){
        btn.loadTextureNormal("gameOver/newOver/btn_mapai_n.png");
        btn.loadTexturePressed("gameOver/newOver/btn_mapai_s.png");
       
        var texturePath = "gameOver/newOver/ico_yuanbao.png";
        var propNum = 2;
        if(MjClient.data.sData.tData.areaSelectMode.fangkaCount != undefined) {	//钻石场
            texturePath = "gameOver/newOver/ico_zuanshi.png";
            propNum = 1
        }

        var text = ccui.Text.create("x"+propNum, "res/fonts/lanting.TTF", 32);
        text.setAnchorPoint(cc.p(0,0.5));
        text.setPosition(cc.p(btn.width/2 * btn.scaleX + 20, btn.height/2));
        text.setColor(cc.color("#ff0000"));
        btn.addChild(text);

        var img = ccui.ImageView.create(texturePath);
        img.setPosition(cc.p(text.x + text.width + img.width/2 + 3, btn.height/2));
        img.setScale(0.9);
        btn.addChild(img);
    }else{
        btn.removeAllChildren();
        btn.loadTextureNormal("gameOver/duihuan_37.png");
        btn.loadTexturePressed("gameOver/duihuan_37_s.png");
    }
}




/**
 *  显示起手胡
 **/
var showQiShouHuView = cc.Layer.extend({

    ctor: function () {
        this._super();
        var showflowerUI = ccs.load("showQiShouHuTips.json");
        this.addChild(showflowerUI.node);
        var that = this;

        var _block = showflowerUI.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        _block.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                that.removeFromParent();
            }
        }, this);

        var _back = showflowerUI.node.getChildByName("back");
        setWgtLayout(_back, [0.85, 0.8], [0.5, 0.5], [0, 0], 2);

        var _isShow = this.isHaveData();
        var icon = _back.getChildByName("Image_1");
        icon.visible = !_isShow;

        for (var i = 0; i < 4; i++) {
            this["node_" + i] = _back.getChildByName("node_" + i);
            this["node_" + i].visible = false;
            this["scroll_" + i] = this["node_" + i].getChildByName("ScrollView_1");
            this["scroll_" + i].visible = false;
            for (var j = 0; j < 2; j++) {
                this["scroll_" + i].getChildByName("out" + j).setVisible(false);
            }
        }

        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        if (_isShow) {
            cc.log("========= sData.player ", JSON.stringify(sData.players));
            for (var i = 0; i < uids.length; i++) {
                var _player = sData.players[uids[i]];
                this["node_" + i].visible = true;
                this.showQSHcards(this["node_" + i], _player.qiShouHuDone, _player);
            }
        }
        UIEventBind(null, this, "roundEnd", function (msg) {
            that.removeFromParent();
        });

        return true;
    },
    isHaveData: function () {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        for (var i = 0; i < uids.length; i++) {
            if (uids[i] == 0 || !sData.players[uids[i]]) {
                return false;
            }
        }
        var haveData = false;
        for (var i = 0; i < uids.length; i++) {
            if (!sData.players[uids[i]].qiShouHuDone) {
                sData.players[uids[i]].qiShouHuDone = [];
            }
            if (sData.players[uids[i]].qiShouHuDone.length > 0) {
                haveData = true;
            }
        }

        if (haveData) {
            return true;
        }

        return false;

    },

    showQSHcards: function (node, data, pl) {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var url = pl.info.headimgurl;
        if (!url) url = "png/default_headpic.png";
        cc.loader.loadImg(url, {
            isCrossOrigin: true
        }, function (err, texture) {
            if (!err && texture && cc.sys.isObjectValid(node)) {
                var headSprite = new cc.Sprite(texture);
                var nobody = node.getChildByName("nobody");
                if (!nobody || !cc.sys.isObjectValid(nobody)) {
                    return;
                }
                headSprite.setPosition(nobody.width / 2, nobody.height / 2 + 2);
                headSprite.width = nobody.width * 0.85;
                headSprite.height = nobody.height * 0.85;
                nobody.addChild(headSprite);

            }
        });
        if (data.length <= 0) {
            return;
        }
        var _cards_all = 0;
        var _sameCards = [];
        for (var i = 0; i < data.length; i++) {

            if (data[i].tag && data[i].tag == "起手已胡中途不能胡") {
                continue;
            }
            var _cards = data[i].cards;
            //重复的牌 就不显示了
            var iscontinue = false;
            for (var k = 0; k < _sameCards.length; k++) {
                if (JSON.stringify(_sameCards[k]) == JSON.stringify(_cards)) {
                    iscontinue = true;
                }
            }
            _sameCards.push(_cards);
            if (iscontinue) {
                continue;
            }


            _cards_all += data[i].cards.length;
            _cards_all++;

        }

        var scroll = node.getChildByName("ScrollView_1");
        var out0 = scroll.getChildByName("out0");
        var out1 = scroll.getChildByName("out1");
        scroll.visible = true;
        var _scale = out0.getScale() - 0.01;
        var _width = out0.width * _scale;
        var _pos1 = out1.getPosition();
        var _pos = out0.getPosition();
        var _num = 0;
        if (_cards_all < 42) {
            _cards_all = 42;
        }
        scroll.setInnerContainerSize(cc.size(_width * Math.round(_cards_all / 2), 100));
        _sameCards = [];
        for (var i = 0; i < data.length; i++) {
            var _cards = data[i].cards;
            _cards.sort(function (a, b) {
                return a - b;
            });

            if (data[i].tag && data[i].tag == "起手已胡中途不能胡") {
                continue;
            }
            //重复的牌 就不显示了
            var iscontinue = false;
            for (var k = 0; k < _sameCards.length; k++) {
                if (JSON.stringify(_sameCards[k]) == JSON.stringify(_cards)) {
                    iscontinue = true;
                }
            }
            _sameCards.push(_cards);
            if (iscontinue) {
                continue;
            }


            var addFace = function(n, card) {
                var cardImg = MjClient.playui.getCardFaceImg3D(n);
                cardImg.x = card.width / 2;
                cardImg.y = card.height / 2;
                card.removeAllChildren();
                card.addChild(cardImg);
            }
            for (var j = 0; j < _cards.length; j++) {
                var out = out0.clone();
                if (_num >= _cards_all / 2 && _num >= 21) {
                    out = out1.clone();
                    _pos = _pos1;
                }
                out.visible = true;
                addFace(_cards[j], out)

                out.x = _pos.x;
                scroll.addChild(out);
                _pos.x += _width;
                _num++;

            }
            _pos.x += _width * 0.95;
            _num++;

        }

    },
});
