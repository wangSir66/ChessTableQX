// 投降状态
var TouXiangState = {
    WAIT_CONFIRM: -1,  // 等待确认
    ACCEPTED: 2,  // 接受投降
    REFUSED: 1  // 拒绝投降
};

//申请投降
TouXiangApplicationView = cc.Layer.extend({
    jsBind:{
        back:{
            player1:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.playerTouXiangStatusChanged(this,0,touXiangData);  }}
            },
            player2:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.playerTouXiangStatusChanged(this,1,touXiangData);  }}
            },
            player3:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.playerTouXiangStatusChanged(this,2,touXiangData);  }}
            },
            player4:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.playerTouXiangStatusChanged(this,3,touXiangData);  }}
            },
            yes:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.setButtonVisible(this,touXiangData);  }}
            },
            no:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.setButtonVisible(this,touXiangData);  }}
            },
            time:{
                _event:{TouXiang:function(touXiangData){ MjClient.touxiangUI.showTouXiangCountdown(this,touXiangData.lastTime);  }}
            },
        },
        _event:{
            endRoom:function() {MjClient.touxiangUI.removeFromParent();},
            roundEnd:function(){MjClient.touxiangUI.removeFromParent();},
            LeaveGame:function(){MjClient.touxiangUI.removeFromParent();},
            TouXiang: function(touXiangData) {
                var closeView = true;

                var stateArray = touXiangData.stateAry;
                for (var uid in stateArray) {
                    if (stateArray[uid] == TouXiangState.REFUSED) {
                        // 有人拒绝
                        closeView = true;
                        MjClient.touxiangUI.showFailedToast(uid);
                        break;
                    } else if (stateArray[uid] == TouXiangState.WAIT_CONFIRM) {
                        // 有人还未投票
                        closeView = false;
                    }
                }

                if (closeView) {
                    MjClient.touxiangUI.removeFromParent(); 
                }
            },
            initSceneData: function() {
                if (MjClient.data.sData.tData.tState != TableState.waitTouXiang) {
                    MjClient.touxiangUI.removeFromParent();  
                } else
                    postEvent("TouXiang", MjClient.data.sData.TouXiangData);
            }
        }
    },
    ctor:function (touXiangData) {
        this._super();

        var touxiangUI = ccs.load("SurrenderApplication.json");
        BindUiAndLogic(touxiangUI.node,this.jsBind);
        this.addChild(touxiangUI.node);
        MjClient.touxiangUI=this;

        var _block = touxiangUI.node.getChildByName("block");
        setWgtLayout(_block,[1,1],[0.5,0.5],[0,0],true);

        var _back = touxiangUI.node.getChildByName("back");
        setWgtLayout(_back,[0.6,0.75],[0.5,0.5],[0,0]);

        var applyPlayer = getUIPlayerByUID(touXiangData.scrUid);
        var _player0 = _back.getChildByName("player0");
        _player0.setString("玩家["+unescape(applyPlayer.info.nickname)+"]申请投降");
        _player0.ignoreContentAdaptWithSize(true);

        var _player1 = _back.getChildByName("player1");
        this.playerTouXiangStatusChanged(_player1,0,touXiangData);
        _player1.ignoreContentAdaptWithSize(true);

        var _player2 = _back.getChildByName("player2");
        this.playerTouXiangStatusChanged(_player2,1,touXiangData);
        _player2.ignoreContentAdaptWithSize(true);

        var _player3 = _back.getChildByName("player3");
        this.playerTouXiangStatusChanged(_player3,2,touXiangData);
        _player3.ignoreContentAdaptWithSize(true);

        var _player4 = _back.getChildByName("player4");
        if(_player4){
            this.playerTouXiangStatusChanged(_player4,3,touXiangData);
            _player4.ignoreContentAdaptWithSize(true);
        }
        if(MjClient.data.sData.tData.maxPlayer == 2){
            _player3.visible = false;
            if(_player4){
                _player4.visible = false;
            }
        }else if(MjClient.data.sData.tData.maxPlayer == 3 && _player4){
            _player4.visible = false;
        }

        var _time = _back.getChildByName("time");
        this.showTouXiangCountdown(_time,touXiangData.lastTime);

        //确定解散
        var _yes = _back.getChildByName("yes");
        this.setButtonVisible(_yes,touXiangData);
        _yes.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "TouXiang",
                        isTouXiang: 2
                    });
                    break;
                default :
                    break;
            }
        }, this);

        //取消
        var _no = _back.getChildByName("no");
        this.setButtonVisible(_no,touXiangData);
        _no.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "TouXiang",
                        isTouXiang: 1
                    });
                    break;
                default :
                    break;
            }
        }, this);


        return true;
    },
    onExit:function()
    {
        this._super();

        delete MjClient.touxiangUI;
    }
});

TouXiangApplicationView.prototype.playerTouXiangStatusChanged = function(node,off,touXiangData)
{
    var curPlayer = getUIPlayer(off);
    var curState = touXiangData.stateAry[curPlayer.info.uid];

    if (curState == TouXiangState.WAIT_CONFIRM)
        node.setString("玩家["+unescape(curPlayer.info.nickname)+"]等待选择");
    else if (curState == TouXiangState.REFUSED)
        node.setString("玩家["+unescape(curPlayer.info.nickname)+"]拒绝");
    else
        node.setString("玩家["+unescape(curPlayer.info.nickname)+"]同意");
}

TouXiangApplicationView.prototype.setButtonVisible = function(node,touXiangData)
{
    var curPlayer = getUIPlayer(0);
    var curState = touXiangData.stateAry[curPlayer.info.uid];

    node.visible = curState == TouXiangState.WAIT_CONFIRM;
}

TouXiangApplicationView.prototype.showTouXiangCountdown = function(node,remainTime)
{
    node.stopAllActions();

    var timeRemaining = remainTime/1000;
    var callback = function() {
        if (timeRemaining <= 0)
            timeRemaining = 0;

        var need_s =Math.floor((timeRemaining) % 60);
        var need_m = Math.floor((timeRemaining) / 60);

        if (need_s == 0 && need_m == 0) 
        {
            node.stopAllActions();
        }

        node.setString("在"+need_m+"分"+need_s+"之后将自动同意");

        timeRemaining--;
    }

    callback();
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback),cc.delayTime(1.0))));
}

TouXiangApplicationView.prototype.showFailedToast = function(uid)
{
    var refusePlayer = getUIPlayerByUID(uid);
    MjClient.showToast("玩家["+unescape(refusePlayer.info.nickname)+"]拒绝了投降，本局投降失败！");
}