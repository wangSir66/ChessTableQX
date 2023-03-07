/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_nanxian = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_nanxian_zhongniao                  = "_nanxian_zhongniao";        
        this.localStorageKey.KEY_nanxian_zhuaniao               = "_nanxian_zhuaniao";        
        this.localStorageKey.KEY_nanxian_haidijiafen              = "_nanxian_haidijiafen";       
        //this.localStorageKey.KEY_nanxian_jiangjianghu                   = "_nanxian_jiangjianghu"
        this.localStorageKey.KEY_nanxian_gangshanghuajiafen                    = "_nanxian_gangshanghuajiafen";        
        this.localStorageKey.KEY_nanxian_count                     = "_nanxian_COUNT";           
        this.localStorageKey.KEY_nanxian_xiaohukeqianggang                   = "_nanxian_xiaohukeqianggang";       
        this.localStorageKey.KEY_nanxian_difen                     = "_nanxian_difen";             
        this.localStorageKey.KEY_nanxian_choupai                  = "_nanxian_choupai"; 
        this.localStorageKey.KEY_nanxian_isOpenTingTip             = "_nanxian_isOpenTingTip"; 
        this.localStorageKey.KEY_nanxian_fanbei                    = "_nanxian_FAN_BEI";  //大结算翻倍
        this.localStorageKey.KEY_nanxian_fanbeiscore               = "_nanxian_FAN_BEI_SCORE";  //少于X分大结算翻倍
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        //if (MjClient.getAppType() == MjClient.APP_TYPE.QXYYQP) this._costName = '房卡';
        this.bgNode = ccs.load("bg_nanxian.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_nanxian").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_nanxian");
    },
    initPlayNode: function() {
        var _bgYJNode = this.bg_node;
        var _play = _bgYJNode.getChildByName("play");
         //抓鸟
        this.play_zhuaniao1 = _play.getChildByName("play_zhuaniao1");
        this.play_zhuaniao2 = _play.getChildByName("play_zhuaniao2");
        var zhuaniaoList = [];
        zhuaniaoList.push(this.play_zhuaniao1);
        zhuaniaoList.push(this.play_zhuaniao2);
        this._playNode_zhuaniao_radio = createRadioBoxForCheckBoxs(zhuaniaoList,this.radioBoxSelectCB);
        this.addListenerText(zhuaniaoList,this._playNode_zhuaniao_radio);
        this.zhuaniaoList = zhuaniaoList;



        //中鸟
        this.play_zhongniao1 = _play.getChildByName("play_zhongniao1");
        this.play_zhongniao2 = _play.getChildByName("play_zhongniao2");
        var zhongniaoList = [];
        zhongniaoList.push(this.play_zhongniao1);
        zhongniaoList.push(this.play_zhongniao2);
        this._playNode_zhongniao_radio = createRadioBoxForCheckBoxs(zhongniaoList,this.radioBoxSelectCB);
        this.addListenerText(zhongniaoList,this._playNode_zhongniao_radio);
        this.zhongniaoList = zhongniaoList;

                //
        this.buchoupai = _play.getChildByName("buchoupai");
        this.choupai1 = _play.getChildByName("choupai1");
        var choupaiList = [];
        choupaiList.push(this.buchoupai);
        choupaiList.push(this.choupai1);
        this._playNode_choupai_radio = createRadioBoxForCheckBoxs(choupaiList,this.radioBoxSelectCB);
        this.addListenerText(choupaiList,this._playNode_choupai_radio);
        this.choupaiList = choupaiList;

        this.play_haidijiafen = _play.getChildByName("play_haidijiafen");
        this.addListenerText(this.play_haidijiafen);
        this.play_haidijiafen.addEventListener(this.clickCB, this.play_haidijiafen);

        this.play_xiaohukeqianggang = _play.getChildByName("play_xiaohukeqianggang");
        this.addListenerText(this.play_xiaohukeqianggang);
        this.play_xiaohukeqianggang.addEventListener(this.clickCB, this.play_xiaohukeqianggang);
/*
        this.play_jiangjianghu = _play.getChildByName("play_jiangjianghu");
        this.addListenerText(this.play_jiangjianghu);
        this.play_jiangjianghu.addEventListener(this.clickCB, this.play_jiangjianghu);*/

        this.play_gangshanghuajiafen = _play.getChildByName("play_gangshanghuajiafen");
        this.addListenerText(this.play_gangshanghuajiafen);
        this.play_gangshanghuajiafen.addEventListener(this.clickCB, this.play_gangshanghuajiafen);

        

        this._zhuIdx = 1;
        this._ZhuNum = _bgYJNode.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bgYJNode.getParent().getChildByName("btn_sub");
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
            this._Button_add = _bgYJNode.getParent().getChildByName("btn_add");
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

        var that = this;
        this._playNode_maxPlayer2.schedule(function() {
            if(that._playNode_maxPlayer2.isSelected())
            {
                that.buchoupai.visible = true;
                that.choupai1.visible = true;
            }
            else
            {
                that.buchoupai.visible = false;
                that.choupai1.visible = false;
            }
        })

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

        var _zhuaniao;
        if (isClub)
            _zhuaniao = [1,2].indexOf(this.getNumberItem("zhuaniao", 0)); 
        else
            _zhuaniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_zhuaniao, 0);
        this._playNode_zhuaniao_radio.selectItem(_zhuaniao);
        this.radioBoxSelectCB(_zhuaniao, this.zhuaniaoList[_zhuaniao], this.zhuaniaoList);

        var _zhongniao;
        if (isClub)
            _zhongniao = this.getNumberItem("zhongniao", 0);
        else
            _zhongniao = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_zhongniao, 0);
        this._playNode_zhongniao_radio.selectItem(_zhongniao);
        this.radioBoxSelectCB(_zhongniao, this.zhongniaoList[_zhongniao], this.zhongniaoList);

        var _xiaohukeqianggang;
        if (isClub)
            _xiaohukeqianggang = this.getBoolItem("xiaohukeqianggang", false);
        else
            _xiaohukeqianggang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_nanxian_xiaohukeqianggang, false);
        this.play_xiaohukeqianggang.setSelected(_xiaohukeqianggang);
        var text = this.play_xiaohukeqianggang.getChildByName("text");
        this.selectedCB(text, _xiaohukeqianggang)

        var _haidijiafen;
        if (isClub)
            _haidijiafen = this.getBoolItem("haidijiafen", true);
        else
            _haidijiafen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_nanxian_haidijiafen, true);
        this.play_haidijiafen.setSelected(_haidijiafen);
        var text = this.play_haidijiafen.getChildByName("text");
        this.selectedCB(text, _haidijiafen)

        var _choupai;
        if (isClub)
            _choupai = this.getNumberItem("choupai", 0);
        else
            _choupai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_choupai, 0);
        this._playNode_choupai_radio.selectItem(_choupai);
        this.radioBoxSelectCB(_choupai, this.choupaiList[_choupai], this.choupaiList);
