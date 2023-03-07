/***
 * 长沙麻将，新框架牌桌逻辑
 * @type {void | Class | *}
 */

var majiang_panel_changSha;
(function () {
    majiang_panel_changSha = majiang_panel_shaoyang.extend({

        jsonFile: "Play_changSha_new.json",
        _huTimes: 0,
        getJsBind: function () {
            var jsBind = {
                node_eat: {
                    img_niaoPai: {
                        _visible: false,
                    },
                    btn_peng: {
                        card1: {},
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                if (MjClient.playui.pengCards.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showPengCards();
                                    return;
                                }
                                var tData = MjClient.data.sData.tData;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendPengToServer(MjClient.playui.pengCards[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () { }, "1");
                                } else {
                                    MjClient.playui.sendPengToServer(MjClient.playui.pengCards[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_gang: {
                        card1: {},
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                                MjClient.playui.hasClickBtn = true;
                            }
                            if (eventType === ccui.Widget.TOUCH_CANCELED) {
                                MjClient.playui.hasClickBtn = false;
                            }
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                MjClient.playui.isKaiGang = false;
                                if (MjClient.playui.gangCardArray.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () { }, "1");
                                } else {
                                    MjClient.playui.sendGangToServer(MjClient.playui.gangCardArray[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_gang1: {
                        card1: {},
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                                MjClient.playui.hasClickBtn = true;
                            }
                            if (eventType === ccui.Widget.TOUCH_CANCELED) {
                                MjClient.playui.hasClickBtn = false;
                            }
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                MjClient.playui.isKaiGang = true;

                                if (MjClient.playui.kaiGangCardArray.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showGangCards();
                                    return;
                                }

                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendGangToServer(MjClient.playui.kaiGangCardArray[0], MjClient.playui.isKaiGang);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () { }, "1");
                                } else {
                                    MjClient.playui.sendGangToServer(MjClient.playui.kaiGangCardArray[0], MjClient.playui.isKaiGang);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_chi: {
                        card1: {},
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                if (MjClient.playui.eatCardArray.length > 1 || MjClient.playui.eatCardArray[0].length > 1 ||
                                    MjClient.playui.chiCards.length > 1) {
                                    var showCardsNode = MjClient.playui.jsBind.node_eat.node_showCards._node;
                                    showCardsNode.getChildByName("img_showCardsBg").showKaiGangChiCards();
                                    return;
                                }
                                var tData = MjClient.data.sData.tData;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (player.eatFlag & 8) {
                                    MjClient.showMsg("确认不胡吗?", function () {
                                        MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0][0], MjClient.playui.chiCards[0]);
                                        MjClient.playui.hideEatNodeChildren();
                                    }, function () { }, "1");
                                } else {
                                    MjClient.playui.sendChiToServer(MjClient.playui.eatCardArray[0][0], MjClient.playui.chiCards[0]);
                                    MjClient.playui.hideEatNodeChildren();
                                }
                            }
                        }
                    },
                    btn_hu: {
                        card1: {
                            _event: {
                                newCard: function (ed) {
                                    MjClient.playui.setCardSprite(this, ed.newCard, true);
                                    MjClient.playui.searchAllTingCards();
                                    var _node = MjClient.playui.getNodeByName("node_down")
                                    _node.getChildByName("img_tingCards").setTingCards();
                                    MjClient.playui.updateTingTips();
                                }
                            }
                        },
                        _visible: false,
                        _touch: function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                var huTag = 0;
                                var tData = MjClient.data.sData.tData;
                                var player = MjClient.playui.getPlayerInfoByOff(0);
                                if (MjClient.playui.huCards.length >= 1) {
                                    huTag = MjClient.playui.huCards[0];
                                } else {
                                    if (MjClient.playui.isTurnMe()) {
                                        huTag = player.mjhand[player.mjhand.length - 1]
                                    } else {
                                        huTag = tData.lastPutCard;
                                    }
                                }
                                MjClient.playui.sendHuToServer(huTag);
                                MjClient.playui.hideEatNodeChildren();
                            }
                        }
                    },
                    node_showCards: {
                        img_showCardsBg: {
                            showGangCards: function () {
                                this.showCards();
                                this.visible = true;
                                if(this.getChildByName("chi_scroll")){
                                    this.getChildByName("chi_scroll").removeFromParent();
                                    this.getChildByName("imgTip").removeFromParent();
                                }
                                var cardArr = MjClient.playui.gangCardArray;
                                if (MjClient.playui.isKaiGang && MjClient.playui.kaiGangCardArray) {
                                    cardArr = MjClient.playui.kaiGangCardArray;
                                }
                                this.updateSize(cardArr.length, 4);
                                var startPos = this.getStartPos(cardArr.length, 4);
                                var templatCard = this.getChildByName("img_card");
                                var self = this;
                                for (var i = 0; i < cardArr.length; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        var card = util.clone(templatCard);
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);
                                        card.tag = cardArr[i];
                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(x, y);
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, cardArr[i]);

                                        card.addTouchEventListener(function (sender, eventType) {
                                            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                                                MjClient.playui.hasClickBtn = true;
                                            }
                                            if (eventType == ccui.Widget.TOUCH_CANCELED) {
                                                MjClient.playui.hasClickBtn = false;
                                            }
                                            if (eventType == ccui.Widget.TOUCH_ENDED) {
                                                MjClient.playui.sendGangToServer(sender.tag, MjClient.playui.isKaiGang);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.getParent().visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            },
                            showKaiGangChiCards: function () {
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.eatCardArray;
                                var length = 0;
                                for (var i = 0; i < cardArr.length; i++) {
                                    length += cardArr[i].length;
                                }
                                // cc.log(" === lms --- length ",length)
                                var row = length;
                                length = length >= 6 ? 6 : length;
                                this.updateSize(length, 3);
                                var startPos = this.getStartPos(length, 3);
                                var templatCard = this.getChildByName("img_card");
                                var chiCards = MjClient.playui.chiCards;
                                var self = this;
                                var y = templatCard.y;
                                var _scroll;
                                var _imgTip;
                                if(!this.getChildByName("chi_scroll")){
                                    _scroll =  new ccui.ScrollView(); 
                                    _scroll.setName("chi_scroll");
                                    _scroll.setBounceEnabled(true);
                                    this.addChild(_scroll);
                                    _imgTip = new ccui.ImageView("setting/icon_showmore.png");
                                    _imgTip.x = (_scroll.x + 220);
                                    _imgTip.y = 30;
                                    _imgTip.setAnchorPoint(cc.p(0,0));
                                    _imgTip.setScale(0.8);
                                    this.addChild(_imgTip);
                                    _imgTip.setName("imgTip");
                                }else{
                                    _scroll = this.getChildByName("chi_scroll");
                                    _imgTip = this.getChildByName("imgTip");
                                }

                                _imgTip.visible = row > 6;
                                if(length < 6){
                                    this.height = templatCard.height * templatCard.scale * (row + 0.25);
                                }
                                
                                _scroll.setContentSize(cc.size(this.width, this.height));
                                var height = templatCard.height * templatCard.scale * (row + 0.25);//多一点空间免得太拥挤
                                _scroll.setDirection(ccui.ScrollView.DIR_VERTICAL);
                                _scroll.setInnerContainerSize(cc.size(this.width, height));
                                _scroll.setScrollBarOpacity(0);
                                cc.log(" ==== startPos ",startPos.x,startPos.y,this.width, this.height);
                                _scroll.addCCSEventListener(function(sender, type) {
                                    switch (type) {
                                        case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM:
                                            _imgTip.visible = false;
                                            break;
                                        case ccui.ScrollView.EVENT_SCROLL_TO_TOP:
                                            _imgTip.visible = (true && row > 6);
                                            break;
                                    }
                                });
                                                        

                                _scroll.removeAllChildren();
                                for (var k = 0; k < cardArr.length; k++) {
                                    var lastPutCard = chiCards[k];
                                    for (var i = 0; i < cardArr[k].length; i++) {
                                        for (var j = 0; j < 3; j++) {
                                            var card = util.clone(templatCard);
                                            if (cardArr[k][i] == j) {
                                                card.color = cc.color(255, 255, 0);
                                            }
                                            card.visible = true;
                                            card.setName(MjClient.playui.HandleCardType.Put);
                                            card.tag = cardArr[k][i];
                                            card.x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                            card.y = y;

                                            _scroll.addChild(card);
                                            MjClient.playui.updateChiGangCards(card, lastPutCard - cardArr[k][i] + j);

                                            card.k = k;
                                            card.addTouchEventListener(function (sender, eventType) {
                                                if (eventType == ccui.Widget.TOUCH_ENDED) {
                                                    MjClient.playui.sendChiToServer(sender.tag, MjClient.playui.chiCards[sender.k]);
                                                    MjClient.playui.hideEatNodeChildren();
                                                    self.visible = false;
                                                    _scroll.removeFromParent();
                                                    _imgTip.removeFromParent();
                                                }
                                            }, card);
                                        }
                                        y += templatCard.height * templatCard.scaleY;
                                    }
                                }
                            },
                            showPengCards: function () {
                                this.showCards();
                                this.visible = true;
                                var cardArr = MjClient.playui.pengCards;
                                this.updateSize(cardArr.length, 3);
                                var startPos = this.getStartPos(cardArr.length, 3);
                                var templatCard = this.getChildByName("img_card");
                                if(this.getChildByName("chi_scroll")){
                                    this.getChildByName("chi_scroll").removeFromParent();
                                    this.getChildByName("imgTip").removeFromParent();
                                }
                                var self = this;
                                for (var i = 0; i < cardArr.length; i++) {
                                    for (var j = 0; j < 3; j++) {
                                        var card = util.clone(templatCard);
                                        card.visible = true;
                                        card.setName(MjClient.playui.HandleCardType.Put);
                                        card.tag = cardArr[i];
                                        var x = startPos.x + j * templatCard.width * templatCard.scale * 0.97;
                                        var y = startPos.y + i * templatCard.height * templatCard.scale;
                                        card.setPosition(x, y);
                                        this.addChild(card);
                                        MjClient.playui.updateChiGangCards(card, cardArr[i]);

                                        card.addTouchEventListener(function (sender, eventType) {
                                            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                                                MjClient.playui.hasClickBtn = true;
                                            }
                                            if (eventType == ccui.Widget.TOUCH_CANCELED) {
                                                MjClient.playui.hasClickBtn = false;
                                            }
                                            if (eventType == ccui.Widget.TOUCH_ENDED) {
                                                MjClient.playui.sendPengToServer(sender.tag);
                                                MjClient.playui.hideEatNodeChildren();
                                                self.getParent().visible = false;
                                            }
                                        }, card);
                                    }
                                }
                            }
                        }
                    },
                    layout_qshu: {
                        _event: {
                            doQiShouHu: function (eD) {
                                this.visible = false;
                            },
                            MJPut: function (eD) {
                                try{
                                    if (typeof QiShouHuNode != "undefined") {
                                        for (var i = 0; i < 20; i++) {
                                            if (QiShouHuNode && QiShouHuNode["qshuNode_" + i]) {
                                                if (cc.sys.isObjectValid(QiShouHuNode["qshuNode_" + i]))
                                                    QiShouHuNode["qshuNode_" + i].removeFromParent();
                                                QiShouHuNode["qshuNode_" + i] = null;
                                            }
                            
                                            if (QiShouHuNode && QiShouHuNode["nodeQSH_" + i]) {
                                                QiShouHuNode["nodeQSH_" + i].showNum = 0;
                                                QiShouHuNode["nodeQSH_" + i].uid = null;
                                            }
                            
                                        }
                                    }
                                }catch(e){
                                    cc.log(" warning : ",e);
                                };
                            },
                        }
                    },
                    _event: {
                        sendKaiGangCard: function () {
                            MjClient.playui.getPlayerEatNode();
                        },
                        waitHaiDiLao: function(msg) {
                            //弹窗选择是否捞一把
                            var layer = new laZhangLayer(function(select) {
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                player.haiDiLaoState = select ? 1 : 0;
                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "MJSelectHaiDiLao",
                                    haiDiLaoState: player.haiDiLaoState,
                                });
                            });
                            MjClient.playui.addChild(layer, 99);
                            if (MjClient.webViewLayer != null) {
                                MjClient.webViewLayer.close();
                            }
                        },
                        
                    }
                },
                node_wait: {
                    btn_qshu: {
                        _layout: [[0.095, 0.095], [0.97, 0.075], [0, 1.8]],
                        _run: function () {
                            this.visible = false;
                        },
                        _touch: function (btn, eT) {
                            if (eT == 2) {
                                //显示起手胡
                                var layer = new showQiShouHuView();
                                MjClient.Scene.addChild(layer);
                            }
                        },
                        _event: {
                            initSceneData: function (msg) {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;

                                if (tData.areaSelectMode["chaHu"] == true) {
                                    this.visible = true;
                                }
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (player.haiDiLaoState == 2 && SelfUid() == player.info.uid) {
                                    //弹窗选择是否捞一把
                                    var layer = new laZhangLayer(function (select) {
                                        var pl = getUIPlayer(0);
                                        player.haiDiLaoState = select ? 1 : 0;
                                        MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                            cmd: "MJSelectHaiDiLao",
                                            haiDiLaoState: player.haiDiLaoState,
                                        });
                                    });
                                    layer.setName("laZhangLayer");
                                    MjClient.playui.addChild(layer, 99);
                                    if (MjClient.webViewLayer != null) {
                                        MjClient.webViewLayer.close();
                                    }
                                }
                            },

                        }
                    },
                    btn_gps: {
                        _layout: [[0.09, 0.09], [0.97, 0.02], [0, 3.7]],
                        _run: function () {
                            this.visible = MjClient.playui.getMaxPlayer() != 2;
                        },
                        _click: function () {
                            if (MjClient.playui.getMaxPlayer() == 3) {
                                MjClient.Scene.addChild(new showDistance3PlayerLayer());
                            } else if (MjClient.playui.getMaxPlayer() == 4) {
                                MjClient.Scene.addChild(new showDistanceLayer());
                            }
                        }
                    },
                    btn_chat: {
                        _layout: [[0.09, 0.09], [0.97, 0.12], [0, 3.7]],
                        _click: function () {
                            var chatlayer = new ChatLayer();
                            MjClient.Scene.addChild(chatlayer);
                        }
                    },
                    btn_voice: {
                        _layout: [[0.09, 0.09], [0.97, 0.22], [0, 3.7]],
                        _run: function () {
                            if (MjClient.isShenhe) {
                                this.visible = false;
                                return;
                            }
                            this.recordTime = null;
                            this.recordLayer = null;
                            this.recordMessage = {};
                            MjClient.atRecord = false;
                            MjClient.downAndPlayVoiceMessageQueue = [];
                        },
                        _touch: function (btn, eventType) {
                            // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                                this.startRecordVoice();
                            } else if (eventType == ccui.Widget.TOUCH_ENDED) {
                                this.endRecordVoice();
                            } else if (eventType == ccui.Widget.TOUCH_CANCELED) {
                                this.cancelRecordVoice();
                            }
                        },                     
                        _event: {
                            cancelRecord: function () {
                                MjClient.native.HelloOC("cancelRecord !!!");
                            },
                            uploadRecord: function (filePath) {
                                if (!filePath) {
                                    MjClient.native.HelloOC("No voice file update");
                                    return;
                                }
                                MjClient.native.HelloOC("upload voice file");
                                MjClient.native.UploadFile(filePath, MjClient.remoteCfg.voiceUrl, "sendVoice");
                            },
                            sendVoice: function (fullFilePath) {
                                if (!fullFilePath) {
                                    return;
                                }

                                var getFileName = /[^\/]+$/;
                                var extensionName = getFileName.exec(fullFilePath);
                                var fileName = extensionName[extensionName.length - 1];

                                MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                    cmd: "downAndPlayVoice",
                                    uid: SelfUid(),
                                    type: 3,
                                    msg: fileName,
                                    num: this.recordTime//录音时长
                                });
                                MjClient.native.HelloOC("download file");
                            },
                            downAndPlayVoice: function (msg) {
                                MjClient.native.HelloOC("downloadPlayVoice ok");
                                MjClient.data._tempMessage = msg;
                                MjClient.native.HelloOC("mas is" + JSON.stringify(msg));
                                MjClient.playui.downAndPlayVoice(msg.uid, msg.msg);
                            }
                        }
                    },

                },
                panel_jiaPiao: {
                    _layout: [[1, 1], [0.5, 0.2], [0, 0]],
                    _event: {
                        initSceneData: function () {
                            this.setVisible(MjClient.playui.isShowPiaoFenPanel());
                        },
                        waitJiazhu: function () {
                            this.setVisible(true);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                    },
                    btn_buPiao: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(0, sender);
                        }
                    },
                    btn_piao1: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(1, sender);
                        }
                    },
                    btn_piao2: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(2, sender);
                        }
                    },
                    btn_piao3: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(3, sender);
                        }
                    },
                },
                panel_piaoNiao: {
                    _layout: [[1, 1], [0.5, 0.3], [0, 0]],
                    _event: {
                        initSceneData: function () {
                            this.setVisible(MjClient.playui.isShowPiaoNiaoPanel());
                            MjClient.playui.processPiaoNiaoPanel(this);
                        },
                        waitJiazhu: function (msg) {
                            this.setVisible(MjClient.playui.isShowPiaoNiaoPanel(msg));
                            MjClient.playui.processPiaoNiaoPanel(this, msg);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                    },
                    btn_buchuo: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(0, sender);
                        }
                    },
                    btn_chuoda: {
                        _click: function (sender) {
                            MjClient.playui.handelPiaoFenAndPiaoNiao(2, sender);
                        }
                    },
                },
                text_waitOtherJiaZhu: {
                    _layout: [[0.32, 0.32], [0.5, 0.65], [0, 0]],
                    _visible: false,
                    _event: {
                        initSceneData: function () {
                            var sData = MjClient.data.sData;
                            var tData = sData.tData;
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if (tData.tState === TableState.waitJiazhu && player.mjState !== TableState.waitJiazhu) {
                                this.setVisible(true);
                            }
                        },
                        moveHead: function () {
                            this.setVisible(false);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                        showTextWaitOtherJiaZhu: function () {
                            this.setVisible(true);
                        }
                    }
                },
                node_down: {
                    layout_head: {
                        atlas_score: {
                            _visible: true,
                            _run: function () {
                                this.setString("");
                            },
                            _event: {
                                doQiShouHu: function (eD) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_down");
                                    if (!player) {
                                        return;
                                    }

                                    var id = player.info.uid;
                                    if (eD.players[id]) {
                                        this.visible = true;
                                        changeAtalsForLabel(this, eD.players[id].winall);
                                    }
                                },
                            }
                        },
                        atlas_tuoGuanTime:{
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    var pl = MjClient.playui.getPlayerInfoByName("node_down");
                                    if(!pl || pl.info.uid != msg.uid){
                                        return;
                                    }
                                    
                                    this.visible = true;
                                    this.setString(msg.tipCountDown);
                                    var tipCountDown = msg.tipCountDown;
                                    var self = this;
                                    this.schedule(function () {
                                        self.setString(tipCountDown);
                                        if (tipCountDown > 0) {
                                            tipCountDown--;
                                        }else {
                                            self.setVisible(false);
                                            self.unscheduleAllCallbacks();
                                        }
                                    }, 1, cc.REPEAT_FOREVER, 0);
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJChi: function(eD) {
                                    this.visible = false;
                                },
                                MJGang: function(eD) {
                                    this.visible = false;
                                },
                                MJPeng: function(eD) {
                                    this.visible = false;
                                },
                                MJHu: function(eD) {
                                    this.visible = false;
                                },
                                MJPass: function(eD) {
                                    this.visible = false;
                                },
                                MJSelectHaiDiLao: function() {
                                    this.visible = false;
                                },
                                roundEnd:function()
                                {
                                    this.visible = false;
                                }
                            }
                        },
                    },
                    img_qshu_layout: {
                        _layout: [[0, 0.1], [0.5, 0.4], [0, 0]],
                        _visible: false,
                        _event: {
                            roundEnd: function() {
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
                                    self.removeAllChildren();
                                })));
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var uids = tData.uids;
                                for (var i = 0; i < uids.length; i++) {
                                    if(!sData.players[uids[i]]) continue;
                                    sData.players[uids[i]].qiShouHuDone = [];
                                }
                                for (var i = 0; i < 20; i++) {
                                    if (QiShouHuNode["qshuNode_" + i]) {
                                        if (cc.sys.isObjectValid(QiShouHuNode["qshuNode_" + i]))
                                            QiShouHuNode["qshuNode_" + i].removeFromParent();
                                        QiShouHuNode["qshuNode_" + i] = null;
                                    }

                                    if (QiShouHuNode["nodeQSH_" + i]) {
                                        QiShouHuNode["nodeQSH_" + i].showNum = 0;
                                        QiShouHuNode["nodeQSH_" + i].uid = null;
                                    }

                                }
                            }
                            
                        }

                    },
                    node_gangScore: {
                        _run: function () {
                            this.visible = false;
                            this.setUserData({ pos: this.getPosition() });
                        },
                        _event: {
                            MJGangScore: function (d) {
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function () {
                                this.visible = false;
                            }
                        }
                    },
                    node_animation: {
                        _event: {
                            sendKaiGangCard: function (msg) {
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if (msg.uid == player.info.uid) {
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
                                }
                            }, 

                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            },
                            MJHu: function(data){
                                MjClient.playui.checkTipDuoHu(this.getParent(), data);
                                var player = MjClient.playui.getPlayerInfoByName("node_down");
                                if(player.info.uid != data.uid){
                                    return;
                                }

                                if (player.huWord && player.huWord.indexOf("zimo") != -1) {
                                    MjClient.playui.showEatActionAnim(this.getParent(), MjClient.playui.AnimationType.ZIMO);
                                } else {
                                    MjClient.playui.showEatActionAnim(this.getParent(), MjClient.playui.AnimationType.HU);
                                }
                                MjClient.playui.showHuTypeImage(this, player, "node_down");
                                
                            },                         
                        }
                    },
                    _event: {
                        sendKaiGangCard: function (ed) {
                            MjClient.playui.dealKaiGang(this, ed, 0);
                            var player = MjClient.playui.getPlayerInfoByName("node_down");
                            if (ed.uid == player.info.uid) {
                                MjClient.playui.sendAutoPutToServer(false);
                            }
                            MjClient.playui.updatePlayerEatBtn();
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();
                        },
                        doQiShouHu: function (eD) {
                            MjClient.playui.playQiShouHuEffect(eD.qshuName);
                            MjClient.playui.playQiShouHuAnim(this, eD, 0);
                            MjClient.playui.hideEatNodeChildren();
                            if (eD.isNoQsHu) {
                                MjClient.playui.updatePlayerEatBtn();
                            }
                        },
                        MJPut:function(msg){
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();

                            MjClient.playui.clickGangPass = false;
                            MjClient.playui.clickTingPass = false;
                            MjClient.playui.clickTing = false;
                            MjClient.playui.dealPut(this, msg);
                            if(msg.uid == MjClient.playui.getSelfUid()){
                                MjClient.playui.checkHandCards(this);
                                MjClient.playui.checkPutCards(this);
                                MjClient.playui.updateTingTips();
                            }
                        },
                        MJChi: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.CHI);
                            MjClient.playui.resetPutCards(this);
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();
                        },
                        MJGang: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.GANG);
                            MjClient.playui.resetPutCards(this);
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();
                        },
                        MJPeng: function(data) {
                            MjClient.playui.hasClickBtn = false;
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.PENG);
                            MjClient.playui.resetPutCards(this);
                            MjClient.playui.searchAllTingCards();
                            this.getChildByName("img_tingCards").setTingCards();
                            MjClient.playui.updateTingTips();
                        },
                    }
                },
                node_right: {
                    layout_head: {
                        atlas_score: {
                            _visible: true,
                            _run: function () {
                                this.setString("");
                            },
                            _event: {
                                doQiShouHu: function (eD) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_right");
                                    if (!player) {
                                        return;
                                    }

                                    var id = player.info.uid;
                                    if (eD.players[id]) {
                                        this.visible = true;
                                        changeAtalsForLabel(this, eD.players[id].winall);
                                    }
                                },
                            }
                        },
                        atlas_tuoGuanTime:{
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    var pl = MjClient.playui.getPlayerInfoByName("node_right");
                                    if(!pl || pl.info.uid != msg.uid){
                                        return;
                                    }
                                    
                                    this.visible = true;
                                    this.setString(msg.tipCountDown);
                                    var tipCountDown = msg.tipCountDown;
                                    var self = this;
                                    this.schedule(function () {
                                        self.setString(tipCountDown);
                                        if (tipCountDown > 0) {
                                            tipCountDown--;
                                        }else {
                                            self.setVisible(false);
                                            self.unscheduleAllCallbacks();
                                        }
                                    }, 1, cc.REPEAT_FOREVER, 0);
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJChi: function(eD) {
                                    this.visible = false;
                                },
                                MJGang: function(eD) {
                                    this.visible = false;
                                },
                                MJPeng: function(eD) {
                                    this.visible = false;
                                },
                                MJHu: function(eD) {
                                    this.visible = false;
                                },
                                MJPass: function(eD) {
                                    this.visible = false;
                                },
                                MJSelectHaiDiLao: function() {
                                    this.visible = false;
                                },
                                roundEnd:function()
                                {
                                    this.visible = false;
                                }
                            }
                        },
                    },
                    img_qshu_layout: {
                        _layout: [[0, 0.1], [0.8, 0.6], [0, 0]],
                        _visible: false
                    },
                    node_gangScore: {
                        _run: function () {
                            this.visible = false;
                            this.setUserData({ pos: this.getPosition() });
                        },
                        _event: {
                            MJGangScore: function (d) {
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function () {
                                this.visible = false;
                            }
                        }
                    },
                    node_animation: {
                        _event: {
                            sendKaiGangCard: function (msg) {
                                var player = MjClient.playui.getPlayerInfoByName("node_right");
                                if (msg.uid == player.info.uid) {
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
                                }
                            },

                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event: {
                        sendKaiGangCard: function (ed) {
                            MjClient.playui.dealKaiGang(this, ed, 1);
                        },
                        doQiShouHu: function (eD) {
                            MjClient.playui.playQiShouHuAnim(this, eD, 1);
                        },
                        MJChi: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.CHI);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJGang: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.GANG);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJPeng: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.PENG);
                            MjClient.playui.resetPutCards(this);
                        },
                    }
                },
                node_top: {
                    layout_head: {
                        atlas_score: {
                            _visible: true,
                            _run: function () {
                                this.setString("");
                            },
                            _event: {
                                doQiShouHu: function (eD) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_top");
                                    if (!player) {
                                        return;
                                    }

                                    var id = player.info.uid;
                                    if (eD.players[id]) {
                                        this.visible = true;
                                        changeAtalsForLabel(this, eD.players[id].winall);
                                    }
                                },
                            }
                        },
                        atlas_tuoGuanTime:{
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    var pl = MjClient.playui.getPlayerInfoByName("node_top");
                                    if(!pl || pl.info.uid != msg.uid){
                                        return;
                                    }
                                    
                                    this.visible = true;
                                    this.setString(msg.tipCountDown);
                                    var tipCountDown = msg.tipCountDown;
                                    var self = this;
                                    this.schedule(function () {
                                        self.setString(tipCountDown);
                                        if (tipCountDown > 0) {
                                            tipCountDown--;
                                        }else {
                                            self.setVisible(false);
                                            self.unscheduleAllCallbacks();
                                        }
                                    }, 1, cc.REPEAT_FOREVER, 0);
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJChi: function(eD) {
                                    this.visible = false;
                                },
                                MJGang: function(eD) {
                                    this.visible = false;
                                },
                                MJPeng: function(eD) {
                                    this.visible = false;
                                },
                                MJHu: function(eD) {
                                    this.visible = false;
                                },
                                MJPass: function(eD) {
                                    this.visible = false;
                                },
                                MJSelectHaiDiLao: function() {
                                    this.visible = false;
                                },
                                roundEnd:function()
                                {
                                    this.visible = false;
                                }
                            }
                        },
                    },
                    img_qshu_layout: {
                        _layout: [[0, 0.1], [0.5, 0.75], [0, 0]],
                        _visible: false
                    },
                    node_gangScore: {
                        _run: function () {
                            this.visible = false;
                            this.setUserData({ pos: this.getPosition() });
                        },
                        _event: {
                            MJGangScore: function (d) {
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function () {
                                this.visible = false;
                            },
                            
                        }
                    },
                    node_animation: {
                        _event: {
                            sendKaiGangCard: function (msg) {
                                var player = MjClient.playui.getPlayerInfoByName("node_top");
                                if (msg.uid == player.info.uid) {
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
                                }
                            },

                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }
                        }
                    },
                    _event: {
                        sendKaiGangCard: function (ed) {
                            MjClient.playui.dealKaiGang(this, ed, 2);
                        },
                        doQiShouHu: function (eD) {
                            MjClient.playui.playQiShouHuAnim(this, eD, 2);
                        },
                        MJChi: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.CHI);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJGang: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.GANG);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJPeng: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.PENG);
                            MjClient.playui.resetPutCards(this);
                        },
                    }
                },
                node_left: {
                    layout_head: {
                        atlas_score: {
                            _visible: true,
                            _run: function () {
                                this.setString("");
                            },
                            _event: {
                                doQiShouHu: function (eD) {
                                    var player = MjClient.playui.getPlayerInfoByName("node_left");
                                    if (!player) {
                                        return;
                                    }

                                    var id = player.info.uid;
                                    if (eD.players[id]) {
                                        this.visible = true;
                                        changeAtalsForLabel(this, eD.players[id].winall);
                                    }
                                },
                            }
                        },
                        atlas_tuoGuanTime:{
                            _run:function () {
                                this.visible = false;
                                this.ignoreContentAdaptWithSize(true);
                            },
                            _event:{
                                trustTip:function (msg) {
                                    var pl = MjClient.playui.getPlayerInfoByName("node_left");
                                    if(!pl || pl.info.uid != msg.uid){
                                        return;
                                    }
                                    
                                    this.visible = true;
                                    this.setString(msg.tipCountDown);
                                    var tipCountDown = msg.tipCountDown;
                                    var self = this;
                                    this.schedule(function () {
                                        self.setString(tipCountDown);
                                        if (tipCountDown > 0) {
                                            tipCountDown--;
                                        }else {
                                            self.setVisible(false);
                                            self.unscheduleAllCallbacks();
                                        }
                                    }, 1, cc.REPEAT_FOREVER, 0);
                                },
                                MJPut:function (msg) {
                                    this.visible = false;
                                },
                                MJChi: function(eD) {
                                    this.visible = false;
                                },
                                MJGang: function(eD) {
                                    this.visible = false;
                                },
                                MJPeng: function(eD) {
                                    this.visible = false;
                                },
                                MJHu: function(eD) {
                                    this.visible = false;
                                },
                                MJPass: function(eD) {
                                    this.visible = false;
                                },
                                MJSelectHaiDiLao: function() {
                                    this.visible = false;
                                },
                                roundEnd:function()
                                {
                                    this.visible = false;
                                }
                            }
                        },
                    },
                    img_qshu_layout: {
                        _layout: [[0, 0.1], [0.2, 0.6], [0, 0]],
                        _visible: false
                    },
                    node_gangScore: {
                        _run: function () {
                            this.visible = false;
                            this.setUserData({ pos: this.getPosition() });
                        },
                        _event: {
                            MJGangScore: function (d) {
                                MjClient.playui.updateGangScore(this, d);
                            },
                            initSceneData: function () {
                                this.visible = false;
                            }
                        }
                    },
                    node_animation: {
                        _event: {
                            sendKaiGangCard: function (msg) {
                                var player = MjClient.playui.getPlayerInfoByName("node_left");
                                if (msg.uid == player.info.uid) {
                                    MjClient.playui.showKaiGangAnimation(this.getParent());
                                }
                            },

                            roundEnd:function(){
                                var self = this;
                                self.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
                                    self.removeAllChildren();}
                                    )));
                            }

                        }
                    },
                    _event: {
                        sendKaiGangCard: function (ed) {
                            MjClient.playui.dealKaiGang(this, ed, 3);
                        },
                        doQiShouHu: function (eD) {
                            MjClient.playui.playQiShouHuAnim(this, eD, 3);
                        },
                        MJChi: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.CHI);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJGang: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.GANG);
                            MjClient.playui.resetPutCards(this);
                        },
                        MJPeng: function(data) {
                            MjClient.playui.handleCommand(this, data, MjClient.playui.AnimationType.PENG);
                            MjClient.playui.resetPutCards(this);
                        },
                    }
                },
                layout_roundInfo2D: {
                    img_cardNum: {
                        text_cardNum: {
                            _event: {
                                sendKaiGangCard: function () {
                                    this.setString(this.getCardNum());
                                }
                            }
                        }
                    }
                },
                layout_roundInfo3D: {
                    image_cardNumBg: {
                        text_cardNum: {
                            _event: {
                                sendKaiGangCard: function () {
                                    this.setString(this.getCardNum());
                                }
                            }
                        }
                    }
                },
                node_kaiGangKuang: {
                    _visible: false,
                    _layout: [[0.20, 0.29], [0.5, 0.35], [0, 0.4]],
                    _event: {
                        sendKaiGangCard: function (msg) {
                            MjClient.playui.showKaiGangBox(this);
                        },
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                        MJPut: function (eD) {
                            this.setVisible(false);
                        },
                        newCard: function () {
                            this.setVisible(false);
                        },
                        waitPut: function () {
                            this.setVisible(false);
                        },
                    }
                },
                node_kaiGangKuang2: {
                    _visible: false,
                    _layout: [[0.37, 0.29], [0.5, 0.35], [0, 0.4]],
                    _event: {
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                        MJPut: function (eD) {
                            this.setVisible(false);
                        },
                        newCard: function () {
                            this.setVisible(false);
                        },
                        waitPut: function () {
                            this.setVisible(false);
                        },
                    }

                },
                haidipaikuang: {
                    _visible: false,
                    _layout: [
                        [0.20, 0.29],
                        [0.5, 0.35],
                        [0, 0.4],
                        ],
                    _event: 
                    {
                        clearCardUI: function(eD) {
                            this.visible = false;
                            MjClient.playui.removeChildByName("laZhangLayer");
                            MjClient.playui.removeChildByName("jiaZhuCS");
                        },
                        roundEnd:function(eD){
                            this.visible = false;
                            MjClient.playui.removeChildByName("laZhangLayer");
                            MjClient.playui.removeChildByName("jiaZhuCS");
                        }
                    }
                },
                niaoPai: {
                    _visible: false,
                    _event: {
                        clearCardUI: function () {
                            this.setVisible(false);
                        },
                    }
                },
                _event: {
                    loadOther: function (msg) {
                        var uids = msg.uids;
                        for (var i = 0; i < uids.length; i++) {
                            var uid = uids[i];
                            if (uid == MjClient.playui.getSelfUid()) {
                                MjClient.showToast("等待其他玩家操作！！！");
                                // MjClient.playui.updatePlayerEatBtn();
                            }
                        }
                    },
                }

            };
            return jsBind;
        },

        ctor: function () {
            var jsonFile = this.jsonFile;
            this._super(majiang_panel_changSha, jsonFile);
            this.bindShowInfo();
            return true;
        },
        //重置开杠数据
        initKaiGangData: function () {
            this.kaiGangCardArray = [];
            this.isKaiGang = false;
            this.pengCards = [];
            this.chiCards = [];
            this.huCards = [];
            this.gangCards = [];
            this.kaiGangCards = [];
        },
        // override 是否显示红中癞子牌
        isHunCardShow: function () {
            return false;
        },

        // override 是否显示红中癞子牌
        isHunCardShow3D: function () {
            return true;
        },

        // override 是否开启显示最多听牌标识
        isShowMaxTingCards: function () {
            return true;
        },

        // 返回是否显示飘分层牌【自由下飘, 首局定飘】
        isShowPiaoFenPanel: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
            var isShow = tData.areaSelectMode.jiapiao;
            return !!(tData.tState === TableState.waitJiazhu && player && player.mjState === TableState.waitJiazhu);
        },
        /**
        *  海底捞出牌 */
        autoPutHaiDiLao: function () {
            var player = this.getPlayerInfoByName("node_down");
            if (!this.isTurnMe()) {
                return;
            }

            var newCardTag = null;
            if (player.mjhand && player.mjhand.length % 3 == 2 && player.isNew) {
                newCardTag = player.mjhand[player.mjhand.length - 1];
            }

            var cardNode = null;
            var node = this.getNodeByOff(0);
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.name == this.HandleCardType.Hand || (child.name == this.HandleCardType.Chi && child.isCut)) {
                    if (child.tag == newCardTag) {
                        cardNode = child;
                        break;
                    }
                }
            }

            if (!cardNode) {
                return;
            }

            if (this.isTurnMe() && !(player.eatFlag & 8)) {
                this.runAction(cc.sequence(cc.delayTime(0.6),
                    cc.callFunc(function () {
                        if (!cc.sys.isObjectValid(cardNode)) return;
                        MjClient.playui.putOutCard(cardNode, cardNode.tag);
                    })));
            }
        },

        // 返回是否显示飘鸟层牌【围一飘鸟】
        isShowPiaoNiaoPanel: function (msg) {
            var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
            if (!player) return;
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var isShow = tData.areaSelectMode.piaoniao;
            if (isShow && player && player.mjState === TableState.waitJiazhu && tData.tState === TableState.waitJiazhu) {
                return !(msg && cc.isArray(msg.chuoId) && msg.chuoId.indexOf(player.info.uid) >= 0 && player.jiazhuNum === 4);
            }
        },

        // 处理飘鸟层按钮【首局 扎鸟 不扎】【次局 戳哒 不戳】
        processPiaoNiaoPanel: function (piaoNiaoPanel, msg) {
            var player = MjClient.playui.getPlayerInfoByName(this.NodeNameArray[0]);
            if (!player) return;
            var selfUid = player.info.uid;
            var btnBuChuo = piaoNiaoPanel.getChildByName("btn_buchuo");
            var btnChuoDa = piaoNiaoPanel.getChildByName("btn_chuoda");
            if ((msg && cc.isArray(msg.chuoId) && msg.chuoId.indexOf(selfUid) >= 0 && player.jiazhuNum === 2) || !msg && player.jiazhuNum > 0) {
                btnBuChuo.loadTextures("playing/gameTable/buchuo_n.png", "playing/gameTable/buchuo_s.png");
                btnChuoDa.loadTextures("playing/gameTable/chuoda_n.png", "playing/gameTable/chuoda_s.png");
            } else {
                btnBuChuo.loadTextures("playing/gameTable/buzha_n.png", "playing/gameTable/buzha_s.png");
                btnChuoDa.loadTextures("playing/gameTable/zhaniao_n.png", "playing/gameTable/zhaniao_s.png");
            }
        },

        // 飘分,飘鸟按钮回调【统称为jiazhu】
        handelPiaoFenAndPiaoNiao: function (index, sender) {
            MjClient.playui.sendJiaZhuToServer(index, MjClient.playui.getSelfUid());
            sender.parent.setVisible(false);
            postEvent("showTextWaitOtherJiaZhu");
            this.getPlayerInfoByName("node_down").mjState = TableState.isReady;
        },

        // 绑定头像下部飘分
        bindShowInfo: function () {
            for (var i = 0; i < this.NodeNameArray.length; i++) {
                var nodeName = this.NodeNameArray[i];
                this.handelTextPiao(nodeName);
            }
        },

        // 处理点飘显示
        handelTextPiao: function (nodeName) {

            var playerNode = MjClient.playui.getNodeByName(nodeName);

            var showTextPiao = function (textNode, needAnim) {
                var tData = MjClient.data.sData.tData;
                var player = MjClient.playui.getPlayerInfoByName(nodeName);
                var string;
                if (!tData || !player || tData.tState === TableState.waitJiazhu || player.jiazhuNum === undefined || player.jiazhuNum <= 0) {
                    return textNode.visible = false;
                }

                textNode.visible = true;
                if (tData.areaSelectMode.piaoniao) {
                    string = "鸟" + player.jiazhuNum + "分";
                } else {
                    string = "飘" + player.jiazhuNum + "分";
                }
                textNode.ignoreContentAdaptWithSize(true);
                textNode.setString(string);

                var palyerNode = textNode.getParent().getParent();
                if (cc.sys.isObjectValid(palyerNode) && needAnim) {
                    var endPos = textNode.getPosition();
                    var anim = palyerNode.getChildByName("node_animation");
                    var worldPos = anim.convertToWorldSpace(palyerNode.getPosition());
                    var startPos = textNode.convertToNodeSpace(worldPos);
                    textNode.setPosition(startPos);
                    textNode.runAction(cc.sequence(
                        cc.fadeIn(0.01),
                        cc.scaleTo(0.01, 2),
                        cc.delayTime(2),
                        cc.spawn(
                            cc.moveTo(0.3, endPos),
                            cc.scaleTo(0.3, 1)
                        )
                    ));
                }
            };

            var jsBind = {
                layout_head: {
                    text_piao: {
                        _visible: false,
                        _event: {
                            clearCardUI: function () {
                                this.visible = false;
                            },
                            mjhand: function () {
                                showTextPiao(this, true);
                            },
                            initSceneData: function () {
                                showTextPiao(this);
                            }
                        }
                    }
                }
            };
            util.bindUiAndLogicMajiang(playerNode, jsBind);
        },




        //@Override 获得玩家可操作的按钮
        getPlayerEatNode: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var lastPutCard = tData.lastPutCard;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var bihuType = tData.areaSelectMode.bihuType;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            var kaiGangNode = MjClient.playui.jsBind.node_kaiGangKuang._node;
            kaiGangNode.setVisible(false);
            if ((tData.tState == TableState.waitEat || tData.tState == TableState.waitCard) && tData.lastPutCard2) {
                this.showKaiGangBox(kaiGangNode);
                return this.getPlayerEatNodeWhenKaiGang();
            }
            if (this.isTurnMe()) {

                //胡
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                    if (bihuType && player.isNew) player.isZiMoHu = true;
                    this.huCards.push(player.mjhand[player.mjhand.length - 1]);

                    if (player.isTing)
                        bihuType = true;
                }
                //开杠
                if (this.checkKaiGangBtn(player) && !this.clickGangPass) {
                    nodeArr.push(eat.btn_gang1._node);
                }

                //bu
                if (this.checkGangBtn(player) && !this.clickGangPass) {
                    nodeArr.push(eat.btn_gang._node);
                }


            } else {
                if (player.eatFlag & 8) {
                    nodeArr.push(eat.btn_hu._node);
                    this.huCards.push(lastPutCard);
                }
                if (player.eatFlag & 4 && MjClient.majiang.canKaiGang(player.mjhand, lastPutCard, false, player.mjpeng, false)) {
                    nodeArr.push(eat.btn_gang1._node);
                    this.kaiGangCardArray.push(lastPutCard);
                }
                //bu
                if (player.eatFlag & 4) {
                    nodeArr.push(eat.btn_gang._node);
                    this.gangCardArray.push(lastPutCard);
                }

                if (player.eatFlag & 2) {
                    nodeArr.push(eat.btn_peng._node);
                    this.pengCards.push(tData.lastPutCard);
                }

                if (player.eatFlag & 1) {
                    var eatpos = MjClient.majiang.canChi(player.mjhand, lastPutCard, tData.hunCard);
                    if (eatpos.length > 0) {
                        nodeArr.push(eat.btn_chi._node);
                        if (this.chiCards.indexOf(lastPutCard) == -1) {
                            this.eatCardArray.push(eatpos);
                            this.chiCards.push(lastPutCard);
                        }
                    }
                }
            }
            var _btnList = [eat.btn_hu._node, eat.btn_gang1._node, eat.btn_gang._node, eat.btn_peng._node, eat.btn_chi._node]
            var _datas = [this.huCards, this.kaiGangCardArray, this.gangCardArray, this.pengCards, this.chiCards];
            for (var i = 0; i < _btnList.length; i++) {
                this.eatMoreCards(_btnList[i], _datas[i]);
            }

            if (nodeArr.length > 0) {
                nodeArr.push(eat.btn_guo._node);
            }
            if (player.eatFlag & 8 && bihuType) {
                nodeArr.splice(-1, 1);
            }
            player.isZiMoHu = bihuType;

            if (player.haiDiLaoState == 1 || MjClient.majiang.getAllCardsTotal() - tData.cardNext <= 0) {
                cc.log(" ===== nodeArr.indexOf(eat.btn_hu._node)",nodeArr.indexOf(eat.btn_hu._node))
                if (player.eatFlag & 8) {
                    nodeArr = [eat.btn_hu._node];
                    eat._node.stopActionByTag(1);
                    eat.btn_hu._node.stopActionByTag(1);
                    eat.btn_hu._node.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(MjClient.playui.sendHuToServer(player.mjhand[player.mjhand.length - 1])))).tag = 1;
                }
                else if (player.haiDiLaoState == 1) {
                    if (player.eatFlag & 8)
                        MjClient.native.umengEvent4CountWithProperty("changSha_debug", { uid: SelfUid(), message: tData.tableid + "_" + tData.tState + "_" + player.mjState });
                    nodeArr = [];
                    eat.btn_hu._node.stopActionByTag(1);
                    eat._node.stopActionByTag(1);
                    eat._node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(this.autoPutHaiDiLao()))).tag = 1;
                }
            }

            this.reloadBtnTexture(nodeArr);
            
            return nodeArr;

        },
        //@Override 开杠时按钮检测
        getPlayerEatNodeWhenKaiGang: function () {
            var sData = MjClient.data.sData;
            var tData = sData.tData;
            var player = sData.players[this.getSelfUid()];
            var eat = MjClient.playui.jsBind.node_eat;
            var bihuType = tData.areaSelectMode.bihuType;
            var nodeArr = [];
            this.gangCardArray = [];
            this.eatCardArray = [];
            player.isZiMoHu = false;
            this.initKaiGangData();

            var isKaiGangAfterSelfAnGang = tData.uids[tData.curPlayer] == player.info.uid;
            var mustHu = false;
            for (var i = 0; i < 4; i++) {

                var eatFlag = i == 0 ? player.eatFlag : player["eatFlag" + (i + 1)];
                var lastPutCard = i == 0 ? tData.lastPutCard : tData["lastPutCard" + (i + 1)];

                cc.log(" ====  eatFlag  ------ i", eatFlag, i);

                if (eatFlag & 8) {
                    if (nodeArr.indexOf(eat.btn_hu._node) == -1) {
                        nodeArr.push(eat.btn_hu._node);
                        eat.btn_hu._node.level = 8;
                    }

                    if (this.huCards.indexOf(lastPutCard) == -1) {
                        this.huCards.push(lastPutCard);
                    }

                    if (player.isTing && isKaiGangAfterSelfAnGang)  // 开杠后可以自摸则不显示【过】
                        mustHu = true;

                }

                if ((eatFlag & 4) && MjClient.majiang.canKaiGang(player.mjhand, lastPutCard, false, player.mjpeng, isKaiGangAfterSelfAnGang)) {
                    if (nodeArr.indexOf(eat.btn_gang1._node) == -1) {
                        nodeArr.push(eat.btn_gang1._node);
                        eat.btn_gang1._node.level = 6;
                    }
                    if (this.kaiGangCardArray.indexOf(lastPutCard) == -1) {
                        this.kaiGangCardArray.push(lastPutCard);
                    }
                    if (player.isTing) {
                        if (nodeArr.indexOf(eat.btn_gang._node) == -1) {
                            nodeArr.push(eat.btn_gang._node);
                            eat.btn_gang._node.level = 4;
                        }
                        if (this.gangCardArray.indexOf(lastPutCard) == -1)
                            this.gangCardArray.push(lastPutCard);
                    }

                }

                if (!player.isTing) {
                    if (eatFlag & 4) {
                        if (nodeArr.indexOf(eat.btn_gang._node) == -1) {
                            nodeArr.push(eat.btn_gang._node);
                            eat.btn_gang._node.level = 4;
                        }
                        if (this.gangCardArray.indexOf(lastPutCard) == -1)
                            this.gangCardArray.push(lastPutCard);
                    }
                }

                if (eatFlag & 2) {
                    if (nodeArr.indexOf(eat.btn_peng._node) == -1) {
                        nodeArr.push(eat.btn_peng._node);
                        eat.btn_peng._node.level = 2;
                    }
                    if (this.pengCards.indexOf(lastPutCard) == -1) {
                        this.pengCards.push(lastPutCard);
                    }

                }

                if (eatFlag & 1) {
                    var eatpos = MjClient.majiang.canChi(player.mjhand, lastPutCard, tData.hunCard);
                    if (eatpos.length > 0) {
                        if (nodeArr.indexOf(eat.btn_chi._node) == -1) {
                            nodeArr.push(eat.btn_chi._node);
                            eat.btn_chi._node.level = 1;
                        }
                        if (this.chiCards.indexOf(lastPutCard) == -1) {
                            this.eatCardArray.push(eatpos);
                            this.chiCards.push(lastPutCard);
                        }
                    }
                }
            }

            var _btnList = [eat.btn_hu._node, eat.btn_gang1._node, eat.btn_gang._node, eat.btn_peng._node, eat.btn_chi._node]
            var _datas = [this.huCards, this.kaiGangCardArray, this.gangCardArray, this.pengCards, this.chiCards];
            for (var i = 0; i < _btnList.length; i++) {
                this.eatMoreCards(_btnList[i], _datas[i]);
            }
            nodeArr.sort(function (a, b) {
                return a.level < b.level;
            })

            if (nodeArr.length > 0) {

                if (mustHu == true) {
                    // nodeArr =[];
                    // nodeArr.push(eat.btn_hu._node);
                } else {
                    nodeArr.push(eat.btn_guo._node);
                }
            } else {
                player.mjState = TableState.waitCard;
            }
            player.isZiMoHu = mustHu;
            return nodeArr;
        },
        eatMoreCards: function (node, cards) {
            var addFace = function(n, card) {
                var cardImg = MjClient.playui.getCardFaceImg3D(n);
                cardImg.x = card.width / 2;
                cardImg.y = card.height / 2;
                card.removeAllChildren();
                card.addChild(cardImg);
            }
            for (var j = 0; j < 4; j++) {
                var cardNode = node.getChildByName("card" + (j + 1));
                if (!cards[j]) {
                    if (cardNode)
                        cardNode.visible = false;
                    continue;
                }


                if (!cardNode) {
                    if (!node.getChildByName("card" + j)) continue;

                    cardNode = node.getChildByName("card" + j).clone();
                    cardNode.setName("card" + (j + 1));
                    node.addChild(cardNode);
                }

                cardNode.x = node.width * 0.85 + cardNode.width * cardNode.scaleX / 2;
                cardNode.y = node.height / 2 + j * cardNode.height * cardNode.scaleY;

                cardNode.visible = true;
                addFace(cards[j], cardNode);
            }
        },

        //杠改为补动画
        initAnimationType: function(){
            var AnimationType = {
                "CHI"     : "chi",              //吃牌
                "PENG"    : "peng",             //碰牌
                "GANG"    : "gang",             //杠牌
                "HU"      : "hu",               //胡牌
                "ZIMO"    : "zimo",             //自摸胡牌
                "TING"    : "",             //听牌
                "KAIGANG" : "kaigang",          //杠牌
                "BU"      : "bu",               //杠牌
            };
            this.AnimationType = AnimationType;
        },
        //特殊处理补
        getEatSpineNode: function(actType) { 
            if (actType == this.AnimationType.GANG || actType == this.AnimationType.BU) {
                var pngPath = "bu.png";
                var scaleTo = 0.6;
                var scaleTo2 = 0.5;
                var projNode = new cc.Sprite("spine/bu/" + pngPath);
                projNode.setScale(0.0);
                projNode.runAction(cc.sequence(cc.scaleTo(0.2, scaleTo), cc.scaleTo(0.3, scaleTo2)) );
                return projNode;
            }
            var atlasSrc = "spine/" + actType + "/" + actType + ".atlas";
            var jsonSrc = "spine/" + actType + "/" + actType + ".json";

            // 输出的文件类型有两种，下面这种特意处理通用
            if(!jsb.fileUtils.isFileExist(atlasSrc)){
                atlasSrc = "spine/" + actType + "/skeleton.atlas";
                jsonSrc = "spine/" + actType + "/skeleton.json";
            }
            var projNode = createSpine(jsonSrc, atlasSrc);
            projNode.setAnimation(0, "idle", false);
            projNode.setTimeScale(1);
            projNode.setScale(0.5);
            return projNode;
        },
        //@Override 检测杠牌数据
        checkGangBtn: function (player) {
            var tData = MjClient.data.sData.tData;
            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            // 听牌 情况下 补 不能影响 听牌 
            var _gangBuList = [];
            if (player.isTing) {
                if (this.gangCardArray.length > 0) {
                    for (var i = 0; i < this.gangCardArray.length; i++) {
                        if (MjClient.majiang.canKaiGang(player.mjhand, this.gangCardArray[i], true, player.mjpeng, false)) {
                            _gangBuList.push(this.gangCardArray[i]);
                        }
                    }
                }
                this.gangCardArray = _gangBuList;
                if (this.gangCardArray.length > 0) {
                    return true;
                }
            } else {
                if (this.gangCardArray.length > 0) {
                    return true;
                }
            }

            return false;
        },
        //@ 检测开杠数据
        checkKaiGangBtn: function (player) {
            this.kaiGangCardArray = [];
            this.gangCardArray = MjClient.majiang.canGang1(player.mjpeng, player.mjhand, player.isTing);
            if (this.gangCardArray.length > 0) {
                for (var i = 0; i < this.gangCardArray.length; i++) {
                    if (MjClient.majiang.canKaiGang(player.mjhand, this.gangCardArray[i], true, player.mjpeng, false)) {
                        this.kaiGangCardArray.push(this.gangCardArray[i]);
                    }
                }
            }

            if (this.kaiGangCardArray.length > 0) {
                return true;
            }

            return false;
        },
        //@Override 发送杠牌数据到服务器
        sendGangToServer: function (cd, isKaiGang) {
            if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
            this.sendAutoPutToServer(false);

            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJGang",
                card: cd,
                isKaiGang: isKaiGang || false,
                eatFlag: this.getEatFlag()
            });
        },
        //@Override 发送吃牌数据到服务器
        sendChiToServer: function (pos, cd) {
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJChi",
                pos: pos,
                card: cd,
                eatFlag: this.getEatFlag()
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        //@Override 发送碰牌数据到服务器
        sendPengToServer: function (cd) {
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJPeng",
                card: cd,
                eatFlag: this.getEatFlag()
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        //@Override 发送胡牌数据到服务器
        sendHuToServer: function (cd) {
            if (MjClient.rePlayVideo != -1) {
                return;
            }
            this.sendAutoPutToServer(false);
            var sendMsg = {
                cmd: "MJHu",
                card: cd,
                eatFlag: this.getEatFlag()
            };
            MjClient.gamenet.request("pkroom.handler.tableMsg", sendMsg);
        },
        // @override 点过的时候验证
        checkWhenPass: function () {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName("node_down");

            if (player.isZiMoHu) {
                MjClient.showToast("自摸必须胡牌");
                return true;
            }

            return false;
        },
        // @override began事件时的验证
        checkWhenTouchBegan: function (cardNode) {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName("node_down");
            if (player.isZiMoHu) {
                MjClient.showToast("自摸必须胡牌");
                return true;
            }

            return this._super(cardNode);
        },
        //@  处理开杠
        dealKaiGang: function (playerNode, msg) {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if (player.info.uid != msg.uid) {
                return;
            }

            var kaiGangCardArrayValue = [];
            for (var i = 1; i <= 4; i++) {
                if (msg["card" + i] != -1)
                    kaiGangCardArrayValue.push(msg["card" + i]);
            }
            for (var i = 0; i < kaiGangCardArrayValue.length; i++) {
                var cardNode = this.createCard(playerNode, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, kaiGangCardArrayValue[i]);
                var self = this;
                this.addPutCard(cardNode, function () {
                    self.addPutCardTip(cardNode, msg);
                }, true);
            }
            this.resetCardLayout(playerNode);
        },
        //@Override 处理麻将吃、碰、杠
        handleCommand: function (playerNode, msg, type) {
            var tData = MjClient.data.sData.tData;
            var player = this.getPlayerInfoByName(playerNode.getName());
            if (msg && msg.uid && msg.uid != player.info.uid) {
                return;
            }
            if (msg && msg.cpginfo && msg.cpginfo.id != player.info.uid) {
                return;
            }
            this.handleOtherPlayerCards(msg);

            switch (type) {
                case this.AnimationType.CHI:
                    this.dealChi(playerNode, msg);
                    break;
                case this.AnimationType.PENG:
                    this.dealPeng(playerNode, msg);
                    break;
                case this.AnimationType.GANG:
                    this.dealGang(playerNode, msg);
                    break;
                case this.AnimationType.TING:
                    break;
            }
            MjClient.movingCard = null;
            this.checkPutCards(playerNode);
        },
        //播放开杠动画
        showKaiGangAnimation: function (playerNode) {

            var eatActionChild;
            var callback = function () {
                eatActionChild.visible = false;
            };
            if (this.is3DStyle()) {
                cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang0.plist", "spine/new_chipengganghu/chipenggang0.png");
                cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang1.plist", "spine/new_chipengganghu/chipenggang1.png");
                if (jsb.fileUtils.isFileExist("spine/new_chipengganghu/chipenggang2.plist")) {
                    cc.spriteFrameCache.addSpriteFrames("spine/new_chipengganghu/chipenggang2.plist", "spine/new_chipengganghu/chipenggang2.png");
                }
                ccs.armatureDataManager.addArmatureFileInfo("spine/new_chipengganghu/chipenggang.ExportJson");
                var delayTime = 0.5;
                eatActionChild = playerNode.getChildByName("node_animation");
                eatActionChild.removeAllChildren();
                eatActionChild.visible = true;
                eatActionChild.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(callback)));

                var kaiGang = new ccs.Armature("chipenggang");
                kaiGang.animation.play("kaigang", -1, 0);
                kaiGang.setPosition(cc.p(eatActionChild.width / 2, eatActionChild.height / 2));
                eatActionChild.addChild(kaiGang, 999999);
            } else {
                eatActionChild = playerNode.getChildByName("node_animation");
                eatActionChild.removeAllChildren();
                eatActionChild.visible = true;
                eatActionChild.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callback)));
                var projNode = new cc.Sprite("spine/kaigang/kaigang.png");
                projNode.setScale(0.0);
                projNode.runAction(cc.sequence(cc.scaleTo(0.2, 0.6), cc.scaleTo(0.3, 0.5)));
                eatActionChild.addChild(projNode, 999999);
            }
        },
        //特殊处理碰开杠第二张
        dealPeng: function(playerNode, msg) {
            var tData = MjClient.data.sData.tData;

            var pengCardArray = msg.cpginfo.pengchigang.peng;
            var pengCard  = pengCardArray[pengCardArray.length - 1 ].card;
            if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
                this.removeCard(playerNode, this.HandleCardType.Hand, pengCard, 2);
            } else {
                this.removeCard(playerNode, this.HandleCardType.Hand, null, 2);
            }

            for (var i = 0; i < 3; i++) {
                this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.Peng, pengCard); 
            }

            this.resetCardLayout(playerNode);
            this.showEatActionAnim(playerNode, this.AnimationType.PENG);

        },
        //显示开杠框
        showKaiGangBox: function (playerNode) {
            // playerNode.setVisible(true);
            var tData = MjClient.data.sData.tData;
            if (tData.lastPutCard == -1 && tData.lastPutCard2 == -1)
                return;
            var kaiGangKuang;
            if (tData.lastPutCard3 != -1)
                kaiGangKuang = MjClient.playui.jsBind.node_kaiGangKuang2._node;
            else
                kaiGangKuang = MjClient.playui.jsBind.node_kaiGangKuang._node;
            kaiGangKuang.setVisible(true);
            var cardNode1 = kaiGangKuang.getChildByName("card1");
            var cardNode2 = kaiGangKuang.getChildByName("card2");
            cardNode1.setVisible(tData.lastPutCard != -1);
            cardNode2.setVisible(tData.lastPutCard2 != -1);
            if (tData.lastPutCard != -1) {
                cardNode1.name = this.HandleCardType.MingGang;//利用明杠牌绘制牌面
                MjClient.playui.setCardSprite(cardNode1, tData.lastPutCard, true);
                cardNode1.name = "card1";//绘制完成后还原
            }
            if (tData.lastPutCard2 != -1) {
                cardNode2.name = this.HandleCardType.MingGang;//利用明杠牌绘制牌面
                MjClient.playui.setCardSprite(cardNode2, tData.lastPutCard2, true);
                cardNode2.name = "card2";//绘制完成后还原
            }
            if (tData.lastPutCard3 != -1) {
                var cardNode3 = kaiGangKuang.getChildByName("card3");
                var cardNode4 = kaiGangKuang.getChildByName("card4");
                cardNode3.setVisible(tData.lastPutCard3 != -1);
                cardNode4.setVisible(tData.lastPutCard4 != -1);
                if (tData.lastPutCard3 != -1) {
                    cardNode3.name = this.HandleCardType.MingGang;//利用明杠牌绘制牌面
                    MjClient.playui.setCardSprite(cardNode3, tData.lastPutCard3, true);
                    cardNode3.name = "card3";//绘制完成后还原
                }
                if (tData.lastPutCard4 != -1) {
                    cardNode4.name = this.HandleCardType.MingGang;//利用明杠牌绘制牌面
                    MjClient.playui.setCardSprite(cardNode4, tData.lastPutCard4, true);
                    cardNode4.name = "card4";//绘制完成后还原
                }
            }

        },
        // @Override 隐藏吃碰杠等按钮
        hideEatNodeChildren: function () {
            var eatArr = MjClient.playui.jsBind.node_eat;
            for (var key in eatArr) {
                if (eatArr[key]._node)
                    eatArr[key]._node.setVisible(false);
            }

        },
        // @Override 添加2D癞子标识
        addLaiZiIcon2D: function (cardNode) {
            if (!this.isCanAddLaiZiIcon(cardNode.tag)) {
                return;
            }

            var playerNodeName = cardNode.getParent().getName();
            var offIndex = this.getNodeIndexDefaultByName(playerNodeName);
            var cardName = cardNode.getName() || "";
            offIndex = offIndex === -1 ? 0 : offIndex;
            offIndex = cardName === this.HandleCardType.Hand ? 4 : offIndex;
            var laiZiPosArr = this.getHunIconPosition2D();
            var laiZiNode = this.getLaiZiIcon2D();
            laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
            laiZiNode.setRotation(-90 * offIndex);
            cardNode.addChild(laiZiNode);
        },
        // 可以胡牌时的禁止gang操作
        refuseGangWhenHu: function (cardTag) {
            var player = MjClient.playui.getPlayerInfoByName("node_down");
            var tData = MjClient.data.sData.tData;
            var canHuAfterGang = MjClient.majiang.canHuAfterGang(player.mjhand, cardTag, tData.hunCard);
            if (player && player.isZiMoHu && !canHuAfterGang) {
                MjClient.showToast("自摸必须胡牌");
                return true;
            } else if (tData.areaSelectMode.bihuType && player.eatFlag & 8) {
                MjClient.showToast("有胡必胡");
                return true;
            }
            return false;
        },
        isCanAutoPut:function(){
            return false;
        },
        // @Override 显示大结算
        createGameOverPanel: function(){
            return new majiang_gameOver_changSha();
        },
        //刷新打出去的牌
        resetPutCards:function(node){
            //重新删除添加，是为了2D 3D切换时可能会导致显示的顺序不一致
            this.removeCardsByName(node, this.HandleCardType.Put);
            var player = this.getPlayerInfoByName(node.getName());
            if(!player) return;
            for(var i = 0; i < player.mjput.length; i++){
                var putCard = this.createCard(node, this.CsdDefaultCardType.PutCardOne, this.HandleCardType.Put, player.mjput[i]);
                this.addJiIcon2D(putCard);
            }

            this.setLastPutCardNode();
            var self = this;
            var callback = function(){
                self.addPutCardTip();
            };
            var is3D = this.is3DStyle();
            if(is3D){
                this.resetPutCards3D(node, callback);
            }else{
                this.resetPutCards2D(node, callback);
            }
        },
        addJiIcon2D:function(cardNode)
        {
            var playerNode = cardNode.getParent();
            var pl = MjClient.playui.getPlayerInfoByName(playerNode.getName());
            MjClient.playui.frontShowedJiCards = MjClient.playui.frontShowedJiCards || {}; //这个只是前端记录，是否已经显示了这张牌的鸡牌标签

            if(pl.chongJiCard && pl.chongJiCard[cardNode.tag] && pl.chongJiCard[cardNode.tag] > 0 && ! MjClient.playui.frontShowedJiCards [cardNode.tag])
            {
                MjClient.playui.frontShowedJiCards [cardNode.tag] = true; //为了标记这张牌已经加个冲的字样
                var offIndex =  this.getNodeIndexDefaultByName(cardNode.getParent().getName());
                var laiZiPosArr = this.getHunIconPosition2D();
                var laiZiNode  = this.getJiTagIcon();
                laiZiNode.setPosition(laiZiPosArr[offIndex][0], laiZiPosArr[offIndex][1]);
                var _rotation = [0,-90 ,-180,-270];
                laiZiNode.setRotation( _rotation[offIndex]);
                cardNode.addChild(laiZiNode);
            }
            else {
                // cc.log("add ji ++++++++++++++++++++++++++ cardNode.tag  = " + cardNode.tag);
                // cc.log("add ji ++++++++++++++++++++++++++ pl.chongJiCard = " + JSON.stringify(pl.chongJiCard));
                // cc.log("add ji ++++++++++++++++++++++++++ MjClient.playui.frontShowedJiCards = " + JSON.stringify(MjClient.playui.frontShowedJiCards));
            }
        },
    });
}());

