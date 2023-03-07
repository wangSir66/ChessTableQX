// 96扑克
var playPanel_96poker;

(function() {
    playPanel_96poker = playLayer_ziPai.extend({
        getJsBind: function(){
            var jsBind = {
                _event: {
                    roundEnd: function() {
                        var self = this;
                        var sData = MjClient.data.sData;
                        if (MjClient.data.sData.tData.roundNum <= 0 && !MjClient.playui.isCoinField()) {
                            var layer = MjClient.playui.createGameOverLayer();
                            layer.setVisible(false);
                            self.addChild(layer, 500);
                        }

                        //抓猪的话，播放动画后再创建
                        if(sData.tData.zhuaZhuPl == undefined || sData.tData.zhuaZhuPl == -1) {
                            if (!MjClient.endoneui) {
                                self.addChild(MjClient.playui.createEndOneLayer(), 400);
                            }
                        }
                    },
                },
                img_banner: {
                    _layout: [[0.35, 0.35], [0.295, 1.01], [0, 0]],
                    btn_wanFa: {
                        _click: function(sender) {
                            MjClient.playui.showWanFaUi(true);
                        }
                    },
                    btn_setting: {
                        _click: function() {
                            MjClient.Scene.addChild(new setting_96poker(), 6000);
                            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Shezhi", {uid:SelfUid(),gameType:MjClient.gameType});
                        }
                    },
                    btn_changeBg:{
                        _run: function() {
                            this.loadTextureNormal("playing/ziPaiBanner/wenhao.png");
                            this.setContentSize(this.getNormalTextureSize());
                        },
                        _click: function() {
                            postEvent("EZP_rule");
                        }
                    },
                },
                img_gameName: {
                    _layout: [[0.16, 0], [0.5, 0.68], [0, 0]]
                },
                text_roundInfo: {
                    _layout: [[0.11, 0.11], [0.5, 0.51], [0, 0]],
                    _run: function() {
                        this.ignoreContentAdaptWithSize(true);
                        //this.setString(MjClient.playui.getGameCnDesc());
                        this.setString("");
                    }
                },
                layout_cardNum: {
                    _layout: [[0.085, 0.085], [0.5, 0.58], [0, 0]],
                    img_card: {
                        _run:function() {
                            this.refreshCardsTotal = function(isRemove) {
                                var sData = MjClient.data.sData;
                                var tData = sData.tData;
                                var maiPai = (tData.maxPlayer == 2 && tData.areaSelectMode.isMaiPai) ? 19 : 0;
                                var next = MjClient.majiang.getAllCardsTotal() - tData.cardNext;
                                //next -= maiPai;
                                if(next <= 0) {
                                    this.visible = false; 
                                }
                                else {
                                    this.visible = true;
                                    if(isRemove) {
                                        var children = this.getChildren();
                                        var childNum = this.getChildrenCount();
                                        if(childNum > 0 && childNum + 1 > next && next < 20) {
                                            //少于20张时开始减高度
                                            children[childNum - 1].removeFromParent(true);
                                        }
                                    }
                                    else {
                                        this.removeAllChildren();
                                        next = next > 20 ? 20 : next;
                                        for(var i = 1; i <= next; i++) {
                                            var child = ccui.ImageView("playing/96poker/img/paidui.png");
                                            child.setPosition(cc.p(this.width/2, this.height/2 + i * 0.8));
                                            this.addChild(child);
                                        }
                                    }
                                }
                            }
                        },
                        _event: {
                            initSceneData: function() {
                                this.refreshCardsTotal();
                                this.getParent().getChildByName("text_cardNum").refreshText();
                            },
                            mjhand: function() {
                                this.refreshCardsTotal();
                                this.getParent().getChildByName("text_cardNum").refreshText();
                            }
                        }
                    }
                },
                img_cutLine: {
                    _event: {
                        initSceneData: function() {
                            var self = this;
                            setTimeout(()=>{
                                MjClient.hasPut = false;
                                MjClient.playui.checkCutLineVisible(self);
                            }, 0.5);
                            MjClient.playui.checkCutLineVisible(this);
                        },
                        waitPut: function() {
                            MjClient.playui.checkCutLineVisible(this);
                        },
                        HZTieCard: function() {
                            MjClient.playui.checkCutLineVisible(this);
                        }
                    },
                },
                btn_putCrad:{
                    _visible: false,
                },
                btn_sort: {
                    _layout: [[0.07, 0.07], [0.04, 0.22], [0, 0]],
                },
                node_eatChoice: {
                    _run: function() {
                        this.zIndex += 1;  //避免表情发到头像下边
                    },
                    btn_cancel: {
                        _run: function(){
							//重载
                            this.changeLayout = function() {
                                if (MjClient.playui.getPlayersNum() == 4) {return;}
                                setWgtLayout(this, [0, 0.16], [0.78, 0.3], [0, 1.12]);
                            }
                        },
                    },
                    btn_tie: {
                        _visible: false,
                        _layout: [[0, 0.1], [0.5, 0], [0, 2.5]],
                        bg_img: {
                            _run: function() {
                                MjClient.playui.doBtnLightAction(this);
                            }
                        },
                        _click: function() {
                            var tData = MjClient.data.sData.tData;
                            MjClient.playui.hideEatBtns();
                            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                                cmd: "HZTieCard",
                                cardNext: tData.cardNext,
                                card: tData.lastPutCard
                            });
                        }
                    },
                    btn_chi: {
                        _visible: false,
                        _layout: [[0, 0.1], [0.5, 0], [1.3, 3.8]],
                        bg_img: {
                            run: function() {
                                MjClient.playui.doBtnLightAction(this);
                            }
                        },
                        _click: function() {
                            MjClient.playui.commitEatCard();
                        }
                    },
                    _event: {
                        HZTieCard: function() {
                            MjClient.playui.updateEatBtns();
                        },
                    }
                },
                btn_chat: {
                    _layout: [[55 / 1280, 0], [0.97, 0.2], [0, -0.2]],
                    _run: function() {
                        //重载
                        this.changeLayout = function() {
                            // if (MjClient.playui.getPlayersNum() == 4) {return;}
                            // setWgtLayout(this, [55 / 1280, 0], [0.97, 0.187], [0, 0]);
                        }
                        
                    },
                },
                btn_voice: {
                    _layout: [[43 / 1280, 0], [0.97, 0.35], [0, -0.2]],
                    _run: function() {
                        this.visible = !MjClient.playui.isCoinField();
                        initVoiceData();
                        cc.eventManager.addListener(getTouchListener(), this);
                        if (MjClient.isShenhe) this.visible = false;

                        //重载
                        this.changeLayout = function() {
                            // if (MjClient.playui.getPlayersNum() == 4) {return;}
                            // setWgtLayout(this, [43 / 1280, 0], [0.91, 0.1875], [0, 0]);
                        }
                    }
                },
                node_down: {
                    layout_head: {
                        _layout: [[0.1, 0.1], [0.04, 0.05], [0, 0], true],
                        _run: function() {
                            this.setTouchEnabled(true);
                            MjClient.playui.setNodePos(this);
                        },
                        img_headFrame: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkHeadEffectVisible(this);
                                }
                            }
                        },
                        text_trustCountDown: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkTrustCountDownVisible(this);
                                }
                            }
                        },
                        text_huXiNum: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                        img_ren: {
                            _visible:false,
                            text_ren: {
                                _visible: true,
                                _run:function() {
                                    this.setString("x0");
                                },
                                _event: {
                                    HZTieCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZChiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    MJPeng: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZWeiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZGangCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZNewCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    onlinePlayer: function() {
                                        if(!MjClient.playui.isInPlay()) {
                                            this.setString("x0");
                                        }
                                    },
                                    mjhand: function() {
                                        this.setString("x0");
                                    },
                                    initSceneData: function() {
                                        MjClient.playui.updateRenNum(this);
                                    }
                                }
                            }
                        },
                        img_piao: {
                            _visible:false,
                            _event: {
                                MJJiazhu: function(d) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(d.uid && d.piaoFen >= 0 && pl.info.uid == d.uid) {
                                        this.visible = true;
                                        this.loadTexture("playing/96poker/img/piao" + d.piaoFen + ".png");
                                    }
                                },
                                initSceneData: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                mjhand: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                onlinePlayer: function(){
                                    // if(!MjClient.playui.isInPlay()) {
                                    //     this.visible = false;
                                    // }
                                },
                                waitJiazhu: function() {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    img_putCard: {
                        _visible: false,
                        _layout: [[0.224, 0.224], [0.5, 0.6], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                            var userData = {
                                scale: this.getScale(),
                                pos: this.getPosition()
                            };
                            this.setUserData(userData);
                        },
                        _event: {
                            HZTieCard: function() {
                                this.visible = false;
                            },
                        }
                    },
                    sp_ready: {
                        _layout: [[0.07, 0.07], [0.5, 0.5], [-2.5, -2.5]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        }
                    },
                    layout_replayCards: {
                        _layout: [[0.07, 0.07], [0.5, 0.5], [-2.5, -2.5]],
                        _visible: false,
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                //MjClient.playui.updateHandCardByEat(this, "mjtie", d);
                            },
                        }
                    },
                    layout_eatCards: {
                        _visible: true,
                        _layout: [[0.14, 0.14], [0.005, 0.23], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {

                                MjClient.playui.updateEatCard(this, "mjtie", d);
                            },
                            EZP_paiBei: function(idx) {
                                MjClient.playui.changePaiBei(this, idx);
                            },
                            roundEnd : function() {
                            }
                        }
                    },
                    layout_handCards: {
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateHandCardByEat(this, "mjtie", d);
                            },
                        }
                    },
                    layout_outCards: {
                        _layout: [[0.14, 0.14], [0.7, 0.5], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            EZP_layout: function() {}
                        },
                    },
                    layout_outExCards: {            //摆放自己摸出来的弃牌
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.initOutExCard(this);
                            },
                            EZP_layout: function() {},
                            clearCardUI: function() {
                                this.removeAllChildren();
                            }
                        },
                    },
                    layout_eatDisplay: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        img_zhao: {
                            _visible: false
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.displayEatLabel(this, "mjtie", d);
                            },
                            roundEnd: function(d) {
                                if(MjClient.data.sData.tData.zhuaZhuPl >= 0) {
                                    var endCb = function() {
                                        if (!MjClient.endoneui) {
                                            MjClient.playui.jsBind._node.addChild(MjClient.playui.createEndOneLayer(), 400);
                                        }
                                    }
                                    MjClient.playui.displayEatLabel(this, "zhuazhu", d, endCb);
                                }
                            }
                        }
                    }
                },
                node_right: {
                    _run: function() {
                        //重置layout_head节点
                        MjClient.playui.resetHeadNode(this);
                    },
                    layout_head: {
                        _layout: [[0.1, 0.1], [0.04, 0.05], [0, 0], true],
                        _run: function() {
                            this.setTouchEnabled(true);
                            MjClient.playui.setNodePos(this);
                        },
                        img_headFrame: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkHeadEffectVisible(this);
                                }
                            }
                        },
                        text_trustCountDown: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkTrustCountDownVisible(this);
                                }
                            }
                        },
                        img_huXiBg: {
                            _visible: false,
                        },
                        text_huXiNum: {
                            _visible: false,
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                        text_coinNum: {
                            _run: function() {

                            }
                        },
                        img_ren: {
                            _visible:false,
                            text_ren: {
                                _visible: true,
                                _run:function() {
                                    this.setString("x0");
                                },
                                _event: {
                                    HZTieCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZChiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    MJPeng: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZWeiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZGangCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZNewCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    onlinePlayer: function() {
                                        if(!MjClient.playui.isInPlay()) {
                                            this.setString("x0");
                                        }
                                    },
                                    mjhand: function() {
                                        this.setString("x0");
                                    },
                                    initSceneData: function() {
                                        MjClient.playui.updateRenNum(this);
                                    }
                                }
                            }
                        },
                        img_piao: {
                            _visible:false,
                            _event: {
                                MJJiazhu: function(d) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(d.uid && d.piaoFen >= 0 && pl.info.uid == d.uid) {
                                        this.visible = true;
                                        this.loadTexture("playing/96poker/img/piao" + d.piaoFen + ".png");
                                    }
                                },
                                initSceneData: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                mjhand: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                onlinePlayer: function(){
                                    // if(!MjClient.playui.isInPlay()) {
                                    //     this.visible = false;
                                    // }
                                },
                                waitJiazhu: function() {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    img_putCard: {
                        _layout: [[0.224, 0.224], [0.73, 0.75], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                            var userData = {
                                scale: this.getScale(),
                                pos: this.getPosition()
                            };
                            this.setUserData(userData);
                        },
                        _event: {
                            HZTieCard: function() {
                                this.visible = false;
                            },
                        }
                    },
                    sp_ready: {
                        _layout: [[0.07, 0.07], [0.5, 0.5], [2.5, 2.5]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        }
                    },
                    layout_replayCards: {
                        _layout: [[0.1, 0.1], [0.85, 0.81], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateHandCardByEat(this, "mjtie", d);
                            },
                        }
                    },
                    layout_eatCards: {
                        _layout: [[0.14, 0.14], [1 - 0.005, 0.75], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateEatCard(this, "mjtie", d);
                            },
                            EZP_paiBei: function(idx) {
                                MjClient.playui.changePaiBei(this, idx);
                            },
                            roundEnd : function() {
                            }
                        }
                    },
                    layout_outCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            EZP_layout: function() {},
                        },
                    },
                    layout_outExCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.initOutExCard(this);
                            },
                            EZP_layout: function() {},
                            clearCardUI: function() {
                                this.removeAllChildren();
                            }
                        },
                    },
                    layout_eatDisplay: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        img_zhao: {
                            _visible: false
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.displayEatLabel(this, "mjtie", d);
                            },
                            roundEnd: function(d) {
                                if(MjClient.data.sData.tData.zhuaZhuPl >= 0) {
                                    var endCb = function() {
                                        if (!MjClient.endoneui) {
                                            MjClient.playui.jsBind._node.addChild(MjClient.playui.createEndOneLayer(), 400);
                                        }
                                    }
                                    MjClient.playui.displayEatLabel(this, "zhuazhu", d, endCb);
                                }
                            }
                        }
                    },
                },
                node_left: {
                    _run: function() {
                        //重置layout_head节点
                        MjClient.playui.resetHeadNode(this);
                        //提高层级，防止分数被node_down门牌覆盖
                        var down = this.getParent().getChildByName("node_down");
                        this.zIndex = down.zIndex + 1;
                    },
                    layout_head: {
                        _layout: [[0.1, 0.1], [0.04, 0.05], [0, 0], true],
                        _run: function() {
                            this.setTouchEnabled(true);
                            MjClient.playui.setNodePos(this);
                        },
                        img_headFrame: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkHeadEffectVisible(this);
                                }
                            }
                        },
                        text_trustCountDown: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkTrustCountDownVisible(this);
                                }
                            }
                        },
                        img_huXiBg: {
                            _visible: false,
                        },
                        text_huXiNum: {
                            _visible: false,
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                        img_ren: {
                            _visible:false,
                            text_ren: {
                                _visible: true,
                                _run:function() {
                                    this.setString("x0");
                                },
                                _event: {
                                    HZTieCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZChiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    MJPeng: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZWeiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZGangCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZNewCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    onlinePlayer: function() {
                                        if(!MjClient.playui.isInPlay()) {
                                            this.setString("x0");
                                        }
                                    },
                                    mjhand: function() {
                                        this.setString("x0");
                                    },
                                    initSceneData: function() {
                                        MjClient.playui.updateRenNum(this);
                                    }
                                }
                            }
                        },
                        img_piao: {
                            _visible:false,
                            _event: {
                                MJJiazhu: function(d) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(d.uid && d.piaoFen >= 0 && pl.info.uid == d.uid) {
                                        this.visible = true;
                                        this.loadTexture("playing/96poker/img/piao" + d.piaoFen + ".png");
                                    }
                                },
                                initSceneData: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                mjhand: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                onlinePlayer: function() {
                                    // if(!MjClient.playui.isInPlay()) {
                                    //     this.visible = false;
                                    // }
                                },
                                waitJiazhu: function() {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    img_putCard: {
                        _layout: [[0.224, 0.224], [0.27, 0.75], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                            var userData = {
                                scale: this.getScale(),
                                pos: this.getPosition()
                            };
                            this.setUserData(userData);
                        },
                        _event: {
                            HZTieCard: function() {
                                this.visible = false;
                            },
                        }
                    },
                    sp_ready: {
                        _layout: [[0.07, 0.07], [0.5, 0.5], [-2.5, 2.5]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        }
                    },
                    layout_replayCards: {
                        _layout: [[0.1, 0.1], [0.15, 0.81], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateHandCardByEat(this, "mjtie", d);
                            },
                        },
                    },
                    layout_eatCards: {
                        _layout: [[0.14, 0.14], [0.005, 0.76], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateEatCard(this, "mjtie", d);
                            },
                            EZP_paiBei: function(idx) {
                                MjClient.playui.changePaiBei(this, idx);
                            },
                            roundEnd : function() {
                            }
                        }
                    },
                    layout_outCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            EZP_layout: function() {},
                        },
                    },
                    layout_outExCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.initOutExCard(this);
                            },
                            EZP_layout: function() {},
                            clearCardUI: function() {
                                this.removeAllChildren();
                            }
                        },
                    },
                    layout_eatDisplay: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        img_zhao: {
                            _visible: false
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.displayEatLabel(this, "mjtie", d);
                            },
                            roundEnd: function(d) {
                                if(MjClient.data.sData.tData.zhuaZhuPl >= 0) {
                                    var endCb = function() {
                                        if (!MjClient.endoneui) {
                                            MjClient.playui.jsBind._node.addChild(MjClient.playui.createEndOneLayer(), 400);
                                        }
                                    }
                                    MjClient.playui.displayEatLabel(this, "zhuazhu", d, endCb);
                                }
                            }
                        }
                    }
                },
                node_xing: {
                    layout_head: {
                        _layout: [[0.1, 0.1], [0.04, 0.05], [0, 0], true],
                        _run: function() {
                            this.setTouchEnabled(true);
                            MjClient.playui.setNodePos(this);
                        },
                        img_headFrame: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkHeadEffectVisible(this);
                                }
                            }
                        },
                        text_trustCountDown: {
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.checkTrustCountDownVisible(this);
                                }
                            }
                        },
                        img_huXiBg: {
                            _visible: false,
                        },
                        text_huXiNum: {
                            _visible: false,
                            _event: {
                                HZTieCard: function() {
                                    MjClient.playui.updateHuXi(this);
                                }
                            }
                        },
                        img_ren: {
                            _visible:false,
                            text_ren: {
                                _visible: true,
                                _run:function() {
                                    this.setString("x0");
                                },
                                _event: {
                                    HZTieCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZChiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    MJPeng: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZWeiCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZGangCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    HZNewCard: function() {
                                        MjClient.playui.updateRenNum(this);
                                    },
                                    onlinePlayer: function() {
                                        if(!MjClient.playui.isInPlay()) {
                                            this.setString("x0");
                                        }
                                    },
                                    mjhand: function() {
                                        this.setString("x0");
                                    },
                                    initSceneData: function() {
                                        MjClient.playui.updateRenNum(this);
                                    }
                                }
                            }
                        },
                        img_piao: {
                            _visible:false,
                            _event: {
                                MJJiazhu: function(d) {
                                    var off = MjClient.playui.getUIOffByNode(this);
                                    var pl = MjClient.playui.getUIPlayer(off);
                                    if(d.uid && d.piaoFen >= 0 && pl.info.uid == d.uid) {
                                        this.visible = true;
                                        this.loadTexture("playing/96poker/img/piao" + d.piaoFen + ".png");
                                    }
                                },
                                initSceneData: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                mjhand: function(d) {
                                    MjClient.playui.showPiaoFlag(this);
                                },
                                onlinePlayer: function(){
                                    // if(!MjClient.playui.isInPlay()) {
                                    //     this.visible = false;
                                    // }
                                },
                                waitJiazhu: function() {
                                    this.visible = false;
                                }
                            }
                        }
                    },
                    img_putCard: {
                        _layout: [[0.224, 0.224], [0.73, 0.6], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                            var userData = {
                                scale: this.getScale(),
                                pos: this.getPosition()
                            };
                            this.setUserData(userData);
                        },
                        _event: {
                            HZTieCard: function() {
                                this.visible = false;
                            },
                        }
                    },
                    sp_ready: {
                        _layout: [[0.07, 0.07], [0.5, 0.5], [2.5, -2.5]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        }
                    },
                    layout_replayCards: {
                        _layout: [[0.1, 0.1], [0.85, 0.05], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateHandCardByEat(this, "mjtie", d);
                            },
                        }
                    },
                    layout_eatCards: {
                        _layout: [[0.14, 0.14], [1 - 0.005, 0.23], [0, 0]],
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.updateEatCard(this, "mjtie", d);
                            },
                            EZP_paiBei: function(idx) {
                                MjClient.playui.changePaiBei(this, idx);
                            },
                            roundEnd : function() {
                            }
                        }
                    },
                    layout_outCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            EZP_layout: function() {}
                        }
                    },
                    layout_outExCards: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        _event: {
                            initSceneData: function() {
                                MjClient.playui.initOutExCard(this);
                            },
                            EZP_layout: function() {},
                            clearCardUI: function() {
                                this.removeAllChildren();
                            }
                        },
                    },
                    layout_eatDisplay: {
                        _run: function() {
                            MjClient.playui.setNodePos(this);
                        },
                        img_zhao: {
                            _visible: false
                        },
                        _event: {
                            HZTieCard: function(d) {
                                MjClient.playui.displayEatLabel(this, "mjtie", d);
                            },
                            roundEnd: function(d) {
                                if(MjClient.data.sData.tData.zhuaZhuPl >= 0) {
                                    var endCb = function() {
                                        if (!MjClient.endoneui) {
                                            MjClient.playui.jsBind._node.addChild(MjClient.playui.createEndOneLayer(), 400);
                                        }
                                    }
                                    MjClient.playui.displayEatLabel(this, "zhuazhu", d, endCb);
                                }
                            }
                        }
                    }
                },
                pnl_piao: {
                    _visible: false,
                    _layout:[[5/1280, 5/720], [0.449, 0.1153], [0, 0]],
                    _run:function() {
                        MjClient.playui.initPiaoBtns(this);
                    },
                    _event: {
                        waitJiazhu: function() {
                            this.visible = true;
                        },
                        initSceneData: function() {
                            this.visible = false;
                            var pl = MjClient.playui.getUIPlayer(0);
                            if(!pl) return;
                            var tData = MjClient.data.sData.tData;
                            if (tData.tState == TableState.waitJiazhu && pl.piaoFen == -1 && tData.areaSelectMode.piaoFen > 0) {
                                this.visible = true;
                            }
                        },
                        MJJiazhu: function(d) {
                            if(d.uid == SelfUid() && d.piaoFen >= 0) {
                                this.visible = false;
                            }
                        }
                    }
                }
            };
            return jsBind;
        },
        ctor: function() {
            this._super("Play_ZiPai96poker.json");

            //调整俱乐部返回大厅按钮位置
            var _parentNode = MjClient.playui._downNode.getParent();
            var backHallBtn = _parentNode.getChildByName("backhallbtn");
            if(cc.sys.isObjectValid(backHallBtn)) {
                var num = this.getPlayersNum();
                if (num == 2) {
                    setWgtLayout(backHallBtn, [0.036, 0], [0.72, 0.96], [0, 0]);
                } else {
                    setWgtLayout(backHallBtn, [0.036, 0], [0.66, 0.96], [0, 0]);
                }
            }

            //玩法描述面板
            MjClient.playui.jsBind._node.addChild(new roundRule_ziPai(roundRule_ziPai.getRoundRules()), 1);
            var pnlRule = MjClient.playui.roundRule.jsBind._node.getChildByName("layout_panel");
            var posX = {x:0.622, ipX:0.635};
            if(this.getPlayersNum() == 2) {
                posX = {x:0.69, ipX:0.7};       //2人玩法没有定位按钮，重新调整坐标 
            }
            setWgtLayout(pnlRule, [1, 0.51], [isIPhoneX() ? posX.ipX : posX.x, 0.38], [0, 0]);
            MjClient.playui.roundRule.setTextParams({size:25});

            return true;
        },
    });
}());

