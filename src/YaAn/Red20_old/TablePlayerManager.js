function Red20_TablePlayerManager(node, ctr) {
    this.node = node;
    this.ctr = ctr;
    //玩家组件

    this.bottomPlayer = null;

    //玩家组件

    this.topPlayer = null;

    //玩家组件

    this.leftPlayer = null;

    //玩家组件

    this.rightPlayer = null;

    //玩家组件
    this.defaultAva = null;

    this.controllerAtlas = null

    //玩家数组
    this.players = []
    this.IsReplayMode = false;

    onInit = function (maxPlayer, controllerAtlas, isReplayMode) {
        this.node.removeAllChildren();
        this.IsReplayMode = isReplayMode;
        this.controllerAtlas = controllerAtlas;
        //变量声明
        let prefabs;
        //实例化玩家
        switch (maxPlayer) {
            case 2:
                prefabs = [this.bottomPlayer, this.topPlayer]
                break;
            case 3:
                prefabs = [this.bottomPlayer, this.rightPlayer, this.leftPlayer]
                break;

            default:
                prefabs = [this.bottomPlayer, this.rightPlayer, this.topPlayer, this.leftPlayer]
                break;
        }

        //实例化组件
        prefabs.forEach(prefab => {
            this.node.addChild(cc.instantiate(prefab))
        })

        //初始化玩家
        console.log('+++++++++++++++', maxPlayer)
        this.players = this.node.getComponentsInChildren(TablePlayer)
        this.players.forEach((player, index) => {
            player.onInit(index)
            player.node.active = false;
        })
    }

    //重置牌桌信息
    reset = function () {
        //重置庄标记
        this.players.forEach(player => {
            player.reset();
        })
    }

    clear = function () {
        this.players.forEach(player => {
            player.node.stopAllActions();
            player.node.active = false;
        })

    }

    getPlayerAvatar = function (viewPos) {
        return this.players[viewPos].getPlayerAvatar();
    }

    //房间状态改变 取消匿名
    onRoomStatusChanged = function () {
        this.players.forEach(player => {
            player.loadHead();
        })
    }

    //玩家进入事件
    onEventUserEnter = function (player, viewPos, gameBase) {
        if (player.ChairID === null) return;
        console.log('玩家进入事件', player.NickName, viewPos)
        if (this.players[viewPos]) this.players[viewPos].onEventUserEnter(player, this.defaultAva, gameBase)
    }

    //玩家积分改变事件
    onEventUserScoreChanged = function (player, viewPos) {
        if (this.players[viewPos]) this.players[viewPos].Score = player.Score;
    }

    //修改玩家分数
    onEventScoreChanged = function (viewPos, score) {
        if (this.players[viewPos]) this.players[viewPos].Score = score;
    }

    //玩家状态改变事件
    onEventUserStatusChanged = function (status, viewPos) {
        if (this.players[viewPos]) this.players[viewPos].Status = status;
    }

    //玩家离开事件
    onEventUserDeskUp = function (player, viewPos) {
        if (player.ChairID === null) return;
        if (this.players[viewPos]) this.players[viewPos].onEventUserLeave()
    }

    //头像动画
    showPlayerHeadAm = function (viewPos, time = 0) {
        this.players.forEach((user, index) => {
            if (index === viewPos) {
                user.onInTurn(true, time);
            } else {
                user.onInTurn(false);
            }
        })
    }

    /**
     * 控制动画暂停
     * @param stop 是否暂停
     */
    controllerAction = function (stop) {
        this.players.forEach((user, index) => {
            user.controllerAction(stop);
        })
    }

    //操作
    performAction = function (viewPos, type) {
        switch (type) {
            case UserAction.Chi: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_chi`);
                break;
            }
            case UserAction.Gang: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_gang`);
                break;
            }
            case UserAction.Hu: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_hu`);
                break;
            }
            case UserAction.Peng: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_peng`);
                break;
            }
            case UserAction.Ting: {
                // this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_bting`);
                this.players[viewPos].Ting = this.controllerAtlas.getSpriteFrame(`tip_bting`);
                break;
            }
            case UserAction.Tou: {
                this.players[viewPos].Action = this.controllerAtlas.getSpriteFrame(`tip_tou`);
                break;
            }
        }
    }

    resumeTing = function (viewPos) {
        this.players[viewPos].Ting = this.controllerAtlas.getSpriteFrame(`tip_bting`);
    }

    getPlayerTing = function (viewPos) {
        return this.players[viewPos].getTing();
    }

    resetTing = function () {
        this.players.forEach(player => {
            player.resetTing();
        })
    }

    resetTuoGuan = function () {
        this.players.forEach(player => {
            player.tuoGuan = false;
        })
    }

    //设置庄家
    resumeBanker = function (viewPos) {
        this.players[viewPos].Banker = true;
    }

    setTuoGuan = function (viewPos, val) {
        this.players[viewPos].tuoGuan = val;
    }
}