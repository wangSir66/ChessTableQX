
var EndOneView_xiangyintuidaohu_new = majiang_winGamePanel.extend({
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
				_run: function(){
					MjClient.endoneui.resetShareBtn(this);
				},
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
EndOneView_xiangyintuidaohu_new.prototype.showTingIcon = function(pl,node){
	node.setVisible(false);
	var piaoTxt = new cc.LabelTTF("飘",MjClient.fzcyfont,32);
	piaoTxt.setColor(cc.color(255,220,74))
	piaoTxt.setVisible(pl.jiazhuNum > 0);
	node.getParent().addChild(piaoTxt);
	piaoTxt.setPosition(node.getPosition());
};
//是否可以码牌(默认为false)
EndOneView_xiangyintuidaohu_new.prototype.isCanShuffleCards = function(){
	return true;
};