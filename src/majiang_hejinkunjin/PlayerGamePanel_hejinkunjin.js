/**
 * Created by Administrator on 2017/3/9.
 */
var actionZindex = 1000;
//向服务器发送 过消息
MjClient.MJPass2NetForhejinkunjin = function() {
    // console.log(">>>>>>>>>普通  过 <<<<<<<<");
    cc.log("====================MJPass2NetForhejinkunjin======pass=====");
    var sData = MjClient.data.sData;
    var tData = sData.tData;

    if (IsTurnToMe() && tData.tState == TableState.waitPut) {
        var eat = MjClient.playui.jsBind.eat;
        var msg = "确认过";
        if (eat.gang0._node.visible) {
            msg += " 杠 ";
        }

        if (eat.hu._node.visible) {
            msg += " 胡 ";
        }

        //cc.log("-- = getUIPlayer(0).isTing = " + getUIPlayer(0).isTing)
        if (eat.ting._node.visible) {
            msg = "你确认要放弃听牌";
            if (eat.gang0._node.visible) {
                msg = "确认过";
                msg += " 听 ";
                msg += " 杠 ";
            }
        }


        msg = msg + "吗?"

        MjClient.showMsg(msg, function() {
            //cc.log("==========1=============");
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
            eat.ting._node.visible = false;
            eat.cancel._node.visible = false;
            MJPassConfirmToServer();
        }, function() {}, "1");
    } else {
        if (MjClient.playui.jsBind.eat.hu._node.visible) {
            MjClient.showMsg("确认不胡吗?", MJPassConfirmToServer, function() {}, "1");
        } else {
            MJPassConfirmToServer();
        }
    }
}


// 这个没看懂干嘛的
// off 是四个位置，根据off 显示四个位置的信息 by sking
function SetUserVisible_hejinkunjin(node, off) {
    //var sData = MjClient.data.sData;
    //return;
    cc.log("====================off======================" + off);
    var pl = getUIPlayer(off);
    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var nobody = head.getChildByName("nobody");
    var coin = head.getChildByName("coin");
    var offline = head.getChildByName("offline");
    var name_bg = head.getChildByName("name_bg");
    var score_bg = head.getChildByName("score_bg");
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    if (pl) {
        cc.log("====================off======================" + off);
        head.visible = true;
        name.visible = true;
        coin.visible = true;
        offline.visible = true;
        coin.visible = true;
        name_bg.visible = true;
        score_bg.visible = true;
        if (tData.fieldId) {
            score_bg.loadTexture("game_picture/dating-1_75.png")
        }
        name.setScale(1.5);
        coin.setScale(1.2);
        MjClient.loadWxHead(pl.info.uid, pl.info.headimgurl);
        setUserOffline(node, off);
        InitUserHandUI_hejinkunjin(node, off);
        //GLog("pl.info.uid = "+pl.info.uid);
    } else {
        name.visible = false;
        coin.visible = false;
        offline.visible = false;
        coin.visible = false;
        var WxHead = nobody.getChildByName("WxHead");
        if (WxHead) {
            WxHead.removeFromParent(true);
        }
    }
}






