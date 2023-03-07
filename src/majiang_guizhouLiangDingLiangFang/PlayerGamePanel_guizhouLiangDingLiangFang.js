var PlayLayer_guizhouLiangDingLiangFang;
(function() {
    PlayLayer_guizhouLiangDingLiangFang = PlayLayer_guizhou.extend({
        getJsBind: function() {
            var jsBind = {
                node_down: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_right: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_top: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                node_left: {
                    layout_head: {
                        atlas_score: {
                            _event: { roundEnd: function() {} }
                        },
                    }
                },
                _event:{
                    endRoom: function(msg){
                        if (msg.showEnd) {
                            this.addChild(new GameOverLayer_guizhou(),500);
                        }else{
                            MjClient.Scene.addChild(new StopRoomView());
                        }
                    },
                    clearCardUI:function () {
                        for(var off = 0; off < MjClient.playui.huPaiImageArr.length; off++) {
                            MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                        }
                    },
                    onlinePlayer: function (d) {
                        var tData = MjClient.data.sData.tData;
                        var player = MjClient.playui.getPlayerInfoByOff();
                        if(tData.tState === TableState.roundFinish && d.uid === player.info.uid && player.mjState === TableState.isReady)
                        {
                            for(var off = 0; off < MjClient.playui.huPaiImageArr.length;off++)
                            {
                                MjClient.playui.clearHuTypeImage(MjClient.playui.getNodeByOff(off));
                            }
                        }
                    }
                },
                panel_showAccount:{
                    _visible: false,
                    _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
                    btn_showAccounnt:{
                        _click: function () {
                            MjClient.playui.showAccount();
                        },
                        _event:{
                            initSceneData:function () {
                                MjClient.playui.jsBind.panel_showAccount._node.visible = false;
                            }
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_guizhouLiangDingLiangFang.json");
            MjClient.playui = this;
            return true;
        },

        checkGangBtn: function (player) {
            var skipMingGang = player.skipMingGang;
            this.gangCardArray = [];
            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            var gangArr = this.gangCardArray;
            if(skipMingGang)
            {
                for(var i = 0; i < gangArr.length; i ++){
                    var idx = skipMingGang.indexOf(gangArr[i]);
                    if(idx > -1){
                        gangArr.splice(idx, 1);
                    }
                }
            }
            return gangArr.length > 0;
        },
        /**
         * 是否是新的听牌方式
         */
        isNewTing:function()
        {
            return true;
        },
        getPlayerEatNode: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var nodeArr = [];
            this.gangCardArray = [];
            if(this.isTurnMe()){
                //杠
                if(!player.isTing && MjClient.playui.checkGangBtn(player)&& !this.clickGangPass){
                    nodeArr.push(eat.btn_gang._node);
                }

                //听
                if(!player.isTing && MjClient.playui.checkTingBtn(player)){
                    if(!player.isDoTianTing)
                    {
                        nodeArr = [];
                    }
                    nodeArr.push(eat.btn_ting._node);
                }

                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
            }else{
                if (!player.isTing && player.eatFlag & 4 ) {
                    nodeArr.push(eat.btn_gang._node);
                    this.gangCardArray.push(tData.lastPutCard);
                }
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                }
                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                }
                if (player.eatFlag & 1){
                    nodeArr.push(eat.btn_chi._node);
                    this.eatCardArray = MjClient.majiang.canChi(player.mjhand, tData.lastPutCard, tData.hunCard);
                }
            }
            if(nodeArr.length > 0){
                nodeArr.push(eat.btn_guo._node);
            }
            this.reloadBtnTexture(nodeArr);
            return nodeArr;
        }
    });
}());