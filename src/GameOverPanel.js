// 设置圆形裁剪头像 (由于图片资源不统一，目前只用于岳阳app)
function CircularCuttingHeadImg(node, pl) {
    var head = node;
    var url = pl.info.headimgurl;
    if (!url) url = "png/default_headpic.png";
    cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, texture) {
        if (!err && texture && cc.sys.isObjectValid(head)) {
            var clippingNode = new cc.ClippingNode();
            var mask = new cc.Sprite("Red20/DeskTexture/player_blue_bg.png");
            mask.width -= 15;
            mask.height -= 15;
            clippingNode.setAlphaThreshold(0);
            clippingNode.setStencil(mask);
            var img = new cc.Sprite(texture);
            img.setScale(mask.getContentSize().width / img.getContentSize().width);
            clippingNode.addChild(img);
            clippingNode.setPosition(head.getContentSize().width / 2, head.getContentSize().height / 2);
            //遮罩框
            // var hideblock = new cc.Sprite("Red20/DeskTexture/player_blue_bg.png");
            // hideblock.setPosition(head.getContentSize().width / 2, head.getContentSize().height / 2);
            head.addChild(clippingNode);
            // head.addChild(hideblock);
        }
    });
}

// 添加复制按钮功能
function addCopyBtnToGameOverLayer(node) {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    // 七星江苏麻将 显示复制按钮
    if (tData.matchId) {
        cc.log('warn btnCopy is not show in apptype:', MjClient.getAppType());
        return;
    }

    var _back = node.getChildByName("back");
    var _btnCopy = _back.getChildByName("btnCopy");

    if (!cc.sys.isObjectValid(_btnCopy)) {
        cc.log('error btnCopy is not found');
        return;
    }
    _btnCopy.visible = true;
    var clubInfoTable = getClubInfoInTable();
    var copytext = "\n";
    // 亲友圈玩法名称
    if (clubInfoTable && clubInfoTable.ruleName) {
        var ruleName = unescape(clubInfoTable.ruleName);
        copytext += ruleName + "\n";
    }

    // 房间id
    var strTableid = '【' + tData.tableid + '】 ';
    // 玩法名称
    var strRoomName = GameCnName[MjClient.gameType] + ' ';
    // 局数
    var roundNumPre = tData.roundNumPre || tData.roundNum;
    var factRoundNum = tData.roundAll - roundNumPre + 1;
    factRoundNum = factRoundNum > tData.roundAll ? tData.roundAll : factRoundNum;
    var strRoundNum = tData.roundAll < 50 ? factRoundNum + "/" + tData.roundAll + "局" : "";
    copytext += strTableid + strRoomName + strRoundNum + '\n';
    // 日期
    var strDate = MjClient.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
    copytext += strDate + '\n';

    copytext += "=====  战绩  ===== \n"

    var sData = MjClient.data.sData;
    var MaxWinAll = 0;
    //计算所有人数据
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            MaxWinAll = MaxWinAll > pi.winall ? MaxWinAll : pi.winall;
        }
    }
    // cc.log(" ====== MjClient.data.sData  ",JSON.stringify(MjClient.data.sData));
    for (var i in sData.players) {
        var pl_data = MjClient.data.sData.players[i];
        var name = getNewName(unescape(pl_data.info.nickname));
        copytext += "【" + name + "】";

        if (MaxWinAll != 0 && MaxWinAll == pl_data.winall) copytext += ' 大赢家';

        copytext += '\n';
        if (sData.tData.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN) {
            if (pl_data.roomStatistics) {
                copytext += '战绩: +' + pl_data.roomStatistics[5];
            }

        } else {
            if (pl_data.winall > 0) {
                copytext += '战绩: +' + pl_data.winall;
            } else if (pl_data.winall < 0) {
                copytext += '战绩: ' + pl_data.winall;
            } else {
                copytext += '战绩: ' + pl_data.winall;
            }
        }

        copytext += '\n';
    }

    var isAddURL = false;
    _btnCopy.addTouchEventListener(function (sender, Type) {
        switch (Type) {
            case ccui.Widget.TOUCH_ENDED:
                if (!isAddURL && (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP
                    || MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ
                    || MjClient.getAppType() == MjClient.APP_TYPE.HUBEIMJ
                    || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG
                    || MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ
                    || MjClient.getAppType() == MjClient.APP_TYPE.TXJINZHONGMJ
                    || MjClient.getAppType() == MjClient.APP_TYPE.DQSHANXIMJ
                )) {
                    MjClient.block();
                    MjClient.gamenet.request("pkplayer.handler.openBrowser", { type: 10, creator: tData.owner, roomNum: tData.tableid, time: sData.serverTime }, function (rtn) {
                        MjClient.unblock();
                        if (rtn.code == 0 && rtn.data)
                            copytext += "\n" + rtn.data + "\n";
                        isAddURL = true;
                        cc.log(copytext)
                        MjClient.showToast('战绩已复制到粘贴板,快去分享吧');
                        MjClient.native.doCopyToPasteBoard(copytext);
                        MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Zhanjifuzhi", { uid: SelfUid(), gameType: MjClient.gameType });
                    });
                }
                else {
                    cc.log(copytext)
                    MjClient.showToast('战绩已复制到粘贴板,快去分享吧');
                    MjClient.native.doCopyToPasteBoard(copytext);
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dajiesuanjiemian_Fuzhizhanji", { uid: SelfUid(), gameType: MjClient.gameType });
                }
                break;
            default:
                break;
        }
    }, this);
}