function InitUserHandUI_hejinkunjin(node, off) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if (!pl) {
        return;
    }

    //初始化玩家金币和名称
    if (!tData.fieldId)
        InitUserCoinAndName_jinzhong(node, off);
    else
        InitUserCoinAndName(node, off);
    setAreaTypeInfo(true);
    //setPlayerRoundDir(off);
    // if(vnPos.indexOf(off) == -1)
    // {
    //     vnPos.push(off);
    // }

    if (
        tData.tState != TableState.waitPut &&
        tData.tState != TableState.waitEat &&
        tData.tState != TableState.waitCard
    ) {
        return;
    }

    setHunNodeVisible(false);


    //添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        var idx = tData.uids.indexOf(pl.info.uid);
        var offIdx = (pl.pengchigang.peng[i].pos - idx + 4) % 4 - 1; //表示被碰的人和pl之间隔着几个人，如果是pl碰下家，则offIdx=0，pl碰上家，则offIdex=2
        var cdui = null;
        for (var j = 0; j < 3; j++) {
            if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off, "heng", "heng");
                setCardArrow(cdui, offIdx, off);
            } else {
                cdui = getNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }

            if (j == 2) {
                cdui.ispeng3 = true;
            }
        }
    }

    //添加明杠
    var bIsPengGang = false;
    for (var i = 0; i < pl.mjgang0.length; i++) {
        var idx = tData.uids.indexOf(pl.info.uid);

        var offIdx = null;
        for (var j = 0; j < pl.pengchigang.gang.length; j++) {
            if (pl.pengchigang.gang[j].card == pl.mjgang0[i]) {
                offIdx = getOffByIndex(pl.pengchigang.gang[j].pos, idx) - 1;
                break;
            }
        }
        if (offIdx == null) {
            for (var j = 0; j < pl.pengchigang.pgang.length; j++) {
                if (pl.pengchigang.pgang[j].card == pl.mjgang0[i]) {
                    offIdx = getOffByIndex(pl.pengchigang.pgang[j].pos, idx) - 1;
                    bIsPengGang = true;
                    break;
                }
            }
        }
        if (offIdx == null) {
            cc.log("InitUserHandUI:offIdx == null!!!!");
            offIdx = 0;
        }

        var setCardArrowOnGang4 = false;
        for (var j = 0; j < 4; j++) {
            if (j < 3) {
                if ((j % 3 == 2 - offIdx && off % 3 == 0) || (j % 3 == offIdx && off % 3 != 0)) {
                    var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "heng", "heng");
                    if (bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                    if (j == 1) {
                        setCardArrowOnGang4 = true;
                    }
                } else {
                    getNewCard(node, "up", "gang0", pl.mjgang0[i], off);
                }
            } else {
                var cdui = getNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4"); //最后一张牌放上面
                cdui.tag = pl.mjgang0[i];
                if (setCardArrowOnGang4) {
                    if (bIsPengGang) offIdx = 3;
                    setCardArrow(cdui, offIdx, off);
                }
            }
        }
    }


    //添加暗杠
    cc.log("------------添加暗杠-----------" + pl.mjgang1);
    for (var i = 0; i < pl.mjgang1.length; i++) {
        for (var j = 0; j < 4; j++) {
            if (j == 3) {
                getNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            } else {
                getNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }
    }

    //cc.log("pl.mjchi = " + pl.mjchi);
    var chiIdx = 0;
    for (var i = 0; i < pl.mjchi.length; i++) {
        if (i % 3 == 0) {
            chiIdx++;
        }

        if (pl.mjchiCard[chiIdx - 1] == pl.mjchi[i]) //吃的横牌表示吃的是哪张牌
        {
            var cdui = getNewCard(node, "up", "chi", pl.mjchi[i], off, "heng");
            setCardArrow(cdui, 2, off);
        } else {
            getNewCard(node, "up", "chi", pl.mjchi[i], off);
        }
    }

    //添加打出的牌
    for (var i = 0; i < pl.mjput.length; i++) {
        var msg = {
            card: pl.mjput[i],
            uid: pl.info.uid
        };

        cc.log("bug hhhhhhhhhhhhhhhhhhhhhh   ");
        MjClient.playui.DealMJPut_hejinkunjin(node, msg, off, i);
    }

    //添加手牌
    if (MjClient.rePlayVideo == -1) //表示正常游戏
    {
        if (pl.mjhand && off === 0) {
            for (var i = 0; i < pl.mjhand.length; i++) {
                getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
            }
        } else if (pl.mjhand && pl.mjState === TableState.roundFinish) {
            COMMON_UI.showMjhandBeforeEndOnePlayer(off);
        } else {
            var CardCount = 0;
            if (tData.tState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.info.uid) {
                CardCount = 14;
            } else {
                CardCount = 13;
            }

            var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
            for (var i = 0; i < upCardCount; i++) {
                getNewCard(node, "stand", "standPri");
            }
        }
    } else {
        /*
         播放录像
         */
        cc.log("_________________mjhand_replay_______________" + JSON.stringify(pl.mjhand));
        if (pl.mjhand) {
            if (off == 0) {
                for (var i = 0; i < pl.mjhand.length; i++) {
                    getNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
            } else {

                for (var i = 0; i < pl.mjhand.length && i < 13; i++) {
                    getNewCard(node, "up", "mjhand_replay", pl.mjhand[i], off);
                }
            }
        }

    }



    //添加手花
    if (pl.mjflower.length > 0) {
        MjClient.majiang.setFlowerImg(node, pl);
        ShowEatActionAnim(node, ActionType.FLOWER, off);
        //playEffect("lyg/nv/flower");
        playEffectInPlay("flower");
    }

    MjClient.playui.CardLayoutRestore(node, off);
}

function initFlower_hejinkunjin() {
    initFlower(false, false);
}


var PlayLayer_hejinkunjin = cc.Layer.extend({
    jsBind: {
        _event: {
            mjhand: function() {
                if (MjClient.endoneui != null) {
                    cc.log("=======mjhand====endoneui====" + typeof(MjClient.endoneui));
                    MjClient.endoneui.removeFromParent(true);
                    MjClient.endoneui = null;
                }

                var sData = MjClient.data.sData;
                var tData = sData.tData;
                resetFlowerNum(this);
                if (tData.roundNum != tData.roundAll) return;
                var pls = sData.players;
                var ip2pl = {};
                for (var uid in pls) {
                    var pi = pls[uid];
                    var ip = pi.info.remoteIP;
                    if (ip) {
                        if (!ip2pl[ip]) ip2pl[ip] = [];
                        ip2pl[ip].push(unescape(pi.info.nickname));
                    }
                }
                var ipmsg = [];
                for (var ip in ip2pl) {
                    var ips = ip2pl[ip];
                    if (ips.length > 1) {
                        ipmsg.push("玩家:" + ips.join("，") + "为同一IP地址。")
                    }
                }
                if (ipmsg.length > 0 && !tData.matchId) {
                    //if(cc.sys.OS_WINDOWS != cc.sys.os)
                    {
                        //AlertSameIP(ipmsg.join("\n"));
                    }
                }
                mylog("ipmsg " + ipmsg.length);

            },
            LeaveGame: function() {
                MjClient.addHomeView();
                MjClient.playui.removeFromParent(true);
                delete MjClient.playui;
                delete MjClient.endoneui;
                delete MjClient.endallui;
                cc.audioEngine.stopAllEffects();
                playMusic("bgMain");
            },
            endRoom: function(msg) {
                mylog(JSON.stringify(msg));
                if (msg.showEnd) this.addChild(new GameOverLayer(), 500);
                else
                    MjClient.Scene.addChild(new StopRoomView());
            },
            roundEnd: function() {
                var self = this;

                function delayExe() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    resetEatActionAnim();
                    if (sData.tData.roundNum <= 0 && !tData.fieldId) {
                        if (!tData.matchId) {
                            self.addChild(new GameOverLayer(), 500);
                        } else {
                            self.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
                                self.addChild(new GameOverLayer(), 500);
                            })))
                        }
                    }
                    self.addChild(new EndOneView_hejinkunjin(), 500);
                }
                if (MjClient.rePlayVideo === -1) // 正常游戏
                {
                    this.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(COMMON_UI.showMjhandBeforeEndOne), cc.delayTime(1.7), cc.callFunc(delayExe)));
                } else {
                    this.runAction(cc.sequence(cc.DelayTime(0.2), cc.callFunc(delayExe)));
                }
            },
            moveHead: function() {
                postEvent("returnPlayerLayer");
                tableStartHeadMoveAction(this);
                var tData = MjClient.data.sData.tData;
                // if(tData.areaSelectMode.flowerType == WithFlowerType.noFlower)
                // {
                //     MjClient.playui._btnFlower.visible = false;
                // }
                // else
                // {
                //     MjClient.playui._btnFlower.visible = true;
                // }


                initFlower_hejinkunjin();
            },
            initSceneData: function() {
                reConectHeadLayout(this);
                cc.log("initSceneData -----------------gunyun = " + JSON.stringify(this));
                CheckRoomUiDelete();
            },
            onlinePlayer: function() {
                reConectHeadLayout(this);
            },
            logout: function() {
                if (MjClient.playui) {
                    MjClient.addHomeView();
                    MjClient.playui.removeFromParent(true);
                    delete MjClient.playui;
                    delete MjClient.endoneui;
                    delete MjClient.endallui;
                }
            },
            DelRoom: function() {
                CheckRoomUiDelete();
            },
            changeMJBgEvent: function() {
                changeMJBg(this, getCurrentMJBgType());
            }
        },
        roundnumImg: {
            _run: function() {
                //roundnumImgObj = this;
                MjClient.roundnumImgNode = this;
                setWgtLayout(this, [0.1, 0.1], [0.5, 0.5], [-1.2, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            roundnumAtlas: {
                _run: function() {
                    this.getParent().getChildByName("roundnumText").visible = false;
                    this.getParent().getChildByName("Text").visible = false;
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var tData = MjClient.data.sData.tData;
                    if (tData) {
                        var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;

                        cc.log("tData.roundAll = " + tData.roundAll);
                        cc.log("tData.roundNum = " + tData.roundNum);
                        cc.log("_currentRoundIdx = " + _currentRoundIdx);

                        if (_currentRoundIdx > tData.roundAll) {
                            _currentRoundIdx = 1;
                        }
                        var _roundText = _currentRoundIdx + "/" + tData.roundAll + "局";
                    }
                    return (_roundText);
                },
                _event: {
                    mjhand: function() {
                        var tData = MjClient.data.sData.tData;
                        if (tData) {
                            var _currentRoundIdx = parseInt(tData.roundAll - tData.roundNum) + 1;

                            cc.log("tData.roundAll = " + tData.roundAll);
                            cc.log("tData.roundNum = " + tData.roundNum);
                            cc.log("_currentRoundIdx = " + _currentRoundIdx);

                            if (_currentRoundIdx > tData.roundAll) {
                                _currentRoundIdx = 1;
                            }
                            var _roundText = _currentRoundIdx + "/" + tData.roundAll + "局";
                        }
                        this.setString(_roundText);
                    }
                }
            }
        },
        cardNumImg: {
            _run: function() {
                MjClient.cardNumImgNode = this;
                setWgtLayout(this, [0.1, 0.1], [0.5, 0.5], [1.2, 1.0]);
            },
            _event: {
                initSceneData: function(eD) {
                    this.visible = IsArrowVisible();
                },
                mjhand: function(eD) {
                    this.visible = IsArrowVisible();
                },
                onlinePlayer: function(eD) {
                    //this.visible = IsArrowVisible();
                }
            },
            cardnumAtlas: {
                _run: function() {
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function() {
                    var sData = MjClient.data.sData;
                    var tData = sData.tData;
                    if (tData) return MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                },
                _event: {
                    waitPut: function() {
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        if (tData) this.setString(MjClient.majiang.getAllCardsTotal() - tData.cardNext);
                        cc.log(MjClient.majiang.getAllCardsTotal() + "-----------------waitPut------------------" + tData.cardNext);
                    }
                }
            }
        },
        back: {
            back: {
                _run: function() {
                    changeGameBg(this);
                },
                _event: {
                    changeGameBgEvent: function() {
                        changeGameBg(this);
                    }
                },
                _layout: [
                    [1, 1],
                    [0.5, 0.5],
                    [0, 0], true
                ],
            },
            LeftBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.045],
                    [0, 0]
                ],
            },
            RightBottom: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.05],
                    [0, 0]
                ],
            },
            RightTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.97, 0.95],
                    [0, 0]
                ],
            },
            leftTop: {
                _layout: [
                    [0.1, 0.1],
                    [0.03, 0.95],
                    [0, 0]
                ],
                _run: function() {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                }
                //     var text = new ccui.Text();
                //     text.setFontName(MjClient.fzcyfont);
                //     text.setFontSize(20);
                //     text.setRotation(-90);
                //     text.setAnchorPoint(0,0.5);
                //     text.setPosition(23.5, 20.5);
                //     this.addChild(text);
                //     text.schedule(function(){
                //         var time = MjClient.getCurrentTime();
                //         var str = time[0]+"/"+time[1]+"/"+ time[2]+" "+
                //             (time[3]<10?"0"+time[3]:time[3])+":"+
                //             (time[4]<10?"0"+time[4]:time[4])+":"+
                //             (time[5]<10?"0"+time[5]:time[5]);
                //         this.setString(str);
                //     });
                // }
            }
        },
        info: {
            _layout: [
                [0.16, 0.16],
                [0.01, 0.935],
                [0, 0]
            ]
        },
        gameName: {
            _layout: [
                [0.16, 0.16],
                [0.5, 0.62],
                [0, 1.0]
            ]
        },
        roundInfo: {
            _layout: [
                [0.09, 0.09],
                [0.5, 0.408],
                [0, 1.0]
            ],
            _run: function() {
                var tData = MjClient.data.sData.tData;
                this.ignoreContentAdaptWithSize(true);
                this.setString(getPlayingRoomInfo(0));
                showPlayUI_roundInfo(this.getString(), tData.tableid);

                var tData = MjClient.data.sData.tData;
                if (tData.matchId && tData.matchInfo) {
                    if (MjClient.matchRank) {
                        showPlayUI_matchInfo("排名：" + MjClient.matchRank + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    } else {
                        showPlayUI_matchInfo("排名：" + tData.matchInfo.userCount + "/" + tData.matchInfo.userCount + "\n前" + tData.matchInfo.jingjiCount + "名晋级");
                    }
                }
            }
        },
        banner: {
            _layout: [
                [0.5, 0.5],
                [0.5, 1],
                [0, 0]
            ],
            bg_time: {
                _run: function() {
                    var text = new ccui.Text();
                    text.setFontName(MjClient.fzcyfont);
                    text.setFontSize(26);

                    text.setAnchorPoint(1, 0.5);
                    text.setPosition(66, 15);
                    this.addChild(text);
                    text.schedule(function() {

                        var time = MjClient.getCurrentTime();
                        var str = (time[3] < 10 ? "0" + time[3] : time[3]) + ":" +
                            (time[4] < 10 ? "0" + time[4] : time[4]);
                        this.setString(str);
                    });
                }

            },
            wifi: {
                _run: function() {
                    updateWifiState(this);
                }
            },
            powerBar: {
                _run: function() {
                    cc.log("powerBar_run");
                    updateBattery(this);
                },
                _event: {
                    nativePower: function(d) {
                        this.setPercent(Number(d));
                    }
                }
            },
            tableid: {
                _run: function() {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                    this.ignoreContentAdaptWithSize(true);
                },
                _event: {
                    initSceneData: function() {
                        this.ignoreContentAdaptWithSize(true);
                        this.setString(MjClient.data.sData.tData.tableid);
                    }
                }
            },
            roomNo: {
                _run: function() {
                    if (MjClient.data.sData.tData.fieldId) {
                        this.setVisible(false)
                    }
                },
            },
            setting: {
                _click: function() {
                    var settringLayer = new SettingView();
                    settringLayer.setName("PlayLayerClick");
                    MjClient.Scene.addChild(settringLayer);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {
                        uid: SelfUid(),
                        gameType: MjClient.gameType
                    });
                }
            },
            Button_1: {
                _visible: true,
                _click: function() {
                    MjClient.openWeb({
                        url: MjClient.GAME_TYPE.HUAI_AN,
                        help: true
                    });
                }
            },
            hunPai: {
                baidaBg: {
                    small: {
                        _run: function() {
                            this.visible = false;
                            //this.runAction(cc.sequence(cc.fadeOut(1), cc.fadeIn(0.5)).repeatForever());
                        },
                        _event: {
                            mjhand: function() {
                                this.visible = false;
                            }
                        }
                    },
                    _run: function() {
                        //baidaBg = this;
                        this.setVisible(false);
                    },
                    _event: {
                        mjhand: function() {
                            this.visible = false;
                        },
                        roundEnd: function(eD) {
                            this.visible = false;
                        }
                    },
                },
                baidaImg: {
                    _run: function() {
                        this.setVisible(false);
                        var cardWith = this.getSize().width * this.getScale();
                    },
                    _event: {
                        clearCardUI: function(eD) {
                            if (this.getParent().getChildByName("hunCard2")) {
                                this.getParent().getChildByName("hunCard2").removeFromParent();
                            }
                        },
                        mjhand: function() {
                            //if(MjClient.rePlayVideo != -1) return;

                            this.setPosition(-296, -280);
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            this.visible = false;
                            cc.log("-------------------mjhand-----------------HuncardMsg = " + HuncardMsg);
                            if (HuncardMsg && HuncardMsg != -1) {
                                this.visible = true;
                                var func = cc.callFunc(function() {
                                    playEffect("hunCardFly");
                                });
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                                var imgMing = new ccui.ImageView();
                                imgMing.loadTexture("playing/MJ/ming.png");
                                imgMing.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                                this.addChild(imgMing);
                                var cardWith = this.getSize().width * this.getScale();
                                this.runAction(cc.sequence(cc.delayTime(0.5),
                                    cc.spawn(cc.scaleTo(0.6, this.getScale()), cc.moveTo(0.6, 0, 1.86)).easing(cc.easeQuinticActionOut()),
                                    func));
                            } else {
                                this.getParent().visible = false;
                            }


                            var HuncardMsg2 = MjClient.data.sData.tData.hunCard2;

                            if (HuncardMsg2 && HuncardMsg2 != -1) {
                                var _hunCard2 = this.getParent().getChildByName("hunCard2");
                                if (!_hunCard2) {
                                    _hunCard2 = this.clone();;
                                    _hunCard2.setName("hunCard2")
                                    this.getParent().addChild(_hunCard2);
                                }

                                _hunCard2.setScale(this.getScale());
                                _hunCard2.setPosition(-296, -280);
                                _hunCard2.loadTexture(this.getRenderFile().file);
                                _hunCard2.visible = true;
                                var cardWith = this.getSize().width * this.getScale();
                                var func = cc.callFunc(function() {
                                    playEffect("hunCardFly");
                                });
                                setCardSprite(_hunCard2, parseInt(HuncardMsg2), 4);
                                var imgMing = new ccui.ImageView();
                                imgMing.loadTexture("playing/MJ/ming.png");
                                imgMing.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                                _hunCard2.addChild(imgMing);
                                _hunCard2.runAction(cc.sequence(cc.delayTime(1.2),
                                    cc.spawn(cc.scaleTo(0.6, this.getScale()), cc.moveTo(0.6, cardWith, 1.86)).easing(cc.easeQuinticActionOut()),
                                    func));
                            }
                        },
                        initSceneData: function() {
                            //if(this.isSetted) return;
                            if (MjClient.rePlayVideo != -1) return;
                            //if(COMMON_UI.is3DUI()) return;

                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if (HuncardMsg && HuncardMsg != -1) {
                                if (!this.isSetted) {
                                    this.setScale(this.getScale());
                                    this.setPositionX(0);
                                    this.isSetted = true;
                                    var imgMing = new ccui.ImageView();
                                    imgMing.loadTexture("playing/MJ/ming.png");
                                    imgMing.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                                    this.addChild(imgMing, 100);
                                }
                                this.visible = true;
                                setCardSprite(this, parseInt(HuncardMsg), 4);
                            }

                            var HuncardMsg2 = MjClient.data.sData.tData.hunCard2;
                            if (HuncardMsg2 && HuncardMsg2 != -1) {
                                var _hunCard2 = this.getParent().getChildByName("hunCard2");
                                var cardWith = this.getSize().width * this.getScale();
                                if (!_hunCard2) {
                                    _hunCard2 = this.clone();
                                    // _hunCard2.loadTexture(this.getRenderFile().file);
                                    _hunCard2.setName("hunCard2");
                                    this.getParent().addChild(_hunCard2);

                                    var imgMing = new ccui.ImageView();
                                    imgMing.loadTexture("playing/MJ/ming.png");
                                    imgMing.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
                                    this.addChild(imgMing, 100);
                                }
                                _hunCard2.visible = true;
                                _hunCard2.setPosition(this.getPositionX() + cardWith, this.getPositionY());
                                setCardSprite(_hunCard2, parseInt(HuncardMsg2), 4);
                                _hunCard2.setScale(this.getScale());
                            }
                        },
                        roundEnd: function(eD) {
                            this.visible = false;
                            if (this.getParent().getChildByName("hunCard2")) {
                                this.getParent().getChildByName("hunCard2").visible = false;
                            }
                        }
                    },
                },
                baidaText: {
                    _run: function() {
                        //baidaOject = this;
                        this.setVisible(false);
                    },
                    _event: {
                        mjhand: function() {
                            this.visible = false;
                        },
                        roundEnd: function(eD) {
                            this.visible = false;
                        }
                    },
                },
                _event: {
                    clearCardUI: function(eD) {
                        this.visible = false;
                    },
                    mjhand: function() {
                        if (COMMON_UI3D.is3DUI()) {
                            this.visible = false
                            return;
                        }
                        var HuncardMsg = MjClient.data.sData.tData.hunCard;
                        if (HuncardMsg && HuncardMsg != -1) {
                            this.visible = true;
                        } else {
                            this.visible = false;
                        }
                    },
                    initSceneData: function() {
                        if (COMMON_UI3D.is3DUI()) {
                            this.visible = false
                            return;
                        }
                        this.visible = true;
                        var sData = MjClient.data.sData;
                        var tData = sData.tData;
                        cc.log(" tData.tState  ------------sking = " + tData.tState);
                        if (tData.tState != TableState.waitPut &&
                            tData.tState != TableState.waitEat &&
                            tData.tState != TableState.waitCard
                        ) {
                            cc.log(" tData.tState  ------------sking = --- false");
                            this.visible = false;
                        } else {
                            var HuncardMsg = MjClient.data.sData.tData.hunCard;
                            if (HuncardMsg && HuncardMsg != -1) {
                                this.visible = true;
                            } else {
                                this.visible = false;
                            }
                        }
                    }
                }
            },
        },

        BtnPutCard: { //add by  sking for put card button
            _run: function() {

                var tData = MjClient.data.sData.tData;
                cc.log("BtnPutCard _run set put card btn state = " + tData.tState);

                if (!IsTurnToMe() || tData.tState != TableState.waitPut) {
                    // cc.log(" it's not my turn------------------sking");
                    this.visible = false;
                } else {
                    // cc.log(" it's my turn------------------sking");
                    this.visible = true;
                }

                setWgtLayout(this, [0.18, 0.18], [0.82, 0.3], [0.7, -0.1]);
            },
            _click: function(btn) {
                cc.log("点击出牌");
                //var sData = MjClient.data.sData;
                //cc.log("sData.tState == " + sData.tState);
                var downNode = MjClient.playui._downNode;
                var standUI = downNode.getChildByName("stand");
                var children = downNode.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == "mjhand") {
                        if (children[i].y > standUI.y + 10) {
                            PutOutCard(children[i], children[i].tag); //可以出牌
                            break;
                        }
                    }
                }
                this.visible = false;
            },
            _event: {
                //拿到一张牌的时候，出牌按钮亮起，其他状态隐藏，by sking
                mjhand: function() {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initSceneData");
                },
                MJHu: function() {
                    this.visible = false;
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mjhand");
                },
                newCard: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>newCard by sking");
                    this.visible = true;
                    //setWgtLayout(this, [0.1, 0.1],[0.7, 0.2],[0, 0]);
                },
                MJPut: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPut by sking");
                    this.visible = false;
                },
                MJChi: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJChi by sking");
                    if (IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJGang: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJGang by sking");
                    if (IsTurnToMe()) {
                        this.visible = true;
                    }
                },
                MJPeng: function(eD) {
                    cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJPeng by sking");
                    if (IsTurnToMe()) {
                        //cc.log("    ----------------------peng  btn show----");
                        this.visible = true;
                    }
                },
                MJTing: function(eD) {
                    if (MjClient.playui.isCanPutCard()) {
                        this.visible = true;
                        cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>MJTing by sking - hide");
                    } else {
                        this.visible = false;
                    }
                },
                roundEnd: function() {
                    this.visible = false;
                },
                waitPut: function() {
                    var pl = getUIPlayer(0);
                    var eat = MjClient.playui.jsBind.eat;
                    if (IsTurnToMe() && pl.isTing && !eat.hu._node.visible && !eat.gang0._node.visible && !eat.gang1._node.visible && !eat.gang2._node.visible) {
                        cc.log("*********自动出牌*********");
                        this.runAction(cc.sequence(cc.delayTime(0.5),
                            cc.callFunc(MjClient.playui.jsBind.BtnPutCard._click)));
                    } else {
                        if (MjClient.playui.isCanPutCard()) {
                            if (eat.hu._node.visible) {
                                this.visible = false;
                                cc.log("--------------------有胡按钮拉--------------");
                            } else {
                                this.visible = true;
                            }
                        }
                    }
                }
            }
        }, //end of add by sking
        eat: {

            chi0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img: {
                    _run: function() {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function() {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                card1: {},
                card2: {},
                card3: {}
            },
            chi1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 3.8]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            chi2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 5.1]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) MJChiCardchange(btn.tag);
                }
            },
            ting: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [1.3, 2.5]
                ],
                bg_img: {
                    _run: function() {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function() {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        // MJTingToServer();
                        var eat = MjClient.playui.jsBind.eat;
                        eat.gang0._node.visible = false;
                        eat.guo._node.visible = false;
                        eat.ting._node.visible = false;
                        eat.cancel._node.visible = true;
                        MjClient.clickTing = true;
                        eat.hu._node.visible = false;
                        MjClient.playui._btnPutCard.visible = true;
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                        /*
                         设置当前听牌的张数
                         */
                        var pl = getUIPlayer(0);
                        var currentCard = CurrentPutCardMsg();
                        var tData = MjClient.data.sData.tData;
                        var tingCards_self = {};
                        if (pl.tingLists && pl.tingLists[currentCard]) {
                            var curtingset = pl.tingLists[currentCard];
                            for (var i = 0; i < curtingset.length; i++) {
                                tingCards_self[curtingset[i]] = 1;
                            }
                        }
                        setCurrentTingNum(tingCards_self);
                    }
                }
            },
            noTing: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        cc.log("_____noting__888888____");
                        hideTingBtn();
                    }
                }
            },
            peng: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [0, 2.5]
                ],
                bg_img: {
                    _run: function() {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function() {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    console.log(">>>> lf，点击碰按钮");
                    if (eT == 2) MJPengToServer();
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang0: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 2.5]
                ],
                bg_img: {
                    _run: function() {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function() {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                card1: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                },
                bgground: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            gang1: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 3.8]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            gang2: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-1.7, 5.1]
                ],
                card: {},
                _touch: function(btn, eT) {
                    if (eT == 2) MJGangCardchange(btn.tag);
                }
            },
            guo: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [4.6, 2.5]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        MjClient.MJPass2NetForhejinkunjin();
                    }
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            hu: {
                _visible: false,
                _layout: [
                    [0, 0.1],
                    [0.5, 0],
                    [-3, 2.5]
                ],
                bg_img: {
                    _run: function() {
                        var _Image_light_scale = this.getScale();

                        var a = cc.scaleTo(0.5, _Image_light_scale * 1.0);
                        var aa = cc.fadeIn(0.5);
                        var a1 = cc.scaleTo(1, _Image_light_scale * 1.3);
                        var a2 = cc.fadeOut(1);
                        var a3 = cc.callFunc(function() {
                            //this.setOpacity(255);
                            this.setScale(_Image_light_scale * 0.95);
                        }.bind(this));

                        this.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2).easing(cc.easeCubicActionOut()), a3, cc.delayTime(0.2)).repeatForever());

                    }

                },
                _touch: function(btn, eT) {
                    if (eT == 2) MJHuToServer();
                },
                bgimg: {
                    _run: function() {
                        this.zIndex = -1;
                    }
                }
            },
            cancel: {
                _visible: false,
                _layout: [
                    [0, 0.16],
                    [0.78, 0.1],
                    [0, 1.12]
                ],
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        btn.visible = false;
                        MjClient.clickTing = false;
                        hideCurrentTingNum();
                        MjClient.playui.EatVisibleCheck();
                        MjClient.playui.CardLayoutRestore(MjClient.playui._downNode, 0);
                    }
                }
            },
            changeui: {
                _visible: true,
                changeuibg: {
                    _layout: [
                        [0.36, 0.36],
                        [0.5, 0.15],
                        [0, 0]
                    ],
                    _run: function() {
                        this.visible = false;
                        this.getChildByName("card").visible = false;
                        this.chiTouch = function(btn, et) {
                            if (et == 2) {
                                if (btn.name.localeCompare("card3") < 0) {
                                    MJChiToServer(0);
                                } else if (btn.name.localeCompare("card6") < 0) {
                                    MJChiToServer(1);
                                } else {
                                    MJChiToServer(2);
                                }
                            }
                        };
                        this.gangTouch = function(btn, et) {
                            if (et == 2)
                                MJGangToServer(btn.tag);
                        };
                    },
                    guobg: {
                        guo: {
                            _touch: function(btn, eT) {
                                if (eT == 2) MjClient.MJPass2NetForhejinkunjin();
                            }
                        },
                        fanhui: {
                            _touch: function(btn, et) {
                                if (et == 2) {
                                    btn.getParent().getParent().visible = false;
                                    MjClient.playui.EatVisibleCheck();
                                }
                            }
                        }
                    }

                }
            },
            _event: {
                clearCardUI: function() {
                    //add by sking
                    cc.log("ting yu no ting hide --------by sking");
                    MjClient.playui.EatVisibleCheck();
                    hideTingBtn();
                },
                MJPass: function(eD) {
                    console.log("HHH :，MJPass------");
                    setSkipHuState();
                    setSkipPengState(); // 开启 过碰 机制
                    MjClient.playui.EatVisibleCheck();
                },
                mjhand: function(eD) {
                    console.log("HHH :，mjhand------");
                    MjClient.playui.EatVisibleCheck();
                },
                waitPut: function() {
                    console.log("HHH :，waitPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPut: function(eD) {
                    console.log("HHH :，MJPut------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJPeng: function(eD) {
                    console.log("HHH :，MJPeng------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJChi: function(eD) {
                    console.log("HHH :，MJChi------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJGang: function(eD) {
                    console.log("HHH :，MJGang------");
                    MjClient.playui.EatVisibleCheck();
                },
                MJTing: function(eD) {
                    console.log("HHH :，MJTing------");
                    hideTingBtn();
                    isCheckedTing = false;
                },
                roundEnd: function(eD) {
                    console.log("HHH :，roundEnd------");
                    MjClient.playui.EatVisibleCheck();
                },
                initSceneData: function(eD) {
                    function delayExe() {
                        MjClient.playui.EatVisibleCheck();
                    }
                    this.runAction(cc.sequence(cc.DelayTime(0.1), cc.callFunc(delayExe)));
                }
            }
        },
        chat_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.1],
                [0, 3.2]
            ],
            _click: function() {
                var chatlayer = new ChatLayer();
                MjClient.Scene.addChild(chatlayer);
            }
        },
        Jin_btn: {
            _layout: [
                [0.1, 0.1],
                [0.97, -0.05],
                [0, 3.2]
            ],
            _click: function() {
                var JinBox = new JinBoxLayer();
                if (!MjClient.playui.getChildByName("JinBoxLayer"))
                 {
                    MjClient.playui.addChild(JinBox);
                 }
            }
        },
        voice_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.2],
                [0, 3.2]
            ],
            _run: function() {
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(false)
                }
                initVoiceData();
                cc.eventManager.addListener(getTouchListener(), this);
                if (MjClient.isShenhe) this.visible = false;
            },
            _touch: function(btn, eT) {
                // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                if (eT == 0) {
                    startRecord();
                } else if (eT == 2) {
                    endRecord();
                } else if (eT == 3) {
                    cancelRecord();
                }
            },
            _event: {
                cancelRecord: function() {
                    MjClient.native.HelloOC("cancelRecord !!!");
                },
                uploadRecord: function(filePath) {
                    if (filePath) {
                        MjClient.native.HelloOC("upload voice file");
                        MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                    } else {
                        MjClient.native.HelloOC("No voice file update");
                    }
                },
                sendVoice: function(fullFilePath) {
                    if (!fullFilePath) {
                        console.log("sendVoice No fileName");
                        return;
                    }

                    var getFileName = /[^\/]+$/;
                    var extensionName = getFileName.exec(fullFilePath);
                    var fileName = extensionName[extensionName.length - 1];
                    console.log("sfileName is:" + fileName);

                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "downAndPlayVoice",
                        uid: SelfUid(),
                        type: 3,
                        msg: fileName,
                        num: MjClient.data._JiaheTempTime //录音时长
                    });
                    MjClient.native.HelloOC("download file");
                },
                downAndPlayVoice: function(msg) {
                    MjClient.native.HelloOC("downloadPlayVoice ok");
                    MjClient.data._tempMessage = msg;
                    MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                    downAndPlayVoice(msg.uid, msg.msg);
                }
            }
        },

        duty_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.2],
                [0, 3.2]
            ],
            _run: function() {
                this.setVisible(false)
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(true)
                }
            },
            _click: function() {
                MjClient.Scene.addChild(new GoldTaskLayer());
            },
        },

        tuoguan_btn: {
            _layout: [
                [0.08, 0.08],
                [0.97, 0.3],
                [0, 3.2]
            ],
            _run: function() {
                var fieldId = MjClient.data.sData.tData.fieldId;
                this.visible = fieldId ? true : false;
            },
            _click: function() {
                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                    cmd: "beTrust"
                });
            },
            _event: {
                beTrust: function(msg) {
                    if (msg.uid === SelfUid()) {
                        this.enabled = false;
                    }
                },
                cancelTrust: function(msg) {
                    if (msg.uid === SelfUid()) {
                        this.enabled = true;
                    }
                },
                initSceneData: function(msg) {
                    var pl = getUIPlayer(0);
                    this.enabled = pl.trust ? false : true;
                },
            },
        },

        gps_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.3],
                [0, 3.2]
            ],
            _run: function() {
                if (MjClient.data.sData.tData.fieldId) {
                    this.setVisible(false)
                }
                if (MjClient.data.sData.tData.maxPlayer == 2) {
                    this.visible = false;
                }
            },
            _click: function() {
                if (MjClient.data.sData.tData.maxPlayer == 3) {
                    MjClient.Scene.addChild(new showDistance3PlayerLayer());
                } else if (MjClient.data.sData.tData.maxPlayer == 4) {
                    MjClient.Scene.addChild(new showDistanceLayer());
                }
                MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dingwei", {
                    uid: SelfUid(),
                    gameType: MjClient.gameType
                });
            }
        },
        hua_btn: {
            _layout: [
                [0.08, 0.08],
                [0.95, 0.4],
                [0, 3.2]
            ],
            _run: function() {
                this.visible = false;
                this.opacity = 255;
                var tData = MjClient.data.sData.tData;
                if (tData.areaSelectMode.flowerType == WithFlowerType.noFlower) {
                    if (IsArrowVisible()) this.visible = true;
                } else {
                    this.visible = false;
                }

            },
            _touch: function(btn, eT) {
                if (eT == 2) {
                    //显示花
                    var layer = new showFlowerLayer();
                    MjClient.Scene.addChild(layer);


                    //var showCards = [12,13,25];
                    //MjClient.Scene.addChild(new HAHZ_showCardLayer(showCards,function(){
                    //    cc.log("finished call back show cards");
                    //}));
                }
            }
        },
        block_tuoguan: {
            _layout: [
                [1, 1],
                [0.5, 0.5],
                [0, 0],
                true
            ],
            _run: function() {
                this.visible = false;
            },
            btn_tuoguan: {
                _touch: function(btn, eT) {
                    if (eT == 2) {
                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                            cmd: "cancelTrust"
                        }, function(rtn) {
                            btn.getParent().setVisible(false);
                        });
                    }
                }
            },
            _event: {
                beTrust: function(msg) {
                    cc.log("wxd........beTrust......." + JSON.stringify(msg));
                    if (getUIPlayer(0).info.uid == msg.uid) {
                        if (MjClient.movingCard) {
                            MjClient.movingCard.setTouchEnabled(false);
                            MjClient.movingCard.setScale(cardBeginScale);
                            MjClient.movingCard.setTouchEnabled(true);
                        }
                        this.visible = true;
                    }
                },
                initSceneData: function(msg) {
                    var pl = getUIPlayer(0);
                    if (pl.trust) {
                        this.visible = true;
                    } else {
                        this.visible = false;
                    }
                }
            }
        }
    },
    _downNode: null,
    _rightNode: null,
    _topNode: null,
    _leftNode: null,
    _btnPutCard: null,
    _btnFlower: null,
    ctor: function() {
        this._super();
        var playui = ccs.load("Play_hejinkunjin.json");
        this.srcMaxPlayerNum = MjClient.MaxPlayerNum;
        MjClient.MaxPlayerNum = parseInt(MjClient.data.sData.tData.maxPlayer);
        cc.log("MjClient.MaxPlayerNum LYG = " + MjClient.MaxPlayerNum);
        playMusic("bgFight");
        this._downNode = playui.node.getChildByName("down");
        this._rightNode = playui.node.getChildByName("right");
        this._topNode = playui.node.getChildByName("top");
        this._leftNode = playui.node.getChildByName("left");
        MjClient.playui = this;
        this._btnPutCard = playui.node.getChildByName("BtnPutCard");
        this._tingCardsNode = this._downNode.getChildByName("tingCardsNode");
        this._tingCardNumNode = this._downNode.getChildByName("tingCardNumNode");
        MjClient.playui._AniNode = playui.node.getChildByName("eat");
        BindUiAndLogic(playui.node, this.jsBind);

        // 添加光晕动画
        COMMON_UI.addAniEatCardsBtn();

        this.addChild(playui.node);

        //添加滚动通知 by sking
        var _laba_bg = playui.node.getChildByName("banner").getChildByName("laba_bg");
        _laba_bg.visible = false;
        var _scroll = playui.node.getChildByName("banner").getChildByName("scroll");
        _scroll.visible = false;
        //MjClient.playui._btnFlower = playui.node.getChildByName("hua_btn");
        //var _msg = _scroll.getChildByName("msg");
        //homePageRunText(_msg);
        //function getMsg()
        //{
        //    var content = (MjClient.updateCfg != null && (typeof MjClient.updateCfg) != 'undefined') ? MjClient.updateCfg.homeScroll : "";
        //    return MjClient.isTest ? "" : content;
        //}
        //_msg.setString(getMsg());


        MjClient.lastMJTick = Date.now();
        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
            if (MjClient.game_on_show) MjClient.tickGame(0);
        }), cc.delayTime(7))));

        changeMJBg(this, getCurrentMJBgType());


        /*
            初始化，每个人的信息节点
         */
        MjClient.playui.Node_player(0);
        MjClient.playui.Node_player(1);
        MjClient.playui.Node_player(2);
        MjClient.playui.Node_player(3);

        //初始化其他功能
        initSceneFunc();
        // 在亲友圈房间中添加邀请亲友圈牌有一起对局
        addClubYaoqingBtn(1);

        return true;
    },
    onExit: function() {
        this._super();
        MjClient.MaxPlayerNum = this.srcMaxPlayerNum;
    },
    setPlayerHuaValueShow: function(parentNode) {
        var tData = MjClient.data.sData.tData;
        var isShow = tData.areaSelectMode.flowerType != WithFlowerType.noFlower && !IsInviteVisible();

        parentNode.getChildByName("huaBg").visible = isShow;
        parentNode.getChildByName("huaCount").visible = isShow;
    },

    /*
     判断当前是否可以出牌，add by sking
     */
    isCanPutCard: function() {
        var bPut = false;
        var downNode = MjClient.playui._downNode;
        var standUI = downNode.getChildByName("stand");
        var children = downNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].name == "mjhand") {
                if (children[i].y > standUI.y + 10) {
                    bPut = true;
                    break;
                }
            }
        }
        return bPut;
    },

    /*
     设置听的icon 是否可见 add by sking
     */
    tingIconVisible: function(node, off) {
        var pl = getUIPlayer(off)
        if (pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("------ offfffffffffff  =  " + off);
        //cc.log("-------- set card -------- == pl.mjState  " + pl.mjState );

        if (pl && (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish)) {
            //准备状态时，所有的听Icon不可见
            // cc.log("--------- TableState.isReady------------ == TableState.isReady  " + TableState.isReady);
            node.visible = false;
        } else {

            if (pl != null) {
                // if (pl.isTing) { 没有听牌
                    // cc.log("----------- TableState.isReady-------------- == pl.isTing  " + pl.isTing);
                    node.visible = true;
                    if (off == 0) {
                        var tingSet = {};
                        if (pl.tingListAfterPut) {
                            for (var i = 0; i < pl.tingListAfterPut.length; i++) {
                                tingSet[pl.tingListAfterPut[i]] = 1;
                            }
                        }

                        setTingCards_JINZHONGMJ(this._tingCardsNode, tingSet);
                    }
                // } else {
                //     node.visible = false;
                // }
            }
            
        }
        //没有听牌
        var _tingIcon1 = this._downNode.getChildByName("head").getChildByName("tingIcon");
        _tingIcon1.visible = false;

        var _tingIcon2 = this._rightNode.getChildByName("head").getChildByName("tingIcon");
        _tingIcon2.visible = false;

        var _tingIcon3 = this._topNode.getChildByName("head").getChildByName("tingIcon");
        _tingIcon3.visible = false;

        var _tingIcon4 = this._leftNode.getChildByName("head").getChildByName("tingIcon");
        _tingIcon4.visible = false;
        return node.visible;
    },
    /*
        设置听牌之后打牌的花色, by sking
    */
    setTingCardInfo: function(node, eD, off) {
        return; //不显示
        /*
            游戏准备
         */
        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%% = " + off);
        var pl = getUIPlayer(off);
        if (pl == null) return;
        var tData = MjClient.data.sData.tData;
        cc.log("(((((((((((( set card))))))))))))))))) == pl.mjState  " + pl.mjState);
        if (pl.mjState == TableState.isReady || pl.mjState == TableState.roundFinish) {
            cc.log("*********set ting card info***************111");
            node.visible = false;
            return;
        }

        /*
            判断是否拿到了听之后的那张牌
         */
        var cd = -1;

        if (pl.isTing) {
            if (pl.putCardAfterTing) {
                cd = pl.putCardAfterTing;
            } else {
                return;
            }
        } else {
            node.visible = false;
            return;
        }

        cc.log("%%%%%%%%%%%%%%%%setCard%%%%%%%%%%%%%%%%%%%  pl.putCardAfterTing = " + pl.putCardAfterTing);

        /*
            设置麻将的花纹
         */
        //东南西北中发白
        var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];
        var offSets = [];
        if (getCurrentMJBgType() == 0)
            offSets = [
                [50, 90],
                [60, 70],
                [50, 90],
                [60, 70],
                [48, 62]
            ];
        else
            offSets = [
                [52, 100],
                [60, 70],
                [52, 100],
                [60, 70],
                [50, 66]
            ];
        //麻将的底牌公用图，4张
        //node.loadTexture("playing/MJ/Mj_up_" + off + ".png");

        var imgNode = new ccui.ImageView();
        imgNode.setPosition(offSets[0][0], offSets[0][1]);
        node.visible = true;
        node.removeAllChildren();
        node.addChild(imgNode);

        // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        if (cd < 30) {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        } else if (cd <= 91) { //东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)]; //东南西北中发白
        } else if (cd <= 181) {
            imgName = "flower_" + cd;
        }

        //node.tag = cd;
        var callback = function() {
            //加载小图
            imgNode.loadTexture(getNewMJBgFile(path + imgName + ".png"));
            if (getCurrentMJBgType() != 0) {
                // 左右两侧的牌偏大，特殊处理，缩小
                if (off == 1 || off == 3) {
                    imgNode.setScale(0.8);
                }
            }
        };

        node.stopAllActions();
        node.runAction(cc.sequence(cc.callFunc(callback), cc.delayTime(1)));
    },
    /*
        打出去的牌是那个玩家的， by sking
     */
    isPlayerPutCard: function(eD, off) {
        // var tData = MjClient.data.sData.tData;
        // var uids = tData.uids;
        // var idx = uids.indexOf(eD.uid);
        // var selfidx = uids.indexOf(SelfUid());
        // var offidx = (idx-selfidx+4)%4;

        var _UIOff = getUiOffByUid(eD.uid)

        if (_UIOff == off) {
            return true;
        } else {
            return false;
        }
    }
});


