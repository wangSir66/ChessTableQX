
var EndOneView_pingjiangzhaniao_new = majiang_winGamePanel.extend({
	_jsBind:{
		block: {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        }, 
		back:{
            _layout:[[1,1],[0.5,0.5],[0,0]],
			img_titleType:{
				_run:function(){
					this.zIndex = 99;
					MjClient.endoneui.showTileType(this,getUIPlayer(0));
				}
			},
			btn_share: {
				_click:function(btn,eT){
					MjClient.endoneui.btnShareEevent(btn);
				},
				_visible :function(){
					var tData = MjClient.data.sData.tData;
					return (!MjClient.remoteCfg.guestLogin && !tData.matchId);
				},
				_event:{
					captureScreen_OK:function(){
						if (MjClient.endoneui.capture_screen != true)
							return;
						MjClient.endoneui.capture_screen = false;
						var writePath = jsb.fileUtils.getWritablePath();
						var textrueName = "wxcapture_screen.png";
						var savepath = writePath+textrueName;
						MjClient.shareImageToSelectedPlatform(savepath);
						this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function(){
							this.setTouchEnabled(true);
						}.bind(this))));
					}
				}
			},
			btn_ready:{
				_run:function (){
					if(MjClient.remoteCfg.guestLogin){
						setWgtLayout(this, [0.15, 0.15],[0.5, 0.085],[0, 0], false, true);
					}
				},
				_click:function(btn,eT){
					MjClient.endoneui.btnReadyEvent();
					// 重置头像所在位置
                    if(MjClient.playui) MjClient.playui.resetPlayerHeadLayout();
				},
				_visible :function(){
					var tData = MjClient.data.sData.tData;
					return !tData.matchId;
				}
			},
			text_info: {// 左上角
				_text: function () {
					var tData = MjClient.data.sData.tData;
					var content = tData.gameCnName + "  房间号:" + tData.tableid;
					return content;
				}
			},
			text_dir: {
				_text: function () {
					return  MjClient.playui.getGameDesc(); // 后期用麻将 里面写的那个configCN内容
				}
			},
			text_time:{
				_text:function(){
					return MjClient.roundEndTime + "";
				}
			}
		}
	},
	//用于子类
    jsBind : {},
    endOneJson : null,
    ctor:function () {
        this._super();
 		return true;
    }
});

//显示小结算中单个玩家的听牌图标
EndOneView_pingjiangzhaniao_new.prototype.showTingIcon = function(pl,node){
	node.setVisible(false);
};
EndOneView_pingjiangzhaniao_new.prototype.showAddBird = function(back, tData){
	//显示抓鸟的牌
    var img_bridTips = back.getChildByName("img_bridTips");
    var cards = tData.mopai || [];
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var cardNode = img_bridTips.getChildByName(MjClient.playui.CsdDefaultCardType["EatCardFront"]);
    var countNode = img_bridTips.getChildByName("text_count");
    cardNode.visible = false;
    var slotwith = cardNode.width * cardNode.scale * 0.9;//0.05;
    var pl = sData.players[SelfUid()];

	var zhongCount = 0;
    for(var i = 0;i < cards.length;i++){
        var cloneNode = util.clone(cardNode);
        cloneNode.setName(MjClient.playui.HandleCardType["Chi"]);
        cloneNode.visible = true;
        cloneNode.setPosition(cc.p(cardNode.x + slotwith*i,cardNode.y));
		img_bridTips.addChild(cloneNode);
        MjClient.playui.setCardSprite(cloneNode, cards[i], true);

        var isNiaoCard = false;
        for(var j = 0; pl.niaoCards && j < pl.niaoCards.length; j++){
        	if (cards[i] === pl.niaoCards[j]){
                // zhongCount++;
                isNiaoCard = true;
			}
		}
		if (isNiaoCard == false){
            _node.setColor(cc.color(170,170,170));
		}
    }

    if (tData.winner == -1 && tData.lastPutCard != -1 && !MjClient.isDismiss) {
		var _node = cardNode.clone();
        _node.visible = true;
        _node.setPosition(cc.p(cardNode.x + slotwith*i,cardNode.y));
        _Image_niao.addChild(_node);
        MjClient.playui.setCardSprite(_node, tData.lastPutCard,0);
    }

    if(zhongCount == 0){
    	countNode.setVisible(false);
    }else{
    	var pos = cc.p(cardNode.x + slotwith * cards.length  - slotwith/2, cardNode.y);
    	countNode.setPosition(pos);
    	countNode.setString("+" + zhongCount);

    	if(cards.length >= 6){
            var shareBtn = back.getChildByName("btn_ready");
            var sharePos = shareBtn.getPosition();
            shareBtn.setPosition(cc.p(sharePos.x + 30,sharePos.y));
            var readyBtn = back.getChildByName("btn_share");
            var readyPos = readyBtn.getPosition();
            readyBtn.setPosition(cc.p(readyPos.x + 10,readyPos.y));
        }
    }
};