/**
 * 播放起手胡动画
 * @param  {object} node 头像节点 down/right/top/left
 * @param  {object} eD 起手胡事件 doQiShouHu 的数据 
 * @param  {number} off 玩家对应位置
 * @return {boolean} 是否播放成功
 */
var QiShouHuNode = {};
majiang_panel_changSha.prototype.playQiShouHuAnim = function (node, eD, off) {
    var uidHu = eD.uid;
    // var player = getUIPlayer(off); //舍弃旧函数 用新版的函数
    var player = MjClient.playui.getPlayerInfoByName(node.getName());



    if (!player || typeof player == 'undefined')
        return false;

    if (uidHu != player.info.uid)
        return false;

    // if(0 == off){
    //     var eat = MjClient.playui.jsBind.node_eat;
    //     var qshu_node = eat.layout_qshu._node;
    //     qshu_node.visible = false;
    // }

    var showCards = eD.showCards.slice();
    showCards.sort(function (a, b) {
        return a - b;
    })
    var qshuNode1 = node.getChildByName("img_qshu_layout");
    var qshuNode = qshuNode1.clone();
    QiShouHuNode["nodeQSH_" + off] = qshuNode1;
    if (!qshuNode1.uid || qshuNode1.uid != uidHu) {
        for (var i = 0; i < 20; i++) {
            if (QiShouHuNode["qshuNode_" + i]) {
                if (cc.sys.isObjectValid(QiShouHuNode["qshuNode_" + i]))
                    QiShouHuNode["qshuNode_" + i].removeFromParent();
                QiShouHuNode["qshuNode_" + i] = null;
            }
            if (QiShouHuNode["nodeQSH_" + i]) {
                QiShouHuNode["nodeQSH_" + i].showNum = 0;
                QiShouHuNode["nodeQSH_" + i].uid = null;
            }

        }
        qshuNode1.uid = uidHu;
        qshuNode1.showNum = 0;
    } else {
        qshuNode1.showNum++;
    }
    qshuNode1.showNum = qshuNode1.showNum % 3;
    var _num = qshuNode1.showNum;

    if (QiShouHuNode["qshuNode_" + _num]) {
        if (cc.sys.isObjectValid(QiShouHuNode["qshuNode_" + _num]))
            QiShouHuNode["qshuNode_" + _num].removeFromParent();
        QiShouHuNode["qshuNode_" + _num] = null;
    }
    QiShouHuNode["qshuNode_" + _num] = qshuNode;


    node.addChild(qshuNode, 999);

    // qshuNode.removeAllChildren();
    qshuNode.visible = true;
    qshuNode.setRotation(-off * 90);
    var down = MjClient.playui.jsBind.node_down;
    var out = down.img_handCard._node.clone();
    var outw = out.getSize().width;
    var outx = 227 - showCards.length / 2 * outw / 2;
    var outy = 48;
    out.setPosition(cc.p(0, outy));
    out.setScale(0.5);
    out.setAnchorPoint(cc.p(0.5, 0.5));
    var addFace = function(n, card) {
        var cardImg = MjClient.playui.getCardFaceImg3D(n);
        cardImg.x = card.width / 2;
        cardImg.y = card.height / 2;
        card.removeAllChildren();
        card.addChild(cardImg);
    }
    for (var i = 0; i < showCards.length; i++) {
        var card = out.clone();
        addFace(showCards[i], card);
        card.visible = true;
        card.setPositionX(outx + i * outw / 2);
        qshuNode.addChild(card);
    }

    if (eD.qshuName) {
        var imgPath = "playing/gameTable/qs_" + eD.qshuName + ".png";
        var nameSp = new cc.Sprite(imgPath);
        qshuNode.addChild(nameSp);


        if (off == 1) {
            nameSp.setRotation(off * 90);
            nameSp.setPositionX(nameSp.getPositionX() + 200)
            nameSp.setPositionY(nameSp.getPositionY() + 200);
            qshuNode.x += qshuNode.height * qshuNode1.showNum * qshuNode.getScale();
            nameSp.y += 100 * qshuNode1.showNum;
            nameSp.x -= 100 * qshuNode1.showNum;
        }
        if (off == 0) {
            nameSp.setAnchorPoint(cc.p(1, 0.5));
            nameSp.setPositionX(outx);
            nameSp.setPositionY(50);
            qshuNode.y += qshuNode.height * qshuNode1.showNum * qshuNode.getScale();;
        }
        if (off == 2) {
            nameSp.setAnchorPoint(cc.p(1, 0.5));
            nameSp.setPositionX(outx);
            nameSp.setPositionY(50);
            qshuNode.setRotation(360);
            qshuNode.y -= qshuNode.height * qshuNode1.showNum * qshuNode.getScale();;
        }

        if (off == 3) {
            nameSp.setRotation(off * 90);
            nameSp.setPositionX(nameSp.getPositionX() + 200);
            nameSp.setPositionY(nameSp.getPositionY() + 200);
            qshuNode.x -= qshuNode.height * qshuNode1.showNum * qshuNode.getScale();;
            nameSp.y += 100 * qshuNode1.showNum;
            nameSp.x += 100 * qshuNode1.showNum;
        }

    }


    if (eD.isNoQsHu) {
        var callBack = function () {
            qshuNode1.uid = null;
            qshuNode1.showNum = 0;
            for (var i = 0; i < 20; i++) {
                if (QiShouHuNode["qshuNode_" + i]) {
                    if (cc.sys.isObjectValid(QiShouHuNode["qshuNode_" + i]))
                        QiShouHuNode["qshuNode_" + i].removeFromParent();
                    QiShouHuNode["qshuNode_" + i] = null;
                }

                if (QiShouHuNode["nodeQSH_" + i]) {
                    QiShouHuNode["nodeQSH_" + i].showNum = 0;
                    QiShouHuNode["nodeQSH_" + i].uid = null;
                }

            }
        }
        qshuNode.stopAllActions();
        qshuNode.runAction(cc.sequence(cc.DelayTime(3), cc.CallFunc(callBack)));

    }



    this.showQiShouHuScore(eD.score, off, node);

    return true;
}