PlayLayer_hejinkunjin.prototype.CardLayoutRestore = function(node, off) {
    // node 是克隆新建的一个麻将节点 by sking

    var newC = null; //先创建麻将的UI节点
    var newVal = 0; //新牌的值，是几万，几筒，几条....为数字
    var pl = getUIPlayer(off); //获取玩家信息.off 为0 ，就是自己得信息，能看到自己摸牌 by sking
    if (!pl)    return;
    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        ci.stopActionByTag(20180131);
        if (ci.name == "mjhand") {
            mjhandNum++;
            if ((typeof MjClient.init_y) == 'undefined') {
                MjClient.init_y = ci.y;
            }

            ci.y = MjClient.init_y;
        }
    }
    var tempMaJiang = MjClient.majiang; //麻将的各种方法判断，是否可以杠，是否可以吃... by sking
    //排序麻将的位置 by sking
    if (pl.mjhand && pl.mjhand.length > 0) {
        var count = tempMaJiang.CardCount(pl);
        if (count == 14 && mjhandNum == pl.mjhand.length) {
            if (pl.isNew) //isNew 每次摸完牌后设为true,打出去一张牌后 设为false by sking
            {
                newVal = pl.mjhand[pl.mjhand.length - 1]; //为什么取最后一个节点 ？
            } else {
                pl.mjhand.sort(function(a, b) {
                    if (tempMaJiang.isEqualHunCard(a)) {
                        return -1;
                    } else if (tempMaJiang.isEqualHunCard(b)) {
                        return 1;
                    } else {
                        return a - b;
                    }
                });

                newVal = pl.mjhand[pl.mjhand.length - 1];
            }
        }
    }
    //up stand 是2种麻将的图。
    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off) {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = up;
            offui = up;
            break;
    }
    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];
    var uihun = []; //癞子牌在最左边
    // var sData = MjClient.data.sData;
    // var tData = sData.tData;
    for (var i = 0; i < children.length; i++) //children 为 "down" 节点下的字节点
    {
        var ci = children[i];
        if (ci.name == "mjhand") {
            if (newC == null && newVal == ci.tag) {
                newC = ci; //从down 节点下，复制一个麻将node保存在newC 里 by sking    //newC就是新摸的那张手牌
            } else {
                if ((MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag) ||
                    (MjClient.data.sData.tData.hunCard2 && MjClient.data.sData.tData.hunCard2 == ci.tag)) {
                    uihun.push(ci);
                } else {
                    uistand.push(ci);
                }
            }

            if ((MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag) ||
                (MjClient.data.sData.tData.hunCard2 && MjClient.data.sData.tData.hunCard2 == ci.tag)) {
                ci.setColor(cc.color(255, 255, 63));
            }
        } else if (ci.name == "standPri") {
            uistand.push(ci);
        } else if (ci.name == "gang0") {
            uigang0.push(ci);
        } else if (ci.name == "gang1") {
            uigang1.push(ci);
        } else if (ci.name == "chi") {
            uichi.push(ci);
        } else if (ci.name == "peng") {
            uipeng.push(ci);
        } else if (ci.name == "mjhand_replay") {
            if ((MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag) ||
                (MjClient.data.sData.tData.hunCard2 && MjClient.data.sData.tData.hunCard2 == ci.tag)) {
                cc.log("==========uihun============");
                uihun.push(ci);
            } else {
                uistand.push(ci);
            }
        }
    }
    uistand.sort(TagOrder);

    var sData = MjClient.data.sData;
    if (sData) var tData = sData.tData;
    var zimoHuType = (pl.huWord && (pl.huWord == "zimo" || pl.huWord == "tianhu")) ||
        (pl.mjState && tData && (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut));
    if (off != 0 && uistand.length > 0 && zimoHuType && pl.zimoNode) {
        uistand[uistand.length - 1].removeFromParent();
        var zimoNode = getNewCard(getNode(off), "up", "standPri", pl.zimoNode, off);
        zimoNode.setName("zimoCardNode");
        if (off == 3) {
            uistand.push(zimoNode);
        } else {
            uistand.unshift(zimoNode);
        }
    }


    uihun.sort(TagOrder);
    if (uihun.length > 0) //是否有柰子，有则放在最前面 by sking
    {
        for (var i = 0; i < uihun.length; i++) {
            uistand.unshift(uihun[i]); //向数组开头添加一个元素 unshift
        }
    }
    if (newC) {
        uistand.push(newC); //把这张牌放入手牌的数组里  by sking
    }
    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    if (off == 1 || off == 2) {
        uiOrder.reverse(); //颠倒顺序
    }
    var orders = []; //重新排序后装到数组里 by sking
    for (var j = 0; j < uiOrder.length; j++) {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++) {
            orders.push(uis[i]);
        }
    }
    //设置麻将大小
    var slotwith = upSize.width * upS * 0.2; //0.05;
    var slotheigt = upSize.height * upS * 0.3;
    var hasUp = false;
    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];
        if (off % 2 == 0) //自己或者对家
        {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.18;
                    } else if (orders[i - 1].isgang4) {
                        ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                    } else if (orders[i - 1].ispeng3) {
                        ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                    } else {
                        if (ci.name == "mjhand") {
                            if (off == 0) {
                                ci.x = orders[i - 1].x + upSize.width * upS * COMMON_UI.cardBetween;
                            } else //这个地方不是对家的手牌，下面的代码好像没用
                            {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1.8;
                            }
                        } else {
                            if (off == 0) {
                                var cardBetween = COMMON_UI.chipenggangBetween;
                                ci.x = orders[i - 1].x + upSize.width * upS * cardBetween;
                            } else {
                                ci.x = orders[i - 1].x + upSize.width * upS * 1; //对家的手牌
                            }
                        }
                    }
                } else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                } else {
                    ci.x = orders[i - 1].x + upSize.width * upS * 1.3;
                }
                ci.zIndex = orders[i - 1].zIndex + 1;
            } else {
                if (off == 0) {
                    ci.x = start.x + upSize.width * upS * 0.1;
                    ci.zIndex = start.zIndex + 100; //第一张牌的层级
                } else {
                    ci.x = start.x + upSize.width * upS;
                }

                var isGray = pl.isTing && ci.name == "mjhand";
                if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function() {});
                }

                if (ci.name == "mjhand" && (pl.isTing || MjClient.clickTing && !MjClient.canTingCards[ci.tag]))
                    ci.setColor(cc.color(190, 190, 190));
                else
                    ci.setColor(cc.color(255, 255, 255));
            }

            if (off == 0) {
                /*
                 ting的情况下，将麻将置灰
                 */
                // console.log("--------orders.length--------"+orders.length);
                var isGray = pl.isTing && ci.name == "mjhand";
                //if(ci.name == "mjhand")

                if (MjClient.clickTing) {
                    if (ci.name == "mjhand") {
                        if (MjClient.canTingCards[ci.tag]) {
                            ci.setColor(cc.color(255, 255, 255));
                            if (!hasUp) {
                                ci.y += 20;
                                hasUp = true;
                            }
                        } else {
                            ci.setColor(cc.color(190, 190, 190));
                        }
                    } else {
                        ci.setColor(cc.color(255, 255, 255));
                    }
                } else if (i == orders.length - 1) {
                    console.log(ci.tag + "--------newC--------" + newC);
                    if (newC) {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                        ci.x = ci.x + slotwith + 10;
                        MjClient.newCard = newC;
                        MjClient.newCard.isNew = true;
                        //ci.y += 20;//发的新牌默认不提起
                        if (isGray) ci.y += 20; //听牌情况下，发的新牌才默认提起
                    } else if (isGray) {
                        ci.setColor(cc.color(190, 190, 190));
                        ci.addTouchEventListener(function() {});
                    } else {
                        ci.setColor(cc.color(255, 255, 255));
                        SetTouchCardHandler(stand, ci);
                    }
                } else if (isGray) {
                    ci.setColor(cc.color(190, 190, 190));
                    ci.addTouchEventListener(function() {});
                } else {
                    ci.setColor(cc.color(255, 255, 255));
                    SetTouchCardHandler(stand, ci);
                }
            } else {
                if (ci.getChildByName("imgNode"))
                    ci.getChildByName("imgNode").setRotation(0);
            }


            if ((MjClient.data.sData.tData.hunCard && MjClient.data.sData.tData.hunCard == ci.tag) ||
                (MjClient.data.sData.tData.hunCard2 && MjClient.data.sData.tData.hunCard2 == ci.tag)) {
                ci.setColor(cc.color(240, 230, 140));
            }

        } else {
            if (i != 0) {
                if (ci.name == orders[i - 1].name) {
                    if (ci.isgang4) {
                        ci.y = orders[i - 2].y + slotheigt;
                    } else if (orders[i - 1].isgang4) {
                        ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                    } else if (orders[i - 1].ispeng3) {
                        ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                    } else {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.8;
                    }
                } else if (orders[i - 1].name == "standPri") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                } else if (orders[i - 1].name == "gang0" || orders[i - 1].name == "gang1") {
                    ci.y = orders[i - 2].y - upSize.height * upS * 1.1;
                } else if (orders[i - 1].name == "mjhand_replay") {
                    ci.y = orders[i - 1].y - upSize.height * upS * 2;
                } else {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.1;
                }

                ci.zIndex = orders[i - 1].zIndex + 1; //调整每张牌的层级
            } else {
                ci.y = start.y - upSize.height * upS * 0.2;
                ci.y += 10;
                ci.zIndex = start.zIndex; //第一张牌的层级
            }
        }
    }

    if (COMMON_UI3D.is3DUI()) {
        COMMON_UI3D.set3DCardSprite(off);
    } else {
        //刷新手牌大小
        resetCardSize();
    }
    MjClient.playui.willHuShowArrow();
};