//根据人数和方位重新设定头像节点(更好的UI适配)
playPanel_96poker.prototype.resetHeadNode = function(node) {
    var pNode = node.getParent();
    var tData = MjClient.data.sData.tData;
    var name = node.getName();

    //水平head模板
    var hTempHead = pNode.getChildByName("node_left").getChildByName("layout_head_temp");
    //垂直head模板
    var vTempHead = pNode.getChildByName("node_right").getChildByName("layout_head_temp");

    var setRealHead = function(temp) {
        var realHead = temp.clone();
        node.addChild(realHead, temp.zIndex);
        realHead.visible = true;
        realHead.setName('layout_head');
        var chatBg = realHead.getChildByName("img_chatBg");
        var sp = cc.Sprite.create("animate/voice/0.png");
        sp.setName("sp_voice");
        realHead.getChildByName("img_chatBg").addChild(sp);
        sp.setPosition(cc.p(chatBg.width * chatBg.scaleX * 0.3, chatBg.height * chatBg.scaleY * 0.6));
        var tempHead = node.getChildByName("layout_head_temp");
        if(cc.sys.isObjectValid(tempHead)) {
            tempHead.visible = false;
        }
    }

    if(tData.maxPlayer == 2) {
        if(name == 'node_left') {
            setRealHead(hTempHead);
        }
    }else if(tData.maxPlayer == 3) {
        if(name == 'node_left') {
            setRealHead(vTempHead);
        }else if(name == 'node_right') {
            setRealHead(vTempHead);
        }
    }else if(tData.maxPlayer == 4) {
        if(name == 'node_left') {
            setRealHead(vTempHead);
        }else if(name == 'node_right') {
            setRealHead(hTempHead);
        }
    }
}