//俱乐部房卡模式 添加房卡
function AddFangKaIcon(sData, node, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, pos, para) {

    //无效房间 或者 非房卡模式
    if (!tData.isValidTable || !tData.fangkaSource || MaxWinAll == 0) {
        return;
    }

    //旺旺 暂时屏蔽
    if (MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG) {
        return;
    }


    //外面 传进来的字段 不一定是对的 再次进行校准
    var MaxWinAll = 0;
    var MaxlosePlayer = null;
    var MaxWinPlayer = null;
    var MaxloseAll = 999999999;

    var key = "winall";
    if (MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI || MjClient.gameType == MjClient.GAME_TYPE.DA_ZI_BO_PI) {
        key = "winScore";
    } else if (MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA || MjClient.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI ||
        MjClient.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA) {
        key = "fenshu";
    } else if (MjClient.gameType == MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG || MjClient.gameType == MjClient.GAME_TYPE.LONG_HUI_BA_ZHA_DAN) {
        key = "windif";
    } else if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN)
        key = "roomStatistics"
    var _pl_winall = pl[key];
    if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN)
        _pl_winall = pl[key][5];
    cc.log("====== key", key, _pl_winall);

    //计算所有人数据
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN) {
            if (pi) {
                if (MaxWinAll < pi.roomStatistics[5]) {
                    MaxWinAll = pi.roomStatistics[5];
                    MaxWinPlayer = uid;

                } else if (MaxWinAll == pi.roomStatistics[5]) {
                    if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                        MaxWinAll = pi.roomStatistics[5];
                        MaxWinPlayer = uid;
                    }
                }
                if (pi.roomStatistics[5] < MaxloseAll) {
                    MaxloseAll = pi.roomStatistics[5];
                    MaxlosePlayer = uid;
                } else if (pi.roomStatistics[5] == MaxloseAll) {
                    if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                        MaxloseAll = pi.roomStatistics[5];
                        MaxlosePlayer = uid;
                    }
                }
            }
        } else {
            if (pi) {
                if (MaxWinAll < pi[key]) {
                    MaxWinAll = pi[key];
                    MaxWinPlayer = uid;

                } else if (MaxWinAll == pi[key]) {
                    if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                        MaxWinAll = pi[key];
                        MaxWinPlayer = uid;
                    }
                }
                if (pi[key] < MaxloseAll) {
                    MaxloseAll = pi[key];
                    MaxlosePlayer = uid;
                } else if (pi[key] == MaxloseAll) {
                    if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                        MaxloseAll = pi[key];
                        MaxlosePlayer = uid;
                    }
                }
            }
        }

    }


    var sameScorePl = function (score) {
        var plCount = 0;
        for (var uid in sData.players) {
            var pi = sData.players[uid];
            if (pi) {
                var key = "winall";
                if (MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_BO_PI || MjClient.gameType == MjClient.GAME_TYPE.DA_ZI_BO_PI) {
                    key = "winScore";
                } else if (MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA || MjClient.gameType == MjClient.GAME_TYPE.XIANG_XIANG_GAO_HU_ZI ||
                    MjClient.gameType == MjClient.GAME_TYPE.LOU_DI_FANG_PAO_FA) {
                    key = "fenshu";
                } else if (MjClient.gameType == MjClient.GAME_TYPE.DA_TONG_ZI_SHAO_YANG || MjClient.gameType == MjClient.GAME_TYPE.LONG_HUI_BA_ZHA_DAN) {
                    key = "windif";
                } else if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN)
                    key = "roomStatistics"
                if (MjClient.gameType == MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN) {
                    if (score == pi[key][5])
                        plCount++;
                } else {
                    if (score == pi[key]) {
                        plCount++;
                    }
                }

            }
        }
        return plCount;
    };

    var add_func = function (node, fangkaCount, pos) {
        var _fagnkaIcon = new ccui.ImageView("gameOver/icon_fangka.png");
        _fagnkaIcon.setPosition(pos);
        var _numberLabel = new ccui.Text();
        _numberLabel.setFontSize(26);
        _numberLabel.setString(fangkaCount);
        _numberLabel.setColor(cc.color(0xb6, 0x49, 0x08));
        _numberLabel.setPosition(cc.p(21, 67));
        _fagnkaIcon.addChild(_numberLabel);
        if (para && para.rotate) {
            _fagnkaIcon.setRotation(para.rotate);
        }
        if (para && para.scale) {
            _fagnkaIcon.setScale(para.scale);
        }
        node.addChild(_fagnkaIcon);
    };
    cc.log("======= data pl", MjClient.gameType == MjClient.GAME_TYPE.SHAO_YANG_FANG_PAO_FA, JSON.stringify(pl));

    cc.log(" ==tData.fangkaCount, tData.fangkaSource,MaxWinAll,tData.fangkaFree, MaxloseAll,tData.fangkaExtra ", tData.fangkaCount, tData.fangkaSource, MaxWinAll, tData.fangkaFree, MaxloseAll, tData.fangkaExtra)
    if (tData.fangkaCount && tData.fangkaSource == 1 && MaxWinAll >= tData.fangkaFree && MaxWinAll != 0) {
        if (tData.fangkaExtra === 0 && pl.info.uid == MaxWinPlayer) {
            add_func(node, tData.fangkaCount, pos);
        } else if (tData.fangkaExtra && _pl_winall == MaxWinAll) {
            var plCount = sameScorePl(MaxWinAll);
            var fangkaCount = Math.ceil(tData.fangkaCount / plCount);
            add_func(node, fangkaCount, pos);
        }
    } else if (tData.fangkaCount && tData.fangkaSource == 2 && MaxWinAll >= tData.fangkaFree && MaxWinAll != 0) {
        if (tData.fangkaExtra === 0 && pl.info.uid == MaxlosePlayer) {
            add_func(node, tData.fangkaCount, pos);
        } else if (tData.fangkaExtra && _pl_winall == MaxloseAll) {
            add_func(node, tData.fangkaCount, pos);
            var plCount = sameScorePl(MaxloseAll);
            var fangkaCount = Math.ceil(tData.fangkaCount / plCount);
            add_func(node, fangkaCount, pos);
        }
    } else if (tData.fangkaCount && tData.fangkaSource == 3 && MaxWinAll >= tData.fangkaFree && MaxWinAll != 0) {
        //AA付 暂时不显示
        // if (tData.fangkaExtra === 0) {
        //     add_func(node, tData.fangkaCount, pos);
        // }else if(pl.info.uid == MaxWinPlayer && tData.fangkaExtra){
        //     add_func(node, tData.fangkaCount + tData.fangkaExtra, pos);
        // }
    }
}