// 显示 分数 功能 
majiang_panel_changSha.prototype.showQiShouHuScore = function (score, off, _node) {
    if (!score)
        return;
    // 精度修正
    var revise = function(num, times) {
        // times = 1/允许误差
        times = times || 1e6;
        return Math.round(num * times) / times;
    };
    
    
    var getIndexNane = function (index) {
        switch (index) {
            case 0:
                return "node_down";
                break;
            case 1:
                return "node_right";
                break;
            case 2:
                return "node_top";
                break;
            case 3:
                return "node_left";
                break;
        }
    };
    for (var i = 0; i < 4; i++) {
        var node = MjClient.playui.getNodeByName(getIndexNane(i));
        var player = MjClient.playui.getPlayerInfoByName(getIndexNane(i));
        if (!player || !node) continue;
        node.removeChildByName("qiShouHuScore");

        var iconImg = new cc.Sprite(node.getName() == _node.getName() ? "playground/gang_addIcon.png" : "playground/gang_subIcon.png");
        var tempScore = node.getName() == _node.getName() ? score : score / (MjClient.MaxPlayerNum - 1);
        tempScore = revise(tempScore);
        var scoreText = new ccui.TextAtlas(tempScore + "", node.getName() == _node.getName() ? "playground/gang_addText.png" : "playground/gang_subText.png", 50, 73, ".");

        node.addChild(iconImg, 1001);
        iconImg.addChild(scoreText);

        iconImg.setName("qiShouHuScore");
        if (node.getName() == "node_down")
            setWgtLayout(iconImg, [0.04, 0.1], [0.5, 0.3], [0, 0]);
        else if (node.getName() == "node_right")
            setWgtLayout(iconImg, [0.04, 0.1], [0.8, 0.5], [0, 0]);
        else if (node.getName() == "node_top")
            setWgtLayout(iconImg, [0.04, 0.1], [0.5, 0.85], [0, 0]);
        else if (node.getName() == "node_left")
            setWgtLayout(iconImg, [0.04, 0.1], [0.1, 0.5], [0, 0]);

        scoreText.setPosition(iconImg.width + scoreText.width / 2, iconImg.height / 2);

        iconImg.setScale(iconImg.getScale() * 0.8);
        iconImg.runAction(cc.sequence(cc.scaleTo(0.1, iconImg.getScale() / 0.8), cc.delayTime(2), cc.removeSelf()));
    }
}