//重设头像坐标
playPanel_96poker.prototype.setNodePos = function(node) {
    var pnl = node.getParent();
    var cfg = Layout_96poker_cfg[node.getName()];
    if(!pnl || !cfg) {
        return;
    }
    var lay = cfg[this.getPlayersNum()][pnl.getName()];
    if(lay) {
        if(isIPhoneX() && lay.iphoneX) {
            setWgtLayout(node, lay.iphoneX.pct, [lay.iphoneX.pos[0]/1280, lay.iphoneX.pos[1]/720], [0, 0], lay.isMax);
        }else {
            setWgtLayout(node, lay.pct, [lay.pos[0]/1280, lay.pos[1]/720], [0, 0], lay.isMax);
        }
        
        if(lay.child) {
            this.setHeadChildPos(node, lay.child);
        }
    }
};

//重设头像下子节点坐标
playPanel_96poker.prototype.setHeadChildPos = function(node, obj) {
    for(var k in obj) {
        var ref = node.getChildByName(k);
        if(!cc.sys.isObjectValid(ref)) {
            continue;
        }
        var atr = obj[k];
        if(isIPhoneX() && atr.iphoneX) {
            setWgtLayout(ref, atr.iphoneX.pct, atr.iphoneX.pos, [0, 0]);
        }else {
            setWgtLayout(ref, atr.pct, atr.pos, [0, 0]);
        }

        if(atr.size) {
            ref.setContentSize(cc.size(atr.size[0], atr.size[1]));
        }
        if(atr.anc) {
            ref.setAnchorPoint(cc.p(atr.anc[0], atr.anc[1]));
        }
    }
};

//Override
playPanel_96poker.prototype.changeLayout = function(uiNode) {
}

//Override
playPanel_96poker.prototype.calculateHuXi = function(off) {
    var pl = this.getUIPlayer(off);
    //var huxi = MjClient.huzi.getHuxi({}, pl, null, false);
    //var huxi = this.getTableHuXi(off);
    var huxi = MjClient.majiang.getTableHuXi(MjClient.data.sData, pl);
    
    if (off == 0) {
        //huxi += MjClient.majiang.getHandHuxi(MjClient.HandCardArr);
    }

    return huxi;
};

//Override 一律不显示
playPanel_96poker.prototype.checkFangZhuVisible = function(node) {
    node.visible = false;
};

//获取指定类型的弃牌
playPanel_96poker.prototype.getOutCardByType = function(pl, type) {
    var ret = [];
    //test uid
    // if(pl.info.uid == 1000182) {
    //     pl.mjput = [];
    //     pl.mjputType = [];
    //     pl.mjput.push(101, 201, 301, 401, 102, 202, 302, 302, 402, 103, 203, 303, 403, 105, 205, 305, 405);
    //     pl.mjputType.push(0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1);
    // }

    if(!pl || !pl.mjput || !pl.mjputType || 
        pl.mjput.length != pl.mjputType.length) {
        return ret;
    }

    //test all
    // pl.mjput = [];
    // pl.mjputType = [];
    // pl.mjput.push(101, 201, 301, 401, 102, 202, 302, 302, 402, 103, 203, 303, 403, 105, 205, 305, 405);
    // pl.mjputType.push(0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1);

    var off = this.getUIOffByUid(pl.info.uid);
    var putLen = pl.mjput.length;
    if (this.isCurPlayer(off) && pl.mjput.length > 0 && MjClient.data.sData.tData.currCard == pl.mjput[pl.mjput.length - 1]) {
        putLen -= 1;
    }
    
    for(var i = 0; i < putLen; i++) {
        if(pl.mjputType[i] == type) {
            ret.push(pl.mjput[i]);
        }
    }
    return ret;
}

//Override
playPanel_96poker.prototype.updateHandCardByEat = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl || !this.isCurEatPlayer(msg, off)) {
        return;
    }

    eatType = this.apartGangType(eatType, msg);
    var pos = msg.gang0Pos >= 0 ? msg.gang0Pos : (pl[eatType].length - 1);
    var cardArr = this.getEatCardArr(eatType, off, pos); //todo
    this.removeEatArrFromHand(eatType, cardArr, msg, off);
    this.refreshHandCard(off);
};

//Override
playPanel_96poker.prototype.apartGangType = function(eatType, msg) {
    var eatType = eatType;
    if (eatType == "mjgang") {
        var gangInfo = msg.gangInfo;
        if (gangInfo && gangInfo.gang0Pos >= 0) {
            eatType = "mjgang1";
        } else {
            eatType = "mjgang0";
        }
    }
    return eatType;
};

//Override
playPanel_96poker.prototype.getEatCardArr = function(eatType, off, pos) {
    var pl = this.getUIPlayer(off);
    if(!pl || !pl[eatType] || pl[eatType].length == 0) {
        return [];
    }

    var temp = [];
    var cardArr = [];
    var arr = pl[eatType];
    var idx = typeof(pos) == "undefined" ? (arr.length - 1) : pos;

    //如果是杠牌,对象数据重组
    if(eatType == 'mjchi') {
        temp = arr[idx].eatCards;
    }else if(eatType == 'mjgang0') {
        var gangArr = arr[idx];
        temp = temp.concat(gangArr.gang);
        temp = temp.concat(gangArr.ex);
    }else if(eatType == 'mjgang1') {
        //双龙 会得到两列数据
        var gangArr = arr[idx];
        for(var i = 0; i < gangArr.length; i++) {
            temp = temp.concat(gangArr[i].gang);
            temp = temp.concat(gangArr[i].ex);
            if(temp.length > 0) {
                cardArr.push(temp);
            }
            temp = [];
        }
    }
    else {
        temp = arr[idx];
    }

    if(temp.length > 0) {
        temp = temp.slice();
    }

    //配合基类接口，此处改为二位数组
    if(eatType != 'mjgang1' && temp.length > 0) {
        cardArr.push(temp);  //双龙已经放进去了
    }
    
    return cardArr;
};

//Override //从旧mjsort找出所在索引，对应的就是eatNode所在的索引
playPanel_96poker.prototype.getEatCard = function(eatType, off, pos) {
    var pl = this.getUIPlayer(off);
    if(!pl.oldMjSort) {
        return -1;
    }

    /*
        此处需要注意
        1.假如在同一帧执行N次addChild(), 则getChildren()返回的列表顺序是当前add的顺序
        2.假如在是在addChild()之后下一帧，则getChildren()返回的列表顺序是zIndex的顺序
    */
    /*
        此处因为是获取之前添加的门牌节点列，所以返回的是zIndex的顺序，
        因此，如果dx < 0，则需要同步执行oldMjsort的逆序才能取到正确的门牌列节点
    */
    var oldMjSort = pl.oldMjSort.slice();
    var org = this.getEatCardOrientation(off);
    if(org.dx == -1) {
        oldMjSort.reverse();
    }

    //查找
    for(var i = 0; i < oldMjSort.length; i++) {
        var d = oldMjSort[i];
        if(d.name == eatType && d.pos == pos) {
            return i;
        }
    }

    return -1;
};

//Override
playPanel_96poker.prototype.removeGangFromHand = function(eatType, cardArr, off, msg) {
    if(!cardArr || cardArr.length == 0) {
        return;
    }

    //注.半招->满招 不删手牌
    if(msg && msg.gang0Pos >= 0) {
        return;
    }

    cardArr = cardArr[0];  //是个单元素二维数组
    var del = [];
    var gang = cardArr.slice(0, 4);
    var ex = cardArr.slice(4, cardArr.length);
    if(msg && !msg.isGangHand) {
        //非起手龙剔除非手牌
        var info = msg.gangInfo;
        if(info) {
            if(info.tiePos < 0) {
                //ex数据中手牌
                del = del.concat(ex);
            }
            if(info.weiPos < 0) {
                //删除gang中的前三张
                del = del.concat(gang.slice(0, 3));
            }
        }
    }else {
        del = cardArr;
    }

    for (var i = 0; i < del.length; i++) {
        this.removeHandCard(del[i], off);
    }
};

//移除双龙手牌
playPanel_96poker.prototype.removeShuangLongFromHand = function(off, msg) {
    if(msg && msg.gangInfo) {
        var info = msg.gangInfo;
        if(info.gang) {
            var del = info.gang;
            if(info.ex && info.ex.length > 0) {
                del = del.concat(info.ex)
            }

            for(var i = 0; i < del.length; i++) {
                this.removeHandCard(del[i], off);
            }
        }
    }
}

//Override
playPanel_96poker.prototype.removeEatCardsFromHand = function(eatType, cardArr, off, msg) {
    if(!cardArr || cardArr.length == 0) {
        return;
    }

    cardArr = cardArr.slice();
    if(eatType == 'mjchi') {
        if(msg && (msg.fromTie || msg.chiCards.tiePos >= 0)) {
            cardArr = []; //桌面贴牌吃牌，不删手牌
        }
    }

    //除最后一张都删掉
    for (var i = 0; i < cardArr.length; i++) {
        for(var j = 0; j < cardArr[i].length-1; j++) {
            this.removeHandCard(cardArr[i][j], off);
        }
    }
};