/*
        var _jiangjianghu;
        if (isClub)
            _jiangjianghu = this.getBoolItem("jiangjianghu", false);
        else
            _jiangjianghu = util.play_guohuzimo.getBoolItem(this.localStorageKey.KEY_nanxian_jiangjianghu, false);
        this.play_jiangjianghu.setSelected(_jiangjianghu);
        var text = this.play_jiangjianghu.getChildByName("text");
        this.selectedCB(text, _jiangjianghu)*/

        var _gangshanghuajiafen;
        if (isClub)
            _gangshanghuajiafen = this.getBoolItem("gangshanghuajiafen", true);
        else
            _gangshanghuajiafen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_nanxian_gangshanghuajiafen, true);
        this.play_gangshanghuajiafen.setSelected(_gangshanghuajiafen);
        var text = this.play_gangshanghuajiafen.getChildByName("text");
        this.selectedCB(text, _gangshanghuajiafen)

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);
/*
        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_choupai, 0);
        this._playNode_choupaiType_0.setSelected(false);
        this._playNode_choupaiType_1.setSelected(false);
        this._playNode_choupaiType_2.setSelected(false);
        this._playNode_choupaiType_3.setSelected(false);
        var index = 0;
        if (_trustTime == 0) {
            this._playNode_choupaiType_0.setSelected(true);
            index = 0;
        } else if (_trustTime == 60) {
            this._playNode_choupaiType_1.setSelected(true);
            index = 1;
        } else if (_trustTime == 120) {
            this._playNode_choupaiType_2.setSelected(true);
            index = 2;
        } else if (_trustTime == 180) {
            this._playNode_choupaiType_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index, this.choupaiNodeList[index], this.choupaiNodeList);*/

        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_difen, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        var isOpenTingTip;
        if (isClub)
            isOpenTingTip = this.getBoolItem("isOpenTingTip", true);
        else
            isOpenTingTip = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_nanxian_isOpenTingTip, true);
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
                fanBeiOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_fanbei, 0);
                fanBeiScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_nanxian_fanbeiscore, 10);
            }
            this.fanbei_radio.selectItem(fanBeiOption)
            this.nodeListFanBei[1].getChildByName("score").setString(fanBeiScore + "分");
            this.fanBeiRadioBoxSelectCB(fanBeiOption, this.nodeListFanBei[fanBeiOption], this.nodeListFanBei);
        }

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.NAN_XIAN_MJ;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 1;//1 : 抓1鸟 2： 抓2鸟
        para.zhongniao = 0;// 0: 飞鸟 1: 平鸟
        para.xiaohukeqianggang = false;//小胡可抢杠胡
        para.haidijiafen = false; //海底捞加两分
        para.gangshanghuajiafen = false; //杠上开花加两分
        para.difen = this._zhuIdx;
        para.convertible = false;//是否自由人数