// 现实起手胡按钮
// 返回true显示成功   false不需要显示起手胡按钮
majiang_panel_changSha.prototype.haveQiShouHu = function () {
    var sData = MjClient.data.sData;
    for (var uid in sData.players) {
        var p = sData.players[uid];
        if (p.qiShouHu && Object.keys(p.qiShouHu).length > 0) {
            return true;
        }
    }
    return false;
}

majiang_panel_changSha.prototype.playQiShouHuEffect = function (qshuName) {

    var soundName = null;
    if (qshuName == "zhongtull" || qshuName == "liuliushun") // 中途六六顺 六六顺
        soundName = "liuliushun";
    else if (qshuName == "zhongtusx" || qshuName == "sixi") // 中途四喜 四喜
        soundName = "dasixi";
    else if (qshuName == "banbanhu") // 将将胡 板板胡
        soundName = "banbanhu";
    else if (qshuName == "queyise") // 缺一色
        soundName = "queyise";

    if (soundName)
        this.playEffectInPlay(soundName, false);
}

/**
 *  播放音效
 **/
majiang_panel_changSha.prototype.playEffectInPlay = function(cardTag, isLoop){

    var voiceType = MjClient.gameType;// this.getVoiceType() == 0 ? MjClient.gameType;
    var origSounds = GameSound4Play[voiceType][cardTag.toString()];

    var sounds = origSounds.concat();
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[tData.uids[tData.curPlayer]];
    if (!player){
        player = sData.players[this.getSelfUid()];
    }
    if(this.getVoiceType() !== 0){
        for (var i = 0; i < sounds.length; i++){
            var resetPath = sounds[i].replace("/nv/", "/nv_local/");
            var fullFilePath = "sound/" + resetPath + ".mp3";
            if (jsb.fileUtils.isFileExist(fullFilePath)){
                sounds[i] = resetPath;
            }
        }
    }

    if (player && player.info.sex == 1){
        for (var i = 0; i < sounds.length; i++){
            var resetPath = sounds[i].replace("/nv/", "/nan/").replace("/nv_local/", "/nan_local/");
            var fullFilePath = "sound/" + resetPath + ".mp3";
            if (jsb.fileUtils.isFileExist(fullFilePath)){
                sounds[i] = resetPath;
            }
        }
    }
    var randomIndex = Math.floor(Math.random() * sounds.length);
    var soundFile = sounds[randomIndex];
    if(!jsb.fileUtils.isFileExist("sound/" + soundFile + "" + ".mp3")){
        soundFile = sounds[0];
    }
    var str = "sound/"+soundFile+".mp3";
    cc.log("======soundFile str ",str)
    return this.reallyPlayEffect(str, isLoop);
};