//Override
playPanel_96poker.prototype.removeEatArrFromHand = function(eatType, cardArr, msg, off) {
    if (eatType == "mjtie" || eatType == "mjchi" || 
        eatType == "mjpeng" || eatType == "mjwei") {
        this.removeEatCardsFromHand(eatType, cardArr, off, msg);
    } else if(eatType == "mjgang0") {
        this.removeGangFromHand(eatType, cardArr, off, msg);
    } else if(eatType == 'mjgang1') {
        this.removeShuangLongFromHand(off, msg);
    }
};

//Override
playPanel_96poker.prototype.isCurEatPlayer = function(msg, off) {
    if (msg && msg.cpginfo) {
        return (msg.cpginfo.uid == this.getUIPlayer(off).info.uid);
    } else {
        return this.isCurPlayer(off);
    }
};

//Override
playPanel_96poker.prototype.updateEatCard = function(node, eatType, msg) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!this.isCurEatPlayer(msg, off) || !pl) {
        return;
    }

    eatType = this.apartGangType(eatType, msg);
    var pos = msg.gang0Pos >= 0 ? msg.gang0Pos : (pl[eatType].length - 1);
    var cardArr = this.getEatCardArr(eatType, off, pos);
    var eatCardNode = this.getEatCardNode(eatType, cardArr, off, pos);
    var lastLineCount = this.getLastEatNodeLineCount(cardArr.length, off);
    this.dislpayEatCardNode(eatCardNode, lastLineCount, false, eatType, off, msg);
};

//Override
playPanel_96poker.prototype.getLastEatNodeLineCount = function(curLineCount, off) {
    var indexInUids = this.getIndexInUids(off);
    var pl = MjClient.data.sData.players[MjClient.data.sData.tData.uids[indexInUids]];
    var totalLinesCount = pl.mjtie.length + pl.mjchi.length + pl.mjpeng.length + 
        pl.mjwei.length + pl.mjgang0.length + pl.mjgang1.length * 2; //双龙占2列
    return totalLinesCount - curLineCount;
};

//Override
playPanel_96poker.prototype.getEatCardNode = function(eatType, cardArr, off, pos) {
    var uiNode = this.getUINode(off);
    var pl = this.getUIPlayer(off);
    if(!pl || pos == undefined) {
        return;
    }
    var orientation = this.getEatCardOrientation(off);
    cardArr = cardArr.slice();
    var eatCardNode = new cc.Node();
    ////贴->吃比较特殊，需要置灰两张
    var isFromTie = function() {
        return (eatType == 'mjchi' && pl[eatType][pos].fromTie);
    }
    for (var i = 0; i < cardArr.length; i++) {
        // if((orientation.dy == -1 || off == 0) && eatType != 'mjgang0' && eatType != 'mjgang1') {
        //     //特殊.最后一张牌要显示在最高位置
        //     //cardArr[i].unshift(cardArr[i].pop());
        //     //逆序显示 fix.自己也要逆序
        //     cardArr[i].reverse();
        // }
        if(eatType == 'mjgang0' || eatType == 'mjgang1') {
            var c = cardArr[i][3];
            cardArr[i].splice(3, 1);
            if(orientation.dy < 0) {
                //逆向显示的需要把最后一张杠牌置顶
                cardArr[i].unshift(c);
            }else if(orientation.dy > 0) {
                //正向显示 1.先提出最后一张杠牌 2.逆序 3.杠牌置于末尾 
                cardArr[i].reverse();
                cardArr[i].push(c);
            }
        }else {
            if(orientation.dy < 0) {
                if(isFromTie()) {
                    cardArr[i].reverse();
                }else {
                    //逆向显示的需要把最后一张牌置顶
                    cardArr[i].unshift(cardArr[i].pop());
                }
            }else if(orientation.dy > 0) {
                if(!isFromTie()) {
                    //正向显示的需要把除掉最后一张的牌全部逆序
                    cardArr[i].unshift(cardArr[i].pop());
                    cardArr[i].reverse();
                }
            }
        }

        for (var j = 0; j < cardArr[i].length; j++) {
            var showType = this.getEatCardShowType(eatType, cardArr[i][j], j, off, i, pos);
            var card = this.getNewCard("out", cardArr[i][j], off, showType == 0);
            if (showType == 1) {
                this.addShaderForCard(card);
            } else if (showType == 3) {
                card.setColor(cc.color(170, 170, 170));
            }

            if (orientation.dy == -1) {
                eatCardNode.addChild(card);
            } else {
                eatCardNode.addChild(card, cardArr[i].length - j);
            }

            //横向偏移23, 纵向偏移28 美术指定
            card.x = orientation.dx * (card.width * card.scaleX) * 0.5 + orientation.dx * i * 23;
            card.y = orientation.dy * (card.height * card.scaleY) * 0.5 + orientation.dy * j * 28;
            card.zIndex = orientation.dy * (i + cardArr[i].length - j) + 100 * i * orientation.dx;

            eatCardNode.cardWidth = eatCardNode.cardWidth || card.width * card.scaleX;
        }
    }
    return eatCardNode;
};

playPanel_96poker.prototype.addShaderForCard = function(img_card) {
    if(!cc.sys.isObjectValid(img_card)) {
        return;
    }
    var path = this.getPaiBeiSrcByIdx(this.getPaiBeiIdx());
    img_card.loadTexture(path);
    img_card.isTurn = true;
};

//Override
playPanel_96poker.prototype.getEatCardOffest = function(eatType, totalCount, cardIndex, off) {
    var uiNode = this.getUINode(off);
    if (uiNode.getName() == "node_left" || uiNode.getName() == "node_right") {
        //return totalCount - cardIndex;
        return cardIndex; 
    } else {
        return cardIndex;
    }
};

//Override
playPanel_96poker.prototype.getEatCardOrientation = function(off) {
    var uiNode = this.getUINode(off);
    var orientation = {
        dx: 1,
        dy: 1,
        anchorX: 0,
        anchorY: 0
    };

    var num = this.getPlayersNum();
    var name = uiNode.getName();
    if(num == 4) {
        if(name == 'node_left') {
            orientation.dy = -1;
        }else if(name == 'node_right') {
            orientation.dy = -1;
        }else if(name == 'node_xing') {
            orientation.dx = -1;
            orientation.dy = -1;
        }
    }

    if(num == 3) {
        if(name == 'node_left') {
            orientation.dy = -1;
        }
        else if(name == 'node_right') {
            orientation.dx = -1;
            orientation.dy = -1;
        }
    }

    if(num == 2) {
        if(name == 'node_left') {
            orientation.dy = -1;
        }
    }

    return orientation;
};

//Override
playPanel_96poker.prototype.getEatCardPoint = function(off) {
    var uiNode = this.getUINode(off);
    var layout_eatCards = uiNode.getChildByName("layout_eatCards");
    var point = {
        dx: 1,
        x: 0,
        y: 0
    };

    var num = this.getPlayersNum();
    var name = uiNode.getName();
    if(num == 4) {
        if(name == 'node_left') {
            point.x = layout_eatCards.width;
            point.y = layout_eatCards.height;
        }else if(name == 'node_right') {
            point.x = layout_eatCards.width;
            point.y = layout_eatCards.height;
        }else if(name == 'node_xing') {
            point.dx = -1;
            point.x = layout_eatCards.width;
            point.y = layout_eatCards.height;
        }
    }
    if(num == 3) {
        if(name == 'node_left') {
            point.y = layout_eatCards.height;
        }else if(name == 'node_right') {
            point.dx = -1;
            point.x = layout_eatCards.width;
            point.y = layout_eatCards.height;
        }
    }
    if(num == 2) {
        if(name == 'node_left') {
            point.y = layout_eatCards.height;
        }
    }

    return point;
};