//设置单个玩家的详细信息
function SetGameOverLayer(node, off) {
    if (!node) return;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) {
        return;
    }
    node.setVisible(true);
    var MaxWinAll = 0;
    var MaxDianPao = 0;
    var bPaoWang = false;
    var MaxlosePlayer = null;
    var MaxWinPlayer = null;
    var MaxloseAll = 999999999;

    //计算所有人数据
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            if (MaxWinAll < pi.winall) {
                MaxWinAll = pi.winall;
                MaxWinPlayer = uid;

            } else if (MaxWinAll == pi.winall) {
                if (parseInt(uid) < parseInt(MaxWinPlayer)) {
                    MaxWinAll = pi.winall;
                    MaxWinPlayer = uid;
                }
            }
            if (pi.winall < MaxloseAll) {
                MaxloseAll = pi.winall;
                MaxlosePlayer = uid;
            } else if (pi.winall == MaxloseAll) {
                if (parseInt(uid) < parseInt(MaxlosePlayer)) {
                    MaxloseAll = pi.winall;
                    MaxlosePlayer = uid;
                }
            }
        }
    }

    //最大点炮数
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            MaxDianPao = MaxDianPao > pi.dianpaoTotal ? MaxDianPao : pi.dianpaoTotal;
        }
    }

    //计算炮王
    var _paowangArray = [];
    var _paoScore = 9999;
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            if (MaxDianPao == pi.dianpaoTotal) {
                if (pi.winall <= _paoScore) {
                    _paoScore = pi.winall;
                    //_paowangArray.push(pi.info.uid);
                }
            }
        }
    }

    //存点炮王的数组
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            if (MaxDianPao == pi.dianpaoTotal) {
                if (pi.winall <= _paoScore) {
                    _paowangArray.push(pi.info.uid);
                }
            }
        }
    }

    cc.log("===================_paowangArray =11111 " + JSON.stringify(_paowangArray));

    //是否是炮王
    if (_paowangArray.indexOf(pl.info.uid) >= 0) {
        bPaoWang = true;
    }

    //根据输赢设置文字颜色
    function setTextColor(textNode) {

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ
            || isJinZhongAPPType()
            || MjClient.getAppType() == MjClient.APP_TYPE.TXLVLIANGMJ
            || MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ
        ) {
            if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
            {
                textNode.setColor(cc.color(221, 78, 0));
            }
            else if (pl.winall < 0)//输家
            {
                textNode.setColor(cc.color(104, 104, 104));
            }
        }
        else if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            if (pl.winall < 0) { //输家
                textNode.setColor(cc.color(37, 69, 89));
            }
            else {
                textNode.setColor(cc.color(88, 45, 45));
            }
        }
        else if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ) {
            if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
            {
                textNode.setColor(cc.color(82, 40, 126));
            }
            else if (pl.winall < 0)//输家
            {
                textNode.setColor(cc.color(37, 83, 118));
                //textNode.setColor(cc.color(255,0,0));
            }
        }
    }
    //根据输赢设置背景底板颜色
    function setPlayerBg() {
        var _bgNode = node.getChildByName("bg");
        var _name = node.getChildByName("name");
        var _id = node.getChildByName("id");
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ
            || isJinZhongAPPType()
            || MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP
            || MjClient.getAppType() == MjClient.APP_TYPE.TXLVLIANGMJ
            || MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP
            || MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ) {

            if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
            {
                _bgNode.loadTexture("gameOver/gerenxinxi_2.png");
                _name.setColor(cc.color(221, 78, 0));
                _id.setColor(cc.color(221, 78, 0));
            }
            else if (pl.winall < 0)//输家
            {
                _bgNode.loadTexture("gameOver/gerenxinxi_3.png");

                var _textIcon1 = node.getChildByName("winNode").getChildByName("allscore");
                var _textIcon2 = node.getChildByName("lastNode").getChildByName("allscore");
                var _textIcon3 = node.getChildByName("normalNode").getChildByName("allscore");
                if (MjClient.getAppType() != MjClient.APP_TYPE.QXHAIANMJ) {
                    _textIcon1.loadTexture("gameOver/zongchengji_1.png");
                    _textIcon2.loadTexture("gameOver/zongchengji_1.png");
                    _textIcon3.loadTexture("gameOver/zongchengji_1.png");
                    _name.setColor(cc.color(104, 104, 104));
                    _id.setColor(cc.color(104, 104, 104));
                }
            }
        }
        else if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXXZMJ ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXHAMJ) {
            var _maxPlayer = parseInt(MjClient.data.sData.tData.maxPlayer);

            if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
            {
                _bgNode.loadTexture("gameOver/gerenxinxi_2.png");
                if (_maxPlayer == 2) {
                    _bgNode.loadTexture("gameOver/gerenxinxi2_2.png");
                }
            }
            else if (pl.winall < 0)//输家
            {
                _bgNode.loadTexture("gameOver/gerenxinxi_3.png");
                if (_maxPlayer == 2) {
                    _bgNode.loadTexture("gameOver/gerenxinxi2_3.png");
                }
            }
        }

        // if(MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ) { //江苏麻将 总成绩不要显示
        //     var _textIcon1 = node.getChildByName("winNode").getChildByName("allscore");
        //     var _textIcon2 = node.getChildByName("lastNode").getChildByName("allscore");
        //     var _textIcon3 = node.getChildByName("normalNode").getChildByName("allscore");
        //     _textIcon1.visible = false;
        //     _textIcon2.visible = false;
        //     _textIcon3.visible = false;
        // }
    }


    var uibind = {
        dayingjia_light: {
            _visible: false,
            _run: function () {
                if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
                {
                    this.visible = true;
                }
            },
        },
        name: {
            _run: function () {
                this.setFontName("Arial");
                this.setFontSize(this.getFontSize());
                this.ignoreContentAdaptWithSize(true);
                if (MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP) {
                    if (pl.winall < 0) { //输家
                        this.setColor(cc.color(37, 69, 89));
                    }
                    else {
                        this.setColor(cc.color(88, 45, 45));
                    }
                }
            },
            _text: function () {
                return getNewName(unescape(pl.info.nickname) + "");
            }
        },
        id: {
            _run: function () {
                this.ignoreContentAdaptWithSize(true);
                if (MjClient.getAppType() === MjClient.APP_TYPE.QXYZQP) {
                    if (pl.winall < 0) { //输家
                        this.setColor(cc.color(37, 69, 89));
                    }
                    else {
                        this.setColor(cc.color(88, 45, 45));
                    }
                }
            },
            _text: function () {
                return "ID:" + pl.info.uid.toString();
            }
        },

        bg: {
            _run: function () {
                if (isYongZhouProject()) {
                    setDismissTypeImg(pl, this, 0.73, 0.72, "chang");
                }
            }
        },
        winNode: {
            winNum: {
            },
            bigWinner: {
                _visible: false
            }
        },
        lastNode: {
            winNum1: {},
            winNum2: {},
        },
        normalNode: {
            winNum1: {},
            winNum2: {},
        },
        statistc: {
            item0: {
                _run: function () {
                    setTextColor(this);
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[0] == 'string') return pl.roomStatisticsDesc[0] + pl.roomStatistics[0];

                    return "自摸次数    " + (pl.zimoTotal > 0 ? pl.zimoTotal + "" : "0");
                }
            },

            item1: {
                _run: function () {
                    setTextColor(this);
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[1] == 'string') return pl.roomStatisticsDesc[1] + pl.roomStatistics[1];
                    return "点炮次数    " + (pl.dianpaoTotal > 0 ? pl.dianpaoTotal + "" : "0");
                }
            },
            item2: {
                _run: function () {
                    setTextColor(this);
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[2] == 'string') return pl.roomStatisticsDesc[2] + pl.roomStatistics[2];
                    if (MjClient.gameType === MjClient.GAME_TYPE.TONG_HUA ||
                        MjClient.getAppType() === MjClient.APP_TYPE.QXJSMJ)
                        return "接炮次数    " + (pl.jiepaoTotal > 0 ? pl.jiepaoTotal + "" : "0");
                    else
                        return "暗杠次数    " + (pl.angangTotal > 0 ? pl.angangTotal + "" : "0");
                }
            },
            item3: {
                _run: function () {
                    setTextColor(this);
                    this.ignoreContentAdaptWithSize(true);
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[3] == 'string') return pl.roomStatisticsDesc[3] + pl.roomStatistics[3];
                    if (MjClient.gameType == MjClient.GAME_TYPE.TONG_HUA)
                        return "暗蛋次数    " + (pl.angangTotal > 0 ? pl.angangTotal + "" : "0");
                    else if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ)
                        return "暗杠次数    " + (pl.angangTotal > 0 ? pl.angangTotal + "" : "0");
                    else
                        return "明杠次数    " + (pl.minggangTotal > 0 ? pl.minggangTotal + "" : "0");
                }
            },
            item4: {
                _run: function () {
                    setTextColor(this);
                    this.ignoreContentAdaptWithSize(true);
                    if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ) {
                        this.visible = true;
                    }
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[4] == 'string') return pl.roomStatisticsDesc[4] + pl.roomStatistics[4];

                    if (MjClient.gameType == MjClient.GAME_TYPE.TONG_HUA)
                        return "明蛋次数    " + (pl.minggangTotal > 0 ? pl.minggangTotal + "" : "0");
                    else if (MjClient.gameType == MjClient.GAME_TYPE.TY_ZHUANZHUAN)
                        return "接炮次数    " + (pl.jiepaoTotal > 0 ? pl.jiepaoTotal + "" : "0");
                    else if (MjClient.getAppType() == MjClient.APP_TYPE.QXJSMJ) {
                        return "明杠次数    " + (pl.minggangTotal > 0 ? pl.minggangTotal + "" : "0");
                    } else
                        return "";
                }
            },
            item5: {
                _run: function () {
                    this.ignoreContentAdaptWithSize(true);
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[5] == 'string') this.visible = true
                },
                _text: function () {
                    if (pl.roomStatisticsDesc && typeof pl.roomStatisticsDesc[5] == 'string') return pl.roomStatisticsDesc[5] + pl.roomStatistics[5];

                    //return "旋风杠次数：" +  (pl.xuanfenggangTotal  > 0? pl.xuanfenggangTotal +"":"0" );
                    return "";
                }
            },
        },
    }

    // if(MjClient.getAppType() ==  MjClient.APP_TYPE.QXJSMJ ||
    //     MjClient.getAppType() ==  MjClient.APP_TYPE.QXYYQP ||
    //     MjClient.getAppType() ==  MjClient.APP_TYPE.QXNTQP ||
    //     MjClient.getAppType() ==  MjClient.APP_TYPE.QXHAIANMJ)
    // {
    //     setUserOfflineWinGamePanel(node,pl);
    // }

    setUserOfflineWinGamePanel(node, pl);

    var wxNode = node.getChildByName("head");
    addWxHeadToEndUI(wxNode, off);
    BindUiAndLogic(node, uibind);

    var nodeParent = node.getParent();
    var _share = nodeParent.getChildByName("share");
    var _shine = _share.getChildByName("img_shine");
    var _point = _share.getChildByName("img_point");
    var _txt = _share.getChildByName("img_txt");


    setPlayerBg();

    var _fangkaNode;
    //最高得分
    if (MaxWinAll != 0 && MaxWinAll == pl.winall) {
        uibind.normalNode._node.visible = false;
        uibind.lastNode._node.visible = false;
        uibind.winNode._node.visible = true;
        uibind.winNode.bigWinner._node.visible = true;
        uibind.winNode.winNum._node.setString(pl.winall + "");
        uibind.winNode.winNum._node.ignoreContentAdaptWithSize(true);
        var act_Func = function () {
            var a = cc.scaleTo(0.5, 1.0);
            var aa = cc.fadeIn(0.5);
            var a1 = cc.scaleTo(1.0, 4);
            var a2 = cc.fadeOut(1.0);
            var act_2 = cc.rotateBy(0.8, 30);
            var act_3 = cc.rotateBy(0.8, -30);
            var a3 = cc.callFunc(function () {
                _shine.setScale(1);
            }.bind(_shine));
            _shine.runAction(cc.sequence(cc.spawn(a, aa), cc.spawn(a1, a2), a3, cc.delayTime(0.1)).repeatForever());
            _point.runAction(cc.sequence(act_2, act_3).repeatForever());

        }
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && pl.info.uid == SelfUid() && MjClient.getAppType() != MjClient.APP_TYPE.QXYYQP && MjClient.getAppType() != MjClient.APP_TYPE.HUBEIMJ && MjClient.getAppType() == MjClient.APP_TYPE.YLHUNANMJ) {
            _shine.setVisible(true);
            _point.setVisible(true);
            _txt.setVisible(true);
            act_Func();
        }
        _fangkaNode = uibind.winNode._node;
    }//点炮最多
    else if (MaxDianPao != 0 && bPaoWang) {
        uibind.winNode._node.visible = false;
        uibind.normalNode._node.visible = false;
        uibind.lastNode._node.visible = true;
        _fangkaNode = uibind.lastNode._node;
        if (pl.winall >= 0) {
            uibind.lastNode.winNum1._node.visible = true;
            uibind.lastNode.winNum2._node.visible = false;
            uibind.lastNode.winNum1._node.setString(pl.winall + "");
            uibind.lastNode.winNum1._node.ignoreContentAdaptWithSize(true);
        }
        else {
            uibind.lastNode.winNum1._node.visible = false;
            uibind.lastNode.winNum2._node.visible = true;
            uibind.lastNode.winNum2._node.setString(Math.abs(pl.winall) + "");
            uibind.lastNode.winNum2._node.ignoreContentAdaptWithSize(true);
        }
    }
    else {
        uibind.winNode._node.visible = false;
        uibind.lastNode._node.visible = false;
        uibind.normalNode._node.visible = true;
        _fangkaNode = uibind.normalNode._node;
        if (pl.winall >= 0) {
            uibind.normalNode.winNum2._node.visible = false;
            uibind.normalNode.winNum1._node.visible = true;
            uibind.normalNode.winNum1._node.setString(pl.winall + "");
            uibind.normalNode.winNum1._node.ignoreContentAdaptWithSize(true);

        }
        else {
            uibind.normalNode.winNum1._node.visible = false;
            uibind.normalNode.winNum2._node.visible = true;
            uibind.normalNode.winNum2._node.setString(Math.abs(pl.winall) + "");
            uibind.normalNode.winNum2._node.ignoreContentAdaptWithSize(true);
        }
    }
    AddFangKaIcon(sData, _fangkaNode, tData, pl, MaxWinAll, MaxWinPlayer, MaxloseAll, MaxlosePlayer, cc.p(-115, 385));

    node.getChildByName("fangzhu").visible = tData.owner == pl.info.uid;

    var maxPlayer = parseInt(MjClient.data.sData.tData.maxPlayer);
    var head2 = node.getParent().getChildByName("head2");
    var head3 = node.getParent().getChildByName("head3");
    cc.log("=============game over off idx jjjjj =  " + off);

    if (MjClient.getAppType() != MjClient.APP_TYPE.QXJSMJ &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXXZMJ &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXNTQP &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXHAIANMJ &&
        MjClient.getAppType() != MjClient.APP_TYPE.QXHAMJ) //七星江苏，徐州新UI
    {
        if (head2 && head3) {
            var size = (head3.x - head2.x) * (4 - maxPlayer) / (maxPlayer + 1);
            node.x += size * (off + 1);
        }
    }

    if (pl.isNeedFanBei || tData.isFanBei) {
        var yoff = 15;
        uibind.winNode.winNum._node.y += yoff;

        if (MjClient.getAppType() === MjClient.APP_TYPE.QXXXGHZ) {
            uibind.lastNode.winNum1._node.y += yoff;
            uibind.lastNode.winNum2._node.y += yoff;
        } else {
            uibind.lastNode._node.y += yoff;
        }

        // node.getChildByName("line_hua_0").y += yoff;
        uibind.normalNode.winNum1._node.y += yoff;
        uibind.normalNode.winNum2._node.y += yoff;

        var fanbeiFormula = node.getChildByName("fanbeiFormula");
        fanbeiFormula.setVisible(true);
        fanbeiFormula.setString("(" + Math.floor(pl.winall / 2 * 10) / 10 + "x2)");
        fanbeiFormula.ignoreContentAdaptWithSize(true);
        var bWin = (MaxWinAll != 0 && MaxWinAll == pl.winall);
        fanbeiFormula.setTextColor(bWin ? cc.color(0xff, 0xf5, 0x84) : cc.color(0xb0, 0xed, 0xff));


        // 如皋二人长牌UI显示特殊  fanBeiId 0 bu不翻倍  1 翻2倍  2 翻3倍
        if (MjClient.gameType === MjClient.GAME_TYPE.RU_GAO_ER) {
            var fanBeiId = tData.areaSelectMode.fanBei;
            var beishu = fanBeiId == 1 ? 2 : 3;
            fanbeiFormula.ignoreContentAdaptWithSize(true);
            fanbeiFormula.setString("(" + Math.floor(pl.winall / beishu * 10) / 10 + "x" + beishu + ")");
            fanbeiFormula.setTextColor(bWin ? cc.color("#ff0000") : cc.color("#0066cc"));
            fanbeiFormula.x -= cc.winSize.width * 0.20;
            fanbeiFormula.y += cc.winSize.height * 0.07;
        }
    }
}