/**
 *  刷新玩家操作按钮
 **/
majiang_panel_changSha.prototype.updatePlayerEatBtn = function () {
    this.hideEatNodeChildren();

    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var player = sData.players[this.getSelfUid()];
    // cc.log(" =====lms -----eat flag  ", player.mjState == TableState.waitEat || player.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    // cc.log(" =====lms -----eat flag  ", player.mjState, TableState.waitEat, player.mjState , TableState.waitPut, tData.uids[tData.curPlayer] == SelfUid())

    if (player.mjState == TableState.waitEat
        || player.mjState == TableState.waitPut
        && tData.uids[tData.curPlayer] == SelfUid()) {

    }
    else {
        return;
    }

    var eatNodeArr = this.getPlayerEatNode();
    var btnScale = this.isIPad() ? 0.12 : 0.18;
    // var spaceScale = this.isIPad() ? 1.4 : 1.5;
    var off_y = this.isIPad() ? 1.7 : 2.0;

    var bigWidth = 0;
    for (var i = 0; i < eatNodeArr.length; i++) {
        var eatBtn = eatNodeArr[i];
        if (eatBtn.width * btnScale > bigWidth) {
            bigWidth = eatBtn.width * btnScale;
        }
    }

    var space = MjClient.size.width / 10;
    var totalSpace = (eatNodeArr.length - 1) * space;
    var totaWidth = bigWidth * eatNodeArr.length + totalSpace;
    var firstPos_x = (MjClient.size.width - totaWidth) / 2;
    for (var k = 0; k < eatNodeArr.length; k++) {
        var btn = eatNodeArr[k];
        btn.visible = true;
        var pct = (firstPos_x + k * (space + bigWidth)) / MjClient.size.width;
        if (eatNodeArr.length <= 2) {
            pct = (firstPos_x + k * (space + bigWidth) + 200) / MjClient.size.width;
        }
        // else if(eatNodeArr.length == 1){
        //     pct = (firstPos_x + k * (space + bigWidth) + 300) / MjClient.size.width;
        // }
        setWgtLayout(btn, [0, btnScale], [pct, 0], [0, off_y], false, false);
    }
    MjClient.playui.addLightAniEatBtns(); // 设置麻将的吃碰杠按钮特效
    this.checkBtnWithPlayerFlag();
};