// 判断吃碰杠胡的状态
PlayLayer_hejinkunjin.prototype.EatVisibleCheck = function() {
    var eat = MjClient.playui.jsBind.eat;
    //sk 为啥要隐藏掉？   //因为一开始是不可见的，隐藏根节点 by sking
    MjClient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var leftCard = MjClient.majiang.getAllCardsTotal() - tData.cardNext;

    var _downNode = getNode(0);

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;
    eat.cancel._node.visible = false;


    var pl = sData.players[SelfUid() + ""];
    MjClient.gangCards = [];
    MjClient.eatpos = [];

    var mj = MjClient.majiang;

    //吃碰杠胡node
    var vnode = [];

    cc.log("pl.mjState  ", pl.mjState, "tData.uids[tData.curPlayer]  ", tData.uids[tData.curPlayer])

    if (
        pl.mjState == TableState.waitEat ||
        pl.mjState == TableState.waitPut &&
        tData.uids[tData.curPlayer] == SelfUid()) {

    } else {
        return;
    }

    //自摸
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut) {
        if (IsTurnToMe()) {
            //检测补花
            var cduis = _downNode.children;
            for (var i = cduis.length - 1; i >= 0; i--) {
                if (cduis[i].name == "mjhand" && MjClient.majiang.isCardFlower(cduis[i].tag)) {
                    var callback = function() {
                        PutOutCard(cduis[i], cduis[i].tag);
                    };
                    cduis[i].runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(callback)));
                    return;
                }
            }
            //胡
            if (pl.isNew && pl.eatFlag & 8) {
                vnode.push(eat.hu._node);
                // if (pl.mustHu) pl.isZiMoHu = true;
            }
            //听
            // if (!pl.isTing) {
            //     // cc.log("￥￥￥￥听牌监测");
            //     MjClient.canTingCards = {};
            //     if (pl.tingLists) {
            //         for (var i in pl.tingLists) {
            //             MjClient.canTingCards[i] = 1;
            //             if (vnode.indexOf(eat.ting._node) < 0) {
            //                 vnode.push(eat.ting._node);
            //             }
            //         }
            //     }
            // }
            //杠
            cc.log("=== pl.mjpeng :  " + pl.mjpeng)
            cc.log("=== pl.mjhand :  " + pl.mjhand)
            cc.log("=== pl.isTing :  " + pl.isTing)
            var rtn = pl.gangList || [];
            cc.log("$$$$杠牌监测" + JSON.stringify(rtn));
            if (rtn.length > 0) {
                MjClient.gangCards = rtn;
                vnode.push(eat.gang0._node);
            }
            if (vnode.length > 0) {
                vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            }
        }
    }
    //别人点
    else if (tData.tState == TableState.waitEat) {
        // cc.log("diao pao hu-=================================================");
        if (!IsTurnToMe()) {
            if (pl.eatFlag & 8) {
                if (pl.mustHu) pl.isZiMoHu = true;
                vnode.push(eat.hu._node);
            }
            if (pl.eatFlag & 4) {
                vnode.push(eat.gang0._node);
                MjClient.gangCards = [tData.lastPutCard];
                eat.gang0._node.visible = true;
                setCardSprite(eat.gang0.card1._node, MjClient.gangCards[0], 0);
            }
            if (pl.eatFlag & 2) {
                vnode.push(eat.peng._node);
            }

            //如果，有杠，碰，吃。 这出现过的UI. 否则玩家状态为等待
            if (vnode.length > 0) {
                if (!pl.mustHu) vnode.push(eat.guo._node);
                eat.ting._node.visible = false;
                eat.noTing._node.visible = false;
                isCheckedTing = false;
            } else {
                getUIPlayer(0).mjState = TableState.waitCard;
            }
        }
    }

    //吃碰杠胡过处理
    if (vnode.length > 0) {
        var btnImgs = {
            "peng": ["playing/gameTable/youxizhong-2_57.png", "playing/gameTable/youxizhong-2_07.png"],
            "gang0": ["playing/gameTable/youxizhong-2_55.png", "playing/gameTable/youxizhong-2_05.png"],
            "chi0": ["playing/gameTable/youxizhong-2_59.png", "playing/gameTable/youxizhong-2_09.png"],
        }

        for (var i = 0; i < vnode.length; i++) {
            vnode[i].visible = true;

            if (vnode[i].getChildByName("card1")) {
                vnode[i].getChildByName("card1").visible = false;
            }

            if (vnode[i].getChildByName("bgground")) {
                vnode[i].getChildByName("bgground").visible = false;
            }

            if (vnode[i].getChildByName("bgimg")) {
                vnode[i].getChildByName("bgimg").visible = true;
            }

            var btnName = vnode[i].name;
            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }

            if (i == 0) {
                var cardVal = 0;
                if (vnode[i].getChildByName("bgimg")) {
                    vnode[i].getChildByName("bgimg").visible = false;
                }

                if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                    vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                    // vnode[i].loadTexturePressed(btnImgs[btnName][1]);
                }

                if (btnName == "peng") {
                    cardVal = tData.lastPutCard;
                } else if (btnName == "chi0") {
                    if (MjClient.eatpos.length == 1) {
                        cardVal = tData.lastPutCard;
                    }
                } else if (btnName == "gang0") {
                    if (MjClient.gangCards.length == 1) {
                        cardVal = MjClient.gangCards[0];
                    }
                } else if (btnName == "hu") {
                    if (IsTurnToMe()) {
                        cardVal = pl.mjhand[pl.mjhand.length - 1];
                    } else {
                        cardVal = tData.lastPutCard;
                    }
                }

                if (cardVal && cardVal > 0) {
                    setCardSprite(vnode[0].getChildByName("card1"), cardVal, 0);
                    vnode[0].getChildByName("card1").visible = true;
                }

                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").zIndex = -1;
                    vnode[0].getChildByName("bgground").visible = true;
                }

                //屏蔽到 碰 ，杠 的显示牌 add by sking
                if (vnode[0].getChildByName("bgground")) {
                    vnode[0].getChildByName("bgground").visible = false;
                }
                if (vnode[i].getChildByName("card1")) {
                    vnode[i].getChildByName("card1").visible = false;
                }
                //end of 屏蔽 碰，杠的显示牌
            }

            setWgtLayout(vnode[i], [0, 0.16], [0.5, 0], [(1 - vnode.length) / 1.8 + i * 1.4, 1.8], false, false);
        }
    }

    if (eat.hu._node.visible) {
        MjClient.playui._btnPutCard.visible = false;
    }
    //显示，吃，碰，杠的那几张牌
    COMMON_UI.showCurrentEatCards(vnode);
}

