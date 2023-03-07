/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_chaogu = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_chaogu_count                     = "_chaogu_COUNT";                //人数
        this.localStorageKey.KEY_chaogu_difen                     = "_chaogu_difen";                //底分
        this.localStorageKey.KEY_chaogu_zhuangxianfen             = "_chaogu_zhuangxianfen";        //庄闲分
        this.localStorageKey.KEY_chaogu_piaofen                   = "_chaogu_piaofen";              //飘分
        this.localStorageKey.KEY_chaogu_suanfen                = "_chaogu_suanfen";           //
        this.localStorageKey.KEY_chaogu_isOpenTingTip             = "_chaogu_isOpenTingTip";    //是否开启听牌提示
        this.localStorageKey.KEY_chaogu_lianguan             = "_chaogu_lianguan";    //连冠
        this.localStorageKey.KEY_chaogu_fanbei                    = "_zhuoxiazi_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_chaogu_fanbeiscore               = "_zhuoxiazi_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },

    initAll: function(IsFriendCard) {

        if (!IsFriendCard) this.setKey();
        this.bgNode = ccs.load("bg_chaogu.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_chaogu").getChildByName("view");
        this.bg_node.setTouchEnabled(true);
    },
    initPlayNode: function() {

        var _bgNode = this.bg_node;
        var _play = _bgNode.getChildByName("play");
        var that = this;

        this._zhuIdx = 1;
        this._ZhuNum = _bgNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgNode.getParent().getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx <= 0.1) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0) {
                        var step = 0.1;

                        if (this._zhuIdx > 1)
                            step = 1;
                        else if (this._zhuIdx > 0.5)
                            step = 0.5;

                        this._zhuIdx -= step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
            this._Button_add = _bgNode.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 10) {
                        this._zhuIdx = 0;
                    }
                    if (this._zhuIdx < 10) {
                        var step = 0.1;

                        if (this._zhuIdx >= 1)
                            step = 1;
                        else if (this._zhuIdx >= 0.5)
                            step = 0.5;

                        this._zhuIdx += step;
                        this._zhuIdx = correctAccuracy(this._zhuIdx,5);
                        this._ZhuNum.setString(this._zhuIdx);
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                        this.setRoomCardModeFree();
                    }
                }
            }, this);
        }

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));
        this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);
    
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        //庄闲分
        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxian");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_zhuangxianfen.addEventListener(this.clickCB, this._playNode_zhuangxianfen);

        this._playNode_lianguan = _play.getChildByName("play_lianguan");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_lianguan.addEventListener(this.clickCB, this._playNode_lianguan);

        this._playNode_piaofen_0 = _play.getChildByName("play_ziyoupiaofen");
        this._playNode_piaofen_1 = _play.getChildByName("play_bupiao");
        this._playNode_piaofen_2 = _play.getChildByName("play_piao_0");
        this._playNode_piaofen_3 = _play.getChildByName("play_piao_1");
        this._playNode_piaofen_4 = _play.getChildByName("play_piao_2");
        this._playNode_piaofen_5 = _play.getChildByName("play_piao_3");
        var piaofenList = [];
        piaofenList.push(_play.getChildByName("play_ziyoupiaofen"));
        piaofenList.push(_play.getChildByName("play_bupiao"));
        piaofenList.push(_play.getChildByName("play_piao_0"));
        piaofenList.push(_play.getChildByName("play_piao_1"));
        piaofenList.push(_play.getChildByName("play_piao_2"));
        piaofenList.push(_play.getChildByName("play_piao_3"));
        var self = this;
        this.piaofenList_radio = createRadioBoxForCheckBoxs(piaofenList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,piaofenList[index],piaofenList);
        });
        this.addListenerText(piaofenList,this.piaofenList_radio);
        this.piaofenList = piaofenList;

        this.play_112 = _play.getChildByName("play_112");
        this.play_123 = _play.getChildByName("play_123");
        var suanfenList = [];
        suanfenList.push(this.play_112);
        suanfenList.push(this.play_123);
        this._playNode_suanfen_radio = createRadioBoxForCheckBoxs(suanfenList,this.radioBoxSelectCB);
        this.addListenerText(suanfenList,this._playNode_suanfen_radio);
        this.suanfenList = suanfenList;

        var btn_tip1 = this.play_112.getChildByName("tip");
        var image_Tiptext1 = this.play_112.getChildByName("Tiptext");
        btn_tip1.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_Tiptext1.setVisible(true);
            }
        }, btn_tip1);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_Tiptext1.isVisible()) {
                    image_Tiptext1.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_Tiptext1);

        var btn_tip2 = this.play_123.getChildByName("tip");
        var image_Tiptext2 = this.play_123.getChildByName("Tiptext");
        btn_tip2.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_Tiptext2.setVisible(true);
            }
        }, btn_tip2);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_Tiptext2.isVisible()) {
                    image_Tiptext2.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_Tiptext2);

        if (_play.getChildByName("play_nofanbei")) {
            var nodeListFanBei = [];
            nodeListFanBei.push(_play.getChildByName("play_nofanbei"));
            nodeListFanBei.push(_play.getChildByName("play_lessthan"));
            this.fanbei_radio = createRadioBoxForCheckBoxs(nodeListFanBei, this.fanBeiRadioBoxSelectCB);
            var that = this;
            this.addListenerText(nodeListFanBei, this.fanbei_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListFanBei);
            });
            this.nodeListFanBei = nodeListFanBei;

            var subButton = nodeListFanBei[1].getChildByName("btn_sub");
            var addButton = nodeListFanBei[1].getChildByName("btn_add");
            var scoreLabel = nodeListFanBei[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 10) {
                        curScore = 100;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 100) {
                        curScore = 10;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }
        

        //听牌提示
        var tingTipList = [];
        tingTipList.push(_play.getChildByName("tingTip1"));
        tingTipList.push(_play.getChildByName("tingTip2"));
        this.tingTipList_radio = createRadioBoxForCheckBoxs(tingTipList, this.radioBoxSelectCB);
        this.addListenerText(tingTipList, this.tingTipList_radio);
        this.tingTipList = tingTipList;

    },
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);



        //底分
        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");


        //庄闲分
        var zhuangxianfen;
        if (isClub)
            zhuangxianfen = this.getBoolItem("zhuangxian", false);
        else
            zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chaogu_zhuangxianfen, false);
        this._playNode_zhuangxianfen.setSelected(zhuangxianfen);
        var text = this._playNode_zhuangxianfen.getChildByName("text");
        this.selectedCB(text, zhuangxianfen);

        var _lianguan;
        if (isClub)
            _lianguan = this.getBoolItem("lianguan", false);
        else
            _lianguan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chaogu_lianguan, false);
        this._playNode_lianguan.setSelected(_lianguan);
        var text = this._playNode_lianguan.getChildByName("text");
        this.selectedCB(text, _lianguan);

        var _piaofen;
        if (isClub)
            _piaofen = [-1, 0, 1, 2, 3, 4].indexOf(this.getNumberItem("piaofen", 1));
        else
            _piaofen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_piaofen, 1);
        this.piaofenList_radio.selectItem(_piaofen);
        this.radioBoxSelectCB(_piaofen,this.piaofenList[_piaofen],this.piaofenList);


        var _suanfen;
        if (isClub)
            _suanfen = [1,2].indexOf(this.getNumberItem("suanfen", 0));
        else
            _suanfen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_suanfen, 0);
        this._playNode_suanfen_radio.selectItem(_suanfen);
        this.radioBoxSelectCB(_suanfen,this.suanfenList[_suanfen],this.suanfenList);

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_chaogu_isOpenTingTip, true);
        var tingIndex = isOpenTingTip ? 0 : 1;
        this.tingTipList_radio.selectItem(tingIndex);
        this.radioBoxSelectCB(tingIndex, this.tingTipList[tingIndex], this.tingTipList);

        if (this.fanbei_radio) {
            // 大结算翻倍
            var fanBeiOption;
            var fanBeiScore;
            if (isClub) {
                fanBeiScore = this.getNumberItem("fanBeiScore", 10);
                fanBeiOption = this.getNumberItem("fanBei", 0);
            }
            else {
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_chaogu_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }
        
        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.CHAO_GU_MJ;
        para.maxPlayer = 4;
        para.difen = this._zhuIdx;
        para.zhuangxian = false;//庄闲分
        para.lianguan = 0;//4连冠
        para.piaofen = 0;//-1 :自由飘分 0： 不飘分 1 ：1分.......
        para.suanfen = 1;//1:112 算分    2： 123算分
        para.zhuangxian = this._playNode_zhuangxianfen.isSelected();    //庄闲分
        para.lianguan = this._playNode_lianguan.isSelected() ? 4 :0;       //满天飞
        para.isOpenTingTip = this.tingTipList[0].isSelected();

        var lianguanindex = para.lianguan > 0;

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        var _suanfen = 0;
        if (this.play_112.isSelected()) {
            para.suanfen = 1;
            _suanfen = 0;
        } else if (this.play_123.isSelected()) {
            para.suanfen = 2;
            _suanfen = 1;
        }

         var _piaofen = 0;
         if (this._playNode_piaofen_0.isSelected()) {
            para.piaofen = -1;
             _piaofen = 0;
         }
         else if (this._playNode_piaofen_1.isSelected()) {
            para.piaofen = 0;
             _piaofen = 1;
         }
         else if (this._playNode_piaofen_2.isSelected()) {
            para.piaofen = 1;
             _piaofen = 2;
         }
         else if (this._playNode_piaofen_3.isSelected()) {
            para.piaofen = 2;
             _piaofen = 3;
         }
         else if (this._playNode_piaofen_4.isSelected()) {
            para.piaofen = 3;
             _piaofen = 4;
         }
         else if (this._playNode_piaofen_5.isSelected()) {
            para.piaofen = 4;
             _piaofen = 5;
         }

         if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chaogu_zhuangxianfen, para.zhuangxian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chaogu_lianguan, lianguanindex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_piaofen, _piaofen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_suanfen, _suanfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_chaogu_isOpenTingTip, para.isOpenTingTip);
            // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_chaogu_fanbeiscore, para.fanBeiScore);
            }
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    fanBeiRadioBoxSelectCB : function(index,sender, list){
        if(sender){
            var selectColor = cc.color(0xd3, 0x26, 0x0e);
            var unSelectColor = cc.color(0x44, 0x33, 0x33);
            var len = list.length;
            for(var i = 0; i < len; i++){
                var radioBox = list[i];
                var bSelected = (radioBox === sender && sender.isSelected());

                if (i == 0) {
                    var txt = radioBox.getChildByName("text");
                    txt.ignoreContentAdaptWithSize(true);
                    txt.setTextColor(bSelected ? selectColor : unSelectColor);
                } else {
                    var textNames = ["text","score"];
                    for (var j = 0; j < textNames.length; j++) {
                        var txt = radioBox.getChildByName(textNames[j]);
                        txt.ignoreContentAdaptWithSize(true);
                        txt.setTextColor(bSelected ? selectColor : unSelectColor);
                    }

                    var buttonNames = ["btn_add","btn_sub"];
                    for (var j = 0; j < buttonNames.length; j++) {
                        var button = radioBox.getChildByName(buttonNames[j]);
                        button.setTouchEnabled(bSelected);
                        button.setBright(bSelected);
                    }
                }
            }
        }
    }
});