/**
 *  处理麻将明杠
 **/
majiang_panel_changSha.prototype.dealMingGang = function (playerNode, msg) {
    var gangCard = msg.card;

    if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
        this.removeCard(playerNode, this.HandleCardType.Hand, gangCard, 3);
    } else {
        this.removeCard(playerNode, this.HandleCardType.Hand, null, 3);
    }

    for (var i = 0; i < 4; i++) {
        this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.MingGang, gangCard);
    }

    this.resetCardLayout(playerNode);
    if (msg.isKaiGang) return;
    this.showEatActionAnim(playerNode, this.AnimationType.BU);
};

/**
 *  处理麻将暗杠
 **/
majiang_panel_changSha.prototype.dealAnGang = function (playerNode, msg) {
    var gangCard = msg.card;

    if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
        this.removeCard(playerNode, this.HandleCardType.Hand, gangCard, 4);
    } else {
        this.removeCard(playerNode, this.HandleCardType.Hand, null, 4);
    }

    for (var i = 0; i < 4; i++) {
        this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.AnGang, gangCard);
    }

    this.resetCardLayout(playerNode);
    if (msg.isKaiGang) return;
    this.showEatActionAnim(playerNode, this.AnimationType.BU);
};

/**
 *  处理麻将碰杠
 **/