//分享大结算信息
function ShareGameOverInfo() {
    MjClient.block();
    var fileName = "wxcapture_screen.jpg"
    var ui = ccs.load(res.EndAllShare_json);
    var node = ui.node;
    MjClient.Scene.addChild(node)
    node.setZOrder(-10);
    var bg = node.getChildByName('bg');
    // bg.setScale(0.75);
    bg.setAnchorPoint(0, 0);
    bg.x = 0;
    bg.y = 0;

    var itemWin = bg.getChildByName('item_win');
    var itemLose = bg.getChildByName('item_lose');
    itemWin.visible = false;
    itemLose.visible = false;

    var temp = JSON.parse(JSON.stringify(MjClient.data.sData.players));
    var shareData = []
    for (var i in temp) {
        shareData[i] = temp[i];
    }

    shareData.sort(function (a, b) {
        return b.winall - a.winall;
    })

    //计算所有人数据
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var MaxWinAll = 0;
    for (var uid in sData.players) {
        var pi = sData.players[uid];
        if (pi) {
            MaxWinAll = MaxWinAll > pi.winall ? MaxWinAll : pi.winall;
        }
    }

    var offY = 0;
    for (var i in shareData) {
        var pl = shareData[i];
        var item = null;
        var off = MjClient.data.sData.tData.uids.indexOf(pl.info.uid);

        // 排名
        var num = parseInt(i) + 1;
        if (pl.winall > 0) {
            item = itemWin.clone();
        } else {
            item = itemLose.clone();
        }
        if (pl.winall > 0 && i == 0) {
            var itemnum = item.getChildByName('item_num').visible = false;
        } else {
            if (pl.winall > 0) {
                item.getChildByName('item_num_1').visible = false;
            }
            var itemnum = item.getChildByName('item_num')
            itemnum.setString(num);
        }

        if (MaxWinAll != 0 && MaxWinAll == pl.winall)//大赢家
        {
            item.getChildByName("item_bg").loadTexture("gameOver/dayingjia_di.png");
        }


        // 头像
        var head = item.getChildByName("head");
        addWxHeadToEndUI(head, off);

        // uid
        var textid = item.getChildByName('player_id')
        textid.ignoreContentAdaptWithSize(true);
        textid.setString('ID:' + pl.info.uid);
        // 山西，大结算微信分享图，ID中间三位用“*”表示
        if (isJinZhongAPPType()) {
            var id = pl.info.uid + "" || "1000000";
            var mid = id.substring(0, 2) + "***" + id.substring(5);
            textid.setString('ID:' + mid);
        }


        // 名称
        var textname = item.getChildByName('player_name')
        textname.ignoreContentAdaptWithSize(true);
        textname.setString(getNewName(unescape(pl.info.nickname)));
        textname.setFontName("Arial");
        textname.setFontSize(textname.getFontSize());

        //自摸
        var Text_zimo = item.getChildByName("Text_zimo");
        Text_zimo.ignoreContentAdaptWithSize(true);

        //点炮
        var Text_dianpao = item.getChildByName("Text_dianpao");
        Text_dianpao.ignoreContentAdaptWithSize(true);

        //暗杠
        var Text_angang = item.getChildByName("Text_angang");
        Text_angang.ignoreContentAdaptWithSize(true);

        //明杠
        var Text_minggang = item.getChildByName("Text_minggang");
        Text_minggang.ignoreContentAdaptWithSize(true);


        if (isJinZhongAPPType()
            || MjClient.getAppType() == MjClient.APP_TYPE.TXLINFENMJ) {
            //输赢统计
            var winCount = 0;
            var winScore = 0;
            var loseCount = 0;
            var loseScore = 0;
            var pingCount = 0;
            var leftCount = tData.roundNumPre;//tData.roundAll - (tData.roundAll - tData.roundNumPre + 1);
            if (cc.isUndefined(tData.roundNumPre)) {
                leftCount = tData.roundNum;
            }
            else {
                if (tData.roundNum <= 0 && cc.isUndefined(tData.roundNumPre)) {
                    leftCount = 0;
                }
            }
            if (leftCount <= 0) leftCount = 0;
            var tableMsg = pl.roomStatistics;
            if (!tableMsg) {
                tableMsg = [0, 0, 0, 0, 0];
            }
            for (var i = 0; i < tableMsg.length; i++) {
                if (tableMsg[i] > 0) {
                    winCount++;
                    winScore += tableMsg[i];
                }
                else if (tableMsg[i] < 0) {
                    loseCount++;
                    loseScore += tableMsg[i];
                }
                else if (tableMsg[i] == 0) {
                    pingCount++;
                }
            }

            Text_zimo.setString("赢" + winCount + "局:" + revise(winScore));
            Text_dianpao.setString("输" + loseCount + "局:" + revise(loseScore));
            Text_angang.setString("平" + pingCount + "局:" + 0);
            Text_minggang.setString("未完成" + leftCount + "局:" + 0);

            if (MjClient.gameType == MjClient.GAME_TYPE.DA_TONG_ZHA_GU_ZI) {
                pl = MjClient.getPlayerByIndex(off);
                Text_zimo.setString("赢" + pl.roomStatistics[0] + "局");
                Text_dianpao.setString("输" + pl.roomStatistics[1] + "局");
                Text_angang.setString("平" + pl.roomStatistics[2] + "局");
                var finishNum = pl.roomStatistics[0] + pl.roomStatistics[1] + pl.roomStatistics[2];
                var unfinishedNum = tData.roundAll - finishNum;
                Text_minggang.setString("未完成" + unfinishedNum + "局");
            }
        }
        else {
            Text_zimo.setString("自摸次数：" + (pl.zimoTotal > 0 ? pl.zimoTotal + "" : "0"));
            Text_dianpao.setString("点炮次数：" + (pl.dianpaoTotal > 0 ? pl.dianpaoTotal + "" : "0"));
            Text_angang.setString("暗杠次数：" + (pl.angangTotal > 0 ? pl.angangTotal + "" : "0"));
            Text_minggang.setString("明杠次数：" + (pl.minggangTotal > 0 ? pl.minggangTotal + "" : "0"));
        }


        // 得分
        var score = item.getChildByName('score')
        var strScore = pl.winall;// .是减号  /是加号
        if (strScore < 0) {
            strScore *= -1;
            strScore = '-' + revise(strScore);
        } else if (strScore > 0) {
            strScore = '+' + revise(strScore);
        }
        score.setString(strScore);
        score.setSize(score.getVirtualRendererSize())   // score的size 没 刷新成 label的size 有毒

        item.visible = true;
        item.y -= offY;
        offY += 123;
        bg.addChild(item);
    }

    var sData = MjClient.data.sData;
    var tData = sData.tData;

    var room_name = bg.getChildByName('room_name')
    room_name.setString('玩法:' + GameCnName[MjClient.gameType]);
    room_name.ignoreContentAdaptWithSize(true);

    var room_id = bg.getChildByName('room_id')
    var text_id = '房号:' + tData.tableid;
    text_id += ' 局数:' + tData.roundAll;
    room_id.setString(text_id);
    room_id.ignoreContentAdaptWithSize(true);

    var room_score = bg.getChildByName('room_score')
    if (tData.areaSelectMode.difen && tData.areaSelectMode.difen > 0) {
        var text_score = '底分:';
        text_score += tData.areaSelectMode.difen;
        room_score.setString(text_score)
        room_score.ignoreContentAdaptWithSize(true);
    } else {
        room_score.visible = false;
    }

    var room_pay = bg.getChildByName('room_pay')
    var index_pay = tData.areaSelectMode.payWay
    var text_pay = getGameCnDesc(MjClient.gameType, 'payWay', index_pay, tData.areaSelectMode)
    room_pay.setString('资费:' + text_pay)
    room_pay.ignoreContentAdaptWithSize(true);

    var room_master = bg.getChildByName('room_master')
    var masterpl = sData.players[tData.owner];

    var clubInfoTable = getClubInfoInTable();
    //需求：海安、晋中、南通 对于俱乐部牌局，在大结算、大结算分享图中，增加显示，亲友圈ID，并显示对应的玩法名称【是会长建立玩法时设定的玩法名称】
    if (clubInfoTable && (MjClient.getAppType() == MjClient.APP_TYPE.QXHAIANMJ ||
        isJinZhongAPPType() ||
        MjClient.getAppType() == MjClient.APP_TYPE.QXNTQP)) {
        room_master.setString('亲友圈ID:' + clubInfoTable.clubId + "（" + unescape(clubInfoTable.ruleName) + "）");
        room_master.ignoreContentAdaptWithSize(true);
    }
    else {
        if (masterpl) {
            var mastername = masterpl.info.nickname;
            mastername = getNewName(unescape(mastername))
            room_master.setString('房主:' + mastername);
            room_master.ignoreContentAdaptWithSize(true);
        } else {
            room_master.visible = false;
        }
    }



    var room_time = bg.getChildByName("room_time");
    room_time.ignoreContentAdaptWithSize(true);
    if (MjClient.roundEndTime) {
        if (!MjClient.isDismiss && sData.tData.roundNum <= 0) {
            room_time.setString(MjClient.roundEndTime + " 结束");
        } else {
            room_time.setString(MjClient.roundEndTime + " 解散");
        }
    } else {
        room_time.visible = false;
    }


    // 保存成图片
    MjClient.saveNodeToImage(bg, fileName, function (pnode, savepath) {
        if (cc.sys.isObjectValid(node)) {
            node.removeFromParent();
        }
        // 分享图片到微信
        MjClient.shareImageToMultiPlatform(savepath);

        MjClient.unblock();
    });

}