//Override
playPanel_96poker.prototype.dislpayEatCardNode = function(eatCardNode, lastLineCount, isInit, eatType, off, msg) {
    var orientation = this.getEatCardOrientation(off);
    var layout_eatCards = this.getUINode(off).getChildByName("layout_eatCards");
    var point = this.getEatCardPoint(off);
    var targetY = point.y;
    var targetX = point.x + point.dx * lastLineCount * 23;   //美术给定的偏移值
    var mergedX = null;       //被合并而移除掉的列所在x(其后所有列需要前移) 

    //查找已经存在的eatNode节点(如果存在，覆盖之)
    var find = function(idx) {
        if(idx == -1) {
            return null;
        }

        //牌值匹配
        // var traverse = function(v) {
        //     for(var i = 0; i < cards.length; i++) {
        //         if(v.indexOf(cards[i]) < 0) {
        //             return false;
        //         }
        //     }
        //     return true;
        // }

        var child = layout_eatCards.children;
        return child[idx];
        // for(var i = 0; i < child.length; i++) {
        //     var cardPnl = child[i];
        //     var pChild = cardPnl.children;
        //     var values = [];
        //     for(var j = 0; j < pChild.length; j++) {
        //         values.push(pChild[j].tag);
        //     }
        //     if(traverse(values)) {
        //         //找到了
        //         return cardPnl;
        //     }
        // }

        //return null; 
    }

    //已存在的桌面牌组需要考虑6种情况: 
    /*
        HZChiCard:  贴->吃 //单行替换
        HZGangCard: 贴->招 | 勺->招 | 半招->全招(msg.gang0Pos判定)  //mjgang0 单行替换
        HZGangCard: 勺+贴 -> 招 //mjgang0 两行并为一行 其后节点需前移
        HZGangCard: 半招->双龙  //mjgang1 单行变两行 其后节点需后移
    */
    var node = null; //插入/替换的目标列
    var offset = 0; //偏移  //单行插入=1 两行合并=-1 覆盖=0
    var zIdx = null;
    if(!isInit && msg) {
        var idx = -1;
        if(eatType == 'mjchi') {
            //有可能是贴->吃
            var d = msg.chiCards;
            if(d && d.tiePos >= 0) {
                //找出贴牌组
                idx = this.getEatCard('mjtie', off, d.tiePos);
            }
        }else if(eatType == 'mjgang0') {
            //半招变满招
            if(msg.gang0Pos >= 0) {
                //半招->满招
                idx = this.getEatCard('mjgang0', off, msg.gang0Pos); //半招变全招(只在此处产生)
            }else {
                var d = msg.gangInfo;
                if(d && d.tiePos != undefined && d.weiPos != undefined) {
                    if(d.tiePos >= 0 && d.weiPos >= 0) {
                        //勺+贴->招
                        //贴列
                        var idx1 = this.getEatCard('mjtie', off, d.tiePos);
                        var nodeTie = find(idx1);
                        //勺列
                        var idx2 = this.getEatCard('mjwei', off, d.weiPos);
                        var nodeShao = find(idx2);
                        if(cc.sys.isObjectValid(nodeTie) && 
                            cc.sys.isObjectValid(nodeShao)) {
                            //比较X
                            if(orientation.dx > 0) {
                                if(nodeTie.x < nodeShao.x) {
                                    idx = idx1;
                                    mergedX = nodeShao.x;
                                    //删除勺列
                                    nodeShao.removeFromParent(true);
                                    node = nodeTie;
                                }else {
                                    idx = idx2;
                                    mergedX = nodeTie.x;
                                    //删除贴列
                                    nodeTie.removeFromParent(true);
                                    node = nodeShao;
                                }
                                //后置节点偏移方向
                                offset = -1;
                            }else {
                                if(nodeTie.x > nodeShao.x) {
                                    idx = idx1;
                                    mergedX = nodeShao.x;
                                    //删除勺列
                                    nodeShao.removeFromParent(true);
                                    node = nodeTie;
                                }else {
                                    idx = idx2;
                                    mergedX = nodeTie.x;
                                    //删除贴列
                                    nodeTie.removeFromParent(true);
                                    node = nodeShao;
                                }
                                //后置节点偏移方向
                                offset = 1;
                            }
                        }
                    }else if(d.tiePos >= 0 && d.weiPos < 0) {
                        idx = this.getEatCard('mjtie', off, d.tiePos);
                    }else if(d.tiePos < 0 && d.weiPos >= 0) {
                        idx = this.getEatCard('mjwei', off, d.weiPos);
                    }
                }
            }
        }else if(eatType == 'mjgang1') {
            //变双龙，插一列，插入所在列的所有其它node节点要往后移
            var d = msg.gangInfo;
            if(d && d.gang0Pos >= 0) {
                if(d.weiPos >= 0) {
                    idx = this.getEatCard('mjwei', off, d.weiPos);
                }else {
                    //手牌产生双龙
                    idx = this.getEatCard('mjgang0', off, d.gang0Pos);
                }
                offset = 1;
            }
        }   

        node = node || find(idx);
        if(cc.sys.isObjectValid(node)) {
            cc.log("索引", eatType, idx, "坐标", node.x, node.targetX, node.getChildrenCount(), node.getParent().getChildrenCount());
            for(var i = 0; i < node.children.length; i++) {
                cc.log("牌值", node.children[i].tag);
            }

            cc.log("当前要加的列");
            for(var i = 0; i < eatCardNode.children.length; i++) {
                cc.log("牌值", eatCardNode.children[i].tag);
            }

            cc.log("整个父节点");
            var n = node.getParent().children;
            console.log("打印父节点----------------------", n.length);
            
            for(var i = 0; i < n.length; i++) {
                var name = n[i].getName();
                console.log('名称=', name);
                if(name == 'EAT_CARD_NODE') {
                    var nd = n[i];
                    for(var j = 0; j < nd.children.length; j++) {
                        cc.log("所有列的牌值", nd.children[j].tag);
                    }
                }
            }
            console.log("改变之前", targetX);
            targetX = node.targetX != undefined ? node.targetX : node.x;
            console.log("改变之后", targetX);
            zIdx = node.zIndex;
            node.visible = false;
            node.removeFromParent(true);
        }                                                                                          
    }

    eatCardNode.x = targetX;
    eatCardNode.targetX = targetX;
    eatCardNode.y = targetY;
    eatCardNode.zIndex = zIdx != null ? zIdx : lastLineCount * orientation.dx;
    eatCardNode.setName("EAT_CARD_NODE");
    layout_eatCards.addChild(eatCardNode);

    //插入之前先先重新定位
    var dx = 23;
    var resetNodeX = function() {
        if(offset != 0) {
            var child = layout_eatCards.children;
            for(var i = 0; i < child.length; i++) {
                var cardPnl = child[i];
                if(offset > 0) {
                    //合并往后移 当offset>0时，一定有orientation.dx < 0
                    if(mergedX != null) {
                        if(cardPnl.x < mergedX) {
                            cardPnl.x += dx * offset;
                        }
                    }else {
                        //插入往后移
                        if(orientation.dx > 0) {
                            if(cardPnl.x > targetX) {
                                cardPnl.x += dx * offset;
                            }
                        }else {
                            if(cardPnl.x < targetX) {
                                cardPnl.x -= dx * offset;
                            }
                        }
                    }
                    //考虑合并写法
                    //cardPnl.x += dx * offset * orientation.dx;
                }else if(offset < 0 && mergedX != null) {
                    //合并往前移
                    if(orientation.dx > 0) {
                        if(cardPnl.x > mergedX) {
                            cardPnl.x += dx * offset;
                        }
                    }else if(orientation.dx < 0) {
                        if(cardPnl.x < mergedX) {
                            cardPnl.x -= dx * offset;
                        }
                    }
                    //考虑合并写法
                    //cardPnl.x += dx * offset * orientation.dx;
                }
            }
        }
    }

    if (!isInit) {
        resetNodeX();
        var aniTime = this.getAniTimeByType("eat");
        if (this.isAniParallel()) { // 1段
            eatCardNode.x = targetX + point.dx * 3 * eatCardNode.cardWidth;
            eatCardNode.runAction(cc.moveTo(aniTime, cc.p(targetX, targetY)));
        } else { // 3段动画
            var card = eatCardNode.children[0];
            var targetScale = card.scale;
            for (var i = 0; i < eatCardNode.children.length; i++) {
                card = eatCardNode.children[i];
                card.scale = targetScale * 1.7;
                card.runAction(cc.scaleTo(aniTime[0], targetScale));
            }

            eatCardNode.x = point.x + point.dx * 7.5 * eatCardNode.cardWidth;
            var action = cc.sequence(
                cc.delayTime(aniTime[0] + aniTime[1]),
                cc.moveTo(aniTime[2], targetX, targetY).easing(cc.easeSineIn())
            );
            eatCardNode.runAction(action);
        }
    }
};

//Override
playPanel_96poker.prototype.initEatCard = function(node, isRoundEndMsg) {
    if ((MjClient.rePlayVideo != -1 || !this.isInPlay()) && !isRoundEndMsg) {
        return;
    }

    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    var lastLineCount = 0;

    //跑胡需要走这里 但游戏未开始时需要规避
    if (!pl || !pl.mjsort) {return;}
    
    for (var i = 0; i < pl.mjsort.length; i++) {
        var mjSort = pl.mjsort[i];
        var cardArr = this.getEatCardArr(mjSort.name, off, mjSort.pos);
        var eatCardNode = this.getEatCardNode(mjSort.name, cardArr, off, mjSort.pos);
        this.dislpayEatCardNode(eatCardNode, lastLineCount, true, mjSort.name, off);
        lastLineCount += cardArr.length;
    }
};

//Override
playPanel_96poker.prototype.getEatCardShowType = function(eatType, card, cardIndex, off, idx, pos) {
    var showType = 2;
    var pl = this.getUIPlayer(off);
    var dir = this.getEatCardOrientation(off);
    if(!pl || !dir) {
        return showType;
    }
    var info = pl[eatType][pos];
    if(eatType == 'mjgang1') {
        info = info[idx];  //双龙有两列结构
    }
    if (eatType == "mjtie") {
        if(dir.dy > 0) {
            showType = cardIndex == 1 ? 3 : 2;
        }else {
            showType = cardIndex == 0 ? 3 : 2;
        }
    } else if (eatType == "mjchi") {
        if(dir.dy > 0) {
            showType = cardIndex == 2 ? 3 : 2;
        }else {
            showType = cardIndex == 0 ? 3 : 2;
        }
        if(info && info.fromTie && cardIndex == 1) {  //中间那张也要置灰
            showType = 3;
        }
    } else if (eatType == "mjwei") {
        if(dir.dy > 0) {
            showType = cardIndex == 2 ? 2 : 1;
        }else {
            showType = cardIndex == 0 ? 2 : 1;
        }
    } else if (eatType == "mjgang0" || eatType == "mjgang1") {
        if(info && info.ziMo) {
            //中间三张杠需要明牌 其余->暗
            var len = info.gang.length + (info.ex ? info.ex.length : 0);
            if(dir.dy > 0) {
                showType = (cardIndex == (len-1) || cardIndex < (len-4)) ? 2 : 1; 
            }else {
                showType = (cardIndex == 0 || cardIndex > 3) ? 2 : 1;
            }
        }
    }
    return showType;
};

//Override
playPanel_96poker.prototype.displayEatLabel = function(node, eatType, msg, cb) {
    var off = this.getUIOffByNode(node);
    if (!this.isCurEatPlayer(msg, off)) {
        return;
    }
    var eatType = this.apartGangType(eatType, msg);
    var uiNode = this.getUINode(off);
    var layout_eatCards = uiNode.getChildByName("layout_eatDisplay");
    var eatLabel = layout_eatCards.getChildByName("img_chi");
    var eatLabelZhao = layout_eatCards.getChildByName("img_zhao");
    

    //动态加载图片
    var labels = {
        mjtie: "img_tie",
        mjchi: "img_chi",
        mjpeng: "img_peng",
        mjwei: "img_shao",
        mjgang0: "img_long",
        mjgang1: "img_shuanglong",
        hu: "img_hu",
        zhuazhu: "img_zhuazhu"
    };
    if (eatType == 'mjgang0') {
        var gangInfo = msg.gangInfo;
        if(!gangInfo) {
            return;
        }
        var ex = gangInfo.ex;
        if(!ex || ex.length == 0) {
            if(!msg.isGangHand) {
                labels.mjgang0 = "img_zou";
            }else {
                labels.mjgang0 = "img_long";
            }
        }else if(ex.length == 1) {
            labels.mjgang0 = "img_banzhao";
        }else if(ex.length == 2) {
            labels.mjgang0 = "img_manzhao";
        }
    }

    var path = "playing/96poker/eat/";  
    var imgName = labels[eatType];
    if(imgName == 'img_shuanglong' || imgName == 'img_manzhao' || 
        imgName == 'img_banzhao' || imgName == 'img_zhuazhu') {
        eatLabel.visible = false;
        eatLabelZhao.visible = true;
        eatLabelZhao.loadTexture(path + imgName + ".png");
    }else {
        eatLabel.visible = true;
        eatLabelZhao.visible = false;
        eatLabel.loadTexture(path + imgName + ".png");
    }
    var imgEat = eatLabel.visible ? eatLabel : eatLabelZhao;

    //改为直接在头像上播放
    // eatLabel.visible = false;  
    // var head = uiNode.getChildByName("layout_head");
    // if(!cc.sys.isObjectValid(head)) {
    //     return;
    // }
    // var imgEat = eatLabel.clone();
    // imgEat.visible = true; 
    // imgEat.x = head.width/2;
    // imgEat.y = head.height/2 + 10;
    // head.addChild(imgEat);    

    if (this.isAniParallel()) {
        imgEat.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            imgEat.visible = false;
            //imgEat.removeFromParent();
            if(cb) {
                cb();
            }
        })));
    } else {
        if (imgEat.getUserData()) {
            imgEat.scale = imgEat.getUserData().scale;
        } else {
            imgEat.setUserData({
                scale: imgEat.scale
            });
        }

        var initScale = imgEat.scale;
        imgEat.runAction(cc.sequence(cc.scaleTo(0.3, initScale * 1.5), cc.delayTime(0.5), cc.scaleTo(0.3, initScale), cc.callFunc(() => {
            imgEat.visible = false;
            //imgEat.removeFromParent();
        })));
    }
};

//是否需要独立显示弃牌中的摸牌
playPanel_96poker.prototype.isShowOutExCards = function() {
    return this.getPlayersNum() == 3;
}