majiang_panel_changSha.prototype.dealPengGang = function (playerNode, msg) {
    var gangCard = msg.card;

    if (MjClient.rePlayVideo != -1 || playerNode.getName() == "node_down") {
        this.removeCard(playerNode, this.HandleCardType.Hand, gangCard);
        this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
    } else {
        this.removeCard(playerNode, this.HandleCardType.Hand);
        this.removeCard(playerNode, this.HandleCardType.Peng, gangCard, 3);
    }

    for (var i = 0; i < 4; i++) {
        this.createCard(playerNode, this.CsdDefaultCardType.EatCardFront, this.HandleCardType.PengGang, gangCard);
    }

    this.resetCardLayout(playerNode);
    if (msg.isKaiGang) return;
    this.showEatActionAnim(playerNode, this.AnimationType.BU);
};

/**
 * [createEndOnePanel 创建小结算界面]
 */
majiang_panel_changSha.prototype.createEndOnePanel = function(){
    MjClient.playui._huTimes = 0;
    return new majiang_winGamePanel_changSha();
};


/**新版的一炮多响  */
majiang_panel_changSha.prototype.checkTipDuoHu = function(node, d) {
    if(MjClient.MaxPlayerNum == 2) return;//二人 不存在一炮多响
    MjClient.playui._huTimes++;

    if(MjClient.playui._huTimes >= 2){
        var eatActionNode = node.getChildByName("node_animation");
        var duoHuImg = eatActionNode.getChildByTag(190507);
        if (duoHuImg) {
            duoHuImg.visible = true;
            return;
        }

        var duoHuImg = new ccui.ImageView();
        duoHuImg.setName("HuImg");
        duoHuImg.loadTexture("spine/duohu/duohu.png");
        duoHuImg.setScale(0.65);

        eatActionNode.addChild(duoHuImg, 0, 190507);
        var worldPos = eatActionNode.convertToWorldSpace(duoHuImg.getPosition());
        duoHuImg.x = duoHuImg.x + cc.winSize.width / 2 - worldPos.x;
        duoHuImg.y = duoHuImg.y + cc.winSize.height * 0.68 - worldPos.y;
        eatActionNode.visible = true;
    }


}