//  麻将大结算
var GameOverLayer = cc.Layer.extend({
    _BigWinnerScore: null,
    jsBind: {
        back: {
            share: {
                img_shine: {
                    _visible: false
                },
                img_txt: {
                    _visible: false
                },
                img_point: {
                    _visible: false
                },
                _event: {
                    captureScreen_OK: function () {
                        if (MjClient.endallui.capture_screen != true)
                            return;

                        MjClient.endallui.capture_screen = false;
                        var writePath = jsb.fileUtils.getWritablePath();
                        var textrueName = "wxcapture_screen.png";
                        var savepath = writePath + textrueName;
                        MjClient.shareImageToSelectedPlatform(savepath);
                        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                            this.setTouchEnabled(true);
                        }.bind(this))));

                        if (MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");
                    }
                }
            },
        }
    },
    ctor: function () {
        this._super();
        var _jsonPath = "endAll.json", isHaveNew = true, setPlayer = SetGameOverLayer;
        switch (MjClient.gameType) {
            case MjClient.GAME_TYPE.RED_20_POKER:
                _jsonPath = "endAll_Red20.json";
                setPlayer = SetGameOverLayer_Red20;
                break;
            case MjClient.GAME_TYPE.PAO_DE_KUAI_YAAN:
                _jsonPath = "endAll_Runfaster.json";
                setPlayer = SetGameOverLayer_Runfaster;
                break;
            default:
                isHaveNew = false;
                break;
        }
        this._BigWinnerScore = 0;
        var endallui = ccs.load(_jsonPath);
        BindUiAndLogic(endallui.node, this.jsBind);
        this.addChild(endallui.node);
        MjClient.endallui = this;

        var _block = endallui.node.getChildByName("block");
        setWgtLayout(_block, [1, 1], [0.5, 0.5], [0, 0], true);

        /*
            changed by sking
         */
        var _back = endallui.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0]);
        var sData = MjClient.data.sData;
        var tData = sData.tData;

        //信息 说明
        var _infoMation = _back.getChildByName("infoMation");
        _infoMation.visible = true;
        _infoMation.setString('房间号：' + tData.tableid);
        _infoMation.ignoreContentAdaptWithSize(true);

        //时间
        var _time = _back.getChildByName("time");
        _time.visible = true;
        _time.setString("" + (MjClient.roundEndTime ? MjClient.roundEndTime : ''));

        // 亲友圈的房间显示亲友圈图标及名称
        var clubNode = _back.getChildByName("Image_club");
        var clubInfoTable = getClubInfoInTable();
        if (clubInfoTable && clubInfoTable.clubId && clubNode != null) {
            var clubName = clubNode.getChildByName("Text_name");
            clubName.ignoreContentAdaptWithSize(true);
            clubName.setString("" + unescape(clubInfoTable.clubTitle));

            var _nameStr = unescape(clubInfoTable.ruleName);
            var _ruleName = clubName.clone();
            _ruleName.ignoreContentAdaptWithSize(true);
            _ruleName.setString(_nameStr);
            _ruleName.y = clubName.y + clubName.height / 2 + _ruleName.height / 2;
            _ruleName.x = clubName.x;
            clubNode.addChild(_ruleName);
            cc.loader.loadImg(clubInfoTable.clubAvatar ? clubInfoTable.clubAvatar : "png/default_headpic.png", {
                isCrossOrigin: true
            }, function (err, texture) {
                if (err || !texture || !sys.isObjectValid(clubNode))
                    return;

                var sp = new cc.Sprite(texture);
                if (!sp)
                    return;

                sp.setScale((clubNode.width - 8) / sp.width);
                sp.setPosition(cc.p(clubNode.width / 2, clubNode.height / 2));
                clubNode.addChild(sp);
            });
        } else if (clubNode != null) {
            clubNode.setVisible(false);
        }

        //分享
        var _share = _back.getChildByName("share");
        _share.visible = !MjClient.remoteCfg.guestLogin && !tData.matchId;
        _share.setScale(_back.width / 1280)
        _share.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.shareMultiPlatform(MjClient.systemConfig.sharePlatforms, function () {
                        COMMON_UI.getShareCodeTexture(tData.tableInfoUrl, _back, function () {
                            cc.log("====================capture_screen=======================");
                            postEvent("capture_screen");
                            if (MjClient.endallui && cc.sys.isObjectValid(MjClient.endallui)) {
                                MjClient.endallui.capture_screen = true;
                            }
                            _share.setTouchEnabled(false);
                        });
                    });
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Dajiesuanjiemian_Fenxiang", { uid: SelfUid(), gameType: MjClient.gameType });
                    break;
                default:
                    break;
            }
        }, this);

        //close ,关闭
        var _close1 = _back.getChildByName("close");
        this._close1 = _close1;
        _close1.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Tuichu", { uid: SelfUid(), gameType: MjClient.gameType });
                    if (MjClient.Scene.getChildByName("shareCode")) MjClient.Scene.removeChildByName("shareCode");

                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable) {
                        if (!MjClient.FriendCard_main_ui)
                            MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                    }

                    //MjClient.leaveGame();
                    //这里的leaveGame肯定会返回{"result":0,"msg":"alreadyLeave"}，所以不用等待返回后再继续
                    //MjClient.native.doCopyToPasteBoard("");//清空剪切板
                    MjClient.gamenet.request("pkplayer.handler.LeaveGame", {}, function (rtn) { });
                    delete MjClient.data.sData;
                    delete MjClient.gameType;
                    postEvent("LeaveGame");
                    if (MjClient.enterui) {
                        MjClient.enterui.removeFromParent(true);
                        MjClient.enterui = null;
                    }

                    if (MjClient.createui) {
                        MjClient.createui.removeFromParent(true);
                        MjClient.createui = null;
                    }

                    if (MjClient.endallui) {
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }

                    if (cc.sys.isObjectValid(MjClient.goldMatchingui)) {
                        MjClient.goldMatchingui.removeFromParent();
                        delete MjClient.goldMatchingui;
                    }

                    if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                        MjClient.replayui.replayEnd();
                    }

                    break;
                default:
                    break;
            }
        }, this);

        //再来一局
        var _btnReplay = _back.getChildByName("btnReplay");
        _btnReplay.visible = false;
        if (clubInfoTable) {
            _btnReplay.visible = !!clubInfoTable.againGame;
            isHaveNew || (_share.x = _share.getParent().width / 2);
        }
        _btnReplay.addTouchEventListener(function (sender, Type) {
            switch (Type) {
                case ccui.Widget.TOUCH_ENDED:
                    var clubInfoTable = getClubInfoInTable();
                    if (clubInfoTable) {
                        if (clubInfoTable && clubInfoTable.clubId && MjClient.friendCard_replay && !playLogInfoView) {
                            clubReplay(clubInfoTable.clubId, clubInfoTable.ruleId, MjClient.gameType);
                            return;
                        } else {
                            if (!MjClient.FriendCard_main_ui)
                                MjClient.Scene.addChild(new FriendCard_main(clubInfoTable.clubId));
                        }
                    } else {
                        if (MjClient.data.inviteVipTable) {
                            MjClient.leaveGame(function () {
                                MjClient.joinGame(MjClient.data.inviteVipTable, null, false, MjClient.gameType);
                            });
                        }
                        else {
                            MjClient.reCreateRoom();
                        }
                    }

                    if (MjClient.endallui) {
                        MjClient.endallui.removeFromParent(true);
                        MjClient.endallui = null;
                    }
                    break;
                default:
                    break;
            }
        }, this);


        if (!isHaveNew) {
            //复制
            var _btnCopy = _back.getChildByName("btnCopy");
            const w = _btnReplay.getParent().width,
                rs = 1;
            if (!clubNode || !clubNode.visible) {
                _btnCopy && (_btnCopy.x = 250 * rs);
                if (_btnReplay && !_btnReplay.visible) _share.x = (w - 250) * rs;
                else {
                    _share.x = w / 2 * rs;
                    _btnReplay.x = (w - 250) * rs;
                }
            } else {
                _btnCopy && (_btnCopy.x = 360 * rs);
                if (_btnReplay && !_btnReplay.visible) _share.x = (w - 250) * rs;
                else {
                    _share.x = 640 * rs;
                    _btnReplay.x = 915 * rs;
                }
            }
        } else {
            if (!_btnReplay || !_btnReplay.visible) {
                _close1.x = _back.width / 2;
            } else {
                let aw = _back.width / 2, pos = _btnReplay.width;
                _btnReplay.x = aw + pos
                _close1.x = aw - pos;
            }
            //计算大赢家分数
            this.BigWinnerScore(sData.players);
        }

        //显示复制按钮
        addCopyBtnToGameOverLayer(endallui.node);
        //四个玩家的详细信息
        for (var i = 0; i < 4; i++) {
            var player = _back.getChildByName("head" + i);
            setPlayer(player, i);
        }
        return true;
    },
    onEnter: function () {
        this._super();
        if (MjClient.homeui && MjClient.systemConfig.rankEnable == "true") {
            MjClient.homeui.gameRankLayer();
        }
    },
    replaySet: function (cb) {
        var btn = new ui.Button("ui/zhanji/huikanMj_n.png", "ui/zhanji/huikanMj_s.png", "ui/zhanji/huikanMj_s.png", ccui.Widget.LOCAL_TEXTURE);
        btn.addClickEvent(function () {
            MjClient.goOnReplay();
        }, this);
        btn.x = this._share.x + 120;
        btn.y = this._share.y;
        this._share.parent.addChild(btn);
        this._share.x -= 120;

        this._close1.addTouchEventListener(function (sender, Type) {
            if (MjClient.endallui) {
                MjClient.endallui.removeFromParent(true);
                MjClient.endallui = null;
            }

            if (MjClient.rePlayVideo >= 0 && MjClient.replayui) {
                MjClient.replayui.replayEnd();
            }
        }, this);
    },
    BigWinnerScore: function (players) {
        this._BigWinnerScore = 0;
        for (var uid in players) {
            var pi = players[uid];
            if (pi && this._BigWinnerScore < pi.winall) this._BigWinnerScore = pi.winall;
        }
    }
});