//Override
playPanel_96poker.prototype.showOutCardAnimation = function(node) {
    var off = this.getUIOffByNode(node);
    var tData = MjClient.data.sData.tData;
    if (this.getIndexInUids(off) != (tData.curPlayer - 1 + tData.maxPlayer) % tData.maxPlayer) { // 不是发牌玩家上家
        return;
    }

    var pl = this.getUIPlayer(off);
    var uiNode = this.getUINode(off);

    if (!node.isVisible()) { // 没有展示牌
        return;
    }

    if (pl.mjput.length <= 0) {
        return;
    }

    var isEx = false;
    if(pl.mjputType && pl.mjputType.length == pl.mjput.length && this.isShowOutExCards()) {
        isEx = pl.mjputType[pl.mjputType.length - 1] == 1;
    }
    var endPos = this.getOutCardPos(off, isEx);
    var outLayout = uiNode.getChildByName("layout_outCards");
    if(this.isShowOutExCards() && isEx) {
        outLayout = uiNode.getChildByName("layout_outExCards")
    }
    var outCard = this.getNewCard("out", pl.mjput[pl.mjput.length - 1], off, false);
    outCard.setPosition(endPos);
    outLayout.addChild(outCard);

    var anmEndPos = outLayout.convertToWorldSpace(cc.p(endPos.x, endPos.y)); // 动画结束坐标
    var actTime = this.getAniTimeByType("land");

    outCard.setOpacity(0);
    var sc = outCard.getScale();
    outCard.setScale(1);
    var spa = cc.spawn(cc.fadeIn(0.05), cc.scaleTo(0.05, sc));
    var self = this;
    outCard.runAction(cc.sequence(cc.delayTime(actTime - 0.05), spa, cc.callFunc(function(sender) {
        sender.visible = true;
        self.setGray(sender, isEx);
    })));

    // 播放缩小动画到outcard的所在位置
    //var scy = (outCard.height * outCard.scaleY) / node.height;
    var scy = sc;  //fix
    var spa = cc.spawn(cc.scaleTo(actTime, scy), cc.fadeTo(actTime, 255 * 0.6), cc.moveTo(actTime, cc.p(anmEndPos)))
    var seq = cc.sequence(spa, cc.callFunc(function() {
        node.setOpacity(255);
        node.visible = false;
    }));

    node.stopAllActions();
    node.runAction(seq);
};

//Override
playPanel_96poker.prototype.initOutCard = function(node) {
    if (!this.isInPlay()) return;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.removeAllChildren();

    //test 4
    // if(pl.info.uid == 1000183) {
    //     pl.mjput = [];
    //     pl.mjputType = [];
    //     pl.mjput.push(101, 201, 301, 401, 102, 202, 302, 302, 402, 103, 203, 303, 403, 105, 205, 305, 405);
    //     pl.mjputType.push(0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1);
    // }

    var mjput = pl.mjput.slice();
    var putLen = mjput.length;

    //3人玩法，此处只放从手中打出的弃牌
    if(this.isShowOutExCards()) {
        mjput = this.getOutCardByType(pl, 0);
        putLen = mjput.length;
    }else {
        if (this.isCurPlayer(off) && pl.mjput.length > 0 && MjClient.data.sData.tData.currCard == pl.mjput[pl.mjput.length - 1]) {
            putLen -= 1;
        }
    }

    for (var i = 0; i < putLen; i++) {
        var pos = this.getOutCardPos(off);
        var orientation = this.getOutCardOrientation(off, true);
        var outCard = this.getNewCard("out", mjput[i], off, false);
        this.setGray(outCard, false);
        outCard.setPosition(pos);
        outCard.visible = true;
        node.addChild(outCard);
    }
};

playPanel_96poker.prototype.initOutExCard = function(node) {
    if (!this.isInPlay() || this.getPlayersNum() != 3) return;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    node.removeAllChildren();

    //3人玩法特有，此处只放(摸牌)弃牌
    var mjput = this.getOutCardByType(pl, 1);
    var putLen = mjput.length;
    for (var i = 0; i < putLen; i++) {
        var pos = this.getOutCardPos(off, 1);
        var orientation = this.getOutCardOrientation(off, true);
        var outCard = this.getNewCard("out", mjput[i], off, false);
        outCard.setPosition(pos);
        outCard.visible = true;
        this.setGray(outCard, true);
        node.addChild(outCard);
    }
};

//落地置灰 (2人全置灰 | 3人摸牌弃牌不置灰 手牌弃牌要置灰 | 4人全不置灰)
playPanel_96poker.prototype.setGray = function(node, isEx) {
    if(!cc.sys.isObjectValid(node)) {
        return;
    }
    var cnt = this.getPlayersNum();
    if(cnt == 2) {
        node.setColor(cc.color(170, 170, 170));
    }else if(cnt == 3) {
        if(!isEx) {
            node.setColor(cc.color(170, 170, 170));
        }
    }
};

//Override 添加参数isEx = 是否是摸牌中的弃牌
playPanel_96poker.prototype.getOutCardPos = function(off, isEx) {
    var pos = cc.p(0, 0);
    var orientation = this.getOutCardOrientation(off, true);
    var uiNode = this.getUINode(off);
    var name = uiNode.getName();

    var childNum = 0;
    var child = uiNode.getChildByName("layout_outCards");
    if(isEx) {
        child = uiNode.getChildByName("layout_outExCards");
    }
    childNum = child.getChildrenCount();

    var outCard = uiNode.getChildByName("img_outCard");
    var scaleX = outCard.scaleX;
    var scaleY = outCard.scaleY;

    // 每行的数量
    var lineNum = 11;

    //按行摆
    function setCardPosByRow(num) {
        pos.x += (childNum % num + 0.5) * outCard.width * scaleX * orientation.dx;
        pos.y += (Math.floor(childNum / num) + 0.5) * outCard.height * scaleY * orientation.dy;

        //坐标修正
        pos.x -= (outCard.width * scaleX - 23) * (childNum % num - 1); //美术给定的偏移值
        pos.y += (outCard.height * scaleY - 28) * Math.floor(childNum/num);
    }

    //按列摆
    function setCardPosByCol(num) {
        var n = (Math.floor(childNum / num) + 0.5)
        pos.x += n * outCard.width * scaleX * orientation.dx;
        pos.y += (childNum % num + 0.5) * outCard.height * scaleY * orientation.dy;

        //坐标修正
        pos.x -= (outCard.width * scaleX - 23) * (n-1); //美术给定的偏移值
        pos.y += (outCard.height * scaleY - 28) * (childNum % num); 
    }

    //人数
    var cnt = this.getPlayersNum();
    if(cnt == 2) {
        //摆2排
        lineNum = 12;
        setCardPosByRow(lineNum);
    }else if(cnt == 3) {
        if(name != 'node_down') {
            if(isEx) {
                //左右. 按排摆放, 每3张一排   >3 换行  不置灰
                lineNum = 3;
                setCardPosByRow(lineNum);
            }else {
                //左右. 按列摆放, 每2张一列   >2 换列  全置灰
                lineNum = 2;
                setCardPosByCol(lineNum);
            }
        }else {
            //自己. 单独一行 全置灰
            lineNum = 96;
            setCardPosByRow(lineNum);
        }
    }else if(cnt == 4) {
        if(name == 'node_left' || name == 'node_xing') {
            //左右. 按排摆放, 每3张一排, >3 换行
            lineNum = 3;
            setCardPosByRow(lineNum);
        }else {
            //上下. 单独一行
            lineNum = 96;
            setCardPosByRow(lineNum);
        }
    }

    return pos;
};

//Override
playPanel_96poker.prototype.getOutCardOrientation = function(off, isOutCard) {
    var uiNode = this.getUINode(off);
    var orientation = {
        dx: 1,
        dy: -1,
        anchorX: 0,
        anchorY: 0
    };

    return orientation;
};

//Override
playPanel_96poker.prototype.setCardTouchHandler = function(card, off) {
    var self = this;
    var pl = this.getUIPlayer(off);
    var dict = {};
    for (var i = 0; i < pl.mjhand.length; i++) {
        var cd = pl.mjhand[i];
        dict[cd] = dict[cd] ? dict[cd] + 1 : 1;
    }

    //96扑克没有置灰牌...
    // if (dict[card.tag] >= 3) {
    //     card.setColor(cc.color(170, 170, 170));
    //     card.addTouchEventListener(null);
    //     card.setTouchEnabled(false);
    //     if (MjClient.movingCard_paohuzi == card) {
    //         MjClient.movingCard_paohuzi = null;
    //     }
    //     return;
    // }

    card.setColor(cc.color(255, 255, 255));

    var cloneCard = null;
    card.addTouchEventListener(function(btn, eventType) {
        if (MjClient.movingCard_paohuzi !== null && cc.sys.isObjectValid(MjClient.movingCard_paohuzi) && MjClient.movingCard_paohuzi !== btn) {
            return;
        }

        if (MjClient.isRefreshNodeing || MjClient.isDealing) {
            return;
        }

        if (eventType == ccui.Widget.TOUCH_BEGAN) {
            MjClient.movingCard_paohuzi = btn;
            if (MjClient.playui.isShowCloneCard()) { // 添加残影
                if (cc.sys.isObjectValid(cloneCard)) {
                    cloneCard.removeFromParent(true);
                }

                cloneCard = btn.clone();
                cloneCard.opacity = 100;
                cloneCard.setTouchEnabled(false);
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //cloneCard.loadTexture(src, MjClient.playui.getResType());
                MjClient.playui.loadCardTexture(cloneCard, src, MjClient.playui.getResType());
                btn.parent.addChild(cloneCard);
            }

            btn.parent.zIndex = 1;
            btn.zIndex = 5;
            btn.setAnchorPoint(0.5, 0.5);
            btn.x += btn.width * btn.scaleX * 0.5;
            btn.y += btn.height * btn.scaleY * 0.5;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            if (Array.isArray(MjClient.hintPutList_ziPai) && MjClient.hintPutList_ziPai.indexOf(btn.tag) >= 0) {
                if (MjClient.playui.hasTingByPut()) {
                    MjClient.playui.checkTingCardsNew(btn.tag);
                } else {
                    MjClient.playui.checkTingCards(btn.tag);
                }
            }

            if (MjClient.playui.isShowLongCard()) { // 显示长牌
                var alignWidth = btn.scale * btn.width;
                var src = MjClient.playui.getCardSrc("put", btn.tag, false);
                btn.loadTexture(src, 0);
                btn.scale = alignWidth / btn.width;
                var tingSign = btn.getChildByName("tingSign");
                if (cc.sys.isObjectValid(tingSign) && tingSign.isVisible()) {
                    tingSign.y = btn.getContentSize().height;
                }
            }
        }

        if (eventType == ccui.Widget.TOUCH_MOVED) {
            btn.setPosition(cc.pSub(btn.getTouchMovePosition(), btn.parent.getPosition()));
            // updateBtnMovedPosition_hengYang(btn, eventType);
        }

        if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED) {
            MjClient.movingCard_paohuzi = null;
            // updateBtnMovedPosition_hengYang(btn, eventType);
            MjClient.moveCard = {};
            MjClient.moveCard.curPosition = btn.parent.convertToWorldSpace(cc.p(btn.x - btn.anchorX * btn.width * btn.scaleX, btn.y - btn.anchorY * btn.height * btn.scaleY));
            var col = MjClient.moveCard.curCIndex = MjClient.moveCard.nexCIndex = btn.parent.tag;
            var row = MjClient.moveCard.curRIndex = MjClient.moveCard.nexRIndex = btn.name;
            var pos = btn.getTouchEndPosition();
            var card = btn.tag;

            if (cc.sys.isObjectValid(cloneCard)) {
                cloneCard.removeFromParent(true);
            }

            if (MjClient.playui.isShowLongCard()) {
                var src = MjClient.playui.getCardSrc("hand", btn.tag, false);
                //btn.loadTexture(src, MjClient.playui.getResType());
                MjClient.playui.loadCardTexture(btn, src, MjClient.playui.getResType());
                btn.scale = cc.director.getWinSize().width / 1280;
            }

            if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                MjClient.playui.checkTingCards();
                MjClient.playui.refreshHandCard(0);
                delete MjClient.moveCard;
                return;
            }

            var tData = MjClient.data.sData.tData;
            var pl = MjClient.data.sData.players[SelfUid() + ""];
            var canPut = MjClient.majiang.canPutCard(pl, card);

            // 出牌
            if (!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && 
                pos.y > MjClient.playui.jsBind.img_cutLine._node.y && canPut) {
                function doPut() {
                    var putNode = MjClient.playui.getUINode(0).getChildByName("img_putCard");
                    putNode.stopAllActions();
                    putNode.visible = true;
                    putNode.opacity = 255;
                    var src = self.getCardSrc("put", card, false);
                    putNode.getChildByName("img_card").loadTexture(src, 0); // todo
                    putNode.loadTexture("playing/paohuzi/chupai_bj.png");

                    if (self.isShowLongCard()) {
                        var pos = putNode.getUserData().pos;
                        putNode.setScale(putNode.getUserData().scale);
                        var p = btn.parent.convertToWorldSpace(cc.p(btn.x + (0.5 - btn.anchorX) * btn.width * btn.scaleX, btn.y + (0.5 - btn.anchorY) * btn.height * btn.scaleY));
                        putNode.setPosition(putNode.parent.convertToNodeSpace(p));
                        putNode.runAction(cc.moveTo(MjClient.playui.getActionTime(), pos.x, pos.y));
                    }else{
                        var pos = putNode.getUserData().pos;
                        putNode.setScale(0);
                        putNode.setPosition(cc.p(pos.x ,pos.y - 200));
                        var actTime = MjClient.playui.getActionTime();
                        putNode.runAction(cc.spawn(cc.scaleTo(actTime, putNode.getUserData().scale), cc.moveTo(actTime, putNode.getUserData().pos)));
                    }

                    // tood 背光

                    btn.removeFromParent(true);

                    if (!Array.isArray(MjClient.HandCardArr[col]) || MjClient.HandCardArr[col][row] != card) {
                        putNode.visible = false;
                        MjClient.playui.checkTingCards();
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                        return;
                    }

                    MjClient.hasPut = true;
                    MjClient.HandCardArr[col].splice(row, 1);
                    MjClient.gamenet.request("pkroom.handler.tableMsg", {
                        cmd: "MJPut",
                        card: card
                    });
                    MjClient.playui.checkCutLineVisible();
                }

                if (self.isOtherWei(card)) {
                    MjClient.showMsg("放偎之后这局将不能再吃碰，是否确定？", function() {
                        doPut();
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                    }, function() {
                        btn.setAnchorPoint(0, 0);
                        MjClient.playui.checkTingCards();
                        MjClient.playui.refreshHandCard(0);
                        delete MjClient.moveCard;
                    }, "1");

                    return;
                } else {
                    doPut();
                }
            } else { // 移动手牌
                if(!MjClient.hasPut && IsTurnToMe() && tData.tState == TableState.waitPut && 
                    pos.y > MjClient.playui.jsBind.img_cutLine._node.y) {
                    MjClient.showToast("这张手牌不能打出去");
                }
                // cc.log("pos.x@@ ", pos.x, " btn.parent.x@@ ", btn.parent.x);
                var dstCol = col + Math.round((pos.x - btn.parent.x) / (btn.parent.width * 85/115 * btn.scaleX) - 0.5); // 目的列
                // cc.log("dstCol@@ ", dstCol);
                if (dstCol == col) { // 列未变
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                } else if (dstCol >= 0 && dstCol < MjClient.HandCardArr.length) { // 当前有手牌列
                    if (MjClient.HandCardArr[dstCol].length < 4) { // 插牌
                        MjClient.moveCard.nexCIndex = dstCol;
                        MjClient.HandCardArr[col].splice(row, 1);
                        MjClient.playui.fixArrIndex(MjClient.HandCardArr[dstCol], card, btn);
                    }
                } else if (MjClient.HandCardArr.length < 12) { // 最前或最后 新增一列 最多12列
                    MjClient.HandCardArr[col].splice(parseInt(row), 1);
                    if (dstCol < 0) {
                        MjClient.HandCardArr.unshift([card]);
                        MjClient.addGroupIndex = 0;
                    } else if (dstCol >= MjClient.HandCardArr.length) {
                        MjClient.HandCardArr.push([card]);
                        MjClient.addGroupIndex = MjClient.HandCardArr.length - 1;
                    }

                    MjClient.moveCard.nexCIndex = MjClient.addGroupIndex;
                    MjClient.moveCard.nexRIndex = 0;
                }
                btn.setAnchorPoint(0, 0);
            }

            if (MjClient.playui.hasTingByPut()) {
                MjClient.playui.checkTingCardsNew();
            } else {
                MjClient.playui.checkTingCards();
            }
            MjClient.playui.refreshHandCard(0);

            MjClient.addGroupIndex = -1;
            delete MjClient.moveCard;
        }
    });
};