/*
    玩家ui，信息
 */
PlayLayer_hejinkunjin.prototype.Node_player = function(off) {
    var _node = getNode(off);

    if (off == 1 || off == 3) {
        _node.visible = MjClient.MaxPlayerNum != 2;
    }

    if (off == 2) {
        _node.visible = MjClient.MaxPlayerNum != 3;
    }

    /********************************************UI节点*********************************************/
    var _head = _node.getChildByName("head");


    //托管
    var _tuoguan = _head.getChildByName("tuoguan");
    if (_tuoguan) {
        _tuoguan.visible = false;
        UIEventBind(null, _tuoguan, "beTrust", function(msg) {
            if (getUIPlayer(off) && getUIPlayer(off).info.uid == msg.uid) {
                _tuoguan.visible = true;
            }
        });

        UIEventBind(null, _tuoguan, "cancelTrust", function(msg) {
            if (getUIPlayer(off) && getUIPlayer(off).info.uid == msg.uid) {
                _tuoguan.visible = false;
            }
        });
    }

    var _zhuang = _head.getChildByName("zhuang");
    if (_zhuang) {
        _zhuang.visible = false;
    }

    var _chatbg = _head.getChildByName("chatbg");
    if (_chatbg) {
        _chatbg.getParent().zIndex = 600;

        var _chattext = _chatbg.getChildByName("chattext");
        UIEventBind(null, _chattext, "MJChat", function(msg) {
            showUserChat(_chattext, off, msg);
        });

        UIEventBind(null, _chattext, "playVoice", function(voicePath) {
            MjClient.data._tempMessage.msg = voicePath;
            showUserChat(_chattext, off, MjClient.data._tempMessage);
        });
    }

    _head.setTouchEnabled(true);
    _head.addTouchEventListener(function(sender, type) {
        if (type == 2) {
            showPlayerInfo(off, sender);
        }
    }, _head);

    showFangzhuTagIcon(_head, off);

    var _score_bg = _head.getChildByName("score_bg");
    _score_bg.visible = false;

    var _name_bg = _head.getChildByName("name_bg");
    _name_bg.visible = false;

    var _flower_layout = _head.getChildByName("flower_layout");
    _flower_layout.visible = false;

    var _flower_zfb_layout = _head.getChildByName("flower_zfb_layout");
    _flower_zfb_layout.visible = false;

    var _tingCard = _head.getChildByName("tingCard");
    if (_tingCard) {
        _tingCard.visible = false;
    }

    var _tingIcon = _head.getChildByName("tingIcon");
    if (_tingIcon) {
        _tingIcon.visible = false;
        _tingIcon.runAction(cc.sequence(cc.spawn(cc.tintTo(0.6, 255, 0, 0), cc.scaleTo(0.6, _tingIcon.getScale() + 0.3)),
            cc.spawn(cc.tintTo(0.6, 255, 255, 255), cc.scaleTo(0.6, _tingIcon.getScale()))).repeatForever());
    }

    var _huaCount = _head.getChildByName("huaCount");
    if (_huaCount) {
        MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        _huaCount.ignoreContentAdaptWithSize(true);
        _huaCount.setString("花 x 0");
    }

    var _huaImg = _head.getChildByName("JinNum");
    cc.log("金数显示  ",_huaImg);
    if (_huaImg) 
    {
        _huaImg.visible = false;
    }

    var _skipHuIconTag = _head.getChildByName("skipHuIconTag");
    if (_skipHuIconTag) _skipHuIconTag.visible = false;

    var _skipPengIconTag = _head.getChildByName("skipPengIconTag");
    if (_skipPengIconTag) _skipPengIconTag.visible = false;

    var _play_tips = _node.getChildByName("play_tips");
    if (_play_tips) {
        _play_tips.visible = false;
        _play_tips.zIndex = actionZindex;
    }


    var _tai_layout = _node.getChildByName("tai_layout");
    if (_tai_layout) {
        var _tai_nifo = _tai_layout.getChildByName("tai_info");
        // _tai_nifo.visible = true;
        _tai_nifo.setString("");
    }


    var _ready = _node.getChildByName("ready");
    if (_ready) GetReadyVisible(_ready, off);

    var _stand = _node.getChildByName("stand");
    if (_stand) _stand.visible = false;

    var _up = _node.getChildByName("up");
    if (_up) _up.visible = false;

    var _down = _node.getChildByName("down");
    if (_down) _down.visible = false;

    var _out0 = _node.getChildByName("out0");
    _out0.visible = false;
    var _out1 = _node.getChildByName("out1");
    _out1.visible = false;
    var _out2 = _node.getChildByName("out2");
    if (_out2) _out2.visible = false;

    var jincard = _node.getChildByName("jinout");
    if (jincard) jincard.visible = false;


    var _outBig = _node.getChildByName("outBig");
    if (_outBig) _outBig.visible = false;

    var _tingCardsNode = _node.getChildByName("tingCardsNode");
    if (_tingCardsNode) _tingCardsNode.visible = false;

    var _tingCardNumNode = _node.getChildByName("tingCardNumNode");
    if (_tingCardNumNode) _tingCardNumNode.visible = false;


    /********************************************事件处理*********************************************/

    UIEventBind(null, _node, "clearCardUI", function(eD) {
        clearCardUI(_node, off);
        _tingCard.visible = false;
        if (_huaCount) _huaCount.setString("花 x 0");
        if (_skipHuIconTag) _skipHuIconTag.visible = false;
        if (_skipPengIconTag) _skipPengIconTag.visible = false;
        if (_tingCardsNode) _tingCardsNode.visible = false;
        if (_tingCardNumNode) _tingCardNumNode.visible = false;
    });

    UIEventBind(null, _node, "initSceneData", function(eD) {
        SetUserVisible_hejinkunjin(_node, off);
        if (IsArrowVisible()) showUserZhuangLogo(_zhuang, off);
        //MjClient.playui.setTingCardInfo(_tingCard,eD,off);
        MjClient.playui.tingIconVisible(_tingIcon, off);
        //MjClient.playui.DealMJPut_hejinkunjin(_node, off, -1, eD.uid);
        var pl = getUIPlayer(off);
        if (pl && pl.skipHu && pl.skipHu.length > 0) {
            if (_skipHuIconTag) _skipHuIconTag.visible = true;
        }
        if (pl && _skipPengIconTag) {
            if (pl.skipPeng.length > 0) {
                _skipPengIconTag.visible = true;
            } else {
                _skipPengIconTag.visible = false;
            }
        }
        MjClient.playui.changeHuaImg(_huaImg,off);
        if (_tingCardsNode) MjClient.playui.tingIconVisible(_tingCardsNode, off);
        showAndHideHeadEffect();
    });
    UIEventBind(null, _node, "addPlayer", function(eD) {
        SetUserVisible_hejinkunjin(_node, off);
        showFangzhuTagIcon(_head, off);
        if (_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
        GetReadyVisible(_ready, off);

    });
    UIEventBind(null, _node, "removePlayer", function(eD) {
        SetUserVisible_hejinkunjin(_node, off);
        showFangzhuTagIcon(_head, off);
        GetReadyVisible(_ready, off);
        if (_huaCount) MjClient.playui.setPlayerHuaValueShow(_huaCount.getParent());
    });
    UIEventBind(null, _node, "mjhand", function(eD) {
        InitUserHandUI_hejinkunjin(_node, off);
    });
    UIEventBind(null, _node, "roundEnd", function(eD) {
        var tData = MjClient.data.sData.tData;
        if (!tData.fieldId)
            InitUserCoinAndName_jinzhong(_node, off);
        else
            InitUserCoinAndName(_node, off);
        _tingIcon.visible = false;
        _huaImg.visible = false;
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "newCard", function(eD) {
        if (off == 0) {
            if (typeof(eD) == "number") {
                eD = {
                    newCard: eD
                };
            }

            var pl = getUIPlayer(off);
            if (pl.skipHu) {
                var _skipHuIconNode = MjClient.playui._downNode.getChildByName("head").getChildByName("skipHuIconTag");
                if (_skipHuIconNode) {
                    _skipHuIconNode.visible = (pl.skipHu.length > 0);
                }
            }
            DealNewCard(_node, eD.newCard, off);
            hideTingBtn();
        }
    });

    UIEventBind(null, _node, "MJPut", function(eD) {

        // var pl = getUIPlayer(off);
        // var tData = MjClient.data.sData.tData;
        // if (pl && eD.uid == getUIPlayer(off).info.uid && pl.isTing)
        // {
        //     var _tingCards = _node.getChildByName("tingCardsNode");
        //     var tingSet = calTingSet(pl.mjhand, new Set([tData.hunCard, tData.hunCard2]));
        //     if(_tingCards) setTingCards_JINZHONGMJ(_tingCards,tingSet);

        // }
        var tData = MjClient.data.sData.tData;
        {
            MjClient.playui.DealMJPut_hejinkunjin(_node,eD,off);
        }
        hideTingBtn();
        var pl = getUIPlayer(off);
        if (pl && eD.uid == pl.info.uid) 
        {
            if (eD.card == tData.hunCard || eD.card == tData.hunCard2) 
            MjClient.playui.changeHuaImg(_huaImg,off);
        }
        if (_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
        showAndHideHeadEffect();
    });

    UIEventBind(null, _node, "MJChi", function(eD) {
        DealMJChi(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJGang", function(eD) {
        DealMJGang(_node, eD, off);
        hideTingBtn();
        if (_skipPengIconTag) _skipPengIconTag.visible = false;
        setUserOffline(_node, off);
        MjClient.playui.willHuShowArrow();
    });

    UIEventBind(null, _node, "MJPeng", function(eD) {
        DealMJPeng(_node, eD, off);
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJHu", function(eD) {
        HandleMJHu(_node, eD, off);
        _tingCard.visible = false;
        if (_skipHuIconTag) _skipHuIconTag.visible = false;
        if (_tingCardsNode) _tingCardsNode.visible = false;
        if (_tingCardNumNode) _tingCardNumNode.visible = false;
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "onlinePlayer", function(eD) {
        setUserOffline(_node, off);
        GetReadyVisible(_ready, off);
    });

    UIEventBind(null, _node, "playerStatusChange", function(eD) {
        setUserOffline(_node, off);
    });

    UIEventBind(null, _node, "MJFlower", function(eD) {
        HandleMJFlower(_node, eD, off);
    });

    UIEventBind(null, _node, "MJTing", function(eD) {
        HandleMJTing(_node, eD, off);
        var pl = getUIPlayer(off);
        if (pl && eD.uid == getUIPlayer(off).info.uid) {
            pl.putCardAfterTing = eD.putCardAfterTing;
            MjClient.playui.setTingCardInfo(_tingCard, eD, off);
        }
    });


    UIEventBind(null, _node, "waitPut", function(eD) {
        showUserZhuangLogo(_zhuang, off);
        if (off != 0) DealWaitPut(this, eD, off); //其他家发牌
        showAndHideHeadEffect();
        MjClient.playui.willHuShowArrow();
    });


    UIEventBind(null, _head, "loadWxHead", function(d) {
        setWxHead(_head, d, off);
    });

    UIEventBind(null, _tingIcon, "moveHead", function(d) {
        MjClient.playui.tingIconVisible(_tingIcon, off);
        GetReadyVisible(_ready, -1);
    });

    if (off == 0) {
        // 吃，碰，杠，出牌的时候，刷新听牌提示的牌的个数  by jiangcw
        var refreshTingNum = function(off, eD) {
            var pl = getUIPlayer(off);
            var tData = MjClient.data.sData.tData;
            if (pl) {
                var _tingCards = _node.getChildByName("tingCardsNode");
                var tingSet = {};
                if (pl.tingListAfterPut) {
                    //tingSet = pl.tingListAfterPut;
                    for (var i = 0; i < pl.tingListAfterPut.length; i++) {
                        tingSet[pl.tingListAfterPut[i]] = 1;
                    }
                }
                cc.log("PlayerGamePanel ---------- refreshTingNum ---------- tingSet = " + JSON.stringify(tingSet));
                var _tingNumCards = _node.getChildByName("tingCardNumNode");
                _tingNumCards.visible = false;
                if (_tingCards) setTingCards_JINZHONGMJ(_tingCards, tingSet);
            }
        };
        // 刷新听牌张数
        UIEventBind(null, _node, "MJPut", function(eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJChi", function(eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJGang", function(eD) {
            refreshTingNum(off, eD);
        });

        UIEventBind(null, _node, "MJPeng", function(eD) {
            refreshTingNum(off, eD);
        });
    }


    /********************************************设置位置*********************************************/
    switch (off) {
        case 0:
            setWgtLayout(_play_tips, [0.08, 0.14], [0.5, 0.25], [0, 0.5]);
            setWgtLayout(_ready, [0.07, 0.07], [0.5, 0.5], [0, -1.5]);
            setWgtLayout(_stand, [0.057, 0], [0.5, 0], [8, 0.68]);
            setWgtLayout(_up, [0.05, 0], [0, 0], [0.8, 0.7]);
            //setWgtLayout(_stand,[0.057, 0], [0.5, 0], [8, 0.6]);
            //setWgtLayout(_up,[0.05, 0], [0, 0], [1.8, 0.6]);
            setWgtLayout(_down, [0.05, 0], [0, 0], [3.5, 1]);
            setWgtLayout(_out0, [0.0, 0.08], [0.55, -0.08], [-7, 6.1]);
            setWgtLayout(jincard, [0.0, 0.08], [0.55, -0.08], [-1.65, 4]);
            setWgtLayout(_out1, [0.0, 0.08], [0.55, -0.06], [-7, 4.9]);
            if (_out2) setWgtLayout(_out2, [0.0, 0.08], [0.55, -0.04], [-7, 3.7]);
            if (_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.32], [0, 0]);
            if (MjClient.MaxPlayerNum == 2) {
                _out0.x -= _out0.height * _out0.scale * 4.1;
                _out1.x -= _out1.height * _out1.scale * 4.1;
                if (_out2) _out2.x -= _out2.height * _out2.scale * 4.1;
            }

            if (_tingCardsNode) setWgtLayout(_tingCardsNode, [0.25, 0.12], [0.2, 0.25], [-0.2, -0.8]);
            if (_tingCardNumNode) setWgtLayout(_tingCardNumNode, [0.25, 0.12], [0.12, 0.25], [0, -0.2]);
            break;
        case 1:
            setWgtLayout(_play_tips, [0.08, 0.14], [0.75, 0.5], [0, 0.5]);
            setWgtLayout(_ready, [0.07, 0.07], [0.5, 0.5], [2, 0]);
            setWgtLayout(_stand, [0, 0.08], [1, 1], [-5.5, -2.3]);
            setWgtLayout(_up, [0, 0.05], [1, 0], [-3.0, 6]);
            setWgtLayout(_down, [0, 0.05], [1, 0], [-3, 6.3]);
            setWgtLayout(_out0, [0, 0.055], [0.94, 0.5], [-5.2, -4.0]);
            setWgtLayout(jincard, [0, 0.055], [0.94, 0.5], [-2.25, 0.7]);
            setWgtLayout(_out1, [0, 0.055], [0.94, 0.5], [-4.0, -4.0]);
            if (_out2) setWgtLayout(_out2, [0, 0.055], [0.94, 0.5], [-2.8, -4.0]);
            if (_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.75, 0.58], [0, 0]);
            break;
        case 2:
            setWgtLayout(_play_tips, [0.08, 0.14], [0.5, 0.75], [0, 0]);
            setWgtLayout(_ready, [0.07, 0.07], [0.5, 0.5], [0, 1.5]);
            setWgtLayout(_stand, [0, 0.07], [0.5, 1], [-6, -1.0]);
            setWgtLayout(_up, [0, 0.07], [0.5, 1], [6, -1.0]);
            setWgtLayout(_down, [0, 0.07], [0.5, 1], [6, -0.7]);
            setWgtLayout(_out0, [0, 0.08], [0.55, 1], [4.1, -4.1]);
            setWgtLayout(jincard, [0, 0.08], [0.55, 1], [-1.8, -2.2]);
            setWgtLayout(_out1, [0, 0.08], [0.55, 1], [4.1, -3.2]);
            if (_out2) setWgtLayout(_out2, [0, 0.08], [0.55, 1], [4.1, -2.3]);
            if (_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.5, 0.75], [0, 0]);
            if (MjClient.MaxPlayerNum == 2) {
                _out0.x += _out0.height * _out0.scale * 5.5;
                _out1.x += _out1.height * _out1.scale * 5.5;
                if (_out2) _out2.x += _out2.height * _out2.scale * 5.5;
            }
            break;
        case 3:
            setWgtLayout(_play_tips, [0.08, 0.14], [0.25, 0.5], [0, 0.5]);
            setWgtLayout(_ready, [0.07, 0.07], [0.5, 0.5], [-2, 0]);
            setWgtLayout(_stand, [0, 0.08], [0, 0.6], [5.2, 3]);
            setWgtLayout(_up, [0, 0.05], [0, 1], [3.0, -3.5]);
            setWgtLayout(_down, [0, 0.05], [0, 1], [3, -3]);
            setWgtLayout(_out0, [0, 0.055], [0.065, 0.5], [5.2, 4.2]);
            setWgtLayout(jincard, [0, 0.055], [0.065, 0.5], [2, 0.7]);
            setWgtLayout(_out1, [0, 0.055], [0.065, 0.5], [3.9, 4.2]);
            if (_out2) setWgtLayout(_out2, [0, 0.055], [0.068, 0.5], [2.6, 4.2]);
            if (_outBig) setWgtLayout(_outBig, [0.0836, 0], [0.25, 0.58], [0, 0]);
            if (MjClient.MaxPlayerNum == 3) {
                _out0.y += _out0.height * _out0.scale * 2;
                _out1.y += _out1.height * _out1.scale * 2;
                if (_out2) _out2.y += _out2.height * _out2.scale * 2;
            }
            break;
        default:
            break;
    }
}
PlayLayer_hejinkunjin.prototype.willHuShowArrow = function() {
    var tData = MjClient.data.sData.tData;
    if ("isOpenTingTip" in tData.areaSelectMode && !tData.areaSelectMode.isOpenTingTip) return;
    if (!IsTurnToMe()){
        COMMON_UI.cleanTingSign();
        return;
    }  


    var pl = getUIPlayer(0);
    if (!pl.mjhand) return;

    // 依次打掉每一张牌，判断是否可听，可听标记为1
    var myCards = MjClient.playui._downNode.children;
    var hunCard = MjClient.data.sData.tData.hunCard;
    var _canTingCards = {};
    MjClient.canTingCards = {};

    // 防止canTingCards多计算一次
    if (!!MjClient.canTingCards && Object.keys(MjClient.canTingCards).length > 0) {
        _canTingCards = MjClient.canTingCards;
    } else {
        if (pl.tingLists) {
            for (var i in pl.tingLists) {
                _canTingCards[i] = 1;
            }
            MjClient.canTingCards = _canTingCards;
        }
    }

    COMMON_UI.cleanTingSign();
    // 添加听牌标识
    if (Object.keys(_canTingCards).length <= 0) return;
    for (var i = 0; i < myCards.length; i++) {
        if ((myCards[i].name === "mjhand") && (myCards[i].tag in _canTingCards)) {
            var tingSign = myCards[i].getChildByName("tingSign");
            if (!tingSign) {
                tingSign = new cc.Sprite("common/tingcard.png");
                tingSign.setName("tingSign");
                myCards[i].addChild(tingSign);
            }
            tingSign.setPosition(myCards[i].getContentSize().width / 2, myCards[i].getContentSize().height + 20);
            tingSign.setVisible(true);
        }
    }
};
PlayLayer_hejinkunjin.prototype.DealMJPut_hejinkunjin = function(node, msg, off, outNum)
{
    cc.log("~DealMJPut_shanXiApp() === off ===" + off);
    cc.log("~DealMJPut_shanXiApp() === msg:" + JSON.stringify(msg));
    if(off == 0) RemoveNodeBack(node, "copycdui", 1, msg.card);//在putOutCard 函数里被创建
    if(COMMON_UI3D.is3DUI())
        return  COMMON_UI3D.DealMJPut_shanXiApp3D(node, msg, off, outNum);


    //cardPutted = false;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    //cc.log("========================"+JSON.stringify(sData)+'!!'+JSON.stringify(tData));
    var uids = tData.uids;
    var selfIndex = getPlayerIndex(off);
    if(uids[selfIndex] == msg.uid)
    {
        var pl = sData.players[msg.uid];
        var putnum = outNum >= 0 ? outNum : (pl.mjput.length - 1);
        var tingPutNum = putnum;
        var tingIndex = pl.tingIndex;//沭阳麻将需要

        cc.log( off + "------------- putnum =" + putnum);
        cc.log("------------- tingPutNum =" + tingPutNum);

        if(cc.isUndefined(tingIndex) || !pl.isTing)
        {
            tingIndex = -1;//为了不报错;
        }


        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");

        var out0_self = getNode(0).getChildByName("out0");
        var out1_self = getNode(0).getChildByName("out1");
        var out2_self = getNode(0).getChildByName("out2");


        var maxNum = 10;
        if (MjClient.MaxPlayerNum == 2)
            maxNum = 20;
        else if (MjClient.MaxPlayerNum == 3 && off != 0)
            maxNum = 13;


        var out;
        var out_self;
        if (putnum >= maxNum*2 && out2)
        {
            out = out2.clone();
            out_self = out2_self.clone();
        }
        else if(putnum >= maxNum)
        {
            out = out1.clone();
            out_self = out1_self.clone();
        }
        else
        {
            out = out0.clone();
            out_self = out0_self.clone();
        }

        // 消除牌背资源尺寸不一致，导致出牌时牌会闪烁的问题
        if (isJinZhongAPPType() && off == 0) {
            var type = getCurrentMJBgType();
            if (type == 0) {
                out.loadTexture("playing/MJ/Mj_up_2.png");
                out_self.loadTexture("playing/MJ/Mj_up_2.png");
            }
            else if (type == 1) {
                out.loadTexture("playing/MJ/MJBg1/Mj_up_2.png");
                out_self.loadTexture("playing/MJ/MJBg1/Mj_up_2.png");
            }
            else if (type == 2) {
                out.loadTexture("playing/MJ/MJBg2/Mj_up_2.png");
                out_self.loadTexture("playing/MJ/MJBg2/Mj_up_2.png");
            }
            else if (type == 3) {
                out.loadTexture("playing/MJ/MJBg3/Mj_up_2.png");
                out_self.loadTexture("playing/MJ/MJBg3/Mj_up_2.png");
            }
            out.ignoreContentAdaptWithSize(true);
            out_self.ignoreContentAdaptWithSize(true);
        }

        //out = CommonPool.getFromPool("out");
        //if (!out) {
        //    out = out0.clone();
        //}else{
        //    COMMON_UI.CopyProperties(out, out0);
        //    cc.log("COMMON_UI.CopyProperties(out, out0);");
        //}


        out.setScale(out.getScale()*1.3);
        out_self.setScale(out_self.getScale()*1.3);
        var oSize = out.getSize();
        var oSc = out.scale;

        if (off == 0 && putnum >= maxNum * 2 && out2)
        {
            node.addChild(out,putnum + 30);
        }
        else if (off == 0 && putnum >= maxNum)
        {
            node.addChild(out,putnum + 20);
        }
        else if(off == 0)
        {
            node.addChild(out,putnum + 10);
        }
        else if(off == 1 )
        {
            node.addChild(out, putnum);
        }
        else if(off == 2 || off == 3)
        {

            if(MjClient.gameType == MjClient.GAME_TYPE.DA_NING_SHUAI_JIN && putnum > maxNum*3 - 1)
            {
                node.addChild(out, 100 - putnum);
            }
            else {
                node.addChild(out, 20 - putnum);
            }
        }
        else
        {
            node.addChild(out);
        }

        for(var i = 0; i < node.children.length; i++)
        {
            if(node.children[i].name == "newout")
            {
                node.children[i].name = "out";
            }
        }

        out.visible = true;
        out.name = "out";
        out.istingcard = false; //扣点风嘴子需要这个变量
        var myOff = off;
        if(myOff == 2) myOff = 0;

        cc.log("===============000===========myOff = " + myOff);
        setCardSprite(out, msg.card, myOff);
        if (out.tag == tData.hunCard || out.tag == tData.hunCard2) 
        {
            out.setColor(cc.color(190,190,190));
        }

        //if (MjClient.gameType == MjClient.GAME_TYPE.JIN_ZHONG_MJ)
        {
            var idx = pl.putCardAfterTing;
            if (idx >= 0 && idx == tingPutNum)
            {
                out.istingcard = true;
                if(MjClient.gameType != MjClient.GAME_TYPE.HONG_TONG_WANG_PAI) //洪洞王牌没有这个段代码
                {
                    if (MjClient.rePlayVideo == -1) {
                        if (off == 0) {
                            out.setColor(cc.color(240, 230, 140));
                            if (out.tag == tData.hunCard || out.tag == tData.hunCard2) 
                            {
                                out.setColor(cc.color(190,190,190));
                            }
                            if(MjClient.gameType == MjClient.GAME_TYPE.JIN_ZHONG_LI_SI)
                            {
                                out.isFour = true; //立四麻将需要
                                setCardSprite(out, msg.card, myOff);
                            }
                        }
                        else {
                            if(MjClient.gameType == MjClient.GAME_TYPE.XIAO_YI_KOU_DIAN)
                            {
                                if(MjClient.data.sData.tData.areaSelectMode["anting"]){
                                    var _UINode = getNode(off);
                                    var cpnode = _UINode.getChildByName("down");
                                    out.removeAllChildren();
                                    out.loadTexture(cpnode.getRenderFile().file);
                                    unschedulePlayMoveCardOtherSameCardGrey(out);
                                }else{
                                    out.setColor(cc.color(240, 230, 140));
                                }
                            }
                            else
                            {
                                var _UINode = getNode(off);
                                var cpnode = _UINode.getChildByName("down");
                                out.removeAllChildren();
                                out.loadTexture(cpnode.getRenderFile().file);
                                unschedulePlayMoveCardOtherSameCardGrey(out);
                            }
                        }
                    }
                    else//回放
                    {
                        out.setColor(cc.color(240, 230, 140));
                        if (out.tag == tData.hunCard || out.tag == tData.hunCard2) 
                        {
                            out.setColor(cc.color(190,190,190));
                        }
                        if(MjClient.gameType == MjClient.GAME_TYPE.JIN_ZHONG_LI_SI)
                        {
                            out.isFour = true; //立四麻将需要
                            setCardSprite(out, msg.card, myOff);
                        }
                    }
                }
            }
        }

        var endPoint = cc.p(0, 0);
        var Midpoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();

        if(MjClient.gameType == MjClient.GAME_TYPE.DA_NING_SHUAI_JIN && putnum > maxNum*5 - 1)
        {
            out.x = out2.x;
            out.y = out2.y+10;
            putnum -= maxNum*5;
        }
        else if(MjClient.gameType == MjClient.GAME_TYPE.DA_NING_SHUAI_JIN && putnum > maxNum*4 - 1)
        {
            out.x = out1.x;
            out.y = out1.y+10;
            putnum -= maxNum*4;
        }
        else if(MjClient.gameType == MjClient.GAME_TYPE.DA_NING_SHUAI_JIN && putnum > maxNum*3 - 1)
        {
            out.x = out0.x;
            out.y = out0.y+10;
            putnum -= maxNum*3;
        }
        else if (putnum > maxNum*2 - 1 && out2)
        {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= maxNum*2;
            tingIndex -= maxNum*2;
        }
        else if (putnum > maxNum - 1)
        {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= maxNum;
            tingIndex -= maxNum;
        }


        //是否需要变宽
        var addWide =  0;
        // if (tingIndex <= putnum && tingIndex >= 0 ){
        //     if(off == 0 || off == 2)
        //     {
        //         addWide =  oSize.width * oSc *0.91;
        //     }
        //     else if (off  == 1 || off == 3)
        //     {
        //         // addWide =  oSize.height * oSc *0.73;
        //         addWide =  oSize.height * oSc *0.91;
        //     }
        // }


        var _outWidth = 0.92; //自己 和 对家 打出去的牌的间隙 by sking 2018.10.25

        if(off == 0)
        {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * putnum*_outWidth + addWide;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height * 0.3;
            if(!(outNum >= 0))
            {
                var pl = getUIPlayer(0);
                // //add by sking 2018.9.6  晋中的打出牌后提前对手牌排序
                if(RemoveNodeBack(node, "putOutCard", 1, msg.card) == 0)
                {
                    RemoveNodeBack(node, "mjhand", 1, msg.card);
                }
            }
        }
        else if (off == 1)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                {
                    if(MjClient.gameType == MjClient.GAME_TYPE.HONG_TONG_WANG_PAI)
                    {
                        if (tData.lastPutCard == getUIPlayer(off).hunCard)
                            RemoveNodeBack(node, "standPri", 1);
                        else
                            RemoveFrontNode(node, "standPri", 1);
                    }
                    else
                        RemoveFrontNode(node, "standPri", 1);

                }
                else//回放
                {
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
                }
            }
            cc.log("DealMJPut_haian remove card  = " + msg.card);



            // var bgType = getCurrentMJBgType();
            var cardBetween = 0.7;
            // if(bgType == 0)
            // {
            //     cardBetween = 0.75
            // }

            endPoint.y = out.y + oSize.height * oSc * putnum * cardBetween + addWide;
            endPoint.x = out.x;
            Midpoint.x = ws.width*0.78;
            Midpoint.y = ws.height*0.57;
            out.zIndex = 100 - putnum;
        }
        else if(off == 2)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                {
                    if(MjClient.gameType == MjClient.GAME_TYPE.HONG_TONG_WANG_PAI)
                    {
                        if (tData.lastPutCard == getUIPlayer(off).hunCard)
                            RemoveNodeBack(node, "standPri", 1);
                        else
                            RemoveFrontNode(node, "standPri", 1);
                    }
                    else
                    {
                        RemoveFrontNode(node, "standPri", 1);
                    }
                }
                else//回放
                    RemoveFrontNode(node, "mjhand_replay", 1, msg.card);
            }

            endPoint.x = out.x - oSize.width * oSc * putnum*_outWidth - addWide;
            endPoint.y = out.y;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height / 4 * 3;
        }
        else if (off == 3)
        {
            if(!(outNum >= 0))
            {
                if (MjClient.rePlayVideo == -1)
                {
                    if(MjClient.gameType == MjClient.GAME_TYPE.HONG_TONG_WANG_PAI)
                    {
                        if (tData.lastPutCard == getUIPlayer(off).hunCard)
                            RemoveFrontNode(node, "standPri", 1);
                        else
                            RemoveNodeBack(node, "standPri", 1);
                    }
                    else
                        RemoveNodeBack(node, "standPri", 1);
                }
                else
                    RemoveNodeBack(node, "mjhand_replay", 1, msg.card);
            }

            endPoint.y = out.y - oSize.height * oSc * putnum * 0.7 - addWide;
            endPoint.x = out.x;
            Midpoint.x = ws.width*(1- 0.78);
            Midpoint.y = ws.height * 0.57;
            out.zIndex = putnum;
        }


        if(outNum >= 0) //重连
        {
            // cc.log("==================tData = "+ JSON.stringify(tData));
            //断线重连的时候
            if (tData.lastPutCard == msg.card && tData.lastPutPlayer == tData.uids.indexOf(msg.uid))
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                clearCurrentPutTag();
                addCurrentPutTag(out, off);
            }

            if((outNum == pl.mjput.length - 1) && tData.curPlayer == selfIndex && tData.tState == TableState.waitEat)
            {

            }
            else
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                return;
            }
        }
        else //打牌
        {
            clearCurrentPutTag();
            addCurrentPutTag(out, off);
        }


        var zoder = out.zIndex;
        //out.zIndex = 200;
        out.visible = false;
        if(COMMON_UI.isPutScale && off != 0)
        {
            out.zIndex = 200;
            out.x = Midpoint.x;
            out.y = Midpoint.y;
            out.scale = 2 * oSc;
        }
        else
        {
            out.x = endPoint.x;
            out.y = endPoint.y;
            out.scale = oSc;
        }

        out.name = "newout";



        //var outAction = CommonPool.getFromPool("outAction");
        //var muban;
        //if (off != 0 && COMMON_UI.isPutScale) {
        //    muban = out0_self;
        //}else{
        //    muban = out;
        //}
        //if (!outAction) {
        //    outAction = muban.clone();
        //}else{
        //    COMMON_UI.CopyProperties(outAction, muban);
        //    cc.log("COMMON_UI.CopyProperties(outAction, muban);");
        //}
        //if (off != 0 && COMMON_UI.isPutScale) {
        //    outAction.setScale(outAction.getScale()*1.3);
        //}

        var outAction = null;
        if (off != 0 && COMMON_UI.isPutScale){
            outAction = out_self.clone();
            setCardSprite(outAction, msg.card, 0);
        }
        else {
            outAction = out.clone();
            cc.log("==========================myOff = " + myOff);
            //setCardSprite(outAction, msg.card, myOff); //outAction 和 out 的贴图位置不一样
        }


        if (off != 0)
        {
            var idx = pl.putCardAfterTing;
            if (idx >= 0 && idx == tingPutNum) {
                //if(MjClient.gameType != MjClient.GAME_TYPE.LIN_FEN_XIANG_NING_SHUAI_JIN&&
                //    MjClient.gameType != MjClient.GAME_TYPE.DA_NING_SHUAI_JIN)
                outAction.istingcard = true;
                if (MjClient.rePlayVideo == -1)
                {
                    if(MjClient.gameType == MjClient.GAME_TYPE.XIAO_YI_KOU_DIAN)
                    {
                        if(MjClient.data.sData.tData.areaSelectMode["anting"]){
                            var _UINode = getNode(off);
                            var cpnode = _UINode.getChildByName("down");
                            outAction.removeAllChildren();
                            outAction.loadTexture(cpnode.getRenderFile().file);
                            unschedulePlayMoveCardOtherSameCardGrey(outAction);
                        }else{
                            out.setColor(cc.color(240, 230, 140));
                        }
                    }
                    else if(MjClient.gameType == MjClient.GAME_TYPE.HONG_TONG_WANG_PAI)
                    {
                        // var _UINode = getNode(off);
                        // var cpnode = _UINode.getChildByName("down");
                        // outAction.removeAllChildren();
                        // outAction.loadTexture(cpnode.getRenderFile().file);
                        unschedulePlayMoveCardOtherSameCardGrey(outAction);
                    }
                    else
                    {
                        var _UINode = getNode(off);
                        var cpnode = _UINode.getChildByName("down");
                        outAction.removeAllChildren();
                        outAction.loadTexture(cpnode.getRenderFile().file);
                        unschedulePlayMoveCardOtherSameCardGrey(outAction);
                    }
                }
            }
        }

        outAction.name = "outAction";
        outAction.visible = true;

        node.addChild(outAction);

        if(COMMON_UI.isPutScale && off != 0)
        {
            outAction.zIndex = 200;
            outAction.scale = 2*oSc;
            outAction.setPosition(Midpoint);
            clearCurrentPutTag();
        }
        else
        {
            outAction.scale = oSc;
            outAction.zIndex = zoder;
            outAction.setPosition(endPoint);
            addCurrentPutTag(outAction, off);
        }
        cc.log("msg.card",msg.card,"tData.hunCard",tData.hunCard,"tData.hunCard2",tData.hunCard2);
        if (msg.card == tData.hunCard || msg.card == tData.hunCard2) 
        {
            //牌桌牌变色
            out.setColor(cc.color(190,190,190));
            //播放声音
            playEffectInPlay("shangjin");
            //播放动画
            var play_node = getNode(off);
            ShowEatActionAnim(play_node, ActionType.SHANGJIN, off);
        }


        var putTime = Date.now();

        var RemovePutCardScale = function (onlySelf)
        {
            MjClient.lastCardposNode = null;//抢杠胡没有牌 可以劈
            if (!cc.sys.isObjectValid(outAction))
            {
                return;
            }

            if (!onlySelf)
            {
                var _delayTime = 0.8;
                // if(off == 0) _delayTime = 0.4;

                var delayNum = _delayTime - (Date.now() - putTime) / 1000;
                if (delayNum < 0)
                {
                    delayNum = 0;
                }

                cc.log("---------delayNumdelayNumdelayNum------- " + delayNum);
                outAction.runAction(cc.sequence(
                    cc.delayTime(delayNum),
                    cc.callFunc(function()
                    {
                        if (cc.sys.isObjectValid(out))
                        {
                            out.visible = true;
                            out.runAction(cc.sequence(
                                cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)),
                                cc.callFunc(function(){
                                    addCurrentPutTag(out, off);
                                    out.setPosition(endPoint);
                                    out.setScale(oSc);
                                    out.zIndex = zoder;
                                    if (out.tag == tData.hunCard || out.tag == tData.hunCard2) 
                                    {
                                        out.setColor(cc.color(190,190,190));
                                    }
                                })
                            ));
                        }
                        //CommonPool.putInPool(outAction);
                        //outAction.removeFromParent();
                    }),
                    cc.removeSelf()
                ));
            }
            else
            {
                clearCurrentPutTag();
                //CommonPool.putInPool(outAction);
                outAction.removeFromParent();
            }
        }



        function RemovePutCard(onlySelf)
        {

            MjClient.lastCardposNode = null;//抢杠胡没有牌 可以劈
            if(COMMON_UI.isPutScale && off != 0)
            {
                return RemovePutCardScale(onlySelf);
            }
            if (cc.sys.isObjectValid(outAction))
            {
                //CommonPool.putInPool(outAction);
                outAction.removeFromParent();
            }
            if (!onlySelf)
            {
                out.visible = true;
                out.zIndex = zoder;
                if (out.tag == tData.hunCard || out.tag == tData.hunCard2) 
                {
                    out.setColor(cc.color(190,190,190));
                }
            }
            else
            {
                clearCurrentPutTag();
            }
        }


        var outActionBind =
            {
                _event:
                    {
                        waitPut: function()
                        {
                            RemovePutCard(false)
                        },
                        MJChi: function()
                        {
                            RemovePutCard(true);
                        },
                        MJPeng: function()
                        {
                            RemovePutCard(true);
                        },
                        MJGang: function(eD)
                        {
                            RemovePutCard(true);
                        },
                        roundEnd: function()
                        {
                            RemovePutCard(true);
                        },
                        //MJFlower: function () {
                        //    RemovePutCard(false);
                        //}
                    }
            }


        BindUiAndLogic(outAction, outActionBind);



        var pl = getUIPlayer(0);
        if(off == 0 &&!pl.isTing && !MjClient.clickTing && MjClient.rePlayVideo == -1 && COMMON_UI.isChaPai &&!pl.trust &&  MjClient.gameType != MjClient.GAME_TYPE.JIN_ZHONG_LI_SI)
        {
            //if(MjClient.getAppType() != MjClient.APP_TYPE.TXJINZHONGMJ)
            //{
            //    COMMON_UI.afterMjputAnimation();
            //}
        }
        else
        {
            if (!(outNum >= 0))
            {
                MjClient.playui.CardLayoutRestore(node, off);
            }

            //add by sking
            if(off == 0 && getUIPlayer(0).mjhand)
            {
                MjClient.playui.CardLayoutRestore(node, off);
            }
        }

        if (off != 0)
        {
            showMJOutBig(node, msg.card, off);
        }
    }
}
PlayLayer_hejinkunjin.prototype.changeHuaImg = function(node,off)
{
    var _HuaImg = node;
    var tData = MjClient.data.sData.tData;
    var pl = getUIPlayer(off);
    if (!pl) return;
    if (!_HuaImg) return;
    {

        if (pl.jinMjPut && pl.jinMjPut.length > 0) 
        {
            var path = "playing/gameTable/jin"+ pl.jinMjPut.length + ".png";+
            _HuaImg.loadTexture(path);
            _HuaImg.visible = true;
        }

    }
}