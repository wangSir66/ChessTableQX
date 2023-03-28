function Red20_GameEnd(node) {
    this.node = node;
    // @property(cc.Node)
    this.users = null;
    // @property(cc.Node)
    this.totalScore = null;

    //正分字体
    // @property(cc.Font)
    this.positiveFont = null;

    //负分字体
    // @property(cc.Font)
    this.negativeFont = null;

    this.content = null;
    this.roomID = null;
    this.gameBase = null;

    onReset = function () {
        this.users.children.forEach(node => {
            node.active = false;
            node.getChildByName('winner').active = false;
            node.getChildByName('endBgS').active = false;
        })

    }

    loadAvatar = function (ava, url) {
        if (!!url) {
            Utils.loadAvatar(url).then(ret => {
                if (ret.url === url) {
                    if (cc.isValid(ava)) {
                        ava.getComponent(cc.Sprite).spriteFrame = ret.spriteFrame;
                    }
                }
            }).catch(e => {
                cc.error(e);
            });
        }
    }

    onInit = function (gameBase, players, data, isReplay, roomID) {
        this.gameBase = gameBase;
        if (isReplay) this.node.getChildByName('btns').active = false;
        else this.node.getChildByName('btns').active = true;
        //再来一局
        this.node.getChildByName('btns').getChildByName('Layout').getChildByName('btnMore').active = this.gameBase.RoomType === fc.RoomType.Club;

        this.node.getChildByName('roomID').getComponent(cc.Label).string = `房间号:${roomID}\n` + new Date().format('yyyy-MM-dd hh:mm:ss');

        this.roomID = roomID;
        let content = '';
        content += `[红二十]`;
        content += `\n房间号：${Utils.convertRoomIDToString(roomID)}`;
        let time = new Date();
        let timeStr = time.format('yyyy-MM-dd hh:mm:ss')
        content += `\n结束时间:${timeStr}`;
        content += `\n成绩：`;


        this.onReset();
        let winner = -1;
        let winnerScore = 0;
        data.TotalScore.forEach((score, index) => {
            if (score > winnerScore) {
                winnerScore = score;
                winner = index;
            }
        })

        this.users.children.forEach((user, index) => {
            if (index === winner) user.getChildByName('winner').active = true;
            let player = players[index]
            if (player) {
                user.getChildByName('endBgS').active = player.UserID === fc.LocalUserInfo.UserID;
                user.active = true;
                let userInfo = user.getChildByName('userInfo');
                userInfo.getChildByName('NickName').getComponent(cc.Label).string = Utils.clampString(player.NickName, 8);
                userInfo.getChildByName('userID').getComponent(cc.Label).string = `ID:${player.GameID}`;
                let ava = userInfo.getChildByName('Mask').getChildByName('Avatar');
                this.loadAvatar(ava, player.AvatarUrl);

                let desc = user.getChildByName('descScore').getComponent(cc.ScrollView).content;
                //胡牌次数
                desc.children[0].getChildByName('num').getComponent(cc.Label).string = data.HuCount[index] > 0 ? `${data.HuCount[index]}次` : '0次';
                //天胡
                desc.children[1].getChildByName('num').getComponent(cc.Label).string = data.TianHuCount[index] > 0 ? `${data.TianHuCount[index]}次` : '0次';
                //地胡
                desc.children[2].getChildByName('num').getComponent(cc.Label).string = data.DiHuCount[index] > 0 ? `${data.DiHuCount[index]}次` : '0次';
                //报听胡牌
                desc.children[3].getChildByName('num').getComponent(cc.Label).string = data.TingCount[index] > 0 ? `${data.TingCount[index]}次` : '0次';
                //全黑
                desc.children[4].getChildByName('num').getComponent(cc.Label).string = data.AllBlackCount[index] > 0 ? `${data.AllBlackCount[index]}次` : '0次';
                //全红
                desc.children[5].getChildByName('num').getComponent(cc.Label).string = data.AllRedCount[index] > 0 ? `${data.AllRedCount[index]}次` : '0次';
                //被査叫
                desc.children[6].getChildByName('num').getComponent(cc.Label).string = data.BeiCJCount[index] > 0 ? `${data.BeiCJCount[index]}次` : '0次';
                //红50
                desc.children[7].getChildByName('num').getComponent(cc.Label).string = data.Red50Count[index] > 0 ? `${data.Red50Count[index]}次` : '0次';
                //黑50
                desc.children[8].getChildByName('num').getComponent(cc.Label).string = data.Black50Count[index] > 0 ? `${data.Black50Count[index]}次` : '0次';

                if (data.TotalScore[index] >= 0) {
                    user.getChildByName('totalScore').getComponent(cc.Label).font = this.positiveFont;
                    // user.getChildByName('totalScore').color = new cc.Color().fromHEX('#ECDD41');
                } else {
                    user.getChildByName('totalScore').getComponent(cc.Label).font = this.negativeFont;
                    // user.getChildByName('totalScore').color = new cc.Color().fromHEX('#FFFFFF');
                }
                user.getChildByName('totalScore').getComponent(cc.Label).string = `:${Utils.gameScoreWrapper(data.TotalScore[index])}`;

                content += `\n[${player.NickName}] ${Utils.gameScoreWrapper(data.TotalScore[index])}分`;
            }
        })
        let getSum = (arr) => {
            let s = 0;
            arr.forEach(val => {
                s += val;
            })
            return s;
        };
        // this.totalScore.getChildByName('tianHu').getComponent(cc.Label).string = getSum(data.TianHuCount) > 0 ? `共${getSum(data.TianHuCount)}次` : '';
        // this.totalScore.getChildByName('diHu').getComponent(cc.Label).string = getSum(data.DiHuCount) > 0 ? `共${getSum(data.DiHuCount)}次` : '';
        // this.totalScore.getChildByName('gangHua').getComponent(cc.Label).string = getSum(data.GangHuaCount) > 0 ? `共${getSum(data.GangHuaCount)}次` : '';
        // this.totalScore.getChildByName('gangPao').getComponent(cc.Label).string = getSum(data.GangPaoCount) > 0 ? `共${getSum(data.GangPaoCount)}次` : '';
        // this.totalScore.getChildByName('allBlack').getComponent(cc.Label).string = getSum(data.AllBlackCount) > 0 ? `共${getSum(data.AllBlackCount)}次` : '';
        // this.totalScore.getChildByName('allRed').getComponent(cc.Label).string = getSum(data.AllRedCount) > 0 ? `共${getSum(data.AllRedCount)}次` : '';
        // this.totalScore.getChildByName('beiChaJiao').getComponent(cc.Label).string = getSum(data.BeiCJCount) > 0 ? `共${getSum(data.BeiCJCount)}次` : '';
        // this.totalScore.getChildByName('red50').getComponent(cc.Label).string = getSum(data.Red50Count) > 0 ? `共${getSum(data.Red50Count)}次` : '';
        // this.totalScore.getChildByName('black50').getComponent(cc.Label).string = getSum(data.Black50Count) > 0 ? `共${getSum(data.Black50Count)}次` : '';
        // this.totalScore.getChildByName('totalScore').getComponent(cc.Label).string = getSum(data.TotalScore) > 0 ? `共${getSum(data.TotalScore)}次` : '';


        content += `\n竞技成绩仅供娱乐，禁止赌博！`;
        this.content = content;
    }


    onClickBack = function () {
        if (!CC_JSB) cc.director.loadScene('Login');
        else SubGameManager.closeGame();
    }

    onClickCopy = function () {
        cc.log('分享', this.content);
        if (!CC_JSB) return;
        Platform.copy(this.content);
        ShowMessageTips('复制成功');
    }

    onClickShare = function () {
        if (this.gameBase) {
            this.gameBase.shareBattleResult();
        }
    }

    onClickOneMoreGame = function () {
        if (this.gameBase) {
            this.gameBase.performOneMoreGame();
        }
    }
}