/*        para.trustTime = 0;//托管*/
        para.choupai = 0;//0:不抽牌  1: 抽一门

        var zhongniaoindex;
        if (this.play_zhongniao1.isSelected()) {
            zhongniaoindex = 0;
            para.zhongniao = 0;
        } else if (this.play_zhongniao2.isSelected()) {
            zhongniaoindex = 1;
            para.zhongniao = 1;
        }

        var zhuaniaoindex;
        if (this.play_zhuaniao1.isSelected()) {
            zhuaniaoindex = 0;
            para.zhuaniao = 1;
        } else if (this.play_zhuaniao2.isSelected()) {
            zhuaniaoindex = 1;
            para.zhuaniao = 2;
        }

        var _choupai;
        if (this.buchoupai.isSelected()) {
            _choupai = 0;
            para.choupai = 0;
        } else if (this.choupai1.isSelected()) {
            _choupai = 1;
            para.choupai = 1;
        }

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

        para.haidijiafen = this.play_haidijiafen.isSelected(); //
        para.xiaohukeqianggang = this.play_xiaohukeqianggang.isSelected(); //
        //para.jiangjianghu = this.play_jiangjianghu.isSelected();
        para.gangshanghuajiafen = this.play_gangshanghuajiafen.isSelected();

        if (!this._playNode_maxPlayer2.isSelected()) 
        {
            para.choupai = 0;
        }

        if (this.fanbei_radio) {
            para.fanBeiScore = parseInt(this.nodeListFanBei[1].getChildByName("score").getString());
            para.fanBei = this.fanbei_radio.getSelectIndex();
        }

        para.isOpenTingTip = this.tingTipList[0].isSelected();

        
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_zhuaniao, zhuaniaoindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_nanxian_haidijiafen, para.haidijiafen);
            //util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_nanxian_jiangjianghu, para.jiangjianghu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_nanxian_gangshanghuajiafen, para.gangshanghuajiafen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_zhongniao, zhongniaoindex);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_nanxian_xiaohukeqianggang, para.xiaohukeqianggang);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_difen, para.difen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_count, _countIdx)
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_choupai, _choupai)
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_nanxian_isOpenTingTip, para.isOpenTingTip);
             // 大结算翻倍
            if (this.fanbei_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_fanbei, para.fanBei);
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_nanxian_fanbeiscore, para.fanBeiScore);
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