//Override
playPanel_96poker.prototype.fixArrIndex = function(arr, cardNum, card) {
    if (arr) {
        if (this.isKan(arr)) {
            arr.push(cardNum);
            MjClient.moveCard.nexRIndex = 3;
        } else {
            var yDis = 70;      //美术给定
            var off_y = card.height * 0.28 * card.scaleY;
            var cardY = card.y + card.height * card.scaleY * 0.5;  //y锚点0.5
            //var maxH = card.height * card.scaleY * 3 - off_y * 2;
            var maxH = card.height * card.scaleY + 3 * card.scaleY * yDis - off_y;
            if (cardY > maxH) {
                arr.push(cardNum);
                MjClient.moveCard.nexRIndex = 3;
            } else if (cardY > card.height * card.scaleY + yDis - off_y) {
                arr.splice(2, 0, cardNum);
                MjClient.moveCard.nexRIndex = 2;
            } else if (cardY > card.height * card.scaleY - off_y) {
                arr.splice(1, 0, cardNum);
                MjClient.moveCard.nexRIndex = 1;
            } else {
                arr.splice(0, 0, cardNum);
                MjClient.moveCard.nexRIndex = 0;
            }
        }
    }
};

//Override
playPanel_96poker.prototype.addOneHandCard = function(col, row, cardNum, off) {
    var uiNode = this.getUINode(off);
    //根据牌的类型获得需要添加的节点
    var layout_handCards = uiNode.getChildByName("layout_handCards");
    //取一个对应的牌节点
    var newCard = this.getCardNodeFromList(layout_handCards.cardList, cardNum);
    if (!newCard) {
        // cc.log("chow", "newCard");
        newCard = this.getNewCard("hand", cardNum, off);
    } else {
        // cc.log("chow", "getCard");
    }
    var scale_y = newCard.scaleY;
    var scale_x = newCard.scaleX;

    var cardParent = layout_handCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = this.getCardRoot(layout_handCards.cardRoot, col);
        if (!cardParent) {
            // cc.log("chow", "newRoot");
            cardParent = new cc.Node();
            cardParent.tag = col;
            cardParent.width = newCard.width;
            layout_handCards.addChild(cardParent);
        } else {
            // cc.log("chow", "getRoot from list");
            layout_handCards.addChild(cardParent);
        }
        cardParent.zIndex = 0;
    } else {
        // cc.log("chow", "getRoot from parent");
    }

    if (MjClient.movingCard_paohuzi == newCard) {
        if (this.isShowLongCard()) {
            var src = this.getCardSrc("hand", newCard.tag, false);
            //newCard.loadTexture(src, this.getResType());
            this.loadCardTexture(newCard, src, this.getResType());
            newCard.scale = cc.director.getWinSize().width / 1280;
        }
    }

    var beginPoint = cc.p(0, -newCard.height * scale_y * 0.28);
    var off_y = newCard.height * scale_y - newCard.height * (162-70)/162 * scale_y;
    var cardCount = cardParent.childrenCount;

    newCard.setName(row);
    newCard.zIndex = 4 - row;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    cardParent.addChild(newCard);
    if (newCard.lastPosition) {
        newCard.setPosition(cardParent.convertToNodeSpace(newCard.lastPosition));
        this.doMoveToAction(newCard, cc.p(beginPoint.x, beginPoint.y + cardCount * off_y));
    } else {
        newCard.x = beginPoint.x;
        newCard.y = beginPoint.y + cardCount * off_y;
    }
    //newCard.opacity = 255;
    this.setCardTouchHandler(newCard, off);

    var pl = this.getUIPlayer(off);
    if (pl && pl.canNotPutCard) {
        if (pl.canNotPutCard.indexOf(cardNum) != -1) {
            //newCard.setColor(cc.color(170, 170, 170));
        }
    }
    newCard.setTouchEnabled(true);
    newCard.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function() {
        if (!newCard.isRunning()) {
            newCard.setTouchEnabled(false);
        }
        if (!newCard.isTouchEnabled()) {
            newCard.setTouchEnabled(true);
        }
        cc.director.getEventDispatcher().resumeTarget(newCard);
    })));
    //cc.log("chow", "addOrAdjustHandCard_hengYang: name=" + newCard.getName() + " num=" + newCard.num + " tag =" + newCard.tag);
};

//Override
playPanel_96poker.prototype.refreshHandCard = function(off, isRefresh) {
    if (!this.isInPlay() && !isRefresh) {
        return;
    }

    var uiNode = this.getUINode(off);
    if (MjClient.rePlayVideo == -1) {
        if (off == 0) {
            this.checkHandCard(off);
            var layout_handCards = uiNode.getChildByName("layout_handCards");
            layout_handCards.visible = true;
            this.handleHandCardBeforeRefresh(off);
            layout_handCards.removeAllChildren();
            var cardArr = MjClient.HandCardArr;
            //清理空数组
            for (var k = cardArr.length - 1; k >= 0; k--) {
                if (cardArr[k].length == 0) {
                    cardArr.splice(k, 1);
                }
            }
            for (var k = 0; k < cardArr.length; k++) {
                var groupList = cardArr[k];
                for (var j = 0; j < groupList.length; j++) {
                    this.addOneHandCard(k, j, groupList[j], off);
                }
            }
            this.releaseHandCardNode(off);

            this.addTingSign(); // 添加听牌角标
            var handCard = uiNode.getChildByName("img_handCard");
            var width = handCard.getVirtualRendererSize().width;
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = width * 85/115 * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = layout_handCards.getChildByTag(i);
                this.showHandHuXi(addNode);

                if (addNode.lastPosition) {
                    addNode.setPosition(addNode.lastPosition);
                    //this.doMoveToAction(addNode, cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                } else {
                    addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * 85/115 * scale_x, 0));
                    //addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * width * scale_x, 0));
                }
            }
            postEvent("LY_addHandHuXi");
        }
    } else {
        //回放
        var handNode = null;
        var cardArr = null;
        var handCard = null;
        if (off == 0) {
            handNode = uiNode.getChildByName("layout_handCards");
            handCard = uiNode.getChildByName("img_handCard");
            cardArr = MjClient.HandCardArr;
        } else {
            handNode = uiNode.getChildByName("layout_replayCards");
            handCard = uiNode.getChildByName("img_handCard");
            cardArr = MjClient.OtherHandArr[off];
            var hand = [];
            for(var i = 0; i < cardArr.length; i++) {
                for(var j = 0; j < cardArr[i].length; j++) {
                    hand.push(cardArr[i][j]);
                }
            }
            //其它人手牌只摆两列，重新排序
            cardArr = MjClient.majiang.sortCardEx(hand);
        }
        handNode.visible = true;
        handNode.removeAllChildren();

        //清理空数组
        if (!cardArr) {
            return;
        }
        for (var k = cardArr.length - 1; k >= 0; k--) {
            if (cardArr[k].length == 0) {
                cardArr.splice(k, 1);
            }
        }
        for (var k = 0; k < cardArr.length; k++) {
            var groupList = cardArr[k];
            for (var j = 0; j < groupList.length; j++) {
                if (off == 0) {
                    this.addHandCard(k, j, groupList[j], off);
                } else {
                    this.addHandCardReplay(k, j, groupList[j], off);
                }
            }
        }

        if (off == 0) {
            var scale_x = handCard.scaleX;
            var winSize = MjClient.size;
            var totalWidth = handCard.width * 85/115 * cardArr.length * scale_x;
            for (var i = 0; i < cardArr.length; i++) {
                var addNode = handNode.getChildByTag(i);
                addNode.setPosition(cc.p((winSize.width - totalWidth) / 2 + i * handCard.width * 85/115 * scale_x, 0));
            }
        }else {

        }
        cc.log("================off:" + off + "----------" + JSON.stringify(cardArr));
    }
};