//跑得快
function SetGameOverLayer_Runfaster(node, off) {
    if (!node) return;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    var sData = MjClient.data.sData,
        staticNd = node.getChildByName('statistc');
    setCommonMsg(node, pl, off);
    let pData = sData.players[pl.info.uid], leftNum = sData.tData.roundAll - pData.roundNum;
    let loseCount = MjClient.isDismiss ? leftNum - pData.winNum : leftNum - pData.winNum + 1;
    staticNd.getChildByName('item0').getChildByName('num').setString(pData.maxWin + '');
    staticNd.getChildByName('item1').getChildByName('num').setString(pData.zhaDanCount + '');
    staticNd.getChildByName('item2').getChildByName('num').setString(pData.winNum + '胜' + loseCount + '负');
    staticNd.getChildByName('item2').getChildByName('num').ignoreContentAdaptWithSize(true);
    staticNd.getChildByName('item3').getChildByName('num').setString(sData.tData.areaSelectMode["difen"] + '');
}

//红20
function SetGameOverLayer_Red20(node, off) {
    if (!node) return;
    var pl = MjClient.getPlayerByIndex(off);
    node.setVisible(false);
    if (!pl) return;
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    setCommonMsg(node, pl, off);
    const cIndex = tData.uids.indexOf(pl.info.uid), staticNd = node.getChildByName('statistc'), msg = tData._gameOverData;
    staticNd.getChildByName('item0').getChildByName('num').setString(msg.TianHuCount[cIndex] + '次');
    staticNd.getChildByName('item1').getChildByName('num').setString(msg.DiHuCount[cIndex] + '次');
    staticNd.getChildByName('item2').getChildByName('num').setString(msg.AllBlackCount[cIndex] + '次');
    staticNd.getChildByName('item3').getChildByName('num').setString(msg.AllRedCount[cIndex] + '次');
    staticNd.getChildByName('item4').getChildByName('num').setString(msg.BeiCJCount[cIndex] + '次');
    staticNd.getChildByName('item5').getChildByName('num').setString(msg.TingCount[cIndex] + '次');
    staticNd.getChildByName('item6').getChildByName('num').setString(msg.HuCount[cIndex] + '次');
}
//公共信息
function setCommonMsg(node, pl, off) {
    var sData = MjClient.data.sData;
    let pData = sData.players[pl.info.uid],
        len = Object.keys(sData.players).length,
        w = node.getParent().width,
        spce = (w - len * node.width) / (len + 1);
    node.x = spce + (node.width + spce) * off;
    node.setVisible(true);
    CircularCuttingHeadImg(node.getChildByName('head'), pl);
    var uidSelf = SelfUid();
    node.getChildByName('currbg').visible = uidSelf == pl.info.uid;
    node.getChildByName('winNode').getChildByName('bigWinner').visible = MjClient.endallui._BigWinnerScore == pData.winall && MjClient.endallui._BigWinnerScore != 0;
    let winNode = node.getChildByName('winNode').getChildByName('winNum'),
        lostNode = node.getChildByName('winNode').getChildByName('winNum1');
    winNode.visible = pData.winall >= 0;
    lostNode.visible = pData.winall < 0;
    if (pData.winall >= 0) {
        winNode.setString('' + pData.winall);
        winNode.ignoreContentAdaptWithSize(true);
    } else {
        lostNode.setString('' + Math.abs(pData.winall));
        lostNode.ignoreContentAdaptWithSize(true);
    }
    node.getChildByName('name').setString(getNewName(unescape(pl.info.nickname) + ""));
    node.getChildByName('id').setString("ID:" + pl.info.uid);
}