//****************************回放相关*****************************
//获取回放手牌的摆放方向(非自己视觉使用)
playPanel_96poker.prototype.getHandCardDir = function(off) {
    var pNum = this.getPlayersNum();
    var uiNode = this.getUINode(off);
    var name = uiNode.getName();
    var dir = 1;  //从左往右
    if(pNum == 2) {
        dir = -1;
    }else if(pNum == 3) {
        if(name == 'node_right') {
            dir = -1;
        }
    }else if(pNum == 4) {
        if(name == 'node_right' || name == 'node_xing') {
            dir = -1;
        }
    }

    return dir;
};

//Override
playPanel_96poker.prototype.addHandCardReplay = function(col, row, cardNum, off) {
    var uiNode = this.getUINode(off);
    var layout_replayCards = uiNode.getChildByName("layout_replayCards");
    //设置牌
    var type = 2;
    var newCard = this.getNewCard("out", cardNum, off);
    var scale_x = newCard.scaleX;
    var scale_y = newCard.scaleY;
    var parentCount = layout_replayCards.childrenCount;
    var dir = this.getHandCardDir(off);
    //首先根据name判断cpNode中是否已经添加
    var cardParent = layout_replayCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = new cc.Node();
        cardParent.tag = col;
        cardParent.width = newCard.width * scale_x;
        cardParent.height = newCard.height * scale_y;
        cardParent.x = 23 * parentCount * dir + (dir > 0 ? 0 : layout_replayCards.width);
        cardParent.y = 0; 
        cardParent.zIndex = dir*parentCount + 100;

        layout_replayCards.addChild(cardParent);
    }
    var off_y = 0;
    if(dir == -1) {
        newCard.anchorX = 1;
    }else {
        newCard.anchorX = 0;
    }
    newCard.anchorY = 0;
    var cardCount = cardParent.childrenCount;
    newCard.zIndex = cardCount;
    newCard.x = 0;
    newCard.y = -28 * row;

    cardParent.addChild(newCard);
}

//Override
playPanel_96poker.prototype.addHandCard = function(col, row, cardNum, off) {
    var uiNode = this.getUINode(off);
    //根据牌的类型获得需要添加的节点
    var layout_handCards = uiNode.getChildByName("layout_handCards");

    //设置牌
    var newCard = this.getNewCard("hand", cardNum, off);
    var scale_y = newCard.scaleY;
    //首先根据name判断cpNode中是否已经添加
    var cardParent = layout_handCards.getChildByTag(col);
    if (!cardParent) {
        cardParent = new cc.Node();
        cardParent.tag = col;
        cardParent.width = newCard.width;
        layout_handCards.addChild(cardParent);
    }

    var beginPoint = cc.p(0, -newCard.height * scale_y * 0.28);
    var off_y = newCard.height * scale_y - newCard.height * (162-70)/162 * scale_y;

    var cardCount = cardParent.childrenCount;
    newCard.setName(row);
    newCard.zIndex = 4 - row;
    newCard.anchorX = 0;
    newCard.anchorY = 0;
    newCard.x = beginPoint.x;
    newCard.y = beginPoint.y + cardCount * off_y;
    cardParent.addChild(newCard);

    //96扑克没有置灰
    // var pl = this.getUIPlayer(off);
    // if (pl && pl.canNotPutCard) {
    //     if (pl.canNotPutCard.indexOf(cardNum) != -1) {
    //         newCard.setColor(cc.color(170, 170, 170));
    //     }
    // }
    cc.log("chow", "addHandCard_hengYang: name=" + newCard.getName() + " num=" + newCard.num + " tag =" + newCard.tag);
};

//********************接口***********************
//Override
playPanel_96poker.prototype.getShowEatNodes = function() {
    var sData = MjClient.data.sData;
    var tData = sData.tData;
    var eat = MjClient.playui.jsBind.node_eatChoice;
    var pl = sData.players[SelfUid() + ""];

    //吃=1  碰=2  贴=4  勺=8  走=16  胡=32  自动吃=64

    // if (!pl || (pl.eatFlag & 2) || (pl.eatFlag & 8) || (pl.eatFlag & 64)) {
    //     return;
    // }

    if (!pl) {
        return;
    }

    if (tData.tState == TableState.roundFinish) {
        return [];
    }

    var vnode = [];
    if (pl.eatFlag & 1) { // 吃
        vnode.push(eat.btn_chi._node);
    }

    if (pl.eatFlag & 4) { // 贴
        vnode.push(eat.btn_tie._node);
    }

    if (pl.eatFlag & 32) {
        vnode.push(eat.btn_hu._node);
    }

    if (vnode.length > 0) { // 过
        vnode.push(eat.btn_guo._node);
    }

    return vnode;
};

//Override
playPanel_96poker.prototype.updateEatBtns = function() {
    var sData = MjClient.data.sData;
    var pl = sData.players[SelfUid() + ""];
    if (!pl) return;

    //重置吃碰隐藏
    this.hideEatBtns();
    //吃碰杠胡
    var showEatNodes = this.getShowEatNodes();

    //吃碰杠胡过处理
    if (showEatNodes && showEatNodes.length > 0) {
        for (var i = 0; i < showEatNodes.length; i++) {
            var btnNode = showEatNodes[i];
            btnNode.visible = true;
            this.changeEatBtnLayout(btnNode, showEatNodes.length, i);
        }
    }
};

//刷新忍龙
playPanel_96poker.prototype.updateRenNum = function(node) {
    var num = this.getRenNum(node);
    node.getParent().visible = false;
    if(this.isInPlay() && num > 0) {
        node.getParent().visible = true;
    }
    node.setString("x" + num);
    node.ignoreContentAdaptWithSize(true);
};

//获取忍龙次数
playPanel_96poker.prototype.getRenNum = function(node) {
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if(!pl)
        return 0;
    return pl.renNum;
}

//Override
playPanel_96poker.prototype.changeHandCardSize = function(handCard) {
    setWgtLayout(handCard, [115 / 1280, 0], [0.27, 0.75], [0, 0]);
};

//改变牌背
playPanel_96poker.prototype.changePaiBei = function(node, idx) {
    var children = node.getChildren();
    for(var i = 0; i < children.length; i++) {
        var child = children[i];
        if(child.getName() != "EAT_CARD_NODE") {
            continue;
        }
        var cards = child.getChildren();
        for(var j = 0; j < cards.length; j++) {
            var cardNode = cards[j];
            if(cardNode.isTurn) {
                cardNode.loadTexture(this.getPaiBeiSrcByIdx(idx));
            }
        }
    }   
};

//调整飘按钮坐标
playPanel_96poker.prototype.initPiaoBtns = function(node) {
    var create = MjClient.data.sData.tData.areaSelectMode;
    var fen = [0, 1, 2, 3]; //飘分分数选择
    for(var i = 0; i < 4; i++) {
        var btn = node.getChildByName("btn_piao" + i);
        btn.x += create.piaoFen == 1 ? 20 : 0;
        btn.idx = i;
        btn.addClickEventListener(function(ref) {
            MjClient.gamenet.request("pkroom.handler.tableMsg", {
                cmd: "MJJiazhu",
                piaoFen: fen[ref.idx],
            });
        })
    }
    if(create.piaoFen == 1) {
        for(var i = 0; i < 4; i++) {
            var btn = node.getChildByName("btn_piao" + i);
            btn.x += 120;
        }
        node.getChildByName("btn_piao3").visible = false;
    }
};

//显示飘分标识
playPanel_96poker.prototype.showPiaoFlag = function(node) {
    node.visible = false;
    var tData = MjClient.data.sData.tData;
    var off = this.getUIOffByNode(node);
    var pl = this.getUIPlayer(off);
    if (!pl || tData.areaSelectMode.piaoFen == 0 || pl.piaoFen < 0) {
        return;
    }
    node.loadTexture("playing/96poker/img/piao0.png");
    node.visible = true;
    if (this.isInPlay() || tData.tState == TableState.waitJiazhu) {
        if(pl.piaoFen > 0) {
            node.loadTexture("playing/96poker/img/piao" + pl.piaoFen + ".png");
        }
    }else {
        node.visible = false;
    }
};

//Override
playPanel_96poker.prototype.updateHuXi = function(node) {
    node.setString("");
    if (!this.isInPlay()) {
        return;
    }

    var off = this.getUIOffByNode(node);
    //现在又改为只显示自己的,不显示别人的了 ps.能不能别再做反工了 2019-6-27
    if(off != 0) {
        node.visible = false;
        var img = node.getParent().getChildByName("img_huXiBg");
        img.visible = false;
        return;
    }
    var pl = this.getUIPlayer(off);
    if (!pl) {
        return;
    }

    node.setVisible(true);
    var huXi = this.calculateHuXi(off);
    node.setString("得分:" + huXi);
    node.setAnchorPoint(0.5, 0.5);
    node.ignoreContentAdaptWithSize(true);
};

//Override
playPanel_96poker.prototype.changeEatBtnLayout = function(btnNode, len, idx) {
    setWgtLayout(btnNode, [0, 0.20], [0.88 - (len - 1 - idx) * 0.12, 0.11], [0, 1.8], false, false);
};

//Override
playPanel_96poker.prototype.getCardSrc = function(name, tag, isTurn) {
    var path = this.getCardFilePath();
    // if (isTurn) {
    //     switch (name) {
    //         case "out":
    //             return path + "huxiBG.png";
    //         case "put":
    //             return path + "normalBG.png";
    //     }
    // }

    return (path + "pk_" + tag + ".png");
};

//Override
playPanel_96poker.prototype.getCardFilePath = function() {
    return "playing/96poker/cards/";
};

//Override
playPanel_96poker.prototype.createEndOneLayer = function(type) {
    return new EndOneView_96poker();
};

//Override
playPanel_96poker.prototype.createGameOverLayer = function(type) {
    return new GameOverLayer_96poker();
};

//Override
playPanel_96poker.prototype.isNeedShuffle = function() {
    return false;
};

//***********************设置相关重写*************************
//Override
playPanel_96poker.prototype.getGameBgList = function() {
    return ["playing/anhuapaohuzi/bg/beijing_1.jpg", "playing/anhuapaohuzi/bg/beijing_2.jpg", "playing/anhuapaohuzi/bg/beijing_3.jpg"];
};

//Override
playPanel_96poker.prototype.getGameBgIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_GAME_BG_TYPE, 2);
};

//牌背
playPanel_96poker.prototype.getPaiBeiIdx = function() {
    return util.localStorageEncrypt.getNumberItem(MjClient.KEY_ZI_PAI_PAI_BEI, 0);
};

//根据索引获取牌背资源
playPanel_96poker.prototype.getPaiBeiSrcByIdx = function(idx) {
    var path = "playing/96poker/cards/";
    var src = path + "paiBei0.png";
    if(typeof(idx) != 'undefined') {
        src = path + "paiBei" + idx + ".png";
    }
    return src;
};

//此玩法不显示听牌
playPanel_96poker.prototype.getTingPaiType = function() {
    return 1;
};

//Override
playPanel_96poker.prototype.initSettingData = function() {
    MjClient.KEY_ZI_PAI_PAI_BEI = "KEY_ZI_PAI_PAI_BEI_" + MjClient.gameType; //字牌牌背选择
};

